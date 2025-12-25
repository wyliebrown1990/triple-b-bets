import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import NurseryBackground from './components/NurseryBackground'
import Home from './pages/Home'
import Bet from './pages/Bet'
import ViewBets from './pages/ViewBets'
import Leaderboard from './pages/Leaderboard'
import TrashTalk from './pages/TrashTalk'
import SideBets from './pages/SideBets'
import Admin from './pages/Admin'
import Results from './pages/Results'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        <NurseryBackground />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bet" element={<Bet />} />
          <Route path="/bets" element={<ViewBets />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/trash-talk" element={<TrashTalk />} />
          <Route path="/side-bets" element={<SideBets />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/results" element={<Results />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
