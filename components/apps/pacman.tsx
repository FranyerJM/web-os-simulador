'use client'

import { useState, useEffect, useCallback } from 'react'

export const PacMan = () => {
  const [pacPos, setPacPos] = useState({ x: 5, y: 5 })
  const [direction, setDirection] = useState({ x: 0, y: 0 })
  const [ghosts, setGhosts] = useState([
    { x: 3, y: 3, color: 'red' },
    { x: 8, y: 3, color: 'pink' },
    { x: 3, y: 8, color: 'cyan' },
  ])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const GRID_SIZE = 12
  const CELL_SIZE = 30

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': setDirection({ x: 0, y: -1 }); break
        case 'ArrowDown': setDirection({ x: 0, y: 1 }); break
        case 'ArrowLeft': setDirection({ x: -1, y: 0 }); break
        case 'ArrowRight': setDirection({ x: 1, y: 0 }); break
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver) return

      setPacPos((prev) => {
        let newX = prev.x + direction.x
        let newY = prev.y + direction.y

        if (newX < 0) newX = GRID_SIZE - 1
        if (newX >= GRID_SIZE) newX = 0
        if (newY < 0) newY = GRID_SIZE - 1
        if (newY >= GRID_SIZE) newY = 0

        // Check collision with ghosts
        if (ghosts.some((g) => g.x === newX && g.y === newY)) {
          setGameOver(true)
        }

        setScore((s) => s + 10)
        return { x: newX, y: newY }
      })

      setGhosts((prev) =>
        prev.map((ghost) => ({
          ...ghost,
          x: Math.random() > 0.5 ? (ghost.x + (Math.random() > 0.5 ? 1 : -1) + GRID_SIZE) % GRID_SIZE : ghost.x,
          y: Math.random() > 0.5 ? (ghost.y + (Math.random() > 0.5 ? 1 : -1) + GRID_SIZE) % GRID_SIZE : ghost.y,
        }))
      )
    }, 500)

    return () => clearInterval(interval)
  }, [direction, ghosts, gameOver])

  return (
    <div className="w-full h-full flex flex-col bg-black p-4 items-center justify-center">
      <h1 className="text-white text-2xl font-bold mb-4">PAC-MAN</h1>
      <div className="mb-4 text-white text-lg font-semibold">Puntuación: {score}</div>

      <div
        className="bg-gray-900 border-4 border-yellow-300 relative"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Grid */}
        {Array.from({ length: GRID_SIZE }).map((_, y) =>
          Array.from({ length: GRID_SIZE }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              className="border border-gray-800"
              style={{
                position: 'absolute',
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
              }}
            >
              <div className="w-1 h-1 bg-yellow-300 m-1 rounded-full"></div>
            </div>
          ))
        )}

        {/* Pac-Man */}
        <div
          className="absolute transition-all text-2xl"
          style={{
            left: pacPos.x * CELL_SIZE,
            top: pacPos.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🟡
        </div>

        {/* Ghosts */}
        {ghosts.map((ghost, i) => (
          <div
            key={i}
            className="absolute text-2xl transition-all"
            style={{
              left: ghost.x * CELL_SIZE,
              top: ghost.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {ghost.color === 'red' && '👻'}
            {ghost.color === 'pink' && '💗'}
            {ghost.color === 'cyan' && '❄️'}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 text-white text-center">
          <p className="text-xl font-bold text-red-500">¡GAME OVER!</p>
          <button
            onClick={() => {
              setGameOver(false)
              setPacPos({ x: 5, y: 5 })
              setScore(0)
              setGhosts([
                { x: 3, y: 3, color: 'red' },
                { x: 8, y: 3, color: 'pink' },
                { x: 3, y: 8, color: 'cyan' },
              ])
            }}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Reiniciar
          </button>
        </div>
      )}

      <p className="text-gray-400 text-xs mt-4">Usa las teclas de dirección para jugar</p>
    </div>
  )
}
