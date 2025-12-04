import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { createCompanyValidator } from '~/middlewares/employers.middlewares'
import {
  createCompanyController,
  getEmployerProfileController,
  getFollowersController
} from '~/controllers/employers.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const employersRouter = Router()

// Public or Auth required
employersRouter.get('/:id', wrapRequestHandler(getEmployerProfileController))

// Auth Required (Employer)
employersRouter.get('/:id/followers', accessTokenValidator, wrapRequestHandler(getFollowersController))

// Companies
export const companiesRouter = Router()
companiesRouter.post('/', accessTokenValidator, createCompanyValidator, wrapRequestHandler(createCompanyController))

export default employersRouter
