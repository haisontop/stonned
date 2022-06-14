import * as web3 from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import { createRouter } from '../createRouter'
import { z } from 'zod'
import { Program, Provider, Wallet } from '@project-serum/anchor'
import { breedingIdl, breedingProgramId, connection } from '../../config/config'
import { getBreedingConfigPda } from '../../modules/breeding/breeding.service'
import { getTokenAccount, getTokenAccountAdressOrCreateTokenAccountInstruction, handleTransaction } from '../../utils/solUtils'

const backendUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.NUKED_WALLET as string))
)

const provider = new Provider(connection, new Wallet(backendUser), {
  commitment: 'confirmed',
})

export const program = new Program(breedingIdl, breedingProgramId, provider)

export const rentingRouter = createRouter()
  // create
  .mutation('rent', {
    input: z.object({
      user: z.string(),
      nft: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const nftPubkey = new web3.PublicKey(input.nft)
        const user = new web3.PublicKey(input.user)

        const ape = new spl.Token(
          connection,
          nftPubkey,
          spl.TOKEN_PROGRAM_ID,
          backendUser
        )

        const rentingAccount = Keypair.generate()
        const instruction = await createStartRentingInstr({
          ape,
          rentingAccount: rentingAccount,
          user: user,
          backendUser,
        })

        const recentBlockhash = await connection.getRecentBlockhash()
        const transaction = new web3.Transaction({
          feePayer: user,
          recentBlockhash: recentBlockhash.blockhash,
        }).add(instruction)

        await transaction.partialSign(backendUser)
        await transaction.partialSign(rentingAccount)

        const serializedTransaction = transaction.serialize({
          requireAllSignatures: false,
        })

        return {
          trans: serializedTransaction.toJSON(),
        }
      } catch (e) {
        console.error('error in renting', e)
        return e
      }
    },
  })
  // read
  .mutation('unrent', {
    input: z.object({
      user: z.string(),
      nft: z.string(),
      rentingAccount: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const nftPubkey = new web3.PublicKey(input.nft)
        const user = new web3.PublicKey(input.user)
        const rentingAccount = new web3.PublicKey(input.rentingAccount)

        const ape = new spl.Token(
          connection,
          nftPubkey,
          spl.TOKEN_PROGRAM_ID,
          backendUser
        )

        const apeTokenAccount = await getTokenAccountAdressOrCreateTokenAccountInstruction({
          mint: ape.publicKey,
          user,
          connection,
        })

        const instruction = await createUnrentInstruction({
          ape,
          apeTokenAccount,
          rentingAccount: rentingAccount,
          user: user,
          backendUser,
        })

        const recentBlockhash = await connection.getRecentBlockhash()
        const transaction = new web3.Transaction({
          feePayer: user,
          recentBlockhash: recentBlockhash.blockhash,
        })

        if (apeTokenAccount.instructions.length > 0) {
          transaction.add(...apeTokenAccount.instructions)
        }

        transaction.add(instruction)

        await transaction.partialSign(backendUser)

        const serializedTransaction = transaction.serialize({
          requireAllSignatures: false,
        })

        return {
          trans: serializedTransaction.toJSON(),
        }
      } catch (e) {
        console.error('error in renting', e)
        return e
      }
    },
  })

async function createStartRentingInstr({
  ape,
  rentingAccount,
  user,
  backendUser,
}: {
  ape: spl.Token
  rentingAccount: Keypair
  user: web3.PublicKey
  backendUser: Keypair
}) {
  const [vault, vaultBump] = await await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape.publicKey.toBuffer()],
    program.programId
  )

  const apeTokenAccount = (await getTokenAccount(connection, ape.publicKey, user))!

  let [configAddress, configBump] = await getBreedingConfigPda()

  console.log('configAddress', configAddress.toBase58())

  return program.instruction.startRent(vaultBump, {
    accounts: {
      configAccount: configAddress,
      rentAccount: rentingAccount.publicKey,
      user: user,
      apeMint: ape.publicKey,
      apeUserAccount: apeTokenAccount.pubkey,
      apeVault: vault,
      backendUser: backendUser.publicKey,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [rentingAccount],
  })
}

async function createUnrentInstruction({
  ape,
  rentingAccount,
  apeTokenAccount,
  user,
  backendUser,
}: {
  ape: spl.Token
  rentingAccount: web3.PublicKey
  apeTokenAccount: {
    address: web3.PublicKey,
    instructions: web3.TransactionInstruction[]
  },
  user: web3.PublicKey
  backendUser: Keypair
}) {
  const [vault, vaultBump] = await await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape.publicKey.toBuffer()],
    program.programId
  )

  let [configAddress, configBump] = await getBreedingConfigPda()

  return await program.instruction.unrent(vaultBump, {
    accounts: {
      configAccount: configAddress,
      rentAccount: rentingAccount,
      user: user,
      apeMint: ape.publicKey,
      apeUserAccount: apeTokenAccount?.address,
      apeVault: vault,
      backendUser: backendUser.publicKey,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [backendUser],
  })
}
