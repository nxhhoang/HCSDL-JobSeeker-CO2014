import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { getRefreshTokenFromLS } from 'src/utils/auth'

/**
 * Custom hook để xử lý logout
 * 
 * Flow:
 * 1. Gọi API logout với refresh_token
 * 2. Backend invalidate token
 * 3. HTTP interceptor clear localStorage (access_token, refresh_token, profile)
 * 4. Reset app context state
 * 5. Redirect về login page
 * 
 * @example
 * const { logout, isLoggingOut } = useLogout()
 * 
 * <button onClick={logout} disabled={isLoggingOut}>
 *   {isLoggingOut ? 'Logging out...' : 'Logout'}
 * </button>
 */
export default function useLogout() {
  const { reset } = useContext(AppContext)
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: () => {
      const refresh_token = getRefreshTokenFromLS()
      return authApi.logout({ refresh_token })
    },
    onSuccess: () => {
      // Reset app context (setIsAuthenticated(false), setProfile(null))
      reset()
      
      toast.success('Logged out successfully')
      navigate(path.login)
    },
    onError: (error: any) => {
      // Ngay cả khi API lỗi, vẫn logout ở frontend
      // Vì có thể backend đã xóa token rồi
      reset()
      
      console.error('Logout error:', error)
      toast.warning('Logged out (with errors)')
      navigate(path.login)
    }
  })

  return {
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending
  }
}
