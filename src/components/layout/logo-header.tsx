import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

interface LogoHeaderProps {
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
}

export function LogoHeader({ size = 'md', showSubtitle = true }: LogoHeaderProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)

  const sizeMap = {
    sm: { lottie: 60, text: 'text-lg' },
    md: { lottie: 90, text: 'text-xl' },
    lg: { lottie: 120, text: 'text-2xl' },
  }

  const currentSize = sizeMap[size]

  useEffect(() => {
    // Load the Lottie animation
    fetch('/img/lotties/chillguy-walk.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {
        // Fallback to melody if walk animation not found
        fetch('/img/lotties/melody.json')
          .then((res) => res.json())
          .then((data) => setAnimationData(data))
          .catch(console.error)
      })
  }, [])

  return (
    <div className="flex flex-col items-center py-4">
      {/* Lottie Animation */}
      <div style={{ width: currentSize.lottie, height: currentSize.lottie }}>
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div 
            className="rounded-full bg-component animate-pulse"
            style={{ width: currentSize.lottie, height: currentSize.lottie }}
          />
        )}
      </div>

      {/* Logo Text */}
      <h1 className={`${currentSize.text} font-bold tracking-tight mt-1`}>
        <span style={{ color: 'var(--logo-chill-color, #7DD3C0)' }}>Chill</span>
        <span style={{ color: 'var(--logo-guy-color, #B8D4E3)' }}>Guy</span>
        <span className="tg-text">VPN</span>
      </h1>

      {/* Subtitle */}
      {showSubtitle && (
        <p className="text-[10px] tg-hint-text tracking-widest uppercase">
          just stay chill
        </p>
      )}
    </div>
  )
}
