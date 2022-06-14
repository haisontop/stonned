import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useInterval,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import useAsyncFn, { AsyncState } from 'react-use/lib/useAsyncFn'
import { GradientButton } from '../../../components/GradientButton'
import { useActiveLottery } from '../lotteryHooks'
import { Lottery } from '../lotteryUtils'
import LotteryHalfRadiusTokenItem from './LotteryHalfRadiusTokenItem'
import WaitingTime from './WaitingTime'
import AliceCarousel from 'react-alice-carousel'
import BuyTicket, { CURRENCY } from './BuyTicket'
import YourTickets from './YourTickets'
import { differenceInMilliseconds, differenceInSeconds } from 'date-fns'
import { RaffleType } from '../type'

const handleDragStart = (event: any) => event.preventDefault()

export type LotteryHeroProps = {
  raffle: RaffleType
}
export default function LotteryHero({ raffle }: LotteryHeroProps) {
  const [endDiff, setEndDiff] = useState<number>(0)

  useEffect(() => {
    if (!raffle) return
    const wholeSeconds = differenceInMilliseconds(raffle?.endDate, new Date())
    setEndDiff(wholeSeconds)
  }, [raffle])

  return (
    <Container
      justifyContent={'center'}
      mt={[0]}
      backgroundImage=' linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)'
      borderRadius={'8px'}
      boxShadow='0px 4px 20px rgba(0, 0, 0, 0.1)'
      py={[6]}
      maxW='container.xl'
      position={'relative'}
    >
      
      <Box display='flex' flexDir='column' alignItems={'center'} gap={4}>
        <SimpleGrid columns={{ base: 1, md: 2 }} width='100%'>
          <Box
            maxWidth='500px'
            width='100%'
            mx='auto'
            display='flex'
            alignItems={'center'}
          >
            <AliceCarousel
              disableDotsControls
              disableButtonsControls
              items={raffle?.prices.map((p) => (
                <Box>
                  <Image
                    onDragStart={handleDragStart}
                    src={p.image}
                    borderRadius='10px'
                    boxShadow='2xl'
                    filter='brightness(90%)'
                  />
                  <Link
                    color={'#fff'}
                    href={`https://solscan.io/token/${p.mint.toBase58()}`}
                    target='_blank'
                  >
                    <Text
                      color='#fff'
                      mt='1rem'
                      _hover={{ textDecoration: 'underscore' }}
                    >
                      {p.name} ↗
                    </Text>
                  </Link>
                </Box>
              ))}
              autoPlayInterval={2000}
              animationDuration={750}
              autoPlay={true}
              infinite={true}
              animationType='fadeout'
              animationEasingFunction='ease-in-out'
              autoPlayDirection='ltr'
              responsive={{
                0: {
                  items: 1,
                },
              }}
            ></AliceCarousel>
          </Box>

          <Box width='100%' maxWidth='30rem' mx='auto'>
            <Box
              color='white'
              display='block'
              maxWidth='20rem'
              padding='.8rem 0'
              margin='0rem auto 1rem auto'
              mt={[8, 12, 0]}
              textAlign='center'
              borderRadius='10px'
              border='2px solid white'
              boxShadow='0px 0px 20px rgba(255, 238, 206, 0.8)'
              bg='rgba(0,0,0,0.4)'
            >
              <Text fontWeight={600} fontSize='1rem'>
                Pot Value
              </Text>
              <Text fontWeight={400} fontSize='1rem'>
                {raffle?.prices.length} Prize(s)
              </Text>
            </Box>

            <Box maxWidth='20rem' mx='auto'>
              {raffle && endDiff > 0 && (
                <>
                  <Text
                    mt={2}
                    mb={0}
                    color='rgba(255,255,255)'
                    textAlign={'center'}
                    fontWeight='400'
                    fontSize={['.7rem']}
                  >
                    Ending in
                  </Text>
                  <WaitingTime endDate={raffle.endDate} />
                </>
              )}
              {raffle && endDiff < 0 && (
                <>
                  <Text
                    color='#fff'
                    fontSize={['1.5rem']}
                    lineHeight={['1.55rem']}
                    fontWeight='bold'
                    fontFamily='Montserrat'
                    textAlign='center'
                  >
                    Ended
                  </Text>
                  {raffle.isRaffled ? (
                    <Text
                      color='rgba(255,255,255,0.7)'
                      fontSize={['.875rem']}
                      textAlign='center'
                    >
                      Winners have been raffled. In the section above, you can check if you won. For that, please connect your wallet.
                    </Text>
                  ) : (
                    <Text
                      color='rgba(255,255,255,0.7)'
                      fontSize={['.875rem']}
                      textAlign='center'
                    >
                      Winners will be raffled soon.
                    </Text>
                  )}
                </>
              )}
            </Box>

            {raffle && <YourTickets raffle={raffle} />}

            {raffle && endDiff > 0 && <BuyTicket raffle={raffle}></BuyTicket>}

            
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  )
}
