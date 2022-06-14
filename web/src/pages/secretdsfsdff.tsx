import React from 'react'
import { useState } from 'react'
import { Box, useInterval } from '@chakra-ui/react'
import { stakingProgramId } from '../config/config'
import { useRouter } from 'next/dist/client/router'
import Countdown from 'react-countdown'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

console.log('programId', stakingProgramId.toBase58())

const end = new Date(Date.parse('10 Feb 2022 21:30:00 GMT'))

const Verify = () => {
  const [countdown, setCountdown] = useState(new Date())
  const router = useRouter()

  useInterval(() => {
    if (new Date().getTime() > end.getTime())
      router.push('https://bit.ly/getnukedweek')
  }, 1000)

  return (
    <Box
      height='100vh'
      display='flex'
      justifyContent='center'
      alignItems={'center'}
      backgroundColor={'#000'}
    >
      <Box fontSize={['60px', '100px', '150px']} color={'white'}>
        <Countdown date={end} />
      </Box>
    </Box>
  )
}
export default Verify
