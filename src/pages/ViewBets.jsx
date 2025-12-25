import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const MILESTONE_INFO = {
  firstCrawl: { emoji: '🐛', title: 'First Crawl', unit: 'months' },
  firstWalk: { emoji: '🚶', title: 'First Walk', unit: 'months' },
  firstWord: { emoji: '🗣️', title: 'First Word', unit: '' },
  firstWordAge: { emoji: '🗣️', title: 'First Word Age', unit: 'months' },
  firstBike: { emoji: '🚴', title: 'First Bike', unit: 'years' },
  firstTooth: { emoji: '🦷', title: 'First Tooth', unit: 'months' },
  firstFood: { emoji: '🍎', title: 'First Food', unit: '' },
  heightAtOne: { emoji: '📏', title: 'Height at 1', unit: 'inches' },
  weightAtOne: { emoji: '⚖️', title: 'Weight at 1', unit: 'lbs' },
  sleepThrough: { emoji: '😴', title: 'Sleep Through', unit: 'weeks' },
  wildcard: { emoji: '🎲', title: 'Wildcard', unit: '' },
}

export default function ViewBets() {
  const [bets, setBets] = useState([])

  useEffect(() => {
    const storedBets = JSON.parse(localStorage.getItem('tripleBBets') || '[]')
    setBets(storedBets)
  }, [])

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
          {bets.map((bet, index) => {
            // Handle both old format and new format
            const predictions = bet.predictions || bet
            const wagers = bet.wagers || {}
            const hasWagers = Object.keys(wagers).length > 0

            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-sage-dark">
                        {bet.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-brown">{bet.name}</h3>
                      <p className="text-sm text-gray-500">
                        Submitted {new Date(bet.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {hasWagers && (
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total Wagered</div>
                      <div className="font-bold text-gold-dark flex items-center gap-1">
                        <span>🍼</span> {bet.totalSpent || 100} Binky Bucks
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(predictions).map(([key, value]) => {
                    if (!value || key === 'name' || key === 'submittedAt') return null

                    const info = MILESTONE_INFO[key] || {
                      emoji: '📌',
                      title: key.replace(/([A-Z])/g, ' $1').trim(),
                      unit: ''
                    }
                    const wager = wagers[key]

                    return (
                      <div key={key} className={`rounded-lg p-3 ${wager > 0 ? 'bg-sage/10 border border-sage/30' : 'bg-cream'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="text-lg mr-2">{info.emoji}</span>
                            <span className="font-medium text-brown">{info.title}:</span>
                            <span className="ml-2 text-gray-700">
                              {value} {info.unit}
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
            )
          })}
        </div>
      </div>
    </div>
  )
}
