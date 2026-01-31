import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import axios from 'axios'
import { LottieLogo } from '@/components/lottie-logo'
import { useAuthStore } from '@/stores/auth-store'
import { Loader2 } from 'lucide-react'
import { getInitData, isTelegramWebApp } from '@/services/telegram'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.chillguyvpn.com'
const MAX_AUTH_ATTEMPTS = 3
const RETRY_DELAY = 2000

type AuthStatus = 'idle' | 'authorizing' | 'authorized' | 'failed'

export function AuthPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/(auth)/auth' })
  const { setAccessToken, isAuthenticated } = useAuthStore((state) => state.auth)
  const [error, setError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle')
  const attemptsRef = useRef(0)

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate({ to: '/' })
      return
    }

    performAuth()
  }, [])

  const performAuth = async () => {
    // Приоритет 1: Токен из URL (для прямых ссылок)
    const token = (search as { token?: string }).token

    if (token) {
      await authorizeWithToken(token)
      return
    }

    // Приоритет 2: Telegram Mini App initData (только если в Telegram)
    if (isTelegramWebApp()) {
      const initData = getInitData()
      if (initData) {
        await authorizeWithInitData(initData)
        return
      }
      setError('Не удалось получить данные авторизации от Telegram.')
      setAuthStatus('failed')
      return
    }

    // Нет данных для авторизации (открыто в обычном браузере без токена)
    setError('Откройте приложение через Telegram или используйте ссылку с токеном.')
    setAuthStatus('failed')
  }

  // Авторизация через Telegram Mini App initData
  const authorizeWithInitData = async (initData: string) => {
    attemptsRef.current += 1
    setAuthStatus('authorizing')
    setError(null)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/telegram-webapp`,
        { tg_data: initData },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )

      const { access_token } = response.data

      if (access_token) {
        setAuthStatus('authorized')
        setAccessToken(access_token)
        navigate({ to: '/' })
      } else {
        throw new Error('No access token in response')
      }
    } catch (err: any) {
      console.error('[Auth] InitData auth error:', err)
      
      // Retry logic
      if (attemptsRef.current < MAX_AUTH_ATTEMPTS) {
        console.log(`[Auth] Retrying... attempt ${attemptsRef.current + 1}/${MAX_AUTH_ATTEMPTS}`)
        setTimeout(() => authorizeWithInitData(initData), RETRY_DELAY)
        return
      }

      setAuthStatus('failed')
      handleAuthError(err)
    }
  }

  // Авторизация через токен из URL (legacy)
  const authorizeWithToken = async (token: string) => {
    setAuthStatus('authorizing')
    setError(null)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/telegram`,
        { token },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )

      const { access_token } = response.data

      if (access_token) {
        setAuthStatus('authorized')
        setAccessToken(access_token)
        navigate({ to: '/' })
      } else {
        throw new Error('No access token in response')
      }
    } catch (err: any) {
      console.error('[Auth] Token auth error:', err)
      setAuthStatus('failed')
      handleAuthError(err)
    }
  }

  const handleAuthError = (err: any) => {
    if (err.response?.status === 401) {
      setError('Неверные данные авторизации. Попробуйте перезапустить приложение.')
    } else if (err.response?.status === 403) {
      setError(err.response?.data?.reason || 'Аккаунт заблокирован.')
    } else if (err.response?.status === 404) {
      setError('Пользователь не найден.')
    } else {
      setError('Ошибка авторизации. Попробуйте позже.')
    }
  }

  const handleRetry = () => {
    attemptsRef.current = 0
    setError(null)
    performAuth()
  }

  return (
    <div 
      className="min-h-screen tg-bg flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #18222d)' }}
    >
      <div className="bg-component p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-6">
          <LottieLogo size={120} variant="walk" />
        </div>

        <h1 className="text-2xl font-bold mb-2">
          <span style={{ color: 'var(--logo-chill-color, #7DD3C0)' }}>Chill</span>
          <span style={{ color: 'var(--logo-guy-color, #B8D4E3)' }}>Guy</span>
          <span className="tg-text">VPN</span>
        </h1>

        {authStatus === 'failed' && error ? (
          <div className="space-y-4">
            <p className="tg-hint-text">{error}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
                  color: 'var(--tg-theme-button-text-color, #ffffff)'
                }}
              >
                Попробовать снова
              </button>
              {!isTelegramWebApp() && (
                <a
                  href="https://t.me/chillguy_vpn_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-tg inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium tg-text"
                >
                  Открыть Telegram бота
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
            <p className="tg-hint-text">
              {authStatus === 'authorizing' ? 'Авторизация...' : 'Загрузка...'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
