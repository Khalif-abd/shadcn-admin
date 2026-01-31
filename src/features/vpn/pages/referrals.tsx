import { useState } from 'react'
import {
  Loader2,
  Users,
  Copy,
  Share2,
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useReferrals, useWithdrawReferral } from '../api'
import { hapticFeedback, getTelegramWebApp } from '@/services/telegram'

export function ReferralsPage() {
  const { data: referrals, isLoading } = useReferrals()
  const withdrawReferral = useWithdrawReferral()

  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState<'card' | 'usdt'>('card')
  const [withdrawDetails, setWithdrawDetails] = useState('')

  const handleCopy = async () => {
    if (referrals?.link) {
      try {
        await navigator.clipboard.writeText(referrals.link)
        hapticFeedback('success')
        
        const tg = getTelegramWebApp()
        if (tg?.showPopup) {
          tg.showPopup({
            title: 'Скопировано!',
            message: 'Реферальная ссылка скопирована',
            buttons: [{ type: 'ok' }]
          })
        } else {
          toast.success('Ссылка скопирована!')
        }
      } catch {
        toast.error('Не удалось скопировать')
      }
    }
  }

  const handleShare = async () => {
    hapticFeedback('light')
    if (referrals?.link && navigator.share) {
      try {
        await navigator.share({
          title: 'ChillGuy VPN',
          text: `Присоединяйся к ChillGuy VPN! Получай ${referrals.conditions.percent}% от каждого пополнения!`,
          url: referrals.link,
        })
      } catch {
        // User cancelled
      }
    } else {
      handleCopy()
    }
  }

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount, 10)
    if (!amount || amount < 5000 || !withdrawDetails.trim()) {
      hapticFeedback('error')
      toast.error('Заполните все поля корректно')
      return
    }

    hapticFeedback('medium')

    try {
      await withdrawReferral.mutateAsync({
        amount,
        method: withdrawMethod,
        details: withdrawDetails.trim(),
      })
      hapticFeedback('success')
      toast.success('Заявка на вывод создана')
      setShowWithdrawDialog(false)
      setWithdrawAmount('')
      setWithdrawDetails('')
    } catch (error: any) {
      hapticFeedback('error')
      toast.error(error.response?.data?.message || 'Не удалось создать заявку')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" style={{ color: '#3dc08e' }} />
      case 'rejected':
        return <XCircle className="h-4 w-4" style={{ color: '#ef5b5b' }} />
      default:
        return <Clock className="h-4 w-4" style={{ color: '#f59e0b' }} />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen tg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
      </div>
    )
  }

  if (!referrals) {
    return (
      <div className="min-h-screen tg-bg">
        <div className="flex items-center justify-center py-20">
          <p className="tg-hint-text">Не удалось загрузить данные</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen tg-bg flex flex-col">
      <main className="flex-1 px-4 pt-14 pb-4 max-w-md mx-auto w-full overflow-auto">
        <div className="space-y-4">
          {/* Stats Card */}
          <div 
            className="rounded-3xl overflow-hidden"
            style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)' }}
          >
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-white">Реферальная программа</h2>
                  <p className="text-sm text-white/70">
                    Получайте {referrals.conditions.percent}% от пополнений
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div 
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <p className="text-3xl font-bold text-white">{referrals.statistics.total_referrals}</p>
                  <p className="text-sm text-white/70">Приглашено</p>
                </div>
                <div 
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <p className="text-3xl font-bold text-white">
                    {referrals.statistics.total_earnings.toLocaleString('ru-RU')}₽
                  </p>
                  <p className="text-sm text-white/70">Заработано</p>
                </div>
              </div>

              <div 
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Доступно к выводу</span>
                  <span className="font-bold text-lg text-white">
                    {referrals.statistics.available_balance.toLocaleString('ru-RU')}₽
                  </span>
                </div>
                <button
                  className="w-full h-11 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: '#ffffff' }}
                  onClick={() => {
                    hapticFeedback('light')
                    setShowWithdrawDialog(true)
                  }}
                  disabled={!referrals.can_withdraw}
                >
                  <Wallet className="h-4 w-4" />
                  Запросить вывод
                </button>
                {!referrals.can_withdraw && referrals.statistics.available_balance < 5000 && (
                  <p className="text-xs text-center mt-2 text-white/60">
                    Минимальная сумма вывода: {referrals.conditions.min_withdrawal}₽
                  </p>
                )}
              </div>

              {/* Referral Link */}
              <div 
                className="rounded-xl p-3 mb-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <p className="text-xs mb-2 text-white/60">Ваша реферальная ссылка:</p>
                <code className="text-sm break-all text-white">{referrals.link}</code>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 h-11 rounded-xl font-medium flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: '#ffffff' }}
                >
                  <Share2 className="h-4 w-4" />
                  Отправить
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 h-11 rounded-xl font-medium flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff'
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Скопировать
                </button>
              </div>
            </div>
          </div>

          {/* Withdrawals History */}
          {referrals.withdrawals.length > 0 && (
            <div className="bg-component overflow-hidden">
              <div className="p-5">
                <h3 className="font-semibold tg-text mb-4">История выводов</h3>
                <div className="space-y-3">
                  {referrals.withdrawals.map((withdrawal, index) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center gap-3 py-2"
                      style={{ 
                        borderBottom: index < referrals.withdrawals.length - 1 
                          ? '1px solid rgba(255, 255, 255, 0.1)' 
                          : 'none' 
                      }}
                    >
                      {getStatusIcon(withdrawal.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium tg-text">
                            {withdrawal.amount.toLocaleString('ru-RU')}₽
                          </span>
                          <span className="text-sm tg-hint-text">
                            {withdrawal.status_label}
                          </span>
                        </div>
                        <p className="text-xs tg-hint-text">
                          {withdrawal.method_label} •{' '}
                          {format(new Date(withdrawal.created_at), 'dd.MM.yyyy', { locale: ru })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent
          className="border-0"
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
            color: 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          <DialogHeader>
            <DialogTitle className="tg-text">Запрос на вывод</DialogTitle>
            <DialogDescription className="tg-hint-text">
              Укажите сумму и реквизиты для вывода средств
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="tg-text">Сумма</Label>
              <Input
                type="number"
                placeholder="Минимум 5000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min={5000}
                max={referrals.statistics.available_balance}
                className="border-0"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--tg-theme-text-color, #ffffff)'
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="tg-text">Способ вывода</Label>
              <Select value={withdrawMethod} onValueChange={(v) => setWithdrawMethod(v as 'card' | 'usdt')}>
                <SelectTrigger 
                  className="border-0"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--tg-theme-text-color, #ffffff)'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{ 
                    backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <SelectItem value="card" className="tg-text">Банковская карта</SelectItem>
                  <SelectItem value="usdt" className="tg-text">USDT (TRC-20)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="tg-text">Реквизиты</Label>
              <Textarea
                placeholder={withdrawMethod === 'card' ? 'Номер карты' : 'Адрес кошелька USDT TRC-20'}
                value={withdrawDetails}
                onChange={(e) => setWithdrawDetails(e.target.value)}
                maxLength={500}
                className="border-0"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--tg-theme-text-color, #ffffff)'
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowWithdrawDialog(false)}
              className="btn-outline-tg"
            >
              Отмена
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={withdrawReferral.isPending}
              style={{ 
                backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
                color: 'var(--tg-theme-button-text-color, #ffffff)'
              }}
            >
              {withdrawReferral.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Отправить заявку'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
