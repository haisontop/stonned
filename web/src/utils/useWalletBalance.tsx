import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { createContext, useContext, useEffect, useState } from 'react'
import * as anchor from '@project-serum/anchor'
import { useRecoilState } from 'recoil'
import { authSignatureAtom } from '../recoil'
import config from '../config/config'

const BalanceContext = createContext(null)

const rpcHost = config.rpcHost

const connection = new anchor.web3.Connection(rpcHost)

export default function useWalletBalance() {
  const [balance, setBalance]: any = useContext(BalanceContext)
  return [balance, setBalance]
}

export const WalletBalanceProvider: React.FC<{}> = ({ children }) => {
  const wallet = useWallet()
  const [balance, setBalance] = useState(0)
  const [signature, setSignature] = useRecoilState(authSignatureAtom)

  useEffect(() => {
    ;(async () => {
      if (wallet?.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      }
    })()
  }, [wallet.publicKey?.toBase58()])

  useEffect(() => {
    ;(async () => {
      if (wallet?.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      }
    })()
  }, [wallet.publicKey?.toBase58()])

  return (
    <BalanceContext.Provider value={[balance, setBalance] as any}>
      {children}
    </BalanceContext.Provider>
  )
}
