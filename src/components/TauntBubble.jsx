import { useState, useEffect } from 'react'

// Pixel art family members as SVG components
const PixelGrandma = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 20" style={{ imageRendering: 'pixelated' }}>
    {/* Hair - pink/gray */}
    <rect x="4" y="1" width="8" height="2" fill="#DDA0DD" />
    <rect x="3" y="3" width="10" height="2" fill="#DDA0DD" />
    <rect x="3" y="5" width="2" height="2" fill="#DDA0DD" />
    <rect x="11" y="5" width="2" height="2" fill="#DDA0DD" />
    {/* Face */}
    <rect x="4" y="5" width="8" height="6" fill="#FFE4C4" />
    <rect x="3" y="7" width="1" height="2" fill="#FFE4C4" />
    <rect x="12" y="7" width="1" height="2" fill="#FFE4C4" />
    {/* Glasses */}
    <rect x="4" y="6" width="3" height="2" fill="#4169E1" opacity="0.5" />
    <rect x="9" y="6" width="3" height="2" fill="#4169E1" opacity="0.5" />
    <rect x="7" y="6" width="2" height="1" fill="#4169E1" />
    {/* Eyes behind glasses */}
    <rect x="5" y="7" width="1" height="1" fill="#4A4A4A" />
    <rect x="10" y="7" width="1" height="1" fill="#4A4A4A" />
    {/* Smile */}
    <rect x="6" y="9" width="4" height="1" fill="#E8A0A0" />
    {/* Body - purple dress */}
    <rect x="4" y="11" width="8" height="4" fill="#9370DB" />
    <rect x="3" y="13" width="10" height="4" fill="#9370DB" />
    {/* Necklace */}
    <rect x="6" y="11" width="4" height="1" fill="#FFD700" />
  </svg>
)

const PixelGrandpa = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 20" style={{ imageRendering: 'pixelated' }}>
    {/* Bald head */}
    <rect x="4" y="2" width="8" height="2" fill="#FFE4C4" />
    <rect x="3" y="4" width="10" height="2" fill="#FFE4C4" />
    {/* Side hair */}
    <rect x="3" y="5" width="2" height="2" fill="#C0C0C0" />
    <rect x="11" y="5" width="2" height="2" fill="#C0C0C0" />
    {/* Face */}
    <rect x="4" y="6" width="8" height="5" fill="#FFE4C4" />
    {/* Eyes */}
    <rect x="5" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="9" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="6" y="8" width="1" height="1" fill="#4A4A4A" />
    <rect x="10" y="8" width="1" height="1" fill="#4A4A4A" />
    {/* Mustache */}
    <rect x="5" y="9" width="6" height="1" fill="#C0C0C0" />
    {/* Smile */}
    <rect x="6" y="10" width="4" height="1" fill="#E8A0A0" />
    {/* Body - suspenders */}
    <rect x="4" y="11" width="8" height="6" fill="#4682B4" />
    <rect x="5" y="11" width="2" height="6" fill="#8B4513" />
    <rect x="9" y="11" width="2" height="6" fill="#8B4513" />
  </svg>
)

const PixelUncle = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 20" style={{ imageRendering: 'pixelated' }}>
    {/* Baseball cap */}
    <rect x="3" y="1" width="10" height="2" fill="#DC143C" />
    <rect x="2" y="3" width="12" height="2" fill="#DC143C" />
    <rect x="2" y="5" width="3" height="1" fill="#DC143C" />
    {/* Face */}
    <rect x="4" y="5" width="8" height="6" fill="#FFE4C4" />
    <rect x="3" y="7" width="1" height="2" fill="#FFE4C4" />
    <rect x="12" y="7" width="1" height="2" fill="#FFE4C4" />
    {/* Sunglasses */}
    <rect x="4" y="6" width="3" height="2" fill="#1a1a1a" />
    <rect x="9" y="6" width="3" height="2" fill="#1a1a1a" />
    <rect x="7" y="6" width="2" height="1" fill="#1a1a1a" />
    {/* Smirk */}
    <rect x="7" y="9" width="3" height="1" fill="#E8A0A0" />
    <rect x="10" y="8" width="1" height="1" fill="#E8A0A0" />
    {/* Body - t-shirt */}
    <rect x="4" y="11" width="8" height="6" fill="#228B22" />
    <rect x="3" y="13" width="2" height="3" fill="#228B22" />
    <rect x="11" y="13" width="2" height="3" fill="#228B22" />
  </svg>
)

const PixelCousin = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 20" style={{ imageRendering: 'pixelated' }}>
    {/* Spiky hair */}
    <rect x="5" y="0" width="2" height="2" fill="#FFD700" />
    <rect x="8" y="0" width="2" height="3" fill="#FFD700" />
    <rect x="11" y="1" width="2" height="2" fill="#FFD700" />
    <rect x="3" y="2" width="10" height="2" fill="#FFD700" />
    <rect x="3" y="4" width="10" height="1" fill="#FFD700" />
    {/* Face */}
    <rect x="4" y="5" width="8" height="6" fill="#FFE4C4" />
    {/* Eyes - excited */}
    <rect x="5" y="6" width="2" height="2" fill="#4A4A4A" />
    <rect x="9" y="6" width="2" height="2" fill="#4A4A4A" />
    <rect x="5" y="6" width="1" height="1" fill="#FFFFFF" />
    <rect x="9" y="6" width="1" height="1" fill="#FFFFFF" />
    {/* Big grin */}
    <rect x="5" y="9" width="6" height="2" fill="#E8A0A0" />
    <rect x="6" y="9" width="4" height="1" fill="#FFFFFF" />
    {/* Body - hoodie */}
    <rect x="4" y="11" width="8" height="6" fill="#FF6347" />
    <rect x="6" y="11" width="4" height="3" fill="#FF6347" />
    <rect x="7" y="12" width="2" height="2" fill="#CD5C5C" />
  </svg>
)

const PixelDog = () => (
  <svg width="100%" height="100%" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Body */}
    <rect x="4" y="7" width="8" height="4" fill="#8B5A2B" />
    <rect x="3" y="8" width="10" height="3" fill="#8B5A2B" />
    {/* Head */}
    <rect x="9" y="3" width="5" height="5" fill="#8B5A2B" />
    <rect x="10" y="2" width="3" height="1" fill="#8B5A2B" />
    {/* Ear */}
    <rect x="9" y="1" width="2" height="2" fill="#6B4423" />
    {/* Snout */}
    <rect x="13" y="5" width="2" height="2" fill="#A0522D" />
    {/* Nose */}
    <rect x="14" y="5" width="1" height="1" fill="#2C1810" />
    {/* Eye */}
    <rect x="11" y="4" width="1" height="1" fill="#2C1810" />
    {/* Tongue */}
    <rect x="13" y="7" width="1" height="2" fill="#FF6B8A" />
    {/* Legs */}
    <rect x="4" y="11" width="2" height="3" fill="#8B5A2B" />
    <rect x="10" y="11" width="2" height="3" fill="#8B5A2B" />
    {/* Tail */}
    <rect x="1" y="6" width="3" height="2" fill="#8B5A2B" />
    <rect x="0" y="5" width="2" height="2" fill="#8B5A2B" />
    {/* Collar */}
    <rect x="8" y="8" width="2" height="1" fill="#E74C3C" />
  </svg>
)

const CHARACTERS = [
  { Component: PixelGrandma, name: 'Grandma' },
  { Component: PixelGrandpa, name: 'Grandpa' },
  { Component: PixelUncle, name: 'Uncle' },
  { Component: PixelCousin, name: 'Cousin' },
  { Component: PixelDog, name: 'Pup' },
]

// Taunt pools organized by context
const TAUNTS = {
  highOdds: [
    "Feeling lucky, punk?",
    "Grandma thinks you're CRAZY!",
    "Ooh, a risk-taker! I like it.",
    "That's a spicy prediction!",
    "Going for glory, huh?",
    "Bold. Very bold.",
    "You sure about that one?",
    "High risk, high reward!",
    "Living dangerously, I see!",
    "That's what I call confidence!",
  ],
  lowOdds: [
    "Playing it safe? BORING!",
    "Everyone picked that...",
    "Wow, how original.",
    "Yawn. Next!",
    "Safe bet, safe life.",
    "Where's your sense of adventure?",
    "That's the popular choice, snooze.",
    "Predictable much?",
    "Join the crowd, why don't ya!",
    "Zero points for creativity!",
  ],
  bigWager: [
    "WHOA, big spender!",
    "Betting the farm, are we?",
    "Confident! I respect that.",
    "All in on this one, huh?",
    "Now THAT'S commitment!",
    "Money talks!",
    "Putting your Binkys where your mouth is!",
    "High roller alert!",
    "Someone's feeling lucky!",
    "Go big or go home!",
  ],
  smallWager: [
    "That's it? Cheapskate!",
    "Wow, a whole {amount} Binkys...",
    "Don't spend it all in one place!",
    "Scared money don't make money!",
    "Commitment issues much?",
    "Hedging your bets, I see.",
    "A gentleman's wager, how quaint.",
    "Testing the waters?",
    "Dipping a toe in, huh?",
    "Baby bets for a baby pool!",
  ],
  firstWord: [
    "Everyone says that'll be first!",
    "Classic choice!",
    "The eternal debate...",
    "Mama vs Dada, round 1!",
    "Words, words, words!",
    "Betting on baby's vocab!",
  ],
  walking: [
    "Early walker prediction!",
    "That's a late bloomer bet!",
    "Toddlin' timeline locked in!",
    "Step by step!",
    "Walking is overrated anyway.",
  ],
  crawling: [
    "Zoom zoom, baby!",
    "Crawl before you walk!",
    "Speed demon in training?",
    "The crawling chronicles!",
  ],
  food: [
    "A foodie in the making!",
    "Yummy first bite!",
    "Baby's first nom nom!",
    "Solid choice! Get it?",
  ],
  generic: [
    "Interesting choice...",
    "Noted. NOTED.",
    "The plot thickens!",
    "I've got my eye on you.",
    "Registered in the books!",
    "This is getting good!",
    "Ooh, drama!",
    "The suspense is killing me!",
    "Bold strategy, Cotton!",
    "Let's see how this plays out.",
    "I'll remember this!",
    "Famous last words!",
    "We'll see about that!",
    "Prediction: LOCKED.",
    "No take-backs!",
    "It's in the record now!",
    "History in the making!",
    "Screenshot this for later!",
    "Oh, this is going to be fun!",
    "The baby will be the judge!",
  ],
}

function getRandomTaunt(context, wagerAmount = 0) {
  let pool = TAUNTS.generic

  if (context.odds >= 5) {
    pool = [...TAUNTS.highOdds, ...TAUNTS.generic.slice(0, 5)]
  } else if (context.odds < 2) {
    pool = [...TAUNTS.lowOdds, ...TAUNTS.generic.slice(0, 5)]
  } else if (wagerAmount >= 20) {
    pool = [...TAUNTS.bigWager, ...TAUNTS.generic.slice(0, 5)]
  } else if (wagerAmount > 0 && wagerAmount <= 5) {
    pool = [...TAUNTS.smallWager, ...TAUNTS.generic.slice(0, 5)]
  } else if (context.milestoneId === 'firstWord' || context.milestoneId === 'firstWordAge') {
    pool = [...TAUNTS.firstWord, ...TAUNTS.generic]
  } else if (context.milestoneId === 'firstWalk') {
    pool = [...TAUNTS.walking, ...TAUNTS.generic]
  } else if (context.milestoneId === 'firstCrawl') {
    pool = [...TAUNTS.crawling, ...TAUNTS.generic]
  } else if (context.milestoneId === 'firstFood') {
    pool = [...TAUNTS.food, ...TAUNTS.generic]
  }

  const taunt = pool[Math.floor(Math.random() * pool.length)]
  return taunt.replace('{amount}', wagerAmount)
}

function getRandomCharacter() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
}

export default function TauntBubble({ show, context, onComplete }) {
  const [character, setCharacter] = useState(null)
  const [taunt, setTaunt] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show && context) {
      const newCharacter = getRandomCharacter()
      const newTaunt = getRandomTaunt(context, context.wager)
      setCharacter(newCharacter)
      setTaunt(newTaunt)
      setIsVisible(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onComplete?.()
        }, 300)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [show, context, onComplete])

  if (!character || !show) return null

  const CharacterComponent = character.Component

  return (
    <>
      <div className={`taunt-container ${isVisible ? 'taunt-enter' : 'taunt-exit'}`}>
        <div className="taunt-bubble">
          <span className="taunt-text">{taunt}</span>
          <div className="taunt-arrow"></div>
        </div>
        <div className="taunt-character">
          <CharacterComponent />
        </div>
        <span className="taunt-name">{character.name}</span>
      </div>

      <style>{`
        .taunt-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .taunt-container {
            bottom: 10px;
            right: 10px;
          }
        }

        .taunt-bubble {
          background: white;
          border: 3px solid #8B5A2B;
          border-radius: 16px;
          padding: 10px 14px;
          margin-bottom: 8px;
          max-width: 200px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: relative;
        }

        @media (max-width: 640px) {
          .taunt-bubble {
            max-width: 160px;
            padding: 8px 12px;
            font-size: 13px;
          }
        }

        .taunt-arrow {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid #8B5A2B;
        }

        .taunt-arrow::after {
          content: '';
          position: absolute;
          top: -12px;
          left: -8px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid white;
        }

        .taunt-text {
          font-weight: 600;
          color: #5D4E37;
          font-size: 14px;
          line-height: 1.3;
        }

        .taunt-character {
          width: 64px;
          height: 80px;
          animation: taunt-bounce 0.5s ease-in-out infinite alternate;
        }

        @media (max-width: 640px) {
          .taunt-character {
            width: 48px;
            height: 60px;
          }
        }

        .taunt-name {
          font-size: 11px;
          font-weight: bold;
          color: #8B5A2B;
          background: #FFF8DC;
          padding: 2px 8px;
          border-radius: 8px;
          margin-top: 4px;
        }

        @keyframes taunt-bounce {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-5px);
          }
        }

        .taunt-enter {
          animation: slide-in 0.3s ease-out forwards;
        }

        .taunt-exit {
          animation: slide-out 0.3s ease-in forwards;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100px) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }

        @keyframes slide-out {
          from {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(100px) translateY(20px);
          }
        }
      `}</style>
    </>
  )
}
