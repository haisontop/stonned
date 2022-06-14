import { Heading, Text, Box } from '@chakra-ui/react'
import React from 'react'
import TeamCarousel from './TeamCarousel'
import { IoMdHeart } from 'react-icons/io'

export default function Team() {
  return (
    <Box id='team' paddingY='1rem' bg={'#FAFAFA'}>
      <Heading
        fontSize='4xl'
        fontWeight={700}
        fontFamily={'Montserrat, sans-serif'}
        textAlign='center'
        mt='70px'
      >
        <Text as={'span'} color={'#181430'} fontWeight={700} fontSize='4xl'>
          MEET THE{' '}
          <Text
            as={'span'}
            color={'white'}
            fontWeight={700}
            fontSize='4xl'
            textShadow='-1px -1px 0 #181430, 1px -1px 0 #181430, -1px 1px 0 #181430, 1px 1px 0 #181430'
          >
            TEAM
          </Text>{' '}
        </Text>
      </Heading>

      <Box m='0 auto' mt='70px' maxWidth='1600px'>
        <TeamCarousel />
      </Box>
      <Text
        color='#888'
        fontSize='0.75rem'
        textAlign='center'
        mt='2rem'
        mb='1rem'
        transition='all .15s ease-in-out'
        _hover={{
          svg: {
            color: 'red',
          },
        }}
      >
        Created with{' '}
        <Box display='inline'>
          <IoMdHeart
            style={{ display: 'inline', transition: 'all .15s ease-in-out' }}
          />
        </Box>{' '}
        in Germany, Austria and all over the world.
      </Text>
    </Box>
  )
}
