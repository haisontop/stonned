import React, { useMemo, useState } from 'react'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Badge, Flex, HStack, Stack } from '@chakra-ui/layout'
import {
  Box,
  Button,
  Heading,
  Center,
  Divider,
  Image,
  Text,
} from '@chakra-ui/react'
import { BN, Program, Provider } from '@project-serum/anchor'
import { SacStaking } from '../../../../staking/target/types/sac_staking'
import { getRewardInfoForRole } from '../../utils/solUtils'
import { useInterval } from 'react-use'
import { useReveal, useStartEvolution } from './evolution.hooks'
import { Evolution } from '../../../../evolution/target/types/evolution'
import Countdown from 'react-countdown'
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types'
import { addDays } from 'date-fns'

export function SacNftCard({
  evolutionAccount,
  refetchEvolutionAccounts,
  provider,
  wallet,
  program,
}: {
  evolutionAccount: any
  refetchEvolutionAccounts: () => void
  provider: Provider | null
  wallet: WalletContextState
  program: Program<Evolution & { metadata: { address: string } }> | null
}) {
  const [startEvolutionRes, startEvolution] = useStartEvolution(
    provider,
    wallet,
    program,
    refetchEvolutionAccounts
  )
  const [startDMTEvolutionRes, startDMTEvolution] = useStartEvolution(
    provider,
    wallet,
    program,
    refetchEvolutionAccounts
  )

  const [startAyahuascaEvolutionRes, startAyahuascaEvolution] =
    useStartEvolution(provider, wallet, program, refetchEvolutionAccounts)

  const nft = evolutionAccount

  const role = useMemo(() => {
    const roleAttribute = nft?.attributes?.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (!roleAttribute) return ''
    return roleAttribute.value as string
  }, [evolutionAccount])

  const rewardInfo = useMemo(() => getRewardInfoForRole(role), [role])

  if (role !== 'Chimpion') return null

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
            <Heading lineHeight='tight' fontSize='1rem' isTruncated>
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
              isLoading={startEvolutionRes.loading}
              size='sm'
              fontSize='0.75rem'
              colorScheme='gray'
              border='none'
              mt={2}
              onClick={(e) => startEvolution(nft.mint, false, false)}
            >
              Send on Retreat (60%)
            </Button>
            <Button
              isLoading={startDMTEvolutionRes.loading}
              size='sm'
              fontSize='0.75rem'
              colorScheme='gray'
              border='none'
              mt={2}
              onClick={(e) => startDMTEvolution(nft.mint, true, false)}
            >
              Send on DMT Retreat (80%)
            </Button>
            <Button
              isLoading={startAyahuascaEvolutionRes.loading}
              size='sm'
              fontSize='0.75rem'
              colorScheme='teal'
              mt={2}
              onClick={(e) => startAyahuascaEvolution(nft.mint, false, true)}
            >
              Send on Ayahuasca Retreat (100%)
            </Button>
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}

export function SacOnRetreat({
  evolutionAccount,
  refetchEvolutionAccounts,
  provider,
  wallet,
  program,
}: {
  evolutionAccount: any
  refetchEvolutionAccounts: () => void
  provider: Provider | null
  wallet: WalletContextState
  program: Program<Evolution & { metadata: { address: string } }> | null
}) {
  const [revealEvolutionRes, revealEvolution] = useReveal(
    provider,
    wallet,
    program,
    refetchEvolutionAccounts
  )

  const nft = evolutionAccount.nft

  const role = useMemo(() => {
    const roleAttribute = nft?.attributes?.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (!roleAttribute) return ''
    return roleAttribute.value as string
  }, [evolutionAccount])

  const rewardInfo = useMemo(() => getRewardInfoForRole(role), [role])

  /* if (role !== 'Chimpion') return null */

  const revealDate = useMemo(() => {
    if (!evolutionAccount) return new Date()

    const revealDate = addDays(
      new Date(
        evolutionAccount.evolutionAccount.startEvolution.toNumber() * 1000
      ),
      3
    )

    return revealDate
  }, [evolutionAccount])
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
        >
          <Box position='relative'>
            <Image
              height='300px'
              maxWidth='300px'
              transition='ease-in-out all .25s'
              _hover={{}}
              src={nft.image}
              alt={nft.description || nft.name}
            />
            <Box
              d='flex'
              alignItems='center'
              justifyContent='center'
              position='absolute'
              left={0}
              top={0}
              width='100%'
              height='100%'
              background={'rgba(111, 207, 151, 0.4)'}
            >
              <Heading
                color='white'
                fontSize='140px'
                textAlign='center'
                fontFamily='monospace'
              >
                ?
              </Heading>
            </Box>
          </Box>
          <Stack p='2.5'>
            <Heading lineHeight='tight' fontSize='1rem' isTruncated>
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
            {new Date().getTime() > revealDate.getTime() ? (
              <Stack>
                <Heading textAlign='center' size='sm' color='gray.500'>
                  Ready to reveal!
                </Heading>
                <Button
                  isLoading={revealEvolutionRes.loading}
                  size='sm'
                  fontSize='0.75rem'
                  colorScheme='teal'
                  mt={2}
                  onClick={(e) => revealEvolution(nft.pubkey)}
                >
                  Reveal
                </Button>
                <Button
                  as='a'
                  target='_blank'
                  href={`https://solscan.io/token/${nft.pubkey.toBase58()}?cluster=devnet`}
                >
                  Solscan
                </Button>
              </Stack>
            ) : (
              <Stack justifyContent='center' d='flex' spacing={0}>
                <Heading size='sm' color='gray.500' textAlign='center'>
                  Ready To Reveal In
                </Heading>
                <Heading size='md' color='gray.700' textAlign='center'>
                  <Countdown daysInHours={true} date={revealDate} />
                </Heading>
              </Stack>
            )}

            <Box></Box>
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}
