import { Box } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box
      h={{ md: '31.875rem', sm: '20rem', base: '10rem' }}
      w={{ md: 'unset', sm: '50rem', base: '30rem' }}
      mt='10rem'
      alignItems='center'
      alignContent='center'
      backgroundImage='/images/holder/awaking/footer.png'
      backgroundSize='cover'
      blur='md'
    ></Box>
  )
}
