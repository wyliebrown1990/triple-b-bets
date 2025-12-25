import { useState, useMemo } from 'react'

const TOTAL_BUCKS = 100

const MILESTONES = [
  { id: 'firstCrawl', emoji: '🐛', title: 'First Crawl', question: 'At what age (in months) will He Who Shall Not Be Named first crawl?', type: 'number', placeholder: 'e.g., 7', min: 1, max: 24, unit: 'months' },
  { id: 'firstWalk', emoji: '🚶', title: 'First Walk', question: 'At what age (in months) will He Who Shall Not Be Named take his first steps?', type: 'number', placeholder: 'e.g., 12', min: 6, max: 24, unit: 'months' },
  { id: 'firstWord', emoji: '🗣️', title: 'First Word', question: 'What will be He Who Shall Not Be Named\'s first word?', type: 'text', placeholder: 'e.g., Dada, Mama, Ball' },
  { id: 'firstWordAge', emoji: '🗣️', title: 'First Word Age', question: 'At what age (in months) will the first word be spoken?', type: 'number', placeholder: 'e.g., 10', min: 6, max: 24, unit: 'months', isSubQuestion: true },
  { id: 'firstBike', emoji: '🚴', title: 'First Bike Ride', question: 'At what age (in years) will He Who Shall Not Be Named ride a bike without training wheels?', type: 'number', placeholder: 'e.g., 5', min: 2, max: 10, step: 0.5, unit: 'years' },
  { id: 'firstTooth', emoji: '🦷', title: 'First Tooth', question: 'At what age (in months) will He Who Shall Not Be Named\'s first tooth appear?', type: 'number', placeholder: 'e.g., 6', min: 3, max: 18, unit: 'months' },
  { id: 'firstFood', emoji: '🍎', title: 'First Solid Food', question: 'What will be He Who Shall Not Be Named\'s first solid food?', type: 'text', placeholder: 'e.g., Banana, Rice cereal, Avocado' },
  { id: 'heightAtOne', emoji: '📏', title: 'Height at Age 1', question: 'How tall (in inches) will He Who Shall Not Be Named be at his first birthday?', type: 'number', placeholder: 'e.g., 30', min: 24, max: 36, step: 0.5, unit: 'inches' },
  { id: 'weightAtOne', emoji: '⚖️', title: 'Weight at Age 1', question: 'How much (in pounds) will He Who Shall Not Be Named weigh at his first birthday?', type: 'number', placeholder: 'e.g., 22', min: 15, max: 35, step: 0.5, unit: 'lbs' },
  { id: 'sleepThrough', emoji: '😴', title: 'Sleep Through Night', question: 'At what age (in weeks) will He Who Shall Not Be Named first sleep through the night (6+ hours)?', type: 'number', placeholder: 'e.g., 12', min: 4, max: 52, unit: 'weeks' },
  { id: 'wildcard', emoji: '🎲', title: 'Wildcard Prediction', question: 'Make any other prediction about He Who Shall Not Be Named\'s first year!', type: 'textarea', placeholder: 'e.g., He\'ll say \'no\' before \'yes\', He\'ll prefer dogs over cats...' },
]

export default function Bet() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [predictions, setPredictions] = useState({})
  const [wagers, setWagers] = useState({})

  const totalSpent = useMemo(() => {
    return Object.values(wagers).reduce((sum, val) => sum + (parseInt(val) || 0), 0)
  }, [wagers])

  const remaining = TOTAL_BUCKS - totalSpent

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
    if (!canSubmit) return

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
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Milestones */}
          {MILESTONES.map((milestone) => (
            <div key={milestone.id} className={`mb-6 p-4 rounded-lg border-2 transition-all ${
              wagers[milestone.id] > 0 ? 'border-sage bg-sage/5' : 'border-gray-100 bg-gray-50'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <label className="block font-bold text-brown">
                  {milestone.emoji} {milestone.title}
                </label>
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
                  min={milestone.min}
                  max={milestone.max}
                  step={milestone.step}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sage focus:outline-none transition-colors"
                />
              )}

              {wagers[milestone.id] > 0 && (
                <div className="mt-2 text-sm text-sage-dark font-medium">
                  🍼 {wagers[milestone.id]} Binky Bucks wagered on this prediction!
                </div>
              )}
            </div>
          ))}

          {/* Submit */}
          <div className="mt-8">
            {remaining > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center text-red-700">
                You still have <strong>{remaining} Binky Bucks</strong> left to spend!
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full font-bold py-4 px-6 rounded-full text-lg transition-all transform shadow-lg ${
                canSubmit
                  ? 'bg-gold hover:bg-gold-dark text-white hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canSubmit ? 'Lock In My Bets! 🔒' : `Spend All ${TOTAL_BUCKS} Binky Bucks First!`}
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
