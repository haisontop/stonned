import * as web3 from '@solana/web3.js'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { Program, Wallet } from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import fs from 'fs'
import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider'
import { Breeding } from '../target/types/breeding'

export function loadKeypair(path: string) {
  if (!path || path == '') {
    throw new Error('path is required!')
  }
  console.log('web3.Keypair', web3.Keypair)
  const keypair = web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(path).toString()))
  )
  console.log(`loaded wallet public key: ${keypair.publicKey}`)
  return keypair
}

export function loadWallet(path: string): NodeWallet {
  return new Wallet(loadKeypair(path)) as NodeWallet
}

export async function airdrop(
  connection,
  dest: web3.PublicKey,
  solAmount?: number
) {
  try {
    return await connection.confirmTransaction(
      await connection.requestAirdrop(dest, solToLamports(solAmount ?? 1)),
      'confirmed'
    )
  } catch (e) {
    console.error('error in airdrop')
    throw e
  }
}

export function solToLamports(sol: number): any {
  return web3.LAMPORTS_PER_SOL * sol
}

export async function getOrCreateTestToken({
  connection,
  tokenOwner,
  decimals,
  mint,
}: {
  connection: web3.Connection
  tokenOwner: web3.Keypair
  mint?: web3.PublicKey
  decimals?: number
}) {
  if (mint) {
    return new spl.Token(connection, mint, spl.TOKEN_PROGRAM_ID, tokenOwner)
  }
  const token = await spl.Token.createMint(
    connection,
    tokenOwner,
    tokenOwner.publicKey,
    tokenOwner.publicKey,
    decimals ?? 0,
    spl.TOKEN_PROGRAM_ID
  )

  return token
}

export async function getOrCreateAssociatedTokenAddressInstruction(
  mint: PublicKey,
  owner: PublicKey,
  connection: anchor.web3.Connection
) {
  const address = await getAssociatedTokenAddress(mint, owner)

  const tokenAccount = await connection.getAccountInfo(address)

  let instructions: web3.TransactionInstruction[] = []
  if (!tokenAccount) {
    instructions.push(
      spl.Token.createAssociatedTokenAccountInstruction(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        spl.TOKEN_PROGRAM_ID,
        mint,
        address,
        owner,
        owner
      )
    )
  }

  return {
    address,
    instructions,
  }
}

export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
) {
  return await spl.Token.getAssociatedTokenAddress(
    spl.ASSOCIATED_TOKEN_PROGRAM_ID,
    spl.TOKEN_PROGRAM_ID,
    mint,
    owner
  )
}

export async function getTokenAccount({
  connection,
  mint,
  user,
}: {
  connection: Connection
  mint: PublicKey
  user: PublicKey
}) {
  const userTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    user,
    {
      mint: mint,
    }
  )

  if (userTokenAccounts.value.length === 0) return null
  return (
    userTokenAccounts.value.find(
      (t) => t.account.data.parsed.info.tokenAmount.uiAmount
    ) ?? userTokenAccounts.value[0]
  )
}

export async function getTokenAccountAdressOrCreateTokenAccountInstruction({
  connection,
  mint,
  user,
}: {
  connection: Connection
  mint: PublicKey
  user: PublicKey
}) {
  const userTokenAccount = await getTokenAccount({ connection, mint, user })

  if (userTokenAccount)
    return {
      address: userTokenAccount.pubkey,
      instructions: [],
    }

  return await getOrCreateAssociatedTokenAddressInstruction(
    mint,
    user,
    connection
  )
}

type AnchorContextOpts = {
  network?: web3.Cluster
  keypairPath: string
}

export function getAnchorContext(opts: AnchorContextOpts) {
  const { network } = opts

  const adminUser = loadKeypair(opts.keypairPath)
  const connection = new Connection(
    network ? web3.clusterApiUrl(network) : process.env.ANCHOR_PROVIDER_URL,
    'confirmed'
  )

  console.log('network', (connection as any)._rpcEndpoint)

  const provider = new anchor.Provider(
    connection,
    new anchor.Wallet(adminUser),
    {
      commitment: 'confirmed',
    }
  )
  anchor.setProvider(provider)

  const program = anchor.workspace.Breeding as Program<Breeding>
  return { adminUser, connection, program, provider }
}

export function setAnchorUser(user: Keypair) {
  const envProvider = anchor.getProvider()
  const provider = new anchor.Provider(
    envProvider.connection,
    new anchor.Wallet(user),
    envProvider.opts
  )
  anchor.setProvider(provider)
  const program = anchor.workspace.Breeding as Program<Breeding>
  return program
}

export async function handleTransaction(
  tx: string,
  connection: Connection,
  opts: {
    showLogs: boolean
  } = {
    showLogs: false,
  }
) {
  await connection.confirmTransaction(tx)
  const trans = await connection.getTransaction(tx)
  if (opts?.showLogs) {
    console.log('trans logs', trans.meta.logMessages)
  }
  return tx
}

export async function getOrCreateTestNft({
  connection,
  tokenOwner,
  decimals,
  mint,
}: {
  connection: web3.Connection
  tokenOwner: web3.Keypair
  mint?: PublicKey
  decimals?: number
}) {
  if (mint) {
    return new spl.Token(connection, mint, spl.TOKEN_PROGRAM_ID, tokenOwner)
  }
  const token = await spl.Token.createMint(
    connection,
    tokenOwner,
    tokenOwner.publicKey,
    tokenOwner.publicKey,
    decimals ?? 0,
    spl.TOKEN_PROGRAM_ID
  )

  return token
}

export async function createTestTokenAndMint({
  connection,
  tokenOwner,
  decimals,
  amount,
}: {
  connection: web3.Connection
  tokenOwner: web3.Keypair
  amount: number
  decimals?: number
}) {
  const token = await spl.Token.createMint(
    connection,
    tokenOwner,
    tokenOwner.publicKey,
    tokenOwner.publicKey,
    decimals ?? 0,
    spl.TOKEN_PROGRAM_ID
  )

  const tokenAccount = await token.getOrCreateAssociatedAccountInfo(
    tokenOwner.publicKey
  )

  await token.mintTo(
    tokenAccount.address,
    tokenOwner.publicKey,
    [tokenOwner],
    amount
  )

  return { token, tokenAccount }
}
