import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingIcons from './components/FloatingIcons'
import Home from './pages/Home'
import Bet from './pages/Bet'
import ViewBets from './pages/ViewBets'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        <FloatingIcons />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bet" element={<Bet />} />
          <Route path="/bets" element={<ViewBets />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
