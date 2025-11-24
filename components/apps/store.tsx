'use client'

import { useOS } from '@/context/os-context'
import { useEffect, useState } from 'react'
import { appsConfig, StoreApp } from '@/lib/apps-config'
import { Loader2, Plus } from 'lucide-react'

export const Store = () => {
  const { installedApps, installApp, uninstallApp } = useOS()
  const [storeApps, setStoreApps] = useState<StoreApp[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newApp, setNewApp] = useState({ name: '', url: '', favicon: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setStoreApps(appsConfig.storeApps)
  }, [])

  const isInstalled = (appId: string) => {
    return installedApps.some((a) => a.id === appId)
  }

  const handleInstall = (app: StoreApp) => {
    if (!isInstalled(app.id)) {
      installApp({
        id: app.id,
        name: app.name,
        url: app.url,
        favicon: app.favicon,
        isNative: false,
      })
    }
  }

  const handleUninstall = (appId: string) => {
    uninstallApp(appId)
  }

  const handleAddCustomApp = async () => {
    if (newApp.url) {
      setIsLoading(true)
      try {
        let customApp: StoreApp;
        // Si el usuario proporciona un favicon, usarlo directamente
        if (newApp.favicon) {
          customApp = {
            id: `custom-${Date.now()}`,
            name: newApp.name || 'App Web',
            url: newApp.url,
            favicon: newApp.favicon,
            description: 'App web personalizada',
          }

          setStoreApps(prev => [...prev, customApp])
          handleInstall(customApp)
          setNewApp({ name: '', url: '', favicon: '' })
          setShowAddForm(false)
        } else {
          // Intentar obtener metadatos automáticamente
          const res = await fetch(`/api/metadata?url=${encodeURIComponent(newApp.url)}`)
          const data = await res.json()

          customApp = {
            id: `custom-${Date.now()}`,
            name: newApp.name || data.title || 'App Web',
            url: data.url || newApp.url,
            favicon: data.favicon,
            description: 'App web personalizada',
          }

          setStoreApps(prev => [...prev, customApp])
          handleInstall(customApp)
          setNewApp({ name: '', url: '', favicon: '' })
          setShowAddForm(false)
        }
      } catch (error) {
        alert('Error al conectar con la URL')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-blue-50 dark:from-gray-800 to-white dark:to-gray-900">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold">🛍️ Store</h2>
        <p className="text-sm opacity-90 mt-2">Instala tus apps web favoritas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full p-4 border-2 border-dashed border-blue-400 rounded-lg text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Agregar app web personalizada
          </button>

          {showAddForm && (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 shadow-lg border border-gray-100 dark:border-gray-700">
              <input
                type="url"
                placeholder="URL (ej: twitch.tv)"
                value={newApp.url}
                onChange={(e) => setNewApp({ ...newApp, url: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              />
              <input
                type="text"
                placeholder="Nombre (Opcional)"
                value={newApp.name}
                onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              />
              <input
                type="url"
                placeholder="URL del Icono (Opcional)"
                value={newApp.favicon}
                onChange={(e) => setNewApp({ ...newApp, favicon: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomApp}
                  disabled={isLoading || !newApp.url}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 font-semibold disabled:opacity-50 flex justify-center items-center"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  {isLoading ? 'Procesando...' : 'Instalar'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {storeApps.map((app) => (
            <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={app.favicon || "/placeholder.svg"}
                  alt={app.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white">{app.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.url}</p>
              </div>

              <button
                onClick={() =>
                  isInstalled(app.id)
                    ? handleUninstall(app.id)
                    : handleInstall(app)
                }
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors text-sm ${isInstalled(app.id)
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
              >
                {isInstalled(app.id) ? 'Desinstalar' : 'Instalar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}