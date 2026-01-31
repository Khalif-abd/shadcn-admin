import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Payment, CreatePaymentRequest, PaginatedResponse, ApiResponse } from '../types'

// ==================== API Functions ====================

export async function getPayments(page = 1, perPage = 20): Promise<PaginatedResponse<Payment>> {
  const response = await apiClient.get<PaginatedResponse<Payment>>('/payments', {
    params: { page, per_page: perPage },
  })
  return response.data
}

export async function getPayment(id: number): Promise<Payment> {
  const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`)
  return response.data.data
}

export async function createPayment(data: CreatePaymentRequest): Promise<Payment> {
  const response = await apiClient.post<ApiResponse<Payment>>('/payments', data)
  return response.data.data
}

// ==================== Query Keys ====================

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (page: number, perPage: number) => [...paymentKeys.lists(), { page, perPage }] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...paymentKeys.details(), id] as const,
}

// ==================== Hooks ====================

export function usePayments(page = 1, perPage = 20) {
  return useQuery({
    queryKey: paymentKeys.list(page, perPage),
    queryFn: () => getPayments(page, perPage),
  })
}

export function usePayment(id: number) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => getPayment(id),
    enabled: id > 0,
    refetchInterval: (query) => {
      // Poll every 3 seconds while payment is pending
      const data = query.state.data
      if (data?.status === 'pending') {
        return 3000
      }
      return false
    },
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() })
    },
  })
}
