import fs from 'fs'
import Arweave from 'arweave'
import { Keypair } from '@solana/web3.js'
import { bundleAndSignData, createData } from 'arbundles'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
})

export async function arweaveUpload(args: { file: Buffer }) {
  const { file } = args

  let wallet = await arweave.wallets.generate()

  /* const wallet = await arweave.wallets.getWalletFromFile('wallet.json'); */

  // 2. Upload metadata to Arweave

  const metadataRequest = JSON.stringify(args.file)

  const metadataTransaction = await arweave.createTransaction({
    data: metadataRequest,
  })

  metadataTransaction.addTag('Content-Type', 'application/json')

  await arweave.transactions.sign(metadataTransaction, wallet)

  const response = await arweave.transactions.post(metadataTransaction)
  const { id } = response as any

  console.log('response', response);
  
  if(!id) throw new Error('arweave upload failed')

  const url = id ? `https://arweave.net/${id}` : undefined
  return url as string
}
