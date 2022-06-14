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
  Image
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { MainLayout } from '../../layouts/MainLayout'
import Footer from '../nuked/Footer'
import JobCard from './JobCard'
import { useAllJobs } from './jobHooks'

const Jobs = () => {
  const [selectedCollection, setSelectedCollection] =
    useState<string>('genisis')
  const colorTheme = () => (selectedCollection == 'nuked' ? 'dark' : 'light')

  const jobsRes = useAllJobs()
  const isLoading = jobsRes.isLoading

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
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(1, 1fr)',
            'repeat(5, 1fr)',
          ]}
          columnGap={['1rem', '2rem', '2rem']}
          rowGap={['1rem']}
        >
          <GridItem colSpan={[1, 1, 3]}>
            <Heading
              color='#000'
              fontWeight={700}
              as='h1'
              fontSize={{ base: '2rem', lg: '2.5rem' }}
              transition='all .2s ease-in-out'
            >
              Create with us
            </Heading>
            <Text
              mt={['1rem', '1rem', '2.5rem']}
              fontSize={'0.875rem'}
              fontWeight={500}
            >
              We are always looking for bright and motiviated individuals who strive to make their mark in this world. 
              We are guided by our builder mentality to create beautiful art, support a sprited community
              and craft freakin' dope products.
            </Text>
            <Text
              mt={['1rem', '1rem', '2rem']}
              fontSize={'0.875rem'}
              fontWeight={500}
            >
              We are always pushing and contiously redefine what's possible as a Web3 brand. We are not just an NFT collection. We are more. We are SAC. Come join us.
            </Text>
          </GridItem>
          <GridItem colSpan={[1, 1, 2]}>
            <Flex
              width='100%'
              alignItems={'center'}
              justifyContent='center'
            >
              <Image src='images/job-art.jpg'></Image>
            </Flex>
          </GridItem>
        </Grid>

        <Stack mt='4rem'>
          <Heading
            color='#000'
            fontWeight={700}
            as='h1'
            fontSize={{ base: '1rem', lg: '1.5rem' }}
            transition='all .2s ease-in-out'
            mb='2.5rem'
          >
            Open Positions
          </Heading>
          {}
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
                  <Skeleton width="100%" height="12.5rem"/>
                </GridItem>
                <GridItem>
                  <Skeleton height="12.5rem"/>
                </GridItem>
                <GridItem>
                  <Skeleton height="12.5rem"/>
                </GridItem>
              </>
            ) : (
              jobsRes.data.map((job) => (
                <GridItem key={job.id}>
                  <JobCard job={job} />
                </GridItem>
              ))
            )}
          </Grid>
        </Stack>
        <Box mt='10rem' mb='6rem'>
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

export default Jobs
