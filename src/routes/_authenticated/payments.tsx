import { createFileRoute } from '@tanstack/react-router'
import { PaymentsPage } from '@/features/vpn/pages/payments'

export const Route = createFileRoute('/_authenticated/payments')({
  component: PaymentsPage,
})
