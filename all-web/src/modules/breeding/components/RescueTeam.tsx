import React, { useMemo } from 'react'
import { Badge, Flex, Grid, HStack, Stack } from '@chakra-ui/layout'
import { Box, Button, Heading, Image } from '@chakra-ui/react'
import { useBreedingAccounts } from '../breeding.hooks'
import { addDays } from 'date-fns'
import Countdown from 'react-countdown'

export function RescueTeam({
  breedingAccount,
  onReveal,
  loading,
}: {
  breedingAccount: NonNullable<
    ReturnType<typeof useBreedingAccounts>['value']
  >[0]
  onReveal: () => void
  loading?: boolean
}) {
  const roles = useMemo(() => {
    return breedingAccount.apes.map((ape) => {
      const roleAttribute = ape.attributes.find(
        (a: any) => a.trait_type === 'Role'
      )
      if (!roleAttribute) return ''
      return roleAttribute.value as string
    })
  }, [breedingAccount])

  const revealDate = useMemo(() => {
    if (!breedingAccount) return new Date()

    const revealDate = addDays(
      new Date(
        breedingAccount.breedingAccount.account.startBreeding.toNumber() * 1000
      ),
      3
    )

    return revealDate
  }, [breedingAccount])

  /* const rewardInfo = useMemo(() => getRewardInfoForRole(role), [role]) */

  return (
    <Stack>
      <Stack direction='row' p='3'>
        <Box
          borderRadius='lg'
          overflow='hidden'
          bgColor='white'
          color='#1a202c'
          boxShadow={'2xl'}
          transition='ease-in-out all .25s'
        >
          <Stack>
            <Heading
              textAlign={'center'}
              lineHeight='tight'
              fontFamily={'body'}
              fontWeight={800}
              size='md'
              mt={2}
            >
              Your Rescue Team
            </Heading>
          </Stack>
          <Stack direction='row' spacing={0}>
            <Box>
              <Image
                height='160px'
                maxWidth='160px'
                transition='ease-in-out all .25s'
                _hover={{}}
                borderRadius='12px'
                border='2px solid #fff'
                ml={2}
                mr={1}
                src={breedingAccount.apes[0].image}
              />
              <Stack p='2.5'>
                <Heading
                  whiteSpace={'normal'}
                  wordBreak='break-word'
                  lineHeight='tight'
                  fontFamily={'body'}
                  fontWeight={800}
                  size='xs'
                >
                  {breedingAccount.apes[0].name.replace('Stoned Ape', 'SAC')}
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
                    {roles[0]}
                  </Badge>
                </HStack>
              </Stack>
            </Box>
            <Box>
              <Image
                height='160px'
                maxWidth='160px'
                transition='ease-in-out all .25s'
                _hover={{}}
                borderRadius='12px'
                border='2px solid #fff'
                mr={2}
                ml={1}
                src={breedingAccount.apes[1].image}
              />
              <Stack p='2.5' maxWidth='150px'>
                <Heading
                  whiteSpace={'normal'}
                  lineHeight='tight'
                  fontFamily={'body'}
                  fontWeight={800}
                  size='xs'
                  isTruncated
                >
                  {breedingAccount.apes[1].name.replace('Stoned Ape', 'SAC')}
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
                    {roles[1]}
                  </Badge>
                </HStack>
              </Stack>
            </Box>
          </Stack>
          {new Date().getTime() > revealDate.getTime() ? (
              <Stack p={2}>
                <Heading textAlign='center' size='md' color='gray.500'>
                  Ready to Reveal
                </Heading>
                <Button
                  isLoading={loading}
                  size='sm'
                  fontSize='0.75rem'
                  colorScheme='teal'
                  mt={2}
                  onClick={(e) => onReveal()}
                >
                  Reveal
                </Button>
              </Stack>
            ) : (
              <Stack justifyContent='center' d='flex' spacing={0} pb={2}>
                <Heading size='md' color='gray.500' textAlign='center'>
                  Ready To Reveal In
                </Heading>
                <Heading size='lg' color='gray.700' textAlign='center'>
                  <Countdown daysInHours={true} date={revealDate} />
                </Heading>
              </Stack>
            )}
        </Box>
      </Stack>
    </Stack>
  )
}
