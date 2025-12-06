import http from 'src/utils/http'
import {
  Message,
  SendMessageRequest,
  SendMessageResponse,
  Notification,
  FeedbackRequest,
  FeedbackResponse,
  FollowResponse
} from 'src/types/interaction.type'
import { SuccessResponse } from 'src/types/utils.type'

const interactionApi = {
  /**
   * POST /api/v1/employers/:id/follow
   * Theo dõi nhà tuyển dụng
   */
  followEmployer(id: string) {
    return http.post<FollowResponse>(`employers/${id}/follow`)
  },

  /**
   * POST /api/v1/jobs/:id/feedback
   * Đánh giá công việc
   */
  feedbackJob(id: string, body: FeedbackRequest) {
    return http.post<FeedbackResponse>(`jobs/${id}/feedback`, body)
  },

  /**
   * GET /api/v1/messages
   * Lấy danh sách tin nhắn
   */
  getMessages() {
    return http.get<SuccessResponse<Message[]>>('messages')
  },

  /**
   * POST /api/v1/messages
   * Gửi tin nhắn
   */
  sendMessage(body: SendMessageRequest) {
    return http.post<SendMessageResponse>('messages', body)
  },

  /**
   * GET /api/v1/notifications
   * Lấy danh sách thông báo
   */
  getNotifications() {
    return http.get<SuccessResponse<Notification[]>>('notifications')
  },

  /**
   * PUT /api/v1/notifications/:id/read
   * Đánh dấu đã đọc thông báo
   */
  markNotificationRead(id: string) {
    return http.put<SuccessResponse<Notification>>(`notifications/${id}/read`)
  }
}

export default interactionApi
