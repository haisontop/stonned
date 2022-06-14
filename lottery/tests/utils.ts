import * as web3 from '@solana/web3.js'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { Program, Wallet } from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import fs from 'fs'
import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider'
import { Lottery } from '../target/types/lottery'
import { stringifyPKsAndBNs } from './publicKeyUtils'
import Reattempt from 'reattempt'

const log = console.log
console.log = function () {
  var args = Array.from(arguments) // ES5
  const newArgs = args.map((a) => stringifyPKsAndBNs(a))
  log.apply(console, newArgs)
}

const lotteryIdl = require('../target/idl/lottery')
export const lotteryProgramId = new PublicKey(lotteryIdl.metadata.address)

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
  connection: Connection,
  dest: web3.PublicKey,
  solAmount?: number
) {
  return await connection.confirmTransaction(
    await connection.requestAirdrop(dest, solToLamports(solAmount ?? 1)),
    'confirmed'
  )
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
  keypairPath?: string
  user?: Keypair
  url?: string
}

export function getAnchorContext(opts: AnchorContextOpts) {
  const { network, user } = opts

  const url = opts.network
    ? {
        devnet: web3.clusterApiUrl(opts.network),
        testnet: web3.clusterApiUrl(opts.network),
        'mainnet-beta':
          'https://late-falling-firefly.solana-mainnet.quiknode.pro/812b7e0ab8d2b7589b67bf72b7f1295563c2ce97/',
      }[opts.network]
    : undefined

  console.log('url', url)

  const adminUser =
    user ?? (opts.keypairPath ? loadKeypair(opts.keypairPath) : undefined)
  const connection = new Connection(
    opts.url ?? url ?? process.env.ANCHOR_PROVIDER_URL!,
    'confirmed'
  )

  const provider = new anchor.Provider(
    connection,
    adminUser ? new anchor.Wallet(adminUser) : ({} as any),
    {
      commitment: 'confirmed',
    }
  )
  anchor.setProvider(provider)

  const program = anchor.workspace.Lottery as Program<Lottery>
  return { adminUser: adminUser!, connection, program, provider }
}

export function setAnchorUser(user: Keypair) {
  const envProvider = anchor.getProvider()
  const provider = new anchor.Provider(
    envProvider.connection,
    new anchor.Wallet(user),
    envProvider.opts
  )
  anchor.setProvider(provider)
}

export async function handleTransaction(
  tx: string,
  connection: Connection,
  opts: {
    showLogs?: boolean
    commitment?: web3.Commitment
  } = {
    showLogs: false,
    commitment: 'confirmed',
  }
) {
  let trial = 0
  await Reattempt.run(
    {
      times: 3,
      delay: 1000,
    },
    async () => {
      trial++
      console.log('trial ', trial)

      await connection.confirmTransaction(tx, opts.commitment)
    }
  )

  const trans = await connection.getTransaction(tx)
  if (opts?.showLogs) {
    console.log('trans logs', trans?.meta?.logMessages)
  }
  return tx
}

export function buildToken(
  mint: PublicKey,
  connection: Connection,
  payer?: web3.Signer
) {
  return new spl.Token(connection, mint, spl.TOKEN_PROGRAM_ID, {} as any)
}

export async function generateUserWithSol(
  connection: Connection,
  amount?: number
) {
  const user = Keypair.generate()
  await airdrop(connection, user.publicKey, amount ?? 1)
  return user
}

export async function getLotteryUserPda(lottery: PublicKey, user: PublicKey) {
  return PublicKey.findProgramAddress(
    [lottery.toBuffer(), user.toBuffer()],
    lotteryProgramId
  )
}

export async function getLotteryPda(user: PublicKey, name: string) {
  return PublicKey.findProgramAddress(
    [user.toBuffer(), Buffer.from(name)],
    lotteryProgramId
  )
}

export async function getPricesVaultPda(lottery: PublicKey) {
  return PublicKey.findProgramAddress(
    [Buffer.from('prices'), lottery.toBuffer()],
    lotteryProgramId
  )
}
