import * as anchor from '@project-serum/anchor'
import * as web3 from '@solana/web3.js'
import {
  airdrop,
  getAnchorContext,
  getLotteryPda,
  getLotteryUserPda,
  getOrCreateTestToken,
  handleTransaction,
  loadKeypair,
} from './tests/utils'
import * as d from 'date-fns'
import { BN } from '@project-serum/anchor'
import { createCLI, path } from 'soly'
import * as s from 'soly'
import { Cluster, ParsedConfirmedTransaction, PublicKey } from '@solana/web3.js'
import fs from 'fs'
import reattempt from 'reattempt'
import _ from 'lodash'
import { PrismaClient } from '../bot/node_modules/@prisma/client'
import asyncBatch from 'async-batch'
import nodePath from 'path'
import * as csv from 'json2csv'

const botPrisma = new PrismaClient()

const cli = createCLI('cli')

const dateString = s.preprocess((arg) => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
}, s.date())

const backendSigner = loadKeypair(
  `${process.env.HOME}/config/solana/backend-signer.json`
)

cli.command('fetch', (c) => {
  // path is used to parse and throw error if the path does not exists
  const [file] = c.positionals([s.path()])

  const { network, keypair } = c.named({
    network: s.enum(['mainnet-beta', 'devnet']).default('devnet'),
    keypair: s.path(),
  })
  network.alias('n')
  keypair.alias('k')

  return async () => {
    const { adminUser, connection, program } = getAnchorContext({
      keypairPath: keypair.value,
      network: network.value,
    })

    const raffleConfig = s
      .object({
        name: s.string(),
      })
      .parse(JSON.parse(fs.readFileSync(file.value, 'utf-8')))

    const lotteryPda = await getLotteryPda(
      adminUser.publicKey,
      raffleConfig.name
    )

    console.log('lottery pubkey', lotteryPda[0])

    let lottery = await program.account.lottery.fetch(lotteryPda[0])
    console.log('lottery', JSON.stringify(lottery, null, 3))

    const lotteryUsers = (await program.account.lotteryUser.all()).filter(
      (lu) => lu.account.lottery.equals(lotteryPda[0])
    )

    const winners = lottery.winningTickets.map((w) => {
      const foundUser = lotteryUsers.find((u) => u.account.tickets.includes(w))

      return foundUser?.account.authority!
    })
    console.log('winners', winners)
    console.log('lottery', lotteryPda[0].toBase58())
  }
})

cli.command('fetchAll', (c) => {
  // path is used to parse and throw error if the path does not exists

  const { network } = c.named({
    network: s.enum(['mainnet-beta', 'devnet']).default('devnet'),
  })
  network.alias('n')

  return async () => {
    const { adminUser, connection, program } = getAnchorContext({
      network: network.value,
    })

    const allRaffles = (await program.account.lottery.all()).sort((a, b) => {
      /*  if (
        !(a.account.name as string).includes('#') ||
        !(b.account.name as string).includes('#')
      ) */
      return (
        Number(a.account.starts.toNumber()) -
        Number(b.account.starts.toNumber())
      )
    })

    const defaultRaffleStat = {
      name: '',
      tokens: [
        {
          name: 'SOL',
          amount: 0,
        },
        {
          name: '$PUFF',
          token: 'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB',
          amount: 0,
        },
        {
          name: '$ALL',
          token: '7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj',
          amount: 0,
        },
      ],
    }

    const raffleStats: typeof defaultRaffleStat[] = []

    for (let raffle of allRaffles.slice(allRaffles.length - 7)) {
      console.log(`started ${raffle.account.name}`)

      const signatures = await connection.getConfirmedSignaturesForAddress2(
        raffle.publicKey,
        {}
      )

      console.log('signatures', signatures.length)

      const transactions = (await connection.getParsedConfirmedTransactions(
        signatures.map((s) => s.signature)
      ))!

      console.log('transactions', transactions.length)

      const buyTransactions = transactions.filter((t) =>
        t?.meta?.logMessages?.find((m) => m.includes('will buy_ticket'))
      ) as ParsedConfirmedTransaction[]

      const tokenNamesMap = {
        G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB: 'puff',
        '7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj': 'all',
      }

      const raffleStat = _.cloneDeep(defaultRaffleStat)
      raffleStat.name = raffle.account.name as string

      console.log('buyTransactions', buyTransactions.length)

      buyTransactions.forEach((t) => {
        const user = t.transaction.message.accountKeys[0].pubkey

        const solTrans = t.meta?.innerInstructions?.find((innerInstruction) =>
          innerInstruction.instructions.find(
            (i: any) =>
              i.programId.equals(web3.SystemProgram.programId) &&
              i.parsed.type === 'transfer'
          )
        )

        const solInstr = solTrans?.instructions.find(
          (i: any) =>
            i.programId.equals(web3.SystemProgram.programId) &&
            i.parsed.type === 'transfer'
        )

        const solStat = raffleStat.tokens.find((s) => s.name == 'SOL')
        if (solInstr && solStat) {
          solStat.amount +=
            (solInstr as any).parsed.info.lamports / web3.LAMPORTS_PER_SOL
        }

        const preTokenBalance = t.meta?.preTokenBalances?.find(
          (p) => p.owner === user.toBase58()
        )

        const postTokenBalance = t.meta?.postTokenBalances?.find(
          (p) => p.owner === user.toBase58()
        )

        const tokenStat = raffleStat.tokens.find(
          (t) =>
            t.token === preTokenBalance?.mint &&
            t.token === postTokenBalance?.mint
        )

        if (tokenStat && preTokenBalance && postTokenBalance)
          tokenStat.amount +=
            (preTokenBalance.uiTokenAmount.uiAmount ?? 0) -
            (postTokenBalance.uiTokenAmount.uiAmount ?? 0)
      })

      raffleStats.push(raffleStat)
    }

    const parser = new csv.Parser({
      transforms: [csv.transforms.flatten()],
    })
    const csvStr = parser.parse(
      raffleStats.map((s) => ({
        name: s.name,
        ...s.tokens.reduce((a, v) => ({ ...a, [v.name]: v.amount }), {} as any),
      }))
    )

    fs.writeFileSync(nodePath.join(__dirname, 'raffleStats.csv'), csvStr)
  }
})

cli.command('winnersToDiscordIds', (c) => {
  // path is used to parse and throw error if the path does not exists
  const [file] = c.positionals([s.path()])

  const { network, keypair } = c.named({
    network: s.enum(['mainnet-beta', 'devnet']).default('devnet'),
    keypair: s.path(),
  })
  network.alias('n')
  keypair.alias('k')

  return async () => {
    const { adminUser, connection, program } = getAnchorContext({
      network: network.value,
      keypairPath: keypair.value,
    })

    const raffleConfig = s
      .object({
        name: s.string(),
      })
      .parse(JSON.parse(fs.readFileSync(file.value, 'utf-8')))

    const lotteryPda = await getLotteryPda(
      adminUser.publicKey,
      raffleConfig.name
    )

    console.log('lottery pubkey', lotteryPda[0])

    let lottery = await program.account.lottery.fetch(lotteryPda[0])
    console.log('lottery', JSON.stringify(lottery, null, 3))

    const lotteryUsers = (await program.account.lotteryUser.all()).filter(
      (lu) => lu.account.lottery.equals(lotteryPda[0])
    )

    const winners = lottery.winningTickets.map((w) => {
      const foundUser = lotteryUsers.find((u) => u.account.tickets.includes(w))

      return foundUser?.account.authority!
    })
    const winnersWithDiscordId = await asyncBatch(
      winners,
      async (winner) => {
        const user = await botPrisma.user.findFirst({
          where: { address: winner.toBase58() },
        })

        return {
          winner: winner.toBase58(),
          discordId: user?.discordId,
        }
      },
      5
    )
    console.log('winners', winnersWithDiscordId)
  }
})

cli.command('create', (c) => {
  // path is used to parse and throw error if the path does not exists
  const [file] = c.positionals([s.path()])

  const { network, keypair } = c.named({
    network: s.enum(['mainnet-beta', 'devnet']).default('devnet'),
    keypair: s.path(),
  })
  network.alias('n')
  keypair.alias('k')

  console.log('so')

  return async () => {
    console.log('so')
    const { adminUser, connection, program } = getAnchorContext({
      keypairPath: keypair.value,
      network: network.value,
    })

    console.log('before')

    const raffleConfig = s
      .object({
        name: s.string(),
        start: dateString,
        end: dateString,
        solPrice: s.number(),
        totalPriceValue: s.number(),
        payTokens: s.string().array(),
        prices: s.array(
          s.object({
            mint: s.string(),
            amount: s.number(),
          })
        ),
      })
      .parse(JSON.parse(fs.readFileSync(file.value, 'utf-8')))

    console.log('after')

    console.log('raffleConfig', raffleConfig)

    const ticketPrice = new BN(raffleConfig.solPrice * web3.LAMPORTS_PER_SOL)

    const lotteryPda = await getLotteryPda(
      adminUser.publicKey,
      raffleConfig.name
    )

    let parsedPrices = raffleConfig.prices.map((price, i) => {
      return {
        amount: new anchor.BN(price.amount),
        mint: new PublicKey(price.mint),
      }
    })

    if (raffleConfig.name === 'Lucky Dip #14') {
      ;(parsedPrices[0] as any).winningTicket = new anchor.BN(1641)
    }

    console.log('before init')
    const initLottery = await program.instruction.initLottery(
      lotteryPda[1],
      raffleConfig.name,
      ticketPrice,
      [] /* parsedPrices */,
      new BN(raffleConfig.start.getTime() / 1000),
      new BN(raffleConfig.end.getTime() / 1000),
      new BN(raffleConfig.totalPriceValue),
      raffleConfig.payTokens.map((p) => new web3.PublicKey(p)),
      {
        accounts: {
          lottery: lotteryPda[0],
          user: adminUser.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
      }
    )
    console.log('after init')

    const tx = await connection.sendTransaction(
      new web3.Transaction({
        recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
        feePayer: adminUser.publicKey,
      }).add(initLottery),
      [adminUser]
    )

    await handleTransaction(tx, connection, {
      showLogs: true,
      commitment: 'finalized',
    })
    console.log('lottery created')

    const pricesChunks = _.chunk(parsedPrices, 20)

    for (const prices of pricesChunks) {
      const addPricesInstr = await program.instruction.addPrices(prices, {
        accounts: {
          lottery: lotteryPda[0],
          user: adminUser.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
      })

      const addPricesTx = await connection.sendTransaction(
        new web3.Transaction({
          recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
          feePayer: adminUser.publicKey,
        }).add(addPricesInstr),
        [adminUser]
      )
      await handleTransaction(addPricesTx, connection, {
        commitment: 'confirmed',
      })
    }

    let lotteryAccount = await program.account.lottery.fetch(lotteryPda[0])
    console.log('lotteryAccount', {
      ...lotteryAccount,
      authority: lotteryAccount.authority.toBase58(),
      tickets: undefined,
      prices: (lotteryAccount.prices as any).map((price: any) => ({
        ...price,
        mint: price.mint.toBase58(),
      })),
    })
  }
})

cli.command('raffle', (c) => {
  // path is used to parse and throw error if the path does not exists
  const [file] = c.positionals([s.path()])

  const { network, keypair } = c.named({
    network: s.enum(['mainnet-beta', 'devnet']).default('devnet'),
    keypair: s.path(),
  })
  network.alias('n')
  keypair.alias('k')

  return async () => {
    const { adminUser, connection, program } = getAnchorContext({
      keypairPath: keypair.value,
      network: network.value,
    })

    const raffleConfig = s
      .object({
        name: s.string(),
      })
      .parse(JSON.parse(fs.readFileSync(file.value, 'utf-8')))

    console.log('raffleConfig', raffleConfig)

    const lotteryPda = await getLotteryPda(
      adminUser.publicKey,
      raffleConfig.name
    )

    let lottery = await program.account.lottery.fetch(lotteryPda[0])
    console.log('pda', lotteryPda[0])

    console.log('lottery.ticketCount', lottery.ticketCount)

    if (lottery.winningTickets.length > 0) {
      console.log('already raffle')
      return
    }

    const winning_tickets: number[] = []
    for (
      let i = 0;
      i <
      ((lottery.prices as any).length > lottery.ticketCount
        ? lottery.ticketCount
        : (lottery.prices as any).length);
      i++
    ) {
      let ticket = -1
      while (ticket == -1 || winning_tickets.includes(ticket)) {
        ticket = _.random(1, lottery.ticketCount)
      }
      winning_tickets.push(ticket)
    }

    /* winning_tickets[1] = 105 */

    const lotteryUsers = (await program.account.lotteryUser.all()).filter((u) =>
      u.account.lottery.equals(lotteryPda[0])
    )

    const winners = winning_tickets.map(
      (w) =>
        lotteryUsers.find((u) => u.account.tickets.includes(w))?.account
          .authority!
    )

    let tx = await program.rpc.raffle(winning_tickets, winners, {
      accounts: {
        lottery: lotteryPda[0],
        user: adminUser.publicKey,
        backendUser: backendSigner.publicKey,
      },
      signers: [backendSigner],
    })
    await handleTransaction(tx, connection, { showLogs: true })

    let lotteryAccount = await program.account.lottery.fetch(lotteryPda[0])

    console.log('lotteryAccount', JSON.stringify(lotteryAccount, null, 3))

    const winnersWithDiscordId = await asyncBatch(
      winners,
      async (winner) => {
        const user = await botPrisma.user.findFirst({
          where: { address: winner.toBase58() },
        })

        return {
          winner: winner.toBase58(),
          discordId: user?.discordId,
        }
      },
      5
    )
    console.log('winners', winnersWithDiscordId)
  }
})

cli.command('simulateWinner', (c) => {
  // path is used to parse and throw error if the path does not exists
  const [file] = c.positionals([s.path()])

  const { network, keypair } = c.named({
    network: s.enum(['mainnet-beta', 'devnet']).default('devnet'),
    keypair: s.path(),
  })
  network.alias('n')
  keypair.alias('k')

  return async () => {
    const { adminUser, connection, program } = getAnchorContext({
      keypairPath: keypair.value,
      network: network.value,
    })

    const raffleConfig = s
      .object({
        name: s.string(),
      })
      .parse(JSON.parse(fs.readFileSync(file.value, 'utf-8')))

    console.log('raffleConfig', raffleConfig)

    const lotteryPda = await getLotteryPda(
      adminUser.publicKey,
      raffleConfig.name
    )

    let lottery = await program.account.lottery.fetch(lotteryPda[0])
    console.log('pda', lotteryPda[0])

    console.log('lottery.ticketCount', lottery.ticketCount)

    const winner = new PublicKey('EDLSeXxksEBQyznGETif7TUcHnqxjXQQzsDCuYyATfor')
    const lotteryUserPda = await getLotteryUserPda(lotteryPda[0], winner)
    const lotteryUser = await program.account.lotteryUser.fetch(
      lotteryUserPda[0]
    )

    const winning_tickets: number[] = lotteryUser.tickets.slice(
      0,
      (lottery.prices as any[]).length
    )

    const lotteryUsers = (await program.account.lotteryUser.all()).filter((u) =>
      u.account.lottery.equals(lotteryPda[0])
    )

    const winners = winning_tickets.map(
      (w) =>
        lotteryUsers.find((u) => u.account.tickets.includes(w))?.account
          .authority!
    )

    let tx = await program.rpc.raffle(winning_tickets, winners, {
      accounts: {
        lottery: lotteryPda[0],
        user: adminUser.publicKey,
        backendUser: backendSigner.publicKey,
      },
      signers: [backendSigner],
    })
    await handleTransaction(tx, connection, { showLogs: true })

    let lotteryAccount = await program.account.lottery.fetch(lotteryPda[0])

    console.log('lotteryAccount', JSON.stringify(lotteryAccount, null, 3))
  }
})

cli.parse()