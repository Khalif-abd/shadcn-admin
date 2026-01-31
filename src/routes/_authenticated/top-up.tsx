import { createFileRoute, redirect } from '@tanstack/react-router'
import { TopUpPage } from '@/features/vpn/pages/top-up'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/top-up')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState().auth
    if (!isAuthenticated()) {
      throw redirect({ to: '/auth', search: { token: undefined } })
    }
  },
  component: TopUpPage,
})
