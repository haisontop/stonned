import { Box, Text, Image, ListItem, UnorderedList } from '@chakra-ui/react'
import React from 'react'
import AliceCarousel from 'react-alice-carousel'

const RoadMapItem: React.FC<{ icon: string }> = (props) => {
  return (
    <Box display='flex' alignItems='center' mb='1.5rem' position={'relative'}>
      {props.icon && (
        <Image src={`/images/roadmap/${props.icon}`} position='absolute' width='45px' height='45px'/>
      )}
      <ListItem textAlign={'left'} as={'p'} ml='70px'>
        {props.children}
      </ListItem>
    </Box>
  )
}

const Phase: React.FC<{
  title: string
  items: { icon: string; text: string }[]
  accomplished: boolean
}> = (props) => {
  return (
    <Box height='auto' width='100%' p='0 1rem'>
      <Box bg='rgba(255, 255, 255, 0.05)' borderRadius='15px' p='2rem 1rem'>
        <Text
          color={'#7D7A8C'}
          fontWeight={700}
          textAlign={'center'}
          mt='1rem'
          fontFamily={'Montserrat, sans-serif'}
          fontSize={'4xl'}
        >
          {props.title}
        </Text>

        <UnorderedList m='0' mt='50px'>
          {props.items.map((item, i) => {
            return (
              <RoadMapItem key={i} icon={item.icon}>
                {item.text}
              </RoadMapItem>
            )
          })}
        </UnorderedList>
        {props.accomplished && (
          <Box opacity='.8'>
            <Image src='/images/accomplished-line.svg' m='0 auto'/>
            <Text
              mt='2rem'
              fontSize='1.25rem'
              fontWeight={800}
              fontFamily={'Montserrat, sans-serif'}
              textAlign='center'
              color='#46A83E'
            >
              ACCOMPLISHED
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const phase0 = [
  {
    icon: 'airdrops.svg',
    text: 'Pre-Mint Airdrops',
  },
  {
    icon: 'genesis.svg',
    text: 'Genesis collection with over 200 traits',
  },
  {
    icon: 'premint.svg',
    text: 'Mint of 4200 Genesis Apes',
  },
  {
    icon: 'evolution.svg',
    text: 'First-ever NFT evolution process',
  },
  {
    icon: 'verify.svg',
    text: 'Own holder verificaiton tool in Solana hackathon',
  },
  {
    icon: 'donation.svg',
    text: 'Donation to MAPS.org',
  },
  {
    icon: 'dao.svg',
    text: 'StonedDAO & 4 Role DAO Setup',
  },
]
const phase1 = [
  {
    icon: 'token.svg',
    text: 'Game Theoretic $PUFF Token Release in Nov.',
  },
  {
    icon: 'staking.svg',
    text: 'NFT Staking for $PUFF',
  },
  {
    icon: 'casino.svg',
    text: 'Several integrations into on-chain protocols for $PUFF like Orcas',
  },
  {
    icon: 'appareal.svg',
    text: 'First SAC Appareal Drop (in $PUFF)',
  },
  {
    icon: 'nuked.svg',
    text: 'Rescue Missions for Nuked Apes',
  },
  {
    icon: 'burning.svg',
    text: 'Burning 10M $PUFF through on-chain mechanics',
  },
]
const phase21 = [
  {
    icon: 'web3.svg',
    text: 'ALL Blue: Web3 SaaS, Incubator & NFT Launchpad',
  },
  {
    icon: 'allblue.svg',
    text: '$ALL Coin: a unifying experiment',
  },
  {
    icon: 'store.svg',
    text: 'SAC Online Store',
  },
  {
    icon: 'party.svg',
    text: 'Stoned Launch Party 🙌',
  },
  {
    icon: 'lottery.svg',
    text: 'Lucky Dip: on-chain NFT raffles',
  },
  {
    icon: 'awakening.svg',
    text: 'Ape Awakening: Get your Nuked and Stoned apes moving',
  },
]
const phase22 = [
  {
    icon: 'weed.svg',
    text: 'SAC strain crafted by our licensed partners',
  },
  {
    icon: 'entertainement.svg',
    text: 'Stoned Entertainment',
  },
  {
    icon: 'galactic.svg',
    text: 'SAC Intergalactic Collection',
  },
  {
    icon: 'world.svg',
    text: 'Around the world gif collection',
  },
  {
    icon: 'premint.svg',
    text: 'And so much more... 👀',
  },
]

const phases = [
  <Phase title='Phase 0' items={phase0} accomplished={true}></Phase>,
  <Phase title='Phase 1' items={phase1} accomplished={true}></Phase>,
  <Phase title='Phase 2' items={phase21} accomplished={false}></Phase>,
  <Phase title='Phase 2' items={phase22} accomplished={false}></Phase>,
]
export default function MapCarousel() {
  return (
    <Box>
      <AliceCarousel
        items={phases}
        disableDotsControls
        responsive={{
          0: {
            items: 1,
          },
          650: {
            items: 2,
          },
          875: {
            items: 3,
          },
          1400: {
            items: 4,
          },
        }}
      ></AliceCarousel>
    </Box>
  )
}
