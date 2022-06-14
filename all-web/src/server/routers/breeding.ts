import * as web3 from '@solana/web3.js'
import { Keypair, PublicKey } from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import { createRouter } from '../createRouter'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { Program, Provider, Wallet } from '@project-serum/anchor'
import {
  backendUserPubkey,
  breedingIdl,
  breedingProgramId,
  connection,
  nuked,
  puffBurnerWallet,
  allToken,
} from '../../config/config'
import { getBreedingConfigPda } from '../../modules/breeding/breeding.service'
import {
  getRawRoleOfNft,
  getRoleOfNft,
  getTokenAccount,
  Role,
} from '../../utils/solUtils'
import { mintV2 } from '../../utils/candyMachine'
import Reattempt from 'reattempt'
import { createRevealInstruction } from '../../modules/breeding/breeding.utils'

const nukedUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.NUKED_WALLET as string))
)

const provider = new Provider(connection, new Wallet(nukedUser), {
  commitment: 'confirmed',
})
export const program = new Program(breedingIdl, breedingProgramId, provider)

export const breedingRouter = createRouter()
  // create
  .mutation('startBreed', {
    input: z.object({
      user: z.string(),
      ape1: z.string(),
      ape2: z.string(),
      rentingAccount: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      try {
        console.log('input', input)

        const ape1Pukey = new PublicKey(input.ape1)
        const ape2Pukey = new PublicKey(input.ape2)
        const user = new PublicKey(input.user)
        const rentingAccountPubkey = input.rentingAccount
          ? new PublicKey(input.rentingAccount)
          : undefined

        const ape1Role = await getRawRoleOfNft(ape1Pukey, user, connection)
        const ape2Role = await getRawRoleOfNft(ape2Pukey, user, connection)

        console.log('apeRoles', {
          ape1Role,
          ape2Role,
        })

        if (ape1Role === ape2Role)
          throw new Error('the two apes must have different roles')

        const rentingRole = rentingAccountPubkey
          ? await getRoleOfNft(ape2Pukey, user, connection)
          : undefined

        const ape1TokenAccount = await getTokenAccount(
          connection,
          ape1Pukey,
          user
        )!
        const ape2TokenAccount = await getTokenAccount(
          connection,
          ape2Pukey,
          user
        )!

        const puffBurnerWalletTokenAccount = await getTokenAccount(
          connection,
          allToken,
          puffBurnerWallet
        )!

        const userPuffTokenAccount = await getTokenAccount(
          connection,
          allToken,
          user
        )!

        const breedingAccount = Keypair.generate()

        console.log('puffToken', allToken.toBase58())

        const instruction = await createStartBreedingInstruction({
          ape1: ape1Pukey,
          ape2: ape2Pukey,
          rentAccountPubkey: rentingAccountPubkey,
          user: user,
          ape1TokenAccount: ape1TokenAccount?.pubkey!,
          ape2TokenAccount: ape2TokenAccount?.pubkey!,
          adminUser: nukedUser,
          breedingAccount,
          puffToken: allToken,
          programPuffTokenAccount: puffBurnerWalletTokenAccount?.pubkey!,
          userPuffTokenAccount: userPuffTokenAccount?.pubkey!,
          rentingRole,
        })

        const recentBlockhash = await connection.getRecentBlockhash()
        const transaction = new web3.Transaction({
          feePayer: user,
          recentBlockhash: recentBlockhash.blockhash,
        }).add(instruction)

        await transaction.partialSign(nukedUser)
        await transaction.partialSign(breedingAccount)

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
  .mutation('reveal', {
    input: z.object({
      trans: z.any(),
      user: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        console.log('reveal input', input)

        const user = new PublicKey(input.user)

        const revealTransaction = web3.Transaction.from(
          Buffer.from(input.trans)
        )

        await revealTransaction.partialSign(nukedUser)

        const serial = revealTransaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })
        const tx = await connection.sendRawTransaction(serial)

        await connection.confirmTransaction(tx, 'recent')

        const { instructions, signers } = await mintV2(
          { adminKeypair: nukedUser, candyMachineAddress: nuked.chandyMachineId, user }        )

        const recentBlockhash = await connection.getRecentBlockhash()

        const mintTrans = new web3.Transaction({
          feePayer: nukedUser.publicKey,
          recentBlockhash: recentBlockhash.blockhash,
        }).add(...instructions)

        try {
          const mintTx = await Reattempt.run({ times: 3 }, async () =>
            connection.sendTransaction(mintTrans, signers)
          )
          await connection.confirmTransaction(mintTx)
          console.log('successfully minted', mintTx)
        } catch (error) {
          console.error('error in mint nft', error)
        }

        return {
          success: true,
        }
      } catch (e) {
        console.error('error in renting', e)
        throw e
      }
    },
  })

async function createStartBreedingInstruction({
  ape1,
  puffToken,
  breedingAccount,
  ape1TokenAccount,
  userPuffTokenAccount,
  user,
  ape2,
  ape2TokenAccount,
  rentAccountPubkey,
  adminUser,
  programPuffTokenAccount,
  rentingRole,
}: {
  ape1: PublicKey
  ape2: PublicKey
  puffToken: PublicKey
  breedingAccount: Keypair
  ape1TokenAccount: PublicKey
  ape2TokenAccount: PublicKey
  userPuffTokenAccount: PublicKey
  user: PublicKey
  rentAccountPubkey?: PublicKey
  adminUser: Keypair
  programPuffTokenAccount: PublicKey
  rentingRole?: Role
}) {
  const [vault1, vault1Bump] = await PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape1.toBuffer()],
    program.programId
  )

  const [ape1Used, ape1UsedBump] = await await PublicKey.findProgramAddress(
    [Buffer.from('apeUsed'), ape1.toBuffer()],
    program.programId
  )

  const [vault2, vault2Bump] = await PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape2.toBuffer()],
    program.programId
  )

  const [ape2Used, ape2UsedBump] = await await PublicKey.findProgramAddress(
    [Buffer.from('apeUsed'), ape2.toBuffer()],
    program.programId
  )

  const rentAccount = rentAccountPubkey
    ? await program.account.rentAccount.fetch(rentAccountPubkey)
    : undefined

  let [configAddress, configBump] = await getBreedingConfigPda()
  console.log('configAddress', configAddress.toBase58())

  if (!rentAccount || !rentAccountPubkey || !rentingRole) {
    return program.instruction.startBreeding(
      vault1Bump,
      ape1UsedBump,
      vault2Bump,
      ape2UsedBump,
      {
        accounts: {
          configAccount: configAddress,
          breedingAccount: breedingAccount.publicKey,
          user: user,
          puffToken: puffToken,
          programPuffTokenAccount: programPuffTokenAccount,
          userPuffTokenAccount: userPuffTokenAccount,
          ape1Mint: ape1,
          ape1UserAccount: ape1TokenAccount,
          ape1Vault: vault1,
          ape2Mint: ape2,
          ape2UserAccount: ape2TokenAccount,
          ape2Vault: vault2,
          backendUser: adminUser.publicKey,
          ape1Used: ape1Used,
          ape2Used: ape2Used,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [adminUser, breedingAccount],
      }
    )
  } else {
    console.log('ape2', ape2.toBase58())
    console.log('ape2 from rental', rentAccount.ape.toBase58())

    return program.instruction.startBreedingRental(
      vault1Bump,
      ape1UsedBump,
      ape2UsedBump,
      rentingRole,
      {
        accounts: {
          configAccount: configAddress,
          breedingAccount: breedingAccount.publicKey,
          user: user,
          puffToken: puffToken,
          programPuffTokenAccount: programPuffTokenAccount,
          userPuffTokenAccount: userPuffTokenAccount,
          ape1Mint: ape1,
          ape1UserAccount: ape1TokenAccount,
          ape1Vault: vault1,
          ape2Mint: rentAccount.ape,
          rentAccount: rentAccountPubkey,
          rentalUser: rentAccount.authority,
          rentalFeeDepositAccount: nuked.rentalFeeDepositAccount,
          backendUser: adminUser.publicKey,
          ape1Used: ape1Used,
          ape2Used: ape2Used,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [adminUser, breedingAccount],
      }
    )
  }
}
