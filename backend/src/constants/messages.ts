export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  GET_ME_SUCCESS: 'Get my profile success',
  USER_NOT_VERIFIED: 'User not verified',
  BIO_MUST_BE_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio length must be from 1 to 200',
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location length must be from 1 to 200',
  WEBSITE_MUST_BE_STRING: 'Website must be a string',
  WEBSITE_LENGTH: 'Website length must be from 1 to 200',
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers, underscores, not only numbers',
  IMAGE_URL_MUST_BE_STRING: 'Avatar must be a string',
  IMAGE_URL_LENGTH: 'Avatar length must be from 1 to 200',
  UPDATE_ME_SUCCESS: 'Update my profile success',
  GET_PROFILE_SUCCESS: 'Get profile success',
  FOLLOW_SUCCESS: 'Follow success',
  INVALID_USER_ID: 'Invalid user id',
  FOLLOWED: 'Followed',
  ALREADY_UNFOLLOWED: 'Already unfollowed',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  USERNAME_EXISTED: 'Username existed',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  UPLOAD_SUCCESS: 'Upload success',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  GET_VIDEO_STATUS_SUCCESS: 'Get video status success'
} as const

export const METADATA_MESSAGES = {
  GET_SKILLS_SUCCESS: 'Successfully retrieved skills list',
  GET_CATEGORIES_SUCCESS: 'Successfully retrieved categories list'
} as const

export const CANDIDATE_MESSAGES = {
  GET_PROFILE_SUCCESS: 'Successfully retrieved candidate profile',
  UPDATE_CV_SUCCESS: 'CV updated successfully',
  ADD_JOB_HISTORY_SUCCESS: 'Job history added successfully',
  GET_JOB_HISTORY_SUCCESS: 'Successfully retrieved job history',
  UPDATE_SKILLS_SUCCESS: 'Skills updated successfully'
} as const

export const EMPLOYER_MESSAGES = {
  CREATE_COMPANY_SUCCESS: 'Company profile created successfully',
  GET_EMPLOYER_SUCCESS: 'Successfully retrieved employer information',
  GET_FOLLOWERS_SUCCESS: 'Successfully retrieved list of followers'
} as const

export const JOBS_MESSAGES = {
  GET_JOBS_SUCCESS: 'Tìm thấy kết quả phù hợp',
  GET_JOB_DETAIL_SUCCESS: 'Lấy chi tiết việc làm thành công',
  CREATE_JOB_SUCCESS: 'Đăng tin tuyển dụng thành công',
  UPDATE_JOB_SUCCESS: 'Cập nhật tin tuyển dụng thành công',
  DELETE_JOB_SUCCESS: 'Đã đóng tin tuyển dụng thành công',
  RELATE_JOB_SUCCESS: 'Gắn job liên quan thành công',
  GET_MY_JOBS_SUCCESS: 'Successfully retrieved posted jobs list',
  GET_RELATED_JOBS_SUCCESS: 'Successfully retrieved related jobs list'
} as const

export const APPLICATIONS_MESSAGES = {
  APPLY_JOB_SUCCESS: 'Nộp hồ sơ ứng tuyển thành công',
  GET_MY_APPLIES_SUCCESS: 'Lấy lịch sử ứng tuyển thành công',
  GET_JOB_APPLIES_SUCCESS: 'Lấy danh sách ứng viên thành công',
  UPDATE_APPLY_STATUS_SUCCESS: 'Cập nhật trạng thái hồ sơ thành công',
  DELETE_APPLY_SUCCESS: 'Đã rút hồ sơ thành công'
} as const

export const INTERACTIONS_MESSAGES = {
  FOLLOW_SUCCESS: 'Successfully followed the employer',
  UNFOLLOW_SUCCESS: 'Unfollowed successfully',
  SEND_FEEDBACK_SUCCESS: 'Feedback submitted successfully',
  GET_MESSAGES_SUCCESS: 'Retrieved message history successfully',
  SEND_MESSAGE_SUCCESS: 'Message sent successfully',
  GET_NOTIFICATIONS_SUCCESS: 'Retrieved notifications successfully',
  READ_NOTIFICATION_SUCCESS: 'Marked as read successfully'
} as const
