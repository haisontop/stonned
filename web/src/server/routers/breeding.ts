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
  puffToken,
} from '../../config/config'
import { getBreedingConfigPda } from '../../modules/breeding/breeding.service'
import {
  getRawRoleOfNft,
  getRoleOfNft,
  getTokenAccount,
  getTokenAccountAdressOrCreateTokenAccountInstruction,
  Role,
} from '../../utils/solUtils'
import { mintV2 } from '../../utils/mintV2'
import Reattempt from 'reattempt'
import { createRevealInstruction } from '../../modules/breeding/breeding.utils'
import config from '../../config/config'
import _ from 'lodash'
import prisma from '../../lib/prisma'
import { createTransferInstruction } from '../../utils/splUtils'
import { loadCandyProgramV2 } from '../../utils/candyMachineIntern/candyMachineHelpers'

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

        const anchorProgram = await loadCandyProgramV2(
          {} as any,
          config.solanaEnv,
          config.rpcHost
        )

        const candyMachine = (await anchorProgram.account.candyMachine.fetch(
          nuked.chandyMachineId!
        )) as any

        const itemsAvailable =
          candyMachine.data.itemsAvailable.toNumber() as number

        if (!itemsAvailable) throw new Error('all apes are already rescued')

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
          puffToken,
          puffBurnerWallet
        )!

        const userPuffTokenAccount = await getTokenAccount(
          connection,
          puffToken,
          user
        )!

        const breedingAccount = Keypair.generate()

        console.log('puffToken', puffToken.toBase58())

        const instruction = await createStartBreedingInstruction({
          ape1: ape1Pukey,
          ape2: ape2Pukey,
          rentAccountPubkey: rentingAccountPubkey,
          user: user,
          ape1TokenAccount: ape1TokenAccount?.pubkey!,
          ape2TokenAccount: ape2TokenAccount?.pubkey!,
          adminUser: nukedUser,
          breedingAccount,
          puffToken: puffToken,
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
      rescuePubKey: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        console.log('reveal input', input)

        const user = new PublicKey(input.user)

        const rescuePubKey = new web3.PublicKey(input.rescuePubKey)

        let rescueToMint = await prisma.rescueToMint.findFirst({
          where: {
            rescuePubKey: input.rescuePubKey,
          },
        })

        console.log('found rescueToMint', { rescueToMint })

        const getNukedApeBalance = async (
          mintTx: string,
          deleteEntryIfStillNotFound?: boolean
        ) => {
          const nukedApeBalance = await Reattempt.run(
            { times: 6, delay: 2000 },
            async () => {
              const tx = await connection.getTransaction(mintTx, {
                commitment: 'confirmed',
              })
              const nukedApeBalance = tx?.meta?.postTokenBalances?.find(
                (postTokenBal) =>
                  !!postTokenBal.mint &&
                  postTokenBal.uiTokenAmount.uiAmount === 1
              )

              if (!nukedApeBalance?.mint) {
                console.log('no mint in balance found')
              }

              return nukedApeBalance
            }
          )

          if (!nukedApeBalance?.mint) {
            const rescToMint = await prisma.rescueToMint.findFirst({
              where: { rescuePubKey: input.rescuePubKey },
            })
            if (!rescToMint) {
              await prisma.rescueToMint.create({
                data: {
                  user: user.toBase58(),
                  mintTx: mintTx,
                  rescuePubKey: input.rescuePubKey,
                },
              })
            } else if (deleteEntryIfStillNotFound) {
              await prisma.rescueToMint.delete({
                where: {
                  id: rescToMint.id,
                },
              })
            }
            throw new Error('Reveal failed, no mint in balance, try again!')
          }

          console.log('successfully minted nuked ape', nukedApeBalance.mint)

          return nukedApeBalance
        }

        if (!rescueToMint) {
          const { instructions, signers } = await mintV2(
            nukedUser,
            'mainnet-beta',
            nuked.chandyMachineId,
            nukedUser.publicKey,
            config.rpcHost
          )

          const recentBlockhash = await connection.getRecentBlockhash()

          const mintTrans = new web3.Transaction({
            feePayer: nukedUser.publicKey,
            recentBlockhash: recentBlockhash.blockhash,
          }).add(...instructions)

          let mintTx: string | undefined
          try {
            mintTx = await Reattempt.run({ times: 5, delay: 750 }, async () =>
              connection.sendTransaction(mintTrans, signers)
            )
            await connection.confirmTransaction(mintTx, 'confirmed')
            console.log('successfully minted', mintTx)
          } catch (error: any) {
            console.error(
              'error in mint nft',
              { user: input.user, mintTx },
              (error?.message as string)?.slice(0, 500)
            )
            await prisma.rescueMintError.create({
              data: {
                user: user.toBase58(),
                rescuePubKey: input.rescuePubKey,
                mintTx: mintTx,
              },
            })
          }

          if (!mintTx) {
            throw new Error('Reveal failed, no mintTx, try again!')
          }

          const nukedApeBalance = await getNukedApeBalance(mintTx)

          rescueToMint = await prisma.rescueToMint.create({
            data: {
              user: user.toBase58(),
              mint: nukedApeBalance?.mint,
              mintTx: mintTx,
              rescuePubKey: input.rescuePubKey,
            },
          })

          console.log('created db relation entry', rescueToMint.mint)
        } else if (rescueToMint && !rescueToMint.mint) {
          const nukedApeBalance = await getNukedApeBalance(
            rescueToMint.mintTx,
            true
          )
          rescueToMint = await prisma.rescueToMint.update({
            data: {
              mint: nukedApeBalance.mint,
            },
            where: {
              rescuePubKey: input.rescuePubKey,
            },
          })
        }

        if (!rescueToMint.mint) {
          throw new Error('Reveal failed, no mint in balance, try again!')
        }

        const provider = new Provider(connection, {} as any, {
          commitment: 'confirmed',
        })
        const program = new Program(breedingIdl, breedingProgramId, provider)

        const breedingAccount = await program.account.breedingAccount.fetch(
          rescuePubKey
        )

        const ape1Pubkey = breedingAccount.ape1
        const ape2Pubkey = breedingAccount.ape2

        console.log('apes', { ape1Pukey: ape1Pubkey, ape2Pubkey })

        const userNftAccountCreation =
          await getTokenAccountAdressOrCreateTokenAccountInstruction({
            mint: ape1Pubkey,
            user,
            connection,
          })
        const ape1TokenAccount = userNftAccountCreation.address

        const userNftAccountCreation2 = !breedingAccount.rentalUser
          ? await getTokenAccountAdressOrCreateTokenAccountInstruction({
              mint: ape2Pubkey,
              user,
              connection,
            })
          : await getTokenAccountAdressOrCreateTokenAccountInstruction({
              mint: ape2Pubkey,
              user: breedingAccount.rentalUser as any,
              connection,
              payer: user,
            })

        const ape2TokenAccount = userNftAccountCreation2.address

        console.log('puffToken', puffToken.toBase58())

        const instruction = await createRevealInstruction({
          ape1: ape1Pubkey,
          ape2: ape2Pubkey,
          user: user,
          ape1TokenAccount: ape1TokenAccount,
          ape2TokenAccount: ape2TokenAccount,
          adminUser: nuked.address,
          breedingAccount: rescuePubKey,
        })

        const recentBlockhash = await connection.getRecentBlockhash()
        const transaction = new web3.Transaction({
          feePayer: user,
          recentBlockhash: recentBlockhash.blockhash,
        })

        if (userNftAccountCreation.instructions.length > 0) {
          transaction.add(...userNftAccountCreation.instructions)
        }

        if (userNftAccountCreation2.instructions.length > 0) {
          transaction.add(...userNftAccountCreation2.instructions)
        }

        transaction.add(instruction)

        const transferNftInstructions = await createTransferInstruction({
          from: nukedUser.publicKey,
          to: user,
          mint: new web3.PublicKey(rescueToMint.mint),
          amount: 1,
          payer: user,
          signers: [nukedUser],
        })

        transaction.add(...transferNftInstructions)

        await transaction.partialSign(nukedUser)

        const serial = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })

        return {
          success: true,
          trans: serial.toJSON(),
        }
      } catch (e) {
        console.error('error in reveal rescue', e)
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
