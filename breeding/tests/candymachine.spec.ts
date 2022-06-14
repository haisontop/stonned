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
  loadKeypair,
  setAnchorUser,
  solToLamports,
} from './util'
import * as web3 from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import { expect } from 'chai'
import { publicKey, token } from '@project-serum/anchor/dist/cjs/utils'

let { adminUser, connection, program } = getAnchorContext({
  keypairPath: `${process.env.HOME}/config/solana/nuked.json`,
})

console.log('adminUser', adminUser.publicKey.toBase58())

describe('candy machine mint', () => {
  it('ping', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({})
    console.log('Your transaction signature', tx)
  })

  it.skip('init config', async () => {
    // Add your test here.

    try {
      await airdrop(connection, adminUser.publicKey, 1)
    } catch (e) {
      console.error('e in airdrop', e)
    }

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
    /*  expect(configAccount.counter).equal(0) */
  })

  it('test minting', async () => {
    const user = loadKeypair(
      `${process.env.HOME}/config/solana/sac-treasury.json`
    )

    let { token, tokenAccount } = await createTestTokenAndMint({
      connection,
      tokenOwner: adminUser,
      amount: 1,
    })

    console.log('token', token.publicKey.toBase58())

    const breedingAddress = new web3.PublicKey(
      '8bD5AmWphuTM411YkDBQVaCt9dAG1hgDPUMy72jdtdPP'
    )

    const candyMachine = new anchor.web3.PublicKey(
      '8dTSLSq7o3JPtBUfU2fmY4gQ4EChPXQbQY9qPV5zXxKD'
    ) //Keypair.generate();
    const [creator, creatorBump] = await getCandyMachineCreator(candyMachine)

    const metadata = await getMetadata(token.publicKey)
    const masterEdition = await getMasterEdition(token.publicKey)

    const [configAddress] = await getBreedingConfigPda()

    const tx = await program.rpc.breed(creatorBump, {
      accounts: {
        /* configAccount: configAddress, */
        breedingAccount: breedingAddress,
        user: user.publicKey,
        backendUser: adminUser.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,

        candyMachineProgram: CANDY_MACHINE_PROGRAM_ID,
        candyMachine: candyMachine,
        candyMachineCreator: creator,
        wallet: token.publicKey,
        metadata: metadata,
        mint: token.publicKey,
        mintAuthority: adminUser.publicKey,
        /* updateAuthority: user.publicKey, */
        masterEdition: masterEdition,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
        recentBlockhashes: web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        instructionSysvarAccount: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      signers: [adminUser, user], //transferAuthority
    })
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

type Await<T> = T extends Promise<infer U> ? U : T

async function getBreedingConfigPda() {
  return await web3.PublicKey.findProgramAddress(
    [Buffer.from('sac')],
    program.programId
  )
}

const CANDY_MACHINE_PROGRAM_ID = new web3.PublicKey(
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ'
)
const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

async function getMetadata(
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

async function getMasterEdition(
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

async function getCandyMachineCreator(
  candyMachine: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM_ID
  )
}
