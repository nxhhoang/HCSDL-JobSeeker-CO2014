import http from 'src/utils/http'
import {
  Application,
  ApplyJobRequest,
  ApplyJobResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse
} from 'src/types/application.type'
import { SuccessResponse } from 'src/types/utils.type'

const applicationApi = {
  /**
   * POST /api/v1/applications
   * Ứng tuyển công việc
   */
  applyJob(body: ApplyJobRequest) {
    return http.post<ApplyJobResponse>('applications', body)
  },

  /**
   * GET /api/v1/applications/me
   * Xem danh sách công việc đã ứng tuyển (Candidate)
   */
  getMyApplications() {
    return http.get<SuccessResponse<Application[]>>('applications/me')
  },

  /**
   * GET /api/v1/jobs/:jobId/applications
   * Xem danh sách ứng viên của công việc (Employer)
   */
  getJobApplications(jobId: string) {
    return http.get<SuccessResponse<Application[]>>(`jobs/${jobId}/applications`)
  },

  /**
   * PUT /api/v1/applications/:id/status
   * Cập nhật trạng thái hồ sơ ứng tuyển (Employer)
   */
  updateApplicationStatus(id: string, body: UpdateApplicationStatusRequest) {
    return http.put<UpdateApplicationStatusResponse>(`applications/${id}/status`, body)
  },

  /**
   * DELETE /api/v1/applications/:id
   * Rút đơn ứng tuyển (Candidate)
   */
  withdrawApplication(id: string) {
    return http.delete<SuccessResponse<null>>(`applications/${id}`)
  }
}

export default applicationApi
