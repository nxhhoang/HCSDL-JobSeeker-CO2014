import databaseService, { sql } from '~/services/database.services'
import Skill from '~/models/schemas/Skill.schema'
import JobCategory from '~/models/schemas/JobCategory.schema'

class MetadataService {
  async getSkills(search?: string) {
    const pool = databaseService.connection
    const request = pool.request()

    let queryString = 'SELECT SkillID, SkillName, SDescription FROM SKILL'

    // Xử lý tìm kiếm nếu có tham số q
    if (search) {
      request.input('search', sql.NVarChar, `%${search}%`)
      queryString += ' WHERE SkillName LIKE @search'
    }

    const result = await request.query(queryString)

    // Map kết quả từ DB (PascalCase) sang Schema (snake_case)
    return result.recordset.map(
      (row: any) =>
        new Skill({
          skill_id: row.SkillID,
          skill_name: row.SkillName,
          s_description: row.SDescription
        })
    )
  }

  async getCategories() {
    const pool = databaseService.connection
    // Query bảng JOB_CATEGORY
    // Lưu ý: Bảng này PK là JCName, không có ID số tự tăng trong SQL script cũ
    const result = await pool.request().query('SELECT JCName, Speciality FROM JOB_CATEGORY')

    return result.recordset.map(
      (row: any) =>
        new JobCategory({
          jc_name: row.JCName,
          speciality: row.Speciality
        })
    )
  }
}

const metadataService = new MetadataService()
export default metadataService
