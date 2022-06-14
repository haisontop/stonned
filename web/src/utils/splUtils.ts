import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { web3 } from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import { Metadata, TokenAccount } from '@metaplex/js'
import config, { connection } from '../config/config'
import { ParsedTokenAccount } from './types'
import { getNftWithMetadata, getTokenAccount, pub } from './solUtils'
import asyncBatch from 'async-batch'
import { NftMetadata } from './nftmetaData.type'
import prisma from '../lib/prisma'

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

export function buildToken(mint: PublicKey) {
  return new spl.Token(connection, mint, spl.TOKEN_PROGRAM_ID, {} as any)
}

export async function getTokenAccountsForOwner(
  owner: PublicKey,
  args?: {
    commitment?: web3.Commitment
    withAmount?: boolean
  }
) {
  const parsedTokenAccountsRes = await connection.getParsedTokenAccountsByOwner(
    owner,
    {
      programId: spl.TOKEN_PROGRAM_ID,
    },
    args?.commitment ?? 'recent'
  )

  const tokenAccounts = parsedTokenAccountsRes.value as ParsedTokenAccount[]

  if (args?.withAmount) {
    return tokenAccounts.filter((t) => {
      return t.account.data.parsed.info.tokenAmount.uiAmount > 0
    })
  }

  return tokenAccounts as ParsedTokenAccount[]
}

export async function createTransferInstruction(args: {
  mint: PublicKey
  from: PublicKey
  to: PublicKey
  amount: number
  payer?: PublicKey
  signers?: Keypair[]
}) {
  const sourceTokenAccount = (await getTokenAccount(
    connection,
    args.mint,
    args.from
  ))!

  if (!sourceTokenAccount)
    throw new Error('You miss funds of ' + args.mint.toBase58())

  const destTokenAccount = await getTokenAccount(connection, args.mint, args.to)

  const instructions: TransactionInstruction[] = []

  let createdDestTokenAccountAddress: PublicKey | undefined
  if (!destTokenAccount) {
    createdDestTokenAccountAddress = await spl.Token.getAssociatedTokenAddress(
      spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      spl.TOKEN_PROGRAM_ID,
      args.mint,
      args.to
    )
    instructions.push(
      spl.Token.createAssociatedTokenAccountInstruction(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        spl.TOKEN_PROGRAM_ID,
        args.mint,
        createdDestTokenAccountAddress,
        args.to,
        args.payer ?? args.from
      )
    )
  }

  instructions.push(
    spl.Token.createTransferInstruction(
      spl.TOKEN_PROGRAM_ID,
      sourceTokenAccount?.pubkey,
      destTokenAccount?.pubkey ?? createdDestTokenAccountAddress!,
      args.from,
      args.signers ?? [],
      args.amount
    )
  )

  return instructions
}

export async function getMetadataForMint(mint: string) {
  const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  )
  let [pda] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      new web3.PublicKey(mint).toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )
  const accountInfo = await connection.getParsedAccountInfo(pda)

  const metadata = new Metadata(
    accountInfo.value?.owner as any,
    accountInfo.value as any
  )
  return metadata.data
}

export async function getTokenAccountForNft(mint: PublicKey) {
  const tokenAccounts = await connection.getTokenLargestAccounts(mint)

  const largestTokenAccount = tokenAccounts.value.find((t) => t.uiAmount)!

  if (!largestTokenAccount) return null

  const tokenAccount = (await TokenAccount.load(
    connection,
    largestTokenAccount.address
  ))!

  return tokenAccount
}

export async function getTokenAccountForNftOld(mint: PublicKey) {
  const tokenAccounts = await connection.getTokenLargestAccounts(mint)

  const largestTokenAccount = tokenAccounts.value.find((t) => t.uiAmount)!

  const tokenAccount = await connection.getParsedAccountInfo(
    largestTokenAccount.address
  )

  return tokenAccount
}

export async function getNftsFromOwnerByCreators(args: {
  owner: PublicKey
  creators: PublicKey[]
  withAmount?: boolean
}) {
  const nftTokenAccounts = await getTokenAccountsForOwner(args.owner, {
    withAmount: args.withAmount ?? true,
    commitment: 'confirmed',
  })

  const nfts: {
    nft: NftMetadata
    tokenAccount: ParsedTokenAccount
  }[] = []

  await asyncBatch(
    nftTokenAccounts,
    async (nftTokenAccount) => {
      try {
        const nft = new PublicKey(nftTokenAccount.account.data.parsed.info.mint)

        if (nftTokenAccount.account.data.parsed.info.tokenAmount.decimals !== 0)
          return

        const metadata = await Metadata.load(
          connection,
          await Metadata.getPDA(nft)
        )

        if (
          metadata.data.data.creators?.find((c) =>
            args.creators.find((sc) => sc.toBase58() === c.address)
          )
        ) {
          const nftMetadata = await getNftWithMetadata(
            new anchor.web3.PublicKey(
              nftTokenAccount.account.data.parsed.info.mint
            )
          )

          nfts.push({
            nft: nftMetadata,
            tokenAccount: nftTokenAccount,
          })
        }
      } catch (error) {
        /* console.info('error in loading nft', error) */
      }
    },
    10
  )

  return nfts
}

export async function getNftsFromOwnerByCreatorsWithoutOfChainMeta(args: {
  owner: PublicKey
  creators: PublicKey[]
  withAmount?: boolean
}) {
  const nftTokenAccounts = await getTokenAccountsForOwner(args.owner, {
    withAmount: args.withAmount ?? true,
    commitment: 'confirmed',
  })

  const nfts: {
    metadata: Metadata
    tokenAccount: ParsedTokenAccount
    mint: PublicKey
  }[] = []

  await asyncBatch(
    nftTokenAccounts,
    async (nftTokenAccount) => {
      try {
        const nft = new PublicKey(nftTokenAccount.account.data.parsed.info.mint)

        if (nftTokenAccount.account.data.parsed.info.tokenAmount.decimals !== 0)
          return

        const metadata = await Metadata.load(
          connection,
          await Metadata.getPDA(nft)
        )

        if (
          metadata.data.data.creators?.find((c) =>
            args.creators.find((sc) => sc.toBase58() === c.address)
          )
        ) {
          nfts.push({
            mint: pub(metadata.data.mint),
            metadata,
            tokenAccount: nftTokenAccount,
          })
        }
      } catch (error) {
        /*  console.error(
          'error at fetching nft',
          nftTokenAccount.account.data.parsed.info.mint,
          error.message
        ) */
      }
    },
    10
  )

  return nfts
}

export async function getNftWithTokenAccount(args: {
  user: PublicKey
  nft: PublicKey
  withAmount?: boolean
  commitment?: Commitment
}) {
  const { withAmount = true } = args
  const tokenAccounts = await (args.commitment
    ? new Connection(config.rpcHost, args.commitment)
    : connection
  ).getParsedTokenAccountsByOwner(args.user, { mint: args.nft })

  if (tokenAccounts.value.length == 0) return null

  const tokenAccount = tokenAccounts.value.sort(
    (a, b) =>
      b.account.data.parsed.info.tokenAmount.uiAmount -
      a.account.data.parsed.info.tokenAmount.uiAmount
  )[0] as ParsedTokenAccount

  if (withAmount && !tokenAccount.account.data.parsed.info.tokenAmount.uiAmount)
    return null

  const nft = await getNftWithMetadata(args.nft)

  return { tokenAccount, nft }
}

export async function getNfts(mints: PublicKey[]) {
  const nfts: NftMetadata[] = []

  await asyncBatch(
    mints,
    async (mint) => {
      try {
        const nft = await getNftWithMetadata(mint)
        nfts.push(nft)
      } catch (error) {
        console.log('error', error)
      }
    },
    10
  )

  return nfts
}

export async function getNftsFromOwnerByMints(args: {
  owner: PublicKey
  mints: PublicKey[]
  withAmount?: boolean
}) {
  const nfts: {
    nft: NftMetadata
    tokenAccount: ParsedTokenAccount
  }[] = []

  await asyncBatch(
    args.mints,
    async (mint) => {
      try {
        const nftWithTokenAccount = await getNftWithTokenAccount({
          user: args.owner,
          nft: mint,
        })
        if (nftWithTokenAccount) nfts.push(nftWithTokenAccount)
      } catch (error) {
        console.log('error', error)
      }
    },
    10
  )

  return nfts
}

export async function getTokenBalance(mint: PublicKey, user: PublicKey) {
  const tokenAccount = await getTokenAccount(connection, mint, user)

  if (!tokenAccount) return null

  const balance = await connection.getTokenAccountBalance(tokenAccount?.pubkey)
  return balance.value.uiAmount
}
