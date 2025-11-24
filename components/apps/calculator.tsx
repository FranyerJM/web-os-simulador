'use client'

import { useState } from 'react'

export const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperation = (op: string) => {
    const current = parseFloat(display)
    if (prev === null) {
      setPrev(current)
    } else if (operation) {
      const result = calculate(prev, current, operation)
      setDisplay(result.toString())
      setPrev(result)
    }
    setOperation(op)
    setDisplay('0')
  }

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b !== 0 ? a / b : 0
      default: return b
    }
  }

  const handleEquals = () => {
    if (operation && prev !== null) {
      const result = calculate(prev, parseFloat(display), operation)
      setDisplay(result.toString())
      setPrev(null)
      setOperation(null)
    }
  }

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="bg-black rounded-lg p-6 mb-4">
        <div className="text-right text-4xl text-white font-light break-words">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 flex-1">
        {buttons.map((row, i) => (
          <div key={i} className="col-span-4 grid grid-cols-4 gap-3">
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === '=') handleEquals()
                  else if (['+', '-', '*', '/'].includes(btn)) handleOperation(btn)
                  else handleNumber(btn)
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg text-xl transition-colors"
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={() => { setDisplay('0'); setPrev(null); setOperation(null) }}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg mt-4"
      >
        C
      </button>
    </div>
  )
}
