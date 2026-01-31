import { Wrench, RefreshCw } from 'lucide-react'
import { hapticFeedback } from '@/services/telegram'

export function MaintenanceError() {
  return (
    <div className='h-svh tg-bg'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-3 px-6'>
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
        >
          <Wrench className="h-10 w-10" style={{ color: '#f59e0b' }} />
        </div>
        <h1 className='text-6xl font-bold tg-text'>503</h1>
        <span className='font-semibold text-lg tg-text'>Технические работы</span>
        <p className='text-center tg-hint-text text-sm'>
          Сайт временно недоступен.<br />
          Мы скоро вернёмся!
        </p>
        <div className='mt-6 flex gap-3 w-full max-w-xs'>
          <button
            onClick={() => {
              hapticFeedback('light')
              window.location.reload()
            }}
            className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
              color: 'var(--tg-theme-button-text-color, #ffffff)'
            }}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Обновить</span>
          </button>
        </div>
      </div>
    </div>
  )
}
