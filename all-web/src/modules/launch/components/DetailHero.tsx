import { SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useTheme,
} from '@chakra-ui/react'
import React from 'react'
import CreatorWithAvatar from './CreatorWithAvatar'
import LabelTitle from './LabelTitle'

export default function DetailHero(props: {
  desktopBanner: string
  mobileBanner: string
}) {
  const theme = useTheme()
  console.log('theme.colors.primary', theme)

  return (
    <Container
      paddingX={0}
      h={['40vh', '40vh', '55vh']}
      minHeight='400px'
      pt={['0rem', '0rem', '0rem']}
      maxWidth='120rem'
    >
      <Flex
        direction={['column', 'column', 'row']}
        pos='relative'
        height='100%'
        width='100%'
        margin='0 auto'
        borderBottomRadius={{ xl: '20px' }}
        overflow='hidden'
      >
        <Box
          boxShadow={['inset 1px 86px 84px -54px rgba(0,0,0,0.75)', ' inset 1px 112px 84px -54px rgba(0,0,0,0.75)']}
          pos={['absolute']}
          top='0'
          left='0'
          width={['100%', '100%']}
          height='100%'
          zIndex='2'
        ></Box>
        <Image
          src={props.desktopBanner}
          pos={[null, null, 'absolute']}
          display={['none', 'initial']}
          top='0'
          left='0'
          width={['100%', '100%']}
          height='100%'
          zIndex='1'
          objectFit={'cover'}
        ></Image>
        <Image
          src={props.mobileBanner}
          pos={['absolute']}
          display={['initial', 'none']}
          top='0'
          left='0'
          width={['100%', '100%']}
          height='100%'
          zIndex='1'
          objectFit={'cover'}
        ></Image>
        {/*
            two 1x1 besides each other
            <Image
          src='/images/launch/left-hero.png'
          pos={[null, null, 'absolute']}
          top='0'
          left='0'
          width={['100%', '100%', '50%']}
          height='100%'
          maxWidth='90rem'
          zIndex='1'
          objectFit={'cover'}
        ></Image>
        <Image
          src='/images/launch/right-hero.png'
          pos={[null, null, 'absolute']}
          top='0'
          right='0'
          width={['100%', '100%', '50%']}
          height='100%'
          objectFit={'cover'}
          maxWidth='90rem'
          zIndex='1'
        ></Image>
        */}
      </Flex>
    </Container>
  )
}

function useNavigate() {
  throw new Error('Function not implemented.')
}
