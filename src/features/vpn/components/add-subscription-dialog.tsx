import { useState } from 'react'
import { Loader2, Key, Signal, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useCreateSubscription } from '../api'
import { useProfile } from '../api'
import { hapticFeedback } from '@/services/telegram'

interface AddSubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (subscriptionId: number) => void
}

export function AddSubscriptionDialog({ open, onOpenChange, onSuccess }: AddSubscriptionDialogProps) {
  const [withLte, setWithLte] = useState(false)
  const createSubscription = useCreateSubscription()
  const { data: profile } = useProfile()

  // Получаем цены из профиля
  const basePrice = profile?.tariff.price_per_month ?? 150
  const ltePrice = profile?.tariff.lte_price_per_month ?? 100
  const fullPrice = basePrice + ltePrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    hapticFeedback('medium')
    
    try {
      const result = await createSubscription.mutateAsync({ 
        with_lte: withLte
      })
      hapticFeedback('success')
      setWithLte(false)
      onOpenChange(false)
      onSuccess?.(result.id)
    } catch (error) {
      hapticFeedback('error')
      console.error('Failed to create subscription:', error)
    }
  }

  const handleClose = () => {
    if (!createSubscription.isPending) {
      setWithLte(false)
      onOpenChange(false)
    }
  }

  const handleTariffSelect = (selected: boolean) => {
    hapticFeedback('light')
    setWithLte(selected)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[400px] border-0"
        style={{ 
          backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
          color: 'var(--tg-theme-text-color, #ffffff)'
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(46, 166, 255, 0.15)' }}
            >
              <Key className="h-6 w-6 tg-accent-text" />
            </div>
            <div>
              <DialogTitle className="tg-text">Новая подписка</DialogTitle>
              <DialogDescription className="tg-hint-text">
                Выберите тариф и создайте подписку
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Выбор тарифа */}
            <div className="space-y-2">
              <Label className="tg-text">Выберите тариф</Label>
              
              {/* Базовый тариф */}
              <button
                type="button"
                onClick={() => handleTariffSelect(false)}
                className="w-full p-4 rounded-xl text-left transition-all"
                style={{
                  backgroundColor: !withLte 
                    ? 'rgba(46, 166, 255, 0.15)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: !withLte 
                    ? '2px solid var(--tg-theme-button-color, #2ea6ff)' 
                    : '2px solid transparent'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 tg-accent-text" />
                    <div>
                      <p className="font-medium tg-text">Базовая подписка</p>
                      <p className="text-sm tg-hint-text">VPN для всех устройств</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold tg-text">{basePrice} ₽/мес</span>
                    {!withLte && (
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)' }}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Тариф с LTE */}
              <button
                type="button"
                onClick={() => handleTariffSelect(true)}
                className="w-full p-4 rounded-xl text-left transition-all"
                style={{
                  backgroundColor: withLte 
                    ? 'rgba(61, 192, 142, 0.15)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: withLte 
                    ? '2px solid #3dc08e' 
                    : '2px solid transparent'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Signal className="h-5 w-5" style={{ color: '#3dc08e' }} />
                    <div>
                      <p className="font-medium tg-text">С LTE-антиглушилкой</p>
                      <p className="text-sm tg-hint-text">VPN + обход блокировок LTE</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="font-bold" style={{ color: '#3dc08e' }}>{fullPrice} ₽/мес</span>
                      <p className="text-xs tg-hint-text">{basePrice} + {ltePrice}</p>
                    </div>
                    {withLte && (
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#3dc08e' }}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>

            <div 
              className="rounded-lg p-3 text-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <p className="tg-hint-text">
                К одной подписке можно подключить до <span className="font-medium tg-text">3 устройств</span>.
                {!withLte && (
                  <span> LTE можно подключить позже.</span>
                )}
              </p>
              <p className="tg-hint-text mt-2">
                Оплата списывается <span className="font-medium tg-text">посуточно</span> (~{Math.round((withLte ? fullPrice : basePrice) / 30)} ₽/день).
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createSubscription.isPending}
              className="btn-outline-tg tg-text"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={createSubscription.isPending}
              style={{ 
                backgroundColor: withLte 
                  ? '#3dc08e' 
                  : 'var(--tg-theme-button-color, #2ea6ff)',
                color: '#ffffff'
              }}
            >
              {createSubscription.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание...
                </>
              ) : (
                'Создать'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
