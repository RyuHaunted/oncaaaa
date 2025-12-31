// Versão completa do Puzzle 1 em vanilla JS
function makeShuffled(total) {
  const arr = [...Array(total).keys()]
  let s = arr.slice().sort(() => Math.random() - 0.5)
  while (s.every((v, i) => v === i)) s = arr.slice().sort(() => Math.random() - 0.5)
  return s
}
function isSolved(tiles) {
  return tiles.every((v, i) => v === i)
}
function swapTiles(arr, a, b) {
  const copy = arr.slice()
  ;[copy[a], copy[b]] = [copy[b], copy[a]]
  return copy
}

document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.getElementById('puzzle1-grid')
  const sizeSelect = document.getElementById('p1-size')
  const showImgCheck = document.getElementById('p1-show-image')
  const shuffleBtn = document.getElementById('p1-shuffle')
  const resetBtn = document.getElementById('p1-reset')
  const fullEl = document.getElementById('p1-full')
  const messageEl = document.getElementById('p1-message')
  const confettiEl = document.getElementById('p1-confetti')

  const imgPath = 'assets/jaguar.svg'

  let size = Number(sizeSelect.value || 3)
  let total = size * size
  let tiles = makeShuffled(total)
  let selected = null
  let solvedFlag = false

  function render() {
    total = size * size
    gridEl.innerHTML = ''
    gridEl.style.gridTemplateColumns = `repeat(${size}, minmax(0,1fr))`
    tiles.forEach((tileIndex, posIndex) => {
      const btn = document.createElement('div')
      btn.className = 'tile'
      btn.tabIndex = 0
      btn.setAttribute('role','button')
      const row = Math.floor(tileIndex / size)
      const col = tileIndex % size
      btn.style.backgroundImage = `url(${imgPath})`
      btn.style.backgroundSize = `${size * 100}% ${size * 100}%`
      btn.style.backgroundPosition = `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`
      btn.setAttribute('aria-label', `Peça ${posIndex + 1}`)
      if (tileIndex === posIndex) btn.classList.add('correct')
      if (selected === posIndex) btn.classList.add('selected')

      btn.addEventListener('click', () => handleClick(posIndex, btn))
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); handleClick(posIndex, btn)
        }
      })

      gridEl.appendChild(btn)
    })
  }

  function handleClick(i, el) {
    if (selected === null) {
      selected = i
      el.classList.add('selected')
      return
    }
    if (selected === i) {
      selected = null
      el.classList.remove('selected')
      render()
      return
    }
    // animate briefly
    const children = gridEl.children
    const a = Math.min(selected, i), b = Math.max(selected, i)
    children[selected].classList.add('swap-anim')
    children[i].classList.add('swap-anim')
    tiles = swapTiles(tiles, selected, i)
    selected = null
    // re-render after small delay to allow animation
    setTimeout(() => {
      render()
      checkSolved()
    }, 160)
  }

  function shuffle() {
    tiles = makeShuffled(total)
    selected = null
    solvedFlag = false
    messageEl.textContent = ''
    render()
  }

  function reset() {
    tiles = [...Array(total).keys()]
    selected = null
    solvedFlag = false
    messageEl.textContent = ''
    render()
  }

  function checkSolved() {
    if (isSolved(tiles) && !solvedFlag) {
      solvedFlag = true
      messageEl.textContent = '🎉 Puzzle resolvido!'
      triggerConfetti()
      setTimeout(() => { messageEl.textContent = 'Voltando...'; }, 800)
      setTimeout(() => { messageEl.textContent = ''; }, 3000)
    }
  }

  // Confetti: lightweight DOM pieces with random colors and animation
  function triggerConfetti() {
    const count = 28
    const colors = ['#ef4444','#f97316','#f59e0b','#10b981','#3b82f6','#8b5cf6']
    const rect = gridEl.getBoundingClientRect()
    const width = rect.width
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      el.className = 'confetti-piece'
      el.style.background = colors[Math.floor(Math.random()*colors.length)]
      el.style.left = Math.random() * (width - 10) + 'px'
      el.style.top = '0px'
      el.style.transform = `rotate(${Math.random()*360}deg)`
      const dur = 1500 + Math.random()*1200
      el.style.animation = `conf-fall ${dur}ms linear forwards`
      el.style.opacity = '1'
      confettiEl.appendChild(el)
      setTimeout(() => el.remove(), dur + 200)
    }
  }

  // Event listeners
  sizeSelect.addEventListener('change', (e) => {
    size = Number(e.target.value)
    total = size*size
    tiles = makeShuffled(total)
    selected = null
    solvedFlag = false
    messageEl.textContent = ''
    render()
  })

  showImgCheck.addEventListener('change', (e) => {
    if (e.target.checked) fullEl.hidden = false
    else fullEl.hidden = true
  })

  shuffleBtn.addEventListener('click', shuffle)
  resetBtn.addEventListener('click', reset)

  // initial render
  render()

  // puzzle 2 simple placeholder behavior
  const p2 = document.querySelector('#puzzle2 .puzzle-content')
  if (p2) { p2.textContent = 'Clique para desbloquear'; p2.addEventListener('click', ()=> alert('Puzzle 2: interação de exemplo')) }
})