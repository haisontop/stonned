import { HStack, Skeleton, SkeletonText, Stack } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/system'

const WalletProjectCardSkeleton = () => {
  const cardBg = useColorModeValue('#fff', '#101011')

  return (
    <Stack
      width={'15.625rem'}
      minWidth={'15.625rem'}
      spacing={2}
      alignItems='flex-start'
      borderRadius={'10px'}
      boxShadow='0px 2px 10px rgba(0, 0, 0, 0.15)'
      p={2}
      my={1}
      mx={2}
      bg={cardBg}
    >
      <Skeleton height='13rem' borderRadius='5px' width='100%' />
      <Stack spacing={1} width='100%'>
        <Skeleton height='1rem' width='70%' />
        <Skeleton height='.75rem' width='50%' />
      </Stack>
      <HStack justifyContent={'space-between'} width='100%' mt='1rem'>
        <SkeletonText noOfLines={2} spacing={1} width='30%' />
        <SkeletonText
          noOfLines={2}
          spacing={1}
          width='30%'
          display={'flex'}
          alignItems='flex-end'
          flexDirection={'column'}
        />
      </HStack>
    </Stack>
  )
}

export default WalletProjectCardSkeleton
