import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function CompanyList() {
  const companies = [
    {
      id: 1,
      name: 'Tech Company Inc.',
      industry: 'Information Technology',
      location: 'Ho Chi Minh City',
      size: '50-200 employees',
      jobs: 12
    },
    {
      id: 2,
      name: 'StartUp Inc',
      industry: 'Software Development',
      location: 'Hanoi',
      size: '11-50 employees',
      jobs: 8
    },
    {
      id: 3,
      name: 'Digital Agency',
      industry: 'Marketing & Advertising',
      location: 'Da Nang',
      size: '200-500 employees',
      jobs: 15
    }
  ]

  return (
    <div className='bg-gray-50 py-8'>
      <Helmet>
        <title>Browse Companies | JobSeeker</title>
        <meta name='description' content='Explore top companies hiring now' />
      </Helmet>

      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold mb-6'>Browse Companies</h1>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Filter Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold mb-4'>Filters</h2>
              
              <div className='mb-6'>
                <h3 className='font-medium mb-2'>Industry</h3>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>IT</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>Finance</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>Marketing</span>
                  </label>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='font-medium mb-2'>Company Size</h3>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>1-10</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>11-50</span>
                  </label>
                  <label className='flex items-center'>
                    <input type='checkbox' className='mr-2' />
                    <span className='text-sm'>50-200</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Company Grid */}
          <div className='lg:col-span-3'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {companies.map((company) => (
                <Link
                  key={company.id}
                  to={path.companyDetail.replace(':id', company.id.toString())}
                  className='bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow'
                >
                  <div className='flex items-start gap-4 mb-4'>
                    <div className='w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0'>
                      <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-lg mb-1'>{company.name}</h3>
                      <p className='text-sm text-gray-600 mb-2'>{company.industry}</p>
                      <div className='flex flex-wrap gap-2 text-xs text-gray-500'>
                        <span>📍 {company.location}</span>
                        <span>👥 {company.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className='pt-4 border-t'>
                    <span className='text-blue-600 font-medium'>{company.jobs} open positions</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}