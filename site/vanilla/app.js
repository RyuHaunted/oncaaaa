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

  // puzzle 2 — Memory (pares)
  function setupPuzzle2() {
    const container = document.getElementById('puzzle2')
    if (!container) return
    const grid = container.querySelector('.memory-grid')
    const pairsSelect = container.querySelector('select')
    const shuffleBtn = container.querySelector('.btn-primary')

    function svgDataUrl(pairId, color) {
      const svg = `<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='100%' height='100%' rx='12' fill='${color}' /><g fill='#3B2A20' opacity='0.9'><ellipse cx='30' cy='30' rx='8' ry='6' /><ellipse cx='90' cy='25' rx='9' ry='6' /><ellipse cx='45' cy='80' rx='12' ry='8' /></g><text x='60' y='105' font-size='12' font-family='sans-serif' fill='rgba(255,255,255,0.9)' text-anchor='middle'>JAG-${pairId}</text></svg>`
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
    }

    let pairs = Number(pairsSelect.value || 8)
    let total = pairs * 2
    let colors = ['#F2C94C','#F59E0B','#F97316','#5A3928','#60A5FA','#34D399','#A78BFA','#FB7185','#FCA5A5','#FDE68A']

    function makeDeck() {
      const arr = []
      for (let i = 0; i < pairs; i++) {
        arr.push({ id: i*2, pairId: i })
        arr.push({ id: i*2+1, pairId: i })
      }
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }

    let cards = makeDeck()
    let flipped = []
    let matched = Array(total).fill(false)
    let busy = false

    function render() {
      grid.innerHTML = ''
      const cols = Math.min(6, Math.ceil(Math.sqrt(total)))
      grid.style.gridTemplateColumns = `repeat(${cols},1fr)`
      cards.forEach((card, i) => {
        const btn = document.createElement('button')
        btn.className = `memory-card ${flipped.includes(i) || matched[i] ? 'flipped' : ''} ${matched[i] ? 'matched' : ''}`
        btn.disabled = busy || matched[i]
        const inner = document.createElement('div')
        inner.className = 'card-inner'
        const front = document.createElement('div')
        front.className = 'card-front'
        front.style.backgroundImage = `url(${svgDataUrl(card.pairId, colors[card.pairId % colors.length])})`
        const back = document.createElement('div')
        back.className = 'card-back'
        back.textContent = '🐆'
        inner.appendChild(front)
        inner.appendChild(back)
        btn.appendChild(inner)
        btn.addEventListener('click', () => handleFlip(i))
        grid.appendChild(btn)
      })
    }

    function handleFlip(i) {
      if (busy) return
      if (flipped.includes(i) || matched[i]) return
      flipped.push(i)
      render()
      if (flipped.length === 2) {
        const [a,b] = flipped
        const isMatch = cards[a].pairId === cards[b].pairId
        if (isMatch) {
          matched[a] = true; matched[b] = true
          flipped = []
          render()
          checkSolved()
        } else {
          busy = true
          setTimeout(() => { flipped = []; busy=false; render() }, 700)
        }
      }
    }

    function shuffle() {
      pairs = Number(pairsSelect.value)
      total = pairs*2
      cards = makeDeck()
      flipped = []
      matched = Array(total).fill(false)
      busy = false
      render()
    }

    function checkSolved() {
      if (matched.filter(Boolean).length === total && total>0) {
        // show confetti locally
        const conf = container.querySelector('.confetti-container')
        if (conf) triggerSmallConfetti(conf)
        markSolved('puzzle2')
      }
    }

    pairsSelect.addEventListener('change', shuffle)
    shuffleBtn.addEventListener('click', shuffle)

    render()
  }

  // puzzle 3 — Quiz
  function setupPuzzle3() {
    const container = document.getElementById('puzzle3')
    if (!container) return
    const qEls = container.querySelectorAll('.option-btn') // not used — we'll render
    const content = container.querySelector('.puzzle-content')

    const questions = [
      { q: 'Qual é o habitat natural mais comum da onça-pintada?', options: ['Desertos áridos','Florestas tropicais e áreas alagadas','Tundra','Montanhas geladas'], answer:1 },
      { q: 'Qual é a principal característica do padrão de pelagem da onça?', options: ['Listras pretas','Manchas (rosetas)','Pelagem totalmente marrom','Pelagem branca'], answer:1 },
      { q: 'O que a onça geralmente caça?', options: ['Plantas e frutas','Insetos','Mamíferos e aves de médio porte','Peixes exclusivamente'], answer:2 },
      { q: 'A onça-pintada é mais próxima de qual grande felino?', options: ['Leão','Tigre','Guepardo','Leopardo'], answer:3 },
      { q: 'Em qual continente a onça-pintada é nativa?', options: ['África','Ásia','América (principalmente América do Sul)','Europa'], answer:2 }
    ]

    let index = 0
    let selected = null
    let score = 0
    let showResult = false
    let passed = false

    function render() {
      content.innerHTML = ''
      if (!showResult) {
        const pInfo = document.createElement('div')
        pInfo.className = 'text-sm'
        pInfo.textContent = `Pergunta ${index+1} de ${questions.length}`
        const h = document.createElement('h3'); h.className='mt-2 font-bold'; h.textContent = questions[index].q
        content.appendChild(pInfo); content.appendChild(h)
        const grid = document.createElement('div'); grid.className='mt-4 grid gap-3'
        questions[index].options.forEach((opt,i)=>{
          const btn = document.createElement('button')
          btn.className = 'option-btn idle'
          btn.textContent = opt
          btn.addEventListener('click', ()=> selectOption(i,btn))
          grid.appendChild(btn)
        })
        content.appendChild(grid)
        const restart = document.createElement('div'); restart.className='mt-4'; const btn = document.createElement('button'); btn.className='btn-primary'; btn.textContent='Reiniciar Quiz'; btn.addEventListener('click', restartQuiz); restart.appendChild(btn); content.appendChild(restart)
      } else {
        const wrap = document.createElement('div'); wrap.className='text-center'
        const h = document.createElement('h3'); h.className=`text-xl font-bold ${passed? 'text-green-700':'text-red-600'}`; h.textContent = passed? 'Parabéns! Você passou!':'Quase lá — tente novamente'
        const p = document.createElement('p'); p.textContent = `Pontuação: ${score}/${questions.length}`
        wrap.appendChild(h); wrap.appendChild(p)
        const actions = document.createElement('div'); actions.className='mt-4 flex gap-2 justify-center'
        const tryBtn = document.createElement('button'); tryBtn.className='btn-primary'; tryBtn.textContent='Tentar novamente'; tryBtn.addEventListener('click', restartQuiz)
        actions.appendChild(tryBtn)
        if (!passed) {
          const rev = document.createElement('button'); rev.className='px-4 py-2 rounded border'; rev.textContent='Rever perguntas'; rev.addEventListener('click', ()=>{ showResult=false; render() })
          actions.appendChild(rev)
        }
        wrap.appendChild(actions)
        content.appendChild(wrap)
      }
    }

    function selectOption(i, el) {
      if (selected !== null) return
      selected = i
      const correct = questions[index].answer === i
      if (correct) score++
      // mark visual states
      render()
      setTimeout(()=>{
        const next = index+1
        if (next >= questions.length) {
          const pass = score >= Math.ceil(questions.length*0.8)
          showResult = true
          passed = pass
          if (pass) {
            // confetti
            const conf = container.querySelector('.confetti-container')
            if (conf) triggerSmallConfetti(conf)
            markSolved('puzzle3')
          }
          render()
        } else {
          index = next; selected=null; render()
        }
      },800)
    }

    function restartQuiz() { index=0; selected=null; score=0; showResult=false; passed=false; render() }
    render()
  }

  // puzzle 4 — irregular parts (drag & snap)
  function setupPuzzle4() {
    const container = document.getElementById('puzzle4')
    if (!container) return
    const boardWrap = container.querySelector('.puzzle4-board-wrap')
    const board = container.querySelector('.puzzle4-board')
    const shuffleBtn = container.querySelector('.btn-primary')
    const resetBtn = container.querySelector('button[onClick]') // fallback

    const baseW = 600, baseH = 400
    const PIECES = [
      { id:0, x:0, y:0, w:200, h:200, clip:'polygon(0% 0%,100% 8%,86% 100%,8% 88%)' },
      { id:1, x:200,y:0,w:200,h:200,clip:'polygon(3% 6%,100% 0%,100% 100%,10% 90%)' },
      { id:2, x:400,y:0,w:200,h:200,clip:'polygon(0% 0%,95% 5%,100% 95%,18% 88%)' },
      { id:3, x:0,y:200,w:250,h:200,clip:'polygon(0% 6%,80% 0%,100% 100%,0% 100%)' },
      { id:4, x:250,y:200,w:200,h:200,clip:'polygon(5% 5%,100% 10%,95% 100%,10% 95%)' },
      { id:5, x:450,y:200,w:150,h:200,clip:'polygon(0% 8%,100% 3%,100% 100%,20% 92%)' }
    ]

    let pieces = PIECES.map(p=>({ ...p, currentX: Math.round(Math.random()*(baseW-p.w)), currentY: baseH+40+Math.round(Math.random()*120), placed:false }))
    let dragging = null
    let dragOffset = { x:0, y:0 }

    function render() {
      board.innerHTML = ''
      const img = document.createElement('img'); img.src='assets/jaguar.svg'; img.className='puzzle4-base'
      board.appendChild(img)

      pieces.forEach(p=>{
        const el = document.createElement('div')
        el.className = `puzzle4-piece ${p.placed? 'placed':''}`
        el.style.left = p.currentX + 'px'; el.style.top = p.currentY + 'px'
        el.style.width = p.w + 'px'; el.style.height = p.h + 'px'
        el.style.zIndex = '2'
        const inner = document.createElement('div')
        inner.className='piece-inner'
        inner.style.width = p.w + 'px'; inner.style.height = p.h + 'px'
        inner.style.clipPath = p.clip
        inner.style.backgroundImage = 'url(assets/jaguar.svg)'
        inner.style.backgroundSize = `${baseW}px ${baseH}px`
        inner.style.backgroundPosition = `-${p.x}px -${p.y}px`
        el.appendChild(inner)
        el.addEventListener('pointerdown', (ev)=> onPointerDown(ev, p.id))
        board.appendChild(el)
      })
    }

    function onPointerMove(e) {
      if (dragging===null) return
      const rect = board.getBoundingClientRect()
      const x = e.clientX - rect.left - dragOffset.x
      const y = e.clientY - rect.top - dragOffset.y
      pieces = pieces.map(pc => pc.id===dragging ? { ...pc, currentX: x, currentY: y } : pc)
      render()
    }

    function onPointerUp() {
      if (dragging===null) return
      const p = pieces.find(x=>x.id===dragging)
      const dx = p.currentX - p.x; const dy = p.currentY - p.y
      const dist = Math.hypot(dx,dy)
      if (dist < 40) { pieces = pieces.map(pc=> pc.id===p.id ? { ...pc, currentX: pc.x, currentY: pc.y, placed:true } : pc) }
      dragging = null; render(); checkSolved()
    }

    function onPointerDown(e, id) {
      const rect = board.getBoundingClientRect()
      const p = pieces.find(x=>x.id===id)
      if (p.placed) return
      dragOffset = { x: e.clientX - rect.left - p.currentX, y: e.clientY - rect.top - p.currentY }
      dragging = id
    }

    function shuffle() { pieces = PIECES.map(p=>({ ...p, currentX: Math.round(Math.random()*(baseW-p.w)), currentY: baseH+40+Math.round(Math.random()*120), placed:false })); render() }
    function reset() { pieces = PIECES.map(p=>({ ...p, currentX: p.x, currentY: p.y, placed:false })); render() }

    function checkSolved(){ if (pieces.every(p=>p.placed)) { const conf = container.querySelector('.confetti-container'); if (conf) triggerSmallConfetti(conf); markSolved('puzzle4') } }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    shuffleBtn.addEventListener('click', shuffle)
    // find reset button manually
    Array.from(container.querySelectorAll('button')).forEach(b=>{ if (b.textContent && b.textContent.includes('Reset')) b.addEventListener('click', reset) })

    render()
  }

  // puzzle 5 — desafio simples (clique na sequência)
  function setupPuzzle5() {
    const container = document.getElementById('puzzle5')
    if (!container) return
    const content = container.querySelector('.puzzle-content')
    const len = 5
    let seq = Array.from({length:len}, ()=>Math.floor(Math.random()*6))
    let progress = 0

    function render() {
      content.innerHTML = ''
      const instr = document.createElement('div'); instr.textContent = 'Repita a sequência clicando nos botões na ordem correta.'; content.appendChild(instr)
      const wrap = document.createElement('div'); wrap.style.display='flex'; wrap.style.gap='0.5rem'; wrap.style.marginTop='0.75rem'
      for (let i=0;i<6;i++){
        const b = document.createElement('button'); b.className='btn'; b.textContent = (i+1).toString(); b.addEventListener('click', ()=>handle(i)); wrap.appendChild(b)
      }
      content.appendChild(wrap)
      const hint = document.createElement('div'); hint.className='mt-3 text-sm'; hint.textContent = 'Seq. atual: ' + seq.join(', '); content.appendChild(hint)
    }

    function handle(n){
      if (n !== seq[progress]) { progress = 0; alert('Errado! Reiniciando sequência'); return }
      progress++
      if (progress >= seq.length) { markSolved('puzzle5'); alert('Parabéns! Desafio concluído.'); }
    }

    render()
  }

  // small confetti helper
  function triggerSmallConfetti(container) {
    const count = 18
    const colors = ['#ef4444','#f97316','#f59e0b','#10b981','#3b82f6','#8b5cf6']
    const width = container.parentElement.getBoundingClientRect().width
    for (let i=0;i<count;i++){
      const el = document.createElement('div')
      el.className='confetti-piece'
      el.style.background = colors[Math.floor(Math.random()*colors.length)]
      el.style.left = Math.random()*(width-10)+'px'
      el.style.top = '0px'
      const dur = 1200 + Math.random()*1000
      el.style.animation = `conf-fall ${dur}ms linear forwards`
      container.appendChild(el)
      setTimeout(()=>el.remove(), dur+200)
    }
  }

  // progress tracker and unlocked screen
  const solvedSet = new Set()
  function markSolved(key){ if (!solvedSet.has(key)){ solvedSet.add(key); document.querySelector(`#${key} .p1-message`)?.textContent = '✔ Concluído'; checkAllSolved() } }

  function checkAllSolved(){ if (solvedSet.size >= 5) { showUnlockedScreen() } }

  function showUnlockedScreen(){ const main = document.querySelector('main'); main.innerHTML = '';
    const el = document.createElement('section'); el.className='unlocked'; el.innerHTML = `
      <h2>Feliz aniversário! 🎉</h2>
      <p>Você completou todos os puzzles. Baixe seu cartão comemorativo.</p>
      <div style="margin-top:1rem"><button id="generate-card" class="btn btn-primary">Baixar cartão (PNG)</button> <button id="print-card" class="btn" style="margin-left:.5rem">Imprimir</button></div>
      <div id="unlock-msg" style="margin-top:1rem"></div>
    `
    main.appendChild(el)
    document.getElementById('generate-card').addEventListener('click', generateCard)
    document.getElementById('print-card').addEventListener('click', ()=> window.print())
  }

  async function generateCard(){ try{
      const width=1200,height=800
      const canvas = document.createElement('canvas'); canvas.width=width; canvas.height=height
      const ctx = canvas.getContext('2d')
      const g = ctx.createLinearGradient(0,0,0,height); g.addColorStop(0,'#FDF6E3'); g.addColorStop(1,'#FDE68A'); ctx.fillStyle = g; ctx.fillRect(0,0,width,height)
      for (let i=0;i<24;i++){ const x=Math.random()*width,y=Math.random()*height,r=12+Math.random()*36; ctx.fillStyle='rgba(59,42,32,0.06)'; ctx.beginPath(); ctx.ellipse(x,y,r,r*(0.6+Math.random()*0.8),0,0,Math.PI*2); ctx.fill() }
      await new Promise((resolve,reject)=>{ const img = new Image(); img.onload = ()=>{ const iw=img.width, ih=img.height; const scale = Math.min((width*0.6)/iw,(height*0.45)/ih); const w=iw*scale, h=ih*scale; const x=(width-w)/2, y=90; ctx.globalAlpha=0.98; ctx.drawImage(img,x,y,w,h); ctx.globalAlpha=1; resolve() }; img.onerror = reject; img.src='assets/jaguar.svg' })
      ctx.fillStyle = '#5A3928'; ctx.textAlign='center'; ctx.font='bold 72px sans-serif'; ctx.fillText('Feliz aniversário!', width/2, height-180)
      ctx.font='600 36px sans-serif'; ctx.fillText('Muitas felicidades e celebrações!', width/2, height-120)
      ctx.font='16px sans-serif'; ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillText('Criado com amor • Onça Pintada Puzzles', width/2, height-40)
      const blob = await new Promise((resolve)=> canvas.toBlob((b)=>resolve(b),'image/png',0.92))
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href=url; a.download='cartao-feliz-aniversario.png'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
      document.getElementById('unlock-msg').textContent = 'Cartão gerado — verifique sua pasta de downloads!'
    }catch(e){ console.error(e); document.getElementById('unlock-msg').textContent='Erro ao gerar o cartão' } }

  // initialize puzzles
  setupPuzzle2()
  setupPuzzle3()
  setupPuzzle4()
  setupPuzzle5()

  // initial render already done for puzzle1 earlier
})