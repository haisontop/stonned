import * as anchor from '@project-serum/anchor'
import {
  airdrop,
  generateUserWithSol,
  getAnchorContext,
  getLotteryPda,
  getLotteryUserPda,
  getOrCreateTestToken,
  handleTransaction,
  loadKeypair,
  loadWallet,
} from './utils'
import { Keypair, SystemProgram } from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import _ from 'lodash'
import * as d from 'date-fns'
import { BN } from '@project-serum/anchor'

const { adminUser, connection, program } = getAnchorContext({
  keypairPath: `${process.env.HOME}/config/solana/sac-treasury.json`,
})

const backendSigner = loadKeypair(
  `${process.env.HOME}/config/solana/backend-signer.json`
)

describe('lottery', () => {
  // Configure the client to use the local cluster.

  it('prepare', async () => {
    await airdrop(connection, adminUser.publicKey, 10)
  })

  let payToken: spl.Token

  it('init lottery', async () => {
    const lottery = Keypair.generate()

    payToken = await getOrCreateTestToken({
      connection,
      tokenOwner: adminUser,
    })

    console.log('payToken', payToken.publicKey.toBase58())

    let payTokenAccount = await payToken.getOrCreateAssociatedAccountInfo(
      adminUser.publicKey
    )
    /*   await payToken.mintTo(
      payTokenAccount,
      adminUser.publicKey,
      [adminUser],
      100
    ) */

    const prices = await Promise.all(
      [...Array(5).keys()].map(async (v, i) => {
        const token = await getOrCreateTestToken({
          connection,
          tokenOwner: adminUser,
        })

        return {
          amount: new anchor.BN(v === 0 ? 1 : 1000 - (v - 1) * 250),
          mint: token.publicKey,
        }
      })
    )

    console.log(
      'prices',
      prices.map((price) => ({
        ...price,
        mint: price.mint.toBase58(),
      }))
    )

    const lotteryName = 'First Lottery'
    const lotteryPda = await getLotteryPda(adminUser.publicKey, lotteryName)

    const starts = new Date()
    const ends = d.addDays(starts, 1)

    const tx = await program.rpc.initLottery(
      lotteryPda[1],
      lotteryName,
      new anchor.BN(42),
      prices,
      new BN(starts.getTime() / 1000),
      new BN(ends.getTime() / 1000),
      {
        accounts: {
          lottery: lotteryPda[0],
          user: adminUser.publicKey,
          payToken: payToken.publicKey,
          fundsTokenAccount: payTokenAccount.address,
          systemProgram: SystemProgram.programId,
        },
      }
    )
    await handleTransaction(tx, connection, { showLogs: true })

    let lotteryAccount = await program.account.lottery.fetch(lotteryPda[0])

    console.log('lotteryAccount', {
      ...lotteryAccount,
      authority: lotteryAccount.authority.toBase58(),
      payToken: lotteryAccount.payToken.toBase58(),
      tickets: undefined,
      prices: (lotteryAccount.prices as any).map((price) => ({
        ...price,
        mint: price.mint.toBase58(),
      })),
    })

    await program.rpc.initLottery(
      lotteryPda[1],
      lotteryName,
      new anchor.BN(42),
      prices.slice(0, -2),
      lotteryAccount.starts,
      lotteryAccount.ends,
      {
        accounts: {
          lottery: lotteryPda[0],
          user: adminUser.publicKey,
          payToken: payToken.publicKey,
          fundsTokenAccount: payTokenAccount.address,
          systemProgram: SystemProgram.programId,
        },
      }
    )
    await handleTransaction(tx, connection, { showLogs: true })

    lotteryAccount = await program.account.lottery.fetch(lotteryPda[0])

    console.log('lotteryAccount', {
      ...lotteryAccount,
      authority: lotteryAccount.authority.toBase58(),
      payToken: lotteryAccount.payToken.toBase58(),
      tickets: undefined,
      prices: (lotteryAccount.prices as any).map((price) => ({
        ...price,
        mint: price.mint.toBase58(),
      })),
    })
  })

  it('buy ticket', async () => {
    const user = await generateUserWithSol(connection)
    await airdrop(connection, adminUser.publicKey)

    const lotteryName = 'First Lottery'
    const lotteryPda = await getLotteryPda(adminUser.publicKey, lotteryName)

    const lotteryUserPda = await getLotteryUserPda(
      lotteryPda[0],
      user.publicKey
    )

    const userOwnedPayToken = await getOrCreateTestToken({
      connection,
      tokenOwner: user,
      mint: payToken.publicKey,
    })

    let userTokenAccount =
      await userOwnedPayToken.getOrCreateAssociatedAccountInfo(user.publicKey)

    await userOwnedPayToken.mintTo(
      userTokenAccount.address,
      adminUser.publicKey,
      [adminUser],
      100
    )

    let payTokenAccount = await payToken.getOrCreateAssociatedAccountInfo(
      adminUser.publicKey
    )

    let tx = await program.rpc.buyTicket(
      lotteryUserPda[1],
      2,
      false,
      new anchor.BN(3),
      {
        accounts: {
          user: user.publicKey,
          lottery: lotteryPda[0],
          lotteryUser: lotteryUserPda[0],
          fundsTokenAccount: payTokenAccount.address,
          userTokenAccount: userTokenAccount.address,
          fundsUser: adminUser.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        },
        signers: [user],
      }
    )

    await connection.confirmTransaction(tx)

    const lottery = await program.account.lottery.fetch(lotteryPda[0])
    let lotteryUser = await program.account.lotteryUser.fetch(lotteryUserPda[0])
    console.log('lotteryUser', lotteryUser)
    console.log('lottery', lottery)
  })

  it('raffle', async () => {
    const lotteryName = 'First Lottery'
    const lotteryPda = await getLotteryPda(adminUser.publicKey, lotteryName)

    let lottery = await program.account.lottery.fetch(lotteryPda[0])

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

    const lotteryUsers = await program.account.lotteryUser.all()
    const winners = winning_tickets.map(
      (w) => lotteryUsers.find((u) => u.account.tickets.includes(w)).publicKey
    )

    let tx = await program.rpc.raffle(winning_tickets, winners, {
      accounts: {
        lottery: lotteryPda[0],
        user: adminUser.publicKey,
        backendUser: backendSigner.publicKey,
      },
      signers: [backendSigner],
    })

    await connection.confirmTransaction(tx)

    lottery = await program.account.lottery.fetch(lotteryPda[0])
    console.log('lottery', lottery)
  })
})
