import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { JobType, JobLevel, JobContractType } from '~/constants/enums'

export const createJobValidator = validate(
  checkSchema(
    {
      'jobInfo.title': { notEmpty: true, isString: true },
      'jobInfo.expireDate': { notEmpty: true, isISO8601: true },
      'jdInfo.location': { notEmpty: true, isString: true },
      'jdInfo.salary': { notEmpty: true }, // Can be number or string range
      'jdInfo.quantity': { isInt: { options: { min: 1 } } },
      'jdInfo.expYear': { isInt: { options: { min: 0 } } },
      'jdInfo.level': { isIn: { options: [Object.values(JobLevel)] } },
      'jdInfo.contractType': { isIn: { options: [Object.values(JobContractType)] } },
      'jdInfo.jobType': { isIn: { options: [Object.values(JobType)] } },
      'jdInfo.description': { notEmpty: true, isString: true },
      skillIds: { isArray: true, notEmpty: true },
      categoryIds: { isArray: true, notEmpty: true }
    },
    ['body']
  )
)

export const updateJobValidator = validate(
  checkSchema(
    {
      'jobInfo.title': { optional: true, isString: true },
      'jobInfo.expireDate': { optional: true, isISO8601: true }
      // Add other optional validations similar to createJob
    },
    ['body']
  )
)
