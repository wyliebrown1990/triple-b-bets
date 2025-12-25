import { useState, useEffect } from 'react'

// Admin access key - change this to your secret key
const ADMIN_KEY = 'babyb2025'

// TODO: Replace with your Google Form action URL and entry IDs for RESULTS
const RESULTS_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'
const RESULTS_ENTRIES = {
  milestone: 'entry.XXXXXXX',
  actualValue: 'entry.XXXXXXX',
  dateAchieved: 'entry.XXXXXXX',
  notes: 'entry.XXXXXXX',
}

// TODO: Replace with your published Google Sheet CSV URL for results
const RESULTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv'

// Milestone definitions
const MILESTONES = [
  { id: 'First Crawl', name: 'First Crawl', emoji: '🐛', unit: 'months', type: 'number' },
  { id: 'First Walk', name: 'First Walk', emoji: '🚶', unit: 'months', type: 'number' },
  { id: 'First Word', name: 'First Word', emoji: '🗣️', unit: '', type: 'text' },
  { id: 'First Word Age', name: 'First Word Age', emoji: '🗣️', unit: 'months', type: 'number' },
  { id: 'First Bike Ride', name: 'First Bike Ride', emoji: '🚴', unit: 'years', type: 'number' },
  { id: 'First Tooth', name: 'First Tooth', emoji: '🦷', unit: 'months', type: 'number' },
  { id: 'First Solid Food', name: 'First Solid Food', emoji: '🍎', unit: '', type: 'text' },
  { id: 'Height at Age 1', name: 'Height at Age 1', emoji: '📏', unit: 'inches', type: 'number' },
  { id: 'Weight at Age 1', name: 'Weight at Age 1', emoji: '⚖️', unit: 'lbs', type: 'number' },
  { id: 'Sleep Through Night', name: 'Sleep Through Night', emoji: '😴', unit: 'weeks', type: 'number' },
  { id: 'Wild Card Prediction', name: 'Wildcard', emoji: '🎲', unit: '', type: 'text' },
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

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [keyError, setKeyError] = useState(false)

  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [selectedMilestone, setSelectedMilestone] = useState('')
  const [actualValue, setActualValue] = useState('')
  const [dateAchieved, setDateAchieved] = useState('')
  const [notes, setNotes] = useState('')

  // Check URL for key parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const keyParam = params.get('key')
    if (keyParam === ADMIN_KEY) {
      setAuthenticated(true)
    }
  }, [])

  // Fetch existing results
  useEffect(() => {
    if (!authenticated) return

    async function fetchResults() {
      // Check if configured
      if (RESULTS_CSV_URL.includes('YOUR_SHEET_ID')) {
        return
      }

      try {
        setLoading(true)
        const response = await fetch(RESULTS_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch')

        const csvText = await response.text()
        const data = parseCSV(csvText)

        // Convert to object keyed by milestone
        const resultsMap = {}
        data.forEach(row => {
          if (row['Milestone']) {
            resultsMap[row['Milestone']] = {
              value: row['Actual Value'] || row['Value'] || '',
              date: row['Date Achieved'] || row['Date'] || '',
              notes: row['Notes'] || '',
              timestamp: row['Timestamp'] || '',
            }
          }
        })
        setResults(resultsMap)
      } catch (err) {
        console.error('Error fetching results:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [authenticated])

  const handleKeySubmit = (e) => {
    e.preventDefault()
    if (keyInput === ADMIN_KEY) {
      setAuthenticated(true)
      setKeyError(false)
      // Update URL without reload
      window.history.replaceState({}, '', `${window.location.pathname}?key=${ADMIN_KEY}`)
    } else {
      setKeyError(true)
    }
  }

  const handleResultSubmit = async (e) => {
    e.preventDefault()

    if (!selectedMilestone || !actualValue) return

    // Check if configured
    if (RESULTS_FORM_URL.includes('YOUR_FORM_ID')) {
      alert('Please configure your Google Form URL in Admin.jsx')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append(RESULTS_ENTRIES.milestone, selectedMilestone)
      formData.append(RESULTS_ENTRIES.actualValue, actualValue)
      formData.append(RESULTS_ENTRIES.dateAchieved, dateAchieved)
      formData.append(RESULTS_ENTRIES.notes, notes)

      await fetch(RESULTS_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      })

      // Optimistic update
      setResults(prev => ({
        ...prev,
        [selectedMilestone]: {
          value: actualValue,
          date: dateAchieved,
          notes: notes,
          timestamp: new Date().toISOString(),
        }
      }))

      // Reset form
      setSelectedMilestone('')
      setActualValue('')
      setDateAchieved('')
      setNotes('')

      alert('Result saved!')
    } catch (err) {
      console.error('Error submitting:', err)
      alert('Failed to save. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="font-display text-2xl font-bold text-brown">Admin Access</h1>
            <p className="text-gray-600 text-sm mt-1">Enter the secret key to continue</p>
          </div>

          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter admin key..."
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  keyError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-sage'
                }`}
              />
              {keyError && (
                <p className="text-red-500 text-sm mt-1">Invalid key. Try again.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-brown mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Record actual milestone results as they happen
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-display text-xl font-bold text-brown mb-4 flex items-center gap-2">
              <span>📝</span> Record Result
            </h2>

            <form onSubmit={handleResultSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brown mb-1">Milestone</label>
                <select
                  value={selectedMilestone}
                  onChange={(e) => setSelectedMilestone(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none bg-white"
                  required
                >
                  <option value="">Select milestone...</option>
                  {MILESTONES.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.emoji} {m.name} {results[m.id] ? '✓' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-brown mb-1">
                  Actual Value
                  {selectedMilestone && MILESTONES.find(m => m.id === selectedMilestone)?.unit && (
                    <span className="text-gray-400 font-normal">
                      {' '}({MILESTONES.find(m => m.id === selectedMilestone)?.unit})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={actualValue}
                  onChange={(e) => setActualValue(e.target.value)}
                  placeholder="Enter the actual result..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brown mb-1">Date Achieved</label>
                <input
                  type="date"
                  value={dateAchieved}
                  onChange={(e) => setDateAchieved(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brown mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details..."
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedMilestone || !actualValue}
                className="w-full bg-gold hover:bg-gold-dark disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-full transition-colors"
              >
                {submitting ? 'Saving...' : 'Save Result'}
              </button>
            </form>
          </div>

          {/* Results Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-display text-xl font-bold text-brown mb-4 flex items-center gap-2">
              <span>📊</span> Results Status
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-2xl">🔄</div>
              </div>
            ) : (
              <div className="space-y-2">
                {MILESTONES.map(milestone => {
                  const result = results[milestone.id]
                  return (
                    <div
                      key={milestone.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        result ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{milestone.emoji}</span>
                        <span className={`font-medium ${result ? 'text-green-700' : 'text-gray-600'}`}>
                          {milestone.name}
                        </span>
                      </div>
                      {result ? (
                        <div className="text-right">
                          <div className="font-bold text-green-700">
                            {result.value} {milestone.unit}
                          </div>
                          {result.date && (
                            <div className="text-xs text-green-600">
                              {new Date(result.date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Pending</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recorded:</span>
                <span className="font-bold text-green-600">
                  {Object.keys(results).length} / {MILESTONES.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-display text-xl font-bold text-brown mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/results"
              className="bg-sage/10 hover:bg-sage/20 text-sage-dark font-medium px-4 py-2 rounded-lg transition-colors"
            >
              View Results Page →
            </a>
            <a
              href="/leaderboard"
              className="bg-gold/10 hover:bg-gold/20 text-gold-dark font-medium px-4 py-2 rounded-lg transition-colors"
            >
              View Leaderboard →
            </a>
            <a
              href="/bets"
              className="bg-brown/10 hover:bg-brown/20 text-brown font-medium px-4 py-2 rounded-lg transition-colors"
            >
              View All Bets →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
