import { sub, differenceInHours } from 'date-fns'
import {
  ENV,
  isNukedWhitelistSale,
  nuked,
  nukedMintWallet,
  nukedPublicSaleStart,
} from '../../config/config'
import { getTokenAccountsForOwner } from '../../utils/splUtils'

export function getNukedPrice() {
  if (isNukedWhitelistSale) return ENV === 'production' ? 13 : 13

  const startAuctionPrice = ENV === 'production' ? 16 : 16

  const hoursSinceStart = differenceInHours(new Date(), nukedPublicSaleStart)

  const price = startAuctionPrice - hoursSinceStart

  return price > 0 ? price : 1
}

export async function getNukedMintNfts() {
  const nftTokenAccounts = await getTokenAccountsForOwner(nukedMintWallet, {
    withAmount: true,
    commitment: 'confirmed',
  })

  const mintNfts = nftTokenAccounts
    .map((n) => n.account.data.parsed.info.mint)
    .filter((n) => nuked.mints.includes(n))

  return mintNfts
}
