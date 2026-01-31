import { Link } from '@tanstack/react-router'
import { 
  Loader2, 
  User, 
  CreditCard, 
  Receipt, 
  Users, 
  Gift,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  FileText,
  Calendar,
  ScrollText,
  Shield
} from 'lucide-react'
import { useProfile } from '../api'
import { getTelegramUser, openTelegramLink, hapticFeedback, openLink } from '@/services/telegram'

// Ссылки на юридические документы — ВСТАВЬТЕ СВОИ ССЫЛКИ
const LEGAL_URLS = {
  terms: 'https://docs.yandex.ru/docs/view?url=ya-disk-public%3A%2F%2FbWnWu2hUw6f0ydkkAzVj3HGSDlDKAtkYOgGpV1L717olB7T1SO7E8lHwpUEuJZhmq%2FJ6bpmRyOJonT3VoXnDag%3D%3D&name=%D0%9E%D1%84%D0%B5%D1%80%D1%82%D0%B0%20chillguy.docx',      // Лицензионное соглашение (оферта)
  privacy: 'https://docs.yandex.ru/docs/view?url=ya-disk-public%3A%2F%2FcBxShk3XcC7yrnLIMBzlTWnEjDtBCOIL6fABViDpl9uNH41Mp7IDJXgIsRM%2FcG6%2Bq%2FJ6bpmRyOJonT3VoXnDag%3D%3D&name=%D0%9F%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D1%85%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20chillguy.docx&nosw=1',  // Политика конфиденциальности
}

interface MenuItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description?: string
  to?: string
  onClick?: () => void
  external?: boolean
  destructive?: boolean
}

function MenuItem({ icon: Icon, label, description, to, onClick, external, destructive }: MenuItemProps) {
  const handleClick = () => {
    hapticFeedback('light')
    onClick?.()
  }

  const content = (
    <div 
      className="flex items-center gap-3 p-4 rounded-xl transition-colors cursor-pointer"
      style={{ backgroundColor: 'transparent' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      onClick={!to ? handleClick : undefined}
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: destructive 
            ? 'rgba(239, 91, 91, 0.15)' 
            : 'rgba(46, 166, 255, 0.15)',
          color: destructive 
            ? 'var(--tg-theme-destructive-text-color, #ef5b5b)' 
            : 'var(--tg-theme-accent-text-color, #2ea6ff)'
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p 
          className="font-medium"
          style={{ 
            color: destructive 
              ? 'var(--tg-theme-destructive-text-color, #ef5b5b)' 
              : 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          {label}
        </p>
        {description && (
          <p className="text-sm tg-hint-text truncate">{description}</p>
        )}
      </div>
      {external ? (
        <ExternalLink className="h-4 w-4 tg-hint-text" />
      ) : (
        <ChevronRight className="h-4 w-4 tg-hint-text" />
      )}
    </div>
  )

  if (to) {
    return <Link to={to} onClick={() => hapticFeedback('light')}>{content}</Link>
  }

  return content
}

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile()
  const telegramUser = getTelegramUser()

  const handleOpenSupport = () => {
    const telegramId = telegramUser?.id || profile?.telegram_id || ''
    const supportText = encodeURIComponent(`Здравствуйте, нужна помощь!\n\nTelegram ID: ${telegramId}`)
    openTelegramLink(`https://t.me/chillguy_support?text=${supportText}`)
  }

  const handleOpenChannel = () => {
    openTelegramLink('https://t.me/chillguyvpn')
  }

  const handleOpenTerms = () => {
    openLink(LEGAL_URLS.terms)
  }

  const handleOpenPrivacy = () => {
    openLink(LEGAL_URLS.privacy)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="tg-hint-text">Не удалось загрузить профиль</p>
      </div>
    )
  }

  const userName = telegramUser?.first_name || profile.name || 'Пользователь'

  return (
    <div className="flex flex-col max-w-3xl mx-auto">
      <main className="flex-1 px-4 pb-4 pt-4 max-w-md mx-auto w-full space-y-4">
        {/* User Card */}
        <div className="bg-component p-6">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)' }}
            >
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold tg-text">{userName}</h1>
              {(telegramUser?.username || profile.telegram_username) && (
                <p className="tg-hint-text">@{telegramUser?.username || profile.telegram_username}</p>
              )}
            </div>
          </div>

          {/* User Details */}
          <div 
            className="p-4 rounded-xl space-y-3"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm tg-hint-text">Telegram ID</span>
              <span className="font-medium tg-text">{telegramUser?.id || profile.telegram_id}</span>
            </div>
            <div 
              className="border-t"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm tg-hint-text flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Зарегистрирован
              </span>
              <span className="font-medium tg-text">
                {new Date(profile.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Referral Card */}
        <div 
          className="p-4 rounded-3xl"
          style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Gift className="h-6 w-6 text-white" />
            <div>
              <p className="font-semibold text-white">Реферальная программа</p>
              <p className="text-sm text-white/80">Получайте {profile.referral.percent}% от пополнений друзей</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{profile.referral.earnings}₽</p>
              <p className="text-sm text-white/70">заработано</p>
            </div>
            <Link to="/referrals">
              <button 
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
              >
                Подробнее
              </button>
            </Link>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-component overflow-hidden">
          <MenuItem 
            icon={CreditCard} 
            label="Пополнить баланс" 
            to="/top-up" 
          />
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
          <MenuItem 
            icon={Receipt} 
            label="История транзакций" 
            to="/transactions" 
          />
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
          <MenuItem 
            icon={FileText} 
            label="Тарифы" 
            to="/tariffs" 
          />
        </div>

        {/* Support */}
        <div className="bg-component overflow-hidden">
          <MenuItem 
            icon={HelpCircle} 
            label="Поддержка" 
            description="Напишите нам в Telegram"
            onClick={handleOpenSupport}
            external
          />
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
          <MenuItem 
            icon={Users} 
            label="Наш канал" 
            description="Новости и обновления"
            onClick={handleOpenChannel}
            external
          />
        </div>

        {/* Legal */}
        <div className="bg-component overflow-hidden">
          <MenuItem 
            icon={ScrollText} 
            label="Лицензионное соглашение" 
            onClick={handleOpenTerms}
            external
          />
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
          <MenuItem 
            icon={Shield} 
            label="Политика конфиденциальности" 
            onClick={handleOpenPrivacy}
            external
          />
        </div>

        <p className="text-center text-xs tg-hint-text py-4">
          ChillGuy VPN v1.0.0
        </p>
      </main>
    </div>
  )
}
