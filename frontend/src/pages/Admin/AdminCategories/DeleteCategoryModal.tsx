import { useMutation, useQueryClient } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'

interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: {
    jc_name: string
    speciality: string
  } | null
}

export default function DeleteCategoryModal({ isOpen, onClose, category }: DeleteCategoryModalProps) {
  const queryClient = useQueryClient()

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (jcName: string) => adminApi.deleteCategory(jcName),
    onSuccess: () => {
      // Invalidate categories query để refresh danh sách
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Show success message
      alert(`✅ Category "${category?.jc_name}" has been deleted successfully!`)
      // Close modal
      onClose()
    },
    onError: () => {
      alert('❌ Failed to delete category. Please try again.')
    }
  })

  const handleDelete = () => {
    if (category) {
      deleteCategoryMutation.mutate(category.jc_name)
    }
  }

  if (!isOpen || !category) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md mx-4'>
        {/* Header */}
        <div className='flex items-center gap-3 p-6 border-b border-gray-200'>
          <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
            <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>Delete Category</h2>
            <p className='text-sm text-gray-600'>This action cannot be undone</p>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 space-y-4'>
          <p className='text-gray-700'>Are you sure you want to delete this category?</p>

          {/* Category Info Card */}
          <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Category Name:</span>
                <span className='px-2 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded'>
                  {category.jc_name}
                </span>
              </div>
              <div className='pt-2 border-t border-gray-200'>
                <span className='text-sm text-gray-600'>Speciality:</span>
                <p className='text-sm text-gray-700 mt-1'>{category.speciality}</p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className='flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <svg
              className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <p className='text-sm text-red-800'>
              This category will be permanently deleted. All jobs associated with this category may be affected.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-3 p-6 bg-gray-50 rounded-b-lg'>
          <button
            type='button'
            onClick={onClose}
            disabled={deleteCategoryMutation.isPending}
            className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending}
            className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {deleteCategoryMutation.isPending ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Deleting...
              </>
            ) : (
              <>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
                Delete Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
