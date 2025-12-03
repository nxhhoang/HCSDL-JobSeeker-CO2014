import { Request, Response } from 'express'
import { METADATA_MESSAGES } from '~/constants/messages'
import metadataService from '~/services/metadata.services'

export const getSkillsController = async (req: Request, res: Response) => {
  // Lấy tham số q từ query url (vd: /skills?q=Java)
  const { q } = req.query

  const result = await metadataService.getSkills(q as string)

  return res.json({
    message: METADATA_MESSAGES.GET_SKILLS_SUCCESS,
    data: result
  })
}

export const getCategoriesController = async (req: Request, res: Response) => {
  const result = await metadataService.getCategories()

  return res.json({
    message: METADATA_MESSAGES.GET_CATEGORIES_SUCCESS,
    data: result
  })
}
