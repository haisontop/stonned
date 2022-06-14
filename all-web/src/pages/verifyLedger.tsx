import React, { useCallback, useEffect } from 'react'
import { useState, useMemo } from 'react'

import { WalletMultiButton } from '../components/wallet-ui'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../utils/useWalletBalance'
import {
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react'

import useWalletNftsOld from '../utils/useWalletNftsOld'
import { Flex, Stack } from '@chakra-ui/layout'
import {
  Box,
  Heading,
  Image,
  Text,
  SimpleGrid,
  Spinner,
  Progress,
  Link,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { reseveredAtom } from '../recoil'
import dynamic from 'next/dynamic'
import { Idl, Program, Provider } from '@project-serum/anchor'
import { SacStaking, IDL } from '../../../staking/target/types/sac_staking'
import { PublicKey, Transaction } from '@solana/web3.js'
import configPerEnv, {
  connection,
  stakingIdl,
  stakingProgramId,
  allToken,
} from '../config/config'
import * as web3 from '@solana/web3.js'
import * as spl from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAddressInstruction,
} from '../utils/solUtils'
import { useAsync, useAsyncFn, useAsyncRetry } from 'react-use'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import asyncBatch from 'async-batch'
import toast from 'react-hot-toast'
import { StakedNft, UnstakedNft } from '../modules/staking/staking.components'
import Header from '../components/Header'
import * as Sentry from '@sentry/browser'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/dist/client/router'
import config from '../config/config'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

console.log('programId', stakingProgramId.toBase58())

const Verify = () => {
  const router = useRouter()
  const requestId = router.query.id as string
  const [verified, setVerified] = useState(false)

  const wallet = useWallet()
  const { connection } = useConnection()

  const verifyRequest = useAsync(async () => {
    if (
      !wallet.publicKey ||
      !wallet.signMessage ||
      !requestId ||
      !router.query.amount
    )
      return

    try {
      const verifyAmount = parseInt(router.query.amount as string)

      console.log('verifyAmount', verifyAmount)

      if (isNaN(verifyAmount)) throw Error('amount from query is wrong')

      console.log('verifyRequest', verifyRequest)

      const transaction = new Transaction({ feePayer: wallet.publicKey }).add(
        web3.SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: wallet.publicKey,
          lamports: verifyAmount,
        })
      )

      const tx = await wallet.sendTransaction(transaction, connection)
      await connection.confirmTransaction(tx)

      const sentTransaction = await connection.getParsedConfirmedTransaction(tx)

      console.log('sentTransaction', sentTransaction)

      const res = await axios.post(config.apiHost + '/verifyLedger', {
        transId: tx,
        address: wallet.publicKey.toBase58(),
        requestId: requestId,
      })
      console.log('res', res)

      setVerified(true)
    } catch (e: any) {
      const axiosError = e as AxiosError
      if (axiosError.isAxiosError) {
        console.log('axiosError.response?.data', axiosError.response?.data)

        throw Error(axiosError.response?.data.message ?? e.message)
      }

      throw e
    }
  }, [wallet.publicKey, router.query])

  return (
    <Box height='100vh' display='flex' justifyContent='center'>
      <Stack width='40%' spacing='2rem' marginTop='100px'>
        {verifyRequest.loading && (
          <Stack alignItems='center'>
            <Text>Loading verification</Text>
            <Spinner />
          </Stack>
        )}

        {verifyRequest.error && (
          <Text color='red' textAlign='center'>
            {verifyRequest.error.message}
          </Text>
        )}
        {!requestId && (
          <Text textAlign='center'>wrong url: requestId parameter missing</Text>
        )}
        {verified && (
          <Text textAlign='center'>
            You can close this page and return to discord.
          </Text>
        )}
        {requestId && !verified && (
          <Stack spacing='2rem' alignItems='center'>
            <Heading size='md' textAlign='center'>
              Click on the button to verify your solana address for discord
            </Heading>
            <WalletMultiButton />
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

const WalletConnectionProvider = dynamic(
  () => import('../components/WalletConnectionProvider'),
  {
    ssr: false,
  }
)

export default function HOC() {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <Verify />
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}
