import { useRef, useEffect, useCallback, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { useInfiniteTransactions } from '../api'
import { TransactionList } from '../components/transaction-list'

export function TransactionsPage() {
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useInfiniteTransactions(20)

  // Ref для отслеживания скролла
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Собираем все транзакции из всех страниц
  const allTransactions = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap(page => page.data)
  }, [data?.pages])

  // Intersection Observer для бесконечного скролла
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [handleObserver])

  return (
    <div className="min-h-screen tg-bg flex flex-col">
      <div className="flex-1 px-4 pt-14 pb-4 max-w-md mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-xl font-bold tg-text text-center">
              История операций
            </h1>
            
            <TransactionList transactions={allTransactions} />
            
            {/* Триггер для загрузки следующей страницы */}
            <div ref={loadMoreRef} className="h-4" />
            
            {/* Индикатор загрузки следующей страницы */}
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin tg-accent-text" />
              </div>
            )}
            
            {/* Сообщение, если загружены все транзакции */}
            {!hasNextPage && allTransactions.length > 0 && (
              <p className="text-center text-sm tg-hint-text py-4">
                Все транзакции загружены
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
