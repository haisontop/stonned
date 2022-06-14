import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { SheetIcon } from './icons/SheetIcon'

export default function Tokenomics() {
  return (
    <Stack>
      <Grid
        templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)']}
        columnGap='5rem'
      >
        <GridItem>
          <Box position='sticky' top='6.25rem'>
            <Text fontSize={'3rem'} fontWeight={700} fontFamily='heading'>
              Tokenomics
            </Text>
            <Text
              color='#676767'
              lineHeight={2}
              mt='2.5rem'
              fontFamily='heading'
            >
              $ALL is an experiment, so the Tokenomics are subject to change. We
              have created a plan for it and want to stick to it, but in order
              to deliver the best possible results, you need to be flexible in
              your approach. The two key points are - we want to deliver as much
              value as possible to our collections & we want to maximize the
              value of ALL.
            </Text>
            <Button
              mt='1rem'
              border='unset'
              rounded={'md'}
              p='0.5rem'
              height='4rem'
            >
              <HStack>
                <SheetIcon />
                <Text color='#282936' fontWeight={400}>
                  View $ALL staking distribution
                </Text>
              </HStack>
            </Button>
          </Box>
        </GridItem>
        <GridItem>
          <Stack mt={['1rem', '7.5rem']} spacing={0}>
            <Stack
              bg='rgba(164, 101, 255, 0.2)'
              border='2px solid #A465FF'
              borderRadius={'0.5rem'}
              padding='1.875rem'
            >
              <Text fontFamily='heading' fontSize={["1.375rem"]} fontWeight={700}>Supply</Text>
              <Text fontFamily='heading'>
                The max supply of $ALL is 420,000,000. (the initial minted 12B
                will be burned down to 420M)
              </Text>
              <Text fontFamily='heading'>
                The only way to get $ALL is either by staking Stoned Apes, Nuked
                Apes or any of the collections participating in the ALL Blue
                ecosystem.
              </Text>
            </Stack>
            <Box position='relative' height='1.75rem'>
              <Box
                position={'absolute'}
                left='50%'
                height='1.75rem'
                width='2px'
                bg='#A465FF'
              ></Box>
            </Box>

            <Stack
              bg='rgba(164, 101, 255, 0.2)'
              border='2px solid #A465FF'
              borderRadius={'0.5rem'}
              padding='1.875rem'
            >
              <Text fontFamily='heading' fontSize={["1.375rem"]} fontWeight={700}>Events</Text>
              <Text fontFamily='heading'>1st: 39M (+33M</Text>
              <Text fontFamily='heading'>2nd: 72M (+29M [=33M*0.85])</Text>
              <Text fontFamily='heading'>3rd: 101M</Text>
              <Text fontFamily='heading'>...</Text>
              <Text fontFamily='heading'>
                There is a natural cap at around 250M, that's subject to change
                based on the projects onboarded. The max supply could
                potentially be burned down to 300M or less.
              </Text>
            </Stack>
            <Box position='relative' height='1.75rem'>
              <Box
                position={'absolute'}
                left='50%'
                height='1.75rem'
                width='2px'
                bg='#A465FF'
              ></Box>
            </Box>
            <Stack
              bg='rgba(164, 101, 255, 0.2)'
              border='2px solid #A465FF'
              borderRadius={'0.5rem'}
              padding='1.875rem'
            >
              <Text fontFamily='heading' fontSize={["1.375rem"]} fontWeight={700}>Halvings</Text>
              <Text fontFamily='heading'>
                Every halving will reduce the daily rewards of $ALL by 40%
              </Text>
              <Text fontFamily='heading'>
                The first halving event will happen at 39M $ALL distributed.
                After the next 33M $ALL have been distributed, the windows will
                get 15% smaller per cycle.
              </Text>
            </Stack>
          </Stack>
        </GridItem>
      </Grid>
    </Stack>
  )
}
