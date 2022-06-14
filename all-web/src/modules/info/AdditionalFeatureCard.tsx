import {
  Box,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FC } from 'react'
import { AdditionalFeature } from './types'

interface AdditionalFeatureCardProp {
  feature: AdditionalFeature
}

export const AdditionalFeatureCard: FC<AdditionalFeatureCardProp> = ({
  feature,
}) => {
  return (
    <Stack>
      <Box display='flex' width={['4rem']} height={['4rem']}>
        {feature.logo}
      </Box>
      <Heading
        fontSize={{ base: 'md', md: '22px' }}
        fontWeight='700'
        fontFamily='heading'
      >
        {feature.title}
      </Heading>
      <Text fontFamily='heading' fontWeight={400} color="#676767"> {feature.desc}</Text>
    </Stack>
  )
}
