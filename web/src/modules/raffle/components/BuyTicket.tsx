import {
  Box,
  BoxProps,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { motion } from 'framer-motion'
import { GradientButton } from '../../../components/GradientButton'
import { LabelText } from '../../../components/Texts/LabelText'
import useAsyncFn, { AsyncState } from 'react-use/lib/useAsyncFn'
import { getLotteryUser, getUserPrices, Lottery } from '../lotteryUtils'
import { useAsync } from 'react-use'
import { getPUFFSolprice, solToSpl } from '../../../utils/sacUtils'
import rpc from '../../../utils/rpc'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import config, { connection } from '../../../config/config'
import toast from 'react-hot-toast'
import { handleTransaction, pub } from '../../../utils/solUtils'
import { AsyncStateRetry } from 'react-use/lib/useAsyncRetry'
import { useQuery } from 'react-query'
import {
  useActiveLottery,
  useLottery,
  useLotteryUser,
  useLotteryUserForRaffle,
} from '../lotteryHooks'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { RaffleType } from '../type'

const spring = {
  type: 'linear',
  stiffness: '100',
}

const MotionBox = motion<BoxProps>(Box)

export const enum CURRENCY {
  puff = '$PUFF',
  sol = 'SOL',
  all = '$ALL',
}

export type BuyTicketProps = {
  raffle: RaffleType
}

export default function BuyTicket({ raffle }: BuyTicketProps) {
  const [ticketCount, setTicketCount] = React.useState(1)
  const wallet = useWallet()

  const lotteryUserRes = useLotteryUserForRaffle(raffle)
  const lotteryRes = useLottery(raffle.publicKey.toBase58())

  const currencyOptions = [CURRENCY.puff /* CURRENCY.all, CURRENCY.sol */]

  const [currency, setCurrency] = React.useState<CURRENCY>(currencyOptions[0])

  const [buyTicketRes, buyTicket] = useAsyncFn(async () => {
    if (!wallet.publicKey || !wallet.signTransaction || !lotteryRes.data) return

    try {
      const res = await rpc.mutation('raffle.buyTicket', {
        lottery: lotteryRes.data.publicKey.toBase58(),
        user: wallet.publicKey.toBase58(),
        payToken:
          currency === CURRENCY.puff
            ? config.puffToken
            : currency === CURRENCY.all
            ? config.allToken.toBase58()
            : null,
        ticketCount: ticketCount,
      })

      const transaction = Transaction.from(Buffer.from((res as any).trans))

      await wallet.signTransaction(transaction)

      const serial = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
      })
      const tx = await connection.sendRawTransaction(serial)

      /* await connection.confirmTransaction(tx) */

      await handleTransaction(tx, { showLogs: false, commitment: 'confirmed' })

      lotteryUserRes.refetch()
      lotteryRes.refetch()

      toast.success(`bought ticket`)
    } catch (e: any) {
      console.log(JSON.stringify(e, null, 3))
      if (e.logs && e.logs.find((log: string) => log.includes('0x131'))) {
        toast.error('You can buy a maximum of 100 tickets')
      } else if (e.message.includes('0x12d')) {
        toast.error('Raffle has ended')
      } else toast.error(e.message)
      console.error('error in buying tickets', e)
    }
  }, [lotteryRes.data, wallet, ticketCount, currency])

  const toggleSwitch = () =>
    setCurrency((currency) =>
      currency === CURRENCY.puff ? CURRENCY.sol : CURRENCY.puff
    )

  const addTicketCount = (plusValue: number) => {
    setTicketCount((current) => {
      const newCount = current + plusValue
      if (newCount < 1) return 1
      return newCount
    })
  }

  const ticketCostsRes = useAsync(async () => {
    if (!lotteryRes.data) return null
    return {
      [CURRENCY.puff]:
        (await solToSpl(
          lotteryRes.data.ticketPrice.toNumber(),
          pub(config.puffToken)
        )) / LAMPORTS_PER_SOL,
      [CURRENCY.sol]: lotteryRes.data.ticketPrice.toNumber() / LAMPORTS_PER_SOL,
      [CURRENCY.all]:
        (await solToSpl(
          lotteryRes.data.ticketPrice.toNumber(),
          config.allToken
        )) / LAMPORTS_PER_SOL,
    }
  }, [lotteryRes.data])

  const handleChangeTicketValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const re = /^[0-9\b]+$/

    // if value is not blank, then test the regex

    if (event.target.value === '' || re.test(event.target.value)) {
      setTicketCount(!!event.target.value ? parseInt(event.target.value) : 0)
    }
  }

  if (!lotteryRes.data) return null

  return (
    <Box color='white' mt='1rem'>
      <SimpleGrid columns={2} textAlign='center' spacingY={'1rem'}>
        <Box>
          <Text fontSize='.875rem'>
            <Text as='span' opacity='.7'>
              Ticket Price:{' '}
            </Text>
            {!ticketCostsRes.value ? (
              <Spinner color='white' />
            ) : (
              <Text as='span' opacity={'1'} fontSize='1rem' fontWeight='600'>
                {ticketCostsRes.value[currency].toFixed(2)} {currency}
              </Text>
            )}
          </Text>
        </Box>
        <Box>
          <Text fontSize='.875rem'>
            <Text as='span' opacity='.7'>
              Tickets Sold:{' '}
            </Text>
            {!lotteryRes.data ? (
              <Spinner color='white' />
            ) : (
              <Text as='span' opacity={'1'} fontSize='1rem' fontWeight='600'>
                {lotteryRes.data.ticketCount}
              </Text>
            )}
          </Text>
        </Box>
        <Box>
          <Text fontSize='.875rem' opacity='.7'>
            Choose Currency
          </Text>
          <HStack justifyContent='center' mt='.5rem'>
            {currencyOptions.map((c) => {
              return (
                <Button
                  key={c}
                  rounded={'md'}
                  px={1}
                  py={0.5}
                  fontSize='1rem'
                  height='2rem'
                  onClick={() => {
                    setCurrency(c)
                  }}
                  bg={currency === c ? 'rgba(0,0,0,0.33)' : 'transparent'}
                  color={currency === c ? '#fff' : '#888'}
                  border={currency === c ? '2px solid #fff' : '2px solid #888'}
                  _hover={{
                    bg: 'rgba(0,0,0,0.33)',
                    color: '#fff',
                  }}
                >
                  {c}
                </Button>
              )
            })}
          </HStack>
        </Box>
        <Box>
          <Text fontSize='.875rem' opacity='.7'>
            Choose Amount
          </Text>
          <HStack spacing={'.5rem'} justifyContent='center'>
            <Button
              onClick={() => addTicketCount(-1)}
              background='transparent'
              color='#fff'
              border='unset'
              _hover={{
                textShadow: '0px 0px 20px rgba(255, 238, 206, 0.8)',
              }}
            >
              -
            </Button>
            <Input
              w='2rem'
              htmlSize={2}
              textAlign='center'
              background='transparent'
              size='md'
              color='#fff'
              fontSize='1.4rem'
              p={0}
              fontWeight={600}
              value={ticketCount}
              onChange={handleChangeTicketValue}
              border='unset'
              _focus={{
                border: 'unset',
                boxShadow: 'unset',
              }}
            ></Input>

            <Button
              onClick={() => addTicketCount(1)}
              background='transparent'
              color='#fff'
              border='unset'
              _hover={{
                textShadow: '0px 0px 20px rgba(255, 238, 206, 0.8)',
              }}
            >
              +
            </Button>
          </HStack>

          {/* <HStack justifyContent='center'>
          <Button
            //onClick={() => addTicketCount(10)}
            background='linear-gradient(91.57deg, #EA9FF1 2.39%, #F87AE5 98.68%), #FFFFFF'
            boxShadow='inset -6px 6px 10px rgba(255, 255, 255, 0.2), inset 6px -6px 10px rgba(0, 0, 0, 0.2);'
            border='none'
            color='white'
            width='60px'
            height='60px'
            transition='all .15s ease-in-out'
            _hover={{
              bg: '#FFC1F6',
            }}
          >
            +10
          </Button>
        </HStack> */}
        </Box>
      </SimpleGrid>

      {!wallet.connected && (
        <Box mt='2rem'>
          <Text
            textAlign='center'
            color='white'
            opacity='.7'
            fontSize='.875rem'
            mb='.5rem'
          >
            Connect your wallet to buy tickets.
          </Text>
        </Box>
      )}
      {wallet.connected && lotteryRes.data && (
        <>
          <Box textAlign='center' mt='1rem'>
            <Text fontSize='.875rem'>
              <Text as='span' opacity='.7'>
                Total Price:{' '}
              </Text>
              {!ticketCostsRes.value ? (
                <Spinner color='white' />
              ) : (
                <Text as='span' opacity={'1'} fontSize='1rem' fontWeight='600'>
                  {(ticketCostsRes.value[currency] * ticketCount).toFixed(2)}{' '}
                  {currency}
                </Text>
              )}
            </Text>
          </Box>
          <Box textAlign='center' mt='1rem'>
            <GradientButton
              isLoading={buyTicketRes.loading}
              onClick={buyTicket}
              variant='solid'
              theme='lottery'
              gradientDirection='left'
              boxShadow='inset -6px 6px 10px rgba(255, 255, 255, 0.2), inset 6px -6px 10px rgba(0, 0, 0, 0.2);'
              disabled={!wallet.connected}
            >
              Buy Tickets
            </GradientButton>
          </Box>
        </>
      )}
    </Box>
  )
}
