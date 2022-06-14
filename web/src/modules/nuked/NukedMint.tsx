import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Transaction } from '@solana/web3.js'
import dynamic from 'next/dynamic'
import React, { useMemo, useState } from 'react'
import Countdown from 'react-countdown'
import toast from 'react-hot-toast'
import { useAsync, useAsyncFn, useAsyncRetry, useInterval } from 'react-use'
import { GradientButton } from '../../components/GradientButton'
import { connection, isNukedWhitelistSale, nuked } from '../../config/config'
import { getTokenAccount } from '../../utils/solUtils'
import { trpc } from '../../utils/trpc'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../../utils/useWalletBalance'
import { getNukedMintNfts, getNukedPrice } from './nukedUtils'

const whitelistStarting = 1645295200 // 1645286160

function NukedMint() {
  const wallet = useWallet()
  const { connected } = wallet
  const [balance] = useWalletBalance()

  const mintMutation = trpc.useMutation('nuked.mint', {})

  const nukedPrice = useMemo(() => getNukedPrice(), [])

  const availableCount = useAsync(async () => {
    return (await getNukedMintNfts()).length
  }, [])

  const [isSaleOpen, setSaleOpen] = useState(
    new Date().getTime() > whitelistStarting * 1000
  )
  const whitelistStart = new Date(whitelistStarting)

  const { value: whitelistSpot, retry: whitelistReload } =
    useAsyncRetry(async () => {
      if (!wallet.connected) return 0

      const whitelistTokenAccount = await getTokenAccount(
        connection,
        nuked.whiteListToken,
        wallet.publicKey!
      )

      console.log('whitelistTokenAccount', whitelistTokenAccount)

      return (
        whitelistTokenAccount?.account.data.parsed.info.tokenAmount.uiAmount ??
        0
      )
    }, [wallet])

  const [startMintRes, startMint] = useAsyncFn(async () => {
    if (!wallet.signTransaction) return null

    const res = await mintMutation.mutateAsync({
      user: wallet.publicKey!.toBase58(),
    })
    const transaction = Transaction.from(Buffer.from((res as any).trans))

    await wallet.signTransaction(transaction)
    whitelistReload()

    const serial = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
    })

    try {
      const tx = await connection.sendRawTransaction(serial)

      await connection.confirmTransaction(tx, 'confirmed')

      toast.success('succesfully minted ape')
    } catch (e: any) {
      toast.error(e.message)
      console.error('error on rent out ape', e)
    }
  }, [wallet])

  return (
    <Container pos='relative' maxWidth='unset' bg='#F5F5F7' id='getone'>
      <Container maxWidth='110ch'>
        <SimpleGrid columns={[1, 1, 2]}>
          <Box textAlign='center'>
            <Image
              display='inline-block'
              src='/images/sacdragon-min.png'
              alt='SAC Dragon'
              width='50vw'
              minHeight={['unset', '50vh']}
            />
          </Box>
          <Box height='100%' display='flex' alignItems={'center'} p={3}>
            <Box width='100%'>
              <Heading
                textAlign='center'
                fontWeight={800}
                fontSize='4xl'
                color='black'
                mb='1rem'
              >
                GET A NUKED APE
              </Heading>

              <Heading
                textAlign='center'
                fontWeight={500}
                fontSize='xl'
                color='black'
                mb='2rem'
              >
                {!isSaleOpen
                  ? 'Early Access In'
                  : isNukedWhitelistSale
                  ? 'Whitelist Sale'
                  : 'Dutch Auction'}
              </Heading>

              {!isSaleOpen ? (
                <Heading size='lg' color='gray.700' textAlign='center'>
                  <Countdown
                    daysInHours={true}
                    date={whitelistStarting * 1000}
                    onComplete={() => setSaleOpen(true)}
                  />
                </Heading>
              ) : (
                ''
              )}

              {isSaleOpen ? (
                <>
                  <Flex textAlign='center' alignItems='center' justifyContent='center'>
                    <WalletMultiButton />
                  </Flex>
                  <Stack
                    d='flex'
                    direction={['column', 'row']}
                    spacing={6}
                    justifyContent='center'
                    p='6'
                  >
                    <Box
                      shadow='lg'
                      rounded='lg'
                      p={1}
                      boxShadow='inset 0px 4px 56px rgba(255, 255, 255, 0.18)'
                      backdropFilter='blur(22px)'
                      d='flex'
                      justifyContent={'center'}
                      bg='white'
                    >
                      <Box d='flex' alignItems='center' justifyContent={'center'}>
                        <Text p='1'>Balance: </Text>
                        <Text pl='1' fontWeight='bold'>
                          {balance.toFixed(2)}{' '}
                        </Text>

                        <Text
                          pr='2'
                          pl='1'
                          fontWeight='bold'
                          textDecor='transparent'
                          bgClip='text'
                          style={{
                            backgroundImage: `linear-gradient(to bottom right, #00FFA3, #03E1FF, #DC1FFF)`,
                          }}
                        >
                          {' '}
                          SOL
                        </Text>
                      </Box>
                    </Box>
                    <Box d='flex' alignItems='center' justifyContent={'right'} rounded='lg' bg='white' padding=''>
                      <Text p='1'>Price: </Text>
                      <Text pl='1' fontWeight='bold'>
                        {nukedPrice.toFixed(2)}{' '}
                      </Text>
                      <Text
                        pr='2'
                        pl='1'
                        fontWeight='bold'
                        textDecor='transparent'
                        bgClip='text'
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, #00FFA3, #03E1FF, #DC1FFF)`,
                        }}
                      >
                        {' '}
                        SOL
                      </Text>
                    </Box>
                  </Stack>

                  <Box d='flex' alignItems='center' justifyContent={'center'}>
                    <Text p='1'>Available: </Text>
                    <Text pl='1' fontWeight='bold'>
                      {availableCount.value}/420
                    </Text>
                  </Box>

                  <Stack
                    spacing='1rem'
                    justifyContent={'right'}
                    alignItems='center'
                  >
                    {isNukedWhitelistSale && (
                      <Text align='center' width='100%' color='textGreyDark'>
                        You have {whitelistSpot} whitelist spot
                      </Text>
                    )}
                    {(!isNukedWhitelistSale || whitelistSpot) && (
                      <GradientButton
                        mt='1rem'
                        rounded='full'
                        size={'lg'}
                        isFullWidth={false}
                        backgroundColor='white'
                        transition='ease-in-out all .2s'
                        onClick={(e) => {
                          startMint()
                        }}
                        isLoading={startMintRes.loading}
                        boxShadow='lg'
                        innerPadding='0 3rem'
                      >
                        Mint
                      </GradientButton>
                    )}
                  </Stack>
                </>
              ) : (
                ''
              )}
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Container>
  )
}

export default NukedMint
