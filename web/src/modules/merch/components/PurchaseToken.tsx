import {
  Button,
  ChakraProvider,
  Container,
  extendTheme,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { useContext, useMemo, useState } from 'react'
import { GradientButton } from '../../../components/GradientButton'
import { GradientText } from '../../../components/GradientText'
import rpc from '../../../utils/rpc'
import { MerchDropContext, MerchDropStatus } from '../MerchDropContextProvider'
import { AppRouter } from '../../../server/routers/router'
import { useWallet } from '@solana/wallet-adapter-react'
import { trpc } from '../../../utils/trpc'
import _ from 'lodash'
import { useAsyncFn } from 'react-use'
import { connection } from '../../../config/config'
import toast from 'react-hot-toast'
import { Transaction } from '@solana/web3.js'
import { useRouter } from 'next/router'
import { useProduct } from '../merchHooks'
import DropTitle from './DropTitle'

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {},
      variants: {
        solid: {
          borderRadius: '20px',
        },
      },
    },
  },
})

interface PurchaseTokenProps {}

export default function PurchaseToken(props: PurchaseTokenProps) {
  /*  const isMobile = useBreakpointValue([true, false]) */
  const wallet = useWallet()

  const product = useProduct()

  const { status } = useContext(MerchDropContext)
  const isSoldOut = status === MerchDropStatus.SOLD_OUT

  const router = useRouter()

  const [buyTokenRes, buyToken] = useAsyncFn(async () => {
    if (!wallet.signTransaction || !product.data || !wallet.publicKey)
      return null

    try {
      const res = await rpc.mutation('merch.mintCbProduct', {
        user: wallet.publicKey?.toBase58()!,
        productHref: product.data?.href,
      })
      const transaction = Transaction.from(Buffer.from((res as any).trans))

      await wallet.signTransaction(transaction)

      const serial = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
      })
      const tx = await connection.sendRawTransaction(serial)

      await connection.confirmTransaction(tx, 'confirmed')

      toast.success(`Minted ${product.data.name}`)

      window.open('/store/tokens')
    } catch (e: any) {
      if (e.message.includes('0x1')) {
        toast.error('You miss some tokens.')
      } else toast.error(e.message)
      console.error('error in minting SAC OG Box NFT', e)
    }
  }, [wallet, connection, product.data])

  return (
    <Container px={0} maxW={'xl'}>
      <Stack alignItems='center' spacing={4} mt={isSoldOut ? 6 : 0}>
        <SimpleGrid columns={[1, 1]} gap={[10]} mt={6} paddingX={'16px'}>
          {/* <Stack spacing={0}>
            <Text
              fontSize={[16]}
              lineHeight={['20px']}
              fontWeight={600}
              fontFamily='Montserrat'
              color='#A0A0A0'
            >
              Pieces left
            </Text>
            <Text
              fontSize={[36]}
              lineHeight={['40px']}
              fontWeight={600}
              fontFamily='Montserrat'
            >
              {remaingCount}/600
            </Text>
          </Stack> */}

          <Text fontWeight={500} color={'#000'} fontSize='1.5xl'>
            {product.data?.shortDescription}
          </Text>

          <Stack spacing={4} alignItems='center'>
            {/* <Text
              fontSize={[22]}
              lineHeight={['20px']}
              fontWeight={600}
              fontFamily='Montserrat'
              color='#A0A0A0'
            >
              Pricing
            </Text> */}
            <Text
              fontSize={[26]}
              lineHeight={['40px']}
              fontWeight={600}
              fontFamily='Montserrat'
            >
              {product.data?.pricing.sol.toFixed(2)} SOL +{' '}
              {/* {isMobile && <br />} */}
              {product.data?.pricing.puff.toFixed(2)} $PUFF
            </Text>
          </Stack>
        </SimpleGrid>

        {/* {buyTokenRes.loading && (
          <Text>
            This transaction may take up to 60 sec, due baked sysadmins &
            loading all staking accounts. Please don't close this window.{' '}
          </Text>
        )} */}

        {product.data && (
          <GradientButton
            backgroundColor='#FAFAFA'
            gradientDirection='left'
            variant='solid'
            disabled={
              !product.data || !product.data.amount || !wallet.publicKey
            }
            isLoading={buyTokenRes.loading}
            onClick={() => buyToken()}
          >
            {product.data && product.data.amount
              ? 'Purchase Token'
              : 'Sold Out'}
          </GradientButton>
        )}
        {/*  <Text fontWeight={500}>
          This purchase gets you an NFT that can later be used to swap for the
          real product.
        </Text> */}
        <Text
          pt={10}
          fontWeight={500}
          pb={'16px'}
          color={'#000'}
          fontSize='1.5xl'
        >
          {product.data?.description}
        </Text>
      </Stack>
    </Container>
  )
}
