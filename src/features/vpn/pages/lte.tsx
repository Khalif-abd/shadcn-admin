import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Loader2, Signal, Package, RefreshCw, Power } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useProfile, useLteInfo, usePurchaseLte, useToggleLte } from '../api'
import { hapticFeedback } from '@/services/telegram'

interface LtePackage {
  id: number
  size_gb: number
  price: number
}

export function LtePage() {
  const { subscriptionId } = useParams({ from: '/_authenticated/subscriptions/$subscriptionId_/lte' })
  const navigate = useNavigate()
  const id = parseInt(subscriptionId, 10)

  const { data: profile } = useProfile()
  const { data: lte, isLoading } = useLteInfo(id)
  const purchaseLte = usePurchaseLte()
  const toggleLte = useToggleLte()

  const [selectedPackage, setSelectedPackage] = useState<LtePackage | null>(null)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)

  const handlePackageClick = (pkg: LtePackage) => {
    hapticFeedback('light')
    setSelectedPackage(pkg)
    setShowPurchaseDialog(true)
  }

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return
    
    try {
      const result = await purchaseLte.mutateAsync({ subscriptionId: id, data: { package_id: selectedPackage.id } })
      hapticFeedback('success')
      toast.success(result.message)
      setShowPurchaseDialog(false)
      setSelectedPackage(null)
    } catch (error: any) {
      hapticFeedback('error')
      toast.error(error.response?.data?.message || 'Не удалось приобрести пакет')
    }
  }

  const handleDisableLte = async () => {
    try {
      await toggleLte.mutateAsync({ subscriptionId: id, enable: false })
      hapticFeedback('success')
      toast.success('LTE-антиглушилка отключена')
      setShowDisableDialog(false)
      navigate({ to: '/subscriptions/$subscriptionId', params: { subscriptionId: String(id) } })
    } catch {
      hapticFeedback('error')
      toast.error('Не удалось отключить LTE')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen tg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
      </div>
    )
  }

  if (!lte) {
    return (
      <div className="min-h-screen tg-bg">
        <div className="flex items-center justify-center py-20">
          <p className="tg-hint-text">LTE недоступна для этой подписки</p>
        </div>
      </div>
    )
  }

  const usedPercent = lte.traffic.limit_bytes > 0 
    ? (lte.traffic.used_bytes / lte.traffic.limit_bytes) * 100 
    : 0

  return (
    <div className="min-h-screen tg-bg flex flex-col">
      <main className="flex-1 px-4 pt-14 pb-4 max-w-md mx-auto w-full overflow-auto">
        <div className="space-y-4">
          {/* Info Card */}
          <div className="bg-component overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(46, 166, 255, 0.15)' }}
                >
                  <Signal className="h-7 w-7 tg-accent-text" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg tg-text">LTE-Антиглушилка</h2>
                  <p className="text-sm tg-hint-text">
                    Работает даже когда глушат связь
                  </p>
                </div>
              </div>

              <div 
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <p className="text-sm tg-hint-text">
                  💡 Используйте антиглушилку только при проблемах со связью.
                  В обычное время лучше обычный конфиг — он без лимитов.
                </p>
              </div>

              {/* Traffic Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm tg-hint-text">Использовано</span>
                  <span className="font-medium tg-text">
                    {lte.traffic.used_gb} / {lte.traffic.limit_gb} ГБ
                  </span>
                </div>
                <Progress 
                  value={usedPercent} 
                  className="h-3"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </div>

              <div className="flex items-center gap-2 text-sm tg-hint-text">
                <RefreshCw className="h-4 w-4" />
                <span>Сброс: {lte.reset_day}-го числа каждого месяца</span>
              </div>
              <p className="text-sm tg-hint-text mt-1">
                📦 Пакеты трафика переносятся на следующий месяц
              </p>
            </div>
          </div>

          {/* Packages Card */}
          <div className="bg-component overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-5 w-5 tg-accent-text" />
                <h3 className="font-semibold tg-text">Купить пакет трафика</h3>
              </div>

              <div className="space-y-2">
                {lte.packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    className="btn-outline-tg w-full h-14 rounded-xl flex items-center justify-between px-4 disabled:opacity-50"
                    onClick={() => handlePackageClick(pkg)}
                    disabled={purchaseLte.isPending || (profile?.balance ?? 0) < pkg.price}
                  >
                    <span className="font-medium tg-text">{pkg.size_gb} ГБ</span>
                    <span className="font-semibold tg-accent-text">{pkg.price} ₽</span>
                  </button>
                ))}
              </div>

              {profile && profile.balance < Math.min(...lte.packages.map(p => p.price)) && (
                <p className="text-sm mt-3 text-center" style={{ color: '#f59e0b' }}>
                  Недостаточно средств на балансе
                </p>
              )}
            </div>
          </div>

          {/* Disable LTE Card */}
          <div className="bg-component overflow-hidden">
            <div className="p-5">
              <button
                className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: 'rgba(239, 91, 91, 0.15)',
                  color: 'var(--tg-theme-destructive-text-color, #ef5b5b)'
                }}
                onClick={() => {
                  hapticFeedback('warning')
                  setShowDisableDialog(true)
                }}
              >
                <Power className="h-4 w-4" />
                Отключить LTE-антиглушилку
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Purchase Confirmation Dialog */}
      <AlertDialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <AlertDialogContent
          className="border-0"
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
            color: 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="tg-text">
              Купить пакет трафика?
            </AlertDialogTitle>
            <AlertDialogDescription className="tg-hint-text">
              {selectedPackage && (
                <>Вы покупаете {selectedPackage.size_gb} ГБ за {selectedPackage.price} ₽. Средства будут списаны с баланса.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-outline-tg tg-text">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPurchase}
              style={{ 
                backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
                color: '#ffffff'
              }}
            >
              {purchaseLte.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Купить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disable LTE Dialog */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent
          className="border-0"
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
            color: 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="tg-text">
              Отключить LTE-антиглушилку?
            </AlertDialogTitle>
            <AlertDialogDescription className="tg-hint-text">
              LTE-антиглушилка будет отключена. Вы перестанете платить за неё со следующего дня.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-outline-tg tg-text">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisableLte}
              style={{ 
                backgroundColor: 'var(--tg-theme-destructive-text-color, #ef5b5b)',
                color: '#ffffff'
              }}
            >
              {toggleLte.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Отключить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
