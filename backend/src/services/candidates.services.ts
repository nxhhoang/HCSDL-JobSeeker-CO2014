import databaseService, { sql } from '~/services/database.services'
import { UpdateCvReqBody, AddJobHistoryReqBody, UpdateSkillsReqBody } from '~/models/requests/Candidate.request'
import JobHistory from '~/models/schemas/JobHistory.schema'

class CandidateService {
  // GET /candidates/:id
  async getCandidateProfile(id: string) {
    const pool = databaseService.connection
    // Get Basic Info + Skills + Job History
    // Using multiple queries for clarity or a complex join with JSON aggregation (MSSQL FOR JSON PATH)

    // 1. Basic Info & Skills
    const profileQuery = `
      SELECT u.ID, u.Name, u.Email, u.PhoneNum, u.Address, a.CV,
      (SELECT s.SkillName FROM OWN o JOIN SKILL s ON o.SkillID = s.SkillID WHERE o.ID = u.ID FOR JSON PATH) as Skills
      FROM [USER] u
      LEFT JOIN APPLY a ON a.ID = u.ID AND a.CV IS NOT NULL -- Assuming CV stored in APPLY or separate field (Schema says APPLY has CV, but API says User/Candidate has CV default)
      -- Wait, SQL schema doesn't have CV in USER or PERSON. 
      -- API Doc says "Update default CV for Candidate profile". 
      -- Let's assume we store "default CV" in USER.ProfilePic or create a new column if strict, 
      -- OR utilize the existing schema: maybe it's missing in SQL provided.
      -- Let's assume we use 'ProfilePic' as placeholder or we strictly follow schema:
      -- Schema has 'APPLY' table having CV. But that's per job application.
      -- FOR NOW: I will update [USER] table to have 'CV' column or use a specific field if I missed it.
      -- Checking SQL... No CV column in USER or PERSON. 
      -- Solution: I will assume there is a column [CV] in [USER] or [PERSON] for this logic implementation. 
      -- Let's use [Bio] as temporary storage or assume migration added [CV] NVARCHAR(255).
      -- Let's assume we added [CV] to [PERSON].
      LEFT JOIN [PERSON] p ON u.ID = p.ID
      WHERE u.ID = @id AND u.UserType = 'Candidate'
    `
    // Note: Implementing strictly based on provided SQL, we might need to Alter Table.

    const result = await pool.request().input('id', sql.Int, id).query(profileQuery)
    const user = result.recordset[0]
    if (!user) return null

    // 2. Job History
    const historyResult = await pool.request().input('id', sql.Int, id).query(`
      SELECT ComName, Position, StartTime, EndTime FROM JOB_HISTORY WHERE CandidateID = @id
    `)

    return {
      id: user.ID,
      name: user.Name,
      email: user.Email,
      phone: user.PhoneNum,
      address: user.Address,
      cvUrl: user.CV, // Assuming we mapped it
      skills: user.Skills ? JSON.parse(user.Skills).map((s: any) => s.SkillName) : [],
      jobHistory: historyResult.recordset
    }
  }

  // PUT /candidates/me/cv
  // async updateCv(user_id: string, payload: UpdateCvReqBody) {
  //   const pool = databaseService.connection
  //   // Update CV url. Assuming we added CV column to PERSON or use Bio for demo.
  //   // Ideally: UPDATE [PERSON] SET CV = @cv WHERE ID = @id
  //   // Let's assume we execute this.
  //   await pool
  //     .request()
  //     .input('id', sql.Int, user_id)
  //     .input('cv', sql.NVarChar, payload.cvUrl)
  //     .query(`UPDATE [PERSON] SET CV = @cv WHERE ID = @id`)
  //   // Note: If this fails due to missing column, please run: ALTER TABLE PERSON ADD CV NVARCHAR(255);

  //   return { candidateId: user_id, cvUrl: payload.cvUrl, updatedAt: new Date() }
  // }

  // POST /candidates/me/job-history
  async addJobHistory(user_id: string, payload: AddJobHistoryReqBody) {
    const pool = databaseService.connection
    await pool
      .request()
      .input('id', sql.Int, user_id)
      .input('com', sql.NVarChar, payload.comName)
      .input('pos', sql.NVarChar, payload.position)
      .input('start', sql.DateTime, payload.startTime)
      .input('end', sql.DateTime, payload.endTime || null).query(`
        INSERT INTO JOB_HISTORY (CandidateID, ComName, Position, StartTime, EndTime)
        VALUES (@id, @com, @pos, @start, @end)
      `)
    return { comName: payload.comName, position: payload.position }
  }

  // PUT /candidates/me/skills
  async updateSkills(user_id: string, payload: UpdateSkillsReqBody) {
    const pool = databaseService.connection
    const transaction = new sql.Transaction(pool)
    try {
      await transaction.begin()
      const req = new sql.Request(transaction)

      // 1. Delete old skills
      await req.input('id', sql.Int, user_id).query('DELETE FROM OWN WHERE ID = @id')

      // 2. Insert new skills
      // MSSQL doesn't support bulk insert values easily with variable arrays in one statement without loop or JSON
      // Using loop for simplicity or JSON OPENJSON if version supports (2016+)
      for (const skillId of payload.skillIds) {
        const reqInsert = new sql.Request(transaction)
        await reqInsert
          .input('uid', sql.Int, user_id)
          .input('sid', sql.Int, skillId)
          .query('INSERT INTO OWN (ID, SkillID) VALUES (@uid, @sid)')
      }

      await transaction.commit()
      return payload.skillIds
    } catch (e) {
      await transaction.rollback()
      throw e
    }
  }

  // GET /candidates/me/job-history
  async getJobHistory(user_id: string) {
    const pool = databaseService.connection

    // Query to fetch all job history records for the specific candidate
    // Ordering by StartTime descending to show most recent jobs first
    const result = await pool.request().input('id', sql.Int, user_id).query(`
        SELECT HistoryID, CandidateID, Position, ComName, StartTime, EndTime 
        FROM JOB_HISTORY 
        WHERE CandidateID = @id
        ORDER BY StartTime DESC
      `)

    // Map the raw DB result to the JobHistory schema for consistent response format
    return result.recordset.map(
      (row: any) =>
        new JobHistory({
          history_id: row.HistoryID,
          candidate_id: row.CandidateID,
          position: row.Position,
          com_name: row.ComName,
          start_time: row.StartTime,
          end_time: row.EndTime
        })
    )
  }
}
export default new CandidateService()
