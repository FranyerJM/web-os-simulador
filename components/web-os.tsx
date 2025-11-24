'use client'

import { useOS } from '@/context/os-context'
import { MobileFrame } from '@/components/mobile-frame'
import { NotificationCenter } from '@/components/notification-center'
import { SplashScreen } from '@/components/screens/splash-screen'
import { useState } from 'react'

export const WebOS = () => {
  const { darkMode } = useOS()
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  // Eliminamos el header y centramos todo el contenedor
  return (
    <div className={`min-h-screen w-full flex items-center justify-center overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
      <div className="relative z-10">
        <MobileFrame />
      </div>
    </div>
  )
}