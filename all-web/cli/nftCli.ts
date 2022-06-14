/* import { TREASURY_ADDRESS } from './src/config' */
import * as anchor from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import asyncBatch from 'async-batch'
import { Command } from 'commander'
import fs from 'fs'
import _ from 'lodash'
import config, { configPerEnv, connection } from '../src/config/config'
import {
  getNftWithMetadata,
  loadWallet,
  loadWalletFromFile,
  pub,
  sendAndConfirmTransaction,
  sendTransaction,
} from '../src/utils/solUtils'
import {
  getNftsFromOwnerByCreators,
  getNftsFromOwnerByCreatorsWithoutOfChainMeta,
  getTokenAccountForNft,
  getTokenAccountsForOwner,
} from '../src/utils/splUtils'
import {
  createNft,
  createNftInstr,
  updateMetadata,
} from '../src/utils/nftUtils'
import { ipfsUploadOneFile } from '../src/utils/ipfs'
import path from 'path'
import alphaLabsConfig from '../src/modules/launch/config/alphaLabsConfig'
import prisma from '../src/lib/prisma'
import csvtojson from 'csvtojson/v2'
import { getNFTsForTokens } from '../src/utils/sacUtils'
import Bundlr from '@bundlr-network/client'
import jetpack, { file } from 'fs-jetpack'
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js'
import {
  heislMachineProgram,
  heislMachineProgramRecent,
} from '../src/modules/launch/heislMachineConfig'
import {
  createHeislMintInstr,
  createLaunchInstr,
  createResetLaunchInstr,
  getHeislMachineLaunch,
  getLaunchPda,
} from '../src/modules/launch/heislMachineUtils'
import axios from 'axios'
import { Metadata } from '@metaplex/js'
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

program
  .command('adaptMeta')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  .option('--verified')
  .option('-ck, --creatorKeyPath <string>')
  /* .requiredOption('-s, --share <number>') */
  .argument('<directory>', 'Directory containing images named from 0-n')
  .action(async (directory, options, cmd) => {
    const args = cmd.opts()
    const { verified, creatorKeyPath } = args
    const creatorKey = loadWalletFromFile(
      creatorKeyPath ?? `${process.env.HOME}/config/solana/dev-wallet.json`
    )

    const share = parseFloat(args.share)

    const dirPath = directory
    console.log('dirPath', dirPath)

    const allFiles = fs.readdirSync(dirPath)
    const files = allFiles.filter((d) => d.endsWith('.json'))
    const images = allFiles.filter((d) => !d.endsWith('.json'))

    const creators = [
      {
        address: '3KSTEEJD2geJ5z9KSx2XgWjYaHtGvuCdW9gkaWQ1JW4z',
        share: 12,
        verified: 1,
      },
      {
        address: '6kGP3BYBxVrHp5MUv8kHeRVxyzdCsvUJ4QNEqran9xZb',
        share: 88,
        verified: 0,
      },
    ]

    let counter = 0
    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const id = Number(file.split('.')[0])
      if (isNaN(id)) throw new Error('no id found, shouldnt happen')
      console.log('filePath', filePath)

      const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

      config['seller_fee_basis_points'] = 800

      /* const selectedImage = images.find((f) => Number(f.split('.')[0]) === id)!
      config.image = selectedImage */

      const attributes = config.attributes
      config.attributes = attributes

      config.properties.creators = creators

      fs.writeFileSync(filePath, JSON.stringify(config), {})

      counter++
      console.log('counter', counter)
    }
  })

program
  .command('createMetaInDb')
  .option('-d --deleteExisitng')
  .option('-p --project <string>')
  .argument('<filePath>')
  .action(async (filePath: string, e, cmd) => {
    const { project: projectIdendifier, deleteExisitng } = cmd.opts()

    const config = jetpack.read(filePath, 'json')

    const project = await prisma.project.findFirst({
      where: { identifier: projectIdendifier },
      rejectOnNotFound: true,
    })

    let items = (Object.entries((config as any).items) as any[]).map(
      (e: any) => ({
        id: Number([e[0]]),
        ...e[1],
      })
    )

    if (deleteExisitng) {
      console.log('deleting existing')

      await prisma.mintMeta.deleteMany({
        where: {
          projectId: project.id,
        },
      })
    }

    const already = await prisma.mintMeta.findMany({
      where: {
        projectId: project.id,
      },
      select: { id: true },
    })

    items = items.filter((i) => !already.find((a) => i.id === a.id))

    console.log('items.length', items.length)

    await asyncBatch(
      items,
      async (item, i) => {
        try {
          console.log(`${i}: load metadata`)

          const res = await axios.get(item.link)

          /*  itemsWithMeta.push({
            ...item,
            metadata: res.data,
          }) */
          await prisma.mintMeta.create({
            data: {
              id: item.id,
              metadataLink: item.link,
              projectId: project.id,
              metadata: JSON.stringify(res.data),
            },
          })
        } catch (e) {
          console.error(`error at ${item.id}`, e)
        }
      },
      20
    )
  })

program
  .command('createHeislMachineLaunch')
  .option('-p --projectIdentifier <string>')
  .action(async (e, cmd) => {
    const { projectIdentifier } = cmd.opts()

    const admin = loadWalletFromFile(
      `${process.env.HOME}/config/solana/dev-wallet.json`
    )

    const createLaunchInstrRes = await createLaunchInstr({
      identifier: projectIdentifier,
      admin: admin,
      nftCount: 2420,
    })

    const signers = [admin, ...createLaunchInstrRes.signers]
    await sendAndConfirmTransaction({
      instructions: [...createLaunchInstrRes.instr],
      signers: signers,
      commitment: 'confirmed',
    })

    console.log('create heisl machine')
  })

program
  .command('preMint')
  .option('-p --projectIdentifier <string>')
  .action(async (e, cmd) => {
    const { projectIdentifier } = cmd.opts()

    const adminUser = loadWalletFromFile(
      `${process.env.HOME}/config/solana/plane-x.json`
    )

    const backendUser = loadWalletFromFile(
      `${process.env.HOME}/config/solana/program-signer.json`
    )

    const preMintIds = [1212, 1970, 2052]

    let { launchPub } = await getHeislMachineLaunch(projectIdentifier)
    const project = await prisma.project.findFirst({
      where: { identifier: projectIdentifier },
      rejectOnNotFound: true,
    })

    const launchPda = await getLaunchPda(projectIdentifier)

    const metas = await prisma.mintMeta.findMany({
      where: {
        projectId: project.id,
      },
    })

    await asyncBatch(
      Array.from(Array(94).keys()),
      async (id) => {
        console.log('started', id)

        try {
          const meta = _.sample(metas)!
          const instructions: TransactionInstruction[] = []
          const mintHeislInstr = await createHeislMintInstr({
            launchPub: launchPda[0],
            mintId: meta.id,
            user: adminUser.publicKey,
            backendUser: backendUser.publicKey,
          })
          instructions.push(mintHeislInstr)

          const nftInstrRes = await createNftInstr({
            walletKeypair: adminUser,
            metadata: JSON.parse(meta.metadata),
            metadataLink: meta.metadataLink,
            mintTo: adminUser.publicKey,
          })

          instructions.push(...nftInstrRes.instructions)

          const tx = await sendAndConfirmTransaction({
            instructions,
            signers: [adminUser, backendUser, ...nftInstrRes.signers],
            feePayer: adminUser.publicKey,
          })
        } catch (e) {
          console.log('error in premint', e)
        }
      },
      10
    )

    let { launchMints } = await getHeislMachineLaunch(projectIdentifier)

    console.log('alreadyMinted', launchMints.alreadyMinted)
    console.log('launchMints.length', launchMints.alreadyMinted)
    console.log('launchMints.counter', launchMints.counter)
  })

program
  .command('testHeisl')
  .option('-p --projectIdentifier <string>')
  .action(async (e, cmd) => {
    const { projectIdentifier } = cmd.opts()

    const admin = loadWalletFromFile(
      `${process.env.HOME}/config/solana/og-stoneheads.json`
    )

    const backendUser = loadWalletFromFile(
      `${process.env.HOME}/config/solana/program-signer.json`
    )

    let { launchPub } = await getHeislMachineLaunch(projectIdentifier)

    await asyncBatch(
      Array.from(Array(1).keys()),
      async (_id) => {
        console.log('started', _id)

        const id = 2005

        try {
          const meta = await prisma.mintMeta.findUnique({
            where: {
              id_projectId: {
                projectId: 'cl3btjgsg0000xbda81fvw4yo',
                id: id,
              },
            },
            rejectOnNotFound: true,
          })

          const mintInstr = await createHeislMintInstr({
            backendUser: backendUser.publicKey,
            launchPub: launchPub,
            mintId: id,
            user: admin.publicKey,
          })

          const nftInstrRes = await createNftInstr({
            walletKeypair: admin,
            metadata: JSON.parse(meta.metadata),
            metadataLink: meta.metadataLink,
            mintTo: admin.publicKey,
          })

          const signers = [admin, backendUser, ...nftInstrRes.signers]
          const tx = await sendAndConfirmTransaction({
            instructions: [mintInstr, ...nftInstrRes.instructions],
            signers: signers,
            commitment: 'confirmed',
          })
          console.log('tx', tx)
        } catch (e) {
          console.error(e)
        }
      },
      10
    )

    let { launchMints } = await getHeislMachineLaunch(projectIdentifier)

    console.log('alreadyMinted', launchMints.alreadyMinted)
    console.log('launchMints.length', launchMints.alreadyMinted)
    console.log('launchMints.counter', launchMints.counter)
  })

program
  .command('resetHeislMachineLaunch')
  .option('-p --projectIdentifier <string>')
  .action(async (e, cmd) => {
    const { projectIdentifier } = cmd.opts()

    const admin = loadWalletFromFile(
      `${process.env.HOME}/config/solana/dev-wallet.json`
    )

    const createLaunchInstrRes = await createResetLaunchInstr({
      identifier: projectIdentifier,
      admin: admin,
      nftCount: 2420,
    })

    await sendAndConfirmTransaction({
      instructions: [createLaunchInstrRes],
      signers: [admin],
      commitment: 'confirmed',
    })

    const launchPda = await getLaunchPda(projectIdentifier)

    const launch = await heislMachineProgram.account.launch.fetch(launchPda[0])

    console.log(' heisl machine', launch)

    console.log('reset heisl machine')
  })

program.command('loadHeislLaunch').action(async (directory, options, cmd) => {
  const identifier = 'OGStoneheads'

  const { launch, launchMints, launchPub } = await getHeislMachineLaunch(
    identifier
  )

  console.log('launchPub', launchPub.toBase58())
  console.log('launchMints', launch.launchMints.toBase58())

  console.log('launchMints', launchMints)

  console.log('launch', launch)
})

program.command('addAlreadyMinted').action(async (directory, options, cmd) => {
  const identifier = 'NoahsArk'

  const already = require('../src/assets/launch.json')

  const launchPda = await getLaunchPda(identifier)

  const launch = await heislMachineProgramRecent.account.launch.fetch(
    launchPda[0]
  )

  let reallyAlreadyMinted = [...already.alreadyMinted, ...launch.alreadyMinted]

  reallyAlreadyMinted = _.uniq(reallyAlreadyMinted)

  const updatedRes = await prisma.mintMeta.updateMany({
    where: {
      id: { in: reallyAlreadyMinted },
      project: { identifier },
    },
    data: {
      alreadyMinted: true,
    },
  })

  console.log('launchPda', launchPda[0].toBase58())

  fs.writeFileSync('./launch3.json', JSON.stringify(launch))

  console.log(' heisl machine', launch)

  console.log('updatedRes', updatedRes.count)
})

program.command('resetHeislLaunch').action(async (directory, options, cmd) => {
  const identifier = 'NoahsArk'

  const launchPda = await getLaunchPda(identifier)
  const launch = await heislMachineProgram.account.launch.fetch(launchPda[0])

  fs.writeFileSync('./launch2.json', JSON.stringify(launch))

  console.log(' heisl machine', launch)
})

program
  .command('snapshotNoahsArkMeta')
  .action(async (directory, options, cmd) => {
    const identifier = 'NoahsArk'

    const adminUser = loadWalletFromFile(`${process.env.sol}/noah-ark.json`)

    const noahsArkMeta = await Metadata.findMany(connection, {
      creators: [adminUser.publicKey],
    })

    console.log('noahsArkMeta', noahsArkMeta.length)

    fs.writeFileSync(
      path.join(__dirname, 'assets', 'noahsArkMeta.json'),
      JSON.stringify(noahsArkMeta, null, 3)
    )

    const project = await prisma.project.findFirst({
      where: {
        identifier: identifier,
      },
      rejectOnNotFound: true,
    })

    await prisma.mintMeta.updateMany({
      where: {
        projectId: project.id,
      },
      data: {
        alreadyMinted: false,
      },
    })
  })

program
  .command('addNoahsArkAlreadyMintedToDb')
  .action(async (directory, options, cmd) => {
    const identifier = 'NoahsArk'

    const project = await prisma.project.findFirst({
      where: {
        identifier: identifier,
      },
      rejectOnNotFound: true,
    })

    const adminUser = loadWalletFromFile(`${process.env.sol}/noah-ark.json`)

    const notFound: string[] = []

    const noahsArkMints = jetpack.read(
      path.join(__dirname, 'assets', 'noahs_ark_mint_accounts.json'),
      'json'
    ) as string[]

    await asyncBatch(
      noahsArkMints,
      async (m, i) => {
        console.log('started ', i)

        const meta = await Metadata.load(
          connection,
          await Metadata.getPDA(pub(m))
        )

        const id = meta.data.data.name.includes('#')
          ? Number(meta.data.data.name.split('#')[1])
          : null

        if (!id) {
          notFound.push(meta.data.data.name)
          return
        }

        await prisma.mintMeta.update({
          where: {
            id_projectId: {
              projectId: project.id,
              id: id,
            },
          },
          data: {
            alreadyMinted: true,
          },
        })
      },
      10
    )

    const alreadMinted = await prisma.mintMeta.findMany({
      where: {
        projectId: project.id,
        alreadyMinted: true,
      },
    })

    console.log('notFound', notFound)

    console.log('alreadMinted', alreadMinted.length)
  })

program.command('sentNoahsArkNfts').action(async (directory, options, cmd) => {
  const identifier = 'NoahsArk'

  const adminUser = loadWalletFromFile(`${process.env.sol}/noah-ark.json`)
  const devWallet = loadWalletFromFile(`${process.env.sol}/dev-wallet.json`)
  const backendSigner = loadWalletFromFile(
    `${process.env.sol}/program-signer.json`
  )

  const user = pub('CRH9CVNRNaGxMj7TRxpotFamUxyAQ2BonHDma6QaBLgJ')

  const project = await prisma.project.findFirst({
    where: {
      identifier: identifier,
    },
    rejectOnNotFound: true,
  })

  let projectMetas = (await prisma.mintMeta.findMany({
    where: {
      projectId: project.id!,
      alreadyMinted: false,
    },
    /* select: { id: true, lastUsed: true, metadata }, */
  }))!

  const launchPda = await getLaunchPda(project.identifier!)
  const launch = await heislMachineProgram.account.launch.fetch(launchPda[0])

  let availableMetas = projectMetas.filter(
    (m) => !launch.alreadyMinted.includes(m.id)
  )

  console.log('availableMetas', availableMetas.length)

  await asyncBatch(
    availableMetas.slice(0, availableMetas.length - 1),
    async (meta, i) => {
      try {
        console.log('started', i)

        await prisma.mintMeta.update({
          where: {
            id_projectId: {
              projectId: project.id!,
              id: meta.id,
            },
          },
          data: {
            lastUsed: new Date(),
          },
        })

        const instructions: TransactionInstruction[] = []
        const mintHeislInstr = await createHeislMintInstr({
          launchPub: launchPda[0],
          mintId: meta.id,
          user: adminUser.publicKey,
          backendUser: backendSigner.publicKey,
        })
        instructions.push(mintHeislInstr)

        const nftInstrRes = await createNftInstr({
          walletKeypair: adminUser,
          metadata: JSON.parse(meta.metadata),
          metadataLink: meta.metadataLink,
          mintTo: adminUser.publicKey,
        })

        instructions.push(...nftInstrRes.instructions)

        const tx = await sendAndConfirmTransaction({
          instructions,
          signers: [adminUser, backendSigner, ...nftInstrRes.signers],
          feePayer: adminUser.publicKey,
        })
        console.log('tx', tx)
      } catch (e) {}
    },
    10
  )

  const heislLaunch = await heislMachineProgram.account.launch.fetch(
    launchPda[0]
  )

  console.log(' heislLaunch', heislLaunch)
})

program
  .command('addWhitelist')
  .option('-p --project <string>')
  .option('-m --mintingPeriodName <string>')
  .option('-t --onlyTestUser')
  .argument('<filePath>')
  .action(async (filePath: string, e, cmd) => {
    const {
      project: projectIdendifier,
      mintingPeriodName,
      onlyTestUser,
    } = cmd.opts()

    const periodName = mintingPeriodName

    console.log('filePath', filePath)

    let whiteList = onlyTestUser
      ? []
      : await csvtojson({
          headers: ['Wallet', 'Max Mints'],
          delimiter: ',',
        }).fromFile(filePath)

    console.log('whiteList raw', whiteList.length)

    whiteList = whiteList
      .filter((w) => !w.Wallet || !isNaN(Number(w['Max Mints'])))
      .map((w) => ({
        address: w.Wallet.trim(),
        amount: Number(w['Max Mints']),
      }))

    const mintingPeriod = await prisma.mintingPeriod.findFirst({
      where: {
        isWhitelist: true,
        project: {
          identifier: projectIdendifier,
        },
        periodName: periodName,
      },
      rejectOnNotFound: true,
    })

    let alreadyWl = await prisma.whitelistSpot.findMany({
      where: {
        mintingPeriodId: mintingPeriod.id,
      },
    })
    console.log('wl count', alreadyWl.length)

    console.log('whiteList filtered', whiteList.length)
    console.log(
      'whiteList unique',
      _.uniqBy(whiteList, (w) => w.address).length
    )

    const testUser = require('./testUsers.json') as string[]

    testUser.forEach((t) => whiteList.push({ address: t, amount: 10 }))

    /*  const usersSpots = _.countBy(whiteList, (w) => w.address) as any */

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

    console.log('users', users.length)

    await asyncBatch(
      users,
      async (user, i) => {
        console.log('started', i)

        const res = await prisma.whitelistSpot.upsert({
          where: {
            mintingPeriodId_userId: {
              mintingPeriodId: mintingPeriod.id,
              userId: user.id,
            },
          },
          create: {
            mintingPeriodId: mintingPeriod.id,
            userId: user.id,
            amount: whiteList.find((w) => w.address === user.solanaAddress)
              .amount,
          },
          update: {
            mintingPeriodId: mintingPeriod.id,
            userId: user.id,
            amount: whiteList.find((w) => w.address === user.solanaAddress)
              .amount,
          },
        })
      },
      8
    )

    alreadyWl = await prisma.whitelistSpot.findMany({
      where: {
        mintingPeriodId: mintingPeriod.id,
      },
    })
    console.log('wl count', alreadyWl.length)

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

program
  .command('migrateHeislAccount')
  .option('-p --project <string>')
  .option('-t --onlyTestUser')
  .action(async (e, cmd) => {
    const launchPda = await getLaunchPda('OGStoneheads')

    const adminWallet = loadWalletFromFile(`${process.env.sol}/dev-wallet.json`)
    const backendUser = loadWalletFromFile(
      `${process.env.sol}/program-signer.json`
    )

    let launch = await heislMachineProgram.account.launch.fetch(launchPda[0])
    console.log('launch', launch)

    let launchMints = await heislMachineProgram.account.launchMints.fetch(
      launch.launchMints
    )

    console.log('launchMints', launchMints)

    const notAlreadyMinted = launch.alreadyMintedOld.filter(
      (a) => !launchMints.alreadyMinted.includes(a)
    )

    await asyncBatch(
      notAlreadyMinted,
      async (a) => {
        try {
          const instr = await heislMachineProgram.instruction.mint(a, {
            accounts: {
              /*  launch: launchPda[0], */
              user: adminWallet.publicKey,
              systemProgram: SystemProgram.programId,
              backendUser: backendUser.publicKey,
              launchMints: launch.launchMints,
            },
          })

          await sendAndConfirmTransaction({
            instructions: [instr],
            signers: [adminWallet, backendUser],
          })
        } catch (e) {}
      },
      10
    )

    launch = await heislMachineProgram.account.launch.fetch(launchPda[0])
    launchMints = await heislMachineProgram.account.launchMints.fetch(
      launch.launchMints
    )

    console.log('finished', launch.alreadyMintedOld.length, launchMints.counter)
  })

/* program.command('testFailedTrans').action(async (directory, options, cmd) => {
  const identifier = 'BongHeads'
  const backendSigner = await loadWallet(process.env.PROGRAM_SIGNER!)
  const user = await loadWallet(process.env.WALLET!)

  const launchPda = await getLaunchPda(identifier)
  const launch = await heislMachineProgram.account.launch.fetch(launchPda[0])

  const random = _.random(0, 100, false)
  console.log('random', random)

  const instr = await heislMachineProgram.instruction.mint(random, {
    accounts: {
      backendUser: backendSigner.publicKey,
      user: user.publicKey,
      launch: launchPda[0],
      systemProgram: SystemProgram.programId,
    },
  })

  const tx = await sendAndConfirmTransaction({
    instructions: [instr],
    signers: [user, backendSigner],
    commitment: 'finalized',
    opts: { skipPreflight: true },
  })

  const status = await connection.getSignatureStatus(tx)
  console.log('status', status)

  console.log('heisl machine', launch)
}) */

program
  .command('uploadData')
  .option('--reverse', 'send out nfts reverse')
  .argument('--assetsPath, -p')
  .action(async (assetsPath, options, cmd) => {
    const { reverse } = cmd.opts()
    const adminWallet = loadWalletFromFile(`${process.env.sol}/dev-wallet.json`)

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

    const bundlr = new Bundlr(
      'https://node1.bundlr.network',
      'solana',
      adminWallet.secretKey,
      {
        timeout: 60000,
        providerUrl:
          configPerEnv['production'].rpcHost ??
          'https://api.metaplex.solana.com',
      }
    )
    const filePath =
      '/Users/matthiasschaider/Documents/stoned-apes/stoned-ape-web/all-web/cli/assets/launch/AlphaLabs/metadata/1.json'

    let files = jetpack.list(assetsPath)!

    files = files.filter((f) => f.endsWith('.json'))

    /* await prisma.mintMeta.findMany({
      where: {

      }
    }) */

    const fileIds = files.map((f) => Number(f.replace('.json', '')))

    const manifest = await bundlr.uploader.generateManifest({
      items: new Map([['0.json', '0.png']]),
    })

    console.log('manifest', manifest)

    return

    await asyncBatch(
      files,
      async (file) => {
        const metadtaFilePath = path.join(assetsPath, file)
        const metadata = jetpack.read(metadtaFilePath, 'json')

        const imageFiles = _.uniq([
          metadata.image,
          metadata.properties.files[0].uri,
        ])

        const imagePaths = imageFiles.map((i) => path.join(assetsPath, i))

        const balance = await bundlr.getLoadedBalance()

        console.log('balance', balance.toNumber())

        const bytes = Buffer.from(metadtaFilePath).byteLength
        const cost = await bundlr.utils.getPrice('solana', bytes)
        const bufferCost = cost.multipliedBy(3).dividedToIntegerBy(2)

        await bundlr.fund(bufferCost)
        const res = await bundlr.uploadFile(metadtaFilePath)
        console.log('files', files.length)

        console.log('res', res.data)
      },
      10
    )
  })

program.command('testNft').action(async (bs58Str: string, options, cmd) => {
  const adminWallet = loadWalletFromFile(
    `${process.env.HOME}/config/solana/dev-wallet.json`
  )

  const video = await ipfsUploadOneFile({
    filePath: `${__dirname}/assets/sample-mp4-file.mp4`,
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
