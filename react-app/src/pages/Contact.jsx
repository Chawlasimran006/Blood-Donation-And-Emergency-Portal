import React, { useState } from 'react'
import '../styles/Pages.css'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('') // 'success' or 'error'

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, message } = formData

    // Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setMsg('⚠️ Please fill all fields.')
      setMsgType('error')
      return
    }

    // Show success message
    setMsg('✅ Message sent successfully!')
    setMsgType('success')

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Clear message after 5 seconds
    setTimeout(() => {
      setMsg('')
      setMsgType('')
    }, 5000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear message when user starts typing again
    if (msg) {
      setMsg('')
      setMsgType('')
    }
  }

  return (
    <>
      {/* Navbar */}
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

      <div className="page-container">
      <div className="page-hero contact-us">
        <h1>Contact Us</h1>
        <p>We're here to help and answer any questions</p>
      </div>

      <div className="content-section">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>Have questions or need assistance? Reach out to us through any of the following channels:</p>

            <div className="contact-methods">
              <div className="contact-method">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <h3>Phone</h3>
                  <p>+91 1234567890</p>
                  <p>Mon-Sat, 9AM-6PM</p>
                </div>
              </div>

              <div className="contact-method">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <p>support@savelife.com</p>
                  <p>We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="contact-method">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h3>Address</h3>
                  <p>123 Healthcare Avenue</p>
                  <p>New Delhi, India - 110001</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>Send Us a Message</h2>
            
            {msg && (
              <div className={`message-alert ${msgType}`} style={{
                padding: '12px 20px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: '600',
                backgroundColor: msgType === 'success' ? '#d4edda' : '#f8d7da',
                color: msgType === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${msgType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <i className="fa-solid fa-paper-plane"></i> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Contact
