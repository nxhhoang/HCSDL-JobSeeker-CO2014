import { SuccessResponse } from './utils.type'

// Application Status
export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interviewed' | 'Accepted' | 'Rejected'

// Application
export type Application = {
  applyId: string
  jobId: string
  jobTitle?: string
  companyName?: string
  candidateId?: string
  candidateName?: string
  email?: string
  cvUrl?: string
  coverLetter?: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt?: string
}

// Apply Job Request
export type ApplyJobRequest = {
  coverLetter: string
  cvUrl?: string // Optional, sẽ dùng CV mặc định nếu không có
}

export type ApplyJobResponse = SuccessResponse<{
  applyId: string
  jobId: string
  status: ApplicationStatus
  appliedAt: string
}>

// Update Application Status Request
export type UpdateApplicationStatusRequest = {
  status: ApplicationStatus
}

export type UpdateApplicationStatusResponse = SuccessResponse<{
  applyId: string
  status: ApplicationStatus
  updatedAt: string
}>

// Get Applications Response
export type GetApplicationsResponse = SuccessResponse<Application[]>
