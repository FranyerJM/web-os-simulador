import { useOS } from '@/context/os-context'
import { InstalledApp } from '@/context/os-context'
import { KeyRound, ShieldCheck, Bell, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState, useEffect } from 'react'

interface WebBrowserProps {
   app: InstalledApp
}

export const WebBrowser = ({ app }: WebBrowserProps) => {
   const { credentials, setCredentials, getCredentials, addNotification, addDownloadedFile } = useOS()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [isCredsOpen, setIsCredsOpen] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [isControlsVisible, setIsControlsVisible] = useState(false)
   const [isLoading, setIsLoading] = useState(false)

   useEffect(() => {
      const creds = getCredentials(app.id)
      setUsername(creds?.username || '')
      setPassword(creds?.password || '')
   }, [app.id, getCredentials])

   const handleSave = () => {
      setCredentials(app.id, { username, password })
      setIsCredsOpen(false)
   }

   const simulateWebNotification = () => {
      addNotification({
         title: app.name,
         message: `Nueva notificación de ${app.name}`,
         appId: 'browser'
      })
   }

   const handleRefresh = () => {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 1000)
   }

   const hasCreds = !!getCredentials(app.id)?.username
   const isBlockedUrl = (url?: string) => url && (url.includes('google.com') || url.includes('youtube.com') || url.includes('spotify.com'))

   return (
      <div className="w-full h-full flex flex-col bg-black">
         <div className={`transition-all duration-300 ease-in-out bg-gray-900 border-b border-gray-800 z-10 relative ${isControlsVisible ? 'p-2' : 'h-0 overflow-hidden border-none'}`}>
            <div className="flex items-center gap-2">
               <div className="flex-1 bg-gray-800 rounded-lg h-8 px-3 flex items-center gap-2 text-xs text-gray-300 overflow-hidden">
                  <span className="text-green-500">🔒</span>
                  <span className="truncate">{app.url || 'about:blank'}</span>
               </div>
               <button onClick={simulateWebNotification} className="p-2 text-gray-400 hover:text-white">
                  <Bell size={16} />
               </button>
               <button onClick={handleRefresh} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <RefreshCw size={16} className={`text-gray-600 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
               </button>

               <button
                  onClick={() => {
                     const types = ['pdf', 'jpg', 'png', 'zip', 'docx']
                     const type = types[Math.floor(Math.random() * types.length)]
                     addDownloadedFile({
                        name: `archivo_descargado_${Math.floor(Math.random() * 1000)}.${type}`,
                        type: type === 'jpg' || type === 'png' ? 'image' : 'document',
                        size: `${(Math.random() * 10 + 0.5).toFixed(1)} MB`
                     })
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Simular Descarga"
               >
                  <Download size={16} className="text-gray-600 dark:text-gray-300" />
               </button>
               <Dialog open={isCredsOpen} onOpenChange={setIsCredsOpen}>
                  <DialogTrigger asChild>
                     <button className={`p-2 rounded-lg transition-all ${hasCreds ? 'text-green-400' : 'text-gray-400'}`}>
                        {hasCreds ? <ShieldCheck size={18} /> : <KeyRound size={18} />}
                     </button>
                  </DialogTrigger>
                  <DialogContent className="w-[90%] rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                     <DialogHeader><DialogTitle>Bóveda: {app.name}</DialogTitle></DialogHeader>
                     <div className="space-y-4 py-4">
                        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm" placeholder="Usuario" />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm" placeholder="Contraseña" />
                        <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Guardar</button>
                     </div>
                  </DialogContent>
               </Dialog>
            </div>
         </div>

         {/* Toggle Button */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
            <button
               onClick={() => setIsControlsVisible(!isControlsVisible)}
               className="bg-gray-900/80 backdrop-blur text-white px-3 py-1 rounded-b-lg shadow-lg hover:bg-gray-800 transition-colors"
            >
               {isControlsVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
         </div>

         <div className="flex-1 bg-white relative overflow-hidden">
            {isBlockedUrl(app.url) ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50 text-gray-600">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h3 className="font-bold text-lg">Conexión Rechazada</h3>
                  <p className="text-sm mt-2">Sitios como Google/Spotify bloquean iframes.</p>
               </div>
            ) : (
               <iframe
                  src={app.url}
                  className="w-[calc(100%+20px)] h-full border-0 no-scrollbar"
                  title={app.name}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation allow-modals"
                  allow="storage-access *; cookies *"
               />
            )}
         </div>
      </div>
   )
}