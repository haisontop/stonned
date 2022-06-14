import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js'
import {
  heislMachineProgram,
  heislMachineProgramId,
  heislMachineProgramRecent,
} from './heislMachineConfig'
import { Wallet, web3 } from '@project-serum/anchor'
import { connection } from '../../config/config'

export async function getLaunchPda(identifier: string) {
  return PublicKey.findProgramAddress(
    [Buffer.from(identifier)],
    heislMachineProgramId
  )
}

export async function createLaunchInstr(args: {
  identifier: string
  admin: Keypair
  nftCount: number
}) {
  const launchPda = await getLaunchPda(args.identifier)

  const launchMints = web3.Keypair.generate()

  const instr: TransactionInstruction[] = []
  instr.push(
    await SystemProgram.createAccount({
      fromPubkey: args.admin.publicKey,
      newAccountPubkey: launchMints.publicKey,
      space: heislMachineProgram.account.launchMints.size,
      lamports: await connection.getMinimumBalanceForRentExemption(
        heislMachineProgram.account.launchMints.size
      ),
      programId: heislMachineProgramId,
    })
  )

  instr.push(
    await heislMachineProgram.instruction.initLaunch(
      args.identifier,
      args.nftCount,
      {
        accounts: {
          user: args.admin.publicKey,
          launch: launchPda[0],
          launchMints: launchMints.publicKey,
          systemProgram: SystemProgram.programId,
        },
      }
    )
  )

  return { instr, signers: [launchMints] }
}

export async function createResetLaunchInstr(args: {
  identifier: string
  admin: Keypair
  nftCount: number
}) {
  const launchPda = await getLaunchPda(args.identifier)

  const launch = await heislMachineProgramRecent.account.launch.fetch(
    launchPda[0]
  )

  return heislMachineProgram.instruction.resetLaunch(
    args.identifier,
    args.nftCount,
    {
      accounts: {
        user: args.admin.publicKey,
        launch: launchPda[0],
        launchMints: launch.launchMints,
        systemProgram: SystemProgram.programId,
      },
    }
  )
}

export async function createHeislMintInstr(args: {
  launchPub: PublicKey
  launch?: Awaited<
    ReturnType<typeof heislMachineProgramRecent.account.launch.fetch>
  >
  user: PublicKey
  mintId: number
  backendUser: PublicKey
}) {
  const launch =
    args.launch ??
    (await heislMachineProgramRecent.account.launch.fetch(args.launchPub))

  return await heislMachineProgram.instruction.mint(args.mintId, {
    accounts: {
      user: args.user,/* 
      launch: args.launchPub, */
      launchMints: launch.launchMints,
      backendUser: args.backendUser,
      systemProgram: SystemProgram.programId,
    },
  })
}

export async function getHeislMachineLaunch(identifier: string) {
  const launchPda = await getLaunchPda(identifier)
  const launch = await heislMachineProgramRecent.account.launch.fetch(
    launchPda[0]
  )

  const launchMints = await heislMachineProgramRecent.account.launchMints.fetch(
    launch.launchMints
  )

  let alreadyMinted: number[] = []

  launchMints.alreadyMinted = launchMints.alreadyMinted.slice(
    0,
    launchMints.counter
  )

  return {
    launch,
    launchPub: launchPda[0],
    launchMints,
  }
}
