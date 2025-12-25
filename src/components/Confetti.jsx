import { useEffect, useState } from 'react'

// Pixel-style confetti colors matching the site palette
const COLORS = [
  '#D4A853', // gold
  '#87A878', // sage
  '#8B7355', // brown
  '#FFB6C1', // pink
  '#87CEEB', // sky blue
  '#DDA0DD', // plum
]

// Generate random confetti pieces
function generateConfetti(count = 100) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // percentage across screen
    delay: Math.random() * 0.5, // stagger start
    duration: 2 + Math.random() * 2, // fall duration
    size: 6 + Math.random() * 8, // pixel size
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 720, // degrees per second
  }))
}

export default function Confetti({ duration = 3000 }) {
  const [pieces, setPieces] = useState([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setPieces(generateConfetti(80))

    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animation: `confetti-fall ${piece.duration}s ease-in forwards`,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}

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
      `}</style>
    </div>
  )
}

// Celebration overlay for winner announcements
export function Celebration({ winner, milestone, onClose }) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {showConfetti && <Confetti duration={4000} />}

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-bounce-in">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="font-display text-3xl font-bold text-gold-dark mb-2">
          Winner!
        </h2>
        <p className="text-xl text-brown font-bold mb-1">{winner}</p>
        {milestone && (
          <p className="text-gray-600 mb-4">
            Won the {milestone} prediction!
          </p>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gold hover:bg-gold-dark text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// Grand champion celebration (when all results are in)
export function GrandChampionCelebration({ champion, totalWinnings, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-gold/90 to-brown/90">
      <Confetti duration={10000} />

      <div className="text-center text-white px-4">
        {/* Pixel trophy */}
        <div className="text-8xl mb-6 animate-bounce">🏆</div>

        <h1 className="font-display text-4xl sm:text-6xl font-bold mb-4 animate-pulse">
          GRAND CHAMPION
        </h1>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <p className="text-5xl font-bold mb-2">{champion}</p>
          <p className="text-2xl">
            {totalWinnings} Binky Bucks Won!
          </p>
        </div>

        <p className="text-xl mb-8 opacity-80">
          The ultimate baby milestone predictor!
        </p>

        {/* Pixel parade */}
        <div className="flex justify-center gap-4 text-4xl mb-8 animate-bounce">
          <span>👶</span>
          <span>🎉</span>
          <span>🍼</span>
          <span>🎊</span>
          <span>🏆</span>
        </div>

        <button
          onClick={onClose}
          className="bg-white text-gold-dark hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors"
        >
          Celebrate!
        </button>
      </div>
    </div>
  )
}
