import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { Breeding } from '../target/types/breeding'
import {
  airdrop,
  createTestTokenAndMint,
  getAnchorContext,
  getOrCreateTestNft,
  getTokenAccount,
  handleTransaction,
  setAnchorUser,
  solToLamports,
} from '../tests/util'
import * as web3 from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import { expect } from 'chai'
import { token } from '@project-serum/anchor/dist/cjs/utils'

let { adminUser, connection, program } = getAnchorContext({
  keypairPath: `${process.env.HOME}/config/solana/nuked.json`,
})

console.log('adminUser', adminUser.publicKey.toBase58())

describe('breeding', () => {
  it('ping', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({})
    console.log('Your transaction signature', tx)
  })

  it('init config', async () => {
    // Add your test here.

    try {
      await airdrop(connection, adminUser.publicKey, 1)
    } catch (e) {
      console.error('e in airdrop', e)
    }

    console.log('program.programId', program.programId.toBase58())

    let [configAddress, configBump] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('sac')],
      program.programId
    )
    /* const configKeypair = Keypair.generate()
    const configAddress = configKeypair.publicKey */

    const fakeCandyMachine = Keypair.generate()

    const tx = await program.rpc.initBreeding(
      configBump,
      fakeCandyMachine.publicKey,
      {
        accounts: {
          configAccount: configAddress,
          user: adminUser.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
      }
    )

    await handleTransaction(tx, connection)

    const configAccount = await program.account.configAccount.fetch(
      configAddress
    )

    /* console.log('configAccount', configAccount) */
    expect(configAccount.counter).equal(0)
  })
})

async function generateUserWithSol(amount?: number) {
  const user = Keypair.generate()
  await airdrop(connection, user.publicKey, amount ?? 1)
  return user
}

async function expectAmount(
  token: spl.Token,
  user: web3.PublicKey,
  amount: number
) {
  const tokenAccountInfo = await token.getOrCreateAssociatedAccountInfo(user)

  expect(tokenAccountInfo.amount.toNumber()).equal(amount)
}

async function startRenting({
  ape,
  rentingAccount,
  user,
}: {
  ape: spl.Token
  rentingAccount: Keypair
  user: Keypair
}) {
  const [vault, vaultBump] = await await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape.publicKey.toBuffer()],
    program.programId
  )

  const apeTokenAccount = await ape.getOrCreateAssociatedAccountInfo(
    user.publicKey
  )

  let [configAddress, configBump] = await getBreedingConfigPda()

  const tx = await program.rpc.startRent(vaultBump, {
    accounts: {
      configAccount: configAddress,
      rentAccount: rentingAccount.publicKey,
      user: user.publicKey,
      apeMint: ape.publicKey,
      apeUserAccount: apeTokenAccount.address,
      apeVault: vault,
      backendUser: adminUser.publicKey,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [user, adminUser, rentingAccount],
  })

  await handleTransaction(tx, connection, { showLogs: false })
}

async function unrent({
  ape,
  rentingAccount,
  user,
}: {
  ape: spl.Token
  rentingAccount: Keypair
  user: Keypair
}) {
  const [vault, vaultBump] = await await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape.publicKey.toBuffer()],
    program.programId
  )

  const apeTokenAccount = await ape.getOrCreateAssociatedAccountInfo(
    user.publicKey
  )

  let [configAddress, configBump] = await getBreedingConfigPda()

  const tx = await program.rpc.unrent(vaultBump, {
    accounts: {
      configAccount: configAddress,
      rentAccount: rentingAccount.publicKey,
      user: user.publicKey,
      apeMint: ape.publicKey,
      apeUserAccount: apeTokenAccount.address,
      apeVault: vault,
      backendUser: adminUser.publicKey,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [user, adminUser],
  })

  await handleTransaction(tx, connection, { showLogs: false })
}

type Await<T> = T extends Promise<infer U> ? U : T

async function startBreeding({
  ape1,
  puffToken,
  breedingAccount,
  ape1TokenAccount,
  puffTokenAccount,
  user,
  ape2,
  ape2TokenAccount,
  rentAccount,
  rentAccountPubkey,
}: {
  ape1: spl.Token
  ape2: spl.Token
  puffToken: spl.Token
  breedingAccount: Keypair
  ape1TokenAccount: spl.AccountInfo
  ape2TokenAccount: spl.AccountInfo
  puffTokenAccount: spl.AccountInfo
  user: Keypair
  rentAccount?: Await<ReturnType<typeof program.account.rentAccount.fetch>>
  rentAccountPubkey?: web3.PublicKey
}) {
  const [vault1, vault1Bump] = await await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape1.publicKey.toBuffer()],
    program.programId
  )

  const [ape1Used, ape1UsedBump] =
    await await web3.PublicKey.findProgramAddress(
      [Buffer.from('apeUsed'), ape1.publicKey.toBuffer()],
      program.programId
    )

  const [vault2, vault2Bump] = await await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape2.publicKey.toBuffer()],
    program.programId
  )

  const [ape2Used, ape2UsedBump] =
    await await web3.PublicKey.findProgramAddress(
      [Buffer.from('apeUsed'), ape2.publicKey.toBuffer()],
      program.programId
    )

  const programPuffAccount = await puffToken.getOrCreateAssociatedAccountInfo(
    adminUser.publicKey
  )

  let [configAddress, configBump] = await getBreedingConfigPda()

  let tx: string
  if (!rentAccount) {
    tx = await program.rpc.startBreeding(
      vault1Bump,
      ape1UsedBump,
      vault2Bump,
      ape2UsedBump,
      {
        accounts: {
          configAccount: configAddress,
          breedingAccount: breedingAccount.publicKey,
          user: user.publicKey,
          puffToken: puffToken.publicKey,
          programPuffTokenAccount: programPuffAccount.address,
          userPuffTokenAccount: puffTokenAccount.address,
          ape1Mint: ape1.publicKey,
          ape1UserAccount: ape1TokenAccount.address,
          ape1Vault: vault1,
          ape2Mint: ape2.publicKey,
          ape2UserAccount: ape2TokenAccount.address,
          ape2Vault: vault2,
          backendUser: adminUser.publicKey,
          ape1Used: ape1Used,
          ape2Used: ape2Used,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [user, adminUser, breedingAccount],
      }
    )
  } else {
    console.log('ape2', ape2.publicKey.toBase58())
    console.log('ape2 from rental', rentAccount.ape.toBase58())

    tx = await program.rpc.startBreedingRental(
      vault1Bump,
      ape1UsedBump,
      ape2UsedBump,
      {
        accounts: {
          configAccount: configAddress,
          breedingAccount: breedingAccount.publicKey,
          user: user.publicKey,
          puffToken: puffToken.publicKey,
          programPuffTokenAccount: programPuffAccount.address,
          userPuffTokenAccount: puffTokenAccount.address,
          ape1Mint: ape1.publicKey,
          ape1UserAccount: ape1TokenAccount.address,
          ape1Vault: vault1,
          ape2Mint: rentAccount.ape,
          rentAccount: rentAccountPubkey,
          rentalUser: rentAccount.authority,
          backendUser: adminUser.publicKey,
          ape1Used: ape1Used,
          ape2Used: ape2Used,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [user, adminUser, breedingAccount],
      }
    )
  }

  await handleTransaction(tx, connection, { showLogs: false })
}

async function breed({
  user,
  ape1,
  ape2,
  breedingAddress,
}: {
  user: Keypair
  ape1: spl.Token
  ape2: spl.Token
  breedingAddress: web3.PublicKey
}) {
  let [configAddress, configBump] = await getBreedingConfigPda()

  const [vault1, vault1Bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape1.publicKey.toBuffer()],
    program.programId
  )
  const [vault2, vault2Bump] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('vault'), ape2.publicKey.toBuffer()],
    program.programId
  )

  const breedingAccount = await program.account.breedingAccount.fetch(
    breedingAddress
  )

  console.log('breedingAccount', breedingAccount)

  console.log('user pub', user.publicKey.toBase58())

  const ape1TokenAccount = await ape1.getOrCreateAssociatedAccountInfo(
    user.publicKey
  )

  const ape2TokenAccount = await ape2.getOrCreateAssociatedAccountInfo(
    (breedingAccount.rentalUser as web3.PublicKey) ?? user.publicKey
  )

  const tx = await program.rpc.breed(vault1Bump, vault2Bump, {
    accounts: {
      configAccount: configAddress,
      breedingAccount: breedingAddress,
      user: user.publicKey,
      ape1Mint: ape1.publicKey,
      ape1UserAccount: ape1TokenAccount.address,
      ape1Vault: vault1,
      ape2Mint: ape2.publicKey,
      ape2UserAccount: ape2TokenAccount.address,
      ape2Vault: vault2,
      backendUser: adminUser.publicKey,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [user, adminUser],
  })

  await handleTransaction(tx, connection, { showLogs: false })
}

async function getBreedingConfigPda() {
  return await web3.PublicKey.findProgramAddress(
    [Buffer.from('sac')],
    program.programId
  )
}
