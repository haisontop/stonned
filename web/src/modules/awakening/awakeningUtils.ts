import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { addDays, isBefore } from 'date-fns'
import { connection } from '../../config/config'
import { TOKEN_PROGRAM_ID } from '../../utils/candyMachineIntern/candyMachineConstants'
import { getTokenAccountAdressOrCreateTokenAccountInstruction } from '../../utils/solUtils'
import { awakeningProgram, awakeningProgramId } from './awakeningConfig'

export async function createStartAwakeningInstr(args: {
  user: PublicKey
  mint: PublicKey
  backendUser: PublicKey
}) {
  const userTokenAccountCreation =
    await getTokenAccountAdressOrCreateTokenAccountInstruction({
      mint: args.mint,
      user: args.user,
      connection,
    })

  const tokenVaultPda = await getTokenVaultPda(args.mint)

  const awakeningPda = await getAwakeningPda({
    user: args.user,
    mint: args.mint,
  })

  const startAwakeningInstr = await awakeningProgram.instruction.startAwakening(
    {
      accounts: {
        user: args.user,
        awakening: awakeningPda[0],
        mint: args.mint,
        userTokenAccount: userTokenAccountCreation.address,
        vaultTokenAccount: tokenVaultPda[0],
        backendUser: args.backendUser,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      },
    }
  )

  return [...userTokenAccountCreation.instructions, startAwakeningInstr]
}

export async function createRevealAwakeningInstr(args: {
  user: PublicKey
  awakeningPub: PublicKey
  backendUser: PublicKey
  awakeningAccount?: Awaited<ReturnType<typeof awakeningProgram.account.awakening.fetch>>
}) {
  const awakeningAccount = args.awakeningAccount ??
    await awakeningProgram.account.awakening.fetchNullable(args.awakeningPub)

  if (!awakeningAccount) throw new Error('awakening account not found')

  const startTime = new Date(awakeningAccount.start.toNumber() * 1000)

  /* if (isBefore(new Date(), addDays(startTime, 4)))
    throw new Error('not ready to reveal') */

  const userTokenAccountCreation =
    await getTokenAccountAdressOrCreateTokenAccountInstruction({
      mint: awakeningAccount.mint,
      user: args.user,
      connection,
    })

  const tokenVaultPda = await getTokenVaultPda(awakeningAccount.mint)

  const startAwakeningInstr = await awakeningProgram.instruction.reveal({
    accounts: {
      user: args.user,
      awakening: args.awakeningPub,
      mint: awakeningAccount.mint,
      userTokenAccount: userTokenAccountCreation.address,
      vaultTokenAccount: tokenVaultPda[0],
      backendUser: args.backendUser,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
  })

  return [...userTokenAccountCreation.instructions, startAwakeningInstr]
}

export async function getAwakeningPda({
  mint,
  user,
}: {
  mint: PublicKey
  user: PublicKey
}) {
  return PublicKey.findProgramAddress(
    [mint.toBuffer(), user.toBuffer()],
    awakeningProgramId
  )
}

export async function getTokenVaultPda(mint: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from('vault'), mint.toBuffer()],
    awakeningProgramId
  )
}
