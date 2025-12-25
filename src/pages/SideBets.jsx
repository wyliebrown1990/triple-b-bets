import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CALLOUT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdQqFj_kmLxLCn3DRHZE2l8PCCs_fD-VHlQp9CCnIEktEtygA/formResponse'
const CALLOUT_ENTRIES = {
  challenger: 'entry.460195111',
  opponent: 'entry.996099016',
  milestone: 'entry.1318083031',
  prediction: 'entry.1163229427',
  wager: 'entry.25679231',
  trashTalk: 'entry.132001438',
}

const CALLOUTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtkk42UamVqxiLGgEoLPdAlr8nV0KeuvsJTc9mRYHBX_UfAnswVuh1Fcq7CZl6lgwu96VWg6RP_I0v/pub?output=csv'

// Milestone options
const MILESTONES = [
  { id: 'crawl', name: 'First Crawl', emoji: '🐛', unit: 'months' },
  { id: 'walk', name: 'First Walk', emoji: '🚶', unit: 'months' },
  { id: 'word', name: 'First Word', emoji: '🗣️', unit: '' },
  { id: 'word_age', name: 'First Word Age', emoji: '🗣️', unit: 'months' },
  { id: 'bike', name: 'First Bike Ride', emoji: '🚴', unit: 'years' },
  { id: 'tooth', name: 'First Tooth', emoji: '🦷', unit: 'months' },
  { id: 'food', name: 'First Solid Food', emoji: '🍎', unit: '' },
  { id: 'height', name: 'Height at Age 1', emoji: '📏', unit: 'inches' },
  { id: 'weight', name: 'Weight at Age 1', emoji: '⚖️', unit: 'lbs' },
  { id: 'sleep', name: 'Sleep Through Night', emoji: '😴', unit: 'weeks' },
  { id: 'wildcard', name: 'Wildcard', emoji: '🎲', unit: '' },
]

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

export default function SideBets() {
  const [callouts, setCallouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bettorNames, setBettorNames] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [challenger, setChallenger] = useState('')
  const [opponent, setOpponent] = useState('')
  const [milestone, setMilestone] = useState('')
  const [prediction, setPrediction] = useState('')
  const [confidence, setConfidence] = useState(3)
  const [trashTalk, setTrashTalk] = useState('')

  // Fetch existing bettors
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

  // Fetch callouts
  useEffect(() => {
    async function fetchCallouts() {
      try {
        setLoading(true)

        const response = await fetch(CALLOUTS_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch callouts')

        const csvText = await response.text()
        const data = parseCSV(csvText)

        const transformedCallouts = data.map(row => ({
          from: row['Challenger'] || 'Unknown',
          target: row['Opponent'] || '',
          milestone: row['Milestone'] || '',
          prediction: row['Prediction'] || '',
          confidence: parseInt(row['Wager']) || 3,
          trashTalk: row['Trash Talk'] || '',
          timestamp: row['Timestamp'],
        })).reverse()

        setCallouts(transformedCallouts)
        setError(null)
      } catch (err) {
        console.error('Error fetching callouts:', err)
        setError('Failed to load callouts')
      } finally {
        setLoading(false)
      }
    }

    fetchCallouts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!challenger || !milestone || !prediction) return

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append(CALLOUT_ENTRIES.challenger, challenger)
      formData.append(CALLOUT_ENTRIES.opponent, opponent)
      formData.append(CALLOUT_ENTRIES.milestone, milestone)
      formData.append(CALLOUT_ENTRIES.prediction, prediction)
      formData.append(CALLOUT_ENTRIES.wager, confidence.toString())
      formData.append(CALLOUT_ENTRIES.trashTalk, trashTalk)

      await fetch(CALLOUT_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      })

      // Optimistic UI update
      setCallouts(prev => [{
        from: challenger,
        target: opponent,
        milestone,
        prediction,
        confidence,
        trashTalk,
        timestamp: new Date().toISOString(),
      }, ...prev])

      // Reset form
      setOpponent('')
      setMilestone('')
      setPrediction('')
      setConfidence(3)
      setTrashTalk('')
      setShowForm(false)
    } catch (err) {
      console.error('Error submitting:', err)
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getMilestoneInfo = (id) => {
    return MILESTONES.find(m => m.id === id) || { name: id, emoji: '❓', unit: '' }
  }

  const getConfidenceLabel = (level) => {
    const labels = ['', 'Meh', 'Pretty Sure', 'Confident', 'Very Confident', 'LOCK IT IN']
    return labels[level] || ''
  }

  const getConfidenceEmoji = (level) => {
    const emojis = ['', '🤷', '🤔', '😏', '😤', '🔥']
    return emojis[level] || '🤷'
  }

  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-brown mb-2">
            Call Outs
          </h1>
          <p className="text-gray-600">
            Put your prediction on blast and call out the competition!
          </p>
        </div>

        {/* Create Callout Button */}
        {!showForm && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gold hover:bg-gold-dark text-white font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
            >
              <span>📢</span> Make a Call Out
            </button>
          </div>
        )}

        {/* Create Callout Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-4 border-gold/30">
            <h2 className="font-display text-xl font-bold text-brown mb-4 flex items-center gap-2">
              <span>📢</span> Call Your Shot
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brown mb-1">Your Name</label>
                  <input
                    type="text"
                    value={challenger}
                    onChange={(e) => setChallenger(e.target.value)}
                    placeholder="Who's calling the shot?"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brown mb-1">Call Out Who? (optional)</label>
                  <select
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none bg-white"
                  >
                    <option value="">Everyone / General</option>
                    {bettorNames.filter(n => n !== challenger).map(bettor => (
                      <option key={bettor} value={bettor}>@{bettor}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brown mb-1">Milestone</label>
                  <select
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none bg-white"
                    required
                  >
                    <option value="">Select milestone...</option>
                    {MILESTONES.map(m => (
                      <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brown mb-1">
                    Your Prediction
                    {milestone && getMilestoneInfo(milestone).unit && (
                      <span className="text-gray-400 font-normal"> ({getMilestoneInfo(milestone).unit})</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                    placeholder="Your prediction..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brown mb-1">
                  Confidence Level: {getConfidenceEmoji(confidence)} {getConfidenceLabel(confidence)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="w-full accent-gold"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Meh</span>
                  <span>LOCK IT IN</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brown mb-1">Trash Talk (optional)</label>
                <textarea
                  value={trashTalk}
                  onChange={(e) => setTrashTalk(e.target.value)}
                  placeholder="Back up your prediction with some smack talk..."
                  rows={2}
                  maxLength={200}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !challenger || !milestone || !prediction}
                  className="flex-1 bg-gold hover:bg-gold-dark disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-full transition-colors"
                >
                  {submitting ? 'Posting...' : 'Post Call Out'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Callouts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-bounce">📢</div>
            <p className="text-gray-600">Loading call outs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : callouts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="font-display text-2xl font-bold text-brown mb-2">
              No Call Outs Yet!
            </h2>
            <p className="text-gray-600">
              Be the first to put your prediction on blast!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {callouts.map((callout, index) => {
              const milestoneInfo = getMilestoneInfo(callout.milestone)

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-gold/30 transition-colors"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-gold/10 to-sage/10 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-gold-dark text-sm">
                          {callout.from.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-bold text-brown">{callout.from}</span>
                      {callout.target && (
                        <>
                          <span className="text-gray-400">→</span>
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            @{callout.target}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{timeAgo(callout.timestamp)}</span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Prediction */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{milestoneInfo.emoji}</span>
                      <div>
                        <div className="text-sm text-gray-500">{milestoneInfo.name}</div>
                        <div className="font-bold text-lg text-brown">
                          {callout.prediction} {milestoneInfo.unit}
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-2xl">{getConfidenceEmoji(callout.confidence)}</div>
                        <div className="text-xs text-gray-500">{getConfidenceLabel(callout.confidence)}</div>
                      </div>
                    </div>

                    {/* Trash Talk */}
                    {callout.trashTalk && (
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 italic">
                        "{callout.trashTalk}"
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Back link */}
        <div className="text-center mt-8">
          <Link to="/bets" className="text-sage hover:text-sage-dark font-medium">
            ← Back to View Bets
          </Link>
        </div>
      </div>
    </div>
  )
}
