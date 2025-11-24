'use client'

import { useState } from 'react'

export const Calendar = () => {
  const [date, setDate] = useState(new Date())

  const getDaysInMonth = (d: Date) => {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (d: Date) => {
    return new Date(d.getFullYear(), d.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(date)
  const firstDay = getFirstDayOfMonth(date)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i)

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[date.getMonth()]} {date.getFullYear()}
        </h2>
        <button
          onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 flex-1">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((day) => (
          <div key={day} className="text-center font-bold text-gray-700 p-2">
            {day}
          </div>
        ))}
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {days.map((day) => (
          <button
            key={day}
            className="p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors font-semibold"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
