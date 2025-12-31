import React, { useEffect, useMemo, useState } from 'react'
import PuzzleBase from './PuzzleBase'
import Confetti from './Confetti'

type Card = {
  id: number
  pairId: number
}

function svgDataUrl(pairId: number, color: string) {
  const svg = `<?xml version='1.0' encoding='UTF-8'?>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
    <rect width='100%' height='100%' rx='12' fill='${color}' />
    <g fill='#3B2A20' opacity='0.9'>
      <ellipse cx='30' cy='30' rx='8' ry='6' />
      <ellipse cx='90' cy='25' rx='9' ry='6' />
      <ellipse cx='45' cy='80' rx='12' ry='8' />
    </g>
    <text x='60' y='105' font-size='12' font-family='sans-serif' fill='rgba(255,255,255,0.9)' text-anchor='middle'>JAG-${pairId}</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export default function Puzzle2({ onSolved }: { onSolved: () => void }) {
  const [pairs, setPairs] = useState<number>(8)
  const total = pairs * 2

  const colors = [
    '#F2C94C', '#F59E0B', '#F97316', '#5A3928', '#60A5FA', '#34D399', '#A78BFA', '#FB7185', '#FCA5A5', '#FDE68A'
  ]

  const deck = useMemo(() => {
    const arr: Card[] = []
    for (let i = 0; i < pairs; i++) {
      arr.push({ id: i * 2, pairId: i })
      arr.push({ id: i * 2 + 1, pairId: i })
    }
    // shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [pairs])

  const [cards, setCards] = useState<Card[]>(deck)
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<boolean[]>(Array(total).fill(false))
  const [busy, setBusy] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setCards(deck)
    setMatched(Array(total).fill(false))
    setFlipped([])
  }, [deck, total])

  useEffect(() => {
    if (matched.filter(Boolean).length === total && total > 0) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      setTimeout(() => onSolved(), 900)
    }
  }, [matched, total, onSolved])

  function handleFlip(index: number) {
    if (busy) return
    if (flipped.includes(index) || matched[index]) return

    const next = [...flipped, index]
    setFlipped(next)

    if (next.length === 2) {
      const [a, b] = next
      const isMatch = cards[a].pairId === cards[b].pairId
      if (isMatch) {
        const nm = matched.slice()
        nm[a] = true
        nm[b] = true
        setMatched(nm)
        setFlipped([])
      } else {
        setBusy(true)
        setTimeout(() => {
          setFlipped([])
          setBusy(false)
        }, 700)
      }
    }
  }

  function reset() {
    // recreate deck to reshuffle
    setCards(deck.slice())
    setMatched(Array(total).fill(false))
    setFlipped([])
    setBusy(false)
  }

  return (
    <PuzzleBase
      title="Puzzle 2 — Memory (pares)"
      description="Encontre todos os pares. Você pode escolher a quantidade de pares."
      onSolved={onSolved}
    >
      <div className="p-4 rounded-lg bg-gray-100">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Pares:</label>
            <select value={pairs} onChange={(e) => setPairs(Number(e.target.value))} className="px-2 py-1 rounded border">
              <option value={6}>6 pares (4x3)</option>
              <option value={8}>8 pares (4x4)</option>
              <option value={12}>12 pares (6x4)</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">Combina {pairs} pares para vencer.</div>
        </div>

        <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${Math.min(6, Math.ceil(Math.sqrt(total)))}, 1fr)` }}>
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matched[i]
            const color = colors[card.pairId % colors.length]
            const bg = svgDataUrl(card.pairId, color)
            return (
              <button
                key={card.id}
                className={`memory-card ${isFlipped ? 'flipped' : ''} ${matched[i] ? 'matched' : ''}`}
                onClick={() => handleFlip(i)}
                disabled={busy || matched[i]}
                aria-label={`Carta ${i + 1}`}
              >
                <div className="card-inner">
                  <div className="card-front" style={{ backgroundImage: `url(${bg})` }} />
                  <div className="card-back">🐆</div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <button className="btn-primary" onClick={reset}>Embaralhar</button>
        </div>

        {showConfetti && <Confetti />}
      </div>
    </PuzzleBase>
  )
}
