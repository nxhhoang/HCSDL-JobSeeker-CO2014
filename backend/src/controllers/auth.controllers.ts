import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
// import { RegisterReqBody, LoginReqBody, VerifyOtpReqBody } from '~/models/requests/Authentication.request'
import { RegisterReqBody, LoginReqBody, LogoutReqBody } from '~/models/requests/Authentication.request'
import authService from '~/services/auth.services'
import { USERS_MESSAGES } from '~/constants/messages'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await authService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const result = await authService.login(req.body)
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data: result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const result = await authService.logout(req.body)
  return res.json(result)
}

// export const verifyOtpController = async (req: Request<ParamsDictionary, any, VerifyOtpReqBody>, res: Response) => {
//   const { email, otpCode } = req.body
//   await authService.verifyOtp(email, otpCode)
//   return res.json({
//     message: 'Xác thực thành công. Tài khoản đã được kích hoạt.',
//     data: true
//   })
// }
