'use client'

import { useOS } from '@/context/os-context'

interface NotificationCenterProps {
  onClose: () => void
}

export const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const { notifications, markNotificationRead } = useOS()

  return (
    <div className="absolute top-12 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No hay notificaciones
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                notif.read
                  ? 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40'
              }`}
            >
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                {notif.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {notif.message}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-2 block">
                {notif.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      <button
        onClick={onClose}
        className="w-full p-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Cerrar
      </button>
    </div>
  )
}
