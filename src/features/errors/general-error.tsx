import { useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import { hapticFeedback } from '@/services/telegram'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  const { history } = useRouter()
  
  return (
    <div className={cn('h-svh w-full tg-bg', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-3 px-6'>
        {!minimal && (
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
            style={{ backgroundColor: 'rgba(239, 91, 91, 0.15)' }}
          >
            <AlertTriangle className="h-10 w-10" style={{ color: '#ef5b5b' }} />
          </div>
        )}
        <h1 className='text-6xl font-bold tg-text'>500</h1>
        <span className='font-semibold text-lg tg-text'>Что-то пошло не так</span>
        <p className='text-center tg-hint-text text-sm'>
          Приносим извинения за неудобства.<br />
          Пожалуйста, попробуйте позже.
        </p>
        {!minimal && (
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
        )}
      </div>
    </div>
  )
}
