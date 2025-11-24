'use client'

import { useOS } from '@/context/os-context'
import { AppGrid } from '@/components/app-grid'

export const HomeScreen = () => {
  const { wallpaper, theme } = useOS()

  const getWallpaperStyle = () => {
    if (wallpaper.startsWith('linear-gradient') || wallpaper.startsWith('radial-gradient')) {
      return { background: wallpaper }
    }
    return { backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover' }
  }

  return (
    <div
      className="w-full h-full overflow-y-auto pb-20"
      style={getWallpaperStyle()}
    >
      {theme === 'pc' && (
        <div className="p-4">
          <h2 className="text-white text-sm font-semibold mb-4">Escritorio</h2>
        </div>
      )}
      
      <div className={theme === 'pc' ? 'p-4' : 'p-4 pt-6'}>
        <AppGrid />
      </div>
    </div>
  )
}
