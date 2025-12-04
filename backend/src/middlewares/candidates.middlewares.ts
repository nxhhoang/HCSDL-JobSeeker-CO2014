import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

// export const updateCvValidator = validate(
//   checkSchema(
//     {
//       cvUrl: {
//         notEmpty: true,
//         isURL: { errorMessage: 'CV URL must be a valid URL' }
//       },
//       cvName: {
//         optional: true,
//         isString: true
//       }
//     },
//     ['body']
//   )
// )

export const addJobHistoryValidator = validate(
  checkSchema(
    {
      comName: { notEmpty: true, isString: true },
      position: { notEmpty: true, isString: true },
      startTime: { notEmpty: true, isISO8601: true },
      endTime: {
        optional: true,
        isISO8601: true,
        custom: {
          options: (value, { req }) => {
            if (value && req.body.startTime && new Date(value) < new Date(req.body.startTime)) {
              throw new Error('End time must be greater than start time')
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateSkillsValidator = validate(
  checkSchema(
    {
      skillIds: {
        isArray: true,
        custom: {
          options: (value) => value.length > 0,
          errorMessage: 'Must have at least 1 skill'
        }
      },
      'skillIds.*': { isInt: true }
    },
    ['body']
  )
)
