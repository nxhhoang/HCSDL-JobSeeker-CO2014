/* ==============================================
   2.4 MODULE EMPLOYER & COMPANY (Nhà tuyển dụng)
============================================== */

import { JobContractType, JobType } from '~/constants/enums'
import { Query } from 'express-serve-static-core'

/**
 * Endpoint: /companies
 * Method: POST
 * [cite_start]Source: API.pdf - Page 17 [cite: 620]
 */
export interface CreateCompanyReqBody {
  taxNumber: string
  name: string
  foundedDate: string
  industry: string
  size: string
  country: string
  website: string
}

/* ==============================================
   2.5 MODULE JOBS (Việc làm)
============================================== */

/**
 * Endpoint: /jobs
 * Method: GET
 * [cite_start]Source: API.pdf - Page 19 [cite: 701]
 * Note: Query Parameters
 */
export interface FindJobsReqQuery extends Query {
  q?: string // Keyword
  loc?: string // Location/City
  salary_min?: string
  skill?: string
  cat?: string // Category
  limit?: string
  offset?: string
}

/**
 * Sub-interface for Job Info
 */
interface JobInfo {
  title: string
  expireDate: string // YYYY-MM-DD
}

/**
 * Sub-interface for Job Description (JD)
 */
interface JdInfo {
  location: string
  salary: string
  quantity: number
  expYear: number
  level: string
  contractType: JobContractType
  jobType: JobType
  description: string
  requirements?: string
  benefits?: string
}

/**
 * Endpoint: /jobs/post
 * Method: POST
 * [cite_start]Source: API.pdf - Page 21 [cite: 775]
 */
export interface PostJobReqBody {
  jobInfo: JobInfo
  jdInfo: JdInfo
  skillIds: number[]
  categoryIds: number[]
}

/**
 * Endpoint: /jobs/update/:id
 * Method: PUT
 * [cite_start]Source: API.pdf - Page 21 [cite: 808]
 * Note: Các trường bên trong là optional khi update
 */
export interface UpdateJobReqBody {
  jobInfo?: Partial<JobInfo>
  jdInfo?: Partial<JdInfo>
  skillIds?: number[]
  categoryIds?: number[]
}

/**
 * Endpoint: /jobs/:id/relate
 * Method: POST
 * [cite_start]Source: API.pdf - Page 23 [cite: 853]
 */
export interface RelateJobReqBody {
  relatedJobId: string
}
