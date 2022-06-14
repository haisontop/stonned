import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Box,
  Button,
  Stack,
  Link,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'
import {
  getPhantomWallet,
  getSolflareWallet,
  getSolflareWebWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import axios from 'axios'
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import * as splToken from '@solana/spl-token'
import HCaptcha from '@hcaptcha/react-hcaptcha'
require('@solana/wallet-adapter-react-ui/styles.css')

const env = process.env.NEXT_PUBLIC_VERCEL ? 'production' : 'dev'

const config = {
  /* mintAddress: '4evENxfLeUDk24nrqzMp4gkR3kPxCMeQuCeftjgd66BD',
  fromTokenAccount: new PublicKey('DVpM3GFV2myCpSfMgJHxPtafiQDQJndnMYm4G3wyHRZk'),
  from: new PublicKey('VwXAvisAGVRXtZK1RQfpfUyZFbnA1dLgEKtVpJY3RqP'), */
  // mintTokenAssociatedProgramId: new PublicKey(' ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
  // mintTokenProgramId: new PublicKey(' TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  production: {
    apiHost: 'https://sol-discord-bot.onrender.com',
    network: WalletAdapterNetwork.Mainnet,
  },
  dev: {
    apiHost: 'http://localhost:4000',
    network: WalletAdapterNetwork.Devnet,
  },
}['production']

const connection = new Connection(clusterApiUrl(config.network), 'confirmed')

const WalletConnect = () => {
  const router = useRouter()
  const requestId = router.query.mintAccessId as string
  const mintId = router.query.mintId as string
  const [verified, setVerified] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isSuccess, setSuccess] = useState(false)
  const hcaptchaRef = useRef<any>()

  const [transferTx, setTransferTx] = useState<string>()

  console.log('router.query', router.query)

  const wallet = useWallet()

  const requestAirdrop = async () => {
    const mintPublicKey = new PublicKey(mintId)
    try {
      setLoading(true)
      if (!wallet.publicKey) return null
      const associatedDestinationTokenAddr = await splToken.Token.getAssociatedTokenAddress(
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        splToken.TOKEN_PROGRAM_ID,
        mintPublicKey,
        wallet.publicKey,
      )

      const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr)

      console.log('receiverAccount', receiverAccount)

      if (!receiverAccount) {
        const testTransaction = new Transaction().add(
          splToken.Token.createAssociatedTokenAccountInstruction(
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            splToken.TOKEN_PROGRAM_ID,
            mintPublicKey,
            associatedDestinationTokenAddr,
            wallet.publicKey,
            wallet.publicKey,
          ),
        )

        const trans = await wallet.sendTransaction(testTransaction, connection, {
          preflightCommitment: 'confirmed',
        })

        await connection.confirmTransaction(trans, 'confirmed')

        console.log('created tokenAccount', trans)
      }

      try {
        const res = await axios.post(config.apiHost + '/airdrop', {
          dest: wallet.publicKey.toBase58(),
          mintAccessId: router.query.mintAccessId,
        })
        if (res.status === 200) {
          console.log('successful')
          setTransferTx(res.data)
        } else {
          // Else throw an error with the message returned
          // from the API
          const error = await res.data
          throw new Error(error.message)
        }
      } catch (error) {
        console.error('something went wrong', error)
      } finally {
        setLoading(false)
        // Reset the reCAPTCHA when the request has failed or succeeeded
        // so that it can be executed again if user submits another email.
        hcaptchaRef?.current?.reset()
      }

      /*  hcaptchaRef?.current?.execute() */
    } catch (err) {
      setLoading(false)
    }
  }

  const onHCaptchaChange = async (captchaCode?: string) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    /*  if (!captchaCode) {
      return
    } */
    setLoading(true)
  }

  useEffect(() => {
    ;(async () => {
      if (!wallet.publicKey) return

      if (!wallet.signMessage) return

      setVerified(true)
    })()
  }, [wallet.publicKey])

  return (
    <Box display='flex' justifyContent='center'>
      <Stack width='90%' spacing='2rem' marginTop='20px'>
        {verified && (
          <Text textAlign='center'>
            <Heading size='md' textAlign='center' fontSize='1.4rem'>
              Click on the button & sign the transaction to create the token account & request the airdrop
            </Heading>
            {wallet.publicKey && 
            <Text
              textAlign='center'
              fontSize='0.6rem'
              marginY='10px'
              textOverflow='ellipsis'
              whiteSpace='nowrap'
              overflow='hidden'
            >
              Connected with {wallet.publicKey.toString()}
            </Text>}
            <Button
              isLoading={isLoading}
              color={isSuccess ? 'teal' : 'primary'}
              onClick={async (e: any) => {
                requestAirdrop()
              }}
            >
              Request airdrop
            </Button>
            {/* <HCaptcha
              id='hCaptcha'
              size='invisible'
              ref={hcaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
              onVerify={onHCaptchaChange}
            /> */}
            {transferTx && (
              <Alert status='success' fontSize='0.9rem' marginTop='12px'>
                <AlertIcon />
                <AlertTitle fontSize='0.9rem' mr={2}>
                  Airdrop successful!
                </AlertTitle>
                <AlertDescription fontSize='0.9rem'>
                  Signature: {transferTx}.{' '}
                  <Link
                    target='_blank'
                    textDecoration='underline'
                    href={`https://explorer.solana.com/tx/${transferTx}?cluster=${config.network}`}
                  >
                    Explorer link
                  </Link>
                </AlertDescription>
              </Alert>
            )}
          </Text>
        )}
        {!verified && (
          <Stack spacing='2rem' alignItems='center'>
            <Heading size='md' textAlign='center' fontSize='1.4rem'>
              Connect your wallet to start the airdrop process
            </Heading>
            <WalletMultiButton />
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  getPhantomWallet(),
  getSolletWallet(),
  getSolletExtensionWallet(),
  getSolflareWebWallet(),
  getSolflareWallet(),
]

const HOC = (Component: React.FC) => {
  //You can do modification in data then pass it to the component

  return () => {
    const endpoint = useMemo(() => clusterApiUrl(config.network), [config.network])

    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={false}>
          <WalletModalProvider>
            <Component />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    )
  }
}

export default HOC(WalletConnect)
