import { Box } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import MerchCurrentDrop from '../../../modules/merch/components/MerchCurrentDrop'
import MerchDropContextProvider from '../../../modules/merch/MerchDropContextProvider'
import { WalletBalanceProvider } from '../../../utils/useWalletBalance'

const MerchDrop = () => {
  return (
    <Box>
      <MerchDropContextProvider>
        <MerchCurrentDrop />
      </MerchDropContextProvider>
    </Box>
  )
}

const WalletConnectionProvider = dynamic(
  () => import('../../../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function HOC() {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <MerchDrop />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}