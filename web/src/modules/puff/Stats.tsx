import React, { FC } from 'react'
import {
  chakra,
  Box,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
  BoxProps,
} from '@chakra-ui/react'
import PuffPanel from '../analytics/PuffPanel'

type PuffStatsProps = BoxProps & {}

const PuffStats: FC<PuffStatsProps> = () => {
  return (
    <Stack
      zIndex={1}
      overflowY={'visible'}
      id='stats'
      spacing={'2rem'}
      paddingY='2rem'
    >
      <Heading textAlign={'center'} fontSize='3xl' fontWeight='800' fontFamily={'body'} lineHeight={'40px'}>
        Stats
      </Heading>

      <Box position={'relative'}>
        <PuffPanel
          color='white'
          additionalDataBoxProps={{
            shadow: 'lg',
            rounded: 'lg',
            backdropFilter: 'blur(12px)',
            p: '4',
            border: 'none',
            boxShadow: 'inset 0px 4px 32px rgba(255, 255, 255, 0.18)',
            _hover: {
              boxShadow:
                'inset 0px 4px 32px rgba(255, 255, 255, 0.18), 0 2px 12px -2px rgba(134, 118, 255, 0.4)',
              border: 'none',
            },
            background: '#131737',
          }}
        ></PuffPanel>

        <Box
          position='absolute'
          background='linear-gradient(169.21deg, rgba(144, 0, 211, 0.28) 8%, rgba(75, 115, 254, 0.28) 115.65%)'
          filter='blur(120px)'
          width='60vw'
          height='180px'
          top='220px'
          zIndex={-1}
          transform={'rotate(45deg)'}
        ></Box>
      </Box>
    </Stack>
  )
}

export default PuffStats
