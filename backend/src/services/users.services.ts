import databaseService, { sql } from '~/services/database.services'
import { UpdateUserReqBody } from '~/models/requests/User.request'
import { UserRole } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'

class UsersService {
  // GET /users/me
  async getMe(user_id: string) {
    const pool = databaseService.connection

    // Join USER with PERSON and COMPANY to get all potential data
    const query = `
      SELECT 
        u.*,
        p.SSN, p.DOB, 
        c.TaxNumber, c.FoundedDate, c.Industry, c.Size, c.Country, c.Website
      FROM [USER] u
      LEFT JOIN [PERSON] p ON u.ID = p.ID
      LEFT JOIN [COMPANY] c ON u.ID = c.ID
      WHERE u.ID = @user_id
    `

    const result = await pool.request().input('user_id', sql.Int, user_id).query(query)

    const user = result.recordset[0]
    if (!user) throw new ErrorWithStatus({ message: USERS_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })

    // Format Data Structure based on UserType [cite: 295-368]
    const responseData: any = {
      id: user.ID.toString(),
      username: user.Username,
      email: user.Email,
      phone: user.PhoneNum,
      name: user.Name,
      address: user.Address,
      avatar: user.ProfilePic,
      bio: user.Bio,
      userType: user.UserType,
      employerType: null, // Default
      specificData: {}
    }

    if (user.UserType === UserRole.Candidate) {
      responseData.specificData = {
        ssn: user.SSN, // Note: In your SQL schema, SSN is in PERSON table, but check if also in USER (redundant) or just PERSON
        dob: user.DOB
      }
      // If data is in PERSON table (from JOIN)
      if (user.SSN) responseData.specificData.ssn = user.SSN
      if (user.DOB) responseData.specificData.dob = user.DOB
    } else if (user.UserType === UserRole.Employer) {
      // Logic to determine EmployerType (Company or Person) based on data presence
      if (user.TaxNumber) {
        responseData.employerType = 'Company'
        responseData.specificData = {
          taxNumber: user.TaxNumber,
          foundedDate: user.FoundedDate,
          industry: user.Industry,
          size: user.Size,
          country: user.Country,
          website: user.Website
        }
      } else {
        responseData.employerType = 'Person'
        responseData.specificData = {
          ssn: user.SSN,
          dob: user.DOB
          // socialLink: ... (Need query SOCIAL_LINK table if needed)
        }
      }
    }

    return responseData
  }

  // PUT /users/me
  async updateMe(user_id: string, payload: UpdateUserReqBody) {
    const pool = databaseService.connection
    const transaction = new sql.Transaction(pool)

    try {
      await transaction.begin()

      // 1. Update Main USER Table
      const requestUser = new sql.Request(transaction)
      const updateUserQuery = `
        UPDATE [USER] SET 
          Name = COALESCE(@name, Name),
          Address = COALESCE(@address, Address),
          PhoneNum = COALESCE(@phone, PhoneNum),
          ProfilePic = COALESCE(@avatar, ProfilePic),
          Bio = COALESCE(@bio, Bio)
        WHERE ID = @id
      `

      requestUser.input('id', sql.Int, user_id)
      requestUser.input('name', sql.NVarChar, payload.name || null)
      requestUser.input('address', sql.NVarChar, payload.address || null)
      requestUser.input('phone', sql.NVarChar, payload.phone || null)
      requestUser.input('avatar', sql.NVarChar, payload.avatar || null)
      requestUser.input('bio', sql.NVarChar, payload.bio || null)

      await requestUser.query(updateUserQuery)

      // 2. Update Specific Data (PERSON or COMPANY)
      // Check User Role first to know which table to update
      const checkUserReq = new sql.Request(transaction)
      const userResult = await checkUserReq
        .input('id', sql.Int, user_id)
        .query('SELECT UserType FROM [USER] WHERE ID = @id')
      const userType = userResult.recordset[0].UserType

      if (payload.specificData) {
        if (userType === UserRole.Candidate || (userType === UserRole.Employer && payload.employerType === 'Person')) {
          // Upsert PERSON Table
          const reqPerson = new sql.Request(transaction)
          const ssn = payload.specificData.ssn || payload.ssn
          const dob = payload.specificData.dob || payload.dob

          // Note: SSN is PK in PERSON table. Updating PK is risky if referenced.
          // Assuming upsert logic based on ID relationship

          reqPerson.input('id', sql.Int, user_id)
          reqPerson.input('ssn', sql.VarChar, ssn || null)
          reqPerson.input('dob', sql.Date, dob || null)

          // Check if record exists
          const checkPerson = await new sql.Request(transaction)
            .input('id', sql.Int, user_id)
            .query('SELECT COUNT(*) as count FROM PERSON WHERE ID = @id')

          if (checkPerson.recordset[0].count > 0) {
            // Update
            await reqPerson.query(`UPDATE PERSON SET DOB = @dob WHERE ID = @id`)
            // Note: Updating SSN (PK) might fail if referenced by SOCIAL_LINK.
            // If SSN changes, we might need to handle SOCIAL_LINK update or forbid SSN change.
            if (ssn) {
              // Try update SSN if provided
              await reqPerson.query(`UPDATE PERSON SET SSN = @ssn WHERE ID = @id`)
            }
          } else if (ssn) {
            // Insert (Must have SSN as it is PK)
            await reqPerson.query(`INSERT INTO PERSON (SSN, DOB, ID) VALUES (@ssn, @dob, @id)`)
          }
        } else if (userType === UserRole.Employer && payload.employerType === 'Company') {
          // Update COMPANY Table
          const reqComp = new sql.Request(transaction)
          reqComp.input('id', sql.Int, user_id)
          reqComp.input('website', sql.NVarChar, payload.specificData.website || null)
          reqComp.input('size', sql.NVarChar, payload.specificData.size || null)
          reqComp.input('industry', sql.NVarChar, payload.specificData.industry || null)
          reqComp.input('foundedDate', sql.Date, payload.specificData.foundedDate || null)
          reqComp.input('country', sql.NVarChar, payload.specificData.country || null)

          // Note: TaxNumber cannot be modified [cite: 393, 494]

          // Check existence
          const checkComp = await new sql.Request(transaction)
            .input('id', sql.Int, user_id)
            .query('SELECT COUNT(*) as count FROM COMPANY WHERE ID = @id')

          if (checkComp.recordset[0].count > 0) {
            await reqComp.query(`
                UPDATE COMPANY SET 
                Website = @website, Size = @size, Industry = @industry, FoundedDate = @foundedDate, Country = @country
                WHERE ID = @id
             `)
          }
          // Insert logic requires TaxNumber, which should be provided if creating new company profile
        }
      }

      await transaction.commit()

      // Return updated profile
      return await this.getMe(user_id)
    } catch (error: any) {
      await transaction.rollback()
      // Handle Duplicate SSN error (SQL Error 2627) [cite: 500-505]
      if (error.number === 2627) {
        throw new ErrorWithStatus({
          message: 'Duplicate Entry',
          status: HTTP_STATUS.CONFLICT // 409
        })
      }
      throw error
    }
  }
}

const usersService = new UsersService()
export default usersService
