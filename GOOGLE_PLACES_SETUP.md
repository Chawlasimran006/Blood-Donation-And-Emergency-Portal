# Google Places API Setup - Quick Guide

## ✅ What Changed

The system now uses **Google Places API** instead of e-Rakt Kosh API to find blood centers near you.

## 🔑 API Key Setup

### Step 1: Enable Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new one)
3. Click **"Enable APIs and Services"**
4. Search for **"Places API"**
5. Click **Enable**
6. Also enable **"Maps JavaScript API"** (required)

### Step 2: Your API Keys Are Already in the Code

I can see you already have these keys configured:
- **Google Places API**: `AIzaSyDUaCSzEogPhRKeHDEqmx6UMS2iHzXnvrY`
- **Google Geolocation API**: `AIzaSyDGEtoOalY4YZZ-vs6C6Vh0aOWz0HWFHuU`

These are already in your `find-center.js` file.

### Step 3: Verify APIs are Enabled

Go to your [Google Cloud Console API Dashboard](https://console.cloud.google.com/apis/dashboard) and make sure these are enabled:
- ✅ **Places API** 
- ✅ **Maps JavaScript API**
- ✅ **Geolocation API**

## 🚀 How to Test

### Method 1: Open Directly (May not work due to CORS)

1. Just open `html/find-center.html` in your browser
2. Allow location access
3. Click "Search Centers"

### Method 2: Use Local Server (Recommended)

**Option A: VS Code Live Server**
```
1. Install "Live Server" extension in VS Code
2. Right-click find-center.html
3. Select "Open with Live Server"
```

**Option B: Python Server**
```powershell
cd "C:\Users\IRFAN\Desktop\FEE-II"
python -m http.server 8000
# Open: http://localhost:8000/html/find-center.html
```

## 🔍 What Will Happen

1. **Page Loads** → Google Geolocation API gets your location
2. **You Click Search** → Google Places API searches for:
   - Blood banks
   - Blood donation centers  
   - Hospitals with blood services
   - Within your specified radius
3. **Results Display** → Organized into categories:
   - 🏥 Blood Banks
   - ❤️ Donation Centers
   - 🏨 Hospitals

## 📊 Debugging

Open browser console (F12) and you should see:

### Expected Console Output:
```
✅ Google Maps Places Service initialized
Attempting to get location with Google Geolocation API...
Google Geolocation Response Status: 200
✅ Location obtained: 28.7041, 77.1025

[After clicking Search]
🔍 Search form submitted
Current location: 28.7041, 77.1025
Search parameters: {distance: "10", centerTypeFilter: ""}
🔍 Fetching from Google Places API...
Search parameters: {keyword: "blood bank blood donation", radius: 10000, location: {...}}
Google Places Status: OK
Google Places Results: Array(20) [...]
Converting 20 Google Places results...
📊 Rendering results...
✅ Valid data received, payload length: 21
Total centers before filtering: 20
Grouped centers: {bloodBanks: 12, donationCenters: 5, hospitals: 3, others: 0}
✅ Rendering complete
```

### Common Errors:

**Error: "REQUEST_DENIED"**
```
Google Places Status: REQUEST_DENIED
```
**Solution**: Places API or Maps JavaScript API not enabled. Enable them in Google Cloud Console.

---

**Error: "Google Maps API error: RefererNotAllowedMapError"**
**Solution**: 
1. Go to Google Cloud Console → Credentials
2. Click on your API key
3. Under "Application restrictions" → Select "HTTP referrers"
4. Add: `http://localhost:*/*` and `http://127.0.0.1:*/*`
5. Or select "None" for testing (less secure)

---

**Error: "initMap is not a function"**
**Solution**: The Google Maps script is loading after your script. This should be fixed in the current code.

---

**Error: "placesService is not defined"**
**Solution**: Google Maps hasn't finished loading. The code now waits automatically.

## ✨ Features

### What Works:
- ✅ Auto-location using Google Geolocation
- ✅ Search blood centers using Google Places
- ✅ Filter by type (Blood Bank, Donation Center, Hospital)
- ✅ Adjust search radius (5-50 km)
- ✅ Categorized results display
- ✅ Get Directions button (opens Google Maps)
- ✅ Call button (initiates phone call)
- ✅ Responsive design (mobile-friendly)

### Limitations:
- ⚠️ Google Places doesn't provide blood stock information (shows "Stock Not Reported")
- ⚠️ Results limited to ~20 places per search
- ⚠️ Maximum search radius is 50km (Google Places limit)
- ⚠️ May include some non-blood facilities (e.g., general hospitals)

## 🎯 Search Tips

For better results:
1. **Start with 10-20 km radius** - Too large may give irrelevant results
2. **Use "All Centers" filter first** - Then narrow down if needed
3. **Check multiple keywords** - "Blood Bank" vs "Donation Center"
4. **Urban areas work better** - More Google Places data available

## 💰 API Costs

Google Places API pricing (as of 2025):
- **Nearby Search**: $32 per 1000 requests
- **Free tier**: $200 credit per month (~6,250 searches)
- **Maps JavaScript API**: Free with restrictions
- **Geolocation API**: $5 per 1000 requests (~40,000 free per month)

For a small project, you'll likely stay within free tier.

## 🔒 Security (Production)

Before deploying:

1. **Restrict your API key**:
   - Go to Cloud Console → Credentials
   - Click your API key → "Edit"
   - Under "Application restrictions": Select "HTTP referrers"
   - Add your domain: `https://yourdomain.com/*`
   - Under "API restrictions": Select specific APIs only

2. **Monitor usage**:
   - Check Google Cloud Console regularly
   - Set up billing alerts
   - Monitor for unusual activity

## 📝 Files Modified

- ✅ `html/find-center.html` - Added Google Maps JavaScript API
- ✅ `js/find-center.js` - Switched to Google Places API
- ❌ `js/find-center.js` - Removed e-Rakt Kosh API dependency

## 🆘 Still Not Working?

### Checklist:
- [ ] Google Maps JavaScript API enabled?
- [ ] Places API enabled?
- [ ] Geolocation API enabled?
- [ ] API key restrictions not blocking localhost?
- [ ] Running from web server (not file://)?
- [ ] Browser console shows no errors?
- [ ] Location permission granted?

### Get Help:
1. Open browser console (F12)
2. Copy all error messages
3. Check which API call is failing
4. Verify API key has correct permissions

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Console shows "Google Maps Places Service initialized"
- ✅ Console shows "Location obtained: [coordinates]"
- ✅ After search, console shows "Google Places Status: OK"
- ✅ Results appear on page in categories
- ✅ You can click "Get Directions" and it opens Google Maps
- ✅ Cards show hospital/blood bank names and addresses

Good luck! 🩸❤️
