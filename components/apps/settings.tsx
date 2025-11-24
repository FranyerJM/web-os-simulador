'use client'

import { useOS } from '@/context/os-context'
import { useState } from 'react'
import { PinPad } from '@/components/ui/pin-pad'
import { Lock, Shield, Wifi, RefreshCw, Check, Smartphone, LayoutGrid, ChevronRight, Trash2, HardDrive } from 'lucide-react'

export const Settings = () => {
  const {
    theme, setTheme, wallpaper, setWallpaper, darkMode, setDarkMode,
    getCredentials, installedApps,
    pin, setPin, isPinVerified, verifyPin,
    wifiEnabled, setWifiEnabled, availableNetworks, connectedNetwork, connectToNetwork, scanNetworks
  } = useOS()

  const [activeSection, setActiveSection] = useState('wifi')
  const [showPinPad, setShowPinPad] = useState(false)
  const [pinMode, setPinMode] = useState<'verify' | 'create'>('verify')
  const [wifiPassword, setWifiPassword] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)

  const webApps = installedApps.filter(app => !app.isNative)

  const handleAccessCredentials = () => {
    if (!pin) { setPinMode('create'); setShowPinPad(true); }
    else if (!isPinVerified) { setPinMode('verify'); setShowPinPad(true); }
  }

  const handleConnectWifi = () => {
    if (selectedNetwork) {
      connectToNetwork(selectedNetwork)
      setSelectedNetwork(null)
      setWifiPassword('')
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex gap-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 overflow-x-auto scrollbar-hide">
        {[
          { id: 'wifi', icon: Wifi, label: 'Wi-Fi' },
          { id: 'display', icon: Smartphone, label: 'Pantalla' },
          { id: 'credentials', icon: Shield, label: 'Seguridad' },
          { id: 'apps', icon: LayoutGrid, label: 'Apps' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex-1 min-w-[80px] px-2 py-3 text-xs font-semibold flex flex-col items-center gap-1 ${activeSection === item.id ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500'
              }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'wifi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <span className="font-medium dark:text-white">Wi-Fi</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={wifiEnabled} onChange={(e) => setWifiEnabled(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {wifiEnabled && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Redes</h3>
                  <button onClick={scanNetworks} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"><RefreshCw size={16} /></button>
                </div>
                {availableNetworks.length === 0 ? <div className="text-center py-8 text-gray-400">Buscando redes...</div> :
                  availableNetworks.map((net) => (
                    <div key={net.ssid} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border dark:border-gray-700">
                      <button onClick={() => net.ssid === connectedNetwork ? null : setSelectedNetwork(net.ssid)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-3">
                          <Wifi size={20} className={net.ssid === connectedNetwork ? "text-blue-500" : "text-gray-400"} />
                          <span className={`font-medium ${net.ssid === connectedNetwork ? 'text-blue-500' : 'dark:text-white'}`}>{net.ssid}</span>
                        </div>
                        {net.ssid === connectedNetwork && <Check size={18} className="text-blue-500" />}
                      </button>
                      {selectedNetwork === net.ssid && net.ssid !== connectedNetwork && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 animate-in slide-in-from-top">
                          <input type="password" placeholder="Contraseña" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="w-full p-2 mb-2 border rounded dark:bg-gray-800 dark:text-white text-sm" />
                          <div className="flex gap-2">
                            <button onClick={handleConnectWifi} className="flex-1 bg-blue-500 text-white py-2 rounded text-sm font-bold">Conectar</button>
                            <button onClick={() => setSelectedNetwork(null)} className="flex-1 bg-gray-300 dark:bg-gray-700 py-2 rounded text-sm">Cancelar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}

        {activeSection === 'display' && (
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Fondo</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setWallpaper('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')} className="aspect-square rounded-lg bg-gradient-to-br from-blue-400 to-purple-600" />
              <button onClick={() => setWallpaper('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')} className="aspect-square rounded-lg bg-gradient-to-br from-pink-300 to-red-400" />
              <button onClick={() => setWallpaper('black')} className="aspect-square rounded-lg bg-black border border-gray-600" />
            </div>
            <label className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <span className="font-medium dark:text-white">Modo Oscuro</span>
              <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} className="accent-blue-500 w-5 h-5" />
            </label>
          </div>
        )}

        {activeSection === 'credentials' && (
          <div className="space-y-4">
            {(!pin || !isPinVerified) ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                <Lock size={40} className="mx-auto text-gray-300 mb-4" />
                <button onClick={handleAccessCredentials} className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium">{pin ? 'Desbloquear' : 'Crear PIN'}</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                  <p className="text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2"><Shield size={16} /> Desbloqueado</p>
                  <button onClick={() => verifyPin(false)} className="text-red-500 text-xs mt-2 underline">Bloquear</button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-500 uppercase px-2">Apps Web</h4>
                  {webApps.length === 0 && <p className="text-center text-gray-400 text-xs">No hay apps instaladas</p>}
                  {webApps.map((app) => (
                    <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between border dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <img src={app.favicon || '/placeholder.svg'} alt="" className="w-6 h-6 rounded" />
                        <span className="font-medium text-sm dark:text-white">{app.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{getCredentials(app.id) ? '● Guardado' : 'Vacío'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'apps' && (
          <AppsSettings />
        )}
      </div>

      {showPinPad && (
        <PinPad
          savedPin={pin}
          isSettingNew={pinMode === 'create'}
          onSetPin={setPin}
          onSuccess={() => { verifyPin(true); setShowPinPad(false); }}
          onCancel={() => setShowPinPad(false)}
        />
      )}
    </div>
  )
}

const AppsSettings = () => {
  const { installedApps, appSettings, toggleAppPermission, clearAppCache, uninstallApp, updateAppColor } = useOS()
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  const selectedApp = selectedAppId ? installedApps.find(a => a.id === selectedAppId) : null
  const settings = selectedAppId ? appSettings[selectedAppId] : null

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA15E', '#BC6C25', '#E8B4B8', '#9D84B7', '#A8D8EA',
    '#FF5722', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#00BCD4', '#009688', '#4CAF50', '#8BC34A'
  ]

  if (selectedApp && settings) {
    return (
      <div className="space-y-4 animate-in slide-in-from-right">
        <button onClick={() => setSelectedAppId(null)} className="flex items-center gap-2 text-blue-500 font-medium mb-2">
          <ChevronRight className="rotate-180" size={20} /> Volver
        </button>

        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
            style={{ backgroundColor: selectedApp.color || (selectedApp.isNative ? '#f3f4f6' : '#f3f4f6') }}
          >
            {selectedApp.favicon ? <img src={selectedApp.favicon} className="w-10 h-10" /> : (selectedApp.icon || (selectedApp.isNative ? '📱' : '🌐'))}
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">{selectedApp.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Versión 1.0.0 • {selectedApp.isNative ? 'Sistema' : 'Web App'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-500 uppercase px-2">Color del Icono</h4>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
            <div className="grid grid-cols-5 gap-3 mb-4">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateAppColor(selectedApp.id, color)}
                  className={`w-full aspect-square rounded-lg transition-all hover:scale-110 ${selectedApp.color === color ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                    }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Color personalizado</span>
                <input
                  type="color"
                  value={selectedApp.color || '#f3f4f6'}
                  onChange={(e) => updateAppColor(selectedApp.id, e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </label>
              <button
                onClick={() => updateAppColor(selectedApp.id, '#f3f4f6')}
                className="px-3 py-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-500 uppercase px-2">Permisos</h4>
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border dark:border-gray-700 divide-y dark:divide-gray-700">
            {Object.entries(settings.permissions).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <span className="capitalize dark:text-gray-200">{key === 'credentials' ? 'Guardar Contraseñas' : key}</span>
                <div className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                  <input type="checkbox" checked={value} onChange={() => toggleAppPermission(selectedApp.id, key as any)} className="sr-only" />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : ''}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-500 uppercase px-2">Almacenamiento</h4>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-3">
              <HardDrive size={24} className="text-gray-400" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="dark:text-gray-300">Caché</span>
                  <span className="font-medium dark:text-white">{settings.storage.cacheSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="dark:text-gray-300">Datos</span>
                  <span className="font-medium dark:text-white">{settings.storage.localStorageSize}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs text-gray-500 font-mono break-all">
              📂 Archivos/System/{settings.storage.cacheFileId}.dat
            </div>

            <button
              onClick={() => clearAppCache(selectedApp.id)}
              className="w-full py-2 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Borrar Caché
            </button>
          </div>
        </div>

        {!selectedApp.isNative && (
          <button
            onClick={() => {
              uninstallApp(selectedApp.id)
              setSelectedAppId(null)
            }}
            className="w-full py-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Desinstalar Aplicación
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2 animate-in slide-in-from-right">
      <h3 className="font-bold text-gray-900 dark:text-white mb-3 px-2">Aplicaciones Instaladas</h3>
      <div className="space-y-2">
        {installedApps.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppId(app.id)}
            className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl flex items-center gap-3 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: app.color || (app.isNative ? '#f3f4f6' : '#f3f4f6') }}
            >
              {app.favicon ? <img src={app.favicon} className="w-6 h-6" /> : (app.icon || (app.isNative ? '📱' : '🌐'))}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm dark:text-white">{app.name}</h4>
              <p className="text-xs text-gray-400">{appSettings[app.id]?.storage.cacheSize || '0 MB'}</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  )
}