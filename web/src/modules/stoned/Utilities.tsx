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
  Link,
} from '@chakra-ui/react'
import { chakra } from '@chakra-ui/system'
import _ from 'lodash'
import React from 'react'
import { BoxProps } from '@chakra-ui/layout'
import { motion } from 'framer-motion'
import can from '../../../public/images/can2.svg'
import { Util } from 'discord.js'

export const MotionBox = motion<BoxProps>(Box)

const UtilListItem: React.FC = (props) => {
  return (
    <Box display='flex' alignItems='flex-start' mb='14px'>
      <Image src='/images/can2.svg' mr='12px' />
      <ListItem as={'p'}>{props.children}</ListItem>
    </Box>
  )
}

const utilites = [
  {
    img: '/images/real-world-utilities.png',
    title: 'SAC - Cannabis Lifestyle Brand',
    text: (
      <UnorderedList>
        <UtilListItem key={1}>
          SAC Weed Strain crafted from compounded stoner wisdom in the community through their ideas - legally produced through licensed partners.
        </UtilListItem>
        <UtilListItem key={2}>
          SAC Apparel, products, accessories are coming to our
          community-oriented Store.
        </UtilListItem>
        <UtilListItem key={3}>
          Exclusive Drops for limited collections.
        </UtilListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/staking-icon.png',
    title: '$PUFF Ecosystem',
    text: (
      <UnorderedList>
        <UtilListItem key={1}>
          Our green utility token that builds an Ecosystem and is already
          integrated all over Solana.{' '}
          <Link href='/puff' textDecoration='underline'>
            Learn more
          </Link>
        </UtilListItem>
        <UtilListItem key={2}>
          Mint new collections in $PUFF, buy SAC products and even cannabis with
          $PUFF.
        </UtilListItem>
        <UtilListItem key={3}>
          Stake your apes for daily rewards of $PUFF. Apes with roles get 2x
          $PUFF
        </UtilListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/role-icon.png',
    title: 'Stoned Entertainment',
    text: (
      <UnorderedList>
        <UtilListItem key={1}>
          Most Stoned Launch Party in Amsterdam PUFF PUFF (coming this July 👀).
        </UtilListItem>
        <UtilListItem key={2}>
          Elevating community created content and giving a stage to real- &
          meta-world artists.
        </UtilListItem>
        <UtilListItem key={3}>
          Have fu*kin fun together at future events!
        </UtilListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/dao-icon.png',
    title: 'ALL Blue - a Stoned Ape web3 tech venture',
    text: (
      <UnorderedList>
        <UtilListItem key={1}>
          ALL Blue is our incubator for web3 and NFT projects.
        </UtilListItem>
        <UtilListItem key={2}>
          We combine everything needed to create successful NFT projects.
        </UtilListItem>
        <UtilListItem key={3}>
          Tech, Strategy, $ALL Coin & Launchpad - all under one roof.
        </UtilListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/evolution-icon.png',
    title: 'Gamified on-chain utilities',
    text: (
      <UnorderedList>
        <UtilListItem key={1}>
          We invented a concept for an Evolution Game to transform your Apes
          with Token Burning Mechanics.
        </UtilListItem>
        <UtilListItem key={2}>
          Rescue a{' '}
          <Link textDecoration='underline' href='/nukedapes'>
            Nuked Ape
          </Link>{' '}
          by sending two apes on mission and burning $PUFF.
        </UtilListItem>
        <UtilListItem key={3}>
          SAC on-chain raffles to win major digital assets spanning across NFT
          communities.
        </UtilListItem>
        <UtilListItem key={4}>
          Soon: Make your apes move by enlightening them.
        </UtilListItem>
      </UnorderedList>
    ),
  },
  {
    img: '/images/mintpass-icon.png',
    title: 'Mint Pass for future collections',
    text: (
      <UnorderedList>
        <UtilListItem key={1}>
          For the stoned metaverse, apes need other companions. Be ready for the
          next groundbreaking collection(s). You will be able to get your pieces
          before everyone else.
        </UtilListItem>
      </UnorderedList>
    ),
  },
]

export default function Utilities() {
  return (
    <Box
      background={'linear-gradient(180deg, #181430 18.36%, #2C2459 100%)'}
      color='white'
      id='utilities'
      p={{ base: 4, md: 10 }}
      w='full'
      position={'relative'}
      m='5rem'
      textAlign={'center'}
    >
      <Heading
        mt={{ base: '2rem', md: '2rem', lg: '5rem', xl: '5rem' }}
        fontSize='4xl'
        fontWeight={700}
        fontFamily={'Montserrat, sans-serif'}
        textAlign='center'
      >
        UTILITIES
      </Heading>

      <Container
        m='0 auto'
        mt='5rem'
        mb='5rem'
        textAlign='center'
        maxWidth='1600px'
      >
        <SimpleGrid columns={[1, 2, 3]} spacing='1rem'>
          {utilites &&
            utilites.map((util, i) => {
              return (
                <Stack
                  key={i}
                  direction='column'
                  alignItems='center'
                  spacing='4'
                  bg='rgba(255, 255, 255, 0.05)'
                  p='40px'
                  borderRadius='40px'
                  width={['100%', '100%']}
                >
                  <Flex
                    mr={{ base: '0', md: 'auto' }}
                    borderRadius='50%'
                    p='4'
                    bg='rgba(255, 255, 255, 0.1)'
                    width={[100, , 100] as any}
                    height={[100, , 100] as any}
                    position='relative'
                  >
                    <MotionBox
                      position='absolute'
                      top='50%'
                      left='50%'
                      transform='translate(-50%, -50%)'
                      width='60px'
                    >
                      <Image src={util.img} width='100%' />
                    </MotionBox>
                  </Flex>
                  <Stack flex='1'>
                    <Heading
                      textAlign={'left'}
                      fontSize='lg'
                      fontFamily={'Montserrat, sans-serif'}
                    >
                      {util.title}{' '}
                    </Heading>
                    <Box textAlign={'left'} fontSize='xs'>
                      {util.text}
                    </Box>
                  </Stack>
                </Stack>
              )
            })}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
