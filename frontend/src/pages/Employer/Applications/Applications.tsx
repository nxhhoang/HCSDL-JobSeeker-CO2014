import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

export default function EmployerApplications() {
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'accepted' | 'rejected'>('all')

  const applications = [
    {
      id: 1,
      candidateName: 'John Doe',
      jobTitle: 'Senior React Developer',
      appliedDate: '2024-12-10',
      status: 'pending',
      experience: '5 years',
      email: 'john.doe@email.com'
    },
    {
      id: 2,
      candidateName: 'Jane Smith',
      jobTitle: 'Senior React Developer',
      appliedDate: '2024-12-11',
      status: 'reviewing',
      experience: '6 years',
      email: 'jane.smith@email.com'
    },
    {
      id: 3,
      candidateName: 'Mike Johnson',
      jobTitle: 'Backend Engineer',
      appliedDate: '2024-12-08',
      status: 'accepted',
      experience: '4 years',
      email: 'mike.j@email.com'
    },
    {
      id: 4,
      candidateName: 'Sarah Williams',
      jobTitle: 'Backend Engineer',
      appliedDate: '2024-12-07',
      status: 'rejected',
      experience: '2 years',
      email: 'sarah.w@email.com'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewing':
        return 'bg-blue-100 text-blue-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredApplications = applications.filter(app => {
    const jobMatch = selectedJob === 'all' || app.jobTitle === selectedJob
    const statusMatch = filter === 'all' || app.status === filter
    return jobMatch && statusMatch
  })

  return (
    <div>
      <Helmet>
        <title>Applications | JobSeeker</title>
        <meta name='description' content='Review job applications' />
      </Helmet>

      <div className='bg-white rounded-lg shadow p-6'>
        <h1 className='text-2xl font-bold mb-6'>Applications</h1>

        {/* Filters */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Filter by Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Jobs</option>
              <option value='Senior React Developer'>Senior React Developer</option>
              <option value='Backend Engineer'>Backend Engineer</option>
              <option value='UI/UX Designer'>UI/UX Designer</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='reviewing'>Reviewing</option>
              <option value='accepted'>Accepted</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className='flex gap-2 mb-6 border-b overflow-x-auto'>
          {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
                filter === status
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className='space-y-4'>
          {filteredApplications.length === 0 ? (
            <div className='text-center py-12'>
              <svg className='w-16 h-16 mx-auto mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <p className='text-gray-600'>No applications found</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                      <span className='text-blue-600 font-semibold text-lg'>
                        {application.candidateName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold mb-1'>{application.candidateName}</h3>
                      <p className='text-gray-600 mb-1'>Applied for: <span className='font-medium'>{application.jobTitle}</span></p>
                      <div className='flex gap-4 text-sm text-gray-500'>
                        <span>📧 {application.email}</span>
                        <span>💼 {application.experience}</span>
                        <span>📅 {application.appliedDate}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>

                <div className='flex gap-3'>
                  <button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm'>
                    View Profile
                  </button>
                  <button className='border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm'>
                    Download CV
                  </button>
                  {application.status === 'pending' && (
                    <>
                      <button className='border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 text-sm'>
                        Accept
                      </button>
                      <button className='border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 text-sm'>
                        Reject
                      </button>
                    </>
                  )}
                  {application.status === 'accepted' && (
                    <button className='border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm'>
                      Schedule Interview
                    </button>
                  )}
                  <button className='text-gray-600 hover:text-gray-800 text-sm'>
                    Send Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}