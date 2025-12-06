import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import Button from 'src/components/Button'
import Input from 'src/components/Input'

export default function PostJob() {
  const [jobType, setJobType] = useState<string>('full-time')
  const [experienceLevel, setExperienceLevel] = useState<string>('mid')

  return (
    <div>
      <Helmet>
        <title>Post a Job | JobSeeker</title>
        <meta name='description' content='Create a new job posting' />
      </Helmet>

      <div className='bg-white rounded-lg shadow p-6'>
        <h1 className='text-2xl font-bold mb-6'>Post a New Job</h1>

        <form className='space-y-8'>
          {/* Basic Information */}
          <div>
            <h2 className='text-lg font-semibold mb-4 pb-2 border-b'>Basic Information</h2>
            <div className='grid grid-cols-1 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Job Title *
                </label>
                <Input
                  type='text'
                  placeholder='e.g. Senior React Developer'
                  className='w-full'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Job Type *
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='full-time'>Full-time</option>
                    <option value='part-time'>Part-time</option>
                    <option value='contract'>Contract</option>
                    <option value='internship'>Internship</option>
                    <option value='remote'>Remote</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Experience Level *
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='entry'>Entry Level</option>
                    <option value='mid'>Mid Level</option>
                    <option value='senior'>Senior Level</option>
                    <option value='lead'>Lead/Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Category *
                </label>
                <select className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                  <option>Software Development</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Customer Service</option>
                  <option>Finance</option>
                  <option>Human Resources</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Salary */}
          <div>
            <h2 className='text-lg font-semibold mb-4 pb-2 border-b'>Location & Compensation</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Location *
                </label>
                <Input
                  type='text'
                  placeholder='e.g. Ho Chi Minh City, Vietnam'
                  className='w-full'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Salary Range
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  <Input
                    type='number'
                    placeholder='Min ($)'
                    className='w-full'
                  />
                  <Input
                    type='number'
                    placeholder='Max ($)'
                    className='w-full'
                  />
                </div>
              </div>

              <div className='md:col-span-2'>
                <label className='flex items-center gap-2'>
                  <input type='checkbox' className='w-4 h-4 text-blue-600' />
                  <span className='text-sm text-gray-700'>Negotiable salary</span>
                </label>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h2 className='text-lg font-semibold mb-4 pb-2 border-b'>Job Details</h2>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Job Description *
                </label>
                <textarea
                  rows={6}
                  placeholder='Describe the role and responsibilities...'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Requirements *
                </label>
                <textarea
                  rows={6}
                  placeholder='List the required skills and qualifications...'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Benefits
                </label>
                <textarea
                  rows={4}
                  placeholder='What benefits do you offer?'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className='text-lg font-semibold mb-4 pb-2 border-b'>Required Skills</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Add Skills
                </label>
                <Input
                  type='text'
                  placeholder='Type a skill and press Enter'
                  className='w-full'
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Press Enter to add each skill
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-2'>
                  React
                  <button type='button' className='text-blue-800 hover:text-blue-900'>×</button>
                </span>
                <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-2'>
                  TypeScript
                  <button type='button' className='text-blue-800 hover:text-blue-900'>×</button>
                </span>
                <span className='bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-2'>
                  Node.js
                  <button type='button' className='text-blue-800 hover:text-blue-900'>×</button>
                </span>
              </div>
            </div>
          </div>

          {/* Application Settings */}
          <div>
            <h2 className='text-lg font-semibold mb-4 pb-2 border-b'>Application Settings</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Number of Positions
                </label>
                <Input
                  type='number'
                  min='1'
                  defaultValue='1'
                  className='w-full'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Application Deadline
                </label>
                <Input
                  type='date'
                  className='w-full'
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 pt-6 border-t'>
            <Button
              type='submit'
              className='bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold'
            >
              Publish Job
            </Button>
            <Button
              type='button'
              className='border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold'
            >
              Save as Draft
            </Button>
            <Button
              type='button'
              className='border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold'
            >
              Preview
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}