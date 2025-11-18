# Blood Donation Portal - How to Run

## ✅ Quick Start (EASIEST METHOD)

### Option 1: Using the Startup Script
1. Double-click `START-SERVERS.bat` in the main folder
2. Wait for both servers to start (about 10-15 seconds)
3. Open http://localhost:3002 in your browser
4. Both backend and frontend will be running!

### Option 2: Using One Command
```powershell
cd react-app
npm run dev
```
This will start BOTH the backend server AND the React frontend!

---

## 🔧 Manual Method (If you want to run separately)

### Terminal 1 - Backend Server
```powershell
cd backend
node server.js
```
Backend will run on: http://localhost:5000

### Terminal 2 - React Frontend
```powershell
cd react-app
npm run frontend
```
Frontend will run on: http://localhost:3002

---

## ❗ Important Notes

### Both Servers Must Be Running
- **Backend (Node.js)** - Port 5000 - Handles authentication, database
- **Frontend (React/Vite)** - Port 3002 - The website interface

### After Login/Signup
If you experience issues with login/signup pages not showing after logging out:
1. Click the browser's refresh button (F5)
2. OR clear your browser cache and reload

### MongoDB Connection
- Make sure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 is already set)
- If you see "MongoDB Connected" in the terminal, you're good to go!

---

## 🐛 Troubleshooting

### "Login/Signup not working"
✅ **Solution**: Make sure BOTH servers are running
- Check terminal shows: "MongoDB Connected" 
- Check terminal shows: "VITE v5.x.x ready"

### "Page not rendering after logout"
✅ **Solution**: This is now fixed! The app will automatically redirect to home after logout.
- If still having issues, press F5 to refresh the page

### "Port already in use"
✅ **Solution**: Stop the existing server
```powershell
Get-Process -Name node | Stop-Process -Force
```
Then start again with `npm run dev`

---

## 📝 Features Working

✅ User Registration (Signup)
✅ User Login
✅ JWT Authentication
✅ Protected Routes
✅ Auto-logout redirect
✅ Chatbot
✅ All pages accessible

---

## 🎯 Testing Authentication

1. Start the servers using `npm run dev` in react-app folder
2. Go to http://localhost:3002/signup
3. Create a new account (any email/password)
4. You'll be automatically logged in and redirected to home
5. Try logging out - you'll be redirected to home
6. Try logging in again - it should work!

---

**Made with ❤️ for SaveLife Blood Donation Portal**
