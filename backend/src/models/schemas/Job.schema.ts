import { JobContractType, JobLevel, JobType } from '~/constants/enums'

interface JobConstructor {
  job_id?: number
  job_name: string
  post_date?: Date
  expire_date: Date
  location?: string
  salary?: number
  quantity?: number
  exp_year?: number
  level?: JobLevel | string
  contract_type?: JobContractType | string
  job_type?: JobType | string
  user_id: number
}

export default class Job {
  job_id?: number
  job_name: string
  post_date: Date
  expire_date: Date
  location: string
  salary: number
  quantity: number
  exp_year: number
  level: string
  contract_type: string
  job_type: string
  user_id: number

  constructor(job: JobConstructor) {
    this.job_id = job.job_id
    this.job_name = job.job_name
    this.post_date = job.post_date || new Date()
    this.expire_date = job.expire_date
    this.location = job.location || ''
    this.salary = job.salary || 0
    this.quantity = job.quantity || 1
    this.exp_year = job.exp_year || 0
    this.level = job.level || ''
    this.contract_type = job.contract_type || ''
    this.job_type = job.job_type || ''
    this.user_id = job.user_id
  }
}
