import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function EmployerDashboard() {
  return (
    <div>
      <Helmet>
        <title>Employer Dashboard | JobSeeker</title>
        <meta name='description' content='Manage your job postings and applications' />
      </Helmet>

      <div className='space-y-6'>
        {/* Welcome Banner */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow p-8'>
          <h1 className='text-3xl font-bold mb-2'>Welcome back, Tech Company!</h1>
          <p className='text-blue-100'>Manage your job postings and find the perfect candidates</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-gray-600'>Active Jobs</h3>
              <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
              </svg>
            </div>
            <p className='text-3xl font-bold text-gray-900'>12</p>
            <p className='text-sm text-gray-500 mt-2'>+2 this week</p>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-gray-600'>Total Applications</h3>
              <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <p className='text-3xl font-bold text-gray-900'>148</p>
            <p className='text-sm text-gray-500 mt-2'>+24 this week</p>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-gray-600'>Pending Review</h3>
              <svg className='w-8 h-8 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <p className='text-3xl font-bold text-gray-900'>32</p>
            <p className='text-sm text-gray-500 mt-2'>Needs attention</p>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-gray-600'>Hired</h3>
              <svg className='w-8 h-8 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
            </div>
            <p className='text-3xl font-bold text-gray-900'>18</p>
            <p className='text-sm text-gray-500 mt-2'>This month</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold'>Recent Applications</h2>
            <Link to={path.employerApplications} className='text-blue-600 hover:underline'>
              View All
            </Link>
          </div>

          <div className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='text-blue-600 font-semibold'>JD</span>
                  </div>
                  <div>
                    <h4 className='font-semibold'>John Doe</h4>
                    <p className='text-sm text-gray-600'>Applied for: Senior React Developer</p>
                    <p className='text-xs text-gray-500'>2 hours ago</p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                    Review
                  </button>
                  <button className='border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50'>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold'>Active Job Postings</h2>
            <Link to={path.postJob} className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
              Post New Job
            </Link>
          </div>

          <div className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <h4 className='font-semibold text-lg'>Senior React Developer</h4>
                    <p className='text-sm text-gray-600'>Posted 5 days ago</p>
                  </div>
                  <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm'>Active</span>
                </div>
                <div className='flex gap-4 text-sm text-gray-600 mb-3'>
                  <span>📍 Ho Chi Minh City</span>
                  <span>💰 $2000-$3000</span>
                  <span>📝 24 Applications</span>
                </div>
                <div className='flex gap-2'>
                  <Link to={path.jobDetail.replace(':id', item.toString())} className='text-blue-600 hover:underline text-sm'>
                    View
                  </Link>
                  <button className='text-yellow-600 hover:underline text-sm'>Edit</button>
                  <button className='text-red-600 hover:underline text-sm'>Close</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}