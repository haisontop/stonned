import * as anchor from '@project-serum/anchor'
import { Program, Spl } from '@project-serum/anchor'
import { Auctions } from '../target/types/auctions'
import {
  Mint,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { Keypair, SystemProgram } from '@solana/web3.js'
import {
  airdrop,
  generateUserWithSol,
  getAnchorContext,
  getAuctionPda,
  getAuctionPrizeVaultTokeAccountPda,
  getAuctionVaultTokeAccountPda,
  getOrCreateTestToken,
} from './utils'
import { addDays } from 'date-fns'
import { BN } from 'bn.js'
import { PublicKey } from '@solana/web3.js'
import TransactionFactory from '@project-serum/anchor/dist/cjs/program/namespace/transaction'
import { Key } from 'ink'
import { expect } from 'chai'

const provider = anchor.AnchorProvider.env()
// Configure the client to use the local cluster.
anchor.setProvider(provider)

const program = anchor.workspace.Auctions as Program<Auctions>

const { connection, wallet } = provider

const auctionName = 'First Auction'

describe('auctions', () => {
  /* const { adminUser, connection, program } = getAnchorContext({
    keypairPath: `${process.env.HOME}/config/solana/sac-treasury.json`,
  }) */

  it('ping', async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc()
  })

  let adminUser: Keypair
  let user: Keypair
  let bidToken: Mint
  let prizeMint: Mint

  let auctionPda: [anchor.web3.PublicKey, number]
  let auctionVaultPda: [anchor.web3.PublicKey, number]
  let auctionPrizeVaultPda: [anchor.web3.PublicKey, number]

  async function initAuction(args: { endDate: Date; startDate: Date }) {
    adminUser = adminUser ?? (await generateUserWithSol(connection, 2))
    user = user ?? (await generateUserWithSol(connection, 2))
    await airdrop(connection, adminUser.publicKey, 2)

    bidToken =
      bidToken ??
      (await getOrCreateTestToken({
        connection,
        tokenOwner: adminUser,
      }))

    prizeMint =
      prizeMint ??
      (await getOrCreateTestToken({
        connection,
        tokenOwner: adminUser,
      }))

    auctionPda = await getAuctionPda(adminUser.publicKey, auctionName)

    auctionVaultPda = await getAuctionVaultTokeAccountPda(auctionPda[0])
    auctionPrizeVaultPda = await getAuctionPrizeVaultTokeAccountPda(
      auctionPda[0]
    )

    const isBidTokenSol = false

    const currency = '$PUFF'

    const initAuctionInstruction = await program.methods
      .initAuction(
        auctionPda[1],
        auctionName,
        new BN(args.startDate.getTime() / 1000),
        new BN(args.endDate.getTime() / 1000),
        prizeMint.address,
        isBidTokenSol,
        bidToken.address,
        new BN(142),
        currency
      )
      .accounts({
        auction: auctionPda[0],
        user: adminUser.publicKey,
        vaultTokenAccount: auctionVaultPda[0],
        bidToken: bidToken.address,
        prizeVaultTokenAccount: auctionPrizeVaultPda[0],
        prizeToken: prizeMint.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
    const transaction = new anchor.web3.Transaction({
      feePayer: adminUser.publicKey,
    }).add(initAuctionInstruction)

    await provider.sendAndConfirm(transaction, [adminUser])
    const auctionAccount = await program.account.auction.fetch(auctionPda[0])

    await mintTo(
      connection,
      adminUser,
      prizeMint.address,
      auctionPrizeVaultPda[0],
      adminUser,
      1
    )

    console.log('auctionAccount', auctionAccount)
  }

  it('init auction', async () => {
    const startDate = new Date()
    const endDate = addDays(startDate, 1)
    await initAuction({ startDate, endDate })
  })

  it('bid and claim', async () => {
    let userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      bidToken.address,
      user.publicKey
    )

    await mintTo(
      connection,
      adminUser,
      bidToken.address,
      userTokenAccount.address,
      adminUser,
      10000
    )

    const user2 = await generateUserWithSol(connection, 2)
    let user2TokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user2,
      bidToken.address,
      user2.publicKey
    )
    await mintTo(
      connection,
      adminUser,
      bidToken.address,
      user2TokenAccount.address,
      adminUser,
      10000
    )

    userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      bidToken.address,
      user.publicKey
    )
    user2TokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user2,
      bidToken.address,
      user2.publicKey
    )
    await logTokenAccounts({
      user1: user.publicKey,
      user2: user2.publicKey,
      auctionPda: auctionPda[0],
      mint: bidToken.address,
    })

    await sendBid({
      user: user,
      adminUser,
      bidToken: bidToken.address,
      amount: 1000,
    })
    await logTokenAccounts({
      user1: user.publicKey,
      user2: user2.publicKey,
      auctionPda: auctionPda[0],
      mint: bidToken.address,
    })

    await sendBid({
      user: user2,
      adminUser,
      bidToken: bidToken.address,
      amount: 1500,
    })
    await logTokenAccounts({
      user1: user.publicKey,
      user2: user2.publicKey,
      auctionPda: auctionPda[0],
      mint: bidToken.address,
    })

    await shouldThrow(
      () =>
        sendBid({
          user: user,
          adminUser,
          bidToken: bidToken.address,
          amount: 1200,
        }),
      'bid must be bigger'
    )

    await sendBid({
      user: user,
      adminUser,
      bidToken: bidToken.address,
      amount: 2000,
    })
    await logTokenAccounts({
      user1: user.publicKey,
      user2: user2.publicKey,
      auctionPda: auctionPda[0],
      mint: bidToken.address,
    })

    // claim tests

    await shouldThrow(
      () =>
        claimPrize({
          user: user,
          adminUser,
          prizeToken: prizeMint.address,
        }),
      'not allowed to claim before end'
    )

    const startDate = new Date()
    const endDate = startDate

    await initAuction({ startDate, endDate })

    await claimPrize({
      user: user,
      adminUser,
      prizeToken: prizeMint.address,
    })

    await shouldThrow(
      () =>
        claimPrize({
          user: user2,
          adminUser,
          prizeToken: prizeMint.address,
        }),
      'only winner can claim'
    )

    await shouldThrow(
      () =>
        claimPrize({
          user: user,
          adminUser,
          prizeToken: prizeMint.address,
        }),
      'not allowed to claim again'
    )
  })
})

async function shouldThrow(func: () => any, message: string) {
  let didThrow = false
  try {
    await func()
  } catch (e) {
    didThrow = true
  }

  expect(didThrow).equal(true, message)
}

async function sendBid(args: {
  user: Keypair
  adminUser: Keypair
  bidToken: PublicKey
  amount: number
}) {
  const auctionPda = await getAuctionPda(args.adminUser.publicKey, auctionName)

  /* anchor.AnchorProvider.env()
  new anchor.AnchorProvider(connection, new anchor.Wallet(user)) */

  const auction = await program.account.auction.fetch(auctionPda[0])

  let lastBidTokenAccount =
    (auction.bids as any[]).length > 0
      ? await getOrCreateAssociatedTokenAccount(
          connection,
          args.user,
          args.bidToken,
          auction.bids[0].user
        )
      : await getOrCreateAssociatedTokenAccount(
          connection,
          args.user,
          args.bidToken,
          auction.authority
        )

  let userTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    args.user,
    args.bidToken,
    args.user.publicKey
  )

  let vaultTokenAccountPda = (
    await getAuctionVaultTokeAccountPda(auctionPda[0])
  )[0]

  console.log('lastBidTokenAcount', lastBidTokenAccount.address)

  const instruction = await program.methods
    .bid(new BN(args.amount))
    .accounts({
      auction: auctionPda[0],
      user: args.user.publicKey,
      userTokenAccount: userTokenAccount.address,
      lastBidTokenAccount: lastBidTokenAccount.address,
      vaultTokenAccount: vaultTokenAccountPda,
      bidToken: args.bidToken,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction()

  const transaction = new anchor.web3.Transaction({
    feePayer: args.user.publicKey,
  }).add(instruction)

  await provider.sendAndConfirm(transaction, [args.user], {
    commitment: 'confirmed',
  })

  const auctionAccount = await program.account.auction.fetch(auctionPda[0])
  console.log('auctionAccount bids', auctionAccount.bids)
}

async function claimPrize(args: {
  user: Keypair
  adminUser: Keypair
  prizeToken: PublicKey
}) {
  const auctionPda = await getAuctionPda(args.adminUser.publicKey, auctionName)

  /* anchor.AnchorProvider.env()
  new anchor.AnchorProvider(connection, new anchor.Wallet(user)) */

  const auction = await program.account.auction.fetch(auctionPda[0])

  let userTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    args.user,
    args.prizeToken,
    args.user.publicKey
  )

  let prieVaultTokenAccountPda = (
    await getAuctionPrizeVaultTokeAccountPda(auctionPda[0])
  )[0]

  const instruction = await program.methods
    .claim()
    .accounts({
      auction: auctionPda[0],
      user: args.user.publicKey,
      userPrizeTokenAccount: userTokenAccount.address,
      prizeVaultTokenAccount: prieVaultTokenAccountPda,
      prizeMint: args.prizeToken,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction()

  const transaction = new anchor.web3.Transaction({
    feePayer: args.user.publicKey,
  }).add(instruction)

  await provider.sendAndConfirm(transaction, [args.user], {
    commitment: 'confirmed',
  })

  const auctionAccount = await program.account.auction.fetch(auctionPda[0])
  console.log('auctionAccount bids', auctionAccount.bids)
}

async function logTokenAccounts(args: {
  auctionPda: PublicKey
  user1: PublicKey
  user2: PublicKey
  mint: PublicKey
}) {
  let vaultTokenAccountPda = (
    await getAuctionVaultTokeAccountPda(args.auctionPda)
  )[0]
  let vaultTokenAccount = await getAccount(connection, vaultTokenAccountPda)

  const userTokenAccount = await getAccount(
    connection,
    await getAssociatedTokenAddress(args.mint, args.user1)
  )
  const user2TokenAccount = await getAccount(
    connection,
    await getAssociatedTokenAddress(args.mint, args.user2)
  )

  console.log('user1TokenAccount amount', userTokenAccount.amount)
  console.log('user2TokenAccount amount', user2TokenAccount.amount)
  console.log('\nvaultTokenAccount amount', vaultTokenAccount.amount)
}
