import { Link, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'

export default function CandidateLayout() {
  const { profile } = useContext(AppContext)
  const location = useLocation()

  const isActive = (currentPath: string) => {
    return location.pathname === currentPath
  }

  const menuItems = [
    {
      path: path.candidateProfile,
      name: 'Hồ Sơ Cá Nhân',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' />
        </svg>
      )
    },
    {
      path: path.candidateResume,
      name: 'CV của tôi',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' />
        </svg>
      )
    },
    {
      path: path.candidateApplications,
      name: 'Đơn Ứng Tuyển',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z' />
        </svg>
      )
    },
    {
      path: path.savedJobs,
      name: 'Việc Làm Đã Lưu',
      icon: (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z' />
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
              {/* User Info */}
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
                    <div className='text-xs text-gray-500'>Ứng viên</div>
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