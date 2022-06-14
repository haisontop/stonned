import React from 'react'
import {
  Box,
  Link,
  ChakraProvider,
  Container,
  SimpleGrid,
} from '@chakra-ui/react'
import themeFlat from '../../themeFlat'
import Navbar from '../../components/Navbar'
import { Hero } from '../../modules/auction/components/Hero'
import { MAIN_CONTAINER_MAX_WIDTH } from '../../constants'
import {
  MOCK_CLOSED_AUCTIONS,
  MOCK_LIVE_AUCTIONS,
} from '../../modules/auction/mock'
import { useRouter } from 'next/router'
import { NFTAttributes } from '../../modules/auction/components/NFTAttributes'
import { PreviousBids } from '../../modules/auction/components/PreviousBids'
import { useAuction } from '../../modules/auction/auctionHooks'
import CenteredSpinner from '../../components/CenteredSpinner'
import { WalletMultiButton } from '../../components/wallet-ui'

const AuctionDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const auctionsRes = useAuction(id!)

  const auction = auctionsRes.data

  return (
    <ChakraProvider theme={themeFlat}>
      <Navbar colorTheme='light' />
      <Container
        width='100%'
        maxWidth={MAIN_CONTAINER_MAX_WIDTH}
        marginX='auto'
        position={'relative'}
        padding='2rem'
      >
        <Box
          marginX='auto'
          padding={{
            base: '3rem 0',
            sm: '4rem 0',
            md: '5rem 0',
            lg: '6rem 0',
          }}
        >
          {!auction ? (
            <CenteredSpinner />
          ) : (
            <Box>
              <Box mb='2.375rem' position={'relative'}>
                <Link
                  href={'/auctions'}
                  fontFamily={'Montserrat, sans-serif'}
                  fontSize='1rem'
                  color={'dark'}
                  fontWeight='600'
                >
                  {`< Explore all Auctions`}
                </Link>
                <Box
                  display={['none', null, 'unset']}
                  position={'absolute'}
                  right={0}
                  top={0}
                >
                  <WalletMultiButton />
                </Box>
              </Box>
              <Hero detailView auction={auction} />
            </Box>
          )}
          {auction && (
            <Box mt={['3rem', '4.5rem', '6.25rem']}>
              {/* <Flex justifyContent={'space-between'}> */}
              <SimpleGrid
                columns={[1, 2]}
                spacing={['2rem', '3rem', '5.6rem']}
                width='100%'
              >
                <NFTAttributes />
                <PreviousBids auction={auction} />
              </SimpleGrid>
              {/* </Flex> */}
            </Box>
          )}
        </Box>
      </Container>
    </ChakraProvider>
  )
}

export default AuctionDetail
