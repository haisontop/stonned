import { Program, Provider, Wallet, web3 } from '@project-serum/anchor'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import config, {
  connection,
  ENV,
  evolutionIdl,
  evolutionProgramId,
  puffToken as importPufftoken,
  stakingIdl,
  stakingProgramId,
} from '../../../config/config'
import prisma from '../../../lib/prisma'
import {
  findCollectionConfig,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAddressInstruction,
  getRoleOfNft,
  getTokenAccount,
  getTokenAccountAdressOrCreateTokenAccountInstruction,
  Role,
} from '../../../utils/solUtils'
import * as spl from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'

const puffToken =
  ENV === 'dev'
    ? new PublicKey('72cpp36L9rSG8non8rnZxv139rNtcc7xpDyn7wx6rmJw')
    : importPufftoken

const metadataProgram = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const backendUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PROGRAM_SIGNER as string))
)
console.log('backendUser', backendUser.publicKey.toBase58())

const provider = new Provider(connection, new Wallet(backendUser), {
  commitment: 'confirmed',
})
const program = new Program(stakingIdl, stakingProgramId, provider)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
    body,
  } = req

  switch (method) {
    case 'POST':
      console.log('body', body)

      const revealRequest = z
        .object({
          user: z.string(),
          startPos: z.number()
        })
        .parse(req.body)

      const user = new PublicKey(revealRequest.user)

      const rawStakingAccounts = (
        await program.account.stakeAccount.all([
          {
            memcmp: {
              offset: 8,
              bytes: user.toBase58(),
            },
          },
        ])
      ).filter(
        (s) => s.account.authority.toBase58() === user.toBase58()
      )

      const stakingAccounts = rawStakingAccounts.slice(revealRequest.startPos, revealRequest.startPos + 6)

      const remaining = rawStakingAccounts.length - (revealRequest.startPos + 6)

      let [programPuffTokenAccount, programPuffTokenAccountBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('puff')],
          program.programId
        )
      const userPuffTokenAccountCreation =
        await getTokenAccountAdressOrCreateTokenAccountInstruction({
          mint: puffToken,
          user,
          connection,
        })

      let [programAllTokenAccount, programAllTokenAccountBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('all')],
          program.programId
        )

      const userAllTokenAccountCreation =
        await getTokenAccountAdressOrCreateTokenAccountInstruction({
          mint: config.allToken,
          user,
          connection,
        })

      console.log('programPuffTokenAccount', programPuffTokenAccount.toBase58())

      const withdrawInstructions: web3.TransactionInstruction[] = []

      for (const stakingAccount of stakingAccounts) {
        const collection = (await findCollectionConfig(stakingAccount.account.token))!
        const puffReward = collection ? await collection.getReward(stakingAccount.account.token) : 0
        const allReward = collection ? await collection.allReward(stakingAccount.account.token) : 0

        const withdrawInstr = program.instruction.withdraw(
          new anchor.BN(programPuffTokenAccountBump) as any,
          new anchor.BN(programAllTokenAccountBump) as any,
          puffReward,
          allReward,
          {
            accounts: {
              stakeAccount: stakingAccount.publicKey,
              user: user,
              systemProgram: web3.SystemProgram.programId,
              clock: web3.SYSVAR_CLOCK_PUBKEY,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              nftMint: stakingAccount.account.token,
              puffToken: puffToken,
              programPuffTokenAccount: programPuffTokenAccount,
              userPuffTokenAccount: userPuffTokenAccountCreation.address,
              allToken: config.allToken,
              programAllTokenAccount: programAllTokenAccount,
              userAllTokenAccount: userAllTokenAccountCreation.address,
              backendUser: backendUser.publicKey,
            },
          }
        )

        withdrawInstructions.push(withdrawInstr)
      }

      const recentBlockhash = await connection.getRecentBlockhash()
      const transaction = new web3.Transaction({
        feePayer: user,
        recentBlockhash: recentBlockhash.blockhash,
      })
      if (userPuffTokenAccountCreation.instructions.length > 0) {
        transaction.add(...userPuffTokenAccountCreation.instructions)
      }
      if (userAllTokenAccountCreation.instructions.length > 0) {
        transaction.add(...userAllTokenAccountCreation.instructions)
      }
      transaction.add(...withdrawInstructions)

      await transaction.partialSign(backendUser)

      res.json({
        trans: transaction.serialize({ requireAllSignatures: false }),
        remaining
      })

      break

    default:
      res.status(404)
      break
  }
}
