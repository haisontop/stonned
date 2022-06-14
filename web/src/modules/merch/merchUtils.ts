import { atom } from 'recoil'
import { getDexlabPrice, getPUFFSolprice } from '../../utils/sacUtils'
import {
  getNftsFromOwnerByCreators,
  getNftWithTokenAccount,
} from '../../utils/splUtils'
import { currentDrops, merchConfig } from './merchConfig'

export const selectedProductTokensAtom = atom<
  Awaited<ReturnType<typeof getNftsFromOwnerByCreators>>
>({
  key: 'selectedProducts',
  default: [],
})

export async function getCbdProduct(productHref: string) {
  const drop = currentDrops.find((c) => c.href == productHref)
  if (!drop) throw new Error('product not found')

  console.log('drop', drop)

  const nft = (await getNftWithTokenAccount({
    user: merchConfig.mintWallet,
    nft: drop.nft,
    withAmount: false,
  }))!

  const sol = drop.pricingInDollar.sol
  const puff = drop.pricingInDollar.puff / (await getDexlabPrice('PUFF/USDC'))

  const product = {
    ...nft,
    ...drop,
    pricing: {
      sol,
      puff,
    },
    amount: nft.tokenAccount.account.data.parsed.info.tokenAmount.uiAmount,
  }

  return product
}

export async function getPricing(productHref: string) {
  const drop = currentDrops.find((c) => c.href == productHref)
  if (!drop) throw new Error('product not found')

  const solPrice = drop.pricingInDollar.sol / (await getPUFFSolprice())
  const puffPrice =
    drop.pricingInDollar.puff / (await getDexlabPrice('PUFF/USDC'))

  return {
    solPrice,
    puffPrice,
  }
}
