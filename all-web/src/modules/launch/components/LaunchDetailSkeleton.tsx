import {
  Container,
  Skeleton,
  Grid,
  GridItem,
  SimpleGrid,
  Stack,
  HStack,
  SkeletonText,
  SkeletonCircle,
  Box,
  Flex,
} from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/system'

export const LaunchDetailSkeleton = () => {
  const cardBg = useColorModeValue('#fff', '#101011')

  return (
    <div>
      <Container width='100vw' maxW='100vw' pos='relative' padding='0 2rem'>
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            'repeat(3, 1fr)',
            'repeat(4, 1fr)',
          ]}
          width='100%'
          gap={3}
          mt='1rem'
        >
          <GridItem>
            <Skeleton width={'100%'} height={['16rem', '17rem', '18rem']} />
          </GridItem>
          <GridItem display={['none', 'block', 'block']}>
            <Skeleton width={'100%'} height={['16rem', '17rem', '18rem']} />
          </GridItem>
          <GridItem display={['none', 'none', 'block']}>
            <Skeleton width={'100%'} height={['16rem', '17rem', '18rem']} />
          </GridItem>
          <GridItem display={['none', 'none', 'none', 'block']}>
            <Skeleton width={'100%'} height={['16rem', '17rem', '18rem']} />
          </GridItem>
        </Grid>
      </Container>
      <Container
        maxW={'82rem'}
        my={[6, 12, 24]}
        padding={['0 2rem', '0 2rem', '0 4rem', '0 4rem']}
      >
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={[12, 24]}>
          <Stack width='100%' spacing={8}>
            <Skeleton height={['2rem', '2.5rem']} width='40%' />
            <Skeleton height={['0.5rem', '1rem']} width='30%' />
            <HStack
              width='100%'
              justifyContent={'start'}
              gap={4}
              flexWrap='wrap'
            >
              <Skeleton height={['2rem']} width='4rem' borderRadius={'5px'} />
              <Skeleton height={['2rem']} width='3rem' borderRadius={'5px'} />
            </HStack>

            <SkeletonText noOfLines={6} spacing={2} />
            <Stack
              direction='row'
              alignItems='center'
              justifyContent={{ base: 'flex-start' }}
              spacing={5}
            >
              <SkeletonCircle size='2rem' />
              <SkeletonCircle size='2rem' />
              <SkeletonCircle size='2rem' />
            </Stack>
          </Stack>
          <Box
            width={['100%']}
            mr='auto'
            mt={[0, 0, '-7rem', '-8rem']}
            order={[0, 0, 1]}
            zIndex={100}
            position={[null, null, 'sticky']}
            top='5rem'
          >
            <Box
              borderRadius={['10px', '20px']}
              boxShadow='0px 2px 20px rgba(0, 0, 0, 0.2)'
              p={['1.5rem', '2.25rem']}
              bg={cardBg}
              overflow={['auto']}
              maxW='28rem'
              mx='auto'
            >
              <Stack spacing={6}>
                <Flex justifyContent={'space-between'} alignItems='flex-end'>
                  <Skeleton height='1.5rem' width='8rem' />
                  <Skeleton height='1rem' width='4rem' borderRadius={'5px'} />
                </Flex>
                <Stack spacing={1}>
                  <Flex justifyContent='space-between' alignItems='center'>
                    <Skeleton width='6rem' height='0.5rem' />
                    <Skeleton width='6rem' height='0.5rem' />
                  </Flex>
                  <Skeleton height={'1rem'} width='100%' borderRadius={'5px'} />
                </Stack>
                <Grid
                  templateColumns={['repeat(3, 1fr)']}
                  width='100%'
                  gap={3}
                  maxW='40rem'
                >
                  {[0, 1, 2].map((v, i) => (
                    <GridItem key={`${v}-${i}`}>
                      <Stack alignItems='center'>
                        <Skeleton width={['50%', '60%']} height='0.5rem' />
                        <Skeleton width={['60%', '70%']} height='.75rem' />
                      </Stack>
                    </GridItem>
                  ))}
                </Grid>
                <Flex
                  flexDirection={'column'}
                  alignItems='center'
                  gap='0.25rem'
                >
                  <Skeleton height='.5rem' width='4rem' />
                  <Skeleton height='.75rem' width='9rem' />
                </Flex>
                <Flex
                  flexDirection={'column'}
                  alignItems='center'
                  gap='0.25rem'
                >
                  <Skeleton height='.75rem' width='50%' />
                </Flex>
                <Skeleton width='100%' height='2.5rem' borderRadius={'5px'} />
              </Stack>

              <Stack spacing={6} mt='2rem'>
                <Flex justifyContent={'space-between'} alignItems='flex-end'>
                  <Skeleton height='1.5rem' width='8rem' />
                  <Skeleton height='1rem' width='4rem' borderRadius={'5px'} />
                </Flex>
                <Stack spacing={1}>
                  <Flex justifyContent='space-between' alignItems='center'>
                    <Skeleton width='6rem' height='0.5rem' />
                    <Skeleton width='6rem' height='0.5rem' />
                  </Flex>
                  <Skeleton height={'1rem'} width='100%' borderRadius={'5px'} />
                </Stack>
                <Grid
                  templateColumns={['repeat(3, 1fr)']}
                  width='100%'
                  gap={3}
                  maxW='40rem'
                >
                  {[0, 1, 2].map((v, i) => (
                    <GridItem key={`${v}-${i}`}>
                      <Stack alignItems='center'>
                        <Skeleton width={['50%', '60%']} height='0.5rem' />
                        <Skeleton width={['60%', '70%']} height='.75rem' />
                      </Stack>
                    </GridItem>
                  ))}
                </Grid>
                <Flex
                  flexDirection={'column'}
                  alignItems='center'
                  gap='0.25rem'
                >
                  <Skeleton height='.5rem' width='4rem' />
                  <Skeleton height='.75rem' width='9rem' />
                </Flex>
                <Flex
                  flexDirection={'column'}
                  alignItems='center'
                  gap='0.25rem'
                >
                  <Skeleton height='.75rem' width='50%' />
                </Flex>
              </Stack>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </div>
  )
}
