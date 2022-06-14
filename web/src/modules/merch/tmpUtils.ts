import { PublicKey } from '@solana/web3.js'
import { getNftWithMetadata } from '../../utils/solUtils'
import { getNftsFromOwnerByCreators } from '../../utils/splUtils'
import { merchConfigOgBox } from './merchConfigOgBox'
import { currentDrops } from './merchConfig'

export async function getAvailableBoxes() {
  const nfts = await getNftsFromOwnerByCreators({
    owner: merchConfigOgBox.wallet,
    creators: [merchConfigOgBox.wallet],
    withAmount: false,
  })

  const products = nfts
    .map((n) => ({
      amount: n.tokenAccount.account.data.parsed.info.tokenAmount.uiAmount,
      size: n.nft.attributes.find((a) => a.trait_type === 'Size')?.value!,
      mint: new PublicKey(n.tokenAccount.account.data.parsed.info.mint),
      order: n.nft.attributes.find((a) => a.trait_type === 'Order')?.value!,
      name: n.nft.collection.name,
    }))
    .map((n) => {
      if (n.size === 'XS') {
        return { ...n, amount: n.amount }
      } else if (n.size === 'S') {
        return { ...n, amount: n.amount - 8 }
      } else if (n.size === 'M') {
        return { ...n, amount: n.amount - 51 }
      } else if (n.size === 'L') {
        return { ...n, amount: n.amount - 67 }
      } else if (n.size === 'XL') {
        return { ...n, amount: n.amount }
      } else if (n.size === '2XL') {
        return { ...n, amount: n.amount - 11 }
      } else if (n.size === '3XL') {
        return { ...n, amount: n.amount - 7 }
      } else if (n.size === '4XL') {
        return { ...n, amount: n.amount }
      } else if (n.size === '5XL') {
        return { ...n, amount: n.amount - 1 }
      }
      return { ...n, amount: n.amount }
    })

  return products
}
