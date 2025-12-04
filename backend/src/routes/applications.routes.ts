import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { applyJobValidator, updateApplyStatusValidator } from '~/middlewares/applications.middlewares'
import {
  applyJobController,
  getMyAppliesController,
  getJobAppliesController,
  updateApplyStatusController,
  withdrawApplyController
} from '~/controllers/applications.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const applicationsRouter = Router()

// --- Candidate Routes ---
// POST /jobs/:id/apply -> params.id is JobID
applicationsRouter.post(
  '/jobs/:id/apply',
  accessTokenValidator,
  applyJobValidator,
  wrapRequestHandler(applyJobController)
)

// GET /candidates/me/applies
applicationsRouter.get('/candidates/me/applies', accessTokenValidator, wrapRequestHandler(getMyAppliesController))

// DELETE /applies/jobs/:id -> Withdraw from Job :id
applicationsRouter.delete('/applies/jobs/:id', accessTokenValidator, wrapRequestHandler(withdrawApplyController))

// --- Employer Routes ---
// GET /jobs/:id/applies
applicationsRouter.get('/jobs/:id/applies', accessTokenValidator, wrapRequestHandler(getJobAppliesController))

// PUT /jobs/:id/applies/:candidateId/status (Adjusted from /applies/:id/status)
applicationsRouter.put(
  '/jobs/:id/applies/:candidateId/status',
  accessTokenValidator,
  updateApplyStatusValidator,
  wrapRequestHandler(updateApplyStatusController)
)

export default applicationsRouter
