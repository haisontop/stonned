import React from 'react'
import dynamic from 'next/dynamic'
import { WalletBalanceProvider } from '../../utils/useWalletBalance'
import RaffleOverviewPage from '../../modules/raffle/RaffleOverviewPage'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const WalletConnectionProvider = dynamic(
  () => import('../../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function Raffle() {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <RaffleOverviewPage />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
