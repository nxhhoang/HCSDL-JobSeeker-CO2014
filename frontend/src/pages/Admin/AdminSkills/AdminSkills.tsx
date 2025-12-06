import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import metadataApi from 'src/apis/metadata.api'
import path from 'src/constants/path'
import CreateSkillModal from 'src/pages/Admin/AdminSkills/CreateSkillModal'
import UpdateSkillModal from 'src/pages/Admin/AdminSkills/UpdateSkillModal'
import DeleteSkillModal from 'src/pages/Admin/AdminSkills/DeleteSkillModal'

export default function AdminSkills() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<{
    skill_id: number
    skill_name: string
    s_description: string | null
  } | null>(null)

  // Fetch skills data
  const { data, isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: () => metadataApi.getSkills()
  })

  const skills = data?.data.data || []

  const handleUpdateClick = (skill: { skill_id: number; skill_name: string; s_description: string | null }) => {
    setSelectedSkill(skill)
    setUpdateModalOpen(true)
  }

  const handleDeleteClick = (skill: { skill_id: number; skill_name: string; s_description: string | null }) => {
    setSelectedSkill(skill)
    setDeleteModalOpen(true)
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Skills Management</h1>
              <p className='text-gray-600 mt-2'>Manage all skills in the system</p>
            </div>
            <div className='flex gap-3'>
              <button
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2'
                onClick={() => setCreateModalOpen(true)}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Create New Skill
              </button>
              <Link
                to={path.adminDashboard}
                className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition'
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 rounded-lg p-4'>
              <p className='text-sm text-blue-600 font-medium'>Total Skills</p>
              <p className='text-2xl font-bold text-blue-900'>{skills.length}</p>
            </div>
            <div className='text-gray-600'>
              <p className='text-sm'>Skills available in the system for job postings and candidate profiles</p>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          {isLoading && (
            <div className='flex items-center justify-center py-12'>
              <div className='flex flex-col items-center gap-3'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                <p className='text-gray-600'>Loading skills...</p>
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
                <span>Error loading skills. Please try again.</span>
              </div>
            </div>
          )}

          {!isLoading && !error && skills.length === 0 && (
            <div className='p-12 text-center'>
              <div className='text-6xl mb-4'>📚</div>
              <p className='text-gray-600 text-lg'>No skills found</p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
              >
                Create First Skill
              </button>
            </div>
          )}

          {!isLoading && !error && skills.length > 0 && (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Skill Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Description
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {skills.map((skill) => (
                    <tr key={skill.skill_id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {skill.skill_id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <span className='px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full'>
                            {skill.skill_name}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {skill.s_description || <span className='text-gray-400 italic'>No description</span>}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <button
                          className='text-yellow-600 hover:text-yellow-900 mr-3 transition'
                          onClick={() => handleUpdateClick(skill)}
                        >
                          Update
                        </button>
                        <button
                          className='text-red-600 hover:text-red-900 transition'
                          onClick={() => handleDeleteClick(skill)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Skill Modal */}
        <CreateSkillModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />

        {/* Update Skill Modal */}
        <UpdateSkillModal
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false)
            setSelectedSkill(null)
          }}
          skill={selectedSkill}
        />

        {/* Delete Skill Modal */}
        <DeleteSkillModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setSelectedSkill(null)
          }}
          skill={selectedSkill}
        />
      </div>
    </div>
  )
}
