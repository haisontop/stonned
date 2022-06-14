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
  AspectRatio,
  Link,
} from '@chakra-ui/react'
import { BN, Program, Provider } from '@project-serum/anchor'
import { SacStaking } from '../../../../staking/target/types/sac_staking'
import { useUnstake, useStaking, useWithdraw } from './staking.hooks'
import {
  getAllRewardForNft,
  getRewardForNft,
  getRewardInfoForRole,
} from '../../utils/solUtils'
import { useAsync, useInterval } from 'react-use'
import { PublicKey } from '@solana/web3.js'

export const StakedNft: React.FC<{
  stakingAccount: any
  refetchStakingAccounts: () => void
  provider: Provider | null
  wallet: WalletContextState
  program: Program<SacStaking & { metadata: { address: string } }> | null
}> = ({
  stakingAccount,
  refetchStakingAccounts,
  provider,
  wallet,
  program,
}) => {
  const [handleWithDrawRes, handleWithDraw] = useWithdraw(
    provider,
    wallet,
    program
  )

  const role = useMemo(() => {
    const nft = stakingAccount?.nft

    let roleAttribute = nft?.attributes?.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (roleAttribute) return roleAttribute.value as string

    roleAttribute = nft?.attributes?.find(
      (a: any) => a.trait_type === 'Rarity Rank'
    )
    if (roleAttribute) return roleAttribute.value as string

    return ''
  }, [stakingAccount])

  const shockwaveOrAwakened = useMemo(() => {
    const nft = stakingAccount?.nft

    const shockwave = nft?.attributes?.find(
      (a: any) => a.trait_type === 'Shockwave'
    )
    console.log('shockwaver')

    if (shockwave) return shockwave.trait_type as string

    const awakened = nft?.attributes?.find((a: any) => a.value === 'Awakened')
    console.log('awakener', nft?.name, nft?.attributes, awakened)

    if (awakened) return awakened.value as string

    return ''
  }, [stakingAccount])

  const { value: reward } = useAsync(
    async () =>
      getRewardForNft(new PublicKey(stakingAccount.stakeAccount.token)),
    [stakingAccount]
  )
  const { value: allReward } = useAsync(
    async () =>
      getAllRewardForNft(new PublicKey(stakingAccount.stakeAccount.token)),
    [stakingAccount]
  )
  /* 
  const rewardInfo = useMemo(() => getRewardInfoForRole(role), [role]) */

  const [unstakeRes, handleUnstake] = useUnstake(
    provider,
    wallet,
    program,
    refetchStakingAccounts
  )

  const [currentReward, setCurrentReward] = useState(0)

  useInterval(() => {
    const now = new Date().getTime() / 1000
    const lastWithDraw = (
      stakingAccount.stakeAccount.lastWithdraw as BN
    ).toNumber()

    const currentReward = (now - lastWithDraw) * (reward?.perSecond ?? 0)

    setCurrentReward(currentReward)
  }, 1000)

  const [currentAllReward, setCurrentAllReward] = useState(0)

  useInterval(() => {
    const now = new Date().getTime() / 1000
    const lastWithDraw = (
      stakingAccount.stakeAccount.lastWithdraw as BN
    ).toNumber()
    const allStart = 1645391400

    const withdrawStart = allStart - lastWithDraw > 0 ? allStart : lastWithDraw

    const currentAllReward = (now - withdrawStart) * (allReward?.perSecond ?? 0)

    setCurrentAllReward(currentAllReward)
  }, 1000)

  const nft = stakingAccount.nft as any

  return (
    <Box px={['3', '4']} py='4' width='100%'>
      <Center>
        <Box
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
          bgColor='white'
          color='#1a202c'
          boxShadow={'2xl'}
        >
          <Image
            width='100%'
            objectFit={'cover'}
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
              {shockwaveOrAwakened.length > 0 && (
                <Badge
                  borderRadius='12px'
                  colorScheme='blue'
                  lineHeight='tight'
                  paddingX={2}
                  paddingY='2px'
                  size='md'
                  isTruncated
                >
                  {shockwaveOrAwakened}
                </Badge>
              )}
            </HStack>
            <HStack justifyContent='left'>
              <Badge
                borderRadius='12px'
                fontWeight='500'
                paddingX={2}
                paddingY='2px'
                size='sm'
              >
                {reward?.daily} $PUFF / day
              </Badge>
              <Badge
                borderRadius='12px'
                fontWeight='500'
                paddingX={2}
                paddingY='2px'
                size='sm'
              >
                {allReward?.daily} $ALL / day
              </Badge>
            </HStack>

            <Divider />
            <Text fontSize='xs' color='gray.700' fontWeight='600'>
              Current: {currentReward.toFixed(4)} $PUFF
            </Text>
            <Text fontSize='xs' color='gray.700' fontWeight='600'>
              Current: {currentAllReward.toFixed(4)} $ALL
            </Text>
            <Text fontSize='xs' color='gray.700'>
              Check NFT on{' '}
              <Link
                target='_blank'
                textDecoration={'underline'}
                href={`https://solscan.io/token/${stakingAccount.nft.pubkey.toBase58()}`}
              >
                Solscan
              </Link>
            </Text>
            <Flex mt={2} justifyContent='left'>
              <Button
                size='sm'
                isLoading={handleWithDrawRes.loading}
                fontSize='0.75rem'
                colorScheme='teal'
                mt={2}
                onClick={(e) =>
                  handleWithDraw(stakingAccount.stakeAccount.token.toBase58())
                }
              >
                Claim rewards
              </Button>
              <Button
                isLoading={unstakeRes.loading}
                size='sm'
                fontSize='0.75rem'
                colorScheme='teal'
                variant='outline'
                mt={2}
                ml={2}
                onClick={async (e) => {
                  handleUnstake(stakingAccount.stakeAccount.token.toBase58())
                }}
              >
                Unstake
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}

export function UnstakedNft({
  stakingAccount,
  refetchStakingAccounts,
  provider,
  wallet,
  program,
}: {
  stakingAccount: any
  refetchStakingAccounts: () => void
  provider: Provider | null
  wallet: WalletContextState
  program: Program<SacStaking & { metadata: { address: string } }> | null
}) {
  const [stakeRes, stake] = useStaking(
    provider,
    wallet,
    program,
    refetchStakingAccounts
  )
  const role = useMemo(() => {
    let roleAttribute = stakingAccount?.attributes?.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (roleAttribute) return roleAttribute.value as string

    roleAttribute = stakingAccount?.attributes?.find(
      (a: any) => a.trait_type === 'Rarity Rank'
    )
    if (roleAttribute) return roleAttribute.value as string

    return ''
  }, [stakingAccount])

  const shockwaveOrAwakened = useMemo(() => {
    const nft = stakingAccount

    const shockwave = nft?.attributes?.find(
      (a: any) => a.trait_type === 'Shockwave'
    )
    console.log('shockwaver')

    if (shockwave) return shockwave.trait_type as string

    const awakened = nft?.attributes?.find((a: any) => a.value === 'Awakened')
    console.log('awakener', nft?.attributes, awakened)
    if (awakened) return awakened.value as string

    return ''
  }, [stakingAccount])

  const { value: reward } = useAsync(
    async () => getRewardForNft(new PublicKey(stakingAccount.mint)),
    [stakingAccount]
  )

  const { value: allReward } = useAsync(
    async () => getAllRewardForNft(new PublicKey(stakingAccount.mint)),
    [stakingAccount]
  )

  return (
    <Box p={['3', '4']}>
      <Center>
        <Box
          borderWidth='1px'
          borderRadius='lg'
          overflow='hidden'
          bgColor='white'
          color='#1a202c'
          boxShadow={'2xl'}
        >
          <Image
            objectFit={'cover'}
            width='100%'
            src={stakingAccount.image}
            alt={stakingAccount.description || stakingAccount.name}
          />
          <Stack p='2.5'>
            <Heading lineHeight='tight' fontSize='1rem' isTruncated>
              {stakingAccount.name}
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
              {shockwaveOrAwakened.length > 0 && (
                <Badge
                  borderRadius='12px'
                  colorScheme='blue'
                  lineHeight='tight'
                  paddingX={2}
                  paddingY='2px'
                  size='md'
                  isTruncated
                >
                  {shockwaveOrAwakened}
                </Badge>
              )}
            </HStack>
            <HStack justifyContent='left'>
              <Badge
                borderRadius='12px'
                fontWeight='500'
                paddingX={2}
                paddingY='2px'
                size='sm'
              >
                {reward?.daily} $PUFF / day
              </Badge>
              <Badge
                borderRadius='12px'
                fontWeight='500'
                paddingX={2}
                paddingY='2px'
                size='sm'
              >
                {allReward?.daily} $ALL / day
              </Badge>
            </HStack>
            <Divider />
            <Box></Box>
            <Button
              isLoading={stakeRes.loading}
              size='sm'
              fontSize='0.75rem'
              colorScheme='teal'
              mt={2}
              onClick={(e) => stake(stakingAccount.mint)}
            >
              Stake
            </Button>
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}
