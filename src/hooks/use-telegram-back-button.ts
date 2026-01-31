import { useEffect, useCallback } from 'react'
import { useLocation, useRouter } from '@tanstack/react-router'
import { 
  showBackButton, 
  hideBackButton, 
  onBackButtonClick, 
  offBackButtonClick,
  hapticFeedback,
  isTelegramWebApp
} from '@/services/telegram'

/**
 * Хук для интеграции с Telegram BackButton
 * Автоматически показывает/скрывает кнопку назад в зависимости от навигации
 */
export function useTelegramBackButton() {
  const location = useLocation()
  const router = useRouter()

  // Пути, где кнопка "Назад" НЕ нужна (главные страницы с навигацией)
  const ROOT_PATHS = ['/', '/subscriptions', '/top-up', '/profile']
  
  const isRootPath = ROOT_PATHS.includes(location.pathname)

  const handleBackClick = useCallback(() => {
    hapticFeedback('light')
    router.history.back()
  }, [router])

  useEffect(() => {
    // Если не в Telegram Mini App - ничего не делаем
    if (!isTelegramWebApp()) {
      return
    }

    if (isRootPath) {
      // На главных страницах скрываем кнопку назад
      hideBackButton()
    } else {
      // На вложенных страницах показываем кнопку назад
      showBackButton()
      onBackButtonClick(handleBackClick)
    }

    // Cleanup: отписываемся от события при размонтировании
    return () => {
      offBackButtonClick(handleBackClick)
    }
  }, [location.pathname, isRootPath, handleBackClick])
}

/**
 * Хук для кастомного управления кнопкой назад
 * Используется когда нужно переопределить поведение по умолчанию
 */
export function useCustomBackButton(onBack: () => void, show = true) {
  useEffect(() => {
    if (!isTelegramWebApp()) {
      return
    }

    const handleBack = () => {
      hapticFeedback('light')
      onBack()
    }

    if (show) {
      showBackButton()
      onBackButtonClick(handleBack)
    } else {
      hideBackButton()
    }

    return () => {
      offBackButtonClick(handleBack)
      hideBackButton()
    }
  }, [onBack, show])
}
