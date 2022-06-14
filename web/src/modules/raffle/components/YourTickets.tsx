import {
  Box,
  BoxProps,
  Container,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { useActiveLottery, useLotteryUser, useLotteryUserForRaffle } from '../lotteryHooks'
import { RaffleType } from '../type'

export default function YourTickets(props: {raffle: RaffleType}) {
  const lotteryUserRes = useLotteryUserForRaffle(props.raffle)

  const { data: lotteryUser } = lotteryUserRes

  if (!lotteryUser) return null

  return (
    lotteryUser && (
      <Container
        justifyContent={'center'}
        textAlign={'center'}
        color='white'
        py='1rem'
        mt='2rem'
      >
        <Text>Your purchased Tickets:</Text>{' '}
        <Text
          display='inline'
          bgGradient={`linear(to-l, #FF1C97, #FFBB52 60%)`}
          bgClip='text'
          fontWeight={600}
          fontSize='1.25rem'
        >
          {lotteryUser?.tickets.length} Entries
        </Text>
      </Container>
    )
  )
}
