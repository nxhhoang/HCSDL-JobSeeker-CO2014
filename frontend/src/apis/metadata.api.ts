import http from 'src/utils/http'
import { GetSkillsResponse, GetCategoriesResponse } from 'src/types/metadata.type'

/**
 * Metadata API
 * 
 * Module quản lý master data (Skills, Categories)
 * - Skills: Kỹ năng kỹ thuật, ngôn ngữ, soft skills (Java, Python, Tiếng Anh, Giao tiếp, etc.)
 * - Categories: Ngành nghề (Công nghệ thông tin, Marketing, Nhà hàng - Khách sạn, etc.)
 * 
 * @note Đây là public API, không yêu cầu authentication
 * @note Backend sử dụng snake_case cho field names
 */
const metadataApi = {
  /**
   * GET /api/v1/skills
   * 
   * Lấy danh sách tất cả kỹ năng
   * Dùng cho: Dropdowns, filters, job tags, candidate skills
   * 
   * @returns Promise<GetSkillsResponse> - Array of 40+ skills
   * 
   * @example
   * const { data } = await metadataApi.getSkills()
   * console.log(data.data) 
   * // [
   * //   { skill_id: 1, skill_name: "Java", s_description: "" },
   * //   { skill_id: 4, skill_name: "ReactJS", s_description: "" },
   * //   { skill_id: 11, skill_name: "Tiếng Anh (IELTS)", s_description: "" }
   * // ]
   */
  getSkills() {
    return http.get<GetSkillsResponse>('skills')
  },

  /**
   * GET /api/v1/categories
   * 
   * Lấy danh sách tất cả ngành nghề/lĩnh vực
   * Dùng cho: Job categories, job filters, candidate specialities
   * 
   * @returns Promise<GetCategoriesResponse> - Array of 12 categories
   * 
   * @example
   * const { data } = await metadataApi.getCategories()
   * console.log(data.data)
   * // [
   * //   { jc_name: "Công nghệ thông tin", speciality: "Software, Hardware" },
   * //   { jc_name: "Marketing - Truyền thông", speciality: "Digital, Brand" },
   * //   { jc_name: "Nhà hàng - Khách sạn", speciality: "Chef, Waiter" }
   * // ]
   * 
   * @note Categories không có ID, sử dụng jc_name làm unique identifier
   */
  getCategories() {
    return http.get<GetCategoriesResponse>('categories')
  }
}

export default metadataApi
