import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">👶</span>
          <span className="font-display text-xl font-bold text-brown">Triple B Bets</span>
        </Link>

        <div className="flex gap-6">
          <Link
            to="/"
            className={`font-medium transition-colors ${isActive('/') ? 'text-sage-dark' : 'text-gray-600 hover:text-sage'}`}
          >
            Home
          </Link>
          <Link
            to="/bet"
            className={`font-medium transition-colors ${isActive('/bet') ? 'text-sage-dark' : 'text-gray-600 hover:text-sage'}`}
          >
            Place Bet
          </Link>
          <Link
            to="/bets"
            className={`font-medium transition-colors ${isActive('/bets') ? 'text-sage-dark' : 'text-gray-600 hover:text-sage'}`}
          >
            View Bets
          </Link>
        </div>
      </nav>
    </header>
  )
}
