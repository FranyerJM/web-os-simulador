'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type Peer from 'peerjs'
import type { DataConnection, MediaConnection } from 'peerjs'

import { appsConfig } from '@/lib/apps-config'

// --- TIPOS ---
export type OSTheme = 'android' | 'ios' | 'pc'

export interface InstalledApp {
  id: string;
  name: string;
  url?: string;
  favicon?: string;
  isNative: boolean;
  icon?: string;
  color?: string;
}
export interface Notification { id: string; title: string; message: string; timestamp: Date; read: boolean; appId?: string }
export interface Photo { id: string; dataUrl: string; timestamp: Date }
export interface Contact { id: string; name: string; number: string }
export interface Message { id: string; contactId?: string; number: string; text: string; time: string; isOwn: boolean }
export interface WebAppCredentials { [appId: string]: { username?: string; password?: string } }
export interface Network { ssid: string; strength: number; isSecured: boolean }
export interface AppPermissions {
  notifications: boolean;
  credentials: boolean;
  camera: boolean;
  microphone: boolean;
  audio: boolean;
}

export interface AppStorage {
  cacheSize: string;
  localStorageSize: string;
  cacheFileId?: string;
}

export interface AppSettings {
  permissions: AppPermissions;
  storage: AppStorage;
}

export interface CallState {
  number: string;
  name?: string;
  status: 'dialing' | 'incoming' | 'connected' | 'ended';
  startTime?: number;
  isMuted: boolean;
  isRecording: boolean;
  remoteStream?: MediaStream;
  localStream?: MediaStream;
  callConnection?: MediaConnection;
}

interface OSContextType {
  theme: OSTheme; setTheme: (t: OSTheme) => void
  wallpaper: string; setWallpaper: (u: string) => void
  installedApps: InstalledApp[]; installApp: (a: InstalledApp) => void; uninstallApp: (id: string) => void; updateAppColor: (id: string, color: string) => void
  activeApp: string | null; setActiveApp: (id: string | null) => void; previousApp: string | null; goBack: () => void
  notifications: Notification[]; addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void; markNotificationRead: (id: string) => void
  darkMode: boolean; setDarkMode: (v: boolean) => void
  photos: Photo[]; addPhoto: (d: string) => void; deletePhoto: (id: string) => void; deletePhotos: (ids: string[]) => void
  contacts: Contact[]; addContact: (c: Omit<Contact, 'id'>) => void
  messages: Message[]; addMessage: (m: Omit<Message, 'id'>) => void; clearMessages: () => void
  credentials: WebAppCredentials; setCredentials: (id: string, c: any) => void; getCredentials: (id: string) => any
  pin: string | null; setPin: (p: string) => void; isPinVerified: boolean; verifyPin: (s: boolean) => void
  wifiEnabled: boolean; setWifiEnabled: (e: boolean) => void; connectedNetwork: string | null; connectToNetwork: (s: string) => void; availableNetworks: Network[]; scanNetworks: () => void
  myPhoneNumber: string
  activeCall: CallState | null; startCall: (n: string) => void; acceptCall: () => void; endCall: () => void; toggleMute: () => void; toggleRecord: () => void
  peerStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  reconnectPeer: () => void
  pendingChat: string | null; setPendingChat: (n: string | null) => void

  // New App Settings
  appSettings: Record<string, AppSettings>;
  toggleAppPermission: (appId: string, permission: keyof AppPermissions) => void;
  clearAppCache: (appId: string) => void;

  // Files State
  callRecordings: { id: string, name: string, date: string, size: string }[];
  downloadedFiles: { id: string, name: string, type: string, size: string }[];
  addDownloadedFile: (file: { name: string, type: string, size: string }) => void;
  deleteRecording: (id: string) => void;
  deleteDownloadedFile: (id: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined)

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- ESTADOS ---
  const [theme, setTheme] = useState<OSTheme>('android')
  const [wallpaper, setWallpaper] = useState('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
  const [darkMode, setDarkMode] = useState(true)
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [previousApp, setPreviousApp] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  const [activeCall, setActiveCall] = useState<CallState | null>(null)
  const [myPhoneNumber, setMyPhoneNumber] = useState<string>('')

  const [credentials, setCredentialsState] = useState<WebAppCredentials>({})
  const [pin, setPinState] = useState<string | null>(null)
  const [isPinVerified, setIsPinVerified] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [connectedNetwork, setConnectedNetwork] = useState<string | null>(null)
  const [availableNetworks, setAvailableNetworks] = useState<Network[]>([])

  const [installedApps, setInstalledApps] = useState<InstalledApp[]>(() => {
    return appsConfig.defaultApps.map(app => ({
      id: app.id,
      name: app.name,
      isNative: true,
      icon: app.icon,
      color: app.color
    }))
  })

  const [appSettings, setAppSettings] = useState<Record<string, AppSettings>>({})

  // Initialize app settings for new apps
  useEffect(() => {
    setAppSettings(prev => {
      const newSettings = { ...prev }
      installedApps.forEach(app => {
        if (!newSettings[app.id]) {
          newSettings[app.id] = {
            permissions: {
              notifications: true,
              credentials: true,
              camera: false,
              microphone: false,
              audio: true
            },
            storage: {
              cacheSize: `${(Math.random() * 50 + 10).toFixed(1)} MB`,
              localStorageSize: `${(Math.random() * 5 + 0.1).toFixed(1)} MB`,
              cacheFileId: `cache-${app.id}`
            }
          }
        }
      })
      return newSettings
    })
  }, [installedApps])

  const toggleAppPermission = useCallback((appId: string, permission: keyof AppPermissions) => {
    setAppSettings(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        permissions: {
          ...prev[appId].permissions,
          [permission]: !prev[appId].permissions[permission]
        }
      }
    }))
  }, [])

  const clearAppCache = useCallback((appId: string) => {
    setAppSettings(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        storage: {
          ...prev[appId].storage,
          cacheSize: '0 B',
          localStorageSize: '0 B'
        }
      }
    }))
    addNotification({ title: 'Sistema', message: 'Caché eliminada correctamente', appId: 'settings' })
  }, [])

  const peerRef = useRef<Peer | null>(null)
  const [pendingChat, setPendingChat] = useState<string | null>(null)

  // --- FUNCIONES BASE ---
  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(p => [{ ...n, id: Math.random().toString(), timestamp: new Date(), read: false }, ...p])
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const addPhoto = useCallback((d: string) => setPhotos(p => [{ id: Math.random().toString(), dataUrl: d, timestamp: new Date() }, ...p]), [])
  const deletePhoto = useCallback((id: string) => setPhotos(p => p.filter(photo => photo.id !== id)), [])
  const deletePhotos = useCallback((ids: string[]) => setPhotos(p => p.filter(photo => !ids.includes(photo.id))), [])
  const clearMessages = useCallback(() => setMessages([]), [])

  const setCredentials = useCallback((id: string, c: any) => {
    setCredentialsState(p => { const n = { ...p, [id]: c }; if (typeof window !== 'undefined') localStorage.setItem('os_creds', JSON.stringify(n)); return n })
  }, [])
  const getCredentials = useCallback((id: string) => credentials[id], [credentials])

  const setPin = useCallback((p: string) => { setPinState(p); if (typeof window !== 'undefined') localStorage.setItem('os_pin', p); setIsPinVerified(true) }, [])

  const installApp = useCallback((app: InstalledApp) => {
    setInstalledApps(prev => {
      if (!prev.find(a => a.id === app.id)) {
        const n = [...prev, app]; if (typeof window !== 'undefined') localStorage.setItem('os_apps', JSON.stringify(n)); return n
      } return prev
    })
  }, [])

  const uninstallApp = useCallback((id: string) => {
    setInstalledApps(prev => { const n = prev.filter(a => a.id !== id); if (typeof window !== 'undefined') localStorage.setItem('os_apps', JSON.stringify(n)); return n })
  }, [])

  const updateAppColor = useCallback((id: string, color: string) => {
    setInstalledApps(prev => {
      const n = prev.map(a => a.id === id ? { ...a, color } : a)
      if (typeof window !== 'undefined') {
        const nonNative = n.filter(a => !a.isNative)
        localStorage.setItem('os_apps', JSON.stringify(nonNative))
      }
      return n
    })
  }, [])

  const handleSetActiveApp = useCallback((id: string | null) => { if (id && id !== activeApp) setPreviousApp(activeApp); setActiveApp(id) }, [activeApp])
  const goBack = useCallback(() => { if (previousApp) { setActiveApp(previousApp); setPreviousApp(null) } else setActiveApp(null) }, [previousApp])

  const addContact = useCallback((c: Omit<Contact, 'id'>) => {
    setContacts(p => { const n = [...p, { ...c, id: Math.random().toString() }]; if (typeof window !== 'undefined') localStorage.setItem('os_contacts', JSON.stringify(n)); return n })
  }, [])

  const [peerStatus, setPeerStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')

  // --- INICIALIZACIÓN DE ID ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize ID from session storage or generate new one
    let num = sessionStorage.getItem('os_phone_number')
    if (!num) {
      num = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('os_phone_number', num)
    }
    setMyPhoneNumber(num)

    // Load other persisted state
    const c = localStorage.getItem('os_contacts'); if (c) setContacts(JSON.parse(c))
    const p = localStorage.getItem('os_pin'); if (p) setPinState(p)
    const cr = localStorage.getItem('os_creds'); if (cr) setCredentialsState(JSON.parse(cr))
    const apps = localStorage.getItem('os_apps');
    if (apps) {
      try {
        const parsed = JSON.parse(apps)
        setInstalledApps(prev => [...prev, ...parsed.filter((a: any) => !prev.find(p => p.id === a.id))])
      } catch (e) { }
    }
  }, [])

  // --- INICIALIZACIÓN DE PEERJS ---
  useEffect(() => {
    if (typeof window === 'undefined' || !myPhoneNumber) return;

    let isCancelled = false;
    setPeerStatus('connecting')

    console.log("Initializing PeerJS with ID:", myPhoneNumber)

    // Clean up previous instance if exists (should be handled by cleanup, but double check)
    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
    }

    import('peerjs').then(({ default: Peer }) => {
      if (isCancelled) return;

      const peer = new Peer(myPhoneNumber, {
        debug: 2,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      })

      peerRef.current = peer

      peer.on('open', (id) => {
        if (isCancelled) return;
        console.log('My peer ID is: ' + id)
        setPeerStatus('connected')
        addNotification({ title: 'Sistema', message: `Conectado a la Red: ${id}`, appId: 'settings' })
      })

      peer.on('connection', (conn) => {
        if (isCancelled) return;
        console.log("Incoming connection from:", conn.peer)
        conn.on('data', (data: any) => {
          console.log("Received data:", data)
          if (data.type === 'chat') {
            const contact = contacts.find(c => c.number === conn.peer)
            setMessages(prev => [...prev, {
              id: Math.random().toString(),
              number: conn.peer,
              text: data.text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isOwn: false,
              contactId: contact?.id
            }])
            addNotification({ title: contact ? contact.name : conn.peer, message: data.text, appId: 'messages' })
          }
        })
        conn.on('error', (err) => console.error("Connection error:", err))
      })

      peer.on('call', (call) => {
        if (isCancelled) return;
        console.log("Incoming call from:", call.peer)
        setActiveCall(prev => {
          if (prev && prev.status !== 'ended') {
            console.warn("Call rejected, already in call")
            call.close()
            return prev;
          }

          const contact = contacts.find(c => c.number === call.peer)
          return {
            number: call.peer,
            name: contact?.name,
            status: 'incoming',
            isMuted: false,
            isRecording: false,
            callConnection: call
          }
        })
      })

      peer.on('error', (err: any) => {
        if (isCancelled) return;
        console.error("PeerJS Error:", err)

        if (err.type === 'unavailable-id') {
          console.warn("ID taken, generating new one...")
          const newNum = Math.floor(100000 + Math.random() * 900000).toString();
          sessionStorage.setItem('os_phone_number', newNum)
          setMyPhoneNumber(newNum) // This will trigger the effect again with new ID
          return
        }

        setPeerStatus('error')
        addNotification({ title: 'Error de Red', message: `Error: ${err.type}`, appId: 'settings' })
      })

      peer.on('disconnected', () => {
        if (isCancelled) return;
        console.log("Peer disconnected, reconnecting...")
        setPeerStatus('disconnected')
        peer.reconnect()
      })

    }).catch(err => {
      if (isCancelled) return;
      console.error("Failed to load PeerJS", err)
      setPeerStatus('error')
    })

    return () => {
      isCancelled = true;
      if (peerRef.current) {
        peerRef.current.destroy()
        peerRef.current = null
      }
    }
  }, [myPhoneNumber]) // Re-run when ID changes

  // --- ACCIONES DE COMUNICACIÓN ---
  const startCall = useCallback((number: string) => {
    console.log("Attempting to start call to:", number)
    if (!peerRef.current) {
      console.error("PeerJS not initialized")
      addNotification({ title: 'Error', message: 'Sistema no inicializado', appId: 'phone' })
      return
    }
    if (peerStatus !== 'connected') {
      console.error("PeerJS not connected. Status:", peerStatus)
      addNotification({ title: 'Error', message: 'No hay conexión de red', appId: 'phone' })
      return
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia not supported")
      addNotification({ title: 'Error', message: 'Tu navegador no soporta llamadas', appId: 'phone' })
      return
    }

    console.log("Requesting microphone access...")
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
      console.log("Microphone access granted. Stream:", stream.id)

      try {
        console.log("Calling peer:", number)
        const call = peerRef.current!.call(number, stream)

        if (!call) {
          console.error("Peer.call returned null")
          throw new Error("Call creation failed")
        }

        const c = contacts.find(cnt => cnt.number === number)
        console.log("Setting active call state...")

        setActiveCall({
          number,
          name: c?.name,
          status: 'dialing',
          isMuted: false,
          isRecording: false,
          localStream: stream,
          callConnection: call
        })

        call.on('stream', (remoteStream) => {
          console.log("Received remote stream")
          setActiveCall(prev => prev ? { ...prev, status: 'connected', startTime: Date.now(), remoteStream } : null)
        })

        call.on('close', () => {
          console.log("Call closed")
          setActiveCall(null)
          stream.getTracks().forEach(track => track.stop())
        })

        call.on('error', (err) => {
          console.error("Call error:", err)
          setActiveCall(null)
          stream.getTracks().forEach(track => track.stop())
          addNotification({ title: 'Error', message: 'Error en la llamada', appId: 'phone' })
        })
      } catch (e) {
        console.error("Error during call creation:", e)
        stream.getTracks().forEach(track => track.stop())
        addNotification({ title: 'Error', message: 'Error al iniciar llamada', appId: 'phone' })
      }
    }).catch(err => {
      console.error('Failed to get local stream', err)
      addNotification({ title: 'Error', message: 'No se pudo acceder al micrófono', appId: 'phone' })
    })
  }, [contacts, addNotification, peerStatus])

  const acceptCall = useCallback(() => {
    if (activeCall?.status === 'incoming' && activeCall.callConnection) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addNotification({ title: 'Error', message: 'Tu navegador no soporta llamadas', appId: 'phone' })
        return
      }

      navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
        activeCall.callConnection!.answer(stream)

        activeCall.callConnection!.on('stream', (remoteStream) => {
          setActiveCall(prev => prev ? { ...prev, status: 'connected', startTime: Date.now(), remoteStream, localStream: stream } : null)
        })

        activeCall.callConnection!.on('close', () => {
          setActiveCall(null)
          stream.getTracks().forEach(track => track.stop())
        })

      }).catch(err => {
        console.error('Failed to get local stream', err)
      })
    }
  }, [activeCall, addNotification])

  const endCall = useCallback(() => {
    if (activeCall) {
      if (activeCall.callConnection) {
        activeCall.callConnection.close()
      }
      if (activeCall.localStream) {
        activeCall.localStream.getTracks().forEach(track => track.stop())
      }
      setActiveCall(null)
    }
  }, [activeCall])

  const addMessage = useCallback((m: Omit<Message, 'id'>) => {
    setMessages(p => [...p, { ...m, id: Math.random().toString() }])
    if (m.isOwn && peerRef.current) {
      try {
        const conn = peerRef.current.connect(m.number, { reliable: true })
        if (conn) {
          conn.on('open', () => {
            conn.send({ type: 'chat', text: m.text })
            setTimeout(() => conn.close(), 1000)
          })
          conn.on('error', (err) => {
            console.error("Connection error", err)
            addNotification({ title: 'Error', message: 'No se pudo enviar el mensaje', appId: 'messages' })
          })
        }
      } catch (e) {
        console.error("Failed to connect", e)
        addNotification({ title: 'Error', message: 'Error de conexión', appId: 'messages' })
      }
    }
  }, [addNotification])

  const toggleMute = () => {
    setActiveCall(p => {
      if (p && p.localStream) {
        p.localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled)
        return { ...p, isMuted: !p.isMuted }
      }
      return p
    })
  }

  // --- NUEVOS ESTADOS PARA ARCHIVOS ---
  const [callRecordings, setCallRecordings] = useState<{ id: string, name: string, date: string, size: string }[]>([])
  const [downloadedFiles, setDownloadedFiles] = useState<{ id: string, name: string, type: string, size: string }[]>([])

  const toggleRecord = useCallback(() => {
    setActiveCall(p => {
      if (!p) return null

      // Si estamos deteniendo la grabación, guardamos el archivo
      if (p.isRecording) {
        const newRecording = {
          id: Math.random().toString(),
          name: `Llamada_${p.name || p.number}_${new Date().toLocaleTimeString().replace(/:/g, '-')}.mp3`,
          date: new Date().toISOString(),
          size: `${(Math.random() * 5 + 1).toFixed(1)} MB`
        }
        setCallRecordings(prev => [newRecording, ...prev])
        addNotification({ title: 'Grabación Guardada', message: newRecording.name, appId: 'phone' })
      }

      return { ...p, isRecording: !p.isRecording }
    })
  }, [addNotification])

  const addDownloadedFile = useCallback((file: { name: string, type: string, size: string }) => {
    setDownloadedFiles(prev => [{ ...file, id: Math.random().toString() }, ...prev])
    addNotification({ title: 'Descarga Completada', message: file.name, appId: 'browser' })
  }, [addNotification])

  const deleteRecording = useCallback((id: string) => {
    setCallRecordings(prev => prev.filter(rec => rec.id !== id))
    addNotification({ title: 'Grabación Eliminada', message: 'La grabación se ha eliminado', appId: 'files' })
  }, [addNotification])

  const deleteDownloadedFile = useCallback((id: string) => {
    setDownloadedFiles(prev => prev.filter(file => file.id !== id))
    addNotification({ title: 'Archivo Eliminado', message: 'El archivo se ha eliminado', appId: 'files' })
  }, [addNotification])

  // --- ACCIONES DE WI-FI ---
  const scanNetworks = useCallback(() => {
    setAvailableNetworks([])
    setTimeout(() => setAvailableNetworks([{ ssid: 'Casa_WiFi', strength: 3, isSecured: true }, { ssid: 'Oficina_5G', strength: 3, isSecured: true }, { ssid: 'Public_Free', strength: 2, isSecured: false }]), 2000)
  }, [])

  const connectToNetwork = useCallback((ssid: string) => {
    setTimeout(() => {
      setConnectedNetwork(ssid)
      addNotification({ title: 'Conectado', message: `Wi-Fi: ${ssid}`, appId: 'settings' })
    }, 1000)
  }, [addNotification])

  return (
    <OSContext.Provider value={{
      theme, setTheme, wallpaper, setWallpaper, installedApps, installApp, uninstallApp, updateAppColor,
      activeApp, setActiveApp: handleSetActiveApp, previousApp, goBack,
      notifications, addNotification, markNotificationRead,
      darkMode, setDarkMode, photos, addPhoto, deletePhoto, deletePhotos,
      contacts, addContact, messages, addMessage, clearMessages,
      credentials, setCredentials, getCredentials,
      pin, setPin, isPinVerified, verifyPin: setIsPinVerified,
      wifiEnabled, setWifiEnabled, connectedNetwork, connectToNetwork, availableNetworks, scanNetworks,
      myPhoneNumber, activeCall, startCall, acceptCall, endCall, toggleMute, toggleRecord,
      peerStatus, reconnectPeer: () => {
        if (peerRef.current) peerRef.current.destroy()
        window.location.reload()
      },
      pendingChat, setPendingChat,
      appSettings, toggleAppPermission, clearAppCache,
      callRecordings, downloadedFiles, addDownloadedFile, deleteRecording, deleteDownloadedFile
    }}>
      {children}
    </OSContext.Provider>
  )
}
export const useOS = () => { const c = useContext(OSContext); if (!c) throw new Error('useOS missing'); return c }