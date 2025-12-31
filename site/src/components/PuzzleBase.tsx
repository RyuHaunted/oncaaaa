import React from 'react'

type Props = {
  title: string
  description?: string
  onSolved: () => void
  children?: React.ReactNode
}

export default function PuzzleBase({ title, description, onSolved, children }: Props) {
  return (
    <div className="container">
      <h2 className="header-title">{title}</h2>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}

      <div className="mt-6">
        {children ? (
          children
        ) : (
          <div className="p-6 rounded-lg bg-gray-100 text-center">
            <p className="text-gray-700">(Puzzle UI aqui)</p>
            <button
              className="mt-4 btn-primary"
              onClick={() => {
                onSolved()
              }}
            >
              Marcar como resolvido
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
