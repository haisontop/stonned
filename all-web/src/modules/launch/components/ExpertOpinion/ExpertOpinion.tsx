import { Heading, Stack, Text } from '@chakra-ui/react'
import { trpc } from '../../../../utils/trpc'
import { useUser } from '../../../common/authHooks'
import { ExpertOpinionItem } from './ExpertOpinionItem'

interface Props {
  projectId: string
}

export const ExpertOpinion: React.FC<Props> = ({ projectId }) => {
  const { data: user } = useUser()
  const {
    data: opinions,
    isLoading,
    refetch,
  } = trpc.useQuery(['launch.getProjectOpinions', { projectId }], {
    enabled: !!projectId,
  })

  if (isLoading) return null

  return (
    <Stack mb={['2rem', '2rem', 0]} spacing={4}>
      <Heading fontSize={'1.5rem'} mb='1rem' fontWeight={600}>
        Expert Opinions
      </Heading>
      {opinions?.map((opinion, index) => (
        <ExpertOpinionItem
          key={opinion.id}
          id={opinion.id}
          poster={opinion.user}
          content={opinion.content}
          level={opinion.level ?? undefined}
          star={opinion.star ?? undefined}
          defaultShowContent={index === 0}
        />
      ))}
    </Stack>
  )
}
