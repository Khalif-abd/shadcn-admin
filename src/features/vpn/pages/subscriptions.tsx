import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Loader2, Plus, Key, Smartphone, ChevronRight, AlertCircle } from 'lucide-react'
import { useProfile, useSubscriptions } from '../api'
import { AddSubscriptionDialog } from '../components/add-subscription-dialog'
import type { Subscription } from '../types'

function SubscriptionItem({ subscription }: { subscription: Subscription }) {
  return (
    <Link
      to="/subscriptions/$subscriptionId"
      params={{ subscriptionId: String(subscription.id) }}
      className="flex items-center gap-3 p-4 bg-component rounded-xl transition-all"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)' }}
      >
        <Key className="h-6 w-6 tg-button-text" />
      </div>
      <div className="flex-1 min-w-0">
        <div>
          <p className="font-semibold tg-text truncate">
            {subscription.display_name}
          </p>
          {subscription.lte_is_active && (
            <p className="text-sm" style={{ color: '#3dc08e' }}>
              + Антиглушилка
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm tg-hint-text mt-1">
          <span className="flex items-center gap-1">
            <Smartphone className="h-3.5 w-3.5" />
            {subscription.devices_count}/{subscription.devices_limit}
          </span>
          {subscription.is_active ? (
            <span style={{ color: '#3dc08e' }} className="font-medium">Активна</span>
          ) : (
            <span style={{ color: '#ef5b5b' }} className="font-medium">Неактивна</span>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 tg-hint-text" />
    </Link>
  )
}

export function SubscriptionsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useSubscriptions()

  const isLoading = profileLoading || subscriptionsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
      </div>
    )
  }

  const subscriptions = subscriptionsData?.data ?? []
  const canAdd = subscriptionsData?.meta.can_add ?? false
  const subscriptionsCount = profile?.subscriptions.count ?? 0
  const subscriptionsLimit = profile?.subscriptions.limit ?? 5

  return (
    <div className="flex flex-col max-w-3xl mx-auto">
      <main className="flex-1 px-4 pb-4 pt-4 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold tg-text text-center">Мои подписки</h1>
        </div>

        {/* Low balance warning */}
        {profile && profile.balance <= 0 && (
          <div 
            className="mb-4 p-4 rounded-xl"
            style={{ 
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}
          >
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <div>
                <p className="font-medium" style={{ color: '#fbbf24' }}>
                  Недостаточно средств
                </p>
                <p className="text-sm mt-1 tg-hint-text">
                  Пополните баланс для продолжения работы подписок
                </p>
                <Link to="/top-up">
                  <button 
                    className="mt-3 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: '#f59e0b', color: '#1a1a2e' }}
                  >
                    Пополнить баланс
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions list */}
        {subscriptions.length === 0 ? (
          <div className="bg-component p-8 text-center">
            <Key className="h-16 w-16 mx-auto mb-4 tg-hint-text opacity-30" />
            <h2 className="text-lg font-semibold tg-text mb-2">
              У вас пока нет подписок
            </h2>
            <p className="tg-hint-text mb-6">
              Создайте первую подписку, чтобы начать пользоваться VPN
            </p>
            <button
              onClick={() => setShowAddDialog(true)}
              className="rounded-xl px-6 py-3 font-medium flex items-center gap-2 mx-auto"
              style={{ 
                backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
                color: 'var(--tg-theme-button-text-color, #ffffff)'
              }}
            >
              <Plus className="h-4 w-4" />
              Создать подписку
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((subscription) => (
              <SubscriptionItem key={subscription.id} subscription={subscription} />
            ))}
          </div>
        )}

        {/* Add button or limit message */}
        {subscriptions.length > 0 && (
          <div className="mt-4">
            {canAdd ? (
              <button
                onClick={() => setShowAddDialog(true)}
                className="w-full rounded-xl px-4 py-3 font-medium flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
                  color: 'var(--tg-theme-button-text-color, #ffffff)'
                }}
              >
                <Plus className="h-4 w-4" />
                Добавить подписку
              </button>
            ) : (
              <p className="text-center text-sm tg-hint-text">
                Достигнут лимит подписок ({subscriptionsCount} из {subscriptionsLimit})
              </p>
            )}
          </div>
        )}

        {/* Info text */}
        {subscriptions.length > 0 && (
          <p className="text-center text-xs tg-hint-text mt-6">
            Каждая подписка поддерживает до 3 устройств одновременно
          </p>
        )}
      </main>

      <AddSubscriptionDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
