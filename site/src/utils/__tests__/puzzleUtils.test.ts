import { describe, it, expect } from 'vitest'
import { isSolved, makeShuffled, swap } from '../puzzleUtils'

describe('puzzleUtils', () => {
  it('swap should swap elements', () => {
    const arr = [0,1,2,3]
    const swapped = swap(arr, 1, 3)
    expect(swapped).toEqual([0,3,2,1])
  })

  it('isSolved detects solved array', () => {
    expect(isSolved([0,1,2])).toBe(true)
    expect(isSolved([1,0,2])).toBe(false)
  })

  it('makeShuffled returns permutation not equal to identity', () => {
    const s = makeShuffled(9)
    expect(s.length).toBe(9)
    expect(s.every((v, i) => v === i)).toBe(false)
  })
})
