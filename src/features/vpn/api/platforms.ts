import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { PlatformsResponse, ApiResponse } from '../types'

/**
 * Получить список платформ с приложениями
 */
export async function getPlatforms(): Promise<PlatformsResponse> {
  const response = await apiClient.get<ApiResponse<PlatformsResponse>>('/platforms')
  return response.data.data
}

/**
 * Hook для получения платформ
 */
export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: getPlatforms,
    staleTime: 5 * 60 * 1000, // 5 минут кэширования
  })
}

/**
 * Получить URL для импорта подписки в приложение
 */
export function getImportUrl(template: string, subscriptionUrl: string): string {
  return template.replace('{$subscriptionUrl}', subscriptionUrl)
}
