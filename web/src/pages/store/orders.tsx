import { Container, Box } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import dynamic from 'next/dynamic'
import { WalletBalanceProvider } from '../../utils/useWalletBalance'
import MerchNavbar from '../../modules/merch/components/Navbar'
import MerchFooter from '../../modules/merch/components/Footer'
import MerchFAQ from '../../modules/merch/components/FAQ'
import Orders from '../../modules/merch/components/MerchPlacedOrders'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

const MerchOrders = () => {
  const [step, setStep] = React.useState<'select' | 'checkout'>('select')

  const renderContent = React.useCallback(() => {
    return <Orders />
  }, [step])

  return (
    <Box>
      <Head>
        <link rel='shortcut icon' href='/images/logo1.png' />
        <title>Stoned Ape Crew | Exclusive NFTs on SOL</title>
        <meta
          property='og:title'
          content='Stoned Ape Crew | Ape NFTs on SOL'
          key='title'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='description'
          content='Stoned Ape Crew Is An Exclusive,
          Genesis Collection Of 4200 Ape NFTs On 
          Solana With 4 Roles In The Crew. 
          The Project Brings A New Approach To The Solana Ecosystem,
            Allowing Staking For Daily Rewards Of Our Utility Token $PUFF,
            An Evolution Game Of Transforming Your Apes With Token Burning Mechanics
              And Real World Utility Like Access To Exclusive Community Partys, Hangouts,
              And Stoner Merch Like Our Own Weed Strain Offering More Than Just Your Typical PFP.
                In Operation By A Top Team Of Web3 Developers, Artists,
                NFT Collectors, Community Builders, And Designers.'
        />
        <meta
          property='og:description'
          content='Stoned Ape Crew Is An Exclusive,
          Genesis Collection Of 4200 Ape NFTs On 
          Solana With 4 Roles In The Crew. 
          The Project Brings A New Approach To The Solana Ecosystem,
            Allowing Staking For Daily Rewards Of Our Utility Token $PUFF,
            An Evolution Game Of Transforming Your Apes With Token Burning Mechanics
              And Real World Utility Like Access To Exclusive Community Partys, Hangouts,
              And Stoner Merch Like Our Own Weed Strain Offering More Than Just Your Typical PFP.
                In Operation By A Top Team Of Web3 Developers, Artists,
                NFT Collectors, Community Builders, And Designers.'
        />
        <meta property='image' content='/image/meta-image.jpeg' />
        <meta property='twitter:card' content='summary_large_image' />
        <meta
          property='twitter:title'
          content=' Stoned Ape Crew | Ape NFTs on SOL'
        />
        <meta
          property='twitter:description'
          content='Stoned Ape Crew Is An Exclusive,
            Genesis Collection Of 4200 Ape NFTs On 
            Solana With 4 Roles In The Crew. 
            The Project Brings A New Approach To The Solana Ecosystem,
            Allowing Staking For Daily Rewards Of Our Utility Token $PUFF,
            An Evolution Game Of Transforming Your Apes With Token Burning Mechanics
            And Real World Utility Like Access To Exclusive Community Partys, Hangouts,
            And Stoner Merch Like Our Own Weed Strain Offering More Than Just Your Typical PFP.
            In Operation By A Top Team Of Web3 Developers, Artists,
            NFT Collectors, Community Builders, And Designers.'
        />
        <meta property='twitter:image' content='/image/meta-image.jpeg' />
      </Head>
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
        <MerchOrders />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
