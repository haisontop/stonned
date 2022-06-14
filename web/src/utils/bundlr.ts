import Bundlr from '@bundlr-network/client'
import { Keypair } from '@solana/web3.js'
import config from '../config/config'

export function getBundlr(payer: Keypair) {
  return new Bundlr('https://node1.bundlr.network', 'solana', payer.secretKey, {
    timeout: 60000,
    providerUrl: config.rpcHost,
  })
}
