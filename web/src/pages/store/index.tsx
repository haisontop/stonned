import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { WalletBalanceProvider } from '../../utils/useWalletBalance'
import MerchDropContextProvider from '../../modules/merch/MerchDropContextProvider'
import MerchCurrentDrop from '../../modules/merch/components/MerchCurrentDrop'
import { useRouter } from 'next/router'
import CurrentDrops from '../../modules/merch/components/CurrentDrops'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const MerchDrop = () => {
  return (
    <Box>
      <MerchDropContextProvider>
        <CurrentDrops />
      </MerchDropContextProvider>
    </Box>
  )
}

const WalletConnectionProvider = dynamic(
  () => import('../../components/WalletConnectionProvider'),
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
