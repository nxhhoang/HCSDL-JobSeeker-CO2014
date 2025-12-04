import { Request, Response } from 'express'
import adminService from '~/services/admin.services'

export const getUsersController = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const role = req.query.role as string
  const search = req.query.search as string

  const result = await adminService.getUsers(page, limit, role, search)
  return res.json({ message: 'Get users success', data: result })
}

export const deleteUserController = async (req: Request, res: Response) => {
  await adminService.deleteUser(req.params.id)
  return res.json({ message: 'User deleted successfully', data: true })
}

export const getSystemStatsController = async (req: Request, res: Response) => {
  const result = await adminService.getSystemStats()
  return res.json({ message: 'Get system stats success', data: result })
}

// Skills
export const createSkillController = async (req: Request, res: Response) => {
  const result = await adminService.createSkill(req.body)
  return res.json({ message: 'Skill created', data: result })
}
export const updateSkillController = async (req: Request, res: Response) => {
  const result = await adminService.updateSkill(req.params.id, req.body)
  return res.json({ message: 'Skill updated', data: result })
}
export const deleteSkillController = async (req: Request, res: Response) => {
  await adminService.deleteSkill(req.params.id)
  return res.json({ message: 'Skill deleted', data: true })
}

// Categories
export const createCategoryController = async (req: Request, res: Response) => {
  const result = await adminService.createCategory(req.body)
  return res.json({ message: 'Category created', data: result })
}
export const updateCategoryController = async (req: Request, res: Response) => {
  // params id ở đây là string tên category (vì PK là string) -> encodeURI khi gọi
  const result = await adminService.updateCategory(req.params.id, req.body)
  return res.json({ message: 'Category updated', data: result })
}
export const deleteCategoryController = async (req: Request, res: Response) => {
  await adminService.deleteCategory(req.params.id)
  return res.json({ message: 'Category deleted', data: true })
}
