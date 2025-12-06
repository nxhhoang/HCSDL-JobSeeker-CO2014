import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { Helmet } from 'react-helmet-async'

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>JobSeeker - Find Your Dream Job</title>
        <meta name='description' content='Find your dream job with JobSeeker - The best job search platform' />
      </Helmet>

      {/* Hero Section */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl'>
            <h1 className='text-5xl font-bold mb-6'>Find Your Dream Job Today</h1>
            <p className='text-xl mb-8'>Thousands of jobs in IT, Marketing, Finance and more</p>
            <div className='flex gap-4'>
              <Link
                to={path.jobs}
                className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
              >
                Browse Jobs
              </Link>
              <Link
                to={path.companies}
                className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
              >
                Browse Companies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className='container mx-auto px-4 py-16'>
        <h2 className='text-3xl font-bold mb-8'>Featured Jobs</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Job Card Example - You can map through actual data */}
          <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
            <h3 className='text-xl font-semibold mb-2'>Senior Frontend Developer</h3>
            <p className='text-gray-600 mb-4'>Tech Company Inc.</p>
            <div className='flex flex-wrap gap-2 mb-4'>
              <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm'>React</span>
              <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm'>TypeScript</span>
            </div>
            <Link to={path.jobDetail.replace(':id', '1')} className='text-blue-600 hover:underline'>
              View Details →
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className='bg-gray-50 py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-12 text-center'>How It Works</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold'>
                1
              </div>
              <h3 className='text-xl font-semibold mb-2'>Create Your Profile</h3>
              <p className='text-gray-600'>Build your professional profile and upload your resume</p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold'>
                2
              </div>
              <h3 className='text-xl font-semibold mb-2'>Search & Apply</h3>
              <p className='text-gray-600'>Browse thousands of jobs and apply with one click</p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold'>
                3
              </div>
              <h3 className='text-xl font-semibold mb-2'>Get Hired</h3>
              <p className='text-gray-600'>Connect with employers and land your dream job</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}