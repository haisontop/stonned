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
  ListItem,
  UnorderedList,
  useBreakpointValue,
  Container,
} from '@chakra-ui/react'
import { chakra } from '@chakra-ui/system'
import _ from 'lodash'
import React from 'react'
import { BoxProps } from '@chakra-ui/layout'
import { motion } from 'framer-motion'

export const MotionBox = motion<BoxProps>(Box)

const utilites = [
  {
    img: '/images/role-icon.png',
    title: '4 ROLES',
    text: (
      <UnorderedList>
        <ListItem>
          First NFT with 4 Roles: Scientists, Business guys, Farmers & Artists (already live)
        </ListItem>
        <ListItem>Unique Ape generated from more than 200 Traits</ListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/staking-icon.png',
    title: 'TOKEN STAKING',
    text: (
      <UnorderedList>
        <ListItem>
          Allowing Staking For Daily Rewards Of Our Utility Token $PUFF. Chimpions get 15 $PUFF / day, Apes with Roles get 30 $PUFF / day
        </ListItem>
        <ListItem>
          With this tokens you will live in the stoned metaverse like the father
          of Bob Marley (already live)
        </ListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/dao-icon.png',
    title: 'PUFF the floor & fractionalized NFT ownership',
    text: (
      <UnorderedList>
        <ListItem>
          Using parts of royalties to PUFF the floor, burn some & redistribute
          some to unlisted holders. (already live)
        </ListItem>
        <ListItem>
          Other parts of royalties are used to buy other NFTs and fractionalize
          ownership back to $PUFF holders.
        </ListItem>
        <ListItem>
          First organization where you don't need to lie about your green
          consumption.
        </ListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/evolution-icon.png',
    title: 'EVOLUTION MECHANISM',
    text: (
      <UnorderedList>
        <ListItem>
          We Invented a Concept for An Evolution Game Of Transforming Your Apes
          With Token Burning Mechanics (already live)
        </ListItem>
        <ListItem>
          {' '}
          Chimpions + Tokens combined to send him into Retreat. After 3 days, he
          can adapt a Role and can either be a Scientist, Farmer, Artist or
          Businessman.
        </ListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/real-world-utilities.png',
    title: 'REAL WORLD UTILITIES',
    text: (
      <UnorderedList>
        <ListItem>Most Stoned Launch Party in Amsterdam PUFF PUFF & other community events</ListItem>
        <ListItem>
          Community-created Weed Strain & Weed Products crafted from Compounded Stoners Wisdom & SAC Apparel (in progress)
        </ListItem>
        <ListItem>
          Very, first CBD and Delta-8 Online-Store in the US & Europe, operated by an NFT company (in progress)
        </ListItem>
        <ListItem>
          The SAC Coffeeshop
        </ListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/mintpass-icon.png',
    title: 'Nuked Ape Rescue Missions',
    text: `A tragic incident happened in Puff Value. Chaos, devastated areas over the region after a nuclear explosion. The Apes want to rescue their fellows so decide to build rescue teams, 2 Apes with different Roles (Chimpion works) form one team. Nuked Apes will be an exclusive collection only available through rescue missions. Each rescue mission consumes 1420 $PUFF (starting Feb 12th)`,
  },
]

export default function Utilities() {
  /* const columns = _.partition(utilites, (u) => {
    return (utilites.indexOf(u) + 1) % 2
  }) */

  const columns = useBreakpointValue({
    base: [utilites],
    sm: _.partition(utilites, (u) => {
      return (utilites.indexOf(u) + 1) % 2
    }),
  })

  return (
    <Stack
      background={'#131737'}
      color='white'
      id='utilities'
      p={{ base: 4, md: 10 }}
      w='full'
      position={'relative'}
      /* justifyContent='center'
    alignItems='center' */
      spacing='2rem'
    >
      <Heading fontSize='5xl' fontWeight={500} textAlign='center'>
        Utilities
      </Heading>
      <Stack
        direction='row'
        spacing='2rem'
        justifyContent='center'
        /*  backgroundImage='url("./images/line-item.svg") !important'
        backgroundRepeat='no-repeat !important'
        backgroundPosition='center 5px !important'
        backgroundSize='auto 83% !important' */
      >
        {columns &&
          columns.map((column, i) => {
            let style = i === 1 ? { mt: '120px !important' } : {}
            return (
              <Stack
                {...style}
                width={['100%', '45%']}
                flex='0 0 auto'
                spacing='14'
              >
                {column.map((item, i) => {
                  return (
                    <Stack direction='row' alignItems='center' spacing='4'>
                      <Flex
                        alignItems='center'
                        borderRadius='20px'
                        p='1'
                        bg='primary'
                        width={[100, , 120] as any}
                        height={[100, , 120] as any}
                      >
                        <MotionBox
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          whileTap={{
                            scale: 0.8,
                            rotate: -180,
                            borderRadius: '100%',
                          }}
                        >
                          <Image src={item.img} />{' '}
                        </MotionBox>
                      </Flex>
                      <Stack flex='1'>
                        <Heading fontSize='lg'>{item.title}</Heading>
                        <Text fontSize='xs'>{item.text}</Text>
                      </Stack>
                    </Stack>
                  )
                })}
              </Stack>
            )
          })}
      </Stack>
    </Stack>
  )
}

function LeftItem(props: {
  title: JSX.Element | string
  text: string
  img: string
}) {
  return (
    <SimpleGrid
      alignItems='start'
      columns={{ base: 1, md: 2 }}
      columnGap={8}
      spacingY={{ base: 4, md: 32 }}
      spacingX={{ base: 10, md: 24 }}
    >
      <Box>
        <chakra.h2
          mb={{ base: 2, md: 4 }}
          fontSize={{ base: 'xl', md: '2xl' }}
          fontFamily='heading'
          letterSpacing='tight'
          textAlign={{ base: 'center', md: 'left' }}
          color={useColorModeValue('gray.900', 'gray.400')}
          lineHeight={{ md: 'shorter' }}
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
      <Flex justifyContent='center' width='100%'>
        <Image
          borderRadius='15px'
          height='280px'
          width='auto'
          src={props.img}
        />
      </Flex>
    </SimpleGrid>
  )
}
