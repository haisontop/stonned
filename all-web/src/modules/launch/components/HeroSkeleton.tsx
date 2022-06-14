import {
  Box,
  Container,
  Grid,
  GridItem,
  HStack,
  Stack,
  Skeleton,
} from '@chakra-ui/react'
import React from 'react'

export default function LaunchHeroSkeleton() {
  return (
    <Container
      h='auto'
      pt={['2rem', '4rem']}
      pb={['1rem']}
      pos='relative'
      maxWidth='82rem'
      px={0}
    >
      <Container
        width='100%'
        mt={['1.5rem', '2rem', '2rem']}
        maxW='100%'
        px={0}
      >
        <Stack spacing={[4, 4, 8]} alignItems='center'>
          <Stack width={'100%'} alignItems='center'>
            <Skeleton
              width={['80%', '50%', '30%']}
              height={['1.5rem', '2rem', '3rem']}
            />
          </Stack>
          <HStack
            width='100%'
            justifyContent={'center'}
            gap={[2, 3, 4]}
            flexWrap='wrap'
          >
            <Skeleton
              width='6rem'
              height={['0.8rem', '1.8rem']}
              borderRadius={'10px'}
            />
            <Skeleton
              width='6rem'
              height={['0.8rem', '1.8rem']}
              borderRadius={'10px'}
            />
          </HStack>
          <Grid
            templateColumns={['repeat(4, 1fr)']}
            width='100%'
            gap={3}
            maxW='40rem'
          >
            {[0, 1, 2, 3].map((v, i) => (
              <GridItem key={`${v}-${i}`}>
                <Stack alignItems='center'>
                  <Skeleton width={['80%', '90%']} height='0.5rem' />
                  <Skeleton width={['90%', '100%']} height='.75rem' />
                </Stack>
              </GridItem>
            ))}
          </Grid>

          <Box width={['92%', '80%']} maxW='30rem'>
            <Skeleton height='1rem' borderRadius={'10px'} />
          </Box>

          <Box width={['70%', '50%']} maxW='18.75rem'>
            <Skeleton height='2.5rem' borderRadius={'5px'} />
          </Box>
        </Stack>
        <Grid
          templateColumns={['repeat(4, 1fr)']}
          width='100%'
          gap={3}
          mt='1rem'
        >
          {[0, 1, 2, 3].map((v, i) => (
            <GridItem key={`${v}-${i}`}>
              <Skeleton width={'100%'} height={['4rem', '10rem', '18rem']} />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Container>
  )
}
