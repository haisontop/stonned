import React, { useEffect } from 'react'
import { useMemo } from 'react'
import superjson from 'superjson'
import { useWallet } from '@solana/wallet-adapter-react'

import { Flex, Stack } from '@chakra-ui/layout'
import {
  Box,
  Heading,
  Image,
  Text,
  SimpleGrid,
  Spinner,
  Progress,
  Link,
  Button,
  ChakraProvider,
  Container,
  GridItem,
  Grid,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import themeFlat from '../themeFlat'
import Navbar from '../modules/launch/components/Navbar'
import Hero from '../modules/launch/components/DetailHero'
import MintCard from '../modules/launch/components/MintCard'
import MintOverview from '../modules/launch/components/MintOverview'
import { useRouter } from 'next/router'
import { PrismaClient } from '@prisma/client'
import { ProjectDetailModel } from '../modules/launch/types/project'
import { WalletBalanceProvider } from '../utils/useWalletBalance'
import { ProjectHero } from '../modules/project/components/Hero'
import { IntroductionUnique } from '../modules/project/components/IntroductionUnique'
import { LearnAllBlue } from '../modules/project/components/LearnAllBlue'
import { GetStarted } from '../modules/project/components/GetStarted'
import { MAIN_LAUNCH_CONTAINER_MAX_WIDTH } from '../constants'
import { ProductsList } from '../modules/project/components/ProductsList'
import Footer from '../modules/project/components/Footer'
import ProjectsCarousel from '../modules/project/components/ProjectsCarousel'

function Project() {
  const router = useRouter()

  if (router.isFallback) {
    return <Spinner position='fixed' top='48%' left='49%'></Spinner>
  }

  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Navbar></Navbar>
      <Container w='100vw' maxW='100vw' pr='0' pl='0' pos='relative'>
        <ProjectHero />
      </Container>
      <IntroductionUnique />
      <ProductsList />
      <LearnAllBlue />
      <GetStarted />
      <Container
        width='100%'
        marginX='auto'
        position={'relative'}
        px={['1rem', '2rem']}
        maxW={'unset'}
      >
        <Container
          maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}
          py={['5rem', '5rem', '6rem']}
          px={0}
        >
          <ProjectsCarousel />
        </Container>
      </Container>
      <Footer />
    </ChakraProvider>
  )
}

const WalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function HOC(props: { project: string }) {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <Project />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
