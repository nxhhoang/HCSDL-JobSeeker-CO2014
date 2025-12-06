import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputFile from 'src/components/InputFile'

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div>
      <Helmet>
        <title>Company Profile | JobSeeker</title>
        <meta name='description' content='Manage your company profile' />
      </Helmet>

      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Company Profile</h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Company Logo */}
        <div className='mb-8 pb-8 border-b'>
          <h2 className='text-lg font-semibold mb-4'>Company Logo</h2>
          <div className='flex items-center gap-6'>
            <div className='w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden'>
              <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
              </svg>
            </div>
            {isEditing && (
              <div>
                <InputFile onChange={() => {}} />
                <p className='text-sm text-gray-500 mt-2'>
                  Recommended size: 512x512px. Max file size: 2MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Company Information */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold mb-4'>Company Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Company Name *</label>
              <Input
                type='text'
                defaultValue='Tech Company Inc.'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Industry *</label>
              <Input
                type='text'
                defaultValue='Information Technology'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Company Size</label>
              <select
                disabled={!isEditing}
                defaultValue='50-200'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50'
              >
                <option value='1-10'>1-10 employees</option>
                <option value='11-50'>11-50 employees</option>
                <option value='50-200'>50-200 employees</option>
                <option value='200-500'>200-500 employees</option>
                <option value='500+'>500+ employees</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Founded Year</label>
              <Input
                type='number'
                defaultValue='2015'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Website</label>
              <Input
                type='url'
                defaultValue='https://techcompany.com'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email *</label>
              <Input
                type='email'
                defaultValue='contact@techcompany.com'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
              <Input
                type='tel'
                defaultValue='+84 28 1234 5678'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Location *</label>
              <Input
                type='text'
                defaultValue='Ho Chi Minh City, Vietnam'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold mb-4'>About Company</h2>
          <div className='grid grid-cols-1 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Company Description *</label>
              <textarea
                rows={6}
                disabled={!isEditing}
                defaultValue='We are a leading technology company specializing in web and mobile application development. Our mission is to deliver innovative solutions that transform businesses and improve lives.'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Why Join Us</label>
              <textarea
                rows={4}
                disabled={!isEditing}
                defaultValue='• Competitive salary and benefits&#10;• Modern office environment&#10;• Professional growth opportunities&#10;• Flexible working hours'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50'
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold mb-4'>Social Media</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>LinkedIn</label>
              <Input
                type='url'
                placeholder='https://linkedin.com/company/...'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Facebook</label>
              <Input
                type='url'
                placeholder='https://facebook.com/...'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Twitter</label>
              <Input
                type='url'
                placeholder='https://twitter.com/...'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Instagram</label>
              <Input
                type='url'
                placeholder='https://instagram.com/...'
                disabled={!isEditing}
                className='w-full'
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className='flex gap-4'>
            <Button className='bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700'>
              Save Changes
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              className='border-2 border-gray-300 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-50'
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}