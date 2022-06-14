import { Program, Provider, Wallet, web3 } from '@project-serum/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import {
  connection,
  ENV,
  allToken as importPufftoken,
  stakingIdl,
  stakingProgramId,
} from '../../../config/config'
import {
  findCollectionConfig,
  getNftWithMetadata,
  getTokenAccount,
  getTokenAccountAdressOrCreateTokenAccountInstruction,
} from '../../../utils/solUtils'
import * as spl from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'
import prisma from '../../../lib/prisma'

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

      let userNftTokenAccount = (await getTokenAccount(connection, nft, user))!

      let [userStakeAccount, bump] = await web3.PublicKey.findProgramAddress(
        [nft.toBuffer(), user.toBuffer()],
        program.programId
      )

      const userPuffTokenCreation =
        await getTokenAccountAdressOrCreateTokenAccountInstruction({
          mint: puffToken,
          user,
          connection,
        })

      console.log('userPuffTokenCreation', {
        ...userPuffTokenCreation,
        address: userPuffTokenCreation.address.toBase58(),
      })

      const userNftAccountCreation =
        await getTokenAccountAdressOrCreateTokenAccountInstruction({
          mint: nft,
          user,
          connection,
        })
      console.log('userNftAccountCreation', {
        ...userNftAccountCreation,
        address: userNftAccountCreation.address.toBase58(),
      })

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
      console.log('userStakeAccount', userStakeAccount.toBase58())
      console.log('tokenVaultAcount', tokenVaultAcount.toBase58())
      console.log('programPuffTokenAccount', programPuffTokenAccount.toBase58())

      const nftWithMeta = await getNftWithMetadata(nft)

      const collection = findCollectionConfig(nftWithMeta)!

      let reward = collection ? await collection.getReward(nft, user) : 0

      if (
        await prisma.banlist.findUnique({
          where: {
            mintAddress: nft.toBase58(),
          },
        })
      )
        reward = 0

      const unstakeInstr = await program.instruction.unstake(
        new anchor.BN(programPuffTokenAccountBump) as any,
        reward,
        {
          accounts: {
            stakeAccount: userStakeAccount,
            user: user,
            systemProgram: web3.SystemProgram.programId,
            clock: web3.SYSVAR_CLOCK_PUBKEY,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            nftMint: nft,
            userTokenAccount: userNftAccountCreation.address,
            vaultTokenAccount: tokenVaultAcount,
            puffToken: puffToken,
            programPuffTokenAccount: programPuffTokenAccount,
            userPuffTokenAccount: userPuffTokenCreation.address,
            backendUser: backendUser.publicKey,
          },
        }
      )

      const recentBlockhash = await connection.getRecentBlockhash()
      const transaction = new web3.Transaction({
        feePayer: user,
        recentBlockhash: recentBlockhash.blockhash,
      })

      if (userPuffTokenCreation.instructions.length > 0) {
        transaction.add(...userPuffTokenCreation.instructions)
      }

      if (userNftAccountCreation.instructions.length > 0) {
        transaction.add(...userNftAccountCreation.instructions)
      }

      transaction.add(unstakeInstr)

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
