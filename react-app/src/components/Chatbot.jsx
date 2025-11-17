import { useState, useRef, useEffect } from 'react'

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef(null)

  const GEMINI_API_KEY = 'AIzaSyDdO1TRkfdOc1FtTgYhoJNYXqkJzNzq7v8'
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

  // Conversation history for Gemini API
  const conversationHistoryRef = useRef([
    {
      role: 'user',
      parts: [{ text: 'You are a helpful assistant for SaveLife, a blood donation platform. Help users with questions about blood donation, eligibility, finding drives, hosting drives, and general information. Be friendly and informative.' }]
    },
    {
      role: 'model',
      parts: [{ text: "Hello! I'm your SaveLife assistant. I'm here to help you with blood donation information, finding drives, eligibility questions, and more. How can I assist you today?" }]
    }
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
  }

  const sendToGemini = async (userMessage) => {
    // Add user message to conversation history
    conversationHistoryRef.current.push({
      role: 'user',
      parts: [{ text: userMessage }]
    })

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: conversationHistoryRef.current,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const botResponse = data.candidates[0].content.parts[0].text

        // Add bot response to conversation history
        conversationHistoryRef.current.push({
          role: 'model',
          parts: [{ text: botResponse }]
        })

        return botResponse
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (error) {
      console.error('Gemini API Error:', error)
      throw error
    }
  }

  const handleSendMessage = async () => {
    const message = inputValue.trim()

    if (!message) return

    // Check if API key is configured
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      setMessages(prev => [...prev, {
        content: 'Please configure your Gemini API key in Chatbot.jsx. Get your free API key at https://makersuite.google.com/app/apikey',
        isUser: false,
        isError: true
      }])
      return
    }

    // Add user message
    setMessages(prev => [...prev, { content: message, isUser: true }])
    setInputValue('')
    setIsProcessing(true)
    setIsTyping(true)

    try {
      // Send to Gemini API
      const response = await sendToGemini(message)

      // Remove typing indicator and add bot response
      setIsTyping(false)
      setMessages(prev => [...prev, { content: response, isUser: false }])
    } catch (error) {
      // Remove typing indicator and show error
      setIsTyping(false)
      setMessages(prev => [...prev, {
        content: `Sorry, I encountered an error. Please check your API key and try again. Error: ${error.message}`,
        isUser: false,
        isError: true
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button 
          className="chatbot-toggle" 
          id="chatbot-toggle"
          onClick={toggleChatbot}
          aria-label="Open chatbot"
        >
          <i className="fa-solid fa-comment-dots" style={{ color: '#ffffff' }}></i>
        </button>
      )}

      {/* Chatbot Window */}
      <div className={`chatbot-window ${isOpen ? '' : 'chatbot-hidden'}`} id="chatbot-window">
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <i className="fa-solid fa-robot"></i>
            <div>
              <h3>SaveLife Assistant</h3>
              <span className="chatbot-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <button 
            className="chatbot-close" 
            id="chatbot-close"
            onClick={toggleChatbot}
            aria-label="Close chatbot"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="chatbot-messages" id="chatbot-messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.isUser ? 'user-message' : 'bot-message'}${msg.isError ? ' error-message' : ''}`}
            >
              <div className="message-avatar">
                <i className={`fa-solid ${msg.isUser ? 'fa-user' : 'fa-robot'}`}></i>
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator" id="typing-indicator">
              <div className="message-avatar">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-container">
          <input
            type="text"
            className="chatbot-input"
            id="chatbot-input"
            placeholder="Ask me anything about blood donation..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
          />
          <button 
            className="chatbot-send" 
            id="chatbot-send"
            onClick={handleSendMessage}
            disabled={isProcessing}
            aria-label="Send message"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  )
}

export default Chatbot
