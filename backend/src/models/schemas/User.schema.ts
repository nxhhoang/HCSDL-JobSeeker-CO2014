import { UserVerifyStatus } from '~/constants/enums' 
import { UserRole } from '~/constants/enums'


interface UserConstructor {
  id?: number
  username: string
  password: string
  email: string
  phone_num?: string
  name?: string
  address?: string
  profile_pic?: string
  bio?: string
  user_type: UserRole
  ssn?: string
  dob?: Date
}

export default class User {
  id?: number
  username: string
  password: string
  email: string
  phone_num: string
  name: string
  address: string
  profile_pic: string
  bio: string
  user_type: UserRole
  ssn: string
  dob: Date

  constructor(user: UserConstructor) {
    this.id = user.id
    this.username = user.username
    this.password = user.password
    this.email = user.email
    this.phone_num = user.phone_num || ''
    this.name = user.name || ''
    this.address = user.address || ''
    this.profile_pic = user.profile_pic || ''
    this.bio = user.bio || ''
    this.user_type = user.user_type
    this.ssn = user.ssn || ''
    this.dob = user.dob || new Date()
  }
}

// =================================================================
// BỔ SUNG: Interface cho bảng con (PERSON và COMPANY) để dùng khi join
// =================================================================

// 3. Subtype: PERSON (Dành cho Candidate)
export interface PersonProfile {
  ssn: string // PK
  dob: Date
  user_id: number // FK references USER(ID)
}

// 4. Subtype: COMPANY (Dành cho Employer)
export interface CompanyProfile {
  tax_number: string // PK, VARCHAR(13)
  founded_date: Date
  industry: string
  size: string
  country: string
  website: string
  user_id: number // FK references USER(ID)
}
