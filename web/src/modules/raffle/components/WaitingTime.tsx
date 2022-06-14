import { Grid, GridItem, Stack, Text } from '@chakra-ui/react'
import { differenceInSeconds } from 'date-fns'
import React, { useState } from 'react'
import { useInterval } from 'react-use'
import { useActiveLottery } from '../lotteryHooks'
import { getActiveLottery } from '../lotteryUtils'
import { RaffleType } from '../type'

interface WaitingTimeProps {
  endDate: Date
}

export default function WaitingTime({ endDate }: WaitingTimeProps) {
  const [countdown, setCountdown] = useState<any>({})
  useInterval(() => {
    const wholeSeconds = differenceInSeconds(endDate, new Date())

    if (wholeSeconds < 0)
      return setCountdown({
        hours: 0,
        minutes: 0,
        seconds: 0,
      })

    const hours = Math.floor(wholeSeconds / 3600)
    const minutes = Math.floor((wholeSeconds - hours * 3600) / 60)
    const seconds = Math.floor(wholeSeconds - (hours * 3600 + minutes * 60))

    setCountdown({
      hours,
      minutes,
      seconds,
    })
  }, 1000)

  const renderTimeSection = (label: string, value: number) => {
    return (
      <Stack textAlign={'center'} spacing='0'>
        <Text
          color='#fff'
          fontSize={['1.5rem']}
          lineHeight={['1.55rem']}
          fontWeight='bold'
          fontFamily='Montserrat'
        >
          {value}
        </Text>
        <Text color='rgba(255,255,255,0.7)' fontSize={['.875rem']}>
          {label}
        </Text>
      </Stack>
    )
  }

  return (
    <Grid mt={2} mx={'auto'} templateColumns='repeat(3, 1fr)' p={1}>
      <GridItem>{renderTimeSection('Hours', countdown.hours)}</GridItem>
      <GridItem>{renderTimeSection('Minutes', countdown.minutes)}</GridItem>
      <GridItem>{renderTimeSection('Seconds', countdown.seconds)}</GridItem>
    </Grid>
  )
}
