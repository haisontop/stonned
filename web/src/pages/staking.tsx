import React, { useEffect, useMemo } from 'react'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../utils/useWalletBalance'
import { useWallet } from '@solana/wallet-adapter-react'

import useWalletNftsOld from '../utils/candyMachineIntern/useWalletNftsOld'
import { Stack } from '@chakra-ui/layout'
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Link,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { Program, Provider } from '@project-serum/anchor'
import { connection, stakingIdl, stakingProgramId } from '../config/config'
import { StakedNft, UnstakedNft } from '../modules/staking/staking.components'
import {
  useStakingAccounts,
  useWithdrawAll,
} from '../modules/staking/staking.hooks'
import * as Sentry from '@sentry/browser'
import { StakingStats } from '../modules/staking/StakingStats'
import { trpc } from '../utils/trpc'
import { MainLayout } from '../layouts/MainLayout'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

console.log('programId', stakingProgramId.toBase58())

function Staking() {
  const wallet = useWallet()
  const { connected } = wallet
  const [balance] = useWalletBalance()

  useEffect(() => {
    if (!wallet?.publicKey) return

    Sentry.setUser({ id: wallet.publicKey?.toBase58() })
  }, [wallet])

  const provider = useMemo(() => {
    if (!wallet) return null
    /* create the provider and return it to the caller */
    /* network set to local network for now */

    const provider = new Provider(connection, wallet as any, {
      commitment: 'confirmed',
    })
    return provider
  }, [wallet])

  /* console.log('wallet', wallet) */

  const program = useMemo(() => {
    if (!provider) return null
    return new Program(stakingIdl, stakingProgramId, provider)
  }, [provider])

  const walletNftsRes = useWalletNftsOld()

  const { value: stakingAccounts, ...stakingAccountsRes } =
    useStakingAccounts(wallet)

  const [handleWithDrawAllRes, handleWithDrawAll] = useWithdrawAll(
    provider,
    wallet,
    program
  )

  useEffect(() => {
    console.log('stakingAccounts', stakingAccounts)
  }, [stakingAccounts])

  const stats = trpc.useQuery(['stakingStats.all'])

  const statsLoading = stats.isLoading
  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        showWallet: false,
        bgTransparent: true,
      }}
    >
      <Stack
        bg='black'
        w='auto'
        pt={['18%', '14%', '5%']}
        px={['2', '6', '20']}
        spacing='0'
        color='white'
      >
        <Stack
          d='flex'
          direction={['column', 'row']}
          spacing={4}
          justifyContent='space-evenly'
          p='6'
        >
          <Box
            shadow='lg'
            rounded='lg'
            p={1}
            boxShadow='inset 0px 4px 56px rgba(255, 255, 255, 0.18)'
            backdropFilter='blur(22px)'
            d='flex'
            justifyContent={'center'}
          >
            <Box d='flex' alignItems='center' justifyContent={'center'}>
              <Text p='1'>Balance: </Text>
              <Text pl='1' fontWeight='bold'>
                {balance.toFixed(2)}{' '}
              </Text>

              <Text
                pr='2'
                pl='1'
                fontWeight='bold'
                textDecor='transparent'
                bgClip='text'
                style={{
                  backgroundImage: `linear-gradient(to bottom right, #00FFA3, #03E1FF, #DC1FFF)`,
                }}
              >
                {' '}
                SOL
              </Text>
            </Box>
          </Box>

          <Box>
            <WalletMultiButton />
          </Box>
        </Stack>

        <Stack p='6' spacing='0'>
          <Heading p='1' fontSize='xl' fontWeight={700} fontFamily={'body'}>
            Ready to stake?
          </Heading>
          <Text p='1' fontSize='smaller' fontWeight={600}>
            Earn rewards in $PUFF and $ALL by staking your Stoned Ape or
            Nuked Ape <br />
          </Text>
          <Box paddingY='20px'>
            <ButtonGroup>
              {/*<Button
                variant='ghost'
                _hover={{
                  backgroundColor: 'rgba(167, 157, 190, 0.3)'
                }}
                size='sm'
                onClick={() => handleWithDrawAll()}
                isLoading={handleWithDrawAllRes.loading}
              >
                Stake all
              </Button>*/}
              <Button
                backgroundColor='#423AAF'
                _hover={{
                  backgroundColor: '#7150be',
                }}
                border='none'
                size='sm'
                onClick={() => handleWithDrawAll()}
                isLoading={handleWithDrawAllRes.loading}
              >
                Claim all
              </Button>
            </ButtonGroup>
          </Box>
        </Stack>
      </Stack>

      <Stack
        bg='white'
        w='auto'
        pt='5'
        px={['2', '6', '20']}
        minHeight='100vh'
        spacing='6'
      >
        <StakingStats
          name={'SAC Apes'}
          color={'green.700'}
          progressColorScheme={'green'}
          stats={stats.data?.sac}
          loading={statsLoading}
        />
        <StakingStats
          name={'Nuked Apes'}
          color={'purple.600'}
          progressColorScheme={'purple'}
          stats={stats.data?.nuked}
          loading={statsLoading}
        />

        {connected && (
          <>
            <Stack alignItems='center'>
              <Heading p='3' fontSize='3xl' fontWeight={700} color='black'>
                Your Staked Apes
              </Heading>
              {stakingAccountsRes.loading && (
                <Stack direction='row'>
                  <Text> Loading your staked NFTs</Text> <Spinner />
                </Stack>
              )}

              {stakingAccounts?.length === 0 && (
                <Text>You have no Apes staked, lets stake them</Text>
              )}
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }}>
                {stakingAccounts &&
                  stakingAccounts.map((stakingAccount, i) => {
                    return (
                      <StakedNft
                        {...{
                          provider,
                          wallet,
                          program,
                          refetchStakingAccounts: () => {
                            stakingAccountsRes.retry()
                            walletNftsRes.refetch()
                          },
                          stakingAccount,
                          key: i,
                        }}
                      />
                    )
                  })}
              </SimpleGrid>
            </Stack>

            <Stack alignItems='center'>
              <Heading p='3' fontSize='3xl'>
                Unstaked Apes, lets Puff them
              </Heading>
              {walletNftsRes.loading && (
                <Box>
                  Loading your unstaked NFTs <Spinner />
                </Box>
              )}
              {(walletNftsRes.nfts as any).length > 0 && (
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, xl: 4 }}
                  spacing={2}
                >
                  {(walletNftsRes.nfts as any).map((nft: any, i: number) => {
                    return (
                      <UnstakedNft
                        key={i}
                        stakingAccount={nft}
                        wallet={wallet}
                        program={program}
                        provider={provider}
                        refetchStakingAccounts={() => {
                          stakingAccountsRes.retry()
                          walletNftsRes.refetch()
                        }}
                      />
                    )
                  })}
                </SimpleGrid>
              )}
            </Stack>
          </>
        )}
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
        <Staking />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
