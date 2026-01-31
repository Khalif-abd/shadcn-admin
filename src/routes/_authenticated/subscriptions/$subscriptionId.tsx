import { createFileRoute } from '@tanstack/react-router'
import { SubscriptionDetailPage } from '@/features/vpn/pages/subscription-detail'

export const Route = createFileRoute('/_authenticated/subscriptions/$subscriptionId')({
  component: SubscriptionDetailPage,
})
