import {
  Box,
  BoxProps,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import { AiOutlineLeft } from 'react-icons/ai'
import { GradientText } from '../../../components/GradientText'
import {
  MAIN_CONTAINER_MAX_WIDTH,
  MAIN_LAUNCH_CONTAINER_MAX_WIDTH,
} from '../../../constants'
import ArtCarousel from '../../nuked/ArtCarousel'
import { UTILITIES } from '../constants'
import CollaborationCarousel from './CollaborationCarousel'
import CoinIcon from './icons/CoinIcon'
import LaunchIcon from './icons/LaunchIcon'
import StrategyIcon from './icons/StrategyIcon'
import TechIcon from './icons/TechIcon'

const CATEGORIES = [
  {
    id: 'strategy',
    logo: <StrategyIcon height='22px' width='209px' />,
    content:
      'We have a large scale group to support each other in this game, Join us to get the news as soon as possible and follow our latest announcements!',
    bgGradient: 'linear-gradient(180deg, #21BECE 0%, #0F91DA 100%)',
    link: '/info/strategy',
  },
  {
    id: 'tech',
    logo: <TechIcon height='22px' width='142px' />,
    content:
      'We have a large scale group to support each other in this game, Join us to get the news as soon as possible and follow our latest announcements!',
    bgGradient: 'linear-gradient(180deg, #8D48DD 0%, #EC574D 100%)',
    link: '/info/tech',
  },
  {
    id: 'launch',
    logo: <LaunchIcon height='22px' width='190px' />,
    content:
      'We have a large scale group to support each other in this game, Join us to get the news as soon as possible and follow our latest announcements!',
    bgGradient: 'linear-gradient(180deg, #ECBF4D 0%, #ED5647 100%), #EEEEEE',
    link: '/info/launch',
  },
  {
    id: 'coin',
    logo: <CoinIcon height='22px' width='141px' />,
    content:
      'We have a large scale group to support each other in this game, Join us to get the news as soon as possible and follow our latest announcements!',
    bgGradient:
      'linear-gradient(144.21deg, #2B6FF8 5.32%, #820FB8 99.33%), #EEEEEE',
    link: '/info/coin',
  },
]

interface GetStartedProps {}

interface CategoryCardProps {
  logo: JSX.Element
  content: string
  bgGradient: BoxProps['bg']
}

const CategoryCard = (props: CategoryCardProps) => {
  const { logo, content, bgGradient } = props

  return (
    <Stack
      bg='#0E0E0E'
      px={['1.5rem']}
      py={['4rem']}
      borderRadius={['1.25rem']}
      spacing='1rem'
    >
      {logo}
      <Text lineHeight={2} color='#BBBBBB'>
        {content}
      </Text>
      <HStack>
        <Box width='2rem' as='span' height='2px' bg={bgGradient}></Box>
        <GradientText bgGradient={bgGradient}>Learn More</GradientText>
      </HStack>
    </Stack>
  )
}

export const GetStarted = () => {
  return (
    <Container
      pb={['2rem', '2rem', '6rem']}
      position='relative'
      bg='#000'
      maxW={'unset'}
      pt={['18rem', '12rem', '18rem']}
      width={'100%'}
    >
      <Box
        position='absolute'
        top={['-39rem', '-35rem', '-22rem', '-22rem']}
        ml={[0, 0, '3rem', '6rem', '12rem']}
        width={["calc(100% - 1rem)", "calc(100% - 1rem)", 'calc(100% - 3rem)', 'calc(100% - 6rem)', 'calc(100% - 12rem)']}
      >
        <CollaborationCarousel />
      </Box>
      <Container
        maxW={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}
        px={["1rem", "2rem"]}
      >
        <Text
          fontWeight={700}
          fontSize={['1.75rem', '1.75rem', '3rem']}
          fontFamily={'heading'}
          color='#fff'
          mb={['2rem', '2rem', '5rem']}
        >
          Ready to get started?
        </Text>
        <Grid
          templateColumns={[
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            'repeat(2, 1fr)',
            'repeat(4, 1fr)',
          ]}
          columnGap={2}
          rowGap={2}
        >
          {CATEGORIES.map((category) => (
            <GridItem key={category.id}>
              <CategoryCard
                logo={category.logo}
                content={category.content}
                bgGradient={category.bgGradient}
              />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Container>
  )
}
