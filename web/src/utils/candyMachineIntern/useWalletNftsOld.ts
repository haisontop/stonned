import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import * as anchor from '@project-serum/anchor'
import { getNFTsForOwnerOld } from './candyMachineOld'
import { useRecoilState } from 'recoil'
import { authSignatureAtom } from '../../recoil'
import { useAsyncRetry } from 'react-use'
import config from '../../config/config'
import { PublicKey } from '@solana/web3.js'

const rpcHost = config.rpcHost
const connection = new anchor.web3.Connection(rpcHost, { commitment: 'recent' })

const useWalletNftsOld = () => {
  const wallet = useWallet()

  if (window.location.host.includes('localhost') && false) {
    wallet.publicKey = new PublicKey(
      'GR93sLWc5iXZxYxqQzknQCipUxPvh3dokBuu4PreYfdY'
    )
  }

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

      const nftsForOwner = (
        await getNFTsForOwnerOld({ connection, ownerAddress: wallet.publicKey })
      )
        .filter((nft) => {
          /* if (!nft.name) console.error('fucked up nft', nft) */

          return !!nft.name
        })
        .sort((a, b) => {
          if (!a.name.includes('#')) return 1
          if (!b.name.includes('#')) return -1
          return Number(a.name.split('#')[1]) - Number(b.name.split('#')[1])
        })

      console.log('nftsForOwner', nftsForOwner)

      return nftsForOwner
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

export default useWalletNftsOld
