import * as anchor from '@project-serum/anchor'
import * as web3 from '@solana/web3.js'
import { SystemProgram, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
  airdrop,
  getAnchorContext,
  getAuctionPda,
  getAuctionPrizeVaultTokeAccountPda,
  getAuctionVaultTokeAccountPda,
  getOrCreateTestToken,
  handleTransaction,
  loadKeypair,
} from './tests/utils'
import * as d from 'date-fns'
import { BN, Program } from '@project-serum/anchor'
import { createCLI, path } from 'soly'
import * as s from 'soly'
import { Cluster, PublicKey } from '@solana/web3.js'
import fs from 'fs'
import _ from 'lodash'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Auctions, IDL } from './target/types/auctions'
const cli = createCLI('cli')

const idl = require('./target/idl/auctions.json')
const programId = new PublicKey(idl.metadata.address)

const dateString = s.preprocess((arg) => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
}, s.date())

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
    const adminUser = loadKeypair(keypair.value)
    const connection = new Connection(
      web3.clusterApiUrl(network.value),
      'finalized'
    )
    const provider = new anchor.AnchorProvider(
      connection,
      new anchor.Wallet(adminUser),
      {}
    )
    const program = new Program<Auctions>(idl, programId, provider)

    const raffleConfig = s
      .object({
        name: s.string(),
      })
      .parse(JSON.parse(fs.readFileSync(file.value, 'utf-8')))

    const auctionPda = await getAuctionPda(
      adminUser.publicKey,
      raffleConfig.name
    )

    let auction = await program.account.auction.fetch(auctionPda[0])
    console.log('auction', JSON.stringify(auction, null, 3))
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

  return async () => {
    const adminUser = loadKeypair(keypair.value)
    const connection = new Connection(
      web3.clusterApiUrl(network.value),
      'finalized'
    )
    const provider = new anchor.AnchorProvider(
      connection,
      new anchor.Wallet(adminUser),
      {}
    )
    const program = new Program(idl, programId, provider)

    const auctionConfig = s
      .object({
        name: s.string(),
        start: dateString,
        end: dateString,
        totalPriceValue: s.number(),
        isBidMintSol: s.boolean(),
        bidMint: s.string(),
        prizeMint: s.string(),
        currency: s.string(),
        minBidIncrease: s.number(),
        startBid: s.number(),
        finishExtensionTimeSec: s.number(),
      })
      .parse(JSON.parse(fs.readFileSync(file.value, 'utf-8')))

    console.log('auctionConfig', auctionConfig)

    const auctionPda = await getAuctionPda(
      adminUser.publicKey,
      auctionConfig.name
    )
    const auctionVaultPda = await getAuctionVaultTokeAccountPda(auctionPda[0])
    const auctionPrizeVaultPda = await getAuctionPrizeVaultTokeAccountPda(
      auctionPda[0]
    )

    const puffToken = new PublicKey(
      'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB'
    )

    const bidMint = auctionConfig.bidMint
      ? new PublicKey(auctionConfig.bidMint)
      : puffToken

    const startBid = auctionConfig.startBid * LAMPORTS_PER_SOL

    const minBidIncrease = auctionConfig.minBidIncrease * LAMPORTS_PER_SOL

    console.log('before init')

    const initAuctionInstruction = await program.methods
      .initAuction(
        auctionPda[1],
        auctionConfig.name,
        new BN(auctionConfig.start.getTime() / 1000),
        new BN(auctionConfig.end.getTime() / 1000),
        new PublicKey(auctionConfig.prizeMint),
        auctionConfig.isBidMintSol,
        bidMint,
        new BN(auctionConfig.totalPriceValue),
        auctionConfig.currency,
        new BN(minBidIncrease),
        new BN(startBid),
        new BN(auctionConfig.finishExtensionTimeSec)
      )
      .accounts({
        auction: auctionPda[0],
        user: adminUser.publicKey,
        vaultTokenAccount: auctionVaultPda[0],
        bidToken: bidMint,
        prizeVaultTokenAccount: auctionPrizeVaultPda[0],
        prizeToken: new PublicKey(auctionConfig.prizeMint),
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const transaction = new anchor.web3.Transaction({
      feePayer: adminUser.publicKey,
    }).add(initAuctionInstruction)

    await provider.sendAndConfirm(transaction, [adminUser])
    const auctionAccount = await program.account.auction.fetch(auctionPda[0])

    console.log('auctionAccount', auctionAccount)
  }
})

cli.parse()

const Pk = web3.PublicKey
