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
} from '@chakra-ui/react'
import { chakra } from '@chakra-ui/system'
import _ from 'lodash'
import React from 'react'
import MapCarousel from './MapCarousel'
import { MotionBox } from '../../components/Utilities'


export default function RoadMap() {

  return (
    <Box
      background={'linear-gradient(180deg, #181430 18.36%, #2C2459 100%)'}
      color='white'
      id='utilities'
      p={{ base: 4, md: 10 }}
      w='full'
      position={'relative'}
    >
      <Heading fontSize='4xl' fontWeight={700} fontFamily={'Montserrat, sans-serif'} textAlign='center' mt='2rem'>
        <Text as={'span'} color={'white'} fontWeight={700} fontSize='4xl'>
          ROAD MAP
        </Text>
      </Heading>
      <Box
        m='0 auto'
        mt='4rem'
        justifyContent='center'
        maxWidth='1600px'
      >
        <MapCarousel />
      </Box>
    </Box>
  )
}
