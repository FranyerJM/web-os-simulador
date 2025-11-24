'use client'

import { useOS } from '@/context/os-context'
import { Phone, PhoneOff, Mic, MicOff, Disc, Clock, MessageSquare } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

export const CallOverlay = () => {
  const { activeCall, acceptCall, endCall, toggleMute, toggleRecord, setPendingChat, setActiveApp } = useOS()
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeCall?.status === 'connected') {
      const start = activeCall.startTime || Date.now()
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - start) / 1000))
      }, 1000)
    } else {
      setDuration(0)
    }
    return () => clearInterval(interval)
  }, [activeCall?.status, activeCall?.startTime])

  useEffect(() => {
    if (activeCall?.remoteStream && audioRef.current) {
      audioRef.current.srcObject = activeCall.remoteStream
      audioRef.current.play().catch(e => console.error("Error playing audio", e))
    }
  }, [activeCall?.remoteStream])

  if (!activeCall) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute inset-0 z-[100] bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-between py-12 text-white animate-in fade-in zoom-in-95 duration-300">
      <audio ref={audioRef} className="hidden" />

      <div className="flex flex-col items-center mt-8">
        <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-5xl mb-6 shadow-2xl border-4 border-gray-800">
          👤
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center px-4">
          {activeCall.name || activeCall.number}
        </h2>
        <p className="text-lg text-blue-300 font-medium mb-1 animate-pulse">
          {activeCall.status === 'incoming' && 'Llamada entrante...'}
          {activeCall.status === 'dialing' && 'Llamando...'}
          {activeCall.status === 'connected' && 'En llamada'}
          {activeCall.status === 'ended' && 'Finalizada'}
        </p>
        {activeCall.status === 'connected' && (
          <div className="flex items-center gap-2 text-gray-400 mt-2 bg-gray-800/50 px-4 py-1 rounded-full">
            <Clock size={16} />
            <span className="font-mono text-xl">{formatTime(duration)}</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs px-6">
        {activeCall.status === 'incoming' ? (
          <div className="flex justify-between items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={endCall}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/30"
              >
                <PhoneOff size={32} />
              </button>
              <span className="text-sm text-gray-400">Rechazar</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={acceptCall}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-green-500/30 animate-pulse"
              >
                <Phone size={32} />
              </button>
              <span className="text-sm text-gray-400">Contestar</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={toggleMute}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${activeCall.isMuted ? 'bg-white text-black' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center border border-current">
                  {activeCall.isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </div>
                <span className="text-xs">Silenciar</span>
              </button>

              <button
                onClick={() => {
                  if (activeCall.number) {
                    setPendingChat(activeCall.number)
                    setActiveApp('messages')
                  }
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center border border-current">
                  <MessageSquare size={24} />
                </div>
                <span className="text-xs">Mensaje</span>
              </button>

              <button
                onClick={toggleRecord}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${activeCall.isRecording ? 'text-red-500' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-current ${activeCall.isRecording ? 'bg-red-500/20 border-red-500' : ''}`}>
                  <Disc size={24} className={activeCall.isRecording ? "animate-pulse" : ""} />
                </div>
                <span className="text-xs">{activeCall.isRecording ? 'Grabando' : 'Grabar'}</span>
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={endCall}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20"
              >
                <PhoneOff size={32} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}