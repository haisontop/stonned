import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  useInterval,
  Input,
  Text,
  Image,
} from '@chakra-ui/react'
import { Auction, createBidInstr } from '../auctionUtils'
import { CountDown, getCountDown } from '../../../utils/dateUtil'
import { IoBagHandleOutline } from 'react-icons/io5'
import { format } from 'date-fns'
import { useAsyncFn } from 'react-use'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { connection } from '../../../config/config'
import toast from 'react-hot-toast'
import { useAllAuctions, useAuction, useCurrentAuction } from '../auctionHooks'
import { splToUsdc } from '../../../utils/sacUtils'
import { useQuery } from 'react-query'

interface Props {
  detailView?: boolean
  auction: Auction
}

export const Hero: React.FC<Props> = ({ detailView, auction }) => {
  const [countDown, setCountDown] = useState<CountDown>()
  const [bid, setBid] = useState(
    auction.lastBid.amount + auction.minBidIncrease
  )
  const wallet = useWallet()

  const [inputError, setInputError] = useState('')

  useInterval(() => {
    const counts = getCountDown(auction.endDate, new Date())
    setCountDown(counts)
  }, 1000)

  const auctionRes = useAuction(auction.pubkey.toBase58())
  const [placeBidRes, placeBid] = useAsyncFn(async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return

    try {
      const instructions = await createBidInstr({
        user: wallet.publicKey,
        auction,
        bidAmount: bid,
      })

      const transaction = new Transaction().add(...instructions)

      const tx = await wallet.sendTransaction(transaction, connection)

      await connection.confirmTransaction(tx)

      toast.success('set bid')

      await auctionRes.refetch()
    } catch (e: any) {
      if (e.message.includes('0x1')) {
        toast.error('You need more $PUFF or Solana')
      } else toast.error(e.message)
      console.error('error on set bid', e)
    }
  }, [auction, bid, wallet])

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
      enabled: !!auction.lastBid && !!auction.bidToken,
    }
  )

  return (
    <SimpleGrid
      columns={[1, 1, 2]}
      spacing={['2rem', '3rem', '5.6rem']}
      width='100%'
    >
      <Box>
        <Image
          src={auction.prize.image}
          height={['18rem', '22rem', '30rem', '35rem']}
          borderRadius='5px'
          objectFit='cover'
          mx='auto'
          fallbackSrc='/images/marie-cure.png'
        />
      </Box>

      <Box
        display={'flex'}
        alignItems='center'
        minWidth={{ base: 'unset', md: '400px' }}
      >
        <Flex flexDirection={'column'} w='100%'>
          {auction.hasEnded && (
            <Text
              bg='#393E46'
              color='white'
              borderRadius='5px'
              padding={'0.4rem 1rem'}
              width='fit-content'
              fontWeight={600}
              mb='1.5rem'
            >
              SOLD
            </Text>
          )}

          {/* TODO: show highest bid box when user holds the highest bid */}
          {auction.lastBid.user.toBase58() == wallet.publicKey?.toBase58() && (
            <Box
              borderRadius='5px'
              padding='.5rem 1rem'
              border='2px solid black'
              textAlign='center'
              my='1rem'
              fontFamily='Montserrat'
              fontWeight='500'
            >
              You hold the highest bid.
            </Box>
          )}

          <Heading fontWeight={700} fontSize={['1.75rem', '2rem', '2.75rem']}>
            {auction.name}
          </Heading>

          <Heading
            fontSize={'0.875rem'}
            fontWeight={500}
            mt={['1rem', '1.5rem']}
          >
            {/* TODO: Add dynamic description */}
            {/* {auction.name} */}
            <Text mb='.75rem' fontSize={'0.875rem'} fontWeight={500}>
              Legendary 1/1 Nuked Ape
            </Text>
            {detailView
              ? `While living in Puff Valley in the early stages of electricity, she worked on explorative strains & THC-infused drinks. The nuclear incident wasn't all bad for here, because it opened up a whole new world of puff, creating the legendary "Wen Boom?" strain in the process.`
              : ''}
          </Heading>

          <Flex
            justifyContent={'space-between'}
            mt={['2rem', '2rem', '4rem']}
            width='100%'
          >
            {!auction.hasEnded && (
              <>
                <Flex flexDirection={'column'}>
                  {auction.lastBid && (
                    <>
                      <Heading
                        fontSize={['0.8rem', '1rem']}
                        fontWeight={600}
                        color='#888888'
                      >
                        Current Bid
                        {/* TODO: when current bid = users bid */}
                        {/* <>
                          {' '}(Your Bid)
                        </> */}
                      </Heading>
                      <Heading
                        fontSize={['1.25rem', '1.25rem', '2rem']}
                        fontWeight={600}
                        mt='0.5rem'
                      >
                        {`${auction.lastBid.amount} ${auction.currency}`}
                      </Heading>
                    </>
                  )}
                  <Heading
                    fontSize={'0.75rem'}
                    fontWeight={600}
                    color='#888888'
                    mt={['0.4rem', '0.7rem']}
                  >
                    {detailView
                      ? `Minimum Bid: ${
                          auction.lastBid.amount + auction.minBidIncrease
                        } ${auction.currency}`
                      : ''}
                  </Heading>
                </Flex>

                <Flex flexDirection={'column'}>
                  <Heading
                    fontSize={['0.8rem', '1rem']}
                    fontWeight={600}
                    color='#888888'
                  >
                    Auction Ends in
                  </Heading>
                  <HStack spacing={['0.5rem', '1rem']}>
                    <Box>
                      <Heading
                        fontSize={['1.25rem', '1.25rem', '2rem']}
                        fontWeight={600}
                        mt='0.5rem'
                        textAlign={'center'}
                      >
                        {countDown?.hours}
                      </Heading>
                      <Heading
                        fontSize={'0.75rem'}
                        fontWeight={600}
                        color='#888888'
                        mt={['0.4rem', '0.7rem']}
                      >
                        Hours
                      </Heading>
                    </Box>
                    <Box>
                      <Heading
                        fontSize={['1.25rem', '1.25rem', '2rem']}
                        fontWeight={600}
                        mt='0.5rem'
                        textAlign={'center'}
                      >
                        {countDown?.minutes}
                      </Heading>
                      <Heading
                        fontSize={'0.75rem'}
                        fontWeight={600}
                        color='#888888'
                        mt={['0.4rem', '0.7rem']}
                      >
                        Minutes
                      </Heading>
                    </Box>
                    <Box>
                      <Heading
                        fontSize={['1.25rem', '1.25rem', '2rem']}
                        fontWeight={600}
                        mt='0.5rem'
                        textAlign={'center'}
                      >
                        {countDown?.seconds}
                      </Heading>
                      <Heading
                        fontSize={'0.75rem'}
                        fontWeight={600}
                        color='#888888'
                        mt={['0.4rem', '0.7rem']}
                      >
                        Seconds
                      </Heading>
                    </Box>
                  </HStack>
                </Flex>
              </>
            )}
            {auction.hasEnded && (
              <Flex flexDirection={'column'}>
                <Heading
                  fontSize={['0.8rem', '1rem']}
                  fontWeight={600}
                  color='#888888'
                >
                  Winning Bid
                </Heading>
                <Heading
                  fontSize={['1.25rem', '1.25rem', '2rem']}
                  fontWeight={600}
                  mt='0.5rem'
                >
                  {`${auction.lastBid?.amount} ${auction.currency}`}
                </Heading>
                {lastBidInUsdcRes.data && (
                  <Heading
                    fontSize={'.75rem'}
                    fontWeight={600}
                    color='#888888'
                    mt='0.85rem'
                  >
                    {lastBidInUsdcRes.data?.toFixed(2)} USDC
                  </Heading>
                )}

                <Heading
                  fontSize={'0.75rem'}
                  fontWeight={600}
                  color='#888888'
                  mt={['1rem', '1.125rem']}
                  display='flex'
                  alignItems={'center'}
                  style={{ lineBreak: 'anywhere' }}
                >
                  <Image
                    src='/icons/wallet-outline.svg'
                    w={'1rem'}
                    h={'1rem'}
                    mr='.4rem'
                  />
                  {auction.lastBid?.user.toBase58()}
                </Heading>
                <Heading
                  fontSize={'0.75rem'}
                  fontWeight={600}
                  color='#888888'
                  mt={['0.4rem', '0.7rem']}
                >
                  Auction ended:{' '}
                  {`${format(auction.endDate, 'MM-dd-yyyy hh:mm a OOOO')}`}
                </Heading>
              </Flex>
            )}
          </Flex>

          {!auction.hasEnded && !detailView && (
            <Flex justifyContent={'center'} mt={['1.5rem', '2rem', '3rem']}>
              <Link
                href={`/auctions/${auction.pubkey.toBase58()}`}
                width='100%'
              >
                <Button
                  width={'100%'}
                  background='#393E46'
                  color='white'
                  rounded='5px'
                  padding='24px 0'
                  _hover={{
                    background: '#000',
                  }}
                >
                  View Auction
                </Button>
              </Link>
            </Flex>
          )}
          {!auction.hasEnded && detailView && (
            <Flex flexDirection={'column'} mt={['1.5rem', '2rem', '3rem']}>
              <Flex gap={'1rem'} flexWrap={['wrap', 'nowrap']}>
                <Box minW={'8rem'}>
                  <Heading
                    mb='0.4rem'
                    color='#888888'
                    fontSize={['0.8rem', '1rem']}
                    fontWeight='600'
                  >
                    Enter Bid
                  </Heading>
                  <Input
                    id='bid'
                    border='2px solid #393E46'
                    bg={'#FAFAFA'}
                    fontSize='1.5rem'
                    fontWeight={'600'}
                    _focus={{
                      border: '2px solid #393E46',
                    }}
                    type='number'
                    borderRadius='5px'
                    fontFamily='Montserrat'
                    height={'3.125rem'}
                    value={bid}
                    isInvalid={!!inputError}
                    errorBorderColor='red'
                    onBlur={(e) => {}}
                    onChange={(e) => {
                      const bid = parseFloat(e.target.value)
                      setBid(bid)

                      const minBid =
                        auction.lastBid.amount + auction.minBidIncrease
                      if (bid < minBid) {
                        setInputError(
                          `Your bid must be minimum ${minBid.toFixed(2)} ${
                            auction.currency
                          }`
                        )
                      } else {
                        setInputError('')
                      }
                    }}
                  />
                </Box>
                <Flex flexDirection={'column'} justifyContent='flex-end'>
                  <Heading
                    mb='0.4rem'
                    color='#888888'
                    fontSize={['0.6rem', '0.75rem']}
                    fontWeight='600'
                  >
                    Use Preset
                  </Heading>
                  <Button
                    color='#282936'
                    bg='transparent'
                    border='1px solid #CBCBCB'
                    fontFamily='Montserrat'
                    height={'3.125rem'}
                    onClick={() =>
                      setBid(auction.lastBid.amount + auction.minBidIncrease)
                    }
                  >
                    {auction.lastBid.amount + auction.minBidIncrease}{' '}
                    {auction.currency}
                  </Button>
                </Flex>
                <Flex flexDirection={'column'} justifyContent='flex-end'>
                  <Button
                    color='#282936'
                    bg='transparent'
                    border='1px solid #CBCBCB'
                    fontFamily='Montserrat'
                    height={'3.125rem'}
                    onClick={() =>
                      setBid(
                        Math.ceil(
                          (auction.lastBid.amount + auction.minBidIncrease) *
                            1.25
                        )
                      )
                    }
                  >
                    {Math.ceil(
                      (auction.lastBid.amount + auction.minBidIncrease) * 1.25
                    )}{' '}
                    {auction.currency}
                  </Button>
                </Flex>
              </Flex>
              <Box mt={['1rem']}>
                <Button
                  width={'100%'}
                  background='#393E46'
                  color='white'
                  rounded='5px'
                  padding='24px 0'
                  _hover={{
                    background: '#000',
                  }}
                  onClick={placeBid}
                  isLoading={placeBidRes.loading}
                  disabled={!wallet.connected || !!inputError}
                >
                  Place Bid
                </Button>
              </Box>
              {inputError && (
                <Text textAlign={'center'} mt='4' color='red'>
                  {inputError}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Box>
    </SimpleGrid>
  )
}
