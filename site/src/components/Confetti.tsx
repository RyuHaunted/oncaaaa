import React from 'react'

// Simple CSS-based confetti without external libs
export default function Confetti() {
  const [count, setCount] = React.useState(() => (typeof window !== 'undefined' && window.innerWidth < 480 ? 12 : 28))

  React.useEffect(() => {
    function handleResize() {
      const next = window.innerWidth < 480 ? 12 : 28
      setCount(next)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const pieces = Array.from({ length: count })
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
