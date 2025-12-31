import React from 'react'
import PuzzleBase from './PuzzleBase'

export default function Puzzle5({ onSolved }: { onSolved: () => void }) {
  return (
    <PuzzleBase
      title="Puzzle 5 — Desafio Final"
      description="O puzzle mais difícil! (a implementar)
      Ao completar, você desbloqueará a tela de 'Feliz aniversário'."
      onSolved={onSolved}
    />
  )
}
