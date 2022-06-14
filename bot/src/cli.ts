import { client } from './client'
import * as fs from 'fs'
import { Command } from 'commander'
import { prisma } from './prisma'
import {
  getAllMessagesFromChannel,
  getSolAdressFromText,
} from './utils/discordUtils'
import { GuildMember } from 'discord.js'
import asyncBatch from 'async-batch'
import { updateApeRolesOfMember } from './service'
import {
  connection,
  evolutionProgram,
  stakingProgram,
  stakingProgramId,
  wallet,
} from './config'
import { Keypair, PublicKey } from '@solana/web3.js'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { AccountsCoder } from '@project-serum/anchor'
import {
  getBreedingAccountsForOwner,
  getBreedingNftsForOwner,
  getBreedingNftsForRenters,
  getEvolutionAccountsForOwner,
  getEvolutionNftsForOwner,
  getNFT,
  getNFTsForOwner,
  getNFTsForTokens,
  getNftsOfRescuePool,
  getRolesForUser,
  getStakedNftsForOwner,
  getStakingAccountsForOwner,
} from './utils/solUtils'
import * as csv from 'json2csv'
import _ from 'lodash'
import axios from 'axios'

const program = new Command()

const guildId = '897158531193638913'

program
  .command('updateApeRoles')
  .option('-od, --onlyAddress <string>')
  .action(async (options, cmd) => {
    const { onlyAddress } = cmd.opts()

    if (onlyAddress) {
      console.log(`only for owner ${onlyAddress}`)
    }

    await client.login(process.env.BOT_TOKEN ?? '')

    const guild = await client.guilds.fetch(guildId)

    if (!guild) throw new Error('no guild defined')

    const dbUsers = await prisma.user.findMany({
      where: {
        address: !onlyAddress
          ? {
              not: null,
            }
          : onlyAddress,
      },
    })

    console.log('dbUsers', dbUsers.length)

    const verifiedMembers: any = []

    console.time('timeTaken')

    await asyncBatch(
      dbUsers,
      async (dbUser, taskIndex: number, workerIndex: number) => {
        try {
          console.log(
            `started task ${taskIndex}/${dbUsers.length}; workderId: ${workerIndex}`
          )

          const member = await guild.members.fetch(dbUser.discordId)
          console.log(`start updating member ${member.user.username}`)
          if (!member) return
          await updateApeRolesOfMember(member)
        } catch (error) {
          console.error(
            `error at updateApeRoles dbUser ${JSON.stringify(dbUser, null, 3)}`,
            error
          )
        }
        console.log(
          `finished task ${taskIndex}/${dbUsers.length}; workderId: ${workerIndex}`
        )
      },
      5
    )

    console.timeEnd('timeTaken')

    process.exit()
  })

program.command('checkUser').action(async (e) => {
  const ownerAddressString = '5dwGQWdzpkDseKTZyVWVpNM1nGBuophkVUwstj3f2uoL'
  const ownedNfts = await getNFTsForOwner(ownerAddressString)
  const stakedNfts = await getStakedNftsForOwner(ownerAddressString)

  const breedingNfts = await getBreedingNftsForOwner(ownerAddressString)
  const breedingNftsOfRenters = await getBreedingNftsForRenters(
    ownerAddressString
  )
  const nftsInRescuePool = await getNftsOfRescuePool(ownerAddressString)

  const evolutionNfts = await getEvolutionNftsForOwner(ownerAddressString)

  console.log(
    'nftsForUser',
    JSON.stringify(
      {
        ownedNfts,
        stakedNfts,
        breedingNfts,
        breedingNftsOfRenters,
        nftsInRescuePool,
        evolutionNfts,
      },
      null,
      3
    )
  )

  /* const breedingAccounts = await getBreedingAccountsForOwner(ownerAddressString)
  console.log('breedingAccounts', breedingAccounts) */
})

program.command('getRolesForUser').action(async (e) => {
  const roles = await getRolesForUser(
    '5dwGQWdzpkDseKTZyVWVpNM1nGBuophkVUwstj3f2uoL'
  )
  console.log('roles', roles)
})

program.command('getUsernameByWallet').action(async (e) => {
  await client.login(process.env.BOT_TOKEN ?? '')
  const wallet = await prisma.user.findFirst({
    where: { address: 'GpUCXJD33rBH4ENZTfuV4jiQW89TCAC9SGnq3gGurnST' },
  })
  const user = await client.users.fetch(wallet?.discordId!, {})

  const guild = await client.guilds.fetch('897158531193638913')
  const users = await guild.members.fetch(user.id)

  console.log('users', users)
})

/* program.command('walletToUsernames').action(async (e) => {
  await client.login(process.env.BOT_TOKEN ?? '')
  const wallets = [
    '56VeLE1wXw6YA2vucj7r7gWiisDkcqFkymxPSJ8bt466’,
    'HT88FBGmkcWBt3HymqBVFi91K2hARn1djXFbRS35CFCM’,
    '6aSHToWCc5gcZfXLQ5NZdGuGoE9Gn7MYgKvcZTqmaTCX’,
    '8X5W11WS3ULEyaGM4Lxwy9DB2J58JzQKA17hYr3xaw8B’,
    'DTgUoYFCfELQUzAmR2DVm4rB5k1uA4oQuxS5thKvw58k’,
    'DS157tTzP5Aif4myrRJvBWamXRM6mqLtPKwSWHiAfP7G’,
    'GS9JdJdF4YWPgpnXfwNxdFgTqF4iLbGfHfqcmt8hVoTN’,
    '135iseDq9ixEwTkfH75T7osV2adaJqMjeqDLqqGJdVyJ’,
    'AZjGWtdca9B41zYQNtj3sTsLxCYc1pAd5zJnu2or1pGp’,
    '2eYVBQpv2MFgSNHGUFQ2LUErQG1s5AaiKtgUeQsR3wQU’
  ];
  const wallet = await prisma.user.findFirst({
    where: { address: 'GpUCXJD33rBH4ENZTfuV4jiQW89TCAC9SGnq3gGurnST' },
  })
  const user = await client.users.fetch(wallet?.discordId!, {})

  const guild = await client.guilds.fetch('897158531193638913')
  const users = await guild.members.fetch(user.id)

  console.log('users', users)
}) */

program
  .command('getWalletByUsername')
  .argument('<username>')
  .action(async (username, e) => {
    await client.login(process.env.BOT_TOKEN ?? '')
    const guild = await client.guilds.fetch('897158531193638913')
    const users = (
      await guild.members.search({
        query: username,
      })
    ).toJSON()
    if (users.length > 1) throw new Error('found more than one')
    const user = users[0]

    const wallet = await prisma.user.findFirst({
      where: { discordId: user.id },
    })

    console.log('wallet', wallet)
  })

program.command('checkRoles').action(async (e) => {
  await client.login(process.env.BOT_TOKEN ?? '')

  const guild = await client.guilds.fetch('897158531193638913')

  const roles = await guild.roles.fetch()

  const newRoles = roles.filter((r) => r.name == 'new role')

  console.log(
    'newRoles',
    newRoles
      .map((r) => ({ name: r.name, createdAt: r.createdAt }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    newRoles.size
  )

  for (let role of newRoles.toJSON()) {
    console.log(`deleting role ${role.name}`)

    await role.delete()
  }
})

program.command('snapshotStakingUser').action(async (e) => {
  const stakingAccount = await stakingProgram.account.stakeAccount.all()

  const uniquUsers = _.uniqBy(stakingAccount, (s) =>
    s.account.authority.toBase58()
  )

  const onlyUsers = uniquUsers.map((u) => u.account.authority.toBase58())

  console.log('onlyUsers', onlyUsers[0])

  fs.writeFileSync('stakingUsers.json', JSON.stringify(onlyUsers, null, 3))
})

program.command('userOwnerAccount').action(async (e) => {
  const stakingAccounts = await stakingProgram.account.stakeAccount.all()
  const evolutionAccounts =
    await evolutionProgram.account.evolutionAccount.all()
  /* const evolutionAccounts = await stakingProgram.account.stakeAccount.all() */
  const lockedNftAccounts = [...stakingAccounts, ...evolutionAccounts]

  const nfts: any[] = []

  await asyncBatch(
    lockedNftAccounts,
    async (account, taskIndex, workerIndex) => {
      try {
        const nft = await getNFT(account.account.token)
        nfts.push(
          _.transform({ nft, account }, function (result, value, key) {
            if (value.toBase58) result[key] = value.toBase58()
            else result[key] = value

            return result
          })
        )
      } catch (err) {
        console.error('error at fetch nft', err)
      }
    },
    5
  )

  console.log(nfts)

  const parser = new csv.Parser({
    transforms: [csv.transforms.flatten()],
  })
  const csvStr = parser.parse(nfts)

  fs.writeFileSync('nfts.csv', csvStr)

  /* const uniquUsers = _.countBy(lockedNftAccount, (s) =>
    s.account.authority.toBase58()
  )

  const stats = _.countBy(uniquUsers, (u) => u)

   const onlyUsers = uniquUsers.map((u) => u.account.authority.toBase58()) 

  const mapped = Object.keys(stats).map((s) => ({
    nftCount: Number(s),
    userCount: stats[s],
  }))

  const overTwo = mapped.filter((s) => s.nftCount > 1)

  const overTwoSum = _.sumBy(overTwo, (u) => u.userCount)

  console.log('mapped', mapped) */
})

program.command('uniqueHolders').action(async (e) => {
  const stakingAccounts = await stakingProgram.account.stakeAccount.all()
  const evolutionAccounts =
    await evolutionProgram.account.evolutionAccount.all()
  const lockedNftAccounts = [...stakingAccounts, ...evolutionAccounts]

  const nfts = lockedNftAccounts

  /* await asyncBatch(
    lockedNftAccounts,
    async (account, taskIndex, workerIndex) => {
      try {
        const nft = await getNFT(account.account.token)
        nfts.push(
          _.transform({ nft, account }, function (result, value, key) {
            if (value.toBase58) result[key] = value.toBase58()
            else result[key] = value

            return result
          })
        )
      } catch (err) {
        console.error('error at fetch nft', err)
      }
    },
    5
  ) */

  console.log('nfts.length', nfts.length)

  const uniquUsers = _.uniqBy(nfts, (s) => s.account.authority.toBase58())

  console.log('uniquUsers', uniquUsers.length)

  return
  const parser = new csv.Parser({
    transforms: [csv.transforms.flatten()],
  })
  const csvStr = parser.parse(nfts)

  fs.writeFileSync('nfts.csv', csvStr)

  /* const uniquUsers = _.countBy(lockedNftAccount, (s) =>
    s.account.authority.toBase58()
  )

  const stats = _.countBy(uniquUsers, (u) => u)

   const onlyUsers = uniquUsers.map((u) => u.account.authority.toBase58()) 

  const mapped = Object.keys(stats).map((s) => ({
    nftCount: Number(s),
    userCount: stats[s],
  }))

  const overTwo = mapped.filter((s) => s.nftCount > 1)

  const overTwoSum = _.sumBy(overTwo, (u) => u.userCount)

  console.log('mapped', mapped) */
})

program.command('testGetNFTsForTokens').action(async (e) => {
  const ownerAddress = 'GpUCXJD33rBH4ENZTfuV4jiQW89TCAC9SGnq3gGurnST'
  const nftTokenString = 'FRZsteAsrtwjdi7S65dvrE2gPjJFa6GPdCoi1cJy6yLk'

  const stakingAccounts = await getStakingAccountsForOwner(ownerAddress)

  const nfts = await getNFTsForTokens(stakingAccounts.map((s) => s.token))

  console.log('nfts', nfts)
})

program.command('testGetEvolutionNFTs').action(async (e) => {
  const ownerAddress = '3aUf5ehvdWLHJj7URJrXSKQjRj1mA3eJKZmg678PcsuA'

  const accounts = await getEvolutionAccountsForOwner(ownerAddress)

  const nfts = await getNFTsForTokens(accounts.map((a) => a.token))

  console.log('evolution nfts', nfts)
})

export async function getAllMembersFromGuild(
  guildId: string,
  channelId: string
) {
  const guild = await client.guilds.fetch(guildId)

  const allMembers: GuildMember[] = []

  let nonce: any
  while (1) {
    const membersRes = await guild.members.fetch({
      time: 10000000,
    })

    const members = membersRes.toJSON()

    if (members.length === 0) {
      break
    }

    allMembers.push(...members)
  }

  return allMembers
}

function saveAirdropAddresses() {
  client.once('ready', async () => {
    const guildId = '904400750476689448'
    const guild = await client.guilds.fetch(guildId)
    for (let id of [
      '905202196671528970',
      '905974550615969843',
      '904864861970907156',
      '906322143099367473',
    ]) {
      const all = await getAllMessagesFromChannel(guildId, id)

      const channel = await guild.channels.fetch(id)

      console.log(channel?.name + ' length', all.length)

      fs.writeFileSync(
        channel?.name + '.json',
        JSON.stringify(
          all
            .filter((m) => getSolAdressFromText(m.content))
            .map((m) => ({
              user: m.author.username,
              userId: m.author.id,
              createdAt: m.createdAt.toISOString(),
              address: getSolAdressFromText(m.content),
            })),
          null,
          3
        )
      )
    }
  })
}

program
  .command('botChannel')
  .option('-od, --onlyAddress <string>')
  .action(async (options, cmd) => {
    await client.login(process.env.BOT_TOKEN ?? '')
    const guild = await client.guilds.fetch(guildId)
    const channel = await guild.channels.fetch('913965089885917184')
    const res = await axios.get(
      'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/stoned_ape_crew'
    )
    console.log('res', res.data)

    console.log('channel', channel)
  })

program.parse(process.argv)
