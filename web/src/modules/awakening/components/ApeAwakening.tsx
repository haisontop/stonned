import {
  Text,
  Button,
  Box,
  SimpleGrid,
  GridItem,
  useDisclosure,
  Heading,
  Link,
} from '@chakra-ui/react'
import { useCallback, useContext, useMemo } from 'react'
import { useState } from 'react'
import SelectApeModal from './SelectApeModal'
import { AwakenStatus, AwakeningContext } from '../AwakeningProvider'
import AwakenCard from './AwakenCard'
import Card from './Card'
import useWalletNfts from '../../../utils/useWalletNFTs'
import { any } from 'zod'
import { NftMetadata } from '../../../utils/nftmetaData.type'
import SelectMagicJModal from './SelectMagicJModal'
import {
  getAwakeningCost,
  getAwakeningCostForMetadata,
  getSolscanTxLink,
  pub,
} from '../../../utils/solUtils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from 'react-query'
import { getNftsFromOwnerByCreators } from '../../../utils/splUtils'
import {
  magicJCollection,
  nukedCollection,
} from '../../../config/collectonsConfig'
import { useAsyncFn } from 'react-use'
import rpc from '../../../utils/rpc'
import { PublicKey, Transaction } from '@solana/web3.js'
import config, { connection } from '../../../config/config'
import reattempt from 'reattempt'
import toast from 'react-hot-toast'
import { useAwakeningAccounts } from '../awakening.hooks'
import { useTokenBalance } from '../../common/hooks/splHooks'
import { differenceInDays, fromUnixTime } from 'date-fns'

export default function ApeAwakening() {
  const wallet = useWallet()
  const awakeningAccountsRes = useAwakeningAccounts()

  const { status, setStatus } = useContext(AwakeningContext)

  const ape1Modal = useDisclosure()
  const magicJModal = useDisclosure()

  const [cards, setCards] = useState<
    { [k: string]: any; selected: NftMetadata | null }[]
  >([
    {
      id: 'ape',
      image: '/images/holder/awaking/ape-card.png',
      btnTitle: 'Select another Ape',
      onClick: (id: string) => {
        ape1Modal.onOpen()
      },
      clicked: false,
      unClickTitle: 'Select a Nuked Ape',
      title: 'Step 1',
      subtitle: 'Select a Nuked Ape to awaken',
      selected: null,
    },
    {
      id: 'magic',
      image: '/images/holder/awaking/magic.png',
      btnTitle: 'Select another Magic J',
      onClick: (id: string) => {
        magicJModal.onOpen()
      },
      clicked: false,
      title: 'Step 2',
      subtitle: 'Select a Magic J to use',
      unClickTitle: 'Select a Magic J',
      selected: null,
    },
  ])

  const awakeningCost = useMemo(() => {
    const apeCard = cards.find((c) => c.id === 'ape')
    const magicJCard = cards.find((c) => c.id === 'magic')

    if (!apeCard || !magicJCard) return null

    if (!apeCard.selected) return null

    if (!magicJCard.selected) return null

    return getAwakeningCostForMetadata(apeCard.selected, magicJCard.selected)
  }, [cards])

  const nftsRes = useQuery(['nukedAndMagigJs', wallet.publicKey], async () => {
    if (!wallet.publicKey) return null

    const nfts = await getNftsFromOwnerByCreators({
      owner:
        /*  window.location.hostname.includes('localhost') && false
          ? pub('9jxKzm5a1YtKuy5GxSpBECzPRyFqPdMcDWWznji2iB63')
          : */ wallet.publicKey,
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
      const nuked = cards.find((c) => c.id === 'ape')?.selected
      const magicJ = cards.find((c) => c.id === 'magic')?.selected

      if (!nuked || !magicJ) {
        toast.error('No Nuked Ape or Magic J selected. Please reload', {
          duration: 10000,
        })
        return
      }

      const startRes = await rpc.mutation('awakening.startBreed', {
        user: wallet.publicKey.toBase58(),
        ape: nuked.pubkey.toBase58(),
        magicJ: magicJ.pubkey.toBase58(),
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

      awakeningAccountsRes.refetch()

      toast.success(
        <Text>
          Started the path to awakening. Your ape should soon appear on this
          page.{' '}
          <Link color='lightblue' target='_blank' href={getSolscanTxLink(tx)}>
            See on Solscan
          </Link>
        </Text>,
        { duration: 10000 }
      )
    } catch (e: any) {
      if ((e.message as string).endsWith('0x1')) {
        toast.error('You miss some tokens')
      } else toast.error(e.message)
      console.error('error on set bid', e)
    }
  }, [wallet.publicKey, nftsRes.data])

  const placeholderCost = useMemo(() => {
    const diff = Math.abs(
      differenceInDays(fromUnixTime(1653587999), new Date())
    )

    return {
      puff: 777 + diff * 3,
      all: 2777 + diff * 10,
    }
  }, [])

  const clickAwaken = (awakeningPubkey: PublicKey, ape: NftMetadata) => {
    console.log('awaken clicked')

    setStatus({
      status: AwakenStatus.AWAKEN,
      apeToAwaken: ape,
      awakeningPubkey,
    })
    setTimeout(() => {
      console.log(document.getElementById('awakeningContainer'))

      window.scrollTo({
        top:
          (document.getElementById('awakeningContainer')?.offsetTop ?? 550) -
          50,
        behavior: 'smooth',
      })
    }, 30)
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignContent='center'
      alignItems='center'
    >
      <SelectApeModal
        modal={ape1Modal}
        title='Select ape for awakening'
        walletNftsRes={nftsRes}
        onSelect={(apeNft) => {
          setCards(
            cards.map((c) => {
              if (c.id === 'ape') {
                c.selected = apeNft
              }
              return c
            })
          )
          ape1Modal.onClose()
        }}
      />
      <SelectMagicJModal
        title='Select Magic J used for awakening'
        walletNftsRes={nftsRes}
        onSelect={(magicJNft) => {
          setCards(
            cards.map((c) => {
              if (c.id === 'magic') {
                c.selected = magicJNft
              }
              return c
            })
          )
          magicJModal.onClose()
        }}
        modal={magicJModal}
      ></SelectMagicJModal>
      <SimpleGrid
        maxW={['92vw', '45rem']}
        columns={[1, 2]}
        spacing={{ base: 5, md: 10 }}
      >
        {cards.map((card) => (
          <GridItem key={card.id}>
            <Heading mb={1} color='#fff' size='sm'>
              {card.title}
            </Heading>
            <Text mb={3} color='#ccc' size='sm'>
              {card.subtitle}
            </Text>
            <Card
              id={card.id}
              title={card.title}
              image={card.image}
              btnTilte={card.btnTitle}
              unClickTitle={card.unClickTitle}
              clicked={card.clicked}
              onClick={card.onClick}
              selected={card.selected}
            ></Card>
          </GridItem>
        ))}
        <GridItem>
          <Heading mb={1} color='#fff' size='sm' mt='1.2rem'>
            Step 3
          </Heading>
          <Text mb={6} color='#ccc' size='sm'>
            Have enough $PUFF & $ALL to awaken your ape
          </Text>
          <Text
            color='#7d7d80'
            fontSize='.9rem  '
            lineHeight='1.125rem'
            fontWeight={600}
            textAlign='center'
          >
            Cost (*)
          </Text>
          <Text
            color='#616164'
            fontSize='.6rem  '
            lineHeight='1.125rem'
            fontWeight={600}
            textAlign='center'
          >
            *cost varies based on the ape
          </Text>
          <Text
            color='#fff'
            fontSize='1rem'
            mt='0.5rem'
            lineHeight='1.125rem'
            fontWeight={600}
            textAlign='center'
          >
            {awakeningCost
              ? `${awakeningCost.puff} $PUFF + ${awakeningCost.all} $ALL`
              : `${placeholderCost.puff} $PUFF + ${placeholderCost.all} $ALL`}
          </Text>
        </GridItem>
        <GridItem
          display='flex'
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Button
            mt='2rem'
            color='#fff'
            border='none'
            padding='1.5rem'
            w={{ md: '20.18rem', base: '18rem' }}
            bgGradient='linear(to-r, #FFF886, #F072B6 94%)'
            _hover={{ opacity: '0.8' }}
            isLoading={startAwakeningRes.loading}
            onClick={() => {
              startAwakening()
            }}
          >
            Start Awakening Path
          </Button>
        </GridItem>
      </SimpleGrid>

      {(awakeningAccountsRes?.data || []).length > 0 && (
        <SimpleGrid
          mt='15rem'
          columns={{ md: awakenedApe.length > 2 ? 3 : 2, sm: 2, base: 2 }}
          spacing={{ base: 5, md: 10 }}
        >
          {awakeningAccountsRes?.data?.map((awakeningData) => (
            <GridItem key={awakeningData.nft.name}>
              <AwakenCard
                id={awakeningData.nft.name}
                ape={awakeningData.nft.name}
                magic={awakeningData.nft.name}
                image={awakeningData.nft.image}
                onAwaken={
                  () =>
                    clickAwaken(
                      awakeningData.awakeningAccount.publicKey,
                      awakeningData.nft
                    )
                  // handleAwaken(awakeningData.awakeningAccount.publicKey)
                }
                endDate={awakeningData.endDate}
              ></AwakenCard>
            </GridItem>
          ))}
        </SimpleGrid>
      )}

      {/*status.status === AwakenStatus.IN_PROGRESS && (
        <>
          <SimpleGrid
            mt='15rem'
            columns={{
              lg: awakeningApe.length > 2 ? 3 : 2,
              md: 2,
              sm: 2,
              base: 2,
            }}
            spacing={{ base: 5, md: 10 }}
          >
            {awakeningAccountsRes?.data?.map((awakeningData) => (
              <GridItem key={awakeningData.nft.name}>
                <AwakenCard
                  id={awakeningData.nft.name}
                  ape={awakeningData.nft.name}
                  magic={awakeningData.nft.name}
                  image={awakeningData.nft.image}
                  onAwaken={() => {}}
                  endDate={awakeningData.endDate}
                ></AwakenCard>
              </GridItem>
            ))}
          </SimpleGrid>
        </>
            )*/}
    </Box>
  )
}

const awakenedApe = [
  {
    id: '1',
    image: '/images/holder/awaking/ape-card.png',
    ape: 'Nuked Ape #0000',
    magic: 'Magic J Type III',
  },
  {
    id: '3',
    image: '/images/holder/awaking/ape-card.png',
    ape: 'Nuked Ape #0000',
    magic: 'Magic J Type III',
  },
]

const awakeningApe = [
  {
    id: '1',
    image: '/images/holder/awaking/ape-card.png',
    ape: 'Nuked Ape #0000',
    magic: 'Magic J Type III',
    timeAwake: new Date().getTime() + 9999999,
  },
  {
    id: '2',
    image: '/images/holder/awaking/ape-card.png',
    ape: 'Nuked Ape #0000',
    magic: 'Magic J Type III',
    timeAwake: new Date().getTime() + 9999999,
  },
  {
    id: '3',
    image: '/images/holder/awaking/ape-card.png',
    ape: 'Nuked Ape #0000',
    magic: 'Magic J Type III',
    timeAwake: new Date().getTime() + 9999999,
  },
  {
    id: '4',
    image: '/images/holder/awaking/ape-card.png',
    ape: 'Nuked Ape #0000',
    magic: 'Magic J Type III',
    timeAwake: new Date().getTime() + 9999999,
  },
]
