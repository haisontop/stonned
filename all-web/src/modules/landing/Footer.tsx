import { Center, Flex, Link } from '@chakra-ui/react'
import { Logo } from '../../components/Logo'

export const Footer = () => {
  return (
    <Center
      position={'relative'}
      paddingY={['5rem', '7rem', '10rem']}
      bg='#282936'
    >
      <Logo
        width={'80%'}
        maxWidth='70rem'
        fillColor='rgba(255, 255, 255, 0.1)'
      />
      <Flex
        position={'absolute'}
        bottom={['1rem', '2.8rem']}
        left={0}
        width='100%'
        justifyContent='center'
        alignItems='center'
        gap={['1.5rem', '2.5rem', '4rem']}
      >
        {/* <Link color='rgba(255, 255, 255, 0.3)'>Privacy Policy</Link>
        <Link color='rgba(255, 255, 255, 0.3)'>Terms of Service</Link> */}
      </Flex>
    </Center>
  )
}
