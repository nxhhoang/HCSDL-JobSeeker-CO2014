import http from 'src/utils/http'
import {
  AdminStatistics,
  CreateCategoryBody,
  CreateCategoryResponse,
  CreateSkillBody,
  CreateSkillResponse,
  DeleteCategoryResponse,
  DeleteSkillResponse,
  DeleteUserBody,
  GetUsersParams,
  GetUsersResponse,
  UpdateSkillBody,
  UpdateSkillResponse
} from 'src/types/admin.type'
import { SuccessResponse } from 'src/types/utils.type'

/**
 * ===== ADMIN API =====
 * API methods cho Admin module
 * Base URL: /admin
 */

const URL_ADMIN_STATS = 'admin/stats'
const URL_ADMIN_USERS = 'admin/users'
const URL_ADMIN_SKILLS = 'admin/skills'
const URL_ADMIN_CATEGORIES = 'admin/categories'

const adminApi = {
  /**
   * GET /api/v1/admin/stats
   * Lấy thống kê tổng quan cho dashboard (gọi stored procedure)
   * Admin only
   * 
   * @returns TotalUsers, TotalJobs, TotalApplies, AvgCompanyRating
   */
  getStats() {
    return http.get<SuccessResponse<AdminStatistics>>(URL_ADMIN_STATS)
  },

  /**
   * GET /api/v1/admin/users
   * Lấy danh sách users với pagination, filter và sorting
   * 
   * @param params - Query parameters { page, limit, role, sort_by, order }
   * @returns Promise<AxiosResponse<GetUsersResponse>>
   * 
   * @example
   * // Get Employer users, sorted by role desc, page 1, 10 items per page
   * adminApi.getUsers({ page: 1, limit: 10, role: 'Employer', sort_by: 'UserType', order: 'desc' })
   * 
   * @example
   * // Get all users sorted by ID ascending
   * adminApi.getUsers({ page: 1, limit: 10, sort_by: 'ID', order: 'asc' })
   * 
   * @example
   * // Get all users without filter or sort
   * adminApi.getUsers({ page: 1, limit: 20 })
   */
  getUsers(params: GetUsersParams) {
    return http.get<GetUsersResponse>(URL_ADMIN_USERS, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.role && { role: params.role }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.order && { order: params.order })
      }
    })
  },

  /**
   * DELETE /api/v1/admin/users/:id
   * Xóa user khỏi hệ thống (yêu cầu xác nhận mật khẩu admin)
   * Admin only
   * 
   * @param userId - ID của user cần xóa
   * @param body - Credentials để xác nhận { emailOrPhone, password }
   * @returns Promise<AxiosResponse<SuccessResponse<{ message: string }>>>
   * 
   * @example
   * adminApi.deleteUser(123, { emailOrPhone: 'sManager', password: 'password123' })
   */
  deleteUser(userId: number, body: DeleteUserBody) {
    return http.delete<SuccessResponse<{ message: string }>>(`${URL_ADMIN_USERS}/${userId}`, {
      data: body
    })
  },

  /**
   * POST /api/v1/admin/skills
   * Tạo kỹ năng mới trong hệ thống
   * Admin only
   * 
   * @param body - { skillName, description }
   * @returns Promise<AxiosResponse<CreateSkillResponse>>
   * 
   * @example
   * adminApi.createSkill({ skillName: 'Rust Lang', description: 'System programming language' })
   * // Response: { message: 'Skill created', data: { SkillID: 41, SkillName: 'Rust Lang' } }
   */
  createSkill(body: CreateSkillBody) {
    return http.post<CreateSkillResponse>(URL_ADMIN_SKILLS, body)
  },

  /**
   * PUT /api/v1/admin/skills/:id
   * Cập nhật thông tin kỹ năng
   * Admin only
   * 
   * @param skillId - ID của skill cần update
   * @param body - { skillName, description }
   * @returns Promise<AxiosResponse<UpdateSkillResponse>>
   * 
   * @example
   * adminApi.updateSkill('1', { skillName: 'Rust Language', description: 'Safe concurrent practical language' })
   * // Response: { message: 'Skill updated', data: { id: '1', skillName: 'Rust Language', description: 'Safe concurrent practical language' } }
   */
  updateSkill(skillId: string, body: UpdateSkillBody) {
    return http.put<UpdateSkillResponse>(`${URL_ADMIN_SKILLS}/${skillId}`, body)
  },

  /**
   * DELETE /api/v1/admin/skills/:id
   * Xóa kỹ năng khỏi hệ thống
   * Admin only
   * 
   * @param skillId - ID của skill cần xóa
   * @returns Promise<AxiosResponse<DeleteSkillResponse>>
   * 
   * @example
   * adminApi.deleteSkill('1')
   * // Response: { message: 'Skill deleted', data: true }
   */
  deleteSkill(skillId: string) {
    return http.delete<DeleteSkillResponse>(`${URL_ADMIN_SKILLS}/${skillId}`)
  },

  /**
   * POST /api/v1/admin/categories
   * Tạo ngành nghề mới trong hệ thống
   * Admin only
   * 
   * @param body - { jcName, speciality }
   * @returns Promise<AxiosResponse<CreateCategoryResponse>>
   * 
   * @example
   * adminApi.createCategory({ jcName: 'AI - Blockchain', speciality: 'Future Tech' })
   * // Response: { message: 'Category created', data: { jcName: 'AI - Blockchain', speciality: 'Future Tech' } }
   */
  createCategory(body: CreateCategoryBody) {
    return http.post<CreateCategoryResponse>(URL_ADMIN_CATEGORIES, body)
  },

  /**
   * DELETE /api/v1/admin/categories/:jcName
   * Xóa ngành nghề khỏi hệ thống
   * Admin only
   * 
   * @param jcName - Tên ngành nghề cần xóa (URL encoded)
   * @returns Promise<AxiosResponse<DeleteCategoryResponse>>
   * 
   * @example
   * adminApi.deleteCategory('AI - Blockchain')
   * // Request: DELETE /api/v1/admin/categories/AI%20-%20Blockchain
   * // Response: { message: 'Category deleted', data: true }
   */
  deleteCategory(jcName: string) {
    return http.delete<DeleteCategoryResponse>(`${URL_ADMIN_CATEGORIES}/${encodeURIComponent(jcName)}`)
  }
}

export default adminApi
