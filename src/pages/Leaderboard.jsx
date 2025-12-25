import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSS0cgeOJ2X1AmNZtH7JBYhCgFARs1RWxgKisk3sM1PY2Af4cHKsFj4Uzer-yX8_etnQxgjTZB6NdO5/pub?output=csv'

const MILESTONE_CONFIG = [
  { csvPrediction: 'First Crawl', csvWager: 'First Crawl Wager', id: 'firstCrawl' },
  { csvPrediction: 'First Walk', csvWager: 'First Walk Wager', id: 'firstWalk' },
  { csvPrediction: 'First Word', csvWager: 'First Word Wager', id: 'firstWord' },
  { csvPrediction: 'First Word Age', csvWager: 'First Word Age Wager', id: 'firstWordAge' },
  { csvPrediction: 'First Bike Ride', csvWager: 'First Bike Ride Wager', id: 'firstBike' },
  { csvPrediction: 'First Tooth', csvWager: 'First Tooth Wager', id: 'firstTooth' },
  { csvPrediction: 'First Solid Food', csvWager: 'First Solid Food Wager', id: 'firstFood' },
  { csvPrediction: 'Height at Age 1', csvWager: 'Height at Age 1 Wager', id: 'heightAtOne' },
  { csvPrediction: 'Weight at Age 1', csvWager: 'Weight at Age 1 Wager', id: 'weightAtOne' },
  { csvPrediction: 'Sleep Through Night', csvWager: 'Sleep Through Night Wager', id: 'sleepThrough' },
  { csvPrediction: 'Wild Card Prediction', csvWager: 'Wild Card Prediction Wager', id: 'wildcard' },
]

// CSV parsing helpers
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

// Calculate odds for a prediction
function calculateOdds(predictions, value, type) {
  if (!predictions.length || !value) return 2.0

  if (type === 'number') {
    const numericPredictions = predictions.map(p => parseFloat(p)).filter(n => !isNaN(n))
    if (!numericPredictions.length) return 2.0

    const mean = numericPredictions.reduce((a, b) => a + b, 0) / numericPredictions.length
    const stdDev = Math.sqrt(
      numericPredictions.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericPredictions.length
    ) || 1

    const userNum = parseFloat(value)
    if (isNaN(userNum)) return 2.0

    const zScore = Math.abs(userNum - mean) / stdDev
    return Math.min(10, Math.max(1.5, 1.5 + (zScore * 1.5)))
  } else {
    const lowerValue = value.toLowerCase().trim()
    const frequency = predictions.filter(p => p.toLowerCase().trim() === lowerValue).length

    if (frequency === 0) return Math.min(10, 3 + predictions.length * 0.5)
    const popularity = frequency / predictions.length
    return Math.max(1.5, 5 * (1 - popularity))
  }
}

// Pixel Podium Component
function PixelPodium({ top3 }) {
  const positions = [
    { place: 2, x: 10, height: 60, color: '#C0C0C0', label: '2nd' },
    { place: 1, x: 60, height: 80, color: '#FFD700', label: '1st' },
    { place: 3, x: 110, height: 45, color: '#CD7F32', label: '3rd' },
  ]

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <svg viewBox="0 0 160 120" className="w-full h-auto" style={{ imageRendering: 'pixelated' }}>
        {positions.map((pos) => {
          const bettor = top3[pos.place - 1]
          const yBase = 120 - pos.height

          return (
            <g key={pos.place}>
              {/* Podium block */}
              <rect
                x={pos.x}
                y={yBase}
                width="40"
                height={pos.height}
                fill={pos.color}
                stroke="#5D4E37"
                strokeWidth="2"
              />
              {/* Podium front face (3D effect) */}
              <rect
                x={pos.x + 2}
                y={yBase + 2}
                width="36"
                height={pos.height - 4}
                fill={pos.color}
                opacity="0.8"
              />
              {/* Place number */}
              <text
                x={pos.x + 20}
                y={yBase + pos.height - 8}
                textAnchor="middle"
                fill="#5D4E37"
                fontSize="12"
                fontWeight="bold"
              >
                {pos.place}
              </text>

              {bettor && (
                <>
                  {/* Avatar circle */}
                  <circle
                    cx={pos.x + 20}
                    cy={yBase - 20}
                    r="15"
                    fill="#87A878"
                    stroke="#5D4E37"
                    strokeWidth="2"
                  />
                  {/* Initial */}
                  <text
                    x={pos.x + 20}
                    y={yBase - 15}
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {bettor.name.charAt(0).toUpperCase()}
                  </text>
                  {/* Trophy for 1st place */}
                  {pos.place === 1 && (
                    <text
                      x={pos.x + 20}
                      y={yBase - 42}
                      textAnchor="middle"
                      fontSize="16"
                    >
                      🏆
                    </text>
                  )}
                </>
              )}
            </g>
          )
        })}
      </svg>

      {/* Names below podium */}
      <div className="flex justify-between px-4 mt-2">
        {[top3[1], top3[0], top3[2]].map((bettor, idx) => (
          <div key={idx} className="text-center w-1/3">
            {bettor && (
              <>
                <p className="font-bold text-sm text-brown truncate">{bettor.name}</p>
                <p className="text-xs text-gold-dark">{Math.round(bettor.potentialPayout)} 🍼</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Stats Card Component
function StatsCard({ title, icon, winner, stat, description }) {
  if (!winner) return null

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border-2 border-sage/30">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-bold text-brown">{title}</h3>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center">
          <span className="font-bold text-sage-dark">{winner.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-bold text-brown">{winner}</p>
          <p className="text-sm text-gray-500">{stat}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{description}</p>
    </div>
  )
}

export default function Leaderboard() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchBets() {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL)
        if (!response.ok) throw new Error('Failed to fetch')
        const csvText = await response.text()
        setBets(parseCSV(csvText))
      } catch (err) {
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    fetchBets()
  }, [])

  // Calculate rankings
  const rankings = useMemo(() => {
    if (!bets.length) return []

    // First, collect all predictions for odds calculation
    const allPredictions = {}
    MILESTONE_CONFIG.forEach(config => {
      allPredictions[config.id] = bets
        .map(bet => bet[config.csvPrediction])
        .filter(v => v && v.trim() !== '')
    })

    // Calculate score for each bettor
    return bets.map(bet => {
      const name = bet['Name'] || 'Anonymous'
      let totalWager = 0
      let potentialPayout = 0
      let predictionsCount = 0
      let maxSingleWager = 0
      let totalOdds = 0
      let oddsCount = 0

      MILESTONE_CONFIG.forEach(config => {
        const prediction = bet[config.csvPrediction]
        const wager = parseInt(bet[config.csvWager]) || 0

        if (wager > 0) {
          totalWager += wager
          maxSingleWager = Math.max(maxSingleWager, wager)

          const isNumeric = ['firstCrawl', 'firstWalk', 'firstWordAge', 'firstBike', 'firstTooth', 'heightAtOne', 'weightAtOne', 'sleepThrough'].includes(config.id)
          const odds = calculateOdds(allPredictions[config.id], prediction, isNumeric ? 'number' : 'text')

          potentialPayout += wager * odds
          totalOdds += odds
          oddsCount++
        }

        if (prediction && prediction.trim() !== '') {
          predictionsCount++
        }
      })

      const avgOdds = oddsCount > 0 ? totalOdds / oddsCount : 2.0

      return {
        name,
        totalWager,
        potentialPayout,
        predictionsCount,
        maxSingleWager,
        avgOdds,
        riskLevel: avgOdds >= 4 ? 'Bold' : avgOdds >= 2.5 ? 'Moderate' : 'Safe',
      }
    }).sort((a, b) => b.potentialPayout - a.potentialPayout)
  }, [bets])

  // Special awards
  const awards = useMemo(() => {
    if (!rankings.length) return {}

    const boldest = [...rankings].sort((a, b) => b.avgOdds - a.avgOdds)[0]
    const safest = [...rankings].sort((a, b) => a.avgOdds - b.avgOdds)[0]
    const allIn = [...rankings].sort((a, b) => b.maxSingleWager - a.maxSingleWager)[0]
    const mostPredictions = [...rankings].sort((a, b) => b.predictionsCount - a.predictionsCount)[0]

    return {
      boldest: boldest?.avgOdds >= 2.5 ? boldest : null,
      safest: safest?.avgOdds <= 3 ? safest : null,
      allIn: allIn?.maxSingleWager >= 20 ? allIn : null,
      mostPredictions: mostPredictions?.predictionsCount >= 8 ? mostPredictions : null,
    }
  }, [rankings])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🏆</div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-sage hover:bg-sage-dark text-white font-bold py-3 px-6 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!rankings.length) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="font-display text-2xl font-bold text-brown mb-4">No Bets Yet!</h2>
          <p className="text-gray-600 mb-6">Be the first to place your bets and claim the top spot!</p>
          <Link
            to="/bet"
            className="inline-block bg-gold hover:bg-gold-dark text-white font-bold py-3 px-6 rounded-full"
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-brown mb-2">
            🏆 Leaderboard 🏆
          </h1>
          <p className="text-gray-600">
            Ranked by potential Binky Bucks payout
          </p>
        </div>

        {/* Podium */}
        <PixelPodium top3={rankings.slice(0, 3)} />

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Most Bold"
            icon="🎲"
            winner={awards.boldest?.name}
            stat={`${awards.boldest?.avgOdds.toFixed(1)}x avg odds`}
            description="Highest average odds across all bets"
          />
          <StatsCard
            title="Playing Safe"
            icon="🛡️"
            winner={awards.safest?.name}
            stat={`${awards.safest?.avgOdds.toFixed(1)}x avg odds`}
            description="Lowest average odds - consensus picks"
          />
          <StatsCard
            title="All-In Champion"
            icon="💰"
            winner={awards.allIn?.name}
            stat={`${awards.allIn?.maxSingleWager} 🍼 on one bet`}
            description="Largest single wager placed"
          />
          <StatsCard
            title="Most Thorough"
            icon="📝"
            winner={awards.mostPredictions?.name}
            stat={`${awards.mostPredictions?.predictionsCount}/11 predictions`}
            description="Most milestone predictions made"
          />
        </div>

        {/* Full Rankings Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-brown">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-brown">Name</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-brown">Wagered</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-brown">Potential</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-brown">Risk</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((bettor, index) => (
                  <tr
                    key={index}
                    className={`border-t border-gray-100 ${index < 3 ? 'bg-gold/5' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-orange-300 text-orange-800' :
                          'bg-gray-100 text-gray-600'}
                      `}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                          <span className="font-bold text-sage-dark text-sm">
                            {bettor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-brown">{bettor.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {bettor.totalWager} 🍼
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gold-dark">
                      {Math.round(bettor.potentialPayout)} 🍼
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-bold
                        ${bettor.riskLevel === 'Bold' ? 'bg-purple-100 text-purple-700' :
                          bettor.riskLevel === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'}
                      `}>
                        {bettor.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            to="/bet"
            className="inline-block bg-gold hover:bg-gold-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            Place Your Bets
          </Link>
        </div>
      </div>
    </div>
  )
}
