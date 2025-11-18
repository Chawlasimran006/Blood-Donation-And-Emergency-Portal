import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/authService'
import '../styles/Auth.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authService.login(email, password)
      onLogin(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <div className="brand">
            <div className="logo">
              <i className="fa-solid fa-heart"></i>
            </div>
            <div>SaveLife</div>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your donor dashboard and manage blood drives.</p>
        </div>
        <div className="auth-right">
          <div className="form-title">Sign in to your account</div>
          <div className="form-sub">Enter your details below to continue</div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field input-with-icon">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="icon" onClick={() => setShowPassword(!showPassword)}>
                <i className={`fa-regular fa-eye${showPassword ? '-slash' : ''}`}></i>
              </span>
            </div>
            <div className="field">
              <button className="btn" type="submit" disabled={loading}>
                <i className="fa-solid fa-sign-in-alt" style={{ marginRight: '8px' }}></i>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="foot">
            <div className="small">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
