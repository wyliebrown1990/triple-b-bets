import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CHALLENGE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdQqFj_kmLxLCn3DRHZE2l8PCCs_fD-VHlQp9CCnIEktEtygA/formResponse'
const CHALLENGE_ENTRIES = {
  challenger: 'entry.460195111',
  opponent: 'entry.996099016',
  milestone: 'entry.1318083031',
  prediction: 'entry.1163229427',
  wager: 'entry.25679231',
  trashTalk: 'entry.132001438',
}

const CHALLENGES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtkk42UamVqxiLGgEoLPdAlr8nV0KeuvsJTc9mRYHBX_UfAnswVuh1Fcq7CZl6lgwu96VWg6RP_I0v/pub?output=csv'

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

// Pixel VS Badge
function VSBadge() {
  return (
    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
      <span className="text-white font-bold text-sm">VS</span>
    </div>
  )
}

export default function SideBets() {
  const [challenges, setChallenges] = useState([])
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
  const [wager, setWager] = useState(10)
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

  // Fetch challenges
  useEffect(() => {
    async function fetchChallenges() {
      try {
        setLoading(true)

        // Check if form is configured
        if (CHALLENGES_CSV_URL.includes('YOUR_SHEET_ID')) {
          // Show demo challenges if not configured
          setChallenges([
            {
              challenger: 'Demo Challenger',
              opponent: 'Demo Opponent',
              milestone: 'crawl',
              prediction: '7',
              wager: 25,
              trashTalk: 'Set up your Google Form to enable side bets!',
              timestamp: new Date().toISOString(),
              status: 'pending',
            },
          ])
          setLoading(false)
          return
        }

        const response = await fetch(CHALLENGES_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch challenges')

        const csvText = await response.text()
        const data = parseCSV(csvText)

        const transformedChallenges = data.map(row => ({
          challenger: row['Challenger'] || 'Unknown',
          opponent: row['Opponent'] || 'Unknown',
          milestone: row['Milestone'] || '',
          prediction: row['Prediction'] || '',
          wager: parseInt(row['Wager']) || 10,
          trashTalk: row['Trash Talk'] || '',
          timestamp: row['Timestamp'],
          status: 'pending', // Would need response sheet to track accepted
        })).reverse()

        setChallenges(transformedChallenges)
        setError(null)
      } catch (err) {
        console.error('Error fetching challenges:', err)
        setError('Failed to load challenges')
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!challenger || !opponent || !milestone || !prediction) return

    // Check if form is configured
    if (CHALLENGE_FORM_URL.includes('YOUR_FORM_ID')) {
      alert('Please configure your Google Form URL in SideBets.jsx')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append(CHALLENGE_ENTRIES.challenger, challenger)
      formData.append(CHALLENGE_ENTRIES.opponent, opponent)
      formData.append(CHALLENGE_ENTRIES.milestone, milestone)
      formData.append(CHALLENGE_ENTRIES.prediction, prediction)
      formData.append(CHALLENGE_ENTRIES.wager, wager.toString())
      formData.append(CHALLENGE_ENTRIES.trashTalk, trashTalk)

      await fetch(CHALLENGE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      })

      // Optimistic UI update
      setChallenges(prev => [{
        challenger,
        opponent,
        milestone,
        prediction,
        wager,
        trashTalk,
        timestamp: new Date().toISOString(),
        status: 'pending',
      }, ...prev])

      // Reset form
      setOpponent('')
      setMilestone('')
      setPrediction('')
      setWager(10)
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

  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-brown mb-2">
            Side Bets
          </h1>
          <p className="text-gray-600">
            Challenge family members to 1v1 prediction battles!
          </p>
        </div>

        {/* Create Challenge Button */}
        {!showForm && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gold hover:bg-gold-dark text-white font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
            >
              <span>⚔️</span> Throw Down a Challenge
            </button>
          </div>
        )}

        {/* Create Challenge Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-4 border-gold/30">
            <h2 className="font-display text-xl font-bold text-brown mb-4 flex items-center gap-2">
              <span>⚔️</span> Create Challenge
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brown mb-1">Your Name</label>
                  <input
                    type="text"
                    value={challenger}
                    onChange={(e) => setChallenger(e.target.value)}
                    placeholder="Who's challenging?"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brown mb-1">Challenge Who?</label>
                  <select
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none bg-white"
                    required
                  >
                    <option value="">Select opponent...</option>
                    {bettorNames.filter(n => n !== challenger).map(bettor => (
                      <option key={bettor} value={bettor}>{bettor}</option>
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
                  Bragging Rights Points: {wager}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={wager}
                  onChange={(e) => setWager(parseInt(e.target.value))}
                  className="w-full accent-gold"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1 pt</span>
                  <span>50 pts</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brown mb-1">Trash Talk (optional)</label>
                <textarea
                  value={trashTalk}
                  onChange={(e) => setTrashTalk(e.target.value)}
                  placeholder="Say something to your opponent..."
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
                  disabled={submitting || !challenger || !opponent || !milestone || !prediction}
                  className="flex-1 bg-gold hover:bg-gold-dark disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-full transition-colors"
                >
                  {submitting ? 'Sending...' : 'Send Challenge'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Challenges List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 animate-bounce">⚔️</div>
            <p className="text-gray-600">Loading challenges...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : challenges.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="font-display text-2xl font-bold text-brown mb-2">
              No Challenges Yet!
            </h2>
            <p className="text-gray-600">
              Be the first to throw down a challenge!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {challenges.map((challenge, index) => {
              const milestoneInfo = getMilestoneInfo(challenge.milestone)

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100"
                >
                  {/* Challenge Header */}
                  <div className="bg-gradient-to-r from-sage/20 to-gold/20 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{milestoneInfo.emoji}</span>
                      <span className="font-bold text-brown">{milestoneInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        challenge.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : challenge.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {challenge.status === 'pending' ? '⏳ Pending' : '✅ Accepted'}
                      </span>
                      <span className="text-sm text-gray-500">{timeAgo(challenge.timestamp)}</span>
                    </div>
                  </div>

                  {/* VS Layout */}
                  <div className="p-6">
                    <div className="flex items-center justify-center gap-4">
                      {/* Challenger */}
                      <div className="flex-1 text-center">
                        <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold text-sage-dark">
                            {challenge.challenger.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-bold text-brown">{challenge.challenger}</h3>
                        <div className="mt-2 bg-sage/10 rounded-lg p-2">
                          <div className="text-xs text-gray-500">Prediction</div>
                          <div className="font-bold text-sage-dark">
                            {challenge.prediction} {milestoneInfo.unit}
                          </div>
                        </div>
                      </div>

                      {/* VS Badge */}
                      <VSBadge />

                      {/* Opponent */}
                      <div className="flex-1 text-center">
                        <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold text-gold-dark">
                            {challenge.opponent.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-bold text-brown">{challenge.opponent}</h3>
                        <div className="mt-2 bg-gold/10 rounded-lg p-2">
                          <div className="text-xs text-gray-500">Prediction</div>
                          <div className="font-bold text-gray-400 italic">
                            Awaiting response...
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wager */}
                    <div className="text-center mt-4">
                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-sm">
                        🏆 {challenge.wager} Bragging Rights Points
                      </span>
                    </div>

                    {/* Trash Talk */}
                    {challenge.trashTalk && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-3 text-center">
                        <span className="text-gray-600 italic">"{challenge.trashTalk}"</span>
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
