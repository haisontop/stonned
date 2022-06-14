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

interface Feature {
  heading: string,
  text: string
}

const features: Feature[] = [
  {
    heading: 'Total Supply',
    text: '4200'
  },
  {
    heading: 'Traits',
    text: '300+'
  },
  {
    heading: 'Mint Supply',
    text: '420 (=10%)'
  },
  {
    heading: 'Rescue Supply',
    text: '3790 (=90%)'
  },
  {
    heading: 'Mint Price',
    text: `16 SOL Dutch Auction`
  },
  {
    heading: 'Super Rare',
    text: `10 Legendary Nuked Apes`
  },
  {
    heading: 'Launch',
    text: `15th Feb: Rescue
    19th Feb: Mint`
  }
]

export default function Lore() {
  return (
  <Container 
    pos='relative' 
    maxWidth='unset' 
    bgGradient='linear(to-b, #000000 0%, #30424D 250%)'
    pt='6rem'
    pb='10rem'
    id='lore'
  >
      <Heading 
        textAlign='center'
        fontWeight={700}
        fontSize='4xl'
        color='white'
      >
        <GradientText as='span' fontWeight='700' direction='left' fontSize='4xl'>4200</GradientText> UNIQUE NUKED APES
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
          After a <Text as='span' color='white' fontWeight='600'>nuclear incident</Text> in parts of Puff Valley, Apekind is in shock! Total chaos, <Text as='span' color='white' fontWeight='600'>family members are missing</Text> and huge land is devastated. <br/>
          But some <Text as='span' color='white' fontWeight='600'>brave apes</Text> are not giving up and will go on a <Text as='span' color='white' fontWeight='600'>rescue mission</Text> to recover their lost ones. They aren't ready for what they will see, but the <Text as='span' color='white' fontWeight='600'>$PUFF</Text> will help.
        </Text>
      </Container>

      <Container
        pt='6rem'
        maxWidth='90ch'
      >
        <Wrap spacing='1rem' justify='center' >
          {features.map((feat) => 
            <WrapItem>
              <FeatureBox
                heading={feat.heading}
                text={feat.text}
              ></FeatureBox>
            </WrapItem>
          )}
        </Wrap>
      </Container>
  </Container>
  )}

