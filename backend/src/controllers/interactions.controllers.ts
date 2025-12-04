import { Request, Response } from 'express'
import interactionsService from '~/services/interactions.services'
import { INTERACTIONS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.request'

export const followEmployerController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await interactionsService.followEmployer(user_id, req.params.id)
  return res.json({ message: result.message, data: result })
}

export const sendFeedbackController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await interactionsService.sendFeedback(user_id, req.params.id, req.body)
  return res.json({ message: INTERACTIONS_MESSAGES.SEND_FEEDBACK_SUCCESS, data: result })
}

export const getMessagesController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await interactionsService.getMessages(user_id, req.query as any)
  return res.json({ message: INTERACTIONS_MESSAGES.GET_MESSAGES_SUCCESS, data: result })
}

export const sendMessageController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await interactionsService.sendMessage(user_id, req.body)
  return res.json({ message: INTERACTIONS_MESSAGES.SEND_MESSAGE_SUCCESS, data: result })
}

export const getNotificationsController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await interactionsService.getNotifications(user_id)
  return res.json({ message: INTERACTIONS_MESSAGES.GET_NOTIFICATIONS_SUCCESS, data: result })
}
