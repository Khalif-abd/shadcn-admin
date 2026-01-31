import { Loader2, Check, Gift, Package, Plus } from 'lucide-react'
import { useTariffs, useProfile } from '../api'

export function TariffsPage() {
  const { data: tariffInfo, isLoading } = useTariffs()
  const { data: profile } = useProfile()

  // Получаем цену LTE из профиля
  const ltePrice = profile?.tariff.lte_price_per_month ?? 100

  if (isLoading) {
    return (
      <div className="min-h-screen tg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
      </div>
    )
  }

  if (!tariffInfo) {
    return (
      <div className="min-h-screen tg-bg">
        <div className="flex items-center justify-center py-20">
          <p className="tg-hint-text">Не удалось загрузить тарифы</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen tg-bg flex flex-col">
      <main className="flex-1 px-4 pt-14 pb-4 max-w-md mx-auto w-full overflow-auto">
        <h1 className="text-xl font-bold tg-text text-center mb-4">Тарифы</h1>
        <div className="space-y-4">
          {/* Tariff Card */}
          {tariffInfo.tariffs.map((tariff) => (
            <div key={tariff.id} className="bg-component overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-xl tg-text">{tariff.name}</h2>
                    <p className="text-3xl font-bold tg-accent-text">
                      {tariff.price_per_month}₽
                      <span className="text-base font-normal tg-hint-text">/мес</span>
                    </p>
                  </div>
                  {tariff.is_default && (
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: 'rgba(46, 166, 255, 0.15)',
                        color: 'var(--tg-theme-accent-text-color, #2ea6ff)'
                      }}
                    >
                      Текущий
                    </span>
                  )}
                </div>

                <ul className="space-y-2">
                  {tariff.features
                    .filter(feature => !feature.toLowerCase().includes('lte'))
                    .map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm tg-text">
                        <Check className="h-4 w-4 shrink-0" style={{ color: '#3dc08e' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  {/* LTE как опция */}
                  <li className="flex items-start gap-2 text-sm tg-text">
                    <Plus className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                    <span>
                      LTE-антиглушилка
                      <span className="tg-hint-text"> — +{ltePrice} ₽/мес за подписку</span>
                    </span>
                  </li>
                </ul>

                <p 
                  className="text-xs mt-4 pt-3 tg-hint-text"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  Оплата списывается посуточно, а не сразу за весь месяц
                </p>
              </div>
            </div>
          ))}

          {/* Bonuses */}
          <div className="bg-component overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="h-5 w-5" style={{ color: '#f59e0b' }} />
                <h3 className="font-semibold tg-text">Бонусы при пополнении</h3>
              </div>
              <div className="space-y-2">
                {tariffInfo.topup_bonuses.map((bonus, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between py-2"
                    style={{ 
                      borderBottom: i < tariffInfo.topup_bonuses.length - 1 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : 'none' 
                    }}
                  >
                    <span className="text-sm tg-text">От {bonus.min_amount.toLocaleString('ru-RU')}₽</span>
                    <span className="font-semibold" style={{ color: '#f59e0b' }}>+{bonus.bonus}₽</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LTE Packages */}
          <div className="bg-component overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-5 w-5 tg-accent-text" />
                <h3 className="font-semibold tg-text">Пакеты LTE-трафика</h3>
              </div>
              <div className="space-y-2">
                {tariffInfo.lte_packages.map((pkg, i) => (
                  <div 
                    key={pkg.id} 
                    className="flex items-center justify-between py-2"
                    style={{ 
                      borderBottom: i < tariffInfo.lte_packages.length - 1 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : 'none' 
                    }}
                  >
                    <span className="text-sm tg-text">{pkg.size_gb} ГБ</span>
                    <span className="font-semibold tg-accent-text">{pkg.price}₽</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Info */}
          <div 
            className="rounded-3xl p-5 text-center"
            style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)' }}
          >
            <div className="text-3xl mb-2">🤝💰</div>
            <h3 className="font-bold text-lg text-white">Реферальная программа</h3>
            <p className="text-white/90">
              Получайте <span className="font-bold">{tariffInfo.referral_percent}%</span> от каждого пополнения приглашённых друзей
            </p>
            <p className="text-sm mt-2 text-white/70">
              Вывод от {tariffInfo.min_withdrawal.toLocaleString('ru-RU')}₽
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
