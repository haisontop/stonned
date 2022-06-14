import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { Awakening } from '../target/types/awakening'
import {
  generateUserWithSol,
  getAwakeningPda,
  getOrCreateTestToken,
  getTokenAccount,
  getTokenVaultPda,
  loadKeypair,
  loadWallet,
} from './utils'
import { Transaction, PublicKey, Connection } from '@solana/web3.js'
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  getAccount,
} from '@solana/spl-token'
import { expect } from 'chai'

describe('awakening', () => {
  const provider = anchor.AnchorProvider.env()
  const { connection, wallet } = provider
  // Configure the client to use the local cluster.
  anchor.setProvider(provider)

  const program = anchor.workspace.Awakening as Program<Awakening>

  const backendUser = loadKeypair(
    `${process.env.HOME}/config/solana/program-signer.json`
  )

  it('ping', async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc()
    console.log('Your transaction signature', tx)
  })

  it('awakening', async () => {
    // Add your test here.

    const adminUser = await generateUserWithSol(connection, 2)
    const nft = await getOrCreateTestToken({
      connection,
      decimals: 0,
      tokenOwner: adminUser,
    })

    const user = await generateUserWithSol(connection, 2)

    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      nft.address,
      user.publicKey
    )
    await mintTo(
      connection,
      adminUser,
      nft.address,
      userTokenAccount.address,
      adminUser,
      1
    )

    const tokenVaultPda = await getTokenVaultPda(nft.address)
    const awakeningPda = await getAwakeningPda({
      user: user.publicKey,
      mint: nft.address,
    })

    console.log(
      'userTokenAccount',
      await getTokenAccountAmount(connection, userTokenAccount.address)
    )

    const startAwakeningInstr = await program.methods
      .startAwakening()
      .accounts({
        user: user.publicKey,
        awakening: awakeningPda[0],
        mint: nft.address,
        userTokenAccount: userTokenAccount.address,
        vaultTokenAccount: tokenVaultPda[0],
        backendUser: backendUser.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction()

    await provider.sendAndConfirm(new Transaction().add(startAwakeningInstr), [
      user,
      backendUser,
    ])

    let userTokenAmout = await getTokenAccountAmount(
      connection,
      userTokenAccount.address
    )

    console.log('userTokenAccount', userTokenAmout)
    expect(userTokenAmout.toString()).equal('0')

    let vaulTokenAmount = await getTokenAccountAmount(
      connection,
      tokenVaultPda[0]
    )
    console.log('vaultTokenAccount', vaulTokenAmount)
    expect(vaulTokenAmount.toString()).equal('1')

    let awakeningAccount = await program.account.awakening.fetch(
      awakeningPda[0]
    )

    console.log('awakeningAccount', awakeningAccount)

    // reval

    const revealInstr = await program.methods
      .reveal()
      .accounts({
        user: user.publicKey,
        awakening: awakeningPda[0],
        mint: nft.address,
        userTokenAccount: userTokenAccount.address,
        vaultTokenAccount: tokenVaultPda[0],
        backendUser: backendUser.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction()

    await provider.sendAndConfirm(new Transaction().add(revealInstr), [
      user,
      backendUser,
    ])

    userTokenAmout = await getTokenAccountAmount(
      connection,
      userTokenAccount.address
    )

    console.log('userTokenAccount', userTokenAmout)
    expect(userTokenAmout.toString()).equal('1')

    vaulTokenAmount = await getTokenAccountAmount(connection, tokenVaultPda[0])
    console.log('vaultTokenAccount', vaulTokenAmount)
    expect(vaulTokenAmount.toString()).equal('0')

    awakeningAccount = await program.account.awakening.fetchNullable(
      awakeningPda[0]
    )

    expect(awakeningAccount).equal(null)
  })
})

async function getTokenAccountAmount(
  connection: Connection,
  pubkey: PublicKey
) {
  const tokenAccount = await getAccount(connection, pubkey)

  return tokenAccount.amount
}
