import {
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useColorModeValue } from '@chakra-ui/system'
import { zodResolver } from '@hookform/resolvers/zod'

interface WalletListItemProps {
  title: string
  address: string
}

const validationSchema = z.object({
  title: z.string().nonempty(),
  address: z.string().nonempty(),
})

export default function WalletListItem(props: WalletListItemProps) {
  const cardBg = useColorModeValue('#fff', '#101011')
  const { title, address } = props
  const [editing, setEditing] = useState(false)
  const linkColor = useColorModeValue('#393E46', '#888888')

  const handleOrder = async (values: z.infer<typeof validationSchema>) => {}

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validationSchema) })

  return (
    <Stack
      boxShadow={'0px 2px 10px rgba(0, 0, 0, 0.15)'}
      borderRadius={5}
      width={['100%', '25rem']}
      padding='1.5rem 1rem'
      bg={cardBg}
    >
      {editing ? (
        <form onSubmit={handleSubmit(handleOrder as any)}>
          <Grid templateColumns={['repeat(1, 1fr)']} gap={6}>
            <GridItem>
              <Input
                {...register('title', { required: true })}
                isInvalid={errors['title']}
                type='text'
                placeholder='Wallet Name'
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
                {...register('address')}
                isInvalid={errors['address']}
                type='text'
                placeholder='Wallet Address'
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

          <HStack spacing={4} mt={4} justifyContent='end'>
            <Button
              variant='link'
              rounded={'unset'}
              border='unset'
              color='#393E46'
              fontSize={'0.875rem'}
              textDecoration={'underline'}
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              width='fit-content'
              isLoading={isSubmitting}
              rounded='md'
              colorScheme={'gray'}
              background='#393E46'
              variant='solid'
              color='#fff'
            >
              Save
            </Button>
          </HStack>
        </form>
      ) : (
        <>
          <HStack justifyContent={'space-between'}>
            <Text fontSize={'1.125rem'} fontWeight={600}>
              {title}
            </Text>
            <Button
              variant='link'
              rounded={'unset'}
              border='unset'
              color={linkColor}
              fontSize={'0.875rem'}
              textDecoration={'underline'}
              onClick={() => setEditing(true)}
              fontWeight={400}
            >
              Edit
            </Button>
          </HStack>
          <Text fontSize={'0.875rem'}>{address}</Text>
        </>
      )}
    </Stack>
  )
}
