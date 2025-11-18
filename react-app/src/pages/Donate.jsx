import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Donate.css'
import '../styles/Pages.css'

function Donate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    blood_group: '',
    age: '',
    gender: '',
    location: '',
    contact_number: ''
  })
  const [showThankYou, setShowThankYou] = useState(false)
  const [donorList, setDonorList] = useState([])

  // Load donors on mount
  useEffect(() => {
    displayDonors()

    // Mobile menu toggle
    const toggleBtn = document.getElementById('toggle-bnt')
    const menu = document.querySelector('.menu')
    
    const handleToggle = () => {
      menu?.classList.toggle('active')
    }

    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', handleToggle)
      return () => toggleBtn.removeEventListener('click', handleToggle)
    }
  }, [])

  const displayDonors = () => {
    const donors = JSON.parse(localStorage.getItem('donors')) || []
    // Show last 5 donors
    setDonorList(donors.slice(-5).reverse())
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { name, email, age, contact_number, blood_group } = formData

    // Validation
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert('Name should contain only letters.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Enter a valid email address.')
      return
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      alert('Age must be between 18 and 65.')
      return
    }

    if (!/^[0-9]{10}$/.test(contact_number)) {
      alert('Contact number must be 10 digits.')
      return
    }

    if (blood_group === '') {
      alert('Please select a blood group.')
      return
    }

    // Get existing donors
    let donors = JSON.parse(localStorage.getItem('donors')) || []
    donors.push(formData)
    localStorage.setItem('donors', JSON.stringify(donors))

    // Show thank you message
    setShowThankYou(true)

    // Reset form
    setFormData({
      name: '',
      email: '',
      blood_group: '',
      age: '',
      gender: '',
      location: '',
      contact_number: ''
    })

    // Update donor list
    displayDonors()

    // Hide thank you message after 5 seconds
    setTimeout(() => {
      setShowThankYou(false)
    }, 5000)
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logoimg">
            <i className="fa-solid fa-heart"></i>
          </span>
          <span className="logotxt">SaveLife</span>
        </div>
        <div className="menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/why-donate">Why Donate</Link></li>
            <li><Link to="/donate">Find a Drive</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="auth">
          <Link to="/login" className="login">Login</Link>
          <Link to="/signup" className="signup">Sign Up</Link>
          <i className="fas fa-bars" style={{ cursor: 'pointer' }} id="toggle-bnt"></i>
        </div>
      </nav>

      {/* Donate Now Form */}
      <section className="donate-section">
        <div className="donate-container">
          <h1>Donate Blood, Save Lives ❤️</h1>
          <p>Please fill out your details below to become a donor.</p>

          <form id="donateForm" action="#" method="POST" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="required">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="required">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="required">Blood Group</label>
              <select
                id="blood_group"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>

            <div className="form-group">
              <label className="required">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="18"
                max="65"
              />
            </div>

            <div className="form-group">
              <label className="required">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="required">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter your city/location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="required">Contact Number</label>
              <input
                type="tel"
                id="contact_number"
                name="contact_number"
                placeholder="Enter your mobile number"
                value={formData.contact_number}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <button type="submit" className="submit-btn">Submit & Become a Donor</button>
            </div>
          </form>

          <p
            id="thankYouMessage"
            style={{
              display: showThankYou ? 'block' : 'none',
              color: 'green',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            🎉 Thank you for your donation!
          </p>

          {/* NEW SECTION for DOM Manipulation */}
          <h2 style={{ marginTop: '30px' }}>Registered Donors</h2>
          <div id="donorList" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {donorList.map((donor, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '10px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '16px', color: '#333' }}>{donor.name}</strong>
                  <span
                    style={{
                      backgroundColor: '#d32f2f',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    {donor.blood_group}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '6px' }}>
                  <div>📧 {donor.email}</div>
                  <div>📍 {donor.location}</div>
                  <div>📞 {donor.contact_number}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Donate
