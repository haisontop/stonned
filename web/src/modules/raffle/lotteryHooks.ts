import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import {
  getActiveLottery,
  getAllFullLotteries,
  getAllLotteries,
  getLotteryByAddress,
  getLotteryUser,
  getUserPrices,
} from './lotteryUtils'
import { RaffleType } from './type'

export function useAllLotteries() {
  return useQuery('allLotteries', async () => {
    return getAllFullLotteries()
  })
}

export function useLottery(address?: string | string[]) {
  return useQuery(['lottery', address], async () => {
    if (!address) return
    return getLotteryByAddress(address as string)
  })
}

export function useActiveLottery() {
  return useQuery('activeLottery', async () => {
    return getActiveLottery()
  })
}

export function useLotteryUserForRaffle(raffle: RaffleType) {
  const wallet = useWallet()

  return useQuery(['lotteryUser', wallet.publicKey, raffle], async () => {
    if (!wallet.publicKey || !raffle) return null

    const lotteryUser = getLotteryUser({
      user: wallet.publicKey!,
      lottery: raffle.publicKey,
    })
    return lotteryUser
  })
}

export function useLotterySSR() {
  const router = useRouter()

  return useQuery(['lotterySSR', router.pathname], async () => {
    if (!router.pathname) return null

    const lotteryUser = getLotteryByAddress(router.pathname)
    return lotteryUser
  })
}

export function useLotteryUser() {
  const wallet = useWallet()
  const router = useRouter()
  const slug = router.query.slug

  const lotteryRes = useLottery(slug)

  return useQuery(
    ['lotteryUser', wallet.publicKey, lotteryRes.data],
    async () => {
      if (!wallet.publicKey || !lotteryRes.data) return null

      const lotteryUser = getLotteryUser({
        user: wallet.publicKey!,
        lottery: lotteryRes.data.publicKey,
      })
      return lotteryUser
    }
  )
}

export function useUserPrices() {
  const wallet = useWallet()
  const router = useRouter()
  const slug = router.query.slug

  const raffleRes = useLottery(slug)

  return useQuery(
    ['userPrices', wallet.publicKey, raffleRes.data],
    async () => {
      if (!wallet.publicKey || !raffleRes.data) return null

      return getUserPrices({ user: wallet.publicKey, lottery: raffleRes.data })
    }
  )
}
