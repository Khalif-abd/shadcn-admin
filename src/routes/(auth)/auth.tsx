import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/features/auth/auth-page'

export const Route = createFileRoute('/(auth)/auth')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || undefined,
    }
  },
  component: AuthPage,
})
