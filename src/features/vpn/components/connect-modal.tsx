import { useState, useMemo } from 'react'
import { 
  Download, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
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
import { usePlatforms, getImportUrl } from '../api'
import { VpnApp, Platform } from '../types'
import { hapticFeedback, getTelegramWebApp } from '@/services/telegram'

interface ConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscriptionUrl: string
}

// Иконки платформ
function PlatformIcon({ slug, className = "h-5 w-5" }: { slug?: string; className?: string }) {
  switch (slug) {
    case 'ios':
    case 'macos':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      )
    case 'android':
    case 'android-tv':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.463 11.463 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"/>
        </svg>
      )
    case 'windows':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm7 .25l10 .15V21l-10-1.91V13.25z"/>
        </svg>
      )
    case 'linux':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.504 0c-.155 0-.311.003-.467.01a9.868 9.868 0 00-.574.033C8.926.26 6.874 1.63 5.647 3.735c-.895 1.537-1.195 3.3-.973 5.037a5.64 5.64 0 00.122.648l.07.3c.019.072.044.14.063.212l.07.221c.025.072.055.14.082.211l.092.208c.032.065.063.13.098.194l.114.188c.042.063.084.125.128.186l.137.17c.051.058.104.114.156.169l.164.148c.061.05.123.098.187.145l.198.124.213.102.23.082.249.064.27.048c.09.014.183.023.276.031l.298.012.31-.006.32-.024.327-.047.33-.074.328-.103.323-.134.313-.167.297-.2.275-.234.247-.266.213-.295.173-.321.128-.343.078-.359.024-.37-.029-.376-.08-.375-.132-.368-.183-.353-.233-.33-.28-.302-.325-.27-.368-.232-.409-.19-.448-.143-.487-.093-.525-.042-.562.009zm-.091 1.657a3.77 3.77 0 01.54.027 4.35 4.35 0 01.522.088c.165.044.326.1.482.168a3.3 3.3 0 01.45.219c.143.09.28.19.41.3.127.11.247.228.36.354.11.126.212.26.304.401.09.141.171.289.241.442.069.152.127.311.173.474a3.3 3.3 0 01.105.502 3.3 3.3 0 01.038.52v.538l-.038.52a3.3 3.3 0 01-.105.501 3.3 3.3 0 01-.173.475c-.07.153-.151.3-.241.442-.092.14-.193.275-.304.4a3.78 3.78 0 01-.36.355c-.13.11-.267.21-.41.3a3.3 3.3 0 01-.45.219 3.82 3.82 0 01-.482.167 4.35 4.35 0 01-.522.088 3.77 3.77 0 01-.54.027 3.77 3.77 0 01-.54-.027 4.35 4.35 0 01-.521-.088 3.82 3.82 0 01-.483-.167 3.3 3.3 0 01-.45-.22 3.78 3.78 0 01-.41-.3 3.78 3.78 0 01-.36-.354 3.78 3.78 0 01-.303-.401c-.09-.141-.171-.29-.242-.442a3.3 3.3 0 01-.172-.475 3.3 3.3 0 01-.106-.5 3.3 3.3 0 01-.038-.521v-.538c.004-.175.02-.348.048-.52.03-.17.067-.337.114-.501.049-.163.107-.322.174-.475.068-.153.148-.3.238-.442a3.78 3.78 0 01.304-.4c.113-.127.233-.245.36-.355.13-.11.267-.21.41-.3.142-.08.292-.154.45-.219a3.82 3.82 0 01.482-.167 4.35 4.35 0 01.522-.088 3.77 3.77 0 01.54-.027z"/>
        </svg>
      )
    default:
      return <Smartphone className={className} />
  }
}

// Компонент для отображения инструкции приложения
function AppInstructions({ 
  app, 
  subscriptionUrl, 
  platformSlug 
}: { 
  app: VpnApp
  subscriptionUrl: string
  platformSlug?: string
}) {
  const [copied, setCopied] = useState(false)
  const importUrl = getImportUrl(app.import_url_template, subscriptionUrl)
  const isHappOnApple = app.name === 'Happ' && (platformSlug === 'ios' || platformSlug === 'macos')

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(subscriptionUrl)
      hapticFeedback('success')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
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

  return (
    <div className="space-y-4">
      {/* Информация о приложении */}
      <div className="flex items-center gap-3">
        {app.image ? (
          <img 
            src={app.image} 
            alt={app.name} 
            className="w-12 h-12 rounded-xl"
          />
        ) : (
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Smartphone className="h-6 w-6 tg-hint-text" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold tg-text">{app.name}</span>
            {app.is_paid && (
              <span className="text-amber-400" title="Платное приложение">💰</span>
            )}
          </div>
          <span className="text-sm tg-hint-text">{app.platform_support}</span>
        </div>
      </div>

      {/* Шаги */}
      <div className="space-y-4">
        {/* Шаг 1: Скачать */}
        <div>
          <p className="tg-text font-medium mb-2 flex items-center gap-2">
            <span 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)', color: '#ffffff' }}
            >
              1
            </span>
            Скачайте приложение
          </p>
          <p className="mb-3 tg-hint-text text-sm">Нажмите на кнопку ниже</p>
          
          {isHappOnApple ? (
            <div className="space-y-2">
              <a
                href={app.download_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => hapticFeedback('light')}
                className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)', color: '#ffffff' }}
              >
                <Download className="h-4 w-4" />
                <span>Скачать</span>
                <span 
                  className="px-1.5 py-0.5 rounded text-xs font-bold"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  RU
                </span>
              </a>
              <a
                href="https://apps.apple.com/app/id6474383775"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => hapticFeedback('light')}
                className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              >
                <Download className="h-4 w-4 tg-text" />
                <span className="tg-text">Скачать</span>
                <span 
                  className="px-1.5 py-0.5 rounded text-xs font-bold"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                >
                  Global
                </span>
              </a>
              <p className="text-xs tg-hint-text text-center">
                🇷🇺 RU — если App Store в России<br />
                🌍 Global — для других регионов
              </p>
            </div>
          ) : (
            <a
              href={app.download_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => hapticFeedback('light')}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)', color: '#ffffff' }}
            >
              <Download className="h-4 w-4" />
              Скачать
            </a>
          )}
        </div>

        {/* Шаг 2: Добавить VPN */}
        <div>
          <p className="tg-text font-medium mb-2 flex items-center gap-2">
            <span 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)', color: '#ffffff' }}
            >
              2
            </span>
            Добавьте VPN в приложение
          </p>
          <p className="mb-3 tg-hint-text text-sm">Нажмите на кнопку ниже</p>
          <a
            href={importUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => hapticFeedback('light')}
            className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--tg-theme-button-color, #2ea6ff)', color: '#ffffff' }}
          >
            <ExternalLink className="h-4 w-4" />
            Добавить в {app.name}
          </a>
        </div>

        {/* Кнопка копирования */}
        <button
          onClick={handleCopyUrl}
          className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 tg-text" />
              <span className="tg-text">Скопировано!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 tg-text" />
              <span className="tg-text">Скопировать ссылку</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Компонент для другого приложения (компактный вид)
function AppCard({ app, subscriptionUrl, platformSlug }: { app: VpnApp; subscriptionUrl: string; platformSlug?: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    >
      <button
        onClick={() => {
          hapticFeedback('light')
          setExpanded(!expanded)
        }}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {app.image ? (
            <img src={app.image} alt={app.name} className="w-10 h-10 rounded-lg" />
          ) : (
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Smartphone className="h-5 w-5 tg-hint-text" />
            </div>
          )}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="tg-text font-medium">{app.name}</span>
              {app.is_paid && <span className="text-amber-400">💰</span>}
            </div>
            <span className="text-xs tg-hint-text">{app.platform_support}</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 tg-hint-text" />
        ) : (
          <ChevronDown className="h-5 w-5 tg-hint-text" />
        )}
      </button>
      
      {expanded && (
        <div className="px-4 pb-4">
          <AppInstructions app={app} subscriptionUrl={subscriptionUrl} platformSlug={platformSlug} />
        </div>
      )}
    </div>
  )
}

export function ConnectModal({ open, onOpenChange, subscriptionUrl }: ConnectModalProps) {
  const { data: platforms, isLoading } = usePlatforms()
  const [selectedPlatformSlug, setSelectedPlatformSlug] = useState<string | null>(null)
  const [showOtherApps, setShowOtherApps] = useState(false)

  // Определяем текущую платформу
  const currentPlatform = useMemo(() => {
    if (selectedPlatformSlug) {
      // Ищем среди других платформ
      const found = platforms?.other_platforms.find(p => p.slug === selectedPlatformSlug)
      if (found) return found
      // Проверяем текущую платформу
      if (platforms?.current_platform?.slug === selectedPlatformSlug) {
        return platforms.current_platform
      }
    }
    return platforms?.current_platform
  }, [platforms, selectedPlatformSlug])

  // Все платформы для селекта
  const allPlatforms = useMemo(() => {
    const result: Platform[] = []
    if (platforms?.current_platform) {
      result.push(platforms.current_platform)
    }
    if (platforms?.other_platforms) {
      result.push(...platforms.other_platforms)
    }
    return result
  }, [platforms])

  // Другие приложения (не рекомендуемые)
  const otherApps = useMemo(() => {
    return currentPlatform?.apps.filter(app => !app.is_recommended) || []
  }, [currentPlatform])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md max-h-[90vh] overflow-y-auto border-0"
        style={{ 
          backgroundColor: 'var(--tg-theme-bg-color, #18222d)',
          color: 'var(--tg-theme-text-color, #ffffff)'
        }}
      >
        <DialogHeader>
          <DialogTitle className="tg-text">Подключить VPN</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-current border-t-transparent rounded-full tg-accent-text" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Селект платформы */}
            <div>
              <label className="text-sm tg-hint-text mb-2 block">Платформа</label>
              <Select 
                value={selectedPlatformSlug || currentPlatform?.slug || ''} 
                onValueChange={(value) => {
                  hapticFeedback('light')
                  setSelectedPlatformSlug(value)
                  setShowOtherApps(false)
                }}
              >
                <SelectTrigger 
                  className="w-full h-12 rounded-xl border-0"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--tg-theme-text-color, #ffffff)'
                  }}
                >
                  <SelectValue>
                    {currentPlatform && (
                      <div className="flex items-center gap-2">
                        <PlatformIcon slug={currentPlatform.slug} className="h-5 w-5 tg-text" />
                        <span className="tg-text">{currentPlatform.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  style={{ 
                    backgroundColor: 'var(--tg-theme-secondary-bg-color, #131415)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {allPlatforms.map(platform => (
                    <SelectItem 
                      key={platform.slug} 
                      value={platform.slug}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <PlatformIcon slug={platform.slug} className="h-5 w-5" />
                        <span>{platform.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Инструкция для рекомендуемого приложения */}
            {currentPlatform?.recommended_app ? (
              <div 
                className="rounded-2xl p-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <AppInstructions 
                  app={currentPlatform.recommended_app} 
                  subscriptionUrl={subscriptionUrl}
                  platformSlug={currentPlatform.slug}
                />
              </div>
            ) : (
              <div 
                className="rounded-2xl p-4 text-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <p className="tg-hint-text">
                  Приложение для этой платформы не найдено
                </p>
              </div>
            )}

            {/* Другие приложения */}
            {otherApps.length > 0 && (
              <div>
                <button
                  onClick={() => {
                    hapticFeedback('light')
                    setShowOtherApps(!showOtherApps)
                  }}
                  className="w-full flex items-center justify-between py-3"
                >
                  <span className="font-medium tg-text">
                    Другие приложения для {currentPlatform?.name}
                  </span>
                  {showOtherApps ? (
                    <ChevronUp className="h-5 w-5 tg-hint-text" />
                  ) : (
                    <ChevronDown className="h-5 w-5 tg-hint-text" />
                  )}
                </button>
                
                {showOtherApps && (
                  <div className="space-y-2">
                    {otherApps.map(app => (
                      <AppCard 
                        key={app.id} 
                        app={app} 
                        subscriptionUrl={subscriptionUrl}
                        platformSlug={currentPlatform?.slug}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
