import { Avatar, HStack, Stack, Text } from '@chakra-ui/react'
import { User } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { VscTriangleUp, VscTriangleDown } from 'react-icons/vsc'
import { trpc } from '../../../utils/trpc'
import { useUser } from '../../common/authHooks'

interface CommentItemProps {
  id: string
  commenter: User
  createdAt: Date
  likes: number
  dislikes: number
  content: string
  onLike: (like: boolean) => void
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  commenter,
  content,
  likes,
  dislikes,
  createdAt,
  onLike,
}) => {
  const { data: user } = useUser()

  const likeComment = trpc.useMutation('launch.likeComment', {
    onSuccess: () => {
      onLike(true)
    },
  })

  const handleLike = useCallback(
    (like: boolean) => () => {
      if (!user?.id) return

      likeComment.mutate({ id, like, userId: user.id })
    },
    [id, likeComment, user]
  )

  const addLikeable = useMemo(() => {
    if (!user?.id) return false
    if (user.id === commenter.id) return false
    return true
  }, [commenter, user])

  return (
    <HStack alignItems={'flex-start'} spacing={4}>
      <Avatar
        name={commenter.username || ''}
        src={commenter.profilePictureUrl || undefined}
        size='sm'
      />
      <Stack pt={1}>
        <HStack spacing={'0.7rem'}>
          <Text fontSize={'0.875rem'} fontWeight={600}>
            {commenter.username || '---'}
          </Text>
          <Text fontSize={'0.75rem'} fontWeight={500} color='#888888'>
            {formatDistanceToNow(createdAt)}
          </Text>
        </HStack>
        <Text fontSize={'0.875rem'} fontWeight={400}>
          {content}
        </Text>
        <HStack spacing={4}>
          <HStack
            onClick={handleLike(true)}
            cursor={'pointer'}
            pointerEvents={addLikeable ? undefined : 'none'}
          >
            <VscTriangleUp size={'1.2rem'} />
            <Text fontSize={'0.75rem'} fontWeight={500}>
              {likes}
            </Text>
          </HStack>
          <HStack
            onClick={handleLike(false)}
            cursor={'pointer'}
            pointerEvents={addLikeable ? undefined : 'none'}
          >
            <VscTriangleDown color='#888888' size={'1.2rem'} />
            <Text fontSize={'0.75rem'} fontWeight={500} color='#888888'>
              {dislikes}
            </Text>
          </HStack>
        </HStack>
      </Stack>
    </HStack>
  )
}

export default CommentItem
