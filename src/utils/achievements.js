// Achievement badge definitions and calculation logic

export const ACHIEVEMENTS = [
  {
    id: 'first_bettor',
    name: 'First!',
    icon: '🥇',
    description: 'First person to place a bet',
  },
  {
    id: 'all_in',
    name: 'All-In',
    icon: '🎰',
    description: 'Bet 50+ Binky Bucks on one prediction',
  },
  {
    id: 'spread_thin',
    name: 'Diversified',
    icon: '📊',
    description: 'Made predictions on all 11 milestones',
  },
  {
    id: 'high_roller',
    name: 'High Roller',
    icon: '💎',
    description: 'Potential payout over 250 Binky Bucks',
  },
  {
    id: 'risk_taker',
    name: 'Risk Taker',
    icon: '🎲',
    description: 'Average odds over 4x',
  },
  {
    id: 'safe_player',
    name: 'Safe Player',
    icon: '🛡️',
    description: 'All predictions under 3x odds',
  },
  {
    id: 'word_nerd',
    name: 'Word Nerd',
    icon: '📚',
    description: 'Unique first word prediction',
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    icon: '✍️',
    description: 'Wildcard prediction over 100 characters',
  },
]

// Calculate which achievements a bettor has earned
export function calculateAchievements(bettor, allBettors, bettorIndex) {
  const earned = []

  // First bettor
  if (bettorIndex === 0) {
    earned.push('first_bettor')
  }

  // All-In: 50+ on one bet
  if (bettor.maxSingleWager >= 50) {
    earned.push('all_in')
  }

  // Diversified: all 11 predictions
  if (bettor.predictionsCount >= 11) {
    earned.push('spread_thin')
  }

  // High Roller: potential payout > 250
  if (bettor.potentialPayout >= 250) {
    earned.push('high_roller')
  }

  // Risk Taker: avg odds > 4
  if (bettor.avgOdds >= 4) {
    earned.push('risk_taker')
  }

  // Safe Player: avg odds < 2.5
  if (bettor.avgOdds < 2.5 && bettor.predictionsCount >= 5) {
    earned.push('safe_player')
  }

  // Word Nerd: unique first word
  if (bettor.hasUniqueWord) {
    earned.push('word_nerd')
  }

  // Storyteller: long wildcard
  if (bettor.wildcardLength >= 100) {
    earned.push('storyteller')
  }

  return earned
}

// Get achievement details by ID
export function getAchievement(id) {
  return ACHIEVEMENTS.find(a => a.id === id)
}
