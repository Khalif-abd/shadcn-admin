import { useState } from 'react'
import { Loader2, Gift } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useProfile, useCreatePayment, useTariffs } from '../api'
import { toast } from 'sonner'
import { hapticFeedback } from '@/services/telegram'

const AMOUNTS = [150, 300, 500, 1000, 2000, 3000]
const MIN_AMOUNT = 150
const MAX_AMOUNT = 10000

export function TopUpPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(200)
  const [customAmount, setCustomAmount] = useState('')
  const { data: profile } = useProfile()
  const { data: tariffInfo } = useTariffs()
  const createPayment = useCreatePayment()

  const finalAmount = selectedAmount ?? (parseInt(customAmount) || 0)
  const isValidAmount = finalAmount >= MIN_AMOUNT && finalAmount <= MAX_AMOUNT

  // Находим применимый бонус для текущей суммы
  const applicableBonus = tariffInfo?.topup_bonuses
    .filter(b => finalAmount >= b.min_amount)
    .sort((a, b) => b.min_amount - a.min_amount)[0] || null

  const handlePresetClick = (amount: number) => {
    hapticFeedback('light')
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    // Только цифры
    const numericValue = value.replace(/\D/g, '')
    setCustomAmount(numericValue)
    setSelectedAmount(null)
  }

  const handlePay = async () => {
    if (!isValidAmount) {
      hapticFeedback('error')
      toast.error(`Сумма должна быть от ${MIN_AMOUNT} до ${MAX_AMOUNT} ₽`)
      return
    }

    hapticFeedback('medium')

    try {
      const payment = await createPayment.mutateAsync({
        amount: finalAmount,
        method: 'sbp',
      })

      // Redirect to payment URL
      if (payment.payment_url) {
        window.location.href = payment.payment_url
      } else {
        toast.error('Не удалось получить ссылку на оплату')
      }
    } catch (error: unknown) {
      hapticFeedback('error')
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Не удалось создать платёж')
    }
  }

  return (
    <div className="min-h-screen tg-bg flex flex-col">
      <div className="flex-1 px-4 pt-14 pb-4 max-w-md mx-auto w-full">
        <div className="space-y-4">
          <div className="text-center mb-2">
            <h1 className="text-xl font-bold tg-text">Пополнение баланса</h1>
            <p className="text-sm tg-hint-text">
              Зачисление средств может занять до 15 минут!
            </p>
          </div>

          {/* Текущий баланс */}
          <div className="bg-component p-4">
            <p className="tg-hint-text text-sm">Текущий баланс</p>
            <p className="text-3xl font-bold tg-accent-text">
              {profile?.balance?.toLocaleString('ru-RU') ?? 0}
              <span className="text-xl ml-1 tg-hint-text">₽</span>
            </p>
          </div>

          <div className="bg-component p-6">
            <div className="text-center mb-6">
              <p className="text-4xl font-bold tg-text">
                {finalAmount || 0}
                <span className="text-2xl ml-1 tg-hint-text">₽</span>
              </p>
            </div>

            <p className="text-sm tg-hint-text text-center mb-4">Выберите сумму</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  className="h-12 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: selectedAmount === amount 
                      ? 'var(--tg-theme-button-color, #2ea6ff)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: selectedAmount === amount 
                      ? 'var(--tg-theme-button-text-color, #ffffff)' 
                      : 'var(--tg-theme-text-color, #ffffff)',
                    border: selectedAmount === amount 
                      ? 'none' 
                      : '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                  onClick={() => handlePresetClick(amount)}
                >
                  {amount} ₽
                </button>
              ))}
            </div>

            <div className="relative">
              <p className="text-sm tg-hint-text text-center mb-2">или введите свою</p>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Введите сумму"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="h-12 rounded-xl text-center text-lg pr-8 border-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--tg-theme-text-color, #ffffff)',
                    boxShadow: selectedAmount === null && customAmount 
                      ? '0 0 0 2px var(--tg-theme-button-color, #2ea6ff)' 
                      : 'none'
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 tg-hint-text">
                  ₽
                </span>
              </div>
              <p className="text-xs tg-hint-text text-center mt-2">
                от {MIN_AMOUNT} до {MAX_AMOUNT} ₽
              </p>
            </div>
          </div>

          {/* Бонусы при пополнении */}
          {tariffInfo && tariffInfo.topup_bonuses.length > 0 && (
            <div className="bg-component p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="h-5 w-5" style={{ color: '#f59e0b' }} />
                <span className="font-semibold tg-text">Бонусы при пополнении</span>
              </div>
              <div className="space-y-2">
                {tariffInfo.topup_bonuses.map((bonus, i) => {
                  const isActive = finalAmount >= bonus.min_amount
                  const isCurrentBonus = applicableBonus?.min_amount === bonus.min_amount
                  return (
                    <div 
                      key={i}
                      className="flex items-center justify-between py-2 px-3 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: isCurrentBonus 
                          ? 'rgba(245, 158, 11, 0.15)' 
                          : 'transparent',
                        border: isCurrentBonus 
                          ? '1px solid rgba(245, 158, 11, 0.3)' 
                          : '1px solid transparent'
                      }}
                    >
                      <span 
                        className="text-sm"
                        style={{ 
                          color: isActive 
                            ? 'var(--tg-theme-text-color, #ffffff)' 
                            : 'var(--tg-theme-hint-color, #b1c3d5)'
                        }}
                      >
                        От {bonus.min_amount.toLocaleString('ru-RU')} ₽
                      </span>
                      <span 
                        className="font-semibold"
                        style={{ color: isActive ? '#f59e0b' : 'var(--tg-theme-hint-color, #b1c3d5)' }}
                      >
                        +{bonus.bonus} ₽
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={createPayment.isPending || !isValidAmount}
            className="gradient-btn w-full rounded-xl h-14 text-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createPayment.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Оплатить {finalAmount} ₽
                {applicableBonus && (
                  <span className="text-sm opacity-90">+{applicableBonus.bonus} ₽ бонус</span>
                )}
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}
