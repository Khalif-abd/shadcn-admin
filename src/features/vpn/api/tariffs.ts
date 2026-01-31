import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { TariffInfo, ApiResponse } from '../types'

// ==================== API Functions ====================

export async function getTariffs(): Promise<TariffInfo> {
  const response = await apiClient.get<ApiResponse<TariffInfo>>('/tariffs')
  return response.data.data
}

// ==================== Query Keys ====================

export const tariffKeys = {
  all: ['tariffs'] as const,
}

// ==================== Hooks ====================

export function useTariffs() {
  return useQuery({
    queryKey: tariffKeys.all,
    queryFn: getTariffs,
    staleTime: 1000 * 60 * 60, // 1 hour - tariffs don't change often
  })
}
