import {
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Image,
  Text,
  Flex,
  Spinner,
  Link,
} from '@chakra-ui/react'
import { config } from 'process'
import React from 'react'
import { currentDrops } from '../merchConfig'
import DropTitle from './DropTitle'
import MerchFAQ from './FAQ'
import MerchFooter from './Footer'
import MerchDropContextProvider from '../MerchDropContextProvider'
import MerchNavbar from './Navbar'
import { useProducts } from '../merchHooks'

interface DropTitleProps {}

export default function CurrentDrops(props: DropTitleProps) {
  const {} = props

  const currentDropsRes = useProducts()
  const currentDrops = currentDropsRes.data

  return (
    <MerchDropContextProvider>
      <MerchNavbar></MerchNavbar>
      <Stack
        pt={['3rem', '6rem']}
        pos='relative'
        maxWidth='unset'
        justifyContent='center'
        alignItems='center'
        spacing={[20]}
      >
        <Heading
          textAlign={'center'}
          mt={['20px', 0]}
          fontSize={[54]}
          lineHeight={['60px']}
          fontWeight={600}
          fontFamily='Montserrat'
        >
          CURRENT DROPS
        </Heading>
        <SimpleGrid
          textAlign={'center'}
          spacing={[4, 6, 10]}
          spacingY={[14]}
          columns={[1, 1, 2]}
          px={10}
        >
          {!currentDrops ? (
            <Flex>
              <Spinner />
            </Flex>
          ) : (
            currentDrops?.map((drop) => {
              return (
                <Link key={drop.href} href={`/store/products/${drop.href}`}>
                  <Stack
                    cursor={'pointer'}
                    alignItems='center'
                    border='2px solid #CBCBCB'
                    borderRadius={'20px'}
                    p={[4]}
                  >
                    <Image
                      width='250px'
                      height='250px'
                      src={drop.image}
                      /*  fallback={
                      <Flex
                        width='250px'
                        height='250px'
                        alignItems={'center'}
                        justifyContent='center'
                      >
                        <Spinner alignSelf={'center'} />
                      </Flex>
                    } */
                    />
                    <Text fontWeight={500} fontSize='lg'>
                      {drop.name}
                    </Text>
                    <Text
                      textTransform={'uppercase'}
                      color={'#A0A0A0'}
                      fontSize='sm'
                    >
                      {drop.pricing.sol.toFixed(2)} sol + {drop.pricing.puff.toFixed(2)} $puff
                    </Text>
                  </Stack>
                </Link>
              )
            })
          )}
        </SimpleGrid>
      </Stack>
      <MerchFAQ />
      <MerchFooter theme='light' />
    </MerchDropContextProvider>
  )
}
