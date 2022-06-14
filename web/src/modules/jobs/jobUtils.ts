import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { Job, JobResponse } from './types'

export async function getAllJobs() {
  const jobsRes = await axios.get('/api/jobs')

  return jobsRes
}

export function convertJobs(jobsData: any) {
  const jobList = jobsData.elements.find(
    (element: any) => element.name === 'workzag-jobs'
  )

  let positions = []

  if (jobList && jobList.elements && jobList.elements.length > 0) {
    const positionList = jobList.elements.filter(
      (element: any) => element.name === 'position'
    )
    if (positionList && positionList.length > 0) {
      positions = positionList.map((position: any) => {
        return position.elements.reduce((obj: any, item: any) => {
          if (item.name === 'jobDescriptions') {
            return Object.assign(obj, {
              [item.name]: convertJobDescription(item.elements),
            })
          } else {
            return Object.assign(obj, { [item.name]: item.elements[0].text })
          }
        }, {})
      })
    }
  }

  return positions
}

export const convertJob = (job: JobResponse): Job => {
  return {
    id: job.id,
    title: job.name,
    isRemote: job.office === 'Remote',
    isFulltime: job.schedule === 'full-time',
    category: job.department!,
    jobDescriptions: job.jobDescriptions,
  }
}

export const convertJobCategory = (category: string) => {
  const categories = category?.split('_and_')
  return categories && categories.length > 0
    ? categories.map((snake) =>
        snake
          .split('_')
          .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
          .join(' ')
      )
    : []
}

export const convertJobDescription = (descriptions: any) => {
  return descriptions.map((description: any) => {
    const nameElement = description.elements.find(
      (element: any) => element.name === 'name'
    )

    const descriptionName =
      nameElement && nameElement.elements && nameElement.elements.length > 0
        ? nameElement.elements[0].text
        : 'Description'
    const descriptionContent = description.elements
      .filter((element: any) => element.name === 'value')
      .map((data: any) => data.elements[0].cdata)
    return {
      title: descriptionName,
      content: descriptionContent,
    }
  })
}
