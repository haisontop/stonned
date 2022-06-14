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
import { DataBox } from '../../components/DataBox'
import Line from '../../components/LineChart'
import { livingSacApesCount } from '../../config/config'
import { useEvolutionStats } from '../evolution/evolution.hooks'
import { VscArrowSwap } from 'react-icons/vsc'
import { FaArrowRight } from 'react-icons/fa'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { useRescueMissionStats } from '../breeding/breeding.hooks'
import { trpc } from '../../utils/trpc'
import { useAsync } from 'react-use'

const sacMeURL =
'https://api-mainnet.magiceden.dev/v2/collections/stoned_ape_crew/stats'
const oldSACMeURL =
'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/stoned_ape_crew'
const nacMeURL =
'https://api-mainnet.magiceden.dev/v2/collections/nuked_apes/stats'
const oldNACMeURL =
'https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/nuked_apes'

function ApePanel() {
  const [sacVolume24Hr, setSACVolume24Hr] = useState()
  const [nacVolume24Hr, setNACVolume24Hr] = useState()

  const [sacMeStats, setSacMeStats] = useState<any>()
  const [nacMeStats, setNacMeStats] = useState<any>()

  async function getMagicEdenData() {
    const [sacRes, nacRes] = await Promise.all([
      axios.get(sacMeURL),
      axios.get(nacMeURL),
    ])

    setSacMeStats(sacRes.data)
    setNacMeStats(nacRes.data)

    const [oldSACRes, oldNACRes] = await Promise.all([
      axios.get(oldSACMeURL),
      axios.get(oldNACMeURL),
    ])

    let sacVolume24: any = oldSACRes.data.volume24hr / LAMPORTS_PER_SOL
    let nacVolume24: any = oldNACRes.data.volume24hr / LAMPORTS_PER_SOL

    setSACVolume24Hr(sacVolume24)
    setNACVolume24Hr(nacVolume24)
  }

  const stakingStats = trpc.useQuery(['stakingStats.all'])
  const evolutionStats = useEvolutionStats()
  const rescueMissionStats = useRescueMissionStats()

  useAsync(getMagicEdenData, [])

  const loading =
    !sacMeStats && stakingStats.isLoading && evolutionStats.loading

  if (loading)
    return (
      <Flex pt='2rem' justifyContent={'center'}>
        <Image src='images/112.gif' />
      </Flex>
    )

  return (
    <>
      <Box w='100%' d='flex' justifyContent='center' alignItems='center' mt={8}>
        <Image
          width='120px'
          borderRadius='50%'
          boxShadow='md'
          src='/images/sac.gif'
        ></Image>
        <Heading m={4} fontSize='2xl' fontFamily={'body'} fontWeight='bold'>
          SAC Stats
        </Heading>
      </Box>

      <Box d='flex'>
        <SimpleGrid columns={[1, 4]} p={3} gap={3} width={'100%'}>
          <DataBox
            title={'SAC Supply'}
            amount={livingSacApesCount}
            amountSideText={
              <Text as='span' textDecoration='line-through'>
                4200
              </Text>
            }
          />{' '}
          {!stakingStats.isLoading && (
            <DataBox
              title={'SAC Staked'}
              amount={
                <>
                  {stakingStats.data?.sac?.percentage.toFixed(2)}
                  <chakra.span fontSize={'lg'} fontWeight={'semibold'}>
                    %
                  </chakra.span>
                </>
              }
              amountSideText={
                stakingStats.data ? (
                  <chakra.span fontWeight={'normal'}>
                    &nbsp;
                    <HiArrowNarrowRight style={{ display: 'inline' }} />
                    &nbsp; {stakingStats.data.sac.amount}{' '}
                    <chakra.span fontWeight={500} fontSize={'sm'}></chakra.span>
                  </chakra.span>
                ) : (
                  ''
                )
              }
            />
          )}
          {sacMeStats && (
            <>
              <DataBox
                title={'SAC Floor Price ME'}
                amount={
                  sacMeStats.floorPrice
                    ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                      }).format(sacMeStats.floorPrice / LAMPORTS_PER_SOL)
                    : ''
                }
                amountSideText='SOL'
              />{' '}
              <DataBox
                title={'SAC Listed'}
                amount={sacMeStats.listedCount ? sacMeStats.listedCount : ''}
              />{' '}
              <DataBox
                title={'Total Volume'}
                amountSideText='SOL'
                amount={
                  sacMeStats.volumeAll
                    ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(sacMeStats.volumeAll / LAMPORTS_PER_SOL)
                    : ''
                }
              />
              {sacVolume24Hr ? (
                <DataBox
                  title={'24hr Volume'}
                  amountSideText='SOL'
                  amount={
                    sacVolume24Hr
                      ? new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(sacVolume24Hr)
                      : ''
                  }
                />
              ) : (
                ''
              )}
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
                    &nbsp; {rescueMissionStats.value.apesOnMission}{' '}
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
              title={'Past Missions'}
              amount={
                <>
                  {rescueMissionStats.value?.allPercentage}{' '}
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
                    &nbsp; {rescueMissionStats.value.allMissionCount}{' '}
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
      <Box w='100%' d='flex' justifyContent='center' alignItems='center' mt={8}>
        <Image
          width='120px'
          borderRadius='50%'
          boxShadow='md'
          src='/images/apedragon.jpg'
        ></Image>
        <Heading m={4} fontSize='2xl' fontFamily={'body'} fontWeight='bold'>
          NAC Stats
        </Heading>
      </Box>
      <Box d='flex'>
        <SimpleGrid columns={[1, 4]} p={3} gap={3} width={'100%'}>
          {!stakingStats.isLoading && (
            <>
              <DataBox
                title={'NAC Circulating'}
                amount={stakingStats.data?.nuked.livingApesCount}
              />{' '}
              <DataBox
                title={'NAC Staked'}
                amount={
                  <>
                    {stakingStats.data?.nuked?.percentage.toFixed(2)}
                    <chakra.span fontSize={'lg'} fontWeight={'semibold'}>
                      %
                    </chakra.span>
                  </>
                }
                amountSideText={
                  stakingStats.data ? (
                    <chakra.span fontWeight={'normal'}>
                      &nbsp;
                      <HiArrowNarrowRight style={{ display: 'inline' }} />
                      &nbsp; {stakingStats.data.nuked.amount}{' '}
                      <chakra.span
                        fontWeight={500}
                        fontSize={'sm'}
                      ></chakra.span>
                    </chakra.span>
                  ) : (
                    ''
                  )
                }
              />
            </>
          )}
          {!rescueMissionStats.loading && (
            <DataBox
              title={'Nuked Apes To Rescue'}
              amount={
                <>
                  {(
                    (4200 - stakingStats.data?.nuked.livingApesCount) /
                    4200 * 100
                  ).toFixed(2)}{' '}
                  <chakra.span fontSize={'lg'} fontWeight={'semibold'}>
                    {' '}
                    %
                  </chakra.span>
                </>
              }
              amountSideText={
                stakingStats.data?.nuked ? (
                  <chakra.span fontWeight={'normal'}>
                    &nbsp;
                    <HiArrowNarrowRight style={{ display: 'inline' }} />
                    &nbsp; {4200 - stakingStats.data.nuked.livingApesCount}{' '}
                    <chakra.span fontWeight={500} fontSize={'sm'}></chakra.span>
                  </chakra.span>
                ) : (
                  ''
                )
              }
            />
          )}

          {nacMeStats && (
            <>
              <DataBox
                title={'NAC Floor Price ME'}
                amount={
                  nacMeStats.floorPrice
                    ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                      }).format(nacMeStats.floorPrice / LAMPORTS_PER_SOL)
                    : ''
                }
                amountSideText='SOL'
              />{' '}
              <DataBox
                title={'NAC Listed'}
                amount={nacMeStats.listedCount ? nacMeStats.listedCount : ''}
              />{' '}
              <DataBox
                title={'NAC Total Volume'}
                amountSideText='SOL'
                amount={
                  nacMeStats.volumeAll
                    ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(nacMeStats.volumeAll / LAMPORTS_PER_SOL)
                    : ''
                }
              />
              {nacVolume24Hr ? (
                <DataBox
                  title={'NAC 24hr Volume'}
                  amountSideText='SOL'
                  amount={
                    nacVolume24Hr
                      ? new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(nacVolume24Hr)
                      : ''
                  }
                />
              ) : (
                ''
              )}
            </>
          )}
        </SimpleGrid>
      </Box>
    </>
  )
}

export default ApePanel
