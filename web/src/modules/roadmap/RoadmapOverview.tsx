import { Box, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { Roadmap } from './types'

interface RoadmapOverviewProps {
  roadmap: Roadmap
}

export default function RoadmapOverview(props: RoadmapOverviewProps) {
  const { roadmap } = props

  return (
    <Box>
      <Box>
        <Heading
          color='#000'
          fontWeight={700}
          as='h1'
          fontSize={{ base: '2rem', lg: '2.5rem' }}
          transition='all .2s ease-in-out'
        >
          hello
        </Heading>
      </Box>
    </Box>
  )
}
