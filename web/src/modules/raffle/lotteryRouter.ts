import { Transaction } from '@solana/web3.js'
import { z } from 'zod'
import config, { connection } from '../../config/config'
import { createRouter } from '../../server/createRouter'
import { loadWallet, pub } from '../../utils/solUtils'
import {
  createBuyTicketInstr,
  createClaimPriceInstr,
  getLotteryUserPda,
} from './lotteryUtils'

const backendSigner = loadWallet(process.env.BACKEND_SIGNER!)
const rafflePricesSigner = loadWallet(process.env.RAFFLE_PRICES!)

export const lotteryRouter = createRouter()
  .mutation('buyTicket', {
    input: z.object({
      lottery: z.string(),
      user: z.string(),
      payToken: z.string().nullable(),
      ticketCount: z.number(),
    }),
    async resolve({ ctx, input }) {
      const lottery = pub(input.lottery)
      const user = pub(input.user)
      if (input.payToken != config.puffToken)
        throw new Error('pay token not available at this lucky dip')

        
      const payToken = input.payToken ? pub(input.payToken) : undefined

      const buyTicketInstr = await createBuyTicketInstr({
        lottery,
        user,
        backendUser: backendSigner.publicKey,
        payToken,
        ticketCount: input.ticketCount,
      })

      const transaction = new Transaction({
        feePayer: user,
        recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
      }).add(...buyTicketInstr)

      await transaction.partialSign(backendSigner)

      const serializedTrans = transaction.serialize({
        requireAllSignatures: false,
      })

      return {
        trans: serializedTrans.toJSON(),
      }
    },
  })
  .mutation('claimPrice', {
    input: z.object({
      lottery: z.string(),
      user: z.string(),
      ticket: z.number(),
    }),
    async resolve({ ctx, input }) {
      const lottery = pub(input.lottery)
      const user = pub(input.user)

      const buyTicketInstr = await createClaimPriceInstr({
        lottery,
        user,
        ticket: input.ticket,
        backendUser: backendSigner.publicKey,
        rafflePricesUser: rafflePricesSigner.publicKey,
      })

      const transaction = new Transaction({
        feePayer: user,
        recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
      }).add(...buyTicketInstr)

      await transaction.partialSign(backendSigner)
      await transaction.partialSign(rafflePricesSigner)

      const serializedTrans = transaction.serialize({
        requireAllSignatures: false,
      })

      return {
        trans: serializedTrans.toJSON(),
      }
    },
  })
