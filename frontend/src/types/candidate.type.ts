import { SuccessResponse } from './utils.type'

// Candidate Profile
export type Candidate = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  cvUrl?: string
  skills: string[]
  jobHistory: JobHistory[]
}

// Job History
export type JobHistory = {
  historyId?: string
  comName: string
  position: string
  startTime: string
  endTime?: string
  duration: string
}

// Update CV Request
export type UpdateCVRequest = {
  cvUrl: string
  cvName?: string
}

export type UpdateCVResponse = SuccessResponse<{
  candidateId: string
  cvUrl: string
  updatedAt: string
}>

// Add Job History Request
export type AddJobHistoryRequest = {
  comName: string
  position: string
  startTime: string
  endTime?: string
  duration: string
}

export type AddJobHistoryResponse = SuccessResponse<{
  historyId: string
  comName: string
}>

// Update Skills Request
export type UpdateSkillsRequest = {
  skillIds: number[]
}

export type UpdateSkillsResponse = SuccessResponse<string[]>
