import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import * as anchor from '@project-serum/anchor'
import { useAsyncRetry } from 'react-use'
import config from '../config/config'
import { getNFTsForOwner } from './solUtils'

const rpcHost = config.rpcHost
const connection = new anchor.web3.Connection(rpcHost, { commitment: 'recent' })

const useWalletNfts = (includeNuked?: boolean) => {
  const wallet = useWallet()

  const fetchNftsRes = useAsyncRetry(async () => {
    try {
      if (
        !wallet ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !wallet.signTransaction
      ) {
        return null
      }

      const nftsForOwner = await getNFTsForOwner({
        connection,
        ownerAddress: wallet.publicKey,
        includeNuked
      })

      console.log('nftsForOwner', nftsForOwner.length)
      const nfts = nftsForOwner
        .filter((nft) => {
          /* if (!nft.name) console.error('fucked up nft', nft) */

          return !!nft.name
        })
        .sort((a, b) => {
          if (!a.name.includes('#')) return 1
          if (!b.name.includes('#')) return -1
          return Number(a.name.split('#')[1]) - Number(b.name.split('#')[1])
        })

      console.log('nfts!', nfts)

      return nfts
    } catch (e) {
      console.error('e in useWalletNfts', e)
      Promise.reject(e)
      return []
    }
  }, [wallet])

  return {
    loading: fetchNftsRes.loading,
    nfts: fetchNftsRes.value ?? [],
    refetch: fetchNftsRes.retry,
  }
}

export default useWalletNfts
