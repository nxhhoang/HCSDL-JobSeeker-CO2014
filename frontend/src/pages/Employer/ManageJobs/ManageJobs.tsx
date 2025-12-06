import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function ManageJobs() {
  const [filter, setFilter] = useState<'all' | 'active' | 'closed' | 'draft'>('all')

  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      status: 'active',
      postedDate: '2024-12-01',
      applications: 24,
      views: 156,
      deadline: '2024-12-31'
    },
    {
      id: 2,
      title: 'Backend Engineer',
      status: 'active',
      postedDate: '2024-12-05',
      applications: 18,
      views: 98,
      deadline: '2024-12-28'
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      status: 'closed',
      postedDate: '2024-11-15',
      applications: 45,
      views: 234,
      deadline: '2024-12-15'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      status: 'draft',
      postedDate: '2024-12-10',
      applications: 0,
      views: 0,
      deadline: '2024-12-30'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter)

  return (
    <div>
      <Helmet>
        <title>Manage Jobs | JobSeeker</title>
        <meta name='description' content='Manage your job postings' />
      </Helmet>

      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Manage Jobs</h1>
          <Link
            to={path.postJob}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            + Post New Job
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className='flex gap-2 mb-6 border-b overflow-x-auto'>
          {['all', 'active', 'closed', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
                filter === status
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {status} ({jobs.filter(j => status === 'all' || j.status === status).length})
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Job Title</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Status</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Applications</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Views</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Posted Date</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Deadline</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {filteredJobs.map((job) => (
                <tr key={job.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-4'>
                    <Link
                      to={path.jobDetail.replace(':id', job.id.toString())}
                      className='font-medium text-blue-600 hover:underline'
                    >
                      {job.title}
                    </Link>
                  </td>
                  <td className='px-4 py-4'>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className='text-gray-900 font-medium'>{job.applications}</span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className='text-gray-600'>{job.views}</span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className='text-gray-600'>{job.postedDate}</span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className='text-gray-600'>{job.deadline}</span>
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex gap-2'>
                      <Link
                        to={path.jobDetail.replace(':id', job.id.toString())}
                        className='text-blue-600 hover:underline text-sm'
                      >
                        View
                      </Link>
                      <button className='text-yellow-600 hover:underline text-sm'>
                        Edit
                      </button>
                      {job.status === 'active' && (
                        <button className='text-red-600 hover:underline text-sm'>
                          Close
                        </button>
                      )}
                      {job.status === 'draft' && (
                        <button className='text-green-600 hover:underline text-sm'>
                          Publish
                        </button>
                      )}
                      <button className='text-gray-600 hover:underline text-sm'>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className='text-center py-12'>
            <svg className='w-16 h-16 mx-auto mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
            </svg>
            <p className='text-gray-600 mb-4'>No jobs found in this category</p>
            <Link
              to={path.postJob}
              className='text-blue-600 hover:underline'
            >
              Post your first job
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}