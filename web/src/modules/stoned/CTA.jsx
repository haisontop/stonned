import React from 'react'
import {
  Box,
  Stack,
  Button,
} from '@chakra-ui/react'

export default function CTA() {

  return (
    <Box paddingY='3' d='flex' justifyContent='center' position='relative' zIndex='1'>
      <Box>
        <Stack paddingY='4' direction={['column', 'row']} position='relative' zIndex='1'>
          <Button
            bg='transparent'
            border='2px solid #181430'
            borderRadius='46px'
            color='#181430'
            _hover={{
              boxShadow: '1px 1px 10px #444',
              bg: "#181430",
              color: "white"
            }}
            onClick={() =>
              window &&
              window.open(
                'https://magiceden.io/marketplace/stoned_ape_crew',
                '_blank'
              )
            }
          >
            Buy on Magic Eden
          </Button>
          <Button
            display={{base: 'none', md: 'inline-block'}}
            bg='transparent'
            border='2px solid #116530'
            borderRadius='46px'
            color='#116530'
            _hover={{
              boxShadow: '1px 1px 10px #444',
              bg: "#116530",
              color: "white"
            }}
            onClick={() =>
              window &&
              window.open(
                'https://docs.stonedapecrew.com/',
                '_blank'
              )
            }
          >
            Read the whitepaper
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
