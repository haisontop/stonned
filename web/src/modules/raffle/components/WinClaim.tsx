import {
  Box,
  Button,
  Container,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import { useAsyncFn } from 'react-use'
import { GradientButton } from '../../../components/GradientButton'
import { connection } from '../../../config/config'
import rpc from '../../../utils/rpc'
import { handleTransaction } from '../../../utils/solUtils'
import { useActiveLottery, useLottery, useUserPrices } from '../lotteryHooks'
import { getUserPrices, Lottery } from '../lotteryUtils'
import LotteryHalfRadiusTokenItem from './LotteryHalfRadiusTokenItem'

export default function WinClaim({}: {}) {
  const wallet = useWallet()

  const router = useRouter()
  const slug = router.query.slug

  const lotteryRes = useLottery(slug)

  const lottery = lotteryRes.data

  const userPricesRes = useUserPrices()
  const { data: userPrices } = userPricesRes

  const [claimPriceRes, claimPrice] = useAsyncFn(
    async (ticket: number) => {
      if (!wallet.publicKey || !wallet.signTransaction || !lottery) return null

      try {
        const res = await rpc.mutation('raffle.claimPrice', {
          lottery: lottery.publicKey.toBase58(),
          user: wallet.publicKey.toBase58(),
          ticket,
        })

        const transaction = Transaction.from(Buffer.from((res as any).trans))

        await wallet.signTransaction(transaction)

        const serial = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })

        const tx = await connection.sendRawTransaction(serial)

        await connection.confirmTransaction(tx, 'finalized')

        lotteryRes.refetch()

        toast.success(`price claimed`)
      } catch (e: any) {
        console.error('error in claiming price', e)

        if (e.message.includes('0x12e')) {
          toast.error('You sent the wrong ticket.')
        } else toast.error(e.message)
      }
    },
    [wallet, lottery]
  )

  return (
    <Container
      justifyContent={'center'}
      backgroundImage='linear-gradient(180deg, rgba(0, 0, 0, 0.5) -13.94%, rgba(0, 0, 0, 0.1) 100%)'
      border='6px solid #66EDFF'
      borderRadius={'8px'}
      boxShadow='0px 4px 20px rgba(0, 0, 0, 0.1)'
      py={[4]}
      maxW='container.xl'
      mb='1rem'
    >
      <Stack
        spacing={[2, 4, 6]}
        justifyContent='center'
        alignItems={'center'}
        border='1px dashed #EBA0E0'
        py={4}
      >
        <Text
          textAlign={'center'}
          fontSize={['1rem', '1.5rem', '1.75rem']}
          fontWeight={700}
          bgGradient={`linear(to-l, #FF1C97, #FFBB52 60%)`}
          bgClip='text'
        >
          Congratulations
        </Text>
        <HStack>
          <Text
            color='white'
            textAlign={'center'}
            fontSize={['48px', '56px', '64px']}
            lineHeight={['52px', '60px', '78px']}
            fontWeight={700}
          >
            YOU WON!
          </Text>
          <Image src='/images/lottery/star-struck.png' />
        </HStack>

        <Stack textAlign={'center'} alignItems='center'>
          <Text
            color='#fff'
            fontSize={[16, 20, 24]}
            lineHeight={['24px', '30px', '36px']}
            fontWeight={600}
            border='2px solid white'
            boxShadow='0px 0px 15px rgba(255, 238, 206, 0.8)'
            borderRadius={'10px'}
            width='fit-content'
            px={6}
            py={1}
          >
            {userPrices?.length} Wins
          </Text>
        </Stack>
        <Stack width={'100%'}>
          <SimpleGrid
            columnGap={[1, 1]}
            columns={[1, 2, 3]}
            rowGap={[8]}
            width='100%'
            mt={[4, 6, 8]}
          >
            {userPrices?.map((p, i) => (
              <LotteryHalfRadiusTokenItem
                key={i}
                tokenImageURL={p.image}
                tokenName={p.name}
                valueLabel=''
                width={[200, 300, 250, 320]}
                height={[200, 300, 250, 320]}
                onClaim={(e) => claimPrice(p.winningTicket!)}
                loading={claimPriceRes.loading}
                alreadyClaimed={p.priceSent}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Container>
  )
}
