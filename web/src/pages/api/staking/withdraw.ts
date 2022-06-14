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
          nft: z.string(),
        })
        .parse(req.body)

      const nft = new PublicKey(revealRequest.nft)
      const user = new PublicKey(revealRequest.user)

      const collection = (await findCollectionConfig(nft))!

      const puffReward = collection ? await collection.getReward(nft) : 0
      const allReward = collection ? await collection.allReward(nft) : 0

      console.log('reward', puffReward)

      /*

        Role::Chimpion => 173611,
        Role::FourRoles => 347222,
        Role::Sealz => 1643519,
        Role::OneOutOfOne => 1956019,

      */

      /* let userNftTokenAccount = (await getTokenAccount(connection, nft, user))! */

      let [userStakeAccount, bump] = await PublicKey.findProgramAddress(
        [nft.toBuffer(), user.toBuffer()],
        program.programId
      )
      let [tokenVaultAcount, tokenVaultAcountBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('sac'), nft.toBuffer()],
          program.programId
        )

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

      console.log('userStakeAccount', userStakeAccount.toBase58())
      console.log('tokenVaultAcount', tokenVaultAcount.toBase58())
      console.log('programPuffTokenAccount', programPuffTokenAccount.toBase58())

      const withdrawInstr = await program.instruction.withdraw(
        new anchor.BN(programPuffTokenAccountBump) as any,
        new anchor.BN(programAllTokenAccountBump) as any,
        puffReward,
        allReward,
        {
          accounts: {
            stakeAccount: userStakeAccount,
            user: user,
            systemProgram: web3.SystemProgram.programId,
            clock: web3.SYSVAR_CLOCK_PUBKEY,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            nftMint: nft,
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
      transaction.add(withdrawInstr)

      await transaction.partialSign(backendUser)

      res.json({
        trans: transaction.serialize({ requireAllSignatures: false }),
      })

      break

    default:
      res.status(404)
      break
  }
}