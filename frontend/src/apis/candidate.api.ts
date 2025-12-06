import http from 'src/utils/http'
import {
  Candidate,
  UpdateCVRequest,
  UpdateCVResponse,
  AddJobHistoryRequest,
  AddJobHistoryResponse,
  UpdateSkillsRequest,
  UpdateSkillsResponse,
  JobHistory
} from 'src/types/candidate.type'
import { SuccessResponse } from 'src/types/utils.type'

const candidateApi = {
  /**
   * GET /api/v1/candidates/:id
   * Xem profile công khai của ứng viên (cho Employer)
   */
  getCandidateById(id: string) {
    return http.get<SuccessResponse<Candidate>>(`candidates/${id}`)
  },

  /**
   * PUT /api/v1/candidates/me/cv
   * Upload/Cập nhật CV mặc định
   */
  updateCV(body: UpdateCVRequest) {
    return http.put<UpdateCVResponse>('candidates/me/cv', body)
  },

  /**
   * GET /api/v1/candidates/me/job-history
   * Lấy danh sách lịch sử làm việc
   */
  getJobHistory() {
    return http.get<SuccessResponse<JobHistory[]>>('candidates/me/job-history')
  },

  /**
   * POST /api/v1/candidates/me/job-history
   * Thêm lịch sử làm việc
   */
  addJobHistory(body: AddJobHistoryRequest) {
    return http.post<AddJobHistoryResponse>('candidates/me/job-history', body)
  },

  /**
   * PUT /api/v1/candidates/me/skills
   * Cập nhật kỹ năng
   */
  updateSkills(body: UpdateSkillsRequest) {
    return http.put<UpdateSkillsResponse>('candidates/me/skills', body)
  }
}

export default candidateApi
