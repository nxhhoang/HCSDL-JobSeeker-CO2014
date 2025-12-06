import { setupWorker } from 'msw/browser'
import authRequests from './auth.msw'
import userRequests from './user.msw'
import productRequests from './product.msw'

export const worker = setupWorker(...authRequests, ...userRequests, ...productRequests)