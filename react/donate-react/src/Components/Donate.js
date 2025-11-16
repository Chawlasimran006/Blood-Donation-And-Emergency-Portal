import React, { useState } from "react";
import "../donate.css";
import Navbar from "./Navbar";

const Donate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    age: "",
    gender: "",
    location: "",
    contact: "",
  });
  const [thankYou, setThankYou] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add donor to localStorage (temporary database)
    const allDonors = JSON.parse(localStorage.getItem("donors")) || [];
    const newDonors = [...allDonors, formData];
    localStorage.setItem("donors", JSON.stringify(newDonors));

    setThankYou(true);
    setFormData({
      name: "",
      email: "",
      bloodGroup: "",
      age: "",
      gender: "",
      location: "",
      contact: "",
    });
  };

  return (
    <>
      <Navbar />
      <section className="donate-section">
        <div className="donate-container">
          <h1>Donate Blood, Save Lives ❤️</h1>
          <p>Please fill out your details below to become a donor.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="required">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="required">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="required">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
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
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                required
                min="18"
                max="65"
              />
            </div>

            <div className="form-group">
              <label className="required">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
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
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your city/location"
                required
              />
            </div>

            <div className="form-group">
              <label className="required">Contact Number</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit & Become a Donor
            </button>
          </form>

          {thankYou && (
            <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
              🎉 Thank you for your donation!
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Donate;
