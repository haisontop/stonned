import React from 'react'
import {
  Box,
  Heading,
  useBreakpointValue,
  Image,
  Text,
  Stack,
  HStack,
} from '@chakra-ui/react'
import * as _ from 'lodash'

const media = [
  {
    name: 'NFTCalendar.io',
    img: '/images/nftcalendar.png',
    website: 'https://nftcalendar.io/event/stoned-ape-crew-mint/',
  },
]

export default function Media() {
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 4, xl: 6 })

  return (
    <Stack pb='2rem' spacing='2rem'>
      <Heading fontSize='5xl' fontWeight={500} textAlign='center'>
        As Seen On
      </Heading>

      <Stack>
        {_.chunk(media, columns).map((mediaChunk, i) => {
          return (
            <HStack
              key={i}
              px={{ base: '1rem', md: '1.5rem' }}
              spacing={{ md: '6' }}
              alignItems={{ base: 'flex-start', md: 'center' }}
              justifyContent='center'
            >
              {mediaChunk.map((m) => (
                <Stack
                  target='_blank'
                  as='a'
                  href={m.website}
                  p='0.5rem'
                  alignItems='center'
                  width={{ base: '160px', md: '210px' }}
                >
                  <Image
                    src={m.img}
                    height={{ base: '130px', md: '170px' }}
                    width={{ base: '130px', md: '170px' }}
                  />
                  <Text fontSize='xl' textAlign='center' fontFamily='heading'>
                    {m.name}
                  </Text>
                </Stack>
              ))}
            </HStack>
          )
        })}
      </Stack>
    </Stack>
  )
}
