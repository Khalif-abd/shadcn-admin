import Lottie from 'lottie-react'
import chillguyWalk from '@/assets/lotties/chillguy-walk.json'
import chillguyMelody from '@/assets/lotties/chillguy-melody.json'

interface LottieLogoProps {
  variant?: 'walk' | 'melody'
  className?: string
  size?: number
}

export function LottieLogo({
  variant = 'walk',
  className,
  size = 48,
}: LottieLogoProps) {
  const animationData = variant === 'walk' ? chillguyWalk : chillguyMelody

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={className}
      style={{ width: size, height: size }}
    />
  )
}

