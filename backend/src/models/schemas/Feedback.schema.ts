interface FeedbackConstructor {
  user_id: number // FK -> USER(ID)
  job_id: number // FK -> JOB(JobID)
  content?: string
  rank?: number
}

export default class Feedback {
  user_id: number
  job_id: number
  content: string
  rank: number

  constructor(fb: FeedbackConstructor) {
    this.user_id = fb.user_id
    this.job_id = fb.job_id
    this.content = fb.content || ''
    this.rank = fb.rank || 5 // Default 5 stars
  }
}
