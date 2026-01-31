import type { TelegramWebApp, TelegramWebAppInitData, TelegramWebAppUser } from '@/types/telegram'

/**
 * Telegram WebApp Service
 * Обертка для работы с Telegram Mini App API
 */

// Проверка, запущено ли приложение в Telegram
export function isTelegramWebApp(): boolean {
  return !!window.Telegram?.WebApp?.initData
}

// Получить объект Telegram WebApp
export function getTelegramWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null
}

// Инициализация Telegram WebApp
export function initTelegramWebApp(): void {
  const tg = getTelegramWebApp()
  
  if (tg) {
    // Сообщаем Telegram, что приложение готово
    tg.ready()
    
    // Разворачиваем на весь экран
    tg.expand()
    
    // Пробуем запросить полноэкранный режим (Bot API 8.0+)
    // Скрывает header Telegram на мобильных устройствах
    if (tg.isVersionAtLeast('8.0') && 'requestFullscreen' in tg) {
      try {
        (tg as any).requestFullscreen()
      } catch (e) {
        console.log('[Telegram] Fullscreen not available')
      }
    }
    
    // Включаем подтверждение при закрытии
    tg.enableClosingConfirmation()
    
    // Применяем тему Telegram
    applyTelegramTheme()
    
    // Применяем Safe Area insets
    applySafeAreaInsets()
    
    // Слушаем изменения Safe Area
    tg.onEvent('contentSafeAreaChanged', applySafeAreaInsets)
    tg.onEvent('safeAreaChanged', applySafeAreaInsets)
    
    console.log('[Telegram] WebApp initialized', {
      platform: tg.platform,
      version: tg.version,
      colorScheme: tg.colorScheme,
      safeAreaInset: tg.safeAreaInset,
      contentSafeAreaInset: tg.contentSafeAreaInset,
    })
  }
}

// Получить initData (raw string для отправки на сервер)
export function getInitData(): string | null {
  const tg = getTelegramWebApp()
  return tg?.initData || null
}

// Получить распарсенные данные initData
export function getInitDataUnsafe(): TelegramWebAppInitData | null {
  const tg = getTelegramWebApp()
  return tg?.initDataUnsafe || null
}

// Получить данные текущего пользователя
export function getTelegramUser(): TelegramWebAppUser | null {
  const initData = getInitDataUnsafe()
  return initData?.user || null
}

// Применение Safe Area Insets
export function applySafeAreaInsets(): void {
  const tg = getTelegramWebApp()
  
  if (!tg) return
  
  const root = document.documentElement
  
  // Content Safe Area (для UI Telegram: кнопки закрыть, назад и т.д.)
  if (tg.contentSafeAreaInset) {
    root.style.setProperty('--tg-content-safe-area-inset-top', `${tg.contentSafeAreaInset.top}px`)
    root.style.setProperty('--tg-content-safe-area-inset-bottom', `${tg.contentSafeAreaInset.bottom}px`)
    root.style.setProperty('--tg-content-safe-area-inset-left', `${tg.contentSafeAreaInset.left}px`)
    root.style.setProperty('--tg-content-safe-area-inset-right', `${tg.contentSafeAreaInset.right}px`)
  }
  
  // Device Safe Area (для notch, home indicator и т.д.)
  if (tg.safeAreaInset) {
    root.style.setProperty('--tg-safe-area-inset-top', `${tg.safeAreaInset.top}px`)
    root.style.setProperty('--tg-safe-area-inset-bottom', `${tg.safeAreaInset.bottom}px`)
    root.style.setProperty('--tg-safe-area-inset-left', `${tg.safeAreaInset.left}px`)
    root.style.setProperty('--tg-safe-area-inset-right', `${tg.safeAreaInset.right}px`)
  }
  
  console.log('[Telegram] Safe area insets applied', {
    contentSafeAreaInset: tg.contentSafeAreaInset,
    safeAreaInset: tg.safeAreaInset,
  })
}

// Применение темы Telegram
export function applyTelegramTheme(): void {
  const tg = getTelegramWebApp()
  
  if (!tg) return
  
  const { themeParams, colorScheme } = tg
  
  // Устанавливаем CSS переменные для темы
  const root = document.documentElement
  
  if (themeParams.bg_color) {
    root.style.setProperty('--tg-bg-color', themeParams.bg_color)
  }
  if (themeParams.text_color) {
    root.style.setProperty('--tg-text-color', themeParams.text_color)
  }
  if (themeParams.hint_color) {
    root.style.setProperty('--tg-hint-color', themeParams.hint_color)
  }
  if (themeParams.link_color) {
    root.style.setProperty('--tg-link-color', themeParams.link_color)
  }
  if (themeParams.button_color) {
    root.style.setProperty('--tg-button-color', themeParams.button_color)
  }
  if (themeParams.button_text_color) {
    root.style.setProperty('--tg-button-text-color', themeParams.button_text_color)
  }
  if (themeParams.secondary_bg_color) {
    root.style.setProperty('--tg-secondary-bg-color', themeParams.secondary_bg_color)
  }
  
  // Устанавливаем класс темы
  if (colorScheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Haptic feedback
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection'): void {
  const tg = getTelegramWebApp()
  
  if (!tg?.HapticFeedback) return
  
  switch (type) {
    case 'light':
    case 'medium':
    case 'heavy':
      tg.HapticFeedback.impactOccurred(type)
      break
    case 'success':
    case 'warning':
    case 'error':
      tg.HapticFeedback.notificationOccurred(type)
      break
    case 'selection':
      tg.HapticFeedback.selectionChanged()
      break
  }
}

// Показать popup
export function showPopup(
  message: string,
  title?: string,
  buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text?: string }>
): Promise<string> {
  return new Promise((resolve) => {
    const tg = getTelegramWebApp()
    
    if (!tg) {
      // Fallback для браузера
      alert(message)
      resolve('ok')
      return
    }
    
    tg.showPopup(
      {
        title,
        message,
        buttons: buttons || [{ type: 'ok' }],
      },
      (buttonId) => resolve(buttonId)
    )
  })
}

// Показать alert
export function showAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    const tg = getTelegramWebApp()
    
    if (!tg) {
      alert(message)
      resolve()
      return
    }
    
    tg.showAlert(message, () => resolve())
  })
}

// Показать confirm
export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const tg = getTelegramWebApp()
    
    if (!tg) {
      resolve(confirm(message))
      return
    }
    
    tg.showConfirm(message, (confirmed) => resolve(confirmed))
  })
}

// Открыть ссылку
export function openLink(url: string, tryInstantView = false): void {
  const tg = getTelegramWebApp()
  
  if (tg) {
    tg.openLink(url, { try_instant_view: tryInstantView })
  } else {
    window.open(url, '_blank')
  }
}

// Открыть Telegram ссылку
export function openTelegramLink(url: string): void {
  const tg = getTelegramWebApp()
  
  if (tg) {
    tg.openTelegramLink(url)
  } else {
    window.open(url, '_blank')
  }
}

// Закрыть Mini App
export function closeWebApp(): void {
  const tg = getTelegramWebApp()
  tg?.close()
}

// ==========================================
// BackButton API
// ==========================================

// Показать кнопку назад
export function showBackButton(): void {
  const tg = getTelegramWebApp()
  tg?.BackButton?.show()
}

// Скрыть кнопку назад
export function hideBackButton(): void {
  const tg = getTelegramWebApp()
  tg?.BackButton?.hide()
}

// Подписаться на клик по кнопке назад
export function onBackButtonClick(callback: () => void): void {
  const tg = getTelegramWebApp()
  tg?.BackButton?.onClick(callback)
}

// Отписаться от клика по кнопке назад
export function offBackButtonClick(callback: () => void): void {
  const tg = getTelegramWebApp()
  tg?.BackButton?.offClick(callback)
}

// Проверить, видна ли кнопка назад
export function isBackButtonVisible(): boolean {
  const tg = getTelegramWebApp()
  return tg?.BackButton?.isVisible ?? false
}

// ==========================================
// Mock данные для разработки вне Telegram
// ==========================================

const MOCK_USER: TelegramWebAppUser = {
  id: 123456789,
  first_name: 'Dev',
  last_name: 'User',
  username: 'devuser',
  language_code: 'ru',
  is_premium: false,
  allows_write_to_pm: true,
}

// Генерация mock initData для разработки
export function createMockInitData(): string {
  const authDate = Math.floor(Date.now() / 1000)
  const user = encodeURIComponent(JSON.stringify(MOCK_USER))
  const queryId = 'AAHdF6IQAAAAAN0XohDhrOrc'
  
  // В dev режиме hash не будет валидным, но это не важно
  // Backend должен быть настроен для пропуска валидации в dev
  const hash = 'mock_hash_for_development'
  
  return `query_id=${queryId}&user=${user}&auth_date=${authDate}&hash=${hash}`
}

// Получить initData с fallback на mock для разработки
export function getInitDataWithFallback(): string | null {
  const realInitData = getInitData()
  
  if (realInitData) {
    return realInitData
  }
  
  // В режиме разработки возвращаем mock
  if (import.meta.env.DEV) {
    console.log('[Telegram] Using mock initData for development')
    return createMockInitData()
  }
  
  return null
}
