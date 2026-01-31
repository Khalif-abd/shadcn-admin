import { createFileRoute } from '@tanstack/react-router'
import { TariffsPage } from '@/features/vpn/pages/tariffs'

export const Route = createFileRoute('/_authenticated/tariffs')({
  component: TariffsPage,
})
