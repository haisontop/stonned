import {
  Box,
  Container,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { GradientButton } from '../../components/GradientButton'
import { GradientText } from '../../components/GradientText'

export default function HowToGetOne() {
  return (
  <Container 
    pos='relative' 
    maxWidth='110ch'
    bg='white'
    pt={{base: '2rem', lg: '4rem'}}
    pb={{base: '2rem', sm: '4rem', lg: '6rem'}}
    id='getone'
  >
      <Heading 
        textAlign='center'
        fontWeight={700}
        fontSize='4xl'
        color='black'
        mb='4rem'
      >
        HOW TO GET ONE?
      </Heading>

      <Box
        bg='#FAFAFA'
        padding='3rem'
        textAlign='center'
        borderRadius='.5rem'
        mb='1rem'
        id='rescue'
      >
        <Text
          fontSize='1.8rem'
          color='black'
          fontWeight='500'
        >Rescue Mission</Text>
        <Image 
          src='/images/nuked-rescue-explainer.png'
          margin='3rem auto'
        />

        <Text color='textGreyDark' fontWeight='600' mb='1rem'>
        *The $PUFF Amount needed for a rescue mission increases every time 100 NAC are rescued by 4.2%.<br/>
        For the first 12h after Launch it stays fixed at 1780 $PUFF.
        </Text>

        <Text color='textGreyDark' fontWeight='600' mb='3rem'>
        After a mission your Stoned Apes need 7 days of cooldown before going on a new mission.<br/>
        Re-using a Stoned Ape increases the $PUFF required by 30%.
        </Text>

        <GradientButton backgroundColor='#FAFAFA' onClick={() => window.location.href=('/rescue')}>Rescue your Ape</GradientButton>
      </Box>

      <Stack direction={{base:'column', md:'row'}} spacing='1rem'>
        <Box
          bg='#FAFAFA'
          padding='3rem'
          textAlign={{base: 'center', sm: 'left'}}
          borderRadius='.5rem'
        >
          <Stack direction={{base: 'column', sm:'row'}} mb='2rem'>
            <Box mr={{base: '0', sm: '2rem'}} mb={{base: '1rem', sm: '0'}}>
              <Text
                fontSize='1.8rem'
                color='black'
                mb='4rem'
                fontWeight='500'
              >Ape Recruiting</Text>
              
              <Text color='textGreyDark' fontWeight='600' mb='1rem'>
                Holders with only one SAC can recruit a second one for a renting fee of 5.25 SOL.
              </Text>
              <Text color='textGreyDark' fontWeight='600'>
                Holders who want to offer their ape for recruiting earn 3 SOL for a Chimpion and 4.2 SOL for a Role Ape.
              </Text>
            </Box>

            <Box>
              <Image 
              display='inline-block'
              src='/images/nuked-recruting-explainer.png'
              maxWidth='190px'
              width='190px'
              />
            </Box>
          </Stack>

          
          <Text color='textGreyDark' fontSize='.6rem' textAlign='center'>Launching</Text>
          <Text textAlign='center'>
            <GradientText as='span' fontWeight='700' fontFamily='Montserrat'>FEB 15TH</GradientText>
            <br/>
            <Text color='textGreyDark' fontSize='.8rem' fontWeight='500' textAlign='center'>5PM UTC</Text>
          </Text>
        </Box>

        <Box
          bg='#FAFAFA'
          padding='3rem'
          textAlign={{base: 'center', sm: 'left'}}
          borderRadius='.5rem'
        >
          <Stack direction={{base: 'column', sm:'row'}} mb='2rem'>
            <Box width={{base: '100%', sm: '65%'}} mr={{base: '0', sm: '2rem'}} mb={{base: '1rem', sm: '0'}} id='mint'>
              <Text
                fontSize='1.8rem'
                color='black'
                mb='4rem'
                fontWeight='500'
              >Public Mint</Text>
              
              <Text color='textGreyDark' fontWeight='600' mb='1rem'>
              The Public Mint is held via a Dutch Auction.<br/>
              This means the Apes have a starting price of 16 SOL. Every 30min the price decreases by 0.5 SOL until it reaches a fair price.
              </Text>

              <Text color='textGreyDark' fontWeight='600'>
              Stoned Ape Crew Genisis Holders will have early access to the Dutch Auction at 5PM UTC.
              </Text>
            </Box>

            <Box>
              <Image 
              display='inline-block'
              marginLeft={{base: '-95px', sm: '0'}}
              src='/images/nuked-mint-explainer.png'
              maxWidth='190px'
              width='190px'
              />
            </Box>
          </Stack>

          <Text color='textGreyDark' fontSize='.6rem' textAlign='center'>Launching</Text>
          <Text textAlign='center'>
            <GradientText as='span' fontWeight='700' fontFamily='Montserrat'>FEB 19TH</GradientText>
            <br/>
            <Text color='textGreyDark' fontSize='.8rem' fontWeight='500' textAlign='center'>6PM UTC</Text>
          </Text>

        </Box>

      </Stack>
  </Container>
  )}

