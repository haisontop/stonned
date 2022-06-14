import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Signer,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
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
import { ParsedTokenAccount } from './types'
import * as fs from 'fs'
import reattempt from 'reattempt'
import { ifElse } from 'ramda'

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
  return (userTokenAccounts.value.find(
    (t) => t.account.data.parsed.info.tokenAmount.uiAmount
  ) ?? userTokenAccounts.value[0]) as ParsedTokenAccount
}

export async function getTokenAccountAdressOrCreateTokenAccountInstruction({
  connection,
  mint,
  user,
  payer,
}: {
  connection: Connection
  mint: PublicKey
  user: PublicKey
  payer?: PublicKey
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
    connection,
    payer
  )
}

export async function getNftWithMetadata(
  mint: PublicKey,
  _metadata?: Metadata
) {
  const chainMetadata =
    _metadata ??
    (await (async () => {
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

      return chainMetadata
    })())

  const baseUrl = getBaseUrl()

  const metadataRes = true
    ? await axios.get(baseUrl + '/api/prox', {
        params: {
          uri: chainMetadata.data.data.uri,
        },
      })
    : await axios.get(chainMetadata.data.data.uri)

  /*  let uri = chainMetadata.data.data.uri.replace(
    'https://ipfs.io',
    'https://cloudflare-ipfs.com'
  )

  const metadataRes = await axios.get(uri) */

  return { ...chainMetadata, ...metadataRes.data } as NftMetadata
}

export async function getNftWithMetadataNew(mint: PublicKey) {
  const chainMetadata = await Metadata.load(
    connection,
    await Metadata.getPDA(mint)
  )

  const metadataRes = await axios.get(chainMetadata.data.data.uri)

  return { ...chainMetadata, ...metadataRes.data } as NftMetadata
}

const fourRoles = ['Businessman', 'Farmer', 'Scientist', 'Artist']
const sealz = '420 Sealz'
const chimpion = 'Chimpion'

const roleRewards = [
  {
    roles: ['Chimpion'],
    dailyReward: 15,
  },
  {
    roles: ['Businessman', 'Farmer', 'Scientist', 'Artist'],
    dailyReward: 30,
  },
  {
    roles: ['420 Sealz'],
    dailyReward: 142,
  },
  {
    dailyReward: 169,
  },
]

const secondsPerDay = 86400

export function getRewardInfoForRole(role: string) {
  const rewardInfo =
    roleRewards.find((r) => r.roles?.find((r) => r === role)) ??
    roleRewards.find((r) => !r.roles)!

  return {
    ...rewardInfo,
    rewardPerSecond: rewardInfo?.dailyReward / secondsPerDay,
  }
}

export async function getAwakeningCost(
  nft: PublicKey,
  magicJMetadata: NftMetadata
) {
  const collection = await findCollectionConfig(nft)!
  const awakeningCost = collection
    ? await collection.getAwakeningCostAsync(nft)
    : { puff: 100000, all: 500000 }

  const type = (magicJMetadata as any)?.attributes?.find(
    (a: any) => a.trait_type === 'Type'
  )?.value! as string

  const discount =
    type === 'Type I'
      ? 4.2
      : type === 'Type II'
      ? 15
      : type === 'Type III'
      ? 42
      : 4.2
  const remaining = (100 - discount) / 100

  return {
    puff: Math.ceil(awakeningCost.puff * remaining),
    all: Math.ceil(awakeningCost.all * remaining),
  }
}

export function getAwakeningCostForMetadata(
  nft: NftMetadata,
  magicJMetadata: NftMetadata
) {
  const collection = getCollectionByMetadata(nft)!
  const awakeningCost = collection
    ? collection.getAwakeningCost(nft)
    : { puff: 100000, all: 500000 }

  const type = (magicJMetadata as any)?.attributes?.find(
    (a: any) => a.trait_type === 'Type'
  )?.value! as string

  const discount =
    type === 'Type I'
      ? 4.2
      : type === 'Type II'
      ? 15
      : type === 'Type III'
      ? 42
      : 4.2
  const remaining = (100 - discount) / 100

  return {
    puff: Math.ceil(awakeningCost.puff * remaining),
    all: Math.ceil(awakeningCost.all * remaining),
  }
}

export async function getRewardForNft(nft: PublicKey) {
  const collection = await findCollectionConfig(nft)!

  const reward = collection ? await collection.getReward(nft) : 0
  console.log('reward', reward)

  return {
    daily: reward,
    perSecond: reward / secondsPerDay,
  }
}

export async function getAllReward(nft: PublicKey) {
  const collection = await findCollectionConfig(nft)!

  const reward = collection ? await collection.allReward(nft) : 0
  return reward
}

export async function getAllRewardForNft(nft: PublicKey) {
  const reward = await getAllReward(nft)
  console.log('all', { reward })

  return {
    daily: reward,
    perSecond: reward / secondsPerDay,
  }
}

export enum Role {
  Chimpion = 1,
  FourRoles = 2,
  Sealz = 3,
  OneOutOfOne = 4,
}

export enum NukedRole {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Mystic = 'Mystic',
  Legendary = 'Legendary',
}

export async function getRoleOfNft(
  nft: PublicKey,
  user?: PublicKey,
  connection?: Connection
) {
  const nftMetadata = await getNftWithMetadata(nft)
  return getRoleOfMetadata(nftMetadata)
}

export function getRoleOfMetadata(nftMetadata: NftMetadata) {
  const role = (nftMetadata as any)?.attributes?.find(
    (a: any) => a.trait_type === 'Role'
  )?.value! as string

  const fourRoles = ['Businessman', 'Farmer', 'Scientist', 'Artist']
  const sealz = '420 Sealz'
  const chimpion = 'Chimpion'

  if (role === chimpion) return Role.Chimpion
  if (fourRoles.includes(role)) return Role.FourRoles
  if (role === sealz) return Role.Sealz
  return Role.OneOutOfOne
}

export enum EAwakenedType {
  DEFAULT,
  AWAKENED,
  SHOCKWAVE,
}

export async function getRoleOfNuked(nft: PublicKey) {
  const nftMetadata = await getNftWithMetadata(nft)

  const isAwakened = nftMetadata.attributes.some(
    (attr) => attr.value === 'Awakened'
  )
  const isShockwave = nftMetadata.attributes.some(
    (attr) => attr.trait_type === 'Shockwave'
  )

  return {
    role: getNukedRoleOfMetadata(nftMetadata),
    type: isAwakened
      ? isShockwave
        ? EAwakenedType.SHOCKWAVE
        : EAwakenedType.AWAKENED
      : EAwakenedType.DEFAULT,
  }
}

export function getNukedRoleOfMetadata(nftMetadata: NftMetadata) {
  const role = (nftMetadata as any)?.attributes?.find(
    (a: any) => a.trait_type === 'Rarity Rank'
  )?.value! as string

  return NukedRole[role as NukedRole]
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

export function verifySignature(address: string, signature: number[]) {
  const wallet = new web3.PublicKey(address)
  const message = new TextEncoder().encode('whitelisted')

  const res = nacl.sign.detached.verify(
    message,
    Uint8Array.from(signature),
    wallet.toBytes()
  )

  return res
}

export async function handleTransaction(
  tx: string,
  opts: {
    showLogs: boolean
    commitment: Commitment
  } = {
    showLogs: false,
    commitment: 'confirmed',
  }
) {
  await reattempt.run({ times: 2, delay: 1000 }, async () => {
    await connection.confirmTransaction(tx)
  })

  const trans = await connection.getTransaction(tx)
  if (!trans) {
    console.log('transaction not found', tx)

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
  includeNuked,
}: {
  connection: anchor.web3.Connection
  ownerAddress: anchor.web3.PublicKey
  allMints?: string[]
  includeNuked?: boolean
}) {
  console.log('hola')

  const allMintsCandyMachine =
    ENV != 'dev'
      ? [
          ...require('../assets/mints/sac-mints.json'),
          ...(includeNuked ? require('../assets/mints/nukedMints.json') : []),
        ]
      : require('../assets/mints/devMints.json') /* await fetchHashTable(config.candyMachineId) */
  const allTokens = []
  let tokenAccounts = (
    await connection.getParsedTokenAccountsByOwner(ownerAddress, {
      programId: spl.TOKEN_PROGRAM_ID,
    })
  ).value

  tokenAccounts = tokenAccounts.filter((tokenAccount) => {
    const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount

    console.log(
      'tokenaccount',
      tokenAccount.account.data,
      tokenAccount.account.data.parsed
    )

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

export async function getMetadata(nft: PublicKey) {
  return await Metadata.load(connection, await Metadata.getPDA(nft))
}

export async function findCollectionConfig(nft: PublicKey) {
  const metadata = await getMetadata(nft)

  return getCollectionByMetadata(metadata)
}

export function getCollectionByMetadata(metadata: Metadata | NftMetadata) {
  return collections.find((c) => {
    const creators = metadata.data.data.creators as any
    return creators.find(
      (creator: any) => creator.address === c.creator && creator.verified
    )
  })
}

export function pub(pubkey: string) {
  return new PublicKey(pubkey)
}

export function getSolAdressFromText(tweet: string) {
  const adresses = tweet.match(/(\b[a-zA-Z0-9]{32,44}\b)/g)
  return adresses && adresses?.length > 0 ? adresses[0] : null
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
}) {
  const blockHash = await getLatestBlockhash()
  const transaction = new Transaction({
    recentBlockhash: blockHash.blockhash,
    feePayer: args.feePayer,
  }).add(...args.instructions)

  await transaction.sign(...args.signers)

  const tx = await connection.sendRawTransaction(
    transaction.serialize({ verifySignatures: false })
  )
  if (args.log) console.log(`sent transaction ${tx}`)

  return tx
}

export async function getLatestBlockhash() {
  // return connection.getRecentBlockhash()
  return await ((connection as any).getLatestBlockhashAndContext
    ? connection.getLatestBlockhash()
    : connection.getRecentBlockhash())
}

export async function sendAndConfirmTransaction(args: {
  instructions: TransactionInstruction[]
  signers: Signer[]
  feePayer?: PublicKey
  commitment?: Commitment
  log?: boolean
}) {
  const { commitment = 'confirmed', log = false } = args
  const tx = await sendTransaction(args)

  await reattempt.run({ times: 3 }, async () => {
    await connection.confirmTransaction(tx, commitment)
  })

  if (log) console.log(`confirmed transaction ${tx}`)

  return tx
}

export function getSolscanTxLink(tx: string) {
  return `https://solscan.io/tx/${tx}?cluster=${config.solanaEnv}`
}
