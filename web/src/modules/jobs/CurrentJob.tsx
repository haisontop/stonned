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
  Image
} from '@chakra-ui/react'
import React, { useState } from 'react'
import Footer from '../nuked/Footer'
import JobOverview from './JobOverview'
import { useCurrentJob } from './jobHooks'
import { MainLayout } from '../../layouts/MainLayout'

const BASE_APPLY_URL = 'https://fomo-gmbh.jobs.personio.de/job'

const CurrentJob = () => {
  const [selectedCollection, setSelectedCollection] =
    useState<string>('genisis')
  const colorTheme = () => (selectedCollection == 'nuked' ? 'dark' : 'light')

  const jobRes = useCurrentJob()
  const isLoading = jobRes?.isLoading

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
        minHeight='100vh'
      >
        <Box
          mb='1rem'
          fontSize={'0.875rem'}
          fontFamily='heading'
          fontWeight={500}
        >
          <Link href='/careers'>{'<'} Back to Overview</Link>
        </Box>
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(10, 1fr)',
          ]}
          columnGap={['1rem', '2rem', '4rem', '8rem']}
          rowGap={['1rem']}
        >
          <GridItem colSpan={[1, 1, 6]} order={[2, 2, 1]}>
            {isLoading ? (
              <>
                <SkeletonText mt='1rem' noOfLines={1} spacing='4' />
                <SkeletonText mt='1rem' noOfLines={1} spacing='4' />
                <SkeletonText mt='1rem' noOfLines={2} spacing='4' />
                <SkeletonText mt='6rem' noOfLines={3} spacing='4' />
                <SkeletonText mt='6rem' noOfLines={3} spacing='4' />
              </>
            ) : (
              jobRes && jobRes.data && <JobOverview job={jobRes.data} />
            )}
          </GridItem>
          <GridItem colSpan={[1, 1, 4]} order={[1, 1, 2]}>
            <Box sx={{ position: 'sticky', top: '6rem' }}>
              <Flex
                width='100%'
                bg='#C4C4C4'
                alignItems={'center'}
                justifyContent='center'
              >
                <Image src='/images/job-art.jpg'></Image>
              </Flex>
              {jobRes?.data && (
                <Link
                  href={`${BASE_APPLY_URL}/${jobRes?.data.id}/#apply`}
                  target='_blank'
                >
                  <Button
                    colorScheme={'blackAlpha'}
                    mt={['1rem', '1rem', '2rem']}
                    mb={['1rem']}
                    bg='#000'
                    color='#fff'
                    sx={{
                      width: '100%',
                    }}
                  >
                    Apply now
                  </Button>
                </Link>
              )}
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

export default CurrentJob