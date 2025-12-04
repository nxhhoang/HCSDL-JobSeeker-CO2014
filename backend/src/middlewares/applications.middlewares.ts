import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ApplyStatus } from '~/constants/enums'

export const applyJobValidator = validate(
  checkSchema(
    {
      coverLetter: {
        optional: true,
        isString: true,
        isLength: { options: { max: 1000 } }
      },
      cvUrl: {
        optional: true,
        isURL: { errorMessage: 'CV URL must be valid' }
      }
    },
    ['body']
  )
)

export const updateApplyStatusValidator = validate(
  checkSchema(
    {
      status: {
        isIn: {
          options: [Object.values(ApplyStatus)],
          errorMessage: 'Invalid status'
        }
      }
    },
    ['body']
  )
)
