import { Stack, Box, Image } from '@chakra-ui/react'

export default function Hero() {
  return (
    <Stack
      direction='column'
      alignItems='center'
      justifyContent={{ base: 'center', md: 'flex-end' }}
      spacing={5}
      flex='1'
      mb='2.375rem'
    >
      <Image
        src='/images/holder/awaking/awaking-ape.gif'
        backgroundSize='cover'
        w={{ lg: '74.8rem', md: '50.67rem', sm: '42rem', base: '27.75rem' }}
      />
      <Image
        src='/images/holder/awaking/awaking-txt.png'
        backgroundSize='cover'
        w={{ lg: '33.8rem', md: '28.77rem', sm: '28.77rem', base: '19.18rem' }}
      />
    </Stack>
  )
}
