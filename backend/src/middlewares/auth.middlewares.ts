import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'
import databaseService, { sql } from '~/services/database.services'
import { verifyAccessToken } from '~/utils/commons'
import { Request } from 'express'

export const registerValidator = validate(
  checkSchema(
    {
      username: {
        notEmpty: { errorMessage: 'Username is required' },
        isString: { errorMessage: USERS_MESSAGES.USERNAME_MUST_BE_STRING },
        custom: {
          options: async (value) => {
            const pool = databaseService.connection
            const result = await pool
              .request()
              .input('username', sql.NVarChar, value)
              .query('SELECT COUNT(*) as count FROM [USER] WHERE Username = @username')
            if (result.recordset[0].count > 0) {
              throw new Error(USERS_MESSAGES.USERNAME_EXISTED)
            }
            return true
          }
        }
      },
      email: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
        isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
        custom: {
          options: async (value) => {
            const pool = databaseService.connection
            const result = await pool
              .request()
              .input('email', sql.NVarChar, value)
              .query('SELECT COUNT(*) as count FROM [USER] WHERE Email = @email')
            if (result.recordset[0].count > 0) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      },
      userType: {
        isIn: {
          options: [['Candidate', 'Employer']],
          errorMessage: 'User type must be Candidate or Employer'
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      emailOrPhone: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
        isString: true
      },
      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
        isString: true
      }
    },
    ['body']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: { errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED },
        isString: { errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            return await verifyAccessToken(access_token, req as Request)
          }
        }
      }
    },
    ['headers']
  )
)
