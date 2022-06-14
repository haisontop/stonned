import {
  Container,
  Heading,
  Stack,
  Box,
  Text,
  Grid,
  GridItem,
  Flex,
  Button,
  Link,
  SkeletonText,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import Footer from '../nuked/Footer'
import RoadmapOverview from './RoadmapOverview'
import { useCurrentRoadmap } from './roadmapHooks'
import { MainLayout } from '../../layouts/MainLayout'

const CurrentRoadmap = () => {
  const [selectedCollection, setSelectedCollection] =
    useState<string>('genisis')
  const colorTheme = () => (selectedCollection == 'nuked' ? 'dark' : 'light')

  const roadmapRes = useCurrentRoadmap()
  const isLoading = roadmapRes?.isLoading

  return (
    <MainLayout
      navbar={{
        colorTheme: colorTheme(),
        bgTransparent: true,
      }}
    >
      <Container
        w='100vw'
        maxW='70.75rem'
        pt={['5rem', '6rem', '6rem']}
        pb={['4rem', '4rem', '6rem']}
      >
        <Box
          mb='1rem'
          fontSize={'0.875rem'}
          fontFamily='heading'
          fontWeight={500}
        >
          <Link href='/roadmap'>{'<'} Back to Overview</Link>
        </Box>
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(5, 1fr)',
          ]}
          columnGap={['1rem', '2rem', '4rem', '8rem']}
          rowGap={['1rem']}
        >
          <GridItem colSpan={[1, 1, 3]} order={[2, 2, 1]}>
            {isLoading ? (
              <>
                <SkeletonText mt='1rem' noOfLines={1} spacing='4' />
                <SkeletonText mt='1rem' noOfLines={1} spacing='4' />
                <SkeletonText mt='1rem' noOfLines={2} spacing='4' />
                <SkeletonText mt='6rem' noOfLines={3} spacing='4' />
                <SkeletonText mt='6rem' noOfLines={3} spacing='4' />
              </>
            ) : (
              roadmapRes &&
              roadmapRes.data && <RoadmapOverview roadmap={roadmapRes.data} />
            )}
          </GridItem>
          <GridItem colSpan={[1, 1, 2]} order={[1, 1, 2]}>
            <Box sx={{ position: 'sticky', top: '6rem' }}>
              <Flex
                height={['10rem', '10rem', '12rem', '12.7rem']}
                width='100%'
                bg='#C4C4C4'
                alignItems={'center'}
                justifyContent='center'
              >
                <Heading
                  color={'rgba(0, 0, 0, 0.2)'}
                  fontWeight={600}
                  as='h1'
                  fontSize={{ base: '2rem', lg: '2.5rem' }}
                  textAlign='center'
                  transition='all .2s ease-in-out'
                >
                  Art
                </Heading>
              </Flex>
            </Box>
          </GridItem>
        </Grid>

        <Box mt={['4rem', '4rem', '10rem']} mb={['16rem', '16rem', '6rem']}>
          <Text
            textAlign={'center'}
            fontSize='1.25rem'
            fontFamily={'heading'}
            fontWeight={600}
          >
            Let’s have fun together 🤝
          </Text>
        </Box>

        <Box pos='absolute' bottom='0' left='50%' transform='translateX(-50%)'>
          <Footer theme={colorTheme()}></Footer>
        </Box>
      </Container>
    </MainLayout>
  )
}

export default CurrentRoadmap
