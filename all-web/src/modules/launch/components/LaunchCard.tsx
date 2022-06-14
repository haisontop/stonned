import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  Link,
  useInterval,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { GradientText } from '../../../components/GradientText'
import CreatorWithAvatar from './CreatorWithAvatar'
import LabelTitle from './LabelTitle'
import { FaHeart } from 'react-icons/fa'
import { ProjectOverviewModel } from '../types/project'
import { useColorModeValue } from '@chakra-ui/system'
import { MdCheck } from 'react-icons/md'
import { differenceInSeconds } from 'date-fns'
import GradientProgress from './GradientProgress'
import ChipTag from './ChipTag'
import { getTokenAccountsForOwner } from '../../../utils/splUtils'
import { useAsync } from 'react-use'
import { pub } from '../../../utils/solUtils'
import config, { connection } from '../../../config/config'
import alphaLabsConfig from '../config/alphaLabsConfig'
import { loadCandyProgramV2 } from '../../../utils/candyMachineHelpers'

export interface LaunchModel {
  id: string
  projectName: string
  imageURL: string
  creator: {
    name: string
    avatarURL: string
    isAwarded?: boolean
  }
  price: {
    value: string
    currency: string
  }
  mintDate: string
  launchType: 'verified' | 'unverified'
  supply: string
  xyzScore: string
  sold?: boolean
  remainedItems: string
}

interface LaunchCardProps {
  launch: ProjectOverviewModel
  category: 'current' | 'upcoming' | 'ended'
}

const SoldOutSection = () => {
  return (
    <Box
      bg={
        'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(112, 112, 112, 0.2) 100%), linear-gradient(180deg, #ECBF4D 0%, #ED5647 100%)'
      }
      py={4}
      borderBottomRadius='10px'
    >
      <Text fontSize='1rem' color={'#fff'} textAlign='center' fontWeight={800}>
        SOLD OUT
      </Text>
    </Box>
  )
}

export default function LaunchCard(props: LaunchCardProps) {
  const { launch, category } = props
  const headerBgColor = useColorModeValue('#fff', '#000')
  const cardBg = useColorModeValue('#fff', '#101011')
  const countdownBg = useColorModeValue('#131313', '#2C2E33')
  const titleColor = useColorModeValue('#000', '#fff')

  const [countdown, setCountdown] = useState<any>({})

  useInterval(() => {
    const wholeSeconds = differenceInSeconds(
      mintDatesAndPrices.whitelistPeriod?.startAt!,
      new Date()
    )
    const hours = Math.floor(wholeSeconds / 3600)
    const minutes = Math.floor((wholeSeconds - hours * 3600) / 60)
    const seconds = Math.floor(wholeSeconds - (hours * 3600 + minutes * 60))

    setCountdown({
      hours,
      minutes,
      seconds,
      wholeSeconds,
    })
  }, 1000)

  const mintDatesAndPrices = React.useMemo(() => {
    const orderedPeriods = launch.mintingPeriods.sort(
      (mintPeriodA, mintPeriodB) => {
        return mintPeriodA.startAt.getTime() - mintPeriodB.startAt.getTime()
      }
    )
    const whitelistPeriod = launch.mintingPeriods.find((mintPeriod) => {
      return mintPeriod.isWhitelist
    })
    const publicPeriod = launch.mintingPeriods.find((mintPeriod) => {
      return !mintPeriod.isWhitelist
    })

    return { whitelistPeriod, publicPeriod }
  }, [launch.mintingPeriods, launch.publicMintStart])

  const renderTop = React.useCallback(
    (padding) => {
      return (
        <>
          {launch.creatorName && (
            <Box p={padding} bg={cardBg}>
              <CreatorWithAvatar
                name={launch.creatorName ?? launch.creator?.username}
                isAwarded={launch.isIncubator ?? false}
                size='sm'
                avatarURL={launch.logoUrl ?? ''}
              />
            </Box>
          )}
        </>
      )
    },
    [category, cardBg]
  )

  const candyMachineRes = useAsync(async () => {
    if (!launch.candyMachineId) return

    let itemsRedeemed = 0

    let itemsAvailable = 0
    let itemsRemaining = 0

    if (launch.preMintWallet) {
      const nftTokenAccounts = await getTokenAccountsForOwner(
        pub(launch.preMintWallet!),
        {
          withAmount: true,
          commitment: 'confirmed',
        }
      )

      const mintNfts = nftTokenAccounts
        .map((n) => n.account.data.parsed.info.mint)
        .filter((n) => alphaLabsConfig.mints.includes(n))
        .map((n) => pub(n))
      itemsRemaining = mintNfts.length
      itemsAvailable = launch.totalSupply
      itemsRedeemed = itemsAvailable - itemsRemaining
    } else {
      const anchorProgram = await loadCandyProgramV2(
        {} as any,
        config.solanaEnv,
        config.rpcHost
      )
      const candyMachine = (await anchorProgram.account.candyMachine.fetch(
        launch.candyMachineId!
      )) as any
      itemsRedeemed = candyMachine.itemsRedeemed.toNumber() as number
      itemsAvailable = candyMachine.data.itemsAvailable.toNumber() as number
      itemsRemaining = itemsAvailable - itemsRedeemed
    }

    return {
      // ...candyMachine,
      itemsRedeemed: itemsRedeemed,
      itemsAvailable: itemsAvailable,
      itemsRemaining,
      percentage: (itemsRedeemed / itemsAvailable) * 100,
    }
  }, [connection, launch.candyMachineId])

  /**
   * TODO: handle sold out from the real data
   */
  const isSold = React.useMemo(() => {
    return false
  }, [])

  const renderBottom = React.useCallback(() => {
    if (category === 'ended') {
      if (isSold) {
        return <SoldOutSection />
      }
      return null
    } else if (category === 'current') {
      if (isSold) {
        return <SoldOutSection />
      } else {
        return (
          <Box px={4} pb={4} bg={cardBg}>
            {
            candyMachineRes.value && (
              <GradientProgress
                label='Items minted'
                value={candyMachineRes.value.percentage}
                subLabel={`${candyMachineRes.value.itemsRedeemed} / ${candyMachineRes.value.itemsAvailable}`}
              />)
            }
          </Box>
        )
      }
    } else {
      return (
        <Box bg={countdownBg} py={2} borderBottomRadius='10px' width={'100%'}>
          <Grid templateColumns={'repeat(3, 1fr)'} width={['90%']} mx='auto'>
            <GridItem>
              <LabelTitle
                title={countdown.hours}
                label='Hours'
                titleSize='lg'
                titleColor='#fff'
              ></LabelTitle>
            </GridItem>
            <GridItem>
              <LabelTitle
                title={countdown.minutes}
                label='Minutes'
                titleSize='lg'
                titleColor='#fff'
              ></LabelTitle>
            </GridItem>
            <GridItem>
              <LabelTitle
                title={countdown.seconds}
                label='Seconds'
                titleSize='lg'
                titleColor='#fff'
              ></LabelTitle>
            </GridItem>
          </Grid>
        </Box>
      )
    }
  }, [category, isSold, cardBg, countdown, countdownBg])

  return (
    <Link href={`/launch/detail/${launch.projectUrlIdentifier}`}>
      <Stack
        boxShadow={'0px 2px 10px rgba(0, 0, 0, 0.2)'}
        borderRadius='10px'
        spacing={0}
        maxWidth='18.75rem'
        overflow={'hidden'}
        transition='all .2s ease-in-out'
        _hover={{ 
          cursor: 'pointer',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)'
        }}

        // margin='0 auto'
      >
        {category !== 'ended' && renderTop(4)}

        <Box width={['18.75rem']} height={['18.75rem']} position='relative'>
          <Image
            width={['18.75rem']}
            height={['18.75rem']}
            src={launch.profilePictureUrl}
          />
          <Box
            width='100%'
            height='7rem'
            position='absolute'
            background={
              'linear-gradient(180deg, rgba(0, 0, 0, 0) 18.38%, rgba(0, 0, 0, 0.27) 51.54%, rgba(0, 0, 0, 0.63) 100%)'
            }
            bottom={0}
          />
          <Stack position='absolute' bottom={'0.625rem'} px='1rem' width='100%'>
            {category === 'ended' && (
              <Text
                _hover={{ cursor: 'pointer' }}
                fontSize={['1.25rem', '1.375rem']}
                fontWeight={700}
                color={'#fff'}
              >
                {launch.projectName}
              </Text>
            )}
            <HStack justifyContent={'space-between'} width='100%'>
              <ChipTag
                bg='#E7EEDD'
                color='#152F33'
                label='Verified Launch'
                icon={<MdCheck />}
              />
              {/* <HStack mt='0.5rem' spacing={'0.1rem'}>
                <GradientText
                  fontSize='.75rem'
                  fontWeight={800}
                  bgGradient={`linear-gradient(180deg, #ECBF4D 0%, #ED5647 100%)`}
                >
                  87%
                </GradientText>
                <Text fontSize='.75rem' color='#fff' fontWeight={600}>
                  Likes
                </Text>
              </HStack> */}
            </HStack>
          </Stack>
        </Box>
        <Stack spacing={[2, 2, 3]} p={'0.75rem 1rem 1rem'} bg={cardBg}>
          {category === 'ended' ? (
            renderTop(0)
          ) : (
            <Link href={`/launch/detail/${launch.projectUrlIdentifier}`}>
              <Text
                _hover={{ cursor: 'pointer' }}
                fontSize={['1.25rem', '1.375rem']}
                fontWeight={600}
                textAlign={'center'}
                color={titleColor}
              >
                {launch.projectName}
              </Text>
            </Link>
          )}

          {/* Likes and Save project comes later */}
          {/* <Flex justifyContent={'space-between'} flexWrap='wrap'>
          <HStack mt='0.5rem' ml={['1rem']}>
            <GradientText
              fontSize='.75rem'
              fontWeight={600}
              bgGradient={`linear-gradient(180deg, #ECBF4D 0%, #ED5647 100%)`}
            >
              87%
            </GradientText>
            <Text
              fontSize='.75rem'
              color='#000'
              fontWeight={600}
            >
              Like Ratio
            </Text>
          </HStack>
          <HStack mt='0.5rem' mr={['1rem']}>
            <Text
              fontSize='.75rem'
              color='#000'
              fontWeight={600}
            >
              Save Project
            </Text>
            <Icon as={FaHeart} color='#ED5647' />
          </HStack>
        </Flex> */}
          <Grid
            templateColumns={
              category === 'ended' ? ['repeat(3, 1fr)'] : ['repeat(2, 1fr)']
            }
            width='100%'
            gap={2}
          >
            <GridItem>
              <LabelTitle
                title={`${launch.publicMintPrice} SOL`}
                label='Mint Price'
                textAlign={'left'}
              />
            </GridItem>
            <GridItem>
              <LabelTitle
                title={launch.totalSupply?.toString() || 'TBA'}
                label='Supply'
                textAlign={'left'}
              />
            </GridItem>
            <GridItem colSpan={[2, 1]}>
              <LabelTitle
                title={mintDatesAndPrices.whitelistPeriod?.startAt.toLocaleDateString()}
                label='Mint Date'
                textAlign={'left'}
              />
            </GridItem>
          </Grid>
        </Stack>

        {/* <Box
        bg={launch.isVerified ? '#E7EEDD' : ' #FFE8BB'}
        py={2}
        borderBottomRadius='10px'
      >
        <Text
          fontSize='0.875rem'
          color={launch.isVerified ? '#152F33' : '#ED6749'}
          textAlign='center'
          fontWeight={500}
        >
          {launch.isVerified ? 'Verified' : 'Unverified'}
        </Text>
      </Box> */}
        {renderBottom()}
      </Stack>
    </Link>
  )
}
