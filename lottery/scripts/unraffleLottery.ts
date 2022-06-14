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
  keypairPath: `${process.env.HOME}/config/solana/dev-wallet.json`,
  network: 'devnet',
})

const backendSigner = loadKeypair(
  `${process.env.HOME}/config/solana/backend-signer.json`
)

console.log('connection', (connection as any)._rpcEndpoint)

describe('unraffle lottery', () => {
  it('unraffle', async () => {

    const lotteryName = 'First Lottery'

    const lotteryPda = await getLotteryPda(adminUser.publicKey, lotteryName)

    let tx = await program.rpc.raffle([], [], {
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
      ...lotteryAccount,
      authority: lotteryAccount.authority.toBase58(),
      tickets: undefined,
      prices: (lotteryAccount.prices as any).map((price) => ({
        ...price,
        mint: price.mint.toBase58(),
      })),
      winners: (lotteryAccount.winners as any).map((w) => w.toBase58()),
    })
  })
})
