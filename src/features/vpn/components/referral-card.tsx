import { Link } from '@tanstack/react-router'
import { Share2, Copy, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { hapticFeedback, getTelegramWebApp } from '@/services/telegram'

interface ReferralCardProps {
  link: string
  percent: number
  totalReferrals: number
  totalEarnings: number
}

export function ReferralCard({
  link,
  percent,
  totalReferrals,
  totalEarnings,
}: ReferralCardProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      hapticFeedback('success')
      
      const tg = getTelegramWebApp()
      if (tg?.showPopup) {
        tg.showPopup({
          title: 'Скопировано!',
          message: 'Реферальная ссылка скопирована в буфер обмена',
          buttons: [{ type: 'ok' }]
        })
      } else {
        toast.success('Ссылка скопирована!')
      }
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  const handleShare = async () => {
    hapticFeedback('light')
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ChillGuy VPN',
          text: `Присоединяйся к ChillGuy VPN! Получай ${percent}% от каждого пополнения!`,
          url: link,
        })
      } catch {
        // User cancelled
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="bg-component p-5">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">🤝💰</div>
        <h3 className="font-bold text-lg tg-text">Реферальная программа</h3>
        <p className="tg-hint-text">
          Получайте{' '}
          <span className="font-bold tg-accent-text">{percent}%</span>{' '}
          от пополнений друзей
        </p>
      </div>

      <p className="text-sm tg-hint-text text-center mb-4">
        Отправьте ссылку другу. Вы будете получать {percent}% от каждого его пополнения!
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 rounded-xl h-11 font-medium flex items-center justify-center gap-2"
          style={{ 
            background: 'var(--tg-theme-button-color, #2ea6ff)',
            color: 'var(--tg-theme-button-text-color, #ffffff)'
          }}
        >
          <Share2 className="h-4 w-4" />
          Отправить
        </button>
        <button
          onClick={handleCopy}
          className="btn-outline-tg flex-1 rounded-xl h-11 font-medium tg-text flex items-center justify-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Скопировать
        </button>
      </div>

      {/* Статистика - всегда отображается */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="flex justify-around text-center mb-3">
          <div>
            <p className="text-2xl font-bold tg-text">{totalReferrals}</p>
            <p className="text-xs tg-hint-text">Приглашено</p>
          </div>
          <div>
            <p className="text-2xl font-bold tg-accent-text">
              {totalEarnings.toLocaleString('ru-RU')}₽
            </p>
            <p className="text-xs tg-hint-text">Заработано</p>
          </div>
        </div>
        
        <Link to="/referrals" className="block">
          <button
            className="w-full h-9 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors tg-accent-text"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 166, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Подробнее
            <ChevronRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  )
}
