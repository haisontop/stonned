import { Box, Grid, GridItem, Image, Stack, Heading } from '@chakra-ui/react'
import React from 'react'
import { GalleryUrl } from '@prisma/client'

interface Props {
  galleryUrls: GalleryUrl[]
}

const imageStyle = {
  filter: 'drop-shadow(0px 2px 10px rgba(0, 0, 0, 0.15))',
  borderRadius: '5px',
}

const ArtGallery: React.FC<Props> = ({ galleryUrls }) => {
  if (galleryUrls.length === 0) return null

  return (
    <Box>
      <Heading fontWeight={600} fontSize={['1.25rem', '1.5rem']} mb={'1.25rem'}>
        Art
      </Heading>
      <Stack>
        <Grid
          templateColumns={[
            'repeat(2, 1fr)',
            'repeat(4, 1fr)',
            'repeat(4, 1fr)',
            'repeat(4, 1fr)',
          ]}
          templateRows={`repeat(${galleryUrls.length >= 5 ? 3 : 2}, 1fr)`}
          gap={['1rem', '1.5rem', '2rem']}
        >
          <GridItem rowSpan={2} colSpan={[2]}>
            <Image src={galleryUrls[0].url} width='100%' style={imageStyle} />
          </GridItem>
          {galleryUrls.slice(1).map((galleryUrl) => (
            <GridItem key={galleryUrl.id} colSpan={[1]} rowSpan={1}>
              <Image src={galleryUrl.url} width='100%' style={imageStyle} />
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Box>
  )
}

export default ArtGallery
