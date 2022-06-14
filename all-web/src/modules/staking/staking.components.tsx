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
  Tag,
} from '@chakra-ui/react'
import { BN, Program, Provider } from '@project-serum/anchor'
import { AllStaking } from '../../../../all-staking/target/types/all_staking'
import { useUnstake, useStaking, useWithdraw } from './staking.hooks'
import { getRewardInfoForRole } from '../../utils/solUtils'
import { useInterval } from 'react-use'

export const StakedNft: React.FC<{
  stakingAccount: any
  refetchStakingAccounts: () => void
  provider: Provider | null
  wallet: WalletContextState
  program: Program<AllStaking & { metadata: { address: string } }> | null
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
    const roleAttribute = stakingAccount?.nft?.attributes?.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (!roleAttribute) return ''
    return roleAttribute.value as string
  }, [stakingAccount])

  const rewardInfo = useMemo(() => getRewardInfoForRole(role), [role])

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

    const currentReward =
      (now - lastWithDraw) * getRewardInfoForRole(role).rewardPerSecond

    setCurrentReward(currentReward)
  }, 1000)

  const nft = stakingAccount.nft as any

  return (
    <Box
      rounded='md'
      bg='white'
      padding='.5rem'
      pb='1rem'
      margin='0 auto'
      maxWidth={['unset', '20rem']}
      transition='all .2s ease-in-out'
      _hover={{
        shadow: '2xl',
      }}
    >
      <Box minWidth='300px' minHeight='300px' bg='gray.200'>
        <Image src={nft.image} alt={nft.description || nft.name} rounded='md' />
      </Box>
      <Text color='black' fontWeight='600' margin='.75rem 0'>
        {nft.name}
      </Text>
      <Stack direction='column' spacing='4'>
        <HStack>
          <Tag
            rounded='full'
            // bg={tagBg[props.tag]}
            // color={tagFontColor[props.tag]}
            padding='0 .75rem'
          >
            {role}
          </Tag>
          <Badge
            colorScheme='green'
            borderRadius='12px'
            fontWeight='500'
            paddingX={2}
            paddingY='2px'
            size='sm'
          >
            {rewardInfo?.dailyReward} $ALL / day
          </Badge>
        </HStack>

        <Text fontSize='xs' color='gray.700' fontWeight='600'>
          Current: {currentReward.toFixed(4)}{' '}
          <Text as='span' color='gray.700' fontWeight='600'>
            $ALL
          </Text>
        </Text>

        <Stack direction='row' mt='2rem' w='100%'>
          <Button
            size='sm'
            isLoading={handleWithDrawRes.loading}
            fontSize='0.75rem'
            colorScheme='teal'
            w='100%'
            onClick={(e) =>
              handleWithDraw(stakingAccount.stakeAccount.token.toBase58())
            }
          >
            Claim $ALL
          </Button>
          <Button
            isLoading={unstakeRes.loading}
            size='sm'
            fontSize='0.75rem'
            colorScheme='teal'
            variant='outline'
            w='100%'
            onClick={async (e) => {
              handleUnstake(stakingAccount.stakeAccount.token.toBase58())
            }}
          >
            Unstake
          </Button>
        </Stack>
      </Stack>
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
  program: Program<AllStaking & { metadata: { address: string } }> | null
}) {
  const [stakeRes, stake] = useStaking(
    provider,
    wallet,
    program,
    refetchStakingAccounts
  )
  const role = useMemo(() => {
    const roleAttribute = stakingAccount?.attributes?.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (!roleAttribute) return ''
    return roleAttribute.value as string
  }, [stakingAccount])

  const rewardInfo = useMemo(() => getRewardInfoForRole(role), [role])

  console.log('stakingAccount', stakingAccount)

  return (
    <Box
      rounded='md'
      bg='white'
      padding='.5rem'
      pb='1rem'
      margin='0 auto'
      maxWidth={['unset', '20rem']}
      transition='all .2s ease-in-out'
      _hover={{
        shadow: '2xl',
      }}
    >
      <Box minWidth='300px' minHeight='300px' bg='gray.200'>
        <Image
          src={stakingAccount.image}
          alt={stakingAccount.description || stakingAccount.name}
          rounded='md'
        />
      </Box>
      <Text color='black' fontWeight='600' margin='.75rem 0'>
        {stakingAccount.name}
      </Text>
      <Stack direction='column' spacing='4'>
        <HStack>
          <Tag
            rounded='full'
            // bg={tagBg[props.tag]}
            // color={tagFontColor[props.tag]}
            padding='0 .75rem'
          >
            {role}
          </Tag>
          <Badge
            colorScheme='green'
            borderRadius='12px'
            fontWeight='500'
            paddingX={2}
            paddingY='2px'
            size='sm'
          >
            {rewardInfo?.dailyReward} $ALL / day
          </Badge>
        </HStack>

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
  )
}
