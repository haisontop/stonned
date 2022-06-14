import {
  Container,
  Heading,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import React from 'react'
import { FeatureBox } from '../../components/FeatureBox'
import { GradientText } from '../../components/GradientText'

interface Utility {
  heading: string,
  text: string
}

const utilities: Utility[] = [
  {
    heading: '$PUFF Staking',
    text: 'Nuked Apes can be staked and earn between 3 and 69 $PUFF per day depending on their rarity.'
  },
  {
    heading: 'Exclusive SAC Benefits',
    text: 'Whitelist Spots for all future Mints & access to exclusive SAC Alpha.'
  },
  {
    heading: 'Entry Ticket to Amsterdam Launch Party',
    text: 'Planned for May/June + other IRL events.'
  },
  {
    heading: 'Evolution',
    text: 'Coming soon. Nuked Apes can be sent on retreat to get new traits.'
  },
  {
    heading: 'Big surprise...',
    text: 'Connected to our Incubator. All we say is $ALL 👀'
  },
]

export default function Utilites() {
  return (
  <Container 
    pos='relative' 
    maxWidth='unset' 
    bg='#070707'
    pt='6rem'
    pb='10rem'
    id='utilities'
  >
      <Heading 
        textAlign='center'
        fontWeight={700}
        fontSize='4xl'
        color='white'
      >
        <GradientText as='span' fontWeight='700' direction='left' fontSize='4xl'
        >UTILITIES
        </GradientText>
      </Heading>

      <Container
        pt='4rem'
        maxWidth='70ch'
      >
        <Text
          color='textGrey'
          fontWeight='600'
          textAlign='center'
        >
          Nuked Apes are part of the <Text as='span' color='white' fontWeight='600'>Stoned Ape Crew Ecosystem</Text> and therefore share their amazing Utilites.
        </Text>
      </Container>

      <Container
        pt='6rem'
        maxWidth='100ch'
      >
        <Wrap spacing='1rem' justify='center' >
          {utilities.map((util) => 
            <WrapItem>
              <FeatureBox
                boxWidth='large'
                heading={util.heading}
                text={util.text}
              ></FeatureBox>
            </WrapItem>
          )}
        </Wrap>
      </Container>
  </Container>
  )}

