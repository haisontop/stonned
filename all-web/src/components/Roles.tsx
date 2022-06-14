import { useColorModeValue } from '@chakra-ui/color-mode'
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Image,
  Stack,
  Heading,
  Text,
  Grid,
  Center,
} from '@chakra-ui/react'
import { chakra } from '@chakra-ui/system'
import React, { useState } from 'react'
import ProductSimple from './Product'

const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80'

export default function Roles() {

  return (
    <>
      <Flex
        bg={{ md: useColorModeValue('#F9FAFB', 'gray.600') }}
        p={{ base: 4, md: 5 }}
        w='full'
        /* justifyContent='center'
      alignItems='center' */
      >
        <Box
          /*  borderRadius='12px'
        shadow={{ md: 'xl' }} */
          /*  bg={useColorModeValue('white', 'gray.800')} */
          
          py={{ base: 4, md: 10 }}
          mx='auto'
        >
          <Stack spacing='1'>
            <Heading fontSize='4xl' fontWeight={500} textAlign='center'>
              4 Stoned Roles 🧪🧑‍🌾🕴️🧑‍🎨
            </Heading>

            <Grid
              templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              gap={6}
              justifyContent='start'
              grid-auto-rows='minmax(min-content, max-content)'
            >
              {/* <Sample /> */}
              <ProductSimple
                img='/images/scientist.png'
                title='Scientist'
                text='Ever had issues with your gentics or the genetics of a weed strain? No problem, the stoned ape scientist fixes this with one PUFF PUFF. Oh and have you ever heard about psychedelic bananas? No? Ahm we neither...'
              />
              <ProductSimple
                img='/images/businessman.png'
                title='BUSINESSMAN'
                text={`THE LEGENDARY BUSINESSMAN - the ape who sold weed before the fire was even discovered, telling you it will be higher in price tomorrow. He loves his suit almost as much as a good joint and describes marihuana stocks as "Jack Pot". We wonder why he is not in NFT.`}
              />
              <ProductSimple
                img='/images/farmer2.png'
                title='Farmer'
                text={`You want to grow the best sativa weed or just wanted fresh herbs in your caeser salad? In the Stoned Ape Crew, there's a role reserved for the guy who's heart is in his garden ... THE FARMER APE Monkey. The best thing is: He makes his own fertilizer.`}
              />
              <ProductSimple
                img='/images/artist.webp'
                title='Artist'
                text='What did DaVinci, Picasso and Mark Rothko had in common? If you know, you know and so is our ARTIST APE interpreting the world around on a canvas. Some rumor that the first drawing our artist genius made back in times, was from his two girls: Maria and Juana.'
              />
            </Grid>

            {/* title={
              <Text>
                Do you like to smoke{' '}
                <Text as='a' href='https://www.leafly.com/strains/mad-scientist' target='_blank' textDecoration='underline'>
                  Mad Scientist?
                </Text>
              </Text>
            }
            text={`Ever had issues with your gentics or the genetics of a weed strain? No problem, the stoned ape scientist fixes this with one PUFF PUFF. Oh and have you ever heard about psychedelic bananas? No? Ahm we neither...`}
            img='/images/ape-scientist.png'
          />
          <LeftItem
            title={'THE LEGENDARY BUSINESSMAN'}
            text={`In the Stoned Ape Crew, there's a role reserved for the most shameless of all apes. - THE LEGENDARY BUSINESSMAN - the ape who sold weed before the fire was even discovered, telling you it will be higher in price tomorrow. He loves his suit almost as much as a good joint and describes marihuana stocks as "Jack Pot". We wonder why he is not in NFT.`}
            img='/images/ape-business.png'
          />
          <LeftItem
            title={'Farmer'}
            text={`You want to grow the best sativa weed or just wanted fresh herbs in your caeser salad? In the Stoned Ape Crew, there's a role reserved for the guy who's heart is in his garden ... THE FARMER APE Monkey. The best thing is: He makes his own fertilizer.`}
            img='/images/ape-farmer.png'
          />
          <LeftItem
            title={'Artist'}
            text='What did DaVinci, Picasso and Mark Rothko had in common? If you know, you know and so is our ARTIST APE interpreting the world around on a canvas. Some rumor that the first drawing our artist genius made back in times, was from his two girls: Maria and Juana.'
            img='/images/ape-artist.png'
          /> */}
          </Stack>
        </Box>
      </Flex>
      <Box>
      </Box>
    </>
  )
}

function RightItem(props: {
  title: JSX.Element | string
  text: string
  img: string
}) {
  return (
    <SimpleGrid
      alignItems='flex-start'
      columns={{ base: 1, md: 2 }}
      flexDirection='column-reverse'
      columnGap={8}
      spacingY={{ base: 4, md: 32 }}
      spacingX={{ base: 10, md: 24 }}
    >
      <Box>
        <chakra.h2
          mb={{ base: 2, md: 4 }}
          fontSize={{ base: 'xl', md: '2xl' }}
          letterSpacing='tight'
          textAlign={{ base: 'center', md: 'left' }}
          color={useColorModeValue('gray.900', 'gray.400')}
          lineHeight={{ md: 'shorter' }}
          fontFamily='heading'
        >
          {props.title}
        </chakra.h2>
        <chakra.p
          mb={{ md: 5 }}
          textAlign={{ base: 'center', sm: 'left' }}
          color={useColorModeValue('gray.600', 'gray.400')}
          fontSize={{ base: 'sm', md: 'sm' }}
        >
          {props.text}
        </chakra.p>
      </Box>
      <Flex justifyContent='center' width='70%'>
        <Image borderRadius='15px' height='300px' src={props.img} />
      </Flex>
    </SimpleGrid>
  )
}
