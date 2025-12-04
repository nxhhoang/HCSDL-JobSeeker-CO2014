import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import {
  sendFeedbackValidator,
  sendMessageValidator,
  getMessagesValidator
} from '~/middlewares/interactions.middlewares'
import {
  followEmployerController,
  sendFeedbackController,
  getMessagesController,
  sendMessageController,
  getNotificationsController
} from '~/controllers/interactions.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const interactionsRouter = Router()

// Follow
interactionsRouter.post('/employers/:id/follow', accessTokenValidator, wrapRequestHandler(followEmployerController))

// Feedback
interactionsRouter.post(
  '/jobs/:id/feedback',
  accessTokenValidator,
  sendFeedbackValidator,
  wrapRequestHandler(sendFeedbackController)
)

// Messages
interactionsRouter.get(
  '/messages',
  accessTokenValidator,
  getMessagesValidator,
  wrapRequestHandler(getMessagesController)
)
interactionsRouter.post(
  '/messages',
  accessTokenValidator,
  sendMessageValidator,
  wrapRequestHandler(sendMessageController)
)

// Notifications
interactionsRouter.get('/notifications', accessTokenValidator, wrapRequestHandler(getNotificationsController))

export default interactionsRouter
