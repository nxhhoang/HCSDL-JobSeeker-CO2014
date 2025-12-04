import { Request, Response } from 'express'
import candidateService from '~/services/candidates.services'
import { CANDIDATE_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.request'

export const getCandidateProfileController = async (req: Request, res: Response) => {
  const result = await candidateService.getCandidateProfile(req.params.id)
  return res.json({ message: CANDIDATE_MESSAGES.GET_PROFILE_SUCCESS, data: result })
}

// export const updateCvController = async (req: Request, res: Response) => {
//   const { user_id } = req.decoded_authorization as TokenPayload
//   const result = await candidateService.updateCv(user_id, req.body)
//   return res.json({ message: CANDIDATE_MESSAGES.UPDATE_CV_SUCCESS, data: result })
// }

export const addJobHistoryController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await candidateService.addJobHistory(user_id, req.body)
  return res.json({ message: CANDIDATE_MESSAGES.ADD_JOB_HISTORY_SUCCESS, data: result })
}

export const updateSkillsController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await candidateService.updateSkills(user_id, req.body)
  return res.json({ message: CANDIDATE_MESSAGES.UPDATE_SKILLS_SUCCESS, data: result })
}

export const getJobHistoryController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await candidateService.getJobHistory(user_id)

  return res.json({
    message: CANDIDATE_MESSAGES.GET_JOB_HISTORY_SUCCESS,
    data: result
  })
}
