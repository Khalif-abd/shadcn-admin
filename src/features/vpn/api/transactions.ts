import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Transaction, TransactionType, PaginatedResponse } from '../types'

// ==================== API Functions ====================

export async function getTransactions(
  page = 1,
  perPage = 20,
  type?: TransactionType
): Promise<PaginatedResponse<Transaction>> {
  const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions', {
    params: {
      page,
      per_page: perPage,
      ...(type && { type }),
    },
  })
  return response.data
}

// ==================== Query Keys ====================

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (page: number, perPage: number, type?: TransactionType) =>
    [...transactionKeys.lists(), { page, perPage, type }] as const,
  infinite: (perPage: number, type?: TransactionType) =>
    [...transactionKeys.lists(), 'infinite', { perPage, type }] as const,
}

// ==================== Hooks ====================

export function useTransactions(page = 1, perPage = 20, type?: TransactionType) {
  return useQuery({
    queryKey: transactionKeys.list(page, perPage, type),
    queryFn: () => getTransactions(page, perPage, type),
  })
}

/**
 * Infinite scroll hook for transactions
 */
export function useInfiniteTransactions(perPage = 20, type?: TransactionType) {
  return useInfiniteQuery({
    queryKey: transactionKeys.infinite(perPage, type),
    queryFn: ({ pageParam = 1 }) => getTransactions(pageParam, perPage, type),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Проверяем, есть ли ещё страницы
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1
      }
      return undefined
    },
  })
}
