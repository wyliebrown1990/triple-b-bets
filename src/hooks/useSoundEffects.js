import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'tripleBBets_soundMuted'

// Simple 8-bit sound generator using Web Audio API
class SoundGenerator {
  constructor() {
    this.audioContext = null
    this.initialized = false
  }

  init() {
    if (this.initialized) return
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.initialized = true
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  // Generate a simple tone
  playTone(frequency, duration, type = 'square', volume = 0.3) {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    // Envelope for 8-bit feel
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // Coin sound - ascending arpeggio
  playCoin() {
    this.playTone(587, 0.1, 'square', 0.2) // D5
    setTimeout(() => this.playTone(880, 0.15, 'square', 0.2), 80) // A5
  }

  // Positive chime - happy sound
  playChime() {
    this.playTone(523, 0.1, 'sine', 0.25) // C5
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.25), 100) // E5
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.25), 200) // G5
  }

  // Pop/boing for taunts
  playPop() {
    this.playTone(300, 0.05, 'square', 0.2)
    setTimeout(() => this.playTone(600, 0.1, 'square', 0.15), 50)
  }

  // Victory fanfare
  playFanfare() {
    const notes = [
      { freq: 523, delay: 0 },    // C5
      { freq: 523, delay: 150 },  // C5
      { freq: 523, delay: 300 },  // C5
      { freq: 523, delay: 450 },  // C5
      { freq: 415, delay: 600 },  // Ab4
      { freq: 466, delay: 750 },  // Bb4
      { freq: 523, delay: 900 },  // C5
      { freq: 466, delay: 1000 }, // Bb4
      { freq: 523, delay: 1100 }, // C5
    ]
    notes.forEach(({ freq, delay }) => {
      setTimeout(() => this.playTone(freq, 0.15, 'square', 0.2), delay)
    })
  }

  // Error buzz
  playBuzz() {
    this.playTone(150, 0.15, 'sawtooth', 0.15)
    setTimeout(() => this.playTone(120, 0.2, 'sawtooth', 0.15), 150)
  }

  // Soft blip for hover
  playBlip() {
    this.playTone(800, 0.05, 'sine', 0.1)
  }

  // Tick for countdown urgency
  playTick() {
    this.playTone(1000, 0.03, 'square', 0.15)
  }
}

const soundGenerator = new SoundGenerator()

export default function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem(STORAGE_KEY)
    // Default to muted on mobile
    if (stored === null) {
      return window.innerWidth < 768
    }
    return stored === 'true'
  })

  const hasInteracted = useRef(false)

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted.current) {
        soundGenerator.init()
        hasInteracted.current = true
      }
    }

    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('touchstart', handleInteraction, { once: true })

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

  // Persist mute preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isMuted))
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const playSound = useCallback((soundName) => {
    if (isMuted || !hasInteracted.current) return

    // Initialize if needed
    soundGenerator.init()

    switch (soundName) {
      case 'coin':
        soundGenerator.playCoin()
        break
      case 'chime':
        soundGenerator.playChime()
        break
      case 'pop':
        soundGenerator.playPop()
        break
      case 'fanfare':
        soundGenerator.playFanfare()
        break
      case 'buzz':
        soundGenerator.playBuzz()
        break
      case 'blip':
        soundGenerator.playBlip()
        break
      case 'tick':
        soundGenerator.playTick()
        break
      default:
        console.warn(`Unknown sound: ${soundName}`)
    }
  }, [isMuted])

  return {
    isMuted,
    toggleMute,
    playSound,
  }
}
