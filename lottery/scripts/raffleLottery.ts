import * as anchor from '@project-serum/anchor'
import * as web3 from '@solana/web3.js'
import {
  airdrop,
  getAnchorContext,
  getLotteryPda,
  getOrCreateTestToken,
  handleTransaction,
  loadKeypair,
} from '../tests/utils'
import * as d from 'date-fns'
import { BN } from '@project-serum/anchor'
import _ from 'lodash'

const Pk = web3.PublicKey

const { adminUser, connection, program } = getAnchorContext({
  keypairPath: `${process.env.HOME}/config/solana/lucky-dip-prime.json`,
  network: 'mainnet-beta',
})

const backendSigner = loadKeypair(
  `${process.env.HOME}/config/solana/backend-signer.json`
)

console.log('connection', (connection as any)._rpcEndpoint)

describe('raffle lottery', () => {
  it('raffle lottery', async () => {
    const lotteryName = 'Lucky Dip Prime'

    const lotteryPda = await getLotteryPda(adminUser.publicKey, lotteryName)

    let lottery = await program.account.lottery.fetch(lotteryPda[0])
    console.log('lottery.winners', lottery)

    console.log('lottery.ticketCount', lottery.ticketCount)

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
    console.log('lotteryUsers', lotteryUsers)

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

    console.log('lotteryAccount', {
      /* ...lotteryAccount, */
      authority: lotteryAccount.authority.toBase58(),
      tickets: undefined,
      prices: (lotteryAccount.prices as any).map((price: any) => ({
        ...price,
        mint: price.mint.toBase58(),
      })),
      winners: (lotteryAccount.winners as any).map((w) => w.toBase58()),
    })
  })
})
