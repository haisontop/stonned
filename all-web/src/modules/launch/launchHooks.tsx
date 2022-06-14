import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { Link, Text } from '@chakra-ui/react'
import toast from 'react-hot-toast'
import { useAsync, useAsyncFn, useInterval } from 'react-use'
import { connection } from '../../config/config'
import rpc from '../../utils/rpc'
import { getSolscanTxLink, handleTransaction } from '../../utils/solUtils'
import { trpc } from '../../utils/trpc'
import { useQuery } from 'react-query'
import asyncBatch from 'async-batch'
import reattempt from 'reattempt'
import { useState } from 'react'

export function useMint() {
  const wallet = useWallet()

  return useAsyncFn(
    async (
      projectId: string,
      paymentOptionId: string,
      mintingPeriodId: string
    ) => {
      console.log({ paymentOptionId })

      if (!wallet.publicKey || !wallet.signTransaction)
        return { instantClose: true }

      try {
        const res = await rpc.mutation('launch.createMintTransaction', {
          user: wallet.publicKey!.toBase58(),
          projectId: projectId,
          paymentId: paymentOptionId,
          mintingPeriodId: mintingPeriodId,
        })

        const transaction = Transaction.from(Buffer.from((res as any).trans))

        await wallet.signTransaction(transaction)

        const serial = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })

        const tx = await new Promise<string>(async (resolve, reject) => {
          const sendMintTransRes = rpc
            .mutation('launch.sendMintTransaction', {
              trans: serial.toJSON(),
              token: res.token,
            })
            .catch(reject)

          await reattempt.run({ times: 15, delay: 1000 }, async () => {
            const transaction = await rpc.query('launch.getTransaction', {
              id: res.transId,
            })
            if (!transaction || !transaction.tx) throw new Error('tx not found')

            resolve(transaction.tx)
          })
        })

        return { tx }
      } catch (e: any) {
        if ((e.message as string).endsWith('0x1')) {
          toast.error('You are missing some funds')
          throw new Error('You are missing some funds')
        } /* else if (e.message.includes('0xBC4')) {
          toast.error('The ape is already rented.')
        } */ else toast.error(<Text wordBreak={'break-word'}>{e.message}</Text>)
        console.error('error at minting', e)
        throw new Error(e.message)
      }
    },
    [wallet]
  )
}

export function useMintStatus(tx?: string) {
  const wallet = useWallet()

  const [status, setStatus] = useState<string>()
  const [error, setError] = useState<string>()
  const [solscanLink, setSolscanLink] = useState<string>()
  const [success, setSuccess] = useState(false)
  const [confirmations, setConfirmations] = useState(0)

  useInterval(async () => {
    if (!tx) {
      setStatus(undefined)
      setSuccess(false)
      setConfirmations(0)
      setError(undefined)

      return
    }

    const signatureStatusRes = await connection.getSignatureStatus(tx!)

    if (!signatureStatusRes.value) return

    if (signatureStatusRes.value.err) {
      setError(signatureStatusRes.value.err.toString())
      return
    }

    console.log('signatureStatusRes', signatureStatusRes.value.confirmations)

    const confirmations = signatureStatusRes.value.confirmations ?? 0

    setConfirmations((o) => (confirmations > o ? confirmations : o))

    if (
      /*  signatureStatusRes.value.confirmationStatus === 'confirmed' ||
      signatureStatusRes.value.confirmationStatus === 'finalized' */
      confirmations >= 10
    ) {
      setSuccess(true)
      setSolscanLink(getSolscanTxLink(tx!))
      return
    }

    setStatus(signatureStatusRes.value.confirmationStatus)
  }, 1500)

  return {
    status,
    loading: tx && !success,
    success,
    error,
    solscanLink,
    confirmations,
  }
}
