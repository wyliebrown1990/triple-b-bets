export default function FloatingIcons() {
  // Base icon definitions
  const iconTypes = {
    walk: (
      <>
        <rect x="3" y="0" width="2" height="2" fill="#FFE4C4" />
        <rect x="2" y="2" width="4" height="3" fill="#87A878" />
        <rect x="1" y="5" width="2" height="3" fill="#8B7355" />
        <rect x="5" y="5" width="2" height="3" fill="#8B7355" />
      </>
    ),
    word: (
      <>
        <rect x="1" y="0" width="6" height="1" fill="#FFFFFF" />
        <rect x="0" y="1" width="8" height="4" fill="#FFFFFF" />
        <rect x="1" y="5" width="6" height="1" fill="#FFFFFF" />
        <rect x="1" y="6" width="2" height="2" fill="#FFFFFF" />
        <rect x="2" y="2" width="1" height="2" fill="#4A4A4A" />
        <rect x="4" y="2" width="1" height="2" fill="#4A4A4A" />
        <rect x="6" y="2" width="1" height="2" fill="#4A4A4A" />
      </>
    ),
    crawl: (
      <>
        <rect x="0" y="2" width="2" height="2" fill="#FFE4C4" />
        <rect x="2" y="3" width="4" height="2" fill="#87A878" />
        <rect x="1" y="5" width="2" height="1" fill="#FFE4C4" />
        <rect x="5" y="5" width="2" height="1" fill="#FFE4C4" />
      </>
    ),
    bike: (
      <>
        <rect x="0" y="4" width="3" height="3" fill="#D4A853" />
        <rect x="5" y="4" width="3" height="3" fill="#D4A853" />
        <rect x="1" y="5" width="1" height="1" fill="#FDF6E3" />
        <rect x="6" y="5" width="1" height="1" fill="#FDF6E3" />
        <rect x="2" y="2" width="4" height="2" fill="#8B7355" />
        <rect x="3" y="0" width="2" height="2" fill="#FFE4C4" />
      </>
    ),
    tooth: (
      <>
        <rect x="1" y="0" width="4" height="1" fill="#FFFFFF" />
        <rect x="0" y="1" width="6" height="3" fill="#FFFFFF" />
        <rect x="0" y="4" width="2" height="3" fill="#FFFFFF" />
        <rect x="4" y="4" width="2" height="3" fill="#FFFFFF" />
      </>
    ),
    food: (
      <>
        <rect x="3" y="0" width="2" height="1" fill="#6B8E5E" />
        <rect x="1" y="1" width="6" height="2" fill="#E74C3C" />
        <rect x="0" y="3" width="8" height="3" fill="#E74C3C" />
        <rect x="1" y="6" width="6" height="1" fill="#E74C3C" />
        <rect x="2" y="2" width="2" height="2" fill="#FF6B6B" />
      </>
    ),
    height: (
      <>
        <rect x="2" y="0" width="4" height="8" fill="#D4A853" />
        <rect x="0" y="1" width="2" height="1" fill="#8B7355" />
        <rect x="0" y="3" width="2" height="1" fill="#8B7355" />
        <rect x="0" y="5" width="2" height="1" fill="#8B7355" />
        <rect x="0" y="7" width="2" height="1" fill="#8B7355" />
      </>
    ),
    weight: (
      <>
        <rect x="0" y="5" width="8" height="3" fill="#87A878" />
        <rect x="2" y="3" width="4" height="2" fill="#6B8E5E" />
        <rect x="3" y="1" width="2" height="2" fill="#FFFFFF" />
        <rect x="3" y="2" width="1" height="1" fill="#4A4A4A" />
      </>
    ),
    sleep: (
      <>
        <rect x="2" y="0" width="4" height="1" fill="#F4D03F" />
        <rect x="1" y="1" width="3" height="1" fill="#F4D03F" />
        <rect x="0" y="2" width="3" height="2" fill="#F4D03F" />
        <rect x="1" y="4" width="3" height="1" fill="#F4D03F" />
        <rect x="2" y="5" width="4" height="1" fill="#F4D03F" />
        <rect x="5" y="1" width="1" height="1" fill="#F4D03F" />
        <rect x="6" y="2" width="1" height="2" fill="#F4D03F" />
        <rect x="5" y="4" width="1" height="1" fill="#F4D03F" />
      </>
    ),
    dice: (
      <>
        <rect x="0" y="0" width="8" height="8" fill="#FFFFFF" />
        <rect x="1" y="1" width="1" height="1" fill="#4A4A4A" />
        <rect x="6" y="1" width="1" height="1" fill="#4A4A4A" />
        <rect x="3" y="3" width="2" height="2" fill="#4A4A4A" />
        <rect x="1" y="6" width="1" height="1" fill="#4A4A4A" />
        <rect x="6" y="6" width="1" height="1" fill="#4A4A4A" />
      </>
    ),
    star: (
      <>
        <rect x="3" y="0" width="2" height="2" fill="#F4D03F" />
        <rect x="0" y="2" width="8" height="2" fill="#F4D03F" />
        <rect x="1" y="4" width="2" height="2" fill="#F4D03F" />
        <rect x="5" y="4" width="2" height="2" fill="#F4D03F" />
        <rect x="2" y="6" width="1" height="1" fill="#F4D03F" />
        <rect x="5" y="6" width="1" height="1" fill="#F4D03F" />
      </>
    ),
    heart: (
      <>
        <rect x="1" y="1" width="2" height="2" fill="#E74C3C" />
        <rect x="5" y="1" width="2" height="2" fill="#E74C3C" />
        <rect x="0" y="2" width="8" height="2" fill="#E74C3C" />
        <rect x="1" y="4" width="6" height="1" fill="#E74C3C" />
        <rect x="2" y="5" width="4" height="1" fill="#E74C3C" />
        <rect x="3" y="6" width="2" height="1" fill="#E74C3C" />
      </>
    ),
    bottle: (
      <>
        <rect x="3" y="0" width="2" height="1" fill="#87A878" />
        <rect x="2" y="1" width="4" height="1" fill="#FFFFFF" />
        <rect x="2" y="2" width="4" height="5" fill="#E8F4FD" />
        <rect x="2" y="7" width="4" height="1" fill="#FFFFFF" />
        <rect x="3" y="3" width="2" height="3" fill="#FFFFFF" opacity="0.5" />
      </>
    ),
  }

  const typeKeys = Object.keys(iconTypes)

  // Generate 40 icons spread across the screen
  const icons = []
  for (let i = 0; i < 40; i++) {
    const typeIndex = i % typeKeys.length
    icons.push({
      id: `icon-${i}`,
      type: typeKeys[typeIndex],
      x: (i * 2.5) % 100,
      delay: (i * 0.7) % 15,
      duration: 15 + (i % 12),
      size: 24 + (i % 3) * 8,
    })
  }

  return (
    <div className="floating-icons-container">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="floating-icon"
          style={{
            left: `${icon.x}%`,
            animationDelay: `${icon.delay}s`,
            animationDuration: `${icon.duration}s`,
          }}
        >
          <svg
            width={icon.size}
            height={icon.size}
            viewBox="0 0 8 8"
            style={{ imageRendering: 'pixelated' }}
          >
            {iconTypes[icon.type]}
          </svg>
        </div>
      ))}

      <style>{`
        .floating-icons-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .floating-icon {
          position: absolute;
          opacity: 0.12;
          animation: floatAndSwirl linear infinite;
        }

        .floating-icon:nth-child(odd) {
          animation-name: floatAndSwirlAlt;
        }

        @keyframes floatAndSwirl {
          0% {
            transform: translateY(110vh) rotate(0deg) scale(1);
          }
          20% {
            transform: translateY(85vh) translateX(40px) rotate(72deg) scale(1.1);
          }
          40% {
            transform: translateY(60vh) translateX(-30px) rotate(144deg) scale(0.9);
          }
          60% {
            transform: translateY(35vh) translateX(35px) rotate(216deg) scale(1.05);
          }
          80% {
            transform: translateY(10vh) translateX(-25px) rotate(288deg) scale(0.95);
          }
          100% {
            transform: translateY(-15vh) translateX(0) rotate(360deg) scale(1);
          }
        }

        @keyframes floatAndSwirlAlt {
          0% {
            transform: translateY(110vh) rotate(0deg) scale(0.9);
          }
          20% {
            transform: translateY(85vh) translateX(-35px) rotate(-72deg) scale(1);
          }
          40% {
            transform: translateY(60vh) translateX(45px) rotate(-144deg) scale(1.1);
          }
          60% {
            transform: translateY(35vh) translateX(-40px) rotate(-216deg) scale(0.95);
          }
          80% {
            transform: translateY(10vh) translateX(30px) rotate(-288deg) scale(1.05);
          }
          100% {
            transform: translateY(-15vh) translateX(0) rotate(-360deg) scale(0.9);
          }
        }
      `}</style>
    </div>
  )
}
