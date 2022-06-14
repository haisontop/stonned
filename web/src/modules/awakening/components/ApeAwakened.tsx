import {
  Container,
  Text,
  Button,
  Box,
  GridItem,
  Link,
  Image,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import axios from 'axios'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { useAsyncFn } from 'react-use'
import { connection } from '../../../config/config'
import rpc from '../../../utils/rpc'
import { AwakeningContext, AwakenStatus } from '../AwakeningProvider'
import reattempt from 'reattempt'
import { getSolscanTxLink } from '../../../utils/solUtils'
import toast from 'react-hot-toast'

export default function ApeAwakened() {
  const wallet = useWallet()
  const { status, setStatus } = useContext(AwakeningContext)

  const awakeningRes = useQuery(
    [
      'nukedAwakening',
      wallet.publicKey,
      status.apeToAwaken,
      status.awakeningPubkey,
    ],
    async () => {
      if (!wallet.publicKey || !status.awakeningPubkey) return null

      const awakeningInfo = await rpc.query('awakening.getAwakeningInfo', {
        user: wallet.publicKey.toBase58(),
        awakeningPubkey: status.awakeningPubkey.toBase58(),
      })

      if (!awakeningInfo) return { noInfo: true }

      const newMetadata = await axios.get(awakeningInfo.newMetadataLink)

      return { awakeningInfo, newMetadata, noInfo: false }
    }
  )

  function downloadURI(uri: any, name: any) {
    var link = document.createElement('a')
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', name)
    link.href = uri
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const [handleAwakenRes, handleAwaken] = useAsyncFn(
    async (awakeningPubkey: PublicKey) => {
      if (!wallet.publicKey || !wallet.signTransaction) return null

      try {
        const revealRes = await rpc.mutation('awakening.reveal', {
          user: wallet.publicKey.toBase58(),
          awakeningPubkey: awakeningPubkey.toBase58(),
        })

        console.log('revealRes', revealRes)

        const transaction = Transaction.from(
          Buffer.from(revealRes.trans as any)
        )

        await wallet.signTransaction(transaction)

        const serial = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        })
        const tx = await connection.sendRawTransaction(serial)

        console.log('tx', tx)

        await reattempt.run({ times: 2 }, () =>
          connection.confirmTransaction(tx)
        )

        toast.success(
          <Text>
            Your ape got revealed and should soon appear in its updated version
            in your wallet.{' '}
            <Link color='lightblue' target='_blank' href={getSolscanTxLink(tx)}>
              See on Solscan
            </Link>
          </Text>,
          { duration: 10000 }
        )
      } catch (e: any) {
        if ((e.message as string).endsWith('0x1')) {
          toast.error('You miss some tokens. Probably Solana')
        } else toast.error(e.message)
        console.error('error on set bid', e)
      }
    },
    [wallet.publicKey]
  )

  return (
    <Container id='awakeningContainer' maxW='45rem'>
      <Text
        color='#fff'
        fontSize='1.25rem  '
        lineHeight='1.875rem'
        fontWeight={500}
        textAlign='center'
      >
        {status.apeToAwaken?.name}
      </Text>
      <SimpleGrid mt='1.5rem' columns={[1, 2]} spacing={5}>
        <GridItem
          key='1'
          display='flex'
          alignItems={'center'}
          justifyContent={['center', 'start']}
        >
          <Image
            w={{ md: '18.75rem', sm: '13rem' }}
            h={{ md: '18.75rem', sm: '13rem' }}
            src={status.apeToAwaken?.image}
            rounded='md'
          />
        </GridItem>
        <GridItem
          key='2'
          display='flex'
          alignItems={'center'}
          justifyContent={['center', 'end']}
        >
          <Box position='relative'>
            {awakeningRes.data?.newMetadata &&
            awakeningRes.data.awakeningInfo ? (
              <Image
                w={{ md: '18.75rem', sm: '13rem' }}
                h={{ md: '18.75rem', sm: '13rem' }}
                src={awakeningRes.data.newMetadata.data.image}
                rounded='md'
              />
            ) : (
              <Box
                w={{ md: '18.75rem', sm: '13rem' }}
                h={{ md: '18.75rem', sm: '13rem' }}
                border='1px solid #fff'
                rounded='md'
                display='flex'
                justifyContent={'center'}
                alignItems='center'
                p={2}
              >
                {awakeningRes.isLoading ? (
                  <Spinner></Spinner>
                ) : (
                  <Text color='#fff' textAlign={'left'} fontSize='sm'>
                    Your awakened Ape should be ready any minute and will be
                    displayed here. Please try to reload!
                    <br></br>
                    <br></br>
                    Otherwise wait 30-60 minutes for the rendering to finish.{' '}
                    <br></br>
                    <br></br>
                    If there are any issues after 1 hour, please create a
                    support ticket in our discord.
                  </Text>
                )}
              </Box>
            )}
          </Box>
        </GridItem>
      </SimpleGrid>
      {awakeningRes.data?.newMetadata && awakeningRes.data.awakeningInfo && (
        <SimpleGrid columns={[1, 2]}>
          <GridItem
            colSpan={1}
            display='flex'
            alignItems={'center'}
            justifyContent={['center', 'start']}
          >
            <Button
              color='#fff'
              border='1px solid #fff'
              background='transparent'
              padding='1.5rem'
              w={{ md: '18.75rem', sm: '13rem' }}
              _hover={{
                background: 'rgba(255, 255, 255, 0.1)',
              }}
              onClick={() =>
                downloadURI(
                  awakeningRes.data?.newMetadata?.data.properties.files[1].uri,
                  `${status.apeToAwaken?.name ?? 'ape'}.png`
                )
              }
              mt='1rem'
            >
              Download as PNG
            </Button>
          </GridItem>
          <GridItem
            colSpan={1}
            display='flex'
            alignItems={'center'}
            justifyContent={['center', 'end']}
            mt='1rem'
          >
            <Button
              color='#fff'
              border='1px solid #fff'
              background='transparent'
              _hover={{
                background: 'rgba(255, 255, 255, 0.1)',
              }}
              padding='1.5rem'
              w={{ md: '18.75rem', sm: '13rem' }}
              onClick={() =>
                downloadURI(
                  awakeningRes.data?.newMetadata?.data.animation_url,
                  `${status.apeToAwaken?.name ?? 'ape'}.png`
                )
              }
            >
              Download as MP4
            </Button>
          </GridItem>
          {status.awakeningPubkey && (
            <GridItem
              display='flex'
              alignItems={'center'}
              justifyContent={['center']}
              mt='2rem'
              colSpan={[1, 2]}
            >
              <Button
                mt='2rem'
                color='#fff'
                border='none'
                padding='1.5rem'
                w={{ md: '20.18rem', base: '18rem' }}
                bgGradient='linear(to-r, #FFF886, #F072B6 94%)'
                _hover={{ opacity: '0.8' }}
                onClick={() => handleAwaken(status.awakeningPubkey!)}
                isLoading={handleAwakenRes.loading}
              >
                Awaken & Claim
              </Button>
            </GridItem>
          )}
        </SimpleGrid>
      )}
      <Box
        display='flex'
        alignItems='center'
        flexDirection='column'
        mt='3.5rem'
      >
        <Link
          textDecoration='underline'
          color='#fff'
          mt='3.5rem'
          onClick={() => {
            setStatus({ status: AwakenStatus.IN_PROGRESS })
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth',
            })
          }}
        >
          Back to Overview
        </Link>
      </Box>
    </Container>
  )
}
