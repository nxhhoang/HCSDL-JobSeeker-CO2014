import { SuccessResponse } from './utils.type'

/**
 * ===== ADMIN USER MANAGEMENT =====
 * Types cho quản lý users trong admin panel
 */

/**
 * Admin User object - User data trong admin panel
 * Khác với User type thông thường, có thêm CompanyTaxNumber
 */
export interface AdminUser {
  ID: number
  Username: string
  Email: string
  Name: string
  UserType: 'Admin' | 'Candidate' | 'Employer'
  PhoneNum: string
  CompanyTaxNumber: string | null // Chỉ có với Employer
}

/**
 * Sortable fields - Các field có thể sort
 * PhoneNum không nằm trong danh sách vì không hỗ trợ sort
 */
export type AdminUserSortField = 'id' | 'username' | 'name' | 'email' | 'role'
/**
 * Query params cho GET /admin/users
 */
export interface GetUsersParams {
  page?: number
  limit?: number
  role?: 'Admin' | 'Candidate' | 'Employer' // Filter by user type
  sortBy?: AdminUserSortField // Sort by field (không bao gồm PhoneNum)
  order?: 'asc' | 'desc' // Sort order
}

/**
 * Response data cho GET /admin/users
 */
export interface GetUsersData {
  users: AdminUser[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Response type cho GET /admin/users
 */
export type GetUsersResponse = SuccessResponse<GetUsersData>

/**
 * ===== ADMIN DELETE USER =====
 * Types cho delete user operation
 */

/**
 * Request body cho DELETE /admin/users/:id
 * Yêu cầu xác nhận mật khẩu admin trước khi xóa
 */
export interface DeleteUserBody {
  emailOrPhone: string
  password: string
}

/**
 * ===== ADMIN SKILL MANAGEMENT =====
 * Types cho quản lý skills
 */

/**
 * Request body cho POST /admin/skills
 */
export interface CreateSkillBody {
  skillName: string
  description: string
}

/**
 * Response data từ POST /admin/skills
 */
export interface CreateSkillData {
  SkillID: number
  SkillName: string
}

/**
 * Response type cho POST /admin/skills
 */
export type CreateSkillResponse = SuccessResponse<CreateSkillData>

/**
 * Request body cho PUT /admin/skills/:id
 */
export interface UpdateSkillBody {
  skillName: string
  description: string
}

/**
 * Response data từ PUT /admin/skills/:id
 */
export interface UpdateSkillData {
  id: string
  skillName: string
  description: string
}

/**
 * Response type cho PUT /admin/skills/:id
 */
export type UpdateSkillResponse = SuccessResponse<UpdateSkillData>

/**
 * Response type cho DELETE /admin/skills/:id
 */
export type DeleteSkillResponse = SuccessResponse<boolean>

/**
 * ===== ADMIN CATEGORY MANAGEMENT =====
 * Types cho quản lý categories
 */

/**
 * Request body cho POST /admin/categories
 */
export interface CreateCategoryBody {
  jcName: string
  speciality: string
}

/**
 * Response data từ POST /admin/categories
 */
export interface CreateCategoryData {
  jcName: string
  speciality: string
}

/**
 * Response type cho POST /admin/categories
 */
export type CreateCategoryResponse = SuccessResponse<CreateCategoryData>

/**
 * Response type cho DELETE /admin/categories/:jcName
 */
export type DeleteCategoryResponse = SuccessResponse<boolean>

/**
 * ===== ADMIN STATISTICS =====
 * Types cho dashboard statistics
 */

/**
 * Response data từ GET /admin/stats
 * Stored procedure sp_GetSystemStats()
 */
export interface AdminStatistics {
  TotalUsers: number
  TotalJobs: number
  TotalApplies: number
  AvgCompanyRating: number
}
