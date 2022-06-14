import { Box, Heading, SimpleGrid } from '@chakra-ui/react'
import { AuctionCard } from './AuctionCard'
import { Auction } from '../auctionUtils'
import { useAllAuctions } from '../auctionHooks'

interface Props {
  title: string
  auctions: Auction[]
}

export const AuctionCardList: React.FC<Props> = ({ title, auctions }) => {
  return (
    <Box>
      <Heading
        fontSize={['1.5rem', '1.75rem', '2rem']}
        fontWeight='700'
        color={'black'}
        mb={['1.5rem', '2rem', '3.6rem']}
      >
        {title}
      </Heading>
      <SimpleGrid
        columns={[1, 2, 3, 4]}
        spacingX={['1.5rem', '4rem', '2.375rem']}
        spacingY={['1.5rem', '2rem', '2.625rem']}
      >
        {auctions.map((auction) => (
          <AuctionCard key={auction.name as string} auction={auction} />
        ))}
      </SimpleGrid>
    </Box>
  )
}
