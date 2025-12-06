import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function CompanyDetail() {
  const { id } = useParams()

  return (
    <div className='bg-gray-50 py-8'>
      <Helmet>
        <title>Company Profile | JobSeeker</title>
        <meta name='description' content='View company profile and open positions' />
      </Helmet>

      <div className='container mx-auto px-4'>
        {/* Company Header */}
        <div className='bg-white rounded-lg shadow p-8 mb-6'>
          <div className='flex items-start gap-6'>
            <div className='w-24 h-24 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
              <svg className='w-12 h-12 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
              </svg>
            </div>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold mb-2'>Tech Company Inc.</h1>
              <p className='text-gray-600 mb-4'>Information Technology</p>
              <div className='flex flex-wrap gap-4 text-sm text-gray-600 mb-4'>
                <span>📍 Ho Chi Minh City, Vietnam</span>
                <span>👥 50-200 employees</span>
                <span>📅 Founded in 2015</span>
                <span>🌐 <a href='https://techcompany.com' className='text-blue-600 hover:underline'>techcompany.com</a></span>
              </div>
              <button className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'>
                Follow Company
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* About */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-bold mb-4'>About Company</h2>
              <p className='text-gray-700 leading-relaxed mb-4'>
                We are a leading technology company specializing in web and mobile application development. 
                Our mission is to deliver innovative solutions that transform businesses and improve lives.
              </p>
              <p className='text-gray-700 leading-relaxed'>
                With a team of talented developers, designers, and project managers, we've successfully 
                delivered over 100 projects for clients worldwide.
              </p>
            </div>

            {/* Benefits */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-bold mb-4'>Why Join Us</h2>
              <ul className='space-y-3'>
                <li className='flex items-start gap-3'>
                  <svg className='w-6 h-6 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <span className='text-gray-700'>Competitive salary and benefits package</span>
                </li>
                <li className='flex items-start gap-3'>
                  <svg className='w-6 h-6 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <span className='text-gray-700'>Modern office with latest technology</span>
                </li>
                <li className='flex items-start gap-3'>
                  <svg className='w-6 h-6 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <span className='text-gray-700'>Flexible working hours and remote options</span>
                </li>
                <li className='flex items-start gap-3'>
                  <svg className='w-6 h-6 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <span className='text-gray-700'>Professional development and training</span>
                </li>
              </ul>
            </div>

            {/* Open Positions */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-bold mb-4'>Open Positions (12)</h2>
              <div className='space-y-4'>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                    <h3 className='font-semibold text-lg mb-2'>Senior React Developer</h3>
                    <div className='flex flex-wrap gap-3 mb-3 text-sm text-gray-600'>
                      <span>📍 Ho Chi Minh City</span>
                      <span>💰 $2000-$3000</span>
                      <span>📅 Posted 2 days ago</span>
                    </div>
                    <Link
                      to={path.jobDetail.replace(':id', item.toString())}
                      className='text-blue-600 hover:underline text-sm'
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow p-6 sticky top-6'>
              <h2 className='font-semibold mb-4'>Company Info</h2>
              <div className='space-y-4 text-sm'>
                <div>
                  <p className='text-gray-500 mb-1'>Industry</p>
                  <p className='font-medium'>Information Technology</p>
                </div>
                <div>
                  <p className='text-gray-500 mb-1'>Company Size</p>
                  <p className='font-medium'>50-200 employees</p>
                </div>
                <div>
                  <p className='text-gray-500 mb-1'>Location</p>
                  <p className='font-medium'>Ho Chi Minh City, Vietnam</p>
                </div>
                <div>
                  <p className='text-gray-500 mb-1'>Founded</p>
                  <p className='font-medium'>2015</p>
                </div>
              </div>

              <div className='mt-6 pt-6 border-t'>
                <h3 className='font-semibold mb-3'>Follow Us</h3>
                <div className='flex gap-3'>
                  <a href='#' className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200'>
                    <span className='text-blue-600'>Li</span>
                  </a>
                  <a href='#' className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200'>
                    <span className='text-blue-600'>Fb</span>
                  </a>
                  <a href='#' className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200'>
                    <span className='text-blue-600'>Tw</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}