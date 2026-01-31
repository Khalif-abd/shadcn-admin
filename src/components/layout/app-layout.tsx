import { useLocation } from '@tanstack/react-router'
import { BottomNavigation } from './bottom-navigation'
import { MusicToggle } from '../music-toggle'

interface AppLayoutProps {
  children: React.ReactNode
  hideBottomNav?: boolean
}

// Пути, на которых скрываем нижнюю навигацию
const HIDE_NAV_PATHS = [
  '/subscriptions/', // детали подписки
]

export function AppLayout({ children, hideBottomNav }: AppLayoutProps) {
  const location = useLocation()
  
  // Проверяем, нужно ли скрыть навигацию на текущей странице
  const shouldHideNav = hideBottomNav || HIDE_NAV_PATHS.some(path => 
    location.pathname.startsWith(path) && location.pathname !== path.replace('/', '')
  )

  // Комбинируем content safe area (Telegram UI) и device safe area (notch)
  // для корректного отступа от верха
  return (
    <div 
      className="min-h-screen tg-bg tg-text"
      style={{
        paddingTop: 'calc(var(--tg-content-safe-area-inset-top, 0px) + var(--tg-safe-area-inset-top, 0px))',
        paddingLeft: 'calc(var(--tg-content-safe-area-inset-left, 0px) + var(--tg-safe-area-inset-left, 0px))',
        paddingRight: 'calc(var(--tg-content-safe-area-inset-right, 0px) + var(--tg-safe-area-inset-right, 0px))',
      }}
    >
      <main className={shouldHideNav ? 'pb-4' : 'pb-20'}>
        {children}
      </main>
      {!shouldHideNav && <BottomNavigation />}
      <MusicToggle />
    </div>
  )
}
