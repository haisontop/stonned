import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  StackDivider,
  Text,
  useInterval,
} from '@chakra-ui/react'
import { MintingPeriod } from '@prisma/client'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  useWalletModal,
  WalletMultiButton,
} from '../../../components/wallet-ui'
import { differenceInSeconds } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import Countdown from 'react-countdown'
import { useAsync } from 'react-use'
import { GradientButton } from '../../../components/GradientButton'
import config, { connection } from '../../../config/config'
import { loadCandyProgramV2 } from '../../../utils/candyMachineHelpers'
import { getDexlabPrice, getPriceInSol } from '../../../utils/sacUtils'
import { useMint, useMintStatus } from '../launchHooks'
import { ProjectDetailModel } from '../types/project'
import { getDisplayForAllPricings } from './formatUtils'
import GradientProgress from './GradientProgress'
import LabelTitle from './LabelTitle'
import { useColorModeValue } from '@chakra-ui/system'
import { getTokenAccountsForOwner } from '../../../utils/splUtils'
import { getSolscanTxLink, pub } from '../../../utils/solUtils'
import alphaLabsConfig from '../config/alphaLabsConfig'
import { useQuery } from 'react-query'
import reattempt from 'reattempt'
import { times } from 'lodash'
import { DotProgress } from '../../../components/wallet-ui/DotProgress'
import rpc from '../../../utils/rpc'
import { useUser } from '../../common/authHooks'

interface PresaleOverviewProps {
  title: string
  price: {
    value: string
    currency: string
  }
  supply: string
  mintDate: string
  status: {
    current: string
    total: string
    percent: number
    category: 'sold' | 'open'
  }
  endDate: string
}

const sortAfterDateAndHasEnded = (
  periodA: MintingPeriod,
  periodB: MintingPeriod
) => {
  const periodAHasEnded = periodA.endAt.getTime() - new Date().getTime() < 0
  const periodBHasEnded = periodB.endAt.getTime() - new Date().getTime() < 0

  if (periodAHasEnded && periodBHasEnded) {
    return periodB.endAt.getTime() - periodA.endAt.getTime()
  }

  if (periodAHasEnded) {
    return 1
  }

  if (periodBHasEnded) {
    return -1
  }

  return periodA.startAt.getTime() - periodB.startAt.getTime()
}

const PresaleOverview = (props: PresaleOverviewProps) => {
  const { title, status, price, supply, mintDate, endDate } = props

  return (
    <>
      <HStack justifyContent={'space-between'}>
        <Text fontSize={['1.25rem', '1.5rem']} fontWeight={600}>
          {title}
        </Text>
        <Box borderRadius={'5px'} bg='#FFDCDC' px={2} py={0.5}>
          {status.category === 'sold' && (
            <Text color='#DC1616' fontSize={['.75rem', '.875rem']}>
              sold out
            </Text>
          )}
        </Box>
      </HStack>
      <GradientProgress
        label='Presale Items Sold'
        value={status.percent}
        subLabel={`(${status.current}/${status.total})`}
      />
      <HStack justifyContent={'space-between'}>
        <LabelTitle
          title={`${price.value} ${price.currency}`}
          label='Mint Price'
        ></LabelTitle>
        <LabelTitle title={supply} label='Supply'></LabelTitle>
        <LabelTitle title={mintDate} label='Mint Price'></LabelTitle>
      </HStack>
      <Text
        textAlign={'center'}
        fontSize={['.75rem', '.875rem']}
        color='#888888'
      >
        Ended on {endDate}
      </Text>
    </>
  )
}

export default function MintCard(props: { launch: ProjectDetailModel }) {
  const cardBg = useColorModeValue('#fff', '#101011')
  const popupCardBg = useColorModeValue('#fff', 'rgb(31, 32, 35)')
  const cardBackdropColor = useColorModeValue(
    'rgba(0, 0, 0, 0.5)',
    'rgba(0, 0, 0, 0.7)'
  )
  const fontColor = useColorModeValue('#000', 'white')
  const currencyBorderColor = useColorModeValue('#000', 'white')

  const user = useUser()

  const launch = props.launch
  const mintingPeriods = launch?.mintingPeriods
  const sortedMintingPeriods = mintingPeriods.sort((a, b) =>
    sortAfterDateAndHasEnded(a, b)
  )

  const isPastProject = useMemo(() => {
    if (!mintingPeriods?.length) return true
    const endedMintingPeriods = mintingPeriods.filter((mintingPeriod) => {
      const hasEnded = mintingPeriod.endAt.getTime() - new Date().getTime() < 0
      return hasEnded
    })
    return endedMintingPeriods.length === mintingPeriods.length
  }, [mintingPeriods])

  const [overlayCardIsActive, setOverlayCardIsActive] = useState(false)

  const [mintRes, mint] = useMint()

  /* const mintStatusRes = useMintStatus(mintRes.value?.tx) */

  const confirmationRes = useQuery(
    ['confirmation', mintRes.value?.tx],
    async () => {
      if (!mintRes.value?.tx) return null

      await reattempt.run(
        { times: 2 },
        async () => await connection.confirmTransaction(mintRes.value?.tx!)
      )

      const tx = await rpc.query('launch.getTransactionBySignature', {
        tx: mintRes.value.tx!,
      })

      return {
        success: true,
        solscanLink: getSolscanTxLink(mintRes.value.tx),
        metadataLink: tx?.metadataLink!,
      }
    },
    { enabled: !!mintRes.value?.tx }
  )

  const loading = mintRes.loading || confirmationRes.isLoading
  const error = mintRes.error?.message || (confirmationRes.error as string)

  const wallet = useWallet()
  const { visible, setVisible } = useWalletModal()

  const [mintAmount, setMintAmount] = React.useState(1)
  const [puffAllMintAmount, setPuffAllMintAmount] = React.useState(1)

  const hanldePlusAmount = (plusValue: number) => {
    setMintAmount((value) => value + plusValue)
  }

  const hanldePuffAllPlusAmount = (plusValue: number) => {
    setPuffAllMintAmount((value) => value + plusValue)
  }

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

  return (
    <>
      {overlayCardIsActive && (
        <Box
          zIndex={300}
          position={'fixed'}
          top='0'
          left='0'
          width='100vw'
          height='100vh'
          bg={cardBackdropColor}
          blur={'lg'}
          display='flex'
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Box
            paddingX={[4, 8, 12]}
            paddingY={[8, 10, 12]}
            borderRadius={'10px'}
            position='relative'
            width={['320px', '380px']}
            backgroundColor={popupCardBg}
            boxShadow={'lg'}
            maxHeight={['520px', '600px']}
          >
            <Stack spacing={8} display='flex' alignItems={'center'}>
              <Image
                display='inline-block'
                height={'auto'}
                width='180px'
                src={'/images/allblue-logo.png'}
              ></Image>
              {loading && (
                <>
                  <Heading
                    textAlign={'center'}
                    fontSize={'1.25rem'}
                    fontWeight='600'
                  >
                    Transaction is being processed...
                  </Heading>

                  {/*   <Text textAlign={'center'} fontWeight={500} fontSize='2xl'>
                    {mintStatusRes.conirmations} Confirmations
                  </Text> */}

                  <HStack
                    justifyContent={'center'}
                    paddingTop='2rem'
                    spacing={'1rem'}
                  >
                    <Image
                      src='/icons/logo-solana.svg'
                      width={'3.2rem'}
                      fill='#C4C4C4'
                    />
                    <DotProgress />
                    <Image src='/icons/logo-black.svg' width={'3.2rem'} />
                  </HStack>
                  <Text
                    textAlign={'center'}
                    color='#888888'
                    fontWeight={600}
                    fontSize='0.9rem'
                  >
                    This can take up to 60 seconds.
                  </Text>
                </>
              )}
              {confirmationRes.data?.success && !loading && (
                <>
                  <Heading
                    textAlign={'center'}
                    fontSize={'1.25rem'}
                    fontWeight='600'
                  >
                    Transaction has been successful
                  </Heading>
                  <CheckIcon w={12} h={12}></CheckIcon>
                  {confirmationRes.data.success && (
                    <Text
                      textAlign={'center'}
                      color='#888888'
                      fontWeight={600}
                      fontSize='0.9rem'
                    >
                      Check on{' '}
                      <Link
                        textDecoration={'underline'}
                        target={'_blank'}
                        href={confirmationRes.data.solscanLink}
                      >
                        Solscan
                      </Link>
                    </Text>
                  )}
                </>
              )}
              {error /* || (mintRes.value && !mintRes.value?.success) */ &&
                !loading && (
                  <>
                    <Heading
                      textAlign={'center'}
                      fontSize={'1.25rem'}
                      fontWeight='600'
                    >
                      Transaction has failed
                    </Heading>
                    <CloseIcon w={12} h={12}></CloseIcon>
                    {error && (
                      <Text
                        textAlign={'center'}
                        color='#888888'
                        fontWeight={600}
                        fontSize='0.9rem'
                      >
                        Error: {error}
                      </Text>
                    )}
                  </>
                )}
              {!loading && (
                <Button
                  onClick={() => setOverlayCardIsActive(false)}
                  color='white'
                  background='#393E46'
                >
                  Close
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      )}
      <Box
        borderRadius={'10px'}
        boxShadow='0px 2px 20px rgba(0, 0, 0, 0.2)'
        px={['1.5rem', '2.25rem']}
        pt='1rem'
        pb='1.5rem'
        bg={cardBg}
        overflow={['auto']}
      >
        {launch?.stats && !isPastProject && (
          <GradientProgress
            label='Items minted'
            value={launch.stats.itemsRedeemedPercentage!}
            subLabel={`${launch.stats.itemsRedeemed} / ${launch.stats.itemsAvailable}`}
            height={'0.625rem'}
          />
        )}

        <Stack spacing={'2.25rem'} divider={<StackDivider />} mt='2.5rem'>
          {sortedMintingPeriods.map((mintingPeriod) => {
            const [mintAmount, setMintAmount] = React.useState(1)
            const [selectedCurrency, setSelectedCurrency] = React.useState({
              currency: 'SOL',
            })
            const solanaPaymentOption = mintingPeriod.paymentOptions.find(
              (opt) => opt.pricings[0].isSol
            )
            const [selectedPaymentOption, setSelectedPaymentOption] =
              React.useState(solanaPaymentOption)
            const handlePlusAmount = (plusValue: number) => {
              setMintAmount((value) => value + plusValue)
            }
            const priceDisplay = getDisplayForAllPricings(
              mintingPeriod.pricings
            )

            const [countdown, setCountdown] = useState<any>({})

            useInterval(() => {
              const wholeSeconds = differenceInSeconds(
                mintingPeriod.startAt!,
                new Date()
              )
              const hours = Math.floor(wholeSeconds / 3600)
              const minutes = Math.floor((wholeSeconds - hours * 3600) / 60)
              const seconds = Math.floor(
                wholeSeconds - (hours * 3600 + minutes * 60)
              )

              setCountdown({
                hours,
                minutes,
                seconds,
                wholeSeconds,
              })
            }, 1000)

            const toBeStarting =
              mintingPeriod.startAt.getTime() - new Date().getTime() > 0
            const hasEnded =
              mintingPeriod.endAt.getTime() - new Date().getTime() < 0
            const isSoldOut =
              (candyMachineRes?.value?.itemsRedeemed ?? 0) ===
              mintingPeriod.supplyAvailable
            const isActive = !toBeStarting && !hasEnded && !isSoldOut

            const whitelistSpotRes = useQuery(
              [mintingPeriod.id, wallet.publicKey, isActive, user.data?.id],
              async () => {
                try {
                  if (!isActive) return { error: 'Phase not active' }

                  if (!mintingPeriod.isWhitelist) return { success: true }

                  const res = await rpc.query('launch.hasWhitelistSpot', {
                    user: wallet.publicKey!.toBase58(),
                    projectId: mintingPeriod.projectId,
                    mintingPeriodId: mintingPeriod.id,
                  })
                  return {
                    whitelistSpot: res,
                    success: true,
                  }
                } catch (err: any) {
                  console.log('No whitelist spot found, err=', err)
                  return {
                    error: err.message,
                  }
                }
              }
            )

            mintingPeriod.paymentOptions.sort((paymentOptA, paymentOptB) => {
              return paymentOptA.pricings[0].currency >
                paymentOptB.pricings[0].currency
                ? 1
                : paymentOptB.pricings[0].currency >
                  paymentOptA.pricings[0].currency
                ? -1
                : 0
            })

            const mintPriceRes = useAsync(async () => {
              if (selectedCurrency.currency === 'PUFF') {
                return (
                  mintingPeriod.totalPriceInSol /
                  (await getPriceInSol('PUFF/USDC'))
                )
              } else if (selectedCurrency.currency === 'ALL') {
                return (
                  mintingPeriod.totalPriceInSol /
                  (await getDexlabPrice('ALL/SOL'))
                )
              }
              return mintingPeriod.totalPriceInSol
            }, [selectedCurrency.currency])

            return (
              <Stack key={mintingPeriod.id} spacing={'1.5rem'}>
                <HStack key={mintingPeriod.id} justifyContent={'space-between'}>
                  <Text fontSize={['1.25rem', '1.5rem']} fontWeight={600}>
                    {mintingPeriod.periodName}
                  </Text>
                  {isActive && (
                    <Box
                      borderRadius={'5px'}
                      bg='#E7EEDD'
                      px={2}
                      py={0.5}
                      display='flex'
                    >
                      <Text color='#152F33' fontSize={['.75rem', '.875rem']}>
                        open
                      </Text>
                    </Box>
                  )}
                  {toBeStarting && (
                    <Box
                      borderRadius={'5px'}
                      bg='#f3e0bf'
                      px={2}
                      py={0.5}
                      display='flex'
                    >
                      <Text color='#4e3110' fontSize={['.75rem', '.875rem']}>
                        starting soon
                      </Text>
                    </Box>
                  )}
                  {isSoldOut && (
                    <Box
                      borderRadius={'5px'}
                      bg='#FFDCDC'
                      px={2}
                      py={0.5}
                      display='flex'
                    >
                      <Text color='#DC1616' fontSize={['.75rem', '.875rem']}>
                        sold out
                      </Text>
                    </Box>
                  )}
                  {hasEnded && (
                    <Box
                      borderRadius={'5px'}
                      bg='#FFDCDC'
                      px={2}
                      py={0.5}
                      display='flex'
                    >
                      <Text color='#DC1616' fontSize={['.75rem', '.875rem']}>
                        closed
                      </Text>
                    </Box>
                  )}
                </HStack>
                <HStack justifyContent={'space-evenly'}>
                  <LabelTitle
                    title={mintingPeriod.startAt.toLocaleDateString()}
                    label='Local Mint Date'
                  ></LabelTitle>
                  <LabelTitle
                    title={mintingPeriod.startAt.toLocaleTimeString()}
                    label='Local Mint Time'
                  ></LabelTitle>
                  {/* {mintingPeriod.supplyAvailable <
                    (launch?.totalSupply ?? 0) && (
                    <LabelTitle
                      title={mintingPeriod.supplyAvailable.toString()}
                      label='Supply'
                    ></LabelTitle>
                  )} */}
                </HStack>
                <HStack justifyContent={'space-evenly'}>
                  {mintingPeriod.paymentOptions?.length && (
                    <Stack alignItems={'center'}>
                      <Text
                        fontSize='.75rem'
                        color='#636363'
                        fontWeight={500}
                        textAlign='center'
                      >
                        Choose Currency
                      </Text>
                      <HStack>
                        {mintingPeriod.paymentOptions.map((paymentOption) => {
                          const mainPricing = paymentOption.pricings.find(
                            (pricing) => pricing.id
                          )
                          if (!mainPricing) return
                          return (
                            <Button
                              key={paymentOption.id}
                              rounded={'md'}
                              px={1}
                              py={0.5}
                              fontSize='1rem'
                              height='2rem'
                              onClick={() => {
                                setSelectedCurrency(mainPricing)
                                setSelectedPaymentOption(paymentOption)
                              }}
                              color={
                                selectedCurrency.currency ===
                                mainPricing.currency
                                  ? fontColor
                                  : '#888888'
                              }
                              border={
                                selectedCurrency.currency ===
                                mainPricing.currency
                                  ? `2px solid ${fontColor}`
                                  : 'none'
                              }
                            >
                              {mainPricing.currency}
                            </Button>
                          )
                        })}
                      </HStack>
                    </Stack>
                  )}

                  {launch.projectUrlIdentifier === 'mary_janes' &&
                  mintingPeriod.isWhitelist ? (
                    <HStack justifyContent={'center'}>
                      <LabelTitle
                        title={`0.69 SOL + $ALL`}
                        label='Mint Price'
                      ></LabelTitle>
                    </HStack>
                  ) : (
                    <LabelTitle
                      title={
                        (selectedCurrency.currency === 'SOL'
                          ? mintingPeriod.totalPriceInSol.toString()
                          : mintPriceRes.loading
                          ? '...'
                          : mintPriceRes.value?.toFixed(2)) +
                        ' ' +
                        selectedCurrency.currency
                      }
                      label='Mint Price'
                    ></LabelTitle>
                  )}
                </HStack>

                {countdown.wholeSeconds > 0 && toBeStarting && (
                  <HStack>
                    <Grid
                      templateColumns={'repeat(3, 1fr)'}
                      width={['80%', '50%']}
                      maxW='12rem'
                      mx='auto'
                    >
                      <GridItem>
                        <LabelTitle
                          title={countdown.hours}
                          label='Hours'
                          titleSize='md'
                        ></LabelTitle>
                      </GridItem>
                      <GridItem>
                        <LabelTitle
                          title={countdown.minutes}
                          label='Minutes'
                          titleSize='md'
                        ></LabelTitle>
                      </GridItem>
                      <GridItem>
                        <LabelTitle
                          title={countdown.seconds}
                          label='Seconds'
                          titleSize='md'
                        ></LabelTitle>
                      </GridItem>
                    </Grid>
                  </HStack>
                )}

                {false && (isActive || toBeStarting) && (
                  <Stack spacing={1}>
                    <Text
                      fontSize={['14px']}
                      lineHeight={['21px']}
                      color='#636363'
                      fontWeight={500}
                      textAlign='center'
                    >
                      Mint Amount
                    </Text>
                    <HStack justifyContent={'center'} spacing={3}>
                      <Button
                        onClick={() => handlePlusAmount(-1)}
                        color='#393E46'
                        border='unset'
                        width='2rem'
                        minW='2rem'
                        height='2rem'
                        px={0}
                        disabled={mintAmount === 0}
                      >
                        -
                      </Button>
                      <Text fontWeight={600}>{mintAmount}</Text>
                      <Button
                        onClick={() => handlePlusAmount(1)}
                        color='#393E46'
                        border='unset'
                        width='2rem'
                        minW='2rem'
                        height='2rem'
                        px={0}
                        disabled={mintAmount === mintingPeriod.maxPerWallet}
                      >
                        +
                      </Button>
                    </HStack>
                  </Stack>
                )}
                {isActive &&
                  toBeStarting &&
                  !wallet.publicKey &&
                  !wallet.signTransaction && (
                    <Box display='flex' width='100%' justifyContent={'center'}>
                      <WalletMultiButton style={{ background: '#393E46' }}>
                        Connect Wallet
                      </WalletMultiButton>
                    </Box>
                  )}
                {isActive &&
                  wallet.publicKey &&
                  whitelistSpotRes.data?.success && (
                    <GradientButton
                      bgGradient={
                        'linear-gradient(91.55deg, #ECBF4D 8.69%, #ED5647 101.31%)'
                      }
                      backgroundColor='linear-gradient(91.55deg, #ECBF4D 8.69%, #ED5647 101.31%)'
                      color='white'
                      rounded='md'
                      onClick={async (e) => {
                        setOverlayCardIsActive(true)
                        const res = await mint(
                          launch.id,
                          selectedPaymentOption?.id ??
                            solanaPaymentOption?.id ??
                            '',
                          mintingPeriod.id!
                        )

                        if (res?.instantClose) {
                          setOverlayCardIsActive(false)
                        }
                      }}
                      isLoading={mintRes.loading}
                      disabled={!isActive}
                    >
                      Mint NFT
                    </GradientButton>
                  )}

                {isActive && wallet.publicKey && whitelistSpotRes.data?.error && (
                  <GradientButton
                    bgGradient={
                      'linear-gradient(91.55deg, #ECBF4D 8.69%, #ED5647 101.31%)'
                    }
                    backgroundColor='linear-gradient(91.55deg, #ECBF4D 8.69%, #ED5647 101.31%)'
                    color='white'
                    rounded='md'
                    disabled={true}
                  >
                    No whitelist spot found
                  </GradientButton>
                )}

                {isActive && !wallet.publicKey && (
                  <GradientButton
                    bgGradient={
                      'linear-gradient(91.55deg, #ECBF4D 8.69%, #ED5647 101.31%)'
                    }
                    backgroundColor='linear-gradient(91.55deg, #ECBF4D 8.69%, #ED5647 101.31%)'
                    color='white'
                    rounded='md'
                    onClick={async (e) => {
                      setVisible(true)
                    }}
                    disabled={!isActive}
                  >
                    Connect your wallet first
                  </GradientButton>
                )}

                {hasEnded && (
                  <Text
                    textAlign={'center'}
                    fontSize={'.75rem'}
                    fontWeight={600}
                    color='#888888'
                    pt={'.625rem'}
                  >
                    Ended on{' '}
                    {`${mintingPeriod.endAt.toLocaleDateString()} ${mintingPeriod.endAt.toLocaleTimeString()}`}
                  </Text>
                )}
              </Stack>
            )
          })}
        </Stack>
      </Box>
    </>
  )
}
