// Chatbot functionality with Gemini API integration
(function() {
  'use strict';

  // Configuration - Replace with your actual Gemini API key
  const GEMINI_API_KEY = 'AIzaSyDdO1TRkfdOc1FtTgYhoJNYXqkJzNzq7v8'; // Get from https://makersuite.google.com/app/apikey
   const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  // DOM Elements
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');

  let isOpen = false;
  let conversationHistory = [];

  // Initialize
  function init() {
    if (!chatbotToggle || !chatbotWindow) return;

    // Event listeners
    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', closeChatbot);
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Initialize conversation with context about SaveLife
    conversationHistory = [{
      role: 'user',
      parts: [{ text: 'You are a helpful assistant for SaveLife, a blood donation platform. Help users with questions about blood donation, eligibility, finding drives, hosting drives, and general information. Be friendly and informative.' }]
    }, {
      role: 'model',
      parts: [{ text: 'Hello! I\'m your SaveLife assistant. I\'m here to help you with blood donation information, finding drives, eligibility questions, and more. How can I assist you today?' }]
    }];
  }

  // Toggle chatbot window
  function toggleChatbot() {
    if (isOpen) {
      closeChatbot();
    } else {
      openChatbot();
    }
  }

  // Open chatbot
  function openChatbot() {
    chatbotWindow.classList.remove('chatbot-hidden');
    chatbotToggle.style.display = 'none';
    isOpen = true;
    chatbotInput.focus();
  }

  // Close chatbot
  function closeChatbot() {
    chatbotWindow.classList.add('chatbot-hidden');
    chatbotToggle.style.display = 'flex';
    isOpen = false;
  }

  // Add message to chat
  function addMessage(content, isUser = false, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}${isError ? ' error-message' : ''}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Send message to Gemini API
  async function sendToGemini(userMessage) {
    // Add user message to conversation history
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: conversationHistory,
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
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const botResponse = data.candidates[0].content.parts[0].text;
        
        // Add bot response to conversation history
        conversationHistory.push({
          role: 'model',
          parts: [{ text: botResponse }]
        });
        
        return botResponse;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  // Send message handler
  async function sendMessage() {
    const message = chatbotInput.value.trim();
    
    if (!message) return;

    // Check if API key is configured
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      addMessage('Please configure your Gemini API key in chatbot.js. Get your free API key at https://makersuite.google.com/app/apikey', false, true);
      return;
    }

    // Add user message to chat
    addMessage(message, true);
    chatbotInput.value = '';
    
    // Disable input while processing
    chatbotInput.disabled = true;
    chatbotSend.disabled = true;
    
    // Show typing indicator
    showTypingIndicator();

    try {
      // Send to Gemini API
      const response = await sendToGemini(message);
      
      // Remove typing indicator
      removeTypingIndicator();
      
      // Add bot response to chat
      addMessage(response);
    } catch (error) {
      // Remove typing indicator
      removeTypingIndicator();
      
      // Show error message
      addMessage('Sorry, I encountered an error. Please check your API key and try again. Error: ' + error.message, false, true);
    } finally {
      // Re-enable input
      chatbotInput.disabled = false;
      chatbotSend.disabled = false;
      chatbotInput.focus();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
