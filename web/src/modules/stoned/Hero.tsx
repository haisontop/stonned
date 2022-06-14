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
import { MotionBox } from '../../components/Utilities'
import Info from './CTA'

const spring = {
  type: 'spring',
  damping: 10,
  stiffness: 100,
}

export default function Hero() {
  return (
    <Container
      minHeight={{base:'400px', md: '800px'}}
      pt={['25%', '10%', '5%']}
      height={[490, '650px', '700px', '100vh']}
      maxWidth='1920px'
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
          display={'flex'}
          textAlign={{ base: 'center', md: 'start' }}
          lineHeight={1.1}
          fontFamily={'Montserrat, sans-serif'}
          fontWeight={700}
          fontSize={{ base: '4xl', md: '5xl', lg: '6xl', xl: '7xl' }}
          textShadow={'0px 17px 18px rgba(0,0,0,0.25);'}
          position='relative'
          zIndex='1'
        >
          <Text
            as={'span'}
            color={'#181430'}
            fontWeight={700}
            fontSize={{ base: '4xl', md: '5xl', lg: '6xl', xl: '7xl' }}
          >
            STONED APE CREW
          </Text>
          <Image
            borderRadius='18px'
            src='/images/can.svg'
            width={{ base: '30px', md: '44px' }}
            height={{ base: '36px', md: '54px' }}
            position='absolute'
            top={{ base: '-30%', md: '-30%' }}
            left={{ base: '41%', md: '41%' }}
          />
        </Heading>

        <Heading
          fontSize='md'
          fontFamily={'Poppins, sans-serif'}
          fontWeight={500}
          textAlign='center'
          color={'#181430'}
          mt='37px'
          position='relative'
          zIndex='1'
        >
          NFTs, Cannabis Lifestyle Brand & Web3 Tech Revolution
        </Heading>
        <Info />
        <MotionBox
          key='n'
          maxWidth={{base: '100vw', sm: '80vw', md: '80vw', lg: '70vw', xl: '70vw'}}
          position='absolute'
          zIndex='0'
          bottom={{base:'-20px', sm:'-40px', md: '-50px', lg: '0px'}}
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: spring }}
        >
          <Image 
            src='/images/Apes.png' 
            margin='0 auto' 
          />
          
        </MotionBox>
      </Stack>
    </Container>
  )
}
