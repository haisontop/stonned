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
  PublicKey,
  Transaction,
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
  getOrCreateAssociatedTokenAddressInstruction,
  getSolscanTxLink,
  getTokenAccount,
  loadWallet,
  loadWalletFromFile,
  pub,
} from '../src/utils/solUtils'
import { addDays } from 'date-fns'
import { mintV2 } from '../src/utils/candyMachine'
import { parse } from 'csv-parse/sync'
import { buildToken, getMetadataForMint } from '../src/utils/splUtils'
import { mn } from 'date-fns/locale'
import { ipfsUploadOneFile } from '../src/utils/ipfs'
import { createNft } from '../src/utils/nftUtils'
require('dotenv').config()

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

console.log(
  'connection',
  console.log('connection', (connection as any)._rpcEndpoint)
)

const baseAssetsPath = __dirname + '/assets/'
function write(name: string, data: string | any) {
  const fileData =
    typeof data === 'string' ? data : JSON.stringify(data, null, 3)
  fs.writeFileSync(baseAssetsPath + name, fileData)
}

function read<T extends boolean>(
  name: string,
  json?: T
): T extends false ? string : any {
  const data = fs.readFileSync(baseAssetsPath + name, 'utf-8')
  return json ? JSON.parse(data) : data
}

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

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
})

const wallet = loadWalletKey(
  `${process.env.HOME}/config/solana/sac-treasury.json`
)

const provider = new anchor.Provider(connection, wallet as any, {
  commitment: 'confirmed',
})

const stakingProgram = new Program(stakingIdl, stakingProgramId, provider)

const evolutionProgram = new Program(evolutionIdl, evolutionProgramId, provider)

const breedingProgram = new Program(breedingIdl, breedingProgramId, provider)

program
  .command('convertBs58ToBuffer')
  .argument('<bs58Str>')
  .action(async (bs58Str: string, options, cmd) => {
    const buffer = bs58.decode(bs58Str)

    console.log('u8 array', Uint8Array.from(buffer))
  })

program.command('loadStakingAccounts').action(async (e) => {
  console.time('loadStakingAccounts')

  const allStakingAccounts = await stakingProgram.account.stakeAccount.all()

  console.timeEnd('loadStakingAccounts')

  console.log('allStakingAccounts', allStakingAccounts.length)
})

// program.command('bongHeadsWhitelist').action(async (e) => {
//   console.time('loadStakingAccounts')

//   const allStakingAccounts = await stakingProgram.account.stakeAccount.all()

//   const csvStr = read('BongHeads Whitelist - Whitelist.csv')
//   const whiteList = parse(csvStr) as string[][]
//   console.log('whiteList', whiteList)

//   const createManyRes = await prisma.whitelistSpot.createMany({
//     skipDuplicates: true,
//     data: whiteList.map((w) => ({
//       amount: 1,
//       user: w[0].trim(),
//       mintingPeriodId: 'cl0zqbvx80107ioc9tjlsdn72',
//     })),
//   })
//   console.log('createManyRes', createManyRes)
// })

// program.command('whitelistMaryjanes').action(async (e) => {
//   console.time('loadStakingAccounts')

//   const allStakingAccounts = await stakingProgram.account.stakeAccount.all()

//   let users = _.countBy(allStakingAccounts, (s) =>
//     s.account.authority.toBase58()
//   )
//   let usersAsArray = Object.keys(users).map((key) => ({
//     wallet: key,
//     amount: users[key],
//   }))

//   console.timeEnd('loadStakingAccounts')

//   write('whitelistMaryjanes.json', usersAsArray)

//   console.log('allStakingAccounts', usersAsArray)

//   usersAsArray.push({
//     amount: 10,
//     wallet: '6uG69CaPUbWR8Q3Gxq99DTMroE8Tc66u3QcGzMYU27T4',
//   })

//   await prisma.whitelistSpot.createMany({
//     skipDuplicates: true,
//     data: usersAsArray.map((u) => ({
//       amount: u.amount,
//       user: u.wallet,
//       mintingPeriodId: 'cl0y396ck0058g8c9229ljlb7',
//     })),
//   })
// })

/* program.command('createLaunchpadMockdata').action(async (e) => {
  const project = await prisma.project.create({
    data: {
      desktoBannerUrl: 'test',
      mobileBannerUrl: 'test',
      profilePictureUrl: 'test',
      projectDescription: 'test',
      projectName: 'Test Project',
      projectUrlIdentifier: 'testo',
      publicMintPrice: 1,
      publicMintStart: new Date('2022-03-18T21:00:00+00:00'),
      reservedPublicSupply: 10,
      candyMachineId: '7FZg44MikbGzmhYynkJBJPGPjvFcDTzeLoBRhAhiYGzG',
    },
  })

  const mintingPeriod = await prisma.mintingPeriod.create({
    data: {
      project: { connect: { id: project.id } },
      startAt: new Date(),
      endAt: addDays(new Date(), 3),
      price: 10,
      supplyAvailable: 10,
      totalPriceInSol: 0.8,
      periodName: 'Holder Sale',
      maxPerWallet: 1,
      isWhitelist: true,
      pricings: {
        createMany: {
          data: [
            {
              isSol: true,
              amount: 0.69,
            },
            {
              isSol: false,
              token: config.allToken,
              amountInSol: 0.11,
            },
          ],
        },
      },
    },
  })

  await prisma.whitelistSpot.create({
    data: {
      amount: 2,
      user: '6uG69CaPUbWR8Q3Gxq99DTMroE8Tc66u3QcGzMYU27T4',
      mintingPeriodId: mintingPeriod.id,
    },
  })

  console.log('project', project)
}) */

program
  .command('createWlNfts')
  .option(
    '-r, --rpc-url <string>',
    'custom rpc url since this is a heavy command'
  )
  /* .option('-k, --keypair <path>', `Solana wallet location`) */
  .action(async (options, cmd) => {
    const { keypair, rpcUrl } = cmd.opts()

    const env = config.solanaEnv

    const adminUser = loadWalletKey(
      keypair ?? `${process.env.HOME}/config/solana/raffle-prices.json`
    )

    const projectName = 'DreamersNFT'
    const symbol = 'DN'
    const amount = 18

    const image = await ipfsUploadOneFile({
      filePath: `${process.env.HOME!}/Downloads/FTt6G6XWYAEy7pe.jpeg`,
    })

    const baseMetadata = {
      name: `${projectName} WL Spot #`,
      symbol: `${symbol}WL`,
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
      description: `This Nft gives you a WL spot at the ${projectName} mint.`,
      seller_fee_basis_points: 742,
      attributes: [],
      collection: { name: 'Lucky Dip', family: 'SAC' },
    }

    const candyMachine = await loadCandyProgramV2(adminUser, env, rpcUrl)

    const connection = candyMachine.provider.connection

    try {
      console.time('premint nfts')

      const allMints: PublicKey[] = []

      await asyncBatch(
        Array.from(Array(amount).keys()),
        async (_i, i, worker) => {
          try {
            console.log(
              `${i}: start sending to ${adminUser.publicKey.toBase58()}`
            )

            const metadata = _.cloneDeep(baseMetadata)
            metadata.name = metadata.name + (i + 1)

            const metadataUri = await ipfsUploadOneFile({
              file: Buffer.from(JSON.stringify(metadata)),
            })

            const { mintPub } = await createNft({
              metadata,
              metadataLink: metadataUri,
              walletKeypair: adminUser,
              mintTo: adminUser.publicKey,
              /*  creatorSigners: [collectionKeypair], */

              /* loadWalletKey(
                `${process.env.HOME}/config/solana/phantom.json`
              ).publicKey */
            })

            allMints.push(mintPub)

            if (!mintPub) {
              console.log('failed transaction', i)
              return
            }
            console.log('token', mintPub.toBase58())

            console.log(
              `${i}: finished sending to ${adminUser.publicKey.toBase58()}`
            )
          } catch (e) {
            console.error(`${i} error at creating nft`, e)
          }
        },
        1
      )

      console.log(
        'allMints',
        JSON.stringify(
          allMints.map((m) => ({
            mint: m.toBase58(),
            amount: 1,
          })),
          null,
          3
        )
      )

      console.timeEnd('premint nfts')
    } catch (error) {
      console.error('error at creating token', error)
    }

    process.exit(0)
  })

program.command('findUnverifiedMarryJanes').action(async (options, cmd) => {
  const allSales: any[] = []

  let salesRes: AxiosResponse | undefined
  let offset = 0
  while (offset === 0 || salesRes?.data.length == 100) {
    salesRes = (await axios.get(
      `https://api-mainnet.magiceden.dev/v2/collections/mary_janes/activities?offset=${offset}&limit=100`
    ))!
    allSales.push(...salesRes.data)
    offset += 100
    console.log('listingsRes.data', salesRes.data.length)
  }

  const mapped = allSales
    .map((s) => ({
      ...s,
      date: new Date(s.blockTime * 1000),
    }))
    .reverse()

  write('maryJaneSales.json', mapped)
})

/* program.command('getSales').action(async (options, cmd) => {
  const allSales: any[] = []

  let salesRes: AxiosResponse | undefined
  let offset = 0
  const query = {
    $match: { collection_symbol: 'mary_janes' },
    $sort: { blockTime: -1, createdAt: -1 },
    $skip: 0,
  }
  while (offset === 0 || salesRes?.data.length == 100) {
    salesRes = (await axios
      .get(`https://api-mainnet.magiceden.io/rpc/getGlobalActivitiesByQuery`, {
        params: query,
      })
      .catch((e) => {
        const error = e as AxiosError

        console.log('error.response', (e as any).response)

        write('me-err.html', error.response?.data as any)
      }))!
    allSales.push(...salesRes.data)
    query['$skip'] += 100
    console.log('listingsRes.data', salesRes.data.length)
  }

  const mapped = allSales
    .map((s) => ({
      ...s,
      date: new Date(s.blockTime * 1000),
    }))
    .reverse()

  write('maryJaneSales.json', mapped)
}) */

program
  .command('candyMachineState')
  .argument('candyMachineAddress')
  .action(async (candyMachineAddress, options, cmd) => {
    const candyMachinePub = pub(candyMachineAddress)
    const devWallet = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(process.env.LAUNCH_MINT as string))
    )
    const anchorProgram = await loadCandyProgramV2(
      devWallet,
      config.solanaEnv,
      config.rpcHost
    )

    const candyMachine = (await anchorProgram.account.candyMachine.fetch(
      candyMachinePub
    )) as Record<string, any> & {
      data: {
        creators: { address: PublicKey; share: number; verified: boolean }[]
      }
    }

    console.log('candyMachine', {
      ...candyMachine,
      itemsRedeemed: candyMachine.itemsRedeemed.toNumber(),
    })
  })

program.command('mint').action(async (options, cmd) => {
  const user = pub('2PiopXy3xBV9Lu1TdHzXx6DkVqqtwmWYxiZhhfPpU53m')
  const candyMachine = pub('6wNSaNfCMovP2vbw2cWMzdN9gs8Zs3yD51ti6fR3i6ZZ')
  const adminWallet = loadWalletFromFile(
    `${process.env.sol}/mary-jane-fix-authority.json`
  )

  console.log('adminWallet', adminWallet.publicKey.toBase58())

  for (let i = 0; i < 81; i++) {
    const { instructions: mintInstructions, signers } = await mintV2({
      adminKeypair: adminWallet,
      candyMachineAddress: candyMachine,
      user,
      rpcUrl: config.rpcHost,
    })

    const transaction = new Transaction({
      recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
    }).add(...mintInstructions)
    const tx = await connection.sendTransaction(transaction, [
      adminWallet,
      ...signers,
    ])
    await connection.confirmTransaction(tx, 'confirmed')
    console.log(`minted ${i} ${getSolscanTxLink(tx)}`)
  }
})

program
  .command('uploadIpfs')
  .argument('<path>')
  .action(async (path, options, cmd) => {
    const { keypair, rpcUrl } = cmd.opts()

    const fileUrl = await ipfsUploadOneFile({
      filePath: path,
    })

    console.log('fileUrl', fileUrl)
  })

program.command('mintToMaryJaneUsers').action(async (options, cmd) => {
  const candyMachine = pub('6wNSaNfCMovP2vbw2cWMzdN9gs8Zs3yD51ti6fR3i6ZZ')

  const adminWallet = loadWalletFromFile(
    `${process.env.sol}/mary-jane-fix-authority.json`
  )

  const alreadyMintedFile = 'maryJaneFixAlreadyMinted.json'

  const maryJanesFixMints =
    require('./assets/maryJanesFixMints.json') as string[]

  console.log('list length', maryJanesFixMints.length)

  if (!fs.existsSync(baseAssetsPath + '/' + alreadyMintedFile))
    write(alreadyMintedFile, [])

  let i = 0
  for (let maryJanesFixMintStr of maryJanesFixMints) {
    i++
    const maryJanesFixMint = pub(maryJanesFixMintStr)

    const tokenAccounts = await connection.getTokenLargestAccounts(
      maryJanesFixMint
    )
    const tokenAccountAmount = tokenAccounts.value.find((t) => t.uiAmount === 1)
    const token = buildToken(maryJanesFixMint)

    const tokenAccount = await token.getAccountInfo(
      tokenAccountAmount?.address!
    )

    const alreadyMinted = read(alreadyMintedFile, true) as {
      user: string
      wrongMint: string
      tx: string
    }[]

    const foundMinted = alreadyMinted.find(
      (m) => m.wrongMint == tokenAccount.mint.toBase58()
    )
    if (foundMinted) {
      console.log(`already minted ${i}`, foundMinted)
      continue
    }

    console.log(`try to mint ${i} `, {
      user: tokenAccount.owner.toBase58(),
      wrongMint: tokenAccount.mint.toBase58(),
      tokenAccount: tokenAccount.address.toBase58(),
    })

    const { instructions: mintInstructions, signers } = await mintV2({
      adminKeypair: adminWallet,
      candyMachineAddress: candyMachine,
      user: tokenAccount.owner,
      rpcUrl: config.rpcHost,
    })

    const transaction = new Transaction({
      recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
    }).add(...mintInstructions)
    const tx = await connection.sendTransaction(transaction, [
      adminWallet,
      ...signers,
    ])
    console.log(`${i}: sent ${getSolscanTxLink(tx)}`)
    await connection.confirmTransaction(tx, 'finalized')
    console.log(`${i}: tx finalized ${getSolscanTxLink(tx)}`)
    alreadyMinted.push({
      user: tokenAccount.owner.toBase58(),
      wrongMint: tokenAccount.mint.toBase58(),
      tx: tx,
    })

    write(alreadyMintedFile, alreadyMinted)
  }
})

program.command('breedingAccounts').action(async (options, cmd) => {
  const breedingAccounts = await breedingProgram.account.breedingAccount.all()

  console.log('breedingAccounts', breedingAccounts.length)
})

program.command('sendFreeMints').action(async (e) => {
  const hashList = JSON.parse(
    fs.readFileSync('./treasuryNfts.json', 'utf-8')
  ) as string[]
  const freeMintAddresses = require('./freeMintUsers.json') as string[]

  const sendedFreeMintsInfo = await Promise.all(
    freeMintAddresses.map(async (mintDest) => {
      const nft = await findRandomNft({ hashList, rarityRankGreatThan: 2000 })
      const txId = await sendNft(nft.mint, mintDest, wallet)
      console.log('tx', { txId, ...nft })

      return { txId, dest: mintDest, ...nft }
    })
  )

  fs.writeFileSync(
    'sendedFreeMintsInfo.json',
    JSON.stringify(sendedFreeMintsInfo)
  )
})

program.command('hashList').action(async (e) => {
  const hashList = await fetchHashTable(
    process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!
  )

  fs.writeFileSync('hashListWithoutMeta.json', JSON.stringify(hashList))
})

program
  .command('addBongs')
  .option('-su, --skipUpload', 'skip upload')
  .action(async (options, cmd) => {
    console.log('seas')
    const bongHolder = require('./bongHolder.json') as {
      owner_wallet: string
    }[]

    const users = await prisma.whitelistUser.createMany({
      data: bongHolder.map((m) => ({
        address: m.owner_wallet,
        reserved: 5,
      })),
      skipDuplicates: true,
    })
    console.log('users added db', users.count)

    await client.login(botToken)
  })

program.command('freeMints').action(async (options, cmd) => {
  console.log('seas')

  await client.login(botToken)
  const guildId = '897158531193638913'
  const channelId = '913906848682348574'

  const messages = await getAllMessagesFromChannel(guildId, channelId)

  console.log('messages', messages.length)

  const correctMessages = messages
    .filter((m) => getSolAdressFromText(m.content))
    .map((m) => ({ ...m, address: getSolAdressFromText(m.content)! }))

  const withouDuplicates = correctMessages.filter(
    (a, pos) =>
      correctMessages.findIndex((b) => a.address === b.address) === pos
  )

  console.log('all users with role', withouDuplicates.length)

  const guild = await client.guilds.fetch(guildId)
  const channel = await guild.channels.fetch(channelId)

  /*  const roles = await guild.roles.fetch()
  console.log(
    'roles',
    roles.map((r) => ({ id: r.id, name: r.name })),
  )
 */
  const rolesReserved = [
    { id: '900021074534735892', name: 'Stoned Ape OG', reserved: 7 },
  ]

  const freeMintUsers = (
    await Promise.all(
      withouDuplicates.filter(async (d, i) => {
        try {
          const member = await guild.members.fetch({
            user: d.author,
          })

          const withRole = member.roles.cache.find(
            (c) => c.name === 'free-mint'
          )

          if (!withRole) return false

          return withRole
        } catch (e: any) {
          return false as any
        }
      })
    )
  ).filter((f) => f)

  fs.writeFileSync(
    'freeMintUsers.json',
    JSON.stringify(freeMintUsers.map((f) => f.address))
  )
})

program
  .command('seedWhitelist')
  .option('-su, --skipUpload', 'skip upload')
  .action(async (options, cmd) => {
    console.log('seas')

    await client.login(botToken)
    const guildId = '897158531193638913'
    const channelId = '908747606388277279'

    const messages = await getAllMessagesFromChannel(guildId, channelId)

    console.log('messages', messages.length)

    const correctMessages = messages
      .filter((m) => getSolAdressFromText(m.content))
      .map((m) => ({ ...m, address: getSolAdressFromText(m.content)! }))

    const withouDuplicates = correctMessages.filter(
      (a, pos) =>
        correctMessages.findIndex((b) => a.address === b.address) === pos
    )

    const guild = await client.guilds.fetch(guildId)
    const channel = await guild.channels.fetch(channelId)

    const roles = await guild.roles.fetch()
    console.log(
      'roles',
      roles.map((r) => ({ id: r.id, name: r.name }))
    )

    const rolesReserved = [
      { id: '900021074534735892', name: 'Stoned Ape OG', reserved: 7 },
      { id: '912787481374650458', name: '420 Agent', reserved: 5 },
      {
        id: '901017686979510292',
        name: 'Hotbox Crew | #HBC (Whitelist)',
        reserved: 3,
      },
    ]

    const discordUsers = (
      await Promise.all(
        withouDuplicates.map(async (d, i) => {
          try {
            const member = await guild.members.fetch({
              user: d.author,
            })

            console.log('i', i)

            const role = rolesReserved.find((r) =>
              member.roles.cache.find((rc) => rc.id == r.id)
            )

            return { ...d, reserved: role?.reserved ?? 0 }
          } catch (e: any) {
            return false as any
          }
        })
      )
    ).filter((f) => f)

    const users = await prisma.whitelistUser.createMany({
      data: discordUsers.map((m) => ({
        address: m.address,
        reserved: m.reserved,
      })),
      skipDuplicates: true,
    })
    console.log('users added db', users.count)
  })

const noExportNotAllowed = {}

export default noExportNotAllowed

export async function getAllMessagesFromChannel(
  guildId: string,
  channelId: string
) {
  const guild = await client.guilds.fetch(guildId)

  const channel = await guild.channels.fetch(channelId)

  const allMessages: Message[] = []

  while (1) {
    if (channel?.type === 'GUILD_TEXT') {
      const messages = (
        await channel.messages.fetch({
          limit: 100,
          before:
            allMessages.length > 0
              ? allMessages[allMessages.length - 1].id
              : undefined,
        })
      ).toJSON()

      if (messages.length === 0) {
        break
      }

      allMessages.push(...messages)
    }
  }

  return allMessages
}

/* program.command('getNftSplittedPerStakingReward').action(async (e) => {
  const nftsWithMeta = require('./assets/fullMintList') as any[]

  const oneNft = nftsWithMeta[0]
  console.log('oneNft', oneNft)

  const nfts = nftsWithMeta.map((oneNft) => {
    return {
      mint: oneNft.onChainData.mint as string,
      role: oneNft.currentArweave.attributes.find(
        (a: any) => a.trait_type === 'Role'
      ).value as string,
    }
  })

  const fourRoles = ['Businessman', 'Farmer', 'Scientist', 'Artist']
  const sealz = '420 Sealz'
  const chimpion = 'Chimpion'

  const nftsGrouped = _.groupBy(nfts, (nft) => {
    if (nft.role === chimpion) return chimpion
    if (fourRoles.includes(nft.role)) return 'FourRoles'
    if (nft.role === sealz) return sealz
    return 'OneOutOfOne'
  })

  const baseDir = `${__dirname}/assets/roles`

  if (fs.existsSync(baseDir)) {
    fs.rmSync(baseDir, {
      recursive: true,
    })
  }

  fs.mkdirSync(baseDir)

  for (const role in nftsGrouped) {
    const nfts = nftsGrouped[role]
    const onlyMints = nfts.map((n) => n.mint)
    fs.writeFileSync(
      `${baseDir}/${role.replaceAll(' ', '_')}.json`,
      JSON.stringify(onlyMints, null, 3)
    )
  }

  fs.writeFileSync(
    `${__dirname}/assets/nftsGroupedStaking.json`,
    JSON.stringify(nftsGrouped, null, 3)
  )
}) */

program.command('saveNftWithMeta').action(async (e) => {
  const nftsWithMeta = await getNFTsForCandymachine(connection)

  console.log(`^ Nfts ${nftsWithMeta.length}`)

  fs.writeFileSync('nftsWithMeta.json', JSON.stringify(nftsWithMeta, null, 3))
})

program.command('snapshotHolder').action(async (e) => {
  const stakingAccounts = await stakingProgram.account.stakeAccount.all()
  const evolutionAccounts =
    await evolutionProgram.account.evolutionAccount.all()
  const lockedNftAccounts = [...stakingAccounts, ...evolutionAccounts]

  const holders = lockedNftAccounts.map((a) => a.account.authority)

  const mints = (require('../src/assets/mints.json') as string[]).map(
    (m: string) => new PublicKey(m)
  )

  console.log('holders', holders.length)

  /*  const walletOwners = (
    await asyncBatch(
      mints,
      async (mint, index, workerIndex) => {
        console.log(`index ${index}, workerIndex ${workerIndex}`)

        const token = new Token(connection, mint, spl.TOKEN_PROGRAM_ID, wallet)
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

  console.log('walletOwners', walletOwners) */

  /* 
  console.log('mints', mints)

  console.log('utility holders', holders.length)

  const uniquUsers = _.uniqBy(holders, (s) => s)

  console.log('uniquUsers', uniquUsers.length) */
})

program.command('getDailyPuffTokenstats').action(async (e) => {
  const signatures: Array<ConfirmedSignatureInfo> = []

  for (let i = 0; i < 15; i++) {
    signatures.push(
      ...(await connection.getConfirmedSignaturesForAddress2(
        new PublicKey('BUHEzkqGnyxd8GQQzFnkaM5SfVhqZcEjhuCauPuxQ3mz'),
        {
          before:
            signatures.length > 0
              ? signatures[signatures.length - 1].signature
              : undefined,
        }
      ))
    )
  }

  const transactions = await connection.getParsedConfirmedTransactions(
    signatures.map((s) => s.signature)
  )

  const transfers = transactions.filter(
    (t: any) =>
      (t?.meta?.innerInstructions[0]?.instructions[0] as any)?.program ===
      'spl-token'
  )

  const fastTransferPerDay: Record<string, number> = {}

  transfers.forEach((t) => {
    const tAny = t as any
    const day = new Date((t?.blockTime as number) * 1000).toLocaleDateString()
    const amountLamp =
      (tAny?.meta?.innerInstructions[0]?.instructions[0] as any)?.parsed?.info
        ?.amount / web3.LAMPORTS_PER_SOL
    if (fastTransferPerDay[day]) {
      fastTransferPerDay[day] += amountLamp
    } else {
      fastTransferPerDay[day] = amountLamp
    }
  })

  console.log('fastTransferPerDay', fastTransferPerDay)

  const transfersWithAmount = transfers.map((t) => {
    const tAny = t as any
    const amountLamp = (
      tAny?.meta?.innerInstructions[0]?.instructions[0] as any
    )?.parsed?.info?.amount
    return {
      tx: t?.transaction.signatures[0],
      time: new Date((t?.blockTime as number) * 1000),
      amount: amountLamp / web3.LAMPORTS_PER_SOL,
    }
  })

  const transfersPerDay = _.groupBy(transfersWithAmount, (t) =>
    t.time.toDateString()
  )

  const sumsPerDay: any[] = []

  Object.values(transfersPerDay).forEach((t) => {
    sumsPerDay.push({
      day: t[0].time.toDateString(),
      amount: _.sumBy(t, 'amount').toFixed(2),
    })
  })

  console.log('sumsPerDay', JSON.stringify(sumsPerDay, null, 3))
})

program.command('testPartialSigningValidation').action(async (e) => {
  const devWallet = loadWallet(process.env.LAUNCH_MINT!)
  const candyMachine = pub('9VTvqLvuixT1XhCWj9TqUvmjc6zK1aW32nh4t97ZbaeU')

  const userWallet = loadWalletFromFile(
    `${process.env.HOME}/config/solana/phantom.json`
  )

  const { instructions: mintInstructions, signers } = await mintV2({
    adminKeypair: devWallet,
    candyMachineAddress: candyMachine,
    user: userWallet.publicKey,
    rpcUrl: config.rpcHost,
    payer: userWallet.publicKey,
  })
  const transaction = new Transaction({
    feePayer: userWallet.publicKey,
    recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
  }).add(...mintInstructions)

  /* for (const signer of signers) {
    await transaction.partialSign(signer)
  } */
  /* const tx = await connection.sendTransaction(transaction, [
    devWallet,
    userWallet,
    ...signers,
  ])
  await connection.confirmTransaction(tx, 'confirmed')
  console.log(`${getSolscanTxLink(tx)}`) */

  console.log('transaction', transaction)

  const serial2 = transaction.serialize({ verifySignatures: false })

  const transaction2 = Transaction.from(Buffer.from(serial2))
  console.log('transaction2', transaction2)

  console.log('transaction.compileMessage()', transaction.compileMessage())
  console.log('transaction2.compileMessage()', transaction2.compileMessage())

  console.log(
    'transaction2.compileMessage()',
    transaction2.serializeMessage().toLocaleString()
  )

  console.log(
    'is same',
    JSON.stringify(transaction.compileMessage()) ===
      JSON.stringify(transaction2.compileMessage())
  )
  console.log(
    'is same',
    transaction.serializeMessage().toString() ===
      transaction2.serializeMessage().toString()
  )
  console.log('length 1', JSON.stringify(transaction.compileMessage()).length)

  console.log('length 2', transaction2.serializeMessage().toString().length)

  const { instructions: mintInstructions2, signers: signers2 } = await mintV2({
    adminKeypair: devWallet,
    candyMachineAddress: candyMachine,
    user: userWallet.publicKey,
    rpcUrl: config.rpcHost,
    payer: userWallet.publicKey,
  })
  const transaction3 = new Transaction({
    feePayer: userWallet.publicKey,
    recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
  }).add(...mintInstructions2)

  console.log('transaction', transaction)

  for (const signer of signers2) {
    await transaction3.partialSign(signer)
  }

  console.log(
    'is same',
    transaction.serializeMessage().toString() ===
      transaction2.serializeMessage().toString()
  )
})

program.command('checkAccount').action(async (e) => {
  const provider = new anchor.Provider(connection, wallet as any, {
    commitment: 'recent',
  })
  const program = new Program(stakingIdl, stakingProgramId, provider)

  /* const nftToken = new PublicKey('wpuXQP2yNFVvUoBBxXQQak4BEW5XYonuyGhV7UxzYoF')
  const user = new PublicKey('BqJtf38a8ZoPXVVS6WzeSiRnZGjAiNDFJoa3TPByp1Tg') */

  const user = new PublicKey('DkAYxdv3YTj7LTEV8YZEeGwrirHYp8P6UcdswVGcuQqc')
  const nftToken = new PublicKey('G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB')

  const tokenAccounts = await connection.getTokenAccountsByOwner(user, {
    mint: nftToken,
  })
  console.log(
    'tokenAccounts',
    tokenAccounts.value.map((t) => ({ ...t, t: t.pubkey.toBase58() }))
  )

  /*  const tokenAccount = await connection.getAccountInfo(
    new PublicKey('7y1w6jBRzSGSjWgvw2rF1GzzK3Hs15ENw7phrWr5Phw7')
  )
  console.log('tokenAccount', {
    ...tokenAccount,
    owner: tokenAccount?.owner.toBase58(),
  })
 */
  const res = await getOrCreateAssociatedTokenAddressInstruction(
    nftToken,
    user,
    connection
  )

  console.log('res', {
    ...res,
    associatedTokenAddress: res.address.toBase58(),
  })
})

export function transferNft() {}

export function getSolAdressFromText(tweet: string) {
  const adresses = tweet.match(/(\b[a-zA-Z0-9]{32,44}\b)/g)
  return adresses && adresses?.length > 0 ? adresses[0] : null
}

export async function getNFTsForCandymachine(
  connection: anchor.web3.Connection,
  allMints?: string[]
) {
  const mints =
    require('./assets/mints.json') as String[] /* allMints ?? (await fetchHashTable(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!)) */

  const writeStream = fs.createWriteStream(
    `${__dirname}/assets/nftsWithMetaStream.json`,
    'utf-8'
  )
  writeStream.write('[')

  const nfts = (
    await asyncBatch(
      mints,
      async (mint, index, workerIndex) => {
        console.log(`loading mint ${index} worker: ${workerIndex}`)

        /* let [pda] = await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            new anchor.web3.PublicKey(mint).toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
        const accountInfo = await connection.getParsedAccountInfo(pda)

        const metadata = new Metadata(
          accountInfo.value?.owner as any,
          accountInfo.value as any
        ) */
        try {
          const dataRes = await axios.get(
            `https://api-mainnet.magiceden.io/rpc/getNFTByMintAddress/${mint}`
          )
          if (dataRes.status !== 200) {
            console.error(`status code not 200 ${dataRes}`)

            return false
          }
          const mintWithMeta = {
            ...dataRes.data,
            mint: mint,
          }

          writeStream.write(`${JSON.stringify(mintWithMeta, null, 3)},`)

          return mintWithMeta
        } catch (e) {
          const axiosError = e as AxiosError
          if (axiosError.isAxiosError) {
            console.log('error in fetching arweave', axiosError.toJSON())
          }
          return false
        }
      },
      3
    )
  ).filter((n) => !!n)

  writeStream.write(']')
  writeStream.close()

  return nfts
}

export async function getNFTsForOwner(
  connection: web3.Connection,
  ownerAddress: web3.PublicKey,
  allMints?: string[]
) {
  const allMintsCandyMachine =
    allMints ??
    (await fetchHashTable(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!))
  const allTokens: string[] = []
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    ownerAddress,
    {
      programId: spl.TOKEN_PROGRAM_ID,
    }
  )

  for (let index = 0; index < tokenAccounts.value.length; index++) {
    const tokenAccount = tokenAccounts.value[index]
    const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount

    if (
      tokenAmount.amount == '1' &&
      tokenAmount.decimals == '0' &&
      allMintsCandyMachine.includes(tokenAccount.account.data.parsed.info.mint)
    ) {
      /*  allTokens?.push(tokenAccount.account.data.parsed.info.mint as string)
      continue */
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

      const metadata: any = new Metadata(
        ownerAddress.toString(),
        accountInfo.value
      )
      const dataRes = await axios.get(metadata.data.data.uri)
      if (dataRes.status === 200) {
        allTokens.push({
          ...dataRes.data,
          mint: tokenAccount.account.data.parsed.info.mint,
        })
      }
    }
  }

  return allTokens
}

async function sendNft(mintStr: string, dest: string, wallet: Keypair) {
  const destPubkey = new PublicKey(dest)
  const mint = new spl.Token(
    connection,
    new PublicKey(mintStr),
    spl.TOKEN_PROGRAM_ID,
    wallet
  )

  const destAccount = await mint.getOrCreateAssociatedAccountInfo(destPubkey)

  const soourceAccount = await mint.getOrCreateAssociatedAccountInfo(
    wallet.publicKey
  )

  /* console.log('account', account.address.toBase58()) */

  const txId = await mint.transfer(
    soourceAccount.address,
    destAccount.address,
    wallet,
    [wallet],
    1
  )
  await connection.confirmTransaction(txId, 'confirmed')
  return txId
}

async function findRandomNft(opts: {
  hashList: string[]
  rarityRankGreatThan: number
}) {
  let properNft: { mint: string; rarity: number; link: string } | undefined =
    undefined

  while (!properNft) {
    const randomNftAddress = _.sample(opts.hashList)
    const randomNft = (
      await axios.get(
        `https://api.rarityrates.com/collections/stoned-ape-crew?item_per_page=20&page=0&statistical_rarity=Off&trait_normalization=Off&trait_count=On&token_info=${randomNftAddress}`
      )
    ).data as any
    const rarity = randomNft.data[0].rank as number

    if (rarity > opts.rarityRankGreatThan)
      properNft = {
        rarity,
        mint: randomNftAddress!,
        link: `https://magiceden.io/item-details/${randomNftAddress}`,
      }
  }
  return properNft
}

export function loadWalletKey(keypair: string): Keypair {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!')
  }

  const loaded = Keypair.fromSecretKey(
    new Uint8Array(
      /* JSON.parse(fs.readFileSync(keypair).toString()) */ require(keypair)
    )
  )
  console.log(`wallet public key: ${loaded.publicKey}`)
  return loaded
}

program.command('testSendNft').action(async (e) => {
  const txId = await sendNft(
    '3XNZbBeNdKuvzFtBL8rVVUUzjii2RZ6EqtdBmJvynweY',
    'GpUCXJD33rBH4ENZTfuV4jiQW89TCAC9SGnq3gGurnST',
    wallet
  )

  console.log('txId', txId)
})

async function fetchHashTable(
  hash: string,
  metadataEnabled?: boolean
): Promise<any[]> {
  console.time()
  const metadataAccounts = await MetadataProgram.getProgramAccounts(
    connection,
    {
      filters: [
        {
          memcmp: {
            offset:
              1 +
              32 +
              32 +
              4 +
              MAX_NAME_LENGTH +
              4 +
              MAX_URI_LENGTH +
              4 +
              MAX_SYMBOL_LENGTH +
              2 +
              1 +
              4 +
              0 * MAX_CREATOR_LEN,
            bytes: hash,
          },
        },
      ],
    }
  )

  const mintHashes: any = []

  for (let index = 0; index < metadataAccounts.length; index++) {
    const account = metadataAccounts[index]
    const accountInfo: any = await connection.getParsedAccountInfo(
      account.pubkey
    )
    const metadata: any = new Metadata(hash.toString(), accountInfo.value)
    if (metadataEnabled) mintHashes.push(metadata.data)
    else mintHashes.push(metadata.data.mint)
  }

  return mintHashes
}

program.parse(process.argv)
