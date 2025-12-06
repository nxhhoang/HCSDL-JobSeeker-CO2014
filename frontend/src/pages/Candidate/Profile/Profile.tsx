import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import Input from 'src/components/Input'

export default function CandidateProfile() {
  const { profile } = useContext(AppContext)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    date_of_birth: profile?.date_of_birth || '',
    skills: [] as string[],
    experience: '',
    education: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to update profile
    console.log('Update profile:', formData)
    setIsEditing(false)
  }

  return (
    <div>
      <Helmet>
        <title>My Profile | JobSeeker</title>
        <meta name='description' content='Manage your candidate profile' />
      </Helmet>

      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Hồ Sơ Cá Nhân</h1>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg'
          >
            Chỉnh sửa
          </Button>
        ) : (
          <div className='flex gap-2'>
            <Button
              onClick={() => setIsEditing(false)}
              className='bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg'
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg'
            >
              Lưu
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className='bg-white rounded-lg border border-gray-200 p-6 mb-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Thông Tin Cá Nhân</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Họ và tên <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50'
                placeholder='Nguyễn Văn A'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email <span className='text-red-500'>*</span>
              </label>
              <Input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                disabled
                className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Số điện thoại
              </label>
              <Input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50'
                placeholder='0123456789'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ngày sinh
              </label>
              <Input
                type='date'
                name='date_of_birth'
                value={formData.date_of_birth}
                onChange={handleChange}
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Địa chỉ
              </label>
              <Input
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50'
                placeholder='123 Đường ABC, Quận 1, TP.HCM'
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className='bg-white rounded-lg border border-gray-200 p-6 mb-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Thông Tin Nghề Nghiệp</h2>
          
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Kinh nghiệm làm việc
              </label>
              <textarea
                name='experience'
                value={formData.experience}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50'
                placeholder='Mô tả kinh nghiệm làm việc của bạn...'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Học vấn
              </label>
              <textarea
                name='education'
                value={formData.education}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50'
                placeholder='Trình độ học vấn, bằng cấp...'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Kỹ năng
              </label>
              <Input
                type='text'
                name='skills'
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50'
                placeholder='React, Node.js, Python...'
              />
              <p className='text-xs text-gray-500 mt-1'>Nhập các kỹ năng, phân cách bằng dấu phẩy</p>
            </div>
          </div>
        </div>

        {/* Avatar Section */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Ảnh Đại Diện</h2>
          
          <div className='flex items-center gap-6'>
            <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0'>
              <img
                src={profile?.avatar || 'https://via.placeholder.com/150'}
                alt='Profile'
                className='w-full h-full object-cover'
              />
            </div>
            {isEditing && (
              <div>
                <Button
                  type='button'
                  className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200'
                >
                  Tải ảnh lên
                </Button>
                <p className='text-xs text-gray-500 mt-2'>
                  JPG, PNG hoặc GIF. Kích thước tối đa 2MB
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}