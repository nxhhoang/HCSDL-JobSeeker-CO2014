import { ApplyStatus } from '~/constants/enums'

interface ApplyConstructor {
  user_id: number // FK -> USER(ID) (Candidate)
  job_id: number // FK -> JOB(JobID)
  date?: Date
  cover_letter?: string
  cv?: string
  status?: ApplyStatus | string
}

export default class Apply {
  user_id: number
  job_id: number
  date: Date
  cover_letter: string
  cv: string
  status: string

  constructor(apply: ApplyConstructor) {
    this.user_id = apply.user_id
    this.job_id = apply.job_id
    this.date = apply.date || new Date()
    this.cover_letter = apply.cover_letter || ''
    this.cv = apply.cv || ''
    this.status = apply.status || ApplyStatus.Pending
  }
}
