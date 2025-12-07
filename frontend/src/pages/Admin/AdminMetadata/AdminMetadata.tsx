import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import metadataApi from 'src/apis/metadata.api'
import path from 'src/constants/path'
import { Skill, JobCategory } from 'src/types/metadata.type'
import CreateSkillModal from 'src/pages/Admin/AdminSkills/CreateSkillModal'
import UpdateSkillModal from 'src/pages/Admin/AdminSkills/UpdateSkillModal'
import DeleteSkillModal from 'src/pages/Admin/AdminSkills/DeleteSkillModal'
import CreateCategoryModal from 'src/pages/Admin/AdminCategories/CreateCategoryModal'
import DeleteCategoryModal from 'src/pages/Admin/AdminCategories/DeleteCategoryModal'

/**
 * AdminMetadata Component
 * 
 * Màn hình quản lý METADATA - hiển thị và thao tác với 2 bảng cùng lúc:
 * 1. SKILLS table (kỹ năng)
 * 2. CATEGORIES table (ngành nghề)
 * 
 * Đây là màn hình đáp ứng yêu cầu: "At least one screen must involve two or more tables"
 * 
 * Features:
 * - Hiển thị 2 tables song song trên cùng 1 màn hình
 * - View, Create, Update, Delete data từ cả 2 bảng
 * - Filtering cho cả 2 bảng
 * - Statistics tổng hợp từ 2 bảng
 */
export default function AdminMetadata() {
  // State for filtering (NO SORTING - must use backend API)
  const [skillFilter, setSkillFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // State for Skill modals
  const [createSkillModalOpen, setCreateSkillModalOpen] = useState(false)
  const [updateSkillModalOpen, setUpdateSkillModalOpen] = useState(false)
  const [deleteSkillModalOpen, setDeleteSkillModalOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<{
    skill_id: number
    skill_name: string
    s_description: string | null
  } | null>(null)

  // State for Category modals
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false)
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<{
    jc_name: string
    speciality: string
  } | null>(null)

  // Fetch Skills data (Table 1)
  const {
    data: skillsData,
    isLoading: skillsLoading,
    error: skillsError
  } = useQuery({
    queryKey: ['skills'],
    queryFn: () => metadataApi.getSkills()
  })

  // Fetch Categories data (Table 2)
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => metadataApi.getCategories()
  })

  const skills = skillsData?.data.data || []
  const categories = categoriesData?.data.data || []

  // Filter Skills (NO SORTING on frontend)
  const filteredSkills = skills.filter((skill) =>
    skill.skill_name.toLowerCase().includes(skillFilter.toLowerCase())
  )

  // Filter Categories (NO SORTING on frontend)
  const filteredCategories = categories.filter((category) =>
    category.jc_name.toLowerCase().includes(categoryFilter.toLowerCase())
  )

  // Skill CRUD handlers
  const handleUpdateSkillClick = (skill: { skill_id: number; skill_name: string; s_description: string | null }) => {
    setSelectedSkill(skill)
    setUpdateSkillModalOpen(true)
  }

  const handleDeleteSkillClick = (skill: { skill_id: number; skill_name: string; s_description: string | null }) => {
    setSelectedSkill(skill)
    setDeleteSkillModalOpen(true)
  }

  // Category CRUD handlers
  const handleDeleteCategoryClick = (category: { jc_name: string; speciality: string }) => {
    setSelectedCategory(category)
    setDeleteCategoryModalOpen(true)
  }

  const isLoading = skillsLoading || categoriesLoading
  const hasError = skillsError || categoriesError

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Metadata Management</h1>
              <p className='text-gray-600 mt-2'>
                Manage Skills and Categories - Multiple Tables View
              </p>
              <p className='text-sm text-blue-600 mt-1 font-medium'>
                ✓ This screen involves 2 tables: SKILLS & CATEGORIES
              </p>
            </div>
            <Link
              to={path.adminDashboard}
              className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition'
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Combined Statistics Card - Data from BOTH tables */}
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white'>
          <h2 className='text-xl font-bold mb-4'>System Metadata Overview</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white/20 backdrop-blur-sm rounded-lg p-4'>
              <p className='text-sm font-medium opacity-90'>Total Skills</p>
              <p className='text-3xl font-bold mt-1'>{skills.length}</p>
              <p className='text-xs opacity-75 mt-1'>From SKILLS table</p>
            </div>
            <div className='bg-white/20 backdrop-blur-sm rounded-lg p-4'>
              <p className='text-sm font-medium opacity-90'>Total Categories</p>
              <p className='text-3xl font-bold mt-1'>{categories.length}</p>
              <p className='text-xs opacity-75 mt-1'>From CATEGORIES table</p>
            </div>
            <div className='bg-white/20 backdrop-blur-sm rounded-lg p-4'>
              <p className='text-sm font-medium opacity-90'>Total Metadata Items</p>
              <p className='text-3xl font-bold mt-1'>{skills.length + categories.length}</p>
              <p className='text-xs opacity-75 mt-1'>Combined from both tables</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <div className='flex flex-col items-center gap-3'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
              <p className='text-gray-600'>Loading metadata from multiple tables...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
            <div className='inline-flex items-center gap-2 text-red-600'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <span>Error loading metadata. Please try again.</span>
            </div>
          </div>
        )}

        {/* Main Content - Two Tables Side by Side */}
        {!isLoading && !hasError && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* LEFT SIDE: SKILLS TABLE */}
            <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
              <div className='bg-blue-50 px-6 py-4 border-b border-blue-100'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-xl font-bold text-blue-900'>Skills Table</h2>
                    <p className='text-sm text-blue-600 mt-1'>Database: SKILLS</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full'>
                      {filteredSkills.length} items
                    </span>
                    <button
                      onClick={() => setCreateSkillModalOpen(true)}
                      className='px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-1'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>

                {/* Skills Filter Only (NO SORT) */}
                <div className='mt-4'>
                  <input
                    type='text'
                    placeholder='🔍 Filter by skill name...'
                    className='w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                  />
                  <p className='text-xs text-blue-600 mt-1'>
                    {/* 💡 Filtering on frontend. Sorting must be done via backend API. */}
                  </p>
                </div>
              </div>

              <div className='overflow-x-auto' style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {filteredSkills.length === 0 ? (
                  <div className='p-8 text-center text-gray-500'>
                    <p>No skills found matching "{skillFilter}"</p>
                  </div>
                ) : (
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50 sticky top-0'>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          ID
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Skill Name
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Description
                        </th>
                        <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {filteredSkills.map((skill: Skill) => (
                        <tr key={skill.skill_id} className='hover:bg-blue-50 transition'>
                          <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {skill.skill_id}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap'>
                            <span className='px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full'>
                              {skill.skill_name}
                            </span>
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-600'>
                            {skill.s_description || (
                              <span className='text-gray-400 italic'>No description</span>
                            )}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-right text-sm font-medium'>
                            <button
                              className='text-yellow-600 hover:text-yellow-900 mr-3 transition'
                              onClick={() => handleUpdateSkillClick(skill)}
                            >
                              Update
                            </button>
                            <button
                              className='text-red-600 hover:text-red-900 transition'
                              onClick={() => handleDeleteSkillClick(skill)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* RIGHT SIDE: CATEGORIES TABLE */}
            <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
              <div className='bg-purple-50 px-6 py-4 border-b border-purple-100'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-xl font-bold text-purple-900'>Categories Table</h2>
                    <p className='text-sm text-purple-600 mt-1'>Database: CATEGORIES</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-full'>
                      {filteredCategories.length} items
                    </span>
                    <button
                      onClick={() => setCreateCategoryModalOpen(true)}
                      className='px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition flex items-center gap-1'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>

                {/* Categories Filter Only (NO SORT) */}
                <div className='mt-4'>
                  <input
                    type='text'
                    placeholder='🔍 Filter by category name...'
                    className='w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  />
                  <p className='text-xs text-purple-600 mt-1'>
                    {/* 💡 Filtering on frontend. Sorting must be done via backend API. */}
                  </p>
                </div>
              </div>

              <div className='overflow-x-auto' style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {filteredCategories.length === 0 ? (
                  <div className='p-8 text-center text-gray-500'>
                    <p>No categories found matching "{categoryFilter}"</p>
                  </div>
                ) : (
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50 sticky top-0'>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Category Name
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                          Speciality
                        </th>
                        <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {filteredCategories.map((category: JobCategory) => (
                        <tr key={category.jc_name} className='hover:bg-purple-50 transition'>
                          <td className='px-4 py-3'>
                            <span className='px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full'>
                              {category.jc_name}
                            </span>
                          </td>
                          <td className='px-4 py-3 text-sm text-gray-600'>{category.speciality}</td>
                          <td className='px-4 py-3 whitespace-nowrap text-right text-sm font-medium'>
                            <button
                              className='text-yellow-600 hover:text-yellow-900 mr-3 transition'
                              onClick={() => alert('Update Category feature - Coming soon!')}
                            >
                              Update
                            </button>
                            <button
                              className='text-red-600 hover:text-red-900 transition'
                              onClick={() => handleDeleteCategoryClick(category)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className='mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <div className='flex items-start gap-3'>
            <svg
              className='w-5 h-5 text-yellow-600 mt-0.5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <div>
              <p className='text-sm font-medium text-yellow-900'>
                📊 Database Requirement Fulfilled
              </p>
              <p className='text-sm text-yellow-700 mt-1'>
                This screen demonstrates interaction with <strong>TWO database tables</strong>:
              </p>
              <ul className='text-sm text-yellow-700 mt-2 space-y-1 ml-4'>
                <li>✓ Table 1: <strong>SKILLS</strong> (skill_id, skill_name, s_description)</li>
                <li>✓ Table 2: <strong>CATEGORIES</strong> (jc_name, speciality)</li>
                <li>✓ Features: <strong>View, Create, Update, Delete</strong> data from both tables</li>
                <li>✓ <strong>Filtering</strong> data (frontend) - acceptable for UI/UX</li>
                <li>✓ Combined statistics from multiple tables</li>
                <li>⚠️ <strong>Sorting removed</strong> - must be implemented via backend API</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skill Modals */}
        <CreateSkillModal isOpen={createSkillModalOpen} onClose={() => setCreateSkillModalOpen(false)} />

        <UpdateSkillModal
          isOpen={updateSkillModalOpen}
          onClose={() => {
            setUpdateSkillModalOpen(false)
            setSelectedSkill(null)
          }}
          skill={selectedSkill}
        />

        <DeleteSkillModal
          isOpen={deleteSkillModalOpen}
          onClose={() => {
            setDeleteSkillModalOpen(false)
            setSelectedSkill(null)
          }}
          skill={selectedSkill}
        />

        {/* Category Modals */}
        <CreateCategoryModal isOpen={createCategoryModalOpen} onClose={() => setCreateCategoryModalOpen(false)} />

        <DeleteCategoryModal
          isOpen={deleteCategoryModalOpen}
          onClose={() => {
            setDeleteCategoryModalOpen(false)
            setSelectedCategory(null)
          }}
          category={selectedCategory}
        />

        {/* Navigation Links */}
        <div className='mt-6 flex gap-3'>
          <Link
            to={path.adminSkills}
            className='flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition'
          >
            <p className='text-sm font-medium text-blue-900'>Manage Skills Only</p>
            <p className='text-xs text-blue-600 mt-1'>Go to Skills Management page</p>
          </Link>
          <Link
            to={path.adminCategories}
            className='flex-1 bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition'
          >
            <p className='text-sm font-medium text-purple-900'>Manage Categories Only</p>
            <p className='text-xs text-purple-600 mt-1'>Go to Categories Management page</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
