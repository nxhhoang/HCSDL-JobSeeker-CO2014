import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { useQuery } from '@tanstack/react-query'
import adminApi from 'src/apis/admin.api'

export default function AdminDashboard() {
  const { profile } = useContext(AppContext)

  // Fetch system statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats()
  })

  const stats = statsData?.data.data

  const menuItems = [
    {
      title: 'User Management',
      description: 'View, create, edit, and delete users',
      icon: '👥',
      path: path.adminUsers,
      color: 'from-blue-500 to-blue-600'
    },
    // {
    //   title: 'Job Management',
    //   description: 'Manage all job postings',
    //   icon: '💼',
    //   path: path.adminJobs,
    //   color: 'from-green-500 to-green-600'
    // },
    // {
    //   title: 'Company Management',
    //   description: 'Manage company profiles',
    //   icon: '🏢',
    //   path: path.adminCompanies,
    //   color: 'from-purple-500 to-purple-600'
    // },
    {
      title: 'Skills Management',
      description: 'Manage skills and categories',
      icon: '🎯',
      path: path.adminSkills,
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Categories Management',
      description: 'Manage job categories',
      icon: '📂',
      path: path.adminCategories,
      color: 'from-indigo-500 to-indigo-600'
    },
    // {
    //   title: 'Application Management',
    //   description: 'View and manage applications',
    //   icon: '📝',
    //   path: path.adminApplications,
    //   color: 'from-orange-500 to-orange-600'
    // },
    // {
    //   title: 'Reports & Analytics',
    //   description: 'View system reports and statistics',
    //   icon: '📊',
    //   path: path.adminReports,
    //   color: 'from-pink-500 to-pink-600'
    // }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <div className='bg-white shadow-sm'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
              <p className='text-gray-600 mt-1'>Welcome back, {profile?.name || 'Admin'}</p>
            </div>
            <Link
              to={path.home}
              className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition'
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='container mx-auto px-4 py-8'>
        {statsLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='flex flex-col items-center gap-3'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
              <p className='text-gray-600'>Loading statistics...</p>
            </div>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
              {/* Total Users */}
              <div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>Total Users</p>
                    <p className='text-3xl font-bold text-gray-900 mt-2'>
                      {stats?.TotalUsers.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className='text-4xl'>👥</div>
                </div>
                <p className='text-xs text-gray-500 mt-4'>All registered users in system</p>
              </div>

              {/* Total Jobs */}
              <div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>Total Jobs</p>
                    <p className='text-3xl font-bold text-gray-900 mt-2'>
                      {stats?.TotalJobs.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className='text-4xl'>💼</div>
                </div>
                <p className='text-xs text-gray-500 mt-4'>Job postings in database</p>
              </div>

              {/* Total Applications */}
              <div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>Total Applications</p>
                    <p className='text-3xl font-bold text-gray-900 mt-2'>
                      {stats?.TotalApplies.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className='text-4xl'>📝</div>
                </div>
                <p className='text-xs text-gray-500 mt-4'>Job applications submitted</p>
              </div>

              {/* Average Company Rating */}
              <div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>Avg Company Rating</p>
                    <p className='text-3xl font-bold text-gray-900 mt-2'>
                      {stats?.AvgCompanyRating.toFixed(2) || '0.00'} ⭐
                    </p>
                  </div>
                  <div className='text-4xl'>🏢</div>
                </div>
                <p className='text-xs text-gray-500 mt-4'>Average rating of all companies</p>
              </div>
            </div>
          </>
        )}

        {/* Menu Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className='group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden'
            >
              <div className={`h-2 bg-gradient-to-r ${item.color}`} />
              <div className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='text-5xl'>{item.icon}</div>
                  <div className='text-gray-400 group-hover:text-gray-600 transition'>→</div>
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition'>
                  {item.title}
                </h3>
                <p className='text-gray-600 text-sm'>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        {/* <div className='mt-8 bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <button className='px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium'>
              + Create New User
            </button>
            <button className='px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium'>
              + Post New Job
            </button>
            <button className='px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition font-medium'>
              + Add Company
            </button>
          </div>
        </div> */}

        {/* Recent Activity */}
        <div className='mt-8 bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Recent Activity</h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold'>
                U
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900'>New user registered</p>
                <p className='text-xs text-gray-600'>John Doe joined as Candidate</p>
              </div>
              <p className='text-xs text-gray-500'>5 mins ago</p>
            </div>
            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold'>
                J
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900'>New job posted</p>
                <p className='text-xs text-gray-600'>Senior React Developer at TechCorp</p>
              </div>
              <p className='text-xs text-gray-500'>10 mins ago</p>
            </div>
            <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
              <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold'>
                A
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900'>New application received</p>
                <p className='text-xs text-gray-600'>Jane Smith applied for Frontend Developer</p>
              </div>
              <p className='text-xs text-gray-500'>15 mins ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
