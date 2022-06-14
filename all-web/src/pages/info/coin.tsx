import {
  Container,
  Box,
  ChakraProvider,
} from '@chakra-ui/react'
import React from 'react'
import Navbar from '../../components/Navbar'
import { Footer } from '../../modules/landing/Footer'
import themeFlat from '../../themeFlat'
import { MAIN_LAUNCH_CONTAINER_MAX_WIDTH } from '../../constants'
import { AllLaunchIcon } from '../../modules/landing/components/AllLaunchIcon'
import { LogoImageIcon } from '../../modules/landing/components/icons/LogoIcon'
import Features from '../../modules/info/Features'
import { InfoHero } from '../../modules/info/InfoHero'
import { InfoMiddleHero } from '../../modules/info/InfoMiddleHero'
import { InfoBottomHero } from '../../modules/info/InfoBottomHero'
import ProjectsCarousel from '../../modules/info/ProjectsCarousel'
import { InfoBottom } from '../../modules/info/InfoBottom'
import {
  ALL_COIN_ADDITIONALS,
  ALL_COIN_FEATURES,
} from '../../modules/info/constants/features'
import { CategoryLabel } from '../../modules/info/types'
import Tokenomics from '../../modules/info/Tokenomics'

const Info = () => {
  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      {/* <Box>
        <Navbar colorTheme='light' />
        <Box
          position={'absolute'}
          zIndex={1}
          top={'5.5rem'}
          right={{ base: '2rem', lg: '1rem' }}
          sx={{ opacity: 0.1 }}
          color='#fff'
          display={['none', 'none', 'block', 'block']}
        >
          <LogoImageIcon color='#fff' />
        </Box>
        <InfoHero
          icon={<AllLaunchIcon />}
          subtitle='ALL Coin is an ecosystem where multiple projects earn $ALL, create utilities and thus also burn $ALL. It is a universal token which gets better and more valuable with every new project that joins and builds with it.'
          titleContent={
            <>
              <span>ALL Coin</span> creates <span>an</span> ecosystem{' '}
              <span>which unifies the best projects on Solana.</span>
            </>
          }
          bg='linear-gradient(144.21deg, #2B6FF8 5.32%, #820FB8 99.33%)'
        ></InfoHero>
        <Features
          title='ALL Coin'
          color='#A465FF'
          mainFeatures={ALL_COIN_FEATURES}
          additionalFeatures={ALL_COIN_ADDITIONALS}
        />

        <Container
          width='100%'
          marginX='auto'
          position={'relative'}
          px={['1rem', '2rem']}
          maxW={'unset'}
        >
          <Container
            maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}
            pt={['2rem', '2rem', '7.5rem']}
            pb='4rem'
            px={0}
          >
            <Tokenomics />
          </Container>
        </Container>

        <Container
          width='100%'
          marginX='auto'
          position={'relative'}
          px={['1rem', '2rem']}
          bg='#FAFAFA'
          maxW={'unset'}
          pb={['0rem', '0rem', '20rem']}
        >
          <Container maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH} py='6rem' px={0}>
            <InfoMiddleHero
              color='#A465FF'
              category='Coin'
              mintValue={1.4}
              royalityValue={1.2}
              title={
                <>
                  Don’t waste your time and start{' '}
                  <span>creating powerful NFT utilities </span>with us
                </>
              }
            />
          </Container>
        </Container>
        <Container
          width='100%'
          marginX='auto'
          position={'relative'}
          px={['1rem', '2rem']}
          maxW={'unset'}
          pb={['0rem', '0rem', '20rem']}
        >
          <Container maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH} py='6rem' px={0}>
            <ProjectsCarousel />
          </Container>
        </Container>
        <InfoBottomHero color='#A465FF' category={CategoryLabel.Coin} />
        <InfoBottom />
        <Box>
          <Footer />
        </Box>
      </Box> */}
    </ChakraProvider>
  )
}

export default Info
