import React from 'react'

// Simple CSS-based confetti without external libs
export default function Confetti() {
  const pieces = Array.from({ length: 28 })
  return (
    <div className="confetti-root pointer-events-none">
      {pieces.map((_, i) => {
        const left = Math.round(Math.random() * 100)
        const delay = (Math.random() * 0.6).toFixed(2)
        const dur = (1.8 + Math.random() * 1.2).toFixed(2)
        const bg = ['#F2C94C', '#5A3928', '#F59E0B', '#F97316'][i % 4]
        const style: React.CSSProperties = {
          left: `${left}%`,
          background: bg,
          animationDelay: `${delay}s`,
          animationDuration: `${dur}s`
        }
        return <div key={i} className="confetti-piece" style={style} />
      })}
    </div>
  )
}
