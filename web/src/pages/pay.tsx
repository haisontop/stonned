import {
  Box,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  NumberInput,
  NumberInputField,
  Container,
  Text,
  HStack,
  Button,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useInterval,
  Spinner,
} from '@chakra-ui/react'
import Header from '../components/Header'
import Footer from '../modules/puff/Footer'
import Hero from '../modules/puff/Hero'
import Links from '../modules/puff/Links'
import Tokenomics from '../modules/puff/Tokenomics'
import Features from '../modules/puff/Features'
import PuffStats from '../modules/puff/Stats'
import { MainLayout } from '../layouts/MainLayout'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import toast, { useToaster } from 'react-hot-toast'
import cuid from 'cuid'
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js'
import { getPuffPrice, getSolPrice } from '../utils/sacUtils'
import { findReference } from '@solana/pay'
import { CheckIcon } from '@chakra-ui/icons'

export const enum CURRENCY {
  puff = '$PUFF',
  sol = 'SOL',
  all = '$ALL',
}

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')

export default function Puff() {
  const format = (val: any) => `$` + val
  const parse = (val: any) => val.replace(/^\$/, '')

  const [value, setValue] = useState('0')
  const [referenceId, setReferenceId] = useState('')
  const [isPaymentConfirmed, setPaymentConfirmed] = useState(false)
  const [currency, setCurrency] = useState<CURRENCY>(CURRENCY.puff)
  const currencyOptions = [CURRENCY.puff, CURRENCY.sol]

  const [qrCodeVal, setQrCodeVal] = useState('')
  const [isPaymentActive, setPaymentActive] = useState(false)

  useInterval(async () => {
    if (isPaymentActive && referenceId) {
      try {
        const signatureInfo = await findReference(
          connection,
          new PublicKey(referenceId),
          { finality: 'confirmed' }
        )
        setPaymentConfirmed(true)
      } catch (err) {
        console.log('Transaction error, probably not finished', err)
      }
    } else {
      setPaymentConfirmed(false)
    }
  }, 2000)

  const startPayment = async () => {
    const val = Number(value)
    if (!isNaN(val) && val > 0 && currency) {
      const amount =
        currency === CURRENCY.sol
          ? await getSolPrice(val)
          : await getPuffPrice(val)
      const referenceId = Keypair.generate().publicKey
      setReferenceId(referenceId.toBase58())
      let qrCodeStr = `solana:DS3VezoyNWDoxZeugg1t597MuJ9gaJK6wZFTjMREDChx?amount=${amount.toFixed(
        6
      )}&reference=${referenceId.toBase58()}&label=StonedApeCrew`
      if (currency !== CURRENCY.sol) {
        qrCodeStr += '&spl-token=G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB'
      }
      setQrCodeVal(qrCodeStr)
      setPaymentActive(true)
    } else {
      toast.error('Amount or currency wrong')
    }
  }

  const newPayment = () => {
    setReferenceId('')
    setPaymentConfirmed(false)
    setPaymentActive(false)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isNaN(Number(value)) && currency) {
      }
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [value, currency])

  return (
    <MainLayout
      navbar={{
        colorTheme: 'white',
      }}
    >
      <Box>
        <Container
          w='100vw'
          maxW='100vw'
          minHeight='100vh'
          pr='0'
          pl='0'
          paddingInlineStart={0}
          paddingInlineEnd={0}
          bg=''
          pos='relative'
          pb={24}
          _before={{
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            bg: '#060014', //'#090909',
            opacity: '0.95',
            zIndex: -1,
          }}
        >
          <Box pt={32} display='flex' justifyContent={'center'}>
            <NumberInput
              width='300px'
              onChange={(valueString) => setValue(parse(valueString))}
              value={format(value)}
            >
              <NumberInputField backgroundColor={'white'} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
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
                    border={
                      currency === c ? '2px solid #fff' : '2px solid #888'
                    }
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
          {!isPaymentActive && (
            <Box paddingY={6} display='flex' justifyContent={'center'}>
              <Button onClick={() => startPayment()}>Start Payment</Button>
            </Box>
          )}
          {isPaymentActive && qrCodeVal && (
            <>
              <Box paddingY={6} display='flex' justifyContent={'center'}>
                <Button onClick={() => newPayment()}>New Payment</Button>
              </Box>
              <Box paddingY={6} display='flex' justifyContent={'center'}>
                <Box
                  borderRadius={16}
                  maxWidth='280px'
                  padding='12px'
                  background='white'
                >
                  <QRCode value={qrCodeVal} />
                </Box>
              </Box>
              <Box paddingY={6} display='flex' justifyContent={'center'}>
                {!isPaymentConfirmed && (
                  <Text color={'white'} display='flex' alignItems={'center'}>
                    <Spinner color='white'></Spinner> <Text ml={4} as="span">Searching for payment ...</Text>
                  </Text>
                )}
                {isPaymentConfirmed && (
                  <Text color={'white'} display='flex' alignItems={'center'}>
                    <CheckIcon color={'white'}></CheckIcon><Text ml={4} as="span">Payment successful!</Text>
                  </Text>
                )}
              </Box>
            </>
          )}
        </Container>
      </Box>
    </MainLayout>
  )
}

interface StatsCardProps {
  title: string
  stat: string
}
function StatsCard(props: StatsCardProps) {
  const { title, stat } = props
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
    >
      <StatLabel fontWeight={'medium'} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {stat}
      </StatNumber>
    </Stat>
  )
}
