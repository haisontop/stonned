import { Image, Box, keyframes } from '@chakra-ui/react'

const floating = (top: number) => keyframes`
  0% {top: ${top}rem}
  50% {top: ${top+1}rem}
`;

const floatingAnimation = (top: number, delay: number) =>  `${floating(top)} infinite 3s ${delay}s ease-in-out`

export default function OverlayImagesInprogress() {
  return (
    <Box position='relative'>
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        top='70rem'
        left='5%'
        src='/images/holder/awaking/googles.png'
        animation={floatingAnimation(70, 0)}
      ></Image>
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        top='72rem'
        right='5%'
        src='/images/holder/awaking/mushrooms.png'
        animation={floatingAnimation(72, -1)}
      ></Image>
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        left='3%'
        top='100rem'
        src='/images/holder/awaking/nuked-barrel.png'
        animation={floatingAnimation(100, -1.5)}
      ></Image>
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        top='103rem'
        right='3%'
        src='/images/holder/awaking/pizza.png'
        animation={floatingAnimation(103, -2)}
      ></Image>
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        top='180rem'
        left='3%'
        src='/images/holder/awaking/weedy.png'
        animation={floatingAnimation(180, -1.9)}
      ></Image>
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        top='140rem'
        right='3%'
        src='/images/holder/awaking/googles.png'
        animation={floatingAnimation(140, -2.5)}
      ></Image>
      <Image
        position='absolute'
        top='160rem'
        left='4%'
        w='5rem'
        src='/images/holder/awaking/rabbit.gif'
      />
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        top='220rem'
        left='3%'
        src='/images/holder/awaking/nuked-barrel.png'
        animation={floatingAnimation(220, 0)}
      ></Image>
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        top='180rem'
        right='3%'
        src='/images/holder/awaking/pizza.png'
        animation={floatingAnimation(180, -2.5)}
      ></Image>
      <Image
        position='absolute'
        w='5rem'
        h='5rem'
        top='220rem'
        right='3%'
        src='/images/holder/awaking/mushrooms.png'
        animation={floatingAnimation(220, -1.25)}
      ></Image>
    </Box>
  )
}
