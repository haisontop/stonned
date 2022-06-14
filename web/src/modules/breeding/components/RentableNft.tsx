import React, { useMemo, useState } from 'react'
import { Badge, HStack, Stack } from '@chakra-ui/layout'
import { Box, Button, Heading, Center, Image } from '@chakra-ui/react'
import { getRewardInfoForRole } from '../../../utils/solUtils'
import { TApeUsed, useRentableAccounts } from '../breeding.hooks'
import { addDays } from 'date-fns'
import Countdown from 'react-countdown'

export function RentableNft({
  rentAccount,
  refetchEvolutionAccounts,
  apesUsedAll,
  onSelect,
  selected,
}: {
  rentAccount: NonNullable<ReturnType<typeof useRentableAccounts>['value']>[0]
  refetchEvolutionAccounts: () => void
  apesUsedAll?: TApeUsed[]
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

  const [nextRescueStart, setNextRescueStartDate] = useState<Date>()
  const [isActive, setActive] = useState(true)
  const [apeUsed, setApeUsed] = useState<TApeUsed>()

  useMemo(() => {
    if (apesUsedAll) {
      const apeUsed = apesUsedAll.find((apeUsed) => {
        return apeUsed.account.mint.toBase58() === nft.pubkey.toBase58()
      })

      console.log({ apeUsed })

      if (!apeUsed) return

      setApeUsed(apeUsed)

      const lastUseStartDate = new Date(
        apeUsed?.account.lastUseStart.toNumber() * 1000
      )
      if (addDays(lastUseStartDate, 10).getTime() - new Date().getTime() > 0) {
        setNextRescueStartDate(addDays(lastUseStartDate, 10))
        setActive(false)
      }
    }
  }, [nft, apesUsedAll?.length])

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
              {apeUsed && apeUsed.account?.counter && (
                <Badge
                  borderRadius='12px'
                  colorScheme='gray'
                  lineHeight='tight'
                  paddingX={2}
                  paddingY='2px'
                  size='md'
                  isTruncated
                >
                  Used count: {apeUsed?.account.counter}
                </Badge>
              )}
            </HStack>

            {isActive && (
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
            )}
            {!isActive && (
              <Box>
                <Heading
                  textAlign='center'
                  fontWeight={'bold'}
                  fontSize='xl'
                  color='black'
                >
                  Available in
                </Heading>
                <Heading
                  size='lg'
                  color='gray.600'
                  fontWeight='semibold'
                  textAlign='center'
                >
                  <Countdown
                    daysInHours={true}
                    date={nextRescueStart}
                    onComplete={() => setActive(true)}
                  />
                </Heading>
              </Box>
            )}
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}
