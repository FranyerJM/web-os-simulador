'use client'

import { useState, useRef, useEffect } from 'react'
import { useOS } from '@/context/os-context'
import { SwitchCamera, X } from 'lucide-react'

export const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addPhoto, addNotification } = useOS()

  useEffect(() => { startCamera(); return () => stopCamera() }, [])

  const startCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      if (videoRef.current) { videoRef.current.srcObject = stream; setIsActive(true) }
    } catch (err) { setError('Sin acceso a cámara.') }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        addPhoto(canvasRef.current.toDataURL('image/jpeg'))
        addNotification({ title: 'Foto guardada', message: 'Nueva foto en galería', appId: 'gallery' })
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
      setIsActive(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-black relative overflow-hidden">
      {!isActive && error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
          <X size={40} className="text-red-500 mb-4"/>
          <p>{error}</p>
          <button onClick={startCamera} className="mt-4 px-6 py-2 bg-gray-800 rounded-full">Reintentar</button>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-around pb-6">
            <div className="w-12"></div>
            <button onClick={takePhoto} className="w-20 h-20 rounded-full border-4 border-white p-1"><div className="w-full h-full bg-white rounded-full"></div></button>
            <button onClick={() => {stopCamera(); startCamera()}} className="w-12 text-white"><SwitchCamera size={28} /></button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  )
}