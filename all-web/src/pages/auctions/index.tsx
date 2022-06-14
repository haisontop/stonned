import React, { useMemo } from 'react'
import { Box, ChakraProvider, Container, Flex, Spinner } from '@chakra-ui/react'
import themeFlat from '../../themeFlat'
import Navbar from '../../components/Navbar'
import { Hero } from '../../modules/auction/components/Hero'
import { MAIN_CONTAINER_MAX_WIDTH } from '../../constants'
import { AuctionCardList } from '../../modules/auction/components/AuctionCardList'
import {
  MOCK_LIVE_AUCTIONS,
  MOCK_CLOSED_AUCTIONS,
} from '../../modules/auction/mock'
import { useAllAuctions } from '../../modules/auction/auctionHooks'
import CenteredSpinner from '../../components/CenteredSpinner'
import { ForceLightMode } from '../../components/ForceLightMode'

const Auctions: React.FC = () => {
  const auctionRes = useAllAuctions()

  const auctionForHero = useMemo(() => {
    const auctions = auctionRes.data
    if (!auctions) return null
    return auctions.live[0] || auctions.ended[0]
  }, [auctionRes])

  return (
    <ChakraProvider theme={themeFlat}>
      <ForceLightMode>
        <>
          <Navbar colorTheme='light' />
          <Container
            width='100%'
            maxWidth={MAIN_CONTAINER_MAX_WIDTH}
            marginX='auto'
            position={'relative'}
            padding='2rem'
          >
            {!auctionRes.data ? (
              <CenteredSpinner />
            ) : (
              <Box
                marginX='auto'
                padding={{
                  base: '3rem 0',
                  sm: '4rem 0',
                  md: '5rem 0',
                  lg: '6rem 0',
                }}
              >
                {auctionForHero && (
                  <Box>
                    <Hero auction={auctionForHero} />
                  </Box>
                )}
                <Box mt={['3rem', '4.5rem', '6.25rem']}>
                  <AuctionCardList
                    title='Live Auctions'
                    auctions={auctionRes.data.live}
                  />
                </Box>
                <Box mt={['3rem', '4.5rem', '6.25rem']}>
                  <AuctionCardList
                    title='Closed Auctions'
                    auctions={auctionRes.data.ended}
                  />
                </Box>
              </Box>
            )}
          </Container>
        </>
      </ForceLightMode>
    </ChakraProvider>
  )
}

export default Auctions
