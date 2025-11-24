'use client'

import { useOS } from '@/context/os-context'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'image' | 'video' | 'audio' | 'document'
  size: string
  category: 'images' | 'cache' | 'recordings' | 'downloads'
}

export const Files = () => {
  const { photos, appSettings, installedApps, callRecordings, downloadedFiles, deletePhoto, deleteRecording, deleteDownloadedFile } = useOS()
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const handleDeleteFile = () => {
    if (!selectedFile) return

    // Delete based on file type/category
    if (selectedFile.id.startsWith('photo-')) {
      const photoId = selectedFile.id.replace('photo-', '')
      deletePhoto(photoId)
    } else if (selectedFile.category === 'recordings') {
      deleteRecording(selectedFile.id)
    } else if (selectedFile.category === 'downloads') {
      deleteDownloadedFile(selectedFile.id)
    }

    setSelectedFile(null)
  }

  const cacheFiles: FileItem[] = Object.entries(appSettings).map(([appId, settings]) => {
    const app = installedApps.find(a => a.id === appId)
    return {
      id: settings.storage.cacheFileId || `cache-${appId}`,
      name: `${app?.name || appId}_cache.dat`,
      type: 'document',
      size: settings.storage.cacheSize,
      category: 'cache'
    }
  })

  const recordingFiles: FileItem[] = callRecordings.map(rec => ({
    id: rec.id,
    name: rec.name,
    type: 'audio',
    size: rec.size,
    category: 'recordings' as any
  }))

  const downloadFilesList: FileItem[] = downloadedFiles.map(file => ({
    id: file.id,
    name: file.name,
    type: file.type as any,
    size: file.size,
    category: 'downloads' as any
  }))

  const allFiles: FileItem[] = [
    // Photos from camera
    ...photos.map((photo, idx) => ({
      id: `photo-${photo.id}`,
      name: `Foto ${idx + 1}`,
      type: 'image' as const,
      size: '2.4 MB',
      category: 'images' as const,
    })),
    // Cache
    ...cacheFiles,
    // Recordings
    ...recordingFiles,
    // Downloads
    ...downloadFilesList
  ]

  const categories = [
    { id: 'all', name: 'Todo', icon: '📂' },
    { id: 'images', name: 'Imágenes', icon: '🖼️' },
    { id: 'recordings', name: 'Grabaciones', icon: '🎙️' },
    { id: 'downloads', name: 'Descargas', icon: '⬇️' },
    { id: 'cache', name: 'Caché', icon: '⚙️' },
  ]

  const filteredFiles = activeCategory === 'all'
    ? allFiles
    : allFiles.filter(f => f.category === activeCategory)

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️'
      case 'video': return '🎬'
      case 'audio': return '🎵'
      case 'document': return '📄'
      case 'folder': return '📁'
      default: return '📄'
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 relative">
      <div className="flex gap-2 p-3 overflow-x-auto bg-gray-800 border-b border-gray-700">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold transition-all flex items-center gap-2 ${activeCategory === cat.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Files grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-sm">Sin archivos en esta categoría</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group text-left w-full"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {getFileIcon(file.type)}
                </div>
                <p className="text-white text-sm font-semibold truncate">{file.name}</p>
                <p className="text-gray-400 text-xs mt-1">{file.size}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[80%] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-800/50">
              <h3 className="font-bold text-white truncate pr-4">{selectedFile.name}</h3>
              <div className="flex gap-2">
                {selectedFile.category !== 'cache' && (
                  <button
                    onClick={handleDeleteFile}
                    className="p-2 hover:bg-red-600/20 rounded-full text-red-500 transition-colors"
                    title="Eliminar archivo"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-black/20">
              {selectedFile.type === 'image' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* In a real app we would use the actual dataUrl, but for now we simulate or use the ID if it's a photo */}
                  {selectedFile.id.startsWith('photo-') ? (
                    <img src={photos.find(p => `photo-${p.id}` === selectedFile.id)?.dataUrl} alt={selectedFile.name} className="max-w-full max-h-[60vh] rounded-lg shadow-lg object-contain" />
                  ) : (
                    <div className="text-6xl">🖼️</div>
                  )}
                </div>
              )}

              {selectedFile.type === 'audio' && (
                <div className="w-full space-y-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-5xl">🎵</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-blue-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0:00</span>
                      <span>-:-</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-6">
                    <button className="p-3 hover:bg-white/10 rounded-full text-white">⏮</button>
                    <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">▶</button>
                    <button className="p-3 hover:bg-white/10 rounded-full text-white">⏭</button>
                  </div>
                </div>
              )}

              {(selectedFile.type === 'document' || selectedFile.type === 'folder') && (
                <div className="w-full h-full bg-white text-black p-4 rounded-lg font-mono text-xs overflow-auto shadow-inner min-h-[200px]">
                  {selectedFile.category === 'cache' ? (
                    <>
                      <p className="text-gray-500 border-b pb-2 mb-2">Hex Dump: {selectedFile.name}</p>
                      <p>00000000  7f 45 4c 46 02 01 01 00  00 00 00 00 00 00 00 00  |.ELF............|</p>
                      <p>00000010  02 00 3e 00 01 00 00 00  c0 2d 40 00 00 00 00 00  |..&gt;......-@.....|</p>
                      <p>00000020  40 00 00 00 00 00 00 00  f8 23 01 00 00 00 00 00  |@........#......|</p>
                      <p className="mt-4 text-blue-600 font-bold">// Cache data for app {selectedFile.id.split('-')[1]}</p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-lg font-bold mb-4 border-b pb-2">{selectedFile.name}</h1>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <p className="mt-4">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-800/50 flex justify-between text-xs text-gray-400">
              <span>{selectedFile.size}</span>
              <span className="capitalize">{selectedFile.type}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
