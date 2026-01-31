export type PlatformSlug = 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown'

export interface VpnApp {
  slug: string
  name: string
  shortName?: string
  platformSupport: string
  image: string
  downloadUrl: string
  importUrlTemplate: string
  isRecommended: boolean
  instructions: {
    install: string
    addSubscription: string
    connect: string
  }
}

export interface Platform {
  slug: PlatformSlug
  name: string
  icon: string
  apps: VpnApp[]
}

// Конфигурация приложений для каждой платформы
const platforms: Platform[] = [
  {
    slug: 'ios',
    name: 'iOS',
    icon: 'apple',
    apps: [
      {
        slug: 'v2raytun',
        name: 'v2RayTun',
        shortName: 'V2',
        platformSupport: 'iOS 14+',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/71/8b/87/718b8730-3cad-c030-6807-9d00e9e95d70/AppIcon-0-0-1x_U007epad-0-85-220.png/230x0w.webp',
        downloadUrl: 'https://apps.apple.com/app/v2raytun/id6476628951',
        importUrlTemplate: 'v2raytun://import/{subscriptionUrl}',
        isRecommended: true,
        instructions: {
          install: 'Откройте страницу в App Store и установите приложение. Запустите его, в окне разрешения VPN-конфигурации нажмите Allow и введите свой пароль.',
          addSubscription: 'Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.',
          connect: 'В главном разделе нажмите большую кнопку включения в центре для подключения к VPN. Не забудьте выбрать сервер в списке серверов.',
        },
      },
      {
        slug: 'happ',
        name: 'Happ (Streisand)',
        shortName: 'H',
        platformSupport: 'iOS 15+',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/be/8a/f8/be8af876-6f2d-31ac-34e5-f2c2dbb0e00e/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/230x0w.webp',
        downloadUrl: 'https://apps.apple.com/app/happ-network-tool/id6504287215',
        importUrlTemplate: 'happ://add/{subscriptionUrl}',
        isRecommended: false,
        instructions: {
          install: 'Откройте страницу в App Store и установите приложение Happ. Запустите его и разрешите добавление VPN-конфигурации.',
          addSubscription: 'Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.',
          connect: 'Выберите сервер из списка и нажмите кнопку подключения. VPN будет активирован.',
        },
      },
    ],
  },
  {
    slug: 'android',
    name: 'Android',
    icon: 'android',
    apps: [
      {
        slug: 'v2rayng',
        name: 'v2rayNG',
        shortName: 'V2',
        platformSupport: 'Android 5.0+',
        image: 'https://play-lh.googleusercontent.com/Fv0x_yWLkqMlZ8Ak_bEwojVWjCb3sI4X1mU9u6RvK4WpJpxfzCSQsn5STOzLxyZGJA=w240-h480-rw',
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.v2ray.ang',
        importUrlTemplate: 'v2rayng://install-sub?url={subscriptionUrl}',
        isRecommended: true,
        instructions: {
          install: 'Установите приложение v2rayNG из Google Play. После установки откройте его.',
          addSubscription: 'Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.',
          connect: 'Нажмите кнопку V в нижней части экрана для подключения. Выберите сервер из списка при необходимости.',
        },
      },
      {
        slug: 'hiddify',
        name: 'Hiddify',
        shortName: 'HI',
        platformSupport: 'Android 6.0+',
        image: 'https://play-lh.googleusercontent.com/8vNYC0dPsGkZnmVNZQxn9xDk12LGlJt7ycBmYzpk0Xhx-Dz_EJVqG-qGO8GNXlJYnw=w240-h480-rw',
        downloadUrl: 'https://play.google.com/store/apps/details?id=app.hiddify.com',
        importUrlTemplate: 'hiddify://import/{subscriptionUrl}',
        isRecommended: false,
        instructions: {
          install: 'Установите приложение Hiddify из Google Play. После установки откройте его.',
          addSubscription: 'Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.',
          connect: 'Нажмите большую кнопку в центре экрана для подключения к VPN.',
        },
      },
    ],
  },
  {
    slug: 'macos',
    name: 'macOS',
    icon: 'apple',
    apps: [
      {
        slug: 'v2raytun-mac',
        name: 'v2RayTun',
        shortName: 'V2',
        platformSupport: 'macOS 13+',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/71/8b/87/718b8730-3cad-c030-6807-9d00e9e95d70/AppIcon-0-0-1x_U007epad-0-85-220.png/230x0w.webp',
        downloadUrl: 'https://apps.apple.com/app/v2raytun/id6476628951',
        importUrlTemplate: 'v2raytun://import/{subscriptionUrl}',
        isRecommended: true,
        instructions: {
          install: 'Откройте страницу в App Store и установите приложение. Запустите его и разрешите добавление VPN-конфигурации.',
          addSubscription: 'Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.',
          connect: 'Нажмите кнопку включения VPN в приложении. Выберите сервер из списка при необходимости.',
        },
      },
      {
        slug: 'hiddify-mac',
        name: 'Hiddify',
        shortName: 'HI',
        platformSupport: 'macOS 12+',
        image: 'https://raw.githubusercontent.com/hiddify/hiddify-next/main/assets/images/logo.png',
        downloadUrl: 'https://github.com/hiddify/hiddify-next/releases',
        importUrlTemplate: 'hiddify://import/{subscriptionUrl}',
        isRecommended: false,
        instructions: {
          install: 'Скачайте Hiddify с GitHub и установите приложение. Запустите его.',
          addSubscription: 'Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.',
          connect: 'Нажмите большую кнопку в центре экрана для подключения к VPN.',
        },
      },
    ],
  },
  {
    slug: 'windows',
    name: 'Windows',
    icon: 'windows',
    apps: [
      {
        slug: 'hiddify-win',
        name: 'Hiddify',
        shortName: 'HI',
        platformSupport: 'Windows 10+',
        image: 'https://raw.githubusercontent.com/hiddify/hiddify-next/main/assets/images/logo.png',
        downloadUrl: 'https://github.com/hiddify/hiddify-next/releases',
        importUrlTemplate: 'hiddify://import/{subscriptionUrl}',
        isRecommended: true,
        instructions: {
          install: 'Скачайте Hiddify с GitHub и установите приложение. Запустите его.',
          addSubscription: 'Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.',
          connect: 'Нажмите большую кнопку в центре экрана для подключения к VPN.',
        },
      },
      {
        slug: 'v2rayn',
        name: 'v2rayN',
        shortName: 'V2',
        platformSupport: 'Windows 10+',
        image: 'https://avatars.githubusercontent.com/u/2001792?s=200&v=4',
        downloadUrl: 'https://github.com/2dust/v2rayN/releases',
        importUrlTemplate: '',
        isRecommended: false,
        instructions: {
          install: 'Скачайте v2rayN с GitHub и распакуйте архив. Запустите v2rayN.exe.',
          addSubscription: 'Скопируйте ссылку подписки и добавьте её через меню: Подписки → Добавить подписку.',
          connect: 'Выберите сервер из списка и нажмите "Подключиться". VPN будет активирован.',
        },
      },
    ],
  },
  {
    slug: 'linux',
    name: 'Linux',
    icon: 'linux',
    apps: [
      {
        slug: 'hiddify-linux',
        name: 'Hiddify',
        shortName: 'HI',
        platformSupport: 'Linux',
        image: 'https://raw.githubusercontent.com/hiddify/hiddify-next/main/assets/images/logo.png',
        downloadUrl: 'https://github.com/hiddify/hiddify-next/releases',
        importUrlTemplate: 'hiddify://import/{subscriptionUrl}',
        isRecommended: true,
        instructions: {
          install: 'Скачайте Hiddify с GitHub и установите приложение.',
          addSubscription: 'Нажмите кнопку ниже — приложение откроется, и подписка добавится автоматически.',
          connect: 'Нажмите большую кнопку в центре экрана для подключения к VPN.',
        },
      },
      {
        slug: 'nekoray',
        name: 'Nekoray',
        shortName: 'NK',
        platformSupport: 'Linux',
        image: 'https://raw.githubusercontent.com/MatsuriDayo/nekoray/main/res/nekoray.png',
        downloadUrl: 'https://github.com/MatsuriDayo/nekoray/releases',
        importUrlTemplate: '',
        isRecommended: false,
        instructions: {
          install: 'Скачайте Nekoray с GitHub и установите приложение.',
          addSubscription: 'Скопируйте ссылку подписки и добавьте её через меню: Server → New profile from clipboard.',
          connect: 'Выберите сервер и нажмите Start для подключения.',
        },
      },
    ],
  },
]

/**
 * Определяет текущую платформу по userAgent
 */
export function detectPlatform(): PlatformSlug {
  if (typeof navigator === 'undefined') return 'unknown'

  const ua = navigator.userAgent.toLowerCase()

  // iOS (iPhone, iPad, iPod)
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios'
  }

  // Android
  if (/android/.test(ua)) {
    return 'android'
  }

  // macOS
  if (/macintosh|mac os x/.test(ua) && !/iphone|ipad|ipod/.test(ua)) {
    return 'macos'
  }

  // Windows
  if (/windows/.test(ua)) {
    return 'windows'
  }

  // Linux
  if (/linux/.test(ua) && !/android/.test(ua)) {
    return 'linux'
  }

  return 'unknown'
}

/**
 * Получает данные платформы по slug
 */
export function getPlatformBySlug(slug: PlatformSlug): Platform | undefined {
  return platforms.find((p) => p.slug === slug)
}

/**
 * Получает текущую платформу
 */
export function getCurrentPlatform(): Platform | undefined {
  const slug = detectPlatform()
  return getPlatformBySlug(slug)
}

/**
 * Получает рекомендуемое приложение для текущей платформы
 */
export function getRecommendedApp(): VpnApp | undefined {
  const platform = getCurrentPlatform()
  return platform?.apps.find((app) => app.isRecommended)
}

/**
 * Формирует URL для импорта подписки в приложение
 */
export function getImportUrl(app: VpnApp, subscriptionUrl: string): string {
  if (!app.importUrlTemplate) return ''
  return app.importUrlTemplate.replace('{subscriptionUrl}', encodeURIComponent(subscriptionUrl))
}

/**
 * Получает все платформы
 */
export function getAllPlatforms(): Platform[] {
  return platforms
}

