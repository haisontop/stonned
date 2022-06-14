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
  useBreakpointValue,
  Wrap,
} from '@chakra-ui/react'
import { GradientText } from '../../../components/GradientText'
import {
  MAIN_CONTAINER_MAX_WIDTH,
  MAIN_LAUNCH_CONTAINER_MAX_WIDTH,
  MAIN_PROJECT_CONTAINER_MAX_WIDTH,
} from '../../../constants'
import { AllCoinIcon } from '../../landing/components/AllCoinIcon'
import { AllLaunchIcon } from '../../landing/components/AllLaunchIcon'
import { AllStrategyIcon } from '../../landing/components/AllStrategyIcon'
import { AllTechIcon } from '../../landing/components/AllTechIcon'
import { AllCoinBeautyIcon } from './icons/AllCoinBeautyIcon'
import { AllLaunchBeautyIcon } from './icons/AllLaunchBeautyIcon'
import { AllStrategyBeautyIcon } from './icons/AllStrategyBeautyIcon'
import { AllTechBeautyIcon } from './icons/AllTechBeautyIcon'

const PRODUCTS = [
  {
    id: 'product-tech',
    logo: <AllTechIcon />,
    mobileLogo: <AllTechBeautyIcon />,
    desc: 'An NFT description is a paragraph of text that describes what your NFT or NFT collection is about. Similar to a product description, it not only has informational purposes but also serves as a form of sales pitch to potential buyers. Made by ',
    bg: 'linear-gradient(180deg, #8D48DD 0%, #EC574D 100%), #EEEEEE',
    link: '/info/tech',
  },
  {
    id: 'product-launch',
    logo: <AllLaunchIcon />,
    mobileLogo: <AllLaunchBeautyIcon />,
    desc: 'An NFT description is a paragraph of text that describes what your NFT or NFT collection is about. Similar to a product description, it not only has informational purposes but also serves as a form of sales pitch to potential buyers. Made by .',
    bg: 'linear-gradient(180deg, #ECBF4D 0%, #ED5647 100%), #EEEEEE',
    link: '/info/launch',
  },

  {
    id: 'product-strategy',
    logo: <AllStrategyIcon />,
    mobileLogo: <AllStrategyBeautyIcon />,
    desc: 'An NFT description is a paragraph of text that describes what your NFT or NFT collection is about. Similar to a product description, it not only has informational purposes but also serves as a form of sales pitch to potential buyers. Made by ',
    bg: 'linear-gradient(180deg, #21BECE 0%, #0F91DA 100%), #EEEEEE',
    link: '/info/strategy',
  },
  {
    id: 'product-coin',
    logo: <AllCoinIcon />,
    mobileLogo: <AllCoinBeautyIcon />,
    desc: 'An NFT description is a paragraph of text that describes what your NFT or NFT collection is about. Similar to a product description, it not only has informational purposes but also serves as a form of sales pitch to potential buyers. Made by ',
    bg: 'linear-gradient(144.21deg, #2B6FF8 5.32%, #820FB8 99.33%), #EEEEEE',
    link: '/info/coin',
  },
]

export const ProductsList = () => {
  const smallDevice = useBreakpointValue({ base: true, md: false })
  const mobileDevice = useBreakpointValue({ base: true, sm: false })

  return (
    <Container
      maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}
      pb={['2rem', '2rem', '4rem']}
      px={['1rem', '2rem']}
      position='relative'
    >
      <Heading
        sx={{
          '& > span': {
            color: '#595FD7',
          },
        }}
        as='h2'
        fontSize={['1.75rem', '1.75rem', '3rem']}
        mb={['2rem', '2rem', '5rem']}
      >
        Products used in this case
      </Heading>

      {PRODUCTS.map((product, index) => {
        return (
          <Grid
            templateColumns={[
              'repeat(1, 1fr)',
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
            ]}
            key={product.id}
            mb={["2.25rem", 0, 0]}
            rowGap={["1rem", 0, 0]}
          >
            <GridItem order={mobileDevice ? 1 : (index % 2) + 1}>
              <Box
                bg={product.bg}
                width='100%'
                height='100%'
                display='flex'
                alignItems={'center'}
                justifyContent='center'
                borderTopLeftRadius={index % 2 && !mobileDevice ? 0 : 8}
                borderBottomLeftRadius={
                  index % 2 === 0 ||
                  index === PRODUCTS.length - 1 ||
                  mobileDevice
                    ? 8
                    : 0
                }
                borderTopRightRadius={
                  index % 2 || index === 0 || mobileDevice ? 8 : 0
                }
                borderBottomRightRadius={index % 2 || mobileDevice ? 8 : 0}
                px={["1rem", "1rem", '3.5rem']}
                py={["4rem", "1rem", '3.5rem']}
              >
                {smallDevice ? product.mobileLogo : product.logo}
              </Box>
            </GridItem>
            <GridItem order={mobileDevice ? 2 : ((index + 1) % 2) + 1}>
              <Box display='flex' flexDir={'column'} p={[0, "1rem", '3.5rem']}>
                <Text lineHeight={2}>{product.desc}</Text>
                <HStack mt='1rem'>
                  <Box
                    width='2rem'
                    as='span'
                    height='2px'
                    bg={product.bg}
                  ></Box>
                  <Link href={product.link}>
                    <GradientText bgGradient={product.bg}>
                      Learn More
                    </GradientText>
                  </Link>
                </HStack>
              </Box>
            </GridItem>
          </Grid>
        )
      })}
    </Container>
  )
}
