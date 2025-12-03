/* ==============================================
   2.3 MODULE CANDIDATE (Ứng viên)
============================================== */

/**
 * Endpoint: /candidates/me/cv
 * Method: PUT
 */
export interface UpdateCvReqBody {
  cvUrl: string
  cvName?: string // Optional
}

/**
 * Endpoint: /candidates/me/job-history
 * Method: POST
 */
export interface AddJobHistoryReqBody {
  comName: string
  position: string
  startTime: string // ISO Date or YYYY-MM-DD
  endTime?: string // Nếu đang làm thì null hoặc không gửi
  duration?: string
}

/**
 * Endpoint: /candidates/me/skills
 * Method: PUT
 */
export interface UpdateSkillsReqBody {
  skillIds: number[]
}
