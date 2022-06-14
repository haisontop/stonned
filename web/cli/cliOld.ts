import { PrismaClient } from '.prisma/client'
import {
  MAX_CREATOR_LEN,
  MAX_NAME_LENGTH,
  MAX_SYMBOL_LENGTH,
  MAX_URI_LENGTH,
  Metadata,
  MetadataProgram,
} from '@metaplex/js'
/* import { TREASURY_ADDRESS } from './src/config' */
import * as anchor from '@project-serum/anchor'
import { Program, web3 } from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import * as spl from '@solana/spl-token'
import { ConfirmedSignatureInfo, Keypair, PublicKey } from '@solana/web3.js'
import asyncBatch from 'async-batch'
import axios, { AxiosError } from 'axios'
import { Command } from 'commander'
import { Client, Intents, Message } from 'discord.js'
import fs from 'fs'
import _ from 'lodash'
import {
  breedingIdl,
  connection,
  evolutionIdl,
  evolutionProgramId,
  stakingIdl,
  stakingProgramId,
} from '../src/config/config'
import { updateMetadata } from '../src/pages/api/evolution/startEvolution'
import { getAtaForMint } from '../src/utils/candyMachineIntern/candyMachineHelpers'
import { Token } from '@solana/spl-token'
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAddressInstruction,
  getTokenAccount,
} from '../src/utils/solUtils'
require('dotenv').config()

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

console.log(
  'connection',
  console.log('connection', (connection as any)._rpcEndpoint)
)

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

program.command('getNftSplittedPerStakingReward').action(async (e) => {
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
})

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

  const walletOwners = (
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

  console.log('walletOwners', walletOwners)

  console.log('mints', mints)

  console.log('utility holders', holders.length)

  const uniquUsers = _.uniqBy(holders, (s) => s)

  console.log('uniquUsers', uniquUsers.length)
})

program.command('updateEvolutionAccounts').action(async (e) => {
  const provider = new anchor.Provider(connection, wallet as any, {
    commitment: 'recent',
  })
  const program = new Program(evolutionIdl, evolutionProgramId, provider)

  const res = await updateMetadata(
    wallet,
    provider.connection,
    'E1G4RzsCyiDC15NW71r3jACCVgi6L3hythh2vWK5zxSe',
    true,
    'devnet'
  )

  console.log('res', res)

  /* let [userEvolutionAddress, userEvolutionAccountAddressBump] =
    await web3.PublicKey.findProgramAddress(
      [nft.toBuffer(), provider.wallet.publicKey.toBuffer()],
      program.programId
    )

  program.rpc.updateEvolution({
    accounts: {},
  }) 

  fs.writeFileSync('nftsWithMeta.json', JSON.stringify(nftsWithMeta, null, 3)) */
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
