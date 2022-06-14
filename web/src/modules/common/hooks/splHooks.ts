import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useQueries, useQuery } from 'react-query'
import { connection } from '../../../config/config'
import { buildToken, getTokenBalance } from '../../../utils/splUtils'

export function useTokenBalance(mint: PublicKey) {
  const wallet = useWallet()

  return useQuery(['tokenBalance', mint, wallet.publicKey], async () => {
    if (!wallet.publicKey) return null
    return getTokenBalance(mint, wallet.publicKey)
  })
}
