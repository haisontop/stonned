import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import _ from 'lodash'
import { resolve } from 'path'
import { z } from 'zod'
import config, {
  connection,
  defaultFundsWallet,
  jwtSecret,
  puffBurnerWallet,
} from '../../config/config'
import { createRouter } from '../../server/createRouter'
import { fetchCandyMachine, mintV2 } from '../../utils/candyMachine'
import {
  loadCandyProgramV2,
  loadWalletKey,
} from '../../utils/candyMachineHelpers'
import { getCandyMachineState } from '../../utils/candyMachineOld'
import { getDexlabPrice, getPriceInSol } from '../../utils/sacUtils'
import { getLatestBlockhash, loadWallet, pub } from '../../utils/solUtils'
import {
  createTransferInstruction,
  getTokenAccountsForOwner,
} from '../../utils/splUtils'
import {
  checkAndGetPastTransactions,
  getLaunchReadyProject,
  hasUserWhitelist,
  isMintingAllowed,
} from './launchUtils'
import Reattempt from 'reattempt'
import { decode, encode } from 'jwt-simple'
import { sleep } from '../../utils/utils'
import { MintMeta, MintTransaction, PrismaClient } from '@prisma/client'
import prisma from '../../lib/prisma'
import { TRPCError } from '@trpc/server'
import { verifySignature } from '../../utils/middlewareUtils'
import { solanaAuthConfig } from '../common/authConfig'
import alphaLabsConfig from './config/alphaLabsConfig'
import { subSeconds } from 'date-fns'
import { createNft, createNftInstr } from '../../utils/nftUtils'
import {
  heislMachineProgram,
  heislMachineProgramRecent,
} from './heislMachineConfig'
import {
  createHeislMintInstr,
  getHeislMachineLaunch,
  getLaunchPda,
} from './heislMachineUtils'
import cuid from 'cuid'

const launchMint = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.LAUNCH_MINT as string))
)
const backendSigner = loadWallet(process.env.PROGRAM_SIGNER!)

const alreadyMinted = require('../../assets/launch.json')

export const launchRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (
      ctx.req.method == 'POST' ||
      ctx.req.url?.includes('hasWhitelistSpot') ||
      ctx.req.url?.includes('/launch.getUser')
    ) {
      const signature = ctx.req.headers.signature as string
      const wallet = ctx.req.headers.wallet as string

      const signatureArray = Array.from(JSON.parse(signature!).signature) as any

      if (
        !signature ||
        !wallet ||
        !verifySignature(
          wallet,
          signatureArray,
          solanaAuthConfig.signingMessage
        )
      ) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const user =
        (await prisma.user.findUnique({ where: { solanaAddress: wallet } })) ??
        (await prisma.user.create({
          data: {
            solanaAddress: wallet,
          },
        }))

      ctx.user = user
    }
    return next()
  })
  .query('getUser', {
    async resolve({ ctx }) {
      return ctx.user
    },
  })
  .mutation('editUser', {
    input: z.object({
      username: z.string().nullish(),
      email: z.string().email().nullish(),
      twitterUrl: z.string().nullish(),
      profilePictureUrl: z.string().nullish(),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          username: input.username,
          email: input.email,
          twitterUrl: input.twitterUrl,
          profilePictureUrl: input.profilePictureUrl,
        },
      })
    },
  })
  .mutation('updateNotifications', {
    input: z.object({
      notifyNewProject: z.boolean(),
      notifyMintStart: z.boolean(),
      notifyNewWhitelist: z.boolean(),
    }),
    resolve: async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          ...input,
        },
      })
      return true
    },
  })
  .query('hasWhitelistSpot', {
    input: z.object({
      projectId: z.string(),
      user: z.string(),
      mintingPeriodId: z.string(),
    }),
    async resolve({ ctx: { prisma, ...ctx }, input }) {
      const whitelistSpot = await hasUserWhitelist(
        ctx.user.id,
        input.mintingPeriodId
      )
      return whitelistSpot
    },
  })
  .mutation('createMintTransaction', {
    input: z.object({
      projectId: z.string(),
      user: z.string(),
      paymentId: z.string(),
      mintingPeriodId: z.string(),
    }),
    async resolve({ ctx: { prisma, ...ctx }, input }) {
      let mintMeta: MintMeta | undefined
      console.log('input', input)

      try {
        const project = await getLaunchReadyProject(
          input.projectId,
          prisma,
          input.mintingPeriodId
        )

        if (
          await prisma.mintLock.findFirst({
            where: {
              userId: ctx.user.id,
              projectId: input.projectId,
              createdAt: { gt: subSeconds(new Date(), 10) },
            },
          })
        )
          throw new Error('you need to wait a little bit for your next mint')

        const user = pub(input.user)

        const paymentOption = await prisma.paymentOption.findUnique({
          where: {
            id: input.paymentId,
          },
          include: { pricings: true },
          rejectOnNotFound: true,
        })

        /*  
        removed due not waiting till finalized in frontend
       
       if (
          await prisma.mintTransaction.findFirst({
            where: {
              userId: ctx.user.id,
              confirmed: false,
              createdAt: {
                gt: subSeconds(new Date(), 30),
              },
            },
          })
        )
          throw new Error('you already have one transaction running') */

        await isMintingAllowed({
          wallet: input.user,
          payment: paymentOption,
          project,
          prisma: prisma,
          userId: ctx.user.id,
        })

        const instructions: TransactionInstruction[] = []

        console.time('mintMeta.findMany')
        let projectMetas = (await prisma.mintMeta.findMany({
          where: {
            projectId: project.id!,
            /*  alreadyMinted: false, */
            OR: [
              {
                lastUsed: null,
              },
              /*  {
                lastUsed: {
                  lt: subSeconds(new Date(), 180)
                }
              } */
            ],
          },
          select: { id: true, lastUsed: true },
        }))!
        console.timeEnd('mintMeta.findMany')

        if (projectMetas.length === 0) {
          projectMetas = (await prisma.mintMeta.findMany({
            where: {
              projectId: project.id!,
            },
            select: { id: true, lastUsed: true },
          }))!
        }

        const launchPda = await getLaunchPda(project.identifier!)

        const { launch, launchMints } = await getHeislMachineLaunch(
          project.identifier!
        )

        let availableMetas = projectMetas.filter(
          (m) => !launchMints.alreadyMinted.includes(m.id)
        )

        if (availableMetas.length === 0) {
          projectMetas = (await prisma.mintMeta.findMany({
            where: {
              projectId: project.id!,
            },
            select: { id: true, lastUsed: true },
          }))!

          availableMetas = projectMetas.filter(
            (m) => !launchMints.alreadyMinted.includes(m.id)
          )
        }

        if (availableMetas.length == 0) throw new Error('no metas found, try again')

        const metaId = _.sample(availableMetas)!

        mintMeta = await prisma.mintMeta.findUnique({
          where: {
            id_projectId: {
              projectId: project.id!,
              id: metaId.id,
            },
          },
          rejectOnNotFound: true,
        })

        await prisma.mintMeta.update({
          where: {
            id_projectId: {
              projectId: project.id!,
              id: metaId.id,
            },
          },
          data: {
            lastUsed: new Date(),
          },
        })

        const mintHeislInstr = await createHeislMintInstr({
          launchPub: launchPda[0],
          launch: launch,
          mintId: mintMeta.id,
          user: user,
          backendUser: backendSigner.publicKey,
        })
        instructions.push(mintHeislInstr)

        const projectWallet = loadWallet(
          process.env[`WALLET_${project.identifier!}`]!
        )

        const nftInstrRes = await createNftInstr({
          walletKeypair: projectWallet,
          metadata: JSON.parse(mintMeta.metadata),
          metadataLink: mintMeta.metadataLink,
          mintTo: user,
        })

        instructions.push(...nftInstrRes.instructions)

        if (!paymentOption.pricings.length) {
          throw new Error('Wrong configuration in pricing.')
        }

        for (const p of paymentOption.pricings) {
          if (p.isSol) {
            /*  candyMachine.data.creators
              .filter((creator) => creator.share > 0)
              .forEach((creator) =>
                instructions.push(
                  SystemProgram.transfer({
                    fromPubkey: user,
                    toPubkey: creator.address,
                    lamports:
                      (p.amount ?? 0) *
                      (creator.share / 100) *
                      LAMPORTS_PER_SOL,
                  })
                )
              ) */
            const amount = p.amount ?? p.amountInSol ?? 0
            if (!amount) throw new Error('Error in pricing. Try again!')
            instructions.push(
              SystemProgram.transfer({
                fromPubkey: user,
                toPubkey: project.fundsWallet
                  ? pub(project.fundsWallet)
                  : defaultFundsWallet,
                lamports: amount * LAMPORTS_PER_SOL,
              })
            )
          } else {
            const getAmount = async () => {
              if (!p.amountInSol) return p.amount!
              if (p.currency === 'PUFF') {
                return p.amountInSol / (await getPriceInSol('PUFF/USDC'))
              } else if (p.currency === 'ALL') {
                return p.amountInSol / (await getDexlabPrice('ALL/SOL'))
              }
              return p.amountInSol
            }

            let amount = await getAmount()

            if (!amount || amount === 0) {
              throw new Error(
                'Something went wrong with your pricing option. Try again!'
              )
            }

            instructions.push(
              ...(await createTransferInstruction({
                amount: amount * LAMPORTS_PER_SOL,
                from: user,
                mint: pub(p.token!),
                to: project.fundsWallet
                  ? pub(project.fundsWallet)
                  : defaultFundsWallet,
                payer: user,
              }))
            )
          }
        }

        /*  if(project.currentLaunchPeriod.isWhitelist && project.currentLaunchPeriod.wlToken)
      instructions.push(
        ...(await createTransferInstruction({
          amount: 1,
          from: user,
          mint: pub(config.puffToken),
          to: alphaLabsFundsWallet,
          payer: user,
        }))
      ) */

        // const randomTokens = [
        //   'Fpmd7oUgWQaSRZthVUTqs4vyQZHByyniUQamQo84aAb8',
        //   '5vG4tZM1QUW8zdTsRmjXzrqHfbXxx4J5Bd6JoGRuYYvd',
        //   '2TKv6srTVbEv1reRNDniLZfbhGJrtZDnaPJeuBfa7ZgH',
        //   'ABhkfUECST7NabvDNMg2oXB7t9fLb8tkYGtZeB9dd5qp',
        //   'C4iL4RPAmQyutr2LurL8Pdj79BY1qd2TBzn4KLT8VkE2',
        // ]

        // for (const token of randomTokens) {
        //   instructions.push(
        //     ...(await createTransferInstruction({
        //       amount: 10000,
        //       from: mintWallet.publicKey,
        //       mint: pub(token),
        //       to: user,
        //       payer: user,
        //     }))
        //   )
        // }

        // mint fee

        const blockhash = await getLatestBlockhash()
        const transaction = new Transaction({
          feePayer: user,
          recentBlockhash: blockhash.blockhash,
        }).add(...instructions)

        const signers = [backendSigner, ...nftInstrRes.signers]

        for (let signer of signers) {
          await transaction.partialSign(signer)
        }

        const serializedTransaction = transaction.serialize({
          requireAllSignatures: false,
        })

        console.log('serializedTransaction', serializedTransaction.byteLength)

        const transactionCheck = await prisma.transactionCheck.create({
          data: {
            transaction: JSON.stringify(transaction.compileMessage()),
          },
        })

        const transId = cuid()

        const token = encode(
          {
            projectId: project.id,
            user: user.toBase58(),
            paymentId: input.paymentId,
            mintingPeriodId: project.currentLaunchPeriod.id,
            transactionCheckId: transactionCheck.id,
            transId,
            metadataLink: mintMeta.metadataLink,
          },
          jwtSecret!
        )

        return {
          trans: serializedTransaction.toJSON(),
          token,
          transId,
        }
      } catch (e) {
        console.log('error in createMintTransaction', e)
        if (mintMeta)
          await prisma.mintMeta.update({
            where: {
              id_projectId: {
                id: mintMeta.id,
                projectId: mintMeta.projectId,
              },
            },
            data: {
              lastUsed: mintMeta.lastUsed,
            },
          })

        throw e
      }
    },
  })

  .mutation('sendMintTransaction', {
    input: z.object({
      trans: z.any(),
      token: z.string(),
    }),
    async resolve({ ctx: { prisma, user, ...ctx }, input }) {
      try {
        const token = decode(input.token, jwtSecret!) as {
          user: string
        } & Record<string, any>

        if (
          await prisma.mintLock.findFirst({
            where: {
              userId: user.id,
              projectId: token.projectId,
              createdAt: { gt: subSeconds(new Date(), 10) },
            },
          })
        )
          throw new Error('you need to wait a little bit for your next mint')

        await prisma.mintLock.create({
          data: {
            userId: user.id,
            projectId: token.projectId,
          },
        })

        const transaction = Transaction.from(Buffer.from(input.trans))

        const transactionCheck = await prisma.transactionCheck.findUnique({
          where: {
            id: token.transactionCheckId!,
          },
        })

        if (
          !transactionCheck ||
          transactionCheck.transaction !==
            JSON.stringify(transaction.compileMessage())
        )
          throw new Error('You sent the wrong transaction')

        console.time('sendMintTransTime-' + transactionCheck.id)

        const project = await getLaunchReadyProject(
          token.projectId,
          prisma,
          token.mintingPeriodId
        )
        const { currentLaunchPeriod } = project

        const payment = await prisma.paymentOption.findUnique({
          where: {
            id: token.paymentId,
          },
          rejectOnNotFound: true,
        })

        const whitelistSpot = await isMintingAllowed({
          wallet: token.user,
          payment: payment,
          project,
          prisma: prisma,
          userId: user.id,
        })

        let mintTransaction = await prisma.mintTransaction.create({
          data: {
            id: token.transId,
            user: {
              connect: {
                id: user.id,
              },
            },
            mintPeriod: { connect: { id: token.mintingPeriodId } },
            paymentOption: { connect: { id: payment.id } },
            metadataLink: token.metadataLink,
          },
        })

        if (whitelistSpot) {
          const res = await prisma.whitelistSpot.update({
            where: {
              mintingPeriodId_userId: {
                userId: whitelistSpot.userId,
                mintingPeriodId: whitelistSpot.mintingPeriodId,
              },
            },
            data: {
              hasMinted: whitelistSpot.hasMinted + 1,
            },
          })
          console.log('updateres', res)
        }

        try {
          // TODO: revert after alpha labs mint
          // await transaction.partialSign(launchMint)

          const projectWallet = loadWallet(
            process.env[`WALLET_${project.identifier!}`]!
          )

          await transaction.partialSign(projectWallet)

          const serial = transaction.serialize()

          const tx = await connection.sendRawTransaction(serial, {})

          mintTransaction = await prisma.mintTransaction.update({
            where: { id: mintTransaction.id },
            data: { tx },
          })

          await Reattempt.run({ times: 2 }, async () => {
            await connection.confirmTransaction(tx, 'finalized')
          })
          const transStatus = await Reattempt.run(
            { times: 8, delay: 1000 },
            async () => await connection.getSignatureStatus(tx)
          )

          if (!transStatus.value) {
            throw new Error('tx not found')
          }

          if (transStatus.value.err) {
            console.error('tx error', transStatus.value.err.toString())
            throw new Error(transStatus.value.err.toString())
          }

          console.timeEnd('sendMintTransTime-' + transactionCheck.id)

          await prisma.mintTransaction.update({
            where: { id: mintTransaction.id },
            data: {
              confirmed: true,
            },
          })

          return { tx: tx }
        } catch (e) {
          if (currentLaunchPeriod.isWhitelist && whitelistSpot)
            await prisma.whitelistSpot.update({
              where: {
                mintingPeriodId_userId: {
                  userId: whitelistSpot.userId,
                  mintingPeriodId: whitelistSpot.mintingPeriodId,
                },
              },
              data: {
                hasMinted: whitelistSpot.hasMinted - 1,
              },
            })
          if (mintTransaction)
            await prisma.mintTransaction.delete({
              where: { id: mintTransaction.id },
            })

          console.error('in sendMintTrans at transaction', token, e)
          throw e
        }
      } catch (e) {
        console.error('in sendMintTrans global', input, e)

        throw e
      }
    },
  })
  .query('getTransaction', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await prisma.mintTransaction.findUnique({
        where: { id: input.id },
      })
    },
  })
  .query('getTransactionBySignature', {
    input: z.object({
      tx: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await prisma.mintTransaction.findFirst({
        where: {
          tx: input.tx,
        },
      })
    },
  })
  .query('getProjects', {
    async resolve({ ctx: { prisma }, input }) {
      const projects = await prisma.project.findMany({
        where: {
          showOnOverview: true,
        },
        include: {
          mintingPeriods: { include: { pricings: true } },
          creator: true,
          votes: true,
          features: true,
          galleryUrls: true,
        },
      })
      const featured = []
      for (const project of projects) {
        if (project.features.some((feature) => feature.isActive)) {
          featured.push(project)
        }
      }

      const current = []
      const upcoming = []
      const ended = []

      const sortAfterDate = (a: Date, b: Date) => {
        return a.getTime() - b.getTime()
      }

      for (const project of projects) {
        const sortedMintingPeriods = project.mintingPeriods.sort((a, b) =>
          sortAfterDate(a.startAt, b.startAt)
        )

        const firstMintingPeriod = sortedMintingPeriods[0]
        const lastMintingPeriod =
          sortedMintingPeriods[sortedMintingPeriods.length - 1]

        const firstStart =
          firstMintingPeriod &&
          firstMintingPeriod.startAt.getTime() -
            project.publicMintStart.getTime() <
            0
            ? firstMintingPeriod.startAt
            : project.publicMintStart

        const end = lastMintingPeriod.endAt

        if (firstStart.getTime() - new Date().getTime() < 0) {
          if (end && end.getTime() - new Date().getTime() < 0) {
            ended.push(project)
          } else {
            current.push(project)
          }
        } else {
          upcoming.push(project)
        }
      }

      return {
        current,
        ended,
        upcoming,
        featured,
      }
    },
  })
  .query('getOverview', {
    async resolve({ ctx: { prisma }, input }) {
      const projects = await prisma.project.findMany({
        include: {
          mintingPeriods: { include: { pricings: true } },
          creator: true,
          votes: true,
          features: true,
        },
      })
      const featured = []
      const current = []
      const upcoming = []
      const ended = []

      const sortAfterDate = (a: Date, b: Date) => {
        return a.getTime() - b.getTime()
      }

      for (const project of projects) {
        if (project.projectName === 'MaryJane') {
          featured.push(project)
        }

        const sortedMintingPeriods = project.mintingPeriods.sort((a, b) =>
          sortAfterDate(a.startAt, b.startAt)
        )

        const firstMintingPeriod = sortedMintingPeriods[0]

        const firstStart =
          firstMintingPeriod &&
          firstMintingPeriod.startAt.getTime() -
            project.publicMintStart.getTime() <
            0
            ? firstMintingPeriod.startAt
            : project.publicMintStart

        console.log(firstMintingPeriod, firstStart)

        if (firstStart.getTime() - new Date().getTime() < 0) {
          if (
            project.mintEnd &&
            project.mintEnd.getTime() - new Date().getTime() < 0
          ) {
            ended.push(project)
          } else {
            current.push(project)
          }
        } else {
          upcoming.push(project)
        }

        if (project.features.some((feature) => feature.isActive)) {
          featured.push(project)
        }
      }

      return {
        featured,
        current,
        upcoming,
        ended,
      }
    },
  })
  .query('getProject', {
    input: z.object({
      projectUrlIdentifier: z.string(),
    }),
    async resolve({ ctx, input }) {
      const project = await ctx.prisma.project.findUnique({
        where: {
          projectUrlIdentifier: input.projectUrlIdentifier,
        },
        include: {
          teamMembers: true,
          votes: true,
          utilities: true,
          galleryUrls: {
            orderBy: {
              usedForHeader: 'desc',
            },
          },
          roadmapPeriods: {
            include: {
              roadmapItems: true,
            },
          },
          mintingPeriods: {
            include: {
              pricings: true,
              paymentOptions: {
                include: {
                  pricings: true,
                },
              },
            },
          },
          creator: true,
        },
      })

      if (!project) return null

      const heislMachine = await getHeislMachineLaunch(
        project?.identifier!
      ).catch((e) => {
        console.log('e', e)
      })

      const launchMints =
        typeof heislMachine === 'object' ? heislMachine.launchMints : undefined

      const stats = {
        itemsAvailable: project?.totalSupply!,
        itemsRemaining: project?.totalSupply!,
        itemsRedeemed: 0,
        itemsRedeemedPercentage: 0,
      }

      if (launchMints) {
        stats.itemsRedeemed = launchMints.counter + (project.alreadyMinted ?? 0)
        stats.itemsRemaining = stats.itemsAvailable - stats.itemsRedeemed
        stats.itemsRedeemedPercentage =
          (stats.itemsRedeemed / stats.itemsAvailable) * 100
      }

      return { ...project, stats }
    },
  })
  .query('getProjectComments', {
    input: z.object({
      projectId: z.string().nonempty(),
    }),
    async resolve({ ctx, input }) {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          project: {
            id: input.projectId,
          },
        },
        include: {
          user: true,
          likes: true,
          disLikes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      return comments
    },
  })
  .mutation('addComment', {
    input: z.object({
      projectId: z.string().nonempty(),
      userId: z.string().nonempty(),
      message: z.string().nonempty(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.comment.create({
        data: {
          message: input.message,
          user: {
            connect: {
              id: input.userId,
            },
          },
          project: {
            connect: {
              id: input.projectId,
            },
          },
        },
        include: {
          user: true,
        },
      })
    },
  })
  .mutation('likeComment', {
    input: z.object({
      id: z.string().nonempty(),
      like: z.boolean(),
      userId: z.string().nonempty(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          likes: input.like
            ? {
                connect: {
                  id: input.userId,
                },
              }
            : undefined,
          disLikes: !input.like
            ? {
                connect: {
                  id: input.userId,
                },
              }
            : undefined,
        },
      })
      return true
    },
  })
  .query('getProjectOpinions', {
    input: z.object({
      projectId: z.string().nonempty(),
    }),
    async resolve({ ctx, input }) {
      const opinions = await ctx.prisma.opinion.findMany({
        where: {
          project: {
            id: input.projectId,
          },
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      return opinions
    },
  })
  .mutation('likeProject', {
    input: z.object({
      projectId: z.string().nonempty(),
      userId: z.string().nonempty(),
      like: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.vote.upsert({
        where: {
          userId_projectId: {
            userId: input.userId,
            projectId: input.projectId,
          },
        },
        update: {
          isUpvote: input.like,
        },
        create: {
          isUpvote: input.like,
          user: {
            connect: {
              id: input.userId,
            },
          },
          project: {
            connect: {
              id: input.projectId,
            },
          },
        },
      })
    },
  })
  .query('getProjectLikes', {
    input: z.object({
      projectId: z.string().nonempty(),
    }),
    async resolve({ ctx, input }) {
      const votes = await ctx.prisma.vote.findMany({
        where: {
          project: {
            id: input.projectId,
          },
        },
      })
      return votes
    },
  })
