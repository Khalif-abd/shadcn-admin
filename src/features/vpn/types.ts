// ==================== Profile ====================

export interface Profile {
  id: number
  telegram_id: number
  name: string
  telegram_username: string | null
  balance: number
  days_left: number
  status: 'active' | 'suspended'
  tariff: {
    price_per_month: number
    lte_price_per_month: number
    full_price_per_month: number
    name: string
  }
  subscriptions: {
    count: number
    limit: number
  }
  referral: {
    link: string
    code: string | null
    invited: number
    earnings: number
    percent: number
  }
  created_at: string
}

// ==================== Subscriptions ====================

export interface Subscription {
  id: number
  name: string | null
  user_number: number
  display_name: string
  is_active: boolean
  lte_is_active: boolean
  days_left: number
  devices_count: number
  devices_limit: number
  created_at: string
}

export interface SubscriptionDetail extends Subscription {
  subscription_url: string
  qr_code_url: string | null
  devices: SubscriptionDevice[]
  traffic: TrafficInfo | null
  lte_is_active: boolean
  lte_available: boolean
  lte: LteInfo | null
  updated_at: string
}

export interface TrafficInfo {
  used_bytes: number
  limit_bytes: number
  reset_strategy: 'WEEK' | 'MONTH' | 'NO_RESET'
}

export interface SubscriptionDevice {
  index: number
  name: string
  os: string
  app: string
  device_type: string | null
  created_at: string | null
}

export interface CreateSubscriptionRequest {
  name?: string
  with_lte?: boolean
}

export interface UpdateSubscriptionRequest {
  name: string
}

// ==================== LTE ====================

export interface LteInfo {
  is_active: boolean
  traffic_used: number
  traffic_limit: number
  purchased_bytes: number
  free_monthly_bytes: number
  reset_day?: number
}

export interface LteDetailInfo {
  is_active: boolean
  traffic: {
    used_bytes: number
    limit_bytes: number
    used_gb: number
    limit_gb: number
  }
  purchased_bytes: number
  free_monthly_gb: number
  reset_day: number
  packages: LtePackage[]
}

export interface LtePackage {
  id: number
  size_gb: number
  size_bytes: number
  price: number
}

export interface PurchaseLteRequest {
  package_id: number
}

// ==================== Transactions ====================

export type TransactionType =
  | 'deposit'
  | 'daily_charge'
  | 'withdrawal'
  | 'referral_bonus'
  | 'subscription'
  | 'refund'
  | 'bonus'
  | 'renew_lte_traffic'

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface Transaction {
  id: number
  amount: number
  type: TransactionType
  type_label: string
  status: TransactionStatus
  status_label: string
  description: string
  payment_method: string | null
  balance_before: number | null
  balance_after: number | null
  created_at: string
}

// ==================== Payments ====================

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type PaymentMethod = 'sbp' | 'card' | 'crypto'

export interface Payment {
  id: number
  payment_id: string
  amount: number
  currency: string
  provider: string
  method: PaymentMethod
  method_label: string
  status: PaymentStatus
  status_label: string
  payment_url: string
  paid_at: string | null
  created_at: string
}

export interface CreatePaymentRequest {
  amount: number
  method: PaymentMethod
}

// ==================== Referrals ====================

export interface Referral {
  link: string
  code: string | null
  statistics: {
    total_referrals: number
    total_earnings: number
    available_balance: number
  }
  conditions: {
    percent: number
    min_withdrawal: number
    withdrawal_methods: string[]
  }
  can_withdraw: boolean
  withdrawals: ReferralWithdrawal[]
}

export interface ReferralWithdrawal {
  id: number
  amount: number
  method: string
  method_label: string
  status: string
  status_label: string
  created_at: string
  processed_at: string | null
}

export interface WithdrawRequest {
  amount: number
  method: 'card' | 'usdt'
  details: string
}

// ==================== Tariffs ====================

export interface TariffInfo {
  tariffs: Tariff[]
  discounts: TariffDiscount[]
  topup_bonuses: TopupBonus[]
  lte_packages: LtePackage[]
  referral_percent: number
  min_withdrawal: number
}

export interface Tariff {
  id: string
  name: string
  price_per_month: number
  features: string[]
  is_default: boolean
}

export interface TariffDiscount {
  subscriptions: number
  percent: number
  description: string
}

export interface TopupBonus {
  min_amount: number
  bonus: number
  description: string
}

// ==================== Platforms ====================

export interface VpnApp {
  id: number
  slug: string
  name: string
  image: string | null
  platform_support: string
  download_url: string
  import_url_template: string
  is_paid: boolean
  is_recommended: boolean
  processor: string | null
  has_instruction: boolean
}

export interface Platform {
  slug: string
  name: string
  recommended_app: VpnApp | null
  apps: VpnApp[]
}

export interface PlatformsResponse {
  current_platform: Platform | null
  other_platforms: Platform[]
}

// ==================== API Responses ====================

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

export interface SubscriptionsListResponse {
  data: Subscription[]
  meta: {
    total: number
    limit: number
    can_add: boolean
  }
}

export interface DevicesListResponse {
  data: SubscriptionDevice[]
  meta: {
    count: number
    limit: number
  }
}
