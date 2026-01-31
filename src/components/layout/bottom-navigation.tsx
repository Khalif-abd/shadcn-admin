import { Link, useLocation } from '@tanstack/react-router'
import { Home, Key, CreditCard, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hapticFeedback } from '@/services/telegram'

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navigationItems: NavItem[] = [
  { path: '/', label: 'Главная', icon: Home },
  { path: '/subscriptions', label: 'Подписки', icon: Key },
  { path: '/top-up', label: 'Пополнить', icon: CreditCard },
  { path: '/referrals', label: 'Рефералы', icon: Users },
  { path: '/profile', label: 'Профиль', icon: User },
]

export function BottomNavigation() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleClick = () => {
    hapticFeedback('light')
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 tg-bottom-bar safe-area-bottom"
      style={{ 
        backgroundColor: 'var(--tg-theme-bottom-bar-bg-color, #213040)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleClick}
              className="flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-colors"
              style={{
                color: active 
                  ? 'var(--tg-theme-accent-text-color, #2ea6ff)' 
                  : 'var(--tg-theme-hint-color, #b1c3d5)'
              }}
            >
              <Icon 
                className={cn(
                  'h-6 w-6 mb-1 transition-transform',
                  active && 'scale-110'
                )} 
              />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
