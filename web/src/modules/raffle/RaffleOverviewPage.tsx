import {
  Container,
  Box,
  Text,
  Heading,
  Flex,
} from '@chakra-ui/react'
import React from 'react'
import Hero from './components/Hero'
import dynamic from 'next/dynamic'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../../utils/useWalletBalance'
import LotteryTokenCarousel from './components/LotteryTokenCarousel'
import BuyTicket from './components/BuyTicket'
import YourTickets from './components/YourTickets'
import LotteryFAQ from './components/FAQ'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import WinClaim from './components/WinClaim'
import NoWin from './components/NoWin'
import { useActiveLottery, useUserPrices } from './lotteryHooks'
import LotteryOverviewHero from './components/LotteryOverviewHero'
import LotteryList from './components/LotteryList'
import { MainLayout } from '../../layouts/MainLayout'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const RaffleOverviewPage = () => {
  const [balance] = useWalletBalance()
  const lotteryRes = useActiveLottery()
  const userPricesRes = useUserPrices()

  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        bgColor: '#120D20',
        showWallet: true,
        bgTransparent: true,
      }}
    >
      <Box>
        <Container
          w='100vw'
          maxW='100vw'
          minHeight='100vh'
          pr='0'
          pl='0'
          paddingInlineStart={0}
          paddingInlineEnd={0}
          bg=''
          pos='relative'
          pb={24}
          _before={{
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            bg: '#060014', //'#090909',
            opacity: '0.95',
            zIndex: -1,
          }}
        >
          <Box
            position={'absolute'}
            width='100%'
            height='100%'
            backgroundImage={'/images/lottery-background.png'}
          />

          <Container pt={16} maxW='1600px' pos='relative'>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justifyContent='space-evenly'
              alignItems={'center'}
              p='6'
            >
              <Box
                shadow='lg'
                rounded='lg'
                p={1}
                d='flex'
                justifyContent={'center'}
                height='3rem'
                boxShadow='inset 0px 4px 56px rgba(255, 255, 255, 0.18)'
                backdropFilter='blur(22px)'
                my={2}
              >
                <Box d='flex' alignItems='center' justifyContent={'center'}>
                  <Text color='white' p='1'>
                    Balance:{' '}
                  </Text>
                  <Text color='white' pl='1' fontWeight='bold'>
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

              <Box textAlign={'center'} order={{ base: '-1', md: 'unset' }}>
                <Heading
                  textAlign='center'
                  fontFamily={'Metropolis1920'}
                  color='#fff'
                  fontWeight={400}
                  fontSize={['3rem', '4rem', '4rem']}
                  textShadow='0px 0px 20px rgba(255, 238, 206, 0.8)'
                  mb='0'
                  pl='1rem' // correct visual unregularity
                >
                  Lucky Dip
                </Heading>
                <Text
                  color='rgba(255,255,255,0.6)'
                  fontSize='.875rem'
                  textAlign='center'
                >
                  built by SAC | hosted by Parlay
                </Text>
              </Box>

              <Box>
                <WalletMultiButton />
              </Box>
            </Flex>

            <LotteryOverviewHero></LotteryOverviewHero>
            <LotteryList></LotteryList>
          </Container>
        </Container>
      </Box>
    </MainLayout>
  )
}

export default RaffleOverviewPage
