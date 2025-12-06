import { User } from './user.type'
import { SuccessResponse } from './utils.type'

/**
 * Login Request
 * Đăng nhập cho tất cả user types (Admin, Candidate, Employer)
 * Backend tự động phân biệt dựa trên emailOrPhone
 */
export type LoginRequest = {
  emailOrPhone: string // Email hoặc Phone
  password: string
}

/**
 * Auth Response từ API Login
 * Response structure:
 * {
 *   message: "Login success",
 *   data: {
 *     accessToken: "jwt-token",
 *     refreshToken: "refresh-token",
 *     user: { id, name, avatar, userType }
 *   }
 * }
 */
export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  user: User
}>

/**
 * Logout Request
 * Gửi refresh_token để backend invalidate
 */
export type LogoutRequest = {
  refresh_token: string
}

/**
 * Logout Response
 */
export type LogoutResponse = SuccessResponse<null>

/**
 * Refresh Token Response
 * Response khi làm mới access token
 */
export type RefreshTokenResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
}>

// ===== FUTURE FEATURES (Not implemented yet) =====
// Uncomment khi backend hoàn thiện các chức năng này

// // Register Request
// export type RegisterRequest = {
//   username: string
//   password: string
//   email: string
//   phone: string
//   name: string
//   userType: 'Candidate' | 'Employer'
//   employerType?: 'Company' | 'Person'
// }

// // Verify OTP
// export type VerifyOTPRequest = {
//   email: string
//   otpCode: string
// }

// // Forgot Password
// export type ForgotPasswordRequest = {
//   email: string
// }

// export type ForgotPasswordResponse = SuccessResponse<{
//   email: string
//   timeout: number
// }>

// // Reset Password
// export type ResetPasswordRequest = {
//   email: string
//   otpCode: string
//   newPassword: string
// }