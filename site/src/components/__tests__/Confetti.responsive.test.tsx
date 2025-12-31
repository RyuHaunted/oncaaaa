import React from 'react'
import { render, cleanup } from '@testing-library/react'
import Confetti from '../Confetti'

afterEach(() => {
  cleanup()
})

test('renders fewer confetti pieces on small screens', () => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 360 })
  const { container } = render(<Confetti />)
  const pieces = container.querySelectorAll('.confetti-piece')
  expect(pieces.length).toBeLessThanOrEqual(12)
})

test('renders more confetti pieces on large screens', () => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 })
  const { container } = render(<Confetti />)
  const pieces = container.querySelectorAll('.confetti-piece')
  expect(pieces.length).toBeGreaterThanOrEqual(20)
})