import { PublicKey } from '@solana/web3.js'
import { ENV } from '../../config/config'
import { pub } from '../../utils/solUtils'
import { Box, Stack, Text } from '@chakra-ui/react'

const configPerEnv = {
  dev: {
    mintWallet: new PublicKey('EysKBXpSpHUeEQBozaybpY8FjQcQFq1kdy1pMhAJZMTT'),
    burnerWallet: new PublicKey('476bomvPEAT3YFv3yZKnBkxKW29BE51wVzZWTHde8Wd1'),
    saleStart: new Date('2022-04-23T21:00:00+00:00'),
  },
  production: {
    mintWallet: new PublicKey('EysKBXpSpHUeEQBozaybpY8FjQcQFq1kdy1pMhAJZMTT'),
    burnerWallet: new PublicKey('476bomvPEAT3YFv3yZKnBkxKW29BE51wVzZWTHde8Wd1'),
    saleStart: new Date('2022-03-23T21:00:00+00:00'),
  },
}

export const currentDrops = [
  {
    nft: new PublicKey('HfntvzhvcLHypizovmGjWTBBKr1vPcqdMG6s2Cyyit7k'),
    nftCreator: new PublicKey('EESdcxGJfmyRj4qCCusY6TnMrc7HTRXeGiWbQ1RKVYPq'),
    boxSaleStart: new Date('2022-03-18T21:00:00+00:00'),
    href: 'mf-cbd-vape',
    name: 'Moon Fuel - CBD Vape Pen + 2 Cartridges',

    image:
      'https://ipfs.io/ipfs/QmSkiXr1pV4LqCsVpsWq1mcYCP31Eti1xXvxmSmzopzKZj?ext=gif',
    pricingInDollar: {
      sol: 0.55,
      puff: 55,
    },
    shortDescription: (
      <Text>
        {' '}
        Our CBD Vape Pen shines especially with its high quality and
        minimalistic design. Together with one of the largest CBD laboratories
        in Switzerland, we developed this product with the highest possible
        quality standard.
      </Text>
    ),
    description: (
      <Stack fontSize={'sm'}>
        <Box>
          <Text fontSize={'sm'}>- 50% CBD Content</Text>
          <Text fontSize={'sm'}>- 1 Vape Pen</Text>
          <Text fontSize={'sm'}>- 2 Refill Cartridges</Text>
          <Text fontSize={'sm'}>- Naturally-Derived Terpenes</Text>
        </Box>
        <Text fontSize={'sm'}>
          Ingredients: Cannabis Distillate, naturally derived cannabis terpenes
        </Text>
      </Stack>
    ),
  },
  {
    nft: new PublicKey('29j2diWsLiuRoNAGJQMCugKuJZR8SY4mtwkiPwrdEKLM'),
    nftCreator: new PublicKey('EESdcxGJfmyRj4qCCusY6TnMrc7HTRXeGiWbQ1RKVYPq'),
    boxSaleStart: new Date('2022-03-18T21:00:00+00:00'),
    href: 'mf-cbd-tincture',
    name: 'Moon Fuel - CBD Tincture',

    image:
      'https://ipfs.io/ipfs/QmTsjn65LvWaxZCrxLq86EVrGg5HnxXo9sc17ax6yrEXq2?ext=gif',
    pricingInDollar: {
      sol: 0.33,
      puff: 33,
    },
    shortDescription: (
      <Text>
        Our Moon Fuel Premium CBD Tincture with 10% Cannabis Extract consists of
        organic MCT Oil Hemp Extract as well as naturally-derived terpenes and
        captivates with an „exploring-space“ -like flavoring.
      </Text>
    ),
    description: (
      <Stack fontSize={'sm'}>
        <Box>
          <Text fontSize={'sm'}>- 1000mg CBD per bottle</Text>
          <Text fontSize={'sm'}>- 100% organic hemp extract</Text>
          <Text fontSize={'sm'}>- Made in Switzerland</Text>
          <Text fontSize={'sm'}>- No added chemicals or preservatives</Text>
        </Box>
        <Text fontSize={'sm'}>
          Ingredients: Organic MCT Oil hemp extract (Cannabis sativa L),
          naturally-derived terpenes
        </Text>
      </Stack>
    ),
  },
]

export const merchConfig = configPerEnv[ENV]
