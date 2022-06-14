import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FC } from 'react'
import CategoryTitle from './CategoryTitle'
import { AdditionalFeature, CategoryOverview } from './types'

interface CategoryOverviewCardProp {
  category: CategoryOverview
  color: string
}

export const CategoryOverviewCard: FC<CategoryOverviewCardProp> = ({
  category,
}) => {
  return (
    <Stack
      px={'2rem'}
      py='4rem'
      bg='#fff'
      borderRadius={'1.5rem'}
      boxShadow='0px 15px 150px rgba(0, 0, 0, 0.04)'
      spacing={'2rem'}
    >
      <CategoryTitle
        iconColor={category.color}
        label={category.categoryLabel.toLocaleUpperCase()}
        labelColor='#333333'
      />
      <Heading
        fontSize={{ base: '1rem', md: '1rem' }}
        fontWeight='400'
        color='#676767'
        lineHeight={2}
        fontFamily="heading"
      >
        {category.desc}
      </Heading>
      <Button
        sx={{ py: '1.125rem', px: '1.5rem' }}
        height='unset'
        fontSize='1rem'
        lineHeight={'1.5rem'}
        rounded='md'
        bg='#282936'
        color='#fff'
        fontFamily="heading"
      >
        Show More
      </Button>
    </Stack>
  )
}
