/* eslint-disable react-refresh/only-export-components */
import { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/Login'
import Register from './pages/Register'
// import Profile from './pages/User/pages/Profile'
// import ProductList from './pages/ProductList'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
// import CartLayout from './layouts/CartLayout'
// import UserLayout from './pages/User/layouts/UserLayout'
// import ChangePassword from './pages/User/pages/ChangePassword'
// import HistoryPurchase from './pages/User/pages/HistoryPurchase'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import JobList from './pages/JobList'
import JobDetail from './pages/JobDetail'
import JobSearch from './pages/JobSearch'
import CompanyList from './pages/Company/CompanyList'
import CompanyDetail from './pages/Company/CompanyDetail'
import CandidateLayout from './layouts/CandidateLayout'
import EmployerLayout from './layouts/EmployerLayout'
import CandidateProfile from './pages/Candidate/Profile'
import CandidateResume from './pages/Candidate/Resume'
import CandidateApplications from './pages/Candidate/Applications'
import SavedJobs from './pages/Candidate/SavedJobs'
import EmployerDashboard from './pages/Employer/Dashboard'
import CompanyProfile from './pages/Employer/CompanyProfile'
import PostJob from './pages/Employer/PostJob'
import ManageJobs from './pages/Employer/ManageJobs'
import EmployerApplications from './pages/Employer/Applications'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminSkills from './pages/Admin/AdminSkills'
import AdminCategories from './pages/Admin/AdminCategories'
import AdminMetadata from './pages/Admin/AdminMetadata'

function ProtectedRouteForAuth() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Navigate to='/' /> : <Outlet />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Navigate to={path.login} /> : <Outlet />
}
export default function useRouteElements() {
  const routeElements = useRoutes([
    //   { ... public routes ... },
  //   { ... auth routes ... },
  //   { ... candidate protected ... },
  //   { ... employer protected ... },
  //   { ... common protected ... },
  //   { ... not found ... }
    // Public Routes  --> Không cần đăng nhập
    {                                     
      path: '',
      element: <MainLayout />, 
      children: [
        {
          path: path.home,
          element: <Home />
        },
        {
          path: path.jobs,
          element: <JobList />
        },
        {
          path: path.jobDetail,
          element: <JobDetail />
        },
        {
          path: path.jobSearch,
          element: <JobSearch />
        },
        {
          path: path.companies,
          element: <CompanyList />
        },
        {
          path: path.companyDetail,
          element: <CompanyDetail />
        },
        // {
        //   path: path.productList,
        //   index: true,
        //   element: <ProductList />
        // },
        // {
        //   path: path.productDetail,
        //   element: <ProductDetail />
        // }
      ]
    },

    // Auth Routes (Login/Register)
    {
      path: '',
      element: <ProtectedRouteForAuth />, // Ngăn user đã đăng nhập vào Login/Register
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: <Login />
            },
            {
              path: path.register,
              element: <Register />
            }
          ]
        }
      ]
    },

    // Candidate Protected Routes
    {
      path: '',
      element: <ProtectedRoute allowedRoles={['candidate']} />,
      children: [
        {
          path: path.candidate,
          element: <CandidateLayout />,
          children: [
            {
              path: path.candidateProfile,
              element: <CandidateProfile />
            },
            {
              path: path.candidateResume,
              element: <CandidateResume />
            },
            {
              path: path.candidateApplications,
              element: <CandidateApplications />
            },
            {
              path: path.savedJobs,
              element: <SavedJobs />
            }
          ]
        }
      ]
    },

    // Employer Protected Routes
    {
      path: '',
      element: <ProtectedRoute allowedRoles={['employer']} />,
      children: [
        {
          path: path.employer,
          element: <EmployerLayout />,
          children: [
            {
              path: path.employerDashboard,
              element: <EmployerDashboard />
            },
            {
              path: path.companyProfile,
              element: <CompanyProfile />
            },
            {
              path: path.postJob,
              element: <PostJob />
            },
            {
              path: path.manageJobs,
              element: <ManageJobs />
            },
            {
              path: path.employerApplications,
              element: <EmployerApplications />
            }
          ]
        }
      ]
    },

    // Admin Protected Routes - Chỉ Admin mới truy cập được
    {
      path: path.admin,
      element: <ProtectedRoute allowedRoles={['admin']} />,
      children: [
        {
          index: true,
          element: <Navigate to={path.adminDashboard} replace />
        },
        {
          path: path.adminDashboard,
          element: <AdminDashboard />
        },
        {
          path: path.adminUsers,
          element: <AdminUsers />
        },
        {
          path: path.adminSkills,
          element: <AdminSkills />
        },
        {
          path: path.adminCategories,
          element: <AdminCategories />
        },
        {
          path: path.adminMetadata,
          element: <AdminMetadata />
        }
        // Sẽ thêm AdminJobs, AdminCompanies, AdminApplications, AdminReports sau
      ]
    },

    // Common Protected Routes (Both roles)
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        // {
        //   path: path.cart,
        //   element: (
        //     <CartLayout>
        //       <Cart />
        //     </CartLayout>
        //   )
        // },
        // {
        //   path: path.user,
        //   element: <MainLayout />,
        //   children: [
        //     {
        //       path: '',
        //       element: <UserLayout />,
        //       children: [
        //         {
        //           path: path.profile,
        //           element: <Profile />
        //         },
        //         {
        //           path: path.changePassword,
        //           element: <ChangePassword />
        //         },
        //         {
        //           path: path.historyPurchase,
        //           element: <HistoryPurchase />
        //         }
        //       ]
        //     }
        //   ]
        // }
      ]
    },

    // 404 Route
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return routeElements
}