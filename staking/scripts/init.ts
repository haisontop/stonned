import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { SacStaking } from '../target/types/sac_staking'
import * as web3 from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import * as serum from '@project-serum/common'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAddressInstruction,
} from '../tests/solUtils'

const Pk = web3.PublicKey

describe('sac-staking', () => {
  console.log('seas')

  const provider = anchor.Provider.env()

  anchor.setProvider(provider)
  const { connection, wallet } = provider
  const program = anchor.workspace.SacStaking as Program<SacStaking>

  it('initProgram', async () => {
    // Add your test here.
    console.log('programId', program.programId.toBase58())

    const puffToken = {
      publicKey: new web3.PublicKey(
        'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB'
      ),
    }

    let [programPuffTokenAccount, programPuffTokenAccountBump] =
      await web3.PublicKey.findProgramAddress(
        [utf8.encode('puff')],
        program.programId
      )

    const allToken = {
      publicKey: new web3.PublicKey(
        '7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj'
      ),
    }

    let [programAllTokenAccount, programAllTokenAccountBump] =
      await web3.PublicKey.findProgramAddress(
        [utf8.encode('all')],
        program.programId
      )

    console.log('programPuffTokenAccount', programPuffTokenAccount.toBase58())

    console.log('programAllTokenAccount', programAllTokenAccount.toBase58())

    const initProgramTrans = await program.rpc.initProgram(
      new anchor.BN(programPuffTokenAccountBump) as any,
      new anchor.BN(programAllTokenAccountBump) as any,
      {
        accounts: {
          programPuffTokenAccount: programPuffTokenAccount,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          puffToken: puffToken.publicKey,
          allToken: allToken.publicKey,
          programAllTokenAccount: programAllTokenAccount,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
      }
    )
    await connection.confirmTransaction(initProgramTrans, 'confirmed')
  })
})

function solToLamports(sol: number) {
  return sol * 1000000000
}

async function airdrop(connection, dest: web3.PublicKey) {
  return await connection.confirmTransaction(
    await connection.requestAirdrop(dest, solToLamports(1)),
    'confirmed'
  )
}

async function sendSol(connection, from: web3.Keypair, to: web3.PublicKey) {
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: 1, // number of SOL to send
    })
  )

  // Sign transaction, broadcast, and confirm
  return await web3.sendAndConfirmTransaction(connection, transaction, [from])
}

function delay(ms: number) {
  console.log('sleep', ms)

  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getOrCreateTestNft(
  connection: web3.Connection,
  tokenOwner: web3.Keypair,
  decimals?: number
) {
  const token = await spl.Token.createMint(
    connection,
    tokenOwner,
    tokenOwner.publicKey,
    tokenOwner.publicKey,
    decimals ?? 0,
    spl.TOKEN_PROGRAM_ID
  )

  console.log('token', token.publicKey.toBase58())

  return token
}

async function getOrCreatePuffTokenAndMintToProgramm(
  connection: web3.Connection,
  tokenOwner: web3.Keypair
) {
  const token = await spl.Token.createMint(
    connection,
    tokenOwner,
    tokenOwner.publicKey,
    tokenOwner.publicKey,
    0,
    spl.TOKEN_PROGRAM_ID
  )

  console.log('token', token.publicKey.toBase58())

  return token
}
