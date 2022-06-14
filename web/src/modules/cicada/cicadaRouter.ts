import { Transaction } from '@solana/web3.js'
import { isBefore } from 'date-fns'
import { z } from 'zod'
import { connection } from '../../config/config'
import { createRouter } from '../../server/createRouter'
import { sendMail } from '../../utils/mail'
import { verifySignature } from '../../utils/middlewareUtils'
import { loadWallet, pub } from '../../utils/solUtils'
import {
  createBuyTicketInstr,
  createClaimPriceInstr,
  getLotteryUserPda,
} from '../raffle/lotteryUtils'
import cicadaConfig, { signingMessage } from './cicadaConfig'
import { isUserAllowedPageAndUpdate } from './cicadaService'

export const cicadaRouter = createRouter()
  .mutation('sendMail', {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log('sendMail input', input)

      if (isBefore(new Date(), cicadaConfig.countdownEnd))
        throw new Error('not allowed')

      const cicadaUserCookie = ctx.req.cookies.cicadaUser

      if (!cicadaUserCookie) throw new Error('not allowed')

      const user = JSON.parse(cicadaUserCookie)

      if (!verifySignature(user.wallet, user.signature, signingMessage))
        throw new Error('not allowed')

      if (!(await isUserAllowedPageAndUpdate(user.wallet, 2, true)))
        throw new Error('not allowed')

      await sendMail({
        from: {
          email: 'secret@stonedapecrew.com',
          name: 'Secret SAC',
        },
        to: input.email,
        subject: 'Secret Information',
        text: '+1 (484) 521-9781',
      })

      /* ctx.res.setHeader() */

      return {
        success: true,
      }
    },
  })
  .mutation('checkText', {
    input: z.object({
      text: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (
        input.text.trim().toLowerCase() !==
        'never underestimate the power of four twenty'
      )
        return { success: false }

      const cicadaUserCookie = ctx.req.cookies.cicadaUser

      if (!cicadaUserCookie) throw new Error('not allowed')

      const user = JSON.parse(cicadaUserCookie)

      if (!verifySignature(user.wallet, user.signature, signingMessage))
        throw new Error('not allowed')

      if (!(await isUserAllowedPageAndUpdate(user.wallet, 3, true)))
        throw new Error('not allowed')

      return {
        redirect: '/c/31l4ku0lipk',
      }
    },
  })
