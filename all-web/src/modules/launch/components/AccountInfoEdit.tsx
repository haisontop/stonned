import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useColorModeValue } from '@chakra-ui/system'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '../../../modules/common/authHooks'
import toast from 'react-hot-toast'
import { trpc } from '../../../utils/trpc'

interface AccountInfoEditProps {}

const validationSchema = z.object({
  username: z.string().nullish(),
  email: z.string().email().nullish(),
  twitterUrl: z.string().nullish(),
})

export default function AccountInfoEdit(props: AccountInfoEditProps) {
  const editMutation = trpc.useMutation('launch.editUser', {})

  const inputBg = useColorModeValue('#fff', '#101011')
  const inputColor = useColorModeValue('#000', '#fff')
  const { data } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      username: data?.username,
      email: data?.email,
      twitterUrl: data?.twitterUrl,
    },
  })

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    try {
      const res = await editMutation.mutateAsync({
        ...values,
      })
      toast.success('successfully updated')
    } catch (e) {
      toast.error('failed')
    }
  }

  return (
    <Stack spacing='2.375rem'>
      <Heading fontSize={'1.5rem'} fontWeight={600}>
        Edit Account Information
      </Heading>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <Grid
          templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
          gap={['2rem', 0]}
        >
          <GridItem colSpan={1}>
            <Grid
              templateColumns={'repeat(1, 1fr)'}
              gap={'1rem'}
              maxW={'26.25rem'}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...register('username', { required: true })}
                    isInvalid={!!errors['username']}
                    type='text'
                    placeholder='Username'
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
                    transition='all .2s ease-in-out'
                    color={inputColor}
                    bg={inputBg}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...register('email')}
                    isInvalid={!!errors['email']}
                    type='text'
                    placeholder='Email'
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
                    color={inputColor}
                    bg={inputBg}
                    transition='all .2s ease-in-out'
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Twitter Handle</FormLabel>
                  <Input
                    {...register('twitterUrl')}
                    isInvalid={!!errors['twitterUrl']}
                    type='text'
                    placeholder='Twitter Handle'
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
                    color={inputColor}
                    bg={inputBg}
                    transition='all .2s ease-in-out'
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={1} display='flex' alignItems={'center'}>
            <Text
              color='#888888'
              fontSize={'0.875rem'}
              fontWeight={500}
              maxW={'30rem'}
              ml={[0, '3rem']}
            >
              We can send you email notificaitons for mints on your saved list
              and invites to Whitelists. You can manage these notifications
              below. No Ads, promise.
            </Text>
          </GridItem>
        </Grid>

        <HStack spacing={4} mt={6}>
          <Button
            type='submit'
            width='fit-content'
            isLoading={isSubmitting}
            rounded='md'
            colorScheme={'gray'}
            background='#393E46'
            variant='solid'
            color='#fff'
            border='unset'
          >
            Save
          </Button>
        </HStack>
      </form>
    </Stack>
  )
}
