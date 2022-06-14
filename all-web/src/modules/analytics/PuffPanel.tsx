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
import { useAsyncRetry } from 'react-use'
import config, { connection, programPuffWallet, puffWallet } from '../../config/config'
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

const dexLabURL = 'https://api.dexlab.space/v1/prices/recent'
const dexVolume =
  'https://api.dexlab.space/v1/volumes/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV'
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
  const [dailyPuffVolume, setDailyPuffVolume] = useState()
  const [burnedPuff, setBurnedPuff] = useState()
  const [fractionalizedNFTValue, setFractionalizedNFTValue] = useState<number>()
  const [coingeckoData, setCoingeckoData] = useState()
  const [coingeckoTimes, setCoingeckoTimes] = useState<Date[]>([])
  const [coingeckoValues, setCoingeckoValues] = useState<number[]>([])

  const fractionalizedNFTs = [
    {
      name: 'Stoned Ape #270',
      image: '/images/sac270.png',
      link: 'https://solscan.io/token/5e6uW3u7BR24UK9jakra9iipW1AQv5fSVmChQsFN4b6G',
    },
    {
      name: 'Stoned Ape #991',
      image: '/images/sac991.png',
      link: 'https://solscan.io/token/nnsyke25QR3yJAmAuQhjESEHHjs93iyUqKaKPhGWtQh',
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

  useEffect(() => {
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

        getPuffVolume().then((dexVolume) => {
          console.log('dexVolume', dexVolume, data.puffDailyVolume, 21000)

          setDailyPuffVolume(dexVolume + data.puffDailyVolume + 21000)
        })
      })

    /* fetch('https://www.coingecko.com/price_charts/22049/usd/30_days.json')
      .then((res) => res.json())
      .then((data) => {
        setCoingeckoData(data)

        console.log(data);
        
        
      }) */
  }, [])

  console.log('data', circulatingPuff)

  const fetcher = (url: any) => axios.get(url).then((res) => res.data)
  const { data, error } = useSWR(`${dexLabURL}`, fetcher)

  const puffBalanceRes = useAsyncRetry(async () => {
    try {
      const puffTokenAccount = (await getTokenAccount(
        connection,
        new PublicKey(config.allToken),
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

  useEffect(() => {
    getPuffData()
    getPuffVolume()
  }, [])

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
      {data ? (
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
