import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { USERS_MESSAGES } from '~/constants/messages'
import { TokenPayload, UpdateUserReqBody } from '~/models/requests/User.request'

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    data: result
  })
}

export const updateMeController = async (req: Request<any, any, UpdateUserReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersService.updateMe(user_id, req.body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    data: result
  })
}
