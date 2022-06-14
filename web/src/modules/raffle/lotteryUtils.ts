import {
  activeRaffleName,
  lotteryProgram,
  lotteryProgramId,
} from './lotteryConfig'
import * as d from 'date-fns'
import asyncBatch from 'async-batch'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import {
  getNftWithMetadata,
  getOrCreateAssociatedTokenAddressInstruction,
  pub,
} from '../../utils/solUtils'
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types'
import { NftMetadata } from '../../utils/nftmetaData.type'
import { connection } from '../../config/config'
import { BN } from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import { getDexlabPrice, solToSpl } from '../../utils/sacUtils'
import { filterNull } from '../../utils/utils'

export type Lottery = Awaited<ReturnType<typeof getActiveLottery>>
export type LotteryAccount = NonNullable<Awaited<ReturnType<typeof getLottery>>>

export async function getAllFullLotteries() {
  const lotteries = (await lotteryProgram.account.lottery.all()) as (Awaited<
    ReturnType<typeof lotteryProgram.account.lottery.all>
  >[0] & { account: LotteryAccount })[]

  const fullLotteries = await Promise.all(
    lotteries.map(async (lotteryRaw) => {
      const lottery = lotteryRaw.account

      const prices: (NftMetadata & LotteryAccount['prices'][0])[] = []
      await asyncBatch(
        lottery.prices as LotteryAccount['prices'],
        async (price) => {
          try {
            const nftMetadata = await getNftWithMetadata(price.mint)
            prices.push({ ...nftMetadata, ...price })
          } catch (error: any) {
            console.log('error in loadMetdata', error)
            return null
          }
        },
        1
      )

      const startDate = new Date(lottery.starts.toNumber() * 1000)
      const endDate = new Date(lottery.ends.toNumber() * 1000)
      const activeLottery = {
        ...lottery,
        startDate: startDate,
        endDate: endDate,
        prices,
        isRaffled: lottery.winningTickets.length > 0,
        hasEnded: new Date().getTime() > endDate.getTime(),
        publicKey: lotteryRaw.publicKey,
      }
      return activeLottery
    })
  )

  return fullLotteries
}

export async function getAllLotteries() {
  const lotteries = (await lotteryProgram.account.lottery.all()) as (Awaited<
    ReturnType<typeof lotteryProgram.account.lottery.all>
  >[0] & { account: LotteryAccount })[]
  return lotteries
}

export async function getLottery(pubKey: PublicKey) {
  const lotteryRaw = await lotteryProgram.account.lottery.fetch(pubKey)

  if (!lotteryRaw) return null

  const lottery = lotteryRaw as typeof lotteryRaw & {
    prices: {
      winningTicket?: number
      mint: PublicKey
      amount: number
      priceSent: boolean
    }[]
  }

  return lottery
}

export async function getLotteryByAddress(address: string) {
  const now = new Date()
  const lottery = await getLottery(new PublicKey(address))

  if (!lottery) return null

  const prices: (NftMetadata & LotteryAccount['prices'][0])[] = []
  await asyncBatch(
    lottery.prices as LotteryAccount['prices'],
    async (price) => {
      try {
        const nftMetadata = await getNftWithMetadata(price.mint)

        prices.push({ ...nftMetadata, ...price })
      } catch (error: any) {
        console.log('error in loadMetdata', error)
        return null
      }
    },
    4
  )

  const startDate = new Date(lottery.starts.toNumber() * 1000)
  const endDate = new Date(lottery.ends.toNumber() * 1000)
  const activeLottery = {
    ...lottery,
    startDate: startDate,
    endDate: endDate,
    prices,
    isRaffled: lottery.winningTickets.length > 0,
    hasEnded: now.getTime() > endDate.getTime(),
    publicKey: new PublicKey(address),
  }

  return activeLottery
}

export async function getActiveLottery() {
  const lotteries = (await lotteryProgram.account.lottery.all()) as (Awaited<
    ReturnType<typeof lotteryProgram.account.lottery.all>
  >[0] & { account: LotteryAccount })[]

  const now = d.addDays(new Date(), 2)
  let lastLottery = lotteries.sort(
    (a, b) => b.account.ends.toNumber() - a.account.ends.toNumber()
  )[0]

  if (!lastLottery) throw new Error('no active lottery found')

  /* if (lotteries.find((l) => l.account.name == 'Lucky Dip #11'))
    lastLottery = lotteries.find((l) => l.account.name == 'Lucky Dip #11')! */
    

  const prices: (NftMetadata & LotteryAccount['prices'][0])[] = []
  await asyncBatch(
    lastLottery.account.prices as LotteryAccount['prices'],
    async (price) => {
      try {
        const nftMetadata = await getNftWithMetadata(price.mint)

        prices.push({ ...nftMetadata, ...price })
      } catch (error: any) {
        console.log('error in loadMetdata', error)
        return null
      }
    },
    3
  )

  const startDate = new Date(lastLottery.account.starts.toNumber() * 1000)
  const endDate = new Date(lastLottery.account.ends.toNumber() * 1000)
  const activeLottery = {
    ...lastLottery,
    startDate: startDate,
    endDate: endDate,
    prices,
    isRaffled: lastLottery.account.winningTickets.length > 0,
    hasEnded: now.getTime() > endDate.getTime(),
  }

  return activeLottery
}

export async function getLotteryUser(args: {
  user: PublicKey
  lottery: PublicKey
}) {
  const lotteryUserPda = await getLotteryUserPda(args.lottery, args.user)

  const lotteryUser = await lotteryProgram.account.lotteryUser
    .fetch(lotteryUserPda[0])
    .catch((e) => {
      console.log(
        `error in fetching lotteryUser ${lotteryUserPda[0].toBase58()}`
      )
    })

  if (!lotteryUser) return null

  return lotteryUser
}

export async function getUserPrices({
  user,
  lottery,
}: {
  user: PublicKey
  lottery: Awaited<ReturnType<typeof getLotteryByAddress>>
}) {
  if (!lottery || !lottery.isRaffled) return null

  const lotteryUser = await getLotteryUser({
    lottery: lottery.publicKey,
    user: user,
  })

  if (!lotteryUser) return []

  console.log('lotteryUser.tickets', lotteryUser.tickets)

  const prices = lottery.prices.filter((p) => {
    return lotteryUser?.tickets.includes(p.winningTicket!)
  })

  console.log('prices', prices)

  return prices
}

export async function createBuyTicketInstr(args: {
  payToken?: PublicKey
  user: PublicKey
  lottery: PublicKey
  backendUser: PublicKey
  ticketCount: number
}) {
  const lottery = (await lotteryProgram.account.lottery.fetch(args.lottery))!

  if (args.payToken && !lottery.payTokens.find((p) => p.equals(args.payToken!)))
    throw new Error('wrong pay token')

  const lotteryUserPda = await getLotteryUserPda(args.lottery, args.user)

  const mockPayToken = lottery.payTokens[0]

  let userTokenAccount = await getOrCreateAssociatedTokenAddressInstruction(
    args.payToken ?? mockPayToken,
    args.user,
    connection,
    args.user
  )

  let fundsTokenAccount = await getOrCreateAssociatedTokenAddressInstruction(
    args.payToken ?? mockPayToken,
    lottery.fundsUser,
    connection,
    args.user
  )
  console.log('dynamic fundsTokenAccount', fundsTokenAccount.address.toBase58())
  console.log('account lottery', lottery.fundsTokenAccount.toBase58())

  console.log('creatTicket pda ', lotteryUserPda[0].toBase58())

  const isSol = !args.payToken

  const splPrice = await solToSpl(
    lottery.ticketPrice.toNumber(),
    args.payToken ?? mockPayToken
  )

  const buyTicketInstr = await lotteryProgram.instruction.buyTicket(
    lotteryUserPda[1],
    args.ticketCount,
    isSol,
    new BN(splPrice),
    {
      accounts: {
        user: args.user,
        lottery: args.lottery,
        lotteryUser: lotteryUserPda[0],
        fundsTokenAccount: fundsTokenAccount.address,
        userTokenAccount: userTokenAccount.address,
        fundsUser: lottery.fundsUser,
        backendUser: args.backendUser,
        systemProgram: SystemProgram.programId,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      },
    }
  )
  return [
    ...fundsTokenAccount.instructions,
    ...userTokenAccount.instructions,
    buyTicketInstr,
  ]
}

export async function createClaimPriceInstr(args: {
  user: PublicKey
  lottery: PublicKey
  backendUser: PublicKey
  rafflePricesUser: PublicKey
  ticket: number
}) {
  const lottery = await getLottery(args.lottery)

  const price = lottery?.prices.find((p) => p.winningTicket === args.ticket)

  if (!price) throw new Error('Wrong ticket number')

  const mint = price.mint

  console.log('mint', price.mint.toBase58())

  const lotteryUserPda = await getLotteryUserPda(args.lottery, args.user)

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

  const buyTicketInstr = await lotteryProgram.instruction.claim(args.ticket, {
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
}

export async function getLotteryUserPda(lottery: PublicKey, user: PublicKey) {
  return PublicKey.findProgramAddress(
    [lottery.toBuffer(), user.toBuffer()],
    lotteryProgramId
  )
}

export async function getLotteryPda(user: PublicKey, name: string) {
  return PublicKey.findProgramAddress(
    [user.toBuffer(), Buffer.from(name)],
    lotteryProgramId
  )
}

export async function getPricesVaultPda(lottery: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from('prices'), lottery.toBuffer()],
    lotteryProgramId
  )
}
