import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import authApi from 'src/apis/auth.api'
import { LoginRequest } from 'src/types/auth.type'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { ErrorResponse } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = LoginRequest

export default function Login() {
  const { setIsAuthenticated, setProfile, setUserRole } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>()

  const loginMutation = useMutation({
    mutationFn: (body: LoginRequest) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        const { user } = response.data.data
        setIsAuthenticated(true)
        setProfile(user)

        // Set userRole based on userType - FIXED: Admin có role riêng
        let roleToSet: 'candidate' | 'employer' | 'admin'
        switch (user.userType) {
          case 'Admin':
            roleToSet = 'admin'
            break
          case 'Candidate':
            roleToSet = 'candidate'
            break
          case 'Employer':
            roleToSet = 'employer'
            break
          default:
            roleToSet = 'candidate' // fallback
        }
        setUserRole(roleToSet)

        toast.success(`Welcome back, ${user.name}!`)

        // Redirect based on user role
        switch (user.userType) {
          case 'Admin':
            navigate('/admin/dashboard')
            break
          case 'Candidate':
            navigate(path.home)
            break
          case 'Employer':
            navigate('/employer/dashboard')
            break
          default:
            navigate(path.home)
        }
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        } else {
          toast.error('Login failed. Please check your credentials.')
        }
      }
    })
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 shadow-lg'>
            <svg className='w-10 h-10 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
          </div>
          <h1 className='text-4xl font-bold text-white mb-2 drop-shadow-lg'>JobSeekers</h1>
          <p className='text-white/90 text-lg font-medium'>Find Your Dream Job Today</p>
        </div>

        {/* Login Form Card */}
        <div className='bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-gray-100'>
          {/* Card Header with Gradient */}
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-8 pt-8 pb-6 border-b border-gray-100'>
            <h2 className='text-3xl font-bold text-gray-800 mb-1'>Welcome Back</h2>
            <p className='text-gray-600'>Sign in to continue your job search journey</p>
          </div>

          {/* Form Content */}
          <div className='px-8 pt-6 pb-8'>
            <form onSubmit={onSubmit} noValidate className='space-y-5'>
              {/* Email/Phone Input */}
              <div>
                <label htmlFor='emailOrPhone' className='block text-sm font-semibold text-gray-700 mb-2'>
                  <span className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                      />
                    </svg>
                    Email or Phone Number
                  </span>
                </label>
                <Input
                  name='emailOrPhone'
                  register={register}
                  type='text'
                  className=''
                  classNameInput='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition duration-200 outline-none placeholder:text-gray-400'
                  errorMessage={errors.emailOrPhone?.message}
                  placeholder='Enter your email or phone'
                  autoComplete='username'
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
                  <span className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                    Password
                  </span>
                </label>
                <Input
                  name='password'
                  register={register}
                  type='password'
                  className=''
                  classNameInput='w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition duration-200 outline-none placeholder:text-gray-400'
                  classNameEye='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer text-gray-400 hover:text-blue-600 transition-colors'
                  errorMessage={errors.password?.message}
                  placeholder='Enter your password'
                  autoComplete='current-password'
                />
              </div>

              {/* Login Button */}
              <div className='pt-2'>
                <Button
                  type='submit'
                  style={{
                    background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(79, 70, 229))',
                    color: 'white'
                  }}
                  className='w-full font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:brightness-110 text-base'
                  isLoading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <span className='flex items-center justify-center text-white'>
                      <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-2'>
                      Sign In
                      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                      </svg>
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className='my-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white text-gray-500 font-medium'>Quick Access Demo Accounts</span>
                </div>
              </div>
            </div>

            {/* Demo Accounts Info */}
            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100'>
              <div className='flex items-center gap-2 mb-3'>
                <svg className='w-4 h-4 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-xs font-bold text-blue-900'>Development Only - Test Accounts</p>
              </div>
              <div className='space-y-2.5'>
                <div className='flex justify-between items-center bg-white/70 rounded-lg px-3 py-2 hover:bg-white transition-colors'>
                  <span className='text-xs font-semibold text-gray-700 flex items-center gap-2'>
                    <span className='w-2 h-2 bg-red-500 rounded-full'></span>
                    Admin
                  </span>
                  <code className='text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded'>
                    sManager / password
                  </code>
                </div>
                <div className='flex justify-between items-center bg-white/70 rounded-lg px-3 py-2 hover:bg-white transition-colors'>
                  <span className='text-xs font-semibold text-gray-700 flex items-center gap-2'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    Candidate
                  </span>
                  <code className='text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded'>
                    dev2@mail.com / 123
                  </code>
                </div>
                <div className='flex justify-between items-center bg-white/70 rounded-lg px-3 py-2 hover:bg-white transition-colors'>
                  <span className='text-xs font-semibold text-gray-700 flex items-center gap-2'>
                    <span className='w-2 h-2 bg-purple-500 rounded-full'></span>
                    Employer
                  </span>
                  <code className='text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded'>
                    cf@boss.com / 123
                  </code>
                </div>
                <div className='flex justify-between items-center bg-white/70 rounded-lg px-3 py-2 hover:bg-white transition-colors'>
                  <span className='text-xs font-semibold text-gray-700 flex items-center gap-2'>
                    <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
                    Company
                  </span>
                  <code className='text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded'>
                    hr@fpt.com / 123
                  </code>
                </div>
              </div>
            </div>

            {/* Registration Note - Commented out until feature is ready */}
            {/* <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <Link to={path.register} className='font-medium text-blue-600 hover:text-blue-500'>
                Sign up for free
              </Link>
            </p>
          </div> */}
          </div>
        </div>

        {/* Footer Note */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-white/80 drop-shadow'>
            By signing in, you agree to our{' '}
            <button className='font-semibold hover:text-white transition-colors underline'>
              Terms of Service
            </button>{' '}
            and{' '}
            <button className='font-semibold hover:text-white transition-colors underline'>Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  )
}