import { useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  HeadingProps,
  Link,
  useInterval,
  Image,
} from '@chakra-ui/react'
import { CountDown, getCountDown } from '../../../utils/dateUtil'
import { Auction, getAllAuctions } from '../auctionUtils'
import { useQuery } from 'react-query'
import { splToUsdc } from '../../../utils/sacUtils'

interface Props {
  auction: Auction
}

export const AuctionCard: React.FC<Props> = ({ auction }) => {
  const [countDown, setCountDown] = useState<CountDown>()

  useInterval(() => {
    const counts = getCountDown(auction.endDate, new Date())
    setCountDown(counts)
  }, 1000)

  const lastBidInUsdcRes = useQuery(
    ['lastBidInUsdc', auction.lastBid, auction.bidToken],
    async () => {
      const lastBidInUsdc = await splToUsdc(
        auction.lastBid.amount,
        auction.bidToken
      )

      return lastBidInUsdc
    },
    {
      enabled:
        (countDown?.wholeSeconds || 0) > 0 &&
        !!auction.lastBid &&
        !!auction.bidToken,
    }
  )

  return (
    <Link href={`/auctions/${auction.pubkey.toBase58()}`} _hover={{}}>
      <Box
        bgColor={'#FAFAFA'}
        borderRadius='10px'
        overflow={'hidden'}
        border='1px solid #EEE'
        boxShadow='rgba(0, 0, 0, 0.05) 0px 10px 20px 0px'
        transition='all .1s ease-in-out'
        _hover={{
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 10px 20px 10px',
        }}
      >
        <Image
          src={auction.prize.image}
          objectFit='cover'
          fallbackSrc='/images/marie-cure.png'
          /* height={['16rem', '17rem', '18.75rem', '17rem']} */
        />
        <Box padding={'1.25rem'}>
          <Heading
            fontSize='1.25rem'
            fontWeight={700}
            _hover={{ color: 'black' }}
          >
            {auction.name}
          </Heading>
          <Flex justifyContent={'space-between'} mt='1.2rem'>
            {countDown && countDown.wholeSeconds > 0 ? (
              <>
                <Box>
                  <Heading {...TextStyle}>Current Bid</Heading>
                  <Heading {...TitleStyle} mt='0.3rem'>
                    {`${auction.lastBid.amount} ${auction.currency}`}
                  </Heading>
                </Box>
                <Flex flexDirection={'column'} alignItems='flex-end'>
                  <Heading {...TextStyle}>Ends in</Heading>
                  <Heading {...TitleStyle} mt='0.3rem'>
                    {countDown &&
                      `${countDown.hours}h ${countDown.minutes}m ${countDown.seconds}s`}
                  </Heading>
                </Flex>
              </>
            ) : (
              <Flex
                justifyContent={'space-between'}
                alignItems='flex-end'
                w='100%'
              >
                <Box>
                  <Heading {...TextStyle}>Winning Bid</Heading>
                  <Heading {...TitleStyle} mt='0.3rem'>
                    {`${auction.lastBid.amount} ${auction.currency}`}
                  </Heading>
                </Box>
                {lastBidInUsdcRes.data && (
                  <Heading {...TextStyle}>
                    = {lastBidInUsdcRes.data?.toFixed(2)} USDC
                  </Heading>
                )}
              </Flex>
            )}
          </Flex>
        </Box>
      </Box>
    </Link>
  )
}

const TitleStyle: HeadingProps = {
  fontSize: '0.875rem',
  fontWeight: '600',
}

const TextStyle: HeadingProps = {
  fontSize: '0.625rem',
  fontWeight: '600',
  color: '#888888',
}
