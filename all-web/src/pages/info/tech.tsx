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
  ALL_TECH_FEATURES,
  ALL_TECH_ADDITIONALS,
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
          subtitle='From holder verification to staking and breeding, to on-chain raffles. We offer a full stack of products that let you focus on your project.'
          titleContent={
            <>
              <span>ALL Tech</span> is a{' '}
              <span>complete technology platform</span> to create{' '}
              <span>powerful NFT utilites</span>
            </>
          }
          bg='linear-gradient(180deg, #8D48DD 0%, #EC574D 100%)'
        ></InfoHero>
        <Features
          title='ALLTech'
          color='#DC1670'
          mainFeatures={ALL_TECH_FEATURES}
          additionalFeatures={ALL_TECH_ADDITIONALS}
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
          <Container maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH} py='6rem' px={0}>
            <InfoMiddleHero
              color='#DC1670'
              category='STRATEGY'
              title={
                <>
                  Don’t waste your time and start{' '}
                  <span>creating powerful NFT utilities </span>with us
                </>
              }
              mintValue={1.4}
              royalityValue={1.2}
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
        <InfoBottomHero color='#DC1670' category={CategoryLabel.Tech} />
        <InfoBottom />
        <Box>
          <Footer />
        </Box>
      </Box> */}
    </ChakraProvider>
  )
}

export default Info
