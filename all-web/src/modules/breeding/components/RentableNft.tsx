import React, { useMemo } from 'react'
import { Badge, HStack, Stack } from '@chakra-ui/layout'
import {
  Box,
  Button,
  Heading,
  Center,
  Image,
} from '@chakra-ui/react'
import { getRewardInfoForRole } from '../../../utils/solUtils'
import { useRentableAccounts } from '../breeding.hooks'

export function RentableNft({
  rentAccount,
  refetchEvolutionAccounts,
  onSelect,
  selected,
}: {
  rentAccount: NonNullable<ReturnType<typeof useRentableAccounts>['value']>[0]
  refetchEvolutionAccounts: () => void
  onSelect?: () => void
  selected?: boolean
}) {
  const nft = rentAccount.nft

  const role = useMemo(() => {
    const roleAttribute = rentAccount?.nft.attributes.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (!roleAttribute) return ''
    return roleAttribute.value as string
  }, [rentAccount])

  const rewardInfo = useMemo(() => getRewardInfoForRole(role), [role])

  return (
    <Box p='4'>
      <Center>
        <Box
          borderRadius='lg'
          overflow='hidden'
          bgColor='white'
          color='#1a202c'
          boxShadow={'2xl'}
          transition='ease-in-out all .25s'
          border={selected ? '15px green solid' : undefined}
        >
          <Image
            height='300px'
            maxWidth='300px'
            transition='ease-in-out all .25s'
            _hover={{}}
            src={nft.image}
            alt={nft.description || nft.name}
          />
          <Stack p='2.5'>
            <Heading lineHeight='tight' size='md' isTruncated>
              {nft.name}
            </Heading>
            <HStack justifyContent='left'>
              <Badge
                borderRadius='12px'
                colorScheme='teal'
                lineHeight='tight'
                paddingX={2}
                paddingY='2px'
                size='md'
                isTruncated
              >
                {role}
              </Badge>
            </HStack>
            <Button
              size='sm'
              fontSize='0.75rem'
              colorScheme='gray'
              mt={2}
              /* isLoading={startEvolutionRes.loading}
              onClick={(e) => startEvolution(nft.mint, false)} */
              onClick={(e) => {
                if (onSelect) onSelect()
              }}
            >
              Select for Renting
            </Button>
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}
