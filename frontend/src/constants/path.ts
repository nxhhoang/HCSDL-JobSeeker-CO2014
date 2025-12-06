// const path = {
//   home: '/',
//   user: '/user',
//   profile: '/user/profile',
//   changePassword: '/user/password',
//   historyPurchase: '/user/purchase',
//   login: '/login',
//   register: '/register',
//   logout: '/logout',
//   productDetail: ':nameId',
//   cart: '/cart'
// } as const

// export default path

const path = {
  // Auth
  login: '/login',
  register: '/register',
  
  // Home & Jobs
  home: '/',
  jobs: '/jobs',
  jobDetail: '/jobs/:id',
  jobSearch: '/jobs/search',
  
  // Companies
  companies: '/companies',
  companyDetail: '/companies/:id',
  
  // Candidate
  candidate: '/candidate',
  candidateProfile: '/candidate/profile',
  candidateResume: '/candidate/resume',
  candidateApplications: '/candidate/applications',
  savedJobs: '/candidate/saved-jobs',
  
  // Employer
  employer: '/employer',
  employerDashboard: '/employer/dashboard',
  companyProfile: '/employer/company-profile',
  postJob: '/employer/post-job',
  manageJobs: '/employer/manage-jobs',
  employerApplications: '/employer/applications',
  
  // Admin
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminSkills: '/admin/skills',
  adminCategories: '/admin/categories',
  adminJobs: '/admin/jobs',
  adminCompanies: '/admin/companies',
  adminApplications: '/admin/applications',
  adminReports: '/admin/reports'
} as const

export default path