import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import {
  getActiveAuction,
  getAllAuctions,
  getAuctionByAddress,
} from './auctionUtils'

export function useAllAuctions() {
  return useQuery('allAuctions', async () => {
    return getAllAuctions()
  })
}

export function useCurrentAuction() {
  const router = useRouter()
  const { id } = router.query

  return useAuction(id!)
}

export function useAuction(address: string | string[]) {
  return useQuery(['auction', address], async () => {
    if (!address) return
    return getAuctionByAddress(address as string)
  })
}

export function useActiveAuction() {
  return useQuery('activeAuction', async () => {
    return getActiveAuction()
  })
}

export function useLotterySSR() {
  const router = useRouter()

  return useQuery(['lotterySSR', router.pathname], async () => {
    if (!router.pathname) return null

    const lotteryUser = getAuctionByAddress(router.pathname)
    return lotteryUser
  })
}
