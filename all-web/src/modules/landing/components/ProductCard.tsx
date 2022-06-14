import { Box, Grid, GridItem, Heading, Link, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Product } from '../types'

interface ProductCardProp {
  product: Product
}

export const ProductCard: FC<ProductCardProp> = ({ product }) => {
  return (
    <Box
      borderRadius={'1rem'}
      bg={product.bg}
      padding={{ base: '2.75rem 2rem', md: '4.75rem 3.5rem 3.5rem' }}
      maxWidth={'33rem'}
      height='100%'
      cursor={'pointer'}
      transition='box-shadow .15s ease-in-out'
      _hover={{
        boxShadow: '2px 8px 25px 10px rgba(0,0,0,0.15);',
      }}
    >
      <Box width={['200px', '180px', '300px', '340px']} display='flex'>
        {product.logo}
      </Box>
      <Heading
        fontSize={{ base: 'md', md: '2xl' }}
        color='white'
        mt={{ base: 5, md: 9, lg: 14 }}
        fontWeight='700'
      >
        {product.desc}
      </Heading>
      <Grid
        templateColumns='repeat(2, 2fr)'
        columnGap={{ base: 3, md: 4, lg: 6 }}
        rowGap={{ base: 1, sm: 2, md: 3, lg: 4 }}
        mt={{ base: 5, md: 9, lg: 14 }}
      >
        {product.tags.map((tag) => (
          <GridItem key={tag}>
            <Heading fontSize={['sm', 'md']} color='white' fontWeight={600}>
              {tag}
            </Heading>
          </GridItem>
        ))}
      </Grid>
      <Box display='block' mt={{ base: 5, md: 9, lg: 14 }}>
        {product.comingSoon ? (
          <Text color='rgba(255, 255, 255, 0.6)'>
            Coming Soon
          </Text>
        ) : (
          <Link
            color={'rgba(255, 255, 255, 0.6)'}
            textDecoration='underline'
            _hover={{
              color: 'white',
              textDecoration: 'underline',
            }}
          >
            Learn more
          </Link>
        )}
      </Box>
    </Box>
  )
}
