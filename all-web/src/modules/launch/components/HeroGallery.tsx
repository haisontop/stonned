import {
  Box,
  ChakraProvider,
  Container,
  extendTheme,
  Flex,
  Grid,
  GridItem,
  Image,
  useTheme,
} from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/system'
import { createBreakpoints } from '@chakra-ui/theme-tools'
import React from 'react'
import themeFlat from '../../../themeFlat'
import { ProjectOverviewModel } from '../types/project'

interface HeroGalleryProps {
  gradientPosition?: 'top' | 'bottom'
  project: ProjectOverviewModel
}

const galleryBreakpoints = createBreakpoints({
  sm: '36em',
  md: '52.5em',
  lg: '68.125em',
  xl: '94.5em',
  '2xl': '94.5em',
})

export default function HeroGallery(props: HeroGalleryProps) {
  const { project, gradientPosition = 'top' } = props

  const bgTopGradient =
    gradientPosition === 'top'
      ? useColorModeValue(
          'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
          'linear-gradient(180deg, #1F2023 0%, rgba(31, 32, 35, 0) 100%)'
        )
      : useColorModeValue(
          'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)',
          'linear-gradient(180deg, rgba(31, 32, 35, 0) 0%, #1F2023 100%)'
        )

  const theme = useTheme()

  return (
    <Container
      h='auto'
      pt={['2rem']}
      pb={['1rem']}
      pos='relative'
      maxWidth='82rem'
      px={0}
    >
      <Box
        width='100%'
        height='7rem'
        position='absolute'
        background={bgTopGradient}
        top={gradientPosition === 'top' ? 0 : undefined}
        bottom={gradientPosition === 'bottom' ? 0 : undefined}
      />

      <Grid
        mt={'-1.25rem'}
        position='relative'
        zIndex={-1}
        gap={2}
        sx={{
          '@media only screen and (max-width: 36em)': {
            gridTemplateColumns: 'repeat(1, 1fr)',
          },
          '@media only screen and  (max-width: 52.5em) and (min-width: 36em)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media only screen and (min-width: 52.5em)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
        }}
      >
        {project.galleryUrls.filter(galleryUrl => !!galleryUrl.usedForHeader).map((galleryUrlObj, idx) => (
          <GridItem
            key={galleryUrlObj.id}
            width={['100%', '100%', '100%', '100%']}
            mx='auto'
            sx={{
              '@media only screen and (max-width: 36em)': {
                display: idx === 0 ? 'block' : 'none'
              },
              '@media only screen and  (max-width: 52.5em) and (min-width: 36em)':
                {
                  display: idx <= 1 ? 'block' : 'none',
                },
              '@media only screen and (min-width: 52.5em)': {
                display: 'block',
              },
            }}
            justifyContent='center'
          >
            <Image
              src={galleryUrlObj.url}
              width={['100%', '100%', '100%', '100%']}
              maxW='20rem'
              minW='15.635rem'
              mx='auto'
            />
          </GridItem>
        ))}
      </Grid>

      {/* <Grid
        mt={'-1.25rem'}
        position='relative'
        zIndex={-1}
        gap={2}
        sx={{
          '@media only screen and (max-width: 36em)': {
            gridTemplateColumns: 'repeat(1, 1fr)',
          },
          '@media only screen and  (max-width: 52.5em) and (min-width: 36em)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media only screen and (max-width: 68.125em) and (min-width: 52.5em)':
            {
              gridTemplateColumns: 'repeat(3, 1fr)',
            },
          '@media screen and  (min-width: 68.125em)': {
            gridTemplateColumns: 'repeat(4, 1fr)',
          },
        }}
      >
        <GridItem
          width={['100%', '100%', '100%', '100%']}
          display={'flex'}
          justifyContent='center'
        >
          <Image
            src='/images/launch/hero-1.png'
            width={['100%', '100%', '100%', '100%']}
            maxW='20rem'
            minW='15.635rem'
          />
        </GridItem>
        <GridItem
          width={['100%', '100%', '100%', '100%']}
          sx={{
            '@media only screen and (max-width: 36em)': {
              display: 'none',
            },
            '@media only screen and  (max-width: 52.5em) and (min-width: 36em)':
              {
                display: 'block',
              },
            '@media only screen and (max-width: 68.125em) and (min-width: 52.5em)':
              {
                display: 'block',
              },
            '@media screen and  (min-width: 68.125em)': {
              display: 'block',
            },
          }}
          justifyContent='center'
        >
          <Image
            src='/images/launch/hero-2.png'
            width={['100%', '100%', '100%', '100%']}
            display={['none', 'block', 'block', 'block', 'block']}
            maxW='20rem'
            minW='15.635rem'
          />
        </GridItem>
        <GridItem
          width={['100%', '100%', '100%', '100%']}
          sx={{
            '@media only screen and (max-width: 36em)': {
              display: 'none',
            },
            '@media only screen and  (max-width: 52.5em)': {
              display: 'none',
            },
            '@media only screen and (max-width: 68.125em) and (min-width: 52.5em)':
              {
                display: 'block',
              },
            '@media screen and  (min-width: 68.125em)': {
              display: 'block',
            },
          }}
          maxW='20rem'
          minW='15.635rem'
        >
          <Image
            src='/images/launch/hero-3.png'
            width={['100%', '100%', '100%', '100%']}
            maxW='20rem'
            minW='15.635rem'
          />
        </GridItem>
        <GridItem
          width={['100%', '100%', '100%', '100%']}
          sx={{
            '@media only screen and (max-width: 36em)': {
              display: 'none',
            },
            '@media only screen and  (max-width: 52.5em)': {
              display: 'none',
            },
            '@media only screen and (max-width: 68.125em) and (min-width: 52.5em)':
              {
                display: 'none',
              },
            '@media screen and  (min-width: 68.125em)': {
              display: 'block',
            },
          }}
          maxW='20rem'
          minW='15.635rem'
        >
          <Image
            src='/images/launch/hero-4.png'
            width={['100%', '100%', '100%', '100%']}
            maxW='20rem'
            minW='15.635rem'
          />
        </GridItem>
      </Grid> */}
    </Container>
  )
}
