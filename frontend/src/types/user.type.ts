/**
 * User Entity
 * Đại diện cho user trong hệ thống JobSeeker
 */
export interface User {
  /** User ID */
  id: string
  /** Tên người dùng */
  name: string
  /** Avatar URL (nullable) */
  avatar: string | null
  /** User Type: Admin | Candidate | Employer */
  userType: 'Admin' | 'Candidate' | 'Employer'
}