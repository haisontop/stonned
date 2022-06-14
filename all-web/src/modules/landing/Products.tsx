import { Grid, GridItem } from '@chakra-ui/react'
import { AllCoinIcon } from './components/AllCoinIcon'
import { AllLaunchIcon } from './components/AllLaunchIcon'
import { AllStrategyIcon } from './components/AllStrategyIcon'
import { AllTechIcon } from './components/AllTechIcon'
import { ProductCard } from './components/ProductCard'
import { Product } from './types'

export const Products = () => {
  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 4fr)', sm: 'repeat(2,2fr)' }}
      gap={['2.5rem', '3rem', '4rem']}
      maxWidth='71rem'
    >
      {PRODUCTS.map((product) => {
        return (
          <GridItem key={product.id}>
            <ProductCard product={product} />
          </GridItem>
        )
      })}
    </Grid>
  )
}

const PRODUCTS: Product[] = [
  {
    id: 'product-launch',
    logo: <AllLaunchIcon />,
    desc: 'Solana NFT Launchpad for secure, smooth and social mints.',
    tags: [
      'No-Token Whitelist Solutions',
      'Rich Project Information',
      'Anti-Bot Mint',
      'Verified Mints',
      'Community Oriented',
      'Unverified Mints',
      'Marketing Push',
      'Free Mints',
    ],
    bg: 'linear-gradient(180deg, #ECBF4D 0%, #ED5647 100%), #EEEEEE',
    comingSoon: true,
  },
  {
    id: 'product-tech',
    logo: <AllTechIcon />,
    desc: 'A complete technology platform to create powerful NFT utilities.',
    tags: [
      'Holder verification',
      'Sales & Listings Bot',
      'Staking',
      'Airdrop System',
      'Breeding',
      'SPL Token System',
      'Evolution',
    ],
    bg: 'linear-gradient(180deg, #8D48DD 0%, #EC574D 100%), #EEEEEE',
    comingSoon: true,
  },
  {
    id: 'product-strategy',
    logo: <AllStrategyIcon />,
    desc: 'Strategy consulting to turn your idea into a successful NFT project.',
    tags: [
      'NFT Tokenomics',
      'Coin Tokenomics',
      'Marketing Launch Plan',
      'Industry Contacts',
      'DAO Structure',
      'Alpha Structure',
    ],
    bg: 'linear-gradient(180deg, #21BECE 0%, #0F91DA 100%), #EEEEEE',
    comingSoon: true,
  },
  {
    id: 'product-coin',
    logo: <AllCoinIcon />,
    desc: 'An ecosystem which unifies the best projects on Solana.',
    tags: [
      'Token with endless utilities',
      'Integrations all over Solana Ecosystem',
      'Ready Made Tokenomics',
      'Future Utilities through joining Projects',
      'Major Liquidity',
      'Staking from Day 1',
    ],
    bg: 'linear-gradient(144.21deg, #2B6FF8 5.32%, #820FB8 99.33%), #EEEEEE',
    comingSoon: true,
  },
]
