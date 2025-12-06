import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')

  return (
    <div className='bg-gray-50 py-8'>
      <Helmet>
        <title>Search Jobs | JobSeeker</title>
        <meta name='description' content='Search for your ideal job' />
      </Helmet>

      <div className='container mx-auto px-4'>
        {/* Search Bar */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <input
              type='text'
              placeholder='Job title or keyword'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              placeholder='Location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button className='bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
              Search Jobs
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div>
          <h2 className='text-2xl font-bold mb-6'>Search Results (12 jobs found)</h2>
          <div className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold mb-2'>Frontend Developer</h3>
                    <p className='text-gray-600 mb-2'>Tech Company Inc.</p>
                    <p className='text-sm text-gray-500 mb-4'>Ho Chi Minh City, Vietnam</p>
                    <div className='flex flex-wrap gap-2'>
                      <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm'>React</span>
                      <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm'>TypeScript</span>
                    </div>
                  </div>
                  <Link
                    to={path.jobDetail.replace(':id', item.toString())}
                    className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}