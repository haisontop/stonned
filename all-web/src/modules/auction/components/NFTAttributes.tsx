import { Box, Heading, Flex } from '@chakra-ui/react'
import { useCurrentAuction } from '../auctionHooks'
import { AttributeCard } from './AttributeCard'

export const NFTAttributes = () => {
  const auctionNftRes = useCurrentAuction()

  return (
    <Box>
      <Heading fontSize={['1.5rem', '1.75rem', '2rem']} fontWeight='700'>
        NFT Attributes
      </Heading>
      <Flex flexWrap={'wrap'} gap='1rem' mt={['1.5rem', '2rem', '3rem']}>
        {auctionNftRes.data?.prize.attributes.map((a, index) => (
          <AttributeCard
            key={`attr${index}`}
            type={a.trait_type}
            text={a.value}
          />
        ))}
      </Flex>
    </Box>
  )
}

const MOCK_ATTRIBUTES = [
  {
    type: 'Head',
    text: 'Sunglasses',
  },
  {
    type: 'Body',
    text: 'Superman Body',
  },
  {
    type: 'Head',
    text: 'Sunglasses',
  },
  {
    type: 'Head',
    text: 'Sunglasses',
  },
  {
    type: 'Head',
    text: 'Sunglasses',
  },
  {
    type: 'Head',
    text: 'Sunglasses',
  },
  {
    type: 'Body',
    text: 'Superman Body',
  },
]
