import React from 'react'
import {
  Container,
  Box,
  ChakraProvider,
  Heading,
  Flex,
  Button,
  Link,
} from '@chakra-ui/react'

export default function LaunchHeroTitle() {
  return (
    <Heading
      mt={['1rem', '2.5rem']}
      fontSize={['2rem', '2rem', '3rem']}
      fontWeight='400'
      color={'#fff'}
      maxWidth='48rem'
      css={{
        '& > span': {
          fontWeight: 900,
        },
      }}
    >
      <span>All Launch</span> is a Solana NFT
      <br />
      Launchpad{' '}
      <span>
        for secure, smooth
        <br /> and social mints
      </span>
      .
    </Heading>
  )
}
