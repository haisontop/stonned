import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { Program, Provider } from '@project-serum/anchor'
import { SacStaking } from '../../../../staking/target/types/sac_staking'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import * as web3 from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'
import { useAsync, useAsyncFn, useAsyncRetry } from 'react-use'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import toast from 'react-hot-toast'
import asyncBatch from 'async-batch'
import { Evolution } from '../../../../evolution/target/types/evolution'
import config, {
  backendUserPubkey,
  breedingIdl,
  breedingProgramId,
  connection,
  evolutionIdl,
  evolutionProgramId,
  livingNftCount,
  programPuffWallet,
  allToken,
} from '../../config/config'
import axios, { AxiosError } from 'axios'
import {
  getAssociatedTokenAddress,
  getNftWithMetadata,
  getOrCreateAssociatedTokenAddressInstruction,
  getTokenAccount,
} from '../../utils/solUtils'
import { delay } from 'lodash'
import { sleep } from '../../utils/utils'

// TODO: SacStaking replace with SacEvolution

export function useStartEvolution(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<Evolution & { metadata: { address: string } }> | null,
  refetchEvolutionAccount: () => void
) {
  return useAsyncFn(
    async (address: string, isDMT: boolean) => {
      if (!wallet.publicKey || !wallet.signTransaction || !program || !provider)
        return

      try {
        const nft = new web3.PublicKey(address)
        const recentBlockhash = await connection.getRecentBlockhash()
        const backendWallet = new web3.PublicKey(
          'GpUCXJD33rBH4ENZTfuV4jiQW89TCAC9SGnq3gGurnST'
        )

        const userPuffTokenAccount = await getTokenAccount(
          connection,
          allToken,
          wallet.publicKey
        )
        if (!userPuffTokenAccount)
          throw Error('You do not own any $PUFF. Get some!')

        console.log('userPuffTokenAccount', userPuffTokenAccount)

        let userNftTokenAccount = await getTokenAccount(
          connection,
          nft,
          wallet.publicKey
        )!
        if (!userNftTokenAccount) throw Error('You dont own the NFT')

        let programPuffTokenAccount = await getTokenAccount(
          connection,
          allToken,
          programPuffWallet
        )!
        if (!programPuffTokenAccount)
          throw new Error('ProgramPuffTokenAccount does not exist')

        console.log('ProgramPuffTokenAccount', programPuffTokenAccount)

        let [userEvolutionAddress, userEvolutionAccountAddressBump] =
          await web3.PublicKey.findProgramAddress(
            [nft.toBuffer(), provider.wallet.publicKey.toBuffer()],
            program.programId
          )

        let [nftVaultAddress, nftVaultAddressBump] =
          await web3.PublicKey.findProgramAddress(
            [Buffer.from('sac'), nft.toBuffer()],
            program.programId
          )

        const startEvolutionInstr = await program.instruction.startEvolution(
          userEvolutionAccountAddressBump,
          nftVaultAddressBump,
          isDMT,
          {
            accounts: {
              user: wallet.publicKey,
              rent: web3.SYSVAR_RENT_PUBKEY,
              systemProgram: web3.SystemProgram.programId,
              tokenProgram: spl.TOKEN_PROGRAM_ID,
              puffToken: allToken,
              evolutionAccount: userEvolutionAddress,
              nftMint: nft,
              programPuffTokenAccount: programPuffTokenAccount.pubkey,
              userNftAccount: userNftTokenAccount.pubkey,
              userPuffTokenAccount: userPuffTokenAccount.pubkey,
              vaultNftAccount: nftVaultAddress,
              backendUser: backendUserPubkey,
            },
          } as any
        )

        const transaction = new web3.Transaction({
          feePayer: wallet.publicKey,
          recentBlockhash: recentBlockhash.blockhash,
        }).add(startEvolutionInstr)

        const signedTransaction = await wallet.signTransaction(transaction)

        const serializedTransaction = signedTransaction.serialize({
          requireAllSignatures: false,
        })

        const res = await axios.post('/api/evolution/startEvolution', {
          trans: serializedTransaction,
          nft: nft.toBase58(),
          isDMT: isDMT,
          user: wallet.publicKey.toBase58(),
        })

        await sleep(3000)
        refetchEvolutionAccount()

        console.log('res', res)
      } catch (e: any) {
        console.error('error in reveal', e)

        const axiosError = e as AxiosError
        if (axiosError.isAxiosError) {
          console.log('axiosError.response?.data', axiosError.response?.data)

          throw Error(axiosError.response?.data.message ?? e.message)
        }

        Promise.reject(e)
      }
    },
    [wallet]
  )
}

export function useReveal(
  provider: Provider | null,
  wallet: WalletContextState,
  program: Program<Evolution & { metadata: { address: string } }> | null,
  refetchEvolutionAccount: () => void
) {
  return useAsyncFn(
    async (nft: PublicKey) => {
      try {
        if (
          !wallet.publicKey ||
          !wallet.signTransaction ||
          !program ||
          !provider
        )
          return

        let userNftTokenAccount = await getTokenAccount(
          connection,
          nft,
          wallet.publicKey
        )

        if (!userNftTokenAccount) {
          console.log('needs to create new token account')

          const recentBlockhash = await connection.getRecentBlockhash()
          const associatedTokenAddress = await getAssociatedTokenAddress(
            nft,
            wallet.publicKey
          )
          const transaction = new web3.Transaction({
            feePayer: wallet.publicKey,
            recentBlockhash: recentBlockhash.blockhash,
          }).add(
            spl.Token.createAssociatedTokenAccountInstruction(
              spl.ASSOCIATED_TOKEN_PROGRAM_ID,
              spl.TOKEN_PROGRAM_ID,
              nft,
              associatedTokenAddress,
              wallet.publicKey,
              wallet.publicKey
            )
          )
          const createAccountTx = await wallet.sendTransaction(
            transaction,
            connection
          )
          await connection.confirmTransaction(createAccountTx, 'confirmed')
          console.log('created AssociatedTokenAccount sucessfully')
        }

        const revealRes = await axios.post('/api/evolution/reveal', {
          user: wallet.publicKey?.toBase58(),
          nft: nft.toBase58(),
        })

        const transaction = web3.Transaction.from(
          Buffer.from(revealRes.data.trans)
        )
        console.log('reveal transaction', transaction)

        await wallet.signTransaction(transaction)

        /*  const simulatedTrans = await provider.connection.simulateTransaction(
          transaction
        )
        console.log('simulatedTrans', simulatedTrans) */

        console.log(
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

        await sleep(3000)
        refetchEvolutionAccount()
      } catch (error) {
        console.error('error in reveal', error)
        Promise.reject(error)
      }
    },
    [wallet]
  )
}

export function useBreedingAccounts(wallet: WalletContextState) {
  return useAsyncRetry(async () => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction ||
      !wallet.wallet
    )
      return null

    const provider = new Provider(connection, wallet as any, {
      commitment: 'recent',
    })
    const program = new Program(breedingIdl, breedingProgramId, provider)

    const rawBreedingAccountsAll = await program.account.breedingAccount.all()

    console.log({ rawBreedingAccountsAll })

    const rawBreedingAccounts = rawBreedingAccountsAll.filter(
      (s) => s.account.authority.toBase58() === wallet.publicKey?.toBase58()
    )

    const breedingAccounts = await asyncBatch(
      rawBreedingAccounts,
      async (breedingAccount, taskIndex: number, workerIndex: number) => {
        try {
          const { ape1, ape2 } = breedingAccount.account

          const apesPubkeys = [ape1, ape2]

          const apes = await Promise.all(
            apesPubkeys.map(async (apePubkey) => {
              const metadata = await getNftWithMetadata(apePubkey)

              return metadata
            })
          )

          return { apes, breedingAccount }
        } catch (error) {
          console.log('error in asyncBatch', error)
          throw error
        }
      },
      2
    )

    return breedingAccounts.filter((b) => !b.breedingAccount.account.finished)
  }, [wallet])
}

export function useBreedingAccountsOfRenters(wallet: WalletContextState) {
  return useAsyncRetry(async () => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction ||
      !wallet.wallet
    )
      return null

    const provider = new Provider(connection, wallet as any, {
      commitment: 'recent',
    })
    const program = new Program(breedingIdl, breedingProgramId, provider)

    const breedingAccounts = (
      await program.account.breedingAccount.all()
    ).filter(
      (s) =>
        (s.account?.rentalUser as any)?.toBase58() ===
        wallet.publicKey?.toBase58()
    )


    const breedingAccountsWithNfts = await asyncBatch(
      breedingAccounts,
      async (breedingAccount, taskIndex: number, workerIndex: number) => {
        try {
          const { ape1, ape2 } = breedingAccount.account

          const apesPubkeys = [ape1, ape2]

          const apes = await Promise.all(
            apesPubkeys.map(async (apePubkey) => {
              const metadata = await getNftWithMetadata(apePubkey)

              return metadata
            })
          )

          return { apes, breedingAccount }
        } catch (error) {
          console.log('error in asyncBatch', error)
          throw error
        }
      },
      2
    )

    return breedingAccountsWithNfts.filter(
      (b) => !b.breedingAccount.account.finished
    )
  }, [wallet])
}

export function useRentableAccounts(wallet: WalletContextState) {
  return useAsyncRetry(async () => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction ||
      !wallet.wallet
    )
      return null

    const provider = new Provider(connection, wallet as any, {
      commitment: 'recent',
    })
    const program = new Program(breedingIdl, breedingProgramId, provider)

    const rawRentingAccounts = await program.account.rentAccount.all()

    const rentableAccounts = await asyncBatch(
      rawRentingAccounts,
      async (account, taskIndex: number, workerIndex: number) => {
        try {
          const metadata = await getNftWithMetadata(account.account.ape)

          return { nft: metadata, account }
        } catch (error) {
          console.log('error in asyncBatch', error)
          throw error
        }
      },
      2
    )

    console.log('rentingAccounts', rentableAccounts)

    return rentableAccounts
    /*  .sort((a, b: any) => {
        if (!a!.nft.name.includes('#') || !b!.nft.name.includes('#')) return 1
        return (
          Number(a!.nft.name.split('#')[1]) - Number(b.nft.name.split('#')[1])
        )
      }) */
  }, [wallet])
}

export function useRentAccounts(wallet: WalletContextState) {
  return useAsyncRetry(async () => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction ||
      !wallet.wallet
    )
      return null

    const provider = new Provider(connection, wallet as any, {
      commitment: 'recent',
    })
    const program = new Program(breedingIdl, breedingProgramId, provider)

    const rawRentingAccounts = (await program.account.rentAccount.all()).filter(
      (s) => s.account.authority.toBase58() === wallet.publicKey?.toBase58()
    )

    const rentingAccounts = await asyncBatch(
      rawRentingAccounts,
      async (account, taskIndex: number, workerIndex: number) => {
        try {
          const metadata = await getNftWithMetadata(account.account.ape)

          return { nft: metadata, account }
        } catch (error) {
          console.log('error in asyncBatch', error)
          throw error
        }
      },
      2
    )

    console.log('rentingAccounts', rentingAccounts)

    return rentingAccounts
    /*  .sort((a, b: any) => {
        if (!a!.nft.name.includes('#') || !b!.nft.name.includes('#')) return 1
        return (
          Number(a!.nft.name.split('#')[1]) - Number(b.nft.name.split('#')[1])
        )
      }) */
  }, [wallet])
}

export const useRescueMissionStats = () => {
  return useAsync(async () => {
    const provider = new Provider(connection, {} as any, {
      commitment: 'recent',
    })

    const program = new Program(breedingIdl, breedingProgramId, provider)

    console.log('start loading stats')

    console.time('fetchAllAccount')

    const rawBreedingAccounts = await program.account.breedingAccount.all()

    const configAccount = await program.account.configAccount.all()
    const missionCounterAfterInitialPhase = configAccount.find(conf => {
      return conf.account.counter > 0;
    })

    console.timeEnd('fetchAllAccount')

    console.log('total', rawBreedingAccounts.length)

    const runningMissions = rawBreedingAccounts.filter((breedingAcc) => {
      return !breedingAcc.account.finished
    })

    console.log('runningMissionCount', runningMissions.length)

    return {
      size: livingNftCount,
      missionCount: runningMissions.length,
      apesOnMission: runningMissions.length * 2,
      percentage: (((runningMissions.length * 2) / livingNftCount) * 100).toFixed(2),
      missionCounterAfterInitialPhase: missionCounterAfterInitialPhase?.account.counter
    }
  }, [connection])
}
