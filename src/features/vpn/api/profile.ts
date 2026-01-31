import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Profile, ApiResponse } from '../types'

// ==================== API Functions ====================

export async function getProfile(): Promise<Profile> {
  const response = await apiClient.get<ApiResponse<Profile>>('/me')
  return response.data.data
}

// ==================== Query Keys ====================

export const profileKeys = {
  all: ['profile'] as const,
}

// ==================== Hooks ====================

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: getProfile,
  })
}
