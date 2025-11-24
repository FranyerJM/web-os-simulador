'use client'

import { useState } from 'react'
import { useOS } from '@/context/os-context'
import { User, Phone, MessageSquare, Plus, Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

export const Contacts = () => {
    const { contacts, addContact, startCall, setPendingChat, setActiveApp } = useOS()
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [newContact, setNewContact] = useState({ name: '', number: '' })

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.number.includes(searchTerm)
    )

    const handleAddContact = () => {
        if (newContact.name && newContact.number) {
            addContact(newContact)
            setNewContact({ name: '', number: '' })
            setShowAddDialog(false)
        }
    }

    const handleMessage = (number: string) => {
        setPendingChat(number)
        setActiveApp('messages')
    }

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-2xl font-bold dark:text-white">Contactos</h2>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all active:scale-95">
                            <Plus size={24} />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800 border-none max-w-xs rounded-2xl">
                        <div className="sr-only">
                            <DialogTitle>Nuevo Contacto</DialogTitle>
                        </div>
                        <h3 className="font-bold mb-4 text-lg dark:text-white">Nuevo Contacto</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 ml-1">Nombre</label>
                                <input
                                    placeholder="Ej. Juan Perez"
                                    value={newContact.name}
                                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                    className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 ml-1">Número (ID)</label>
                                <input
                                    placeholder="Ej. 123456"
                                    value={newContact.number}
                                    onChange={e => setNewContact({ ...newContact, number: e.target.value })}
                                    className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleAddContact}
                                disabled={!newContact.name || !newContact.number}
                                className="w-full bg-blue-500 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
                            >
                                Guardar Contacto
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="p-4 pb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar contactos..."
                        className="w-full bg-gray-100 dark:bg-gray-800 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredContacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <User size={48} className="mb-4 opacity-20" />
                        <p>{searchTerm ? 'No se encontraron contactos' : 'Sin contactos guardados'}</p>
                    </div>
                ) : (
                    filteredContacts.sort((a, b) => a.name.localeCompare(b.name)).map(contact => (
                        <div key={contact.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
                                    {contact.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{contact.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{contact.number}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleMessage(contact.number)}
                                    className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                >
                                    <MessageSquare size={20} />
                                </button>
                                <button
                                    onClick={() => startCall(contact.number)}
                                    className="p-3 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                >
                                    <Phone size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
