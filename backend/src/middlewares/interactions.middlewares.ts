import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const sendFeedbackValidator = validate(
  checkSchema(
    {
      content: {
        notEmpty: true,
        isString: true
      },
      rank: {
        isInt: {
          options: { min: 1, max: 5 },
          errorMessage: 'Rank must be an integer between 1 and 5'
        }
      }
    },
    ['body']
  )
)

export const sendMessageValidator = validate(
  checkSchema(
    {
      receiverId: {
        notEmpty: true
        // Validate if user exists logic can be here or in service
      },
      content: {
        notEmpty: true,
        isString: true
      }
    },
    ['body']
  )
)

export const getMessagesValidator = validate(
  checkSchema(
    {
      with_user_id: {
        notEmpty: { errorMessage: 'with_user_id query param is required' }
      }
    },
    ['query']
  )
)
