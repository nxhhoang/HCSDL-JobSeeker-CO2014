import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import adminApi from 'src/apis/admin.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'

interface CreateSkillModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateSkillModal({ isOpen, onClose }: CreateSkillModalProps) {
  const [skillName, setSkillName] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState<{ skillName?: string; description?: string }>({})
  const queryClient = useQueryClient()

  const createSkillMutation = useMutation({
    mutationFn: (body: { skillName: string; description: string }) => adminApi.createSkill(body),
    onSuccess: (response) => {
      // Invalidate và refetch danh sách skills
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      // Reset form và đóng modal
      handleClose()
      // Hiển thị thông báo thành công
      alert(`Skill created successfully!\nID: ${response.data.data.SkillID}\nName: ${response.data.data.SkillName}`)
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse<{ skillName?: string; description?: string }>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          setFormError(formError)
        }
      } else {
        setFormError({ skillName: 'Failed to create skill. Please try again.' })
      }
    }
  })

  const handleClose = () => {
    setSkillName('')
    setDescription('')
    setFormError({})
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError({})

    // Client-side validation
    const errors: { skillName?: string; description?: string } = {}
    
    if (!skillName.trim()) {
      errors.skillName = 'Skill name is required'
    } else if (skillName.trim().length < 2) {
      errors.skillName = 'Skill name must be at least 2 characters'
    } else if (skillName.trim().length > 100) {
      errors.skillName = 'Skill name must not exceed 100 characters'
    }

    if (!description.trim()) {
      errors.description = 'Description is required'
    } else if (description.trim().length < 5) {
      errors.description = 'Description must be at least 5 characters'
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors)
      return
    }

    createSkillMutation.mutate({
      skillName: skillName.trim(),
      description: description.trim()
    })
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        {/* Overlay */}
        <div className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75' onClick={handleClose}></div>

        {/* Modal */}
        <div className='inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
          {/* Header */}
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>Create New Skill</h3>
                <p className='text-sm text-gray-500'>Add a new skill to the system</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className='text-gray-400 hover:text-gray-500 transition'
              disabled={createSkillMutation.isPending}
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Skill Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Skill Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder='e.g., Rust Lang, TypeScript, Docker'
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  formError.skillName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={createSkillMutation.isPending}
                autoFocus
              />
              {formError.skillName && (
                <p className='mt-1.5 text-sm text-red-600 flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {formError.skillName}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Brief description of the skill (e.g., System programming language, Frontend framework, etc.)'
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                  formError.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={createSkillMutation.isPending}
              />
              {formError.description && (
                <p className='mt-1.5 text-sm text-red-600 flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {formError.description}
                </p>
              )}
              <p className='mt-1.5 text-xs text-gray-500'>
                {description.length} characters (minimum 5 required)
              </p>
            </div>

            {/* Info Box */}
            <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <div className='flex gap-2'>
                <svg className='w-5 h-5 text-blue-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-sm text-blue-800'>
                  This skill will be available for job postings and candidate profiles throughout the system.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-3 pt-2'>
              <button
                type='button'
                onClick={handleClose}
                className='flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium'
                disabled={createSkillMutation.isPending}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                disabled={createSkillMutation.isPending}
              >
                {createSkillMutation.isPending ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                    Create Skill
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
