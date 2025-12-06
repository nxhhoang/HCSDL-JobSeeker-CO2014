import http from 'src/utils/http'
import {
  Employer,
  CreateCompanyRequest,
  CreateCompanyResponse,
  FollowersResponse
} from 'src/types/employer.type'
import { SuccessResponse } from 'src/types/utils.type'

const employerApi = {
  /**
   * POST /api/v1/companies
   * Tạo profile công ty
   */
  createCompany(body: CreateCompanyRequest) {
    return http.post<CreateCompanyResponse>('companies', body)
  },

  /**
   * GET /api/v1/employers/:id
   * Lấy thông tin chi tiết nhà tuyển dụng (Public)
   */
  getEmployerById(id: string) {
    return http.get<SuccessResponse<Employer>>(`employers/${id}`)
  },

  /**
   * GET /api/v1/employers/:id/followers
   * Xem danh sách người theo dõi
   */
  getFollowers(id: string) {
    return http.get<FollowersResponse>(`employers/${id}/followers`)
  }
}

export default employerApi
