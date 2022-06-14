import { Box, Image, Text } from '@chakra-ui/react'
import React from 'react'

export default function SolBox() {
  return (
    <Box position={'relative'} p={['4px 10px', '6px 10px', '20px 60px']} textAlign='center' my={[2, 4, 8]}>
      <Image
        src='images/dashed-gradient-box.png'
        position={'absolute'}
        width={['160px', '240px', '395px']}
        height={['60px', '100px', '147px']}
        top={0}
        left={'50%'}
        transform='translateX(-50%)'
      ></Image>
      <Text
        fontSize={['32px', '56px', '64px']}
        lineHeight={['36px', '60px', '78px']}
        fontWeight={700}
        backgroundImage='linear-gradient(
          #9982F4, #70F7FC
        )'
        backgroundClip='text'
        fill='transparent'
      >
        125 SOL
      </Text>
      <Text fontSize={[14, 16, 20]} fontWeight={600} color={'white'} lineHeight={['21px', '24px', '30px']}>
        Total Prize Value
      </Text>
    </Box>
  )
}
