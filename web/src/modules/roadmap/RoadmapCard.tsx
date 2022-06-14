import { Box, Divider, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { Roadmap } from './types'

interface RoadmapCardProps {
  roadmap: Roadmap
}

export default function RoadmapCard(props: RoadmapCardProps) {
  const { roadmap } = props
  const router = useRouter()

  return (
    <Stack
      bg='#F9F9F9'
      pt={['2rem', '2rem', '5rem']}
      pb={['2rem', '2rem']}
      px='2rem'
      borderRadius={'10px'}
      cursor='pointer'
      _hover={{
        boxShadow: '2px 8px 25px 10px rgb(0 0 0 / 10%)',
      }}
    >
      <Heading
        color='#000'
        fontWeight={700}
        as='h1'
        fontSize={{ base: '1rem', md: '1.5rem' }}
        transition='all .2s ease-in-out'
      >
        hello
      </Heading>
      <HStack></HStack>
    </Stack>
  )
}
