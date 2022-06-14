import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useAsync } from 'react-use'
import { useRecoilState } from 'recoil'
import rpc from '../../utils/rpc'
import { solanaAuthAtom } from './authAtom'
import { solanaAuthConfig } from './authConfig'

export function useUser () {
  const [solanaAuth, setSolanaAuth] = useRecoilState(solanaAuthAtom)
  const wallet = useWallet()
  const [isDelayPassed, setDelayPassed] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setDelayPassed(true)
    }, 500)
  }, [])

  /* const [publicKey, setPublicKey] = useState(wallet.publicKey)
  
    useEffect(() => {
    if (!publicKey || !wallet.publicKey?.equals(publicKey))
      setPublicKey(wallet.publicKey)
  }, [wallet.publicKey, publicKey])
  */
  const publicKey = wallet.publicKey

  const { data, isLoading, error, refetch } = useQuery(
    ['user', publicKey, solanaAuth.signature, solanaAuth.wallet],
    async () => {
      if (!publicKey && !solanaAuth.signature) {
        setSolanaAuth({ signature: '', wallet: '' })
        return null
      }

      if (!wallet.signMessage || !publicKey) return null

      if (
        !solanaAuth.signature ||
        (solanaAuth.signature && solanaAuth.wallet !== publicKey?.toBase58())
      ) {
        const res = await wallet.signMessage(
          new TextEncoder().encode(solanaAuthConfig.signingMessage)
        )

        setSolanaAuth({
          signature: JSON.stringify({ signature: Array.from(res) }),
          wallet: publicKey.toBase58()
        })
      }

      return rpc.query('launch.getUser')
    }
  )
  const isAuthed = useMemo(() => {
    if (!isDelayPassed) return true
    if (
      (!publicKey && !solanaAuth.signature) ||
      !wallet.signMessage ||
      !publicKey
    ) {
      return false
    }
    return true
  }, [publicKey, solanaAuth.signature, wallet.signMessage, isDelayPassed])

  return { data, isLoading, error, isAuthed, refetch }
}
