import { Router } from 'express'
import { getCategoriesController, getSkillsController } from '~/controllers/metadata.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const metadataRouter = Router()

/**
 * Description: Get list of skills
 * Path: /skills
 * Method: GET
 * Query: ?q=name (optional)
 */
metadataRouter.get('/skills', wrapRequestHandler(getSkillsController))

/**
 * Description: Get list of job categories
 * Path: /categories
 * Method: GET
 */
metadataRouter.get('/categories', wrapRequestHandler(getCategoriesController))

export default metadataRouter