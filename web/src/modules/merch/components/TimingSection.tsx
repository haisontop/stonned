import {
  Container,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { differenceInSeconds } from 'date-fns'
import React, { useContext, useState } from 'react'
import { useInterval } from 'react-use'
import { merchConfig } from '../merchConfig'
import { MerchDropContext, MerchDropStatus } from '../MerchDropContextProvider'

interface TimingSectionProps {
  isSoldOut?: boolean
}

export default function TimingSection(props: TimingSectionProps) {
  const { status } = useContext(MerchDropContext)
  const isSoldOut = status === MerchDropStatus.SOLD_OUT

  const [countdown, setCountdown] = useState<any>({})

  useInterval(() => {
    const wholeSeconds = differenceInSeconds(
      merchConfig.saleStart,
      new Date()
    )
    const hours = Math.floor(wholeSeconds / 3600)
    const minutes = Math.floor((wholeSeconds - hours * 3600) / 60)
    const seconds = Math.floor(wholeSeconds - (hours * 3600 + minutes * 60))

    setCountdown({
      hours,
      minutes,
      seconds,
    })
  }, 1000)

  return (
    <Container maxW={'834px'}>
      {!isSoldOut && (
        <Grid
          mt={8}
          width='100%'
          mx={'auto'}
          templateColumns='repeat(3, 1fr)'
          border='1px solid #000000'
          borderRadius='20px'
          p={2}
        >
          <GridItem borderRight={'1px solid black'}>
            <Stack textAlign={'center'}>
              <Text>Hours</Text>
              <Text>{countdown.hours}</Text>
            </Stack>
          </GridItem>
          <GridItem borderRight={'1px solid black'}>
            <Stack textAlign={'center'}>
              <Text>Minutes</Text>
              <Text>{countdown.minutes}</Text>
            </Stack>
          </GridItem>
          <GridItem>
            <Stack textAlign={'center'}>
              <Text>Seconds</Text>
              <Text>{countdown.seconds}</Text>
            </Stack>
          </GridItem>
        </Grid>
      )}

      <HStack justifyContent={'center'} mt={8}>
        <Stack textAlign={'center'}>
          <Text
            fontSize={[24]}
            lineHeight={['36px']}
            fontWeight={600}
            color='#A0A0A0'
          >
            Start
          </Text>
          <Text fontSize={[24]} lineHeight={['36px']} fontWeight={600}>
            06/03/2022 9PM UTC
          </Text>
        </Stack>
        {/*  <Stack textAlign={'center'}>
          <Text
            fontSize={[24]}
            lineHeight={['36px']}
            fontWeight={600}
            color='#A0A0A0'
          >
            Swap Start
          </Text>
          <Text fontSize={[24]} lineHeight={['36px']} fontWeight={600}>
            06/03/2022 9PM UTC
          </Text>
        </Stack> */}
      </HStack>
    </Container>
  )
}
