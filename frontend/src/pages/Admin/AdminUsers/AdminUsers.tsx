import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import adminApi from 'src/apis/admin.api'
import { AdminUser, AdminUserSortField } from 'src/types/admin.type'
import path from 'src/constants/path'
import DeleteUserModal from './DeleteUserModal'

export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [roleFilter, setRoleFilter] = useState<'Admin' | 'Candidate' | 'Employer' | ''>('')
  const [sortField, setSortField] = useState<AdminUserSortField>('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)

  // Fetch users data với sorting từ backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminUsers', page, limit, roleFilter, sortField, sortOrder],
    queryFn: () =>
      adminApi.getUsers({
        page,
        limit,
        ...(roleFilter && { role: roleFilter }),
        sortBy: sortField,
        order: sortOrder
      })
  })

  const usersData = data?.data.data

  const handleSort = (field: AdminUserSortField) => {
    if (sortField === field) {
      // Toggle sort order nếu click vào cùng field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set field mới và reset về asc
      setSortField(field)
      setSortOrder('asc')
    }
    // Reset về trang 1 khi sort
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRoleFilterChange = (newRole: 'Admin' | 'Candidate' | 'Employer' | '') => {
    setRoleFilter(newRole)
    setPage(1) // Reset to page 1 when filter changes
  }

  const renderSortIcon = (field: AdminUserSortField) => {
    if (sortField !== field) {
      return <span className='text-gray-400'>⇅</span>
    }
    return sortOrder === 'asc' ? (
      <span className='text-blue-600'>↑</span>
    ) : (
      <span className='text-blue-600'>↓</span>
    )
  }

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setUserToDelete(null)
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>User Management</h1>
              <p className='text-gray-600 mt-2'>Manage all users in the system</p>
            </div>
            <div className='flex gap-3'>
              {/* <button
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2'
                onClick={() => alert('Create User feature - Coming soon!')}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Create New User
              </button> */}
              <Link
                to={path.adminDashboard}
                className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition'
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Filters & Stats */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {/* Total Users Stat */}
            <div className='bg-blue-50 rounded-lg p-4'>
              <p className='text-sm text-blue-600 font-medium'>Total Users</p>
              <p className='text-2xl font-bold text-blue-900'>{usersData?.total || 0}</p>
            </div>

            {/* Role Filter */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value as 'Admin' | 'Candidate' | 'Employer' | '')}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>All Roles ({usersData?.total || 0})</option>
                <option value='Candidate'>Candidate</option>
                <option value='Employer'>Employer</option>
                <option value='Admin'>Admin</option>
              </select>
            </div>

            {/* Current Sort Info */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <p className='text-sm text-gray-600 font-medium'>Sorting</p>
              <p className='text-sm font-bold text-gray-900'>
                {sortField} ({sortOrder === 'asc' ? 'A→Z' : 'Z→A'})
              </p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <div className='flex flex-col items-center gap-3'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                <p className='text-gray-600'>Loading users...</p>
              </div>
            </div>
          )}

          {error && (
            <div className='p-6 text-center'>
              <div className='inline-flex items-center gap-2 text-red-600'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>Error loading users. Please try again.</span>
              </div>
            </div>
          )}

          {!isLoading && !error && usersData?.users && usersData.users.length === 0 && (
            <div className='p-6 text-center'>
              <div className='inline-flex flex-col items-center gap-2'>
                <svg className='w-16 h-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                <p className='text-gray-600'>No users found with current filters.</p>
              </div>
            </div>
          )}

          {!isLoading && !error && usersData?.users && usersData.users.length > 0 && (
            <>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {/* Sortable: ID */}
                      <th
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition'
                        onClick={() => handleSort('id')}
                      >
                        <div className='flex items-center gap-2'>
                          <span>ID</span>
                          {renderSortIcon('id')}
                        </div>
                      </th>

                      {/* Sortable: Username */}
                      <th
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition'
                        onClick={() => handleSort('username')}
                      >
                        <div className='flex items-center gap-2'>
                          <span>Username</span>
                          {renderSortIcon('username')}
                        </div>
                      </th>

                      {/* Sortable: Name */}
                      <th
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition'
                        onClick={() => handleSort('name')}
                      >
                        <div className='flex items-center gap-2'>
                          <span>Name</span>
                          {renderSortIcon('name')}
                        </div>
                      </th>

                      {/* Sortable: Email */}
                      <th
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition'
                        onClick={() => handleSort('email')}
                      >
                        <div className='flex items-center gap-2'>
                          <span>Email</span>
                          {renderSortIcon('email')}
                        </div>
                      </th>

                      {/* Sortable: UserType */}
                      <th
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition'
                        onClick={() => handleSort('role')}
                      >
                        <div className='flex items-center gap-2'>
                          <span>Role</span>
                          {renderSortIcon('role')}
                        </div>
                      </th>

                      {/* Non-sortable: Phone */}
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Phone
                      </th>

                      {/* Non-sortable: Tax Number */}
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Tax Number
                      </th>

                      {/* Non-sortable: Actions */}
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {usersData.users.map((user) => (
                      <tr key={user.ID} className='hover:bg-gray-50 transition'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{user.ID}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{user.Username}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{user.Name}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{user.Email}</td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.UserType === 'Admin'
                                ? 'bg-purple-100 text-purple-800'
                                : user.UserType === 'Employer'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {user.UserType}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{user.PhoneNum}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {user.CompanyTaxNumber || '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          {/* <button 
                            className='text-blue-600 hover:text-blue-900 mr-3 transition'
                            onClick={() => alert('View feature - Coming soon!')}
                          >
                            View
                          </button> */}
                          {/* <button 
                            className='text-yellow-600 hover:text-yellow-900 mr-3 transition'
                            onClick={() => alert('Edit feature - Coming soon!')}
                          >
                            Edit
                          </button> */}
                          <button 
                            className='text-red-600 hover:text-red-900 transition'
                            onClick={() => handleDeleteClick(user)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination - unchanged */}
              <div className='bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200'>
                <div className='flex-1 flex justify-between sm:hidden'>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === usersData?.total_pages}
                    className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Next
                  </button>
                </div>
                <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                  <div>
                    <p className='text-sm text-gray-700'>
                      Showing <span className='font-medium'>{(page - 1) * limit + 1}</span> to{' '}
                      <span className='font-medium'>{Math.min(page * limit, usersData?.total || 0)}</span> of{' '}
                      <span className='font-medium'>{usersData?.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
                      >
                        <span className='sr-only'>Previous</span>
                        <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>

                      {/* Page Numbers */}
                      {(() => {
                        const totalPages = usersData?.total_pages || 1
                        const maxVisiblePages = 5
                        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
                        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

                        if (endPage - startPage < maxVisiblePages - 1) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1)
                        }

                        const pages = []
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i)
                        }

                        return pages.map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition ${
                              page === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))
                      })()}

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === usersData?.total_pages}
                        className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition'
                      >
                        <span className='sr-only'>Next</span>
                        <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Delete User Modal */}
        <DeleteUserModal user={userToDelete} isOpen={deleteModalOpen} onClose={handleCloseDeleteModal} />
      </div>
    </div>
  )
}
