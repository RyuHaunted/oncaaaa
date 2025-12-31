import React, { useState } from 'react'
import PuzzleBase from './PuzzleBase'
import Confetti from './Confetti'

type Q = {
  q: string
  options: string[]
  answer: number
}

const questions: Q[] = [
  {
    q: 'Qual é o habitat natural mais comum da onça-pintada?',
    options: ['Desertos áridos', 'Florestas tropicais e áreas alagadas', 'Tundra', 'Montanhas geladas'],
    answer: 1
  },
  {
    q: 'Qual é a principal característica do padrão de pelagem da onça?',
    options: ['Listras pretas', 'Manchas (rosetas)', 'Pelagem totalmente marrom', 'Pelagem branca'],
    answer: 1
  },
  {
    q: 'O que a onça geralmente caça?',
    options: ['Plantas e frutas', 'Insetos', 'Mamíferos e aves de médio porte', 'Peixes exclusivamente'],
    answer: 2
  },
  {
    q: 'A onça-pintada é mais próxima de qual grande felino?',
    options: ['Leão', 'Tigre', 'Guepardo', 'Leopardo'],
    answer: 3
  },
  {
    q: 'Em qual continente a onça-pintada é nativa?',
    options: ['África', 'Ásia', 'América (principalmente América do Sul)', 'Europa'],
    answer: 2
  }
]

export default function Puzzle3({ onSolved }: { onSolved: () => void }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [passed, setPassed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  function selectOption(i: number) {
    if (selected !== null) return // já respondeu
    setSelected(i)
    const correct = questions[index].answer === i
    if (correct) setScore((s) => s + 1)

    setTimeout(() => {
      const next = index + 1
      if (next >= questions.length) {
        const pass = (score + (correct ? 1 : 0)) >= Math.ceil(questions.length * 0.8)
        setShowResult(true)
        setPassed(pass)
        if (pass) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
          setTimeout(() => {
            onSolved()
          }, 900)
        }
      } else {
        setIndex(next)
        setSelected(null)
      }
    }, 800)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setShowResult(false)
    setPassed(false)
  }

  return (
    <PuzzleBase
      title="Puzzle 3 — Quiz sobre a Onça"
      description="Responda ao quiz. Obtenha pelo menos 80% de acertos para passar."
      onSolved={onSolved}
    >
      <div className="p-4 rounded-lg bg-gray-100 quiz-container">
        {!showResult ? (
          <div>
            <div className="text-sm text-gray-600">Pergunta {index + 1} de {questions.length}</div>
            <h3 className="mt-2 font-bold text-lg">{questions[index].q}</h3>

            <div className="mt-4 grid gap-3">
              {questions[index].options.map((opt, i) => {
                const state = selected === null ? 'idle' : selected === i ? (questions[index].answer === i ? 'correct' : 'wrong') : (questions[index].answer === i ? 'correct-reveal' : 'idle')
                return (
                  <button key={i} className={`option-btn ${state}`} onClick={() => selectOption(i)} disabled={selected !== null}>
                    {opt}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <button className="btn-primary" onClick={restart}>Reiniciar Quiz</button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className={`text-xl font-bold ${passed ? 'text-green-700' : 'text-red-600'}`}>{passed ? 'Parabéns! Você passou!' : 'Quase lá — tente novamente'}</h3>
            <p className="mt-2">Pontuação: {score}/{questions.length}</p>

            <div className="mt-4 flex gap-2 justify-center">
              <button className="btn-primary" onClick={restart}>Tentar novamente</button>
              {!passed && <button className="px-4 py-2 rounded border" onClick={() => setShowResult(false)}>Rever perguntas</button>}
            </div>
          </div>
        )}

        {showConfetti && <Confetti />}
      </div>
    </PuzzleBase>
  )
}
