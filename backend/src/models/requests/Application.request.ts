/* ==============================================
   2.6 MODULE APPLICATION (Ứng tuyển)
============================================== */

import { ApplyStatus } from "~/constants/enums"

/**
 * Endpoint: /jobs/:id/apply
 * Method: POST
 * [cite_start]Source: API.pdf - Page 23 [cite: 878]
 */
export interface ApplyJobReqBody {
  coverLetter?: string
  cvUrl?: string // Optional, nếu không có lấy default
}

/**
 * Endpoint: /applies/:id/status
 * Method: PUT
 * [cite_start]Source: API.pdf - Page 25 [cite: 956]
 */
export interface UpdateApplyStatusReqBody {
  status: ApplyStatus
}
