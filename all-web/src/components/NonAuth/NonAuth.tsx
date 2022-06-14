import { Flex, Image, Stack, Text } from '@chakra-ui/react'
import { WalletMultiButton } from '../wallet-ui'
import Navbar from '../../modules/launch/components/Navbar'

export const NonAuth = () => {
  return (
    <>
      <Navbar />
      <Flex w='100%' justifyContent={'center'} mt='5.6rem'>
        <Stack gap='2rem' alignItems={'center'}>
          <Image src='/icons/logo-black.svg' width={'3.2rem'} />
          <Text
            maxW={'17.5rem'}
            textAlign='center'
            fontSize={'1.25rem'}
            fontWeight={600}
          >
            Connect your Solana wallet to access your profile
          </Text>
          <WalletMultiButton>Connect Wallet</WalletMultiButton>
        </Stack>
      </Flex>
    </>
  )
}
