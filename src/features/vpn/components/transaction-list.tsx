import { useState } from 'react'
import { format, isToday, isYesterday } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Plus, Minus, Gift, CreditCard, RefreshCw, Smartphone, Calendar, Wallet, ArrowRightLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { hapticFeedback } from '@/services/telegram'
import type { Transaction } from '../types'

interface TransactionListProps {
  transactions: Transaction[]
}

function getTransactionIcon(type: string) {
  switch (type) {
    case 'deposit':
      return <Plus className="h-4 w-4" />
    case 'withdrawal':
    case 'subscription':
      return <Minus className="h-4 w-4" />
    case 'referral_bonus':
      return <Gift className="h-4 w-4" />
    case 'refund':
      return <RefreshCw className="h-4 w-4" />
    case 'bonus':
      return <Gift className="h-4 w-4" />
    default:
      return <CreditCard className="h-4 w-4" />
  }
}

function getTransactionIconStyle(amount: number) {
  if (amount > 0) {
    return { backgroundColor: 'rgba(61, 192, 142, 0.15)', color: '#3dc08e' }
  }
  return { backgroundColor: 'rgba(46, 166, 255, 0.15)', color: '#2ea6ff' }
}

function getTransactionLabel(type: string, description: string) {
  if (description) return description

  switch (type) {
    case 'deposit':
      return 'Пополнение баланса'
    case 'withdrawal':
      return 'Списание'
    case 'subscription':
      return 'Добавлено устройство'
    case 'referral_bonus':
      return 'Реферальный бонус'
    case 'refund':
      return 'Возврат'
    case 'bonus':
      return 'Бонус'
    default:
      return 'Транзакция'
  }
}

function formatTransactionDate(dateStr: string) {
  const date = new Date(dateStr)
  if (isToday(date)) {
    return 'Сегодня'
  }
  if (isYesterday(date)) {
    return 'Вчера'
  }
  return format(date, 'd MMMM', { locale: ru })
}

function groupTransactionsByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {}

  transactions.forEach((tx) => {
    const dateKey = format(new Date(tx.created_at), 'yyyy-MM-dd')
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(tx)
  })

  return Object.entries(groups).map(([date, items]) => ({
    date,
    label: formatTransactionDate(items[0].created_at),
    transactions: items,
  }))
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return '#3dc08e'
    case 'pending':
      return '#f59e0b'
    case 'failed':
    case 'cancelled':
      return '#ef5b5b'
    default:
      return 'var(--tg-theme-hint-color)'
  }
}

// Transaction detail modal component
function TransactionDetailModal({ 
  transaction, 
  open, 
  onOpenChange 
}: { 
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-sm border-0"
        style={{ 
          backgroundColor: 'var(--tg-theme-bg-color, #18222d)',
          color: 'var(--tg-theme-text-color, #ffffff)'
        }}
      >
        <DialogHeader>
          <DialogTitle className="tg-text text-center">Детали операции</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Icon and Amount */}
          <div className="flex flex-col items-center py-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={getTransactionIconStyle(transaction.amount)}
            >
              {transaction.type === 'subscription' ? (
                <Smartphone className="h-7 w-7" />
              ) : (
                <div className="scale-150">
                  {getTransactionIcon(transaction.type)}
                </div>
              )}
            </div>
            <span
              className="text-3xl font-bold"
              style={{ color: transaction.amount > 0 ? '#3dc08e' : 'var(--tg-theme-text-color, #ffffff)' }}
            >
              {transaction.amount > 0 ? '+' : ''}
              {transaction.amount} ₽
            </span>
          </div>

          {/* Details */}
          <div 
            className="rounded-xl p-4 space-y-3"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            {/* Type */}
            <div className="flex items-center justify-between">
              <span className="tg-hint-text text-sm">Тип</span>
              <span className="tg-text font-medium">{transaction.type_label || getTransactionLabel(transaction.type, '')}</span>
            </div>

            {/* Description */}
            {transaction.description && (
              <div className="flex items-center justify-between">
                <span className="tg-hint-text text-sm">Описание</span>
                <span className="tg-text text-right max-w-[60%]">{transaction.description}</span>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="tg-hint-text text-sm">Статус</span>
              <span 
                className="font-medium"
                style={{ color: getStatusColor(transaction.status) }}
              >
                {transaction.status_label || transaction.status}
              </span>
            </div>

            {/* Payment method */}
            {transaction.payment_method && (
              <div className="flex items-center justify-between">
                <span className="tg-hint-text text-sm">Способ оплаты</span>
                <span className="tg-text">{transaction.payment_method}</span>
              </div>
            )}

            {/* Balance before/after */}
            {(transaction.balance_before !== null || transaction.balance_after !== null) && (
              <div 
                className="pt-3 mt-3 space-y-2"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="h-4 w-4 tg-hint-text" />
                  <span className="tg-hint-text">Изменение баланса</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="tg-text">
                    {transaction.balance_before !== null ? `${transaction.balance_before} ₽` : '—'}
                  </span>
                  <ArrowRightLeft className="h-4 w-4 tg-hint-text" />
                  <span className="tg-text font-semibold">
                    {transaction.balance_after !== null ? `${transaction.balance_after} ₽` : '—'}
                  </span>
                </div>
              </div>
            )}

            {/* Date and time */}
            <div 
              className="pt-3 mt-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 tg-hint-text" />
                <span className="tg-hint-text text-sm">Дата</span>
              </div>
              <span className="tg-text">
                {format(new Date(transaction.created_at), 'd MMMM yyyy, HH:mm', { locale: ru })}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📋</div>
        <p className="tg-hint-text">История транзакций пуста</p>
      </div>
    )
  }

  const groupedTransactions = groupTransactionsByDate(transactions)

  return (
    <>
      <div className="space-y-6">
        {groupedTransactions.map((group) => (
          <div key={group.date}>
            <p className="text-xs tg-hint-text uppercase tracking-wide mb-3 px-1">
              {group.label}
            </p>
            <div className="bg-component overflow-hidden">
              {group.transactions.map((tx, index) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    hapticFeedback('light')
                    setSelectedTransaction(tx)
                  }}
                  className="flex items-center gap-3 p-4 cursor-pointer transition-colors"
                  style={{
                    borderTop: index > 0 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={getTransactionIconStyle(tx.amount)}
                  >
                    {tx.type === 'subscription' ? (
                      <Smartphone className="h-4 w-4" />
                    ) : (
                      getTransactionIcon(tx.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium tg-text truncate">
                      {getTransactionLabel(tx.type, tx.description)}
                    </p>
                    <p className="text-sm tg-hint-text">
                      {format(new Date(tx.created_at), 'HH:mm')}
                    </p>
                  </div>
                  {tx.amount !== 0 && (
                    <span
                      className="font-semibold"
                      style={{ color: tx.amount > 0 ? '#3dc08e' : 'var(--tg-theme-text-color, #ffffff)' }}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount} ₽
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      />
    </>
  )
}
