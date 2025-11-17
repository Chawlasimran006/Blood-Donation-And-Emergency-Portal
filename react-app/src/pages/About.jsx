import { Link } from 'react-router-dom'

function About() {
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
          <button className="login"><Link to="/login">Login</Link></button>
          <button className="signup"><Link to="/signup">Sign Up</Link></button>
          <i className="fas fa-bars" style={{ cursor: 'pointer' }} id="toggle-bnt"></i>
        </div>
      </nav>

      <div className="page-container">
      <div className="page-hero">
        <h1>About SaveLife</h1>
        <p>Connecting donors with those in need</p>
      </div>

      <div className="content-section">
        <div className="about-intro">
          <h2>Our Mission</h2>
          <p>SaveLife is dedicated to bridging the gap between blood donors and recipients. We aim to make blood donation accessible, efficient, and impactful by providing a platform that connects willing donors with hospitals and blood banks in need.</p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <i className="fa-solid fa-bullseye"></i>
            <h3>Our Vision</h3>
            <p>A world where no life is lost due to blood shortage. We envision a community of active donors ready to help 24/7.</p>
          </div>

          <div className="value-card">
            <i className="fa-solid fa-handshake"></i>
            <h3>Our Commitment</h3>
            <p>We are committed to maintaining the highest standards of safety, privacy, and efficiency in blood donation services.</p>
          </div>

          <div className="value-card">
            <i className="fa-solid fa-globe"></i>
            <h3>Our Reach</h3>
            <p>Connecting over 500+ blood centers nationwide with thousands of voluntary donors across the country.</p>
          </div>
        </div>

        <div className="team-section">
          <h2>What We Do</h2>
          <ul className="features-list">
            <li><i className="fa-solid fa-check"></i> Connect donors with nearby blood banks</li>
            <li><i className="fa-solid fa-check"></i> Provide real-time blood availability information</li>
            <li><i className="fa-solid fa-check"></i> Organize blood donation drives</li>
            <li><i className="fa-solid fa-check"></i> Educate about blood donation benefits</li>
            <li><i className="fa-solid fa-check"></i> Maintain donor database for emergencies</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  )
}

export default About
