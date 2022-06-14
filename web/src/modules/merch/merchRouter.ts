import {
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import { z } from 'zod'
import config, { connection, puffBurnerWallet } from '../../config/config'
import { createRouter } from '../../server/createRouter'
import { getNftWithMetadata, pub } from '../../utils/solUtils'
import {
  createTransferInstruction,
  getNfts,
  getNftsFromOwnerByCreators,
  getNftsFromOwnerByMints,
  getNftWithTokenAccount,
} from '../../utils/splUtils'
import { merchBurnWalletOg, merchConfigOgBox } from './merchConfigOgBox'
import Reattempt from 'reattempt'
import _, { drop } from 'lodash'
import { doesUserOwnNfts } from '../../utils/sacUtils'
import { nukedCollection, sacCollection } from '../../config/collectonsConfig'
import { NftMetadata } from '../../utils/nftmetaData.type'
import { PrismaClient } from '@prisma/client'
import { getAvailableBoxes } from './tmpUtils'
import { getCbdProduct } from './merchUtils'
import { currentDrops, merchConfig } from './merchConfig'
import prisma from '../../lib/prisma'

const merchMintUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.DEV_WALLET as string))
)

export const merchRouter = createRouter()
  .mutation('mintCbProduct', {
    input: z.object({
      productHref: z.string(),
      user: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log('input', input)
      const instructions: TransactionInstruction[] = []
      const user = new PublicKey(input.user)

      const product = await getCbdProduct(input.productHref)

      if (product.amount < 1) throw new Error('This product is sold out')

      console.log('product', JSON.stringify(product, null, 3))

      if (
        !(await doesUserOwnNfts(user.toBase58(), {
          collections: [sacCollection, nukedCollection],
        }))
      )
        throw new Error('You dont own a Stoned Ape')

      /* if (
      await ctx.prisma.boxOrder.findFirst({
        where: {
          user: {
            wallet: user.toBase58(),
          },
        },
      })
    )
      throw new Error(`# swaped a ${product.name}`) 

      */

      const tokenAccount = await getNftWithTokenAccount({
        user: user,
        nft: product.nft,
      })

      if (
        tokenAccount &&
        tokenAccount.tokenAccount.account.data.parsed.info.tokenAmount
          .uiAmount > 0
      )
        throw new Error(`You already have a ${product.name} NFT`)

      if (
        await prisma.cbdOrder.findFirst({
          where: {
            products: {
              some: {
                nft: product.nft.toBase58(),
              },
            },
            user: {
              wallet: input.user,
            },
          },
        })
      )
        throw new Error(`You already have a ${product.name} NFT`)

      const transferPayPuffInstructions = await createTransferInstruction({
        from: user,
        to: merchConfig.burnerWallet,
        mint: new PublicKey(config.puffToken),
        amount: product.pricing.puff * LAMPORTS_PER_SOL,
        payer: user,
      })
      instructions.push(...transferPayPuffInstructions)

      const transferPaySolanaInstructions = await SystemProgram.transfer({
        fromPubkey: user,
        toPubkey: merchConfig.burnerWallet,
        lamports: product.pricing.sol * LAMPORTS_PER_SOL,
        programId: SystemProgram.programId,
      })
      instructions.push(transferPaySolanaInstructions)

      const transferNftInstructions = await createTransferInstruction({
        from: merchConfig.mintWallet,
        to: user,
        mint: product.nft,
        amount: 1,
        payer: user,
      })
      instructions.push(...transferNftInstructions)

      const blockhash = await connection.getRecentBlockhash()

      const transaction = new Transaction({
        recentBlockhash: blockhash.blockhash,
        feePayer: user,
      }).add(...instructions)

      await transaction.partialSign(merchMintUser)

      const serializedTrans = transaction.serialize({
        requireAllSignatures: false,
      })

      return {
        trans: serializedTrans.toJSON(),
      }
    },
  })
  .mutation('swapCbd', {
    input: z.object({
      trans: z.any(),
      order: z.object({
        wallet: z
          .string()
          .regex(/(\b[a-zA-Z0-9]{32,44}\b)/g, 'not a solana address'),
        firstname: z.string().nonempty(),
        lastname: z.string().nonempty(),
        email: z.string().nonempty(),
        street: z.string().nonempty(),
        zip: z.string().nonempty(),
        city: z.string().nonempty(),
        state: z.string().nonempty(),
        country: z.string().nonempty(),
        note: z.string(),
      }),
      products: z.array(
        z.string().regex(/(\b[a-zA-Z0-9]{32,44}\b)/g, 'not a solana address')
      ),
    }),
    async resolve({ ctx, input }) {
      try {
        console.log('swapBoxinput', { ...input, trans: undefined })

        const failedTrans = await ctx.prisma.failedCbdOrder.findUnique({
          where: {
            wallet: input.order.wallet,
          },
        })

        let tx = failedTrans?.tx

        if (!tx) {
          const transaction = Transaction.from(Buffer.from(input.trans))

          const serial = transaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
          })
          tx = await connection.sendRawTransaction(serial)
          console.log('tx', tx)
        }

        let swapTransaction: ParsedTransactionWithMeta | undefined
        try {
          const res = await Reattempt.run(
            { times: 3, delay: 1000 },
            async () => {
              await connection.confirmTransaction(tx!, 'finalized')
            }
          )
          console.log('swapTransaction confirmed')

          let counter = 0
          swapTransaction = await Reattempt.run(
            { times: 4, delay: 2000 },
            async () => {
              counter
              console.log(`transaction find trial ${counter}`)

              const trans = await connection.getParsedTransaction(
                tx!,
                'confirmed'
              )

              if (!trans) {
                console.log('swapTransaction not found', tx)
                throw new Error('transaction not found')
              }

              return trans
            }
          )

          if (!swapTransaction) {
            throw new Error(
              `swapTransaction not found for tx ${tx} and order ${JSON.stringify(
                input.order,
                null,
                3
              )}`
            )
          }
        } catch (e: any) {
          const alreadyExists = await ctx.prisma.failedCbdOrder.findUnique({
            where: {
              wallet: input.order.wallet,
            },
          })
          if (alreadyExists) {
            await ctx.prisma.failedCbdOrder.delete({
              where: {
                wallet: input.order.wallet,
              },
            })
          } else {
            await ctx.prisma.failedCbdOrder.create({
              data: {
                tx: tx!,
                wallet: input.order.wallet,
                data: JSON.stringify({ ...input, trans: undefined }),
              },
            })
          }
          console.error('transaction timed out, please try again', e.message)
          throw new Error('transaction timed out, please try again')
        }

        if (failedTrans) {
          await ctx.prisma.failedCbdOrder.delete({
            where: { id: failedTrans.id },
          })
        }

        const availableNfts = currentDrops

        const postTokenBalances = swapTransaction?.meta?.postTokenBalances!

        const productMints = postTokenBalances
          .filter((p, i) => i % 2)
          .filter((p) => currentDrops.find((d) => d.nft.toBase58() === p.mint))
          .map((p) => pub(p.mint))

        const products = await getNfts(productMints)

        const preBurnBalance = swapTransaction?.meta?.preTokenBalances?.find(
          (preBalance) =>
            availableNfts.find((n) => n.nft.toBase58() == preBalance.mint) &&
            preBalance.owner === merchConfig.burnerWallet.toBase58()
        )
        const postBurnBalance = swapTransaction?.meta?.postTokenBalances?.find(
          (postBalance) =>
            availableNfts.find((n) => n.nft.toBase58() == postBalance.mint) &&
            postBalance.owner === merchConfig.burnerWallet.toBase58()
        )

        if (
          postBurnBalance?.uiTokenAmount?.uiAmount == null ||
          postBurnBalance?.uiTokenAmount?.uiAmount -
            (preBurnBalance?.uiTokenAmount?.uiAmount ?? 0) !==
            1
        )
          throw new Error('wrong transactions')

        const userArgs = {
          wallet: input.order.wallet,
          city: input.order.city,
          country: input.order.country,
          email: input.order.email,
          firstname: input.order.firstname,
          lastname: input.order.lastname,
          street: input.order.street,
          zip: input.order.zip,
          state: input.order.state,
        }

        let user = await prisma.cbdUser.upsert({
          where: {
            wallet: input.order.wallet,
          },
          create: userArgs,
          update: userArgs,
        })

        await prisma.cbdOrder.create({
          data: {
            transferNftTx: tx!,
            note: input.order.note,
            txFailed: false,
            user: {
              connect: {
                id: user.id,
              },
            },
            products: {
              createMany: {
                data: products.map((p) => ({
                  name: p.name,
                  nft: p.pubkey.toBase58(),
                })),
              },
            },
          },
        })

        return {
          success: true,
        }
      } catch (e) {
        console.error('error at swapBox', e)

        throw new Error('error at swapBox, please try again')
      }
    },
  })

  .query('getBoxes', {
    /* input: z.object({
    
  }), */
    async resolve({ ctx, input }) {
      const products = (await getAvailableBoxes()).sort(
        (a, b) => Number(a.order) - Number(b.order)
      )

      return products
    },
  })

  .query('getOrders', {
    input: z.object({
      user: z.string(),
    }),
    async resolve({ ctx, input }) {
      const dbOrders = await ctx.prisma.cbdOrder.findMany({
        where: {
          user: {
            wallet: input.user,
          },
        },
        include: {
          user: true,
          products: true,
        },
      })

      const orders = dbOrders.map((o) => ({
        ...o,
        products: o.products.map((p) => {
          const drop = currentDrops.find((c) => c.nft.toBase58() === p.nft)!

          return {
            ...drop,
            nft: drop.nft.toBase58(),
          }
        }),
      }))

      return orders
    },
  })
  .query('getBoxOrders', {
    input: z.object({
      user: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.boxOrder.findMany({
        where: {
          user: {
            wallet: input.user,
          },
        },
        include: {
          user: true,
        },
      })
    },
  })
  .mutation('mintBox', {
    input: z.object({
      size: z.string(),
      user: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log('input', input)
      const instructions: TransactionInstruction[] = []
      const user = new PublicKey(input.user)

      const product = (await getAvailableBoxes()).find(
        (n) => n.size === input.size && n.amount > 0
      )

      if (!product) throw new Error('This size is sold out')

      if (
        !(await doesUserOwnNfts(user.toBase58(), {
          collections: [sacCollection],
        }))
      )
        throw new Error('You dont own a Stoned Ape')

      /* if (
        await ctx.prisma.boxOrder.findFirst({
          where: {
            user: {
              wallet: user.toBase58(),
            },
          },
        })
      )
        throw new Error(`You already swaped a ${product.name}`) 

      const tokenAccounts = await asyncBatch(
        nfts,
        async (nft, i) =>
          getTokenAccount(
            connection,
            pub(nft.tokenAccount.account.data.parsed.info.mint),
            user
          ),
        10
      )

      if (
        tokenAccounts.find(
          (tokenAccount) =>
            (tokenAccount?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ??
              0) > 0
        )
      )
        throw new Error(`You already have a ${product.name} NFT`) */

      const transferPayInstructions = await createTransferInstruction({
        from: user,
        to: puffBurnerWallet,
        mint: new PublicKey(config.puffToken),
        amount: 510 * LAMPORTS_PER_SOL,
        payer: user,
      })
      instructions.push(...transferPayInstructions)

      const transferNftInstructions = await createTransferInstruction({
        from: merchMintUser.publicKey,
        to: user,
        mint: product.mint,
        amount: 1,
        payer: user,
      })
      instructions.push(...transferNftInstructions)

      const blockhash = await connection.getRecentBlockhash()

      const transaction = new Transaction({
        recentBlockhash: blockhash.blockhash,
        feePayer: user,
      }).add(...instructions)

      await transaction.partialSign(merchMintUser)

      const serializedTrans = transaction.serialize({
        requireAllSignatures: false,
      })

      return {
        trans: serializedTrans.toJSON(),
      }
    },
  })
  .mutation('swapBox', {
    input: z.object({
      trans: z.any(),
      order: z.object({
        wallet: z
          .string()
          .regex(/(\b[a-zA-Z0-9]{32,44}\b)/g, 'not a solana address'),
        firstname: z.string().nonempty(),
        lastname: z.string().nonempty(),
        email: z.string().nonempty(),
        street: z.string().nonempty(),
        zip: z.string().nonempty(),
        city: z.string().nonempty(),
        country: z.string().nonempty(),
        note: z.string(),
      }),
      mint: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        console.log('swapBoxinput', { ...input, trans: undefined })

        const failedTrans = await ctx.prisma.failedBoxOrder.findUnique({
          where: {
            wallet: input.order.wallet,
          },
        })

        let tx = failedTrans?.tx

        if (!tx) {
          const transaction = Transaction.from(Buffer.from(input.trans))

          const serial = transaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
          })
          tx = await connection.sendRawTransaction(serial)
          console.log('tx', tx)
        }

        let swapTransaction: ParsedTransactionWithMeta | undefined
        try {
          const res = await Reattempt.run(
            { times: 1, delay: 1000 },
            async () => await connection.confirmTransaction(tx!, 'confirmed')
          )
          console.log('swapTransaction confirmed')

          swapTransaction = await Reattempt.run(
            { times: 4, delay: 2000 },
            async () => {
              const trans = await connection.getParsedTransaction(
                tx!,
                'confirmed'
              )

              if (!trans) {
                console.log('swapTransaction not found', tx)
                throw new Error('transaction not found')
              }

              return trans
            }
          )

          if (!swapTransaction) {
            throw new Error(
              `swapTransaction not found for tx ${tx} and order ${JSON.stringify(
                input.order,
                null,
                3
              )}`
            )
          }
        } catch (e: any) {
          const alreadyExists = await ctx.prisma.failedBoxOrder.findUnique({
            where: {
              wallet: input.order.wallet,
            },
          })
          if (alreadyExists) {
            await ctx.prisma.failedBoxOrder.delete({
              where: {
                wallet: input.order.wallet,
              },
            })
          } else {
            await ctx.prisma.failedBoxOrder.create({
              data: {
                tx: tx!,
                wallet: input.order.wallet,
              },
            })
          }
          console.error('transaction timed out, please try again', e.message)
          throw new Error('transaction timed out, please try again')
        }

        if (failedTrans) {
          await ctx.prisma.failedBoxOrder.delete({
            where: { id: failedTrans.id },
          })
        }

        const availableNfts = await getNftsFromOwnerByCreators({
          owner: merchConfigOgBox.wallet,
          creators: [merchConfigOgBox.boxCreator],
          withAmount: false,
        })

        const preBurnBalance = swapTransaction?.meta?.preTokenBalances?.find(
          (preBalance) =>
            availableNfts.find(
              (n) => n.nft.pubkey.toBase58() == preBalance.mint
            ) && preBalance.owner === merchBurnWalletOg.toBase58()
        )
        const postBurnBalance = swapTransaction?.meta?.postTokenBalances?.find(
          (postBalance) =>
            availableNfts.find(
              (n) => n.nft.pubkey.toBase58() == postBalance.mint
            ) && postBalance.owner === merchBurnWalletOg.toBase58()
        )

        /* console.log('balance check', {
        preTokenBalances: swapTransaction?.meta?.preTokenBalances,
        preBurnBalance,
        postBurnBalance,
      }) */

        if (
          postBurnBalance?.uiTokenAmount?.uiAmount == null ||
          postBurnBalance?.uiTokenAmount?.uiAmount -
            (preBurnBalance?.uiTokenAmount?.uiAmount ?? 0) !==
            1
        )
          throw new Error('wrong transactions')

        const nft = await getNftWithMetadata(pub(postBurnBalance.mint))
        const size = nft.attributes.find((a) => a.trait_type === 'Size')?.value
        if (!size) throw new Error('wrong nft')

        await createOrderAndUpsertUser({
          input,
          prisma: ctx.prisma,
          size,
          tx,
          nft,
          productName: nft.collection.name,
          product: nft.data.data.creators.find((c) =>
            [merchConfigOgBox.boxCreator].find(
              (b) => b.toBase58() === c.address
            )
          )!.address,
        })

        return {
          success: true,
        }
      } catch (e) {
        console.error('error at swapBox', e)

        throw new Error('error at swapBox, please try again')
      }
    },
  })

async function createOrderAndUpsertUser({
  input,
  prisma,
  size,
  tx,
  nft,
  txFailed,
  product,
  productName,
}: {
  input: {
    trans?: any
    order: {
      wallet: string
      firstname: string
      lastname: string
      email: string
      street: string
      zip: string
      city: string
      country: string
      note: string
    }
  }
  productName: string
  product: string
  size: string
  tx: string
  nft: NftMetadata
  prisma: PrismaClient
  txFailed?: boolean
}) {
  const userArgs = { ...input.order, note: undefined }

  const user = await prisma.boxUser.upsert({
    where: {
      wallet: input.order.wallet,
    },
    update: {
      ...userArgs,
      orders: {
        create: {
          note: input.order.note,
          size: size,
          transferNftTx: tx,
          mint: nft.pubkey.toBase58(),
          txFailed,
          product,
          productName,
          image: nft.image,
        },
      },
    },
    create: {
      ...userArgs,
      orders: {
        create: {
          note: input.order.note,
          size: size,
          transferNftTx: tx,
          mint: nft.pubkey.toBase58(),
          txFailed,
          product,
          productName,
          image: nft.image,
        },
      },
    },
  })
}
