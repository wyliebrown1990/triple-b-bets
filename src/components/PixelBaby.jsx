export default function PixelBaby() {
  return (
    <div className="pixel-baby-container relative">
      {/* The Baby */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 24 24"
        className="mx-auto"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Background circle */}
        <rect x="6" y="2" width="12" height="2" fill="#FFE4C4" />
        <rect x="4" y="4" width="16" height="2" fill="#FFE4C4" />
        <rect x="3" y="6" width="18" height="2" fill="#FFE4C4" />
        <rect x="3" y="8" width="18" height="2" fill="#FFE4C4" />
        <rect x="3" y="10" width="18" height="2" fill="#FFE4C4" />
        <rect x="4" y="12" width="16" height="2" fill="#FFE4C4" />
        <rect x="6" y="14" width="12" height="2" fill="#FFE4C4" />

        {/* Hair - light brown tuft */}
        <rect x="8" y="2" width="2" height="2" fill="#C4A86B" />
        <rect x="10" y="1" width="2" height="3" fill="#C4A86B" />
        <rect x="12" y="2" width="2" height="2" fill="#C4A86B" />
        <rect x="14" y="2" width="1" height="1" fill="#C4A86B" />

        {/* Eyes */}
        <rect x="7" y="7" width="2" height="2" fill="#4A4A4A" />
        <rect x="13" y="7" width="2" height="2" fill="#4A4A4A" />

        {/* Eye sparkle */}
        <rect x="7" y="7" width="1" height="1" fill="#FFFFFF" />
        <rect x="13" y="7" width="1" height="1" fill="#FFFFFF" />

        {/* Rosy cheeks */}
        <rect x="5" y="9" width="2" height="1" fill="#FFB6C1" />
        <rect x="15" y="9" width="2" height="1" fill="#FFB6C1" />

        {/* Smile */}
        <rect x="9" y="10" width="1" height="1" fill="#E8A0A0" />
        <rect x="10" y="11" width="2" height="1" fill="#E8A0A0" />
        <rect x="12" y="10" width="1" height="1" fill="#E8A0A0" />

        {/* Body - onesie */}
        <rect x="7" y="16" width="10" height="2" fill="#87A878" />
        <rect x="6" y="18" width="12" height="2" fill="#87A878" />
        <rect x="5" y="20" width="14" height="2" fill="#87A878" />
        <rect x="5" y="22" width="5" height="2" fill="#87A878" />
        <rect x="14" y="22" width="5" height="2" fill="#87A878" />

        {/* Onesie buttons */}
        <rect x="11" y="17" width="1" height="1" fill="#6B8E5E" />
        <rect x="11" y="19" width="1" height="1" fill="#6B8E5E" />

        {/* Little hands */}
        <rect x="4" y="18" width="2" height="2" fill="#FFE4C4" />
        <rect x="18" y="18" width="2" height="2" fill="#FFE4C4" />
      </svg>

      {/* The Dog */}
      <div className="pixel-dog">
        <svg
          width="50"
          height="40"
          viewBox="0 0 16 12"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Body */}
          <rect x="4" y="5" width="8" height="4" fill="#8B5A2B" />
          <rect x="3" y="6" width="10" height="3" fill="#8B5A2B" />

          {/* Head */}
          <rect className="dog-head" x="11" y="3" width="4" height="4" fill="#8B5A2B" />
          <rect className="dog-head" x="12" y="2" width="2" height="1" fill="#8B5A2B" />

          {/* Ear */}
          <rect className="dog-head" x="11" y="1" width="2" height="2" fill="#6B4423" />

          {/* Snout */}
          <rect className="dog-head dog-snout" x="14" y="4" width="2" height="2" fill="#A0522D" />

          {/* Nose */}
          <rect className="dog-head" x="15" y="4" width="1" height="1" fill="#2C1810" />

          {/* Eye */}
          <rect className="dog-head" x="12" y="3" width="1" height="1" fill="#2C1810" />

          {/* Tongue (for licking) */}
          <rect className="dog-tongue" x="14" y="6" width="1" height="2" fill="#FF6B8A" />

          {/* Legs */}
          <rect x="4" y="9" width="2" height="3" fill="#8B5A2B" />
          <rect x="7" y="9" width="2" height="3" fill="#8B5A2B" />

          {/* Tail */}
          <rect className="dog-tail" x="1" y="4" width="3" height="2" fill="#8B5A2B" />
          <rect className="dog-tail" x="0" y="3" width="2" height="2" fill="#8B5A2B" />

          {/* Collar */}
          <rect x="10" y="6" width="2" height="1" fill="#E74C3C" />
        </svg>
      </div>

      <style>{`
        .pixel-baby-container {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .pixel-dog {
          position: absolute;
          bottom: -5px;
          animation: dogMove 6s ease-in-out infinite;
        }

        .dog-tongue {
          opacity: 0;
          animation: tongueAnim 6s ease-in-out infinite;
        }

        .dog-head {
          animation: headBob 6s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }

        .dog-tail {
          animation: tailWag 0.3s ease-in-out infinite;
          transform-origin: right center;
          transform-box: fill-box;
        }

        @keyframes dogMove {
          0% {
            right: -20px;
            transform: scaleX(1);
          }
          /* Walk to baby */
          20% {
            right: 25px;
            transform: scaleX(1);
          }
          /* Sniff */
          25% {
            right: 25px;
            transform: scaleX(1);
          }
          /* Sniff more */
          35% {
            right: 30px;
            transform: scaleX(1);
          }
          /* Lick */
          45% {
            right: 25px;
            transform: scaleX(1);
          }
          /* Sniff again */
          55% {
            right: 28px;
            transform: scaleX(1);
          }
          /* Walk away */
          70% {
            right: -10px;
            transform: scaleX(-1);
          }
          /* Turn around off screen */
          75% {
            right: -30px;
            transform: scaleX(-1);
          }
          /* Come back */
          85% {
            right: -30px;
            transform: scaleX(1);
          }
          100% {
            right: -20px;
            transform: scaleX(1);
          }
        }

        @keyframes headBob {
          0%, 20% {
            transform: translateY(0) rotate(0deg);
          }
          /* Sniffing - head down */
          25%, 35% {
            transform: translateY(2px) rotate(15deg);
          }
          /* Licking - head up slightly */
          40%, 50% {
            transform: translateY(-1px) rotate(-5deg);
          }
          /* Sniff again */
          55%, 60% {
            transform: translateY(2px) rotate(10deg);
          }
          65%, 100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        @keyframes tongueAnim {
          0%, 38% {
            opacity: 0;
          }
          /* Tongue out for licking */
          42%, 52% {
            opacity: 1;
          }
          56%, 100% {
            opacity: 0;
          }
        }

        @keyframes tailWag {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </div>
  )
}
