import { createFileRoute, redirect } from '@tanstack/react-router'
import { TransactionsPage } from '@/features/vpn/pages/transactions'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/transactions')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState().auth
    if (!isAuthenticated()) {
      throw redirect({ to: '/auth', search: { token: undefined } })
    }
  },
  component: TransactionsPage,
})
