import { screen, waitFor, fireEvent } from '@testing-library/react'
import path from 'src/constants/path'
import { renderWithRouter } from 'src/utils/testUtils'
import { beforeAll, describe, expect, it } from 'vitest'

describe('Login', () => {
  let usernameInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Username')).toBeInTheDocument()
    })
    usernameInput = document.querySelector('form input[type="text"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
  })
  
  it('Hiển thị lỗi required khi không nhập gì', async () => {
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(screen.queryByText('Username là bắt buộc')).toBeTruthy()
      expect(screen.queryByText('Password là bắt buộc')).toBeTruthy()
    })
  })
  
  it('Hiển thị lỗi khi nhập value input sai', async () => {
    fireEvent.change(usernameInput, {
      target: {
        value: 'us'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(screen.queryByText('Độ dài từ 3 - 160 ký tự')).toBeTruthy()
      expect(screen.queryByText('Độ dài từ 6 - 160 ký tự')).toBeTruthy()
    })
  })

  it('Không nên hiển thị lỗi khi nhập lại value đúng', async () => {
    fireEvent.change(usernameInput, {
      target: {
        value: 'testuser'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: 'useruser'
      }
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Độ dài từ 3 - 160 ký tự')).toBeFalsy()
      expect(screen.queryByText('Độ dài từ 6 - 160 ký tự')).toBeFalsy()
    })
    
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang chủ | Shopee Clone')
    })
  })
})
