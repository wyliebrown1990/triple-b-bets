import { useMemo } from 'react'

// Pixel art nursery elements
const PixelCrib = () => (
  <svg viewBox="0 0 24 20" style={{ imageRendering: 'pixelated' }}>
    {/* Crib frame */}
    <rect x="2" y="4" width="2" height="14" fill="#8B4513" />
    <rect x="20" y="4" width="2" height="14" fill="#8B4513" />
    <rect x="2" y="2" width="2" height="4" fill="#A0522D" />
    <rect x="20" y="2" width="2" height="4" fill="#A0522D" />
    {/* Crib bars */}
    <rect x="5" y="6" width="1" height="10" fill="#DEB887" />
    <rect x="8" y="6" width="1" height="10" fill="#DEB887" />
    <rect x="11" y="6" width="1" height="10" fill="#DEB887" />
    <rect x="14" y="6" width="1" height="10" fill="#DEB887" />
    <rect x="17" y="6" width="1" height="10" fill="#DEB887" />
    {/* Top rail */}
    <rect x="2" y="4" width="20" height="2" fill="#A0522D" />
    {/* Bottom */}
    <rect x="2" y="16" width="20" height="2" fill="#8B4513" />
    {/* Mattress */}
    <rect x="4" y="12" width="16" height="4" fill="#87CEEB" />
    {/* Pillow */}
    <rect x="5" y="10" width="4" height="2" fill="#FFFAF0" />
  </svg>
)

const PixelTeddy = () => (
  <svg viewBox="0 0 16 18" style={{ imageRendering: 'pixelated' }}>
    {/* Ears */}
    <rect x="2" y="1" width="3" height="3" fill="#D2691E" />
    <rect x="11" y="1" width="3" height="3" fill="#D2691E" />
    <rect x="3" y="2" width="1" height="1" fill="#DEB887" />
    <rect x="12" y="2" width="1" height="1" fill="#DEB887" />
    {/* Head */}
    <rect x="3" y="3" width="10" height="8" fill="#D2691E" />
    {/* Face */}
    <rect x="5" y="5" width="6" height="4" fill="#DEB887" />
    {/* Eyes */}
    <rect x="5" y="5" width="2" height="2" fill="#2C1810" />
    <rect x="9" y="5" width="2" height="2" fill="#2C1810" />
    <rect x="5" y="5" width="1" height="1" fill="#FFFFFF" />
    <rect x="9" y="5" width="1" height="1" fill="#FFFFFF" />
    {/* Nose */}
    <rect x="7" y="7" width="2" height="1" fill="#2C1810" />
    {/* Mouth */}
    <rect x="7" y="8" width="2" height="1" fill="#8B4513" />
    {/* Body */}
    <rect x="4" y="11" width="8" height="5" fill="#D2691E" />
    {/* Belly */}
    <rect x="6" y="12" width="4" height="3" fill="#DEB887" />
    {/* Arms */}
    <rect x="2" y="12" width="2" height="3" fill="#D2691E" />
    <rect x="12" y="12" width="2" height="3" fill="#D2691E" />
    {/* Legs */}
    <rect x="4" y="16" width="3" height="2" fill="#D2691E" />
    <rect x="9" y="16" width="3" height="2" fill="#D2691E" />
  </svg>
)

const PixelBottle = () => (
  <svg viewBox="0 0 10 20" style={{ imageRendering: 'pixelated' }}>
    {/* Nipple */}
    <rect x="3" y="0" width="4" height="2" fill="#FFB6C1" />
    <rect x="4" y="2" width="2" height="1" fill="#FFB6C1" />
    {/* Cap ring */}
    <rect x="2" y="3" width="6" height="2" fill="#87CEEB" />
    {/* Bottle body */}
    <rect x="1" y="5" width="8" height="12" fill="#E0FFFF" />
    <rect x="2" y="5" width="6" height="12" fill="#FFFFFF" opacity="0.5" />
    {/* Milk */}
    <rect x="2" y="9" width="6" height="7" fill="#FFFAF0" />
    {/* Measurement lines */}
    <rect x="1" y="7" width="1" height="1" fill="#87CEEB" />
    <rect x="1" y="10" width="1" height="1" fill="#87CEEB" />
    <rect x="1" y="13" width="1" height="1" fill="#87CEEB" />
    {/* Bottom */}
    <rect x="1" y="17" width="8" height="2" fill="#87CEEB" />
  </svg>
)

const PixelRattle = () => (
  <svg viewBox="0 0 16 20" style={{ imageRendering: 'pixelated' }}>
    {/* Rattle head */}
    <rect x="4" y="1" width="8" height="2" fill="#FF69B4" />
    <rect x="3" y="3" width="10" height="6" fill="#FF69B4" />
    <rect x="4" y="9" width="8" height="2" fill="#FF69B4" />
    {/* Dots on rattle */}
    <rect x="5" y="4" width="2" height="2" fill="#FFB6C1" />
    <rect x="9" y="4" width="2" height="2" fill="#FFB6C1" />
    <rect x="7" y="6" width="2" height="2" fill="#FFB6C1" />
    {/* Handle */}
    <rect x="6" y="11" width="4" height="2" fill="#DEB887" />
    <rect x="6" y="13" width="4" height="5" fill="#FFD700" />
    <rect x="7" y="14" width="2" height="3" fill="#FFA500" />
    {/* Handle bottom */}
    <rect x="5" y="18" width="6" height="2" fill="#DEB887" />
  </svg>
)

const PixelDuck = () => (
  <svg viewBox="0 0 16 14" style={{ imageRendering: 'pixelated' }}>
    {/* Body */}
    <rect x="3" y="6" width="10" height="6" fill="#FFD700" />
    <rect x="2" y="7" width="12" height="4" fill="#FFD700" />
    {/* Head */}
    <rect x="9" y="2" width="6" height="5" fill="#FFD700" />
    <rect x="10" y="1" width="4" height="2" fill="#FFD700" />
    {/* Eye */}
    <rect x="12" y="3" width="2" height="2" fill="#2C1810" />
    <rect x="12" y="3" width="1" height="1" fill="#FFFFFF" />
    {/* Beak */}
    <rect x="14" y="5" width="2" height="2" fill="#FF6600" />
    {/* Wing */}
    <rect x="4" y="8" width="4" height="3" fill="#FFA500" />
    {/* Tail */}
    <rect x="1" y="7" width="2" height="2" fill="#FFD700" />
    <rect x="0" y="6" width="2" height="2" fill="#FFD700" />
  </svg>
)

const PixelBlocks = () => (
  <svg viewBox="0 0 20 14" style={{ imageRendering: 'pixelated' }}>
    {/* Block A - Red */}
    <rect x="0" y="6" width="8" height="8" fill="#DC143C" />
    <rect x="1" y="7" width="6" height="6" fill="#FF6B6B" />
    <rect x="2" y="8" width="4" height="4" fill="#FFFFFF" />
    <rect x="3" y="9" width="2" height="2" fill="#DC143C" />
    {/* Block B - Blue */}
    <rect x="6" y="2" width="8" height="8" fill="#4169E1" />
    <rect x="7" y="3" width="6" height="6" fill="#6B8BFF" />
    <rect x="8" y="4" width="4" height="4" fill="#FFFFFF" />
    <rect x="9" y="5" width="2" height="2" fill="#4169E1" />
    {/* Block C - Green */}
    <rect x="12" y="6" width="8" height="8" fill="#228B22" />
    <rect x="13" y="7" width="6" height="6" fill="#6BBF6B" />
    <rect x="14" y="8" width="4" height="4" fill="#FFFFFF" />
    <rect x="15" y="9" width="2" height="2" fill="#228B22" />
  </svg>
)

const PixelPacifier = () => (
  <svg viewBox="0 0 14 12" style={{ imageRendering: 'pixelated' }}>
    {/* Nipple */}
    <rect x="5" y="0" width="4" height="3" fill="#FFB6C1" />
    <rect x="6" y="3" width="2" height="2" fill="#FFB6C1" />
    {/* Shield */}
    <rect x="2" y="5" width="10" height="4" fill="#87CEEB" />
    <rect x="1" y="6" width="12" height="2" fill="#87CEEB" />
    {/* Shield cutouts */}
    <rect x="3" y="6" width="2" height="2" fill="#E0FFFF" />
    <rect x="9" y="6" width="2" height="2" fill="#E0FFFF" />
    {/* Handle */}
    <rect x="4" y="9" width="6" height="3" fill="#FFD700" />
    <rect x="5" y="10" width="4" height="1" fill="#FFA500" />
  </svg>
)

const PixelMobile = () => (
  <svg viewBox="0 0 24 24" style={{ imageRendering: 'pixelated' }}>
    {/* Top bar */}
    <rect x="10" y="0" width="4" height="2" fill="#8B4513" />
    {/* Main bar */}
    <rect x="4" y="2" width="16" height="2" fill="#A0522D" />
    {/* Strings */}
    <rect x="6" y="4" width="1" height="4" fill="#C0C0C0" />
    <rect x="11" y="4" width="1" height="6" fill="#C0C0C0" />
    <rect x="17" y="4" width="1" height="4" fill="#C0C0C0" />
    {/* Star left */}
    <rect x="5" y="8" width="1" height="2" fill="#FFD700" />
    <rect x="4" y="9" width="3" height="1" fill="#FFD700" />
    <rect x="5" y="10" width="1" height="1" fill="#FFD700" />
    {/* Moon center */}
    <rect x="9" y="10" width="5" height="5" fill="#F0E68C" />
    <rect x="10" y="11" width="4" height="3" fill="#1a1a2e" />
    {/* Star right */}
    <rect x="16" y="8" width="1" height="2" fill="#FFD700" />
    <rect x="15" y="9" width="3" height="1" fill="#FFD700" />
    <rect x="16" y="10" width="1" height="1" fill="#FFD700" />
    {/* Extra stars */}
    <rect x="3" y="14" width="1" height="1" fill="#FFD700" />
    <rect x="2" y="15" width="1" height="1" fill="#FFD700" />
    <rect x="20" y="13" width="1" height="1" fill="#FFD700" />
    <rect x="21" y="14" width="1" height="1" fill="#FFD700" />
  </svg>
)

const NURSERY_ITEMS = [
  { Component: PixelCrib, size: 60 },
  { Component: PixelTeddy, size: 45 },
  { Component: PixelBottle, size: 35 },
  { Component: PixelRattle, size: 40 },
  { Component: PixelDuck, size: 40 },
  { Component: PixelBlocks, size: 50 },
  { Component: PixelPacifier, size: 35 },
  { Component: PixelMobile, size: 55 },
]

function FloatingItem({ item, index, totalItems }) {
  // Deterministic but varied positioning
  const seed = index * 137.5
  const left = ((seed * 7) % 90) + 5
  const top = ((seed * 13) % 80) + 10
  const delay = (index * 2.3) % 10
  const duration = 20 + (index % 5) * 4
  const rotation = ((seed * 3) % 20) - 10

  const style = {
    left: `${left}%`,
    top: `${top}%`,
    width: `${item.size}px`,
    height: `${item.size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    transform: `rotate(${rotation}deg)`,
  }

  return (
    <div
      className="nursery-item absolute opacity-15 pointer-events-none"
      style={style}
    >
      <item.Component />
    </div>
  )
}

export default function NurseryBackground() {
  // Generate items - mix of all types
  const items = useMemo(() => {
    const result = []
    // Add 2 of each item type for variety
    for (let i = 0; i < 2; i++) {
      NURSERY_ITEMS.forEach((item, idx) => {
        result.push({ ...item, key: `${idx}-${i}` })
      })
    }
    return result
  }, [])

  return (
    <div className="nursery-background fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item, index) => (
        <FloatingItem
          key={item.key}
          item={item}
          index={index}
          totalItems={items.length}
        />
      ))}

      <style>{`
        .nursery-item {
          animation: nurseryFloat 20s ease-in-out infinite;
        }

        @keyframes nurseryFloat {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          25% {
            transform: translateY(-15px) rotate(calc(var(--rotation, 0deg) + 3deg));
          }
          50% {
            transform: translateY(-5px) rotate(calc(var(--rotation, 0deg) - 2deg));
          }
          75% {
            transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 2deg));
          }
        }

        /* Reduce items on mobile */
        @media (max-width: 640px) {
          .nursery-item:nth-child(n+9) {
            display: none;
          }
          .nursery-item {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  )
}
