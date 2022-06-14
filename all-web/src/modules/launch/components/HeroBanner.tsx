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

interface HeroBannerProps {
  gradientPosition?: 'top' | 'bottom'
  project: ProjectOverviewModel
}

export default function HeroBanner(props: HeroBannerProps) {
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

      <Box mt='1.25rem' pos='relative' zIndex={-1}>
        <Image 
          src={project.desktoBannerUrl}
        />
      </Box>

    </Container>
  )
}
