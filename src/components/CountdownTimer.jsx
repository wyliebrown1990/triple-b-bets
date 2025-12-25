import { useState, useEffect } from 'react'

const BETTING_CLOSE_DATE = new Date('2026-01-01T00:00:00')

function calculateTimeLeft() {
  const now = new Date()
  const difference = BETTING_CLOSE_DATE - now

  if (difference <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    expired: false,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function TimeBlock({ value, label, urgent, critical }) {
  const displayValue = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      <div className={`
        relative px-3 py-2 rounded-lg border-4 font-mono text-2xl sm:text-3xl font-bold
        transition-all duration-300
        ${critical
          ? 'bg-red-900 border-red-600 text-red-100 animate-pulse'
          : urgent
            ? 'bg-red-800 border-red-500 text-red-100'
            : 'bg-brown/90 border-brown text-cream'
        }
      `}>
        {/* Pixel corner decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-current opacity-30" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-current opacity-30" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-current opacity-30" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-current opacity-30" />

        <span className="relative z-10">{displayValue}</span>
      </div>
      <span className={`
        text-xs sm:text-sm font-bold mt-1 uppercase tracking-wider
        ${critical ? 'text-red-500' : urgent ? 'text-red-400' : 'text-brown/70'}
      `}>
        {label}
      </span>
    </div>
  )
}

function Separator({ urgent, critical }) {
  return (
    <div className={`
      flex flex-col justify-center gap-2 px-1 sm:px-2
      ${critical ? 'text-red-500' : urgent ? 'text-red-400' : 'text-brown'}
    `}>
      <div className={`w-2 h-2 rounded-full ${critical ? 'bg-red-500 animate-ping' : urgent ? 'bg-red-400' : 'bg-brown'}`} />
      <div className={`w-2 h-2 rounded-full ${critical ? 'bg-red-500 animate-ping' : urgent ? 'bg-red-400' : 'bg-brown'}`} />
    </div>
  )
}

export default function CountdownTimer({ compact = false }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const urgent = timeLeft.days === 0 && timeLeft.hours < 24
  const critical = timeLeft.days === 0 && timeLeft.hours < 1

  if (timeLeft.expired) {
    return (
      <div className={`
        text-center
        ${compact ? 'py-2' : 'py-6'}
      `}>
        <div className={`
          inline-block px-6 py-3 rounded-xl border-4 border-red-600 bg-red-900/90
          ${compact ? '' : 'animate-pulse'}
        `}>
          <span className="text-red-100 font-bold text-lg sm:text-xl">
            🚫 BETTING CLOSED 🚫
          </span>
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={`
        flex items-center justify-center gap-1 py-1 px-3 rounded-lg text-sm font-mono font-bold
        ${critical
          ? 'bg-red-900/80 text-red-100 animate-pulse'
          : urgent
            ? 'bg-red-800/80 text-red-100'
            : 'bg-brown/20 text-brown'
        }
      `}>
        <span>⏰</span>
        <span>{timeLeft.days}d</span>
        <span>{timeLeft.hours}h</span>
        <span>{timeLeft.minutes}m</span>
        <span>{timeLeft.seconds}s</span>
      </div>
    )
  }

  return (
    <div className="text-center py-6">
      <h3 className={`
        font-display text-lg sm:text-xl font-bold mb-4
        ${critical ? 'text-red-500' : urgent ? 'text-red-400' : 'text-brown'}
      `}>
        {critical ? '⚠️ FINAL MINUTES TO BET! ⚠️' : urgent ? '🚨 LAST CHANCE TO BET! 🚨' : '⏰ Betting Closes In'}
      </h3>

      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <TimeBlock value={timeLeft.days} label="Days" urgent={urgent} critical={critical} />
        <Separator urgent={urgent} critical={critical} />
        <TimeBlock value={timeLeft.hours} label="Hours" urgent={urgent} critical={critical} />
        <Separator urgent={urgent} critical={critical} />
        <TimeBlock value={timeLeft.minutes} label="Mins" urgent={urgent} critical={critical} />
        <Separator urgent={urgent} critical={critical} />
        <TimeBlock value={timeLeft.seconds} label="Secs" urgent={urgent} critical={critical} />
      </div>

      <p className={`
        mt-4 text-sm
        ${critical ? 'text-red-400' : urgent ? 'text-red-300' : 'text-brown/60'}
      `}>
        New Year's Day 2026
      </p>
    </div>
  )
}
