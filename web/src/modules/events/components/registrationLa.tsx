import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  List,
  ListItem,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState } from 'react'
import { ReactElement } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useAsyncFn } from 'react-use'
import { z } from 'zod'
import {
  nukedCollection,
  sacCollection,
} from '../../../config/collectonsConfig'
import { MainLayout } from '../../../layouts/MainLayout'
import rpc from '../../../utils/rpc'
import { doesUserOwnNfts, getSacFamilyNftsCount } from '../../../utils/sacUtils'
import { getNFTsForOwner, pub } from '../../../utils/solUtils'
import { getNftsFromOwnerByCreatorsWithoutOfChainMeta } from '../../../utils/splUtils'
import { trpc } from '../../../utils/trpc'
import { signingMessage } from '../../cicada/cicadaConfig'

interface InfoBoxProps {
  children: ReactElement
  heading: string
  bgImage: string
}

function InfoBox({ children, heading, bgImage }: InfoBoxProps) {
  return (
    <Flex
      bgImage={bgImage}
      bgRepeat='no-repeat'
      bgPos='center'
      minHeight='300px'
      width='100%'
      alignItems='center'
      justifyContent='center'
    >
      <Box minWidth='200px'>
        <Heading variant='minimal' mb='1rem'>
          {heading}
        </Heading>
        <Text variant='minimal'>{children}</Text>
      </Box>
    </Flex>
  )
}

const sponsors = [
  'Bear Labs',
  'Costa Cannabis',
  'Kinda High/Cosmic Fog',
  'Ra Brand Edibles',
  'Moxie',
  'Non Funjible Cannabis',
  'Pine Park',
  'WCC',
  'Green Wolf',
  'Bum Feet',
  'The Dopest',
]

const validationSchema = z.object({
  guests: z.array(z.string()),
})

export default function RegistrationLA() {
  const wallet = useWallet()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    control,
    getValues,
  } = useForm({
    /* resolver: zodResolver(validationSchema) */
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'guests', // unique name for your Field Array
    }
  )

  const [alreadyLoaded, setAlreadyLoaded] = useState(false)
  trpc.useQuery(
    [
      'events.getGuestlist',
      {
        wallet: wallet.publicKey?.toBase58()! ?? '',
      },
    ],
    {
      onSuccess(data) {
        if (alreadyLoaded || !data.guestList) return

        data.guestList?.entries.map((e, i) => setValue(`guests.${i}`, e.name))
        setAlreadyLoaded(true)
      },
      staleTime: 99999909,
    }
  )

  const sacNftsRes = useQuery(['sacNfts', wallet.publicKey], async () => {
    if (!wallet.publicKey) return null

    return await getSacFamilyNftsCount(wallet.publicKey.toBase58())
  })

  const [upsertGuestListRes, upserGuestList] = useAsyncFn(
    async (values: z.infer<typeof validationSchema>) => {
      if (!wallet.publicKey || !sacNftsRes.data || !wallet.signMessage)
        return null

      try {
        const signMessageRes = await wallet.signMessage(
          new TextEncoder().encode(signingMessage)
        )


        const upserGuestListRes = await rpc.mutation(
          'events.signupGuestlistLa',
          {
            ...values,
            wallet: wallet.publicKey.toBase58(),
            signingMessage: Array.from(signMessageRes),
          }
        )

        return upserGuestListRes
      } catch (e: any) {
        toast.error(e.message as string)

        return null
      }
    },
    [wallet, sacNftsRes.data]
  )

  return (
    <MainLayout
      navbar={{
        colorTheme: 'light',
        bgTransparent: true,
        bgColor: '#FFFAF0',
      }}
    >
      <Box
        bg='#FFFAF0'
        width='100vw'
        minHeight='100vh'
        height='100%'
        py='8rem'
        fontFamily='Montserrat'
      >
        <Image src='/images/puffin-la.png' mx='auto'></Image>
        <Box textAlign='center' mt='2rem'>
          <Text variant='minimal' fontSize='1.25rem' mt='3rem' mb='1rem'>
            Holder Guestlist
          </Text>
          <Text variant='minimal'>
            Each staked SAC and NAC gets you a guestlist spot for PUFFIN' LA.
          </Text>
          <Text variant='minimal'>
            Additionally every holder can bring one free +1.
          </Text>
          <Text
            variant='minimal'
            mb='2rem'
            mt='.5rem'
            fontSize='0.65rem'
            color='#888'
          >
            Example: A holder with 1 SAC and 2 NAC gets 3 guestlist spots and
            one +1, so in sum 4 spots.
          </Text>
          <Text variant='minimal'>
            Connect your wallet here and enter your name to reserve your
            spot(s).
          </Text>

          <Flex my='2rem' justifyContent={'center'}>
            <WalletMultiButton
              style={{
                color: 'black',
                backgroundColor: 'transparent',
                border: '2px solid black',
                borderRadius: '5px',
                height: '32px',
              }}
            />
          </Flex>

          {sacNftsRes.isLoading && (
            <Flex justifyContent='center'>
              <Spinner />
            </Flex>
          )}

          {sacNftsRes.data === 0 && (
            <Box my='2rem' maxWidth='300px' mx='auto'>
              <Text variant='minimal'>
                Sorry, you need to have a SAC or NAC staked to join the
                guestlist.
              </Text>
            </Box>
          )}

          {/* Guestlist box, shown after wallet is connected */}
          {sacNftsRes.data && sacNftsRes.data > 0 && (
            <Box my='2rem' maxWidth='300px' mx='auto'>
              <form onSubmit={handleSubmit(upserGuestList as any)}>
                <Text variant='minimal'>
                  Available guestlist spots: {sacNftsRes.data}
                </Text>
                {Array.from(Array(sacNftsRes.data).keys()).map((nft, i) => (
                  <Input
                    key={i}
                    {...register(`guests.${i}`, { required: false })}
                    placeholder={'Name ' + (i + 1)}
                    my='.5rem'
                    borderColor='black'
                    display='block'
                  />
                ))}

                <Box mt='1rem'>
                  <Button
                    type='submit'
                    isLoading={upsertGuestListRes.loading}
                    variant='outlined'
                  >
                    Enter Guestlist
                  </Button>
                </Box>
              </form>
            </Box>
          )}

          {/* Success message */}
          {upsertGuestListRes.value && (
            <Box
              backgroundImage='/images/stroke-green-horizontal.png'
              backgroundRepeat='no-repeat'
              backgroundPosition='center'
              display='flex'
              textAlign='center'
              justifyContent='center'
              alignItems='center'
              height='10rem'
            >
              <Text variant='minimal'>You are on the guestlist!</Text>
            </Box>
          )}
        </Box>
      </Box>
    </MainLayout>
  )
}
