import {
  Box,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Flex,
  chakra,
} from '@chakra-ui/react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useStakingStats } from '../staking/staking.hooks'
import { DataBox } from '../../components/DataBox'
import Line from '../../components/LineChart'
import { livingNftCount } from '../../config/config'
import { useEvolutionStats } from '../evolution/evolution.hooks'
import { VscArrowSwap } from 'react-icons/vsc'
import { FaArrowRight } from 'react-icons/fa'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { useRescueMissionStats } from '../breeding/breeding.hooks'

function ApePanel() {
  const [floorPrice, setFloorPrice] = useState()
  const [listedCount, setListedCount] = useState()
  const [allVolume, setAllVolume] = useState()
  const [volume24Hr, setVolume24Hr] = useState()
  const [allActivity, setAllActivity] = useState()
  const [allActivityTime, setAllActivityTime] = useState()

  const MeURL =
    'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/stoned_ape_crew'
  const MeActivity =
    'https://api-mainnet.magiceden.io/rpc/getGlobalActivitiesByQuery?q=%7B%22%24match%22%3A%7B%22collection_symbol%22%3A%22stoned_ape_crew%22%7D%2C%22%24sort%22%3A%7B%22blockTime%22%3A-1%7D%2C%22%24skip%22%3A0%7D'

  async function getMagicEdenData() {
    const res = await axios.get(MeURL)
    let magicEdenData = res.data.results

    let floorPr: any = magicEdenData.floorPrice / LAMPORTS_PER_SOL
    let volume: any = magicEdenData.volumeAll / LAMPORTS_PER_SOL
    let volume24hr: any = magicEdenData.volume24hr / LAMPORTS_PER_SOL

    setFloorPrice(floorPr)
    setListedCount(magicEdenData.listedCount)
    setAllVolume(volume)
    setVolume24Hr(volume24hr)
  }

  async function getMagicEdenActivity() {
    const res = await axios.get(MeActivity)
    let activity = res.data.results

    activity.map((item: any) => {
      let x = item.parsedList
      let time = item.createdAt
      if (x == undefined) {
        return
      } else {
        setAllActivity(x.amount)
        setAllActivityTime(time)
      }
    })
  }

  const stakingStats = useStakingStats()

  const evolutionStats = useEvolutionStats()

  const rescueMissionStats = useRescueMissionStats()

  useEffect(() => {
    getMagicEdenData()
    getMagicEdenActivity()
  }, [])

  const loading = !floorPrice && stakingStats.loading && evolutionStats.loading

  if (loading)
    return (
      <Flex pt='2rem' justifyContent={'center'}>
        <Image src='images/112.gif' />
      </Flex>
    )

  return (
    <Box d='flex'>
      <SimpleGrid columns={[1, 4]} p={3} gap={3} width={'100%'}>
        {!stakingStats.loading && (
          <DataBox
            title={'Staked 🚀'}
            amount={
              <>
                {stakingStats.value?.percentage.toFixed(2)}
                <chakra.span fontSize={'lg'} fontWeight={'semibold'}>
                  %
                </chakra.span>
              </>
            }
            amountSideText={
              stakingStats.value ? (
                <chakra.span fontWeight={'normal'}>
                  &nbsp;
                  <HiArrowNarrowRight style={{ display: 'inline' }} />
                  &nbsp; {stakingStats.value.amount}{' '}
                  <chakra.span fontWeight={500} fontSize={'sm'}></chakra.span>
                </chakra.span>
              ) : (
                ''
              )
            }
          />
        )}
        <DataBox
          title={'SAC Supply 🔥'}
          amount={livingNftCount}
          amountSideText={
            <Text as='span' textDecoration='line-through'>
              4200
            </Text>
          }
        />{' '}
        {floorPrice && (
          <>
            <DataBox
              title={'Floor Price ME'}
              amount={
                floorPrice
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                    }).format(floorPrice)
                  : ''
              }
              amountSideText='SOL'
            />{' '}
            <DataBox title={'Listed'} amount={listedCount ? listedCount : ''} />{' '}
            <DataBox
              title={'Total Volume'}
              amountSideText='SOL'
              amount={
                allVolume
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(allVolume)
                  : ''
              }
            />
            <DataBox
              title={'24hr Volume'}
              amountSideText='SOL'
              amount={
                volume24Hr
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(volume24Hr)
                  : ''
              }
            />
          </>
        )}
        {!evolutionStats.loading && (
          <DataBox
            title={'Apes on Retreat'}
            amount={
              <>
                {evolutionStats.value?.percentage}{' '}
                <chakra.span fontSize={'lg'} fontWeight={'semibold'}>
                  {' '}
                  %
                </chakra.span>
              </>
            }
            amountSideText={
              evolutionStats.value ? (
                <chakra.span fontWeight={'normal'}>
                  &nbsp;
                  <HiArrowNarrowRight style={{ display: 'inline' }} />
                  &nbsp; {evolutionStats.value.amount}{' '}
                  <chakra.span fontWeight={500} fontSize={'sm'}></chakra.span>
                </chakra.span>
              ) : (
                ''
              )
            }
          />
        )}
        {!rescueMissionStats.loading && (
          <DataBox
            title={'Apes on Mission'}
            amount={
              <>
                {rescueMissionStats.value?.percentage}{' '}
                <chakra.span fontSize={'lg'} fontWeight={'semibold'}>
                  {' '}
                  %
                </chakra.span>
              </>
            }
            amountSideText={
              rescueMissionStats.value ? (
                <chakra.span fontWeight={'normal'}>
                  &nbsp;
                  <HiArrowNarrowRight style={{ display: 'inline' }} />
                  &nbsp; {rescueMissionStats.value.missionCount}{' '}
                  <chakra.span fontWeight={500} fontSize={'sm'}></chakra.span>
                </chakra.span>
              ) : (
                ''
              )
            }
          />
        )}
      </SimpleGrid>
    </Box>
  )
}

export default ApePanel
