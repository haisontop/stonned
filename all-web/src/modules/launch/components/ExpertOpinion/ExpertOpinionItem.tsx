import { Avatar, Box, HStack, Text } from '@chakra-ui/react'
import { OpinionLevel, User } from '@prisma/client'
import { BsEmojiNeutralFill } from 'react-icons/bs'
import {
  MdArrowDownward,
  MdArrowUpward,
  MdStar,
  MdThumbUp,
} from 'react-icons/md'
import ChipTag from '../ChipTag'
import { useMemo, useState } from 'react'

interface Props {
  id: string
  poster: User
  content: string
  level?: OpinionLevel
  star?: number
  defaultShowContent: boolean
}

export const ExpertOpinionItem: React.FC<Props> = ({
  id,
  poster,
  content,
  level,
  star,
  defaultShowContent,
}) => {
  const [showContent, setShowContent] = useState(defaultShowContent)

  const levelTag = useMemo(() => {
    if (level === 'RECOMMENDED') {
      return (
        <ChipTag
          bg='#E7EEDD'
          label='Recommended'
          color='#152F33'
          icon={<MdThumbUp />}
        />
      )
    } else if (level === 'CAUTION') {
      return (
        <ChipTag
          bg='#FFE8BB'
          label='Caution'
          color='#ED6749'
          icon={<BsEmojiNeutralFill />}
        />
      )
    }
  }, [level])

  return (
    <HStack alignItems={'flex-start'} spacing={4}>
      <Avatar
        name={poster.username || ''}
        src={poster.profilePictureUrl || undefined}
        size='sm'
      />
      <Box pt={1}>
        <Box>
          <Text fontSize={'0.875rem'} fontWeight={600}>
            {poster.username || '---'}
          </Text>
        </Box>
        <HStack spacing={3} my='0.7rem' flexWrap={'wrap'}>
          {level && levelTag}
          {star && (
            <ChipTag
              bg='#E1EBFF'
              label={star.toFixed(1)}
              color={'#1F61E2'}
              icon={<MdStar />}
            />
          )}
        </HStack>
        <HStack
          onClick={(e) => {
            setShowContent(!showContent)
          }}
          cursor='pointer'
          my={'1rem'}
        >
          <Box padding={'4px'} borderRadius='100%' bg={'#EEEFEE'}>
            {showContent ? <MdArrowUpward /> : <MdArrowDownward />}
          </Box>
          <Text fontSize='0.9rem' fontWeight={600}>
            {showContent ? 'Hide' : 'Read full Opinion'}
          </Text>
        </HStack>
        {showContent && (
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        )}
      </Box>
    </HStack>
  )
}
