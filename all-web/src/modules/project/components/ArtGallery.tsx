import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Stack,
  Text,
  SimpleGrid,
  IconButton,
} from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/system'
import React, { useRef } from 'react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import AliceCarousel from 'react-alice-carousel'

const GALLERY_IMAGES = [
  {
    url: '/images/launch/art-main.png',
    hidden: true,
  },
  {
    url: '/images/launch/art-right-1.png',
    hidden: true,
  },
  {
    url: '/images/launch/art-right-2.png',
    hidden: true,
  },
  {
    url: '/images/launch/art-right-3.png',
    hidden: true,
  },
  {
    url: '/images/launch/art-right-4.png',
    hidden: true,
  },
  {
    url: '/images/launch/art-1.png',
  },
  {
    url: '/images/launch/art-2.png',
  },
  {
    url: '/images/launch/art-3.png',
  },
  {
    url: '/images/launch/art-4.png',
  },
]

export default function ArtGallery() {
  const carouselItems: React.ReactNode[] = React.useMemo(() => {
    return GALLERY_IMAGES.map((galleryImage) => {
      return (
        <GridItem
          display={['block', 'block', 'block', 'none']}
          key={galleryImage.url}
        >
          <Image src={galleryImage.url} width='100%' />
        </GridItem>
      )
    })
  }, [])

  return (
    <Box mb={['2rem', '2rem', 0]} width='100%'>
      <Stack spacing={[2, 2, 4]} width='100%'>
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(4, 1fr)',
            'repeat(4, 1fr)',
          ]}
          gap={[2, 2, 4]}
          mt={["2rem", "2rem", 0]}
        >
          <GridItem colSpan={[1, 1, 2, 2]} display={['flex', 'flex', 'none', 'grid']}>
            <Image src='/images/launch/art-main.png' width='100%' />
          </GridItem>
          <GridItem colSpan={[1, 1, 2, 2]} display={['none', 'none', 'none', 'grid']}>
            <Grid
              templateColumns={[
                'repeat(2, 1fr)',
                'repeat(2, 1fr)',
                'repeat(2, 1fr)',
                'repeat(2, 1fr)',
              ]}
              gap={[2, 2, 4]}
            >
              <GridItem colSpan={1}>
                <Image
                  src='/images/launch/art-right-1.png'
                  width='100%'
                  // minW={'15.625rem'}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <Image
                  src='/images/launch/art-right-2.png'
                  width='100%'
                  // minW={'15.625rem'}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <Image
                  src='/images/launch/art-right-3.png'
                  width='100%'
                  // minW={'15.625rem'}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <Image
                  src='/images/launch/art-right-4.png'
                  width='100%'
                  // minW={'15.625rem'}
                />
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
        <SimpleGrid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            'repeat(3, 1fr)',
            'repeat(4, 1fr)',
          ]}
          display={['none', 'none', 'grid', 'grid']}
          gap={[2, 2, 4]}
        >
          {GALLERY_IMAGES.map((galleryImage) => (
            <GridItem
              display={
                galleryImage.hidden
                  ? ['block', 'block', 'block', 'none']
                  : undefined
              }
              key={galleryImage.url}
            >
              <Image src={galleryImage.url} width='100%' />
            </GridItem>
          ))}
        </SimpleGrid>
      </Stack>
      <Box
        margin={['0.5rem 0 0', '1rem 0 0', '2rem 0 0']}
        py={[0, 0, 2]}
        display={['block', 'block', 'none']}
        width='100%'
        sx={{
          '& .alice-carousel__prev-btn, .alice-carousel__next-btn': {
            display: 'none',
          },
        }}
      >
        <AliceCarousel
          mouseTracking
          disableDotsControls
          items={carouselItems}
          autoPlayInterval={20}
          keyboardNavigation
          animationType='slide'
          animationEasingFunction='ease-in-out'
          autoPlayDirection='ltr'
          infinite={true}
          renderNextButton={() => null}
          renderPrevButton={() => null}
          responsive={{
            0: {
              items: 2,
            },
            400: {
              items: 2,
            },
            600: {
              items: 2,
            },
          }}
        ></AliceCarousel>
      </Box>
    </Box>
  )
}
