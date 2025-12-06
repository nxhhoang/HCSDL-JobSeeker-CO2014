import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import { Candidate } from 'src/types/candidate.type'
import { Employer } from 'src/types/employer.type'
import http from 'src/utils/http'

export interface UserResponse {
  _id: string
  username: string
  emailOrPhone: string
  userType: 'Candidate' | 'Employer'
  employerType?: 'Company' | 'Person'
  avatar?: string
  specificData: Candidate | Employer
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  username?: string
  avatar?: string
}

export interface UpdateProfileResponse {
  message: string
  data: UserResponse
}

const userApi = {
  /**
   * GET /api/v1/users/me
   * Lấy thông tin user hiện tại
   */
  getProfile() {
    return http.get<SuccessResponse<UserResponse>>('users/me')
  },

  /**
   * PUT /api/v1/users/me
   * Cập nhật thông tin user
   */
  updateProfile(body: UpdateProfileRequest) {
    return http.put<UpdateProfileResponse>('users/me', body)
  },

  /**
   * POST /api/v1/users/me/avatar
   * Upload avatar
   */
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponse<{ avatarUrl: string }>>('users/me/avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
