import { auctionProgram, auctionProgramId } from './auctionConfig'
import * as d from 'date-fns'
import asyncBatch from 'async-batch'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js'
import {
  getNftWithMetadata,
  getOrCreateAssociatedTokenAddressInstruction,
} from '../../utils/solUtils'
import { NftMetadata } from '../../utils/nftmetaData.type'
import { connection } from '../../config/config'
import { BN } from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { auction } from 'newMetaplex/lib/programs'
import { TOKEN_PROGRAM_ID } from '../../utils/candyMachineConstants'

export type Auction = Awaited<ReturnType<typeof buildAuction>>
export type AuctionAccount = NonNullable<Awaited<ReturnType<typeof getAuction>>>

export async function buildAuction(
  pubkey: PublicKey,
  auctionRaw: Awaited<ReturnType<typeof auctionProgram.account.auction.fetch>>
) {
  const nftMetadata = await getNftWithMetadata(auctionRaw.prizeMint)

  const startDate = new Date(auctionRaw.starts.toNumber() * 1000)
  const endDate = new Date(auctionRaw.ends.toNumber() * 1000)
  const bids = (
    auctionRaw.bids as {
      user: PublicKey
      amount: BN
      createdAt: string
    }[]
  ).map((a) => ({
    ...a,
    createdAt: new Date(Number(a.createdAt) * 1000),
    amount: a.amount.toNumber() / LAMPORTS_PER_SOL,
  }))

  const auction = {
    ...auctionRaw,
    name: auctionRaw.name as string,
    currency: auctionRaw.currency as string,
    startDate: startDate,
    endDate: endDate,
    prize: nftMetadata,
    hasEnded: new Date().getTime() > endDate.getTime(),
    pubkey: pubkey,
    bids: bids,
    minBidIncrease: (auctionRaw.minBidIncrease.toNumber() /
      LAMPORTS_PER_SOL) as number,
    lastBid: bids[0],
  }
  return auction
}

export async function getAuction(pubKey: PublicKey) {
  const auctionRaw = await auctionProgram.account.auction.fetch(pubKey)

  if (!auctionRaw) return null

  const auction = await buildAuction(pubKey, auctionRaw)

  return auction
}

export async function getAuctionByAddress(address: string) {
  const auction = await getAuction(new PublicKey(address))
  return auction
}

export async function getAllAuctions() {
  const auctions = (await auctionProgram.account.auction.all()) as (Awaited<
    ReturnType<typeof auctionProgram.account.auction.all>
  >[0] & { account: AuctionAccount })[]

  let fullAuctions = await asyncBatch(
    auctions,
    async (auctionRaw) => {
      const auction = await buildAuction(
        auctionRaw.publicKey,
        auctionRaw.account
      )
      return auction
    },
    3
  )

  fullAuctions.sort((a, b) => b.endDate.getTime() - a.endDate.getTime())

  const live = fullAuctions.filter((a) => !a.hasEnded)
  const ended = fullAuctions.filter((a) => a.hasEnded)

  return { live, ended }
}

export async function getActiveAuction() {
  const auctions = (await auctionProgram.account.auction.all()) as (Awaited<
    ReturnType<typeof auctionProgram.account.auction.all>
  >[0] & { account: AuctionAccount })[]

  let lastAuction = auctions.sort(
    (a, b) => b.account.ends.toNumber() - a.account.ends.toNumber()
  )[0]

  if (!lastAuction) throw new Error('no active auction found')

  return lastAuction
}

export async function createBidInstr(args: {
  user: PublicKey
  auction: Auction
  bidAmount: number
}) {
  let userTokenAccount = await getOrCreateAssociatedTokenAddressInstruction(
    args.auction.bidToken,
    args.user,
    connection
  )

  let lastBidTokenAccount = args.auction.lastBid
    ? await getOrCreateAssociatedTokenAddressInstruction(
        args.auction.bidToken,
        args.auction.lastBid.user,
        connection
      )
    : await getOrCreateAssociatedTokenAddressInstruction(
        args.auction.bidToken,
        args.auction.authority,
        connection
      )

  let vaultTokenAccountPda = (
    await getAuctionVaultTokeAccountPda(args.auction.pubkey)
  )[0]

  console.log('lastBidTokenAcount', lastBidTokenAccount.address)

  const instruction = await auctionProgram.instruction.bid(
    new BN(args.bidAmount * LAMPORTS_PER_SOL),
    {
      accounts: {
        auction: args.auction.pubkey,
        user: args.user,
        userTokenAccount: userTokenAccount.address,
        lastBidTokenAccount: lastBidTokenAccount.address,
        vaultTokenAccount: vaultTokenAccountPda,
        bidToken: args.auction.bidToken,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    }
  )

  return [
    ...lastBidTokenAccount.instructions,
    ...userTokenAccount.instructions,
    instruction,
  ]
}

/* export async function createClaimPriceInstr(args: {
  user: PublicKey
  lottery: PublicKey
  backendUser: PublicKey
  rafflePricesUser: PublicKey
  ticket: number
}) {
  const lottery = await getAuction(args.lottery)

  const price = lottery?.prices.find((p) => p.winningTicket === args.ticket)

  if (!price) throw new Error('Wrong ticket number')

  const mint = price.mint

  console.log('mint', price.mint.toBase58())

  const lotteryUserPda = await getAuctionPda(args.lottery, args.user)

  let userTokenAccount = await getOrCreateAssociatedTokenAddressInstruction(
    mint,
    args.user,
    connection,
    args.user
  )

  let priceTokenAccount = await getOrCreateAssociatedTokenAddressInstruction(
    mint,
    args.rafflePricesUser,
    connection,
    args.user
  )

  console.log('priceTokenAccount', priceTokenAccount.address.toBase58())

  const buyTicketInstr = await auctionProgram.instruction.claim(args.ticket, {
    accounts: {
      user: args.user,
      lottery: args.lottery,
      lotteryUser: lotteryUserPda[0],
      mint: mint,
      userTokenAccount: userTokenAccount.address,
      pricesTokenAccount: priceTokenAccount.address,
      priceWalletSigner: args.rafflePricesUser,
      backendUser: args.backendUser,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
    },
  })
  return [
    ...priceTokenAccount.instructions,
    ...userTokenAccount.instructions,
    buyTicketInstr,
  ]
} */

export async function getAuctionPda(user: PublicKey, name: string) {
  return PublicKey.findProgramAddress(
    [user.toBuffer(), Buffer.from(name)],
    auctionProgramId
  )
}

export async function getAuctionVaultTokeAccountPda(auction: PublicKey) {
  return PublicKey.findProgramAddress(
    [utf8.encode('vault'), auction.toBuffer()],
    auctionProgramId
  )
}

export async function getAuctionPrizeVaultTokeAccountPda(auction: PublicKey) {
  return PublicKey.findProgramAddress(
    [utf8.encode('prize_vault'), auction.toBuffer()],
    auctionProgramId
  )
}

export async function getPricesVaultPda(lottery: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from('prices'), lottery.toBuffer()],
    auctionProgramId
  )
}
