import { Program, Provider, web3 } from '@project-serum/anchor'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { connection, evolutionIdl, evolutionProgramId } from '../../../config/config'
import {
  getOrCreateAssociatedTokenAddressInstruction,
  getTokenAccount,
} from '../../../utils/solUtils'
import * as spl from '@solana/spl-token'

const metadataProgram = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const backendUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PROGRAM_SIGNER as string))
)
const puffUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PUFF_WALLET as string))
)
console.log('backendUser', backendUser.publicKey.toBase58())

const provider = new Provider(connection, backendUser as any, {
  commitment: 'confirmed',
})
const program = new Program(evolutionIdl, evolutionProgramId, provider)

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

      let [userEvolutionAddress, userEvolutionAccountAddressBump] =
        await web3.PublicKey.findProgramAddress(
          [nft.toBuffer(), user.toBuffer()],
          program.programId
        )

      let [nftVaultAddress, nftVaultAddressBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('sac'), nft.toBuffer()],
          program.programId
        )

      let [metadataAccountAddress, metadataAccountAccountAddressBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('metadata'), metadataProgram.toBuffer(), nft.toBuffer()],
          metadataProgram
        )

      /*  const userNftAccountGetOrCreate =
        await getOrCreateAssociatedTokenAddressInstruction(
          nft,
          user,
          connection
        ) */

     /*  if (userNftAccountGetOrCreate.instructions.length > 0) {
        console.log('nft account must be new created')
      } */

      console.log('reveal', {
        nft: nft.toBase58(),
        /* userNftTokenAccount:
          userNftAccountGetOrCreate.associatedTokenAddress.toBase58(), */
        metadataAccountAddress: metadataAccountAddress.toBase58(),
        nftVaultAddress: nftVaultAddress.toBase58(),
      })

      console.log('nft', nft.toBase58())

      console.log('metadataAccountAddress', metadataAccountAddress.toBase58())

      const revealInstruction = await program.instruction.reveal(
        userEvolutionAccountAddressBump,
        nftVaultAddressBump,
        {
          accounts: {
            user: user,
            nftMint: nft,
            evolutionAccount: userEvolutionAddress,
            userNftAccount: userNftTokenAccount.pubkey,
            vaultNftAccount: nftVaultAddress,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            backendUser: backendUser.publicKey,
            metadataProgram: metadataProgram,
            metadata: metadataAccountAddress,
            metadataUpdateAuthority: puffUser.publicKey,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          },
          /* instructions: [...userNftAccountGetOrCreate.instructions], */
        }
      )
      const recentBlockhash = await connection.getRecentBlockhash()
      const transaction = new web3.Transaction({
        feePayer: user,
        recentBlockhash: recentBlockhash.blockhash,
      }).add(revealInstruction)

      await transaction.partialSign(backendUser)
      await transaction.partialSign(puffUser)

      res.json({
        trans: transaction.serialize({ requireAllSignatures: false }),
      })

      break

    default:
      res.status(404)
      break
  }
}
