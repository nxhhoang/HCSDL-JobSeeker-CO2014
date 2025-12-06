import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

interface Application {
  id: string
  jobTitle: string
  company: string
  companyLogo: string
  appliedDate: string
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'accepted'
  salary: string
}

const statusConfig = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' },
  reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-700' },
  interview: { label: 'Mời phỏng vấn', color: 'bg-purple-100 text-purple-700' },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700' },
  accepted: { label: 'Chấp nhận', color: 'bg-green-100 text-green-700' }
}

export default function CandidateApplications() {
  const [filter, setFilter] = useState<'all' | Application['status']>('all')
  
  const [applications] = useState<Application[]>([
    {
      id: '1',
      jobTitle: 'Senior React Developer',
      company: 'Tech Company Inc.',
      companyLogo: 'https://via.placeholder.com/50',
      appliedDate: '2024-11-25',
      status: 'interview',
      salary: '$2000-$3000'
    },
    {
      id: '2',
      jobTitle: 'Frontend Developer',
      company: 'Startup XYZ',
      companyLogo: 'https://via.placeholder.com/50',
      appliedDate: '2024-11-20',
      status: 'reviewing',
      salary: '$1500-$2500'
    },
    {
      id: '3',
      jobTitle: 'Full Stack Developer',
      company: 'Digital Agency',
      companyLogo: 'https://via.placeholder.com/50',
      appliedDate: '2024-11-15',
      status: 'rejected',
      salary: '$2500-$3500'
    },
    {
      id: '4',
      jobTitle: 'UI/UX Developer',
      company: 'Design Studio',
      companyLogo: 'https://via.placeholder.com/50',
      appliedDate: '2024-11-28',
      status: 'pending',
      salary: '$1800-$2800'
    }
  ])

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    interview: applications.filter(a => a.status === 'interview').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    accepted: applications.filter(a => a.status === 'accepted').length
  }

  return (
    <div>
      <Helmet>
        <title>My Applications | JobSeeker</title>
        <meta name='description' content='Track your job applications' />
      </Helmet>

      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Đơn Ứng Tuyển Của Tôi</h1>
        <p className='text-gray-600'>Theo dõi trạng thái các đơn ứng tuyển của bạn</p>
      </div>

      {/* Statistics */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
        <div className='bg-white rounded-lg border border-gray-200 p-4'>
          <p className='text-sm text-gray-600 mb-1'>Tổng cộng</p>
          <p className='text-2xl font-bold text-gray-900'>{stats.total}</p>
        </div>
        <div className='bg-yellow-50 rounded-lg border border-yellow-200 p-4'>
          <p className='text-sm text-yellow-700 mb-1'>Chờ xử lý</p>
          <p className='text-2xl font-bold text-yellow-900'>{stats.pending}</p>
        </div>
        <div className='bg-blue-50 rounded-lg border border-blue-200 p-4'>
          <p className='text-sm text-blue-700 mb-1'>Đang xét</p>
          <p className='text-2xl font-bold text-blue-900'>{stats.reviewing}</p>
        </div>
        <div className='bg-purple-50 rounded-lg border border-purple-200 p-4'>
          <p className='text-sm text-purple-700 mb-1'>Phỏng vấn</p>
          <p className='text-2xl font-bold text-purple-900'>{stats.interview}</p>
        </div>
        <div className='bg-green-50 rounded-lg border border-green-200 p-4'>
          <p className='text-sm text-green-700 mb-1'>Chấp nhận</p>
          <p className='text-2xl font-bold text-green-900'>{stats.accepted}</p>
        </div>
        <div className='bg-red-50 rounded-lg border border-red-200 p-4'>
          <p className='text-sm text-red-700 mb-1'>Từ chối</p>
          <p className='text-2xl font-bold text-red-900'>{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-2 mb-6'>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Tất cả ({stats.total})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Chờ xử lý ({stats.pending})
        </button>
        <button
          onClick={() => setFilter('reviewing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'reviewing' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Đang xét ({stats.reviewing})
        </button>
        <button
          onClick={() => setFilter('interview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'interview' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Phỏng vấn ({stats.interview})
        </button>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className='space-y-4'>
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='flex gap-4 flex-1'>
                  {/* Company Logo */}
                  <div className='w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
                    <img
                      src={application.companyLogo}
                      alt={application.company}
                      className='w-full h-full object-cover'
                    />
                  </div>

                  {/* Job Info */}
                  <div className='flex-1 min-w-0'>
                    <Link
                      to={path.jobDetail.replace(':id', application.id)}
                      className='text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors'
                    >
                      {application.jobTitle}
                    </Link>
                    <p className='text-gray-600 mt-1'>{application.company}</p>
                    <div className='flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600'>
                      <span className='flex items-center gap-1'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        Ứng tuyển: {new Date(application.appliedDate).toLocaleDateString('vi-VN')}
                      </span>
                      <span className='flex items-center gap-1'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        {application.salary}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className='flex flex-col items-end gap-3'>
                  <span className={`px-4 py-2 rounded-full font-medium text-sm ${statusConfig[application.status].color}`}>
                    {statusConfig[application.status].label}
                  </span>
                  
                  {/* Actions */}
                  <div className='flex gap-2'>
                    <button
                      className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                      title='Xem chi tiết'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                      </svg>
                    </button>
                    <button
                      className='p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      title='Hủy đơn'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300'>
          <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
          </svg>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có đơn ứng tuyển nào</h3>
          <p className='text-gray-600 mb-4'>Bắt đầu tìm kiếm và ứng tuyển công việc ngay!</p>
          <Link
            to={path.jobs}
            className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
            Tìm việc làm
          </Link>
        </div>
      )}
    </div>
  )
}