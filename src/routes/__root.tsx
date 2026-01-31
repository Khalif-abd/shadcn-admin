import { useEffect } from 'react'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { initTelegramWebApp, getTelegramWebApp, applyTelegramTheme } from '@/services/telegram'
import { useTelegramBackButton } from '@/hooks/use-telegram-back-button'

// Компонент инициализации Telegram
function TelegramInit() {
  useEffect(() => {
    // Инициализируем Telegram WebApp
    initTelegramWebApp()

    // Подписываемся на изменение темы
    const tg = getTelegramWebApp()
    
    if (tg) {
      const handleThemeChange = () => {
        applyTelegramTheme()
      }
      
      tg.onEvent('themeChanged', handleThemeChange)
      
      return () => {
        tg.offEvent('themeChanged', handleThemeChange)
      }
    }
  }, [])

  return null
}

// Компонент управления кнопкой назад
function TelegramBackButtonManager() {
  useTelegramBackButton()
  return null
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <TelegramInit />
        <TelegramBackButtonManager />
        <Outlet />
        <Toaster duration={5000} />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
