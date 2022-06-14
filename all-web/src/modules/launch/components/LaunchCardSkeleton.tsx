import {
  Box,
  Center,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from '@chakra-ui/react'

export const LaunchCardSkeleton = () => {
  return (
    <Stack
      boxShadow='0px 2px 10px rgba(0, 0, 0, 0.15)'
      borderRadius='10px'
      spacing={0}
      maxWidth='300px'
      width={'100%'}
      overflow={'hidden'}
      _hover={{ cursor: 'pointer' }}
    >
      <Flex
        p='0.75rem 1rem'
        justifyContent={'space-between'}
        alignItems='center'
      >
        <HStack>
          <SkeletonCircle size={'2rem'} />
          <SkeletonText noOfLines={1} width='6rem' />
        </HStack>
        <SkeletonCircle size={'1.5rem'} />
      </Flex>
      <Box height='200px'>
        <Skeleton w='100%' height={'100%'} />
      </Box>
      <Box p='1rem 1rem'>
        <SkeletonText noOfLines={5} spacing={3} w='100%' />
      </Box>
    </Stack>
  )
}
