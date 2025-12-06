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
          <h1 className='text-4xl font-bold text-white mb-2'>JobSeekers</h1>
          <p className='text-white/90 text-lg'>Find Your Dream Job</p>
        </div>

        {/* Login Form Card */}
        <div className='bg-white rounded-2xl shadow-2xl p-8'>
          <div className='mb-6'>
            <h2 className='text-3xl font-bold text-gray-800'>Welcome Back</h2>
            <p className='text-gray-600 mt-2'>Sign in to continue your job search journey</p>
          </div>

          <form onSubmit={onSubmit} noValidate className='space-y-5'>
            {/* Email/Phone Input */}
            <div>
              <label htmlFor='emailOrPhone' className='block text-sm font-medium text-gray-700 mb-2'>
                Email or Phone Number
              </label>
              <Input
                name='emailOrPhone'
                register={register}
                type='text'
                className=''
                classNameInput='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none'
                errorMessage={errors.emailOrPhone?.message}
                placeholder='Enter your email or phone'
                autoComplete='username'
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <Input
                name='password'
                register={register}
                type='password'
                className=''
                classNameInput='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 outline-none'
                classNameEye='absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600'
                errorMessage={errors.password?.message}
                placeholder='Enter your password'
                autoComplete='current-password'
              />
            </div>

            {/* Remember Me & Forgot Password */}
            {/* <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer'
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-700 cursor-pointer'>
                  Remember me
                </label>
              </div>
        
            </div> */}

            {/* Login Button */}
            <Button
              type='submit'
              style={{
                background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(79, 70, 229))',
                color: 'white'
              }}
              className='w-full font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:brightness-110'
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
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-500'>Quick Access</span>
              </div>
            </div>
          </div>

          {/* Demo Accounts Info */}
          <div className='mt-6 bg-gray-50 rounded-lg p-4'>
            <p className='text-xs font-semibold text-gray-700 mb-3'>Demo Accounts (Development Only):</p>
            <div className='space-y-2 text-xs text-gray-600'>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Admin:</span>
                <span className='text-gray-500 font-mono'>sManager / password</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Candidate:</span>
                <span className='text-gray-500 font-mono'>dev2@mail.com / 123</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Employer:</span>
                <span className='text-gray-500 font-mono'>cf@boss.com / 123</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Company:</span>
                <span className='text-gray-500 font-mono'>hr@fpt.com / 123</span>
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

        {/* Footer Note */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-white/80'>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}