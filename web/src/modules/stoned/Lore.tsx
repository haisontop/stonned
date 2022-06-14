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
    heading: 'Initial Supply',
    text: '4200'
  },
  {
    heading: 'Traits',
    text: '150+'
  },
  {
    heading: 'Mint Price',
    text: `0.69 SOL`
  },
  {
    heading: 'Launch',
    text: `28th Nov '21`
  }
]

export default function Lore() {
  return (
  <Container 
    pos='relative' 
    maxWidth='unset' 
    bgGradient='linear(to-b, #181430 18%, #2C2459 100%)'
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
        <GradientText as='span' fontWeight='700' direction='left' fontSize='4xl' gradient='green'>4142</GradientText> STONED APES
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
          4,142 Stoned Apes Conquered the <Text as='span' color='white' fontWeight='600'>Cannabis Industry</Text> as the <Text as='span' color='white' fontWeight='600'>#1 Herb-Related NFT project</Text>.  
          Building a <Text as='span' color='white' fontWeight='600'>weed lifestyle brand</Text> and a <Text as='span' color='white' fontWeight='600'>next level web3 tech platform</Text>, 
          an <Text as='span' color='white' fontWeight='600'>ecosystem</Text> was built around a “green” <Text as='span' color='white' fontWeight='600'>deflationary token $PUFF</Text>, utilized for herb, apparel, rescuing Nuked Apes, Evolutionary Retreats, and other perks.
        </Text>
      </Container>

      <Container
        pt='6rem'
        maxWidth='90ch'
      >
        <Wrap spacing='1rem' justify='center' >
          {features.map((feat, i) => 
            <WrapItem key={i}>
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

