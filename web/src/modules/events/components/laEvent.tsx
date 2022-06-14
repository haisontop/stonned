import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { MainLayout } from '../../../layouts/MainLayout'

interface InfoBoxProps {
  children: ReactElement
  heading: string
  bgImage: string
}

function InfoBox({ children, heading, bgImage }: InfoBoxProps) {
  return (
    <Flex
      bgImage={bgImage}
      bgRepeat='no-repeat'
      bgPos='center'
      minHeight='300px'
      width='100%'
      alignItems='center'
      justifyContent='center'
    >
      <Box minWidth='200px'>
        <Heading variant='minimal' mb='1rem'>
          {heading}
        </Heading>
        <Text variant='minimal'>{children}</Text>
      </Box>
    </Flex>
  )
}

const sponsorsImages = [
  'binske.png',
  'moxie.png',
  'pine-park.png',
  'cosmic-fog.png',
  'green-wolf.png',
  'ra.png',
  'wcc.png'
]

const sponsorsText = [
  'Bear Labs',
  'Costa Cannabis',
  'Ra Brand Edibles',
  'Non Funjible Cannabis',
  'Bum Feet',
  'The Dopest'
]

export default function LAEvent() {
  return (
    <MainLayout
      navbar={{
        colorTheme: 'light',
        bgTransparent: true,
        bgColor: '#FFFAF0',
      }}
    >
      <Box
        bg='#FFFAF0'
        width='100vw'
        minHeight='100vh'
        height='100%'
        py='8rem'
        fontFamily='Montserrat'
      >
        <Image src='/images/puffin-la.png' mx='auto'></Image>
        <Box textAlign='center' mt='2rem'>
          <Text variant='minimal'>
            SAC x Secret Sesh
          </Text>
          <Text variant='minimal' mb='.75rem'>Featuring Roddy Ricch</Text>
          <Text variant='minimal'>May 6th 2022</Text>
          <Text variant='minimal'>Los Angeles</Text>
        </Box>
        <Image src="/images/puffin-la-plan.png" mx='auto' width='100%' maxWidth='1400px'></Image>

{/*         
        <Box maxWidth='550px' mx='auto' mt='1rem' mb='2rem'>
          <Text variant='minimal' textAlign='center' color='rgba(0,0,0,0.7)'>
          Stoned Ape Crew and Secret Sesh come together to celebrate their communities. Unique experiences await like a special holders lounge, graffiti wall, NFT art gallery, THC infused drinks, Budtenders and much much more.
Oh and also our special musical guest Quavo will be there.
          </Text>
        </Box> */}
       

        <SimpleGrid columns={{ base: 1, md: 2 }} maxWidth='1000px' mx='auto'>
          <InfoBox heading='Venue' bgImage='/images/stroke-red.png'>
            <>
              <Link href='https://wisdome.la/' target='_blank'>
                <Text variant='minimal'>Wisdome LA | USA</Text>
              </Link>
              <Link href='https://goo.gl/maps/knAhPUyaNWXzKMJ17' target='_blank'>
                <Text variant='minimal'>1147 Palmetto St, Los Angeles, California</Text>
              </Link>
            </>
          </InfoBox>
          <InfoBox heading='Date & Time' bgImage='/images/stroke-yellow.png'>
            <Text variant='minimal'>May 6th | 5pm - 11pm PDT</Text>
          </InfoBox>
          <InfoBox heading='Acts' bgImage='/images/stroke-orange.png'>
            <List>
              <ListItem fontWeight={600}>Roddy Ricch</ListItem>
              <ListItem>10kcash</ListItem>
              <ListItem>Mezza</ListItem>              
              <ListItem>DJ Cheps</ListItem>
            </List>
          </InfoBox>
          <InfoBox heading='Experiences' bgImage='/images/stroke-green.png'>
            <List>
              <ListItem>Stoned Apes Area</ListItem>
              <ListItem>Nuked Apes Area</ListItem>
              <ListItem>NFT Art Gallery</ListItem>
              <ListItem>Exclusive Event Merch</ListItem>
              <ListItem>Graffiti Wall</ListItem>
              <ListItem>Holder only Lounge</ListItem>
              <ListItem>Secret Sesh Lounge</ListItem>
            </List>
          </InfoBox>
        </SimpleGrid>
        <Box mt='8rem'>
          <Heading variant='minimal' textAlign='center'>
            How to Attend
          </Heading>
          <Text variant='minimal' textAlign='center' color='rgba(0,0,0,0.5)'>Age requirement: 21+</Text>

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            maxWidth='1000px'
            mx='auto'
            mt='2rem'
          >
            <Box maxWidth='300px' mx='auto' my='1rem'>
              <Heading variant='minimal' fontSize='1rem'>
                SAC & NAC Holders
              </Heading>
              <Text variant='minimal' my='1rem'>
                Free VIP Entry 🙌
              </Text>
              <Text variant='minimal'>
                To enter, register here with your wallet on the guestlist:
              </Text>
              <Link href='/events/la/guestlist'>
                <Button variant='outlined' my='1rem'>
                  Register now
                </Button>
              </Link>
            </Box>

            <Box maxWidth='300px' mx='auto' my='1rem'>
              <Heading variant='minimal' fontSize='1rem'>
                Non Holders
              </Heading>
              <Text variant='minimal' my='1rem'>
                Tickets are available to purchase via Universe.
              </Text>
              <Link href='https://www.universe.com/events/secret-sesh-x-sac-hodlers-event-tickets-CKTJ2Y' target='_blank'>
                <Button variant='outlined' my='1rem'>
                  Visit Universe
                </Button>
              </Link>
            </Box>
          </SimpleGrid>
        </Box>
        <Box mt='5rem' maxWidth='1000px' mx='auto'>
          <Heading variant='minimal' color='rgba(0,0,0,0.4)' textAlign='center'>
            Event Sponsors
          </Heading>
          <Wrap justify='center' mt='2rem' spacing='2rem'>
            {sponsorsImages.map(s => (
              <WrapItem>
                <Image src={`/images/logos-la/${s}`} width='90px'></Image>
              </WrapItem>
            ))}
          </Wrap>
          <Wrap justify='center' mt='1rem' spacing='2rem'>
            {sponsorsText.map(s => (
              <WrapItem>
                <Text variant='minimal' color='rgba(0,0,0,0.4)'>{s}</Text>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </Box>
    </MainLayout>
  )
}
