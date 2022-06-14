import { Program, Provider, Wallet, web3 } from '@project-serum/anchor'
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import {
  connection,
  ENV,
  evolutionIdl,
  evolutionProgramId,
} from '../../../config/config'
import {
  getOrCreateAssociatedTokenAddressInstruction,
  getTokenAccount,
} from '../../../utils/solUtils'
import * as spl from '@solana/spl-token'
import weighted from 'weighted'
import { getBundlr } from '../../../utils/bundlr'
import reattempt from 'reattempt'
import axios from 'axios'
import { getMetadataForMint } from '../../../utils/splUtils'

const metadataProgram = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const backendUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PROGRAM_SIGNER as string))
)
const puffUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PUFF_WALLET as string))
)

const devWallet = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.DEV_WALLET as string))
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

      console.log('reveal', {
        nft: nft.toBase58(),
        metadataAccountAddress: metadataAccountAddress.toBase58(),
        nftVaultAddress: nftVaultAddress.toBase58(),
      })

      console.log('nft', nft.toBase58())

      console.log('metadataAccountAddress', metadataAccountAddress.toBase58())

      const instructions: TransactionInstruction[] = []

      const evolutionAccount = await program.account.evolutionAccount.fetch(
        userEvolutionAddress
      )

      const updateMetadataRes = await updateMetadata(
        devWallet,
        connection,
        evolutionAccount.token.toBase58(),
        evolutionAccount.isDmt as boolean,
        ENV === 'dev' ? 'devnet' : 'mainnet-beta',
        evolutionAccount.isAyahuasca as boolean
      )

      console.log('updateMetadataRes', updateMetadataRes)

      if (updateMetadataRes) {
        const updateEvolutionRes = await program.instruction.updateEvolution(
          userEvolutionAccountAddressBump as any,
          updateMetadataRes.identifier,
          updateMetadataRes.newRole as any,
          {
            accounts: {
              user: user,
              evolutionAccount: userEvolutionAddress,
              backendUser: backendUser.publicKey,
              nftMint: nft,
              systemProgram: web3.SystemProgram.programId,
            },
          }
        )
        instructions.push(updateEvolutionRes)
      }

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
      instructions.push(revealInstruction)

      const recentBlockhash = await connection.getRecentBlockhash()
      const blockHash = await connection.getLatestBlockhash()
      const transaction = new web3.Transaction({
        feePayer: user,
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight,
      }).add(...instructions)

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

export async function updateMetadata(
  walletKeyPair: Keypair,
  connection: Connection,
  mint: string,
  isDmt: boolean,
  env: web3.Cluster,
  isAyahuasca?: boolean
) {
  console.log('in upload Metadata')

  const onChainMetadata = await getMetadataForMint(mint)
  console.log(
    'updating, name=',
    onChainMetadata.data.name,
    'mint',
    mint,
    'isDMT',
    isDmt,
    isAyahuasca
  )
  const oldMetadataUri = onChainMetadata.data.uri
  const oldMetadataRes = await axios.get(oldMetadataUri)

  const wallet = new Wallet(walletKeyPair)

  const rolesDistribution = {
    normal: {
      None: 0.4,
      Businessman: 0.15,
      Scientist: 0.15,
      Farmer: 0.15,
      Artist: 0.15,
    },
    dmt: {
      None: 0.2,
      Businessman: 0.2,
      Scientist: 0.2,
      Farmer: 0.2,
      Artist: 0.2,
    },
    always: {
      Businessman: 0.25,
      Scientist: 0.25,
      Farmer: 0.25,
      Artist: 0.25,
    },
  }

  const breakdownToUse = isAyahuasca
    ? rolesDistribution.always
    : isDmt
    ? rolesDistribution.dmt
    : rolesDistribution.normal

  console.log('isDmt', isDmt)
  console.log('isAyahuasca', isAyahuasca)
  console.log('breakdownToUse', breakdownToUse)

  const newRole = weighted.select(breakdownToUse)
  console.log('newRole', newRole)

  if ((newRole as any) === 'None') {
    return false
  }

  const metadataToUpdate = oldMetadataRes.data
  for (const attr of metadataToUpdate.attributes) {
    if (attr.trait_type === 'Role') {
      attr.value = newRole
    }
  }

  const metadataBuffer = Buffer.from(JSON.stringify(metadataToUpdate))

  console.log('before bundlr upload')

  const { link, identifier } = await reattempt.run(
    { times: 3, delay: 1000 },
    async () => {
      const bundlr = getBundlr(walletKeyPair)

      const balance = await bundlr.getLoadedBalance()

      console.log('balance', balance.toNumber())

      const cost = await bundlr.utils.getPrice(
        'solana',
        metadataBuffer.byteLength
      )
      console.log('cost', cost.toNumber())

      const needed = cost.minus(balance)

      if (needed.gt(cost)) {
        const tx = await bundlr.fund(needed.multipliedBy(10))

        console.log('tx', tx.id)
      }

      const res = await bundlr.uploader.upload(metadataBuffer)

      return {
        link: `https://arweave.net/${res.data.id}`,
        identifier: res.data.id as string,
      }
    }
  )

  console.log('after bundlr upload')

  return { identifier, newRole }
}
