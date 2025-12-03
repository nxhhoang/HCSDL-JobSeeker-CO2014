import { UserRole } from '~/constants/enums' // Import UserRole từ file constants của bạn

/**
 * Endpoint: /auth/register
 */
export interface RegisterReqBody {
  username: string
  password: string
  email: string
  phone: string
  name: string
  userType: UserRole // 'Candidate' | 'Employer'
  // employerType chỉ bắt buộc nếu userType là Employer
  employerType?: 'Company' | 'Person'
}

/**
 * Endpoint: /auth/login
 * Note: Payload yêu cầu field là "emailOrPhone"
 */
export interface LoginReqBody {
  emailOrPhone: string
  password: string
}

/**
 * Endpoint: /auth/refresh-token
 */
export interface RefreshTokenReqBody {
  refreshToken: string
}

/**
 * Endpoint: /auth/verify-otp
 * Note: Dùng để kích hoạt tài khoản sau khi đăng ký
 */
export interface VerifyOtpReqBody {
  email: string
  otpCode: string
}

/**
 * Endpoint: /auth/forgot-password
 */
export interface ForgotPasswordReqBody {
  email: string
}

/**
 * Endpoint: /auth/reset-password
 * Note: Cần OTP đã gửi từ bước forgot-password
 */
export interface ResetPasswordReqBody {
  email: string
  otpCode: string
  newPassword: string
}
