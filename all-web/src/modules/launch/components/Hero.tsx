import { SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useInterval,
  useTheme,
  Flex,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import ChipTag from './ChipTag'
import CreatorWithAvatar from './CreatorWithAvatar'
import LabelTitle from './LabelTitle'
import { MdCheck, MdFingerprint } from 'react-icons/md'
import { LaunchModel } from './LaunchCard'
import { differenceInSeconds } from 'date-fns'
import { useMint } from '../launchHooks'
import { trpc } from '../../../utils/trpc'
import { ProjectOverviewModel } from '../types/project'
import { Pricing } from '@prisma/client'
import Link from 'next/link'
import { getPricingDisplay } from './formatUtils'
import { loadCandyProgramV2 } from '../../../utils/candyMachineHelpers'
import config, { connection } from '../../../config/config'
import { useAsync } from 'react-use'
import GradientProgress from './GradientProgress'
import { useColorModeValue } from '@chakra-ui/system'
import HeroGallery from './HeroGallery'
import { getTokenAccountsForOwner } from '../../../utils/splUtils'
import { pub } from '../../../utils/solUtils'
import alphaLabsConfig from '../config/alphaLabsConfig'

interface LaunchHeroProps {
  launch?: ProjectOverviewModel & { [key: string]: any }
}

export default function LaunchHero(props: LaunchHeroProps) {
  const { launch } = props
  const titleColor = useColorModeValue('#000', '#fff')

  if (!launch) return <></>

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

  const [countdown, setCountdown] = useState<any>({})

  const mintDatesAndPrices = React.useMemo(() => {
    const orderedPeriods = launch.mintingPeriods.sort(
      (mintPeriodA, mintPeriodB) => {
        return mintPeriodA.startAt.getTime() - mintPeriodB.startAt.getTime()
      }
    )
    const whitelistPeriod = launch.mintingPeriods.find((mintPeriod) => {
      return mintPeriod.isWhitelist
    })
    const whitelistMintSolPricing = whitelistPeriod?.pricings.find(
      (pricing) => pricing.isSol
    )
    const whitelistMintSolPrice =
      whitelistMintSolPricing?.amountInSol ?? whitelistMintSolPricing?.amount

    const publicPeriod = launch.mintingPeriods.find((mintPeriod) => {
      return !mintPeriod.isWhitelist
    })
    const publicMintSolPricing = publicPeriod?.pricings.find(
      (pricing) => pricing.isSol
    )
    const publicMintSolPrice =
      publicMintSolPricing?.amountInSol ?? publicMintSolPricing?.amount

    return {
      whitelistPeriod,
      whitelistMintSolPrice,
      publicPeriod,
      publicMintSolPrice,
    }
  }, [launch.mintingPeriods, launch.publicMintStart])

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

  return (
    <Box h='auto' pt={['2rem', '4rem']} pb={['1rem']} pos='relative'>
      {' '}
      {/*
        //search coming later

      <Button
        isLoading={mintRes.loading}
        onClick={(e) => mint('cl0xkqzns0000hrc96hax5cah')}
      >
        Mint test
      </Button>
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        spacing='1rem'
        maxWidth='40rem'
        width={['100%', '80%', '30rem']}
        margin='2rem auto'
        pb={[2, 4, 12]}
      >
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.300' />}
          />
          <Input
            placeholder='Search for collections and NTFs'
            width='100%'
            bg='bgDark'
            color='white'
          ></Input>
        </InputGroup>
      </Stack> */}
      <Container
        //background='radial-gradient(farthest-corner at 50% 70%, rgba(237, 93, 72, 0.3), transparent 90%)'
        //bgGradient='linear(to-b, #69AD41, #1C4D00)'
        bgSize='cover'
        bgRepeat='no-repeat'
        pt='5rem'
        w='100%'
        maxW='160rem'
        pos='absolute'
        top='0'
        bottom='0'
        left='50%'
        transform='translateX(-50%)'
        //opacity='0.8'
        zIndex={-1}
        borderBottomRadius={['10px', '20px']}
      ></Container>
      <Container
        //background='radial-gradient(rgba(236, 184, 77, 0.3), transparent 90%)'
        bgSize='cover'
        bgRepeat='no-repeat'
        pt='5rem'
        w='100%'
        maxW='100vw'
        height='50%'
        pos='absolute'
        bottom='20%'
        left='0'
        opacity='0.4'
        zIndex={-1}
      ></Container>
      <Container
        width='100%'
        mt={['1.5rem', '2rem', '2rem']}
        maxW='100%'
        px={0}
      >
        <Stack spacing={[2, 4, 8]} alignItems='center'>
          <Box>
            <Text
              fontSize={['2xl', '3xl', '4rem']}
              fontWeight={600}
              textAlign={'center'}
              color={titleColor}
            >
              {launch.projectName}
            </Text>
            <Text textAlign='center'>
              By {launch.creatorName ?? launch.creator?.username}
            </Text>
          </Box>
          <HStack
            width='90%'
            justifyContent={'center'}
            gap={[2, 3, 4]}
            flexWrap='wrap'
          >
            {launch.isVerified && (
              <ChipTag
                label='Verified'
                color='#152F33'
                bg='#E7EEDD'
                icon={<MdCheck />}
              />
            )}
            {launch.isDoxxed && (
              <ChipTag
                label='Doxxed'
                color='#595FD7'
                bg='#E2E3FF'
                icon={<MdFingerprint />}
              />
            )}
          </HStack>
          <Grid
            templateColumns={[
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
              'repeat(5, 1fr)',
            ]}
            width='100%'
            gap={3}
            maxW='40rem'
          >
            <GridItem>
              <LabelTitle
                title={mintDatesAndPrices.publicPeriod?.startAt.toLocaleDateString()}
                label='Public Date'
                titleSize='md'
              ></LabelTitle>
            </GridItem>
            <GridItem>
              <LabelTitle
                title={mintDatesAndPrices.publicMintSolPrice + ' SOL'}
                label='Public Price'
                titleSize='md'
              ></LabelTitle>
            </GridItem>
            <GridItem colSpan={[2, 1]}>
              <LabelTitle
                title={launch.totalSupply?.toString()}
                label='Supply'
                titleSize='md'
              ></LabelTitle>
            </GridItem>
            <GridItem>
              <LabelTitle
                title={mintDatesAndPrices.whitelistPeriod?.startAt.toLocaleDateString()}
                label='Whitelist Date'
                titleSize='md'
              ></LabelTitle>
            </GridItem>
            <GridItem>
              <LabelTitle
                title={mintDatesAndPrices.whitelistMintSolPrice + ' SOL'}
                label='Whitelist Price'
                titleSize='md'
              ></LabelTitle>
            </GridItem>
          </Grid>

          {countdown.wholeSeconds > 0 ? (
            <Grid
              templateColumns={'repeat(3, 1fr)'}
              width={['80%', '50%']}
              maxW='12rem'
            >
              <GridItem>
                <LabelTitle
                  title={countdown.hours}
                  label='Hours'
                  titleSize='lg'
                ></LabelTitle>
              </GridItem>
              <GridItem>
                <LabelTitle
                  title={countdown.minutes}
                  label='Minutes'
                  titleSize='lg'
                ></LabelTitle>
              </GridItem>
              <GridItem>
                <LabelTitle
                  title={countdown.seconds}
                  label='Seconds'
                  titleSize='lg'
                ></LabelTitle>
              </GridItem>
            </Grid>
          ) : (
            candyMachineRes.value && (
              <Box width={['92%', '80%']} maxW='30rem'>
                <GradientProgress
                  label='Total items minted'
                  value={candyMachineRes.value.percentage}
                  subLabel={`${candyMachineRes.value.itemsRedeemed} / ${candyMachineRes.value.itemsAvailable}`}
                />
              </Box>
            )
          )}

          <Box width={['70%', '50%']} maxW='18.75rem'>
            <Link href={`/launch/detail/${launch.projectUrlIdentifier}`}>
              <Button
                bgColor='bgDark'
                color='white'
                width='100%'
                rounded={'md'}
                height='3rem'
                borderColor='transparent'
                filter='drop-shadow(0px 2px 15px rgba(0, 0, 0, 0.25))'
                _hover={{
                  backgroundColor: '#595E66',
                }}
              >
                Show Collection
              </Button>
            </Link>
          </Box>
        </Stack>
        <Box marginTop={['-1.5rem']} zIndex={-1} position='relative'>
          <HeroGallery project={launch} />
        </Box>
      </Container>
    </Box>
  )
}

function useNavigate() {
  throw new Error('Function not implemented.')
}
