import {
  Box,
  Container,
  Heading,
  Image,
  Stack,
} from '@chakra-ui/react'
import React from 'react'
import { GradientButton } from '../../components/GradientButton'

export default function NukedHero() {

  return (
  <Container h={['90vh', '100vh']} pt={['8rem', '10rem']} pos='relative' maxWidth='unset' >

    <Box
      position='absolute'
      zIndex='100'
      left='50%'
      transform='translateX(-50%)'
    >
      <Heading
        textAlign={'center'}
        lineHeight={1.1}
        fontWeight={700}
        fontSize={{ base: '5xl', md: '5xl', lg: '7xl', xl: '8xl' }}
        color={'white'}
        textShadow={'2px 2px 2px rgba(0,0,0,0.9);'}
        as='h1'
      >
          NUKED APES
      </Heading>
          
      <Heading
        fontSize='md'
        fontWeight={400}
        textAlign='center'
        color={'white'}
        textShadow={'1px 1px 2px rgba(0,0,0,0.9);'}
        margin='1.5rem 0'
      >
        From the people who brought you Stoned Ape Crew
      </Heading>

      <Stack direction={{base: 'column', sm: 'row'}} spacing='1rem' maxWidth='40rem' margin='2rem auto'>
        <GradientButton 
          width='100%'
          onClick={() => window.location.href=('/rescue')}
        >
          Rescue your Ape
        </GradientButton>

        <GradientButton 
          gradientDirection='left'
          width='100%'
          onClick={() => window.location.href=('#mint')}
        >
          Mint now
        </GradientButton>
      </Stack>
    </Box>

    <Image 
      src='images/hero-nuked-apes.png' 
      pos='absolute'
      bottom='0' 
      left='50%'
      transform='translateX(-50%)'
      width='90%' 
      maxWidth='90rem' 
      zIndex='1'
    >
    </Image>

  </Container>
  )}

function useNavigate() {
  throw new Error('Function not implemented.')
}

