import { Box, Heading, Flex, Stack, Text } from '@chakra-ui/react'
import { format } from 'date-fns'
import { MOCK_LIVE_AUCTIONS } from '../mock'
import { Auction } from '../auctionUtils'
import { useWallet } from '@solana/wallet-adapter-react'

export const PreviousBids = (props: { auction: Auction }) => {
  const { auction } = props

  const wallet = useWallet()

  return (
    <Box>
      <Heading fontSize={['1.5rem', '1.75rem', '2rem']} fontWeight='700'>
        Previous Bids
      </Heading>
      <Stack gap={'1.5rem'} mt={['1.5rem', '2rem', '3rem']}>
        {auction.bids.map((bid) => {
          const currentUsersBidProps =
            wallet.publicKey?.toBase58() === bid.user.toBase58()
              ? {
                  border: '2px solid #000',
                  borderRadius: '5px',
                  padding: '0.5rem 0.75rem',
                }
              : {}
          return (
            <Stack
              key={bid.amount}
              direction={'row'}
              justifyContent={'space-between'}
              alignItems='center'
              {...currentUsersBidProps}
            >
              <Box>
                <Text wordBreak={'break-word'} fontSize={['0.8rem', '0.9rem']}>
                  {bid.user.toBase58()}
                </Text>
                <Heading
                  fontSize={['0.75rem', '0.75rem', '1rem']}
                  fontWeight='500'
                  color='#888888'
                  mt={['0.25rem']}
                >
                  {format(bid.createdAt, 'MM-dd-yyyy hh:mm a OOOO')}
                </Heading>
              </Box>
              <Heading
                fontSize={['1rem', '1rem', '1.5rem']}
                fontWeight='600'
              >{`${bid.amount} ${auction.currency}`}</Heading>
            </Stack>
          )
        })}
      </Stack>
    </Box>
  )
}
