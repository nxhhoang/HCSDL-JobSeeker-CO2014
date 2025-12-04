import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserRole } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/User.request'
import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'

export const adminValidator = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.decoded_authorization as TokenPayload

  // Kiểm tra role có phải là Admin không
  if (role !== UserRole.Admin) {
    throw new ErrorWithStatus({
      message: 'Admin access required',
      status: HTTP_STATUS.FORBIDDEN
    })
  }
  next()
}

export const skillValidator = validate(
  checkSchema(
    {
      skillName: {
        notEmpty: { errorMessage: 'Skill Name is required' },
        isString: true,
        trim: true,
        isLength: { options: { min: 1, max: 100 } }
      },
      description: {
        optional: true,
        isString: true
      }
    },
    ['body']
  )
)

// Validator cho Category
export const categoryValidator = validate(
  checkSchema(
    {
      jcName: {
        notEmpty: { errorMessage: 'Category Name is required' },
        isString: true,
        trim: true,
        isLength: { options: { min: 1, max: 100 } }
      },
      speciality: {
        optional: true,
        isString: true
      }
    },
    ['body']
  )
)
