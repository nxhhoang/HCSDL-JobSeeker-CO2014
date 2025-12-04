import { Router } from 'express'
import { getMeController, updateMeController } from '~/controllers/users.controllers'
import { accessTokenValidator } from '~/middlewares/auth.middlewares' // Assuming you have this
import { updateMeValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my profile
 * Path: /me
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateUserReqBody
 */
usersRouter.put('/me', accessTokenValidator, updateMeValidator, wrapRequestHandler(updateMeController))

export default usersRouter
