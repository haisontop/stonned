import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import { RoadmapResponse } from './types'

export function useAllRoadmaps() {
  const roadmapRes = trpc.useQuery(['roadmap.getAllRoadmaps'])

  if (roadmapRes.data) {
    return { ...roadmapRes, data: roadmapRes.data.data }
  } else {
    return { ...roadmapRes, data: [] }
  }
}

export function useRoadmap(roadmapId: string | string[]) {
  if (!roadmapId) return
  const roadmapRes = trpc.useQuery([
    'roadmap.getRoadmap',
    { roadmapId: roadmapId as string },
  ])

  if (roadmapRes.data) {
    return {
      ...roadmapRes,
      data: roadmapRes.data.data,
    }
  } else {
    return {
      ...roadmapRes,
      data: null,
    }
  }
}

export function useCurrentRoadmap() {
  const router = useRouter()
  const { id } = router.query

  return useRoadmap(id!)
}
