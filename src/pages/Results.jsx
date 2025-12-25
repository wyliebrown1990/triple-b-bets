import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Confetti from '../components/Confetti'

// Google Sheet URLs
const BETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSS0cgeOJ2X1AmNZtH7JBYhCgFARs1RWxgKisk3sM1PY2Af4cHKsFj4Uzer-yX8_etnQxgjTZB6NdO5/pub?output=csv'

// TODO: Replace with your published Results Google Sheet CSV URL
const RESULTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv'

// Milestone config matching the bets
const MILESTONE_CONFIG = [
  { id: 'First Crawl', csvPrediction: 'First Crawl', emoji: '🐛', title: 'First Crawl', unit: 'months', type: 'number' },
  { id: 'First Walk', csvPrediction: 'First Walk', emoji: '🚶', title: 'First Walk', unit: 'months', type: 'number' },
  { id: 'First Word', csvPrediction: 'First Word', emoji: '🗣️', title: 'First Word', unit: '', type: 'text' },
  { id: 'First Word Age', csvPrediction: 'First Word Age', emoji: '🗣️', title: 'First Word Age', unit: 'months', type: 'number' },
  { id: 'First Bike Ride', csvPrediction: 'First Bike Ride', emoji: '🚴', title: 'First Bike', unit: 'years', type: 'number' },
  { id: 'First Tooth', csvPrediction: 'First Tooth', emoji: '🦷', title: 'First Tooth', unit: 'months', type: 'number' },
  { id: 'First Solid Food', csvPrediction: 'First Solid Food', emoji: '🍎', title: 'First Food', unit: '', type: 'text' },
  { id: 'Height at Age 1', csvPrediction: 'Height at Age 1', emoji: '📏', title: 'Height at 1', unit: 'inches', type: 'number' },
  { id: 'Weight at Age 1', csvPrediction: 'Weight at Age 1', emoji: '⚖️', title: 'Weight at 1', unit: 'lbs', type: 'number' },
  { id: 'Sleep Through Night', csvPrediction: 'Sleep Through Night', emoji: '😴', title: 'Sleep Through', unit: 'weeks', type: 'number' },
  { id: 'Wild Card Prediction', csvPrediction: 'Wild Card Prediction', emoji: '🎲', title: 'Wildcard', unit: '', type: 'text' },
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

// Determine winner for a milestone
function determineWinner(milestone, actualValue, bets) {
  const predictions = bets
    .filter(b => b.predictions[milestone.id])
    .map(b => ({
      name: b.name,
      prediction: b.predictions[milestone.id],
      wager: b.wagers[milestone.id] || 0,
    }))

  if (predictions.length === 0) return null

  if (milestone.type === 'number') {
    const actual = parseFloat(actualValue)
    if (isNaN(actual)) return null

    // Sort by closest prediction
    const sorted = predictions
      .map(p => ({
        ...p,
        diff: Math.abs(parseFloat(p.prediction) - actual),
      }))
      .filter(p => !isNaN(p.diff))
      .sort((a, b) => a.diff - b.diff)

    if (sorted.length === 0) return null

    // Check for ties
    const winnerDiff = sorted[0].diff
    const winners = sorted.filter(p => p.diff === winnerDiff)

    return {
      winners: winners.map(w => w.name),
      predictions: sorted,
    }
  }

  if (milestone.type === 'text') {
    // Exact match (case insensitive)
    const winners = predictions.filter(
      p => p.prediction.toLowerCase().trim() === actualValue.toLowerCase().trim()
    )

    return {
      winners: winners.map(w => w.name),
      predictions: predictions,
      isExactMatch: true,
    }
  }

  return null
}

export default function Results() {
  const [bets, setBets] = useState([])
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [revealedMilestones, setRevealedMilestones] = useState(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeReveal, setActiveReveal] = useState(null)

  // Fetch bets and results
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch bets
        const betsResponse = await fetch(BETS_CSV_URL)
        if (betsResponse.ok) {
          const csvText = await betsResponse.text()
          const sheetData = parseCSV(csvText)

          const transformedBets = sheetData.map(row => {
            const predictions = {}
            const wagers = {}

            MILESTONE_CONFIG.forEach(config => {
              const prediction = row[config.csvPrediction]
              const wager = parseInt(row[config.csvPrediction + ' Wager']) || 0

              if (prediction) {
                predictions[config.id] = prediction
              }
              if (wager > 0) {
                wagers[config.id] = wager
              }
            })

            return {
              name: row['Name'] || 'Anonymous',
              predictions,
              wagers,
            }
          })

          setBets(transformedBets)
        }

        // Fetch results
        if (!RESULTS_CSV_URL.includes('YOUR_SHEET_ID')) {
          const resultsResponse = await fetch(RESULTS_CSV_URL)
          if (resultsResponse.ok) {
            const csvText = await resultsResponse.text()
            const data = parseCSV(csvText)

            const resultsMap = {}
            data.forEach(row => {
              if (row['Milestone']) {
                resultsMap[row['Milestone']] = {
                  value: row['Actual Value'] || row['Value'] || '',
                  date: row['Date Achieved'] || row['Date'] || '',
                }
              }
            })
            setResults(resultsMap)
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate scoreboard
  const scoreboard = useMemo(() => {
    const scores = {}

    bets.forEach(bet => {
      scores[bet.name] = { won: 0, lost: 0, pending: 0, totalWinnings: 0 }
    })

    MILESTONE_CONFIG.forEach(milestone => {
      const result = results[milestone.id]
      if (!result?.value) return

      const winner = determineWinner(milestone, result.value, bets)
      if (!winner) return

      bets.forEach(bet => {
        const wager = bet.wagers[milestone.id] || 0
        if (wager === 0) return

        if (winner.winners.includes(bet.name)) {
          scores[bet.name].won++
          scores[bet.name].totalWinnings += wager * 2 // Simple 2x payout
        } else {
          scores[bet.name].lost++
        }
      })
    })

    // Count pending
    bets.forEach(bet => {
      Object.keys(bet.wagers).forEach(milestoneId => {
        if (!results[milestoneId]?.value) {
          scores[bet.name].pending++
        }
      })
    })

    return Object.entries(scores)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalWinnings - a.totalWinnings)
  }, [bets, results])

  const handleReveal = (milestoneId) => {
    setActiveReveal(milestoneId)
    setTimeout(() => {
      setRevealedMilestones(prev => new Set([...prev, milestoneId]))
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setActiveReveal(null)
      }, 3000)
    }, 1500)
  }

  const recordedResults = MILESTONE_CONFIG.filter(m => results[m.id]?.value)
  const pendingResults = MILESTONE_CONFIG.filter(m => !results[m.id]?.value)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🎁</div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-8 px-4">
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-brown mb-2">
            Results Reveal
          </h1>
          <p className="text-gray-600">
            {recordedResults.length} of {MILESTONE_CONFIG.length} milestones revealed!
          </p>
        </div>

        {/* Scoreboard */}
        {scoreboard.length > 0 && recordedResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="font-display text-xl font-bold text-brown mb-4 flex items-center gap-2">
              <span>🏆</span> Running Scoreboard
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {scoreboard.slice(0, 6).map((player, index) => (
                <div
                  key={player.name}
                  className={`p-3 rounded-lg ${
                    index === 0 ? 'bg-gold/20 border-2 border-gold' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {index === 0 && <span>👑</span>}
                      <span className="font-bold text-brown">{player.name}</span>
                    </div>
                    <span className="font-bold text-gold-dark">
                      {player.totalWinnings} 🍼
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {player.won}W - {player.lost}L - {player.pending} pending
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revealed Results */}
        {recordedResults.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-brown mb-4">
              Revealed Milestones
            </h2>
            <div className="grid gap-4">
              {recordedResults.map(milestone => {
                const result = results[milestone.id]
                const winner = determineWinner(milestone, result.value, bets)
                const isRevealing = activeReveal === milestone.id
                const isRevealed = revealedMilestones.has(milestone.id)

                return (
                  <div
                    key={milestone.id}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
                      isRevealing ? 'animate-pulse scale-105' : ''
                    }`}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-sage/20 to-gold/20 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{milestone.emoji}</span>
                        <h3 className="font-bold text-lg text-brown">{milestone.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl text-sage-dark">
                          {result.value} {milestone.unit}
                        </div>
                        {result.date && (
                          <div className="text-xs text-gray-500">
                            {new Date(result.date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Winner */}
                    <div className="p-6">
                      {winner && winner.winners.length > 0 ? (
                        <div className="text-center mb-4">
                          <div className="text-sm text-gray-500 mb-1">
                            {winner.winners.length > 1 ? 'Winners' : 'Winner'}
                          </div>
                          <div className="flex flex-wrap justify-center gap-2">
                            {winner.winners.map(name => (
                              <span
                                key={name}
                                className="inline-flex items-center gap-1 bg-gold/20 text-gold-dark font-bold px-4 py-2 rounded-full"
                              >
                                🏆 {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 mb-4">
                          {milestone.type === 'text' ? 'No exact matches' : 'No predictions for this milestone'}
                        </div>
                      )}

                      {/* All Predictions */}
                      {winner && winner.predictions && (
                        <div className="border-t border-gray-100 pt-4">
                          <div className="text-sm text-gray-500 mb-2">All Predictions:</div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {winner.predictions
                              .sort((a, b) => (a.diff || 0) - (b.diff || 0))
                              .map((pred, i) => (
                                <div
                                  key={pred.name}
                                  className={`flex items-center justify-between p-2 rounded ${
                                    winner.winners.includes(pred.name)
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  <span className={winner.winners.includes(pred.name) ? 'font-bold text-green-700' : 'text-gray-700'}>
                                    {pred.name}
                                  </span>
                                  <span className="text-gray-600">
                                    {pred.prediction} {milestone.unit}
                                    {pred.diff !== undefined && (
                                      <span className="text-xs text-gray-400 ml-1">
                                        (±{pred.diff.toFixed(1)})
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Pending Results */}
        {pendingResults.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-brown mb-4">
              Coming Soon
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pendingResults.map(milestone => (
                <div
                  key={milestone.id}
                  className="bg-white/50 rounded-xl p-4 text-center border-2 border-dashed border-gray-200"
                >
                  <div className="text-3xl mb-2 grayscale opacity-50">{milestone.emoji}</div>
                  <div className="font-medium text-gray-400">{milestone.title}</div>
                  <div className="text-2xl mt-2">❓</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No results yet */}
        {recordedResults.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="font-display text-2xl font-bold text-brown mb-2">
              No Results Yet!
            </h2>
            <p className="text-gray-600 mb-4">
              Results will appear here as milestones are achieved.
            </p>
            <Link
              to="/bets"
              className="inline-block bg-sage hover:bg-sage-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              View All Predictions
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
