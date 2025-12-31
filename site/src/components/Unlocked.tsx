import React, { useState } from 'react'
import jaguar from '../assets/jaguar.svg'

export default function Unlocked() {
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function generateCard() {
    try {
      setGenerating(true)
      setMsg('Gerando cartão...')
      const width = 1200
      const height = 800
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!

      // background gradient
      const g = ctx.createLinearGradient(0, 0, 0, height)
      g.addColorStop(0, '#FDF6E3')
      g.addColorStop(1, '#FDE68A')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      // subtle spots decor
      for (let i = 0; i < 24; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const r = 12 + Math.random() * 36
        ctx.fillStyle = 'rgba(59,42,32,0.06)'
        ctx.beginPath()
        ctx.ellipse(x, y, r, r * (0.6 + Math.random() * 0.8), 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // draw jaguar svg image (as raster)
      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          // scale image to fit
          const iw = img.width
          const ih = img.height
          const scale = Math.min((width * 0.6) / iw, (height * 0.45) / ih)
          const w = iw * scale
          const h = ih * scale
          const x = (width - w) / 2
          const y = 90
          ctx.globalAlpha = 0.98
          ctx.drawImage(img, x, y, w, h)
          ctx.globalAlpha = 1
          resolve()
        }
        img.onerror = reject
        img.src = jaguar
      })

      // draw message
      ctx.fillStyle = '#5A3928'
      ctx.textAlign = 'center'
      ctx.font = 'bold 72px sans-serif'
      ctx.fillText('Feliz aniversário!', width / 2, height - 180)

      ctx.font = '600 36px sans-serif'
      ctx.fillText('Muitas felicidades e celebrações!', width / 2, height - 120)

      // small footer
      ctx.font = '16px sans-serif'
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillText('Criado com amor • Onça Pintada Puzzles', width / 2, height - 40)

      // create blob and trigger download
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png', 0.92))
      if (!blob) throw new Error('Falha ao gerar imagem')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cartao-feliz-aniversario.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setMsg('Cartão gerado — verifique sua pasta de downloads!')
    } catch (err) {
      console.error(err)
      setMsg('Erro ao gerar o cartão')
    } finally {
      setGenerating(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  return (
    <div className="container text-center">
      <h2 className="header-title">Feliz aniversário! 🎉</h2>
      <p className="mt-4 text-gray-700">Parabéns — você desbloqueou a surpresa!</p>

      <div className="mt-6">
        <div className="inline-block p-6 rounded-lg bg-amber-100">
          <h3 className="text-2xl font-bold text-amber-800">Feliz aniversário!</h3>
          <p className="mt-2 text-sm text-amber-700">Muitas felicidades e celebrações!</p>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <button className="btn-primary" onClick={generateCard} disabled={generating}>{generating ? 'Gerando...' : 'Baixar cartão (PNG)'}</button>
          <button className="px-4 py-2 rounded border" onClick={() => window.print()}>Imprimir</button>
        </div>

        {msg && <div className="mt-3 text-sm text-gray-600">{msg}</div>}
      </div>
    </div>
  )
}
