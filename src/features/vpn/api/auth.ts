import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse } from '../types'

interface DirectLinkResponse {
  token: string
  url: string
  expires_in: number
}

// Получить токен для прямой ссылки (авторизация вне Telegram)
export async function getDirectLink(): Promise<DirectLinkResponse> {
  const response = await apiClient.get<ApiResponse<DirectLinkResponse>>('/auth/direct-link')
  return response.data.data
}

// React Query hook для получения ссылки
export function useGetDirectLink() {
  return useMutation({
    mutationFn: getDirectLink,
  })
}
