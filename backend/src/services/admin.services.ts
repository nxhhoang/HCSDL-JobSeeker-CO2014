import databaseService, { sql } from '~/services/database.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class AdminService {
  // Requirement 1 & 2: Data Retrieval (List Users with Filter/Sort/Pagination)
  async getUsers(page: number, limit: number, role?: string, search?: string) {
    const pool = databaseService.connection
    const offset = (page - 1) * limit

    // Query động để filter và search
    let query = `
      SELECT u.ID, u.Username, u.Email, u.Name, u.UserType, u.PhoneNum,
             CASE WHEN u.UserType = 'Employer' THEN c.TaxNumber ELSE NULL END as CompanyTaxNumber
      FROM [USER] u
      LEFT JOIN [COMPANY] c ON u.ID = c.ID
      WHERE 1=1
    `

    // Add conditions
    if (role) query += ` AND u.UserType = @role`
    if (search) query += ` AND (u.Username LIKE @search OR u.Email LIKE @search OR u.Name LIKE @search)`

    // Sort & Pagination
    query += ` ORDER BY u.ID DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`

    const request = pool.request().input('offset', sql.Int, offset).input('limit', sql.Int, limit)

    if (role) request.input('role', sql.NVarChar, role)
    if (search) request.input('search', sql.NVarChar, `%${search}%`)

    const result = await request.query(query)

    // Get total count for pagination metadata
    // Lưu ý: Cần query count riêng với cùng điều kiện filter để tính total page chính xác
    let countQuery = `SELECT COUNT(*) as total FROM [USER] u WHERE 1=1`
    if (role) countQuery += ` AND u.UserType = @role`
    if (search) countQuery += ` AND (u.Username LIKE @search OR u.Email LIKE @search)`

    const countReq = pool.request()
    if (role) countReq.input('role', sql.NVarChar, role)
    if (search) countReq.input('search', sql.NVarChar, `%${search}%`)

    const countRes = await countReq.query(countQuery)

    return {
      users: result.recordset,
      total: countRes.recordset[0].total,
      page,
      limit,
      total_pages: Math.ceil(countRes.recordset[0].total / limit)
    }
  }

  // Requirement 2: CRUD Operations (Delete User)
  // Logic: Xóa User sẽ xóa cascade các bảng PERSON/COMPANY do FK constraint (ON DELETE CASCADE trong SQL)
  // Thỏa mãn tiêu chí "involve two or more tables"
  // Requirement 2: CRUD Operations (Delete User)
  async deleteUser(id: string) {
    const pool = databaseService.connection
    const transaction = new sql.Transaction(pool)

    try {
      // 1. Kiểm tra User tồn tại và không phải Admin
      const check = await pool.request().input('id', sql.Int, id).query('SELECT UserType FROM [USER] WHERE ID = @id')

      if (!check.recordset[0]) {
        throw new ErrorWithStatus({ message: 'User not found', status: HTTP_STATUS.NOT_FOUND })
      }
      if (check.recordset[0].UserType === 'Admin') {
        throw new ErrorWithStatus({ message: 'Cannot delete Admin account', status: HTTP_STATUS.FORBIDDEN })
      }

      // 2. Bắt đầu Transaction xóa sạch dữ liệu liên quan
      await transaction.begin()
      const req = new sql.Request(transaction)
      req.input('id', sql.Int, id)

      // Xóa lần lượt các bảng con tham chiếu đến USER(ID)
      // Lưu ý: PERSON và COMPANY đã có ON DELETE CASCADE trong SQL gốc nên không cần xóa tay,
      // nhưng các bảng liên kết như OWN, FEEDBACK, MESSAGE... thường thiếu.
      await req.query(`
        DELETE FROM [JOB_HISTORY] WHERE CandidateID = @id;
        DELETE FROM [SOCIAL_LINK] WHERE SSN IN (SELECT SSN FROM [PERSON] WHERE ID = @id);
        DELETE FROM [OWN] WHERE ID = @id;
        DELETE FROM [FEEDBACK] WHERE ID = @id;
        DELETE FROM [APPLY] WHERE ID = @id;
        DELETE FROM [NOTIFY] WHERE CandidateID = @id OR EmployerID = @id;
        DELETE FROM [MESSAGE] WHERE SenderID = @id OR ReceiverID = @id;
        DELETE FROM [SENDMSG] WHERE SenderID = @id OR ReceiverID = @id;
        DELETE FROM [FOLLOW] WHERE EmployerID = @id OR CandidateID = @id;
        DELETE FROM [JOB] WHERE ID = @id; 
      `)

      // 3. Cuối cùng xóa User
      await req.query('DELETE FROM [USER] WHERE ID = @id')

      await transaction.commit()
      return true
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  // Requirement 3: Call Function/Procedure
  async getSystemStats() {
    const pool = databaseService.connection
    // Execute Stored Procedure
    const result = await pool.request().execute('sp_GetSystemStats')
    return result.recordset[0]
  }

  async createSkill(payload: { skillName: string; description?: string }) {
    const pool = databaseService.connection

    // Check duplicate
    const check = await pool
      .request()
      .input('name', sql.NVarChar, payload.skillName)
      .query('SELECT COUNT(*) as c FROM [SKILL] WHERE SkillName = @name')
    if (check.recordset[0].c > 0)
      throw new ErrorWithStatus({ message: 'Skill already exists', status: HTTP_STATUS.CONFLICT })

    const result = await pool
      .request()
      .input('name', sql.NVarChar, payload.skillName)
      .input('desc', sql.NVarChar, payload.description || '').query(`
        INSERT INTO [SKILL] (SkillName, SDescription) 
        OUTPUT INSERTED.SkillID, INSERTED.SkillName
        VALUES (@name, @desc)
      `)
    return result.recordset[0]
  }

  async updateSkill(id: string, payload: { skillName: string; description?: string }) {
    const pool = databaseService.connection
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, payload.skillName)
      .input('desc', sql.NVarChar, payload.description || '').query(`
        UPDATE [SKILL] 
        SET SkillName = @name, SDescription = @desc
        WHERE SkillID = @id
      `)
    if (result.rowsAffected[0] === 0)
      throw new ErrorWithStatus({ message: 'Skill not found', status: HTTP_STATUS.NOT_FOUND })
    return { id, ...payload }
  }

  async deleteSkill(id: string) {
    const pool = databaseService.connection

    // 1. Kiểm tra xem Skill có tồn tại không
    const checkExist = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT SkillID FROM [SKILL] WHERE SkillID = @id')
    if (checkExist.recordset.length === 0) {
      throw new ErrorWithStatus({ message: 'Skill not found', status: HTTP_STATUS.NOT_FOUND })
    }

    // --- TÙY CHỌN: GIỮ LẠI LOGIC CHẶN XÓA NẾU ĐANG ĐƯỢC SỬ DỤNG ---
    /*
    const checkUse = await pool.request().input('id', sql.Int, id).query(`
        SELECT (SELECT COUNT(*) FROM [REQUIRE] WHERE SkillID = @id) + 
               (SELECT COUNT(*) FROM [OWN] WHERE SkillID = @id) as TotalUsage
    `)
    if (checkUse.recordset[0].TotalUsage > 0) {
      throw new ErrorWithStatus({
        message: 'Cannot delete skill because it is being used by Jobs or Candidates',
        status: HTTP_STATUS.CONFLICT
      })
    }
    */
    // ------------------------------------------------------------------

    // --- LOGIC XÓA CASCADE (Nếu bạn muốn xóa luôn) ---
    const transaction = new sql.Transaction(pool)
    try {
      await transaction.begin()
      const req = new sql.Request(transaction)
      req.input('id', sql.Int, id)

      // Xóa ràng buộc trong bảng REQUIRE (Job yêu cầu skill này)
      await req.query('DELETE FROM [REQUIRE] WHERE SkillID = @id')

      // Xóa ràng buộc trong bảng OWN (User sở hữu skill này)
      await req.query('DELETE FROM [OWN] WHERE SkillID = @id')

      // Cuối cùng xóa Skill
      await req.query('DELETE FROM [SKILL] WHERE SkillID = @id')

      await transaction.commit()
      return true
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  // --- CATEGORIES MANAGEMENT ---

  async createCategory(payload: { jcName: string; speciality?: string }) {
    const pool = databaseService.connection
    // Check exist (PK)
    const check = await pool
      .request()
      .input('id', sql.NVarChar, payload.jcName)
      .query('SELECT COUNT(*) as c FROM [JOB_CATEGORY] WHERE JCName = @id')
    if (check.recordset[0].c > 0)
      throw new ErrorWithStatus({ message: 'Category already exists', status: HTTP_STATUS.CONFLICT })

    await pool
      .request()
      .input('name', sql.NVarChar, payload.jcName)
      .input('spec', sql.NVarChar, payload.speciality || '')
      .query('INSERT INTO [JOB_CATEGORY] (JCName, Speciality) VALUES (@name, @spec)')

    return payload
  }

  // Update Category: Vì JCName là PK, nên thường chỉ cho update Speciality.
  // Nếu muốn đổi tên -> Phức tạp vì phải update bảng IN (JobCategory FK).
  // Demo đơn giản: Update Speciality.
  async updateCategory(id: string, payload: { speciality: string }) {
    const pool = databaseService.connection
    const result = await pool
      .request()
      .input('id', sql.NVarChar, id) // Old Name
      .input('spec', sql.NVarChar, payload.speciality)
      .query('UPDATE [JOB_CATEGORY] SET Speciality = @spec WHERE JCName = @id')

    if (result.rowsAffected[0] === 0)
      throw new ErrorWithStatus({ message: 'Category not found', status: HTTP_STATUS.NOT_FOUND })
    return { jcName: id, ...payload }
  }

  async deleteCategory(id: string) {
    // id là JCName (string)
    const pool = databaseService.connection

    // Check exist
    const checkExist = await pool
      .request()
      .input('id', sql.NVarChar, id)
      .query('SELECT JCName FROM [JOB_CATEGORY] WHERE JCName = @id')
    if (checkExist.recordset.length === 0) {
      throw new ErrorWithStatus({ message: 'Category not found', status: HTTP_STATUS.NOT_FOUND })
    }

    const transaction = new sql.Transaction(pool)
    try {
      await transaction.begin()
      const req = new sql.Request(transaction)
      req.input('id', sql.NVarChar, id)

      // Xóa ràng buộc trong bảng IN
      await req.query('DELETE FROM [IN] WHERE JCName = @id')

      // Xóa Category
      await req.query('DELETE FROM [JOB_CATEGORY] WHERE JCName = @id')

      await transaction.commit()
      return true
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

export default new AdminService()
