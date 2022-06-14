interface JobDescription {
  title: string
  content: string
}

export interface Job {
  id: string
  title: string
  isRemote: boolean
  isFulltime: boolean
  category: string
  jobDescriptions?: JobDescription[]
  // role?: string;
  // description?: string;
}

export interface JobResponse {
  id: string
  name: string
  office: string
  schedule: string
  department?: string
  occupationCategory?: string
  jobDescriptions: any[]
}
