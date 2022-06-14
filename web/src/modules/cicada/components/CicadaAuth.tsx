import { Box, Image, ChakraProvider, Text, Stack } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import React from 'react'
import { useAsync } from 'react-use'
import themeFlat from '../../../themeFlat'
import { signingMessage } from '../cicadaConfig'
import { useCookies } from 'react-cookie'
import { useMemo } from 'react'
import { useRouter } from 'next/router'

const CicadaAuth = (props: { notAllowed?: boolean }) => {
  const wallet = useWallet()

  const [cookie, setCookie] = useCookies(['cicadaUser'])

  const cicadaUser = cookie.cicadaUser

  const router = useRouter()
  const redirectPath = router.query.redirect as string

  /* const [publicKey, setPublicKey] = useState(wallet.publicKey)
  
    useEffect(() => {
    if (!publicKey || !wallet.publicKey?.equals(publicKey))
      setPublicKey(wallet.publicKey)
  }, [wallet.publicKey, publicKey])
  */

  useAsync(async () => {
    if (!wallet.publicKey || !wallet.signMessage) return

    if (!cicadaUser || wallet.publicKey.toBase58() !== cicadaUser.wallet) {
      const res = await wallet.signMessage(
        new TextEncoder().encode(signingMessage)
      )

      setCookie(
        'cicadaUser',
        JSON.stringify({
          signature: Array.from(res),
          wallet: wallet.publicKey.toBase58(),
        }),
        {
          path: '/',
          maxAge: 2_629_746, // Expires after 1hr
          sameSite: true,
        }
      )

      router.reload()
    }
  }, ['user', wallet.publicKey, redirectPath])

  return (
    <ChakraProvider resetCSS theme={themeFlat}>
      <Stack
        bg='#000'
        w='100vw'
        h='100vh'
        alignItems={'center'}
        justifyContent={'center'}
        display='flex'
        spacing={'2rem'}
      >
        {props.notAllowed ? (
          <Text fontSize={'2xl'} color='white'>
            You are not allowed to view this page
          </Text>
        ) : (
          <Text fontSize={'2xl'} color='white'>
            Login to Continue
          </Text>
        )}
        <WalletMultiButton />
      </Stack>
    </ChakraProvider>
  )
}

export default CicadaAuth
