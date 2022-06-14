/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react'
import { Box, Text, Center, Heading, Divider, Fade, ScaleFade, Slide, SlideFade, useDisclosure, Button } from '@chakra-ui/react'

export default function AnNFT({ nft }: any) {
  console.log()

  useEffect(() => {
    console.log(nft)
  }, [])

  return (
    <Box p='4'>
      <Center>
        <Box borderWidth='1px' borderRadius='lg' overflow='hidden' bgColor='#4D5159' color='white'>
          <img height='300px' src={nft.image} alt={nft.description || nft.name} />
          <Box p='2.5'>
            <Heading lineHeight='tight' size='lg' isTruncated>
              {nft.name}
            </Heading>
            <Heading size='md'>{nft.symbol}</Heading>
            <Divider />
            <Box></Box>
            <Divider />
            <Box>{nft.description}</Box>
          </Box>
        </Box>
      </Center>
    </Box>
  )
}
