import {
  Box,
  Text
} from '@chakra-ui/react'
import React from 'react'
import AliceCarousel from 'react-alice-carousel'

const handleDragStart = (event: any) => event.preventDefault()

let carouselItems: any[] | undefined = []
for(let i=1; i<=22; i++) {
  carouselItems.push(
    <img src={`/images/nuked-carousel/carousel-${i}.png`} role='presentation' onDragStart={handleDragStart}/>
  )
}


export default function ArtCarousel() {
  return (
  <Box margin='4rem 0'>
    <AliceCarousel
      items={carouselItems}
      animationDuration={20000}
      animationType='slide'
      animationEasingFunction='linear'
      autoPlay
      autoPlayInterval={20}
      autoPlayDirection='ltr'
      disableButtonsControls
      disableDotsControls
      infinite
      mouseTracking
      responsive={{
        0: {
          items: 2
        },
        400: {
          items: 2
        },
        550: {
          items: 3
        },
        800: {
          items: 4
        },
        1200: {
          items: 5
        },
        1700: {
          items: 6
        },
        2000: {
          items: 7
        },
        2500: {
          items: 8
        }
      }}
    >
    </AliceCarousel>   
  </Box>
  )}

