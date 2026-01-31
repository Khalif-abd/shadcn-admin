import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Referral, WithdrawRequest, ApiResponse } from '../types'

// ==================== API Functions ====================

export async function getReferrals(): Promise<Referral> {
  const response = await apiClient.get<ApiResponse<Referral>>('/referrals')
  return response.data.data
}

export async function withdrawReferral(data: WithdrawRequest): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/referrals/withdraw', data)
  return response.data
}

// ==================== Query Keys ====================

export const referralKeys = {
  all: ['referrals'] as const,
}

// ==================== Hooks ====================

export function useReferrals() {
  return useQuery({
    queryKey: referralKeys.all,
    queryFn: getReferrals,
  })
}

export function useWithdrawReferral() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withdrawReferral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: referralKeys.all })
    },
  })
}
