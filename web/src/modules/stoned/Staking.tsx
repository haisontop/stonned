import {
    Box,
    Container,
    Heading,
    Image,
    Stack,
    Text,
  } from '@chakra-ui/react'
  import React from 'react'
  
  export default function Staking() {
    return (
    <Container 
      pos='relative' 
      maxWidth='110ch'
      bg='white'
      pt={{base: '2rem', lg: '4rem'}}
      pb={{base: '2rem', sm: '4rem', lg: '6rem'}}
      id='getone'
      m='0 auto'
    >
        <Heading 
          textAlign='center'
          fontWeight={700}
          fontSize='4xl'
          color='black'
          mb='4rem'
          fontFamily={'Montserrat, sans-serif'}
        >
          <Text as={'span'} color={'#181430'} fontWeight={700} fontSize='4xl'>
          STAKING & FIRST EVER NFT 
              {' '}<Text as={'span'} color={'white'} fontWeight={700} fontSize='4xl'
              textShadow='-1px -1px 0 #181430, 1px -1px 0 #181430, -1px 1px 0 #181430, 1px 1px 0 #181430'>
              EVOLUTION PROCESS 
            </Text>
            </Text>
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
          >Staking</Text>

  
  <Text color='#939393' textAlign='center' pb='50px' pt='50px' fontWeight={600} fontFamily={'Montserrat, sans-serif'}>
  Your Stoned Apes can be <Text as={'span'} color='#181430' fontWeight={600}> staked </Text> 
  and earn you <Text as={'span'} color='#181430' fontWeight={600}> $PUFF</Text> every day. 
  Chimpions earn 15 $PUFF per day. <br/>Role based apes such as scientists, artists, 
  farmers or business men earn 30 $PUFF per day. <br/>With $PUFF you can 
  <Text as={'span'} color='#181430' fontWeight={600}> buy real stuff</Text> or send your Chimpion ape on  
  <Text as={'span'} color='#181430' fontWeight={600}> retreat</Text>.</Text>

  <Box display={{base: 'block', md: 'flex'}}>
                <Image
                 maxWidth={{base: '100%', md: '47%'}}
            src='/images/nuked-rescue-explainer5.png'
            margin='3rem auto'
             />
             <Image 
             maxWidth={{base: '100%', md: '47%'}}
            src='/images/nuked-rescue-explainer6.png'
            margin='3rem auto'
             />
             </Box>

        </Box>

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
          >Retreat & Evolution</Text>

  
  <Text color='#939393' textAlign='center' pb='50px' pt='50px' fontWeight={600} fontFamily={'Montserrat, sans-serif'}>
  Chimpions can move up in the metaverse by going on <Text as={'span'} color='#181430' fontWeight={600}> retreat</Text>. 
  There they party with their friends <br/>and with a bit of luck come back with <Text as={'span'} color='#181430' fontWeight={600}> new role</Text>.
  <br/>Two retreat options are available. 
The <Text as={'span'} color='#181430' fontWeight={600}> basic retreat</Text> for <Text as={'span'} color='#181430' fontWeight={600}> 333 $PUFF</Text>  or the advanced <Text as={'span'} color='#181430' fontWeight={600}> DMT retreat</Text>  for <Text as={'span'} color='#181430' fontWeight={600}> 666 $PUFF</Text>. 
<br/>On the basic retreat your Chimpion has a <Text as={'span'} color='#181430' fontWeight={600}> 60% chance</Text>  of getting a new role or trait. 
The DMT <br/>retreat features extra chilled parties, 
therefore the chance for a new role or trait is <Text as={'span'} color='#181430' fontWeight={600}> 80%</Text>.
</Text>
            <Box display={{base: 'block', md: 'flex'}}>
                <Image
                 maxWidth={{base: '100%', md: '47%'}}
            src='/images/nuked-rescue-explainer3.png'
            margin='3rem auto'
             />
             <Image 
             maxWidth={{base: '100%', md: '47%'}}
            src='/images/nuked-rescue-explainer4.png'
            margin='3rem auto'
             />
             </Box>
            

        </Box>
  
    </Container>
    )}
  
  