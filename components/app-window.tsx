'use client'

import { useOS } from '@/context/os-context'
import { Calculator } from '@/components/apps/calculator'
import { Calendar } from '@/components/apps/calendar'
import { Messages } from '@/components/apps/messages'
import { Phone } from '@/components/apps/phone'
import { PacMan } from '@/components/apps/pacman'
import { Files } from '@/components/apps/files'
import { Camera } from '@/components/apps/camera'
import { Gallery } from '@/components/apps/gallery'
import { Settings } from '@/components/apps/settings'
import { Store } from '@/components/apps/store'
import { WebBrowser } from '@/components/apps/web-browser'

const APP_COMPONENTS: Record<string, React.ComponentType<any>> = {
  calculator: Calculator,
  calendar: Calendar,
  messages: Messages,
  phone: Phone,
  pacman: PacMan,
  files: Files,
  camera: Camera,
  gallery: Gallery,
  settings: Settings,
  store: Store,
}

interface AppWindowProps {
  appId: string
}

export const AppWindow = ({ appId }: AppWindowProps) => {
  const { installedApps } = useOS()
  
  const app = installedApps.find(a => a.id === appId)
  const AppComponent = APP_COMPONENTS[appId]

  if (!app) {
    return <div className="w-full h-full flex items-center justify-center text-white">App not found</div>
  }

  if (!app.isNative && app.url) {
    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
        <div className="flex-1 overflow-auto">
          <WebBrowser app={app} />
        </div>
      </div>
    )
  }

  if (!AppComponent) {
    return <div className="w-full h-full flex items-center justify-center text-white">App not found</div>
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <AppComponent />
      </div>
    </div>
  )
}
