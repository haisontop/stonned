import {
  Box,
  Button,
  Container,
  HStack,
  Image,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'

export default function NoWin() {
  return (
    <Container
      justifyContent={'center'}
      mt='1rem'
      py={[6, 8, 12]}
      maxW='container.xl'
    >
      <Stack spacing={[4, 6, 8]} justifyContent='center' alignItems={'center'}>
        <Text
          color='white'
          textAlign={'center'}
          fontSize={['2rem', '2.5rem']}
          fontWeight={700}
        >
          <Text
            textAlign={'center'}
            fontSize={['1rem', '1rem', '1.25rem']}
            fontWeight={700}
            color='#FF9E0A'
          >
            Dont worry
          </Text>
          Better Luck next Time
        </Text>
        <Text
          color='#fff'
          fontSize={['.75rem', '.75rem', '1rem']}
          fontWeight={600}
          border='2px solid #fff'
          borderRadius={'10px'}
          width='fit-content'
          px={6}
          py={1}
        >
          No Wins
        </Text>
      </Stack>
    </Container>
  )
}
