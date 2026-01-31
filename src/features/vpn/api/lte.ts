import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { LteDetailInfo, PurchaseLteRequest, ApiResponse } from '../types'
import { subscriptionKeys } from './subscriptions'

// ==================== API Functions ====================

export async function getLteInfo(subscriptionId: number): Promise<LteDetailInfo> {
  const response = await apiClient.get<ApiResponse<LteDetailInfo>>(
    `/subscriptions/${subscriptionId}/lte`
  )
  return response.data.data
}

export async function purchaseLte(
  subscriptionId: number,
  data: PurchaseLteRequest
): Promise<{ message: string; balance: number }> {
  const response = await apiClient.post<{
    message: string
    data: { balance: number }
  }>(`/subscriptions/${subscriptionId}/lte/purchase`, data)
  return {
    message: response.data.message,
    balance: response.data.data.balance,
  }
}

// ==================== Query Keys ====================

export const lteKeys = {
  all: ['lte'] as const,
  details: () => [...lteKeys.all, 'detail'] as const,
  detail: (subscriptionId: number) => [...lteKeys.details(), subscriptionId] as const,
}

// ==================== Hooks ====================

export function useLteInfo(subscriptionId: number) {
  return useQuery({
    queryKey: lteKeys.detail(subscriptionId),
    queryFn: () => getLteInfo(subscriptionId),
    enabled: subscriptionId > 0,
  })
}

export function usePurchaseLte() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subscriptionId, data }: { subscriptionId: number; data: PurchaseLteRequest }) =>
      purchaseLte(subscriptionId, data),
    onSuccess: (_, { subscriptionId }) => {
      queryClient.invalidateQueries({ queryKey: lteKeys.detail(subscriptionId) })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
