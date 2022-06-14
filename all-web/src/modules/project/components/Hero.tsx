import {
  Box,
  BoxProps,
  Container,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  useBreakpointValue,
  Wrap,
} from '@chakra-ui/react'
import AliceCarousel from 'react-alice-carousel'
import { AiOutlineLeft } from 'react-icons/ai'
import {
  MAIN_CONTAINER_MAX_WIDTH,
  MAIN_LAUNCH_CONTAINER_MAX_WIDTH,
} from '../../../constants'
import { UTILITIES } from '../constants'

const handleDragStart = (event: any) => event.preventDefault()

const images = [
  {
    id: 1,
    src: '/images/project/hero-1.png',
  },
  {
    id: 2,
    src: '/images/project/hero-2.png',
  },
  {
    id: 3,
    src: '/images/project/hero-3.png',
  },
  {
    id: 4,
    src: '/images/project/hero-4.png',
  },
  {
    id: 5,
    src: '/images/project/hero-5.png',
  },
]

export const ProjectHero = () => {
  const smallDevice = useBreakpointValue({ base: true, md: false })

  let carouselItems: any[] | undefined = images.map((image) => (
    <Image
      src='/images/project/hero-1.png'
      onDragStart={handleDragStart}
      key={image.id}
    />
  ))

  return (
    <Container
      width='100%'
      marginX='auto'
      position={'relative'}
      bg={'#282936'}
      maxW={'unset'}
      px={0}
    >
      <Box position='relative'>
        <Container
          maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}
          pt={['19.5rem', '19.5rem', '5rem', '6rem']}
          pb={['2rem', '2rem', '6rem']}
          px={['1rem', '2rem']}
          position='relative'
        >
          <Stack spacing={[4, 8, 8]}>
            <Heading color='#fff' fontSize={'3rem'}>
              Stoned Ape Crew
            </Heading>
            <Text
              color='#fff'
              fontSize={'1rem'}
              maxW={['100%', '100%', '50%']}
              lineHeight={2}
              sx={{
                '& > span': {
                  color: '#595FD7',
                },
              }}
            >
              An NFT description is a paragraph of text that describes what your
              NFT or NFT collection is about. Similar to a product description,
              it not only has informational purposes but also serves as a form
              of sales pitch to potential buyers. Made by{' '}
              <span>SAC Design Team.</span> At a very high level, most NFTs are
              part of the Ethereum blockchain. Ethereum is a cryptocurrency,
              like bitcoin or dogecoin, but its blockchain also supports these
              NFTs, which store extra information that makes them work
              differently from, say, an ETH coin. It is worth noting that other
              blockchains can implement their own versions of NFTs. (Some
              already have.) NFTs can really be anything digital (such as
              drawings, music, your brain downloaded and turned into an AI), but
              a lot of the current excitement is around using the tech to sell
              digital art.
            </Text>
            <Stack>
              <Text color='#fff'>Utilities</Text>
              <Wrap>
                {UTILITIES.map((utility) => (
                  <Text
                    key={utility.name}
                    color='#fff'
                    border='1px solid #5D8DED'
                    borderRadius={'0.5rem'}
                    px='0.4rem'
                    py='0.2rem'
                    fontSize={'0.75rem'}
                  >
                    {utility.name}
                  </Text>
                ))}
              </Wrap>
            </Stack>
          </Stack>
        </Container>
        <Box
          position='absolute'
          width={['100%', '100%', '25rem', '35rem']}
          height={['17.5rem', '17.5rem', 'calc(100% - 12rem)', 'calc(100% - 12rem)']}
          top={['0rem', '0rem', '5rem', '6rem']}
          right={0}
          borderTopLeftRadius={[0, 0, '3.75rem']}
          borderBottomLeftRadius={['2rem', '3.75rem', '3.75rem']}
          borderBottomRightRadius={['2rem', '3.75rem', 0]}
          bg='#1B1B22'
          px={['2rem', '2rem', '2rem', '4rem']}
          py={['2rem', '2rem', '2rem', '4rem']}
          display={['flex', 'flex', 'flex']}
          alignItems={'center'}
        >
          <Image src='/images/sac_logo_with_text.png' objectFit={"contain"} width="100%" height="100%"/>
        </Box>
      </Box>
      <Box display={['none', 'none', 'flex']}>
        <Grid templateColumns={'repeat(5, 1fr)'} gap={0}>
          {images.map((image) => (
            <GridItem key={image.id}>
              <Image src={image.src} />
            </GridItem>
          ))}
        </Grid>
      </Box>
      <Box
        margin={['1rem 0 0', '1rem 0 0', '2rem 0 0']}
        display={['flex', 'flex', 'none']}
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
          controlsStrategy='responsive'
          autoPlayInterval={20}
          infinite
          keyboardNavigation
          animationType='slide'
          animationEasingFunction='linear'
          autoPlayDirection='ltr'
          renderNextButton={() => null}
          renderPrevButton={() => null}
          paddingRight={smallDevice ? 100 : 0}
          paddingLeft={smallDevice ? 100 : 0}
          responsive={{
            0: {
              items: 1,
            },
            400: {
              items: 1,
            },
            550: {
              items: 2,
            },
            800: {
              items: 3,
            },
          }}
        ></AliceCarousel>
      </Box>
    </Container>
  )
}
