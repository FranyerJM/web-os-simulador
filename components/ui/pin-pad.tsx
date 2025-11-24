'use client'
import { useState, useEffect } from 'react'
import { Delete, Check, X } from 'lucide-react'

interface PinPadProps {
  onSuccess: () => void
  savedPin: string | null
  onSetPin: (pin: string) => void
  isSettingNew: boolean
  onCancel: () => void
}

export const PinPad = ({ onSuccess, savedPin, onSetPin, isSettingNew, onCancel }: PinPadProps) => {
  const [input, setInput] = useState('')
  const [step, setStep] = useState<'enter' | 'create' | 'confirm'>('enter')
  const [confirmInput, setConfirmInput] = useState('')
  
  useEffect(() => { isSettingNew ? setStep('create') : setStep('enter') }, [isSettingNew])

  const handleNum = (n: string) => {
     const val = step === 'confirm' ? confirmInput : input
     if (val.length < 4) step === 'confirm' ? setConfirmInput(p => p + n) : setInput(p => p + n)
  }

  const handleSubmit = () => {
     if (step === 'enter') input === savedPin ? onSuccess() : setInput('')
     else if (step === 'create' && input.length === 4) setStep('confirm')
     else if (step === 'confirm') {
        if (confirmInput === input) { onSetPin(input); onSuccess() }
        else { setConfirmInput(''); setInput(''); setStep('create') }
     }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-xs">
        <div className="flex justify-end"><button onClick={onCancel}><X /></button></div>
        <h3 className="text-center text-xl font-bold mb-6 dark:text-white">
           {step === 'create' ? 'Crear PIN' : step === 'confirm' ? 'Confirmar PIN' : 'Introduce PIN'}
        </h3>
        <div className="flex justify-center gap-4 mb-8">
           {[0,1,2,3].map(i => <div key={i} className={`w-4 h-4 rounded-full ${i < (step === 'confirm' ? confirmInput : input).length ? 'bg-blue-500' : 'bg-gray-200'}`}/>)}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
           {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={() => handleNum(n.toString())} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-full text-xl font-bold">{n}</button>)}
           <div/>
           <button onClick={() => handleNum('0')} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-full text-xl font-bold">0</button>
           <button onClick={() => step === 'confirm' ? setConfirmInput(p=>p.slice(0,-1)) : setInput(p=>p.slice(0,-1))} className="flex items-center justify-center"><Delete/></button>
        </div>
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Confirmar</button>
      </div>
    </div>
  )
}