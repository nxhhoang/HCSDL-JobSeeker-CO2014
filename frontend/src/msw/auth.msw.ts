import { http, HttpResponse } from 'msw'
import config from 'src/constants/config'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

// Mock data
const mockUsers = new Map()

// Mock tokens
const generateToken = () => 'Bearer ' + Math.random().toString(36).substring(2)

// ============ REGISTER ============
const registerHandler = http.post(`${config.baseUrl}register`, async ({ request }) => {
  const body = await request.json()
  console.log('📥 Mock Register received:', body)

  const { username, password, role } = body

  // Validation
  if (!username || !password || !role) {
    return HttpResponse.json(
      {
        message: 'Dữ liệu không hợp lệ',
        data: {
          username: !username ? 'Username là bắt buộc' : undefined,
          password: !password ? 'Password là bắt buộc' : undefined,
          role: !role ? 'Role là bắt buộc' : undefined
        },
        error: null
      },
      { status: HttpStatusCode.UnprocessableEntity }
    )
  }

  // Check duplicate username
  if (mockUsers.has(username)) {
    return HttpResponse.json(
      {
        message: 'Username đã tồn tại',
        data: {
          username: 'Username này đã được sử dụng'
        },
        error: null
      },
      { status: HttpStatusCode.UnprocessableEntity }
    )
  }

  // Create new user
  const newUser = {
    _id: `user_${Date.now()}`,
    username,
    email: `${username}@example.com`,
    name: username,
    roles: role === 'employer' ? ['Employer'] : ['User'],
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: 'default-avatar.png',
    isActive: true,
    __v: 0
  }

  // Save to mock database
  mockUsers.set(username, { ...newUser, password })

  // Generate tokens
  const access_token = generateToken()
  const refresh_token = generateToken()

  console.log('✅ Mock Register success:', newUser)

  return HttpResponse.json(
    {
      message: 'Đăng ký thành công',
      data: {
        access_token,
        refresh_token,
        expires: 604800,
        expires_refresh_token: 9316000,
        user: newUser
      },
      error: null
    },
    { status: HttpStatusCode.Ok }
  )
})

// ============ LOGIN ============
const loginHandler = http.post(`${config.baseUrl}login`, async ({ request }) => {
  const body = await request.json()
  console.log('📥 Mock Login received:', body)

  const { username, password } = body

  // Validation
  if (!username || !password) {
    return HttpResponse.json(
      {
        message: 'Dữ liệu không hợp lệ',
        data: {
          username: !username ? 'Username là bắt buộc' : undefined,
          password: !password ? 'Password là bắt buộc' : undefined
        },
        error: null
      },
      { status: HttpStatusCode.UnprocessableEntity }
    )
  }

  // Check user exists
  const user = mockUsers.get(username)
  if (!user) {
    return HttpResponse.json(
      {
        message: 'Username hoặc mật khẩu không đúng',
        data: {
          username: 'Tài khoản không tồn tại'
        },
        error: null
      },
      { status: HttpStatusCode.UnprocessableEntity }
    )
  }

  // Check password
  if (user.password !== password) {
    return HttpResponse.json(
      {
        message: 'Username hoặc mật khẩu không đúng',
        data: {
          password: 'Mật khẩu không chính xác'
        },
        error: null
      },
      { status: HttpStatusCode.UnprocessableEntity }
    )
  }

  // Generate tokens
  const access_token = generateToken()
  const refresh_token = generateToken()

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user

  console.log('✅ Mock Login success:', userWithoutPassword)

  return HttpResponse.json(
    {
      message: 'Đăng nhập thành công',
      data: {
        access_token,
        refresh_token,
        expires: 604800,
        expires_refresh_token: 9316000,
        user: userWithoutPassword
      },
      error: null
    },
    { status: HttpStatusCode.Ok }
  )
})

// ============ REFRESH TOKEN ============
const refreshTokenHandler = http.post(`${config.baseUrl}refresh-access-token`, () => {
  return HttpResponse.json(
    {
      message: 'Refresh Token thành công',
      data: {
        access_token: generateToken()
      },
      error: null
    },
    { status: HttpStatusCode.Ok }
  )
})

// ============ ME (Get Profile) ============
const meHandler = http.get(`${config.baseUrl}me`, ({ request }) => {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return HttpResponse.json(
      {
        message: 'Unauthorized',
        data: null,
        error: { code: 'UNAUTHORIZED' }
      },
      { status: HttpStatusCode.Unauthorized }
    )
  }

  // Return first user from mock database
  const firstUser = Array.from(mockUsers.values())[0]
  if (firstUser) {
    const { password: _, ...userWithoutPassword } = firstUser
    return HttpResponse.json(
      {
        message: 'Lấy thông tin người dùng thành công',
        data: userWithoutPassword,
        error: null
      },
      { status: HttpStatusCode.Ok }
    )
  }

  return HttpResponse.json(
    {
      message: 'Lấy thông tin người dùng thành công',
      data: {
        _id: 'default_user',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['User'],
        role: 'candidate',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatar: 'default-avatar.png'
      },
      error: null
    },
    { status: HttpStatusCode.Ok }
  )
})

// Export for test (keep old token format)
export const access_token_1s =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmY5MzVlNWZkYzVmMDM3ZTZmNjhkMyIsImVtYWlsIjoiZDNAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0xOVQxMzo1ODo0OC40ODlaIiwiaWF0IjoxNjcxNDU4MzI4LCJleHAiOjE2ODE0NTgzMjd9.00oi-93dF4Wz2Ngb6_G2dXO4VQXf2cRCft3W8DKgPdA'

export const refresh_token_1000days =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmY5MzVlNWZkYzVmMDM3ZTZmNjhkMyIsImVtYWlsIjoiZDNAZ21haWwuY29tIiwicm9zZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0xOVQwNzozMTowMC4yNTJaIiwiaWF0IjoxNjcxNDM1MDYwLCJleHAiOjE2ODA3NTEwNjB9.N_hVbB3JwlnJlM6K3qMRYyCGWDbYDUNiVABbaH1dw84'

export const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmY5MzVlNWZkYzVmMDM3ZTZmNjhkMyIsImVtYWlsIjoiZDNAZ21haWwuY29tIiwicm9zZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0xOVQwNzozMTowMC4yNTJaIiwiaWF0IjoxNjcxNDM1MDYwLCJleHAiOjE2NzIwMzk4NjB9.vTHglpuxad5h_CPpIaDCUpW0xJPYarJzLFeeul0W61E'

const authRequests = [registerHandler, loginHandler, refreshTokenHandler, meHandler]

export default authRequests
