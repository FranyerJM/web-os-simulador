'use client'

import { useState, useEffect } from 'react'
import { useOS } from '@/context/os-context'
import { Send, Plus, User, Copy, MessageSquarePlus, Phone, UserPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

export const Messages = () => {
   const { messages, addMessage, contacts, addContact, myPhoneNumber, addNotification, pendingChat, setPendingChat, startCall } = useOS()

   const [input, setInput] = useState('')
   const [currentView, setCurrentView] = useState<'list' | 'chat'>('list')
   const [chatTarget, setChatTarget] = useState<{ number: string, name?: string } | null>(null)

   const [newContactData, setNewContactData] = useState({ name: '', number: '' })
   const [showAddDialog, setShowAddDialog] = useState(false)
   const [showAddContactDialog, setShowAddContactDialog] = useState(false)
   const [contactName, setContactName] = useState('')

   // Handle deep linking from other apps
   useEffect(() => {
      if (pendingChat) {
         openChat(pendingChat)
         setPendingChat(null)
      }
   }, [pendingChat])

   const getUniqueChats = () => {
      const chatMap = new Map()
      messages.forEach(msg => {
         const target = msg.number
         if (!chatMap.has(target)) chatMap.set(target, msg)
      })
      return Array.from(chatMap.keys())
   }

   const openChat = (number: string) => {
      const contact = contacts.find(c => c.number === number)
      setChatTarget({ number, name: contact?.name })
      setCurrentView('chat')
   }

   const handleSend = () => {
      if (input.trim() && chatTarget) {
         addMessage({
            number: chatTarget.number,
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true
         })
         setInput('')
      }
   }

   const handleStartNewChat = () => {
      if (newContactData.number) {
         if (newContactData.name) {
            addContact({ name: newContactData.name, number: newContactData.number })
         }
         openChat(newContactData.number)
         setNewContactData({ name: '', number: '' })
         setShowAddDialog(false)
      }
   }

   const handleAddContact = () => {
      if (contactName && chatTarget) {
         addContact({ name: contactName, number: chatTarget.number })
         setChatTarget(prev => prev ? { ...prev, name: contactName } : null)
         setContactName('')
         setShowAddContactDialog(false)
         addNotification({ title: 'Contacto guardado', message: `${contactName} añadido`, appId: 'messages' })
      }
   }

   const copyMyNumber = () => {
      navigator.clipboard.writeText(myPhoneNumber)
      addNotification({ title: 'Copiado', message: 'ID copiado al portapapeles', appId: 'messages' })
   }

   if (currentView === 'chat' && chatTarget) {
      const chatMessages = messages.filter(m => m.number === chatTarget.number)
      const isContact = !!contacts.find(c => c.number === chatTarget.number)

      return (
         <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-3 border-b dark:border-gray-700">
               <button onClick={() => setCurrentView('list')} className="text-blue-500 font-semibold px-2">←</button>
               <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-sm dark:text-white truncate">{chatTarget.name || chatTarget.number}</h3>
                  {chatTarget.name && <p className="text-xs text-gray-500 truncate">{chatTarget.number}</p>}
               </div>
               <div className="flex gap-2">
                  {!isContact && (
                     <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
                        <DialogTrigger asChild>
                           <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full">
                              <UserPlus size={20} />
                           </button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-800 border-none max-w-xs rounded-2xl">
                           <div className="sr-only">
                              <DialogTitle>Nuevo Contacto</DialogTitle>
                           </div>
                           <h3 className="font-bold mb-4 dark:text-white">Guardar Contacto</h3>
                           <input
                              placeholder="Nombre"
                              value={contactName}
                              onChange={e => setContactName(e.target.value)}
                              className="w-full mb-4 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           <button onClick={handleAddContact} disabled={!contactName} className="w-full bg-blue-500 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold shadow-lg">Guardar</button>
                        </DialogContent>
                     </Dialog>
                  )}
                  <button onClick={() => startCall(chatTarget.number)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full">
                     <Phone size={20} />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100 dark:bg-black/20">
               {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${msg.isOwn
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-700 dark:text-white rounded-bl-none border dark:border-gray-600'
                        }`}>
                        {msg.text}
                        <span className={`text-[10px] block text-right mt-1 opacity-70`}>
                           {msg.time}
                        </span>
                     </div>
                  </div>
               ))}
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex gap-2">
               <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Mensaje..."
                  className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm outline-none dark:text-white border border-transparent focus:border-blue-500 transition-colors"
                  autoFocus
               />
               <button onClick={handleSend} disabled={!input.trim()} className="p-2 bg-blue-500 disabled:bg-gray-400 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md">
                  <Send size={18} />
               </button>
            </div>
         </div>
      )
   }

   return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
         <div className="bg-blue-600 p-4 text-white shadow-md">
            <div className="flex justify-between items-center mb-3">
               <h2 className="text-xl font-bold">Mensajes</h2>
               <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                     <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 backdrop-blur-sm transition-colors">
                        <MessageSquarePlus size={20} />
                     </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-800 border-none max-w-xs rounded-2xl">
                     <div className="sr-only">
                        <DialogTitle>Nuevo Mensaje</DialogTitle>
                     </div>
                     <h3 className="font-bold mb-4 dark:text-white">Nuevo Mensaje</h3>
                     <input
                        placeholder="Número de Red (ID)"
                        value={newContactData.number}
                        onChange={e => setNewContactData({ ...newContactData, number: e.target.value })}
                        className="w-full mb-3 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <input
                        placeholder="Nombre (Opcional)"
                        value={newContactData.name}
                        onChange={e => setNewContactData({ ...newContactData, name: e.target.value })}
                        className="w-full mb-4 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <button onClick={handleStartNewChat} className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg">Comenzar Chat</button>
                  </DialogContent>
               </Dialog>
            </div>
            <div onClick={copyMyNumber} className="flex items-center justify-between bg-blue-700/50 p-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-xs">
               <span className="opacity-90">Mi ID: <strong>{myPhoneNumber}</strong></span>
               <Copy size={12} />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            {getUniqueChats().map(num => {
               const contact = contacts.find(c => c.number === num)
               const lastMsg = messages.filter(m => m.number === num).pop()
               return (
                  <button
                     key={num}
                     onClick={() => openChat(num)}
                     className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-800/50 transition-colors text-left"
                  >
                     <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {(contact?.name || num)[0].toUpperCase()}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                           <h3 className="font-bold text-gray-900 dark:text-white truncate">{contact?.name || num}</h3>
                           <span className="text-[10px] text-gray-400">{lastMsg?.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                           {lastMsg?.isOwn ? 'Tú: ' : ''}{lastMsg?.text}
                        </p>
                     </div>
                  </button>
               )
            })}
            {getUniqueChats().length === 0 && (
               <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center p-6">
                  <MessageSquarePlus size={48} className="mb-4 opacity-20" />
                  <p>No tienes mensajes.</p>
               </div>
            )}
         </div>
      </div>
   )
}