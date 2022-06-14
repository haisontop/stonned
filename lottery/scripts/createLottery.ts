import * as anchor from '@project-serum/anchor'
import * as web3 from '@solana/web3.js'
import {
  airdrop,
  getAnchorContext,
  getLotteryPda,
  getOrCreateTestToken,
  handleTransaction,
} from '../tests/utils'
import * as d from 'date-fns'
import { BN } from '@project-serum/anchor'

const Pk = web3.PublicKey

const { adminUser, connection, program } = getAnchorContext({
  keypairPath: `${process.env.HOME}/config/solana/dev-wallet.json`,
  /*  network: 'mainnet-beta', */
  url: 'https://late-falling-firefly.solana-mainnet.quiknode.pro/812b7e0ab8d2b7589b67bf72b7f1295563c2ce97/',
})

console.log('connection', (connection as any)._rpcEndpoint)

describe('createLottery', () => {
  it('initialize lottery', async () => {
    /*  await airdrop(connection, adminUser.publicKey, 10) */

    const lotteryName = 'Lucky Dip #1'

    const lotteryPda = await getLotteryPda(adminUser.publicKey, lotteryName)

    /* const devPuffToken = new web3.PublicKey(
      '8crBEjMoyGmUA4jsus4oNbzmS9skroExSVzhroidjaA6'
    ) */
    const devPuffToken = new web3.PublicKey(
      'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB'
    )
    const allToken = new web3.PublicKey(
      '7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj'
    )

    /*  const payToken = await getOrCreateTestToken({
      connection,
      tokenOwner: adminUser,
      mint: devPuffToken,
    })

    console.log('payToken', payToken.publicKey.toBase58())

    let fundsTokenAccount = await payToken.getOrCreateAssociatedAccountInfo(
      adminUser.publicKey
    ) */
    /*   await payToken.mintTo(
      payTokenAccount,
      adminUser.publicKey,
      [adminUser],
      100
    ) */

    /* const devPrices = [
      {
        amount: 1,
        mint: new web3.PublicKey(
          '2ntd7tN6dw6V1Z8P3WgK9rQEuxpx7mCF1sMy9ieX8QKF'
        ),
      },
      {
        amount: 1,
        mint: new web3.PublicKey(
          '56J746X7d8sCFSuSfxMGWpL7gwMtYjhyg2TSwza6S9nH'
        ),
      },
      {
        amount: 1,
        mint: new web3.PublicKey(
          'CFGy3idCkASq51zxf2wT6rpYZYQkULT8uJJ4vLpjDX1F'
        ),
      },
      {
        amount: 1,
        mint: new web3.PublicKey(
          'GFeAhbKs5xXjr2WeVG6KT9e9Sro3uw8xKsMAuQMSS6W9'
        ),
      },
      {
        amount: 1,
        mint: new web3.PublicKey(
          '4VCWKnjnvPvJ8GUgWVxUjG1UvuBUDyNNSpWJEj6TiaXL'
        ),
      },
    ] */

    const devPrices = [
      {
        amount: 1,
        mint: new web3.PublicKey(
          '3Gf2fbHpLxLWkWCizZdB6psFYw73Z2St9M4HZNnFc7p5'
        ),
      },
      {
        amount: 1,
        mint: new web3.PublicKey(
          '7N9X7Vp6CRCP4jxzfkJrBSEo9uiLutqWJHaYAz4gFpbx'
        ),
      },
    ]

    const prices = await Promise.all(
      devPrices.map(async (price, i) => {
        return {
          amount: new anchor.BN(price.amount),
          mint: price.mint,
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

    const starts = d.subDays(new Date(), 0)
    const ends = new Date('2022-04-03T11:00:00+00:00')

    const ticketPrice = new BN(0.1 * web3.LAMPORTS_PER_SOL)

    console.log('before init')

    const tx = await program.rpc.initLottery(
      lotteryPda[1],
      lotteryName,
      ticketPrice,
      prices,
      new BN(starts.getTime() / 1000),
      new BN(ends.getTime() / 1000),
      new BN(85 + 30),
      [devPuffToken, allToken],
      {
        accounts: {
          lottery: lotteryPda[0],
          user: adminUser.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
      }
    )
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
    })
  })
})
