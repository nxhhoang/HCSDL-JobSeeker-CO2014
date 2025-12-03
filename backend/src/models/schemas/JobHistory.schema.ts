interface JobHistoryConstructor {
  history_id?: number
  candidate_id: number // FK -> USER(ID)
  position?: string
  com_name?: string
  start_time?: Date
  end_time?: Date | null
}

export default class JobHistory {
  history_id?: number
  candidate_id: number
  position: string
  com_name: string
  start_time: Date
  end_time: Date | null // Null nếu đang làm việc

  constructor(history: JobHistoryConstructor) {
    this.history_id = history.history_id
    this.candidate_id = history.candidate_id
    this.position = history.position || ''
    this.com_name = history.com_name || ''
    this.start_time = history.start_time || new Date()
    this.end_time = history.end_time || null
  }
}
