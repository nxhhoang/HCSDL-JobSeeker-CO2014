import { Request, Response } from 'express'
import { ADMIN_MESSAGES } from '~/constants/messages'
import adminService from '~/services/admin.services'

export const getUsersController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const role = req.query.role as string
  const search = req.query.search as string
  
  // Thay đổi cách nhận tham số sort
  const sortBy = req.query.sortBy as string || 'id' // Mặc định sort theo ID
  const order = req.query.order as string || 'desc' // Mặc định mới nhất trước

  const result = await adminService.getUsers(page, limit, role, search, sortBy, order)
  return res.json({ message: ADMIN_MESSAGES.GET_USERS_SUCCESS, data: result })
}

export const deleteUserController = async (req: Request, res: Response) => {
  await adminService.deleteUser(req.params.id)
  return res.json({ message: ADMIN_MESSAGES.DELETE_USER_SUCCESS, data: true })
}

export const getSystemStatsController = async (req: Request, res: Response) => {
  const result = await adminService.getSystemStats()
  return res.json({ message: ADMIN_MESSAGES.GET_SYSTEM_STATS_SUCCESS, data: result })
}

// Skills
export const createSkillController = async (req: Request, res: Response) => {
  const result = await adminService.createSkill(req.body)
  return res.json({ message: ADMIN_MESSAGES.CREATE_SKILL_SUCCESS, data: result })
}
export const updateSkillController = async (req: Request, res: Response) => {
  const result = await adminService.updateSkill(req.params.id, req.body)
  return res.json({ message: ADMIN_MESSAGES.UPDATE_SKILL_SUCCESS, data: result })
}
export const deleteSkillController = async (req: Request, res: Response) => {
  await adminService.deleteSkill(req.params.id)
  return res.json({ message: ADMIN_MESSAGES.DELETE_SKILL_SUCCESS, data: true })
}

// Categories
export const createCategoryController = async (req: Request, res: Response) => {
  const result = await adminService.createCategory(req.body)
  return res.json({ message: ADMIN_MESSAGES.CREATE_CATEGORY_SUCCESS, data: result })
}
export const updateCategoryController = async (req: Request, res: Response) => {
  // params id ở đây là string tên category (vì PK là string) -> encodeURI khi gọi
  const result = await adminService.updateCategory(req.params.id, req.body)
  return res.json({ message: ADMIN_MESSAGES.UPDATE_CATEGORY_SUCCESS, data: result })
}
export const deleteCategoryController = async (req: Request, res: Response) => {
  await adminService.deleteCategory(req.params.id)
  return res.json({ message: ADMIN_MESSAGES.DELETE_CATEGORY_SUCCESS, data: true })
}
