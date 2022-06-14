import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useActiveLottery } from '../lotteryHooks'
import WaitingTime from './WaitingTime'
import AliceCarousel from 'react-alice-carousel'
import { differenceInHours } from 'date-fns'

const handleDragStart = (event: any) => event.preventDefault()

export type LotteryOverviewHero = {}

export default function LotteryHero(props: LotteryOverviewHero) {
  const lotteryRes = useActiveLottery()
  const [endDiff, setEndDiff] = useState<number>(0)

  useEffect(() => {
    if (!lotteryRes.data) return
    const wholeHours = differenceInHours(lotteryRes.data?.endDate, new Date(), {
      roundingMethod: 'floor',
    })
    setEndDiff(wholeHours)
  }, [lotteryRes.data])

  if (endDiff < -24) {
    return null
  }

  if (lotteryRes.isLoading) {
    return <LotteryOverviewHeroSkeleton />
  }

  return (
    <Container
      justifyContent={'center'}
      mt='1rem'
      maxW='container.xl'
      position={'relative'}
    >
      <Box display='flex' flexDir='column' alignItems={'center'} gap={4}>
        <Text fontWeight={600} fontSize='1rem' color='#fff'>
          Featured
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} width='100%'>
          <Box
            maxWidth='400px'
            width='100%'
            mx='auto'
            display='flex'
            alignItems={'center'}
          >
            <AliceCarousel
              disableDotsControls
              disableButtonsControls
              items={lotteryRes.data?.prices.map((p) => (
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
                {lotteryRes.data?.prices.length} Prize(s)
              </Text>
            </Box>

            <Box maxWidth='20rem' mx='auto'>
              {lotteryRes.data && endDiff >= 0 && (
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
                  {lotteryRes.data.endDate && (
                    <WaitingTime endDate={lotteryRes.data.endDate} />
                  )}
                </>
              )}
              {lotteryRes.data && endDiff < 0 && (
                <>
                  <Text
                    color='#fff'
                    fontSize={['1.5rem']}
                    lineHeight={['1.55rem']}
                    fontWeight='bold'
                    fontFamily='Montserrat'
                  >
                    Ended
                  </Text>
                  <Text color='rgba(255,255,255,0.7)' fontSize={['.875rem']}>
                    The next Dip will start soon 🔥
                  </Text>
                </>
              )}
            </Box>

            {lotteryRes.data?.publicKey && (
              <Box textAlign='center' mt={'40px'}>
                <Link
                  href={`/lucky-dip/${lotteryRes.data?.publicKey.toBase58()}`}
                >
                  <Button
                    alignSelf='center'
                    rounded='10px'
                    border='2px solid #888'
                    bg='transparent'
                    color='white'
                    transition='all .15s ease-in-out'
                    _hover={{
                      background: 'rgba(0,0,0,0.8)',
                      borderColor: 'white',
                      boxShadow: '0px 2px 30px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    View Details
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  )
}

const LotteryOverviewHeroSkeleton = () => {
  return (
    <Container
      justifyContent={'center'}
      mt='1rem'
      maxW='container.xl'
      position={'relative'}
    >
      <Box display='flex' flexDir='column' alignItems={'center'} gap={4}>
        <Skeleton height='1.75rem' width='5rem' borderRadius={'10px'} />
        <SimpleGrid columns={{ base: 1, md: 2 }} width='100%'>
          <Box
            maxWidth='400px'
            width='100%'
            mx='auto'
            display='flex'
            alignItems={'center'}
            flexDirection='column'
          >
            <Skeleton
              height='22rem'
              maxWidth='25rem'
              width={'100%'}
              borderRadius='10px'
              filter='brightness(90%)'
            />
            <Skeleton
              height='1.75rem'
              width='8rem'
              mt='1rem'
              borderRadius={'10px'}
            />
          </Box>

          <Box width='100%' maxWidth='30rem' mx='auto'>
            <Flex
              color='white'
              flexDirection={'column'}
              alignItems='center'
              gap={'1rem'}
              maxWidth='20rem'
              padding='.8rem 0'
              margin='0rem auto 1rem auto'
              mt={[8, 12, 0]}
              textAlign='center'
              borderRadius='10px'
              border='2px solid rgb(255,255,255,0.3)'
              boxShadow='0px 0px 20px rgba(255, 238, 206, 0.7)'
              bg='black'
            >
              <Skeleton height='1.25rem' width='25%' borderRadius={'10px'} />
              <Skeleton
                height={['2rem', '3rem']}
                bgGradient={`linear(to-l, #FF1C97, #FFBB52 60%)`}
                width='70%'
                borderRadius={'10px'}
              />
              <Skeleton height='1.25rem' width='20%' borderRadius={'10px'} />
            </Flex>

            <Flex
              flexDirection={'column'}
              alignItems='center'
              gap={'1rem'}
              maxWidth='20rem'
              mx='auto'
            >
              <Skeleton mt={2} mb={0} height={['1rem']} width='4rem' />
              <Grid
                templateColumns={['repeat(3, 1fr)']}
                width='100%'
                gap={3}
                maxW='40rem'
              >
                {[0, 1, 2].map((v, i) => (
                  <GridItem key={`${v}-${i}`}>
                    <Stack alignItems='center'>
                      <Skeleton width={['50%', '60%']} height='0.5rem' />
                      <Skeleton width={['60%', '70%']} height='.75rem' />
                    </Stack>
                  </GridItem>
                ))}
              </Grid>
            </Flex>

            <Center mt={'2.5rem'}>
              <Skeleton rounded='10px' height='2.5rem' width='10rem' />
            </Center>
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  )
}
