import { Helmet } from 'react-helmet-async'
// import { useParams } from 'react-router-dom'

export default function JobDetail() {
  // const { id } = useParams()

  return (
    <div className='bg-gray-50 py-8'>
      <Helmet>
        <title>Job Details | JobSeeker</title>
        <meta name='description' content='View job details and apply' />
      </Helmet>

      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow p-8 mb-6'>
              <div className='flex justify-between items-start mb-6'>
                <div>
                  <h1 className='text-3xl font-bold mb-2'>Senior React Developer</h1>
                  <p className='text-xl text-gray-600 mb-2'>Tech Company Inc.</p>
                  <p className='text-gray-500'>Ho Chi Minh City, Vietnam</p>
                </div>
                <button className='text-gray-400 hover:text-red-500'>
                  <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                  </svg>
                </button>
              </div>

              <div className='flex flex-wrap gap-3 mb-6'>
                <span className='bg-blue-100 text-blue-600 px-4 py-2 rounded-full'>Full-time</span>
                <span className='bg-green-100 text-green-600 px-4 py-2 rounded-full'>$2000-$3000</span>
                <span className='bg-purple-100 text-purple-600 px-4 py-2 rounded-full'>Senior Level</span>
              </div>

              <div className='mb-8'>
                <h2 className='text-2xl font-semibold mb-4'>Job Description</h2>
                <p className='text-gray-700 leading-relaxed mb-4'>
                  We are looking for an experienced React Developer to join our dynamic team. You will be responsible for 
                  developing and maintaining web applications using modern frontend technologies.
                </p>
              </div>

              <div className='mb-8'>
                <h2 className='text-2xl font-semibold mb-4'>Requirements</h2>
                <ul className='list-disc list-inside space-y-2 text-gray-700'>
                  <li>5+ years of experience with React and TypeScript</li>
                  <li>Strong understanding of modern frontend development practices</li>
                  <li>Experience with state management (Redux, Zustand)</li>
                  <li>Excellent problem-solving skills</li>
                  <li>Good English communication skills</li>
                </ul>
              </div>

              <div className='mb-8'>
                <h2 className='text-2xl font-semibold mb-4'>Benefits</h2>
                <ul className='list-disc list-inside space-y-2 text-gray-700'>
                  <li>Competitive salary</li>
                  <li>Health insurance</li>
                  <li>Flexible working hours</li>
                  <li>Remote work options</li>
                  <li>Learning and development opportunities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow p-6 sticky top-6'>
              <button className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4'>
                Apply Now
              </button>
              <button className='w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'>
                Save Job
              </button>

              <div className='mt-6 pt-6 border-t'>
                <h3 className='font-semibold mb-4'>Job Information</h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Posted</p>
                    <p className='font-medium'>2 days ago</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Job Type</p>
                    <p className='font-medium'>Full-time</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Salary</p>
                    <p className='font-medium'>$2000 - $3000</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Experience</p>
                    <p className='font-medium'>5+ years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}