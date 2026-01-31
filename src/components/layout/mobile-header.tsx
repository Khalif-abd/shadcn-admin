import { MoreHorizontal } from 'lucide-react'
import { LottieLogo } from '@/components/lottie-logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import {
  HelpCircle,
  MessageCircle,
  FileText,
  LogOut,
} from 'lucide-react'

interface MobileHeaderProps {
  balance?: number
  showBalance?: boolean
  showBackButton?: boolean
  onBack?: () => void
  title?: string
}

export function MobileHeader({
  balance,
  showBalance = false,
}: MobileHeaderProps) {
  const navigate = useNavigate()
  const { reset } = useAuthStore((state) => state.auth)

  const handleLogout = () => {
    reset()
    navigate({ to: '/auth', search: { token: undefined } })
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
      <div className="flex items-center gap-3">
        <LottieLogo size={52} variant="walk" />
        <span className="font-bold text-xl text-foreground">ChillGuy VPN</span>
      </div>

      <div className="flex items-center gap-2">
        {showBalance && balance !== undefined && (
          <div className="text-right mr-1">
            <div className="text-xs text-muted-foreground">Баланс</div>
            <div className="font-semibold text-amber-500">{balance} ₽</div>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border bg-card/80"
            >
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Помощь
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Чат поддержки
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <FileText className="h-4 w-4" />
              Правила
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-amber-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
