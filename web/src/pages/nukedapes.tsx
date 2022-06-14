import { Container } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import ArtCarousel from '../modules/nukedNew/ArtCarousel'
import Faq from '../modules/nukedNew/FAQ'
import Hero from '../modules/nukedNew/Hero'
import HowToGetOne from '../modules/nukedNew/HowToGetOne'
import Lore from '../modules/nukedNew/Lore'
import Utilites from '../modules/nukedNew/Utilities'
import Footer from '../modules/nukedNew/Footer'
import NukedMint from '../modules/nuked/NukedMint'
import dynamic from 'next/dynamic'
import { WalletBalanceProvider } from '../utils/useWalletBalance'
import { MainLayout } from '../layouts/MainLayout'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const NukedApes = () => (
  <MainLayout
    navbar={{
      colorTheme: 'dark',
      bgTransparent: true,
    }}
  >
    <Container
      w='100vw'
      maxW='unset'
      pr='0'
      pl='0'
      background='black'
      backgroundImage='/images/nuked_bg.png'
      bgSize='cover'
      pos='relative'
    >
      <Container
        bgImage="url('/images/purple-smoke-bg.png')"
        bgSize='cover'
        bgRepeat='no-repeat'
        pt='5rem'
        w='100%'
        maxW='unset'
        pos='absolute'
        top='0'
        bottom='0'
        opacity='0.4'
      ></Container>

      <Hero></Hero>
    </Container>

    <Container w='100vw' maxW='unset' pr='0' pl='0'>
      {/* <Stack position={'relative'}>
          <Image
            alignSelf='center'
            width={{ base: '100%', md: '100%' }}
            src='/images/Balken_nuked.svg'
            position={'absolute'}
            zIndex='2'
            bottom={{ base: '-25px', md: '-50px' }}

          />
        </Stack> */}
      <Lore></Lore>
      <ArtCarousel></ArtCarousel>
      <HowToGetOne></HowToGetOne>
      <Utilites></Utilites>
      <Faq></Faq>

      <Footer theme='light'></Footer>
    </Container>
  </MainLayout>
)

const WalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function HOC() {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <NukedApes />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
