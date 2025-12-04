import { Router } from 'express'
// import { loginController, registerController, verifyOtpController } from '~/controllers/auth.controllers'
import { loginController, registerController, logoutController } from '~/controllers/auth.controllers'
import {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator
} from '~/middlewares/auth.middlewares' // Import thêm refreshTokenValidator, accessTokenValidator
import { wrapRequestHandler } from '~/utils/handlers'

const authRouter = Router()

/**
 * Path: /auth/register
 * Method: POST
 */
authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Path: /auth/login
 * Method: POST
 */
authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

// /**
//  * Path: /auth/verify-otp
//  * Method: POST
//  */
// authRouter.post('/verify-otp', wrapRequestHandler(verifyOtpController))

authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

export default authRouter
