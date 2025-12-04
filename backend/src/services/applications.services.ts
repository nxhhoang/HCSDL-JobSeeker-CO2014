import databaseService, { sql } from '~/services/database.services'
import { ApplyJobReqBody, UpdateApplyStatusReqBody } from '~/models/requests/Application.request'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { ApplyStatus, UserRole } from '~/constants/enums'

class ApplicationsService {
  // POST /jobs/:id/apply
  async applyJob(user_id: string, job_id: string, payload: ApplyJobReqBody) {
    const pool = databaseService.connection

    // 1. Check Job Expiry (Trigger in DB handles this, but good to check here too or handle DB error)
    // 2. Check Duplicate Apply
    const checkDup = await pool
      .request()
      .input('uid', sql.Int, user_id)
      .input('jid', sql.Int, job_id)
      .query('SELECT COUNT(*) as count FROM [APPLY] WHERE ID = @uid AND JobID = @jid')

    if (checkDup.recordset[0].count > 0) {
      throw new ErrorWithStatus({ message: 'You have already applied for this job', status: HTTP_STATUS.CONFLICT })
    }

    const finalCvUrl = payload.cvUrl
    if (!finalCvUrl) {
      const userProfile = await pool.request().input('id', sql.Int, user_id).query(`
            SELECT p.CV FROM [PERSON] p WHERE ID = @id
            -- Or if we haven't added CV column yet:
            -- SELECT NULL as CV
        `)
      // If CV column doesn't exist in DB yet, userProfile query might fail or return invalid.
      // Let's assume we check payload only for now to avoid DB error if migration pending.
      if (!finalCvUrl) {
        throw new ErrorWithStatus({ message: 'CV is required (Default CV not found)', status: HTTP_STATUS.BAD_REQUEST })
      }
    }

    try {
      await pool
        .request()
        .input('uid', sql.Int, user_id)
        .input('jid', sql.Int, job_id)
        .input('cv', sql.NVarChar, finalCvUrl)
        .input('letter', sql.NVarChar, payload.coverLetter || '')
        .input('status', sql.NVarChar, ApplyStatus.Pending) // N'Chờ duyệt'
        .query(`
                INSERT INTO [APPLY] (ID, JobID, CV, CoverLetter, Status, Date)
                VALUES (@uid, @jid, @cv, @letter, @status, GETDATE())
            `)

      return { jobId: job_id, status: ApplyStatus.Pending, appliedAt: new Date() }
    } catch (error: any) {
      // Handle Trigger Error (Job Expired)
      if (error.message.includes('expired')) {
        throw new ErrorWithStatus({ message: error.message, status: HTTP_STATUS.BAD_REQUEST })
      }
      throw error
    }
  }

  // GET /candidates/me/applies
  async getMyApplies(user_id: string) {
    const pool = databaseService.connection
    const result = await pool.request().input('uid', sql.Int, user_id).query(`
        SELECT a.JobID, j.JobName as JobTitle, u.Name as CompanyName, a.Status, a.Date
        FROM [APPLY] a
        JOIN [JOB] j ON a.JobID = j.JobID
        JOIN [USER] u ON j.ID = u.ID -- Employer User
        WHERE a.ID = @uid
        ORDER BY a.Date DESC
    `)
    return result.recordset
  }

  // GET /jobs/:id/applies (Employer View)
  async getJobApplies(user_id: string, job_id: string) {
    const pool = databaseService.connection
    // Check ownership
    const checkOwner = await pool
      .request()
      .input('jid', sql.Int, job_id)
      .query('SELECT ID FROM [JOB] WHERE JobID = @jid')
    if (checkOwner.recordset.length === 0 || checkOwner.recordset[0].ID != user_id) {
      throw new ErrorWithStatus({ message: 'Forbidden', status: HTTP_STATUS.FORBIDDEN })
    }

    const result = await pool.request().input('jid', sql.Int, job_id).query(`
        SELECT a.ID as candidateId, u.Name, u.Email, a.CV as cvUrl, a.CoverLetter, a.Status, a.Date as appliedAt
        FROM [APPLY] a
        JOIN [USER] u ON a.ID = u.ID
        WHERE a.JobID = @jid
    `)
    return result.recordset
  }

  async updateApplyStatus(user_id: string, job_id: string, candidate_id: string, status: string) {
    const pool = databaseService.connection
    // Check Employer Ownership
    const checkOwner = await pool
      .request()
      .input('jid', sql.Int, job_id)
      .query('SELECT ID FROM [JOB] WHERE JobID = @jid')
    if (checkOwner.recordset[0].ID != user_id)
      throw new ErrorWithStatus({ message: 'Forbidden', status: HTTP_STATUS.FORBIDDEN })

    await pool
      .request()
      .input('jid', sql.Int, job_id)
      .input('cid', sql.Int, candidate_id)
      .input('status', sql.NVarChar, status)
      .query(`UPDATE [APPLY] SET Status = @status WHERE JobID = @jid AND ID = @cid`)

    return { jobId: job_id, candidateId: candidate_id, status }
  }

  // DELETE /applies/:id (Candidate withdraw)
  // Again, issue with ID. Assuming Route: /jobs/:jobId/withdraw for Candidate context
  async withdrawApply(user_id: string, job_id: string) {
    const pool = databaseService.connection
    // Check if job expired? (Constraint)
    // Check status?
    await pool
      .request()
      .input('uid', sql.Int, user_id)
      .input('jid', sql.Int, job_id)
      .query(`DELETE FROM [APPLY] WHERE ID = @uid AND JobID = @jid`)

    return true
  }
}

export default new ApplicationsService()
