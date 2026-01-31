import { Link } from '@tanstack/react-router'
import { Plus, ChevronRight, Key, Users, Gift, Calendar, Shield, AlertTriangle } from 'lucide-react'
import { hapticFeedback } from '@/services/telegram'

interface MainCardProps {
  balance: number
  daysLeft: number
  subscriptionsCount: number
  totalReferrals: number
  totalEarnings: number
  onCreateSubscription?: () => void
}

// Компонент информационной карточки
interface InfoCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  valueColor?: string
}

function InfoCard({ title, value, icon: Icon, valueColor }: InfoCardProps) {
  return (
    <div
      className="bg-component p-4 rounded-2xl flex flex-col items-center justify-center"
      style={{ minHeight: '100px' }}
    >
      <span className="text-sm tg-hint-text mb-2">{title}</span>
      <div className="flex items-center gap-2">
        <Icon className="h-6 w-6 tg-accent-text" />
        <span 
          className="text-2xl font-bold"
          style={{ color: valueColor || 'var(--tg-theme-text-color, #ffffff)' }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

export function MainCard({
  balance,
  daysLeft,
  subscriptionsCount,
  totalReferrals,
  totalEarnings,
  onCreateSubscription,
}: MainCardProps) {
  const isLowBalance = daysLeft <= 5
  const isZeroBalance = balance <= 0

  // Когда баланс нулевой или отрицательный - показываем только баланс и кнопку пополнения
  if (isZeroBalance) {
    return (
      <>
        <div className="bg-component p-6">
          <div className="text-center mb-6">
            <p className="tg-hint-text text-sm mb-1">Баланс</p>
            <p className="text-5xl font-bold" style={{ color: 'var(--tg-theme-destructive-text-color, #ef5b5b)' }}>
              {balance}
              <span className="text-3xl ml-1">₽</span>
            </p>
            <p className="text-sm tg-hint-text mt-3">
              Для продолжения работы пополните баланс
            </p>
          </div>

          <Link to="/top-up" className="block">
            <button className="gradient-btn w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Пополнить</span>
            </button>
          </Link>
        </div>
      </>
    )
  }

  // Онбординг для новых пользователей без подписок
  if (subscriptionsCount === 0) {
    return (
      <>
        {/* Balance Card */}
        <div className="bg-component p-6">
          <div className="text-center mb-4">
            <p className="tg-hint-text text-sm mb-1">Баланс</p>
            <p className="text-4xl font-bold tg-text">
              {balance.toLocaleString('ru-RU')}
              <span className="text-2xl ml-1 tg-hint-text">₽</span>
            </p>
          </div>
        </div>

        {/* Onboarding Card */}
        <div className="bg-component p-6 mt-4">
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(46, 166, 255, 0.15)' }}
            >
              <Key className="h-8 w-8 tg-accent-text" />
            </div>
            <h2 className="text-xl font-bold tg-text mb-2">
              Добро пожаловать!
            </h2>
            <p className="tg-hint-text text-sm mb-6">
              Создайте свою первую подписку,<br />
              чтобы начать пользоваться VPN
            </p>
            <button 
              className="w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
                color: 'var(--tg-theme-button-text-color, #ffffff)'
              }}
              onClick={() => {
                hapticFeedback('light')
                onCreateSubscription?.()
              }}
            >
              <Plus className="h-5 w-5" />
              <span>Создать подписку</span>
            </button>
          </div>
        </div>

        {/* Referral Cards Only */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <InfoCard
            title="Рефералов"
            value={totalReferrals}
            icon={Users}
          />
          <InfoCard
            title="Заработок"
            value={`+${totalEarnings.toLocaleString('ru-RU')}₽`}
            icon={Gift}
            valueColor="var(--tg-theme-accent-text-color, #2ea6ff)"
          />
        </div>
      </>
    )
  }

  return (
    <>
      {/* Balance Card */}
      <div className="bg-component p-6">
        <div className="text-center mb-4">
          <p className="tg-hint-text text-sm mb-1">Баланс</p>
          <p 
            className="text-4xl font-bold tg-text"
            style={{ color: isLowBalance ? '#f59e0b' : undefined }}
          >
            {balance.toLocaleString('ru-RU')}
            <span className="text-2xl ml-1 tg-hint-text">₽</span>
          </p>
        </div>

        {/* Кнопка пополнения - только при низком балансе */}
        {isLowBalance && (
          <div 
            className="mb-4 p-3 rounded-xl flex items-center gap-3"
            style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            <AlertTriangle className="h-5 w-5 flex-shrink-0" style={{ color: '#f59e0b' }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>
                Баланс заканчивается
              </p>
            </div>
            <Link to="/top-up" onClick={() => hapticFeedback('light')}>
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#f59e0b', color: '#1a1a2e' }}
              >
                Пополнить
              </button>
            </Link>
          </div>
        )}

        {/* VPN Connection Hint */}
        <Link 
          to="/subscriptions" 
          className="block"
          onClick={() => hapticFeedback('light')}
        >
          <button 
            className="w-full h-14 rounded-xl font-medium flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
              color: 'var(--tg-theme-button-text-color, #ffffff)'
            }}
          >
            <Shield className="h-5 w-5" />
            <span>Управление VPN</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </Link>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <InfoCard
          title="Подписок"
          value={subscriptionsCount}
          icon={Key}
        />
        <InfoCard
          title="Осталось дней"
          value={daysLeft}
          icon={Calendar}
          valueColor={isLowBalance ? '#f59e0b' : undefined}
        />
        <InfoCard
          title="Рефералов"
          value={totalReferrals}
          icon={Users}
        />
        <InfoCard
          title="Заработок"
          value={`+${totalEarnings.toLocaleString('ru-RU')}₽`}
          icon={Gift}
          valueColor="var(--tg-theme-accent-text-color, #2ea6ff)"
        />
      </div>
    </>
  )
}
