'use client'

import { useOS } from '@/context/os-context'
import { useState } from 'react'
import { Trash2, X } from 'lucide-react'

export const Gallery = () => {
  const { photos, deletePhoto, deletePhotos } = useOS()
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null)

  const togglePhotoSelection = (id: string) => {
    setSelectedPhotos(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleDelete = () => {
    if (selectedPhotos.length > 0) {
      deletePhotos(selectedPhotos)
      setSelectedPhotos([])
      setIsSelectionMode(false)
    }
  }

  const handleDeleteViewing = () => {
    if (viewingPhoto) {
      deletePhoto(viewingPhoto)
      setViewingPhoto(null)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-white text-xl font-bold">
          Galería ({photos.length})
        </h2>
        <div className="flex gap-2">
          {isSelectionMode && (
            <>
              <button
                onClick={handleDelete}
                disabled={selectedPhotos.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 size={16} />
                Eliminar ({selectedPhotos.length})
              </button>
              <button
                onClick={() => {
                  setIsSelectionMode(false)
                  setSelectedPhotos([])
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                Cancelar
              </button>
            </>
          )}
          {!isSelectionMode && photos.length > 0 && (
            <button
              onClick={() => setIsSelectionMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Seleccionar
            </button>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-lg">No hay fotos</p>
            <p className="text-gray-500 text-sm mt-2">Abre la cámara para tomar fotos</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto p-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => {
                if (isSelectionMode) {
                  togglePhotoSelection(photo.id)
                } else {
                  setViewingPhoto(photo.id)
                }
              }}
            >
              <img
                src={photo.dataUrl || "/placeholder.svg"}
                alt="Foto"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

              {isSelectionMode && (
                <div className="absolute top-2 right-2 z-10">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPhotos.includes(photo.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white/20 border-white backdrop-blur'
                    }`}>
                    {selectedPhotos.includes(photo.id) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo Viewer Modal */}
      {viewingPhoto && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setViewingPhoto(null)}
              className="p-2 hover:bg-white/10 rounded-full text-white"
            >
              <X size={24} />
            </button>
            <button
              onClick={handleDeleteViewing}
              className="p-2 hover:bg-red-600/20 rounded-full text-red-500"
            >
              <Trash2 size={24} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={photos.find(p => p.id === viewingPhoto)?.dataUrl}
              alt="Foto"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
