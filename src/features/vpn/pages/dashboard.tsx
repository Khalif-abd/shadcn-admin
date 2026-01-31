import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { LogoHeader } from '@/components/layout/logo-header'
import { useProfile } from '../api'
import { MainCard } from '../components/main-card'
import { ReferralCard } from '../components/referral-card'
import { AddSubscriptionDialog } from '../components/add-subscription-dialog'

export function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const navigate = useNavigate()

  const handleSubscriptionCreated = (subscriptionId: number) => {
    navigate({ 
      to: '/subscriptions/$subscriptionId', 
      params: { subscriptionId: String(subscriptionId) } 
    })
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin tg-accent-text" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="tg-hint-text">Не удалось загрузить данные</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-3xl mx-auto">
      <LogoHeader size="md" />
      
      <main className="flex-1 px-4 pb-4 max-w-md mx-auto w-full">
        <div className="space-y-4">
          <MainCard
            balance={profile.balance}
            daysLeft={profile.days_left}
            subscriptionsCount={profile.subscriptions.count}
            totalReferrals={profile.referral.invited}
            totalEarnings={profile.referral.earnings}
            onCreateSubscription={() => setShowAddDialog(true)}
          />

          <ReferralCard
            link={profile.referral.link}
            percent={profile.referral.percent}
            totalReferrals={profile.referral.invited}
            totalEarnings={profile.referral.earnings}
          />
        </div>
      </main>

      <AddSubscriptionDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={handleSubscriptionCreated}
      />
    </div>
  )
}
