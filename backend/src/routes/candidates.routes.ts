import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
// import { updateCvValidator, addJobHistoryValidator, updateSkillsValidator } from '~/middlewares/candidates.middlewares'
import { addJobHistoryValidator, updateSkillsValidator } from '~/middlewares/candidates.middlewares'
import {
  getCandidateProfileController,
  // updateCvController,
  addJobHistoryController,
  updateSkillsController,
  getJobHistoryController
} from '~/controllers/candidates.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const candidatesRouter = Router()

// Public route to view candidate (Auth required for Employer role check middleware if strict, but API doc says Role: Employer)
// For simplicity assuming accessTokenValidator checks generic auth. You can add roleValidator middleware.
candidatesRouter.get('/:id', accessTokenValidator, wrapRequestHandler(getCandidateProfileController))

/**
 * Description: Get candidate job history
 * Path: /me/job-history
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
candidatesRouter.get('/me/job-history', accessTokenValidator, wrapRequestHandler(getJobHistoryController))

// candidatesRouter.put('/me/cv', accessTokenValidator, updateCvValidator, wrapRequestHandler(updateCvController))
candidatesRouter.post(
  '/me/job-history',
  accessTokenValidator,
  addJobHistoryValidator,
  wrapRequestHandler(addJobHistoryController)
)
candidatesRouter.put(
  '/me/skills',
  accessTokenValidator,
  updateSkillsValidator,
  wrapRequestHandler(updateSkillsController)
)

export default candidatesRouter
