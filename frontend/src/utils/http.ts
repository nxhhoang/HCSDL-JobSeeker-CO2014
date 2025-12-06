import axios, { AxiosError, type AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth'
import config from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN } from 'src/apis/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponse } from 'src/types/utils.type'

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null

    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor - tự động thêm access token
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          // Sử dụng Bearer token format chuẩn
          config.headers.authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - xử lý auth responses
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config

        // Xử lý login - lưu tokens và user info
        if (url === URL_LOGIN) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.accessToken // ✅ Lưu vào class
          this.refreshToken = data.data.refreshToken // ✅ Lưu vào class
          setAccessTokenToLS(this.accessToken) // ✅ Lưu vào localStorage
          setRefreshTokenToLS(this.refreshToken) // ✅ Lưu vào localStorage
          setProfileToLS(data.data.user) // ✅ Lưu user info
        }
        // Xử lý logout - xóa tokens
        else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }

        return response
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }

        // Xử lý lỗi 401 Unauthorized
        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config
          const { url } = config || {}

          // Nếu token hết hạn và không phải request refresh token
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            // Tránh gọi refresh token nhiều lần đồng thời
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refreshTokenRequest trong 10s
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })

            return this.refreshTokenRequest.then((access_token) => {
              // Retry request ban đầu với token mới
              if (config?.headers) {
                config.headers.authorization = `Bearer ${access_token}`
              }
              return this.instance(config as InternalAxiosRequestConfig)
            })
          }

          // Token không hợp lệ hoặc refresh token thất bại
          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data?.data?.message || error.response?.data?.message || 'Unauthorized')
        }

        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data
        setAccessTokenToLS(accessToken)
        setRefreshTokenToLS(refreshToken)
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        return accessToken
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance
export default http
