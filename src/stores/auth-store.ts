import { create } from 'zustand'

const ACCESS_TOKEN_KEY = 'chillguy_vpn_token'

interface AuthState {
  auth: {
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    isAuthenticated: () => boolean
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // Читаем токен из localStorage (более стабильно в Telegram Mini App)
  const initToken = localStorage.getItem(ACCESS_TOKEN_KEY) || ''

  return {
    auth: {
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      isAuthenticated: () => !!get().auth.accessToken,
    },
  }
})
