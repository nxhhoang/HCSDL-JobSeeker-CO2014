import http from 'src/utils/http'
import {
  Job,
  JobDetail,
  PostJobRequest,
  PostJobResponse,
  UpdateJobRequest,
  UpdateJobResponse,
  SearchJobsParams,
  SearchJobsResponse
} from 'src/types/job.type'
import { SuccessResponse } from 'src/types/utils.type'

const jobApi = {
  /**
   * GET /api/v1/jobs/search
   * Tìm kiếm công việc với bộ lọc
   */
  searchJobs(params: SearchJobsParams) {
    return http.get<SearchJobsResponse>('jobs/search', {
      params
    })
  },

  /**
   * GET /api/v1/jobs/:id
   * Xem chi tiết công việc
   */
  getJobById(id: string) {
    return http.get<SuccessResponse<JobDetail>>(`jobs/${id}`)
  },

  /**
   * POST /api/v1/jobs
   * Đăng tin tuyển dụng
   */
  postJob(body: PostJobRequest) {
    return http.post<PostJobResponse>('jobs', body)
  },

  /**
   * PUT /api/v1/jobs/:id
   * Chỉnh sửa tin tuyển dụng
   */
  updateJob(id: string, body: UpdateJobRequest) {
    return http.put<UpdateJobResponse>(`jobs/${id}`, body)
  },

  /**
   * DELETE /api/v1/jobs/:id
   * Xoá tin tuyển dụng
   */
  deleteJob(id: string) {
    return http.delete<SuccessResponse<null>>(`jobs/${id}`)
  },

  /**
   * GET /api/v1/jobs/:id/related
   * Lấy danh sách công việc liên quan
   */
  getRelatedJobs(id: string) {
    return http.get<SuccessResponse<Job[]>>(`jobs/${id}/related`)
  }
}

export default jobApi
