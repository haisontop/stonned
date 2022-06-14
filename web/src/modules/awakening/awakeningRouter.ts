import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import { z } from 'zod'
import {
  magicJCollection,
  nukedCollection,
} from '../../config/collectonsConfig'
import config, {
  connection,
  puffBurnerWallet,
  puffToken,
} from '../../config/config'
import prisma from '../../lib/prisma'
import { createRouter } from '../../server/createRouter'
import { updateMetadata } from '../../utils/nftUtils'
import {
  getAwakeningCost,
  getMetadata,
  getLatestBlockhash,
  getNftWithMetadata,
  loadWallet,
  getNftWithMetadataNew,
} from '../../utils/solUtils'
import { createTransferInstruction } from '../../utils/splUtils'
import { awakeningProgram } from './awakeningConfig'
import {
  createRevealAwakeningInstr,
  createStartAwakeningInstr,
} from './awakeningUtils'

const backendUser = loadWallet(process.env.PROGRAM_SIGNER!)

const nukedSigner = loadWallet(process.env.NUKED_WALLET!)

const oneOutOfOnes: Record<string, number | undefined> = {
  'Albert Einstein': 6000,
  'White Walker': 6001,
  'Mr Puff': 6002,
  'yūrei 幽霊': 6003,
  'Jimmy the Nuked Hero': 6004,
  'Nuked Twins': 6005,
  'Marie Curie': 6006,
  'Thay-Lung': 6007,
}

export const awakeningRouter = createRouter()
  .mutation('startBreed', {
    input: z.object({
      user: z.string(),
      ape: z.string(),
      magicJ: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log('awakening input', input)

      const apePukey = new PublicKey(input.ape)
      const magicJPukey = new PublicKey(input.magicJ)
      const user = new PublicKey(input.user)

      const magicJMetadata = await getNftWithMetadataNew(magicJPukey)

      const awakeningCost = await getAwakeningCost(apePukey, magicJMetadata)

      const verifiedCreator = magicJMetadata.data.data.creators?.find(
        (creator) =>
          creator.address === magicJCollection.creator && creator.verified
      )
      if (!verifiedCreator) {
        throw new Error('No official MagicJ')
      }

      const instructions: TransactionInstruction[] = []

      // PUFF transfer to burner wallet
      instructions.push(
        ...(await createTransferInstruction({
          mint: puffToken,
          amount: awakeningCost.puff * LAMPORTS_PER_SOL,
          from: user,
          to: puffBurnerWallet,
          payer: user,
        }))
      )

      // ALL transfer to burner wallet
      instructions.push(
        ...(await createTransferInstruction({
          mint: config.allToken,
          amount: awakeningCost.all * LAMPORTS_PER_SOL,
          from: user,
          to: puffBurnerWallet,
          payer: user,
        }))
      )

      // MagicJ transfer to burner wallet
      instructions.push(
        ...(await createTransferInstruction({
          mint: magicJPukey,
          amount: 1,
          from: user,
          to: puffBurnerWallet,
          payer: user,
        }))
      )

      instructions.push(
        ...(await createStartAwakeningInstr({
          user,
          mint: apePukey,
          backendUser: backendUser.publicKey,
        }))
      )

      const blockhash = await getLatestBlockhash()

      const transaction = new Transaction({
        feePayer: user,
        recentBlockhash: blockhash.blockhash,
      }).add(...instructions)

      const signers = [backendUser]

      for (let signer of signers) {
        await transaction.partialSign(signer)
      }

      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
      })

      return {
        trans: serializedTransaction.toJSON(),
      }
    },
  })
  .query('getAwakeningInfo', {
    input: z.object({
      user: z.string(),
      awakeningPubkey: z.string(),
    }),
    async resolve({ ctx, input }) {
      const awakeningPub = new PublicKey(input.awakeningPubkey)
      const user = new PublicKey(input.user)
      const awakeningAccount = await awakeningProgram.account.awakening.fetch(
        awakeningPub
      )
      const nuked = await getNftWithMetadata(awakeningAccount.mint)
      const isNormal = nuked.name.includes('Nuked Ape #')

      let id = isNormal ? Number(nuked.name.split('#')[1]) - 1 : oneOutOfOnes[nuked.name]

      const newMetadata = await prisma.awakeningMeta.findUnique({
        where: {
          id_creator: {
            creator: nukedCollection.creator,
            id: id!,
          },
        },
      })
      return newMetadata
    },
  })
  .mutation('reveal', {
    input: z.object({
      user: z.string(),
      awakeningPubkey: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log('awakening input', input)

      const awakeningPub = new PublicKey(input.awakeningPubkey)
      const user = new PublicKey(input.user)

      const instructions: TransactionInstruction[] = []

      const awakeningAccount = await awakeningProgram.account.awakening.fetch(
        awakeningPub
      )

      instructions.push(
        ...(await createRevealAwakeningInstr({
          user,
          awakeningPub: awakeningPub,
          backendUser: backendUser.publicKey,
          awakeningAccount,
        }))
      )

      

      const nuked = await getNftWithMetadata(awakeningAccount.mint)

      const isNormal = nuked.name.includes('Nuked Ape #')

      let id = isNormal
        ? Number(nuked.name.split('#')[1]) - 1
        : oneOutOfOnes[nuked.name]

      if (id == undefined || id == null)
        throw new Error(
          'There was an error while updating the metadata. Please try again later'
        )

      const newMetadata = await prisma.awakeningMeta.findUnique({
        where: {
          id_creator: {
            creator: nukedCollection.creator,
            id,
          },
        },
      })

      if (!newMetadata)
        throw new Error(
          'There was an error while updating the metadata. Please try again later'
        )

      const updateInstr = await updateMetadata(
        awakeningAccount.mint,
        connection,
        nukedSigner,
        newMetadata?.newMetadataLink!,
        null,
        false
      )
      instructions.push(...updateInstr)

      const blockhash = await getLatestBlockhash()

      const transaction = new Transaction({
        feePayer: user,
        recentBlockhash: blockhash.blockhash,
      }).add(...instructions)

      const signers = [backendUser, nukedSigner]

      for (let signer of signers) {
        await transaction.partialSign(signer)
      }

      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
      })

      return {
        trans: serializedTransaction.toJSON(),
      }
    },
  })
