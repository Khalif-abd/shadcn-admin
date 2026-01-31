import { useState } from 'react'
import { Loader2, CreditCard, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { usePayments } from '../api'
import { hapticFeedback } from '@/services/telegram'

export function PaymentsPage() {
  const [page, setPage] = useState(1)
  const { data: paymentsData, isLoading } = usePayments(page, 20)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" style={{ color: '#3dc08e' }} />
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-5 w-5" style={{ color: '#ef5b5b' }} />
      default:
        return <Clock className="h-5 w-5" style={{ color: '#f59e0b' }} />
    }
  }

  return (
    <div className="min-h-screen tg-bg flex flex-col">
      <main className="flex-1 px-4 pt-14 pb-4 max-w-md mx-auto w-full overflow-auto">
        <h1 className="text-xl font-bold tg-text text-center mb-4">История платежей</h1>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
          </div>
        ) : !paymentsData?.data.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CreditCard className="h-16 w-16 tg-hint-text opacity-30 mb-4" />
            <p className="tg-hint-text">Нет платежей</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-component overflow-hidden">
              {paymentsData.data.map((payment, index) => (
                <div 
                  key={payment.id} 
                  className="p-4"
                  style={{ 
                    borderTop: index > 0 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none' 
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(payment.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg tg-text">
                          {payment.amount.toLocaleString('ru-RU')} ₽
                        </span>
                        <span className="text-sm tg-hint-text">
                          {payment.status_label}
                        </span>
                      </div>
                      <p className="text-sm tg-hint-text">
                        {payment.method_label}
                      </p>
                      <p className="text-xs tg-hint-text opacity-70 mt-1">
                        {format(new Date(payment.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                      </p>
                      {payment.payment_id && (
                        <p className="text-xs tg-hint-text opacity-70 font-mono mt-1">
                          ID: {payment.payment_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {paymentsData.meta.last_page > 1 && (
              <div className="flex items-center justify-between">
                <button
                  className="btn-outline-tg px-3 py-2 rounded-lg flex items-center gap-1 text-sm tg-text disabled:opacity-50"
                  onClick={() => {
                    hapticFeedback('light')
                    setPage(p => p - 1)
                  }}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Назад
                </button>
                <span className="text-sm tg-hint-text">
                  {page} из {paymentsData.meta.last_page}
                </span>
                <button
                  className="btn-outline-tg px-3 py-2 rounded-lg flex items-center gap-1 text-sm tg-text disabled:opacity-50"
                  onClick={() => {
                    hapticFeedback('light')
                    setPage(p => p + 1)
                  }}
                  disabled={page >= paymentsData.meta.last_page}
                >
                  Далее
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
