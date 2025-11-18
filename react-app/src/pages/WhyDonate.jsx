import { Link, useNavigate } from 'react-router-dom'
import '../styles/Pages.css'

function WhyDonate() {
  const navigate = useNavigate()
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
      <div className="page-hero why-donate">
        <h1>Why Donate Blood?</h1>
        <p>One donation can save up to three lives</p>
      </div>

      <div className="content-section">
        <h2>The Importance of Blood Donation</h2>
        <p>Blood donation is a simple act that can make a huge difference. Every two seconds, someone needs blood, and your donation can help save lives in emergencies, surgeries, cancer treatment, and chronic illnesses.</p>

        <div className="benefits-grid">
          <div className="benefit-card">
            <i className="fa-solid fa-heart-pulse"></i>
            <h3>Health Benefits</h3>
            <ul>
              <li>Reduces risk of heart disease</li>
              <li>Free health screening</li>
              <li>Burns calories</li>
              <li>Stimulates blood cell production</li>
            </ul>
          </div>

          <div className="benefit-card">
            <i className="fa-solid fa-users"></i>
            <h3>Help Others</h3>
            <ul>
              <li>Save up to 3 lives per donation</li>
              <li>Support accident victims</li>
              <li>Help cancer patients</li>
              <li>Assist surgical patients</li>
            </ul>
          </div>

          <div className="benefit-card">
            <i className="fa-solid fa-award"></i>
            <h3>Feel Good</h3>
            <ul>
              <li>Sense of satisfaction</li>
              <li>Community contribution</li>
              <li>Donor recognition</li>
              <li>Join noble cause</li>
            </ul>
          </div>
        </div>

        <h2>Who Can Donate?</h2>
        <div className="eligibility-section">
          <div className="eligible">
            <h3>You Can Donate If:</h3>
            <ul>
              <li>Age between 18-65 years</li>
              <li>Weight at least 50 kg</li>
              <li>Healthy and feeling well</li>
              <li>Hemoglobin level adequate</li>
            </ul>
          </div>
          <div className="not-eligible">
            <h3>Temporary Deferral:</h3>
            <ul>
              <li>Recent illness or surgery</li>
              <li>Pregnant or breastfeeding</li>
              <li>On certain medications</li>
              <li>Recent vaccination</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default WhyDonate
