import {
  Container,
  Box,
  Text,
  Heading,
  Flex,
  Spinner,
  Link,
  Stack,
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
import { useActiveLottery, useLottery, useUserPrices } from './lotteryHooks'
import { getLotteryByAddress } from './lotteryUtils'
import { RaffleType } from './type'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { MainLayout } from '../../layouts/MainLayout'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const RaffleDetailPage = (props: { raffle?: RaffleType }) => {
  const router = useRouter()
  const slug = router.query.slug

  const raffleRes = useLottery(slug)
  const raffle = raffleRes.data

  console.log('raffle winners', raffle?.winners)
  const [balance] = useWalletBalance()
  const userPricesRes = useUserPrices()

  useEffect(() => {
    console.log('raffle', raffle)
  }, [raffle])

  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        bgColor: '#120D20',
        bgTransparent: true,
      }}
    >
      <Box overflow={'hidden'}>
        <Container
          w='100vw'
          maxW='100vw'
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

          {router.isFallback || !raffleRes.data ? (
            <Spinner position='fixed' top='48%' left='49%'></Spinner>
          ) : (
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

              <Box maxW='container.xl' margin='1rem auto'>
                <Link href='../lucky-dip' color='white'>
                  {'<'} Back to Overview
                </Link>
              </Box>

              {userPricesRes.data &&
                raffle &&
                raffle.isRaffled &&
                (userPricesRes.data.length > 0 ? <WinClaim /> : <NoWin />)}

              {raffle && (
                <>
                  <Hero raffle={raffle} />
                  <LotteryTokenCarousel raffle={raffle} />
                </>
              )}
              {raffle && raffle.winners.length && (
                <Container maxW='container.xl'>
                  <Text
                    display='inline'
                    bgGradient={`linear(to-l, #FF1C97, #FFBB52 60%)`}
                    bgClip='text'
                    fontWeight={600}
                    fontSize='1.25rem'
                  >
                    All Winners
                  </Text>
                  <Stack>
                    {raffle.winners.map((winner) => {
                      return (
                        <Text
                          color='rgba(255,255,255,0.6)'
                          display='inline'
                          fontWeight={500}
                          fontSize='1rem'
                        >
                          {winner.toBase58()}
                        </Text>
                      )
                    })}
                  </Stack>
                </Container>
              )}
              <LotteryFAQ />
            </Container>
          )}
        </Container>
      </Box>
    </MainLayout>
  )
}

export default RaffleDetailPage
