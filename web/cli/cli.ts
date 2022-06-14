require('dotenv').config()
import { PrismaClient } from '.prisma/client'
import { Metadata, TokenAccount } from '@metaplex/js'
/* import { TREASURY_ADDRESS } from './src/config' */
import * as anchor from '@project-serum/anchor'
import { Program, Provider, Wallet, web3 } from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import * as spl from '@solana/spl-token'
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import asyncBatch from 'async-batch'
import axios from 'axios'
import { Command } from 'commander'
import fs from 'fs'
import _ from 'lodash'
import config, {
  allStakingIdl,
  allStakingProgramId,
  breedingIdl,
  connection,
  evolutionIdl,
  evolutionProgramId,
  nuked,
  nukedMintWallet,
  stakingIdl,
  stakingProgramId,
} from '../src/config/config'
import {
  loadCandyProgramV2,
  loadWalletKey,
} from '../src/utils/candyMachineIntern/candyMachineHelpers'
import {
  getNftWithMetadata,
  getTokenAccount,
  pub,
  sendAndConfirmTransaction,
  sendTransaction,
} from '../src/utils/solUtils'
import { mintV2 } from '../src/utils/mintV2'
import {
  createTransferInstruction,
  getNftsFromOwnerByCreators,
  getNftsFromOwnerByCreatorsWithoutOfChainMeta,
  getNftsFromOwnerByMints,
  getTokenAccountForNft,
  getTokenAccountForNftOld,
  getTokenAccountsForOwner,
} from '../src/utils/splUtils'
import Reattempt from 'reattempt'
import weighted from 'weighted'

import * as csv from 'fast-csv'
import { getNukedMintNfts } from '../src/modules/nuked/nukedUtils'
import { fetchHashTable } from '../src/utils/useHashTable'
import { nukedCollection, sacCollection } from '../src/config/collectonsConfig'
import {
  merchBurnWalletOg,
  merchConfigOgBox,
} from '../src/modules/merch/merchConfigOgBox'
import { getAvailableBoxes } from '../src/modules/merch/tmpUtils'
import { createNft } from '../src/utils/nftUtils'
import jetpack from 'fs-jetpack'
import newMetaplex from 'newMetaplex'
import csvtojson from 'csvtojson/v2'
import { awakeningProgram } from '../src/modules/awakening/awakeningConfig'
import { stringify } from 'csv/sync'
import path from 'path'
import { NftMetadata } from '../src/utils/nftmetaData.type'

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

console.log('connection', (connection as any)._rpcEndpoint)

const assetsFolderName = 'assets'

export const breedingProgramId = new PublicKey(breedingIdl.metadata.address)

const program = new Command()
program.version('0.0.1')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

const botToken = process.env.BOT_TOKEN as string

const wallet = loadWalletKey(
  `${process.env.HOME}/config/solana/sac-treasury.json`
)

const provider = new anchor.Provider(connection, wallet as any, {
  commitment: 'confirmed',
})

const stakingProgram = new Program(stakingIdl, stakingProgramId, provider)

const allStakingProgram = new Program(
  allStakingIdl,
  allStakingProgramId,
  provider
)

const evolutionProgram = new Program(evolutionIdl, evolutionProgramId, provider)

const breedingProgram = new Program(breedingIdl, breedingProgramId, provider)

program.command('playground').action(async () => {
  let uniquUsers = JSON.parse(
    fs.readFileSync(__dirname + '/holders.json', 'utf-8')
  )

  uniquUsers = uniquUsers.map((u: any) => u.address)
  fs.writeFileSync(
    __dirname + '/holders.json',
    JSON.stringify(uniquUsers, null, 3)
  )
})

program.command('sendOutCicadaWinnerPuff').action(async () => {
  const adminUser = loadWalletKey(
    `${process.env.HOME}/config/solana/cicada-prizes.json`
  )

  const cicadaCreator = '5xLvUHFDndtMnobvdAHZRYTFdxKtvswkg8EWi444niyp'

  const metdatasFromDb = await prisma.tokenMetadata.findMany({
    where: {
      data: {
        contains: '"value":5',
      },
    },
  })

  const winnerMetadatas = metdatasFromDb.filter((m) =>
    JSON.parse(m.data).properties.creators.find(
      (c: any) => c.address === cicadaCreator
    )
  )

  console.log('metdatasFromDb', winnerMetadatas.length)

  const winnerNfts = /* [
    pub('AbRX5Wb4PHTdMs2gSkKR1NdatAozKEZMDzYwP2X4EQbw'),
  ] */ metdatasFromDb.map((m) => pub(m.mint))

  console.log('metdatasFromDb', winnerMetadatas.length)

  const puffAmount = 69.42
  const allAmount = 272.73

  const alreadySentFilePath = `${__dirname}/assets/cicadaPrizesAlreadySent.json`

  const cicadaWinnerNfts = await asyncBatch(
    winnerNfts,
    async (winnerNft) => {
      try {
        const alreadySent: PublicKey[] = jetpack.exists(alreadySentFilePath)
          ? (jetpack.read(alreadySentFilePath, 'json') as string[]).map((a) =>
              pub(a)
            )
          : []

        const tokenAccounts = await connection.getTokenLargestAccounts(
          winnerNft
        )

        const largestTokenAccount = tokenAccounts.value.find((t) => t.uiAmount)!

        const tokenAccount = (await connection.getParsedAccountInfo(
          largestTokenAccount.address
        )) as any

        const owner = pub(tokenAccount.value.data.parsed.info.owner)

        console.log('owner', owner.toBase58())

        if (alreadySent.find((a) => a.equals(owner))) {
          console.log(`already sent to ${owner.toBase58()}`)
          return
        }
        const allInstr = await createTransferInstruction({
          mint: config.allToken,
          amount: allAmount * LAMPORTS_PER_SOL,
          from: adminUser.publicKey,
          to: owner,
        })

        const puffInstr = await createTransferInstruction({
          mint: pub(config.puffToken),
          amount: puffAmount * LAMPORTS_PER_SOL,
          from: adminUser.publicKey,
          to: owner,
        })

        const tx = await sendAndConfirmTransaction({
          instructions: [...allInstr, ...puffInstr],
          signers: [adminUser],
          log: true,
        })

        alreadySent.push(owner)

        jetpack.write(
          alreadySentFilePath,
          alreadySent.map((a) => a.toBase58())
        )

        console.log(`sent price to ${owner}, tx: ${tx}`)
      } catch (e) {
        console.error('error in sending nft', winnerNft.toBase58(), e)
      }
    },
    1
  )

  process.exit(0)
})

program.command('checkCicadaUser').action(async () => {
  const user = pub('8PWmTZJnqqY1JNL3LMF8gJaqMuSp1y6nPCL16KcNFiNo')

  const cicadaCreator = pub('5xLvUHFDndtMnobvdAHZRYTFdxKtvswkg8EWi444niyp')

  const nfts = await getNftsFromOwnerByCreators({
    owner: user,
    creators: [cicadaCreator],
    withAmount: true,
  })

  console.log(
    'nfts',
    nfts.map((n) => n.nft.pubkey.toBase58())
  )
})

program.command('cicadaRaffleWinners').action(async () => {
  const user = pub('8PWmTZJnqqY1JNL3LMF8gJaqMuSp1y6nPCL16KcNFiNo')

  const nftMetas = await prisma.tokenMetadata.findMany({
    where: {
      AND: [
        {
          data: {
            contains:
              '%"address":"5xLvUHFDndtMnobvdAHZRYTFdxKtvswkg8EWi444niyp","share":100,"verified":1%',
          },
        },
        {
          data: {
            contains: '"Step","value":5',
          },
        },
      ],
    },
  })

  console.log('nftMetas', nftMetas.length)

  const tokenAccounts: TokenAccount[] = []
  await asyncBatch(
    nftMetas,
    async (nftMeta) => {
      const tokenAccount = (await getTokenAccountForNft(pub(nftMeta.mint)))!

      if (tokenAccount) tokenAccounts.push(tokenAccount)
    },
    2
  )

  console.log('tokenAccounts', tokenAccounts.length)

  const winnners = Array.from(Array(10).keys()).map(
    (i) => _.sample(tokenAccounts)!
  )

  console.log(
    'winners',
    winnners.map((w) => w.data.owner.toBase58())
  )

  const pairs: { nft: NftMetadata; tokenAccount: TokenAccount }[] = []

  for (let winner of winnners) {
    const nft = await getNftWithMetadata(winner.data.mint)

    pairs.push({ nft, tokenAccount: winner })
  }

  console.log(
    'pairs',
    pairs.map((p) => ({
      user: p.tokenAccount.data.owner.toBase58(),
      nft: p.nft.pubkey.toBase58(),
    }))
  )
})

program.command('updateCicadaNftMetadataToStart').action(async () => {
  let uniquUsers = JSON.parse(
    fs.readFileSync(__dirname + '/holders.json', 'utf-8')
  )

  const adminUser = loadWalletKey(
    `${process.env.HOME}/config/solana/cicada.json`
  )

  const mintsMeta = await Metadata.findMany(connection, {
    creators: [adminUser.publicKey],
  })

  const mints = mintsMeta.map((m) => ({
    mint: pub(m.data.mint),
  }))

  /* const mints = await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
    owner: adminUser.publicKey,
    creators: [adminUser.publicKey],
    withAmount: true,
  }) */

  const nfts = await prisma.tokenMetadata.findMany({
    where: {
      mint: { in: mints.map((m) => m.mint.toBase58()) },
    },
  }) /* await prisma.tokenMetadata.findMany({
    where: { mint: '45ypdxpZqHWTJQY3MCTTi6LywfsGK2WitVs2sq6nRPFQ' },
  }) */

  let counter = 0
  const newImage =
    'https://ipfs.io/ipfs/QmZTxX5Y5TJYgY7ywNAv3a628ANFJjiTb2MBJNnfGjqQhb?ext=jpeg'

  console.log('shouldUpdateNfts', nfts.length)

  const metadata: any = JSON.parse(nfts[0].data)

  metadata.image = newImage
  metadata.properties.files[0].uri = newImage

  metadata.attributes = [
    {
      trait_type: 'Step',
      value: 0,
    },
    {
      trait_type: 'Code',
      value: 'wxsrihetigvia.gsq/g/wigvix',
    },
    {
      trait_type: 'Description',
      value:
        'My wealth and treasures? If you want it, you can have it! Search for it! I left it all at that place! The first hint is in the ‘Code’ field. Good luck.',
    },
    {
      trait_type: 'Prizes',
      value:
        '01001111 01110110 01100101 01110010 00100000 00110001 00110010 00110000 00110000 00100000 01010011 01001111 01001100 00100000 01101001 01101110 00100000 01110000 01110010 01101001 01111010 01100101 01110011',
    },
  ]

  await prisma.tokenMetadata.updateMany({
    where: {
      mint: { in: nfts.map((s) => s.mint) },
    },
    data: {
      data: JSON.stringify(metadata),
    },
  })
})

program.command('updateCicadaNftImage').action(async () => {
  let uniquUsers = JSON.parse(
    fs.readFileSync(__dirname + '/holders.json', 'utf-8')
  )

  const adminUser = loadWalletKey(
    `${process.env.HOME}/config/solana/cicada.json`
  )

  const mints = await prisma.mintCreator.findMany({
    where: {
      creator: adminUser.publicKey.toBase58(),
    },
  })

  const nfts = await prisma.tokenMetadata.findMany({
    where: {
      mint: { in: mints.map((m) => m.mint) },
    },
  })

  let counter = 0
  const newImage =
    'https://ipfs.io/ipfs/Qmeyarv25EKM5hW2b3NSLigXXCKvRNdqnd8fMMFQ5MyCfz?ext=jpeg'

  const shouldUpdateNfts = nfts.filter((nft) => {
    const metadata: any = JSON.parse(nft.data)

    const stepTrait = metadata.attributes.find(
      (a: any) => a.trait_type === 'Step'
    )

    return stepTrait.value == 0
  })

  console.log('shouldUpdateNfts', shouldUpdateNfts.length)

  const metadata: any = JSON.parse(shouldUpdateNfts[0].data)

  metadata.image = newImage
  metadata.properties.files[0].uri = newImage

  await prisma.tokenMetadata.updateMany({
    where: {
      mint: { in: shouldUpdateNfts.map((s) => s.mint) },
    },
    data: {
      data: JSON.stringify(metadata),
    },
  })
})

program
  .command('moveFilesPen')
  .arguments('<root> <destination>')
  .action(async (root, destination, options, cmd) => {
    const args = cmd.opts()
    const { verified, creatorKeyPath } = args

    /* const rootFiles = jetpack.list(root) */

    const targetFiles = jetpack.list(root)

    const needFiles = targetFiles
      ?.filter((f) => Number(f) !== NaN)
      .map((f) => Number(f))!

    const urgentFiles = jetpack.list(root)

    console.log('needFiles', needFiles.length)

    const missing: number[] = []

    for (const needFile of needFiles) {
      try {
        const id = needFile.toString()

        try {
          jetpack.copy(
            path.join(root, id, id + '.mp4'),
            path.join(destination, id + '.mp4'),
            {
              overwrite: false,
            }
          )
        } catch (e) {}
        try {
          jetpack.copy(
            path.join(root, id, id + '.webp'),
            path.join(destination, id + '.webp'),
            {
              overwrite: false,
            }
          )
        } catch (e) {}
        /*   jetpack.copy(
          path.join(root, id, id + '.gif'),
          path.join(destination, id + '.gif'),
          {
            overwrite: false,
          }
        ) */
      } catch (e: any) {
        if (!e.message.includes('Destination path already exists'))
          console.error('error at moving file ' + needFile, e.message)
      }
    }

    console.log('missing', JSON.stringify(missing, null, 3))
    console.log('missing', missing.length)

    console.log('needFiles', needFiles.length)
  })

program
  .command('moveFilesPenUrgent')
  .arguments('<root> <destination>')
  .action(async (root, destination, options, cmd) => {
    const args = cmd.opts()
    const { verified, creatorKeyPath } = args

    /* const rootFiles = jetpack.list(root) */

    const targetFiles = jetpack.list(destination)

    const needFiles = targetFiles
      ?.filter((f) => f.includes('.mp4'))
      .map((f) => Number(f.split('.')[0]))!

    console.log('needFiles', needFiles)

    const urgentFiles =
      /* [{ idx: 1 }, { idx: 10 }] ?? */
      require('./first700Updated.json') as { idx: number }[]

    console.log('urgentFiles', urgentFiles)

    const missing: number[] = []

    for (const needFile of urgentFiles) {
      try {
        const id = needFile.idx.toString()

        if (!jetpack.exists(path.join(root, id, id + '.mp4'))) {
          missing.push(needFile.idx)
          continue
        }
        jetpack.copy(
          path.join(root, id, id + '.mp4'),
          path.join(destination, id + '.mp4'),
          {
            overwrite: false,
          }
        )
        jetpack.copy(
          path.join(root, id, id + '.webp'),
          path.join(destination, id + '.webp'),
          {
            overwrite: false,
          }
        )
        jetpack.copy(
          path.join(root, id, id + '.gif'),
          path.join(destination, id + '.gif'),
          {
            overwrite: false,
          }
        )
      } catch (e: any) {
        if (!e.message.includes('Destination path already exists'))
          console.error('error at moving file ' + needFile, e.message)
      }
    }

    console.log('missing', JSON.stringify(missing, null, 3))
    console.log('missing', missing.length)
  })

program
  .command('moveFiles')
  .arguments('<root> <destination>')
  .action(async (root, destination, options, cmd) => {
    const args = cmd.opts()
    const { verified, creatorKeyPath } = args

    /* const rootFiles = jetpack.list(root) */

    const targetFiles = jetpack.list(destination)

    const needFiles = targetFiles
      ?.filter((f) => f.includes('.mp4'))
      .map((f) => Number(f.split('.')[0]))!

    console.log('needFiles', needFiles)

    for (const needFile of needFiles) {
      try {
        jetpack.copy(
          path.join(root, needFile + '.json'),
          path.join(destination, needFile + '.json'),
          {
            overwrite: true,
          }
        )
        jetpack.copy(
          path.join(root, needFile + '.png'),
          path.join(destination, needFile + '.png'),
          {
            overwrite: true,
          }
        )
      } catch (e: any) {
        console.error('error at moving file ' + needFile, e.message)
      }
    }
  })

program
  .command('adaptMetaForAwakening')
  .argument('<directory>', 'Directory containing images named from 0-n')
  .action(async (directory, options, cmd) => {
    const args = cmd.opts()
    const { verified, creatorKeyPath } = args

    const share = parseFloat(args.share)

    const dirPath = directory
    console.log('dirPath', dirPath)

    const files = fs.readdirSync(dirPath).filter((d) => d.endsWith('.json'))

    const creators = [
      {
        address: '2sPBjQtpQuGx2WQg7kn8mbC1r19AQBPREkcajDDcrbxt',
        verified: 1,
        share: 0,
      },
      {
        address: 'NUKE6VXDcfyb51yvFwU67hDxj2qMgRdkdtUPKy6D3hC',
        verified: 0,
        share: 100,
      },
    ]

    let counter = 0
    for (const file of files) {
      const filePath = path.join(dirPath, file)
      console.log('filePath', filePath)

      const index = Number(file.split('.')[0])

      if (isNaN(index))
        throw new Error('fatal: could not infer index from filename ' + file)

      const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

      config.image = index + '.webp'
      config.animation_url = index + '.mp4'
      config.properties.files = [
        { uri: index + '.webp', type: 'image/webp' },
        { uri: index + '.png', type: 'image/png' },
      ]

      /*  config['seller_fee_basis_points'] = 1000 */

      const attributes = config.attributes

      /*    attributes.push({
        trait_type: 'Awakened',
        value: 'Yes',
      }) */

      config.attributes = attributes

      config.properties.creators = creators

      fs.writeFileSync(filePath, JSON.stringify(config), {})

      counter++
      console.log('counter', counter)
    }
  })

program
  .command('createAwakeningMetaInDb')
  .option('-d --deleteExisitng')
  .argument('<filePath>')
  .action(async (filePath: string, e, cmd) => {
    const { deleteExisitng } = cmd.opts()

    const config = jetpack.read(filePath, 'json')

    let items = (Object.entries((config as any).items) as any[]).map(
      (e: any) => ({
        id: Number([e[0]]),
        ...e[1],
      })
    )

    if (deleteExisitng) {
      console.log('deleting existing')

      await prisma.awakeningMeta.deleteMany({
        where: {
          creator: nukedCollection.creator,
        },
      })
    }

    /* const already = await prisma.awakeningMeta.findMany({
      where: {
        creator: nukedCollection.creator,
      },
    })

    items = items.filter((i) => !already.find((a) => i.id === a.id)) */

    console.log('items.length', items.length)

    await asyncBatch(
      items,
      async (item, i) => {
        try {
          console.log(`${i}: load metadata`)

          /*  itemsWithMeta.push({
            ...item,
            metadata: res.data,
          }) */

          const data = {
            id: item.id,
            newMetadataLink: item.link,
            creator: nukedCollection.creator,
            newMetadata: '',
            nftName: item.name,
            nft: '',
          }

          await prisma.awakeningMeta.upsert({
            where: {
              id_creator: {
                id: item.id,
                creator: nukedCollection.creator,
              },
            },
            create: data,
            update: data,
          })
        } catch (e) {
          console.error(`error at ${item.id}`, e)
        }
      },
      20
    )
  })

program.command('countAwakening').action(async (e) => {
  const awakeningAccounts = await awakeningProgram.account.awakening.all()
})

program.command('awakeningSnapshot').action(async (e) => {
  let awakeningAccounts = await awakeningProgram.account.awakening.all()

  awakeningAccounts = awakeningAccounts.sort(
    (a, b) => a.account.start.toNumber() - b.account.start.toNumber()
  )

  jetpack.write(
    path.join(__dirname, './assets', 'awakeningAccounts.csv'),
    stringify(
      awakeningAccounts.map((a, i) => ({
        count: i,
        start: new Date(a.account.start.toNumber() * 1000).toLocaleString(),
        nft: a.account.mint.toBase58(),
      })),
      { header: true }
    )
  )
})

program.command('snapshotHolders').action(async (e) => {
  console.time('snapshotHolders')
  const stakingAccounts = await stakingProgram.account.stakeAccount.all()
  const evolutionAccounts =
    await evolutionProgram.account.evolutionAccount.all()
  const breedingAccounts = (
    await breedingProgram.account.breedingAccount.all()
  ).filter((e) => !e.account.finished)
  const rentingAccounts = await breedingProgram.account.rentAccount.all()
  const lockedNftAccounts = [
    ...stakingAccounts,
    ...evolutionAccounts,
    ...breedingAccounts,
    ...rentingAccounts,
  ]

  const holders = lockedNftAccounts.map((a) => a.account.authority)

  const rentalUsers = breedingAccounts
    .filter((b) => !!b.account.rentalUser && !b.account.finished)
    .map((b) => b.account.rentalUser)
  holders.push(...(rentalUsers as any))

  const sacMints = (
    require('../src/assets/mints/sac-mints.json') as string[]
  ).map((m: string) => new PublicKey(m))

  const nukedMetas = await Metadata.findMany(connection, {
    creators: [nukedCollection.creator],
  })
  const nukedMints = nukedMetas.map((m) => new PublicKey(m.data.mint))
  console.log('nukedMints', nukedMints.length)

  const walletOwners = (
    await asyncBatch(
      [...sacMints, ...nukedMints],
      async (mint, index, workerIndex) => {
        const token = new spl.Token(
          connection,
          mint,
          spl.TOKEN_PROGRAM_ID,
          wallet
        )
        const tokenAccount = (
          await connection.getTokenLargestAccounts(mint)
        ).value.find((v) => v.uiAmount)!
        const tokenAccountInfo = await token.getAccountInfo(
          tokenAccount.address
        )

        // if not locked in utility
        if (!tokenAccountInfo.owner.equals(tokenAccount.address))
          return tokenAccountInfo.owner
      },
      5
    )
  ).filter((t) => !!t)

  holders.push(...(walletOwners as any))

  const uniquUsers = _.uniqBy(holders, (s) => s.toBase58())

  console.log('uniqueHolders', uniquUsers.length)

  fs.writeFileSync(
    __dirname + '/holders.json',
    JSON.stringify(
      uniquUsers.map((u) => u.toBase58()),
      null,
      3
    )
  )
  console.timeEnd('snapshotHolders')
})

program
  .command('uploadMFConfirmationNfts')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  .option('-k, --keypair <path>', `Solana wallet location`)
  .action(async (options, cmd) => {
    const { keypair, rpcUrl } = cmd.opts()

    const env = config.solanaEnv

    const adminUser = loadWalletKey(
      keypair ?? `${process.env.HOME}/config/solana/cicada.json`
    )

    const image =
      'https://ipfs.io/ipfs/Qmeyarv25EKM5hW2b3NSLigXXCKvRNdqnd8fMMFQ5MyCfz?ext=jpeg'

    /*  const collectionName = 'Something'

    const collectionKeypairFilename = `${__dirname}/assets/cicada/${collectionName
      .toLowerCase()
      .replace(' ', '-')}-collection-${env}.json`

    let collectionKeypairFile: any

    if (fs.existsSync(collectionKeypairFilename)) {
      collectionKeypairFile = JSON.parse(
        fs.readFileSync(collectionKeypairFilename, 'utf-8')
      )
    } */

    const baseMetadata = {
      name: 'Something',
      symbol: 'SOME',
      image: image,
      properties: {
        files: [
          {
            uri: image,
            type: 'image/png',
          },
        ],
        category: 'image',
        creators: [
          /* {
            address: collectionKeypair.publicKey.toBase58(),
            share: 0,
          }, */
          {
            address: adminUser.publicKey.toBase58(),
            share: 100,
            verified: 1,
          },
        ],
      },
      description: 'Something',
      seller_fee_basis_points: 742,
      attributes: [],
      collection: { name: 'Something', family: 'SAC' },
    }

    const productTypes = [
      {
        supply: 1,
        attributes: {
          /*  Step: 0,
          Caesar: 'wxsrihetigvia.gsq/g/wigvix', */
        },
      },
    ]

    const candyMachine = await loadCandyProgramV2(adminUser, env, rpcUrl)

    const connection = candyMachine.provider.connection

    for (const productType of productTypes) {
      try {
        const metadata = _.cloneDeep(baseMetadata)
        metadata.attributes.push(
          // @ts-ignore
          ...Object.entries(productType.attributes).map((a) => ({
            trait_type: a[0],
            value: a[1],
          }))
        )

        const metadataUri =
          'https://arweave.net/AWtqZ6pg0XdhzMhNj1kD9nquKKBfwKH7r2rT0RLv774' /* await ipfsUploadOneFile({
          file: Buffer.from(JSON.stringify(metadata)),
        }) */

        // const users: PublicKey[] = JSON.parse(
        //   fs.readFileSync(
        //     false
        //       ? `${__dirname}/assets/cicada/cicadaUsers-${env}.json`
        //       : `${__dirname}/assets/cicada/cicadaUsers-test.json`,
        //     'utf-8'
        //   )
        // ).map((u: any) => {
        //   return pub(u)
        // })

        // console.log(`${users.length} users`)

        console.time('premint nfts')

        await asyncBatch(
          Array.from(Array(3000).keys()),
          async (user1, i, worker) => {
            try {
              const user = adminUser.publicKey
              console.log(`${i}: start sending to ${user.toBase58()}`)

              const alreadySent =
                await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
                  owner: user,
                  creators: [adminUser.publicKey],
                  withAmount: true,
                })

              console.log('alreadySent', alreadySent.length)
              /* console.log('alreadySent', (await prisma.mintCreator.findMany({where:{}})).length) */

              if (alreadySent.length > 3000) {
                console.log(`${i}: already sent to ${user.toBase58()}`)
                return
              }

              const { tokenPub } = await createNft({
                connection,
                metadata,
                supply: productType.supply,
                metadataLink: metadataUri,
                walletKeypair: adminUser,
                mintTo: user,
                /*  creatorSigners: [collectionKeypair], */

                /* loadWalletKey(
                `${process.env.HOME}/config/solana/phantom.json`
              ).publicKey */
              })

              if (!tokenPub) {
                console.log('failed transaction', productType.supply)
                return
              }
              console.log('token', tokenPub.toBase58())

              console.log(`${i}: finished sending to ${user.toBase58()}`)
            } catch (e) {
              console.error(`${i} error at creating nft`, e)
            }
          },
          5
        )

        console.timeEnd('premint nfts')
      } catch (error) {
        console.error('error at creating token', error)
      }
    }

    process.exit(0)
  })

program.command('saveNukdeMints').action(async () => {
  const nukedMetas = await Metadata.findMany(connection, {
    creators: [nukedCollection.creator],
  })
  const nukedMints = nukedMetas.map((m) => new PublicKey(m.data.mint))

  fs.writeFileSync(
    __dirname + '/nuked-mints.json',
    JSON.stringify(nukedMints, null, 3)
  )
})

type CollectionType = 'nuked' | 'sac'

type MagicJType = 'Type I' | 'Type II' | 'Type III'

const sacMints = require('../src/assets/mints/sac-mints.json') as string[]

const mjTypes = [
  {
    supply: 3780,
    type: 'Type I',
    metadata:
      'https://ipfs.io/ipfs/QmeP48KGaibj1BboMPTQkoCcnZwpRxdjwgvbUrySbndSdt?ext=json',
    attributes: {
      Name: 'Jack',
    },
    creator: pub('EoUAKQX9PcdUuSw1P5NFESjftJ1gSQE5YCXtBVNy967H'),
  },
  {
    supply: 3276,
    type: 'Type II',
    metadata:
      'https://ipfs.io/ipfs/QmRQePPo8pSieVAVDVYsfYkw4m9Ydb15TSsJQScps9qGvy?ext=json',
    attributes: {
      Name: 'Jane',
    },
    creator: pub('4b5jwMXeDcWjoG171rkvmLY2b3TDxds1PiBVyYnoyQDB'),
  },
  {
    supply: 1344,
    type: 'Type III',
    metadata:
      'https://ipfs.io/ipfs/QmSpxFch2XxSDRgozTqo3drUXDLMhG4DJsZ7EYUuL56VPj?ext=json',
    attributes: {
      Name: 'Johnson',
    },
    creator: pub('5x2tNQH5p1rK8GQANzcwuVPyQnzP9LgfumydxMf1er5a'),
  },
]

function getCollection(mint: PublicKey): CollectionType {
  return sacMints.includes(mint.toBase58()) ? 'sac' : 'nuked'
}

program.command('createMjSnapshot').action(async (e) => {
  console.time('snapshotHolders')

  const stakingAccounts = await stakingProgram.account.stakeAccount.all()
  const evolutionAccounts =
    await evolutionProgram.account.evolutionAccount.all()

  const holders: any[] = []

  for (let account of [...stakingAccounts, ...evolutionAccounts]) {
    holders.push({
      user: account.account.authority.toBase58(),
      mint: account.account.token,
      collection: getCollection(account.account.token),
    })
  }

  const breedingAccounts = (
    await breedingProgram.account.breedingAccount.all()
  ).filter((e) => !e.account.finished)

  const rentingAccounts = await breedingProgram.account.rentAccount.all()

  const rentalUsers = breedingAccounts
    .filter((b) => !!b.account.rentalUser && !b.account.finished)
    .map((b) => b.account.rentalUser)

  for (let account of breedingAccounts) {
    holders.push({
      user: account.account.authority.toBase58(),
      mint: account.account.ape1.toBase58(),
      collection: getCollection(account.account.ape1),
    })

    if (!account.account.rentalUser) {
      holders.push({
        user: account.account.authority.toBase58(),
        mint: account.account.ape2.toBase58(),
        collection: getCollection(account.account.ape2),
      })
    } else {
      holders.push({
        user: (account.account.rentalUser as any).toBase58(),
        mint: account.account.ape2.toBase58(),
        collection: getCollection(account.account.ape2),
      })
    }
  }

  for (let account of rentingAccounts) {
    holders.push({
      user: account.account.authority.toBase58(),
      mint: account.account.ape.toBase58(),
      collection: getCollection(account.account.ape),
    })
  }

  const nukedMetas = await Metadata.findMany(connection, {
    creators: [nukedCollection.creator],
  })
  const nukedMints = nukedMetas.map((m) => new PublicKey(m.data.mint))

  await asyncBatch(
    [...sacMints.map((m) => pub(m)), ...nukedMints],
    async (mint, index, workerIndex) => {
      const token = new spl.Token(
        connection,
        mint,
        spl.TOKEN_PROGRAM_ID,
        wallet
      )
      const tokenAccount = (
        await connection.getTokenLargestAccounts(mint)
      ).value.find((v) => v.uiAmount)!
      const tokenAccountInfo = await token.getAccountInfo(tokenAccount.address)

      // if not locked in utility
      if (tokenAccountInfo.owner.equals(tokenAccount.address)) return null

      holders.push({
        user: tokenAccountInfo.owner.toBase58(),
        mint: mint.toBase58(),
        collection: getCollection(mint),
      })
    },
    5
  )

  const rolesDistribution = {
    nuked: {
      'Type I': 0.9,
      'Type II': 0.08,
      'Type III': 0.02,
    },
    sac: {
      'Type II': 0.8,
      'Type III': 0.2,
    },
  }

  holders.forEach((h) => {
    h.type = weighted.select((rolesDistribution as any)[h.collection])
  })

  fs.writeFileSync(
    __dirname + '/assets/mj-airdrop/holders.json',
    JSON.stringify(holders, null, 3)
  )
  console.timeEnd('snapshotHolders')
})

program
  .command('sendoutMjNfts')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  .option('-k, --keypair <path>', `Solana wallet location`)
  .action(async (options, cmd) => {
    const { keypair, rpcUrl } = cmd.opts()

    const env = config.solanaEnv

    const adminUser = loadWalletKey(
      keypair ?? `${process.env.HOME}/config/solana/mj-airdrop.json`
    )

    const nfts = await getNftsFromOwnerByCreators({
      owner: adminUser.publicKey,
      creators: [adminUser.publicKey],
      withAmount: true,
    })

    console.log('nfts', nfts.length)

    process.exit(0)
  })

program
  .command('createMjNfts')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  .option('-k, --keypair <path>', `Solana wallet location`)
  .option('--reverse', 'send out nfts reverse')
  .option('--start <string>', 'send out nfts reverse')
  .action(async (options, cmd) => {
    const { keypair, rpcUrl, reverse, start: startStr } = cmd.opts()

    const start = Number(startStr)

    const env = config.solanaEnv

    const adminUser = loadWalletKey(
      keypair ?? `${process.env.HOME}/config/solana/mj-airdrop.json`
    )

    const candyMachine = await loadCandyProgramV2(
      adminUser,
      env,
      config.rpcHost
    )

    const connection = candyMachine.provider.connection

    let holders = require('./assets/mj-airdrop/holders.json') as {
      mint: string
      user: string
      collection: 'nuked' | 'sac'
      type: string
    }[]

    if (start) holders = holders.slice(start)

    if (reverse) holders = holders.reverse()

    await asyncBatch(
      holders,
      async (holder, i, worker) => {
        let counter = i + (start || 0)
        try {
          if (
            await prisma.alreadyMinted.findUnique({
              where: {
                nft: holder.mint,
              },
            })
          ) {
            return console.log(`${counter}: already minted`)
          }

          console.log(
            `${counter}: start sending to ${holder.user} mint: ${holder.mint} type: ${holder.type} `
          )

          const productType = mjTypes.find((m) => m.type == holder.type)!

          const metadata = {}
          const { tokenPub, tx } = await createNft({
            connection,
            metadata,
            supply: 1,
            metadataLink: productType.metadata,
            walletKeypair: adminUser,
            mintTo: pub(holder.user),
            verifyCreators: true,
            /*  creatorSigners: [collectionKeypair], */

            /* loadWalletKey(
                `${process.env.HOME}/config/solana/phantom.json`
              ).publicKey */
          })

          await prisma.alreadyMinted.create({
            data: {
              nft: holder.mint,
              user: holder.user,
              tx,
              newNft: tokenPub.toBase58(),
            },
          })

          if (!tokenPub) {
            console.log(`${counter}: failed transaction`, productType.supply)
            return
          }
          console.info(`${counter}: NFT created:  ${tokenPub.toBase58()}`)

          console.log(
            `${counter}: finished sending to ${holder.user} mint: ${holder.mint} type: ${holder.type} `
          )
        } catch (e) {
          console.error(`${counter} error at creating nft`, e)
        }
      },
      5
    )

    console.timeEnd('premint nfts')

    process.exit(0)
  })

program
  .command('uploadCicadaNfts')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  .option('-k, --keypair <path>', `Solana wallet location`)
  .action(async (options, cmd) => {
    const { keypair, rpcUrl } = cmd.opts()

    const env = config.solanaEnv

    const adminUser = loadWalletKey(
      keypair ?? `${process.env.HOME}/config/solana/cicada.json`
    )

    const image =
      'https://ipfs.io/ipfs/QmaNzrwwVSqPyYwiiaHNyjeXQBiYjPRpkjznSxqETDHuFV?ext=gif'

    const baseMetadata = {
      name: 'Moon-Fuel Confirmation',
      symbol: 'MFC',
      image: image,
      properties: {
        files: [
          {
            uri: image,
            type: 'image/png',
          },
        ],
        category: 'image',
        creators: [
          /* {
            address: collectionKeypair.publicKey.toBase58(),
            share: 0,
          }, */
          {
            address: adminUser.publicKey.toBase58(),
            share: 100,
            verified: 1,
          },
        ],
      },
      description: 'Something',
      seller_fee_basis_points: 742,
      attributes: [],
      collection: { name: 'Something', family: 'SAC' },
    }

    const productTypes = [
      {
        supply: 1,
        attributes: {
          /*  Step: 0,
          Caesar: 'wxsrihetigvia.gsq/g/wigvix', */
        },
      },
    ]

    const candyMachine = await loadCandyProgramV2(adminUser, env, rpcUrl)

    const connection = candyMachine.provider.connection

    for (const productType of productTypes) {
      try {
        const metadata = _.cloneDeep(baseMetadata)
        metadata.attributes.push(
          // @ts-ignore
          ...Object.entries(productType.attributes).map((a) => ({
            trait_type: a[0],
            value: a[1],
          }))
        )

        const metadataUri =
          'https://arweave.net/AWtqZ6pg0XdhzMhNj1kD9nquKKBfwKH7r2rT0RLv774'

        console.time('premint nfts')

        await asyncBatch(
          Array.from(Array(3000).keys()),
          async (user1, i, worker) => {
            try {
              const user = adminUser.publicKey
              console.log(`${i}: start sending to ${user.toBase58()}`)

              const alreadySent =
                await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
                  owner: user,
                  creators: [adminUser.publicKey],
                  withAmount: true,
                })

              console.log('alreadySent', alreadySent.length)
              /* console.log('alreadySent', (await prisma.mintCreator.findMany({where:{}})).length) */

              if (alreadySent.length > 3000) {
                console.log(`${i}: already sent to ${user.toBase58()}`)
                return
              }

              const { tokenPub } = await createNft({
                connection,
                metadata,
                supply: productType.supply,
                metadataLink: metadataUri,
                walletKeypair: adminUser,
                mintTo: user,
                /*  creatorSigners: [collectionKeypair], */

                /* loadWalletKey(
                `${process.env.HOME}/config/solana/phantom.json`
              ).publicKey */
              })

              if (!tokenPub) {
                console.log('failed transaction', productType.supply)
                return
              }
              console.log('token', tokenPub.toBase58())

              console.log(`${i}: finished sending to ${user.toBase58()}`)
            } catch (e) {
              console.error(`${i} error at creating nft`, e)
            }
          },
          5
        )

        console.timeEnd('premint nfts')
      } catch (error) {
        console.error('error at creating token', error)
      }
    }

    process.exit(0)
  })

program
  .command('sendOutCicadaNfts')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  .action(async (options, cmd) => {
    const {} = cmd.opts()
    const adminUser = loadWalletKey(
      `${process.env.HOME}/config/solana/cicada.json`
    )
    /* 
    const nukedWLCsv = csv.parseFile(__dirname+'/nukedWl.csv')
    console.log('nukedWl', await nukedWLCsv.read()) */

    const isTest = false
    let users: PublicKey[] = (
      isTest
        ? await jetpack.readAsync(`${__dirname}/testUsers.json`, 'json')
        : await jetpack.readAsync(`${__dirname}/holders.json`, 'json')
    ).map((a: string) => pub(a))

    users = users

    let nftIndex = 0

    console.log('users', users.length)
    console.log('user example', users[0].toBase58())

    console.log('loading cicada nft from wallet')
    const nfts = (
      await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
        owner: adminUser.publicKey,
        creators: [adminUser.publicKey],
        withAmount: true,
      })
    ).reverse()
    console.log(`nfts in cicada wallet: ${nfts.length}`)

    await asyncBatch(
      users,
      async (user, index, workerIndex) => {
        try {
          const alreadySent =
            await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
              owner: user,
              creators: [adminUser.publicKey],
              withAmount: true,
            })
          if (alreadySent.length > 0) {
            console.log(`${index}: already sent to ${user.toBase58()}`)
            return
          }

          const nft = nfts[nftIndex]
          nftIndex++

          const sendInstr = await createTransferInstruction({
            mint: nft.mint,
            amount: 1,
            from: adminUser.publicKey,
            to: user,
          })

          const blockHash = await connection.getRecentBlockhash()

          const transaction = new Transaction({
            recentBlockhash: blockHash.blockhash,
            feePayer: adminUser.publicKey,
          }).add(...sendInstr)

          const tx = await Reattempt.run({ times: 3 }, async () => {
            const tx = await connection.sendTransaction(transaction, [
              adminUser,
            ])
            await connection.confirmTransaction(tx, 'recent')
            return tx
          })
          console.log(`${index}: sent nft to ${user.toBase58()}, tx: ${tx}`)
        } catch (e) {
          console.error(
            `${index}: error in sending nft to ${user.toBase58()}`,
            e
          )
        }
      },
      3
    )
    process.exit(0)
  })

program
  .command('updateOrderState')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  .option('-k, --keypair <path>', `Solana wallet location`)
  .action(async (options, cmd) => {
    const { keypair, rpcUrl } = cmd.opts()

    const orderList = await csvtojson().fromFile(
      __dirname + '/cbdOrdersTracking.csv',
      {}
    )

    console.log('orderList', orderList)

    for (let order of orderList) {
      if (order.trackingCode) {
        const shippingLink =
          'https://www.post.at/en/sv/item-details?snr=' + order.trackingCode
        await prisma.cbdOrder.update({
          where: {
            id: Number(order.field1),
          },
          data: {
            shippingLink,
            status: 'Shipped',
          },
        })
      }
    }

    return

    const env = config.solanaEnv

    const adminUser = loadWalletKey(
      keypair ?? `${process.env.HOME}/config/solana/mf-order-confirmation.json`
    )

    const candyMachine = await loadCandyProgramV2(adminUser, env, rpcUrl)

    const connection = candyMachine.provider.connection

    console.time('premint nfts')

    const users = await prisma.cbdUser.findMany({
      where: {
        wallet: '5B8x9nwxyas7AntXiGGncA8DxDYGKH3ubCnwCDzNy6Sg',
      },
      include: {
        orders: {
          include: {
            products: true,
          },
        },
      },
    })

    console.log(
      'users',
      users[0].orders.map((o) => o.products)
    )

    console.log(`found ${users.length} users`)

    await asyncBatch(
      users,
      async (user, i, worker) => {
        try {
          const userPubkey = pub(user.wallet)
          console.log(`${i}: start sending to ${userPubkey.toBase58()}`)

          const alreadySent =
            await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
              owner: userPubkey,
              creators: [adminUser.publicKey],
              withAmount: true,
            })
        } catch (e) {
          console.error(`${i} error at creating nft`, e)
        }
        console.log('\n')
      },
      1
    )

    console.timeEnd('premint nfts')

    process.exit(0)
  })

program.command('loadAuctionNfts').action(async () => {
  const metaDatas = await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
    owner: pub('NUKE6VXDcfyb51yvFwU67hDxj2qMgRdkdtUPKy6D3hC'),
    creators: [pub('NUKE6VXDcfyb51yvFwU67hDxj2qMgRdkdtUPKy6D3hC')],
  })

  console.log(
    'metaDatas',
    metaDatas.map((m) => m.mint.toBase58())
  )
})

program.command('updateOrderStateNfts').action(async () => {
  const metaDatas = await Metadata.findMany(connection, {
    creators: [
      pub('29j2diWsLiuRoNAGJQMCugKuJZR8SY4mtwkiPwrdEKLM'),
      pub('HfntvzhvcLHypizovmGjWTBBKr1vPcqdMG6s2Cyyit7k'),
    ],
  })

  const nfts = await prisma.tokenMetadata.findMany({
    where: {
      mint: { in: metaDatas.map((m) => m.data.mint) },
    },
  })

  console.log('nfts', nfts.length)

  /* console.log('shouldUpdateNfts', nfts.length) */

  for (let nft of nfts) {
    const metadata: any = JSON.parse(nft.data)

    metadata.attributes.forEach((a: any) => {
      if (a.trait_type === 'Order Status') {
        a.value = 'Shipped'
      }
    })

    await prisma.tokenMetadata.update({
      where: {
        mint: nft.mint,
      },
      data: {
        data: JSON.stringify(metadata),
      },
    })
  }
})

program
  .command('sendoutConfirmationNfts')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  .option('-k, --keypair <path>', `Solana wallet location`)
  .action(async (options, cmd) => {
    const { keypair, rpcUrl } = cmd.opts()

    const env = config.solanaEnv

    const adminUser = loadWalletKey(
      keypair ?? `${process.env.HOME}/config/solana/mf-order-confirmation.json`
    )

    const penConfirmationPk = loadWalletKey(
      `${process.env.HOME}/config/solana/pen-confirmation.json`
    )

    const oilConfirmationPk = loadWalletKey(
      `${process.env.HOME}/config/solana/tincture-confirmation.json`
    )

    const vapeImage =
      'https://ipfs.io/ipfs/QmaNzrwwVSqPyYwiiaHNyjeXQBiYjPRpkjznSxqETDHuFV?ext=gif'

    const oilImage =
      'https://ipfs.io/ipfs/QmenQzJst8BivTYHR2wJikTWtkbeRv1kaYBk1jEn7QSTHf?ext=gif'

    const metadatas = [
      {
        name: 'Vape Pen Order Status',
        symbol: 'VPOS',
        image: vapeImage,
        properties: {
          files: [
            {
              uri: vapeImage,
              type: 'image/gif',
            },
          ],
          category: 'image',
          creators: [
            {
              address: 'HfntvzhvcLHypizovmGjWTBBKr1vPcqdMG6s2Cyyit7k',
              share: 0,
            },
            {
              address: adminUser.publicKey.toBase58(),
              share: 100,
              verified: 1,
            },
          ],
        },
        description:
          'This shows your order status of the Moon Fuel CBD Vape Pen.',
        seller_fee_basis_points: 742,
        attributes: [
          {
            trait_type: 'Product',
            value: 'HfntvzhvcLHypizovmGjWTBBKr1vPcqdMG6s2Cyyit7k',
          },
          {
            trait_type: 'Product Name',
            value: 'Moon Fuel - Vape Pen Tincture',
          },
          {
            trait_type: 'Order Status',
            value: 'Confirmed',
          },
          {
            trait_type: 'Check',
            value: 'https://www.stonedapecrew.com/store/orders',
          },
          {
            trait_type: 'description',
            value:
              'This shows your order status of the Moon Fuel CBD Vape Pen.',
          },
        ],
        collection: { name: 'MF Order Status', family: 'SAC' },
      },
      {
        name: 'CBD Tincture Order Status',
        symbol: 'TOS',
        image: oilImage,
        properties: {
          files: [
            {
              uri: oilImage,
              type: 'image/gif',
            },
          ],
          category: 'image',
          creators: [
            {
              address: '29j2diWsLiuRoNAGJQMCugKuJZR8SY4mtwkiPwrdEKLM',
              share: 0,
            },
            {
              address: adminUser.publicKey.toBase58(),
              share: 100,
              verified: 1,
            },
          ],
        },
        description:
          'This shows your order status of the Moon Fuel CBD Tincture.',
        seller_fee_basis_points: 742,
        attributes: [
          {
            trait_type: 'Product',
            value: '29j2diWsLiuRoNAGJQMCugKuJZR8SY4mtwkiPwrdEKLM',
          },
          {
            trait_type: 'Product Name',
            value: 'Moon Fuel - CBD Tincture',
          },
          {
            trait_type: 'Order Status',
            value: 'Confirmed',
          },
          {
            trait_type: 'Check',
            value: 'https://www.stonedapecrew.com/store/orders',
          },
          {
            trait_type: 'description',
            value:
              'This shows your order status of the Moon Fuel CBD Tincture.',
          },
        ],
        collection: { name: 'MF Order Status', family: 'SAC' },
      },
    ]

    const candyMachine = await loadCandyProgramV2(adminUser, env, rpcUrl)

    const connection = candyMachine.provider.connection

    console.time('premint nfts')

    const users = await prisma.cbdUser.findMany({
      where: {
        wallet: '5B8x9nwxyas7AntXiGGncA8DxDYGKH3ubCnwCDzNy6Sg',
      },
      include: {
        orders: {
          include: {
            products: true,
          },
        },
      },
    })

    console.log(
      'users',
      users[0].orders.map((o) => o.products)
    )

    /* users.unshift({
      wallet: pub('6cmHazPRANNWpqNsivWLVST77xN35KqJHFgg9KGeDAw5'),
      orders: [
        {
          products: [
            {
              nft: '29j2diWsLiuRoNAGJQMCugKuJZR8SY4mtwkiPwrdEKLM',
            },
          ],
        },
      ],
    } as any) */

    console.log(`found ${users.length} users`)

    await asyncBatch(
      users,
      async (user, i, worker) => {
        try {
          const userPubkey = pub(user.wallet)
          console.log(`${i}: start sending to ${userPubkey.toBase58()}`)

          const alreadySent =
            await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
              owner: userPubkey,
              creators: [adminUser.publicKey],
              withAmount: true,
            })

          for (let product of _.flatten(user.orders.map((o) => o.products))) {
            const metadata = metadatas.find((m) =>
              m.properties.creators.find((c) => c.address === product.nft)
            )
            if (!metadata) throw new Error('Fatal Error: metadata not found')
            if (
              alreadySent.find((a) =>
                a.metadata.data.data.creators?.find(
                  (c) => product.nft === c.address
                )
              )
            ) {
              console.log(`${i}: already sent to ${userPubkey.toBase58()}`)
              continue
            }

            const { tokenPub } = await createNft({
              connection,
              metadata,
              metadataLink: '',
              walletKeypair: adminUser,
              mintTo: userPubkey,
            })

            if (!tokenPub) {
              throw new Error('no pub key')
            }
            console.log('token', tokenPub.toBase58())

            console.log(`${i}: finished sending to ${userPubkey.toBase58()}`)
          }
        } catch (e) {
          console.error(`${i} error at creating nft`, e)
        }
        console.log('\n')
      },
      1
    )

    console.timeEnd('premint nfts')

    process.exit(0)
  })

program.command('sendNukedWhitelistToken').action(async (options, cmd) => {
  const {} = cmd.opts()
  const nukedUser = loadWalletKey(
    `${process.env.HOME}/config/solana/nuked.json`
  )
  /* 
    const nukedWLCsv = csv.parseFile(__dirname+'/nukedWl.csv')
    console.log('nukedWl', await nukedWLCsv.read()) */

  const rows: any[] = []

  fs.createReadStream(__dirname + '/holders-rent.csv')
    .pipe(csv.parse({ headers: true }))
    .on('error', (error: any) => console.error(error))
    .on('data', (row: any) => rows.push(row))
    .on('end', async (rowCount: number) => {
      console.log('row', rows[0])

      const parseErrors: any = []
      const users = rows
        .map((r) => {
          try {
            return new PublicKey(r['address'])
          } catch (error: any) {
            parseErrors.push(error)
            return null
          }
        })
        .filter((r) => !!r) as PublicKey[]

      console.log('parseErrors', parseErrors.length)

      console.log('users', users.length)

      await asyncBatch(
        users,
        async (user, index, workerIndex) => {
          const tokenAccount = await getTokenAccount(
            connection,
            config.nuked.whiteListToken,
            user!
          )
          if (
            tokenAccount &&
            tokenAccount.account.data.parsed.info.tokenAmount.uiAmount > 0
          ) {
            console.log('user has token already', user.toBase58())

            return
          }

          const sendInstr = await createTransferInstruction({
            mint: config.nuked.whiteListToken,
            amount: 1,
            from: nukedUser.publicKey,
            to: user,
          })

          const blockHash = await connection.getRecentBlockhash()

          const transaction = new Transaction({
            recentBlockhash: blockHash.blockhash,
            feePayer: nukedUser.publicKey,
          }).add(...sendInstr)

          try {
            await Reattempt.run({ times: 3 }, async () => {
              const tx = await connection.sendTransaction(transaction, [
                nukedUser,
              ])
              await connection.confirmTransaction(tx)
              console.log('tx confirmed', tx)
            })
          } catch (e: any) {
            console.error('errr in sendin token', user.toBase58())
          }

          console.log(`done: index ${index}, workerIndex ${workerIndex}`)
        },
        5
      )
    })
})

program
  .command('nftsByOwnerAndCreatorSpeedTest')
  .action(async (bs58Str: string, options, cmd) => {
    const adminUser = loadWalletKey(
      `${process.env.HOME}/config/solana/cicada.json`
    )

    console.time('getNftsFromOwnerByCreatorsWithoutOfChainMeta')
    const inWallet = await getNftsFromOwnerByCreatorsWithoutOfChainMeta({
      owner: adminUser.publicKey,
      creators: [adminUser.publicKey],
      withAmount: true,
    })
    console.timeEnd('getNftsFromOwnerByCreatorsWithoutOfChainMeta')

    console.log('alreadySent', inWallet.length)

    console.time('findByOwnerV2')
    const nfts = await Metadata.findByOwnerV2(connection, adminUser.publicKey)
    console.timeEnd('findByOwnerV2')
    console.log('nfts', nfts.length)
  })

program
  .command('convertBs58ToBuffer')
  .argument('<bs58Str>')
  .action(async (bs58Str: string, options, cmd) => {
    const buffer = bs58.decode(bs58Str)

    console.log('u8 array', Uint8Array.from(buffer))
  })

program
  .command('testPrismaRescueMintError')
  .action(async (bs58Str: string, options, cmd) => {
    const rescueMintError = await prisma.rescueMintError.create({
      data: {
        user: 'test',
        revealTx: 'test',
        mintTx: 'test',
      },
    })
  })

program.command('breedingAccounts').action(async (options, cmd) => {
  const breedingAccounts = await breedingProgram.account.breedingAccount.all()

  console.log('breedingAccounts', breedingAccounts.length)
})

program
  .command('hashList')
  .arguments('<cm>')
  .action(async (candyMachineId, e) => {
    const stonedApesProd = '7RCBr3ZQ8yhY4jHpFFo3Kmh7MnaCPi1bFuUgXUB9WURf'
    const hashList = await fetchHashTable(candyMachineId)

    console.log('hashlist', hashList, hashList.length)

    /* fs.writeFileSync('hashListWithoutMeta.json', JSON.stringify(hashList)) */
  })

program.command('debugAddress').action(async (candyMachineId, e) => {
  const apeUsedAddress = await PublicKey.findProgramAddress(
    [
      Buffer.from('apeUsed'),
      new PublicKey('5DxD5ViWjvRZEkxQEaJHZw2sBsso6xoXx3wGFNKgXUzE').toBuffer(),
    ],
    breedingProgramId
  )
  const apeUsedAccount = await breedingProgram.account.apeUsed.fetch(
    apeUsedAddress[0]
  )

  console.log('apeUsedAccount', apeUsedAccount)

  /* fs.writeFileSync('hashListWithoutMeta.json', JSON.stringify(hashList)) */
})

program.command('debug').action(async (candyMachineId, e) => {
  const nuked = loadWalletKey(`${process.env.HOME}/config/solana/nuked.json`)

  const blockHash = await connection.getRecentBlockhash()
  const trans = new Transaction({ recentBlockhash: blockHash.blockhash }).add(
    SystemProgram.transfer({
      /*  basePubkey: nuked.publicKey, */
      fromPubkey: new PublicKey('D9hidBDDauvAYWY9jkNt6YfPxtcC7HgWm5sNNHAobC3A'),
      toPubkey: nuked.publicKey,
      lamports: 17 * web3.LAMPORTS_PER_SOL,
    })
  )
  const tx = await connection.sendTransaction(trans, [nuked])
  console.log('tx', tx)

  await connection.confirmTransaction(tx)

  /* fs.writeFileSync('hashListWithoutMeta.json', JSON.stringify(hashList)) */
})

program.command('debugTokenAccount').action(async (candyMachineId, e) => {
  const mint = new PublicKey('9UqRqJA2QxJemQi4AFPSoUjKhPUq7w2SriNPmfazzLkw')
  const user = new PublicKey('4iXYZBFHRSj6edYzYH3wyzwVTukV4wjzvhn6Pjs4JbNm')
  const tokenAccount = await getTokenAccount(connection, mint, user)

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(user, {
    mint: mint,
  })

  const userTokenAccount = tokenAccounts.value.find(
    (t) => t.account.data.parsed.info.tokenAmount.uiAmount
  )

  console.log('tokenAccount', JSON.stringify(tokenAccount, null, 3))

  console.log('tokenAccount', userTokenAccount)
})

program.command('nfts.get').action(async (e) => {
  console.time('nfts.get')
  console.log('start loading')

  /* const nukedApes = await rpc.query('nfts.get', {
    creatorId: nuked.creator.toBase58(),
  })
  console.timeEnd('nfts.get')

  console.log('nukedApes', nukedApes) */

  /* fs.writeFileSync('hashListWithoutMeta.json', JSON.stringify(hashList)) */
})

program.command('snapshotBestBuds').action(async (candyMachineId, e) => {
  const nuked = loadWalletKey(`${process.env.HOME}/config/solana/nuked.json`)

  const stakingAccounts = await allStakingProgram.account.stakeAccount.all()

  const mapped = stakingAccounts.map((s) => ({
    user: s.account.authority,
    mint: s.account.token,
  }))

  fs.writeFileSync(
    __dirname + '/bestBuds.json',
    JSON.stringify(mapped, null, 3)
  )
})

program.command('load').action(async (candyMachineId, e) => {
  const nuked = loadWalletKey(`${process.env.HOME}/config/solana/nuked.json`)

  const nfts = await getNftsFromOwnerByCreators({
    owner: merchConfigOgBox.wallet,
    creators: [
      /* pub('2rqTqd5kHBgQSgAZds3aBT8mPF7oPzq76iUBu5P3hiUL') */ merchConfigOgBox.boxCreator,
    ],
    withAmount: false,
  })

  const products = nfts.map((n) => ({
    amount: n.tokenAccount.account.data.parsed.info.tokenAmount.uiAmount,
    size: n.nft.attributes.find((a) => a.trait_type === 'Size')?.value!,
    mint: new PublicKey(n.tokenAccount.account.data.parsed.info.mint),
    name: n.nft.collection.name,
  }))

  console.log('products', products)

  console.log(
    'sum',
    _.sumBy(products, (p) => p.amount)
  )
})

program.command('loadOld').action(async (candyMachineId, e) => {
  const nuked = loadWalletKey(`${process.env.HOME}/config/solana/nuked.json`)

  const nfts = await getNftsFromOwnerByCreators({
    owner: merchConfigOgBox.wallet,
    creators: [pub('2rqTqd5kHBgQSgAZds3aBT8mPF7oPzq76iUBu5P3hiUL')],
    withAmount: false,
  })

  const products = nfts.map((n) => ({
    amount: n.tokenAccount.account.data.parsed.info.tokenAmount.uiAmount,
    size: n.nft.attributes.find((a) => a.trait_type === 'Size')?.value!,
    mint: new PublicKey(
      n.tokenAccount.account.data.parsed.info.mint
    ).toBase58(),
    name: n.nft.collection.name,
  }))

  console.log('products', products)

  console.log(
    'sum',
    _.sumBy(products, (p) => p.amount)
  )
})

program.command('loadOgBoxBoth').action(async (candyMachineId, e) => {
  const nuked = loadWalletKey(`${process.env.HOME}/config/solana/nuked.json`)

  const nfts = await getNftsFromOwnerByCreators({
    owner: merchConfigOgBox.wallet,
    creators: [merchConfigOgBox.boxCreator],
    withAmount: false,
  })

  const products = nfts.map((n) => ({
    amount: n.tokenAccount.account.data.parsed.info.tokenAmount.uiAmount,
    size: n.nft.attributes.find((a) => a.trait_type === 'Size')?.value!,
    mint: new PublicKey(
      n.tokenAccount.account.data.parsed.info.mint
    ).toBase58(),
    name: n.nft.collection.name,
  }))

  console.log('products', products)
  console.log('products.length', products.length)

  console.log(
    'mints',
    products.map((p) => p.mint)
  )
})

program.command('checkBoxOrders').action(async (options, cmd) => {
  const { candyMachineId } = cmd.opts()

  let rawTransactions = []

  const lastDate = new Date('2022-03-08T21:00:00+00:00')
  let id = ''
  let offset = 0

  while (true) {
    const res: any = await axios.get(
      `https://api.solscan.io/account/token/txs?address=${merchBurnWalletOg}&limit=10&offset=${offset}
      `
    )
    offset += 10

    const trans = res.data.data.tx.transactions
      .map((raw: any) => ({ ...raw, time: new Date(raw.blockTime * 1000) }))
      .filter((trans: any) => {
        return trans.time.getTime() > lastDate.getTime()
      })

    rawTransactions.push(...trans)

    if (trans.length > 0) console.log('last time', trans[trans.length - 1].time)

    console.log('trans.length', trans.length)

    if (trans.length < 10) break

    id = trans[9].txHash
  }

  const alreadyRedeemed = _.flatten(
    Array.from(Array(2).keys()).map(
      (f) =>
        require(`./missingBoxOrders/missingOrdersUsersOld${
          f + 1
        }.json`) as any[]
    )
  )

  console.log('before rawTransactions', rawTransactions.length)

  rawTransactions = rawTransactions.filter(
    (t) =>
      t.signer[0] != merchBurnWalletOg.toBase58() &&
      !alreadyRedeemed.find((a: any) => a.wallet == t.signer[0])
  )

  console.log('rawTransactions', rawTransactions.length)

  const signers = rawTransactions.map((t) => t.signer[0])

  const orders = await prisma.boxOrder.findMany({
    where: {
      /*  user: {
        wallet: { in: signers },
      }, */
      transferNftTx: { in: rawTransactions.map((t) => t.txHash) },
    },
    include: { user: true },
  })

  console.log('orders.length', orders.length)

  const missingOrdersTrans = rawTransactions.filter(
    (t) => !orders.find((o) => o.transferNftTx === t.txHash)
  )

  console.log('missingOrders.length', missingOrdersTrans.length)

  fs.writeFileSync(
    __dirname + '/missingOrdersRedeemTrans.json',
    JSON.stringify(missingOrdersTrans, null, 3)
  )
  fs.writeFileSync(
    __dirname + '/missingOrdersUsers.json',
    JSON.stringify(
      missingOrdersTrans.map((o) => o.signer[0]),
      null,
      3
    )
  )
})

program.command('sendTokenBackAtMissingOrders').action(async (o, c) => {
  const merchBurnerUser = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.MERCH_BURNER_WALLET as string))
  )

  console.log('merchBurnerUser', merchBurnerUser.publicKey.toBase58())

  let failedOrdersTrans: any[] = require('./missingBoxOrders/missingOrdersRedeemTransOld2.json')
  const alreadyResolved: any[] = require('./missingBoxOrders/missingOrdersUsersOld2.json')
  const failedSendBackTrans: any[] = []
  const successTxs: string[] = []

  failedOrdersTrans = failedOrdersTrans.filter(
    (f) => !alreadyResolved.find((a) => f.signer[0] === a.wallet && a.resolved)
  )

  for (let failedOrder of failedOrdersTrans) {
    try {
      const user = pub(failedOrder.signer[0])
      const nft = pub(failedOrder.change.tokenAddress)
      console.log(
        'failedOrder.change.tokenAddress',
        failedOrder.change.tokenAddress
      )

      const instructions: TransactionInstruction[] = []
      const transferNftInstructions = await createTransferInstruction({
        from: merchBurnWalletOg,
        to: user,
        mint: nft,
        amount: 1,
        payer: merchBurnWalletOg,
      })
      instructions.push(...transferNftInstructions)

      const blockhash = await connection.getRecentBlockhash()
      const transaction = new Transaction({
        recentBlockhash: blockhash.blockhash,
        feePayer: merchBurnWalletOg,
      }).add(...instructions)

      const tx = await connection.sendTransaction(transaction, [
        merchBurnerUser,
      ])
      await connection.confirmTransaction(tx, 'confirmed')
      successTxs.push(tx)
      console.log('worked', tx)
    } catch (e) {
      console.error('failedSendBackTrans', e, {
        txHash: failedOrder.txHash,
        user: failedOrder.signer[0],
      })
      failedSendBackTrans.push(failedOrder)
    }
  }
  fs.writeFileSync(
    __dirname + '/failedSendBackTrans.json',
    JSON.stringify(failedSendBackTrans, null, 3)
  )
  fs.writeFileSync(
    __dirname + '/successSendBackTrans.json',
    JSON.stringify(successTxs, null, 3)
  )
})

program.command('loadMerchTrans').action(async (options, cmd) => {
  const { candyMachineId } = cmd.opts()

  const rawTransactions = []

  const lastDate = new Date('2022-03-06T20:55:00+00:00')
  let id = ''

  while (true) {
    const res: any = await axios.get(
      `https://api.solscan.io/account/transaction?address=7TBvezty1TbDdaxcJ4a42NeS74tUUd9myc4BzPKcaH58${
        id ? `&before=${id}` : ''
      }`
    )

    const trans = res.data.data
      .map((raw: any) => ({ ...raw, time: new Date(raw.blockTime * 1000) }))
      .filter((trans: any) => {
        return trans.time.getTime() > lastDate.getTime()
      })

    rawTransactions.push(...trans)

    console.log('trans', trans[0])

    if (trans.length > 0) console.log('last time', trans[trans.length - 1].time)

    console.log('trans.length', trans.length)

    if (trans.length < 10) break

    id = trans[9].txHash
  }

  console.log('rawTransactions', rawTransactions.length)

  const transactions = []
})

program.command('loadMerchTransBurner').action(async (options, cmd) => {
  const { candyMachineId } = cmd.opts()

  const rawTransactions = []

  const lastDate = new Date('2022-03-06T21:00:00+00:00')
  let id = ''

  while (true) {
    const res: any = await axios.get(
      `https://api.solscan.io/account/transaction?address=Fde8qhkD1HxjMUDtwJ5Zfs5zSA5hbLuiTPeCfamL3ynj${
        id ? `&before=${id}` : ''
      }`
    )

    const trans = res.data.data
      .map((raw: any) => ({ ...raw, time: new Date(raw.blockTime * 1000) }))
      .filter((trans: any) => {
        return trans.time.getTime() > lastDate.getTime()
      })

    rawTransactions.push(...trans)

    console.log('trans', trans[0])

    if (trans.length > 0) console.log('last time', trans[trans.length - 1].time)

    console.log('trans.length', trans.length)

    if (trans.length < 10) break

    id = trans[9].txHash
  }

  console.log('rawTransactions', rawTransactions.length)

  const transactions = []

  /* 

  for (let trans of rawTransactions) {
    const transaction = await connection.getParsedTransaction(trans.txHash)
    console.log(
      'transaction?.meta?.logMessages?[1]',
      transaction?.meta?.logMessages
    )

    if (!transaction?.meta?.logMessages) continue

    if (!transaction.meta.logMessages[1].includes('Reveal')) continue

    const user = transaction.meta.fee

    transactions.push({ user, tx: trans.txHash })
  }

  console.log('failedUsers', transactions.length)

  fs.writeFileSync(
    __dirname + 'transactions.json',
    JSON.stringify(transactions, null, 3)
  ) */
})

program.command('getCbdUser').action(async (o) => {
  const boxUser = await prisma.boxUser.findMany()
  const cbdUser = await prisma.cbdUser.findMany({
    where: {
      wallet: {
        in: boxUser.map((u) => u.wallet),
      },
    },
  })
  console.log('ino', cbdUser.length)

  console.log('cbdUser', cbdUser.length)
})

program.command('createMerchOrder').action(async (options, cmd) => {
  const args = {
    wallet: 'Fau7jNCH71tyzw9hRxbDpobpEbukpCEAjkB1USwAtmMW',
    firstname: 'Alexander',
    lastname: 'Diaz',
    email: 'alexcd18@gmail.com',
    street: '6100 Pathway Court',
    zip: '76016',
    city: 'Arlington',
    country: 'United States',
    orders: {
      create: {
        note: '',
        mint: '9N7gyQTbv8ypU553n3iF5sZzkNSD33y6XHDyWazLVZHf',
        size: 'L',
        transferNftTx: 'manual',
        product: 'DgdbdvVbMYHQyM7N7ZYp8fwysGzCVGdn8PJ12P5cvv49',
        productName: 'SAC OG Box',
        image:
          'https://ipfs.io/ipfs/QmTfY1YAPhibkHL3z1WWrzg1ydsM4mzJneH1gP3UwXiMuF?ext=gif',
      },
    },
  }
  const user = await prisma.boxUser.upsert({
    where: {
      wallet: args.wallet,
    },
    create: args,
    update: args,
  })
})

program.command('checkAvailableNftBoxes').action(async (o) => {
  const nfts = await getNftsFromOwnerByCreators({
    owner: merchConfigOgBox.wallet,
    creators: [merchConfigOgBox.boxCreator],
    withAmount: false,
  })

  const products = nfts
    .map((n) => ({
      amount: n.tokenAccount.account.data.parsed.info.tokenAmount.uiAmount,
      size: n.nft.attributes.find((a) => a.trait_type === 'Size')?.value!,
      mint: new PublicKey(n.tokenAccount.account.data.parsed.info.mint),
      order: n.nft.attributes.find((a) => a.trait_type === 'Order')?.value!,
      name: n.nft.collection.name,
    }))
    .map((n) => {
      if (n.size === 'XS') {
        return { ...n, amount: n.amount }
      } else if (n.size === 'S') {
        return { ...n, amount: n.amount }
      } else if (n.size === 'M') {
        return { ...n, amount: n.amount }
      } else if (n.size === 'L') {
        return { ...n, amount: n.amount }
      } else if (n.size === 'XL') {
        return { ...n, amount: n.amount }
      } else if (n.size === '2XL') {
        return { ...n, amount: n.amount }
      } else if (n.size === '3XL') {
        return { ...n, amount: n.amount }
      } else if (n.size === '4XL') {
        return { ...n, amount: n.amount }
      } else if (n.size === '5XL') {
        return { ...n, amount: n.amount }
      }
      return { ...n, amount: n.amount }
    })

  console.log(
    'boxes',
    products.map((b) => ({ ...b, mint: b.mint.toBase58() }))
  )
})

program.command('checkAvailableBoxes').action(async (o) => {
  const nfts = await getAvailableBoxes()

  console.log(
    'nfts',
    nfts.map((b) => ({ ...b, mint: b.mint.toBase58() }))
  )
})

program.command('testDb').action(async (o) => {
  const boxOrders = await prisma.boxOrder.findMany()
  console.log('boxOrder', boxOrders.length)
})

program
  .command('findMissing')
  .option('-su, --skipUpload', 'skip upload')
  .action(async (options, cmd) => {
    console.log('seas')

    const transactions: any = []

    let id =
      '27zLmi5fKwQPCeCkvdCsB2vB9MZms6UvFFw3W2zATs3hKfgDg6ddSwexVerh1LvqXqGgGT2njqU3hQdtytuFDcYS'

    const lastDate = new Date('2022-02-18T17:07:50+00:00')

    let run = true
    while (run) {
      const res = await axios.get(
        `https://api.solscan.io/account/transaction?address=GvZH4TH7tx3h5wDmUqA6ud2L79vSphUfBp7oufva6nZk&before=${id}`
      )

      const trans = res.data.data
        .map((raw: any) => ({ ...raw, time: new Date(raw.blockTime * 1000) }))
        .filter((trans: any) => {
          return trans.time.getTime() > lastDate.getTime()
        })

      transactions.push(...trans)

      /* console.log('trans', trans) */

      if (trans.length > 0) console.log('last time', trans[0].time)

      console.log('trans.length', trans.length)

      if (trans.length < 10) break

      id = trans[9].txHash
    }

    console.log('transactions.length', transactions.length)

    fs.writeFileSync(
      __dirname + 'failedTransRaw.json',
      JSON.stringify(transactions, null, 3)
    )

    const failedUsers = []

    for (let trans of transactions) {
      const transaction = await connection.getConfirmedTransaction(trans.txHash)
      console.log(
        'transaction?.meta?.logMessages?[1]',
        transaction?.meta?.logMessages
      )

      if (!transaction?.meta?.logMessages) continue

      if (!transaction.meta.logMessages[1].includes('Reveal')) continue

      const user = transaction.transaction.feePayer!.toBase58()

      failedUsers.push({ user, tx: trans.txHash })
    }

    console.log('failedUsers', failedUsers.length)

    fs.writeFileSync(
      __dirname + 'failedTrans.json',
      JSON.stringify(failedUsers, null, 3)
    )
  })

program
  .command('sendMissing')
  .option('-su, --skipUpload', 'skip upload')
  .action(async (options, cmd) => {
    const failedTrans = require(__dirname + 'failedTrans.json')

    const nukedUser = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(process.env.NUKED_WALLET as string))
    )

    const provider = new Provider(connection, new Wallet(nukedUser), {
      commitment: 'confirmed',
    })
    const program = new Program(breedingIdl, breedingProgramId, provider)

    const failed: any = []

    for (const trans of failedTrans) {
      const user = new PublicKey(trans.user)

      const parsedTokenAccounts =
        await connection.getParsedTokenAccountsByOwner(user, {
          programId: spl.TOKEN_PROGRAM_ID,
        })

      /*  const realAccounts = []
      for (const tokenAccount of parsedTokenAccounts.value!) {
        const metaData = await getMetadataForMintV2(
          tokenAccount.account.data.parsed.info.mint
        )
       
        if (
          metaData.data.creators?.find(
            (c) => c.address === '2sPBjQtpQuGx2WQg7kn8mbC1r19AQBPREkcajDDcrbxt'
          )
        )
          realAccounts.push(tokenAccount)
      }

      const breedingAccounts = (
        await breedingProgram.account.breedingAccount.all()
      ).filter((b) => b.account.authority.equals(user) && b.account.finished)

      if (realAccounts.length >= breedingAccounts.length) throw Error('scamer') */

      const { instructions, signers } = await mintV2(
        nukedUser,
        'mainnet-beta',
        nuked.chandyMachineId,
        user
      )
      const recentBlockhash = await connection.getRecentBlockhash()

      const mintTrans = new web3.Transaction({
        feePayer: nukedUser.publicKey,
        recentBlockhash: recentBlockhash.blockhash,
      }).add(...instructions)

      try {
        const mintTx = await Reattempt.run({ times: 3 }, async () =>
          connection.sendTransaction(mintTrans, signers)
        )
        await connection.confirmTransaction(mintTx)
        console.log('successfully minted', mintTx)
      } catch (error: any) {
        console.log('error at', trans, error.message)
        failed.push(trans)
      }
    }

    if (failed.length > 0)
      fs.writeFileSync('failedSents.json', JSON.stringify(failed, null, 3))
  })

program.command('sendNukedWhitelistToken').action(async (options, cmd) => {
  const {} = cmd.opts()
  const nukedUser = loadWalletKey(
    `${process.env.HOME}/config/solana/nuked.json`
  )
  /* 
  const nukedWLCsv = csv.parseFile(__dirname+'/nukedWl.csv')
  console.log('nukedWl', await nukedWLCsv.read()) */

  const rows: any[] = []

  fs.createReadStream(__dirname + '/holders-rent.csv')
    .pipe(csv.parse({ headers: true }))
    .on('error', (error: any) => console.error(error))
    .on('data', (row: any) => rows.push(row))
    .on('end', async (rowCount: number) => {
      console.log('row', rows[0])

      const parseErrors: any = []
      const users = rows
        .map((r) => {
          try {
            return new PublicKey(r['address'])
          } catch (error: any) {
            parseErrors.push(error)
            return null
          }
        })
        .filter((r) => !!r) as PublicKey[]

      console.log('parseErrors', parseErrors.length)

      console.log('users', users.length)

      await asyncBatch(
        users,
        async (user, index, workerIndex) => {
          const tokenAccount = await getTokenAccount(
            connection,
            config.nuked.whiteListToken,
            user!
          )
          if (
            tokenAccount &&
            tokenAccount.account.data.parsed.info.tokenAmount.uiAmount > 0
          ) {
            console.log('user has token already', user.toBase58())

            return
          }

          const sendInstr = await createTransferInstruction({
            mint: config.nuked.whiteListToken,
            amount: 1,
            from: nukedUser.publicKey,
            to: user,
          })

          const blockHash = await connection.getRecentBlockhash()

          const transaction = new Transaction({
            recentBlockhash: blockHash.blockhash,
            feePayer: nukedUser.publicKey,
          }).add(...sendInstr)

          try {
            await Reattempt.run({ times: 3 }, async () => {
              const tx = await connection.sendTransaction(transaction, [
                nukedUser,
              ])
              await connection.confirmTransaction(tx)
              console.log('tx confirmed', tx)
            })
          } catch (e: any) {
            console.error('errr in sendin token', user.toBase58())
          }

          console.log(`done: index ${index}, workerIndex ${workerIndex}`)
        },
        5
      )
    })
})

program.command('loadNukedFromOwnerMints').action(async (options, cmd) => {
  const {} = cmd.opts()

  console.time('loadNukedMints')

  const nukedNfts = await getNukedMintNfts()

  console.log('nukedNfts', nukedNfts.length)

  console.timeEnd('loadNukedMints')
})

program.command('testGetMetadata').action(async (options, cmd) => {
  const {} = cmd.opts()
  const nukedUser = loadWalletKey(
    `${process.env.HOME}/config/solana/nuked.json`
  )

  console.time('load collection')
  const nukedHashlist = await Metadata.findMany(connection, {
    creators: [sacCollection.creator],
  })
  console.timeEnd('load collection')
})

program.command('loadNukedMintsWithMeta').action(async (options, cmd) => {
  let nukedWithmeta = await Metadata.findMany(connection, {
    creators: [nuked.creator],
  })

  console.log('loadNukedMintsWithMeta', nukedWithmeta.length)

  /* await asyncBatch(
    nftTokenAccounts,
    async (nftTokenAccount) => {
      const nft = new PublicKey(nftTokenAccount.account.data.parsed.info.mint)

      const nft = await getNftWithMetadata
      
    },
    10
  ) */

  const mapped = nukedWithmeta.map((n) => {
    const mapped: any = { ...n }
    delete mapped.info.data
    return mapped
  })

  fs.writeFileSync(
    __dirname + '/nukedMetadata.json',
    JSON.stringify(mapped, (key, value) => {
      if (Buffer.isBuffer(value)) return undefined

      return value
    })
  )
})

program
  .command('loadNukedMintsFromOwnerDynamic')
  .action(async (options, cmd) => {
    const {} = cmd.opts()
    const nukedUser = loadWalletKey(
      `${process.env.HOME}/config/solana/nuked.json`
    )
    /* 
  const nukedWLCsv = csv.parseFile(__dirname+'/nukedWl.csv')
  console.log('nukedWl', await nukedWLCsv.read()) */

    const nftTokenAccounts = await getTokenAccountsForOwner(nukedMintWallet, {
      withAmount: true,
      commitment: 'confirmed',
    })
    console.timeEnd('load nfts')

    const nukedNfts = []

    console.time('loadMetadataAccounts')
    await asyncBatch(
      nftTokenAccounts,
      async (nftTokenAccount) => {
        const nft = new PublicKey(nftTokenAccount.account.data.parsed.info.mint)

        const metadata = await Metadata.load(
          connection,
          await Metadata.getPDA(nft)
        )

        if (
          metadata.data.data.creators?.find(
            (c) => c.address === nuked.creator.toBase58() && c.verified
          )
        )
          nukedNfts.push(nft)
      },
      10
    )
    console.log('nukedNfts', nukedNfts.length)

    console.timeEnd('loadMetadataAccounts')
  })

program
  .command('nukedApesMintWalletCount')
  .option('-cm, --candyMachineId')
  .action(async (option, cmd) => {
    const { candyMachineId } = cmd.opts()

    const candyMachine = candyMachineId
      ? new PublicKey(candyMachineId)
      : config.nuked.chandyMachineId

    console.time('loadTokenAccounts')

    const tokenAccountsWithAmount = await getTokenAccountsForOwner(
      nukedMintWallet
    )

    console.timeEnd('loadTokenAccounts')
  })

program.command('breedingAccounts').action(async (options, cmd) => {
  const breedingAccounts = await breedingProgram.account.breedingAccount.all()

  console.log('breedingAccounts', breedingAccounts.length)
})

program.parse(process.argv)
