import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type {
  SubscriptionDetail,
  SubscriptionsListResponse,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  ApiResponse,
} from '../types'

// ==================== API Functions ====================

export async function getSubscriptions(): Promise<SubscriptionsListResponse> {
  const response = await apiClient.get<SubscriptionsListResponse>('/subscriptions')
  return response.data
}

export async function getSubscription(id: number): Promise<SubscriptionDetail> {
  const response = await apiClient.get<ApiResponse<SubscriptionDetail>>(`/subscriptions/${id}`)
  return response.data.data
}

export async function createSubscription(data: CreateSubscriptionRequest): Promise<SubscriptionDetail> {
  const response = await apiClient.post<ApiResponse<SubscriptionDetail>>('/subscriptions', data)
  return response.data.data
}

export async function updateSubscription(id: number, data: UpdateSubscriptionRequest): Promise<SubscriptionDetail> {
  const response = await apiClient.patch<ApiResponse<SubscriptionDetail>>(`/subscriptions/${id}`, data)
  return response.data.data
}

export async function deleteSubscription(id: number): Promise<void> {
  await apiClient.delete(`/subscriptions/${id}`)
}

export async function toggleLte(subscriptionId: number, enable: boolean): Promise<{ lte_is_active: boolean }> {
  const response = await apiClient.post<ApiResponse<{ lte_is_active: boolean }>>(
    `/subscriptions/${subscriptionId}/lte/toggle`,
    { enable }
  )
  return response.data.data
}

// ==================== Query Keys ====================

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: () => [...subscriptionKeys.lists()] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: number) => [...subscriptionKeys.details(), id] as const,
}

// ==================== Hooks ====================

export function useSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: getSubscriptions,
  })
}

export function useSubscription(id: number) {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => getSubscription(id),
    enabled: id > 0,
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubscriptionRequest }) =>
      updateSubscription(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() })
    },
  })
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useToggleLte() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subscriptionId, enable }: { subscriptionId: number; enable: boolean }) =>
      toggleLte(subscriptionId, enable),
    onSuccess: (_, { subscriptionId }) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
