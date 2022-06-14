import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Image,
  Text,
} from '@chakra-ui/react'
import { FC } from 'react'

interface LinksProps {}

const exchanges = [
  {
    name: 'DexLab',
    link: 'https://trade.dexlab.space/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV',
    logo: 'images/dexlab.png',
  },
  {
    name: 'Raydium',
    link: 'https://raydium.io/swap/?from=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&to=G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB',
    logo: 'images/raydium.png',
  },
  {
    name: 'CoinMarketCap',
    link: 'https://coinmarketcap.com/currencies/puff/',
    logo: 'images/cmc.png',
  },
  {
    name: 'SolApe',
    link: 'https://solapeswap.io/#/market/FjkwTi1nxCa1S2LtgDwCU8QjrbGuiqpJvYWu3SWUHdrV',
    logo: 'images/solape.png',
  },
  {
    name: 'Coingecko',
    link: 'https://www.coingecko.com/en/coins/puff',
    logo: 'images/coingecko.png',
  },
  {
    name: 'Aldrin',
    link: 'https://dex.aldrin.com/chart/spot/PUFF_USDC',
    logo: 'images/aldrin.png',
  },
]

const Links: FC<LinksProps> = () => {
  return (
    <Stack
      display={'flex'}
      id='exchanges'
      spacing={'2rem'}
      alignSelf='center'
      alignItems={'center'}
      paddingBottom='3rem'
    >
      <Heading
        textAlign={'center'}
        fontFamily={'body'}
        fontSize='3xl'
        fontWeight={'800'}
      >
        Partners
      </Heading>
      <SimpleGrid columns={[2, 3]} spacing={[4, 6]}>
        {exchanges.map((e, i) => {
          return (
            <Stack
              key={i}
              as='a'
              href={e.link}
              target={'_blank'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              {/*  <Text textAlign={'center'} fontSize={'2xl'} fontWeight={'500'}>
                {e.name}
              </Text> */}
              <Button
                background={'rgb(242, 246, 247)'}
                fontSize='16px'
                fontWeight={600}
                paddingX={'.5rem'}
              >
                <Image width='30px' src={e.logo} mr='6px'></Image>{e.name}
              </Button>
            </Stack>
          )
        })}
      </SimpleGrid>
    </Stack>
  )
}

export default Links
