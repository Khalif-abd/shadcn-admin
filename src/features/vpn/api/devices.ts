import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { DevicesListResponse } from '../types'
import { subscriptionKeys } from './subscriptions'

// ==================== API Functions ====================

export async function getDevices(subscriptionId: number): Promise<DevicesListResponse> {
  const response = await apiClient.get<DevicesListResponse>(
    `/subscriptions/${subscriptionId}/devices`
  )
  return response.data
}

export async function deleteDevice(subscriptionId: number, index: number): Promise<void> {
  await apiClient.delete(`/subscriptions/${subscriptionId}/devices/${index}`)
}

export async function deleteAllDevices(subscriptionId: number): Promise<void> {
  await apiClient.delete(`/subscriptions/${subscriptionId}/devices`)
}

// ==================== Query Keys ====================

export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: (subscriptionId: number) => [...deviceKeys.lists(), subscriptionId] as const,
}

// ==================== Hooks ====================

export function useDevices(subscriptionId: number) {
  return useQuery({
    queryKey: deviceKeys.list(subscriptionId),
    queryFn: () => getDevices(subscriptionId),
    enabled: subscriptionId > 0,
  })
}

export function useDeleteDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ subscriptionId, index }: { subscriptionId: number; index: number }) =>
      deleteDevice(subscriptionId, index),
    onSuccess: (_, { subscriptionId }) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.list(subscriptionId) })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) })
    },
  })
}

export function useDeleteAllDevices() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAllDevices,
    onSuccess: (_, subscriptionId) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.list(subscriptionId) })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) })
    },
  })
}
