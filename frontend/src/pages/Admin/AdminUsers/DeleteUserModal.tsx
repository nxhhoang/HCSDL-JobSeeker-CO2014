import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import adminApi from 'src/apis/admin.api'
import { AdminUser } from 'src/types/admin.type'

interface DeleteUserModalProps {
  user: AdminUser | null
  isOpen: boolean
  onClose: () => void
}

export default function DeleteUserModal({ user, isOpen, onClose }: DeleteUserModalProps) {
  const [error, setError] = useState<string>('')
  const queryClient = useQueryClient()

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => adminApi.deleteUser(userId, { emailOrPhone: '', password: '' }),
    onSuccess: () => {
      // Invalidate và refetch danh sách users
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      // Đóng modal
      handleClose()
      // Hiển thị thông báo thành công
      alert('User deleted successfully!')
    },
    onError: () => {
      setError('Failed to delete user. Please try again.')
    }
  })

  const handleClose = () => {
    setError('')
    onClose()
  }

  const handleConfirmDelete = () => {
    if (!user) return
    setError('')
    deleteUserMutation.mutate(user.ID)
  }

  if (!isOpen || !user) return null

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        {/* Overlay */}
        <div className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75' onClick={handleClose}></div>

        {/* Modal */}
        <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
          {/* Header */}
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-12 h-12 bg-red-100 rounded-full'>
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
                <h3 className='text-lg font-semibold text-gray-900'>Delete User</h3>
                <p className='text-sm text-gray-500'>This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className='text-gray-400 hover:text-gray-500 transition'
              disabled={deleteUserMutation.isPending}
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
            <p className='text-sm text-gray-600 mb-2'>You are about to delete:</p>
            <div className='space-y-1'>
              <p className='font-semibold text-gray-900 text-lg'>{user.Name}</p>
              <p className='text-sm text-gray-600'>
                <span className='font-medium'>Email:</span> {user.Email}
              </p>
              <p className='text-sm text-gray-600'>
                <span className='font-medium'>Username:</span> {user.Username}
              </p>
              <p className='text-sm'>
                <span className='font-medium text-gray-600'>Role: </span>
                <span
                  className={`font-semibold ${
                    user.UserType === 'Admin'
                      ? 'text-purple-600'
                      : user.UserType === 'Employer'
                        ? 'text-blue-600'
                        : 'text-green-600'
                  }`}
                >
                  {user.UserType}
                </span>
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          {/* Warning */}
          <div className='mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <div className='flex gap-3'>
              <svg className='w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <p className='text-sm font-medium text-yellow-900 mb-1'>Warning</p>
                <p className='text-sm text-yellow-800'>
                  This action cannot be undone. This will permanently delete the user account and all associated data.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={handleClose}
              className='flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium'
              disabled={deleteUserMutation.isPending}
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleConfirmDelete}
              className='flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
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
                  Confirm Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
