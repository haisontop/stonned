import * as anchor from '@project-serum/anchor'
import { Metadata } from '@metaplex/js'

import { MintLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import { sendTransactions, sleep } from './utils'
import { fetchHashTable } from './useHashTable'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import axios from 'axios'
import asyncBatch from 'async-batch'
import config, { CANDY_MACHINE_ID, ENV, getBaseUrl } from '../config/config'
import { collections } from '../config/collectonsConfig'
import _ from 'lodash'

export const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
  'cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ'
)

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

export interface CandyMachine {
  id: anchor.web3.PublicKey
  connection: anchor.web3.Connection
  program: anchor.Program
}

interface CandyMachineState {
  candyMachine: CandyMachine
  itemsAvailable: number
  itemsRedeemed: number
  itemsRemaining: number
  goLiveDate: Date
}

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  timeout: number,
  connection: anchor.web3.Connection,
  commitment: anchor.web3.Commitment = 'recent',
  queryStatus = false
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let done = false
  let status: anchor.web3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  }
  let subId = 0
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return
      }
      done = true
      console.log('Rejecting for timeout...')
      reject({ timeout: true })
    }, timeout)
    try {
      subId = connection.onSignature(
        txid,
        (result: any, context: any) => {
          done = true
          status = {
            err: result.err,
            slot: context.slot,
            confirmations: 0,
          }
          if (result.err) {
            console.log('Rejected via websocket', result.err)
            reject(status)
          } else {
            console.log('Resolved via websocket', result)
            resolve(status)
          }
        },
        commitment
      )
    } catch (e) {
      done = true
      console.error('WS error in setup', txid, e)
    }
    while (!done && queryStatus) {
      ;(async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ])
          status = signatureStatuses && signatureStatuses.value[0]
          if (!done) {
            if (!status) {
              console.log('REST null result for', txid, status)
            } else if (status.err) {
              console.log('REST error for', txid, status)
              done = true
              reject(status.err)
            } else if (!status.confirmations) {
              console.log('REST no confirmations for', txid, status)
            } else {
              console.log('REST confirmation for', txid, status)
              done = true
              resolve(status)
            }
          }
        } catch (e) {
          if (!done) {
            console.log('REST connection error: txid', txid, e)
          }
        }
      })()
      await sleep(2000)
    }
  })

  //@ts-ignore
  if (connection._signatureSubscriptions[subId]) {
    connection.removeSignatureListener(subId)
  }
  done = true
  console.log('Returning status', status)
  return status
}

const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ]
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  })
}

export const getCandyMachineState = async (
  anchorWallet: anchor.Wallet,
  candyMachineId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection
): Promise<CandyMachineState> => {
  const provider = new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: 'recent',
  })

  const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider)

  if (idl) {
    const program = new anchor.Program(idl, CANDY_MACHINE_PROGRAM, provider)
    const candyMachine = {
      id: candyMachineId,
      connection,
      program,
    }
    const state: any = await program.account.candyMachine.fetch(candyMachineId)
    const itemsAvailable = state.data.itemsAvailable.toNumber()
    const itemsRedeemed = state.itemsRedeemed.toNumber()
    const itemsRemaining = itemsAvailable - itemsRedeemed

    let goLiveDate = state.data.goLiveDate.toNumber()
    goLiveDate = new Date(goLiveDate * 1000)

    console.log('goLiveDate', goLiveDate)

    return {
      candyMachine,
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      goLiveDate,
    }
  } else {
    throw new Error(`Fetching idl returned null: check CANDY_MACHINE_PROGRAM`)
  }
}

const getMasterEdition = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

const getTokenWallet = async (
  wallet: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey
) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0]
}

export async function getNFTsForOwnerOld({
  connection,
  ownerAddress,
  allMints,
  filterCollection,
}: {
  connection: anchor.web3.Connection
  ownerAddress: anchor.web3.PublicKey
  allMints?: string[]
  filterCollection?: string[]
}) {
  let tokenAccounts = (
    await connection.getParsedTokenAccountsByOwner(ownerAddress, {
      programId: TOKEN_PROGRAM_ID,
    })
  ).value

  tokenAccounts = tokenAccounts.filter((tokenAccount) => {
    const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount

    return tokenAmount.amount == '1' && tokenAmount.decimals == '0'
  })

  const nfts = (
    await asyncBatch(
      tokenAccounts,
      async (tokenAccount, index, workerIndex) => {
        let [pda] = await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            new anchor.web3.PublicKey(
              tokenAccount.account.data.parsed.info.mint
            ).toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
        const accountInfo: any = await connection.getParsedAccountInfo(pda)

        try {
          const metadata = new Metadata(
            ownerAddress.toString(),
            accountInfo.value
          )

          if (
            !metadata.data.data.creators?.find((creator) =>
              collections.find((collection) =>
                collection.creators.includes(creator.address)
              )
            )
          )
            return null

          const dataRes = await axios.get(getBaseUrl() + '/api/prox', {
            params: {
              uri: metadata.data.data.uri,
            },
          })
          if (dataRes.status !== 200) return false
          return {
            ...dataRes.data,
            mint: tokenAccount.account.data.parsed.info.mint,
            metaUri: metadata.data.data.uri,
          }
        } catch (e) {
          return null
        }
      },
      3
    )
  ).filter((n) => !!n)

  return nfts
}

export async function getNFTsForOwnerOld1(
  connection: anchor.web3.Connection,
  ownerAddress: anchor.web3.PublicKey,
  allMints?: string[]
) {
  console.log('hola')

  const allMintsCandyMachine =
    ENV != 'dev'
      ? _.flatten(
          collections.map((c) =>
            require(`../assets/mints/${c.mintsFilename}.json`)
          )
        )
      : require('../assets/mints/devMints.json') /* await fetchHashTable(config.candyMachineId) */
  const allTokens = []
  let tokenAccounts = (
    await connection.getParsedTokenAccountsByOwner(ownerAddress, {
      programId: TOKEN_PROGRAM_ID,
    })
  ).value

  tokenAccounts = tokenAccounts.filter((tokenAccount) => {
    const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount

    return (
      tokenAmount.amount == '1' &&
      tokenAmount.decimals == '0' &&
      allMintsCandyMachine.includes(tokenAccount.account.data.parsed.info.mint)
    )
  })

  const nfts = (
    await asyncBatch(
      tokenAccounts,
      async (tokenAccount, index, workerIndex) => {
        let [pda] = await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            new anchor.web3.PublicKey(
              tokenAccount.account.data.parsed.info.mint
            ).toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
        const accountInfo: any = await connection.getParsedAccountInfo(pda)

        const metadata = new Metadata(
          ownerAddress.toString(),
          accountInfo.value
        )
        const dataRes = await axios.get(metadata.data.data.uri)
        if (dataRes.status !== 200) return false
        return {
          ...dataRes.data,
          mint: tokenAccount.account.data.parsed.info.mint,
        }
      },
      1
    )
  ).filter((n) => !!n)

  return nfts
}

export const mintOneToken = async (
  candyMachine: CandyMachine,
  config: anchor.web3.PublicKey, // feels like this should be part of candyMachine?
  payer: anchor.web3.PublicKey,
  treasury: anchor.web3.PublicKey
): Promise<string> => {
  const mint = anchor.web3.Keypair.generate()
  const token = await getTokenWallet(payer, mint.publicKey)
  const { connection, program } = candyMachine
  const metadata = await getMetadata(mint.publicKey)
  const masterEdition = await getMasterEdition(mint.publicKey)

  const rent = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  )

  return await program.rpc.mintNft({
    accounts: {
      config,
      candyMachine: candyMachine.id,
      payer: payer,
      wallet: treasury,
      mint: mint.publicKey,
      metadata,
      masterEdition,
      mintAuthority: payer,
      updateAuthority: payer,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    },
    signers: [mint],
    instructions: [
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports: rent,
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0,
        payer,
        payer
      ),
      createAssociatedTokenAccountInstruction(
        token,
        payer,
        payer,
        mint.publicKey
      ),
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        token,
        payer,
        [],
        1
      ),
    ],
  })
}

export const mintMultipleToken = async (
  candyMachine: any,
  config: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  treasury: anchor.web3.PublicKey,
  quantity: number = 2
) => {
  const signersMatrix = []
  const instructionsMatrix = []

  for (let index = 0; index < quantity; index++) {
    const mint = anchor.web3.Keypair.generate()
    const token = await getTokenWallet(payer, mint.publicKey)
    const { connection } = candyMachine
    const rent = await connection.getMinimumBalanceForRentExemption(
      MintLayout.span
    )
    const instructions = [
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports: rent,
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0,
        payer,
        payer
      ),
      createAssociatedTokenAccountInstruction(
        token,
        payer,
        payer,
        mint.publicKey
      ),
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        token,
        payer,
        [],
        1
      ),
    ]
    const masterEdition = await getMasterEdition(mint.publicKey)
    const metadata = await getMetadata(mint.publicKey)

    instructions.push(
      await candyMachine.program.instruction.mintNft({
        accounts: {
          config,
          candyMachine: candyMachine.id,
          payer: payer,
          wallet: treasury,
          mint: mint.publicKey,
          metadata,
          masterEdition,
          mintAuthority: payer,
          updateAuthority: payer,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        },
      })
    )
    const signers: anchor.web3.Keypair[] = [mint]

    signersMatrix.push(signers)
    instructionsMatrix.push(instructions)
  }

  return await sendTransactions(
    candyMachine.program.provider.connection,
    candyMachine.program.provider.wallet,
    instructionsMatrix,
    signersMatrix
  )
}

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export async function loadCandyProgram(
  walletKeyPair: Keypair,
  env: string,
  customRpcUrl?: string
) {
  if (customRpcUrl) console.log('USING CUSTOM URL', customRpcUrl)

  // @ts-ignore
  const solConnection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || web3.clusterApiUrl(env)
  )

  const walletWrapper = new anchor.Wallet(walletKeyPair)
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  })
  const idl = await anchor.Program.fetchIdl(
    CANDY_MACHINE_PROGRAM.toString(),
    provider
  )
  if (!idl) {
    console.log('No IDL found')
    return
  }
  const program = new anchor.Program(
    idl,
    CANDY_MACHINE_PROGRAM.toString(),
    provider
  )
  return program
}
