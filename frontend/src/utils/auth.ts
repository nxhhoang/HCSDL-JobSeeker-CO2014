import { User } from 'src/types/user.type'

// LocalStorage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const PROFILE_KEY = 'profile'
const USER_ROLE_KEY = 'user_role' // Thêm key cho user role

// LocalStorage Event Target for listening to storage changes
export const LocalStorageEventTarget = new EventTarget()

// ===== Access Token =====
export const getAccessTokenFromLS = () => localStorage.getItem(ACCESS_TOKEN_KEY) || ''

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
}

// Refresh Token
export const getRefreshTokenFromLS = () => localStorage.getItem(REFRESH_TOKEN_KEY) || ''

export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
}

// User Profile
export const getProfileFromLS = (): User | null => {
  const result = localStorage.getItem(PROFILE_KEY)
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  // Tự động lưu userRole khi set profile
  setUserRoleToLS(profile.userType)
}

// User Role - Convert từ userType sang lowercase role
export const getUserRoleFromLS = (): 'candidate' | 'employer' | 'admin' | null => {
  const role = localStorage.getItem(USER_ROLE_KEY)
  
  // Return normalized lowercase role
  if (role === 'Candidate') return 'candidate'
  if (role === 'Employer') return 'employer'
  if (role === 'Admin') return 'admin'
  
  // Fallback: check if lowercase value already stored
  if (role === 'candidate' || role === 'employer' || role === 'admin') {
    return role as 'candidate' | 'employer' | 'admin'
  }
  
  return null
}

export const setUserRoleToLS = (userType: User['userType']) => {
  // Lưu nguyên giá trị userType để dễ debug
  localStorage.setItem(USER_ROLE_KEY, userType)
}

// ===== Clear All Auth Data =====
/**
 * Xóa tất cả dữ liệu authentication khỏi localStorage
 * Gọi khi: Logout, token expired không refresh được, hoặc lỗi auth
 */
export const clearLS = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(USER_ROLE_KEY)
  
  // Dispatch event để notify các components
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

// Helper functions
export const isAuthenticated = () => {
  return Boolean(getAccessTokenFromLS())
}

export const getUserRole = (): User['userType'] | null => {
  const profile = getProfileFromLS()
  return profile?.userType || null
}

export const isAdmin = () => getUserRole() === 'Admin'
export const isCandidate = () => getUserRole() === 'Candidate'
export const isEmployer = () => getUserRole() === 'Employer'