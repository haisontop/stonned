import {
  Container,
  Box,
  ChakraProvider,
  Heading,
  Flex,
  Button,
  Link,
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
  ALL_STRATEGY_ADDITIONALS,
  ALL_STRATEGY_FEATURES,
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
          subtitle='We guide you through the process of tokenomics, launch plans, community structure, marketing and so much more, so you can launch your project to the metaverse.'
          titleContent={
            <>
              <span>All Strategy</span> is a <span>consulting</span> to turn{' '}
              <span>your idea into a successful NFT project.</span>
            </>
          }
          bg='linear-gradient(162.08deg, #21BECE 12.22%, #0F91DA 87.78%)'
        ></InfoHero>
        <Features
          title='ALLStrategy'
          color='#1AADD2'
          mainFeatures={ALL_STRATEGY_FEATURES}
          additionalFeatures={ALL_STRATEGY_ADDITIONALS}
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
              color='#1AADD2'
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
        <InfoBottomHero color='#1AADD2' category={CategoryLabel.Strategy} />
        <InfoBottom />
        <Box>
          <Footer />
        </Box>
      </Box> */}
    </ChakraProvider>
  )
}

export default Info
