'use client'

import { useOS } from '@/context/os-context'
import { HomeScreen } from '@/components/screens/home-screen'
import { AppWindow } from '@/components/app-window'
import { Taskbar } from '@/components/taskbar'
import { CallOverlay } from '@/components/call-overlay'
import { useEffect, useState } from 'react'
import { ChevronDown, Wifi, WifiOff, Battery, Signal } from 'lucide-react'

const FRAME_SIZES = {
  android: { width: 360, height: 800 },
  ios: { width: 390, height: 844 },
  pc: { width: 1024, height: 768 },
}

export const MobileFrame = () => {
  const { theme, activeApp, setActiveApp, notifications, wifiEnabled, connectedNetwork, peerStatus } = useOS()
  const [mounted, setMounted] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0].clientY < 50) {
      setTouchStart(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart > 0 && e.touches[0].clientY > touchStart + 50) {
      setNotificationsOpen(true)
      setTouchStart(0)
    }
  }

  if (!mounted) return null
  const size = FRAME_SIZES[theme]

  return (
    <div
      className={`relative overflow-hidden bg-black transition-all duration-300 shadow-2xl ${theme === 'pc' ? 'rounded-lg border-gray-800 border-4' : 'rounded-[3rem] border-gray-900 border-[8px]'
        }`}
      style={{ width: size.width, height: size.height }}
    >
      <CallOverlay />

      <div
        className="absolute top-0 left-0 right-0 h-8 px-6 flex items-center justify-between z-50 text-white select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <span className="text-xs font-medium w-1/3">{currentTime}</span>
        {theme === 'ios' && <div className="w-1/3 h-6 bg-black rounded-b-xl" />}
        <div className="flex items-center justify-end gap-2 w-1/3">
          <button
            onClick={() => {
              if (peerStatus === 'error' || peerStatus === 'disconnected') {
                window.location.reload()
              }
            }}
            className={`w-2 h-2 rounded-full ${peerStatus === 'connected' ? 'bg-green-500' :
                peerStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500 cursor-pointer animate-pulse'
              }`} title={`Red: ${peerStatus} (Click para reconectar)`} />
          {wifiEnabled ? (
            <Wifi size={14} className={connectedNetwork ? "text-white" : "text-gray-500"} />
          ) : (
            <WifiOff size={14} className="text-gray-600" />
          )}
          <Signal size={14} />
          <Battery size={14} />
        </div>
      </div>

      {notificationsOpen && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <div className="p-4 pt-12 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 text-white">
              <h2 className="text-xl font-bold">Notificaciones</h2>
              <button onClick={() => setNotificationsOpen(false)} className="p-2 bg-gray-800 rounded-full">
                <ChevronDown />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {notifications.length === 0 && <p className="text-gray-500 text-center mt-10">Sin notificaciones</p>}
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.appId) {
                      setActiveApp(n.appId)
                      setNotificationsOpen(false)
                    }
                  }}
                  className="bg-gray-800/80 p-4 rounded-xl border border-gray-700/50 shadow-lg cursor-pointer hover:bg-gray-700/80 transition-colors active:scale-95"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-blue-400 capitalize">{n.appId || 'Sistema'}</span>
                    <span className="text-xs text-gray-500">{n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h4 className="font-medium text-white mt-1">{n.title}</h4>
                  <p className="text-sm text-gray-300 mt-1">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`w-full h-full pt-8 pb-20 ${theme === 'android' ? 'pb-16' : ''}`}>
        {activeApp ? <AppWindow appId={activeApp} /> : <HomeScreen />}
      </div>

      <Taskbar />
    </div>
  )
}