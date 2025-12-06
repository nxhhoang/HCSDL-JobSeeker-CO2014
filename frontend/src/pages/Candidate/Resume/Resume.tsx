import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Button from 'src/components/Button'

interface Resume {
  id: string
  name: string
  uploadDate: string
  size: string
  isDefault: boolean
}

export default function CandidateResume() {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: '1',
      name: 'CV_Nguyen_Van_A_2024.pdf',
      uploadDate: '2024-11-20',
      size: '2.5 MB',
      isDefault: true
    },
    {
      id: '2',
      name: 'Resume_Frontend_Developer.pdf',
      uploadDate: '2024-11-15',
      size: '1.8 MB',
      isDefault: false
    }
  ])

  const handleSetDefault = (id: string) => {
    setResumes(resumes.map(resume => ({
      ...resume,
      isDefault: resume.id === id
    })))
  }

  const handleDelete = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id))
  }

  const handleUpload = () => {
    // TODO: Implement file upload
    console.log('Upload new resume')
  }

  return (
    <div>
      <Helmet>
        <title>My Resume | JobSeeker</title>
        <meta name='description' content='Manage your resumes' />
      </Helmet>

      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>CV Của Tôi</h1>
          <p className='text-gray-600 mt-1'>Quản lý các CV của bạn để ứng tuyển công việc</p>
        </div>
        <Button
          onClick={handleUpload}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Tải CV Mới
        </Button>
      </div>

      {/* Upload Instructions */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
        <div className='flex gap-3'>
          <svg className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
          </svg>
          <div>
            <h3 className='font-semibold text-blue-900 mb-1'>Lưu ý khi tải CV</h3>
            <ul className='text-sm text-blue-800 space-y-1'>
              <li>• Định dạng: PDF, DOC, DOCX (Khuyến nghị: PDF)</li>
              <li>• Kích thước tối đa: 5 MB</li>
              <li>• Đặt tên file rõ ràng, dễ nhận biết</li>
              <li>• Bạn có thể tải lên tối đa 5 CV</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Resume List */}
      {resumes.length > 0 ? (
        <div className='space-y-4'>
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between'>
                <div className='flex gap-4 flex-1'>
                  {/* PDF Icon */}
                  <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <svg className='w-6 h-6 text-red-600' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z' clipRule='evenodd' />
                    </svg>
                  </div>

                  {/* Resume Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='text-lg font-semibold text-gray-900 truncate'>
                        {resume.name}
                      </h3>
                      {resume.isDefault && (
                        <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium'>
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className='flex items-center gap-4 text-sm text-gray-600'>
                      <span className='flex items-center gap-1'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        {new Date(resume.uploadDate).toLocaleDateString('vi-VN')}
                      </span>
                      <span className='flex items-center gap-1'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                        </svg>
                        {resume.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex gap-2 flex-shrink-0'>
                  <Button
                    className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                    title='Xem'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  </Button>
                  <Button
                    className='p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                    title='Tải xuống'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                    </svg>
                  </Button>
                  {!resume.isDefault && (
                    <Button
                      onClick={() => handleSetDefault(resume.id)}
                      className='p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'
                      title='Đặt làm mặc định'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(resume.id)}
                    className='p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                    title='Xóa'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                  </Button>
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
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có CV nào</h3>
          <p className='text-gray-600 mb-4'>Tải lên CV của bạn để bắt đầu ứng tuyển</p>
          <Button
            onClick={handleUpload}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Tải CV Đầu Tiên
          </Button>
        </div>
      )}
    </div>
  )
}