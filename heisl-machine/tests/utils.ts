import * as web3 from '@solana/web3.js'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { Program, Wallet } from '@project-serum/anchor'
import fs from 'fs'
import { stringifyPKsAndBNs } from './publicKeyUtils'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import reattempt from 'reattempt'
import { expect } from 'chai'

const log = console.log
console.log = function () {
  var args = Array.from(arguments) // ES5
  const newArgs = args.map((a) => stringifyPKsAndBNs(a))
  log.apply(console, newArgs)
}

const idl = require('../target/idl/heisl_machine.json')
const programId = new PublicKey(idl.metadata.address)

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



/* export async function getOrCreateAssociatedTokenAddressInstruction(
  mint: PublicKey,
  owner: PublicKey,
  connection: anchor.web3.Connection
) {
  const address = await getAssociatedTokenAddress(mint, owner)

  const tokenAccount = await connection.getAccountInfo(address)

  let instructions: web3.TransactionInstruction[] = []
  if (!tokenAccount) {
    instructions.push(
      spl.Mint.createAssociatedTokenAccountInstruction(
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
} */


type AnchorContextOpts = {
  network?: web3.Cluster
  keypairPath: string
  user?: Keypair
  url?: string
}

export function getAnchorContext(opts: AnchorContextOpts) {
  /*  const { network, user } = opts

  const url = opts.network
    ? {
        devnet: web3.clusterApiUrl(opts.network),
        testnet: web3.clusterApiUrl(opts.network),
        'mainnet-beta':
          'https://late-falling-firefly.solana-mainnet.quiknode.pro/812b7e0ab8d2b7589b67bf72b7f1295563c2ce97/',
      }[opts.network]
    : undefined

  console.log('url', url)

  const adminUser = user ?? loadKeypair(opts.keypairPath)
  const connection = new Connection(
    opts.url ?? url ?? process.env.ANCHOR_PROVIDER_URL!,
    'confirmed'
  )

  anchor.setProvider({
    connection,
  })

  const provider = new anchor.Provider(
    connection,
    new anchor.Wallet(adminUser),
    {
      commitment: 'confirmed',
    }
  )
  anchor.setProvider(provider)

  const programo = n

  const program = anchor.workspace.Lottery as Program<Auctions> */
  return {}
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
  await reattempt.run(
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

export async function generateUserWithSol(
  connection: Connection,
  amount?: number
) {
  const user = Keypair.generate()
  await airdrop(connection, user.publicKey, amount ?? 1)
  return user
}

export async function getLaunchPda(identifier: string) {
  return PublicKey.findProgramAddress(
    [Buffer.from(identifier)],
    programId
  )
}

export async function getLaunchMintsPda(identifier: string) {
  return PublicKey.findProgramAddress(
    [Buffer.from(identifier), Buffer.from('mints')],
    programId
  )
}


export async function shouldThrow(func: () => any, message: string) {
  let didThrow = false
  try {
    await func()
  } catch (e) {
    didThrow = true
  }

  expect(didThrow).equal(true, message)
}