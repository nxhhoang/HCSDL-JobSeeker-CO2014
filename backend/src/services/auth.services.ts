import crypto from 'crypto'
import { RegisterReqBody, LoginReqBody } from '~/models/requests/Authentication.request'
import databaseService, { sql } from '~/services/database.services'
import { UserVerifyStatus, TokenType } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import { envConfig } from '~/constants/config'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class AuthService {
  // Hàm này tạo Access Token (JWT không hết hạn) và Refresh Token (Hash cố định)
  async generateAuthTokens(user_id: string, role: string) {
    // 1. Tạo Refresh Token cố định
    const refreshToken = crypto.createHash('sha256').update('REFRESH_TOKEN').digest('hex')

    // 2. Tạo Access Token vĩnh cửu
    const accessToken = await signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.AccessToken,
        verify: UserVerifyStatus.Verified
      },
      privateKey: envConfig.jwtSecretAccessToken
    })

    return { accessToken, refreshToken }
  }

  async register(payload: RegisterReqBody) {
    const pool = databaseService.connection
    const transaction = new sql.Transaction(pool)

    try {
      await transaction.begin()

      const plainPassword = payload.password

      const requestUser = new sql.Request(transaction)

      const insertUserResult = await requestUser
        .input('Username', sql.NVarChar, payload.username)
        .input('Password', sql.NVarChar, plainPassword) // Lưu password gốc
        .input('Email', sql.NVarChar, payload.email)
        .input('PhoneNum', sql.NVarChar, payload.phone)
        .input('Name', sql.NVarChar, payload.name)
        .input('UserType', sql.NVarChar, payload.userType).query(`
          INSERT INTO [USER] (Username, Password, Email, PhoneNum, Name, UserType)
          OUTPUT INSERTED.ID
          VALUES (@Username, @Password, @Email, @PhoneNum, @Name, @UserType)
        `)

      const userId = insertUserResult.recordset[0].ID

      await transaction.commit()

      // Tạo token sau khi đăng ký thành công
      const tokens = await this.generateAuthTokens(userId.toString(), payload.userType)

      return {
        userId: userId.toString(),
        username: payload.username,
        ...tokens
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async login(payload: LoginReqBody) {
    const pool = databaseService.connection

    const result = await pool.request().input('emailOrPhone', sql.NVarChar, payload.emailOrPhone).query(`
        SELECT * FROM [USER] 
        WHERE Email = @emailOrPhone OR PhoneNum = @emailOrPhone
      `)

    const user = result.recordset[0]

    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    if (payload.password !== user.Password) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const { accessToken, refreshToken } = await this.generateAuthTokens(user.ID.toString(), user.UserType)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.ID.toString(),
        name: user.Name,
        avatar: user.ProfilePic,
        userType: user.UserType
      }
    }
  }
}

const authService = new AuthService()
export default authService
