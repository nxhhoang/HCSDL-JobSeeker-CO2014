/* ==============================================
   2.2 MODULE USERS (Người dùng chung)
============================================== */

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
  // Candidate fields
  dob?: string // Format: YYYY-MM-DD
  ssn?: string // Căn cước công dân
  // Employer fields
  employerType?: 'Company' | 'Person'
  specificData?: {
    // For Company
    website?: string
    size?: string
    industry?: string
    foundedDate?: string
    country?: string
    // For Person
    socialLink?: string
    // Shared specific fields
    taxNumber?: string // Read-only thường không gửi lên nhưng define cho đầy đủ
  }
}
