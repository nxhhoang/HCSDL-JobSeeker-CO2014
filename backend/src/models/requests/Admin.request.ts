/**
 * Endpoint: /admin/skills
 * Method: POST
 */
export interface CreateSkillReqBody {
  skillName: string
  description?: string
}

/**
 * Endpoint: /admin/skills/:id
 * Method: PUT
 */
export interface UpdateSkillReqBody {
  skillName: string
  description?: string
}

/**
 * Endpoint: /admin/categories
 * Method: POST
 */
export interface CreateCategoryReqBody {
  jcName: string // PK
  speciality?: string
}

/**
 * Endpoint: /admin/categories/:id
 * Method: PUT
 * Lưu ý: Category dùng JCName làm PK, nên update PK là việc phức tạp (Cascade).
 * Nếu chỉ update Speciality thì dễ. Nếu update Name -> Tạo mới + Xóa cũ + Update các bảng liên quan.
 * Giả sử chỉ cho update Speciality hoặc đổi tên (cần xử lý transaction).
 */
export interface UpdateCategoryReqBody {
  speciality?: string
  // newName?: string // Nếu muốn đổi tên (PK)
}
