import {
  Box,
  Container,
  Heading,
  Image,
  Stack,
  Text
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
          display={'flex'}
          textAlign={{ base: 'center', md: 'start' }}
          lineHeight={1.1}
          fontFamily={'Montserrat, sans-serif'}
          fontWeight={700}
          fontSize={{ base: '4xl', md: '5xl', lg: '6xl', xl: '7xl' }}
          textShadow={'0px 17px 18px rgba(0,0,0,0.25);'}
          position='relative' zIndex='1'
          width={'100%'}
        >
          <Text as={'span'} color={'white'} fontSize={{ base: '5xl', md: '5xl', lg: '7xl' }} fontWeight={700}>
            NUKED
            {' '}<Text className='outline2' as={'span'} color={'transparent'} fontSize={{ base: '5xl', md: '5xl', lg: '7xl' }} fontWeight={700}>
              APES
            </Text>
          </Text>
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

        <Stack direction={{ base: 'column', sm: 'row' }} spacing='1rem' maxWidth='40rem' margin='2rem auto'>
          <GradientButton
            width='100%'
            onClick={() => window.location.href = ('/rescue')}
          >
            Rescue your Ape
          </GradientButton>

          <GradientButton
            gradientDirection='left'
            width='100%'
            onClick={() => window.open('https://magiceden.io/marketplace/nuked_apes')}
          >
            Get one
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
  )
}

function useNavigate() {
  throw new Error('Function not implemented.')
}

