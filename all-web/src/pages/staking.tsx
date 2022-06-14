import React, { useEffect } from 'react'
import { useMemo } from 'react'

import { WalletMultiButton } from '../components/wallet-ui'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../utils/useWalletBalance'
import { useWallet } from '@solana/wallet-adapter-react'

import useWalletNftsOld from '../utils/useWalletNftsOld'
import { Flex, Stack } from '@chakra-ui/layout'
import {
  Box,
  Heading,
  Image,
  Text,
  SimpleGrid,
  Spinner,
  Progress,
  Link,
  Button,
  ChakraProvider,
  Container,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { Program, Provider } from '@project-serum/anchor'
import {
  connection,
  livingNftCount,
  stakingIdl,
  stakingProgramId,
} from '../config/config'
import { StakedNft, UnstakedNft } from '../modules/staking/staking.components'
import {
  useMintList,
  useStakingAccounts,
  useStakingStats,
} from '../modules/staking/staking.hooks'
import * as Sentry from '@sentry/browser'
import toast from 'react-hot-toast'
import { useAsyncFn } from 'react-use'
import Header from '../components/Header'
import themeFlat from '../themeFlat'
import Navbar from '../components/Navbar'
import Cohere from 'cohere-js'
import { pub } from '../utils/solUtils'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

console.log('programId', stakingProgramId.toBase58())

function Staking() {
  const wallet = useWallet()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    /* wallet.publicKey = pub('5AXyQ4wmVoKhfTa3o5rKxKZACC7v2gU1rggtfcmobxRQ') */
  }, [wallet])

  const { connected } = wallet
  const [balance] = useWalletBalance()

  useEffect(() => {
    if (!wallet?.publicKey) return

    Sentry.setUser({ id: wallet.publicKey?.toBase58() })
    Cohere.identify(wallet.publicKey.toBase58(), {
      displayName: wallet.publicKey.toBase58(),
    })
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
  const mintListRes = useMintList()

  const { value: stakingAccounts, ...stakingAccountsRes } =
    useStakingAccounts(wallet)

  useEffect(() => {
    console.log('stakingAccounts', stakingAccounts)
  }, [stakingAccounts])

  const stats = useStakingStats()

  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      {/*<Navbar colorTheme='light'></Navbar>*/}
      <Container
        w='100vw'
        maxW='unset'
        h='100%'
        minH='100vh'
        pr='0'
        pl='0'
        pt={['6rem', '8rem']}
        pb='8rem'
        pos='relative'
        bg='bgLight'
      >
        <Heading
          color='black'
          fontWeight={600}
          as='h1'
          fontSize={{ base: '4xl', lg: '5xl' }}
          textAlign='center'
          transition='all .2s ease-in-out'
        >
          STAKE YOUR ALL BLUE NFTS
        </Heading>
        <Text
          mt='1rem'
          color='textGreyDark'
          fontWeight={600}
          textAlign='center'
        >
          Earn $ALL by staking your NFTs that are enrolled in ALL Blue (the
          StonedApeCrew Incubator){' '}
          {/* toned Apes are waiting to be staked
          and puffin some Puff tokens in your wallet. */}
        </Text>

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
            <Box
              d='flex'
              alignItems='center'
              justifyContent={'center'}
              bg='white'
              rounded='md'
              padding='.5rem'
            >
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

        <Stack
          pt='5'
          px={['2', '6', '20']}
          spacing='10'
          maxWidth='140rem'
          margin='0 auto'
        >
          {true && (
            <Stack p='2' spacing='2' alignItems='center'>
              <Flex justifyContent='space-between' width={['90%', '70%']}>
                <Heading p='1' color='black' fontSize='2xl' fontWeight='500'>
                  {stats.value?.percentage
                    ? `${stats.value.percentage.toFixed(2)}% NFTs staked`
                    : ``}
                </Heading>
                <Heading
                  as='div'
                  p='1'
                  color='black'
                  fontSize='2xl'
                  fontWeight='500'
                >
                  {stats?.value?.amount ? (
                    stats?.value?.amount
                  ) : (
                    <Spinner color='textGrey' thickness='4px' />
                  )}
                  /{livingNftCount}
                </Heading>
              </Flex>

              {/* {stats.loading && (
            <Stack direction='row'>
              <Text>Loading Stats</Text>
              <Spinner />
            </Stack>
          )} */}
              <Progress
                isIndeterminate={stats.loading}
                colorScheme='telegram'
                size='lg'
                value={stats?.value?.percentage}
                width={['90%', '70%']}
                borderRadius='15px'
              />
            </Stack>
          )}

          {connected && (
            <>
              <Stack alignItems='center'>
                <Heading p='3' fontSize='3xl' fontWeight={600} color='black'>
                  Your Staked NFTs
                </Heading>
                {stakingAccountsRes.loading && (
                  <Stack direction='row'>
                    <Text color='textGreyDark'>Loading your staked NFTs</Text>{' '}
                    <Spinner />
                  </Stack>
                )}

                {stakingAccounts?.length === 0 && (
                  <Text color='textGreyDark'>
                    You have no NFTs staked, lets stake them
                  </Text>
                )}
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 4 }}>
                  {stakingAccounts &&
                    stakingAccounts.map((stakingAccount, i) => {
                      if (
                        mintListRes.value?.mintList?.find(
                          (mint: any) =>
                            mint.mintAddress ==
                            stakingAccount.stakeAccount.token.toBase58()
                        )
                      )
                        return null

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

              <Stack alignItems='center' mt='4rem'>
                <Heading fontSize='3xl' fontWeight={600}>
                  Unstaked NFTs
                </Heading>
                <Text color='textGreyDark' fontSize='sm'>
                  Let's $ALL them
                </Text>
                {walletNftsRes.loading && (
                  <Box color='textGreyDark'>
                    Loading your unstaked NFTs <Spinner />
                  </Box>
                )}
                {(walletNftsRes.nfts as any).length > 0 && (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, xl: 4 }}
                    spacing={2}
                  >
                    {(walletNftsRes.nfts as any).map((nft: any, i: number) => {
                      if (
                        mintListRes.value?.mintList?.find(
                          (mint: any) => mint.mintAddress == nft.mint
                        )
                      )
                        return null
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
      </Container>
    </ChakraProvider>
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
