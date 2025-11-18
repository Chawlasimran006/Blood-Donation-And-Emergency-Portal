import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

const authService = {
  async signup(name, email, password) {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password })
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userName', response.data.user.name)
      localStorage.setItem('userEmail', response.data.user.email)
    }
    return response.data
  },

  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, { email, password })
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userName', response.data.user.name)
      localStorage.setItem('userEmail', response.data.user.email)
    }
    return response.data
  },

  async verifyToken(token) {
    const response = await axios.get(`${API_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
  }
}

export default authService
