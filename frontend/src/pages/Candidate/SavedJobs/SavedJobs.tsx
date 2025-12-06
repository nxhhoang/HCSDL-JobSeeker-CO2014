import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function SavedJobs() {
  const savedJobs = [
    { id: 1, title: 'Senior React Developer', company: 'Tech Corp', location: 'Ho Chi Minh City', salary: '$2000-$3000', savedDate: '2024-12-10' },
    { id: 2, title: 'Frontend Engineer', company: 'StartUp Inc', location: 'Hanoi', salary: '$1800-$2500', savedDate: '2024-12-12' },
    { id: 3, title: 'Full Stack Developer', company: 'Digital Agency', location: 'Da Nang', salary: '$2200-$3200', savedDate: '2024-12-08' }
  ]

  return (
    <div>
      <Helmet>
        <title>Saved Jobs | JobSeeker</title>
        <meta name='description' content='Your saved job listings' />
      </Helmet>

      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Saved Jobs ({savedJobs.length})</h1>
          <button className='text-red-600 hover:underline'>Clear All</button>
        </div>

        <div className='space-y-4'>
          {savedJobs.map((job) => (
            <div key={job.id} className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <h3 className='text-xl font-semibold mb-2'>{job.title}</h3>
                      <p className='text-gray-600 mb-1'>{job.company}</p>
                      <p className='text-sm text-gray-500'>{job.location}</p>
                    </div>
                    <button className='text-red-500 hover:text-red-600'>
                      <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' clipRule='evenodd' />
                      </svg>
                    </button>
                  </div>

                  <div className='flex flex-wrap gap-3 mb-4'>
                    <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm'>
                      {job.salary}
                    </span>
                    <span className='text-sm text-gray-500'>Saved on: {job.savedDate}</span>
                  </div>

                  <div className='flex gap-3'>
                    <Link
                      to={path.jobDetail.replace(':id', job.id.toString())}
                      className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      View Details
                    </Link>
                    <button className='border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors'>
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {savedJobs.length === 0 && (
          <div className='text-center py-12'>
            <svg className='w-16 h-16 mx-auto mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' />
            </svg>
            <p className='text-gray-600 mb-4'>No saved jobs yet</p>
            <Link to={path.jobs} className='text-blue-600 hover:underline'>
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}