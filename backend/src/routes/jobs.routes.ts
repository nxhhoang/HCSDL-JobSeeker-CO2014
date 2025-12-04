import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { createJobValidator, updateJobValidator } from '~/middlewares/jobs.middlewares'
import {
  createJobController,
  deleteJobController,
  findJobsController,
  getJobDetailController,
  relateJobController,
  updateJobController
} from '~/controllers/jobs.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const jobsRouter = Router()

jobsRouter.get('/', wrapRequestHandler(findJobsController))
jobsRouter.get('/:id', wrapRequestHandler(getJobDetailController))

// Employer protected routes
jobsRouter.post('/post', accessTokenValidator, createJobValidator, wrapRequestHandler(createJobController))
jobsRouter.put('/update/:id', accessTokenValidator, updateJobValidator, wrapRequestHandler(updateJobController))
jobsRouter.delete('/delete/:id', accessTokenValidator, wrapRequestHandler(deleteJobController))
jobsRouter.post('/:id/relate', accessTokenValidator, wrapRequestHandler(relateJobController))

export default jobsRouter
