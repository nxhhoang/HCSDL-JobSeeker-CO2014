import { Request, Response } from 'express'
import applicationsService from '~/services/applications.services'
import { APPLICATIONS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.request'

export const applyJobController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await applicationsService.applyJob(user_id, req.params.id, req.body)
  return res.json({ message: APPLICATIONS_MESSAGES.APPLY_JOB_SUCCESS, data: result })
}

export const getMyAppliesController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await applicationsService.getMyApplies(user_id)
  return res.json({ message: APPLICATIONS_MESSAGES.GET_MY_APPLIES_SUCCESS, data: result })
}

export const getJobAppliesController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await applicationsService.getJobApplies(user_id, req.params.id)
  return res.json({ message: APPLICATIONS_MESSAGES.GET_JOB_APPLIES_SUCCESS, data: result })
}

// Adjusted for Composite Key logic: Params :id = jobId, Body contains candidateId?
// Or Route: /jobs/:id/candidates/:candidateId/status
export const updateApplyStatusController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { status } = req.body
  // Using Params: :id as JobId, :candidateId as CandidateID
  const { id: jobId, candidateId } = req.params

  const result = await applicationsService.updateApplyStatus(user_id, jobId, candidateId, status)
  return res.json({ message: APPLICATIONS_MESSAGES.UPDATE_APPLY_STATUS_SUCCESS, data: result })
}

export const withdrawApplyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  // Assuming param :id is JobID for withdrawal context of a candidate
  const result = await applicationsService.withdrawApply(user_id, req.params.id)
  return res.json({ message: APPLICATIONS_MESSAGES.DELETE_APPLY_SUCCESS, data: result })
}
