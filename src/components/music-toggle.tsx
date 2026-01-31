import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { hapticFeedback } from '@/services/telegram'

const STORAGE_KEY = 'chillguy-music-enabled'

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Инициализация аудио
  useEffect(() => {
    const audio = new Audio('/sounds/chill-guy-80-vol.mp3')
    audio.loop = true
    audio.volume = 0.1 // 10% громкость
    audioRef.current = audio

    // Обработка событий аудио
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))

    // Обработка скрытия страницы
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      audio.pause()
      audio.remove()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const toggleMusic = () => {
    hapticFeedback('light')
    
    if (!audioRef.current) return

    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        localStorage.setItem(STORAGE_KEY, 'true')
      }).catch((error) => {
        console.log('Audio playback failed:', error)
      })
    } else {
      audioRef.current.pause()
      localStorage.setItem(STORAGE_KEY, 'false')
    }
  }

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all active:scale-95"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}
      aria-label={isPlaying ? 'Выключить музыку' : 'Включить музыку'}
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5 tg-accent-text" />
      ) : (
        <VolumeX className="h-5 w-5 tg-hint-text" />
      )}
    </button>
  )
}
