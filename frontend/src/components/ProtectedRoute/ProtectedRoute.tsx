import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'

interface ProtectedRouteProps {
  allowedRoles?: ('candidate' | 'employer' | 'admin')[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useContext(AppContext)

  // Chưa đăng nhập -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to={path.login} replace />
  }

  // Đã đăng nhập nhưng không có quyền truy cập
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect về trang phù hợp với role
    if (userRole === 'candidate') {
      return <Navigate to={path.home} replace />
    } else if (userRole === 'employer') {
      return <Navigate to={path.employerDashboard} replace />
    } else if (userRole === 'admin') {
      return <Navigate to={path.adminDashboard} replace />
    }
    return <Navigate to={path.home} replace />
  }

  return <Outlet />
}