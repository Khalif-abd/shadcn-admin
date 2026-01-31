import { useNavigate, useRouter } from '@tanstack/react-router'
import { ShieldX, ArrowLeft, Home } from 'lucide-react'
import { hapticFeedback } from '@/services/telegram'

export function ForbiddenError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  
  return (
    <div className='h-svh tg-bg'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-3 px-6'>
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: 'rgba(239, 91, 91, 0.15)' }}
        >
          <ShieldX className="h-10 w-10" style={{ color: '#ef5b5b' }} />
        </div>
        <h1 className='text-6xl font-bold tg-text'>403</h1>
        <span className='font-semibold text-lg tg-text'>Доступ запрещён</span>
        <p className='text-center tg-hint-text text-sm'>
          У вас нет необходимых прав<br />
          для просмотра этого ресурса.
        </p>
        <div className='mt-6 flex gap-3 w-full max-w-xs'>
          <button
            onClick={() => {
              hapticFeedback('light')
              history.go(-1)
            }}
            className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.08)', 
              border: '1px solid rgba(255, 255, 255, 0.15)' 
            }}
          >
            <ArrowLeft className="h-4 w-4 tg-text" />
            <span className="tg-text">Назад</span>
          </button>
          <button
            onClick={() => {
              hapticFeedback('light')
              navigate({ to: '/' })
            }}
            className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
              color: 'var(--tg-theme-button-text-color, #ffffff)'
            }}
          >
            <Home className="h-4 w-4" />
            <span>На главную</span>
          </button>
        </div>
      </div>
    </div>
  )
}
