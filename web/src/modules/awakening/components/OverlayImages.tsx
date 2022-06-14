import { Image, Box, keyframes } from '@chakra-ui/react'

const floating = (top: number) => keyframes`
  0% {top: ${top}rem}
  50% {top: ${top+1}rem}
`;

const floatingAnimation = (top: number, delay: number) =>  `${floating(top)} infinite 3s ${delay}s ease-in-out`

export default function OverlayImages() {
  return (
    <Box position='relative'>
      <Image
        position='absolute'
        top='70rem'
        left='5%'
        w='5rem'
        h='5rem'
        src='/images/holder/awaking/googles.png'
        animation={floatingAnimation(70, 0)}
      />
      <Image
        position='absolute'
        top='72rem'
        right='5%'
        w='5rem'
        h='5rem'
        src='/images/holder/awaking/mushrooms.png'
        animation={floatingAnimation(72, -1)}
      />
      <Image
        position='absolute'
        left='3%'
        top='100rem'
        w='5rem'
        h='5rem'
        src='/images/holder/awaking/nuked-barrel.png'
        animation={floatingAnimation(100, -1.5)}
      />
      <Image
        position='absolute'
        top='103rem'
        right='3%'
        w='5rem'
        h='5rem'
        src='/images/holder/awaking/pizza.png'
        animation={floatingAnimation(103, -2)}
      />
      <Image
        position='absolute'
        top='120rem'
        left='12%'
        w='5rem'
        h='5rem'
        src='/images/holder/awaking/weedy.png'
        animation={floatingAnimation(120, -1.9)}
      />
      <Image
        position='absolute'
        top='125rem'
        right='15%'
        w='5rem'
        h='5rem'
        src='/images/holder/awaking/googles.png'
        animation={floatingAnimation(125, -2.5)}
      />
      <Image
        position='absolute'
        top='145rem'
        left='50%'
        w='5rem'
        src='/images/holder/awaking/rabbit.gif'
      />
      <Image
        position='absolute'
        top='142.5rem'
        left='30%'
        w='5rem'
        h='5rem'
        src='/images/holder/awaking/pizza.png'
        animation={floatingAnimation(142.5, 0)}
      />
      <Image
        position='absolute'
        top='140rem'
        right='20%'
        w='5rem'
        h='5rem'
        src='/images/holder/awaking/mushrooms.png'
        animation={floatingAnimation(140, -2.5)}
      />
    </Box>
  )
}
