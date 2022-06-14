import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { trpc } from '../../utils/trpc'
import { convertJob, convertJobs, getAllJobs } from './jobUtils'
import { JobResponse } from './types'

export function useAllJobs() {
  const jobsRes = trpc.useQuery(['jobs.allJobs'])

  console.log("jobsRes", jobsRes)

  if (jobsRes.data) {
    let rawList: JobResponse[] = convertJobs(jobsRes.data.data)

    return { ...jobsRes, data: rawList.map((job) => convertJob(job)) }
  } else {
    return { ...jobsRes, data: [] }
  }
}

export function useJob(jobId: string | string[]) {
  if (!jobId) return
  const jobsRes = trpc.useQuery(['jobs.allJobs'])

  if (jobsRes.data) {
    let rawList: JobResponse[] = convertJobs(jobsRes.data.data)

    const jobs = rawList.map((job) => convertJob(job))
    return {
      ...jobsRes,
      data: jobs.find((job) => job.id === (jobId as string)),
    }
  } else {
    return {
      ...jobsRes,
      data: null,
    }
  }
}

export function useCurrentJob() {
  const router = useRouter()
  const { id } = router.query

  return useJob(id!)
}
