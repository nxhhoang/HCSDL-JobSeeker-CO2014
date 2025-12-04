import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/messages'
import { differenceInYears } from 'date-fns'

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING },
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      dob: {
        optional: true,
        isISO8601: { errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601 },
        custom: {
          options: (value, { req }) => {
            const dateOfBirth = new Date(value)
            const age = differenceInYears(new Date(), dateOfBirth)
            // Logic: Check age if UserType is Candidate.
            // Since we might not know UserType from body alone, we apply rule generally or check DB.
            // API Doc requires this constraint for Candidates[cite: 374].
            if (age < 18) {
              throw new Error('User must be at least 18 years old')
            }
            return true
          }
        }
      },
      // Validate nested object specificData
      'specificData.ssn': {
        optional: true,
        isString: true,
        isLength: { options: { min: 9, max: 20 } }
      },
      'specificData.website': {
        optional: true,
        isURL: { errorMessage: USERS_MESSAGES.WEBSITE_MUST_BE_STRING }
      }
    },
    ['body']
  )
)
