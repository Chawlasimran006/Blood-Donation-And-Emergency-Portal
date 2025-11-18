import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Pages.css'

function FAQs() {
  const navigate = useNavigate()
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Who can donate blood?",
      answer: "Anyone between 18-65 years of age, weighing at least 50kg, and in good health can donate blood. You should not have donated blood in the last 3 months."
    },
    {
      question: "How often can I donate blood?",
      answer: "Males can donate every 3 months, and females can donate every 4 months. This allows your body enough time to replenish the donated blood."
    },
    {
      question: "How much blood is taken during donation?",
      answer: "Approximately 350ml (one unit) of blood is collected during each donation. This is less than 10% of your total blood volume."
    },
    {
      question: "Is blood donation safe?",
      answer: "Yes, blood donation is completely safe. All equipment used is sterile and disposable. You cannot contract any disease by donating blood."
    },
    {
      question: "How long does the donation process take?",
      answer: "The actual donation takes about 10-15 minutes. The entire process, including registration and post-donation refreshments, takes about 45 minutes."
    },
    {
      question: "What should I do before donating blood?",
      answer: "Drink plenty of water, eat a healthy meal 2-3 hours before donation, avoid fatty foods, and get a good night's sleep."
    },
    {
      question: "What should I do after donating blood?",
      answer: "Rest for 10-15 minutes, drink plenty of fluids, avoid heavy lifting for a few hours, and eat iron-rich foods to help replenish your blood."
    },
    {
      question: "Can I donate if I have tattoos or piercings?",
      answer: "You can donate 6-12 months after getting a tattoo or piercing, depending on the sterility conditions. This waiting period helps ensure blood safety."
    },
    {
      question: "Will I feel weak after donating blood?",
      answer: "Most donors feel fine after donation. Some may experience slight dizziness, which usually passes quickly. Drink fluids and rest if needed."
    },
    {
      question: "Can I donate blood during menstruation?",
      answer: "Yes, you can donate during menstruation if you feel well and meet the hemoglobin requirements. However, if you experience heavy flow or discomfort, it's better to wait."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
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
      <div className="page-hero faqs">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about blood donation</p>
      </div>

      <div className="content-section">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <i className={`fa-solid fa-chevron-${openIndex === index ? 'up' : 'down'}`}></i>
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h2>Still Have Questions?</h2>
          <p>If you couldn't find the answer you were looking for, feel free to contact us.</p>
          <button className="contact-btn">
            <i className="fa-solid fa-envelope"></i> Contact Support
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default FAQs
