'use client'

import { useEffect, useState } from 'react'
import { useOS } from '@/context/os-context'

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const { darkMode } = useOS()

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 300)
          return 100
        }
        return p + Math.random() * 30
      })
    }, 300)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-8 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="text-8xl animate-bounce">🥚</div>
      <div className="text-center">
        <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Web OS
        </h1>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Iniciando sistema...
        </p>
      </div>
      <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
