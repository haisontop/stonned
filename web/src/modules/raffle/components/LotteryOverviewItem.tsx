import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useInterval,
} from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'
import AliceCarousel from 'react-alice-carousel'
import { RaffleType } from '../type'
import WaitingTime from './WaitingTime'

const handleDragStart = (event: any) => event.preventDefault()

function Property({ heading, value }: { heading: string; value: string }) {
  return (
    <Text color='#fff' textAlign='center'>
      <Text opacity='.7' fontSize='.875rem'>
        {heading}
      </Text>
      <Text as='span' opacity={'1'} fontSize='1rem' fontWeight='600'>
        {value}
      </Text>
    </Text>
  )
}

const boxWidth = [280, 280, 280, 290]

export type LotteryOverviewItemProps = {
  raffle: RaffleType
}
export default function LotteryOverviewItem({
  raffle,
}: LotteryOverviewItemProps) {
  const [isActive, setActive] = useState(
    new Date().getTime() < raffle.endDate.getTime()
  )

  useInterval(() => {
    setActive(new Date().getTime() < raffle.endDate.getTime())
  }, 60)

  return (
    <Link href={`/lucky-dip/${raffle.publicKey.toBase58()}`}>
      <Box
        textAlign='center'
        borderRadius='10px'
        boxShadow='0px 4px 20px rgba(0, 0, 0, 0.4)'
        width={boxWidth}
        mx='auto'
        paddingY='1rem'
        transition='.15s all ease-in-out'
        _hover={{
          cursor: 'pointer',
          boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.7)',
        }}
        // TODO: add special borders if participated or won
      >
        {/* TODO: if multiple prizes */}
        <AliceCarousel
          disableDotsControls
          disableButtonsControls
          items={raffle.prices.map((price) => (
            <Box filter={isActive ? '' : 'grayscale(100%)'}>
              <Image
                onDragStart={handleDragStart}
                src={price.image}
                borderRadius='10px'
                filter='brightness(90%)'
                width={boxWidth.map((w) => w - 40)}
                height='260px'
                objectFit='cover'
                mx='auto'
              />
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

        {/* total prize value, number of prizes, endig time / ended, tickets sold */}
        <Box>
          <SimpleGrid columns={1} mt='1rem' mb='.5rem'>
            <Property
              heading='Pot Value'
              value={`${raffle.prices.length} Prize(s)`}
            ></Property>
           {/*  <Property
              heading='Prizes'
              value={`${raffle.prices.length}`}
            ></Property> */}
          </SimpleGrid>
          <Property
            heading='Tickets Sold'
            value={`${raffle.ticketCount} tickets sold`}
          ></Property>
          {raffle.hasEnded && (
            <Text
              my='1rem'
              color='#fff'
              opacity='.5'
              textAlign='center'
              fontWeight='600'
            >
              Dip closed
              <Text>{raffle.prices.length} Winners 🎉</Text>
            </Text>
          )}
          {!raffle.hasEnded && (
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
        </Box>
      </Box>
    </Link>
  )
}

export const LotteryOverViewItemSkeleton = () => {
  return (
    <Box
      borderRadius='10px'
      boxShadow='0px 4px 20px rgba(0, 0, 0, 0.4)'
      width={boxWidth}
      padding='1rem'
      overflow={'hidden'}
    >
      <Skeleton width={'100%'} height='14.4rem' borderRadius={'10px'} />
      <Stack spacing={'1rem'} mt='1rem'>
        <Flex justifyContent={'space-between'} width={'100%'}>
          <Center flexDirection={'column'} gap='0.5rem' flexGrow={1}>
            <Skeleton height='.75rem' width='60%' borderRadius={'10px'} />
            <Skeleton height='1rem' width='65%' borderRadius={'10px'} />
          </Center>
          <Center flexDirection={'column'} gap='0.5rem' flexGrow={1}>
            <Skeleton height='.75rem' width='50%' borderRadius={'10px'} />
            <Skeleton height='1rem' width='25%' borderRadius={'10px'} />
          </Center>
        </Flex>
        <Center flexDirection={'column'} gap='0.5rem'>
          <Skeleton height='.9rem' width='40%' />
          <Skeleton height='1.2rem' width='60%' />
        </Center>
        <Center>
          <Skeleton height='0.75rem' width='4rem' />
        </Center>
        <Grid templateColumns={['repeat(3, 1fr)']} width='100%' gap={3}>
          {[0, 1, 2].map((v, i) => (
            <GridItem key={`${v}-${i}`}>
              <Stack alignItems='center'>
                <Skeleton
                  width={['50%', '60%']}
                  height='1rem'
                  borderRadius={'10px'}
                />
                <Skeleton
                  width={['60%', '70%']}
                  height='.75rem'
                  borderRadius={'10px'}
                />
              </Stack>
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Box>
  )
}
