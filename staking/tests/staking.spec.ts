import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { SacStaking } from '../target/types/sac_staking'
import * as web3 from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import * as serum from '@project-serum/common'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAddressInstruction,
} from './solUtils'
import { assert, expect } from 'chai'
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types'

const Pk = web3.PublicKey

console.log('ohla')

export function loadWalletKey(keypair: string): Keypair {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!')
  }
  const loaded = web3.Keypair.fromSecretKey(
    new Uint8Array(
      /* JSON.parse(fs.readFileSync(keypair).toString()) */ require(keypair)
    )
  )
  console.log(`wallet public key: ${loaded.publicKey}`)
  return loaded
}

describe('sac-staking', () => {
  console.log('seas')

  const provider = anchor.Provider.env()

  const preWallet = loadWalletKey(`${process.env.HOME}/config/solana/puff.json`)
  const realWallet = new anchor.Wallet(preWallet)
  console.log('realWallet', realWallet.signTransaction)
  const realProvider = new anchor.Provider(provider.connection, realWallet, {
    commitment: 'recent',
  })

  anchor.setProvider(realProvider)
  const { wallet } = realProvider
  const program = anchor.workspace.SacStaking as Program<SacStaking>
  const connection = new web3.Connection(
    process.env.ANCHOR_PROVIDER_URL,
    'confirmed'
  )

  console.log('ANCHOR_PROVIDER_URL', process.env.ANCHOR_PROVIDER_URL)

  it('initProgram', async () => {
    // Add your test here.

    const user1 = await web3.Keypair.generate()

    console.log('wallet', provider.wallet.publicKey.toBase58())

    const tokenOwner = web3.Keypair.generate()

    console.log('before first airdrop')

    try {
      await airdrop(connection, tokenOwner.publicKey)
      console.log('afert first airdrop')
      await delay(1000)
      await airdrop(connection, wallet.publicKey)
    } catch (e) {
      console.error('e in airdrop', e)
    }

    console.log('3')

    console.log('amount minted')

    const programMeta = web3.Keypair.generate()

    const puffToken = {
      publicKey: new web3.PublicKey(
        'HURAwWV8vK9P4QRiaRcoWc9Mm3vfpdyjGwvVdkCDbpAm'
      ),
    } /* await getOrCreateTestNft(connection, tokenOwner, 9) */

    let [programPuffTokenAccount, programPuffTokenAccountBump] =
      await web3.PublicKey.findProgramAddress(
        [utf8.encode('puff')],
        program.programId
      )

    console.log('programPuffTokenAccount', programPuffTokenAccount.toBase58())
    console.log('programPuffTokenAccountBump', programPuffTokenAccountBump)

    anchor.setProvider(realProvider)

    const realProgram = anchor.workspace.SacStaking as Program<SacStaking>

    console.log(realProgram.provider.wallet.publicKey.toBase58())
    const initProgramTrans = await realProgram.rpc.initProgram(
      new anchor.BN(programPuffTokenAccountBump) as any,
      {
        accounts: {
          programPuffTokenAccount: programPuffTokenAccount,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          puffToken: puffToken.publicKey,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
      }
    )
    await connection.confirmTransaction(initProgramTrans, 'confirmed')

    console.log('initprogram', initProgramTrans)

    const nftToken = await getOrCreateTestNft(connection, tokenOwner)

    const userNftAccount = await nftToken.getOrCreateAssociatedAccountInfo(
      wallet.publicKey
    )

    const mintTransaciton = await nftToken.mintTo(
      userNftAccount.address,
      tokenOwner.publicKey,
      [tokenOwner],
      2
    )
    await puffToken.mintTo(
      programPuffTokenAccount,
      tokenOwner.publicKey,
      [tokenOwner],
      1000 * 1000 * 1000 * 1000
    )

    describe('', () => {
      it('stake', async () => {
        let [userStakeAccount, bump] = await web3.PublicKey.findProgramAddress(
          [nftToken.publicKey.toBuffer(), provider.wallet.publicKey.toBuffer()],
          program.programId
        )

        let [tokenVaultAcount, tokenVaultAcountBump] =
          await web3.PublicKey.findProgramAddress(
            [Buffer.from('sac'), nftToken.publicKey.toBuffer()],
            program.programId
          )

        const wrongUser = web3.Keypair.generate()
        const wrongTokenAccount =
          await nftToken.getOrCreateAssociatedAccountInfo(wrongUser.publicKey)

        enum Role {
          Chimpion = 1,
          FourRoles = 2,
          Sealz = 3,
          OneOutOfOne = 4,
        }

        const tx = await program.rpc.startStaking(
          new anchor.BN(bump) as any,
          new anchor.BN(tokenVaultAcountBump) as any,
          wallet.publicKey,
          nftToken.publicKey,
          Role.Sealz,
          {
            accounts: {
              stakeAccount: userStakeAccount,
              user: wallet.publicKey,
              systemProgram: web3.SystemProgram.programId,
              clock: web3.SYSVAR_CLOCK_PUBKEY,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              vaultTokenAccount: tokenVaultAcount,
              userTokenAccount: userNftAccount.address,
              wallet: wallet.publicKey,
              nftMint: nftToken.publicKey,
              rent: web3.SYSVAR_RENT_PUBKEY,
            },
          }
        )

        await connection.confirmTransaction(tx, 'confirmed')

        const startStakingTransaction = await connection.getTransaction(tx)

        console.log(
          'startStakingTransaction logs',
          startStakingTransaction.meta.logMessages
        )

        const userStakeAccountData = await program.account.stakeAccount.fetch(
          userStakeAccount
        )

        const role = userStakeAccountData.role

        console.log('role', JSON.stringify(role, null, 3))

        console.log('userStakeAccountData', {
          address: userStakeAccount.toBase58(),
          ...userStakeAccountData,
          authority: userStakeAccountData.authority.toBase58(),
        })

        describe('', () => {
          it('withdraw', async () => {
            await delay(10000)
            let [userStakeAccount, bump] =
              await web3.PublicKey.findProgramAddress(
                [
                  nftToken.publicKey.toBuffer(),
                  provider.wallet.publicKey.toBuffer(),
                ],
                program.programId
              )

            const userPuffTokenCreation =
              await getOrCreateAssociatedTokenAddressInstruction(
                puffToken.publicKey,
                wallet,
                connection
              )

            const tx1 = await program.rpc.withdraw(
              new anchor.BN(programPuffTokenAccountBump) as any,
              {
                accounts: {
                  stakeAccount: userStakeAccount,
                  user: wallet.publicKey,
                  systemProgram: web3.SystemProgram.programId,
                  clock: web3.SYSVAR_CLOCK_PUBKEY,
                  tokenProgram: spl.TOKEN_PROGRAM_ID,
                  nftMint: nftToken.publicKey,
                  puffToken: puffToken.publicKey,
                  programPuffTokenAccount: programPuffTokenAccount,
                  userPuffTokenAccount: userPuffTokenCreation.address,
                },
                instructions: [...userPuffTokenCreation.instructions],
              }
            )

            await connection.confirmTransaction(tx1, 'confirmed')

            const withdrawTransaction = await connection.getTransaction(tx1)

            console.log(
              'withdrawTransaction logs',
              withdrawTransaction.meta.logMessages
            )

            const userStakeAccountInfo =
              await program.account.stakeAccount.fetch(userStakeAccount)

            console.log('after withDraw userStakeAccountInfo', {
              ...userStakeAccountInfo,
              lastWithdraw: userStakeAccountInfo.lastWithdraw.toNumber(),
            })

            const userPuffAccount = await puffToken.getAccountInfo(
              userPuffTokenCreation.address
            )
            const userPuffBalance = userPuffAccount.amount.toNumber()

            console.log('balance after withdraw', userPuffBalance)
            expect(userPuffBalance).approximately(1909721, 173611)
          })

          it('unstake', async () => {
            await delay(5000)
            let [userStakeAccount, bump] =
              await web3.PublicKey.findProgramAddress(
                [
                  nftToken.publicKey.toBuffer(),
                  provider.wallet.publicKey.toBuffer(),
                ],
                program.programId
              )

            const userPuffTokenAccountAddress = await getAssociatedTokenAddress(
              puffToken.publicKey,
              wallet
            )

            const tx1 = await program.rpc.unstake(
              new anchor.BN(programPuffTokenAccountBump) as any,
              {
                accounts: {
                  stakeAccount: userStakeAccount,
                  user: wallet.publicKey,
                  systemProgram: web3.SystemProgram.programId,
                  clock: web3.SYSVAR_CLOCK_PUBKEY,
                  tokenProgram: spl.TOKEN_PROGRAM_ID,
                  nftMint: nftToken.publicKey,
                  userTokenAccount: userNftAccount.address,
                  vaultTokenAccount: tokenVaultAcount,
                  puffToken: puffToken.publicKey,
                  programPuffTokenAccount: programPuffTokenAccount,
                  userPuffTokenAccount: userPuffTokenAccountAddress,
                },
              }
            )

            await connection.confirmTransaction(tx1, 'confirmed')
            const unstakeTransaction = await connection.getTransaction(tx1)

            console.log(
              'unstakeTransaction logs',
              unstakeTransaction.meta.logMessages
            )

            console.log('unstake trans', tx1)

            const userPuffAccount = await puffToken.getAccountInfo(
              userPuffTokenAccountAddress
            )
            const userPuffBalance = userPuffAccount.amount.toNumber()
            console.log('balance after unstake', userPuffBalance)
            expect(userPuffBalance).approximately(2777776, 173611)

            /* expect(await program.account.stakeAccount.fetch(userStakeAccount)).throw(
              new Error(`Account does not exist ${userStakeAccount.toString()}`),
            ) */
          })

          /*  it('sleep', async () => {
            await delay(1000000)
          }) */
        })
      })
    })
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
