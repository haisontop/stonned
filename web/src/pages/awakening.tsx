import React, { useContext } from 'react'
import { Box } from '@chakra-ui/react'
import { MainLayout } from '../layouts/MainLayout'
import Awakening from '../modules/awakening/Awakening'
import AwakeningContextProvider from '../modules/awakening/AwakeningProvider'
import AwakeningTest from '../modules/awakening/components/AwakeningTest'
import dynamic from 'next/dynamic'
import { WalletBalanceProvider } from '../utils/useWalletBalance'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const HolderDashBoardAwaking = () => {
  return (
    <MainLayout
      navbar={{
        colorTheme: 'dark',
        showWallet: true,
        bgTransparent: true,
      }}
    >
      <Box overflow={'hidden'} paddingTop='4rem' background={'#000'}>
        <Awakening></Awakening>
      </Box>
    </MainLayout>
  )
}

const WalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function () {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <AwakeningContextProvider>
          <HolderDashBoardAwaking />
        </AwakeningContextProvider>
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
