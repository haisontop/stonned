import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  Image,
  Text,
  Flex,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react'
import React, { FC } from 'react'

interface LinksProps {}

const features = [
  {
    title: 'Utility',
    text: '$PUFF Token is the utility token used all over the SAC Ecosystem as well as in the Cannabis Industry to pay for accessoires & herbs where applicable. The first-ever Token to get your Greens.',
    icon: <>&#128188;</>,
  },
  {
    title: 'Tokenomics',
    text: 'A token in the Solana ecosystem which incorporates mechanisms of game-theory as well as intelligent burning mechanisms to increase the value.',
    icon: <>&#128293;</>,
  },
  {
    title: 'Team',
    text: 'With the team’s experience in payment systems and tokenomics, they have been able to create the mechanics in a first to be seen NFT-based utility token with actual real life value.',
    icon: <>👨‍💻</>,
  },
]

const Features: FC<LinksProps> = () => {
  return (
    <Stack
      id='about'
      paddingBottom={'3rem'}
      spacing={'2rem'}
      zIndex={1}
      color='white'
      position={'relative'}
    >
      <Box maxWidth='1200px' margin='auto' zIndex={1}>
        <Heading textAlign={'center'} fontSize='3xl' fontWeight='800' fontFamily={'body'}>
          All about $PUFF
        </Heading>
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          {features.map((feature, i) => {
            return <Card key={i} {...feature} />
          })}
        </SimpleGrid>
      </Box>
      <Box
        position='absolute'
        background='linear-gradient(169.21deg, rgba(144, 0, 211, 0.28) 8%, rgba(75, 115, 254, 0.28) 115.65%)'
        filter='blur(180px)'
        width='70vw'
        height='200px'
        top='-100px'
      ></Box>
    </Stack>
  )
}

export default Features

const Card: React.FC<{ title: string; text: string; icon: JSX.Element }> = (
  props
) => {
  return (
    <Flex
      /*  bg={useColorModeValue('#F9FAFB', 'gray.600')} */
      /*    p={50} */
      w='full'
      alignItems='center'
      justifyContent='center'
      mt={14}
    >
      <Box
        w='md'
        mx='auto'
        py={4}
        px={4}
        shadow='lg'
        rounded='lg'
        color='white'
        background='rgba(128, 69, 254, 0.05)'
        boxShadow='inset 0px 4px 56px rgba(255, 255, 255, 0.18)'
        backdropFilter='blur(22px)'
        transition={'ease-in-out all .3s'}
        _hover={{
          transform: 'translate(0, -4px)'
        }}
        
      >
        <Flex justifyContent={{ base: 'center', md: 'end' }} mt={-14}>
          <Box fontSize='6xl'>{props.icon}</Box>
        </Flex>

        <chakra.h2
          fontSize={{ base: 'lg', md: 'xl' }}
          mt={{ base: 2, md: 0 }}
          fontWeight='500'
        >
          {props.title}
        </chakra.h2>

        <chakra.p fontSize={'sm'} mt={2} color='#e9e9e9'>
          {props.text}
        </chakra.p>

        {/*  <Flex justifyContent='end' mt={4}>
          John Doe
        </Flex> */}
      </Box>
    </Flex>
  )
}
