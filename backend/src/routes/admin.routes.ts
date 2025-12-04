import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import { adminValidator, categoryValidator, skillValidator } from '~/middlewares/admin.middlewares'
import {
  getUsersController,
  deleteUserController,
  getSystemStatsController,
  createSkillController,
  deleteSkillController,
  updateSkillController,
  createCategoryController,
  deleteCategoryController
} from '~/controllers/admin.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const adminRouter = Router()

// Apply Auth and Admin check for all routes in this router
adminRouter.use(accessTokenValidator, adminValidator)

// 1. Data Retrieval endpoint
adminRouter.get('/users', wrapRequestHandler(getUsersController))

// 2. CRUD Operation (Delete) endpoint
adminRouter.delete('/users/:id', wrapRequestHandler(deleteUserController))

// 3. Call Procedure endpoint
adminRouter.get('/stats', wrapRequestHandler(getSystemStatsController))

// Metadata - Skills
adminRouter.post('/skills', skillValidator, wrapRequestHandler(createSkillController))
adminRouter.put('/skills/:id', skillValidator, wrapRequestHandler(updateSkillController))
adminRouter.delete('/skills/:id', wrapRequestHandler(deleteSkillController))

// Metadata - Categories
adminRouter.post('/categories', categoryValidator, wrapRequestHandler(createCategoryController))
adminRouter.delete('/categories/:id', wrapRequestHandler(deleteCategoryController))

export default adminRouter
