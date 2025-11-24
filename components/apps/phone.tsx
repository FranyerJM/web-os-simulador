'use client'

import { useState } from 'react'
import { useOS } from '@/context/os-context'
import { PhoneCall, Delete, User, Copy, Plus, UserPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

export const Phone = () => {
   const { contacts, myPhoneNumber, addNotification, startCall, addContact } = useOS()
   const [activeTab, setActiveTab] = useState<'dialer' | 'contacts'>('dialer')
   const [dialNumber, setDialNumber] = useState('')
   const [showAddDialog, setShowAddDialog] = useState(false)
   const [newContactName, setNewContactName] = useState('')

   const handleCall = (number: string) => {
      if (!number) return
      startCall(number)
   }

   const handleAddContact = () => {
      if (newContactName && dialNumber) {
         addContact({ name: newContactName, number: dialNumber })
         setNewContactName('')
         setShowAddDialog(false)
         addNotification({ title: 'Contacto guardado', message: `${newContactName} añadido`, appId: 'phone' })
      }
   }

   const copyMyNumber = () => {
      navigator.clipboard.writeText(myPhoneNumber)
      addNotification({ title: 'Copiado', message: 'Tu número se copió', appId: 'phone' })
   }

   return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
         <div className="flex p-2 gap-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
            <button onClick={() => setActiveTab('dialer')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dialer' ? 'bg-white dark:bg-gray-700 shadow-sm dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>Teclado</button>
            <button onClick={() => setActiveTab('contacts')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'contacts' ? 'bg-white dark:bg-gray-700 shadow-sm dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>Contactos</button>
         </div>

         {activeTab === 'dialer' && (
            <div className="flex-1 flex flex-col">
               <div onClick={copyMyNumber} className="w-full py-2 bg-green-50 dark:bg-green-900/20 text-center cursor-pointer border-b border-green-100 dark:border-green-900/30">
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                     Mi Número: <span className="font-mono font-bold">{myPhoneNumber}</span> <Copy size={10} />
                  </p>
               </div>

               <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <span className="text-4xl font-light tracking-wider dark:text-white animate-in fade-in zoom-in-95 duration-200 mb-2">
                     {dialNumber || <span className="opacity-0">0</span>}
                  </span>
                  {dialNumber && !contacts.find(c => c.number === dialNumber) && (
                     <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                        <DialogTrigger asChild>
                           <button className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded-full transition-colors">
                              <UserPlus size={14} /> Agregar a Contactos
                           </button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-800 border-none max-w-xs rounded-2xl">
                           <div className="sr-only">
                              <DialogTitle>Nuevo Contacto</DialogTitle>
                           </div>
                           <h3 className="font-bold mb-4 dark:text-white">Guardar Contacto</h3>
                           <input
                              placeholder="Nombre"
                              value={newContactName}
                              onChange={e => setNewContactName(e.target.value)}
                              className="w-full mb-4 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           <button onClick={handleAddContact} disabled={!newContactName} className="w-full bg-blue-500 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold shadow-lg">Guardar</button>
                        </DialogContent>
                     </Dialog>
                  )}
               </div>

               <div className="grid grid-cols-3 gap-x-6 gap-y-4 p-8 pb-12 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(n => (
                     <button
                        key={n}
                        onClick={() => setDialNumber(prev => prev + n)}
                        className="aspect-square w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-2xl font-medium dark:text-white transition-all active:scale-95 flex items-center justify-center shadow-sm"
                     >
                        {n}
                     </button>
                  ))}
                  <div className="col-span-3 flex justify-center gap-8 mt-6 items-center">
                     <div className="w-16" />
                     <button
                        onClick={() => handleCall(dialNumber)}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-all active:scale-90 shadow-green-500/30"
                     >
                        <PhoneCall size={32} className="fill-current" />
                     </button>
                     {dialNumber ? (
                        <button onClick={() => setDialNumber(prev => prev.slice(0, -1))} className="w-16 h-16 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
                           <Delete size={24} />
                        </button>
                     ) : <div className="w-16" />}
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'contacts' && (
            <div className="flex-1 overflow-y-auto p-4">
               {contacts.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-800/50 rounded-xl mb-2">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                           <User size={20} className="text-gray-500 dark:text-gray-300" />
                        </div>
                        <div>
                           <h3 className="font-bold dark:text-white">{c.name}</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{c.number}</p>
                        </div>
                     </div>
                     <button onClick={() => handleCall(c.number)} className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full hover:scale-105 transition-transform">
                        <PhoneCall size={18} />
                     </button>
                  </div>
               ))}
               {contacts.length === 0 && <p className="text-center text-gray-400 mt-20">Sin contactos guardados</p>}
            </div>
         )}
      </div>
   )
}