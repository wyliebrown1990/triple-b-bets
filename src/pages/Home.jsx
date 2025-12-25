import { Link } from 'react-router-dom'
import PixelBaby from '../components/PixelBaby'

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sage/20 to-cream py-16 px-4">
        <div className="max-w-4xl mx-auto text-center hero-section">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-brown mb-4">
            Triple B Bets
          </h1>
          <p className="text-xl text-brown/80 mb-2">
            The Official Betting Pool for
          </p>
          <p className="font-display text-3xl md:text-4xl text-sage-dark font-semibold mb-8">
            He Who Shall Not Be Named
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto mb-8">
            <div className="pixel-baby-spin-wrapper">
              <PixelBaby />
            </div>
            <p className="text-gray-600 mb-2 mt-4">Born November 2024</p>
            <p className="text-gray-600">Proud parents: Jason & Lizzie</p>
          </div>

          <div className="scary-button-container relative inline-block group">
            <Link
              to="/bet"
              className="bet-button inline-block bg-gold hover:bg-gold-dark text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Place Your Bets!
            </Link>
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:animate-pulse">
              <div className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-xl transform rotate-[-3deg] border-2 border-red-800">
                IF YOU DARE!!
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-600"></div>
              </div>
            </div>
          </div>

          <style>{`
            .bet-button:hover ~ .pixel-baby-spin-wrapper,
            .scary-button-container:hover ~ .pixel-baby-spin-wrapper {
              animation: none;
            }
            .hero-section:has(.bet-button:hover) .pixel-baby-spin-wrapper {
              animation: spin360 0.6s ease-in-out;
            }
            @keyframes spin360 {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-brown text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="font-bold text-lg text-brown mb-2">Make Your Predictions</h3>
              <p className="text-gray-600">Guess when He Who Shall Not Be Named will hit his milestones - first steps, first words, and more!</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="font-bold text-lg text-brown mb-2">Lock It In</h3>
              <p className="text-gray-600">Once you submit, your bets are final. No take-backs allowed!</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="font-bold text-lg text-brown mb-2">Watch & Wait</h3>
              <p className="text-gray-600">Follow along as He Who Shall Not Be Named grows and see who predicted correctly!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Preview */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-brown text-center mb-8">
            What You're Betting On
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '🚶', title: 'First Walk', desc: 'How old will He Who Shall Not Be Named be?' },
              { emoji: '🗣️', title: 'First Word', desc: 'What word and when?' },
              { emoji: '🐛', title: 'First Crawl', desc: 'When will he start moving?' },
              { emoji: '🚴', title: 'First Bike Ride', desc: 'When will he pedal?' },
              { emoji: '🦷', title: 'First Tooth', desc: 'When will it appear?' },
              { emoji: '🍎', title: 'First Solid Food', desc: 'What will he eat first?' },
              { emoji: '📏', title: 'Height at Age 1', desc: 'How tall will he be?' },
              { emoji: '⚖️', title: 'Weight at Age 1', desc: 'How much will he weigh?' },
              { emoji: '😴', title: 'Sleep Through Night', desc: 'When will he finally sleep?' },
            ].map((item, i) => (
              <div key={i} className="bg-sage/10 rounded-lg p-4 flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-brown">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/bet"
              className="inline-block bg-sage hover:bg-sage-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              Submit Your Predictions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
