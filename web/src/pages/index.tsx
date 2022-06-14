import { useEffect } from 'react'
import { Container, Box, Stack, Image } from '@chakra-ui/react'

import Hero from '../modules/stoned/Hero'
import Footer from '../modules/stoned/Footer'
import React from 'react'
import Roles from '../modules/stoned/Roles'
import Faq from '../modules/stoned/FAQ'
import Team from '../modules/stoned/Team'
import Utilities from '../modules/stoned/Utilities'
import Staking from '../modules/stoned/Staking'
import RoadMap from '../modules/stoned/RoadMap'
import Lore from '../modules/stoned/Lore'
import { MainLayout } from '../layouts/MainLayout'

const Index = () => {
  const startCanvas = () => {
    var c: any = document.getElementById('canv')
    var $ = c.getContext('2d')

    var col = function (
      x: number,
      y: number,
      r: string | number,
      g: string | number,
      b: string | number
    ) {
      $.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
      $.fillRect(x, y, 1, 1)
    }
    var R = function (x: number, y: number, t: number) {
      return Math.floor(222 + 64 * Math.cos((x * x - y * y) / 300 + t))
    }

    var G = function (x: number, y: number, t: number) {
      return Math.floor(
        222 +
          64 *
            Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
      )
    }

    var B = function (x: number, y: number, t: number) {
      return Math.floor(
        222 +
          64 *
            Math.sin(
              5 * Math.sin(t / 9) +
                ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
            )
      )
    }

    var t = 0

    var run = function () {
      for (let x = 0; x <= 35; x++) {
        for (let y = 0; y <= 35; y++) {
          col(x, y, R(x, y, t), G(x, y, t), B(x, y, t))
        }
      }
      t = t + 0.025
      window.requestAnimationFrame(run)
    }

    run()
  }

  useEffect(() => {
    startCanvas()
  }, [])

  return (
    <MainLayout
      navbar={{
        colorTheme: 'light',
        bgTransparent: true,
      }}
    >
      <Container
        w='100%'
        height={['auto', 'auto', 'auto', '100vh']}
        px={0}
        maxWidth='100vw'
        backgroundImage='/images/rect-home.png'
        backgroundSize='cover'
        position={'relative'}
      >
        <Box pt='5%' height='100%'>
          <Hero />
        </Box>
        <canvas
          id='canv'
          width='32'
          height='32'
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            zIndex: -1,
          }}
        ></canvas>
      </Container>
      <Stack
        maxW='100vw'
        marginLeft='auto'
        marginRight='auto'
        spacing={{ base: '0' }}
        color='black'
      >
        <Stack position={'relative'}>
          <Image
            alignSelf='center'
            width={{ base: '100%', md: '100%' }}
            src='/images/Balken.svg'
            position={'absolute'}
            zIndex='2'
            bottom={{ base: '-3vh', md: '-6vh' }}
          />
        </Stack>
        <Lore></Lore>
        <Roles />
        <Utilities />
        <Box>
          <Staking />
        </Box>

        <RoadMap />

        <Box m='0 auto'>
          <Team />
        </Box>
        <Box>
          <Faq />
        </Box>

        <Box>
          <Footer theme='light'></Footer>
        </Box>
      </Stack>
    </MainLayout>
  )
}

export default Index
