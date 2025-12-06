import { useContext } from 'react'
import { Link } from 'react-router-dom'
import Popover from 'src/components/Popover'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
// import useLogout from 'src/hooks/useLogout'

export default function NavHeader() {
  const { isAuthenticated, profile } = useContext(AppContext)
  // const { logout, isLoggingOut } = useLogout()

  // const handleLogout = () => {
  //   logout()
  // }

  return (
    <div className='flex justify-end'>
      {isAuthenticated && profile && (
        <Popover
          className='flex items-center py-1 hover:text-white/70 cursor-pointer'
          renderPopover={
            <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
              {/* <Link
                to={path.profile}
                className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
              >
                My Account
              </Link> */}
              {profile.userType === 'Candidate' && (
                <Link
                  to='/candidate/applications'
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                >
                  My Applications
                </Link>
              )}
              {profile.userType === 'Employer' && (
                <Link
                  to='/employer/dashboard'
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                >
                  Dashboard
                </Link>
              )}
              {profile.userType === 'Admin' && (
                <Link
                  to='/admin/dashboard'
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                >
                  Admin Panel
                </Link>
              )}
              {/* <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button> */}
            </div>
          }
        >
          <div className='w-6 h-6 mr-2 flex-shrink-0'>
            <img
              src={profile.avatar || 'https://via.placeholder.com/150'}
              alt='avatar'
              className='w-full h-full object-cover rounded-full'
            />
          </div>
          <div>{profile.name}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center'>
          {/* ===== SIGN UP BUTTON - Tạm thời ẩn vì chưa có chức năng đăng ký ===== */}
          {/* <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            Sign up
          </Link>
          <div className='border-r-[1px] border-r-white/40 h-4' /> */}
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            Login
          </Link>
        </div>
      )}
    </div>
  )
}
