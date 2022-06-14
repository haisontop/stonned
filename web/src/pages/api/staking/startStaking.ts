import { Program, Provider, web3 } from '@project-serum/anchor'
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import {
  connection,
  evolutionIdl,
  evolutionProgramId,
  stakingIdl,
  stakingProgramId,
} from '../../../config/config'
import prisma from '../../../lib/prisma'
import * as spl from '@solana/spl-token'

const metadataProgram = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const privateKey = process.env.PROGRAM_SIGNER as string
const backendUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(privateKey))
)
console.log('backendUser', backendUser.publicKey.toBase58())

const provider = new Provider(connection, backendUser as any, {
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
      /*  const revealRequest = z
        .object({
          user: z.string(),
          nft: z.string(),
        })
        .parse(req.body)

      const nft = new PublicKey(revealRequest.nft)
      const user = new PublicKey(revealRequest.user)

      let [userStakeAccount, bump] = await PublicKey.findProgramAddress(
        [nft.toBuffer(), user.toBuffer()],
        program.programId
      )
      let [tokenVaultAcount, tokenVaultAcountBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('sac'), nft.toBuffer()],
          program.programId
        )
      const userNftAccount = await getAssociatedTokenAddress(nft, user)

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        user,
        {
          mint: nft,
        }
      )

      const userTokenAccount = tokenAccounts.value.find(
        (t) => t.account.data.parsed.info.tokenAmount.uiAmount
      )

      console.log(
        'tokenAccounts',
        tokenAccounts.value.map((t) => ({ ...t, pubkey: t.pubkey.toBase58() }))
      )

      console.log('userNftAccount', userNftAccount.toBase58())

      const role = await getRoleOfNft(nft, user, connection)

      console.log('role', role)

      const startStakingInstr = await program.instruction.startStaking(
        bump,
        tokenVaultAcountBump,
        user,
        nft,
        role,
        {
          accounts: {
            stakeAccount: userStakeAccount,
            user: user,
            systemProgram: SystemProgram.programId,
            clock: web3.SYSVAR_CLOCK_PUBKEY,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            vaultTokenAccount: tokenVaultAcount,
            userTokenAccount: userTokenAccount?.pubkey!,
            nftMint: nft,
            rent: web3.SYSVAR_RENT_PUBKEY,
            wallet: backendUser.publicKey,
          },
        }
      )

      const recentBlockhash = await connection.getRecentBlockhash()
      const transaction = new web3.Transaction({
        feePayer: user,
        recentBlockhash: recentBlockhash.blockhash,
      }).add(startStakingInstr)

      await transaction.partialSign(backendUser) 

      res.json({
        trans: transaction.serialize({ requireAllSignatures: false }),
      }) */

      res.json({ success: true })

      break

    default:
      res.status(404)
      break
  }
}
