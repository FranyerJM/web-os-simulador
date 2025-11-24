'use client'

import { useOS } from '@/context/os-context'
import { useState } from 'react'
import { appsConfig } from '@/lib/apps-config'

const ICON_MAP: Record<string, string> = {
  calculator: '🧮',
  calendar: '📅',
  messages: '💬',
  phone: '☎️',
  pacman: '👾',
  files: '📁',
  camera: '📷',
  gallery: '🖼️',
  settings: '⚙️',
  store: '🛍️',
}

export const AppGrid = () => {
  const { theme, installedApps, setActiveApp } = useOS()
  const [longPressedApp, setLongPressedApp] = useState<string | null>(null)

  const getGridStyle = () => {
    if (theme === 'pc') {
      return 'grid grid-cols-4 gap-6'
    }
    if (theme === 'ios') {
      return 'grid grid-cols-4 gap-6'
    }
    return 'grid grid-cols-4 gap-4'
  }

  const getAppIconStyle = (appId: string) => {
    const appData = appsConfig.defaultApps.find((app) => app.id === appId)
    return {
      backgroundColor: appData?.color || '#666',
    }
  }

  return (
    <div className={getGridStyle()}>
      {installedApps.map((app) => (
        <button
          key={app.id}
          onClick={() => setActiveApp(app.id)}
          onTouchStart={() => setLongPressedApp(app.id)}
          onTouchEnd={() => setLongPressedApp(null)}
          className="flex flex-col items-center gap-2 group"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform"
            style={getAppIconStyle(app.id)}
          >
            {app.favicon ? (
              <img src={app.favicon || "/placeholder.svg"} alt={app.name} className="w-12 h-12 rounded" onError={(e) => {
                e.currentTarget.style.display = 'none'
              }} />
            ) : (
              ICON_MAP[app.id] || '📱'
            )}
          </div>
          <span className="text-white text-xs text-center text-shadow max-w-14 truncate">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  )
}
