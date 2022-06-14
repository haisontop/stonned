import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { BN } from 'bn.js'
import { HeislMachine } from '../target/types/heisl_machine'
import {
  generateUserWithSol,
  getLaunchMintsPda,
  getLaunchPda,
  loadKeypair,
  shouldThrow,
} from './utils'
import asyncBatch from 'async-batch'
import { Keypair, Transaction } from '@solana/web3.js'
import { expect } from 'chai'
import _ from 'lodash'

describe('heisl-machine', () => {
  const provider = anchor.AnchorProvider.env()
  // Configure the client to use the local cluster.
  anchor.setProvider(provider)

  const backendUser = loadKeypair(`${process.env.sol}/program-signer.json`)

  const program = anchor.workspace.HeislMachine as Program<HeislMachine>
  const connection = provider.connection

  it('Ping!', async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc()
    console.log('Your transaction signature', tx)
  })

  it.only('create and mint', async () => {
    // Add your test here.
    const nftCount = 100
    const name = 'Test Mint'

    const user = await generateUserWithSol(connection)

    const launchPda = await getLaunchPda(name)

    const launchMints = Keypair.generate()

    await program.methods
      .initLaunch(name, nftCount)
      .accounts({
        user: user.publicKey,
        launch: launchPda[0],
        systemProgram: anchor.web3.SystemProgram.programId,
        launchMints: launchMints.publicKey,
      })
      .preInstructions([
        await program.account.launchMints.createInstruction(
          launchMints
          /* 21000 * 2 */
        ),
      ])
      .signers([user, launchMints])
      .rpc({ commitment: 'confirmed' })

    let launch = await program.account.launch.fetch(launchPda[0])
    console.log('launch', launch)

    const mintId = 0

    await program.methods
      .mint(mintId)
      .accounts({
        user: user.publicKey,
        launch: launchPda[0],
        launchMints: launch.launchMints,
        systemProgram: anchor.web3.SystemProgram.programId,
        backendUser: backendUser.publicKey,
      })
      .signers([user, backendUser])
      .rpc({ commitment: 'confirmed' })

    let launchMintsAccount = await program.account.launchMints.fetch(
      launchMints.publicKey
    )

    expect(launchMintsAccount.alreadyMinted[0]).equal(mintId)

    launchMintsAccount = await program.account.launchMints.fetch(
      launchMints.publicKey
    )

    console.log('launchMintsAccount', launchMintsAccount)

    await shouldThrow(
      () =>
        program.methods
          .mint(mintId)
          .accounts({
            user: user.publicKey,
            launch: launchPda[0],
            systemProgram: anchor.web3.SystemProgram.programId,
            backendUser: backendUser.publicKey,
            launchMints: launch.launchMints,
          })
          .signers([user, backendUser])
          .rpc({ commitment: 'confirmed' }),
      'not allowed to mint same id again'
    )

    launchMintsAccount = await program.account.launchMints.fetch(
      launchMints.publicKey
    )

    console.log('launchMintsAccount', launchMintsAccount)

    const mintId2 = 20
    await program.methods
      .mint(mintId2)
      .accounts({
        user: user.publicKey,
        launch: launchPda[0],
        systemProgram: anchor.web3.SystemProgram.programId,
        backendUser: backendUser.publicKey,
        launchMints: launch.launchMints,
      })
      .signers([user, backendUser])
      .rpc({ commitment: 'confirmed' })

    launchMintsAccount = await program.account.launchMints.fetch(
      launchMints.publicKey
    )

    expect(launchMintsAccount.alreadyMinted[1]).equal(mintId2)

    console.log('launchMintsAccount', launchMintsAccount)
  })

  it('does not add the same mintId at parallel execution', async () => {
    // Add your test here.
    const nftCount = 100
    const name = 'Test Mint'

    const user = await generateUserWithSol(connection)

    const launchPda = await getLaunchPda(name)

    let launch = await program.account.launch.fetch(launchPda[0])

    const mintId = 10

    await asyncBatch(
      Array.from(Array(200).keys()),
      async (i) => {
        console.log(`${i}: started`)

        const mintId = _.random(0, 4, false)

        try {
          await program.methods
            .mint(mintId)
            .accounts({
              user: user.publicKey,
              launch: launchPda[0],
              systemProgram: anchor.web3.SystemProgram.programId,
              backendUser: backendUser.publicKey,
              launchMints: launch.launchMints,
            })
            .signers([user, backendUser])
            .rpc({ commitment: 'confirmed' })
        } catch (e) {
          console.error(`${i}: error at mint`, e.message)
          if (e.message.includes('AccountDidNotSerialize')) throw e
        }
      },
      100
    ).catch()

    let launchMintsAccount = await program.account.launchMints.fetch(
      launch.launchMints
    )

    const mints = launchMintsAccount.alreadyMinted.slice(0, 5)

    expect(mints.length).equal(_.uniq(mints).length)

    console.log('launchMintsAccount', launchMintsAccount)
  })

  it('can have 10000 mints', async () => {
    // Add your test here.
    const nftCount = 100
    const name = 'Test Mint'

    const user = await generateUserWithSol(connection)

    const launchPda = await getLaunchPda(name)

    let launch = await program.account.launch.fetch(launchPda[0])

    const mintId = 10

    await asyncBatch(
      Array.from(Array(10000).keys()),
      async (i) => {
        console.log(`${i}: started`)

        try {
          await program.methods
            .mint(i)
            .accounts({
              user: user.publicKey,
              launch: launchPda[0],
              systemProgram: anchor.web3.SystemProgram.programId,
              backendUser: backendUser.publicKey,
              launchMints: launch.launchMints,
            })
            .signers([user, backendUser])
            .rpc({ commitment: 'confirmed' })
        } catch (e) {
          console.error(`${i}: error at mint`, e.message)
          if (e.message.includes('AccountDidNotSerialize')) throw e
        }
      },
      20
    ).catch()

    let launchMintsAccount = await program.account.launchMints.fetch(
      launch.launchMints
    )

    console.log('launchMintsAccount', launchMintsAccount)
  })
})
