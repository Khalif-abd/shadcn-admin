import { useState } from 'react'
import { useParams, Link, useNavigate } from '@tanstack/react-router'
import {
  Loader2,
  Key,
  Smartphone,
  Copy,
  Trash2,
  Pencil,
  Signal,
  ChevronRight,
  RefreshCw,
  Download,
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { useProfile, useSubscription, useUpdateSubscription, useDeleteSubscription, useDeleteDevice, useDeleteAllDevices, useToggleLte } from '../api'
import { hapticFeedback, getTelegramWebApp } from '@/services/telegram'
import { formatBytes } from '@/lib/utils'
import { ConnectModal } from '../components/connect-modal'

export function SubscriptionDetailPage() {
  const { subscriptionId } = useParams({ from: '/_authenticated/subscriptions/$subscriptionId' })
  const navigate = useNavigate()
  const id = parseInt(subscriptionId, 10)

  const { data: profile } = useProfile()
  const { data: subscription, isLoading } = useSubscription(id)
  const updateSubscription = useUpdateSubscription()
  const deleteSubscription = useDeleteSubscription()
  const deleteDevice = useDeleteDevice()
  const deleteAllDevices = useDeleteAllDevices()
  const toggleLte = useToggleLte()

  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteDeviceDialog, setShowDeleteDeviceDialog] = useState<number | null>(null)
  const [showClearDevicesDialog, setShowClearDevicesDialog] = useState(false)
  const [showLteToggleDialog, setShowLteToggleDialog] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [newName, setNewName] = useState('')

  // Получаем цену LTE из профиля
  const ltePrice = profile?.tariff.lte_price_per_month ?? 100

  const handleCopyUrl = async () => {
    if (subscription?.subscription_url) {
      try {
        await navigator.clipboard.writeText(subscription.subscription_url)
        hapticFeedback('success')
        
        const tg = getTelegramWebApp()
        if (tg?.showPopup) {
          tg.showPopup({
            title: 'Скопировано!',
            message: 'Ссылка для подключения скопирована',
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

  const handleRename = async () => {
    if (!newName.trim()) return
    
    try {
      await updateSubscription.mutateAsync({ id, data: { name: newName.trim() } })
      hapticFeedback('success')
      toast.success('Название обновлено')
      setShowRenameDialog(false)
      setNewName('')
    } catch {
      toast.error('Не удалось обновить название')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSubscription.mutateAsync(id)
      hapticFeedback('success')
      toast.success('Подписка удалена')
      navigate({ to: '/' })
    } catch {
      toast.error('Не удалось удалить подписку')
    }
  }

  const handleDeleteDevice = async (index: number) => {
    try {
      await deleteDevice.mutateAsync({ subscriptionId: id, index })
      hapticFeedback('success')
      toast.success('Устройство удалено')
      setShowDeleteDeviceDialog(null)
    } catch {
      toast.error('Не удалось удалить устройство')
    }
  }

  const handleClearAllDevices = async () => {
    try {
      await deleteAllDevices.mutateAsync(id)
      hapticFeedback('success')
      toast.success('Все устройства удалены')
      setShowClearDevicesDialog(false)
    } catch {
      toast.error('Не удалось удалить устройства')
    }
  }

  const handleToggleLte = async (enable: boolean) => {
    try {
      await toggleLte.mutateAsync({ subscriptionId: id, enable })
      hapticFeedback('success')
      toast.success(enable ? 'LTE-антиглушилка подключена' : 'LTE-антиглушилка отключена')
      setShowLteToggleDialog(false)
    } catch {
      hapticFeedback('error')
      toast.error('Не удалось изменить статус LTE')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen tg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen tg-bg">
        <div className="flex items-center justify-center py-20">
          <p className="tg-hint-text">Подписка не найдена</p>
        </div>
      </div>
    )
  }

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
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <Key className="h-7 w-7" style={{ color: '#18222d' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg tg-text">{subscription.display_name}</h2>
                    <button
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                      onClick={() => {
                        hapticFeedback('light')
                        setNewName(subscription.name || '')
                        setShowRenameDialog(true)
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Pencil className="h-4 w-4 tg-hint-text" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm tg-hint-text">
                    <span>Осталось: {subscription.days_left} дн.</span>
                    {subscription.is_active ? (
                      <span style={{ color: '#3dc08e' }}>• Активна</span>
                    ) : (
                      <span style={{ color: '#ef5b5b' }}>• Неактивна</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Subscription URL */}
              <div 
                className="rounded-xl p-3 mb-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <p className="text-xs tg-hint-text mb-2">Ссылка для подключения:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm break-all tg-text font-mono">
                    {subscription.subscription_url}
                  </code>
                  <button
                    className="p-2 rounded-lg shrink-0 transition-colors"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={handleCopyUrl}
                  >
                    <Copy className="h-4 w-4 tg-hint-text" />
                  </button>
                </div>
              </div>

              {/* Подключить устройства */}
              <button
                className="w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4"
                style={{ 
                  backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
                  color: 'var(--tg-theme-button-text-color, #ffffff)'
                }}
                onClick={() => {
                  hapticFeedback('light')
                  setShowConnectModal(true)
                }}
              >
                <Download className="h-5 w-5" />
                Подключить устройства
              </button>

              {/* LTE Section */}
              {subscription.lte_is_active ? (
                // LTE активна - показываем кнопку перехода в настройки
                <Link
                  to="/subscriptions/$subscriptionId/lte"
                  params={{ subscriptionId: String(subscription.id) }}
                  className="block mb-4"
                  onClick={() => hapticFeedback('light')}
                >
                  <button
                    className="w-full h-12 rounded-xl flex items-center justify-between px-4"
                    style={{ 
                      backgroundColor: 'rgba(61, 192, 142, 0.15)',
                      border: '1px solid #3dc08e'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Signal className="h-5 w-5" style={{ color: '#3dc08e' }} />
                      <span className="tg-text">LTE-антиглушилка</span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#3dc08e', color: '#ffffff' }}
                      >
                        Активна
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 tg-hint-text" />
                  </button>
                </Link>
              ) : subscription.lte_available ? (
                // LTE доступна для подключения
                <button
                  className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 mb-4"
                  style={{ 
                    backgroundColor: 'rgba(46, 166, 255, 0.15)',
                    color: 'var(--tg-theme-button-color, #2ea6ff)',
                    border: '1px solid rgba(46, 166, 255, 0.3)'
                  }}
                  onClick={() => {
                    hapticFeedback('light')
                    setShowLteToggleDialog(true)
                  }}
                >
                  <Signal className="h-5 w-5" />
                  Подключить LTE (+{ltePrice} ₽/мес)
                </button>
              ) : subscription.lte ? (
                // LTE была подключена ранее, но сейчас отключена
                <button
                  className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 mb-4"
                  style={{ 
                    backgroundColor: 'rgba(46, 166, 255, 0.1)',
                    color: 'var(--tg-theme-button-color, #2ea6ff)',
                    border: '1px solid rgba(46, 166, 255, 0.2)'
                  }}
                  onClick={() => {
                    hapticFeedback('light')
                    setShowLteToggleDialog(true)
                  }}
                >
                  <Signal className="h-5 w-5" />
                  Включить LTE (+{ltePrice} ₽/мес)
                </button>
              ) : null}

              <button
                className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: 'rgba(239, 91, 91, 0.15)',
                  color: 'var(--tg-theme-destructive-text-color, #ef5b5b)'
                }}
                onClick={() => {
                  hapticFeedback('warning')
                  setShowDeleteDialog(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
                Удалить подписку
              </button>
            </div>
          </div>

          {/* Traffic Card */}
          {subscription.traffic && (
            <div className="bg-component overflow-hidden">
              <div className="p-5">
                <h3 className="font-semibold tg-text mb-4">Использование трафика</h3>
                
                {/* Основной трафик */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="tg-text">Основной трафик</span>
                  </div>
                  <div 
                    className="w-full h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(subscription.traffic.limit_bytes > 0 
                          ? (subscription.traffic.used_bytes / subscription.traffic.limit_bytes) * 100 
                          : 0, 100)}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #2ea6ff)'
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="tg-text">{formatBytes(subscription.traffic.used_bytes)}</span>
                    <span className="tg-hint-text">
                      {subscription.traffic.limit_bytes > 0 
                        ? `${Math.round((subscription.traffic.used_bytes / subscription.traffic.limit_bytes) * 100)}% использовано`
                        : '0%'}
                    </span>
                    <span className="tg-text">
                      {subscription.traffic.limit_bytes > 0 
                        ? formatBytes(subscription.traffic.limit_bytes) 
                        : '∞'}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', color: 'var(--tg-theme-hint-color)' }}
                    >
                      <RefreshCw className="h-3 w-3" />
                      {subscription.traffic.reset_strategy === 'WEEK' 
                        ? 'Сброс каждую неделю' 
                        : subscription.traffic.reset_strategy === 'MONTH' 
                          ? 'Сброс каждый месяц' 
                          : 'Без сброса'}
                    </span>
                  </div>
                </div>

                {/* LTE трафик (если есть) */}
                {subscription.lte && (
                  <div className="space-y-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div className="flex justify-between items-center text-sm">
                      <span className="tg-text flex items-center gap-1.5">
                        <Signal className="h-4 w-4" style={{ color: subscription.lte_is_active ? '#f59e0b' : '#6b7280' }} />
                        LTE-антиглушилка
                      </span>
                      {!subscription.lte_is_active && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}
                        >
                          Отключена
                        </span>
                      )}
                    </div>
                    <div 
                      className="w-full h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(subscription.lte.traffic_limit > 0 
                            ? (subscription.lte.traffic_used / subscription.lte.traffic_limit) * 100 
                            : 0, 100)}%`,
                          background: subscription.lte_is_active 
                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
                            : 'linear-gradient(90deg, #6b7280, #9ca3af)'
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="tg-text">{formatBytes(subscription.lte.traffic_used)}</span>
                      <span className="tg-hint-text">
                        {subscription.lte.traffic_limit > 0 
                          ? `${Math.round((subscription.lte.traffic_used / subscription.lte.traffic_limit) * 100)}% использовано`
                          : '0%'}
                      </span>
                      <span className="tg-text">
                        {subscription.lte.traffic_limit > 0 
                          ? formatBytes(subscription.lte.traffic_limit) 
                          : '∞'}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="tg-hint-text text-xs">25 ГБ бесплатно, далее 4₽/ГБ • Сброс 1-го числа</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Devices Card */}
          <div className="bg-component overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold tg-text">Подключённые устройства</h3>
                  <p className="text-sm tg-hint-text">
                    {subscription.devices.length} из {subscription.devices_limit}
                  </p>
                </div>
                {subscription.devices.length > 0 && (
                  <button
                    className="px-3 py-1.5 rounded-lg text-sm font-medium"
                    style={{ 
                      backgroundColor: 'rgba(239, 91, 91, 0.1)',
                      color: 'var(--tg-theme-destructive-text-color, #ef5b5b)',
                      border: '1px solid rgba(239, 91, 91, 0.3)'
                    }}
                    onClick={() => {
                      hapticFeedback('warning')
                      setShowClearDevicesDialog(true)
                    }}
                  >
                    Очистить
                  </button>
                )}
              </div>

              {subscription.devices.length === 0 ? (
                <div className="py-8 text-center">
                  <Smartphone className="h-12 w-12 mx-auto mb-3 tg-hint-text opacity-50" />
                  <p className="tg-hint-text">Нет подключённых устройств</p>
                  <p className="text-sm tg-hint-text opacity-70 mt-1">
                    Устройства появятся автоматически после подключения
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subscription.devices.map((device) => (
                    <div
                      key={device.index}
                      className="flex items-center gap-3 py-3 px-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)' }}
                      >
                        <Smartphone className="h-5 w-5 tg-button-text" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium tg-text truncate">{device.name}</p>
                        <p className="text-sm tg-hint-text">{device.os}</p>
                        {device.created_at && (
                          <p className="text-xs tg-hint-text opacity-70">
                            Добавлено: {format(new Date(device.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                          </p>
                        )}
                      </div>
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ 
                          backgroundColor: 'rgba(239, 91, 91, 0.1)',
                          color: 'var(--tg-theme-destructive-text-color, #ef5b5b)'
                        }}
                        onClick={() => {
                          hapticFeedback('warning')
                          setShowDeleteDeviceDialog(device.index)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent 
          className="border-0"
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
            color: 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          <DialogHeader>
            <DialogTitle className="tg-text">Переименовать подписку</DialogTitle>
            <DialogDescription className="tg-hint-text">
              Введите новое название для подписки (до 25 символов)
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Название"
            maxLength={25}
            className="border-0"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--tg-theme-text-color, #ffffff)'
            }}
          />
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRenameDialog(false)}
              className="btn-outline-tg"
            >
              Отмена
            </Button>
            <Button
              onClick={handleRename}
              disabled={!newName.trim() || updateSubscription.isPending}
              style={{ 
                backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)',
                color: 'var(--tg-theme-button-text-color, #ffffff)'
              }}
            >
              {updateSubscription.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Сохранить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subscription Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent
          className="border-0"
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
            color: 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="tg-text">Удалить подписку?</AlertDialogTitle>
            <AlertDialogDescription className="tg-hint-text">
              Это действие нельзя отменить. Подписка и все подключённые устройства будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-outline-tg tg-text">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              style={{ 
                backgroundColor: 'var(--tg-theme-destructive-text-color, #ef5b5b)',
                color: '#ffffff'
              }}
            >
              {deleteSubscription.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Удалить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Device Dialog */}
      <AlertDialog
        open={showDeleteDeviceDialog !== null}
        onOpenChange={(open) => !open && setShowDeleteDeviceDialog(null)}
      >
        <AlertDialogContent
          className="border-0"
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
            color: 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="tg-text">Удалить устройство?</AlertDialogTitle>
            <AlertDialogDescription className="tg-hint-text">
              Устройство будет отключено от подписки. Оно сможет подключиться снова, если есть свободные слоты.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-outline-tg tg-text">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDeleteDeviceDialog !== null && handleDeleteDevice(showDeleteDeviceDialog)}
              style={{ 
                backgroundColor: 'var(--tg-theme-destructive-text-color, #ef5b5b)',
                color: '#ffffff'
              }}
            >
              {deleteDevice.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Удалить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Devices Dialog */}
      <AlertDialog open={showClearDevicesDialog} onOpenChange={setShowClearDevicesDialog}>
        <AlertDialogContent
          className="border-0"
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
            color: 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="tg-text">Очистить все устройства?</AlertDialogTitle>
            <AlertDialogDescription className="tg-hint-text">
              Все устройства будут отключены от подписки. Они смогут подключиться снова.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-outline-tg tg-text">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAllDevices}
              style={{ 
                backgroundColor: 'var(--tg-theme-destructive-text-color, #ef5b5b)',
                color: '#ffffff'
              }}
            >
              {deleteAllDevices.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Очистить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* LTE Toggle Dialog */}
      <AlertDialog open={showLteToggleDialog} onOpenChange={setShowLteToggleDialog}>
        <AlertDialogContent
          className="border-0"
          style={{ 
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
            color: 'var(--tg-theme-text-color, #ffffff)'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="tg-text">
              {subscription?.lte_is_active ? 'Отключить LTE-антиглушилку?' : 'Подключить LTE-антиглушилку?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="tg-hint-text">
              {subscription?.lte_is_active 
                ? 'LTE-антиглушилка будет отключена. Вы перестанете платить за неё со следующего дня.'
                : `LTE-антиглушилка позволяет обходить блокировки мобильного интернета. Стоимость: +${ltePrice} ₽/мес.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-outline-tg tg-text">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleToggleLte(!subscription?.lte_is_active)}
              style={{ 
                backgroundColor: subscription?.lte_is_active 
                  ? 'var(--tg-theme-hint-color, #b1c3d5)'
                  : 'var(--tg-theme-button-color, #2ea6ff)',
                color: '#ffffff'
              }}
            >
              {toggleLte.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : subscription?.lte_is_active ? (
                'Отключить'
              ) : (
                'Подключить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Connect Modal */}
      <ConnectModal
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
        subscriptionUrl={subscription?.subscription_url || ''}
      />
    </div>
  )
}
