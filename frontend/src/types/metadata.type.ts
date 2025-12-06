import { SuccessResponse } from './utils.type'

/**
 * Skill Entity
 * Kỹ năng (Java, Python, ReactJS, Tiếng Anh, etc.)
 * 
 * @note Backend sử dụng snake_case cho field names
 */
export interface Skill {
  /** Skill ID */
  skill_id: number
  /** Tên kỹ năng */
  skill_name: string
  /** Mô tả kỹ năng (có thể rỗng) */
  s_description: string
}

/**
 * Job Category Entity
 * Ngành nghề / Lĩnh vực (Công nghệ thông tin, Marketing, etc.)
 * 
 * @note Backend KHÔNG có ID field, jc_name là primary key
 * @note Backend sử dụng snake_case cho field names
 */
export interface JobCategory {
  /** 
   * Tên ngành nghề (Primary Key)
   * @example "Công nghệ thông tin", "Marketing - Truyền thông"
   */
  jc_name: string
  /** 
   * Chuyên môn / Speciality
   * @example "Software, Hardware", "Digital, Brand"
   */
  speciality: string
}

// ===== API Response Types =====

/**
 * Response cho GET /api/v1/skills
 * 
 * @example
 * {
 *   "message": "Successfully retrieved skills list",
 *   "data": [
 *     { "skill_id": 1, "skill_name": "Java", "s_description": "" },
 *     { "skill_id": 4, "skill_name": "ReactJS", "s_description": "" }
 *   ]
 * }
 */
export type GetSkillsResponse = SuccessResponse<Skill[]>

/**
 * Response cho GET /api/v1/categories
 * 
 * @example
 * {
 *   "message": "Successfully retrieved categories list",
 *   "data": [
 *     { "jc_name": "Công nghệ thông tin", "speciality": "Software, Hardware" },
 *     { "jc_name": "Marketing - Truyền thông", "speciality": "Digital, Brand" }
 *   ]
 * }
 */
export type GetCategoriesResponse = SuccessResponse<JobCategory[]>
