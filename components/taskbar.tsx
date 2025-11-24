'use client'

import { useOS } from '@/context/os-context'
import { useState } from 'react'

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

export const Taskbar = () => {
  const { theme, installedApps, setActiveApp, activeApp, goBack } = useOS()
  const [showRecent, setShowRecent] = useState(false)

  const recentApps = installedApps.filter(app => !app.isNative)

  const getTaskbarStyle = () => {
    if (theme === 'pc') {
      return 'absolute bottom-0 left-0 right-0 h-16 bg-gray-800 border-t border-gray-700'
    }
    if (theme === 'ios') {
      return 'absolute bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur border-t border-gray-800 rounded-t-3xl'
    }
    return 'absolute bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800'
  }

  const getAppGridStyle = () => {
    if (theme === 'pc') {
      return 'flex justify-start gap-2 px-4'
    }
    return 'flex justify-around items-center'
  }

  return (
    <>
      <div className={getTaskbarStyle()}>
        <div className={`w-full h-full ${getAppGridStyle()} items-center`}>
          <button
            onClick={goBack}
            className="p-3 rounded-lg transition-all hover:scale-110 hover:bg-gray-700"
            title="Atrás"
          >
            <span className="text-2xl">⬅️</span>
          </button>

          <button
            onClick={() => setActiveApp(null)}
            className={`p-3 rounded-lg transition-all hover:scale-110 ${
              activeApp === null
                ? 'bg-blue-500 ring-2 ring-blue-300'
                : 'hover:bg-gray-700'
            }`}
            title="Home"
          >
            <span className="text-2xl">🏠</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowRecent(!showRecent)}
              className={`p-3 rounded-lg transition-all hover:scale-110 ${
                showRecent ? 'bg-blue-500 ring-2 ring-blue-300' : 'hover:bg-gray-700'
              }`}
              title="Aplicaciones recientes"
            >
              <span className="text-2xl">📱</span>
            </button>

            {showRecent && recentApps.length > 0 && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-w-xs z-50">
                {recentApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setActiveApp(app.id)
                      setShowRecent(false)
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg text-left text-sm text-white"
                  >
                    {app.favicon ? (
                      <img src={app.favicon || "/placeholder.svg"} alt={app.name} className="w-5 h-5 rounded" onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3C/svg%3E'
                      }} />
                    ) : (
                      <span className="text-lg">🌐</span>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold">{app.name}</div>
                      <div className="text-xs text-gray-400 truncate">{app.url}</div>
                    </div>
                  </button>
                ))}
                {recentApps.length === 0 && (
                  <div className="px-4 py-3 text-xs text-gray-400 text-center">
                    Sin aplicaciones recientes
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showRecent && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowRecent(false)}
        />
      )}
    </>
  )
}
