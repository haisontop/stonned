import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'
import Ape1 from '../assets/1.jpg'
import { MotionBox } from './Utilities'

const spring = {
  type: "spring",
  damping: 10,
  stiffness: 100
}

export default function CallToActionWithVideo() {
  return (
    <Container
      minHeight='400px'
      height={[490, 580, 600, 650, 730, 900]}
      //height={{ base: '55vh', md: '90vh' }}
      maxW={'7xl'}
      zIndex={-2}
    >
      <Stack
        align={'center'}
        margin='0'
        spacing={{ base: 2 }}
        pb={{ base: 0 }}
        pt={{ base: 5 }}
        px={{ md: 6, lg: 8 }}
        direction={{ base: 'column' }}
        height='100%'
        position='relative'
      >
        <Heading
          textAlign={{ base: 'center', md: 'start' }}
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: '5xl', md: '5xl', lg: '6xl', xl: '7xl' }}
          textShadow={'2px 2px 2px rgba(0,0,0,0.9);'}
        >
          <Text as={'span'} color={'white'}>
            STONED APE CREW
          </Text>
        </Heading>
        {/*<Heading mb={0} fontWeight={600} fontSize={{ base: '3xl', md: '4xl', lg: '5xl', xl: '6xl' }}>
            Stoned Ape Crew
              </Heading>*/}
        <Heading
          fontSize='md'
          fontWeight={400}
          textAlign='center'
          color={'white'}
          textShadow={'1px 1px 2px rgba(0,0,0,0.9);'}
        >
          Stake your NFT to earn $PUFF & evolve your Apes with 4 roles 🧪🧑‍🌾🕴️🧑‍🎨
        </Heading>
        <MotionBox
          key='n'
          float='left'
          width={['90vw', , '90vw'] as any}
          margin='2%'
          position='absolute'
          bottom={{ base: '0', md: '0' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: spring }}
        >
          <Image borderRadius='18px' src='/images/sac-roles-hero.png' />
        
        {/* <Box
          w="100vw"
          h='16px'
          background='linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);'
          bottom='0'
          left="0"
          right="0"
          
        ></Box> */}
        </MotionBox>
        {/*<Stack flex={1} spacing={{ base: 4, md: 6 }} alignItems='center' alignSelf={{ md: 'start' }} mt={{ md: '2rem' }}>
          <Heading
            textAlign={{ base: 'center', md: 'start' }}
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '5xl', md: '5xl', lg: '6xl', xl: '7xl' }}
          >
            Stoned Ape Crew
            <Text
              as={'span'}
              position={'relative'}
              _after={{
                content: "''",
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'green.400',
                zIndex: -1,
              }}
            >
              STONED
            </Text>
            <br />
            <Text as={'span'} color={'green.400'}>
              APE CREW
            </Text>
          </Heading>
          <Text fontSize='xl'>
            Deflationary NFT with 4 different roles 🧪🧑‍🌾🕴🧑 <br />
            Inventors of on-chain NFT evolutions
          </Text>
          {/* <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
            <Button
              rounded={'full'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              colorScheme={'red'}
              bg={'red.400'}
              _hover={{ bg: 'red.500' }}
            >
              Get started
            </Button>
            <Button
              rounded={'full'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              
            >
              How It Works
            </Button>
          </Stack> */}
        {/*
        </Stack>
        <Flex flex={1} justify={'center'} align={'center'} position={'relative'} w={'full'}>
          <Box p={3} position={'relative'} rounded={'2xl'} width={'full'} overflow={'hidden'}>
            {['/images/stonedapes_thumbnail.jpg'].map((n) => {
              return (
                <Box
                  key='n'
                  float='left'
                  width='100%'
                  margin='4%'
                  boxShadow='rgba(56, 161, 105, 0.5) 5px 5px, rgba(56, 161, 105, 0.4) 10px 10px, rgba(56, 161, 105, 0.3) 15px 15px, rgba(56, 161, 105, 0.2) 20px 20px, rgba(56, 161, 105, 0.1) 25px 25px;'
                >
                  <Image src={n} />
                </Box>
              )
            })}

            {/* <Image alt={'stoned ape'} src={'https://media.giphy.com/media/kFqSmPiOVqx1elvgVm/giphy.gif'} /> */}
        {/*
          </Box>
        </Flex>*/}
      </Stack>
    </Container>
  )
}

export function SplitScreen() {
  return (
    <Stack direction={{ base: 'column', md: 'row' }}>
      <Flex
        px={8}
        flex={1}
        align={'center'}
        mt='-4rem'
        justify={'center'}
        textAlign='center'
      >
        <Stack spacing={4} w={'full'} maxW={'lg'} textAlign='center'>
          <Heading
            textAlign='center'
            fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
          >
            <Text
              as={'span'}
              position={'relative'}
              fontWeight={700}
              _after={{
                content: "''",
                width: 'full',
                height: useBreakpointValue({ base: '20%', md: '30%' }),
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'green.400',
                zIndex: -1,
              }}
            >
              STONED
            </Text>
            <br />{' '}
            <Text color={'green.400'} as={'span'}>
              APE CREW
            </Text>{' '}
          </Heading>
          <Text fontSize={{ base: '2xl', lg: 'xl' }} fontWeight='500'>
            Deflationary NFT with 4 different roles 🧪🧑‍🌾🕴🧑 <br />
            Inventors of on-chain NFT transformations
          </Text>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justifyContent='center'
          >
            <Button
              rounded={'full'}
              bg={'green.400'}
              color={'white'}
              _hover={{
                bg: 'primary',
              }}
            >
              PUFF PUFF
            </Button>
            {/* <Button rounded={'full'}>How It Works</Button> */}
          </Stack>
        </Stack>
      </Flex>
      <Box width='50%' p='4%' mx='1rem'>
        {[
          '/images/1.jpg',
          'https://pbs.twimg.com/media/FCkxaqoXEAki_m_?format=jpg&name=large',
          '/images/3.jpg',
          '/images/5.jpg',
        ].map((n) => {
          return (
            <Box
              key='n'
              float='left'
              width='42%'
              margin='4%'
              boxShadow='rgba(56, 161, 105, 0.4) 5px 5px, rgba(56, 161, 105, 0.3) 10px 10px, rgba(56, 161, 105, 0.2) 15px 15px, rgba(56, 161, 105, 0.1) 20px 20px, rgba(56, 161, 105, 0.05) 25px 25px;'
            >
              <Image src={n} />
            </Box>
          )
        })}

        {/* <Image alt={'stoned ape'} src={'https://media.giphy.com/media/kFqSmPiOVqx1elvgVm/giphy.gif'} /> */}
      </Box>
    </Stack>
  )
}
