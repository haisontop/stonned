import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { Evolution } from '../target/types/evolution'
import * as spl from '@solana/spl-token'
import { Keypair, PublicKey } from '@solana/web3.js'
import * as web3 from '@solana/web3.js'
import { expect } from 'chai'
import {
  airdrop,
  solToLamports,
  getOrCreateTestNft,
  getTokenAccount,
} from './solUtils'

const treasuryWallet = Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      require('fs').readFileSync(
        '/Users/matthiasschaider/config/solana/sac-treasury.json',
        {
          encoding: 'utf-8',
        }
      )
    )
  )
)

const backendSigner = Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      require('fs').readFileSync(
        '/Users/matthiasschaider/config/solana/program-signer.json',
        {
          encoding: 'utf-8',
        }
      )
    )
  )
)

const metadataProgram = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

const programPuffTokenAccountOwner = new PublicKey(
  'DBunqiu2mrnGLLQPm5mcEwnjeTGCLjjUze35vBHpWRWs'
)

let nft = new PublicKey('J5n471HSXQdijbsneBtDExndcoFPJdnZQY2oRgPEZJgc')

console.log('ANCHOR_PROVIDER_URL', process.env.ANCHOR_PROVIDER_URL)

const programPuffTokenUser = describe('evolution', () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider)
  const { wallet, connection } = provider

  console.log('wallet', wallet.publicKey.toBase58())

  const program = anchor.workspace.Evolution as Program<Evolution>

  const adminUser = Keypair.generate()

  it('Is initialized!', async () => {
    // Add your test here.

    console.log('connection', (connection as any)._rpcEndpoint)

    const tx = await program.rpc.initialize({
      accounts: {
        user: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
    })
    console.log('initialize transaction signature', tx)
  })

  it('prepare localnet', async function () {
    const adminUser =
      process.env.ANCHOR_PROVIDER_URL === 'http://localhost:8899'
        ? Keypair.generate()
        : treasuryWallet

    try {
      await airdrop(connection, adminUser.publicKey, solToLamports(1))
    } catch (e) {
      console.error('e in airdrop', e)
    }

    let nftToken =
      process.env.ANCHOR_PROVIDER_URL === 'http://localhost:8899'
        ? await getOrCreateTestNft({
            connection,
            tokenOwner: adminUser,
            decimals: 0,
          })
        : await getOrCreateTestNft({
            connection,
            tokenOwner: adminUser,
            decimals: 0,
            mint: nft,
          })
    let userNftTokenAccount = await nftToken.getOrCreateAssociatedAccountInfo(
      wallet.publicKey
    )

    if (process.env.ANCHOR_PROVIDER_URL === 'http://localhost:8899') {
      await nftToken.mintTo(
        userNftTokenAccount.address,
        adminUser,
        [adminUser],
        1
      )
    }

    nft = nftToken.publicKey

    const puffToken = await getOrCreateTestNft({
      connection,
      tokenOwner: adminUser,
      decimals: 0,
    })

    let userPuffTokenAccount = await puffToken.getOrCreateAssociatedAccountInfo(
      wallet.publicKey
    )

    await puffToken.mintTo(
      userPuffTokenAccount.address,
      adminUser,
      [adminUser],
      1000 * web3.LAMPORTS_PER_SOL
    )

    describe('main tests', () => {
      it('evolution started', async () => {
        // Add your test here.

        let programPuffTokenAccount =
          await puffToken.getOrCreateAssociatedAccountInfo(
            programPuffTokenAccountOwner
          )

        let [userEvolutionAddress, userEvolutionAccountAddressBump] =
          await web3.PublicKey.findProgramAddress(
            [nft.toBuffer(), provider.wallet.publicKey.toBuffer()],
            program.programId
          )

        /* const userNftTokenAccount = await spl.Token.getAssociatedTokenAddress() */

        let [nftVaultAddress, nftVaultAddressBump] =
          await web3.PublicKey.findProgramAddress(
            [Buffer.from('sac'), nft.toBuffer()],
            program.programId
          )

        const tx = await program.rpc.startEvolution(
          userEvolutionAccountAddressBump,
          nftVaultAddressBump,
          false,
          {
            accounts: {
              user: wallet.publicKey,
              nftMint: nft,
              evolutionAccount: userEvolutionAddress,
              programPuffTokenAccount: programPuffTokenAccount.address,
              puffToken: puffToken.publicKey,
              userNftAccount: userNftTokenAccount.address,
              userPuffTokenAccount: userPuffTokenAccount.address,
              vaultNftAccount: nftVaultAddress,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              systemProgram: web3.SystemProgram.programId,
              rent: web3.SYSVAR_RENT_PUBKEY,
              backendUser: backendSigner.publicKey,
            },
            signers: [backendSigner],
          }
        )
        await connection.confirmTransaction(tx)
        console.log('Your transaction signature', tx)

        let nftVaultAccountInfo = await nftToken.getAccountInfo(nftVaultAddress)
        console.log(
          'nftVaultAccountInfo',
          nftVaultAccountInfo.amount.toNumber()
        )
        expect(nftVaultAccountInfo.amount.toNumber()).equal(1)

        userNftTokenAccount = await nftToken.getAccountInfo(
          userNftTokenAccount.address
        )
        console.log(
          'userNftTokenAccount',
          userNftTokenAccount.amount.toNumber()
        )
        expect(userNftTokenAccount.amount.toNumber()).equal(0)

        programPuffTokenAccount = await puffToken.getAccountInfo(
          programPuffTokenAccount.address
        )
        console.log(
          'programPuffTokenAccount',
          programPuffTokenAccount.amount.toNumber()
        )

        userPuffTokenAccount = await puffToken.getAccountInfo(
          userPuffTokenAccount.address
        )
        console.log(
          'userPuffTokenAccount',
          userPuffTokenAccount.amount.toNumber()
        )

        const evolutionAccount = await program.account.evolutionAccount.fetch(
          userEvolutionAddress
        )

        console.log({
          ...evolutionAccount,
          startEvolution: evolutionAccount.startEvolution.toNumber(),
        })

        expect(programPuffTokenAccount.amount.toNumber()).equal(
          333 * web3.LAMPORTS_PER_SOL
        )
        expect(userPuffTokenAccount.amount.toNumber()).equal(
          667 * web3.LAMPORTS_PER_SOL
        )
      })

      it('reveal', async () => {
        // Add your test here.

        let userNftTokenAccount = (await getTokenAccount(
          connection,
          nft,
          wallet.publicKey
        ))!

        let [userEvolutionAddress, userEvolutionAccountAddressBump] =
          await web3.PublicKey.findProgramAddress(
            [nft.toBuffer(), wallet.publicKey.toBuffer()],
            program.programId
          )

        let [nftVaultAddress, nftVaultAddressBump] =
          await web3.PublicKey.findProgramAddress(
            [Buffer.from('sac'), nft.toBuffer()],
            program.programId
          )

        let [metadataAccountAddress, metadataAccountAccountAddressBump] =
          await web3.PublicKey.findProgramAddress(
            [
              Buffer.from('metadata'),
              metadataProgram.toBuffer(),
              nft.toBuffer(),
            ],
            metadataProgram
          )

        console.log('userEvolutionAddress', userEvolutionAddress.toBase58())

        console.log('nft', nft.toBase58())

        console.log('metadataAccountAddress', metadataAccountAddress.toBase58())

        const tx = await program.rpc.reveal({
          userEvolutionAccountAddressBump,
          nftVaultAddressBump,
          accounts: {
            user: wallet.publicKey,
            nftMint: nft,
            evolutionAccount: userEvolutionAddress,
            userNftAccount: userNftTokenAccount.pubkey,
            vaultNftAccount: nftVaultAddress,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            backendUser: wallet.publicKey,
            metadataProgram: metadataProgram,
            metadata: metadataAccountAddress,
            metadataUpdateAuthority: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          },
        })
        await connection.confirmTransaction(tx)
        console.log('Your transaction signature', tx)

        let nftVaultAccountInfo = await nftToken.getAccountInfo(nftVaultAddress)
        console.log(
          'nftVaultAccountInfo',
          nftVaultAccountInfo.amount.toNumber()
        )
        expect(nftVaultAccountInfo.amount.toNumber()).equal(0)

        const userNftTokenAccountInfo = await nftToken.getAccountInfo(
          userNftTokenAccount.pubkey
        )
        console.log(
          'userNftTokenAccount',
          userNftTokenAccountInfo.amount.toNumber()
        )
        expect(userNftTokenAccountInfo.amount.toNumber()).equal(1)
      })

      /* it('test evolution update', () => {
          const tx = await program.rpc.updateMetadataUri({
          accounts: {
            user: wallet.publicKey,
            metadataProgram: metadataProgram,
            metadata: metadataAccountAddress,
            rent: web3.SYSVAR_RENT_PUBKEY,
            updateAuthority: wallet.publicKey,
            beidl: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          },
        })
        console.log('initialize transaction signature', tx) 
      }) */
    })
  })
})
