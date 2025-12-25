import { useState } from 'react'
import { getAchievement } from '../utils/achievements'

export default function AchievementBadge({ achievementId, size = 'small' }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const achievement = getAchievement(achievementId)

  if (!achievement) return null

  const sizeClasses = {
    small: 'w-6 h-6 text-sm',
    medium: 'w-8 h-8 text-lg',
    large: 'w-10 h-10 text-xl',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          bg-gradient-to-br from-gold/20 to-gold/40
          border-2 border-gold
          rounded-full
          cursor-pointer
          transition-transform hover:scale-110
          shadow-sm
        `}
        title={achievement.name}
      >
        <span>{achievement.icon}</span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-brown text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <p className="font-bold">{achievement.name}</p>
            <p className="text-white/80">{achievement.description}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-brown" />
          </div>
        </div>
      )}
    </div>
  )
}

// Component to display multiple badges in a row
export function AchievementBadges({ achievements, size = 'small', maxDisplay = 4 }) {
  if (!achievements || !achievements.length) return null

  const displayBadges = achievements.slice(0, maxDisplay)
  const remaining = achievements.length - maxDisplay

  return (
    <div className="flex items-center gap-1">
      {displayBadges.map(id => (
        <AchievementBadge key={id} achievementId={id} size={size} />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-gray-500 ml-1">+{remaining}</span>
      )}
    </div>
  )
}
