import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import adminApi from 'src/apis/admin.api'
import { UpdateSkillBody } from 'src/types/admin.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'

interface UpdateSkillModalProps {
  isOpen: boolean
  onClose: () => void
  skill: {
    skill_id: number
    skill_name: string
    s_description: string | null
  } | null
}

export default function UpdateSkillModal({ isOpen, onClose, skill }: UpdateSkillModalProps) {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<UpdateSkillBody>({
    skillName: '',
    description: ''
  })

  const [errors, setErrors] = useState<{ skillName?: string; description?: string }>({})

  // Update form data when skill prop changes
  useEffect(() => {
    if (isOpen && skill) {
      setFormData({
        skillName: skill.skill_name,
        description: skill.s_description || ''
      })
      setErrors({})
    }
  }, [isOpen, skill])

  // Update skill mutation
  const updateSkillMutation = useMutation({
    mutationFn: (body: UpdateSkillBody) => adminApi.updateSkill(skill!.skill_id.toString(), body),
    onSuccess: (data) => {
      // Invalidate skills query để refresh danh sách
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      // Show success message
      alert(`✅ Skill updated successfully!\nID: ${data.data.data.id}\nName: ${data.data.data.skillName}`)
      // Reset form and close modal
      resetAndClose()
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse<{ skillName?: string; description?: string }>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          setErrors(formError)
        }
      } else {
        alert('❌ Failed to update skill. Please try again.')
      }
    }
  })

  const resetAndClose = () => {
    setFormData({ skillName: '', description: '' })
    setErrors({})
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    const newErrors: { skillName?: string; description?: string } = {}

    if (!formData.skillName.trim()) {
      newErrors.skillName = 'Skill name is required'
    } else if (formData.skillName.trim().length < 2) {
      newErrors.skillName = 'Skill name must be at least 2 characters'
    } else if (formData.skillName.trim().length > 100) {
      newErrors.skillName = 'Skill name must not exceed 100 characters'
    }

    // if (!formData.description.trim()) {
    //   newErrors.description = 'Description is required'
    // } else if (formData.description.trim().length < 5) {
    //   newErrors.description = 'Description must be at least 5 characters'
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit if validation passes
    setErrors({})
    updateSkillMutation.mutate(formData)
  }

  if (!isOpen || !skill) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-900'>Update Skill</h2>
          <button
            onClick={resetAndClose}
            disabled={updateSkillMutation.isPending}
            className='text-gray-400 hover:text-gray-600 transition'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Skill ID (Read-only) */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Skill ID</label>
            <input
              type='text'
              value={skill.skill_id}
              disabled
              className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed'
            />
          </div>

          {/* Skill Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Skill Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={formData.skillName}
              onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
              disabled={updateSkillMutation.isPending}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.skillName ? 'border-red-500' : 'border-gray-300'
              } ${updateSkillMutation.isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder='e.g. Rust Language'
              maxLength={100}
            />
            <div className='flex items-center justify-between mt-1'>
              <div>
                {errors.skillName && (
                  <p className='text-sm text-red-600 flex items-center gap-1'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    {errors.skillName}
                  </p>
                )}
              </div>
              <p className='text-xs text-gray-500'>{formData.skillName.length}/100</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Description <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={updateSkillMutation.isPending}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } ${updateSkillMutation.isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder='Describe the skill...'
            />
            <div className='flex items-center justify-between mt-1'>
              <div>
                {errors.description && (
                  <p className='text-sm text-red-600 flex items-center gap-1'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    {errors.description}
                  </p>
                )}
              </div>
              <p className='text-xs text-gray-500'>{formData.description.length} characters</p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={resetAndClose}
              disabled={updateSkillMutation.isPending}
              className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={updateSkillMutation.isPending}
              className='flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {updateSkillMutation.isPending ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                  Update Skill
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
