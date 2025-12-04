import { Request, Response } from 'express'
import employerService from '~/services/employers.services'
import { EMPLOYER_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.request'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'

export const createCompanyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  console.log(user_id)
  console.log(req.params.id)
  const result = await employerService.createCompany(user_id, req.body)
  return res.json({ message: EMPLOYER_MESSAGES.CREATE_COMPANY_SUCCESS, data: result })
}

export const getEmployerProfileController = async (req: Request, res: Response) => {
  const result = await employerService.getEmployerProfile(req.params.id)
  if (!result) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  return res.json({ message: EMPLOYER_MESSAGES.GET_EMPLOYER_SUCCESS, data: result })
}

export const getFollowersController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  console.log(user_id)
  console.log(req.params.id)
  // Check if requesting user matches param id (Constraint: Employer check their own followers)
  if (user_id !== req.params.id) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
  }
  const result = await employerService.getFollowers(user_id)
  return res.json({ message: EMPLOYER_MESSAGES.GET_FOLLOWERS_SUCCESS, data: result })
}
