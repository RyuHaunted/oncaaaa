export function isSolved(tiles: number[]) {
  return tiles.every((v, i) => v === i)
}

export function makeShuffled(total: number) {
  const arr = [...Array(total).keys()]
  let s = arr.slice().sort(() => Math.random() - 0.5)
  while (s.every((v, i) => v === i)) s = arr.slice().sort(() => Math.random() - 0.5)
  return s
}

export function swap(tiles: number[], a: number, b: number) {
  const copy = tiles.slice()
  ;[copy[a], copy[b]] = [copy[b], copy[a]]
  return copy
}
