import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()
  const [showDriveModal, setShowDriveModal] = useState(false)
  const [drives, setDrives] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    date: '',
    time: '',
    expected: ''
  })

  useEffect(() => {
    // Load drives from localStorage
    // Mobile menu toggle
    const toggleBtn = document.getElementById('toggle-bnt')
    const menu = document.querySelector('.menu')
    
    const handleToggle = () => {
      menu?.classList.toggle('active')
    }

    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', handleToggle)
    }

    // Simple tooltip attribute removal (no DOM element removal)
    const removeTooltips = () => {
      const signupButtons = document.querySelectorAll('.signup, .login')
      signupButtons.forEach(btn => {
        btn.removeAttribute('title')
        btn.removeAttribute('data-tip')
        btn.removeAttribute('data-tooltip')
        btn.title = ''
      })
    }

    // Run once on load
    removeTooltips()
    setTimeout(removeTooltips, 100)

    loadDrives()

    return () => {
      if (toggleBtn && menu) {
        toggleBtn.removeEventListener('click', handleToggle)
      }
    }
  }, [])

  const loadDrives = () => {
    try {
      const savedDrives = JSON.parse(localStorage.getItem('drives') || '[]')
      setDrives(savedDrives)
    } catch (e) {
      setDrives([])
    }
  }

  const handleDriveFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDriveSubmit = (e) => {
    e.preventDefault()
    
    // Save to localStorage
    try {
      const savedDrives = JSON.parse(localStorage.getItem('drives') || '[]')
      savedDrives.unshift(formData)
      localStorage.setItem('drives', JSON.stringify(savedDrives))
      
      // Update state
      setDrives(savedDrives)
      
      // Show toast
      setToastMessage('Drive submitted successfully!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      
      // Close modal and reset form
      setShowDriveModal(false)
      setFormData({
        orgName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        date: '',
        time: '',
        expected: ''
      })
    } catch (e) {
      alert('Error saving drive. Please try again.')
    }
  }

  const handleCenterClick = () => {
    navigate('/find-center')
  }

  const handleDriveClick = () => {
    setShowDriveModal(true)
  }

  const handleQuizClick = () => {
    navigate('/eligibility-quiz')
  }

  const handleCloseModal = (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.hasAttribute('data-close') || e.target.closest('[data-close]')) {
      setShowDriveModal(false)
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

      <main>
        <div className="container">
          <div className="home">
            <h1>Donate Blood,<span className="homeh1">Save Lives</span></h1>
            <p>Every donation can save up to 3 lives. Join our community <br />of heroes and make a difference in your community<br /> today.</p>
            <button className="Donate" onClick={() => navigate('/donate')}>
              <a>Donate Now <i className="fa-solid fa-heart" style={{ color: 'rgb(255, 255, 255)' }}></i></a>
            </button>
            <button className="learn">
              <a>Learn More <i className="fa-solid fa-arrow-right-long" id="rigtharr"></i></a>
            </button>
          </div>
          <div className="images"></div>
        </div>

        <div className="quickaction">
          <div className="quickdata">
            <h1>Quick Action</h1>
            <p>Get started with these simple steps</p>
          </div>
          <div className="quickbox">
            <div className="location" id="center" onClick={handleCenterClick}>
              <i className="fa-solid fa-location-dot"></i>
              <h4>Find a Donation Center</h4>
              <p>Locate nearby blood donation centers</p>
            </div>
            <div className="location" id="drive" onClick={handleDriveClick}>
              <i className="fa-regular fa-user" style={{ color: 'rgb(22,162,73)' }}></i>
              <h4>Host a Blood Drive</h4>
              <p>Organize a drive in your community</p>
            </div>
            <div className="location" onClick={handleQuizClick}>
              <i className="fa-solid fa-calendar-check"></i>
              <h4>Eligibility Quiz</h4>
              <p>Check if you can donate blood</p>
            </div>
            <div className="location">
              <i className="fa-solid fa-calendar-week"></i>
              <h4>Schedule Appointment</h4>
              <p>Book your donation slot</p>
            </div>
          </div>
        </div>

        {/* Modal for Host a Blood Drive */}
        {showDriveModal && (
          <div id="drive-modal" className="modal" aria-hidden="false" onClick={handleCloseModal}>
            <div className="modal-overlay" data-close></div>
            <div className="modal-content" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" data-close>&times;</button>
              <div className="form-top">
                <div className="icon-circle"><i className="fa-solid fa-people-group"></i></div>
                <div>
                  <h2 className="small">Host a Blood Drive</h2>
                  <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Fill out the form below to organize a blood drive in your community</p>
                </div>
              </div>
              <form id="host-drive-form" onSubmit={handleDriveSubmit}>
                <label>Organization Name
                  <input type="text" name="orgName" value={formData.orgName} onChange={handleDriveFormChange} required placeholder="Your organization name" />
                </label>
                <label>Contact Person
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleDriveFormChange} placeholder="Contact person name" />
                </label>
                <div className="row">
                  <label>Email
                    <input type="email" name="email" value={formData.email} onChange={handleDriveFormChange} placeholder="email@example.com" />
                  </label>
                  <label>Phone Number
                    <input type="tel" name="phone" value={formData.phone} onChange={handleDriveFormChange} placeholder="1234567890" />
                  </label>
                </div>
                <label>Address
                  <input type="text" name="address" value={formData.address} onChange={handleDriveFormChange} placeholder="Street address" />
                </label>
                <div className="row">
                  <label>City
                    <input type="text" name="city" value={formData.city} onChange={handleDriveFormChange} placeholder="City name" />
                  </label>
                  <label>Date
                    <input type="date" name="date" value={formData.date} onChange={handleDriveFormChange} />
                  </label>
                </div>
                <div className="row">
                  <label>Time
                    <input type="time" name="time" value={formData.time} onChange={handleDriveFormChange} />
                  </label>
                  <label>Expected Number
                    <input type="number" name="expected" value={formData.expected} onChange={handleDriveFormChange} min="1" placeholder="Expected donors" />
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-outline" data-close onClick={() => setShowDriveModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast notification */}
        {showToast && (
          <div id="toast" className="toast" aria-live="polite">{toastMessage}</div>
        )}

        <div className="procedure">
          <h1>How It Works</h1>
          <p>Get started with these simple steps</p>
          <div className="pro1">
            <div className="proimg"></div>
          </div>
        </div>

        <section className="impact">
          <div className="impdata">
            <h1>Our Impact</h1>
            <p>Together, we're making a real difference in our community</p>
          </div>
          <div className="stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#d9534f' }}>
                ❤️
              </div>
              <div className="stat-number">3</div>
              <div className="stat-title">Lives Saved</div>
              <div className="stat-desc">per donation</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#28a745' }}>
                👥
              </div>
              <div className="stat-number">10,000+</div>
              <div className="stat-title">Active Donors</div>
              <div className="stat-desc">in our community</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#d9534f' }}>
                📅
              </div>
              <div className="stat-number">56</div>
              <div className="stat-title">Days</div>
              <div className="stat-desc">between donations</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#d9534f' }}>
                🏅
              </div>
              <div className="stat-number">95%</div>
              <div className="stat-title">Success Rate</div>
              <div className="stat-desc">patient recovery</div>
            </div>
          </div>
        </section>

        <section className="cta-section parallax-section" data-speed="0.2">
          <div className="cta-card">
            <h2>Ready to join our community of heroes?</h2>
            <p>Your donation could be the difference between life and death for someone in need.</p>
            <div className="cta-buttons">
              <a href="#" className="btn btn-primary">Donate Today</a>
              <a href="#" className="btn btn-outline">Learn More</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3 className="footer-logo"><span className="logo-icon">❤️</span> SaveLife</h3>
            <p>
              Connecting generous donors with those in need.
              Together, we save lives one donation at a time.
            </p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Why Donate</a></li>
              <li><a href="#">Find a Drive</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Donor Resources</h4>
            <ul>
              <li><a href="#">Eligibility Quiz</a></li>
              <li><a href="#">Donation Process</a></li>
              <li><a href="#">Health & Safety</a></li>
              <li><a href="#">After Donation</a></li>
              <li><a href="#">Donor Portal</a></li>
              <li><a href="#">Blood Types</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact Us</h4>
            <p><i className="fas fa-phone-alt"></i> 1-800-SAVELIFE</p>
            <p><i className="fas fa-envelope"></i> info@savelife.org</p>
            <p><i className="fas fa-map-marker-alt"></i>
              123 Healthcare Blvd<br />
              Medical District<br />
              City, State 12345
            </p>
          </div>
        </div>
        <hr />
        <p className="footer-bottom">© 2025 SaveLife. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Home
