import { Prisma } from '@prisma/client'
import { Transaction } from '@solana/web3.js'
import { z } from 'zod'
import { nukedCollection, sacCollection } from '../../config/collectonsConfig'
import { connection } from '../../config/config'
import prisma from '../../lib/prisma'
import { createRouter } from '../../server/createRouter'
import { verifySignature } from '../../utils/middlewareUtils'
import { getSacFamilyNftsCount } from '../../utils/sacUtils'
import { loadWallet, pub } from '../../utils/solUtils'
import { getNftsFromOwnerByCreatorsWithoutOfChainMeta } from '../../utils/splUtils'
import { signingMessage } from '../cicada/cicadaConfig'
import {
  createBuyTicketInstr,
  createClaimPriceInstr,
  getLotteryUserPda,
} from '../raffle/lotteryUtils'

const backendSigner = loadWallet(process.env.BACKEND_SIGNER!)
const rafflePricesSigner = loadWallet(process.env.RAFFLE_PRICES!)

export const eventRouter = createRouter()
  .query('getGuestlist', {
    input: z.object({
      wallet: z.string(),
    }),
    async resolve({ ctx, input }) {
      const guestList = await prisma.laGuestlistUser.findUnique({
        where: {
          wallet: input.wallet,
        },
        include: {
          entries: true,
        },
      })

      return {
        guestList,
      }
    },
  })
  .mutation('signupGuestlistLa', {
    input: z.object({
      wallet: z.string(),
      signingMessage: z.array(z.number()),
      guests: z.array(z.string()),
    }),
    async resolve({ ctx, input }) {
      if (
        !(await verifySignature(
          input.wallet,
          input.signingMessage,
          signingMessage
        ))
      )
        throw new Error('you are not verified')

      const sacNftCount = await getSacFamilyNftsCount(input.wallet)

      if (input.guests.length > sacNftCount)
        throw new Error(
          'You dont own as many SAC or NAC NFTs as you submited guestlist spots.'
        )

      const guestListUser = await prisma.laGuestlistUser.upsert({
        where: {
          wallet: input.wallet,
        },
        create: {
          wallet: input.wallet,
        },
        update: {
          wallet: input.wallet,
        },
      })

      await prisma.$transaction([
        prisma.laGuestlistEntry.deleteMany({
          where: {
            user: { id: guestListUser.id },
          },
        }),
        ...input.guests
          .filter((g) => !!g)
          .map((g) =>
            prisma.laGuestlistEntry.create({
              data: {
                name: g,
                user: { connect: { id: guestListUser.id } },
              },
            })
          ),
      ])

      return {
        guestListUser,
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
