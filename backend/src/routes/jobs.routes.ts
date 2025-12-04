import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { createJobValidator, updateJobValidator } from '~/middlewares/jobs.middlewares'
import {
  createJobController,
  deleteJobController,
  findJobsController,
  getJobDetailController,
  relateJobController,
  updateJobController,
  getMyJobsController, // Import new controller
  getRelatedJobsController
} from '~/controllers/jobs.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const jobsRouter = Router()

jobsRouter.get('/', wrapRequestHandler(findJobsController))

// Employer protected routes
// IMPORTANT: Place this BEFORE /:id route
jobsRouter.get('/my-jobs', accessTokenValidator, wrapRequestHandler(getMyJobsController))
jobsRouter.get('/:id', wrapRequestHandler(getJobDetailController))

jobsRouter.post('/post', accessTokenValidator, createJobValidator, wrapRequestHandler(createJobController))
jobsRouter.put('/update/:id', accessTokenValidator, updateJobValidator, wrapRequestHandler(updateJobController))
jobsRouter.delete('/delete/:id', accessTokenValidator, wrapRequestHandler(deleteJobController))
jobsRouter.post('/:id/relate', accessTokenValidator, wrapRequestHandler(relateJobController))
jobsRouter.get('/:id/related', wrapRequestHandler(getRelatedJobsController))

export default jobsRouter