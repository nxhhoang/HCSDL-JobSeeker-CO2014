import { SuccessResponse } from './utils.type'

// Follow Response
export type FollowResponse = SuccessResponse<{
  employerId: string
  isFollowing: boolean
}>

// Feedback Request
export type FeedbackRequest = {
  content: string
  rank: number // 1-5
}

export type FeedbackResponse = SuccessResponse<{
  feedbackId: string
  jobId: string
  rank: number
  createdAt: string
}>

// Message
export type Message = {
  messageId: string
  senderId: string
  receiverId?: string
  content: string
  createdAt: string
  status?: 'Sent' | 'Read'
}

// Send Message Request
export type SendMessageRequest = {
  receiverId: string
  content: string
}

export type SendMessageResponse = SuccessResponse<{
  messageId: string
  receiverId: string
  sendTime: string
  status: string
}>

// Get Messages Query Params
export type GetMessagesParams = {
  with_user_id: string
  limit?: number
  offset?: number
}

export type GetMessagesResponse = SuccessResponse<Message[]>

// Notification
export type Notification = {
  id: string
  title: string
  content: string
  type: 'ApplyStatus' | 'Message' | 'System'
  isRead: boolean
  createdAt: string
}

export type GetNotificationsResponse = SuccessResponse<Notification[]>

export type MarkNotificationReadResponse = SuccessResponse<{
  notificationId: string
  isRead: boolean
}>
