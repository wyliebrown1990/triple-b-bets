import { useState, useMemo, useEffect } from 'react'

const TOTAL_BUCKS = 100
const DEFAULT_ODDS = 2.0 // Default multiplier when no bets exist
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSS0cgeOJ2X1AmNZtH7JBYhCgFARs1RWxgKisk3sM1PY2Af4cHKsFj4Uzer-yX8_etnQxgjTZB6NdO5/pub?output=csv'

// CSV column mapping for fetching existing bets
const CSV_PREDICTION_MAP = {
  firstCrawl: 'First Crawl',
  firstWalk: 'First Walk',
  firstWord: 'First Word',
  firstWordAge: 'First Word Age',
  firstBike: 'First Bike Ride',
  firstTooth: 'First Tooth',
  firstFood: 'First Solid Food',
  heightAtOne: 'Height at Age 1',
  weightAtOne: 'Weight at Age 1',
  sleepThrough: 'Sleep Through Night',
  wildcard: 'Wild Card Prediction',
}

// Parse CSV helpers
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

// Calculate odds based on existing predictions
function calculateOdds(existingBets, milestoneId, userValue, milestoneType) {
  if (!existingBets || existingBets.length === 0 || !userValue) {
    return DEFAULT_ODDS
  }

  const csvColumn = CSV_PREDICTION_MAP[milestoneId]
  const predictions = existingBets
    .map(bet => bet[csvColumn])
    .filter(val => val && val.trim() !== '')

  if (predictions.length === 0) {
    return DEFAULT_ODDS
  }

  if (milestoneType === 'number') {
    // For numeric predictions, calculate odds based on distance from mean
    const numericPredictions = predictions.map(p => parseFloat(p)).filter(n => !isNaN(n))
    if (numericPredictions.length === 0) return DEFAULT_ODDS

    const mean = numericPredictions.reduce((a, b) => a + b, 0) / numericPredictions.length
    const stdDev = Math.sqrt(
      numericPredictions.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericPredictions.length
    ) || 1

    const userNum = parseFloat(userValue)
    if (isNaN(userNum)) return DEFAULT_ODDS

    const zScore = Math.abs(userNum - mean) / stdDev
    // Odds increase with distance from mean: 1.5x at mean, up to 10x for outliers
    const odds = Math.min(10, Math.max(1.5, 1.5 + (zScore * 1.5)))
    return Math.round(odds * 10) / 10
  } else {
    // For text predictions, odds based on frequency
    const lowerValue = userValue.toLowerCase().trim()
    const frequency = predictions.filter(p => p.toLowerCase().trim() === lowerValue).length
    const totalBets = predictions.length

    if (frequency === 0) {
      // Unique prediction - high odds
      return Math.min(10, 3 + totalBets * 0.5)
    }

    // More common = lower odds
    const popularity = frequency / totalBets
    const odds = Math.max(1.5, 5 * (1 - popularity))
    return Math.round(odds * 10) / 10
  }
}

// Google Form configuration
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdVMBNyU6rBM8uGDIQFzbL6YkkZ8h2wxXvdNGl-13US6w1Zyw/formResponse'

// Map our field IDs to Google Form entry IDs
const GOOGLE_FORM_FIELDS = {
  name: 'entry.329746528',
  firstCrawl_prediction: 'entry.1833693831',
  firstCrawl_wager: 'entry.1361200102',
  firstWalk_prediction: 'entry.1939748459',
  firstWalk_wager: 'entry.318095343',
  firstWord_prediction: 'entry.1199057283',
  firstWord_wager: 'entry.23004871',
  firstWordAge_prediction: 'entry.1625774436',
  firstWordAge_wager: 'entry.1511043393',
  firstBike_prediction: 'entry.1853320344',
  firstBike_wager: 'entry.1064497435',
  firstTooth_prediction: 'entry.1950085886',
  firstTooth_wager: 'entry.1874162770',
  firstFood_prediction: 'entry.1783022427',
  firstFood_wager: 'entry.1254724568',
  heightAtOne_prediction: 'entry.1345837414',
  heightAtOne_wager: 'entry.53518850',
  weightAtOne_prediction: 'entry.1613054389',
  weightAtOne_wager: 'entry.1305594979',
  sleepThrough_prediction: 'entry.335764234',
  sleepThrough_wager: 'entry.769132592',
  wildcard_prediction: 'entry.249368260',
  wildcard_wager: 'entry.890593987',
}

const MILESTONES = [
  { id: 'firstCrawl', emoji: '🐛', title: 'First Crawl', question: 'At what age (in months) will He Who Shall Not Be Named first crawl?', type: 'number', placeholder: 'e.g., 7', unit: 'months' },
  { id: 'firstWalk', emoji: '🚶', title: 'First Walk', question: 'At what age (in months) will He Who Shall Not Be Named take his first steps?', type: 'number', placeholder: 'e.g., 12', unit: 'months' },
  { id: 'firstWord', emoji: '🗣️', title: 'First Word', question: 'What will be He Who Shall Not Be Named\'s first word?', type: 'text', placeholder: 'e.g., Dada, Mama, Ball' },
  { id: 'firstWordAge', emoji: '🗣️', title: 'First Word Age', question: 'At what age (in months) will the first word be spoken?', type: 'number', placeholder: 'e.g., 10', unit: 'months' },
  { id: 'firstBike', emoji: '🚴', title: 'First Bike Ride', question: 'At what age (in years) will He Who Shall Not Be Named ride a bike without training wheels?', type: 'number', placeholder: 'e.g., 5', step: 0.5, unit: 'years' },
  { id: 'firstTooth', emoji: '🦷', title: 'First Tooth', question: 'At what age (in months) will He Who Shall Not Be Named\'s first tooth appear?', type: 'number', placeholder: 'e.g., 6', unit: 'months' },
  { id: 'firstFood', emoji: '🍎', title: 'First Solid Food', question: 'What will be He Who Shall Not Be Named\'s first solid food?', type: 'text', placeholder: 'e.g., Banana, Rice cereal, Avocado' },
  { id: 'heightAtOne', emoji: '📏', title: 'Height at Age 1', question: 'How tall (in inches) will He Who Shall Not Be Named be at his first birthday?', type: 'number', placeholder: 'e.g., 30', step: 0.5, unit: 'inches' },
  { id: 'weightAtOne', emoji: '⚖️', title: 'Weight at Age 1', question: 'How much (in pounds) will He Who Shall Not Be Named weigh at his first birthday?', type: 'number', placeholder: 'e.g., 22', step: 0.5, unit: 'lbs' },
  { id: 'sleepThrough', emoji: '😴', title: 'Sleep Through Night', question: 'At what age (in weeks) will He Who Shall Not Be Named first sleep through the night (6+ hours)?', type: 'number', placeholder: 'e.g., 12', unit: 'weeks' },
  { id: 'wildcard', emoji: '🎲', title: 'Wildcard Prediction', question: 'Make any other prediction about He Who Shall Not Be Named\'s first year!', type: 'textarea', placeholder: 'e.g., He\'ll say \'no\' before \'yes\', He\'ll prefer dogs over cats...' },
]

export default function Bet() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [predictions, setPredictions] = useState({})
  const [wagers, setWagers] = useState({})
  const [existingBets, setExistingBets] = useState([])
  const [loadingOdds, setLoadingOdds] = useState(true)

  // Fetch existing bets to calculate odds
  useEffect(() => {
    async function fetchExistingBets() {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL)
        if (response.ok) {
          const csvText = await response.text()
          const data = parseCSV(csvText)
          setExistingBets(data)
        }
      } catch (err) {
        console.error('Error fetching existing bets for odds:', err)
      } finally {
        setLoadingOdds(false)
      }
    }
    fetchExistingBets()
  }, [])

  const totalSpent = useMemo(() => {
    return Object.values(wagers).reduce((sum, val) => sum + (parseInt(val) || 0), 0)
  }, [wagers])

  const remaining = TOTAL_BUCKS - totalSpent

  // Calculate odds for each milestone based on user's current prediction
  const odds = useMemo(() => {
    const oddsMap = {}
    MILESTONES.forEach(milestone => {
      const userValue = predictions[milestone.id]
      oddsMap[milestone.id] = calculateOdds(
        existingBets,
        milestone.id,
        userValue,
        milestone.type === 'textarea' ? 'text' : milestone.type
      )
    })
    return oddsMap
  }, [predictions, existingBets])

  const handlePredictionChange = (id, value) => {
    setPredictions({ ...predictions, [id]: value })
  }

  const handleWagerChange = (id, value) => {
    const numValue = Math.max(0, Math.min(parseInt(value) || 0, remaining + (parseInt(wagers[id]) || 0)))
    setWagers({ ...wagers, [id]: numValue })
  }

  const canSubmit = remaining === 0 && name.trim() !== '' && Object.keys(wagers).length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || submitting) return

    setSubmitting(true)

    // Build form data for Google Forms
    const formData = new FormData()
    formData.append(GOOGLE_FORM_FIELDS.name, name)

    // Add all predictions and wagers
    MILESTONES.forEach((milestone) => {
      const predictionKey = `${milestone.id}_prediction`
      const wagerKey = `${milestone.id}_wager`

      formData.append(GOOGLE_FORM_FIELDS[predictionKey], predictions[milestone.id] || '')
      formData.append(GOOGLE_FORM_FIELDS[wagerKey], wagers[milestone.id] || 0)
    })

    try {
      // Submit to Google Forms (using no-cors mode since Google Forms doesn't return CORS headers)
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // Required for Google Forms
      })

      // Also save to localStorage for the View Bets page
      const betData = {
        name,
        predictions,
        wagers,
        totalSpent,
        submittedAt: new Date().toISOString(),
      }

      const existingBets = JSON.parse(localStorage.getItem('tripleBBets') || '[]')
      existingBets.push(betData)
      localStorage.setItem('tripleBBets', JSON.stringify(existingBets))

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Still mark as submitted since no-cors doesn't give us response status
      setSubmitted(true)
    }

    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-bold text-brown mb-4">
            Bets Locked In!
          </h2>
          <p className="text-gray-600 mb-2">
            Thanks, {name}! You wagered all {TOTAL_BUCKS} Binky Bucks!
          </p>
          <p className="text-gray-600 mb-6">
            Your predictions have been submitted. No take-backs!
          </p>
          <a
            href="/bets"
            className="inline-block bg-sage hover:bg-sage-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            View All Bets
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-brown mb-2">
            Place Your Bets
          </h1>
          <p className="text-gray-600">
            Make your predictions and wager your Binky Bucks wisely!
          </p>
        </div>

        {/* Binky Bucks Balance - Sticky */}
        <div className="sticky top-16 z-40 mb-6">
          <div className={`rounded-xl p-4 shadow-lg border-2 transition-all ${
            remaining === 0
              ? 'bg-green-50 border-green-400'
              : remaining <= 20
                ? 'bg-red-50 border-red-400 animate-pulse'
                : remaining <= 50
                  ? 'bg-yellow-50 border-yellow-400'
                  : 'bg-white border-gold'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍼</span>
                <span className="font-bold text-brown">Binky Bucks</span>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  remaining === 0
                    ? 'text-green-600'
                    : remaining <= 20
                      ? 'text-red-600'
                      : remaining <= 50
                        ? 'text-yellow-600'
                        : 'text-gold-dark'
                }`}>
                  {remaining} / {TOTAL_BUCKS}
                </div>
                <div className="text-xs text-gray-500">
                  {remaining === 0
                    ? '✓ All spent! Ready to submit!'
                    : remaining <= 20
                      ? '⚠️ Running low!'
                      : `${totalSpent} spent`}
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  remaining === 0
                    ? 'bg-green-500'
                    : remaining <= 20
                      ? 'bg-red-500'
                      : remaining <= 50
                        ? 'bg-yellow-500'
                        : 'bg-gold'
                }`}
                style={{ width: `${(totalSpent / TOTAL_BUCKS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Name */}
          <div className="mb-8">
            <label className="block font-bold text-brown mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none transition-colors"
            />
          </div>

          <div className="bg-gold/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-brown">
              <strong>How it works:</strong> You have {TOTAL_BUCKS} Binky Bucks 🍼 to wager across your predictions.
              Bet more on predictions you're confident about! You must spend exactly all {TOTAL_BUCKS} to submit.
            </p>
            <p className="text-sm text-brown mt-2">
              <strong>Odds:</strong> {existingBets.length === 0
                ? `Default ${DEFAULT_ODDS}x odds until the first bet is placed!`
                : `Dynamic odds based on ${existingBets.length} existing bet${existingBets.length === 1 ? '' : 's'}. Pick outliers for higher payouts!`}
            </p>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Milestones */}
          {MILESTONES.map((milestone) => {
            const currentOdds = odds[milestone.id] || DEFAULT_ODDS
            const wagerAmount = parseInt(wagers[milestone.id]) || 0
            const potentialPayout = Math.round(wagerAmount * currentOdds)

            return (
              <div key={milestone.id} className={`mb-6 p-4 rounded-lg border-2 transition-all ${
                wagers[milestone.id] > 0 ? 'border-sage bg-sage/5' : 'border-gray-100 bg-gray-50'
              }`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="block font-bold text-brown">
                      {milestone.emoji} {milestone.title}
                    </label>
                    {/* Odds badge */}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      predictions[milestone.id]
                        ? currentOdds >= 5
                          ? 'bg-purple-100 text-purple-700'
                          : currentOdds >= 3
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {predictions[milestone.id] ? `${currentOdds}x` : `${DEFAULT_ODDS}x`}
                    </span>
                  </div>
                  {/* Wager input */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-gray-500">Wager:</span>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">🍼</span>
                      <input
                        type="number"
                        value={wagers[milestone.id] || ''}
                        onChange={(e) => handleWagerChange(milestone.id, e.target.value)}
                        placeholder="0"
                        min="0"
                        max={remaining + (parseInt(wagers[milestone.id]) || 0)}
                        className="w-20 pl-7 pr-2 py-1 border-2 border-gray-200 rounded-lg focus:border-gold focus:outline-none text-center font-bold"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-2">{milestone.question}</p>

                {milestone.type === 'textarea' ? (
                  <textarea
                    value={predictions[milestone.id] || ''}
                    onChange={(e) => handlePredictionChange(milestone.id, e.target.value)}
                    placeholder={milestone.placeholder}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none transition-colors resize-none"
                  />
                ) : (
                  <input
                    type={milestone.type}
                    value={predictions[milestone.id] || ''}
                    onChange={(e) => handlePredictionChange(milestone.id, e.target.value)}
                    placeholder={milestone.placeholder}
                    step={milestone.step}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none transition-colors"
                  />
                )}

                {wagerAmount > 0 && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-sage-dark font-medium">
                      🍼 {wagerAmount} Binky Bucks wagered
                    </span>
                    <span className={`text-sm font-bold ${
                      currentOdds >= 5 ? 'text-purple-600' : currentOdds >= 3 ? 'text-blue-600' : 'text-gold-dark'
                    }`}>
                      Potential payout: {potentialPayout} 🍼
                    </span>
                  </div>
                )}
              </div>
            )
          })}

          {/* Submit */}
          <div className="mt-8">
            {remaining > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center text-red-700">
                You still have <strong>{remaining} Binky Bucks</strong> left to spend!
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={`w-full font-bold py-4 px-6 rounded-full text-lg transition-all transform shadow-lg ${
                canSubmit && !submitting
                  ? 'bg-gold hover:bg-gold-dark text-white hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting
                ? 'Submitting...'
                : canSubmit
                  ? 'Lock In My Bets! 🔒'
                  : `Spend All ${TOTAL_BUCKS} Binky Bucks First!`}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Once submitted, your predictions cannot be changed.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
