# SaveLife Chatbot - Setup Guide

## Overview
The SaveLife chatbot is a floating AI assistant powered by Google's Gemini API that helps users with blood donation questions, eligibility, finding drives, and general information.

## Features
- ✅ Fixed position at bottom-right corner
- ✅ Clean, modern UI with animations
- ✅ Conversation history maintained during session
- ✅ Typing indicators
- ✅ Error handling
- ✅ Mobile responsive
- ✅ Powered by Google Gemini AI

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key

### 2. Configure the Chatbot

1. Open `chatbot.js` in your text editor
2. Find this line near the top:
   ```javascript
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   ```
3. Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual API key:
   ```javascript
   const GEMINI_API_KEY = 'AIzaSyD...your-key-here';
   ```
4. Save the file

### 3. Test the Chatbot

1. Open `donation.html` in your browser
2. Look for the red chat button in the bottom-right corner
3. Click it to open the chat window
4. Type a message like "What are the requirements to donate blood?"
5. Press Enter or click the send button

## Files Added

- `chatbot.css` - Styles for the chatbot widget
- `chatbot.js` - JavaScript logic and Gemini API integration
- `CHATBOT_SETUP.md` - This setup guide

## Modified Files

- `donation.html` - Added chatbot widget HTML and script references

## Usage Tips

### Sample Questions to Ask:
- "Who can donate blood?"
- "How do I find a blood drive near me?"
- "What should I do before donating?"
- "How often can I donate blood?"
- "What are the benefits of blood donation?"
- "How do I host a blood drive?"

### Customization

#### Change Chatbot Colors
Edit `chatbot.css` and update these gradient colors:
```css
background: linear-gradient(135deg, #d62828 0%, #b91c1c 100%);
```

#### Modify Initial Context
In `chatbot.js`, edit the initial conversation history to change the bot's personality or knowledge base.

#### Adjust Position
In `chatbot.css`, modify:
```css
#chatbot-container {
  bottom: 20px;  /* Distance from bottom */
  right: 20px;   /* Distance from right */
}
```

## Troubleshooting

### Chatbot says "Please configure your Gemini API key"
- You haven't replaced `YOUR_GEMINI_API_KEY_HERE` with your actual API key
- Make sure to save `chatbot.js` after editing

### Error: "API request failed: 400"
- Your API key may be invalid
- Check that you copied the entire key without extra spaces

### Error: "API request failed: 429"
- You've exceeded the free tier quota
- Wait a few minutes or upgrade your plan

### Chatbot button not appearing
- Check browser console for JavaScript errors
- Ensure all files are in the same directory
- Verify `chatbot.css` and `chatbot.js` are loaded

## API Limits (Free Tier)

- **60 requests per minute**
- **1,500 requests per day**
- This is sufficient for most small to medium websites

## Security Notes

⚠️ **Important**: For production use:
- Store API keys server-side, not in client JavaScript
- Implement rate limiting
- Add user authentication
- Use environment variables
- Consider using a backend proxy to hide your API key

For this demo/development version, the API key is in the client code for simplicity.

## Next Steps

Want to enhance the chatbot? Consider:
1. Add pre-defined quick reply buttons
2. Store conversation history in localStorage
3. Add voice input/output
4. Integrate with your backend to access real drive data
5. Add file/image upload for medical questions
6. Implement user authentication to personalize responses

## Support

For issues or questions:
- Check the browser console for errors
- Verify your API key is active at [Google AI Studio](https://makersuite.google.com/)
- Review the [Gemini API documentation](https://ai.google.dev/docs)

---

**Created for SaveLife Blood Donation Platform**
