export interface DefaultApp {
  id: string
  name: string
  icon: string
  category: string
  color: string
}

export interface StoreApp {
  id: string
  name: string
  url: string
  favicon: string
  description: string
}

export interface AppsConfig {
  defaultApps: DefaultApp[]
  storeApps: StoreApp[]
}

export const appsConfig: AppsConfig = {
  defaultApps: [
    {
      id: 'calculator',
      name: 'Calculadora',
      icon: '🧮',
      category: 'utilities',
      color: '#FF6B6B',
    },
    {
      id: 'calendar',
      name: 'Calendario',
      icon: '📅',
      category: 'utilities',
      color: '#4ECDC4',
    },
    {
      id: 'messages',
      name: 'Mensajes',
      icon: '💬',
      category: 'communication',
      color: '#45B7D1',
    },
    {
      id: 'phone',
      name: 'Llamadas',
      icon: '☎️',
      category: 'communication',
      color: '#96CEB4',
    },
    {
      id: 'pacman',
      name: 'Pac-Man',
      icon: '👾',
      category: 'games',
      color: '#FFEAA7',
    },
    {
      id: 'files',
      name: 'Archivos',
      icon: '📁',
      category: 'utilities',
      color: '#DDA15E',
    },
    {
      id: 'camera',
      name: 'Cámara',
      icon: '📷',
      category: 'media',
      color: '#BC6C25',
    },
    {
      id: 'gallery',
      name: 'Galería',
      icon: '🖼️',
      category: 'media',
      color: '#E8B4B8',
    },
    {
      id: 'settings',
      name: 'Configuración',
      icon: '⚙️',
      category: 'system',
      color: '#9D84B7',
    },
    {
      id: 'store',
      name: 'Store',
      icon: '🛍️',
      category: 'system',
      color: '#A8D8EA',
    },
  ],
  storeApps: [
    {
      id: 'crmiphones',
      name: 'CRM iPhones FapyTech',
      url: 'https://crm-iphones.vercel.app/',
      favicon: 'https://icons.iconarchive.com/icons/icons8/windows-8/512/Mobile-Iphone-icon.png',
      description: 'Aplicación de CRM para iPhones FapyTech',
    },
    {
      id: 'emocionalcalendar',
      name: 'Calendario Emocional',
      url: 'https://calendario-emocional.vercel.app/',
      favicon: 'https://cdn-icons-png.freepik.com/512/1451/1451282.png',
      description: 'app de calendario para ver el estado emocional en el siclo menstrual de una mujer, hecho para mi novia linda: Rachel',
    },
    {
      id: 'ajedrezpregunton',
      name: 'Ajedrez Preguntón',
      url: 'https://ajedrez-pregunton.vercel.app/',
      favicon: 'https://cdn-icons-png.flaticon.com/512/2500/2500116.png',
      description: 'app de ajedrez para jugar con preguntas',
    }
  ],
}
