import {
  Container,
  Text,
  Button,
  Box,
  GridItem,
  Link,
  Image,
  SimpleGrid,
} from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useAsync, useAsyncFn } from 'react-use'
import {
  collections,
  magicJCollection,
  nukedCollection,
} from '../../../config/collectonsConfig'
import { connection } from '../../../config/config'
import rpc from '../../../utils/rpc'
import { getSolscanTxLink, pub } from '../../../utils/solUtils'
import { getNftsFromOwnerByCreators } from '../../../utils/splUtils'
import useWalletNfts from '../../../utils/useWalletNFTs'
import { useAwakeningAccounts } from '../awakening.hooks'
import { AwakeningContext, AwakenStatus } from '../AwakeningProvider'
import reattempt from 'reattempt'

export default function AwakeningTest() {
  const { setStatus } = useContext(AwakeningContext)

  const wallet = useWallet()
  const awakeningAccounts = useAwakeningAccounts()

  const nftsRes = useQuery(['nukedAndMagigJs', wallet.publicKey], async () => {
    if (!wallet.publicKey) return null

    const nfts = await getNftsFromOwnerByCreators({
      owner: wallet.publicKey,
      creators: [pub(nukedCollection.creator), pub(magicJCollection.creator)],
    })

    const nukedApes = nfts.filter((n) =>
      n.nft.data.data.creators.find(
        (c) => c.address === nukedCollection.creator
      )
    )

    const magicJs = nfts.filter((n) =>
      n.nft.data.data.creators.find(
        (c) => c.address === magicJCollection.creator
      )
    )

    console.log({
      nukedApes,
      magicJs,
    })

    return {
      nukedApes,
      magicJs,
    }
  })

  const [startAwakeningRes, startAwakening] = useAsyncFn(async () => {
    if (!wallet.publicKey || !wallet.signTransaction || !nftsRes.data)
      return null

    try {
      const nuked = nftsRes.data?.nukedApes[0]
      const magicJ = nftsRes.data.magicJs[0]

      const startRes = await rpc.mutation('awakening.startBreed', {
        user: wallet.publicKey.toBase58(),
        ape: nuked.nft.pubkey.toBase58(),
        magicJ: magicJ.nft.pubkey.toBase58(),
      })

      console.log('startRes', startRes)

      const transaction = Transaction.from(Buffer.from(startRes.trans as any))

      await wallet.signTransaction(transaction)

      const serial = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
      })
      const tx = await connection.sendRawTransaction(serial)

      console.log('tx', tx)

      await reattempt.run({ times: 2 }, () => connection.confirmTransaction(tx))

      toast.success(
        <Text>
          sent ape to sleed{' '}
          <Link color='lightblue' target='_blank' href={getSolscanTxLink(tx)}>
            solscan
          </Link>
        </Text>
      )
    } catch (e: any) {
      if ((e.message as string).endsWith('0x1')) {
        toast.error('You miss some tokes')
      } else toast.error(e.message)
      console.error('error on set bid', e)
    }
  }, [wallet.publicKey, nftsRes.data])

  const [revalAwakeningRes, revealAwakening] = useAsyncFn(
    async (awakeningPub: PublicKey) => {
      if (!wallet.publicKey || !wallet.signTransaction) return null

      try {
        const revealRes = await rpc.mutation('awakening.reveal', {
          user: wallet.publicKey.toBase58(),
          awakeningPubkey: awakeningPub.toBase58(),
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
            reveal ape{' '}
            <Link color='lightblue' target='_blank' href={getSolscanTxLink(tx)}>
              solscan
            </Link>
          </Text>
        )
      } catch (e: any) {
        if ((e.message as string).endsWith('0x1')) {
          toast.error('You miss some tokes')
        } else toast.error(e.message)
        console.error('error on set bid', e)
      }
    },
    [wallet.publicKey, nftsRes.data]
  )

  return (
    <Container maxW='45rem'>
      <WalletMultiButton />
      <Button onClick={startAwakening}>Start awakening</Button>
      {awakeningAccounts.data?.map((a, i) => (
        <Button
          key={i}
          onClick={(e) => revealAwakening(a.awakeningAccount.publicKey)}
        >
          reveal
        </Button>
      ))}
      <Text
        color='#fff'
        fontSize='1.25rem  '
        lineHeight='1.875rem'
        fontWeight={500}
        textAlign='center'
      >
        Nuked Ape #0000
      </Text>
      <SimpleGrid mt='3.5rem' columns={2} spacing={5}>
        <GridItem key='1'>
          <Image
            w={{ md: '18.75rem', sm: '13rem' }}
            h={{ md: '18.75rem', sm: '13rem' }}
            src='/images/holder/awaking/ape-card.png'
            rounded='md'
          />
        </GridItem>
        <GridItem key='2'>
          <Box position='relative'>
            <Image
              w={{ md: '18.75rem', sm: '13rem' }}
              h={{ md: '18.75rem', sm: '13rem' }}
              src='/images/holder/awaking/ape-card.png'
              rounded='md'
            />
            <Text
              fontSize={{ md: '2.5rem', sm: '1.7rem' }}
              lineHeight='3.75rem'
              color='#fff'
              fontWeight='800'
              left='10%'
              top='40%'
              position='absolute'
            >
              Awakened
            </Text>
          </Box>
        </GridItem>
      </SimpleGrid>
      <Box
        display='flex'
        alignItems='center'
        flexDirection='column'
        mt='3.5rem'
      >
        <Button
          color='#000'
          border='none'
          padding='1.5rem'
          w={{ md: '20.18rem', base: '18rem' }}
          onClick={() => {}}
        >
          Download as GIF
        </Button>
        <Button
          mt='1rem'
          color='#000'
          border='none'
          padding='1.5rem'
          w={{ md: '20.18rem', base: '18rem' }}
          onClick={() => {}}
        >
          Download as mp4
        </Button>
        <Link
          textDecoration='underline'
          color='#fff'
          mt='3.5rem'
          onClick={() => {
            setStatus({status: AwakenStatus.IN_PROGRESS})
            window.scrollTo(0, 0)
          }}
        >
          Back to Overview
        </Link>
      </Box>
    </Container>
  )
}
