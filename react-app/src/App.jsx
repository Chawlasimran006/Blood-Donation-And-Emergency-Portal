import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import Home from './pages/Home'
import WhyDonate from './pages/WhyDonate'
import Donate from './pages/Donate'
import FindCenter from './pages/FindCenter'
import About from './pages/About'
import FAQs from './pages/FAQs'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EligibilityQuiz from './pages/EligibilityQuiz'
import authService from './services/authService'
import './App.css'
import './styles/Pages.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  // debug helper available from devtools: testNavigate('/login') -> will navigate to path
  window.testNavigate = (path) => { window.location.href = path }
  // debug: report the top element at a coordinate (x,y)
  window.elementAt = (x = 50, y = 20) => document.elementFromPoint(x, y)
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const userData = await authService.verifyToken(token)
        setUser(userData.user)
      } catch (error) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userName')
        localStorage.removeItem('userEmail')
      }
    }
    setLoading(false)
  }

  const handleLogin = (userData) => {
    setUser(userData.user)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    setUser(null)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <BrowserRouter>
      <div className="App">
  <DebugBar />
        <Routes>
          <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
          <Route path="/why-donate" element={<WhyDonate user={user} onLogout={handleLogout} />} />
          <Route path="/donate" element={<Donate user={user} onLogout={handleLogout} />} />
          <Route path="/find-center" element={<FindCenter user={user} onLogout={handleLogout} />} />
          <Route path="/about" element={<About user={user} onLogout={handleLogout} />} />
          <Route path="/faqs" element={<FAQs user={user} onLogout={handleLogout} />} />
          <Route path="/contact" element={<Contact user={user} onLogout={handleLogout} />} />
          <Route path="/eligibility-quiz" element={<EligibilityQuiz user={user} onLogout={handleLogout} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        </Routes>
        <Chatbot />
      </div>
    </BrowserRouter>
  )
}

function DebugBar() {
  const location = useLocation()
  const [lastClicked, setLastClicked] = useState('(none)')

  useEffect(() => {
    const handler = (e) => {
      const el = e.target
      setLastClicked(el && el.className ? el.className : el.tagName)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <div style={{position: 'fixed', top: 8, right: 8, zIndex: 99999, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 10px', borderRadius: 6, fontSize: 12}}>
      <div><strong>Path:</strong> {location.pathname}</div>
      <div><strong>Last Click:</strong> {lastClicked}</div>
    </div>
  )
}

export default App
