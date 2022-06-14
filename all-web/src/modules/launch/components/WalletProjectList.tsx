import {
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  Wrap,
} from '@chakra-ui/react'
import React from 'react'
import { useQuery } from 'react-query'
import WalletProjectCard from './WalletProjectCard'
import WalletProjectCardSkeleton from './WalletProjectCardSkeleton'

export default function WalletProjectList() {
  const { data, isLoading } = useQuery(['mintedProject'], async () => {
    await new Promise((resolve) => setTimeout(() => resolve(null), 5000))
    return Array.from(Array(10).keys())
  })
  const linkColor = useColorModeValue('#393E46', '#888888')

  return (
    <Stack spacing='2rem'>
      <HStack
        width={'100%'}
        justifyContent='space-between'
        alignItems={'center'}
      >
        <Heading fontSize={'1.5rem'} fontWeight={600}>
          Your Minted Projects
        </Heading>
        <Button
          variant='link'
          rounded={'unset'}
          border='unset'
          color={linkColor}
          fontSize={'0.875rem'}
          textDecoration={'underline'}
          fontWeight={400}
        >
          See all
        </Button>
      </HStack>

      <Wrap spacing={'1.5rem'}>
        {isLoading
          ? [0, 1, 2, 3].map((v, i) => (
              <WalletProjectCardSkeleton key={`${v}-${i}`} />
            ))
          : data?.map((item) => (
              <WalletProjectCard
                key={item}
                title='Stoned Ape Crew'
                subtitle='Stoned Ape Crew'
                mintedCount={2}
                mintPrice={0.69}
                mintCurrency='SQL'
                imageURL='/images/sac270.png'
              />
            ))}
      </Wrap>
    </Stack>
  )
}
