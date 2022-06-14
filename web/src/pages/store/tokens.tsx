import { Container, Box } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import dynamic from 'next/dynamic'
import { WalletBalanceProvider } from '../../utils/useWalletBalance'
import MerchNavbar from '../../modules/merch/components/Navbar'
import MerchFooter from '../../modules/merch/components/Footer'
import MerchFAQ from '../../modules/merch/components/FAQ'
import MerchTokenSwap from '../../modules/merch/components/TokenSwap'
import MerchOrder from '../../modules/merch/components/MerchOrder'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const MerchTokens = () => {
  const [step, setStep] = React.useState<'select' | 'checkout'>('select')

  const renderContent = React.useCallback(() => {
    if (step === 'select') {
      return (
        <MerchTokenSwap
          onClickCheckout={() => {
            setStep('checkout')
            window.scrollTo(0, 0)
          }}
        />
      )
    }
    return <MerchOrder />
  }, [step])

  return (
    <Box>
      <MerchNavbar colorTheme='white'></MerchNavbar>

      <Container
        w='100vw'
        maxW='100vw'
        pr='0'
        pl='0'
        background='white'
        pos='relative'
      >
        {renderContent()}
      </Container>
      <MerchFAQ />
      <MerchFooter theme='light'></MerchFooter>
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
        <MerchTokens />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
