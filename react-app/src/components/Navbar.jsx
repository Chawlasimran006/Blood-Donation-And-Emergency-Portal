import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar({ user, onLogout }) {
  return (
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
          <li><Link to="/donate">Donate Blood</Link></li>
          <li><Link to="/find-center">Find a Center</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/faqs">FAQs</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
      <div className="auth">
        {user ? (
          <>
            <span className="welcome">Welcome, {user.name}</span>
            <button className="logout" onClick={onLogout}>
              <i className="fa-solid fa-sign-out-alt"></i> Logout
            </button>
          </>
        ) : (
          <>
            <button className="login">
              <Link to="/login">Login</Link>
            </button>
            <button className="signup">
              <Link to="/signup">Sign Up</Link>
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
