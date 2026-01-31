import { createFileRoute } from '@tanstack/react-router'
import { LtePage } from '@/features/vpn/pages/lte'

export const Route = createFileRoute('/_authenticated/subscriptions/$subscriptionId_/lte')({
  component: LtePage,
})
