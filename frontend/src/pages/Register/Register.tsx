import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { schema, Schema } from 'src/utils/rules'
import Input from 'src/components/Input'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'username' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['username', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile, setUserRole } = useContext(AppContext)
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employer'>('candidate')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: { username: string; password: string; role: 'candidate' | 'employer' }) =>
      authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    // Xóa confirm_password trước khi gửi
    const body = {
      username: data.username,
      password: data.password,
      role: selectedRole
    }

    // Debug: In ra request body
    console.log('📤 Sending register request:', body)

    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        console.log('✅ Register success:', data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        setUserRole(selectedRole)

        if (selectedRole === 'candidate') {
          navigate(path.candidateProfile)
        } else {
          navigate(path.employerDashboard)
        }
      },
      onError: (error) => {
        console.error('❌ Register error:', error)
        
        // Log chi tiết response error
        if (error.response) {
          console.error('Response data:', error.response.data)
          console.error('Response status:', error.response.status)
        }
        
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen'>
      <Helmet>
        <title>Sign Up | JobSeeker</title>
        <meta name='description' content='Create your JobSeeker account' />
      </Helmet>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-md mx-auto'>
          {/* Logo */}
          <Link to={path.home} className='flex justify-center mb-8'>
            <div className='text-3xl font-bold text-blue-600 flex items-center gap-2'>
              <svg className='w-10 h-10' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
              </svg>
              <span>JobSeeker</span>
            </div>
          </Link>

          {/* Register Form */}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2 text-center'>Create Account</h1>
            <p className='text-gray-600 text-center mb-6'>Join JobSeeker today</p>

            <form onSubmit={onSubmit} noValidate>
              {/* Role Selection */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-3'>I want to:</label>
                <div className='grid grid-cols-2 gap-4'>
                  <button
                    type='button'
                    onClick={() => setSelectedRole('candidate')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'candidate'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <svg
                        className={`w-8 h-8 ${selectedRole === 'candidate' ? 'text-blue-600' : 'text-gray-400'}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                        />
                      </svg>
                      <span
                        className={`font-semibold ${selectedRole === 'candidate' ? 'text-blue-600' : 'text-gray-700'}`}
                      >
                        Find Jobs
                      </span>
                      <span className='text-xs text-gray-500 text-center'>Job seeker / Candidate</span>
                    </div>
                  </button>

                  <button
                    type='button'
                    onClick={() => setSelectedRole('employer')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'employer'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <svg
                        className={`w-8 h-8 ${selectedRole === 'employer' ? 'text-blue-600' : 'text-gray-400'}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                      </svg>
                      <span
                        className={`font-semibold ${selectedRole === 'employer' ? 'text-blue-600' : 'text-gray-700'}`}
                      >
                        Hire Talent
                      </span>
                      <span className='text-xs text-gray-500 text-center'>Company / Employer</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Username */}
              <div className='mb-4'>
                <Input
                  name='username'
                  register={register}
                  type='text'
                  className='w-full'
                  errorMessage={errors.username?.message}
                  placeholder='Username'
                  autoComplete='username'
                />
              </div>

              {/* Password */}
              <div className='mb-4'>
                <Input
                  name='password'
                  register={register}
                  type='password'
                  className='w-full'
                  errorMessage={errors.password?.message}
                  placeholder='Password'
                  autoComplete='new-password'
                />
              </div>

              {/* Confirm Password */}
              <div className='mb-6'>
                <Input
                  name='confirm_password'
                  register={register}
                  type='password'
                  className='w-full'
                  errorMessage={errors.confirm_password?.message}
                  placeholder='Confirm password'
                  autoComplete='new-password'
                />
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center'
                isLoading={registerAccountMutation.isPending}
                disabled={registerAccountMutation.isPending}
              >
                Create Account
              </Button>

              {/* Divider */}
              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>Already have an account?</span>
                </div>
              </div>

              {/* Login Link */}
              <Link
                to={path.login}
                className='block w-full text-center border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Sign In
              </Link>
            </form>

            {/* Terms */}
            <p className='text-xs text-gray-500 text-center mt-6'>
              By signing up, you agree to our{' '}
              <Link to='#' className='text-blue-600 hover:underline'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to='#' className='text-blue-600 hover:underline'>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
