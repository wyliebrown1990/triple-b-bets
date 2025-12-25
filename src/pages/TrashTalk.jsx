import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScS6BLy6BBlKZZyy_PGCe-ywU2d1z-tsfoiPgPQdCnUvHSTZA/formResponse'
const FORM_ENTRIES = {
  name: 'entry.143146231',
  message: 'entry.746885117',
  target: 'entry.2112818997',
}

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_0loyPyFax5XqU0-fl2RLF26EO9eiU_S7qmtr-2j5_bMiWKoEcdNg-iH6aupnCNH7u5m36WW80qkP/pub?output=csv'

// Parse CSV helper
function parseCSV(csvText) {
  const lines = csvText.split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const data = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue
    const values = parseCSVLine(lines[i])
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    data.push(row)
  }

  return data
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

// Time ago helper
function timeAgo(timestamp) {
  if (!timestamp) return 'Just now'

  const now = new Date()
  const then = new Date(timestamp)
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return then.toLocaleDateString()
}

// Random rotation for playful look
function getRandomRotation() {
  return Math.random() * 4 - 2 // -2 to 2 degrees
}

// Random emoji reactions
const REACTIONS = ['😂', '🔥', '💀', '👀', '😤', '🎯', '💪', '🤣']
function getRandomReaction() {
  return REACTIONS[Math.floor(Math.random() * REACTIONS.length)]
}

export default function TrashTalk() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bettorNames, setBettorNames] = useState([])

  // Form state
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('')

  // Fetch existing bettors for target dropdown
  useEffect(() => {
    async function fetchBettors() {
      try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSS0cgeOJ2X1AmNZtH7JBYhCgFARs1RWxgKisk3sM1PY2Af4cHKsFj4Uzer-yX8_etnQxgjTZB6NdO5/pub?output=csv')
        if (response.ok) {
          const csvText = await response.text()
          const data = parseCSV(csvText)
          const names = [...new Set(data.map(row => row['Name']).filter(Boolean))]
          setBettorNames(names)
        }
      } catch (err) {
        console.error('Error fetching bettors:', err)
      }
    }
    fetchBettors()
  }, [])

  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true)

        // Check if form is configured
        if (GOOGLE_SHEET_CSV_URL.includes('YOUR_SHEET_ID')) {
          // Show demo messages if not configured
          setMessages([
            { name: 'Demo User', message: 'Set up your Google Form to enable trash talk!', target: '', timestamp: new Date().toISOString(), reaction: '👀' },
          ])
          setLoading(false)
          return
        }

        const response = await fetch(GOOGLE_SHEET_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch messages')

        const csvText = await response.text()
        const data = parseCSV(csvText)

        const transformedMessages = data.map(row => ({
          name: row['Name'] || 'Anonymous',
          message: row['Message'] || '',
          target: row['Target'] || '',
          timestamp: row['Timestamp'],
          reaction: getRandomReaction(),
          rotation: getRandomRotation(),
        })).reverse() // Newest first

        setMessages(transformedMessages)
        setError(null)
      } catch (err) {
        console.error('Error fetching messages:', err)
        setError('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [submitted])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !message.trim()) return
    if (message.length > 280) return

    // Check if form is configured
    if (GOOGLE_FORM_ACTION_URL.includes('YOUR_FORM_ID')) {
      alert('Please configure your Google Form URL in TrashTalk.jsx')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append(FORM_ENTRIES.name, name.trim())
      formData.append(FORM_ENTRIES.message, message.trim())
      formData.append(FORM_ENTRIES.target, target)

      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      })

      // Optimistic UI update
      setMessages(prev => [{
        name: name.trim(),
        message: message.trim(),
        target,
        timestamp: new Date().toISOString(),
        reaction: getRandomReaction(),
        rotation: getRandomRotation(),
      }, ...prev])

      // Reset form
      setMessage('')
      setTarget('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error('Error submitting:', err)
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-brown mb-2">
            Trash Talk Wall
          </h1>
          <p className="text-gray-600">
            Talk smack, call out predictions, have fun!
          </p>
        </div>

        {/* Submit Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-4 border-dashed border-sage/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-brown mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Who's talking?"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-brown mb-1">Target (optional)</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none bg-white"
                >
                  <option value="">Everyone</option>
                  {bettorNames.map(bettor => (
                    <option key={bettor} value={bettor}>{bettor}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brown mb-1">
                Your Message
                <span className={`float-right font-normal ${message.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
                  {message.length}/280
                </span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Talk your trash..."
                rows={3}
                maxLength={300}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !name.trim() || !message.trim() || message.length > 280}
              className="w-full bg-gold hover:bg-gold-dark disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="animate-spin">🔄</span> Posting...
                </>
              ) : (
                <>
                  <span>🔥</span> Post Trash Talk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Messages Wall */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-bounce">💬</div>
            <p className="text-gray-600">Loading trash talk...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🤐</div>
            <h2 className="font-display text-2xl font-bold text-brown mb-2">
              No Trash Talk Yet!
            </h2>
            <p className="text-gray-600">
              Be the first to throw some shade!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 border-2 border-gray-100 transition-transform hover:scale-[1.02]"
                style={{ transform: `rotate(${msg.rotation || 0}deg)` }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-sage-dark">
                      {msg.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-brown">{msg.name}</span>
                      {msg.target && (
                        <>
                          <span className="text-gray-400">→</span>
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            🔥 @{msg.target}
                          </span>
                        </>
                      )}
                      <span className="text-gray-400 text-sm">{timeAgo(msg.timestamp)}</span>
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 mt-1 break-words">{msg.message}</p>

                    {/* Reaction */}
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-sm">
                        {msg.reaction}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to betting link */}
        <div className="text-center mt-8">
          <Link to="/bets" className="text-sage hover:text-sage-dark font-medium">
            ← Back to View Bets
          </Link>
        </div>
      </div>
    </div>
  )
}
