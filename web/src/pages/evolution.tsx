import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo } from 'react'
import { useAsync, useAsyncFn } from 'react-use'
import config, {
  backendUserPubkey,
  connection,
  evolutionIdl,
  evolutionProgramId,
  programPuffWallet,
  puffToken,
} from '../config/config'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../utils/useWalletBalance'
import * as web3 from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import axios, { AxiosError } from 'axios'
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Program, Provider } from '@project-serum/anchor'
import { getTokenAccount } from '../utils/solUtils'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import useWalletNftsOld from '../utils/candyMachineIntern/useWalletNftsOld'
import {
  SacNftCard,
  SacOnRetreat,
} from '../modules/evolution/evolution.components'
import Header from '../components/Header'
import { useEvolutionAccounts } from '../modules/evolution/evolution.hooks'
import { MainLayout } from '../layouts/MainLayout'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

function Evolution() {
  const wallet = useWallet()
  const { connected } = wallet
  const [balance] = useWalletBalance()
  const walletNftsRes = useWalletNftsOld()

  const { value: evolutionAccounts, ...evolutionAccountsRes } =
    useEvolutionAccounts(wallet)

  useEffect(() => {
    console.log('evolutionAccounts', evolutionAccounts)
  }, [evolutionAccounts])

  /* console.log('wallet', wallet) */

  const { program, provider } = useMemo(() => {
    const provider = new Provider(connection, wallet as any, {
      commitment: 'confirmed',
    })
    const program = new Program(evolutionIdl, evolutionProgramId, provider)

    return { program, provider }
  }, [wallet])

  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        showWallet: true,
        bgTransparent: true,
      }}
    >
      <Stack
        spacing='2rem'
        paddingBottom='2rem'
        background='#131737'
        alignItems='center'
        color='white'
      >
        <Heading
          pt={['18%', '14%', '8%']}
          textShadow={'1px 1px 4px rgba(0,0,0,0.2);'}
        >
          Apevolution
        </Heading>
        <Text px='4' fontSize='smaller' fontWeight={600}>
          Your Ape can evolve to get one of the 4 major roles; Scientist,
          Businessman, Artist or Farmer by going on a retreat.
          <br />
          Normal retreat has a 60% chance of him getting a role (cost of 333
          $PUFF), DMT retreat has a 80% chance (cost of 666 $PUFF)
        </Text>
        <WalletMultiButton />
      </Stack>
      <Stack
        minHeight='80vh'
        backgroundImage={'/images/SAC-Cave.svg'}
        backgroundSize='cover'
      >
        <Stack
          width={'100%'}
          paddingTop='2rem'
          spacing='2rem'
          alignItems='center'
          minHeight='80vh'
          bg='rgba(0,0,0,0.4)'
        >
          {evolutionAccounts && evolutionAccounts.length > 0 && (
            <Heading color='white' textShadow={'1px 1px 4px rgba(0,0,0,0.7);'}>
              On Retreat
            </Heading>
          )}

          {evolutionAccountsRes.loading && (
            <Stack direction='row'>
              <Spinner color='white' />
            </Stack>
          )}

          <SimpleGrid columns={[1, 2, 3]}>
            {evolutionAccounts &&
              evolutionAccounts.map((evolutionAccount, i) => {
                return (
                  <SacOnRetreat
                    {...{
                      provider,
                      wallet,
                      program,
                      refetchEvolutionAccounts: () => {
                        walletNftsRes.refetch()
                        evolutionAccountsRes.retry()
                      },
                      evolutionAccount,
                      key: i,
                    }}
                  />
                )
              })}
          </SimpleGrid>

          <Heading color='white' textShadow={'1px 1px 4px rgba(0,0,0,0.7);'}>
            Available for Retreat
          </Heading>
          {walletNftsRes.loading && (
            <Stack direction='row'>
              <Spinner color='white' />
            </Stack>
          )}

          {(walletNftsRes.nfts as any).length > 0 && (
            <SimpleGrid columns={[1, 2, 3]} spacing={2}>
              {(walletNftsRes.nfts as any).map((nft: any, i: number) => {
                return (
                  <SacNftCard
                    key={i}
                    evolutionAccount={nft}
                    wallet={wallet}
                    program={program}
                    provider={provider}
                    refetchEvolutionAccounts={() => {
                      walletNftsRes.refetch()
                      evolutionAccountsRes.retry()
                    }}
                  />
                )
              })}
            </SimpleGrid>
          )}
        </Stack>
      </Stack>
    </MainLayout>
  )
}

const WalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function HOC() {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <Evolution />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
