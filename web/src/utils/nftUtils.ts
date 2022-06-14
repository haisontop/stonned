import {
  Connection,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js'
import {
  CreateMetadataV2Args,
  DataV2,
  Collection,
  CreateMasterEditionV3Args,
  Uses,
  UpdateMetadataV2Args,
} from '@metaplex-foundation/mpl-token-metadata'
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  createAssociatedTokenAccountInstruction,
  createMetadataInstruction,
  getMetadata,
  getAssociatedTokenAddress,
  sendTransactionWithRetryWithKeypair,
  getMasterEdition,
  createMasterEditionInstruction,
} from './candyMachineIntern/candyMachineHelpers'
import { serialize } from 'borsh'
import * as anchor from '@project-serum/anchor'
import { Creator, METADATA_SCHEMA } from './candyMachineIntern/schema'
import fetch from 'node-fetch'
import { sendTransaction } from './solUtils'
import prisma from '../lib/prisma'
import config, { getBaseUrl } from '../config/config'
import * as newMetaplex from 'newMetaplex'
import reattempt from 'reattempt'
import { TOKEN_METADATA_PROGRAM_ID } from './candyMachineIntern/candyMachineConstants'

export async function createNft({
  connection,
  walletKeypair,
  metadataLink,
  metadata,
  mutableMetadata = true,
  collection = null,
  verifyCreators = true,
  supply = 1,
  creatorSigners = [],
  mintTo,
}: {
  connection: Connection
  walletKeypair: Keypair
  metadataLink: string
  metadata: any
  mutableMetadata?: boolean
  collection?: PublicKey | null
  verifyCreators?: boolean
  supply?: number
  creatorSigners?: Keypair[]
  mintTo?: PublicKey
}) {
  // Generate a mint
  const mint = anchor.web3.Keypair.generate()

  let instructions: TransactionInstruction[] = []
  const signers: anchor.web3.Keypair[] = [walletKeypair, mint]

  /*  await prisma.tokenMetadata.create({
    data: {
      mint: mint.publicKey.toBase58(),
      data: JSON.stringify(metadata),
    },
  })

  const metadataLinkNew =
    config.host + '/api/metadata/' + mint.publicKey.toBase58() */

  const metadataLinkNew = metadataLink

  // Retrieve metadata

  const data = await createMetadata(metadataLinkNew, collection, verifyCreators)

  if (!data) throw Error('couldnt create metadata')

  const metadataMap = new Map([
    DataV2.SCHEMA,
    ...METADATA_SCHEMA,
    ...CreateMetadataV2Args.SCHEMA,
  ])

  const onChainMetadata = new CreateMetadataV2Args({
    data,
    isMutable: mutableMetadata,
  })

  let txnData = Buffer.from(serialize(metadataMap as any, onChainMetadata))

  // Create wallet from keypair
  const wallet = new anchor.Wallet(walletKeypair)

  // Allocate memory for the account
  const mintRent = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  )

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: mintRent,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID,
    })
  )
  instructions.push(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      wallet.publicKey,
      wallet.publicKey
    )
  )

  // Create metadata
  const metadataAccount = await getMetadata(mint.publicKey)

  instructions.push(
    createMetadataInstruction(
      metadataAccount,
      mint.publicKey,
      wallet.publicKey,
      wallet.publicKey,
      wallet.publicKey,
      txnData
    )
  )

  const userTokenAccoutAddress = await getAssociatedTokenAddress(
    mintTo ?? wallet.publicKey,
    mint.publicKey
  )
  instructions.push(
    createAssociatedTokenAccountInstruction(
      userTokenAccoutAddress,
      wallet.publicKey,
      mintTo ?? wallet.publicKey,
      mint.publicKey
    )
  )

  instructions.push(
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccoutAddress,
      wallet.publicKey,
      [],
      supply
    )
  )

  //Create master edition

  const editionAccount = await getMasterEdition(mint.publicKey)
  txnData = Buffer.from(
    serialize(
      new Map([
        DataV2.SCHEMA,
        ...METADATA_SCHEMA,
        ...CreateMasterEditionV3Args.SCHEMA,
      ]),
      new CreateMasterEditionV3Args({ maxSupply: new anchor.BN(0) })
    )
  )

  instructions.push(
    createMasterEditionInstruction(
      metadataAccount,
      editionAccount,
      mint.publicKey,
      wallet.publicKey,
      wallet.publicKey,
      wallet.publicKey,
      txnData
    )
  )

  const updateMetadataInstr = await updateMetadata(
    mint.publicKey,
    connection,
    walletKeypair,
    metadataLinkNew,
    null,
    false
  )
  if (updateMetadataInstr)
    instructions = instructions.concat(...updateMetadataInstr)

  const tx = await sendTransaction({
    instructions,
    signers,
    feePayer: walletKeypair.publicKey,
  })

  await reattempt.run({ times: 3, delay: 1000 }, async () => {
    await connection.confirmTransaction(tx, 'finalized')
  })

  return { tokenPub: mint.publicKey, tx }
}

let tmpCache: any = {}

export const createMetadata = async (
  metadataLink: string,
  collection: PublicKey | null,
  verifyCreators: boolean
): Promise<DataV2> => {
  // Metadata
  let metadata
  try {
    if (!tmpCache[metadataLink]) {
      metadata = await (await fetch(metadataLink, { method: 'GET' })).json()
      tmpCache[metadataLink] = metadata
    } else {
      metadata = tmpCache[metadataLink]
    }
  } catch (e) {
    console.debug(e)
    console.error('Invalid metadata at', metadataLink)
    throw e
  }

  // Validate metadata
  if (
    !metadata.name ||
    !metadata.image ||
    isNaN(metadata.seller_fee_basis_points) ||
    !metadata.properties ||
    !Array.isArray(metadata.properties.creators)
  ) {
    console.error('Invalid metadata file', metadata)
    throw new Error('Invalid metadata file')
  }

  // Validate creators
  const metaCreators = metadata.properties.creators

  console.log(
    ' metaCreators.reduce((sum: any, creator: any) => creator.share + sum, 0)',
    metaCreators.reduce((sum: any, creator: any) => creator.share + sum, 0)
  )

  if (
    metaCreators.some((creator: any) => !creator.address) ||
    metaCreators.reduce((sum: any, creator: any) => creator.share + sum, 0) !==
      100
  ) {
    throw new Error('wrong royalty distribution 1')
  }

  const creators = metaCreators.map((creator: any) => {
    return new Creator({
      address: creator.address,
      verified: creator.verified,
      share: creator.share,
    })
  })

  return new DataV2({
    symbol: metadata.symbol,
    name: metadata.name,
    uri: metadataLink,
    sellerFeeBasisPoints: metadata.seller_fee_basis_points,
    creators: creators,
    collection: collection
      ? new Collection({ key: collection.toBase58(), verified: false })
      : null,
    uses: null,
  })
}

export const updateMetadata = async (
  mintKey: PublicKey,
  connection: Connection,
  walletKeypair: Keypair,
  metadataLink: string,
  collection: PublicKey | null = null,
  verifyCreators: boolean
) /* : Promise<PublicKey | void>*/ => {
  // Retrieve metadata
  const data = await createMetadata(metadataLink, collection, verifyCreators)
  if (!data)
    throw new Error('there was an network issue with loading the metadata')

  const metadataAccount = await getMetadata(mintKey)
  const signers: anchor.web3.Keypair[] = []
  const value = new UpdateMetadataV2Args({
    data,
    updateAuthority: walletKeypair.publicKey.toBase58(),
    primarySaleHappened: true,
    isMutable: true,
  })
  const txnData = Buffer.from(serialize(METADATA_SCHEMA, value))

  const instructions = [
    createUpdateMetadataInstruction(
      metadataAccount,
      walletKeypair.publicKey,
      txnData
    ),
  ]

  return instructions

  /*  // Execute transaction
  const txid = await sendTransactionWithRetryWithKeypair(
    connection,
    walletKeypair,
    instructions,
    signers
  )
  console.log('Metadata updated', txid)
  return metadataAccount */
}

export function createUpdateMetadataInstruction(
  metadataAccount: PublicKey,
  payer: PublicKey,
  txnData: Buffer
) {
  const keys = [
    {
      pubkey: metadataAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false,
    },
  ]
  return new TransactionInstruction({
    keys,
    programId: TOKEN_METADATA_PROGRAM_ID,
    data: txnData,
  })
}
