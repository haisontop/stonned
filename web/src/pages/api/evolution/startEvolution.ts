import { calculate } from '@metaplex/arweave-cost'
import { Program, Provider, Wallet, web3 } from '@project-serum/anchor'
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import axios from 'axios'
import FormData from 'form-data'
import type { NextApiRequest, NextApiResponse } from 'next'
import weighted from 'weighted'
import { z } from 'zod'
import {
  connection,
  ENV,
  evolutionIdl,
  evolutionProgramId,
} from '../../../config/config'
import { sendTransaction, sleep } from '../../../utils/utils'
import fetch from 'node-fetch'
import { getMetadataForMint } from '../../../utils/splUtils'
import reattempt from 'reattempt'
import { getBundlr } from '../../../utils/bundlr'

const backendUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PROGRAM_SIGNER as string))
)
const puffUser = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.PUFF_WALLET as string))
)

console.log('backendUser', backendUser.publicKey.toBase58())
const provider = new Provider(connection, new Wallet(backendUser), {
  commitment: 'confirmed',
})
const program = new Program(evolutionIdl, evolutionProgramId, provider)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { address, name },
    method,
    headers,
  } = req

  switch (method) {
    case 'POST':
      const privateKey = process.env.PROGRAM_SIGNER as string

      console.time('startEvolution')

      const body = z
        .object({
          trans: z.any(),
          nft: z.string(),
          isDMT: z.boolean(),
          user: z.string(),
        })
        .parse(req.body)

      console.log('nft', body.nft)
      console.log('user', body.user)

      const nft = new PublicKey(body.nft)
      const user = new PublicKey(body.user)

      const transaction = Transaction.from(Buffer.from(body.trans))

      console.log('afterTransaction deserializing')

      transaction.partialSign(backendUser)

      const tx = await connection.sendRawTransaction(
        transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })
      )

      console.timeEnd('startEvolution')

      console.log('after trans')

      await reattempt.run({ times: 3 }, async () => {
        await connection.confirmTransaction(tx)
      })

      /* try {
        const updateMetadataRes = await updateMetadata(
          puffUser,
          connection,
          body.nft,
          body.isDMT,
          ENV === 'dev' ? 'devnet' : 'mainnet-beta'
        )

        console.log('after updateMetadataRes', updateMetadataRes)

        if (!updateMetadataRes) {
          console.log('no new role')

          res.json({ success: false })
          return false
        }

        let [userEvolutionAddress, userEvolutionAccountAddressBump] =
          await web3.PublicKey.findProgramAddress(
            [nft.toBuffer(), user.toBuffer()],
            program.programId
          )

        const updateEvolutionRes = await program.rpc.updateEvolution(
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
        
        console.log('updateEvolution tx', updateEvolutionRes)
        await connection.confirmTransaction(updateEvolutionRes, 'recent')
      } catch (e: any) {
        console.timeEnd('startEvolution')
        console.error('error in updateMetadata', e)
      } */

      res.json({ success: true })

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
  env: web3.Cluster
) {
  console.log('in upload Metadata')

  const onChainMetadata = await getMetadataForMint(mint)
  console.log(
    'updating, name=',
    onChainMetadata.data.name,
    'mint',
    mint,
    'isDMT',
    isDmt
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

  const breakdownToUse = isDmt
    ? rolesDistribution.dmt
    : rolesDistribution.normal

  const newRole = weighted.select(breakdownToUse)
  console.log('newRole', newRole)

  if (newRole === 'None') {
    return false
  }

  const metadataToUpdate = oldMetadataRes.data
  for (const attr of metadataToUpdate.attributes) {
    if (attr.trait_type === 'Role') {
      attr.value = newRole
    }
  }

  const metadataBuffer = Buffer.from(JSON.stringify(metadataToUpdate))

  console.log('before arweaveUpload')

  const { link, identifier } = await reattempt.run(
    { times: 3, delay: 1000 },
    async () => {
      const bundlr = getBundlr(walletKeyPair)

      const balance = await bundlr.getLoadedBalance()

      const cost = await bundlr.utils.getPrice(
        'solana',
        metadataBuffer.byteLength
      )

      const needed = cost.minus(balance)

      await bundlr.fund(needed)

      const res = await bundlr.uploader.upload(metadataBuffer)

      return {
        link: `https://arweave.net/${res.data.id}`,
        identifier: res.data.id,
      }

      return await arweaveUpload({
        walletKeyPair,
        connection,
        metadataBuffer,
        metadata: metadataToUpdate,
        env,
      })
    }
  )

  return { identifier, newRole }
}

export async function updateMetadataOld(
  walletKeyPair: Keypair,
  connection: Connection,
  mint: string,
  isDmt: boolean,
  env: web3.Cluster
) {
  console.log('in upload Metadata')

  const onChainMetadata = await getMetadataForMint(mint)
  console.log(
    'updating, name=',
    onChainMetadata.data.name,
    'mint',
    mint,
    'isDMT',
    isDmt
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
  }

  const breakdownToUse = isDmt
    ? rolesDistribution.dmt
    : rolesDistribution.normal

  const newRole = weighted.select(breakdownToUse)
  console.log('newRole', newRole)

  if (newRole === 'None') {
    return false
  }

  const metadataToUpdate = oldMetadataRes.data
  for (const attr of metadataToUpdate.attributes) {
    if (attr.trait_type === 'Role') {
      attr.value = newRole
    }
  }

  const metadataBuffer = Buffer.from(JSON.stringify(metadataToUpdate))

  console.log('before arweaveUpload')

  const { link, identifier } = await reattempt.run(
    { times: 3, delay: 1000 },
    async () =>
      await arweaveUpload({
        walletKeyPair,
        connection,
        metadataBuffer,
        metadata: metadataToUpdate,
        env,
      })
  )

  return { identifier, newRole }
}

const ARWEAVE_UPLOAD_ENDPOINT =
  'https://us-central1-metaplex-studios.cloudfunctions.net/uploadFile'
export const ARWEAVE_PAYMENT_WALLET = new PublicKey(
  '6FKvsq4ydWFci6nGq9ckbjYMtnmaqAoatz5c9XWjiDuS'
)

export async function arweaveUpload({
  walletKeyPair,
  connection,
  metadataBuffer,
  metadata,
  env,
}: {
  walletKeyPair: Keypair
  connection: Connection
  metadataBuffer: Buffer
  metadata: any
  env: web3.Cluster
}) {
  const estimatedManifestSize = estimateManifestSize(['metadata.json'])
  const storageCost = await fetchAssetCostToStore([
    metadataBuffer.length,
    estimatedManifestSize,
  ])
  console.log(
    `lamport cost to store new metadata ${metadata.name}: ${storageCost}`
  )

  const instructions = [
    web3.SystemProgram.transfer({
      fromPubkey: walletKeyPair.publicKey,
      toPubkey: ARWEAVE_PAYMENT_WALLET,
      lamports: storageCost,
    }),
  ]

  const wallet = new Wallet(walletKeyPair)
  const tx = await sendTransaction(
    connection,
    wallet,
    instructions,
    [walletKeyPair],
    true,
    'confirmed'
  )
  console.log(`solana transaction (${env}) for arweave payment:`, tx)
  /*   await sleep(20000) */
  const data = new FormData()
  data.append('transaction', tx['txid'])
  data.append('env', env)
  data.append('file[]', metadataBuffer as any, 'metadata.json') // TODO check if buffer or not

  const result: any = await upload(data, metadata)

  const metadataFile = result.messages?.find(
    (m: any) => m.filename === 'manifest.json'
  )
  if (metadataFile?.transactionId) {
    const link = `https://arweave.net/${metadataFile.transactionId}`
    const identifier = metadataFile.transactionId
    console.log(`File uploaded: ${link}`)
    await sleep(100)
    return { link, identifier }
  } else {
    // @todo improve
    throw new Error(`No transaction ID for upload: ${metadata.name}`)
  }
}

async function fetchAssetCostToStore(fileSizes: number[]) {
  const result = await calculate(fileSizes)
  console.log('Arweave cost estimates:', result)

  return result.solana * web3.LAMPORTS_PER_SOL
}

async function upload(data: FormData, manifest: any) {
  console.log(`trying to upload ${manifest.name}`)
  return await (
    await fetch(ARWEAVE_UPLOAD_ENDPOINT, {
      method: 'POST',
      // @ts-ignore
      body: data,
    })
  ).json()
}

function estimateManifestSize(filenames: string[]) {
  const paths: any = {}

  for (const name of filenames) {
    paths[name] = {
      id: 'artestaC_testsEaEmAGFtestEGtestmMGmgMGAV438',
      ext: 'json',
    }
  }

  const manifest = {
    manifest: 'arweave/paths',
    version: '0.1.0',
    paths,
    index: {
      path: 'metadata.json',
    },
  }

  const data = Buffer.from(JSON.stringify(manifest), 'utf8')
  console.log('Estimated manifest size:', data.length)
  return data.length
}
