interface NotifyConstructor {
  candidate_id?: number
  job_id?: number
  employer_id?: number
  content?: string
  title?: string
  timestamp?: Date
}

export default class Notify {
  candidate_id: number | null
  job_id: number | null
  employer_id: number | null
  content: string
  title: string
  timestamp: Date

  constructor(notify: NotifyConstructor) {
    this.candidate_id = notify.candidate_id || null
    this.job_id = notify.job_id || null
    this.employer_id = notify.employer_id || null
    this.content = notify.content || ''
    this.title = notify.title || ''
    this.timestamp = notify.timestamp || new Date()
  }
}
