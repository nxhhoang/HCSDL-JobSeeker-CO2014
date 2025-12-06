import { SuccessResponse } from './utils.type'

// Employer
export type Employer = {
  id: string
  name: string
  avatar: string
  company?: Company
  activeJobs: number
}

// Company
export type Company = {
  id: string
  name: string
  taxNumber: string
  foundedDate: string
  industry: string
  size: string
  country: string
  website: string
  address: string
}

// Create Company Request
export type CreateCompanyRequest = {
  taxNumber: string
  name: string
  foundedDate: string
  industry: string
  size: string
  country: string
  website: string
}

export type CreateCompanyResponse = SuccessResponse<{
  companyId: string
  name: string
}>

// Follower
export type Follower = {
  userId: string
  name: string
  avatar: string
  headline: string
}

export type FollowersResponse = SuccessResponse<Follower[]>
