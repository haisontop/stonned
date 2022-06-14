import { PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'

export function verifySignature(
  address: string,
  signature: number[],
  message: string
) {
  const wallet = new PublicKey(address)
  const encodedMessage = new TextEncoder().encode(message)

  const res = nacl.sign.detached.verify(
    encodedMessage,
    Uint8Array.from(signature),
    wallet.toBytes()
  )

  return res
}
