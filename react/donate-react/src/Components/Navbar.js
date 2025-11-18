import React from "react";
import "../donate.css"; // Navbar styling CSS bhi yahi use ho sakta hai
import { FaHeart, FaBars } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logoimg">
          <FaHeart />
        </span>
        <span className="logotxt">SaveLife</span>
      </div>

      <div className="menu">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/why-donate">Why Donate</a></li>
          <li><a href="/donate">Find a Drive</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/faqs">FAQs</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div className="auth">
  <button className="login" onClick={() => window.location.href='/login'}>Login</button>
  <button className="signup" onClick={() => window.location.href='/signup'}>Sign Up</button>
        <FaBars style={{cursor:"pointer"}} id="toggle-bnt" />
      </div>
    </nav>
  );
};

export default Navbar;
