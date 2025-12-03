/* ==============================================
   2.7 MODULE INTERACTION (Tương tác)
============================================== */

import { Query } from 'express-serve-static-core'

/**
 * Endpoint: /employers/:id/follow
 * Method: POST
 * [cite_start]Source: API.pdf - Page 26 [cite: 990]
 * Note: Body null, action toggle dựa trên endpoint
 */

/**
 * Endpoint: /jobs/:id/feedback
 * Method: POST
 * [cite_start]Source: API.pdf - Page 27 [cite: 1017]
 */
export interface SendFeedbackReqBody {
  content: string
  rank: number // 1 - 5
}

/**
 * Endpoint: /messages
 * Method: GET
 * [cite_start]Source: API.pdf - Page 27 [cite: 1038]
 */
export interface GetMessagesReqQuery extends Query {
  with_user_id: string
  limit?: string
  offset?: string
}

/**
 * Endpoint: /messages
 * Method: POST
 * [cite_start]Source: API.pdf - Page 28 [cite: 1065]
 */
export interface SendMessageReqBody {
  receiverId: string
  content: string
}

/**
 * Endpoint: /notifications/:id/read
 * Method: PUT
 * [cite_start]Source: API.pdf - Page 29 [cite: 1118]
 */
// Body rỗng {}
