import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'

export const ArtPlaceholderCard = () => {
  return (
    <Box
      height={['6.6rem']}
      bgColor='#C4C4C4'
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <Text as='h3' fontSize='20px' fontWeight='bold'>
        Art
      </Text>
    </Box>
  )
}

export default function OurJourney() {
  return (
    <Box mt={['2rem', '10.25rem', '10.25rem']} mb='9rem'>
      <Text
        as='h1'
        color='#000'
        fontWeight={700}
        textAlign='center'
        fontSize={{ base: '1rem', lg: '1.5rem' }}
        transition='all .2s ease-in-out'
        mb='2.5rem'
      >
        Our Journey
      </Text>
      <Stack
        display={['block', 'flex']}
        justifyContent='space-around'
        direction='row'
        h='100%'
        mt='6rem'
        p={4}
      >
        <Grid templateColumns='repeat(1, 1fr)' rowGap='31rem' py='310px'>
          <GridItem>
            <Grid templateColumns='repeat(1, 1fr)' rowGap='11.125rem'>
              <GridItem>
                <Box
                  backgroundColor='lightGery'
                  pt='3rem'
                  px='2.563rem'
                  pb='1.438rem'
                  borderRadius='md'
                >
                  <Text as='p' fontSize='1.25rem' fontWeight='semibold'>
                    Pre-Mint Airdrops
                  </Text>
                  <Text
                    as='p'
                    fontSize='0.875rem'
                    textColor='noneDark'
                    mt='0.50rem'
                  >
                    The greatest flex at the time.
                  </Text>
                </Box>
                <Box
                  backgroundColor='lightGery'
                  pt='3rem'
                  px='2.563rem'
                  pb='1.438rem'
                  borderRadius='md'
                  mt='2rem'
                >
                  <Text as='p' fontSize='1.25rem' fontWeight='semibold'>
                    Holder Verification Tool
                  </Text>
                  <Text
                    as='p'
                    fontSize='0.875rem'
                    textColor='noneDark'
                    mt='0.50rem'
                  >
                    To make sure our community is safe.
                  </Text>
                </Box>
              </GridItem>
              <GridItem>
                <Box
                  backgroundColor='lightGery'
                  pt='3rem'
                  px='2.563rem'
                  pb='1.438rem'
                  borderRadius='md'
                >
                  <Text as='p' fontSize='1.25rem' fontWeight='semibold'>
                    Donation to MAPS.org
                  </Text>
                  <Text
                    as='p'
                    fontSize='0.875rem'
                    textColor='noneDark'
                    mt='0.50rem'
                  >
                    To make sure our community is safe.
                  </Text>
                </Box>
                <Box
                  backgroundColor='lightGery'
                  pt='3rem'
                  px='2.563rem'
                  pb='1.438rem'
                  borderRadius='md'
                  mt='2rem'
                >
                  <Text as='p' fontSize='1.25rem' fontWeight='semibold'>
                    StonedDAO <br /> + 4 Role DAOs
                  </Text>
                  <Text
                    as='p'
                    fontSize='0.875rem'
                    textColor='noneDark'
                    mt='0.50rem'
                  >
                    Community = Everything
                  </Text>
                </Box>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem>
            <Grid templateColumns='repeat(1, 1fr)' rowGap='11.125rem'>
              <GridItem>
                <Box
                  backgroundColor='lightGery'
                  pt='3rem'
                  px='2.563rem'
                  pb='1.438rem'
                  borderRadius='md'
                >
                  <Text as='p' fontSize='1.25rem' fontWeight='semibold'>
                    $PUFF Utilities
                  </Text>
                  <Text
                    as='p'
                    fontSize='0.875rem'
                    textColor='noneDark'
                    mt='0.50rem'
                  >
                    Solcasino, LP Lending, Listion on Orca
                  </Text>
                </Box>
                <Box
                  backgroundColor='lightGery'
                  pt='3rem'
                  px='2.563rem'
                  pb='1.438rem'
                  borderRadius='md'
                  mt='2rem'
                >
                  <Text as='p' fontSize='1.25rem' fontWeight='semibold'>
                    Burning 10M $PUFF
                  </Text>
                  <Text
                    as='p'
                    fontSize='0.875rem'
                    textColor='noneDark'
                    mt='0.50rem'
                  >
                    ...through on-chain utilites
                  </Text>
                </Box>
              </GridItem>
              <GridItem>
                <Box
                  backgroundColor='lightGery'
                  pt='3rem'
                  px='2.563rem'
                  pb='1.438rem'
                  borderRadius='md'
                >
                  <Text as='p' fontSize='1.25rem' fontWeight='semibold'>
                    First SAC Appareal Drop
                  </Text>
                  <Text
                    as='p'
                    fontSize='0.875rem'
                    textColor='noneDark'
                    mt='0.50rem'
                  >
                    ofc fully payable in $PUFF
                  </Text>
                </Box>
                <Box
                  backgroundColor='lightGery'
                  pt='3rem'
                  px='2.563rem'
                  pb='1.438rem'
                  borderRadius='md'
                  mt='2rem'
                >
                  <Text as='p' fontSize='1.25rem' fontWeight='semibold'>
                    Lucky Dip
                  </Text>
                  <Text
                    as='p'
                    fontSize='0.875rem'
                    textColor='noneDark'
                    mt='0.50rem'
                  >
                    fully on-chain raffles with tickets <br /> available in
                    $PUFF, $ALL and SOL
                  </Text>
                </Box>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
        <Grid templateColumns='repeat(1, 1fr)' rowGap='15rem'>
          <GridItem>
            <Box
              backgroundColor='lightGery'
              px='2rem'
              py='1.60rem'
              borderRadius='md'
            >
              <ArtPlaceholderCard />
              <Box w='100%' mx='auto' mt='2.80rem'>
                <Text as='h5' fontSize='1.25rem' fontWeight='semibold'>
                  The team gets together
                </Text>
                <Text
                  fontSize='14px'
                  fontWeight='medium'
                  mt='0.72rem'
                  textColor='noneDark'
                >
                  ABO + PFO + MTS + CFO + BCM <br /> Lorem ipsum
                </Text>
              </Box>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              backgroundColor='lightGery'
              px='2rem'
              py='1.60rem'
              borderRadius='md'
            >
              <ArtPlaceholderCard />
              <Box w={['100%', '16.25rem']} mx='auto' mt='2.80rem'>
                <Text as='h5' fontSize='1.25rem' fontWeight='semibold'>
                  The OG Collection: SAC
                </Text>
                <Text
                  fontSize='14px'
                  fontWeight='medium'
                  mt='0.72rem'
                  textColor='noneDark'
                >
                  Stoned Ape Crew is born on 28th of November with a genesis
                  collection of 4200 Apes. Sold out in 2 minutes.
                </Text>
              </Box>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              backgroundColor='lightGery'
              px='2rem'
              py='1.60rem'
              borderRadius='md'
            >
              <ArtPlaceholderCard />
              <Box w={['100%', '16.25rem']} mx='auto' mt='2.80rem'>
                <Text as='h5' fontSize='1.25rem' fontWeight='semibold'>
                  Staking for $PUFF
                </Text>
                <Text
                  fontSize='14px'
                  fontWeight='medium'
                  mt='0.72rem'
                  textColor='noneDark'
                >
                  Stoned Ape Crew is born on 28th of November with a genesis
                  collection of 4200 Apes. Sold out in 2 minutes.
                </Text>
              </Box>
            </Box>
            <Box
              backgroundColor='lightGery'
              px='2rem'
              py='1.60rem'
              borderRadius='md'
              marginTop='1.813rem'
            >
              <ArtPlaceholderCard />
              <Box w={['100%', '16.25rem']} mx='auto' mt='2.80rem'>
                <Text as='h5' fontSize='1.25rem' fontWeight='semibold'>
                  First-Ever NFT Evolution Process
                </Text>
                <Text
                  fontSize='14px'
                  fontWeight='medium'
                  mt='0.72rem'
                  textColor='noneDark'
                >
                  Stoned Ape Crew is born on 28th of November with a genesis
                  collection
                </Text>
              </Box>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              backgroundColor='lightGery'
              px='2rem'
              py='1.60rem'
              borderRadius='md'
            >
              <ArtPlaceholderCard />
              <Box w={['100%', '16.25rem']} mx='auto' mt='2.80rem'>
                <Text as='h5' fontSize='1.25rem' fontWeight='semibold'>
                  Nuked Apes
                </Text>
                <Text
                  fontSize='14px'
                  fontWeight='medium'
                  mt='0.72rem'
                  textColor='noneDark'
                >
                  Our second collection, created to celebrate the art and our
                  holders.
                </Text>
              </Box>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              backgroundColor='lightGery'
              px='2rem'
              py='1.60rem'
              borderRadius='md'
            >
              <ArtPlaceholderCard />
              <Box w={['100%', '16.25rem']} mx='auto' mt='2.80rem'>
                <Text as='h5' fontSize='1.25rem' fontWeight='semibold'>
                  ALL Blue
                </Text>
                <Text
                  fontSize='14px'
                  fontWeight='medium'
                  mt='0.72rem'
                  textColor='noneDark'
                >
                  Web3 SaaS, Incubator & NFT <br /> Launchpad
                </Text>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  )
}
