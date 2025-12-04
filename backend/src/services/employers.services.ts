import databaseService, { sql } from '~/services/database.services'
import { CreateCompanyReqBody } from '~/models/requests/Employer.request'

class EmployerService {
  // POST /companies
  async createCompany(user_id: string, payload: CreateCompanyReqBody) {
    const pool = databaseService.connection
    // Insert into COMPANY linked to USER
    const result = await pool
      .request()
      .input('id', sql.Int, user_id)
      .input('tax', sql.VarChar, payload.taxNumber)
      .input('name', sql.NVarChar, payload.name)
      .input('found', sql.Date, payload.foundedDate)
      .input('ind', sql.NVarChar, payload.industry)
      .input('size', sql.NVarChar, payload.size)
      .input('country', sql.NVarChar, payload.country)
      .input('web', sql.NVarChar, payload.website).query(`
        INSERT INTO COMPANY (TaxNumber, FoundedDate, Industry, Size, Country, Website, ID)
        OUTPUT INSERTED.TaxNumber
        VALUES (@tax, @found, @ind, @size, @country, @web, @id)
      `)

    return { companyId: result.recordset[0].TaxNumber, name: payload.name }
  }

  // GET /employers/:id
  async getEmployerProfile(id: string) {
    const pool = databaseService.connection
    // Get Employer info + Company info
    const query = `
      SELECT u.ID, u.Name, u.ProfilePic,
             c.TaxNumber, c.Industry, c.Website, c.Country
      FROM [USER] u
      LEFT JOIN COMPANY c ON u.ID = c.ID
      WHERE u.ID = @id AND u.UserType = 'Employer'
    `
    const result = await pool.request().input('id', sql.Int, id).query(query)
    const emp = result.recordset[0]

    if (!emp) return null

    // Get Active Jobs Count
    const jobsCount = await pool.request().input('id', sql.Int, id).query(`
        SELECT COUNT(*) as count FROM JOB WHERE ID = @id AND ExpireDate > GETDATE()
    `)

    return {
      id: emp.ID,
      name: emp.Name,
      avatar: emp.ProfilePic,
      company: emp.TaxNumber
        ? {
            taxNumber: emp.TaxNumber,
            industry: emp.Industry,
            website: emp.Website,
            country: emp.Country
          }
        : null,
      activeJobs: jobsCount.recordset[0].count
    }
  }

  // GET /employers/:id/followers
  async getFollowers(employer_id: string) {
    const pool = databaseService.connection
    const query = `
      SELECT u.ID as userId, u.Name, u.ProfilePic, u.Bio as headline
      FROM FOLLOW f
      JOIN [USER] u ON f.CandidateID = u.ID
      WHERE f.EmployerID = @eid
    `
    const result = await pool.request().input('eid', sql.Int, employer_id).query(query)
    return result.recordset
  }
}
export default new EmployerService()
