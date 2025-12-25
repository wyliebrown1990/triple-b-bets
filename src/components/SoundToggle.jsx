export default function SoundToggle({ isMuted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-20 right-4 z-50
        w-10 h-10 rounded-full
        border-2 transition-all duration-200
        flex items-center justify-center
        ${isMuted
          ? 'bg-gray-200 border-gray-300 text-gray-500'
          : 'bg-sage/20 border-sage text-sage-dark hover:bg-sage/30'
        }
      `}
      title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        // Muted icon - speaker with X
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Unmuted icon - speaker with waves
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}

      {/* Sound wave animation when unmuted */}
      {!isMuted && (
        <span className="absolute -right-1 -top-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sage"></span>
          </span>
        </span>
      )}
    </button>
  )
}
