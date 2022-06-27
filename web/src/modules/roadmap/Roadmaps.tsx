import {
  Container,
  Heading,
  Stack,
  Box,
  Text,
  Grid,
  GridItem,
  Flex,
  Skeleton,
  IconButton,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaEquals } from 'react-icons/fa'
import { MainLayout } from '../../layouts/MainLayout'
import Footer from '../nuked/Footer'
import OurJourney from './OurJourney'
import OutFeature from './OutFeature'
import RoadmapCard from './RoadmapCard'
import { useAllRoadmaps } from './roadmapHooks'
import { Roadmap } from './types'

interface RoadmapMainCardProps {
  title: string
  subtitle: string
}

const RoadmapMainCard = (props: RoadmapMainCardProps) => {
  const { title, subtitle } = props

  return (
    <Box
      textAlign='center'
      display='flex'
      flexDir={'column'}
      alignItems='center'
      bgColor={'#F9F9F9'}
      p={['2rem 2.75rem']}
    >
      <Box
        height={['13.6rem']}
        bgColor='#C4C4C4'
        width='100%'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Text as='h3' fontSize='20px' fontWeight='bold'>
          Art
        </Text>
      </Box>
      <Text as='h3' fontSize='20px' fontWeight='bold' mt='1.5rem'>
        {title}
      </Text>
      <Box my='0.5rem' color={'rgba(146, 146, 146, 0.3)'}>
        <FaEquals />
      </Box>
      <Text as='h3' fontSize='20px' fontWeight='bold'>
        {subtitle}
      </Text>
    </Box>
  )
}

const Roadmaps = () => {
  const [selectedCollection, setSelectedCollection] =
    useState<string>('genisis')
  const colorTheme = () => (selectedCollection == 'nuked' ? 'dark' : 'light')

  const roadmapRes = useAllRoadmaps()
  const isLoading = roadmapRes.isLoading

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
        minH='100vh'
        pt={['5rem', '6rem', '6rem']}
        pb={['4rem', '4rem', '6rem']}
      >
        <Box textAlign={'center'}>
          <Heading
            color='#000'
            fontWeight={700}
            as='h1'
            fontSize={{ base: '2rem', lg: '2.5rem' }}
            transition='all .2s ease-in-out'
          >
            Our Vision & Values
          </Heading>
          <Text
            mt={['1rem', '1rem', '2.5rem']}
            fontSize={'0.875rem'}
            fontWeight={500}
          >
            We are guided by our builder mentality to create beautiful art,
            community and fuck*n dope products.
          </Text>
        </Box>

        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            'repeat(3, 1fr)',
          ]}
          mt={['1rem', '1rem', '3rem']}
          columnGap={['1rem', '2rem', '6rem']}
          rowGap={['1rem']}
        >
          <GridItem colSpan={[1]} borderRadius='sm' backgroundColor='lightGery'>
            <RoadmapMainCard title='NFT Art' subtitle='Louvre Level' />
          </GridItem>
          <GridItem colSpan={[1]} borderRadius='sm' backgroundColor='lightGery'>
            <RoadmapMainCard title='SAC' subtitle='Lifestyle Brand' />
          </GridItem>
          <GridItem colSpan={[1]} borderRadius='sm' backgroundColor='lightGery'>
            <RoadmapMainCard title='ALL Blue' subtitle='Web3 Tech Revolution' />
          </GridItem>
        </Grid>
        <OurJourney />

        <Stack mt='2.5rem'>
          <Heading
            color='#000'
            fontWeight={700}
            as='h1'
            fontSize={{ base: '1rem', lg: '1.5rem' }}
            transition='all .2s ease-in-out'
            mb='2.5rem'
            textAlign='center'
          >
            Our Feature
          </Heading>
          <OutFeature />
          <Grid
            templateColumns={[
              'repeat(1, 1fr)',
              'repeat(2, 1fr)',
              'repeat(3, 1fr)',
            ]}
            columnGap='1.625rem'
            rowGap='2.5rem'
          >
            {isLoading ? (
              <>
                <GridItem>
                  <Skeleton width='100%' height='12.5rem' />
                </GridItem>
                <GridItem>
                  <Skeleton height='12.5rem' />
                </GridItem>
                <GridItem>
                  <Skeleton height='12.5rem' />
                </GridItem>
              </>
            ) : (
              roadmapRes.data.map((roadmap: Roadmap) => (
                <GridItem key={roadmap.id}>
                  <RoadmapCard roadmap={roadmap} />
                </GridItem>
              ))
            )}
          </Grid>
        </Stack>
        <Box mt={['2rem', '5rem', '70rem']} mb='6rem'>
          <Text
            textAlign={'center'}
            fontSize='1.25rem'
            fontFamily={'heading'}
            fontWeight={600}
          >
            Expect the unexpected
          </Text>
        </Box>

        <Box pos='absolute' bottom='0' left='50%' transform='translateX(-50%)'>
          <Footer theme={colorTheme()}></Footer>
        </Box>
      </Container>
    </MainLayout>
  )
}

export default Roadmaps
