'use client'

import { useOS } from '@/context/os-context'
import { useEffect, useState } from 'react'
import { MessageSquare, X } from 'lucide-react'

export const MessageAlert = () => {
    const { messages, setActiveApp } = useOS()
    const [lastMessage, setLastMessage] = useState<typeof messages[0] | null>(null)
    const [show, setShow] = useState(false)

    useEffect(() => {
        // Get the most recent message that isn't from the user
        const latestIncoming = messages.filter(m => !m.isOwn).sort((a, b) => b.time.localeCompare(a.time))[0]

        if (latestIncoming && latestIncoming !== lastMessage) {
            setLastMessage(latestIncoming)
            setShow(true)

            // Auto-hide after 5 seconds
            setTimeout(() => setShow(false), 5000)
        }
    }, [messages])

    if (!show || !lastMessage) return null

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-sm animate-in slide-in-from-top duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={24} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                            {lastMessage.number}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {lastMessage.text}
                        </p>
                    </div>

                    <button
                        onClick={() => setShow(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
                    >
                        <X size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="px-4 pb-3 flex gap-2">
                    <button
                        onClick={() => {
                            setActiveApp('messages')
                            setShow(false)
                        }}
                        className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                    >
                        Ver
                    </button>
                    <button
                        onClick={() => setShow(false)}
                        className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
