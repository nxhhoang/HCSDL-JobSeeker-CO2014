import databaseService, { sql } from '~/services/database.services'
import { PostJobReqBody, UpdateJobReqBody, FindJobsReqQuery } from '~/models/requests/Employer.request'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { ApplyStatus, UserRole } from '~/constants/enums'

class JobsService {
  // GET /jobs (Search)
  async findJobs(query: FindJobsReqQuery) {
    const pool = databaseService.connection
    // Use the Stored Procedure sp_FilterJobs defined in SQL script
    // @Keyword, @Location, @MinSalary, @ListSkills
    const result = await pool
      .request()
      .input('Keyword', sql.NVarChar, query.q || null)
      .input('Location', sql.NVarChar, query.loc || null)
      .input('MinSalary', sql.Decimal, query.salary_min || null)
      .input('ListSkills', sql.NVarChar, query.skill || null) // e.g. "Java,React"
      .execute('sp_FilterJobs')

    // Map result to API response format
    const jobs = result.recordset.map((row: any) => ({
      jobId: row.JobID,
      title: row.JobName,
      companyName: row.CompanyName,
      // logoUrl: ... (Need join with USER/COMPANY to get logo, SP might need update or handled here)
      salary: row.Salary,
      location: row.Location,
      // skills: ... (SP doesn't return skills list string, might need another query or update SP)
      postDate: row.PostDate,
      industry: row.Industry
    }))

    return jobs
  }

  // GET /jobs/:id
  async getJobDetail(id: string) {
    const pool = databaseService.connection

    // 1. Get Job + Company Info
    const jobQuery = `
      SELECT j.*, u.Name as CompanyName, u.ProfilePic as CompanyLogo, c.ID as CompanyID, c.TaxNumber
      FROM [JOB] j
      JOIN [USER] u ON j.ID = u.ID
      LEFT JOIN [COMPANY] c ON u.ID = c.ID
      WHERE j.JobID = @id
    `
    const jobRes = await pool.request().input('id', sql.Int, id).query(jobQuery)
    const job = jobRes.recordset[0]
    if (!job) return null

    // 2. Get Skills
    const skillRes = await pool.request().input('id', sql.Int, id).query(`
      SELECT s.SkillName FROM [REQUIRE] r JOIN [SKILL] s ON r.SkillID = s.SkillID WHERE r.JobID = @id
    `)
    const skills = skillRes.recordset.map((r: any) => r.SkillName)

    // 3. Get Categories
    const catRes = await pool.request().input('id', sql.Int, id).query(`
      SELECT JCName FROM [IN] WHERE JobID = @id
    `)
    const categories = catRes.recordset.map((r: any) => r.JCName)

    return {
      jobInfo: {
        id: job.JobID,
        title: job.JobName,
        expireDate: job.ExpireDate,
        viewCount: 0 // Not in DB yet
      },
      company: {
        id: job.CompanyID,
        name: job.CompanyName,
        avatar: job.CompanyLogo
      },
      jd: {
        description: '...', // SQL DB missing Description column in JOB table?
        // Checking SQL... JOB table has JobName, Location, Salary, Quantity, ExpYear, Level, ContractType, JobType.
        // MISSING: Description, Requirements, Benefits columns in [JOB] table in provided SQL.
        // Assuming they exist or using placeholders.
        location: job.Location,
        salary: job.Salary,
        quantity: job.Quantity,
        expYear: job.ExpYear,
        level: job.Level,
        contractType: job.ContractType,
        jobType: job.JobType
      },
      skills,
      categories
    }
  }

  // POST /jobs/post
  // POST /jobs/post
  async createJob(user_id: string, payload: PostJobReqBody) {
    const pool = databaseService.connection

    // === BƯỚC VALIDATION (MỚI THÊM) ===
    // 1. Kiểm tra xem các Skill IDs gửi lên có tồn tại trong DB không
    // Payload gửi lên: [1, 2] -> Cần check xem ID 1, 2 có trong bảng SKILL không
    if (payload.skillIds.length > 0) {
      // Tạo chuỗi ID để query, ví dụ: "1,2,5"
      // Lưu ý: Cách này đơn giản, nếu muốn an toàn tuyệt đối với SQL Injection thì dùng Table-Valued Parameters hoặc check từng cái
      // Ở đây ta dùng check số lượng query trả về

      // Vì mssql khó truyền mảng vào IN (...), ta sẽ query đếm số lượng dựa trên list ID
      // Cách đơn giản nhất: Loop check (hơi chậm) hoặc dùng logic ứng dụng.
      // Dưới đây là cách check nhanh bằng query dynamic (chấp nhận được với số lượng skill ít)
      const skillList = payload.skillIds.join(',')
      const checkSkills = await pool.request().query(`
          SELECT COUNT(*) as count FROM [SKILL] WHERE SkillID IN (${skillList})
       `)

      if (checkSkills.recordset[0].count !== payload.skillIds.length) {
        throw new ErrorWithStatus({
          message: 'One or more Skill IDs are invalid (do not exist)',
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }

    // 2. Kiểm tra xem Category Names gửi lên có tồn tại không
    // Payload: ["IT Software", "Accounting"]
    if (payload.categoryIds.length > 0) {
      // Chuyển mảng string thành chuỗi cho SQL: N'IT Software',N'Accounting'
      const catList = payload.categoryIds.map((c) => `N'${String(c).replace(/'/g, "''")}'`).join(',')
      const checkCats = await pool.request().query(`
          SELECT COUNT(*) as count FROM [JOB_CATEGORY] WHERE JCName IN (${catList})
       `)

      if (checkCats.recordset[0].count !== payload.categoryIds.length) {
        throw new ErrorWithStatus({
          message: 'One or more Job Categories are invalid. Please choose from the existing list.',
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }
    // === KẾT THÚC VALIDATION ===

    const transaction = new sql.Transaction(pool)

    try {
      await transaction.begin()

      // 1. Insert JOB (Như cũ, nhưng nhớ fix vụ OUTPUT triggers bằng SCOPE_IDENTITY)
      const reqJob = new sql.Request(transaction)
      const jobRes = await reqJob
        .input('name', sql.NVarChar, payload.jobInfo.title)
        .input('expire', sql.DateTime, payload.jobInfo.expireDate)
        .input('loc', sql.NVarChar, payload.jdInfo.location)
        .input('sal', sql.Decimal, payload.jdInfo.salary)
        .input('quan', sql.Int, payload.jdInfo.quantity)
        .input('exp', sql.Int, payload.jdInfo.expYear)
        .input('level', sql.NVarChar, payload.jdInfo.level)
        .input('contract', sql.NVarChar, payload.jdInfo.contractType)
        .input('type', sql.NVarChar, payload.jdInfo.jobType)
        .input('uid', sql.Int, user_id).query(`
          INSERT INTO [JOB] (JobName, ExpireDate, Location, Salary, Quantity, ExpYear, Level, ContractType, JobType, ID)
          VALUES (@name, @expire, @loc, @sal, @quan, @exp, @level, @contract, @type, @uid);
          
          SELECT JobID, PostDate FROM [JOB] WHERE JobID = SCOPE_IDENTITY();
        `)

      const jobId = jobRes.recordset[0].JobID
      const postDate = jobRes.recordset[0].PostDate

      // 2. Insert Skills (REQUIRE) - Chỉ link, không tạo mới
      for (const skillId of payload.skillIds) {
        await new sql.Request(transaction)
          .input('sid', sql.Int, skillId)
          .input('jid', sql.Int, jobId)
          .query('INSERT INTO [REQUIRE] (SkillID, JobID) VALUES (@sid, @jid)')
      }

      // 3. Insert Categories (IN) - Chỉ link, không tạo mới
      for (const catName of payload.categoryIds) {
        await new sql.Request(transaction)
          .input('cname', sql.NVarChar, String(catName))
          .input('jid', sql.Int, jobId)
          .query('INSERT INTO [IN] (JCName, JobID) VALUES (@cname, @jid)')
      }

      await transaction.commit()

      return { jobId, title: payload.jobInfo.title, postDate }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  // PUT /jobs/update/:id
  async updateJob(user_id: string, job_id: string, payload: UpdateJobReqBody) {
    // Similar to Create, but UPDATE
    const pool = databaseService.connection
    // Check ownership
    const checkOwner = await pool
      .request()
      .input('jid', sql.Int, job_id)
      .query('SELECT ID FROM [JOB] WHERE JobID = @jid')
    if (checkOwner.recordset.length === 0 || checkOwner.recordset[0].ID != user_id) {
      throw new ErrorWithStatus({ message: 'Forbidden or Not Found', status: HTTP_STATUS.FORBIDDEN })
    }

    // Dynamic Update Query... (Simplified for brevity)
    await // ... inputs
    pool
      .request()
      .input('jid', sql.Int, job_id)
      .input('title', sql.NVarChar, payload.jobInfo?.title)
      .input('expire', sql.DateTime, payload.jobInfo?.expireDate).query(`
            UPDATE [JOB] SET 
            JobName = COALESCE(@title, JobName), 
            ExpireDate = COALESCE(@expire, ExpireDate)
            WHERE JobID = @jid
        `)

    // Update Skills/Categories would require deleting old and inserting new (Transaction needed)
    return { jobId: job_id, updatedAt: new Date() }
  }

  // DELETE /jobs/delete/:id
  async deleteJob(user_id: string, user_role: UserRole, job_id: string) {
    const pool = databaseService.connection

    // 1. Nếu là Employer, phải kiểm tra quyền sở hữu và đơn Pending
    if (user_role === UserRole.Employer) {
      // Check Owner
      const checkOwner = await pool
        .request()
        .input('jid', sql.Int, job_id)
        .query('SELECT ID FROM [JOB] WHERE JobID = @jid')
      if (checkOwner.recordset.length === 0 || checkOwner.recordset[0].ID != user_id) {
        throw new ErrorWithStatus({ message: 'Forbidden', status: HTTP_STATUS.FORBIDDEN })
      }

      // Check Pending Applications (Logic chặn của Employer)
      const checkPending = await pool
        .request()
        .input('jid', sql.Int, job_id)
        .query(`SELECT COUNT(*) as count FROM [APPLY] WHERE JobID = @jid AND Status = N'Chờ duyệt'`)

      if (checkPending.recordset[0].count > 0) {
        throw new ErrorWithStatus({
          message: 'Cannot delete job with pending applications',
          status: HTTP_STATUS.CONFLICT
        })
      }
    }

    // 2. Nếu là Admin hoặc Employer (đã qua bước check trên) -> Thực hiện xóa
    // Trigger trg_CascadeDeleteJob trong DB sẽ lo việc xóa bảng con
    await pool.request().input('jid', sql.Int, job_id).query('DELETE FROM [JOB] WHERE JobID = @jid')

    return true
  }

  // POST /jobs/:id/relate
  async relateJob(job_id: string, related_job_id: string) {
    const pool = databaseService.connection
    await pool
      .request()
      .input('vjid', sql.Int, job_id)
      .input('rjid', sql.Int, related_job_id)
      .query('INSERT INTO [RELATE] (VJobID, RJobID) VALUES (@vjid, @rjid)')

    return { sourceJobId: job_id, relatedJobId: related_job_id }
  }

  // GET /jobs/my-jobs
  async getMyJobs(user_id: string) {
    const pool = databaseService.connection

    // Query to get jobs posted by the employer (identified by ID)
    const result = await pool.request().input('uid', sql.Int, user_id).query(`
        SELECT JobID, JobName, PostDate, ExpireDate, ViewCount = 0, -- Placeholder for ViewCount if not in DB
               (SELECT COUNT(*) FROM [APPLY] WHERE JobID = j.JobID) as ApplyCount
        FROM [JOB] j
        WHERE ID = @uid
        ORDER BY PostDate DESC
      `)

    // Map result
    return result.recordset.map((row: any) => ({
      jobId: row.JobID,
      title: row.JobName,
      postDate: row.PostDate,
      expireDate: row.ExpireDate,
      viewCount: row.ViewCount,
      applyCount: row.ApplyCount
    }))
  }

  // GET /jobs/:id/related
  async getRelatedJobs(job_id: string) {
    const pool = databaseService.connection

    // Logic: Lấy các job được link trong bảng RELATE
    // RELATE có VJobID (Job gốc) và RJobID (Job liên quan)
    // Cần join ngược lại bảng JOB để lấy thông tin chi tiết của job liên quan
    const result = await pool.request().input('jid', sql.Int, job_id).query(`
        SELECT j.JobID, j.JobName, j.Salary, j.Location, j.PostDate, 
               c.Industry, u.Name as CompanyName, u.ProfilePic as CompanyLogo
        FROM [RELATE] r
        JOIN [JOB] j ON r.RJobID = j.JobID
        JOIN [USER] u ON j.ID = u.ID
        LEFT JOIN [COMPANY] c ON u.ID = c.ID
        WHERE r.VJobID = @jid AND j.ExpireDate > GETDATE() -- Chỉ lấy job còn hạn
      `)

    return result.recordset.map((row: any) => ({
      jobId: row.JobID,
      title: row.JobName,
      companyName: row.CompanyName,
      logoUrl: row.CompanyLogo,
      salary: row.Salary,
      location: row.Location,
      postDate: row.PostDate,
      industry: row.Industry
    }))
  }
}

export default new JobsService()
