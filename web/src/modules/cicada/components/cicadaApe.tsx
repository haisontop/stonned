import { Box, Image, ChakraProvider, Text } from '@chakra-ui/react'
import React from 'react'
import themeFlat from '../../../themeFlat'

const CicadaApe = () => {
  const hannes = 'hannes'
  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Box bg='#000' w='100vw' h='100vh'>
        <Box display={'none'}>
          https://drive.google.com/file/d/10EeZ_LL-qFErhK0f-8L9Zk68gy7uSjPZ/view?usp=sharing
        </Box>
        <Text as="p">Check your latest metadata. Oh and there is something hidden in this page.</Text>
        <Image
          src='/images/ape420.jpg'
          pos='fixed'
          top='50%'
          left='50%'
          transform='translate(-50%,-50%)'
          width={['250px', '300px', '600px']}
          className='Linktomp3file'
        ></Image>
      </Box>
    </ChakraProvider>
  )
}

export default CicadaApe
