import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { Program, Provider } from '@project-serum/anchor'
import { SacStaking } from '../../../../staking/target/types/sac_staking'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import {
  connection,
  stakingIdl,
  stakingProgramId,
  allToken,
  livingNftCount,
} from '../../config/config'
import * as web3 from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'
import {
  getAssociatedTokenAddress,
  getNftWithMetadata,
  getOrCreateAssociatedTokenAddressInstruction,
  getRoleOfNft,
} from '../../utils/solUtils'
import { useAsync, useAsyncFn, useAsyncRetry } from 'react-use'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import toast from 'react-hot-toast'
import asyncBatch from 'async-batch'
import { filterNull, sleep } from '../../utils/utils'
import axios from 'axios'
import { AllStaking } from '../../../../all-staking/target/types/all_staking'

export function useStaking(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<AllStaking & { metadata: { address: string } }> | null,
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

      const userTokenAccount = tokenAccounts.value.find(
        (t) => t.account.data.parsed.info.tokenAmount.uiAmount
      )

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
              userTokenAccount: userTokenAccount?.pubkey!,
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

export function useWithdraw(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<AllStaking & { metadata: { address: string } }> | null
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
        toast.success('$ALL withdrawn')
        console.log('withDrawRes', withDrawRes)
      } catch (err) {
        toast.error('Error at withdraw: ', (err as any).message)
        console.error('Transaction error: ', err)

        Promise.reject(err)
      }
    },
    [wallet]
  )
}

export function useMintList() {
  return useAsyncRetry(async () => {
    const mintList = await axios.get('/api/staking/getMintList')
    return mintList.data
  })
}

export function useUnstake(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<AllStaking & { metadata: { address: string } }> | null,
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
            allToken,
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

        toast.success('Successfully unstaked your NFT')
        return { nft: address }
      } catch (err) {
        toast.error(`Error at unstake ${(err as any).message}`)
        console.error('error at unstake', err)
        Promise.reject(err)
      }
    },
    [wallet]
  )
}

export function useStakingAccounts(wallet: WalletContextState) {
  return useAsyncRetry(async () => {
    const user = wallet.publicKey?.toBase58()
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
              bytes: user!,
            },
          },
        ])
      ).filter((s) => s.account.authority.toBase58() === user)

      console.log('rawStakingAccounts', rawStakingAccounts)

      const nfts = (
        await asyncBatch(
          rawStakingAccounts,
          async (rawStakingAccount, taskIndex: number, workerIndex: number) => {
            try {
              const nftToken = rawStakingAccount.account.token

              const fetchedAccount = rawStakingAccount.account

              const metadata = await getNftWithMetadata(nftToken)

              return { nft: metadata, stakeAccount: fetchedAccount }
            } catch (e) {
              console.error('in fetching nft metata', e)
              return null
            }
          },
          1
        )
      ).filter(filterNull)

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

export const useStakingStats = () => {
  return useAsync(async () => {
    const provider = new Provider(connection, {} as any, {
      commitment: 'recent',
    })
    const program = new Program(stakingIdl, stakingProgramId, provider)

    console.log('start loading stats')

    console.time('fetchAllAccount')
    const fetchedAccount = await program.account.stakeAccount.all()
    console.timeEnd('fetchAllAccount')

    return {
      size: livingNftCount,
      amount: fetchedAccount.length,
      percentage: (fetchedAccount.length / livingNftCount) * 100,
    }
  }, [connection])
}