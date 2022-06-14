import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  SendOptions,
  Signer,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import * as fs from 'fs'
import * as anchor from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import { web3 } from '@project-serum/anchor'
import {
  CreateAssociatedTokenAccount,
  Metadata,
  TokenAccount,
} from '@metaplex/js'
import axios from 'axios'
import * as nacl from 'tweetnacl'
import config, { connection, ENV, getBaseUrl } from '../config/config'
import { NftMetadata } from './nftmetaData.type'
import asyncBatch from 'async-batch'
import { fetchHashTable } from './useHashTable'
import { collections } from '../config/collectonsConfig'
import _ from 'lodash'
import reattempt from 'reattempt'

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

export async function getOrCreateAssociatedTokenAddressInstruction(
  mint: PublicKey,
  owner: PublicKey,
  connection: anchor.web3.Connection,
  payer?: PublicKey
) {
  const address = await getAssociatedTokenAddress(mint, owner)

  const tokenAccount = await connection.getAccountInfo(address)

  let instructions: web3.TransactionInstruction[] = []
  if (!tokenAccount) {
    instructions.push(
      spl.Token.createAssociatedTokenAccountInstruction(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        spl.TOKEN_PROGRAM_ID,
        mint,
        address,
        owner,
        payer ?? owner
      )
    )
  }

  return {
    address,
    instructions,
  }
}

export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
) {
  return await spl.Token.getAssociatedTokenAddress(
    spl.ASSOCIATED_TOKEN_PROGRAM_ID,
    spl.TOKEN_PROGRAM_ID,
    mint,
    owner
  )
}

export async function getTokenAccount(
  connection: Connection,
  mint: PublicKey,
  user: PublicKey
) {
  const userTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    user,
    {
      mint: mint,
    }
  )

  if (userTokenAccounts.value.length === 0) return null
  return (
    userTokenAccounts.value.find(
      (t) => t.account.data.parsed.info.tokenAmount.uiAmount
    ) ?? userTokenAccounts.value[0]
  )
}

export async function getTokenAccountAdressOrCreateTokenAccountInstruction({
  connection,
  mint,
  user,
}: {
  connection: Connection
  mint: PublicKey
  user: PublicKey
}) {
  const userTokenAccount = await getTokenAccount(connection, mint, user)

  if (userTokenAccount)
    return {
      address: userTokenAccount.pubkey,
      instructions: [],
    }

  return await getOrCreateAssociatedTokenAddressInstruction(
    mint,
    user,
    connection
  )
}

export async function getNftWithMetadata(mint: PublicKey) {
  let [pda] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      new anchor.web3.PublicKey(mint).toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )
  const accountInfo: any = await connection.getParsedAccountInfo(pda)

  const chainMetadata = new Metadata(mint.toString(), accountInfo.value)

  const baseUrl = getBaseUrl()

  const metadataRes = await axios.get(baseUrl + '/api/prox', {
    params: {
      uri: chainMetadata.data.data.uri,
    },
  })

  return {
    ...chainMetadata,
    ...metadataRes.data,
    /* creators: chainMetadata.data.data.creators, */
  } as NftMetadata
}

const fourRoles = ['Businessman', 'Farmer', 'Scientist', 'Artist']
const sealz = '420 Sealz'
const chimpion = 'Chimpion'

const roleRewards = [
  {
    dailyReward: 8,
  },
]

const secondsPerDay = 86400

export function getRewardInfoForRole(role: string) {
  return {
    dailyReward: 8,
    rewardPerSecond: 8 / secondsPerDay,
  }
}

export enum Role {
  Chimpion = 1,
  FourRoles = 2,
  Sealz = 3,
  OneOutOfOne = 4,
}

export async function getRoleOfNft(
  nft: PublicKey,
  user: PublicKey,
  connection: Connection
) {
  const nftMetadata = await getNftWithMetadata(nft)

  const role = (nftMetadata as any)?.attributes?.find(
    (a: any) => a.trait_type === 'Role'
  ).value! as string

  const fourRoles = ['Businessman', 'Farmer', 'Scientist', 'Artist']
  const sealz = '420 Sealz'
  const chimpion = 'Chimpion'

  if (role === chimpion) return Role.Chimpion
  if (fourRoles.includes(role)) return Role.FourRoles
  if (role === sealz) return Role.Sealz
  return Role.OneOutOfOne
}

export async function getRawRoleOfNft(
  nft: PublicKey,
  user: PublicKey,
  connection: Connection
) {
  const nftMetadata = await getNftWithMetadata(nft)

  const role = (nftMetadata as any)?.attributes?.find(
    (a: any) => a.trait_type === 'Role'
  ).value! as string

  return role
}

export function verifySignature(
  address: string,
  signature: number[],
  message: string
) {
  const wallet = new web3.PublicKey(address)
  const encodedMessage = new TextEncoder().encode(message)

  const res = nacl.sign.detached.verify(
    encodedMessage,
    Uint8Array.from(signature),
    wallet.toBytes()
  )

  return res
}

export async function handleTransaction(
  tx: string,
  opts: {
    showLogs: boolean
  } = {
    showLogs: false,
  }
) {
  await connection.confirmTransaction(tx)
  const trans = await connection.getTransaction(tx)
  if (!trans) {
    console.log('transaction not found', trans)

    return tx
  }

  if (opts?.showLogs) {
    console.log('trans logs', trans?.meta?.logMessages)
  }
  return tx
}

export async function getNFTsForOwner({
  connection,
  ownerAddress,
  allMints,
}: {
  connection: anchor.web3.Connection
  ownerAddress: anchor.web3.PublicKey
  allMints?: string[]
}) {
  console.log('hola')

  const allMintsCandyMachine =
    ENV != 'dev'
      ? require('../assets/mints/sac-mints.json')
      : require('../assets/mints/devMints.json') /* await fetchHashTable(config.candyMachineId) */
  const allTokens = []
  let tokenAccounts = (
    await connection.getParsedTokenAccountsByOwner(ownerAddress, {
      programId: spl.TOKEN_PROGRAM_ID,
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

        const nftMetadata = await getNftWithMetadata(
          new anchor.web3.PublicKey(tokenAccount.account.data.parsed.info.mint)
        )
        return nftMetadata
      },
      3
    )
  ).filter((n) => !!n)

  return nfts
}

export function findCollectionConfig(nft: NftMetadata) {
  return collections.find((c) => {
    return nft.data.data.creators.find(
      (creator) => c.creators.includes(creator.address) && creator.verified
    )
  })
}

export function pub(pubkey: string) {
  return new PublicKey(pubkey.trim())
}

export function getSolAdressFromText(tweet: string) {
  const adresses = tweet.match(/(\b[a-zA-Z0-9]{32,44}\b)/g)
  return adresses && adresses?.length > 0 ? adresses[0] : null
}

export function getSolscanTxLink(tx: string) {
  return `https://solscan.io/tx/${tx}?cluster=${config.solanaEnv}`
}

export function loadWallet(data: string) {
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(data)))
}

export function loadWalletFromFile(path: string) {
  if (!fs.existsSync(path)) throw new Error(`file ${path} does not exist`)
  return loadWallet(fs.readFileSync(path, 'utf-8'))
}

export async function sendTransaction(args: {
  instructions: TransactionInstruction[]
  signers: Signer[]
  feePayer?: PublicKey
  log?: boolean
  opts?: SendOptions
}) {
  const blockHash = await ((connection as any).getLatestBlockhashAndContext
    ? connection.getLatestBlockhash()
    : connection.getRecentBlockhash())
  const transaction = new Transaction({
    recentBlockhash: blockHash.blockhash,
    feePayer: args.feePayer,
  }).add(...args.instructions)

  await transaction.sign(...args.signers)

  const tx = await connection.sendRawTransaction(
    transaction.serialize({ verifySignatures: false }),
    args.opts
  )

  if (args.log) console.log(`sent transaction ${tx}`)

  return tx
}

export async function sendAndConfirmTransaction(args: {
  instructions: TransactionInstruction[]
  signers: Signer[]
  feePayer?: PublicKey
  commitment?: Commitment
  log?: boolean
  opts?: SendOptions
}) {
  const { commitment = 'confirmed', log = false } = args
  const tx = await sendTransaction(args)

  await reattempt.run({ times: 3 }, async () => {
    await connection.confirmTransaction(tx, commitment)
  })

  if (log) console.log(`confirmed transaction ${tx}`)

  return tx
}

export async function getLatestBlockhash() {
  // return connection.getRecentBlockhash()
  return await ((connection as any).getLatestBlockhashAndContext
    ? connection.getLatestBlockhash()
    : connection.getRecentBlockhash())
}
