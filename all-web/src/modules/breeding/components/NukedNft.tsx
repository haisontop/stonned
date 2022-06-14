import React, { useMemo, useState } from 'react'
import { Badge, Flex, HStack, Stack } from '@chakra-ui/layout'
import {
  Box,
  Button,
  Heading,
  Center,
  Image,
  IconButton,
} from '@chakra-ui/react'
import { getRewardInfoForRole } from '../../../utils/solUtils'
import { NftMetadata } from '../../../utils/nftmetaData.type'
import { CloseIcon } from '@chakra-ui/icons'

export function NukedNft({
  nft,
  onSelect,
  selected,
  buttonText,
  height,
  width,
}: {
  nft: NftMetadata
  selected?: boolean
  buttonText?: string
  height?: React.ComponentProps<typeof Image>['height']
  width?: React.ComponentProps<typeof Image>['height']
  onSelect?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const role = useMemo(() => {
    const roleAttribute = nft?.attributes?.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (!roleAttribute) return ''
    return roleAttribute.value as string
  }, [nft])

  const rewardInfo = useMemo(() => getRewardInfoForRole(role), [role])

  return (
    <Box p='3'>
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
            height={height ?? '300px'}
            maxWidth={width ?? '300px'}
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
            {buttonText && (
              <Button
                size='sm'
                fontSize='0.75rem'
                colorScheme='gray'
                mt={2}
                onClick={async (e) => {
                  if (onSelect) {
                    setLoading(true)
                    await onSelect()
                    setLoading(false)
                  }
                }}
                isLoading={loading}
              >
                {buttonText}
              </Button>
            )}
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}

export function NukedNftToSelect({
  headerText,
  nft,
  onSelect,
  unSelect,
  selected,
  buttonText,
}: {
  headerText: string
  nft?: NftMetadata
  selected?: boolean
  buttonText?: string
  onSelect?: () => void
  unSelect?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const role = useMemo(() => {
    const roleAttribute = nft?.attributes?.find(
      (a: any) => a.trait_type === 'Role'
    )
    if (!roleAttribute) return ''
    return roleAttribute.value as string
  }, [nft])

  return (
    <Box p='4'>
      <Center>
        <Box
          borderRadius='md'
          overflow='hidden'
          background='rgba(255, 255, 255, 0.3)'
          color='white'
          boxShadow='lg'
          transition='ease-in-out all .25s'
          border={selected ? '15px green solid' : undefined}
          _hover={{
            boxShadow: '2xl',
            background: 'rgba(255, 255, 255, 0.4)'
          }}
        >
          <Stack p={3}>
            <Heading
              fontFamily={'body'}
              lineHeight='tight'
              textAlign={'center'}
              size='md'
              fontWeight={800}
              isTruncated
            >
              {headerText}
            </Heading>
          </Stack>
          <Box position='relative' zIndex={1} textAlign='center'>
            {nft && (<IconButton
              position={'absolute'}
              zIndex={2}
              size={'sm'}
              colorScheme='whiteAlpha'
              borderRadius={'lg'}
              top='10px'
              right='1.5rem'
              aria-label='close'
              icon={<CloseIcon />}
              onClick={(e) => {
                if (unSelect) unSelect()
              }}
            />)}
            <Image
              display='inline-block'
              margin='0 1rem'
              height={['250px', '300px']}
              maxWidth={['250px', '300px']}
              transition='ease-in-out all .25s'
              _hover={{}}
              src={nft?.image ?? '/images/hero-placeholder.png'}
              alt={nft?.description ?? 'Ape to select'}
              borderRadius='md'
            />
            {!nft && (
              <Flex
                _hover={{
                  cursor: 'pointer',
                }}
                onClick={async (e) => {
                  if (onSelect) {
                    setLoading(true)
                    await onSelect()
                    setLoading(false)
                  }
                }}
                position='absolute'
                top={0}
                justifyContent={'center'}
                alignItems={'center'}
                zIndex={2}
                flex='1'
                width='100%'
                height={'100%'}
              >
                <Heading
                  fontFamily={'body'}
                  lineHeight='tight'
                  size='3xl'
                  fontWeight={800}
                  isTruncated
                >
                  ?
                </Heading>
              </Flex>
            )}
          </Box>

          <Stack p='2.5'>
            {buttonText && !nft && (
              <Button
                size='sm'
                fontSize='lg'
                colorScheme='primary'
                onClick={async (e) => {
                  if (onSelect) {
                    setLoading(true)
                    await onSelect()
                    setLoading(false)
                  }
                }}
                isLoading={loading}
              >
                {buttonText}
              </Button>
            )}
            {nft?.pubkey && (
              <>
                <Heading
                  lineHeight='tight'
                  size='sm'
                  fontFamily={'body'}
                  ml={1}
                  fontWeight={900}
                  isTruncated
                >
                  {nft.name}
                </Heading>
                <HStack justifyContent='left'>
                  <Badge
                    borderRadius='12px'
                    colorScheme='teal'
                    lineHeight='tight'
                    ml={1}
                    paddingX={2}
                    paddingY='2px'
                    size='md'
                    isTruncated
                  >
                    {role}
                  </Badge>
                </HStack>
              </>
            )}
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}
