/* ==============================================
   2.2 MODULE USERS (Người dùng chung)
============================================== */

import { TokenType, UserRole, UserVerifyStatus } from '~/constants/enums'
import { JwtPayload } from 'jsonwebtoken'

interface PersonSpecifics {
  ssn?: string
  dob?: string // Khi gửi JSON lên thì Date thường là string (ISO8601)
}

interface CompanySpecifics {
  taxNumber?: string
  website?: string
  size?: string
  industry?: string
  foundedDate?: string
  country?: string
  socialLink?: string
}

/**
 * Endpoint: /users/me
 * Method: PUT
 * [cite_start]Source: API.pdf - Page 11 & 12 [cite: 376-402]
 * Note: Body thay đổi tùy theo userType/employerType
 */
export interface UpdateUserReqBody {
  name?: string
  address?: string
  phone?: string
  avatar?: string
  date_of_birth?: string
  bio?: string

  // Candidate fields
  dob?: string // Format: YYYY-MM-DD
  ssn?: string // Căn cước công dân
  // Employer fields
  userType?: UserRole
  employerType?: 'Company' | 'Person'
  specificData?: PersonSpecifics & CompanySpecifics
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}
