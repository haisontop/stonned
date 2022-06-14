import React, { useCallback, useEffect } from 'react'
import { useState, useMemo } from 'react'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import useWalletBalance, {
  WalletBalanceProvider,
} from '../utils/useWalletBalance'
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react'

import useWalletNftsOld from '../utils/candyMachineIntern/useWalletNftsOld'
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
import configPerEnv, { connection, stakingIdl, stakingProgramId, puffToken } from '../config/config'
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
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'

export const thisIsAnUnusedExport =
  'this export only exists to disable fast refresh for this file'

console.log('programId', stakingProgramId.toBase58())

const Verify = () => {
  const router = useRouter()
  const requestId = router.query.id as string
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)

  const wallet = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    ;(async () => {
      if (!wallet.publicKey) return

      if (!wallet.signMessage) return

      if (!requestId) return

      const signature = await wallet.signMessage(
        new TextEncoder().encode('verify address')
      )

      const transaction = new Transaction()

      /* const tx = await wallet.sendTransaction(transaction, connection) */

      setLoading(true)
      const res = await axios.post(configPerEnv.apiHost + '/verifyAddress', {
        signature: Array.from(signature),
        address: wallet.publicKey.toBase58(),
        requestId: requestId,
      })
      setLoading(false)
      console.log('res', res)
      setVerified(true)
    })()
  }, [wallet.publicKey, router.query])

  return (
    <Box height='100vh' display='flex' justifyContent='center'>
      <Stack width='40%' spacing='2rem' marginTop='100px'>
        {loading && (
          <Stack alignItems='center'>
            <Text>Loading verification</Text>
            <Spinner />
          </Stack>
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
