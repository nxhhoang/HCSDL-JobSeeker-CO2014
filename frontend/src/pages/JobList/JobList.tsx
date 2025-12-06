import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function JobList() {
  return (
    <div className='bg-gray-50 py-8'>
      <Helmet>
        <title>Browse Jobs | JobSeeker</title>
        <meta name='description' content='Browse all available job opportunities' />
      </Helmet>

      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold mb-6'>All Jobs</h1>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Filter Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold mb-4'>Filters</h2>
              
              <div className='mb-6'>
                <h3 className='font-medium mb-2'>Job Type</h3>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>Full-time</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>Part-time</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>Remote</span>
                  </label>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='font-medium mb-2'>Experience Level</h3>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>Entry Level</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>Mid Level</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>Senior Level</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className='lg:col-span-3'>
            <div className='space-y-4'>
              {/* Job Card */}
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className='bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow'>
                  <div className='flex justify-between items-start mb-4'>
                    <div>
                      <h3 className='text-xl font-semibold mb-2'>Senior React Developer</h3>
                      <p className='text-gray-600 mb-2'>Tech Company Inc.</p>
                      <p className='text-sm text-gray-500'>Ho Chi Minh City, Vietnam</p>
                    </div>
                    <button className='text-gray-400 hover:text-red-500'>
                      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                      </svg>
                    </button>
                  </div>

                  <div className='flex flex-wrap gap-2 mb-4'>
                    <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm'>React</span>
                    <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm'>TypeScript</span>
                    <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm'>$2000-$3000</span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-500'>Posted 2 days ago</span>
                    <Link
                      to={path.jobDetail.replace(':id', item.toString())}
                      className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}