import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/EligibilityQuiz.css'

function EligibilityQuiz() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [isEligible, setIsEligible] = useState(false)

  const questions = [
    {
      id: 'age',
      question: 'Are you between 18 and 65 years old?',
      type: 'yesno',
      required: true
    },
    {
      id: 'weight',
      question: 'Do you weigh at least 50 kg (110 lbs)?',
      type: 'yesno',
      required: true
    },
    {
      id: 'health',
      question: 'Are you in good general health?',
      type: 'yesno',
      required: true
    },
    {
      id: 'fever',
      question: 'Have you had a fever, cold, or flu symptoms in the past 2 weeks?',
      type: 'yesno',
      invert: true
    },
    {
      id: 'medication',
      question: 'Are you currently taking antibiotics or any medication that affects blood clotting?',
      type: 'yesno',
      invert: true
    },
    {
      id: 'surgery',
      question: 'Have you had any surgery, dental work, or tattoos in the past 6 months?',
      type: 'yesno',
      invert: true
    },
    {
      id: 'pregnancy',
      question: 'Are you currently pregnant or breastfeeding?',
      type: 'yesno',
      invert: true
    },
    {
      id: 'donated',
      question: 'Have you donated blood in the past 8 weeks (56 days)?',
      type: 'yesno',
      invert: true
    },
    {
      id: 'travel',
      question: 'Have you traveled to a malaria-endemic area in the past 3 years?',
      type: 'yesno',
      invert: true
    },
    {
      id: 'alcohol',
      question: 'Have you consumed alcohol in the past 24 hours?',
      type: 'yesno',
      invert: true
    }
  ]

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate eligibility
      checkEligibility(newAnswers)
    }
  }

  const checkEligibility = (finalAnswers) => {
    let eligible = true

    questions.forEach(question => {
      const answer = finalAnswers[question.id]
      if (question.required && answer !== 'yes') {
        eligible = false
      }
      if (question.invert && answer === 'yes') {
        eligible = false
      }
    })

    setIsEligible(eligible)
    setShowResult(true)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setIsEligible(false)
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showResult) {
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
          <div className="quiz-result">
            <div className="result-card">
              <div className={`result-icon ${isEligible ? 'eligible' : 'not-eligible'}`}>
                <i className={`fa-solid ${isEligible ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              </div>
              <h2>{isEligible ? 'You are eligible to donate blood!' : 'You may not be eligible at this time'}</h2>
              
              {isEligible ? (
                <div className="eligible-content">
                  <p>Great news! Based on your responses, you appear to meet the basic eligibility criteria for blood donation.</p>
                  <div className="next-steps">
                    <h3>Next Steps:</h3>
                    <ul>
                      <li>Find a nearby donation center</li>
                      <li>Schedule an appointment</li>
                      <li>Bring a valid ID</li>
                      <li>Eat a healthy meal before donating</li>
                      <li>Stay hydrated</li>
                    </ul>
                  </div>
                  <div className="result-actions">
                    <button className="btn-primary" onClick={() => navigate('/find-center')}>
                      Find Donation Center
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/donate')}>
                      View Blood Drives
                    </button>
                  </div>
                </div>
              ) : (
                <div className="not-eligible-content">
                  <p>Based on your responses, you may not be eligible to donate at this time. This is for your safety and the safety of blood recipients.</p>
                  <div className="recommendations">
                    <h3>Recommendations:</h3>
                    <ul>
                      <li>Consult with a healthcare provider if you have health concerns</li>
                      <li>Wait the recommended time period if you've recently donated</li>
                      <li>Consider retaking the quiz after addressing any temporary issues</li>
                      <li>You can still support the cause by encouraging others to donate</li>
                    </ul>
                  </div>
                  <div className="result-actions">
                    <button className="btn-secondary" onClick={restartQuiz}>
                      Retake Quiz
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/why-donate')}>
                      Learn More
                    </button>
                  </div>
                </div>
              )}
              
              <div className="disclaimer">
                <p><strong>Important:</strong> This quiz provides preliminary guidance only. Final eligibility will be determined by medical professionals at the donation site through a more comprehensive screening process.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
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
        <div className="page-hero">
          <h1>Blood Donation Eligibility Quiz</h1>
          <p>Answer a few quick questions to check if you're eligible to donate blood</p>
        </div>

        <div className="quiz-container">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <div className="quiz-card">
            <h2>{questions[currentQuestion].question}</h2>
            
            <div className="quiz-options">
              <button 
                className="quiz-btn yes-btn" 
                onClick={() => handleAnswer('yes')}
              >
                <i className="fa-solid fa-check"></i>
                Yes
              </button>
              <button 
                className="quiz-btn no-btn" 
                onClick={() => handleAnswer('no')}
              >
                <i className="fa-solid fa-times"></i>
                No
              </button>
            </div>

            <div className="quiz-navigation">
              {currentQuestion > 0 && (
                <button className="nav-btn back-btn" onClick={goBack}>
                  <i className="fa-solid fa-arrow-left"></i>
                  Back
                </button>
              )}
              <button className="nav-btn home-btn" onClick={() => navigate('/')}>
                <i className="fa-solid fa-home"></i>
                Home
              </button>
            </div>
          </div>

          <div className="quiz-info">
            <h3>Why These Questions Matter</h3>
            <p>These questions help ensure the safety of both donors and recipients. Blood donation eligibility criteria are based on medical guidelines to protect everyone involved in the donation process.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default EligibilityQuiz
