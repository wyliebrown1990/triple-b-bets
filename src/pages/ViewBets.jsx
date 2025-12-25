import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AchievementBadges } from '../components/AchievementBadge'
import { calculateAchievements } from '../utils/achievements'
import EmojiPicker, { getStoredEmoji } from '../components/EmojiPicker'

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSS0cgeOJ2X1AmNZtH7JBYhCgFARs1RWxgKisk3sM1PY2Af4cHKsFj4Uzer-yX8_etnQxgjTZB6NdO5/pub?output=csv'

// Map CSV columns to our display format
const MILESTONE_CONFIG = [
  { csvPrediction: 'First Crawl', csvWager: 'First Crawl Wager', emoji: '🐛', title: 'First Crawl', unit: 'months' },
  { csvPrediction: 'First Walk', csvWager: 'First Walk Wager', emoji: '🚶', title: 'First Walk', unit: 'months' },
  { csvPrediction: 'First Word', csvWager: 'First Word Wager', emoji: '🗣️', title: 'First Word', unit: '' },
  { csvPrediction: 'First Word Age', csvWager: 'First Word Age Wager', emoji: '🗣️', title: 'First Word Age', unit: 'months' },
  { csvPrediction: 'First Bike Ride', csvWager: 'First Bike Ride Wager', emoji: '🚴', title: 'First Bike', unit: 'years' },
  { csvPrediction: 'First Tooth', csvWager: 'First Tooth Wager', emoji: '🦷', title: 'First Tooth', unit: 'months' },
  { csvPrediction: 'First Solid Food', csvWager: 'First Solid Food Wager', emoji: '🍎', title: 'First Food', unit: '' },
  { csvPrediction: 'Height at Age 1', csvWager: 'Height at Age 1 Wager', emoji: '📏', title: 'Height at 1', unit: 'inches' },
  { csvPrediction: 'Weight at Age 1', csvWager: 'Weight at Age 1 Wager', emoji: '⚖️', title: 'Weight at 1', unit: 'lbs' },
  { csvPrediction: 'Sleep Through Night', csvWager: 'Sleep Through Night Wager', emoji: '😴', title: 'Sleep Through', unit: 'weeks' },
  { csvPrediction: 'Wild Card Prediction', csvWager: 'Wild Card Prediction Wager', emoji: '🎲', title: 'Wildcard', unit: '' },
]

// Simple CSV parser
function parseCSV(csvText) {
  const lines = csvText.split('\n')
  if (lines.length < 2) return []

  // Parse header row
  const headers = parseCSVLine(lines[0])

  // Parse data rows
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

// Parse a single CSV line (handles quoted values with commas)
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

export default function ViewBets() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openPicker, setOpenPicker] = useState(null) // userName of open picker
  const [userEmojis, setUserEmojis] = useState({}) // Cache of user emojis

  // Load stored emojis when bets load
  useEffect(() => {
    if (bets.length > 0) {
      const emojis = {}
      bets.forEach(bet => {
        const stored = getStoredEmoji(bet.name)
        if (stored) emojis[bet.name] = stored
      })
      setUserEmojis(emojis)
    }
  }, [bets])

  // Calculate achievements for all bettors
  const betsWithAchievements = useMemo(() => {
    return bets.map((bet, index) => ({
      ...bet,
      achievements: calculateAchievements(bet, bets, index)
    }))
  }, [bets])

  useEffect(() => {
    async function fetchBets() {
      try {
        setLoading(true)

        // Fetch from Google Sheets
        const response = await fetch(GOOGLE_SHEET_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch bets')

        const csvText = await response.text()
        const sheetData = parseCSV(csvText)

        // Transform sheet data to our format
        const transformedBets = sheetData.map(row => {
          const predictions = {}
          const wagers = {}
          let totalWager = 0

          MILESTONE_CONFIG.forEach(config => {
            const prediction = row[config.csvPrediction]
            const wager = parseInt(row[config.csvWager]) || 0

            if (prediction) {
              predictions[config.title] = {
                value: prediction,
                unit: config.unit,
                emoji: config.emoji,
              }
            }
            if (wager > 0) {
              wagers[config.title] = wager
              totalWager += wager
            }
          })

          return {
            name: row['Name'] || 'Anonymous',
            timestamp: row['Timestamp'],
            predictions,
            wagers,
            totalWager,
          }
        })

        // Sort by timestamp, newest first
        transformedBets.sort((a, b) => {
          if (!a.timestamp) return 1
          if (!b.timestamp) return -1
          return new Date(b.timestamp) - new Date(a.timestamp)
        })

        setBets(transformedBets)
        setError(null)
      } catch (err) {
        console.error('Error fetching bets:', err)
        setError('Failed to load bets. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBets()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🍼</div>
          <p className="text-gray-600">Loading bets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-display text-2xl font-bold text-brown mb-4">
            Oops!
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-sage hover:bg-sage-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (bets.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🤷</div>
          <h2 className="font-display text-2xl font-bold text-brown mb-4">
            No Bets Yet!
          </h2>
          <p className="text-gray-600 mb-6">
            Be the first to make your predictions for He Who Shall Not Be Named's milestones.
          </p>
          <Link
            to="/bet"
            className="inline-block bg-gold hover:bg-gold-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            Place Your Bets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-brown mb-2">
            All Predictions
          </h1>
          <p className="text-gray-600">
            {bets.length} {bets.length === 1 ? 'person has' : 'people have'} placed their bets!
          </p>
        </div>

        <div className="grid gap-6">
          {betsWithAchievements.map((bet, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Clickable Avatar */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenPicker(openPicker === bet.name ? null : bet.name)}
                      className="w-12 h-12 bg-sage/20 hover:bg-sage/30 rounded-full flex items-center justify-center transition-colors cursor-pointer group"
                      title="Click to change avatar"
                    >
                      {userEmojis[bet.name] ? (
                        <span className="text-2xl">{userEmojis[bet.name]}</span>
                      ) : (
                        <span className="text-xl font-bold text-sage-dark">
                          {bet.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {/* Edit indicator */}
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        ✏️
                      </span>
                    </button>

                    {/* Emoji Picker */}
                    {openPicker === bet.name && (
                      <EmojiPicker
                        userName={bet.name}
                        currentEmoji={userEmojis[bet.name]}
                        onSelect={(emoji) => {
                          setUserEmojis(prev => ({
                            ...prev,
                            [bet.name]: emoji
                          }))
                        }}
                        onClose={() => setOpenPicker(null)}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-brown">{bet.name}</h3>
                      {bet.achievements && bet.achievements.length > 0 && (
                        <AchievementBadges achievements={bet.achievements} size="small" maxDisplay={3} />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {bet.timestamp ? `Submitted ${new Date(bet.timestamp).toLocaleDateString()}` : 'Recently submitted'}
                    </p>
                  </div>
                </div>
                {bet.totalWager > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total Wagered</div>
                    <div className="font-bold text-gold-dark flex items-center gap-1">
                      <span>🍼</span> {bet.totalWager} Binky Bucks
                    </div>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {MILESTONE_CONFIG.map(config => {
                  const prediction = bet.predictions[config.title]
                  const wager = bet.wagers[config.title]

                  if (!prediction) return null

                  return (
                    <div
                      key={config.title}
                      className={`rounded-lg p-3 ${wager > 0 ? 'bg-sage/10 border border-sage/30' : 'bg-cream'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="text-lg mr-2">{config.emoji}</span>
                          <span className="font-medium text-brown">{config.title}:</span>
                          <span className="ml-2 text-gray-700">
                            {prediction.value} {prediction.unit}
                          </span>
                        </div>
                        {wager > 0 && (
                          <div className="shrink-0 bg-gold/20 text-gold-dark text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            🍼 {wager}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
