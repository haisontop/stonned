import { Box, Flex, Grid, Link, Spinner, Stack, Text } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect } from 'react'
import { useAsync } from 'react-use'
import { trpc } from '../../../utils/trpc'
import OrderBox from './OrderBox'

export default function Orders() {
  const wallet = useWallet()

  const pubKey = wallet?.publicKey?.toBase58() ?? 'abc'

  const ordersRes = trpc.useQuery(['merch.getOrders', { user: pubKey }])

  useEffect(() => {
    if (!wallet.publicKey) return

    ordersRes.refetch()
  }, [wallet])

  const order =
    ordersRes.data && ordersRes.data?.length > 0 ? ordersRes.data[0] : undefined

  return (
    <Stack spacing={10} alignItems='center' width='100%'>
      <Box mt={20}>
        <Text
          fontSize={[48]}
          lineHeight={['58px']}
          fontWeight={600}
          fontFamily='Montserrat'
        >
          YOUR ORDERS
        </Text>
      </Box>

      {!wallet.publicKey && (
        <Box>Please connect your wallet first to see your orders.</Box>
      )}

      <Stack spacing={6} display='flex' alignItems={'center'}>
        {order && (
          <Stack alignSelf={'flex-start'}>
            <Flex>
              <Text fontWeight={500}>Status:</Text>&nbsp;
              <Text color='#A0A0A0' fontWeight={500}>
                {order?.status}
              </Text>
            </Flex>

            <Flex>
              <Text fontWeight={500}>Shipping Link:</Text>&nbsp;
              <Text color='#A0A0A0' fontWeight={500}>
                {order.shippingLink ? (
                  <Link href={order.shippingLink} target='_blank'>
                    {order.shippingLink}
                  </Link>
                ) : (
                  'not shipped yet'
                )}
              </Text>
            </Flex>
          </Stack>
        )}
        {ordersRes.isLoading && <Spinner />}
        {ordersRes.data && (
          <Grid
            templateColumns={[
              'repeat(1, 1fr)',
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
            ]}
            gap={12}
            justifyContent='center'
          >
            {ordersRes?.data?.map((order) =>
              order.products.map((product) => (
                <OrderBox
                  name={product.name}
                  description={product.description}
                  image={product.image}
                />
              ))
            )}
          </Grid>
        )}
      </Stack>
    </Stack>
  )
}
