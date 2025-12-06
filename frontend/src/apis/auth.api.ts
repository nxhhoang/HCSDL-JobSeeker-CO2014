import { AuthResponse, LoginRequest, LogoutRequest, LogoutResponse, RefreshTokenResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

// URL constants
export const URL_LOGIN = 'auth/login'
export const URL_LOGOUT = 'auth/logout'
export const URL_REFRESH_TOKEN = 'auth/refresh-token'
// export const URL_REGISTER = 'auth/register' // Future feature

/**
 * Authentication API
 * 
 * Module xử lý đăng nhập, đăng xuất cho JobSeeker platform
 * Hỗ trợ 3 loại user: Admin, Candidate, Employer
 */
const authApi = {
  /**
   * POST /api/v1/auth/login
   * 
   * Login cho tất cả user types (Admin, Candidate, Employer)
   * Backend tự động phân biệt dựa trên emailOrPhone
   * 
   * @param body - { emailOrPhone, password }
   * @returns SuccessResponse<{ accessToken, refreshToken, user }>
   * 
   * @example
   * // Admin login
   * authApi.login({ emailOrPhone: 'sManager', password: 'password' })
   * 
   * // Candidate login
   * authApi.login({ emailOrPhone: 'dev2@mail.com', password: '123' })
   * 
   * // Employer login
   * authApi.login({ emailOrPhone: 'cf@boss.com', password: '123' })
   * 
   * // Company login
   * authApi.login({ emailOrPhone: 'hr@fpt.com', password: '123' })
   */
  login(body: LoginRequest) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },

  /**
   * POST /api/v1/auth/logout
   * 
   * Logout - Invalidate refresh token trên backend
   * 
   * Flow:
   * 1. Gửi refresh_token lên backend
   * 2. Backend xóa token khỏi database/whitelist
   * 3. HTTP interceptor tự động clear localStorage
   * 4. App context reset state
   * 5. Redirect về login page
   * 
   * @param body - { refresh_token }
   * @returns SuccessResponse<null>
   */
  logout(body: LogoutRequest) {
    return http.post<LogoutResponse>(URL_LOGOUT, body)
  },

  /**
   * POST /api/v1/auth/refresh-token
   * 
   * Làm mới access token khi hết hạn
   * Tự động được gọi bởi HTTP interceptor khi nhận 401 expired token
   * 
   * @param body - { refresh_token }
   * @returns SuccessResponse<{ accessToken, refreshToken }>
   */
  refreshToken(body: { refresh_token: string }) {
    return http.post<RefreshTokenResponse>(URL_REFRESH_TOKEN, body)
  }

  // ===== FUTURE FEATURES (Not implemented yet) =====
  // Uncomment khi backend hoàn thiện
  
  // /**
  //  * POST /api/v1/auth/register
  //  * Đăng ký tài khoản mới
  //  */
  // register(body: RegisterRequest) {
  //   return http.post<AuthResponse>(URL_REGISTER, body)
  // }
}

export default authApi
