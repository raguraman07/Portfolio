'use client'

import React, { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseAlpha: number
  twinklePhase: number
  twinkleSpeed: number
}

const PARTICLE_COLORS = [
  'rgba(52, 211, 153,', // emerald-400
  'rgba(45, 212, 191,', // teal-400
  'rgba(34, 211, 238,', // cyan-400
]

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Particle field: slow-drifting glowing nodes, twinkling in place.
  // Runs on canvas rather than DOM nodes so it stays cheap even with
  // many particles, and is fully independent of the blob animation.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let particles: Particle[] = []
    let animationId: number
    let width = 0
    let height = 0

    // Set pixel ratio to 1 for background canvas to avoid high-DPI scaling overhead
    const dpr = 1

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Reduced density (max 30 particles) for optimal frame rates
      const count = Math.min(30, Math.round((width * height) / 36000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: Math.random() * 1.2 + 0.6,
        baseAlpha: Math.random() * 0.3 + 0.1,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.008 + 0.003,
      }))
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p, i) => {
        const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${color} ${p.baseAlpha})`
        ctx.fill()
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.twinklePhase += p.twinkleSpeed

        // Wrap around edges instead of bouncing, for a continuous drift.
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        const twinkle = (Math.sin(p.twinklePhase) + 1) / 2 // 0..1
        const alpha = p.baseAlpha * (0.5 + twinkle * 0.5)

        const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${color} ${alpha.toFixed(3)})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)

    if (prefersReducedMotion) {
      drawStatic()
    } else {
      animationId = requestAnimationFrame(tick)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#05070a]">
      {/* Base backdrop: near-black with a faint blue-slate cast, not pure black. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070a] via-[#070b10] to-[#04060a]" />

      {/* Ambient glow field — large, very soft, low-opacity blobs.
          Using radial gradients directly avoids GPU-heavy CSS blur filter calculations. */}
      <div className="absolute inset-0">
        <div className="absolute top-[8%] left-[6%] w-[35rem] h-[35rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-[10%] right-[8%] w-[35rem] h-[35rem] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-[8%] left-[10%] w-[35rem] h-[35rem] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.06)_0%,transparent_70%)]" />
        <div className="absolute bottom-[6%] right-[6%] w-[35rem] h-[35rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)]" />
      </div>

      {/* Floating particle field — slow-drifting glowing nodes with a gentle twinkle */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Vignette to keep foreground content legible over the glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  )
}

export default AnimatedBackground