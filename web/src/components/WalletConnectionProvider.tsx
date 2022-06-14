import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
  getTorusWallet,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import dynamic from 'next/dynamic'
import React, { FC, useMemo } from 'react'
import config from '../config/config'

const wallets = [
  getPhantomWallet({ pollCount: 0 }),
  getSlopeWallet(),
  getSolflareWallet(),
  getTorusWallet({
    options: {
      clientId: 'CLIENT_ID',
    },
  }),
  getLedgerWallet(),
  getSolletWallet(),
  getSolletExtensionWallet(),
]

export const WalletConnectionProvider: FC = ({ children }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const rpcUrl = config.rpcHost

  const endpoint = useMemo(() => rpcUrl, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletConnectionProvider
