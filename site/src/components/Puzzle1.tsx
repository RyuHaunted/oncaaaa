import React, { useEffect, useMemo, useState } from 'react'
import PuzzleBase from './PuzzleBase'
import jaguar from '../assets/jaguar.svg'
import Confetti from './Confetti'
import { makeShuffled, swap as swapTiles, isSolved } from '../utils/puzzleUtils'

export default function Puzzle1({ onSolved }: { onSolved: () => void }) {
  const [size, setSize] = useState<number>(3) // 3x3 default
  const [showImage, setShowImage] = useState(false)
  const total = size * size

  const initial = useMemo(() => makeShuffled(total), [total])
  const [tiles, setTiles] = useState<number[]>(() => initial)
  const [selected, setSelected] = useState<number | null>(null)
  const [solvedFlag, setSolvedFlag] = useState(false)
  const [animatePair, setAnimatePair] = useState<number[] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // when size changes, reset
    setTiles(makeShuffled(total))
    setSelected(null)
    setSolvedFlag(false)
  }, [size, total])

  useEffect(() => {
    const solved = isSolved(tiles)
    if (solved && !solvedFlag) {
      setSolvedFlag(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      // delay before notifying
      setTimeout(() => onSolved(), 800)
    }
  }, [tiles, onSolved, solvedFlag])

  function swap(a: number, b: number) {
    setAnimatePair([a, b])
    setTiles((prev) => swapTiles(prev, a, b))
    setTimeout(() => setAnimatePair(null), 300)
  }

  function handleClick(i: number) {
    if (selected === null) {
      setSelected(i)
      return
    }
    if (selected === i) {
      setSelected(null)
      return
    }
    swap(selected, i)
    setSelected(null)
  }

  function shuffle() {
    setTiles(makeShuffled(total))
    setSolvedFlag(false)
    setSelected(null)
  }

  function reset() {
    setTiles([...Array(total).keys()])
    setSolvedFlag(false)
    setSelected(null)
  }

  return (
    <PuzzleBase
      title="Puzzle 1 — Quebra-cabeça (click p/ trocar)"
      description="Escolha o tamanho, clique em uma peça e depois em outra para trocar. Monte a ilustração da onça."
      onSolved={onSolved}
    >
      <div className="p-4 rounded-lg bg-gray-100">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Tamanho:</label>
            <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="px-2 py-1 rounded border">
              <option value={3}>3 x 3 (Fácil)</option>
              <option value={4}>4 x 4 (Médio)</option>
              <option value={5}>5 x 5 (Difícil)</option>
            </select>
            <label className="ml-4 text-sm text-gray-600 flex items-center gap-1">
              <input type="checkbox" checked={showImage} onChange={(e) => setShowImage(e.target.checked)} /> Mostrar imagem
            </label>
          </div>

          <div className="text-sm text-gray-500">Dica: peças corretas ficam com borda verde</div>
        </div>

        <div className="puzzle1-grid" style={{ gridTemplateColumns: `repeat(${size}, minmax(0,1fr))` }}>
          {tiles.map((tileIndex, posIndex) => {
            const row = Math.floor(tileIndex / size)
            const col = tileIndex % size
            const isSelected = selected === posIndex
            const isCorrect = tileIndex === posIndex
            const animing = animatePair && (animatePair[0] === posIndex || animatePair[1] === posIndex)
            return (
              <button
                key={posIndex}
                onClick={() => handleClick(posIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClick(posIndex)
                  }
                }}
                tabIndex={0}
                className={`puzzle1-tile rounded-md overflow-hidden border transition-all duration-200 transform-gpu ${isSelected ? 'ring-4 ring-amber-400' : 'border-gray-200'} ${isCorrect ? 'tile-correct' : ''} ${animing ? 'swap-anim' : ''}`}
                style={{
                  backgroundImage: `url(${jaguar})`,
                  backgroundSize: `${size * 100}% ${size * 100}%`,
                  backgroundPosition: `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`,
                  backgroundRepeat: 'no-repeat'
                }}
                aria-label={`Peça ${posIndex + 1}`}
                aria-pressed={isSelected}
              >
                {/* Empty: piece is background cropped */}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <button className="btn-primary" onClick={shuffle}>Embaralhar</button>
          <button className="px-4 py-2 rounded-md border" onClick={reset}>Reset (Imagem completa)</button>
        </div>

        {showImage && (
          <div className="mt-4 p-4 rounded bg-white/80 text-center">
            <img src={jaguar} alt="Imagem completa" className="mx-auto max-w-full" />
          </div>
        )}

        {solvedFlag && (
          <div className="mt-4 text-green-700 font-bold">Puzzle resolvido! Voltando...</div>
        )}

        {showConfetti && <Confetti />}
      </div>
    </PuzzleBase>
  )
}
