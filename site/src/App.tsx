import { useState } from 'react'
import Puzzle1 from './components/Puzzle1'
import Puzzle2 from './components/Puzzle2'
import Puzzle3 from './components/Puzzle3'
import Puzzle4 from './components/Puzzle4'
import Puzzle5 from './components/Puzzle5'
import Unlocked from './components/Unlocked'

export default function App() {
  const [solved, setSolved] = useState<boolean[]>([false, false, false, false, false])
  const [view, setView] = useState<'home' | number | 'unlocked'>('home')

  const handleSolved = (index: number) => {
    setSolved((s) => {
      const next = [...s]
      next[index - 1] = true
      return next
    })

    if (index === 5) {
      setView('unlocked')
    } else {
      setView('home')
    }
  }

  if (view === 'unlocked') {
    return (
      <div className="p-6">
        <Unlocked />
        <div className="mt-6 text-center">
          <button className="btn-primary" onClick={() => {setSolved([false,false,false,false,false]); setView('home')}}>Reiniciar</button>
        </div>
      </div>
    )
  }

  if (typeof view === 'number') {
    const idx = view
    const onSolved = () => handleSolved(idx)
    switch (idx) {
      case 1:
        return <Puzzle1 onSolved={onSolved} />
      case 2:
        return <Puzzle2 onSolved={onSolved} />
      case 3:
        return <Puzzle3 onSolved={onSolved} />
      case 4:
        return <Puzzle4 onSolved={onSolved} />
      case 5:
        return <Puzzle5 onSolved={onSolved} />
      default:
        return null
    }
  }

  // HOME
  const solvedCount = solved.filter(Boolean).length
  return (
    <div className="container">
      <header className="flex items-center justify-between">
        <h1 className="header-title">Onça Pintada — Puzzles de Aniversário</h1>
        <div className="text-sm text-gray-600">Progresso: {solvedCount}/5</div>
      </header>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5].map((n) => {
          const unlocked = n === 1 || solved[n-2]
          const isSolved = solved[n-1]
          return (
            <div key={n} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold">Puzzle {n}</h3>
              <p className="text-sm text-gray-600 mt-2">{isSolved ? 'Resolvido' : unlocked ? 'Desbloqueado' : 'Bloqueado'}</p>
              <div className="mt-4 flex gap-2">
                <button
                  className={`btn-primary ${!unlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => { if (unlocked) setView(n)}}
                  disabled={!unlocked}
                >
                  Abrir
                </button>
                {isSolved && (
                  <button className="px-3 py-1 rounded border" onClick={() => {
                    const arr = [...solved]; arr[n-1] = false; setSolved(arr)
                  }}>Reset</button>
                )}
              </div>
            </div>
          )
        })}
      </section>

      <footer className="mt-6 text-center text-sm text-gray-500">Complete os 5 puzzles para liberar a surpresa!</footer>
    </div>
  )
}
