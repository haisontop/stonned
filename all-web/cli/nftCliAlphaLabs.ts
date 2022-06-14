import { PrismaClient } from '.prisma/client'
import {
  MAX_CREATOR_LEN,
  MAX_NAME_LENGTH,
  MAX_SYMBOL_LENGTH,
  MAX_URI_LENGTH,
  Metadata,
  MetadataProgram,
  TokenAccount,
} from '@metaplex/js'
/* import { TREASURY_ADDRESS } from './src/config' */
import * as anchor from '@project-serum/anchor'
import { Program, web3 } from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import * as spl from '@solana/spl-token'
import {
  ConfirmedSignatureInfo,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import asyncBatch from 'async-batch'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Command } from 'commander'
import { Client, Intents, Message } from 'discord.js'
import fs from 'fs'
import _ from 'lodash'
import config, {
  breedingIdl,
  connection,
  evolutionIdl,
  evolutionProgramId,
  stakingIdl,
  stakingProgramId,
} from '../src/config/config'
import {
  getAtaForMint,
  loadCandyProgramV2,
} from '../src/utils/candyMachineHelpers'
import { Token } from '@solana/spl-token'
import {
  getAssociatedTokenAddress,
  getNftWithMetadata,
  getOrCreateAssociatedTokenAddressInstruction,
  getSolscanTxLink,
  getTokenAccount,
  loadWallet,
  loadWalletFromFile,
  pub,
  sendAndConfirmTransaction,
  sendTransaction,
} from '../src/utils/solUtils'
import { addDays } from 'date-fns'
import { mintV2 } from '../src/utils/candyMachine'
import { parse } from 'csv-parse/sync'
import {
  buildToken,
  createTransferInstruction,
  getMetadataForMint,
  getNftsFromOwnerByCreators,
  getNftsFromOwnerByCreatorsWithoutOfChainMeta,
  getTokenAccountForNft,
  getTokenAccountsForOwner,
} from '../src/utils/splUtils'
import { mn } from 'date-fns/locale'
import {
  createMetadata,
  createNft,
  updateMetadata,
} from '../src/utils/nftUtils'
import { ipfsUploadOneFile } from '../src/utils/ipfs'
import path from 'path'
import { arweaveUpload } from '../src/utils/arweave'
import alphaLabsConfig from '../src/modules/launch/config/alphaLabsConfig'
import prisma from '../src/lib/prisma'
import csvtojson from 'csvtojson/v2'
import { getNFTsForTokens } from '../src/utils/sacUtils'
require('dotenv').config()

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const baseAssetsPath = __dirname + '/assets/'
function write(name: string, data: string | any) {
  const fileData =
    typeof data === 'string' ? data : JSON.stringify(data, null, 3)
  fs.writeFileSync(name, fileData)
}

function read<T extends boolean>(
  path: string,
  json?: T
): (T extends false ? string : any) | null {
  if (!fs.existsSync(path)) return null
  const data = fs.readFileSync(path, 'utf-8')
  return json ? JSON.parse(data) : data
}

const assetsFolderName = 'assets'

const program = new Command()
program.version('0.0.1')

program
  .command('convertBs58ToBuffer')
  .argument('<bs58Str>')
  .action(async (bs58Str: string, options, cmd) => {
    const buffer = bs58.decode(bs58Str)

    console.log('u8 array', Uint8Array.from(buffer))
  })

program.command('testNft').action(async (bs58Str: string, options, cmd) => {
  const adminWallet = loadWalletFromFile(
    `${process.env.HOME}/config/solana/dev-wallet.json`
  )

  const video = await ipfsUploadOneFile({
    filePath: `${__dirname}/assets/og-box.mp4`,
  })

  const image =
    'https://www.arweave.net/nmz1eWJvtejSmz30Afol0qSqYfOHrexmikoa9iHARWo?ext=png'

  const baseMetadata = {
    name: 'Test Nft #',
    symbol: 'TN',
    image: image,
    /* animation_url: 'gold.mp4', */
    animation_url: video,
    properties: {
      files: [{ uri: image, type: 'image/gif' }],
      category: 'image',
      creators: [
        {
          address: adminWallet.publicKey.toBase58(),
          share: 70,
          verified: 1,
        },
        {
          address: '3Tbn1GKePK86nbyzmJp2v6q585fm1k26kpTgZAmHRZRb',
          share: 30,
          verified: 0,
        },
      ],
    },
    description: '...',
    seller_fee_basis_points: 1000,
    attributes: [] as any[],
    collection: { name: 'Test Nft', family: 'Test Nft' },
  }

  const metadataLink = await ipfsUploadOneFile({
    file: Buffer.from(JSON.stringify(baseMetadata)),
  })

  const { mintPub } = await createNft({
    walletKeypair: adminWallet,
    metadataLink: metadataLink,
    metadata: null as any,
  })

  console.log('mintPub', mintPub.toBase58())
})

program
  .command('createAlphaLabsNfts')
  .option('--reverse', 'send out nfts reverse')
  .action(async (options, cmd) => {
    const { reverse } = cmd.opts()
    const adminWallet = loadWalletFromFile(`${process.env.sol}/alpha-labs.json`)

    const baseMetadata = {
      name: 'AlphaLabs #',
      symbol: 'AL',
      image: '',
      /* animation_url: 'gold.mp4', */
      properties: {
        files: [{ uri: '', type: 'image/gif' }],
        category: 'image',
        creators: [
          {
            address: adminWallet.publicKey.toBase58(),
            share: 70,
            verified: 1,
          },
          {
            address: '3Tbn1GKePK86nbyzmJp2v6q585fm1k26kpTgZAmHRZRb',
            share: 30,
            verified: 0,
          },
        ],
      },
      description: '...',
      seller_fee_basis_points: 1000,
      attributes: [] as any[],
      collection: { name: 'AlphaLabs', family: 'AlphaLabs' },
    }

    const projectBasePath = `${__dirname}/assets/launch/${baseMetadata.collection.name}`

    const defaultCache = {
      name: baseMetadata.collection.name,
      assets: {} as any,
    }

    const cacheFilePath = `${projectBasePath}/.cache-${config.solanaEnv}`
    const cache: typeof defaultCache & Record<string, any> =
      read(cacheFilePath, true) ?? null

    console.log('cache', cache)

    const ipfsBasePath = cache.baseMetadataLink

    let files = fs.readdirSync(path.join(projectBasePath, 'metadata'))
    console.log('nfts count', files.length)

    if (reverse) {
      files = files.reverse()
    }

    const nfts = await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
      owner: alphaLabsConfig.creator,
      creators: [alphaLabsConfig.creator],
      withAmount: true,
    })

    const numbers = nfts
      .map((n) => {
        console.log('n.metadata.data.data.name', n.metadata.data.data.name)

        const name = n.metadata.data.data.name
        const nr = name.substring(name.indexOf('#') + 1)
        return Number(nr)
      })
      .sort((a, b) => a - b)

    let needToBeMinted = []

    for (let i = 1; i <= 2500; i++) {
      if (!numbers.includes(i)) needToBeMinted.push(i)
    }

    console.log('needToBeMinted', needToBeMinted.length)

    if (reverse) needToBeMinted = needToBeMinted.reverse()

    await asyncBatch(
      needToBeMinted,
      async (number, _i) => {
        const counter = number /* !reverse ? _i + 1 : files.length - _i */

        console.log(`${counter}.json : started`)

        const file = counter + '.json'
        try {
          if (cache.assets[counter]) {
            console.log(`${file} already created`)
            return
          }

          const metadataLink = ipfsBasePath + '/' + file

          const metadata = JSON.parse(
            fs.readFileSync(`${projectBasePath}/metadata/${file}`, 'utf-8')
          )

          const { mintPub } = await createNft({
            walletKeypair: adminWallet,
            metadata: metadata,
            metadataLink,
          })

          cache.assets[counter] = {
            nft: mintPub.toBase58(),
            metadataLink,
          }

          write(cacheFilePath, cache)

          console.log(`${counter}: created nft ${mintPub.toBase58()}`)
        } catch (error) {
          console.error(`${counter}: error at creating nft ${file}`, error)
        }
      },
      10
    )
  })

program
  .command('createAlphaLabsNfts')
  .option('--reverse', 'send out nfts reverse')
  .action(async (options, cmd) => {
    const { reverse } = cmd.opts()
    const adminWallet = loadWalletFromFile(`${process.env.sol}/alpha-labs.json`)

    const baseMetadata = {
      name: 'AlphaLabs #',
      symbol: 'AL',
      image: '',
      /* animation_url: 'gold.mp4', */
      properties: {
        files: [{ uri: '', type: 'image/gif' }],
        category: 'image',
        creators: [
          {
            address: adminWallet.publicKey.toBase58(),
            share: 70,
            verified: 1,
          },
          {
            address: '3Tbn1GKePK86nbyzmJp2v6q585fm1k26kpTgZAmHRZRb',
            share: 30,
            verified: 0,
          },
        ],
      },
      description: '...',
      seller_fee_basis_points: 1000,
      attributes: [] as any[],
      collection: { name: 'AlphaLabs', family: 'AlphaLabs' },
    }

    const projectBasePath = `${__dirname}/assets/launch/${baseMetadata.collection.name}`

    const defaultCache = {
      name: baseMetadata.collection.name,
      assets: {} as any,
    }

    const cacheFilePath = `${projectBasePath}/.cache-${config.solanaEnv}`
    const cache: typeof defaultCache & Record<string, any> =
      read(cacheFilePath, true) ?? null

    console.log('cache', cache)

    const ipfsBasePath = cache.baseMetadataLink

    let files = fs.readdirSync(path.join(projectBasePath, 'metadata'))
    console.log('nfts count', files.length)

    if (reverse) {
      files = files.reverse()
    }

    const nfts = await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
      owner: alphaLabsConfig.creator,
      creators: [alphaLabsConfig.creator],
      withAmount: true,
    })

    const numbers = nfts
      .map((n) => {
        console.log('n.metadata.data.data.name', n.metadata.data.data.name)

        const name = n.metadata.data.data.name
        const nr = name.substring(name.indexOf('#') + 1)
        return Number(nr)
      })
      .sort((a, b) => a - b)

    let needToBeMinted = []

    for (let i = 1; i <= 2500; i++) {
      if (!numbers.includes(i)) needToBeMinted.push(i)
    }

    console.log('needToBeMinted', needToBeMinted.length)

    if (reverse) needToBeMinted = needToBeMinted.reverse()

    await asyncBatch(
      needToBeMinted,
      async (number, _i) => {
        const counter = number /* !reverse ? _i + 1 : files.length - _i */

        console.log(`${counter}.json : started`)

        const file = counter + '.json'
        try {
          if (cache.assets[counter]) {
            console.log(`${file} already created`)
            return
          }

          const metadataLink = ipfsBasePath + '/' + file

          const metadata = JSON.parse(
            fs.readFileSync(`${projectBasePath}/metadata/${file}`, 'utf-8')
          )

          const { mintPub } = await createNft({
            walletKeypair: adminWallet,
            metadata: metadata,
            metadataLink,
          })

          cache.assets[counter] = {
            nft: mintPub.toBase58(),
            metadataLink,
          }

          write(cacheFilePath, cache)

          console.log(`${counter}: created nft ${mintPub.toBase58()}`)
        } catch (error) {
          console.error(`${counter}: error at creating nft ${file}`, error)
        }
      },
      10
    )
  })

program.command('uploadAlphaLabsMetadata').action(async () => {
  const adminWallet = loadWalletFromFile(`${process.env.sol}/alpha-labs.json`)

  const baseMetadata = {
    name: 'AlphaLabs #',
    symbol: 'AL',
    image: '',
    /* animation_url: 'gold.mp4', */
    properties: {
      files: [{ uri: '', type: 'image/gif' }],
      category: 'image',
      creators: [
        {
          address: adminWallet.publicKey.toBase58(),
          share: 70,
          verified: 1,
        },
        {
          address: '3Tbn1GKePK86nbyzmJp2v6q585fm1k26kpTgZAmHRZRb',
          share: 30,
          verified: 0,
        },
      ],
    },
    description: '...',
    seller_fee_basis_points: 1000,
    attributes: [] as any[],
    collection: { name: 'AlphaLabs', family: 'AlphaLabs' },
  }

  const projectBasePath = `${__dirname}/assets/launch/${baseMetadata.collection.name}`

  const defaultCache = {
    name: baseMetadata.collection.name,
    assets: {} as any,
  }

  const cacheFilePath = `${projectBasePath}/.cache-${config.solanaEnv}`
  const cache: typeof defaultCache & Record<string, any> =
    read(cacheFilePath, true) ?? defaultCache

  let nftTypeCounter = 0

  const baseMetadataLink = await ipfsUploadOneFile({
    filePath: path.join(projectBasePath, 'metadata'),
  })

  console.log('baseMetadataLink', baseMetadataLink)
  cache.baseMetadataLink = baseMetadataLink

  write(cacheFilePath, cache)

  return
  /* for (const nftType of nftTypes) {
    

    console.log('uploaded image', image)

    await asyncBatch(
      Array.from(Array(nftType.supply).keys()),
      async (e, _i) => {
        const counter =
          _i +
          1 +
          nftTypes.slice(0, nftTypeCounter).reduce((p, c) => p + c.supply, 0)
        try {
          const metadata = _.cloneDeep(baseMetadata)
          metadata.name = metadata.name + counter

          metadata.image = image
          metadata.properties.files[0].uri = image

          metadata.attributes.concat(nftType.attributes)

          const metadataLink = await arweaveUpload({
            file: Buffer.from(JSON.stringify(metadata)),
          })

          const { mintPub } = await createNft({
            walletKeypair: adminWallet,
            metadata: {} as any,
            metadataLink,
          })

          cache.assets[counter] = {
            nft: mintPub.toBase58(),
            metadataLink,
          }

          write(cacheFilePath, cache)

          console.log(`${counter}: created nft ${mintPub.toBase58()}`)
        } catch (error) {
          console.error(
            `${counter}: error at creating nft ${nftType.attributes[0].value}`,
            error
          )
        }
      },
      10
    )
  }

  nftTypeCounter++ */
})

program.command('createAlphaLabsMetadata').action(async () => {
  const adminWallet = loadWalletFromFile(`${process.env.sol}/alpha-labs.json`)

  const baseMetadata = {
    name: 'AlphaLabs #',
    symbol: 'AL',
    image: '',
    /* animation_url: 'gold.mp4', */
    properties: {
      files: [{ uri: '', type: 'image/gif' }],
      category: 'image',
      creators: [
        {
          address: adminWallet.publicKey.toBase58(),
          share: 95,
          verified: 1,
        },
        {
          address: '3Tbn1GKePK86nbyzmJp2v6q585fm1k26kpTgZAmHRZRb',
          share: 5,
          verified: 0,
        },
      ],
    },
    description: '...',
    seller_fee_basis_points: 1000,
    attributes: [] as any[],
    collection: { name: 'AlphaLabs', family: 'AlphaLabs' },
  }

  const nftTypes = [
    {
      supply: 500,
      attributes: [{ trait_type: 'Card Type', value: 'Gold' }],
      image: 'gold.gif',
    },
    {
      supply: 800,
      attributes: [{ trait_type: 'Card Type', value: 'Silver' }],
      image: 'silver.gif',
    },
    {
      supply: 1200,
      attributes: [{ trait_type: 'Card Type', value: 'Bronze' }],
      image: 'bronze.gif',
    },
  ]

  const projectBasePath = `${__dirname}/assets/launch/${baseMetadata.collection.name}`

  const defaultCache = {
    name: baseMetadata.collection.name,
    assets: {} as any,
  }

  const cacheFilePath = `${projectBasePath}/.cache-${config.solanaEnv}`
  const cache: typeof defaultCache = read(cacheFilePath, true) ?? defaultCache

  let nftTypeCounter = 0
  for (const nftType of nftTypes) {
    const image = await ipfsUploadOneFile({
      filePath: path.join(projectBasePath, nftType.image),
    })

    await asyncBatch(
      Array.from(Array(nftType.supply).keys()),
      async (e, _i) => {
        const counter =
          _i +
          1 +
          nftTypes.slice(0, nftTypeCounter).reduce((p, c) => p + c.supply, 0)
        try {
          const metadata = _.cloneDeep(baseMetadata)
          metadata.name = metadata.name + counter

          metadata.image = image
          metadata.properties.files[0].uri = image

          metadata.attributes = metadata.attributes.concat(nftType.attributes)

          fs.writeFileSync(
            path.join(projectBasePath, 'metadata', counter + '.json'),
            JSON.stringify(metadata)
          )

          // const metadataLink = await arweaveUpload({
          //   file: Buffer.from(JSON.stringify(metadata)),
          // })

          // const { mintPub } = await createNft({
          //   walletKeypair: adminWallet,
          //   metadata: {} as any,
          //   metadataLink,
          // })

          // cache.assets[counter] = {
          //   nft: mintPub.toBase58(),
          //   metadataLink
          // }

          write(cacheFilePath, cache)

          /*  console.log(`${counter}: created nft ${mintPub.toBase58()}`) */
        } catch (error) {
          console.error(
            `${counter}: error at creating nft ${nftType.attributes[0].value}`,
            error
          )
        }
      },
      10
    )

    nftTypeCounter++
  }
})

program.command('saveAlphaLabsMints').action(async () => {
  const mints = await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
    owner: alphaLabsConfig.creator,
    creators: [alphaLabsConfig.creator],
    withAmount: true,
  })

  fs.writeFileSync(
    path.join(
      __dirname,
      '../src/modules/launch/assets/alphaLabsMints-' +
        config.solanaEnv +
        '.json'
    ),
    JSON.stringify(mints.map((m) => m.mint.toBase58()))
  )
})

program.command('addWhitelist').action(async (e) => {
  const whiteList = await csvtojson().fromFile(
    path.join(
      __dirname,
      '/assets/launch/AlphaLabs/ALL BLUE TEST SUBMISSION - Sorted dups removed.csv'
    )
  )

  const testUser = require('./testUsers.json') as string[]

  testUser.forEach((t) => whiteList.push({ address: t }))

  const projectIdendifier = 'AlphaLabs'
  const spotPerUser = 2

  const mintingPeriod = await prisma.mintingPeriod.findFirst({
    where: {
      isWhitelist: true,
      project: {
        identifier: projectIdendifier,
      },
    },
    rejectOnNotFound: true,
  })

  await prisma.user.createMany({
    data: whiteList.map((w) => ({ solanaAddress: w.address })),
    skipDuplicates: true,
  })

  const users = await prisma.user.findMany({
    where: {
      solanaAddress: { in: whiteList.map((w) => w.address) },
      // whitelistSpots: {
      //   none: {
      //     mintingPeriodId: mintingPeriod.id,
      //   },
      // },
    },
  })

  const res = await prisma.whitelistSpot.createMany({
    data: users.map((u) => ({
      amount: spotPerUser,
      mintingPeriodId: mintingPeriod.id,
      userId: u.id,
    })),
    skipDuplicates: true,
  })

  console.log(`inserted ${res.count} whitelist spots`)

  // for (let spot of whiteList) {
  //   const user = await prisma.user.upsert({
  //     where: { solanaAddress: spot.address },
  //     create: {
  //       solanaAddress: spot.address,
  //     },
  //     update: {
  //       solanaAddress: spot.address,
  //     },
  //   })

  //   const args = {
  //     amount: spotPerUser,
  //     userId: user.id,
  //     mintingPeriodId: mintingPeriod?.id,
  //   }

  //   await prisma.whitelistSpot.upsert({
  //     where: {
  //       mintingPeriodId_userId: {
  //         userId: user.id,
  //         mintingPeriodId: mintingPeriod.id,
  //       },
  //     },
  //     update: args,
  //     create: args,
  //   })

  //   console.log(`added ${spot.address}`)
  // }
})

program.command('alreadyMinted').action(async () => {
  const nfts = await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
    owner: alphaLabsConfig.creator,
    creators: [alphaLabsConfig.creator],
    withAmount: true,
  })

  const already = nfts
    .map((n) => {
      console.log('n.metadata.data.data.name', n.metadata.data.data.name)

      const name = n.metadata.data.data.name
      const nr = name.substring(name.indexOf('#') + 1)
      return { nft: n, nr: Number(nr) }
    })
    .sort((a, b) => a.nr - b.nr)

  /* const needToBeMinted = []

  for (let i = 1; i <= 2500; i++) {
    if (!already.includes(i)) needToBeMinted.push(i)
  }

  console.log('needToBeMinted', needToBeMinted)

  console.log('needToBeMinted', needToBeMinted.length)

  console.log('already', already.length) */

  const mints = _.uniqBy(already, (a) => a.nr)

  console.log('all', already.length)

  console.log('no', mints.length)

  fs.writeFileSync(
    path.join(
      __dirname,
      '../src/modules/launch/assets/alphaLabsMints-' +
        config.solanaEnv +
        '.json'
    ),
    JSON.stringify(mints.map((m) => m.nft.mint))
  )
})

program.command('checkAlphaLabsNfts').action(async () => {
  const nfts = await getNftsFromOwnerByCreators({
    owner: alphaLabsConfig.creator,
    creators: [alphaLabsConfig.creator],
    withAmount: true,
  })

  const s = _.groupBy(nfts, (n) =>
    n.nft.attributes.find((n) => n.trait_type === 'Card Type')
  )

  console.log('s', s)
})

program.command('exchangeNfts').action(async (e) => {
  const walletKeypair = loadWalletFromFile(
    `${process.env.HOME}/config/solana/alpha-labs.json`
  )

  const nftTokenAccounts = await getTokenAccountsForOwner(
    alphaLabsConfig.creator,
    {
      withAmount: true,
      commitment: 'confirmed',
    }
  )

  const mints = nftTokenAccounts
    .map((n) => n.account.data.parsed.info.mint)
    .filter((n) => alphaLabsConfig.mints.includes(n))

  // const mints = [
  //   '5NrH1bUd3gx8BegGRZoWpr1WLpQkbBU4FUNqaCJSSvEq',
  //   'B3yYwZSLo1MboT4iyt4PAHMwRzeqkCTbRFFZYnMJsh4x',
  // ]

  console.log('mintNfts', mints.length)

  asyncBatch(
    Array.from(Array(1000).keys()),
    async (i) => {
      try {
        const mint1 = _.sample(mints)!
        const mint2 = _.sample(mints)!

        const oldMeta1 = await getNftWithMetadata(pub(mint1))
        const oldMeta2 = await getNftWithMetadata(pub(mint2))

        const trait1 = oldMeta1.attributes.find(
          (a) => a.trait_type === 'Card Type'
        )?.value!
        const trait2 = oldMeta2.attributes.find(
          (a) => a.trait_type === 'Card Type'
        )?.value!

        if (trait1 === trait2) return

        console.log(`${i}: started`, {
          1: { mint1, trait1 },
          2: { mint2, trait2 },
        })

        const meta1 = _.cloneDeep(oldMeta1)
        const meta2 = _.cloneDeep(oldMeta2)

        meta1.attributes[0] = oldMeta2.attributes[0]
        meta2.attributes[0] = oldMeta1.attributes[0]

        meta1.image = oldMeta2.image
        meta1.properties.files[0].uri = oldMeta2.properties.files[0].uri

        meta2.image = oldMeta1.image
        meta2.properties.files[0].uri = oldMeta1.properties.files[0].uri

        const newLink1 = await ipfsUploadOneFile({
          file: Buffer.from(JSON.stringify(meta1)),
          ext: 'json',
        })

        const newLink2 = await ipfsUploadOneFile({
          file: Buffer.from(JSON.stringify(meta2)),
        })

        const updateMetadataInstr1 = await updateMetadata(
          pub(mint1),
          connection,
          walletKeypair,
          newLink1,
          null,
          false,
          meta1
        )

        const updateMetadataInst2 = await updateMetadata(
          pub(mint2),
          connection,
          walletKeypair,
          newLink2,
          null,
          false,
          meta2
        )

        const tx = await sendAndConfirmTransaction({
          instructions: [...updateMetadataInstr1!, ...updateMetadataInst2!],
          signers: [walletKeypair],
        })

        console.log(`trans successful ${tx}`)
      } catch (e) {
        console.error(`error at ${i}`, e)
      }
    },
    1
  )
})

program.command('distribution').action(async (e) => {
  let mints = alphaLabsConfig.mints.map((m) => pub(m))

  let tokenAccounts = await asyncBatch(
    mints,
    async (mint) => {
      return getTokenAccountForNft(mint)
    },
    5
  )

  tokenAccounts = tokenAccounts.filter(
    (t) => !t.data.owner.equals(alphaLabsConfig.creator)
  )

  const nfts = await getNFTsForTokens(tokenAccounts.map((t) => t.data.mint))

  const differentNfts = _.groupBy(
    nfts,
    (n) => n.attributes.find((n) => n.trait_type === 'Card Type')?.value!
  )

  console.log('nfts', nfts)
  const res = Object.entries(differentNfts).map(([key, value]) => {
    console.log(`${key}: ${value.length}`)
  })
})

program.command('addPricing').action(async (e) => {
  const project = await prisma.project.findFirst({
    where: {
      identifier: 'AlphaLabs',
    },
    include: {
      mintingPeriods: {
        include: {
          paymentOptions: {
            include: {
              pricings: true,
            },
          },
        },
      },
    },
  })

  const whitelistMintingPeriod = project?.mintingPeriods.find(
    (m) => m.periodName === 'Whitelist Sale'
  )!

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: whitelistMintingPeriod.id,
      pricings: {
        create: {
          isSol: true,
          amount: 1.8,
          currency: 'SOL',
          whitelistPeriodId: whitelistMintingPeriod.id,
        },
      },
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: whitelistMintingPeriod.id,
      pricings: {
        create: {
          isSol: false,
          amountInSol: 1.8,
          currency: 'PUFF',
          token: config.puffToken,
          whitelistPeriodId: whitelistMintingPeriod.id,
        },
      },
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: whitelistMintingPeriod.id,
      pricings: {
        create: {
          isSol: false,
          amountInSol: 1.8,
          currency: 'ALL',
          whitelistPeriodId: whitelistMintingPeriod.id,
          token: config.allToken,
        },
      },
    },
  })

  const publicMintingPeriod = project?.mintingPeriods.find(
    (m) => m.periodName === 'Public Sale'
  )!

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: publicMintingPeriod.id,
      pricings: {
        create: {
          isSol: true,
          amount: 2,
          currency: 'SOL',
          whitelistPeriodId: publicMintingPeriod.id,
        },
      },
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: publicMintingPeriod.id,
      pricings: {
        create: {
          isSol: false,
          amountInSol: 2,
          currency: 'PUFF',
          token: config.puffToken,
          whitelistPeriodId: publicMintingPeriod.id,
        },
      },
    },
  })

  await prisma.paymentOption.create({
    data: {
      mintingPeriodId: publicMintingPeriod.id,
      pricings: {
        create: {
          isSol: false,
          amountInSol: 2,
          currency: 'ALL',
          whitelistPeriodId: publicMintingPeriod.id,
          token: config.allToken,
        },
      },
    },
  })

  console.log('project', project)
})

program.parse(process.argv)
