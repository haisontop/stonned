import { Box, Container, Grid, GridItem, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { AdditionalFeatureCard } from './AdditionalFeatureCard'
import { AdditionalFeature, MainFeature } from './types'
import {
  MAIN_LAUNCH_CONTAINER_MAX_WIDTH,
} from '../../constants'

interface FeaturesProps {
  color: string
  title: string
  mainFeatures?: MainFeature[]
  additionalFeatures?: AdditionalFeature[]
}

const getFeatuerSpacing = (spacing?: 'sm' | 'md' | 'lg') => {
  switch (spacing) {
    case 'sm':
      return ['2rem', '4rem', '4rem']
      break

    case 'md':
      return ['4rem', '8rem', '8rem']
      break

    case 'lg':
      return ['8rem', '16rem', '16rem']
      break

    default:
      return ['0.5rem', '0.5rem', '1rem']
      break
  }
}

export default function Features(props: FeaturesProps) {
  const { color, title, mainFeatures, additionalFeatures } = props

  return (
    <Stack py={['4.75rem', '4.75rem', '6rem']}>
      <Container maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}>
        <Text fontSize={'3rem'} fontWeight={700} fontFamily='heading'>
          <Box as='span' color={color}>
            {title}
          </Box>
          <Box as='span' whiteSpace={'nowrap'}>
            {' '}
            Features
          </Box>
        </Text>
      </Container>
      <Box>
        {mainFeatures?.map((feature) => (
          <Grid
            templateColumns='repeat(2, 1fr)'
            mt={getFeatuerSpacing(feature.topSpacing)}
          >
            <GridItem
              display={'flex'}
              alignItems={'center'}
              justifyContent='end'
              colSpan={[2, 2, 1, 1]}
              order={feature.isLeft ? [1, 1, 2] : 1}
            >
              <Stack
                width={['100%', '100%', '80%', '60%']}
                ml={feature.isLeft ? undefined : 'auto'}
                mr={feature.isLeft ? 'auto' : undefined}
                px={['1rem', null]}
              >
                <Text
                  fontSize={['1.5rem', '1.5rem', '2rem']}
                  fontFamily='heading'
                  fontWeight={700}
                >
                  {feature.title}
                </Text>
                <Text
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={2}
                  fontFamily='heading'
                  color='#676767'
                >
                  {feature.desc}
                </Text>
              </Stack>
            </GridItem>
            <GridItem
              colSpan={[2, 2, 1, 1]}
              order={feature.isLeft ? [2, 2, 1] : 2}
              paddingRight={feature.isLeft ? [0, 0, '4rem', '6rem'] : undefined}
            >
              <Box width={['100%', '100%', '80%']} ml='auto'>
                {feature.shape}
              </Box>
            </GridItem>
          </Grid>
        ))}
      </Box>
      <Box width='100%' pt={['4rem', '4rem', '15.625rem']}>
        <Container maxWidth={MAIN_LAUNCH_CONTAINER_MAX_WIDTH}>
          <Stack spacing={8}>
            <Box>
              <Text
                maxW={['100%', '100%', '60%']}
                fontSize={['2rem', '2rem', '3rem']}
                fontFamily='heading'
                fontWeight={700}
                sx={{
                  '& > span': {
                    color: color,
                  },
                }}
              >
                Some Additional <br />
                <span>{title}</span> Features
              </Text>
            </Box>

            <Grid
              templateColumns={[
                'repeat(1, 1fr)',
                'repeat(1, 1fr)',
                'repeat(3, 1fr)',
              ]}
              columnGap={'4rem'}
              rowGap={'4rem'}
              width='100%'
            >
              {additionalFeatures?.map((feature) => (
                <GridItem key={feature.title}>
                  <AdditionalFeatureCard feature={feature} />
                </GridItem>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Stack>
  )
}
