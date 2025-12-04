import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createCompanyValidator = validate(
  checkSchema(
    {
      taxNumber: {
        notEmpty: true,
        matches: { options: /^[0-9]{10,13}$/, errorMessage: 'Invalid Tax Number format' }
      },
      name: { notEmpty: true, isString: true },
      website: { notEmpty: true, isURL: true },
      foundedDate: { isISO8601: true },
      industry: { notEmpty: true },
      size: { notEmpty: true },
      country: { notEmpty: true }
    },
    ['body']
  )
)
