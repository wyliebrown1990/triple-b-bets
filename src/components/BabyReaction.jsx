import { useState, useEffect } from 'react'

// Baby face expressions as pixel art SVGs
const BabyNeutral = () => (
  <svg viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Head */}
    <rect x="8" y="4" width="16" height="4" fill="#FFE4C4" />
    <rect x="6" y="8" width="20" height="4" fill="#FFE4C4" />
    <rect x="4" y="12" width="24" height="8" fill="#FFE4C4" />
    <rect x="6" y="20" width="20" height="4" fill="#FFE4C4" />
    <rect x="8" y="24" width="16" height="4" fill="#FFE4C4" />
    {/* Hair tuft */}
    <rect x="12" y="2" width="2" height="4" fill="#C4A86B" />
    <rect x="14" y="1" width="3" height="5" fill="#C4A86B" />
    <rect x="17" y="2" width="2" height="3" fill="#C4A86B" />
    {/* Eyes - neutral */}
    <rect x="9" y="13" width="4" height="4" fill="#4A4A4A" />
    <rect x="19" y="13" width="4" height="4" fill="#4A4A4A" />
    <rect x="9" y="13" width="2" height="2" fill="#FFFFFF" />
    <rect x="19" y="13" width="2" height="2" fill="#FFFFFF" />
    {/* Rosy cheeks */}
    <rect x="6" y="17" width="3" height="2" fill="#FFB6C1" />
    <rect x="23" y="17" width="3" height="2" fill="#FFB6C1" />
    {/* Neutral mouth */}
    <rect x="13" y="20" width="6" height="2" fill="#E8A0A0" />
  </svg>
)

const BabySkeptical = () => (
  <svg viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Head */}
    <rect x="8" y="4" width="16" height="4" fill="#FFE4C4" />
    <rect x="6" y="8" width="20" height="4" fill="#FFE4C4" />
    <rect x="4" y="12" width="24" height="8" fill="#FFE4C4" />
    <rect x="6" y="20" width="20" height="4" fill="#FFE4C4" />
    <rect x="8" y="24" width="16" height="4" fill="#FFE4C4" />
    {/* Hair tuft */}
    <rect x="12" y="2" width="2" height="4" fill="#C4A86B" />
    <rect x="14" y="1" width="3" height="5" fill="#C4A86B" />
    <rect x="17" y="2" width="2" height="3" fill="#C4A86B" />
    {/* Eyes - one raised eyebrow */}
    <rect x="9" y="13" width="4" height="4" fill="#4A4A4A" />
    <rect x="19" y="12" width="4" height="4" fill="#4A4A4A" />
    <rect x="9" y="13" width="2" height="2" fill="#FFFFFF" />
    <rect x="19" y="12" width="2" height="2" fill="#FFFFFF" />
    {/* Raised eyebrow */}
    <rect x="18" y="9" width="6" height="2" fill="#C4A86B" />
    {/* Rosy cheeks */}
    <rect x="6" y="17" width="3" height="2" fill="#FFB6C1" />
    <rect x="23" y="17" width="3" height="2" fill="#FFB6C1" />
    {/* Skeptical mouth - slanted */}
    <rect x="12" y="20" width="4" height="2" fill="#E8A0A0" />
    <rect x="16" y="21" width="4" height="2" fill="#E8A0A0" />
  </svg>
)

const BabyYawning = () => (
  <svg viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Head */}
    <rect x="8" y="4" width="16" height="4" fill="#FFE4C4" />
    <rect x="6" y="8" width="20" height="4" fill="#FFE4C4" />
    <rect x="4" y="12" width="24" height="8" fill="#FFE4C4" />
    <rect x="6" y="20" width="20" height="4" fill="#FFE4C4" />
    <rect x="8" y="24" width="16" height="4" fill="#FFE4C4" />
    {/* Hair tuft */}
    <rect x="12" y="2" width="2" height="4" fill="#C4A86B" />
    <rect x="14" y="1" width="3" height="5" fill="#C4A86B" />
    <rect x="17" y="2" width="2" height="3" fill="#C4A86B" />
    {/* Eyes - closed/sleepy */}
    <rect x="9" y="14" width="5" height="2" fill="#4A4A4A" />
    <rect x="18" y="14" width="5" height="2" fill="#4A4A4A" />
    {/* Rosy cheeks */}
    <rect x="6" y="17" width="3" height="2" fill="#FFB6C1" />
    <rect x="23" y="17" width="3" height="2" fill="#FFB6C1" />
    {/* Yawning mouth - big O */}
    <rect x="12" y="19" width="8" height="6" fill="#E8A0A0" />
    <rect x="13" y="20" width="6" height="4" fill="#8B0000" />
  </svg>
)

const BabyExcited = () => (
  <svg viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Head */}
    <rect x="8" y="4" width="16" height="4" fill="#FFE4C4" />
    <rect x="6" y="8" width="20" height="4" fill="#FFE4C4" />
    <rect x="4" y="12" width="24" height="8" fill="#FFE4C4" />
    <rect x="6" y="20" width="20" height="4" fill="#FFE4C4" />
    <rect x="8" y="24" width="16" height="4" fill="#FFE4C4" />
    {/* Hair tuft - excited, standing up more */}
    <rect x="11" y="1" width="2" height="5" fill="#C4A86B" />
    <rect x="14" y="0" width="3" height="6" fill="#C4A86B" />
    <rect x="18" y="1" width="2" height="4" fill="#C4A86B" />
    {/* Eyes - big and sparkly */}
    <rect x="8" y="12" width="5" height="5" fill="#4A4A4A" />
    <rect x="19" y="12" width="5" height="5" fill="#4A4A4A" />
    <rect x="8" y="12" width="2" height="2" fill="#FFFFFF" />
    <rect x="19" y="12" width="2" height="2" fill="#FFFFFF" />
    <rect x="11" y="15" width="1" height="1" fill="#FFFFFF" />
    <rect x="22" y="15" width="1" height="1" fill="#FFFFFF" />
    {/* Extra rosy cheeks */}
    <rect x="5" y="17" width="4" height="3" fill="#FFB6C1" />
    <rect x="23" y="17" width="4" height="3" fill="#FFB6C1" />
    {/* Big smile */}
    <rect x="11" y="20" width="10" height="2" fill="#E8A0A0" />
    <rect x="12" y="22" width="8" height="2" fill="#E8A0A0" />
    {/* Sparkles around */}
    <rect x="2" y="8" width="2" height="2" fill="#FFD700" />
    <rect x="28" y="10" width="2" height="2" fill="#FFD700" />
    <rect x="4" y="22" width="2" height="2" fill="#FFD700" />
  </svg>
)

const BabyLaughing = () => (
  <svg viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Head */}
    <rect x="8" y="4" width="16" height="4" fill="#FFE4C4" />
    <rect x="6" y="8" width="20" height="4" fill="#FFE4C4" />
    <rect x="4" y="12" width="24" height="8" fill="#FFE4C4" />
    <rect x="6" y="20" width="20" height="4" fill="#FFE4C4" />
    <rect x="8" y="24" width="16" height="4" fill="#FFE4C4" />
    {/* Hair tuft */}
    <rect x="12" y="2" width="2" height="4" fill="#C4A86B" />
    <rect x="14" y="1" width="3" height="5" fill="#C4A86B" />
    <rect x="17" y="2" width="2" height="3" fill="#C4A86B" />
    {/* Eyes - happy squints */}
    <rect x="8" y="13" width="6" height="2" fill="#4A4A4A" />
    <rect x="18" y="13" width="6" height="2" fill="#4A4A4A" />
    <rect x="9" y="12" width="4" height="1" fill="#4A4A4A" />
    <rect x="19" y="12" width="4" height="1" fill="#4A4A4A" />
    {/* Very rosy cheeks */}
    <rect x="5" y="16" width="4" height="4" fill="#FFB6C1" />
    <rect x="23" y="16" width="4" height="4" fill="#FFB6C1" />
    {/* Big open laugh */}
    <rect x="10" y="19" width="12" height="4" fill="#E8A0A0" />
    <rect x="11" y="20" width="10" height="2" fill="#8B0000" />
    {/* Laugh lines */}
    <rect x="6" y="14" width="1" height="3" fill="#DEB887" />
    <rect x="25" y="14" width="1" height="3" fill="#DEB887" />
  </svg>
)

const BabyThinking = () => (
  <svg viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
    {/* Head */}
    <rect x="8" y="4" width="16" height="4" fill="#FFE4C4" />
    <rect x="6" y="8" width="20" height="4" fill="#FFE4C4" />
    <rect x="4" y="12" width="24" height="8" fill="#FFE4C4" />
    <rect x="6" y="20" width="20" height="4" fill="#FFE4C4" />
    <rect x="8" y="24" width="16" height="4" fill="#FFE4C4" />
    {/* Hair tuft */}
    <rect x="12" y="2" width="2" height="4" fill="#C4A86B" />
    <rect x="14" y="1" width="3" height="5" fill="#C4A86B" />
    <rect x="17" y="2" width="2" height="3" fill="#C4A86B" />
    {/* Eyes - looking up/thinking */}
    <rect x="9" y="12" width="4" height="4" fill="#4A4A4A" />
    <rect x="19" y="12" width="4" height="4" fill="#4A4A4A" />
    <rect x="10" y="12" width="2" height="2" fill="#FFFFFF" />
    <rect x="20" y="12" width="2" height="2" fill="#FFFFFF" />
    {/* Rosy cheeks */}
    <rect x="6" y="17" width="3" height="2" fill="#FFB6C1" />
    <rect x="23" y="17" width="3" height="2" fill="#FFB6C1" />
    {/* Thinking mouth - small o */}
    <rect x="14" y="20" width="4" height="3" fill="#E8A0A0" />
    {/* Thought bubble */}
    <rect x="26" y="4" width="4" height="4" fill="#FFFFFF" />
    <rect x="25" y="5" width="6" height="2" fill="#FFFFFF" />
    <rect x="24" y="8" width="2" height="2" fill="#FFFFFF" />
    <rect x="22" y="10" width="1" height="1" fill="#FFFFFF" />
    {/* Question mark in bubble */}
    <rect x="27" y="5" width="2" height="1" fill="#87A878" />
    <rect x="28" y="6" width="1" height="1" fill="#87A878" />
  </svg>
)

const EXPRESSIONS = {
  neutral: { Component: BabyNeutral, label: '' },
  skeptical: { Component: BabySkeptical, label: 'Really? That early?' },
  yawning: { Component: BabyYawning, label: '*yawn* That late?' },
  excited: { Component: BabyExcited, label: 'Ooh, bold pick!' },
  laughing: { Component: BabyLaughing, label: 'Haha, good one!' },
  thinking: { Component: BabyThinking, label: 'Hmm, interesting...' },
}

export default function BabyReaction({ expression = 'neutral', isTyping = false }) {
  const [currentExpression, setCurrentExpression] = useState(expression)
  const [showLabel, setShowLabel] = useState(false)

  useEffect(() => {
    if (isTyping) {
      setCurrentExpression('thinking')
      setShowLabel(false)
    } else {
      setCurrentExpression(expression)
      // Show label briefly when expression changes
      if (expression !== 'neutral' && expression !== 'thinking') {
        setShowLabel(true)
        const timer = setTimeout(() => setShowLabel(false), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [expression, isTyping])

  const { Component, label } = EXPRESSIONS[currentExpression] || EXPRESSIONS.neutral

  return (
    <div className="baby-reaction fixed bottom-4 left-4 z-50 pointer-events-none">
      <div className="relative">
        {/* Speech bubble */}
        {showLabel && label && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 animate-fade-in">
            <div className="bg-white border-2 border-brown rounded-lg px-3 py-1 text-xs font-bold text-brown whitespace-nowrap shadow-lg">
              {label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-brown" />
            </div>
          </div>
        )}

        {/* Baby face */}
        <div className={`
          w-16 h-16 sm:w-20 sm:h-20
          transition-transform duration-300
          ${currentExpression === 'excited' ? 'animate-bounce' : ''}
          ${currentExpression === 'laughing' ? 'animate-wiggle' : ''}
          ${currentExpression === 'thinking' ? 'animate-pulse' : ''}
        `}>
          <Component />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Helper function to determine expression based on prediction context
export function getExpressionForPrediction(value, milestoneType, average, stdDev, isUnique) {
  if (!value) return 'neutral'

  if (milestoneType === 'number') {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return 'thinking'

    const zScore = average ? Math.abs(numValue - average) / (stdDev || 1) : 0

    if (zScore > 2) return 'excited' // Very bold/outlier
    if (numValue < average - stdDev) return 'skeptical' // Early prediction
    if (numValue > average + stdDev) return 'yawning' // Late prediction
    return 'neutral'
  }

  if (milestoneType === 'text' || milestoneType === 'textarea') {
    if (value.length > 50) return 'laughing' // Long/funny answer
    if (isUnique) return 'excited' // Unique prediction
    return 'neutral'
  }

  return 'neutral'
}
