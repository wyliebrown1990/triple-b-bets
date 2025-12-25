import { useState, useEffect } from 'react'
import ConfettiEffect from './ConfettiEffect'

// Winner spotlight overlay
export function WinnerSpotlight({ winner, milestone, prediction, payout, onClose }) {
  const [showConfetti, setShowConfetti] = useState(true)

  return (
    <>
      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center transform animate-pop-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Trophy */}
          <div className="text-6xl mb-4 animate-bounce">
            🏆
          </div>

          {/* Winner name */}
          <h2 className="font-display text-3xl font-bold text-gold-dark mb-2">
            {winner} Wins!
          </h2>

          {/* Milestone */}
          <div className="bg-sage/10 rounded-lg px-4 py-2 inline-block mb-4">
            <span className="text-lg">{milestone.emoji}</span>
            <span className="font-bold text-brown ml-2">{milestone.name}</span>
          </div>

          {/* Prediction */}
          <p className="text-gray-600 mb-2">
            Predicted: <span className="font-bold text-brown">{prediction}</span>
          </p>

          {/* Payout */}
          <div className="bg-gold/10 rounded-lg px-6 py-3 inline-block">
            <span className="text-2xl font-bold text-gold-dark">
              +{payout} 🍼
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="block w-full mt-6 bg-sage hover:bg-sage-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            Continue
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.4s ease-out forwards;
        }
      `}</style>
    </>
  )
}

// Grand champion display for final results
export function GrandChampion({ champion, totalWinnings, onClose }) {
  const [showConfetti, setShowConfetti] = useState(true)

  return (
    <>
      <ConfettiEffect
        active={showConfetti}
        pieceCount={100}
        duration={5000}
        onComplete={() => setShowConfetti(false)}
      />

      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-gold/20 to-sage/20 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg mx-4 text-center transform animate-pop-in">
          {/* Crown and trophy */}
          <div className="text-5xl mb-2">
            👑
          </div>
          <div className="text-6xl mb-4">
            🏆
          </div>

          {/* Champion banner */}
          <div className="bg-gold text-white font-display text-2xl font-bold py-2 px-6 rounded-lg mb-4 inline-block transform -rotate-2">
            GRAND CHAMPION
          </div>

          {/* Champion name */}
          <h2 className="font-display text-4xl font-bold text-brown mb-4">
            {champion}
          </h2>

          {/* Total winnings */}
          <div className="bg-cream rounded-xl p-6 mb-6">
            <p className="text-gray-600 mb-2">Total Binky Bucks Won</p>
            <div className="text-4xl font-bold text-gold-dark">
              {totalWinnings} 🍼
            </div>
          </div>

          {/* Celebration message */}
          <p className="text-gray-600 mb-6">
            The ultimate baby prediction champion!
            May your diaper-changing skills be as accurate as your predictions!
          </p>

          {/* Close button */}
          <button
            onClick={onClose}
            className="bg-gold hover:bg-gold-dark text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Celebrate! 🎉
          </button>
        </div>
      </div>
    </>
  )
}

// Reveal animation wrapper for milestone cards
export function RevealAnimation({ children, isRevealed, onRevealComplete }) {
  const [animationPhase, setAnimationPhase] = useState('hidden') // hidden, shaking, revealing, revealed

  useEffect(() => {
    if (isRevealed && animationPhase === 'hidden') {
      setAnimationPhase('shaking')

      setTimeout(() => {
        setAnimationPhase('revealing')
      }, 500)

      setTimeout(() => {
        setAnimationPhase('revealed')
        onRevealComplete?.()
      }, 1500)
    }
  }, [isRevealed, animationPhase, onRevealComplete])

  const getAnimationClass = () => {
    switch (animationPhase) {
      case 'shaking':
        return 'animate-shake'
      case 'revealing':
        return 'animate-reveal'
      case 'revealed':
        return ''
      default:
        return 'opacity-90'
    }
  }

  return (
    <>
      <div className={`transition-all duration-300 ${getAnimationClass()}`}>
        {children}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-1deg); }
          75% { transform: translateX(5px) rotate(1deg); }
        }
        .animate-shake {
          animation: shake 0.1s ease-in-out infinite;
        }
        @keyframes reveal {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
        .animate-reveal {
          animation: reveal 1s ease-in-out forwards;
        }
      `}</style>
    </>
  )
}
