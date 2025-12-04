import { Request, Response } from 'express'
import jobsService from '~/services/jobs.services'
import { JOBS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.request'
import { UserRole } from '~/constants/enums'

export const findJobsController = async (req: Request, res: Response) => {
  const result = await jobsService.findJobs(req.query)
  return res.json({ message: JOBS_MESSAGES.GET_JOBS_SUCCESS, data: result })
}

export const getJobDetailController = async (req: Request, res: Response) => {
  const result = await jobsService.getJobDetail(req.params.id)
  return res.json({ message: JOBS_MESSAGES.GET_JOB_DETAIL_SUCCESS, data: result })
}

export const createJobController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await jobsService.createJob(user_id, req.body)
  return res.json({ message: JOBS_MESSAGES.CREATE_JOB_SUCCESS, data: result })
}

export const updateJobController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await jobsService.updateJob(user_id, req.params.id, req.body)
  return res.json({ message: JOBS_MESSAGES.UPDATE_JOB_SUCCESS, data: result })
}

export const deleteJobController = async (req: Request, res: Response) => {
  const { user_id, userType } = req.decoded_authorization as TokenPayload
  await jobsService.deleteJob(user_id, userType as UserRole, req.params.id)
  return res.json({ message: JOBS_MESSAGES.DELETE_JOB_SUCCESS, data: true })
}

export const relateJobController = async (req: Request, res: Response) => {
  const result = await jobsService.relateJob(req.params.id, req.body.relatedJobId)
  return res.json({ message: JOBS_MESSAGES.RELATE_JOB_SUCCESS, data: result })
}

export const getMyJobsController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await jobsService.getMyJobs(user_id)
  return res.json({ message: JOBS_MESSAGES.GET_MY_JOBS_SUCCESS, data: result })
}

export const getRelatedJobsController = async (req: Request, res: Response) => {
  const result = await jobsService.getRelatedJobs(req.params.id)
  return res.json({ message: JOBS_MESSAGES.GET_RELATED_JOBS_SUCCESS, data: result })
}
