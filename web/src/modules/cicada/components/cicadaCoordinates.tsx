import {
  Box,
  Text,
  ChakraProvider,
  Input,
  Button,
  Flex,
} from '@chakra-ui/react'
import React from 'react'
import themeFlat from '../../../themeFlat'

const CicadaCoordinates = () => {
  const coords = [
    '25.79971970656065, -80.12556251083276',
    '40.77858615371458, -73.98041875118099',
    '40.80461874674513, -73.96607544918926',
    '25.793516115403566, -80.14467321083623',
    '45.75804580996313, 4.831767862408684',
    '28.664039531046157, 77.13139760347302',
    '45.2974176, -75.9252322',
    '52.07826468087203, 4.306840464528361'
  ]

  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Flex
        bg='#000'
        w='100vw'
        h='100vh'
        alignItems='center'
        justifyContent='center'
      >
        <Box>
          {coords.map((coord) => (
            <Text color='white'>{coord}</Text>
          ))}
        </Box>
      </Flex>
    </ChakraProvider>
  )
}

export default CicadaCoordinates
