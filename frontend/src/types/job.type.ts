import { SuccessResponse } from './utils.type'

// Job
export type Job = {
  jobId: string
  title: string
  companyName: string
  logoUrl: string
  salary: string
  location: string
  skills: string[]
  postDate: string
  expireDate?: string
  viewCount?: number
}

// Job Detail
export type JobDetail = {
  jobInfo: {
    id: string
    title: string
    expireDate: string
    viewCount: number
  }
  company: {
    id: string
    name: string
    avatar: string
  }
  jd: JobDescription
  skills: string[]
  categories: string[]
}

// Job Description
export type JobDescription = {
  description: string
  requirements: string
  benefits: string
  location: string
  salary?: string
  quantity?: number
  expYear?: number
  level?: string
  contractType?: string
  jobType?: string
}

// Post Job Request
export type PostJobRequest = {
  jobInfo: {
    title: string
    expireDate: string
  }
  jdInfo: {
    location: string
    salary: string
    quantity: number
    expYear: number
    level: string
    contractType: string
    jobType: string
    description: string
    requirements?: string
    benefits?: string
  }
  skillIds: number[]
  categoryIds: number[]
}

export type PostJobResponse = SuccessResponse<{
  jobId: string
  title: string
  postDate: string
}>

// Update Job Request
export type UpdateJobRequest = Partial<PostJobRequest>

export type UpdateJobResponse = SuccessResponse<{
  jobId: string
  updatedAt: string
}>

// Search Jobs Query Params
export type SearchJobsParams = {
  q?: string // keyword
  loc?: string // location
  salary_min?: number
  skill?: string
  cat?: string // category
  page?: number
  limit?: number
}

export type SearchJobsResponse = SuccessResponse<Job[]>
