import * as anchor from '@project-serum/anchor'
import * as web3 from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import { Wallet } from '@project-serum/anchor/dist/cjs/provider'

export async function getOrCreateAssociatedTokenAddressInstruction(
  token: web3.PublicKey,
  wallet: Wallet,
  connection: anchor.web3.Connection,
) {
  const associatedTokenAddress = await getAssociatedTokenAddress(token, wallet)

  const tokenAccount = await connection.getAccountInfo(associatedTokenAddress)

  let instructions: web3.TransactionInstruction[] = []
  if (!tokenAccount) {
    instructions.push(
      spl.Token.createAssociatedTokenAccountInstruction(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        spl.TOKEN_PROGRAM_ID,
        token,
        associatedTokenAddress,
        wallet.publicKey,
        wallet.publicKey,
      ),
    )
  }

  return {
    address: associatedTokenAddress,
    instructions,
  }
}

export async function getAssociatedTokenAddress(token: web3.PublicKey, wallet: Wallet) {
  return await spl.Token.getAssociatedTokenAddress(spl.ASSOCIATED_TOKEN_PROGRAM_ID, spl.TOKEN_PROGRAM_ID, token, wallet.publicKey)
}
