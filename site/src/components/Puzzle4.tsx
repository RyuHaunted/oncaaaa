import React, { useEffect, useRef, useState } from 'react'
import PuzzleBase from './PuzzleBase'
import jaguar from '../assets/jaguar.svg'
import Confetti from './Confetti'

type PieceDef = {
  id: number
  x: number
  y: number
  w: number
  h: number
  clip: string
}

const PIECES: PieceDef[] = [
  { id: 0, x: 0, y: 0, w: 200, h: 200, clip: 'polygon(0% 0%,100% 8%,86% 100%,8% 88%)' },
  { id: 1, x: 200, y: 0, w: 200, h: 200, clip: 'polygon(3% 6%,100% 0%,100% 100%,10% 90%)' },
  { id: 2, x: 400, y: 0, w: 200, h: 200, clip: 'polygon(0% 0%,95% 5%,100% 95%,18% 88%)' },
  { id: 3, x: 0, y: 200, w: 250, h: 200, clip: 'polygon(0% 6%,80% 0%,100% 100%,0% 100%)' },
  { id: 4, x: 250, y: 200, w: 200, h: 200, clip: 'polygon(5% 5%,100% 10%,95% 100%,10% 95%)' },
  { id: 5, x: 450, y: 200, w: 150, h: 200, clip: 'polygon(0% 8%,100% 3%,100% 100%,20% 92%)' }
]

export default function Puzzle4({ onSolved }: { onSolved: () => void }) {
  const baseW = 600
  const baseH = 400
  const boardRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState<number>(1)

  const initPieces = () => {
    return PIECES.map((p) => {
      const startX = Math.round(Math.random() * (baseW - p.w))
      const startY = baseH + 40 + Math.round(Math.random() * 120) // below board
      return {
        ...p,
        currentX: startX,
        currentY: startY,
        placed: false
      }
    })
  }

  const [pieces, setPieces] = useState(() => initPieces())
  const [dragging, setDragging] = useState<number | null>(null)
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const zOrder = useRef<number[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    zOrder.current = pieces.map((p) => p.id)
  }, [])

  useEffect(() => {
    if (pieces.every((p) => p.placed)) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      setTimeout(() => onSolved(), 900)
    }
  }, [pieces, onSolved])

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (dragging === null) return
      const board = boardRef.current
      if (!board) return
      const rect = board.getBoundingClientRect()
      // account for scale
      const x = (e.clientX - rect.left - dragOffset.current.x) / scale
      const y = (e.clientY - rect.top - dragOffset.current.y) / scale
      setPieces((prev) => prev.map((pc) => pc.id === dragging ? { ...pc, currentX: x, currentY: y } : pc))
    }

    function onPointerUp() {
      if (dragging === null) return
      const id = dragging
      const p = pieces.find((x) => x.id === id)!
      // check distance to target
      const dx = p.currentX - p.x
      const dy = p.currentY - p.y
      const dist = Math.hypot(dx, dy)
      const threshold = 40
      if (dist < threshold) {
        // snap
        setPieces((prev) => prev.map((pc) => pc.id === id ? { ...pc, currentX: pc.x, currentY: pc.y, placed: true } : pc))
      }
      setDragging(null)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragging, pieces, scale])

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const el = boardRef.current
      if (!el) return
      const parentW = el.parentElement?.clientWidth ?? baseW
      const newScale = Math.min(1, parentW / baseW)
      setScale(newScale)
    })
    if (boardRef.current) ro.observe(boardRef.current.parentElement!)
    return () => ro.disconnect()
  }, [])

  function onPointerDown(e: React.PointerEvent, id: number) {
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const currentPiece = pieces.find((p) => p.id === id)!
    if (currentPiece.placed) return
    // bring to front
    zOrder.current = [...zOrder.current.filter((z) => z !== id), id]
    e.currentTarget.setPointerCapture(e.pointerId)
    // account for scale
    dragOffset.current = { x: (e.clientX - rect.left) / scale - currentPiece.currentX, y: (e.clientY - rect.top) / scale - currentPiece.currentY }
    setDragging(id)
  }

  function shuffle() {
    setPieces(initPieces())
  }

  function reset() {
    setPieces(PIECES.map((p) => ({ ...p, currentX: p.x, currentY: p.y, placed: false })))
  }

  return (
    <PuzzleBase
      title="Puzzle 4 — Partes Irregulares"
      description="Arraste as peças irregulares para suas posições corretas para montar a onça."
      onSolved={onSolved}
    >
      <div className="p-4 rounded-lg bg-gray-100 relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Arraste as peças para a imagem correta.</div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={shuffle}>Embaralhar</button>
            <button className="px-4 py-2 rounded border" onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="puzzle4-board-wrap">
          <div className="puzzle4-board" ref={boardRef} style={{ width: baseW, height: baseH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <img src={jaguar} alt="imagem base" className="puzzle4-base" />

            {pieces.map((p) => {
              const style: React.CSSProperties = {
                left: p.currentX,
                top: p.currentY,
                width: p.w,
                height: p.h,
                zIndex: zOrder.current.indexOf(p.id) + 1,
                transition: p.placed ? 'transform 220ms ease,left 220ms ease,top 220ms ease' : undefined
              }
              return (
                <div
                  key={p.id}
                  className={`puzzle4-piece ${p.placed ? 'placed' : ''}`}
                  style={style}
                  onPointerDown={(e) => onPointerDown(e, p.id)}
                >
                  <div className="piece-inner" style={{
                    width: p.w,
                    height: p.h,
                    clipPath: p.clip,
                    backgroundImage: `url(${jaguar})`,
                    backgroundSize: `${baseW}px ${baseH}px`,
                    backgroundPosition: `-${p.x}px -${p.y}px`
                  }} />
                </div>
              )
            })}

          </div>
        </div>

        {showConfetti && <Confetti />}
      </div>
    </PuzzleBase>
  )
}
