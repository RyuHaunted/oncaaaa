import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Puzzle3 from '../Puzzle3'

describe('Puzzle3 integration', () => {
  it('completes quiz and calls onSolved when score >= 80%', async () => {
    const onSolved = vi.fn()
    render(<Puzzle3 onSolved={onSolved} />)

    // answers based on internal questions ordering
    const answers = [
      'Florestas tropicais e áreas alagadas',
      'Manchas (rosetas)',
      'Mamíferos e aves de médio porte',
      'Leopardo',
      'América (principalmente América do Sul)'
    ]

    for (const ans of answers) {
      const btn = await screen.findByRole('button', { name: ans })
      fireEvent.click(btn)
      // wait for next question or result
      await waitFor(() => expect(screen.queryByText(ans)).toBeInTheDocument(), { timeout: 1000 })
    }

    // onSolved should be called (after short delay)
    await waitFor(() => expect(onSolved).toHaveBeenCalled(), { timeout: 2000 })
  })
})
