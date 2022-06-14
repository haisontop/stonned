import { HStack, Stack, Avatar, Input, Heading } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/system'
import React, { useCallback, useState } from 'react'
import CommentItem from './CommentItem'
import { trpc } from '../../../utils/trpc'
import { useUser } from '../../../modules/common/authHooks'
import toast from 'react-hot-toast'

interface Props {
  projectId: string
}

const CommentsList: React.FC<Props> = ({ projectId }) => {
  const inputBg = useColorModeValue('#F7F7F7', '#101011')
  const inputColor = useColorModeValue('#000', '#fff')
  const { data: user } = useUser()
  const [message, setMessage] = useState('')

  const {
    data: comments,
    isLoading,
    refetch,
  } = trpc.useQuery(['launch.getProjectComments', { projectId }], {
    enabled: !!projectId,
  })

  const addComment = trpc.useMutation('launch.addComment', {
    onSuccess: () => {
      refetch()
      setMessage('')
    },
    onError: () => {
      toast.error('failed')
    },
  })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (!message || !user?.id) return
      addComment.mutate({ message, userId: user.id, projectId: projectId })
    }
  }

  const handleLike = useCallback((like: boolean) => {
    if (like) refetch()
  }, [])

  if (isLoading) return null

  return (
    <Stack mb={['2rem', '2rem', 0]} spacing={4}>
      <Heading fontSize={'1.5rem'} mb='1rem' fontWeight={600}>
        Comments
      </Heading>
      {user?.id && (
        <HStack alignItems={'center'} spacing={4} pb='1rem'>
          <Avatar name='' src={user.profilePictureUrl || undefined} size='sm' />
          <Input
            placeholder='Add a comment...'
            type='text'
            _placeholder={{
              color: '#A0A0A0',
            }}
            _hover={{
              shadow: 'lg',
            }}
            _focus={{
              shadow: 'lg',
            }}
            border='1px solid #CBCBCB'
            color={inputColor}
            transition='all .2s ease-in-out'
            onKeyDown={handleKeyDown}
            bg={inputBg}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </HStack>
      )}
      {comments?.map((comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          commenter={comment.user}
          content={comment.message}
          createdAt={comment.createdAt}
          dislikes={comment.disLikes.length}
          likes={comment.likes.length}
          onLike={handleLike}
        />
      ))}
    </Stack>
  )
}

export default CommentsList
