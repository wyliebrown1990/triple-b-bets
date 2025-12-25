# Triple B Bets - Development Guide

## Project Overview
A playful family betting pool for baby milestones with pixel art aesthetic. Built with React + Vite, styled with Tailwind CSS, using Google Forms/Sheets as a simple backend.

**Key Constraints:**
- No paid backend services
- Google Forms for data input, Google Sheets for data storage/display
- Focus on fun, quick wins
- Mobile-first responsive design
- Pixel art aesthetic throughout

**Betting Close Date:** January 1st, 2026 (New Year's Day)

---

## Sprint 1: Countdown Timer & Nursery Background ✅ COMPLETED
**Goal:** Quick visual wins that enhance the atmosphere

**Status:** COMPLETED
- ✅ 1A: Countdown Timer - Full and compact versions
- ✅ 1B: Nursery Background - 8 pixel art items (crib, teddy, bottle, rattle, duck, blocks, pacifier, mobile)

### 1A: Countdown Timer
**Estimated Effort:** 1-2 hours

**Description:**
Add a pixel-style countdown timer showing time remaining until betting closes (January 1st, 2026).

**Implementation:**
1. Create `src/components/CountdownTimer.jsx`
2. Calculate time remaining until `2026-01-01T00:00:00`
3. Display days, hours, minutes, seconds in pixel-style boxes
4. Add urgency styling when < 24 hours remain
5. Show "BETTING CLOSED" message after deadline

**Component Structure:**
```jsx
// CountdownTimer.jsx
- useState for timeLeft { days, hours, minutes, seconds }
- useEffect with setInterval (1 second updates)
- Pixel-style digit display (each number in a bordered box)
- Pulsing animation when < 24 hours
- Red warning colors when < 1 hour
```

**Placement:**
- Home page: Below hero section
- Bet page: In the sticky Binky Bucks bar (compact version)

**Styling:**
- Pixel font for numbers (use CSS font-family or SVG digits)
- Retro LED/flip-clock aesthetic
- Colors: Gold background, brown text, red when urgent

**Mobile Considerations:**
- Stack vertically on very small screens
- Smaller font sizes
- Compact "5d 12h 30m" format option

---

### 1B: Pixel Nursery Background
**Estimated Effort:** 2-3 hours

**Description:**
Animated pixel art nursery elements floating in the background across all pages.

**Implementation:**
1. Create `src/components/NurseryBackground.jsx`
2. Design 6-8 pixel art SVG elements:
   - Crib
   - Baby mobile with stars/moon
   - Teddy bear
   - Baby bottle
   - Rattle
   - Rubber duck
   - Alphabet blocks
   - Pacifier
3. Float elements with CSS animations (similar to existing FloatingIcons)
4. Add parallax effect on scroll (optional)

**Animation Approach:**
```jsx
// Each element gets:
- Random starting position
- Gentle floating animation (translateY oscillation)
- Slow rotation (subtle, ±5 degrees)
- Varied animation durations (15-30 seconds)
- Lower opacity (0.15-0.25) so they don't distract
```

**Day/Night Cycle (Optional Enhancement):**
```jsx
// Based on user's local time:
- 6am-6pm: Light cream background, sun element
- 6pm-6am: Soft blue/purple background, moon/stars more prominent
```

**Performance:**
- Limit to 10-15 elements max
- Use CSS transforms only (GPU accelerated)
- Add `will-change: transform` for smooth animations

**Mobile Considerations:**
- Reduce element count to 6-8 on mobile
- Smaller element sizes
- Disable parallax on mobile (performance)

---

## Sprint 2: Baby Reactions & Sound Effects ✅ COMPLETED
**Goal:** Make the betting experience more interactive and fun

**Status:** COMPLETED
- ✅ 2A: Baby Reaction - 6 expressions (neutral, skeptical, yawning, excited, laughing, thinking)
- ✅ 2B: Sound Effects - Web Audio API generated 8-bit sounds with mute toggle

### 2A: Baby Reaction Preview
**Estimated Effort:** 2-3 hours

**Description:**
The pixel baby reacts to predictions as users type them, providing playful feedback.

**Implementation:**
1. Create `src/components/BabyReaction.jsx`
2. Design 5-6 baby expressions as SVG variants:
   - Neutral (default)
   - Skeptical (raised eyebrow) - for very early predictions
   - Yawning - for very late predictions
   - Clapping/Excited - for unique/outlier predictions
   - Laughing - for funny text predictions
   - Thinking - while user is typing
3. Position baby in corner of Bet page
4. Swap expression based on current field value

**Reaction Logic:**
```javascript
// For numeric fields (crawl, walk, etc.):
const getReaction = (value, fieldType, existingBets) => {
  const avg = calculateAverage(existingBets, fieldType)
  const stdDev = calculateStdDev(existingBets, fieldType)

  if (!value) return 'neutral'
  if (value < avg - stdDev * 1.5) return 'skeptical' // Very early
  if (value > avg + stdDev * 1.5) return 'yawning'   // Very late
  if (isOutlier(value, existingBets)) return 'excited' // Unique
  return 'neutral'
}

// For text fields (first word, food):
const getTextReaction = (value, existingBets) => {
  if (!value) return 'neutral'
  if (value.length > 20) return 'laughing' // Long/funny answer
  if (isUniquePrediction(value, existingBets)) return 'excited'
  return 'thinking'
}
```

**Animation:**
- Smooth transition between expressions (CSS transition or spring animation)
- Small bounce when expression changes
- Idle animation (slight breathing/bobbing) when neutral

**Placement:**
- Fixed position bottom-left corner of Bet page
- Above the fold but not blocking inputs
- Size: 80px desktop, 60px mobile

**Mobile Considerations:**
- Smaller size
- May hide during active input on very small screens
- Touch to dismiss/minimize option

---

### 2B: Sound Effects
**Estimated Effort:** 2-3 hours

**Description:**
Retro 8-bit sound effects for various interactions, with mute toggle.

**Implementation:**
1. Create `src/hooks/useSoundEffects.js` custom hook
2. Create `src/components/SoundToggle.jsx` mute button
3. Source/create small 8-bit sound files (< 50KB total)
4. Store mute preference in localStorage

**Sound Events:**
| Event | Sound | File Size Target |
|-------|-------|------------------|
| Add wager | Coin clink | < 5KB |
| Complete field | Positive chime | < 5KB |
| Taunt appears | Pop/boing | < 5KB |
| Submit bet | Victory fanfare | < 10KB |
| Error/validation | Buzz/wrong | < 5KB |
| Button hover | Soft blip | < 3KB |
| Countdown urgent | Tick-tock | < 5KB |

**Sound Sources (Free):**
- [JSFXR](https://sfxr.me/) - Generate 8-bit sounds
- [Freesound.org](https://freesound.org) - CC0 retro sounds
- [OpenGameArt.org](https://opengameart.org) - Game sound packs

**Hook API:**
```javascript
// useSoundEffects.js
const {
  playSound,      // playSound('coin')
  isMuted,        // boolean
  toggleMute,     // function
  setVolume       // 0-1
} = useSoundEffects()
```

**Mute Toggle Component:**
- Pixel-style speaker icon
- Click to toggle mute
- Show sound waves when unmuted
- Position: Fixed top-right or in header
- Persist preference in localStorage

**Mobile Considerations:**
- Default to muted on mobile (respect user's phone state)
- Smaller toggle button
- Consider disabling hover sounds on touch devices

**Performance:**
- Preload sounds on app init
- Use Web Audio API for low latency
- Fallback to HTML5 Audio if needed
- Keep total sound bundle < 50KB

---

## Sprint 3: Leaderboard & Achievement Badges ✅ COMPLETED
**Goal:** Add competitive elements and recognition

**Status:** COMPLETED
- ✅ 3A: Leaderboard Page - Pixel podium, rankings table, stat cards
- ✅ 3B: Achievement Badges - 8 achievements, tooltips, displayed on View Bets

### 3A: Leaderboard Page
**Estimated Effort:** 3-4 hours

**Description:**
New page showing rankings by potential payout, with pixel trophy podium.

**Implementation:**
1. Create `src/pages/Leaderboard.jsx`
2. Add route `/leaderboard` in App.jsx
3. Add nav link in Header
4. Fetch and calculate scores from Google Sheets

**Scoring System:**
```javascript
// Calculate potential payout for each bettor
const calculateScore = (bettor, currentOdds) => {
  let totalPotential = 0

  Object.entries(bettor.wagers).forEach(([milestone, wager]) => {
    const odds = currentOdds[milestone] || 2.0
    totalPotential += wager * odds
  })

  return {
    name: bettor.name,
    totalWagered: bettor.totalWager,
    potentialPayout: totalPotential,
    avgOdds: totalPotential / bettor.totalWager,
    riskLevel: calculateRiskLevel(bettor) // 'Safe' | 'Moderate' | 'Bold'
  }
}
```

**UI Components:**
1. **Pixel Podium** (top 3)
   - SVG podium with 1st, 2nd, 3rd places
   - Animated trophy for 1st place
   - Profile initial circles on each position

2. **Full Rankings Table**
   - Rank, Name, Total Wagered, Potential Payout, Risk Level
   - Sortable columns
   - Highlight current user (if we track that via localStorage)

3. **Stats Cards**
   - "Most Bold Bettor" - highest average odds
   - "Safest Player" - lowest average odds
   - "Most Predictions" - filled most fields
   - "All-In Champion" - highest single wager

**Styling:**
- Pixel borders and decorations
- Gold/silver/bronze colors for top 3
- Animated sparkles on 1st place
- Trophy icon: 🏆 or pixel SVG

**Mobile Considerations:**
- Podium scales down
- Table becomes card layout
- Horizontal scroll for stats cards

---

### 3B: Achievement Badges
**Estimated Effort:** 2-3 hours

**Description:**
Unlock pixel badges based on betting behavior, displayed on View Bets page.

**Implementation:**
1. Create `src/components/AchievementBadge.jsx`
2. Create `src/utils/achievements.js` for badge logic
3. Calculate badges from Google Sheets data
4. Display badges next to names on View Bets page

**Badge Definitions:**
```javascript
const ACHIEVEMENTS = [
  {
    id: 'first_bettor',
    name: 'First!',
    icon: '🥇',
    description: 'First person to place a bet',
    check: (bettor, allBets) => bettor === allBets[0]
  },
  {
    id: 'all_in',
    name: 'All-In Andy',
    icon: '🎰',
    description: 'Bet 50+ Binky Bucks on one prediction',
    check: (bettor) => Object.values(bettor.wagers).some(w => w >= 50)
  },
  {
    id: 'spread_thin',
    name: 'Diversified',
    icon: '📊',
    description: 'Made predictions on all 11 milestones',
    check: (bettor) => Object.keys(bettor.predictions).length === 11
  },
  {
    id: 'contrarian',
    name: 'Contrarian',
    icon: '🦄',
    description: 'All predictions are outliers (5x+ odds)',
    check: (bettor, allBets, odds) => {
      return Object.keys(bettor.predictions).every(m => odds[m] >= 5)
    }
  },
  {
    id: 'safe_player',
    name: 'Playing It Safe',
    icon: '🛡️',
    description: 'No prediction over 3x odds',
    check: (bettor, allBets, odds) => {
      return Object.keys(bettor.predictions).every(m => odds[m] < 3)
    }
  },
  {
    id: 'big_spender',
    name: 'High Roller',
    icon: '💰',
    description: 'Total potential payout over 300',
    check: (bettor, allBets, odds) => calculatePotential(bettor, odds) > 300
  },
  {
    id: 'word_nerd',
    name: 'Word Nerd',
    icon: '📚',
    description: 'Predicted a unique first word no one else picked',
    check: (bettor, allBets) => isUniqueWord(bettor, allBets)
  },
  {
    id: 'family_oracle',
    name: 'Family Oracle',
    icon: '🔮',
    description: 'Made a wildcard prediction over 100 characters',
    check: (bettor) => (bettor.predictions.wildcard?.length || 0) > 100
  }
]
```

**Badge Display:**
- Small pixel badge icons (16x16 or 24x24)
- Tooltip on hover showing badge name/description
- Display in a row next to bettor name
- Grayscale for locked badges (optional: show what's needed)

**Mobile Considerations:**
- Tap to show tooltip instead of hover
- Smaller badge sizes
- Scrollable badge row if many badges

---

## Sprint 4: Social Features ✅ COMPLETED
**Goal:** Add community interaction and friendly competition

**Status:** COMPLETED
- ✅ 4A: Trash Talk Wall - Message posting with targets, playful styling
- ✅ 4B: Side Bets - 1v1 challenges with VS layout, bragging rights points

**Note:** Both pages require Google Form setup to be fully functional. Replace the placeholder URLs in:
- `src/pages/TrashTalk.jsx` - GOOGLE_FORM_ACTION_URL, FORM_ENTRIES, GOOGLE_SHEET_CSV_URL
- `src/pages/SideBets.jsx` - CHALLENGE_FORM_URL, CHALLENGE_ENTRIES, CHALLENGES_CSV_URL

### 4A: Trash Talk Wall
**Estimated Effort:** 3-4 hours

**Description:**
A wall where bettors can leave playful messages and call out other bettors.

**Google Form Setup:**
Create new Google Form with fields:
- Name (short text)
- Message (paragraph, max 280 chars)
- Target (optional - dropdown of existing bettors or "Everyone")
- Timestamp (auto)

Publish linked Google Sheet as CSV.

**Implementation:**
1. Create `src/pages/TrashTalk.jsx`
2. Add route `/trash-talk`
3. Add nav link
4. Fetch messages from Google Sheets CSV
5. Simple form to submit new messages (posts to Google Form)

**UI Components:**
1. **Message Wall**
   - Pixel speech bubbles
   - Random slight rotation for playful look
   - Newest at top
   - Show name, message, target (if any), time ago

2. **Submit Form**
   - Name input
   - Message textarea (with character counter, max 280)
   - Optional target dropdown
   - Submit button with pixel styling

3. **Fun Extras**
   - Random pixel emoji reactions on messages
   - "🔥" indicator for messages targeting someone
   - Filter: "All" | "About Me" | "By Me"

**Message Display:**
```jsx
<div className="trash-talk-bubble">
  <div className="bubble-header">
    <span className="name">{message.name}</span>
    {message.target && (
      <span className="target">→ @{message.target}</span>
    )}
  </div>
  <p className="message">{message.text}</p>
  <span className="time">{timeAgo(message.timestamp)}</span>
</div>
```

**Moderation:**
- No backend moderation (trust family)
- Could add word filter client-side if needed
- Messages display immediately after form submit (optimistic UI)

**Mobile Considerations:**
- Full-width bubbles
- Larger touch targets
- Sticky submit form at bottom

---

### 4B: Side Bets (Head-to-Head Challenges)
**Estimated Effort:** 3-4 hours

**Description:**
Allow family members to create 1v1 challenges on specific predictions.

**Google Form Setup:**
Create new Google Form with fields:
- Challenger Name (short text)
- Opponent Name (dropdown of existing bettors)
- Milestone (dropdown: First Crawl, First Walk, etc.)
- Challenger's Prediction (short text)
- Wager Amount (number, 1-50 "Bragging Rights Points")
- Trash Talk (optional paragraph)
- Timestamp (auto)

Publish linked Google Sheet as CSV.

**Implementation:**
1. Create `src/pages/SideBets.jsx`
2. Add route `/side-bets`
3. Add nav link
4. Display existing challenges
5. Form to create new challenge
6. Show challenge status (Pending/Accepted/Completed)

**Challenge States:**
```javascript
const CHALLENGE_STATUS = {
  PENDING: 'pending',    // Waiting for opponent to accept
  ACCEPTED: 'accepted',  // Both parties locked in
  COMPLETED: 'completed' // Result determined (post-birth)
}

// Determine status by checking if opponent responded
const getChallengeStatus = (challenge, responses) => {
  const response = responses.find(r =>
    r.challengeId === challenge.id &&
    r.responder === challenge.opponent
  )
  if (!response) return 'PENDING'
  if (challenge.result) return 'COMPLETED'
  return 'ACCEPTED'
}
```

**UI Components:**
1. **Challenge Cards**
   - VS layout with challenger on left, opponent on right
   - Pixel avatars (initials)
   - Milestone icon in center
   - Each side's prediction
   - Wager amount
   - Status badge

2. **Create Challenge Form**
   - Select opponent from existing bettors
   - Select milestone
   - Enter your prediction
   - Set wager (bragging rights points)
   - Optional trash talk

3. **Accept Challenge Flow**
   - If viewing a challenge where you're the opponent
   - Show "Accept Challenge" button
   - Enter your counter-prediction
   - Submits to Google Form (as response)

**Accepting Challenges:**
- Second Google Form for responses:
  - Challenge ID (hidden, passed via URL param)
  - Responder Name
  - Counter-Prediction
  - Counter Trash Talk (optional)

**Mobile Considerations:**
- Stack VS layout vertically
- Swipeable challenge cards
- Bottom sheet for create/accept forms

---

## Sprint 5: Admin & Results System
**Goal:** Enable post-birth results tracking and winner celebrations

### 5A: Admin Page
**Estimated Effort:** 3-4 hours

**Description:**
Secret admin page to input actual milestone results as they happen.

**Access Control:**
- URL: `/admin?key=YOUR_SECRET_KEY`
- Key stored in environment variable or hardcoded (family project)
- Redirect to home if key doesn't match
- No key in URL = show "Enter Admin Key" form

**Google Sheet Setup:**
Create "Results" sheet (separate tab or new sheet) with columns:
- Milestone ID
- Actual Value
- Date Achieved
- Notes
- Updated By
- Timestamp

Admin page writes to this via Google Form.

**Implementation:**
1. Create `src/pages/Admin.jsx`
2. Add route `/admin`
3. Key validation logic
4. Form to input results
5. Display current results status

**UI Components:**
1. **Results Input Form**
   - Dropdown: Select milestone
   - Input: Actual value (type matches milestone)
   - Date picker: When it happened
   - Notes: Optional text
   - Submit button

2. **Results Dashboard**
   - List all milestones
   - Status: Pending | Recorded
   - Recorded ones show value and date
   - Edit button for corrections

3. **Quick Actions**
   - "Reveal Result" toggle (makes result public)
   - "Trigger Celebration" button
   - "Lock All Betting" toggle

**Data Flow:**
```
Admin inputs result → Google Form → Google Sheet
                                         ↓
                            Results page fetches CSV
                                         ↓
                            Compare with predictions
                                         ↓
                            Determine winners
```

**Mobile Considerations:**
- Admin page should work on mobile (for quick updates)
- Large touch targets
- Simple, functional design (less emphasis on pixel aesthetic)

---

### 5B: Results Reveal Page
**Estimated Effort:** 4-5 hours

**Description:**
Dramatic reveal page showing actual results vs predictions.

**Implementation:**
1. Create `src/pages/Results.jsx`
2. Add route `/results`
3. Add nav link (show after first result is recorded)
4. Fetch results from Google Sheets
5. Calculate winners for each milestone

**Winner Calculation:**
```javascript
const determineWinner = (milestone, actualValue, allBets) => {
  // For numeric predictions: closest wins
  if (milestone.type === 'number') {
    const sorted = allBets
      .filter(b => b.predictions[milestone.id])
      .map(b => ({
        ...b,
        diff: Math.abs(parseFloat(b.predictions[milestone.id]) - actualValue)
      }))
      .sort((a, b) => a.diff - b.diff)

    return sorted[0] // Winner is closest
  }

  // For text predictions: exact match wins
  if (milestone.type === 'text') {
    const winners = allBets.filter(b =>
      b.predictions[milestone.id]?.toLowerCase() === actualValue.toLowerCase()
    )
    return winners // Could be multiple winners
  }
}
```

**UI Components:**
1. **Milestone Cards (Unrevealed)**
   - Locked/mystery appearance
   - Pixel question marks
   - "Coming Soon" or countdown to reveal

2. **Milestone Cards (Revealed)**
   - Dramatic reveal animation (envelope opening, curtain pull)
   - Show actual value prominently
   - Winner(s) highlighted with gold border
   - List all predictions ranked by closeness
   - Show who won/lost their wagers

3. **Running Scoreboard**
   - Total Binky Bucks won by each person
   - Updates as results come in
   - Leader highlighted

**Reveal Animation Sequence:**
```javascript
// When a new result is revealed:
1. Card shakes/glows
2. "Drumroll" sound effect
3. Flip/reveal animation (1.5 seconds)
4. Confetti burst
5. Winner announcement with fanfare
6. Scroll to show prediction comparison
```

**Mobile Considerations:**
- Simpler animations (performance)
- Tap to reveal instead of auto-play
- Vertically scrolling cards

---

### 5C: Winner Celebration
**Estimated Effort:** 2-3 hours

**Description:**
Special celebration animations and displays for winners.

**Implementation:**
1. Create `src/components/Celebration.jsx`
2. Create `src/components/ConfettiEffect.jsx`
3. Add celebration triggers to Results page
4. Create overall winner announcement

**Celebration Components:**
1. **Confetti Effect**
   - Canvas or CSS-based confetti
   - Pixel-style square confetti pieces
   - Colors match site palette
   - Trigger on reveal, auto-stop after 3 seconds

2. **Winner Spotlight**
   - Full-screen overlay option
   - Winner's name in large pixel font
   - Trophy animation
   - Milestone they won
   - Payout amount

3. **Grand Champion Display** (after all results)
   - Pixel parade animation
   - All characters marching
   - Champion's name on banner
   - Final scoreboard

**Shareable Results:**
```javascript
// Generate shareable image/card
const generateShareCard = (winner, milestone, prediction) => {
  // Use html2canvas or similar
  // Create pixel-style card with:
  // - "I PREDICTED IT!" header
  // - Milestone icon
  // - Prediction value
  // - Winner's name
  // - Triple B Bets branding
}
```

**Admin Triggers:**
- Button in admin to trigger celebration
- Can re-trigger for demos
- Option to trigger "Grand Finale" celebration

**Mobile Considerations:**
- Lighter confetti (fewer pieces)
- Smaller celebration overlay
- Share button uses native share API

---

## Data Architecture

### Google Sheets Structure

**Sheet 1: Bets (existing)**
- Timestamp, Name, all prediction fields, all wager fields

**Sheet 2: Results (new)**
- Milestone ID, Actual Value, Date Achieved, Is Revealed, Notes, Updated At

**Sheet 3: Trash Talk (new)**
- Timestamp, Name, Message, Target

**Sheet 4: Side Bets (new)**
- Challenge ID, Timestamp, Challenger, Opponent, Milestone, Challenger Prediction, Wager, Trash Talk, Status

**Sheet 5: Side Bet Responses (new)**
- Challenge ID, Timestamp, Responder, Counter Prediction, Counter Trash Talk

### Google Forms Needed

1. **Main Bet Form** (existing) - `/bet`
2. **Results Form** (new) - Admin only, writes to Results sheet
3. **Trash Talk Form** (new) - Public, writes to Trash Talk sheet
4. **Side Bet Challenge Form** (new) - Public, writes to Side Bets sheet
5. **Side Bet Response Form** (new) - Public, writes to Responses sheet

---

## File Structure (Proposed)

```
src/
├── components/
│   ├── AchievementBadge.jsx    # Sprint 3B
│   ├── BabyReaction.jsx        # Sprint 2A
│   ├── Celebration.jsx         # Sprint 5C
│   ├── ConfettiEffect.jsx      # Sprint 5C
│   ├── CountdownTimer.jsx      # Sprint 1A
│   ├── FloatingIcons.jsx       # (existing)
│   ├── Footer.jsx              # (existing)
│   ├── Header.jsx              # (existing)
│   ├── NurseryBackground.jsx   # Sprint 1B
│   ├── PixelBaby.jsx           # (existing)
│   ├── SoundToggle.jsx         # Sprint 2B
│   └── TauntBubble.jsx         # (existing)
├── hooks/
│   └── useSoundEffects.js      # Sprint 2B
├── pages/
│   ├── Admin.jsx               # Sprint 5A
│   ├── Bet.jsx                 # (existing)
│   ├── Home.jsx                # (existing)
│   ├── Leaderboard.jsx         # Sprint 3A
│   ├── Results.jsx             # Sprint 5B
│   ├── SideBets.jsx            # Sprint 4B
│   ├── TrashTalk.jsx           # Sprint 4A
│   └── ViewBets.jsx            # (existing)
├── utils/
│   ├── achievements.js         # Sprint 3B
│   ├── calculations.js         # (new - shared odds/scoring logic)
│   └── sounds.js               # Sprint 2B
├── assets/
│   └── sounds/
│       ├── coin.mp3
│       ├── chime.mp3
│       ├── pop.mp3
│       ├── fanfare.mp3
│       ├── buzz.mp3
│       └── blip.mp3
├── App.jsx
├── index.css
└── main.jsx
```

---

## Sprint Summary

| Sprint | Features | Est. Time | Dependencies | Status |
|--------|----------|-----------|--------------|--------|
| 1 | Countdown Timer, Nursery Background | 3-5 hrs | None | ✅ DONE |
| 2 | Baby Reactions, Sound Effects | 4-6 hrs | None | ✅ DONE |
| 3 | Leaderboard, Achievement Badges | 5-7 hrs | None | ✅ DONE |
| 4 | Trash Talk, Side Bets | 6-8 hrs | New Google Forms | ✅ DONE |
| 5 | Admin, Results Reveal, Celebrations | 9-12 hrs | New Google Form, All other features | 🔲 TODO |

**Total Estimated Time:** 27-38 hours

---

## Quick Reference: Google Form Field Mapping

When creating new Google Forms, use pre-filled link trick to get entry IDs:
1. Create form with all fields
2. Click "Get pre-filled link"
3. Fill in dummy values
4. Copy URL and extract `entry.XXXXXXX` IDs

---

## Notes

- All dates/times should use user's local timezone
- Consider adding loading skeletons for data fetches
- Test on mobile throughout development
- Keep accessibility in mind (alt text, keyboard nav)
- Pixel aesthetic should enhance, not hinder usability
