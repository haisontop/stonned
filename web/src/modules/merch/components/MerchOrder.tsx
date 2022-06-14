import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import { z } from 'zod'
import { GradientButton } from '../../../components/GradientButton'
import { LabelText } from '../../../components/Texts/LabelText'
import { MerchDropContext, MerchDropStatus } from '../MerchDropContextProvider'
import { selectedProductTokensAtom } from '../merchUtils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWallet } from '@solana/wallet-adapter-react'
import { merchConfig } from '../merchConfig'
import { pub } from '../../../utils/solUtils'
import { Transaction, TransactionInstruction } from '@solana/web3.js'
import { createTransferInstruction } from '../../../utils/splUtils'
import { connection } from '../../../config/config'
import rpc from '../../../utils/rpc'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const validationSchema = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  email: z.string().email(),
  street: z.string().nonempty(),
  zip: z.string().nonempty(),
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  country: z.string().nonempty(),
  note: z.string(),
})

export default function MerchOrder() {
  const wallet = useWallet()
  const [selectedProductToken, setSelectedProductToken] = useRecoilState(
    selectedProductTokensAtom
  )
  const router = useRouter()
  const handleOrder = async (values: z.infer<typeof validationSchema>) => {
    if (!wallet.publicKey || !selectedProductToken || !wallet.signTransaction)
      return
    try {
      const user = wallet.publicKey
      const nfts = selectedProductToken.map((p) => p.nft.pubkey)
      console.log('values', values)
      const instructions: TransactionInstruction[] = []
      for (const nft of nfts) {
        const transferNftInstructions = await createTransferInstruction({
          from: user,
          to: merchConfig.burnerWallet,
          mint: nft,
          amount: 1,
          payer: user,
        })
        instructions.push(...transferNftInstructions)
      }

      const blockhash = await connection.getRecentBlockhash()
      const transaction = new Transaction({
        recentBlockhash: blockhash.blockhash,
        feePayer: user,
      }).add(...instructions)

      await wallet.signTransaction(transaction)

      const res = await rpc.mutation('merch.swapCbd', {
        trans: transaction.serialize({ requireAllSignatures: false }).toJSON(),
        order: { wallet: user.toBase58(), ...values },
        products: nfts.map((n) => n.toBase58()),
      })

      toast.success('swaped your nfts', { duration: 10000 })

      window.open('/store/orders')
    } catch (e: any) {
      if (e.message.includes('0x1')) {
        toast.error('You miss some funds')
      } else {
        toast.error(e.message)
      }
      console.error('error in swapCbd', e)
    }
  }

  const [productTokens, setProductToken] = useRecoilState(
    selectedProductTokensAtom
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validationSchema) })

  console.log('errors', errors)

  return (
    <Container
      pt={['3rem', '6rem']}
      pos='relative'
      maxWidth='5xl'
      justifyContent='center'
      alignItems='center'
      mx={[4, 20]}
    >
      <Grid templateColumns={'repeat(5, 1fr)'}>
        <GridItem colSpan={4}>
          <Stack spacing={[12]} alignItems='start'>
            <Stack spacing={0} textAlign='left' mt={['28px', 0]}>
              <Text
                fontSize={[36]}
                mt='6px'
                mb={4}
                lineHeight='130%'
                fontWeight={600}
              >
                Products
              </Text>
              {productTokens.map((productToken, i) => (
                <Text key={i}>1 {productToken.nft.name}</Text>
              ))}
            </Stack>

            <Stack spacing={6}>
              <Text fontSize={[36]} mt='6px' lineHeight='130%' fontWeight={600}>
                Where should we ship your order?
              </Text>

              <form onSubmit={handleSubmit(handleOrder as any)}>
                <Grid
                  templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                  gap={6}
                >
                  <GridItem>
                    <Input
                      {...register('firstname', { required: true })}
                      isInvalid={errors['firstname']}
                      type='text'
                      placeholder='First Name'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>
                  <GridItem>
                    <Input
                      {...register('lastname')}
                      isInvalid={errors['lastname']}
                      type='text'
                      placeholder='Last Name'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>
                  <GridItem>
                    <Input
                      mb='1.5rem'
                      {...register('email')}
                      isInvalid={errors['email']}
                      type='text'
                      placeholder='Email Address'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>
                </Grid>

                <Grid templateColumns={'repeat(2, 1fr)'} columnGap={6} mt={4}>
                  <GridItem>
                    <Input
                      {...register('street')}
                      isInvalid={errors['street']}
                      mb='1.5rem'
                      type='text'
                      placeholder='Street and Number'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>
                  <GridItem>
                    <Input
                      {...register('zip')}
                      isInvalid={errors['zip']}
                      mb='1.5rem'
                      type='text'
                      placeholder='Postal Code'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>
                  <GridItem>
                    <Input
                      {...register('city')}
                      isInvalid={errors['city']}
                      mb='1.5rem'
                      type='text'
                      placeholder='City'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>{' '}
                  <GridItem>
                    <Input
                      {...register('state')}
                      isInvalid={errors['state']}
                      mb='1.5rem'
                      type='text'
                      placeholder='State'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>
                  <GridItem>
                    <Input
                      {...register('country')}
                      isInvalid={errors['country']}
                      mb='1.5rem'
                      type='text'
                      placeholder='Country'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>
                </Grid>

                <Grid templateColumns={'repeat(2, 1fr)'} columnGap={6} mt={4}>
                  <GridItem>
                    <Textarea
                      {...register('note')}
                      isInvalid={errors['note']}
                      placeholder='Note'
                      _placeholder={{
                        color: '#A0A0A0',
                      }}
                      _hover={{
                        shadow: 'lg',
                      }}
                      _focus={{
                        shadow: 'lg',
                      }}
                      border='1px solid #CBCBCB'
                      color={'#000'}
                      transition='all .2s ease-in-out'
                    />
                  </GridItem>
                </Grid>

                <Stack spacing={8} width='90%' mt={12}>
                  <GradientButton
                    backgroundColor='#FAFAFA'
                    gradientDirection='left'
                    variant='solid'
                    type='submit'
                    width='fit-content'
                    isLoading={isSubmitting}
                  >
                    Place Order
                  </GradientButton>

                  {isSubmitting && (
                    <Text>
                      This transaction may take up to 60 sec, due baked
                      sysadmins & loading all staking accounts. Please don't
                      close this window.{' '}
                    </Text>
                  )}
                  <LabelText fontWeight={500} color='#000' textAlign={'left'}>
                    We will send you an email as soon as your box is on its way.
                    By clicking on 'Place Order', you finalize and submit your
                    order.
                  </LabelText>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  )
}

function useNavigate() {
  throw new Error('Function not implemented.')
}
