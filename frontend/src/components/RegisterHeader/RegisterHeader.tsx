// import { Link, useMatch } from 'react-router-dom'
// import path from 'src/constants/path'

// export default function RegisterHeader() {
//   const registerMatch = useMatch('/register')
//   const isRegister = Boolean(registerMatch)
  
//   return (
//     <header className='py-5 bg-white shadow-sm'>
//       <div className='container'>
//         <nav className='flex items-center justify-between'>
//           {/* Logo */}
//           <Link to={path.home} className='flex items-center gap-3'>
//             {/* Icon */}
//             <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md'>
//               <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
//                 <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
//               </svg>
//             </div>
            
//             {/* Text */}
//             <div className='flex flex-col'>
//               <span className='text-2xl font-bold text-blue-600'>JobSeeker</span>
//               <span className='text-xs text-gray-500 -mt-1'>Find Your Dream Job</span>
//             </div>
//           </Link>

//           {/* Login/Register Text */}
//           <div className='text-xl font-semibold text-gray-700'>
//             {isRegister ? 'Đăng ký' : 'Đăng nhập'}
//           </div>
//         </nav>
//       </div>
//     </header>
//   )
// }
import { Link, useMatch } from 'react-router-dom'
import path from 'src/constants/path'

export default function RegisterHeader() {
  const registerMatch = useMatch('/register')
  const isRegister = Boolean(registerMatch)
  
  return (
    <header className='py-6 bg-gradient-to-r from-blue-50 to-indigo-50'>
      <div className='container'>
        <nav className='flex items-center justify-between'>
          {/* Logo */}
          <Link to={path.home} className='group flex items-center gap-3'>
            {/* Icon with Animation */}
            <div className='relative'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200'>
                <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path 
                    strokeLinecap='round' 
                    strokeLinejoin='round' 
                    strokeWidth={2} 
                    d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' 
                  />
                </svg>
              </div>
              {/* Decorative dot */}
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
            </div>
            
            {/* Text */}
            <div className='flex flex-col'>
              <span className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800'>
                JobSeeker
              </span>
              <span className='text-xs text-gray-600 font-medium -mt-0.5'>
                Your Career Partner
              </span>
            </div>
          </Link>

          {/* Right Section */}
          <div className='flex items-center gap-3'>
            <div className='hidden md:flex flex-col items-end'>
              <span className='text-sm text-gray-500'>
                {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
              </span>
              <Link 
                to={isRegister ? path.login : path.register}
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'
              >
                {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
              </Link>
            </div>
            <div className='text-xl font-bold text-gray-800 px-4 py-2 bg-white rounded-lg shadow-sm'>
              {isRegister ? 'Đăng ký' : 'Đăng nhập'}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}