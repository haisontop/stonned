import { Avatar, Box, HStack, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { useColorModeValue } from '@chakra-ui/system'
import MedalIcon from './icons/MedalIcon'

interface CreatorWithAvatarProps {
  name: string
  avatarURL?: string
  isAwarded?: boolean
  size?: 'sm' | 'md'
  showSuper?: boolean
}

export default function CreatorWithAvatar(props: CreatorWithAvatarProps) {
  const { name, avatarURL, isAwarded, size = 'md', showSuper } = props

  const titleColor = useColorModeValue('#000', '#fff')

  const fontSize = React.useMemo(() => {
    if (size === 'sm') {
      return ['0.875rem']
    }

    if (size === 'md') {
      return ['0.875rem', '1.5rem']
    }
  }, [size])

  const avatarSize = React.useMemo(() => {
    if (size === 'sm') {
      return 'sm'
    }

    if (size === 'md') {
      return 'md'
    }
  }, [size])

  return (
    <HStack spacing={4}>
      <Box position='relative'>
        <Avatar name={name} src={avatarURL} size={avatarSize} />
        {isAwarded && (
          <Box position={'absolute'} bottom={-1} right={-1}>
            <MedalIcon />
          </Box>
        )}
      </Box>
      <Stack spacing={1}>
        <Text
          fontSize={fontSize}
          color={titleColor ? titleColor : 'white'}
          fontWeight={500}
        >
          {name}
        </Text>
        {showSuper && isAwarded && (
          <Text
            fontSize={['.75rem', '.875rem']}
            color={'#888888'}
            fontWeight={400}
          >
            Super Creators
          </Text>
        )}
      </Stack>
    </HStack>
  )
}
