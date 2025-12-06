import { http, HttpResponse } from 'msw'
import config from 'src/constants/config'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

const meRes = {
  message: 'Lấy người dùng thành công',
  data: {
    _id: '636f935e5fdc5f037e6f68d3',
    roles: ['User'],
    username: 'testuser',
    email: 'test@gmail.com',
    createdAt: '2022-11-12T12:36:46.282Z',
    updatedAt: '2022-12-02T07:57:45.069Z',
    avatar: 'default-avatar.png',
    name: 'Test User',
    role: 'candidate'
  }
}

const meRequest = http.get(`${config.baseUrl}me`, ({ request }) => {
  const access_token = request.headers.get('authorization')

  if (!access_token) {
    return HttpResponse.json(
      {
        message: 'Lỗi',
        data: {
          message: 'Token không hợp lệ',
          name: 'UNAUTHORIZED'
        }
      },
      { status: HttpStatusCode.Unauthorized }
    )
  }

  return HttpResponse.json(meRes, { status: HttpStatusCode.Ok })
})

const userRequests = [meRequest]

export default userRequests
