import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/features/vpn/pages/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
})
