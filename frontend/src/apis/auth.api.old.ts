import { AuthResponse, LoginRequest, RegisterRequest } from 'src/types/auth.type'
import http from 'src/utils/http'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

const authApi = {
  // Chỉ nhận username, password, role (không có confirm_password)
  registerAccount(body: Omit<RegisterRequest, 'confirm_password'>) {
    console.log('🔄 API registerAccount called with:', body)
    return http.post<AuthResponse>(URL_REGISTER, body)
  },
  
  login(body: LoginRequest) {
    console.log('🔄 API login called with:', body)
    return http.post<AuthResponse>(URL_LOGIN, body)
  },
  
  logout() {
    return http.post(URL_LOGOUT)
  }
}

export default authApi