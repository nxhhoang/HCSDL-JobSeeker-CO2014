import { Link, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'

export default function EmployerLayout() {
  const { profile } = useContext(AppContext)
  const location = useLocation()

  const isActive = (currentPath: string) => {
    return location.pathname === currentPath
  }

  const menuItems = [
    {
      path: path.employerDashboard,
      name: 'Tổng Quan',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605' />
        </svg>
      )
    },
    {
      path: path.companyProfile,
      name: 'Thông Tin Công Ty',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z' />
        </svg>
      )
    },
    {
      path: path.postJob,
      name: 'Đăng Tin Tuyển Dụng',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      )
    },
    {
      path: path.manageJobs,
      name: 'Quản Lý Tin Đăng',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z' />
        </svg>
      )
    },
    {
      path: path.employerApplications,
      name: 'Hồ Sơ Ứng Tuyển',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' />
        </svg>
      )
    }
  ]

  return (
    <div className='bg-neutral-100 py-8 text-sm text-gray-600'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          {/* Sidebar */}
          <div className='md:col-span-3 lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
              {/* Company Info */}
              <div className='border-b border-gray-200 p-4'>
                <div className='flex items-center'>
                  <div className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'>
                    <img
                      src={profile?.avatar || 'https://via.placeholder.com/150'}
                      alt={profile?.name}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='ml-3 flex-grow'>
                    <div className='font-semibold text-gray-900 truncate'>{profile?.name}</div>
                    <div className='text-xs text-gray-500'>Nhà tuyển dụng</div>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <nav className='p-2'>
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={classNames(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                      {
                        'bg-blue-50 text-blue-600 font-medium': isActive(item.path),
                        'text-gray-700 hover:bg-gray-50': !isActive(item.path)
                      }
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className='md:col-span-9 lg:col-span-10'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}