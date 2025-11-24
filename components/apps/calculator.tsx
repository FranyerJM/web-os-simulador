'use client'

import { useState } from 'react'

export const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display)

    if (prevValue === null) {
      setPrevValue(inputValue)
    } else if (operator) {
      const currentValue = prevValue || 0
      const newValue = calculate(currentValue, inputValue, operator)
      setPrevValue(newValue)
      setDisplay(String(newValue))
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b !== 0 ? a / b : 0
      case '=': return b
      default: return b
    }
  }

  const handleEquals = () => {
    if (!operator) return

    const inputValue = parseFloat(display)
    const result = calculate(prevValue || 0, inputValue, operator)

    setDisplay(String(result))
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const buttons = [
    ['C', '/', '*', '-'],
    ['7', '8', '9', '+'],
    ['4', '5', '6', '='],
    ['1', '2', '3', '.'],
    ['0', ''],
  ]

  return (
    <div className="w-full h-full flex flex-col bg-black p-4">
      <div className="bg-gray-900 rounded-2xl p-6 mb-4 flex items-end justify-end h-32">
        <div className="text-right text-5xl text-white font-light break-all">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 flex-1">
        <button onClick={clearAll} className="bg-gray-300 hover:bg-gray-400 text-black font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95">C</button>
        <button onClick={() => performOperation('/')} className={`font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95 ${operator === '/' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>÷</button>
        <button onClick={() => performOperation('*')} className={`font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95 ${operator === '*' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>×</button>
        <button onClick={() => performOperation('-')} className={`font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95 ${operator === '-' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>−</button>

        {['7', '8', '9'].map(n => (
          <button key={n} onClick={() => inputDigit(n)} className="bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95">{n}</button>
        ))}
        <button onClick={() => performOperation('+')} className={`font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95 ${operator === '+' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>+</button>

        {['4', '5', '6'].map(n => (
          <button key={n} onClick={() => inputDigit(n)} className="bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95">{n}</button>
        ))}
        <button onClick={handleEquals} className="row-span-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-2xl text-2xl h-full w-16 flex items-center justify-center transition-all active:scale-95">=</button>

        {['1', '2', '3'].map(n => (
          <button key={n} onClick={() => inputDigit(n)} className="bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95">{n}</button>
        ))}

        <button onClick={() => inputDigit('0')} className="col-span-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-full text-2xl h-16 w-full flex items-center justify-start pl-7 transition-all active:scale-95">0</button>
        <button onClick={inputDot} className="bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-full text-2xl h-16 w-16 flex items-center justify-center transition-all active:scale-95">.</button>
      </div>
    </div>
  )
}
