'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WelcomeScreenProps {
  onComplete?: () => void
}

// Lines that cycle through while the welcome screen is up
const WELCOME_LINES = [
  'Welcome to my portfolio',
  "Let's build something great",
  'Have a look around',
]

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const [lineIndex, setLineIndex] = useState(0)

  // Interactive string coordinate system
  const width = 600
  const height = 200
  const baselineY = 100

  // Mouse tracking state
  const [mouse, setMouse] = useState({ x: 300, y: 100, active: false })

  // Spring physics variables
  const physicsRef = useRef({
    cx: 300,
    cy: 100,
    vx: 0,
    vy: 0,
  })

  const [pathData, setPathData] = useState(`M 0,${baselineY} Q 300,${baselineY} 600,${baselineY}`)

  // 1. Auto-dismiss the welcome screen after a shorter delay
  useEffect(() => {
    const duration = 2800 // time on screen before fading out

    const timer = setTimeout(() => {
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [onComplete])

  // 1b. Cycle through the welcome lines while the screen is visible
  useEffect(() => {
    const lineInterval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % WELCOME_LINES.length)
    }, 600)

    return () => clearInterval(lineInterval)
  }, [])

  // 2. String spring physics loop
  useEffect(() => {
    let frameId: number

    const updatePhysics = () => {
      const state = physicsRef.current

      // Target position: midpoint if inactive, cursor coordinates if active
      let targetX = width / 2
      let targetY = baselineY

      if (mouse.active) {
        targetX = mouse.x
        targetY = mouse.y
      }

      // Spring equations
      const stiffness = 0.088
      const damping = 0.84

      const ax = (targetX - state.cx) * stiffness
      const ay = (targetY - state.cy) * stiffness

      state.vx = (state.vx + ax) * damping
      state.vy = (state.vy + ay) * damping

      state.cx += state.vx
      state.cy += state.vy

      // Apply quadratic bezier boundary caps to prevent excessive stretching
      state.cy = Math.max(20, Math.min(180, state.cy))

      setPathData(`M 0,${baselineY} Q ${state.cx},${state.cy} ${width},${baselineY}`)

      frameId = requestAnimationFrame(updatePhysics)
    }

    updatePhysics()

    return () => cancelAnimationFrame(frameId)
  }, [mouse])

  // 3. Translate client mouse coordinates to local SVG viewBox space
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()

    const mxVal = ((e.clientX - rect.left) / rect.width) * width
    const myVal = ((e.clientY - rect.top) / rect.height) * height

    // Activate string interaction when cursor is nearby the SVG container vertical center
    const distToCenter = Math.abs(e.clientY - (rect.top + rect.height / 2))
    if (distToCenter < 140) {
      setMouse({ x: mxVal, y: myVal, active: true })
    } else {
      setMouse({ x: width / 2, y: baselineY, active: false })
    }
  }

  const handleMouseLeave = () => {
    setMouse({ x: width / 2, y: baselineY, active: false })
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#05070a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Delicate gradient background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.02) 0%, transparent 70%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: '460px',
          padding: '24px',
          zIndex: 10,
        }}
      >
        {/* Minimal Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: 500,
            letterSpacing: '0.3em',
            color: '#ffffff',
            textTransform: 'uppercase',
            marginBottom: '40px',
            userSelect: 'none',
          }}
        >
          RAGURAMAN
        </motion.h1>

        {/* Interactive String Box */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: '100%',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            overflow: 'visible',
            touchAction: 'none',
          }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            height="100%"
            fill="none"
            style={{ overflow: 'visible', pointerEvents: 'none' }}
          >
            {/* Background alignment/track line */}
            <path d={pathData} stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5" />

            {/* Glowing string line, fully lit */}
            <path
              ref={pathRef}
              d={pathData}
              stroke="url(#welcomeProgressGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.45))',
              }}
            />

            <defs>
              <linearGradient id="welcomeProgressGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Cycling welcome line */}
        <div
          style={{
            marginTop: '32px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={lineIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                fontSize: '12px',
                color: '#e2e8f0',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {WELCOME_LINES[lineIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Small pulsing dots animation to fill the loading moment */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            marginTop: '18px',
            userSelect: 'none',
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                opacity: [0.25, 1, 0.25],
                scale: [0.85, 1.15, 0.85],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.18,
              }}
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#10b981',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}