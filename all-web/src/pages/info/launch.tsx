import { Container, Box, ChakraProvider } from '@chakra-ui/react'
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
  ALL_LAUNCH_ADDITIONALS,
  ALL_LAUNCH_FEATURES,
} from '../../modules/info/constants/features'
import { CategoryLabel } from '../../modules/info/types'

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
          subtitle='ALL Launch provides a great mint experience for minters and creators.
        With anti-bot and whitelisting features we secure your launch and by
        providing rich information about projects, users mint with confidence.'
          titleContent={
            <>
              <span>All Launch</span> is a <span>Solana NFT</span>
              <br />
              Launchpad{' '}
              <span>
                for secure, smooth
                <br /> and social mints
              </span>
              .
            </>
          }
          bg='linear-gradient(180deg, #ECBF4D 0%, #ED5647 100%)'
        ></InfoHero>
        <Features
          title='ALL Launch'
          color='#FC6653'
          mainFeatures={ALL_LAUNCH_FEATURES}
          additionalFeatures={ALL_LAUNCH_ADDITIONALS}
        />

        <Container
          width='100%'
          marginX='auto'
          position={'relative'}
          px={['1rem', '2rem']}
          bg='#FAFAFA'
          maxW={'unset'}
          pb={['0rem', '0rem', '20rem']}
        >
          <Container
            maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}
            pt='6rem'
            pb={['6rem', '12rem', '14rem']}
            px={0}
          >
            <InfoMiddleHero
              color='#FC6653'
              category='LAUNCH'
              title={
                <>
                  Don’t waste your time and start{' '}
                  <span>creating powerful NFT utilities </span>with us
                </>
              }
              mintValue={10}
              royalityValue={10}
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
        <InfoBottomHero color='#FC6653' category={CategoryLabel.Launch} />
        <InfoBottom />
        <Box>
          <Footer />
        </Box>
      </Box> */}
    </ChakraProvider>
  )
}

export default Info
