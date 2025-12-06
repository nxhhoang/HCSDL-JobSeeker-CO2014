import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import adminApi from 'src/apis/admin.api'
import { CreateCategoryBody } from 'src/types/admin.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<CreateCategoryBody>({
    jcName: '',
    speciality: ''
  })

  const [errors, setErrors] = useState<{ jcName?: string; speciality?: string }>({})

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (body: CreateCategoryBody) => adminApi.createCategory(body),
    onSuccess: (data) => {
      // Invalidate categories query để refresh danh sách
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Show success message
      alert(
        `✅ Category created successfully!\nName: ${data.data.data.jcName}\nSpeciality: ${data.data.data.speciality}`
      )
      // Reset form and close modal
      resetAndClose()
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse<{ jcName?: string; speciality?: string }>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          setErrors(formError)
        }
      } else {
        alert('❌ Failed to create category. Please try again.')
      }
    }
  })

  const resetAndClose = () => {
    setFormData({ jcName: '', speciality: '' })
    setErrors({})
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    const newErrors: { jcName?: string; speciality?: string } = {}

    if (!formData.jcName.trim()) {
      newErrors.jcName = 'Category name is required'
    } else if (formData.jcName.trim().length < 3) {
      newErrors.jcName = 'Category name must be at least 3 characters'
    } else if (formData.jcName.trim().length > 100) {
      newErrors.jcName = 'Category name must not exceed 100 characters'
    }

    if (!formData.speciality.trim()) {
      newErrors.speciality = 'Speciality is required'
    } else if (formData.speciality.trim().length < 3) {
      newErrors.speciality = 'Speciality must be at least 3 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit if validation passes
    setErrors({})
    createCategoryMutation.mutate(formData)
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-900'>Create New Category</h2>
          <button
            onClick={resetAndClose}
            disabled={createCategoryMutation.isPending}
            className='text-gray-400 hover:text-gray-600 transition'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Category Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Category Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={formData.jcName}
              onChange={(e) => setFormData({ ...formData, jcName: e.target.value })}
              disabled={createCategoryMutation.isPending}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.jcName ? 'border-red-500' : 'border-gray-300'
              } ${createCategoryMutation.isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder='e.g. AI - Blockchain'
              maxLength={100}
            />
            <div className='flex items-center justify-between mt-1'>
              <div>
                {errors.jcName && (
                  <p className='text-sm text-red-600 flex items-center gap-1'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    {errors.jcName}
                  </p>
                )}
              </div>
              <p className='text-xs text-gray-500'>{formData.jcName.length}/100</p>
            </div>
          </div>

          {/* Speciality */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Speciality <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={formData.speciality}
              onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
              disabled={createCategoryMutation.isPending}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                errors.speciality ? 'border-red-500' : 'border-gray-300'
              } ${createCategoryMutation.isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder='e.g. Future Tech, Machine Learning, Blockchain Development'
            />
            <div className='flex items-center justify-between mt-1'>
              <div>
                {errors.speciality && (
                  <p className='text-sm text-red-600 flex items-center gap-1'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    {errors.speciality}
                  </p>
                )}
              </div>
              <p className='text-xs text-gray-500'>{formData.speciality.length} characters</p>
            </div>
          </div>

          {/* Info box */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
            <div className='flex gap-2'>
              <svg className='w-5 h-5 text-blue-600 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='text-sm text-blue-800'>
                Category Name is the primary identifier. Make sure it's unique and descriptive.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={resetAndClose}
              disabled={createCategoryMutation.isPending}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={createCategoryMutation.isPending}
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {createCategoryMutation.isPending ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Creating...
                </>
              ) : (
                <>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
