import React, { useEffect, useState } from 'react'
import {
  TabPanel,
  Box,
  Image,
  Stack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Flex,
} from '@chakra-ui/react'
import { DataBox, PriceDataBox } from '../../components/DataBox'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { useAsync, useAsyncRetry } from 'react-use'
import config, {
  connection,
  programPuffWallet,
  puffWallet,
} from '../../config/config'
import { getTokenAccount } from '../../utils/solUtils'
import useSWR from 'swr'
import { BoxProps, Grid, GridItem, SimpleGrid } from '@chakra-ui/layout'
import { motion } from 'framer-motion'
import LineChart from '../../components/LineChart'
import { addDays } from 'date-fns'
import Link from 'next/link'

const puffPrices = require('../../assets/puffprices.json')

export const MotionBox = motion<BoxProps>(Box)

const icon = {
  hidden: {
    pathLength: 0,
    fill: 'rgba(255, 255, 255, 0)',
  },
  visible: {
    pathLength: 1,
    fill: 'rgba(255, 255, 255, 1)',
  },
}

const api = '/api/analytics/puff.ts'

function PuffPanel({
  additionalDataBoxProps,
  color,
  subtitleColor,
}: {
  additionalDataBoxProps?: BoxProps
  color?: BoxProps['color']
  subtitleColor?: string
}) {
  const [puffPrice, setPuffPrice] = useState()
  const [puffPercentage, setPuffPercentage] = useState()
  const [puffChange, setPuffChange] = useState()
  const [puffSupply, setPuffSupply] = useState<number | null | undefined>()
  const [circulatingPuff, setCirculatingPuff] = useState()
  const [dailyPuffVolume, setDailyPuffVolume] = useState<
    number | null | undefined
  >()
  const [burnedPuff, setBurnedPuff] = useState()
  const [fractionalizedNFTValue, setFractionalizedNFTValue] = useState<number>()
  const [coingeckoData, setCoingeckoData] = useState()
  const [coingeckoTimes, setCoingeckoTimes] = useState<Date[]>([])
  const [coingeckoValues, setCoingeckoValues] = useState<number[]>([])

  /* 

  'JEHyBUytNhtMNrHCYSsLuyWfnH5jnjDdzspUtLzVBGkc',
              '7vHjmBmv2MBjDBJPeDaWiJXkmZ1UoftoK2QKmCMzrA7q',
              'FoE2wtFWvvNS47JQ5KcGxngWujCX3TXr1mYT8bHGVbx7',
              'FBBjTYaoyKKT1dSB6jokTbtThPR9SD4AC1bAbLVCQneS',
              '2x3AoZSBrP9sH6hjKgqKuG4UNFusBFqt45Pg7gFyEukx',
              'HE775mPE8t77UpLt6RXGPfN9dXbzdStiSkUDrSnbp1So'

              */

  const fractionalizedNFTs = [
    {
      name: 'Stoned Ape #270',
      image: '/images/sac270.png',
      link: 'https://solscan.io/token/JEHyBUytNhtMNrHCYSsLuyWfnH5jnjDdzspUtLzVBGkc',
    },
    {
      name: 'Stoned Ape #991',
      image: '/images/sac991.png',
      link: 'https://solscan.io/token/7vHjmBmv2MBjDBJPeDaWiJXkmZ1UoftoK2QKmCMzrA7q',
    },
    {
      name: 'Stoned Ape #828',
      image: '/images/ape828.png',
      link: 'https://solscan.io/token/FoE2wtFWvvNS47JQ5KcGxngWujCX3TXr1mYT8bHGVbx7',
    },
    {
      name: 'Stoned Ape #3',
      image: '/images/ape3.png',
      link: 'https://solscan.io/token/FBBjTYaoyKKT1dSB6jokTbtThPR9SD4AC1bAbLVCQneS',
    },
    {
      name: 'Nuked Ape #4158',
      image: '/images/nac4158.png',
      link: 'https://solscan.io/token/HE775mPE8t77UpLt6RXGPfN9dXbzdStiSkUDrSnbp1So',
    },
    {
      name: 'Nuked Ape #4198',
      image: '/images/nac4198.png',
      link: 'https://solscan.io/token/2x3AoZSBrP9sH6hjKgqKuG4UNFusBFqt45Pg7gFyEukx',
    },
    {
      name: 'ThugBird #0616',
      image: '/images/thugbird0616.png',
      link: 'https://solscan.io/token/5e6uW3u7BR24UK9jakra9iipW1AQv5fSVmChQsFN4b6G',
    },
    {
      name: 'DegenApe #7602',
      image: '/images/degenape7602.png',
      link: 'https://solscan.io/token/nnsyke25QR3yJAmAuQhjESEHHjs93iyUqKaKPhGWtQh',
    },
  ]

  useAsync(async () => {
    fetch('api/analytics/puff')
      .then((res) => res.json())
      .then((data) => {
        setCirculatingPuff(data.circulatingSupply)
        setBurnedPuff(data.burnedSupply)
        setFractionalizedNFTValue(data.totalFractionalizedNFTValue)

        let coingeckoLabels = []
        let coingeckoValues = []

        for (const priceData of data.puffPriceHistory) {
          coingeckoLabels.push(new Date(priceData[0]))
          coingeckoValues.push(priceData[1])
        }

        setCoingeckoTimes(coingeckoLabels)
        setCoingeckoValues(coingeckoValues)

        console.log(data);
        

        setDailyPuffVolume(data.puffDailyVolume * 1.5)
        setPuffPrice(data.puffUsdPrice)
        setPuffPercentage(data.puffPricePercentageChange)
        setPuffChange(data.puffPriceAbsolutChange)
      })
  }, [])

  console.log('data', circulatingPuff)

  const fetcher = (url: any) => axios.get(url).then((res) => res.data)

  const puffBalanceRes = useAsyncRetry(async () => {
    try {
      const puffTokenAccount = (await getTokenAccount(
        connection,
        new PublicKey(config.puffToken),
        puffWallet
      ))!!
      return (await connection.getTokenAccountBalance(puffTokenAccount.pubkey))
        .value
    } catch (e) {
      Promise.reject(e)
    }
  }, [connection])

  useEffect(() => {
    let x = puffBalanceRes.value?.uiAmount
    setPuffSupply(x)
    console.log(puffSupply)
  }, [puffBalanceRes])

  /*
    const dexLabURL = 'https://api.dexlab.space/v1/prices/recent'
    const dexVolume =
      'https://api.dexlab.space/v1/volumes/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV'

    async function getPuffData() {
      const res = await axios.get(dexLabURL)
      let data = res.data.data
      const puffData = data.find((element: any) => {
        return element.market === 'PUFF/USDC'
      })
      setPuffPercentage(puffData.percent)
      setPuffPrice(puffData.price)
      setPuffChange(puffData.changePrice)
      console.log('puffData:', puffData)
    }

    async function getPuffVolume() {
      const res = await axios.get(dexVolume)
      let data = res.data
      console.log('puffVolume:', data?.data, data?.data?.summary?.totalVolume)
      return data?.data?.summary?.totalVolume ?? 0
    }
  */

  useEffect(() => {
    let labels = []
    let values = []

    for (const priceData of puffPrices.prices) {
      labels.push(new Date(priceData[0]))
      values.push(priceData[1])
    }

    setCoingeckoTimes(labels)
    setCoingeckoValues(values)
  }, [])

  const marketCap = (circulatingPuff ?? 0) * (puffPrice ?? 0)

  const loading = !marketCap

  if (loading)
    return (
      <Flex pb='2rem' justifyContent={'center'}>
        <Image src='images/112.gif' />
      </Flex>
    )

  return (
    <>
      {puffPrice ? (
        <Grid
          zIndex={1}
          gap={3}
          templateRows='repeat(3, 1fr)'
          templateColumns='repeat(12, 1fr)'
        >
          <GridItem colSpan={[12, 8]} rowSpan={3}>
            <PriceDataBox
              title={'PUFF / USDC (14 D)'}
              amount={puffPrice}
              amountDecimals={5}
              amountPrefix='$'
              percentage={puffPercentage}
              color={color}
              subtitleColor={subtitleColor}
              {...(additionalDataBoxProps || {})}
            >
              <Box mt={2}>
                <LineChart
                  graphLabel='Price'
                  times={coingeckoTimes}
                  values={coingeckoValues}
                  stepSize={2}
                ></LineChart>
              </Box>
            </PriceDataBox>
          </GridItem>
          <GridItem colSpan={[12, 4]}>
            <DataBox
              title={'Circulating Puff Supply 🔄'}
              color={color}
              subtitleColor={subtitleColor}
              {...(additionalDataBoxProps || {})}
              amount={
                circulatingPuff
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 1,
                    }).format(circulatingPuff)
                  : ''
              }
            />
          </GridItem>
          <GridItem colSpan={[12, 4]}>
            <DataBox
              title={'Burned Puff Supply 🔥'}
              color='white'
              backgroundColor='#8676FF'
              subtitleColor='white'
              amount={
                burnedPuff
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 1,
                    }).format(burnedPuff)
                  : ''
              }
            />
          </GridItem>
          <GridItem colSpan={[12, 4]}>
            <DataBox
              title='Market Cap'
              color='white'
              subtitleColor='white'
              backgroundColor='primary'
              amount={
                marketCap
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      currency: 'USD',
                      style: 'currency',
                    }).format(marketCap)
                  : ''
              }
            ></DataBox>
          </GridItem>
          <GridItem colSpan={[12, 4]}>
            <DataBox
              title={'Fractionalized NFT Value'}
              color={color}
              subtitleColor={subtitleColor}
              {...(additionalDataBoxProps || {})}
              amount={
                fractionalizedNFTValue
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    }).format(fractionalizedNFTValue)
                  : undefined
              }
              amountSideText='SOL'
            >
              <SimpleGrid columns={4} spacing={2}>
                {fractionalizedNFTs.map((fractionalizedNFT) => {
                  return (
                    <GridItem>
                      <Link href={fractionalizedNFT.link}>
                        <a target='_blank' rel='noreferrer'>
                          <Image
                            width={{ base: '80px' }}
                            borderRadius='4px'
                            boxShadow='sm'
                            src={fractionalizedNFT.image}
                          />
                        </a>
                      </Link>
                    </GridItem>
                  )
                })}
              </SimpleGrid>
            </DataBox>
          </GridItem>
          <GridItem colSpan={[12, 4]}>
            <DataBox
              title={'24hr Puff Volume'}
              color={color}
              subtitleColor={subtitleColor}
              {...(additionalDataBoxProps || {})}
              amount={
                dailyPuffVolume
                  ? new Intl.NumberFormat('en-US', {
                      currency: 'USD',
                      style: 'currency',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(dailyPuffVolume)
                  : ''
              }
            ></DataBox>
          </GridItem>
        </Grid>
      ) : (
        <></>
      )}
    </>
  )
}

export default PuffPanel
