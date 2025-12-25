import { useEffect, useState, useCallback } from 'react'

// Pixel-style confetti colors matching site palette
const COLORS = [
  '#D4A853', // gold
  '#87A878', // sage
  '#FFB6C1', // pink
  '#5D4E37', // brown
  '#FFD700', // bright gold
  '#98D8C8', // mint
  '#F4E4BC', // cream
]

function ConfettiPiece({ x, delay, color, size }) {
  return (
    <div
      className="absolute animate-confetti-fall pointer-events-none"
      style={{
        left: `${x}%`,
        top: '-20px',
        animationDelay: `${delay}ms`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        imageRendering: 'pixelated',
      }}
    />
  )
}

export default function ConfettiEffect({
  active = false,
  duration = 3000,
  pieceCount = 50,
  onComplete
}) {
  const [pieces, setPieces] = useState([])
  const [isActive, setIsActive] = useState(false)

  const generatePieces = useCallback(() => {
    const newPieces = []
    for (let i = 0; i < pieceCount; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 500,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 6 + 4, // 4-10px squares
      })
    }
    return newPieces
  }, [pieceCount])

  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true)
      setPieces(generatePieces())

      const timer = setTimeout(() => {
        setIsActive(false)
        setPieces([])
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [active, isActive, duration, generatePieces, onComplete])

  if (!isActive || pieces.length === 0) return null

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {pieces.map((piece) => (
          <ConfettiPiece key={piece.id} {...piece} />
        ))}
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
    </>
  )
}

// Sparkle burst effect for individual winner reveals
export function SparkleEffect({ active = false, onComplete }) {
  const [sparkles, setSparkles] = useState([])

  useEffect(() => {
    if (active) {
      const newSparkles = []
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * 360
        newSparkles.push({
          id: i,
          angle,
          delay: i * 30,
        })
      }
      setSparkles(newSparkles)

      const timer = setTimeout(() => {
        setSparkles([])
        onComplete?.()
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  if (sparkles.length === 0) return null

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute left-1/2 top-1/2 w-2 h-2 bg-gold animate-sparkle-burst"
            style={{
              '--angle': `${sparkle.angle}deg`,
              animationDelay: `${sparkle.delay}ms`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes sparkle-burst {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(60px) scale(0);
            opacity: 0;
          }
        }
        .animate-sparkle-burst {
          animation: sparkle-burst 0.6s ease-out forwards;
        }
      `}</style>
    </>
  )
}
