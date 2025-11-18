import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import authService from './services/authService'
import './App.css'
import './styles/Pages.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
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
        <Routes>
          <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
          <Route path="/why-donate" element={<WhyDonate user={user} onLogout={handleLogout} />} />
          <Route path="/donate" element={<Donate user={user} onLogout={handleLogout} />} />
          <Route path="/find-center" element={<FindCenter user={user} onLogout={handleLogout} />} />
          <Route path="/about" element={<About user={user} onLogout={handleLogout} />} />
          <Route path="/faqs" element={<FAQs user={user} onLogout={handleLogout} />} />
          <Route path="/contact" element={<Contact user={user} onLogout={handleLogout} />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup onLogin={handleLogin} /> : <Navigate to="/" />} />
        </Routes>
        <Chatbot />
      </div>
    </BrowserRouter>
  )
}

export default App
