import { useState, useEffect, useRef } from 'react'

// Popular emojis organized by category
const EMOJI_CATEGORIES = {
  'People': ['😀', '😎', '🤓', '🥳', '😇', '🤠', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '🧔', '👱', '🤴', '👸', '🦸', '🦹', '🧙'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉'],
  'Food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥑', '🍕', '🍔', '🌮', '🍦', '🍩', '🍪', '🎂', '🍼', '☕', '🧃'],
  'Activities': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻', '🥁', '🏆'],
  'Nature': ['🌸', '🌺', '🌻', '🌹', '🌷', '🌱', '🌲', '🌳', '🍀', '🌈', '⭐', '🌙', '☀️', '⛅', '🌊', '🔥', '❄️', '💧', '🌍', '🌎'],
  'Objects': ['💎', '👑', '💍', '👓', '🎩', '🧢', '👟', '👗', '💄', '💅', '📱', '💻', '📷', '🎬', '📚', '✏️', '🔑', '💰', '🎁', '🎈'],
  'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💯', '✨', '💫', '⚡', '🔥', '💥', '💢', '💤', '💬', '👍', '👎', '✌️'],
}

// Get stored emoji for a user
export function getStoredEmoji(userName) {
  try {
    const stored = localStorage.getItem('userEmojis')
    if (stored) {
      const emojis = JSON.parse(stored)
      return emojis[userName] || null
    }
  } catch (e) {
    console.error('Error reading emoji from localStorage:', e)
  }
  return null
}

// Store emoji for a user
export function storeEmoji(userName, emoji) {
  try {
    const stored = localStorage.getItem('userEmojis') || '{}'
    const emojis = JSON.parse(stored)
    if (emoji) {
      emojis[userName] = emoji
    } else {
      delete emojis[userName]
    }
    localStorage.setItem('userEmojis', JSON.stringify(emojis))
  } catch (e) {
    console.error('Error storing emoji to localStorage:', e)
  }
}

export default function EmojiPicker({ userName, currentEmoji, onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('People')
  const pickerRef = useRef(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Close on escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleSelect = (emoji) => {
    storeEmoji(userName, emoji)
    onSelect(emoji)
    onClose()
  }

  const handleClear = () => {
    storeEmoji(userName, null)
    onSelect(null)
    onClose()
  }

  return (
    <div
      ref={pickerRef}
      className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border-2 border-sage/30 p-3 w-72 animate-pop-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
        <span className="text-sm font-bold text-brown">Choose Avatar for {userName}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          &times;
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-2">
        {Object.keys(EMOJI_CATEGORIES).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              activeCategory === category
                ? 'bg-sage text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto p-1">
        {EMOJI_CATEGORIES[activeCategory].map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(emoji)}
            className={`text-xl p-1 rounded hover:bg-sage/20 transition-colors ${
              currentEmoji === emoji ? 'bg-sage/30 ring-2 ring-sage' : ''
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Clear button */}
      {currentEmoji && (
        <button
          onClick={handleClear}
          className="w-full mt-2 text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          Reset to default letter
        </button>
      )}

      <style>{`
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.9) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in {
          animation: pop-in 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
