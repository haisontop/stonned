import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  Image,
  Text,
  Flex,
  chakra,
  UnorderedList,
  ListItem,
  useBreakpointValue,
  Link,
} from '@chakra-ui/react'
import { FC } from 'react'
import { Radar, Chart } from 'react-chartjs-2'
import {
  registerables,
  defaults,
  Chart as ChartJS,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
} from 'chart.js'
ChartJS.register(
  ArcElement,
  RadialLinearScale,
  PieController,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface LinksProps {}

const exchanges = [
  {
    name: 'Dexlab',
    link: 'https://trade.dexlab.space/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV',
    logo: 'images/dexlab.png',
  },
  {
    name: 'Radyium',
    link: 'https://raydium.io/swap/?from=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&to=G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB',
    logo: 'images/raydium-logo.png',
  },
  {
    name: 'Solape',
    link: 'https://solapeswap.io/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV',
    logo: 'images/solape.png',
  },
]

const Tokenomics: FC<LinksProps> = () => {
  return (
    <Stack id='tokenomics' spacing={'2rem'} paddingY='2rem' zIndex={1}>
      <Heading
        fontSize='3xl'
        fontWeight='800'
        fontFamily={'body'}
        textAlign={'left'}
        lineHeight={'40px'}
      >
        Tokenomics{' '}
        <chakra.span fontSize={'lg'}>
          - The first-ever Token to get your Greens &#128521;🌿
        </chakra.span>
      </Heading>

      <Box fontSize={['md', 'lg']}>
        {/*
          Bullish Pic
          <Box float={'right'}>
            <Image
              ml='2'
              mb='2'
              height={['150px', '150px', '300px']}
              width={['150px', '150px', '300px']}
              src='images/bullish.gif'
            />
          </Box>*/}
        <Text fontSize='sm'>
          $PUFF is the first token in the Solana ecosystem which <b>incorporates
          mechanisms of game-theory</b> and <b>intelligent burning mechanisms</b> to
          increase the value. <br />Alone in the past 4 months, <b>75% of the distributed supply has been burned</b> - something never seen before. 
          <br/>To estimate any value of token it’s always
          important to look at two import factors: Supply & Demand
        </Text>
      </Box>
      <SimpleGrid zIndex={2} columns={[1]} spacing={10}>
        <Stack
          padding={['1.2rem', '2rem']}
          background='#2A3444'
          borderRadius='lg'
          spacing={[5]}
          shadow='lg'
        >
          <Heading fontFamily={'body'} fontSize={'xl'} fontWeight='bold'>
            Supply
          </Heading>

          <SimpleGrid columns={[1]}>
            <Stack>
              <Text fontSize='smaller'>
                The important factor of supply is the{' '}
                <Link href='/analytics' target={'_blank'} fontWeight={600}>
                  circulating supply.
                </Link>{' '}
                The initial supply of $PUFF is 0. <br />
                80% of the supply can only ever be produced by staking the SAC
                NFTs. The rest of the supply is used to stabilize the
                price in the Liquidity Pool & increase the value through
                positive incentives.
                <Box
                  display='flex'
                  justifyContent={'center'}
                  py={['2rem', '2rem']}
                  px={['1rem', '2rem']}
                  m={useBreakpointValue(['1rem'])}
                >
                  <Box width={['90%', '60%', '20%']}>
                    <SupplyChart />
                  </Box>
                </Box>

                There are lots of burning mechanics in place that reduce
                the circulating supply & increase the value of $PUFF through
                scarcity. More can be found beneath in the Demand section. <br />
                The $PUFF supply will also be affected by "halving periods". Every 20M $PUFF distributed, the staking rewards will decrease by 30%.
                <br />
                So the circulating supply is a dynamic value, which is
                transparently shown on our own{' '}
                <Link href='/analytics' target={'_blank'} fontWeight={600}>
                  Stats Board
                </Link>
                . You can see the detailed distribution in the graph.
              </Text>
              {/*  <Text>
              As you can see a certain amount is also used for Marketing (buying
              other NFTs, doing collabs...).
            </Text> */}
            </Stack>
          </SimpleGrid>
        </Stack>

        <Stack
          padding={['1.2rem', '2rem']}
          background='#2A3444'
          borderRadius='lg'
          spacing={[5]}
          shadow='lg'
        >
          <Heading fontFamily={'body'} fontSize={'xl'} fontWeight='bold'>
            Demand / Utilities
          </Heading>
          <Text fontSize={'smaller'}>
            $PUFF is the first token in the Solana ecosystem which incorporates
            mechanisms of game-theory as well as intelligent burning mechanisms
            to increase the value.
          </Text>
          {/*  <Heading fontFamily={'body'} fontSize={'xl'}>
          Types
        </Heading> */}
          <Stack direction='column' paddingX={[0, '.1rem']} spacing={6}>
            <Box display='flex' alignItems={'center'} flexDirection={['column', 'row']}>
              <Box pr={[0, 5]} pb={[2, 0]} width={['100%', '50%']}>
                <Heading fontSize='md' fontWeight={'700'} fontFamily={'body'} textAlign={['left', 'right']}>
                  First-ever NFT Evolution
                </Heading>
                <Text fontSize='smaller' textAlign={['left', 'right']}>
                  Sent your Stoned Chimpion to a retreat and see if you get a
                  new role. Burned 1.3M $PUFF already.
                  <br />
                  <Link href='/evolution' target={'_blank'} fontWeight={600}>
                    Try it out
                  </Link>
                </Text>
              </Box>
              <Box display='flex' justifyContent={['center', 'flex-start']} width={['100%', '50%']}>
                <Image
                  src='images/nft-evolution-1.png'
                  width={['180px', '230px']}
                  maxHeight={['180px', '230px']}
                  borderRadius={'lg'}
                  shadow={'lg'}
                />
              </Box>
            </Box>
            <Box display='flex' alignItems={'center'} flexDirection={['column', 'row']}>
              <Box display={['none', 'flex']} justifyContent='flex-end' width={['100%', '50%']} pr={[0, 5]} pb={[2, 0]}>
                <Box borderRadius={'lg'} shadow={'lg'} overflow={'hidden'} width={['180px', '230px']}>
                  <video autoPlay={true} width='100%'>
                    <source src='images/sachoodie.MP4' type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              </Box>
              <Box width={['100%', '50%']} pb={[2, 0]}>
                <Heading fontSize='md' fontWeight={'700'} fontFamily={'body'} textAlign='left'>
                  SAC Online Store & the physical world
                </Heading>
                <Text fontSize='sm' textAlign='left'>
                  $PUFF can be used in our online stores to pay for apparel,
                  weed accessories & further products. Five dispensaries in the US already decided to accept it on their own.
                  Our fist merch drop happened in March and burned over 300,000 $PUFF.
                </Text>
              </Box>
              <Box display={['flex', 'none']} justifyContent='center' width={['100%', '50%']} pr={[0, 5]}>
                <Box borderRadius={'lg'} shadow={'lg'} overflow={'hidden'} width={['180px', '230px']} maxHeight='270px'>
                  <video autoPlay width='100%'>
                    <source src='images/sachoodie.MP4' type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              </Box>
            </Box>
            <Box display='flex' alignItems={'center'} flexDirection={['column', 'row']}>
              <Box pr={[0, 5]} pb={[2, 0]} display='flex' flexDirection={'column'} justifyContent='flex-end' width={['100%', '50%']}>
                <Heading fontSize='md' fontWeight={'700'} fontFamily={'body'} textAlign={['left', 'right']}>
                  Rescue Missions for Nuked Apes
                </Heading>
                <Text fontSize='sm' textAlign={['left', 'right']}>
                  Combine 2 Role Apes + 1780 $PUFF to get a Nuked Ape. The $PUFF consumed will be burned & the amount
                  will increase over time to rise the difficulty.
                </Text>
              </Box>
              <Box display='flex' justifyContent={['center', 'flex-start']} width={['100%', '50%']}>
                <Image
                  src='images/nuked-ape.jpg'
                  maxHeight={'250px'}
                  height={['180px', '230px']}
                  width={['180px', '230px']}
                  borderRadius={'lg'}
                  shadow={'lg'}
                />
              </Box>
            </Box>
            <Box display='flex' alignItems={'center'} flexDirection={['column', 'row']}>
              <Box display={['none', 'flex']} justifyContent='flex-end' width={['100%', '50%']} pr={[0, 5]}>
                <Image
                  src='images/og-stoner.png'
                  width={['180px', '230px']}
                  height={['180px', '230px']}
                  maxHeight={'250px'}
                  borderRadius={'lg'}
                  shadow={'lg'}
                />
              </Box>
              <Box width={['100%', '50%']} pb={[2, 0]}>
                <Heading fontSize='md' fontWeight={'700'} fontFamily={'body'} textAlign='left'>
                  Auctions
                </Heading>
                <Text fontSize='sm' textAlign='left'>
                  There will be several auctions over the life-span of SAC & 10%
                  of the proceeds will be used to buy-back $PUFF and burn it. In
                  the Nuked Apes collection, 10 Legendary NFTs will be
                  auctioned.
                </Text>
              </Box>
              <Box display={['flex', 'none']} justifyContent='center' width={['100%', '50%']} pr={[0, 5]}>
                <Image
                  src='images/og-stoner.png'
                  width={['180px', '230px']}
                  height={['180px', '230px']}
                  borderRadius={'lg'}
                  shadow={'lg'}
                />
              </Box>
            </Box>
            <Box display='flex' alignItems={'center'} flexDirection={['column', 'row']}>
              <Box pr={[0, 5]} width={['100%', '50%']} pb={[2, 0]}>
                <Heading fontSize='md' fontWeight={'700'} fontFamily={'body'} textAlign={['left', 'right']}>
                  $PUFF-only mints
                </Heading>
                <Text fontSize='sm' textAlign={['left', 'right']}>
                  In the future, we’ll have designated side collections, that
                  are only available in $PUFF. A certain percentage of
                  $PUFF will be burned to further decrease the supply.
                </Text>
              </Box>
              <Box display='flex' justifyContent={['center', 'flex-start']} width={['100%', '50%']}>
                <Image
                  src='images/puff-logo.png'
                  width={['180px', '230px']}
                  height={['180px', '230px']}
                  maxHeight='250px'
                  borderRadius={'lg'}
                  shadow={'lg'}
                />
              </Box>
            </Box>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Stack>
  )
}

export default Tokenomics

function SupplyChart({}) {
  return (
    <Chart
      type='doughnut'
      options={{
        color: 'white'
      }}
      data={{
        labels: [
          'Staking',
          'Reserve',
          'Charity',
          'Marketing & Collabs',
          'Special (???)',
          'Liquidity Pool',
        ],
        datasets: [
          {
            label: 'Supply',
            data: [80, 4, 1, 2, 3, 10],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            type: 'doughnut',
          },
        ],
      }}
    />
  )
}
