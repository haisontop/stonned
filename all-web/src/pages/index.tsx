import {
  Container,
  Box,
  ChakraProvider,
  Heading,
  Flex,
  Button,
  Link,
} from '@chakra-ui/react'
import React from 'react'
import Navbar from '../components/Navbar'
import { BackImage } from '../modules/landing/components/BackImage'
import { Footer } from '../modules/landing/Footer'
import { Hero } from '../modules/landing/Hero'
import { Products } from '../modules/landing/Products'
import { Projects } from '../modules/landing/Projects'
import { ApplyNowButton } from '../components/ApplyNowButton'
import themeFlat from '../themeFlat'
import { MAIN_CONTAINER_MAX_WIDTH } from '../constants'

const Index = () => {
  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Box>
        <Navbar colorTheme='light' />

        <Container
          width='100%'
          maxWidth={MAIN_CONTAINER_MAX_WIDTH}
          marginX='auto'
          position={'relative'}
          padding='2rem'
        >
          <Box
            position={'absolute'}
            zIndex={-1}
            top={'1.5rem'}
            right={{ base: '2rem', lg: '0' }}
          >
            <BackImage />
          </Box>

          <Box
            w='fit-content'
            marginX='auto'
            padding={{
              base: '6rem 0',
              sm: '8rem 0',
              md: '10rem 0',
              lg: '12rem 0',
            }}
          >
            <Hero />

            <Box mt={['3rem', '5rem', '7rem']}>
              <Products />
            </Box>

            <Box mt={['4rem', '6rem', '7rem']}>
              <Projects />
            </Box>

            <Box mt={['3rem', '5rem', '7rem']}>
              <Heading
                fontSize={['2xl', '4xl', '5xl']}
                color='black'
                fontWeight='700'
              >
                Together we are stronger 🤝
              </Heading>
            </Box>
            <Flex
              gap='1.5rem'
              mt={['1.5rem', '2rem', '3rem']}
              flexWrap={'wrap'}
            >
              <Link
                href='https://airtable.com/shrOYiab2lhb4ATzk'
                target='_blank'
              >
                <ApplyNowButton />
              </Link>
              {/* <Button
                size={'md'}
                color='#282936'
                bg='transparent'
                border='1px solid #282936'
                _hover={{
                  bg: '#282936',
                  color: 'white',
                }}
                css={{ borderRadius: '10px' }}
              >
                Download Pitchdesk
              </Button> */}
            </Flex>
          </Box>
        </Container>
        <Box>
          <Footer />
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default Index
