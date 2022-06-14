import { ChakraProvider, Flex, Image } from '@chakra-ui/react'
import React from 'react'
import themeFlat from '../../../themeFlat'

const CicadaChest = () => {
  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Flex
        bg='#000'
        w='100vw'
        h='100vh'
        alignContent='center'
        alignItems='center'
        justifyContent='center'
      >
        <Image
          src='/images/keyhole.png'
          pos='fixed'
          top='50%'
          left='50%'
          transform='translate(-50%,-50%)'
          width={['250px', '300px', '600px']}
        ></Image>
        {/* TOOD: add connect wallet btn */}
      </Flex>
    </ChakraProvider>
  )
}

export default CicadaChest
