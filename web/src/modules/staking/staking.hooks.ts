import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { Program, Provider } from '@project-serum/anchor'
import { SacStaking } from '../../../../staking/target/types/sac_staking'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import {
  connection,
  stakingIdl,
  stakingProgramId,
  puffToken,
  livingSacApesCount,
} from '../../config/config'
import * as web3 from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'
import {
  getAssociatedTokenAddress,
  getNftWithMetadata,
  getOrCreateAssociatedTokenAddressInstruction,
  getRoleOfNft,
  getTokenAccount,
} from '../../utils/solUtils'
import { useAsync, useAsyncFn, useAsyncRetry } from 'react-use'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import toast from 'react-hot-toast'
import asyncBatch from 'async-batch'
import axios from 'axios'
import { nukedCollection, sacCollection } from '../../config/collectonsConfig'
import { getMetadataForMint } from '../../utils/splUtils'
import { trpc } from '../../utils/trpc'

export function useStaking(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<SacStaking & { metadata: { address: string } }> | null,
  refetchStakeAccount: () => void
) {
  return useAsyncFn(
    async (address: string) => {
      if (
        !provider ||
        !wallet ||
        !wallet.publicKey ||
        !program ||
        !wallet.signTransaction
      )
        return

      console.log('staking mint ', address)

      const nftToken = new PublicKey(address)

      let [userStakeAccount, bump] = await PublicKey.findProgramAddress(
        [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
        program.programId
      )
      let [tokenVaultAcount, tokenVaultAcountBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('sac'), nftToken.toBuffer()],
          program.programId
        )
      const userNftAccount = await getAssociatedTokenAddress(
        nftToken,
        wallet.publicKey
      )

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        {
          mint: nftToken,
        }
      )

      const userTokenAccount = (await getTokenAccount(
        connection,
        nftToken,
        wallet.publicKey
      ))!

      console.log(
        'tokenAccounts',
        tokenAccounts.value.map((t) => ({ ...t, pubkey: t.pubkey.toBase58() }))
      )

      console.log('userNftAccount', userNftAccount.toBase58())

      try {
        const tx = await program.rpc.startStaking(
          new anchor.BN(bump) as any,
          new anchor.BN(tokenVaultAcountBump) as any,
          wallet.publicKey,
          nftToken,
          {
            accounts: {
              stakeAccount: userStakeAccount,
              user: wallet.publicKey,
              systemProgram: SystemProgram.programId,
              clock: web3.SYSVAR_CLOCK_PUBKEY,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              vaultTokenAccount: tokenVaultAcount,
              userTokenAccount: userTokenAccount.pubkey,
              nftMint: nftToken,
              rent: web3.SYSVAR_RENT_PUBKEY,
            },
          }
        )
        await connection.confirmTransaction(tx, 'recent').then((res) => {
          refetchStakeAccount()
        })

        /*   const revealRes = await axios.post('/api/staking/startStaking', {
          user: wallet.publicKey?.toBase58(),
          nft: nft.toBase58(),
        })

        const transaction = web3.Transaction.from(
          Buffer.from(revealRes.data.trans)
        )
        console.log('reveal transaction', transaction)

        await wallet.signTransaction(transaction) */

        /*  const simulatedTrans = await provider.connection.simulateTransaction(
          transaction
        )
        console.log('simulatedTrans', simulatedTrans) */

        /* console.log(
          'transaction.signatures',
          transaction.signatures.map((s) => ({
            ...s,
            publicKey: s.publicKey.toBase58(),
          }))
        )

        const serial = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })
        const tx = await connection.sendRawTransaction(serial)

        await connection.confirmTransaction(tx, 'recent')
        await sleep(3000);
 */
      } catch (err) {
        const transError = err as web3.SendTransactionError
        toast.error(transError.message)
        console.error('Transaction error: ', err)

        Promise.reject(err)
      }
    },
    [wallet]
  )
}

export function useStakeAll(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<SacStaking & { metadata: { address: string } }> | null,
  refetchStakeAccount: () => void
): [any, any] {
  return useAsyncFn(
    async (addresses: string[]) => {
      if (
        !provider ||
        !wallet ||
        !wallet.publicKey ||
        !program ||
        !wallet.signTransaction
      )
        return

      const instructions: web3.TransactionInstruction[] = []

      for (const address of addresses) {
        console.log('staking mint ', address)

        const nftToken = new PublicKey(address)

        let [userStakeAccount, bump] = await PublicKey.findProgramAddress(
          [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
          program.programId
        )
        let [tokenVaultAcount, tokenVaultAcountBump] =
          await web3.PublicKey.findProgramAddress(
            [Buffer.from('sac'), nftToken.toBuffer()],
            program.programId
          )
        const userNftAccount = await getAssociatedTokenAddress(
          nftToken,
          wallet.publicKey
        )

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          wallet.publicKey,
          {
            mint: nftToken,
          }
        )

        const userTokenAccount = (await getTokenAccount(
          connection,
          nftToken,
          wallet.publicKey
        ))!

        console.log(
          'tokenAccounts',
          tokenAccounts.value.map((t) => ({
            ...t,
            pubkey: t.pubkey.toBase58(),
          }))
        )

        console.log('userNftAccount', userNftAccount.toBase58())

        instructions.push(
          program.instruction.startStaking(
            new anchor.BN(bump) as any,
            new anchor.BN(tokenVaultAcountBump) as any,
            wallet.publicKey,
            nftToken,
            {
              accounts: {
                stakeAccount: userStakeAccount,
                user: wallet.publicKey,
                systemProgram: SystemProgram.programId,
                clock: web3.SYSVAR_CLOCK_PUBKEY,
                tokenProgram: spl.TOKEN_PROGRAM_ID,
                vaultTokenAccount: tokenVaultAcount,
                userTokenAccount: userTokenAccount.pubkey,
                nftMint: nftToken,
                rent: web3.SYSVAR_RENT_PUBKEY,
              },
            }
          )
        )
      }


      try {
        const recentBlockhash = await connection.getRecentBlockhash()
        const transaction = new web3.Transaction({
          feePayer: wallet.publicKey,
          recentBlockhash: recentBlockhash.blockhash,
        })
        const tx = await wallet.sendTransaction(transaction, connection)
        await connection.confirmTransaction(tx, 'recent').then((res) => {
          refetchStakeAccount()
        })
      } catch (err) {
        const transError = err as web3.SendTransactionError
        toast.error(transError.message)
        console.error('Transaction error: ', err)

        Promise.reject(err)
      }
    },
    [wallet]
  )
  return useAsyncFn(
    async (address: string) => {
      console.log('in stakeAll', address)

      if (
        !provider ||
        !wallet ||
        !wallet.publicKey ||
        !program ||
        !wallet.signTransaction ||
        !wallet.sendTransaction
      )
        return

      try {
        /* let [userStakeAccount, bump] = await web3.PublicKey.findProgramAddress(
          [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
          program.programId
        )

        const userPuffTokenCreation =
          await getOrCreateAssociatedTokenAddressInstruction(
            puffToken,
            wallet.publicKey,
            connection
          )

        const tx = await program.rpc.withdraw(
          new anchor.BN(programPuffTokenAccountBump) as any,
          {
            accounts: {
              stakeAccount: userStakeAccount,
              user: wallet.publicKey,
              systemProgram: web3.SystemProgram.programId,
              clock: web3.SYSVAR_CLOCK_PUBKEY,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              nftMint: nftToken,
              puffToken: puffToken,
              programPuffTokenAccount: programPuffTokenAccount,
              userPuffTokenAccount:
                userPuffTokenCreation.associatedTokenAddress,
            },
            instructions: [...userPuffTokenCreation.instructions],
          }
        )

        await connection.confirmTransaction(tx, 'recent')
        const withDrawRes = await connection.getParsedConfirmedTransaction(tx) */

        let remaining = 7
        let startPos = 0

        while (remaining > 0) {
          const withdrawRes = await axios.post('/api/staking/stakeAll', {
            user: wallet.publicKey?.toBase58(),
            startPos,
          })

          const transaction = web3.Transaction.from(
            Buffer.from(withdrawRes.data.trans)
          )
          console.log('withdraw transaction', transaction)

          await wallet.signTransaction(transaction)

          const serial = transaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
          })

          /* const simulatedTrans = await provider.connection.simulateTransaction(
            transaction
          )
           console.log('simulatedTrans', simulatedTrans) */

          const tx = await connection.sendRawTransaction(serial)
          await connection.confirmTransaction(tx, 'confirmed')
          const withDrawRes = await connection.getTransaction(tx)
          const addToPos =
            withdrawRes.data.remaining < 0 ? withdrawRes.data.remaining + 6 : 6
          toast.success(
            `$PUFF successfully withdrawn for accounts ${startPos + 1} - ${
              startPos + addToPos
            }`
          )
          console.log('withDrawRes', withDrawRes)
          remaining = withdrawRes.data.remaining
          startPos += 6
        }
      } catch (err) {
        toast.error('error at withdraw: ', (err as any).message)
        console.error('Transaction error: ', err)

        Promise.reject(err)
      }
    },
    [wallet]
  )
}

export function useWithdrawAll(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<SacStaking & { metadata: { address: string } }> | null
): [any, any] {
  return useAsyncFn(
    async (address: string) => {
      console.log('in handleWithDraw', address)

      if (
        !provider ||
        !wallet ||
        !wallet.publicKey ||
        !program ||
        !wallet.signTransaction ||
        !wallet.sendTransaction
      )
        return

      try {
        /* let [userStakeAccount, bump] = await web3.PublicKey.findProgramAddress(
          [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
          program.programId
        )

        const userPuffTokenCreation =
          await getOrCreateAssociatedTokenAddressInstruction(
            puffToken,
            wallet.publicKey,
            connection
          )

        const tx = await program.rpc.withdraw(
          new anchor.BN(programPuffTokenAccountBump) as any,
          {
            accounts: {
              stakeAccount: userStakeAccount,
              user: wallet.publicKey,
              systemProgram: web3.SystemProgram.programId,
              clock: web3.SYSVAR_CLOCK_PUBKEY,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              nftMint: nftToken,
              puffToken: puffToken,
              programPuffTokenAccount: programPuffTokenAccount,
              userPuffTokenAccount:
                userPuffTokenCreation.associatedTokenAddress,
            },
            instructions: [...userPuffTokenCreation.instructions],
          }
        )

        await connection.confirmTransaction(tx, 'recent')
        const withDrawRes = await connection.getParsedConfirmedTransaction(tx) */

        let remaining = 6
        let startPos = 0

        while (remaining > 0) {
          const withdrawRes = await axios.post('/api/staking/withdrawAll', {
            user: wallet.publicKey?.toBase58(),
            startPos,
          })

          const transaction = web3.Transaction.from(
            Buffer.from(withdrawRes.data.trans)
          )
          console.log('withdraw transaction', transaction)

          await wallet.signTransaction(transaction)

          const serial = transaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
          })

          /* const simulatedTrans = await provider.connection.simulateTransaction(
            transaction
          )
           console.log('simulatedTrans', simulatedTrans) */

          const tx = await connection.sendRawTransaction(serial)
          await connection.confirmTransaction(tx, 'confirmed')
          const withDrawRes = await connection.getTransaction(tx)
          const addToPos =
            withdrawRes.data.remaining < 0 ? withdrawRes.data.remaining + 6 : 6
          toast.success(
            `$PUFF successfully withdrawn for accounts ${startPos + 1} - ${
              startPos + addToPos
            }`
          )
          console.log('withDrawRes', withDrawRes)
          remaining = withdrawRes.data.remaining
          startPos += 6
        }
      } catch (err) {
        toast.error('error at withdraw: ', (err as any).message)
        console.error('Transaction error: ', err)

        Promise.reject(err)
      }
    },
    [wallet]
  )
}

export function useWithdraw(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<SacStaking & { metadata: { address: string } }> | null
): [any, any] {
  return useAsyncFn(
    async (address: string) => {
      console.log('in handleWithDraw', address)

      if (
        !provider ||
        !wallet ||
        !wallet.publicKey ||
        !program ||
        !wallet.signTransaction ||
        !wallet.sendTransaction
      )
        return

      const nftToken = new PublicKey(address)

      let [userStakeAccount, bump] = await PublicKey.findProgramAddress(
        [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
        program.programId
      )
      let [tokenVaultAcount, tokenVaultAcountBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('sac'), nftToken.toBuffer()],
          program.programId
        )

      let [programPuffTokenAccount, programPuffTokenAccountBump] =
        await web3.PublicKey.findProgramAddress(
          [utf8.encode('puff')],
          program.programId
        )
      console.log('userStakeAccount', userStakeAccount.toBase58())
      console.log('tokenVaultAcount', tokenVaultAcount.toBase58())
      console.log('programPuffTokenAccount', programPuffTokenAccount.toBase58())

      try {
        /* let [userStakeAccount, bump] = await web3.PublicKey.findProgramAddress(
          [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
          program.programId
        )

        const userPuffTokenCreation =
          await getOrCreateAssociatedTokenAddressInstruction(
            puffToken,
            wallet.publicKey,
            connection
          )

        const tx = await program.rpc.withdraw(
          new anchor.BN(programPuffTokenAccountBump) as any,
          {
            accounts: {
              stakeAccount: userStakeAccount,
              user: wallet.publicKey,
              systemProgram: web3.SystemProgram.programId,
              clock: web3.SYSVAR_CLOCK_PUBKEY,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              nftMint: nftToken,
              puffToken: puffToken,
              programPuffTokenAccount: programPuffTokenAccount,
              userPuffTokenAccount:
                userPuffTokenCreation.associatedTokenAddress,
            },
            instructions: [...userPuffTokenCreation.instructions],
          }
        )

        await connection.confirmTransaction(tx, 'recent')
        const withDrawRes = await connection.getParsedConfirmedTransaction(tx) */

        const withdrawRes = await axios.post('/api/staking/withdraw', {
          user: wallet.publicKey?.toBase58(),
          nft: nftToken.toBase58(),
        })

        const transaction = web3.Transaction.from(
          Buffer.from(withdrawRes.data.trans)
        )
        console.log('withdraw transaction', transaction)

        await wallet.signTransaction(transaction)

        const serial = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })

        /* const simulatedTrans = await provider.connection.simulateTransaction(
          transaction
        )
         console.log('simulatedTrans', simulatedTrans) */
        const tx = await connection.sendRawTransaction(serial)
        await connection.confirmTransaction(tx, 'confirmed')
        const withDrawRes = await connection.getTransaction(tx)
        toast.success('$PUFF successfully withdrawn')
        console.log('withDrawRes', withDrawRes)
      } catch (err) {
        toast.error('error at withdraw: ', (err as any).message)
        console.error('Transaction error: ', err)

        Promise.reject(err)
      }
    },
    [wallet]
  )
}

export function useUnstake(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<SacStaking & { metadata: { address: string } }> | null,
  refetchStakeAccounts: () => void
) {
  return useAsyncFn(
    async (address: string) => {
      if (
        !provider ||
        !wallet ||
        !wallet.publicKey ||
        !program ||
        !wallet.signTransaction
      )
        return

      const nftToken = new PublicKey(address)

      let [userStakeAccount, bump] = await PublicKey.findProgramAddress(
        [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
        program.programId
      )
      let [tokenVaultAcount, tokenVaultAcountBump] =
        await web3.PublicKey.findProgramAddress(
          [Buffer.from('sac'), nftToken.toBuffer()],
          program.programId
        )

      let [programPuffTokenAccount, programPuffTokenAccountBump] =
        await web3.PublicKey.findProgramAddress(
          [utf8.encode('puff')],
          program.programId
        )
      console.log('userStakeAccount', userStakeAccount.toBase58())
      console.log('tokenVaultAcount', tokenVaultAcount.toBase58())
      console.log('programPuffTokenAccount', programPuffTokenAccount.toBase58())

      try {
        let [userStakeAccount, bump] = await web3.PublicKey.findProgramAddress(
          [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
          program.programId
        )

        const userPuffTokenCreation =
          await getOrCreateAssociatedTokenAddressInstruction(
            puffToken,
            wallet.publicKey,
            connection
          )

        const userNftAccount =
          await getOrCreateAssociatedTokenAddressInstruction(
            nftToken,
            wallet.publicKey,
            connection
          )

        const userTokenAccount = await connection.getParsedTokenAccountsByOwner(
          wallet.publicKey,
          {
            mint: nftToken,
          }
        )

        /* const tx = await program.rpc.unstake(
          new anchor.BN(programPuffTokenAccountBump) as any,
          {
            accounts: {
              stakeAccount: userStakeAccount,
              user: wallet.publicKey,
              systemProgram: web3.SystemProgram.programId,
              clock: web3.SYSVAR_CLOCK_PUBKEY,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              nftMint: nftToken,
              userTokenAccount: userNftAccount.associatedTokenAddress,
              vaultTokenAccount: tokenVaultAcount,
              puffToken: puffToken,
              programPuffTokenAccount: programPuffTokenAccount,
              userPuffTokenAccount:
                userPuffTokenCreation.associatedTokenAddress,
            },
            instructions: [
              ...userPuffTokenCreation.instructions,
              ...userNftAccount.instructions,
            ],
          }
        )

        await connection.confirmTransaction(tx, 'recent').then(() => {
          refetchStakeAccounts()
        }) */

        const unstakeRes = await axios.post('/api/staking/unstake', {
          user: wallet.publicKey?.toBase58(),
          nft: nftToken.toBase58(),
        })

        const transaction = web3.Transaction.from(
          Buffer.from(unstakeRes.data.trans)
        )
        console.log('unstake transaction', transaction)

        await wallet.signTransaction(transaction)

        const serial = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })

        /* const simulatedTrans = await provider.connection.simulateTransaction(
          transaction
        )
        console.log('simulatedTrans', simulatedTrans) */

        const tx = await connection.sendRawTransaction(serial)
        await connection.confirmTransaction(tx, 'confirmed')
        const withDrawRes = await connection.getTransaction(tx)
        console.log('unstake', withDrawRes)

        toast.success('successfully unstaked your ape')
        return { nft: address }
      } catch (err) {
        toast.error(`error at unstake ${(err as any).message}`)
        console.error('error at unstake', err)
        Promise.reject(err)
      }
    },
    [wallet]
  )
}

export function useStakingAccounts(wallet: WalletContextState) {
  return useAsyncRetry(async () => {
    try {
      if (
        !wallet ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !wallet.signTransaction
      )
        return null

      const provider = new Provider(connection, wallet as any, {
        commitment: 'recent',
      })
      const program = new Program(stakingIdl, stakingProgramId, provider)

      const rawStakingAccounts = (
        await program.account.stakeAccount.all([
          {
            memcmp: {
              offset: 8,
              bytes: wallet.publicKey?.toBase58(),
            },
          },
        ])
      ).filter(
        (s) => s.account.authority.toBase58() === wallet.publicKey?.toBase58()
      )

      console.log('rawStakingAccounts', rawStakingAccounts)

      const nfts = await asyncBatch(
        rawStakingAccounts,
        async (rawStakingAccount, taskIndex: number, workerIndex: number) => {
          /*   console.log('rawStakingAccounts', rawStakingAccounts) */
          const nftToken = rawStakingAccount.account.token

          let [userStakeAccount, bump] = await PublicKey.findProgramAddress(
            [nftToken.toBuffer(), provider.wallet.publicKey.toBuffer()],
            program.programId
          )

          const fetchedAccount = await program.account.stakeAccount.fetch(
            userStakeAccount
          )
          const metadata = await getNftWithMetadata(nftToken)

          return { nft: metadata, stakeAccount: fetchedAccount }
        },
        2
      )

      return nfts.sort((a, b) => {
        if (!a!.nft.name.includes('#') || !b!.nft.name.includes('#')) return 1
        return (
          Number(a!.nft.name.split('#')[1]) - Number(b.nft.name.split('#')[1])
        )
      })
    } catch (e) {
      console.error('e in fetch stakingAccounts', e)
    }
  }, [wallet])
}
