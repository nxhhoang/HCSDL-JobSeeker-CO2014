import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import Popover from '../Popover'
import NavHeader from '../NavHeader'
import useSearchProducts from 'src/hooks/useSearchProducts'
import { clearLS } from 'src/utils/auth'

export default function Header() {
  const { isAuthenticated, userRole, setIsAuthenticated, setProfile, setUserRole } = useContext(AppContext)
  const { onSubmitSearch, register } = useSearchProducts()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearLS()
    setIsAuthenticated(false)
    setProfile(null)
    setUserRole(null)
    navigate(path.login)
  }

  return (
    <div className='bg-white shadow-sm border-b border-gray-200'>
      <div className='container'>
        {/* Top Navigation */}
        <NavHeader />

        {/* Main Header */}
        <div className='py-4 grid grid-cols-12 items-center gap-6'>
          {/* Logo */}
          <Link to={path.home} className='col-span-2 flex items-center'>
            <div className='text-2xl font-bold text-blue-600'>
              <svg className='w-10 h-10 inline-block mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
              </svg>
              <span className='hidden lg:inline'>JobSeeker</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form className='col-span-7' onSubmit={onSubmitSearch}>
            <div className='flex rounded-lg border-2 border-gray-200 focus-within:border-blue-500 transition-colors'>
              <input
                type='text'
                className='flex-grow px-4 py-2.5 text-gray-700 bg-transparent outline-none'
                placeholder='Search for jobs, companies, or skills...'
                {...register('name')}
              />
              <button
                type='submit'
                className='flex-shrink-0 bg-blue-600 text-white px-8 py-2.5 hover:bg-blue-700 transition-colors rounded-r-md'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='currentColor'
                  className='h-5 w-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Actions - Chỉ hiển thị khi đã đăng nhập */}
          {isAuthenticated && (
            <div className='col-span-3 flex items-center justify-end gap-4'>
              {/* Notifications */}
              <Popover
                renderPopover={
                  <div className='relative w-[380px] max-h-[400px] rounded-lg border border-gray-200 bg-white shadow-xl'>
                    <div className='p-4 border-b border-gray-200'>
                      <h3 className='font-semibold text-gray-900'>Notifications</h3>
                    </div>
                    <div className='max-h-[320px] overflow-y-auto'>
                      {/* Sample Notification */}
                      <div className='p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100'>
                        <div className='flex gap-3'>
                          <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                            <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                              <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                              <path
                                fillRule='evenodd'
                                d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                          <div className='flex-1'>
                            <p className='text-sm text-gray-800'>
                              Your application for <span className='font-semibold'>Senior Developer</span> has been
                              viewed
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>2 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className='p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100'>
                        <div className='flex gap-3'>
                          <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
                            <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                              <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                          <div className='flex-1'>
                            <p className='text-sm text-gray-800'>
                              New job matches your profile:{' '}
                              <span className='font-semibold'>Frontend Engineer</span>
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>5 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className='p-4 text-center'>
                        <button className='text-blue-600 hover:underline text-sm font-medium'>
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                }
              >
                <button className='relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                    />
                  </svg>
                  <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
                </button>
              </Popover>

              {/* Saved Jobs (for Candidates) */}
              {userRole === 'candidate' && (
                <Link
                  to={path.savedJobs}
                  className='p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                    />
                  </svg>
                </Link>
              )}

              {/* User Menu */}
              <Popover
                renderPopover={
                  <div className='relative w-[240px] rounded-lg border border-gray-200 bg-white shadow-xl'>
                    <div className='p-4 border-b border-gray-200'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                          <span className='text-blue-600 font-semibold text-lg'>JD</span>
                        </div>
                        <div>
                          <p className='font-semibold text-gray-900'>John Doe</p>
                          <p className='text-xs text-gray-500 capitalize'>{userRole}</p>
                        </div>
                      </div>
                    </div>

                    <div className='py-2'>
                      {userRole === 'candidate' && (
                        <>
                          <Link
                            to={path.candidateProfile}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              />
                            </svg>
                            <span className='text-sm'>My Profile</span>
                          </Link>
                          <Link
                            to={path.candidateResume}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                              />
                            </svg>
                            <span className='text-sm'>My Resume</span>
                          </Link>
                          <Link
                            to={path.candidateApplications}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                              />
                            </svg>
                            <span className='text-sm'>My Applications</span>
                          </Link>
                        </>
                      )}

                      {userRole === 'employer' && (
                        <>
                          <Link
                            to={path.employerDashboard}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                              />
                            </svg>
                            <span className='text-sm'>Dashboard</span>
                          </Link>
                          <Link
                            to={path.postJob}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                            </svg>
                            <span className='text-sm'>Post a Job</span>
                          </Link>
                          <Link
                            to={path.manageJobs}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                              />
                            </svg>
                            <span className='text-sm'>Manage Jobs</span>
                          </Link>
                          <Link
                            to={path.companyProfile}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                              />
                            </svg>
                            <span className='text-sm'>Company Profile</span>
                          </Link>
                        </>
                      )}

                      <div className='border-t border-gray-200 my-2'></div>

                      {/* <Link
                        to={path.changePassword}
                        className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors'
                      >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                          />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        </svg>
                        <span className='text-sm'>Settings</span>
                      </Link> */}

                      <button
                        onClick={handleLogout}
                        className='flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors'
                      >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                          />
                        </svg>
                        <span className='text-sm'>Sign Out</span>
                      </button>
                    </div>
                  </div>
                }
              >
                <button className='flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors'>
                  <div className='w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 font-semibold'>JD</span>
                  </div>
                  <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>
              </Popover>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className='border-t border-gray-200'>
          <div className='flex items-center gap-8 py-3'>
            <Link to={path.home} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
              Home
            </Link>
            <Link to={path.jobs} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
              Find Jobs
            </Link>
            <Link to={path.companies} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
              Companies
            </Link>

            {/* Candidate-specific links */}
            {isAuthenticated && userRole === 'candidate' && (
              <>
                <Link
                  to={path.candidateApplications}
                  className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
                >
                  My Applications
                </Link>
                <Link to={path.savedJobs} className='text-gray-700 hover:text-blue-600 font-medium transition-colors'>
                  Saved Jobs
                </Link>
              </>
            )}

            {/* Employer-specific links */}
            {isAuthenticated && userRole === 'employer' && (
              <>
                <Link
                  to={path.employerDashboard}
                  className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
                >
                  Dashboard
                </Link>
                <Link
                  to={path.postJob}
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium'
                >
                  Post a Job
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}
