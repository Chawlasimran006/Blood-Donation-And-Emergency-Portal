# Quick Start Guide - Google API Integration

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Google Geolocation API Key

1. Go to: https://console.cloud.google.com/
2. Create new project or select existing
3. Enable **Geolocation API**
4. Navigate to **APIs & Services** > **Credentials**
5. Click **Create Credentials** > **API Key**
6. Copy the API key

### Step 2: Get Google Places API Key (Optional)

1. In same Google Cloud project
2. Enable **Places API**
3. Use same API key or create new one
4. Copy the API key

### Step 3: Configure API Keys

Open `js/find-center.js` and replace:

```javascript
// Line ~13
const GOOGLE_GEOLOCATION_API_KEY = 'AIza...'; // Paste your key here

// Line ~14
const GOOGLE_PLACES_API_KEY = 'AIza...'; // Paste your key here

// Line ~18
const API_KEY = 'your-eraktkosh-key'; // Your e-Rakt Kosh API key
```

### Step 4: Test

1. Open `html/find-center.html` in browser
2. Allow location permission
3. Enter distance and click "Search Centers"
4. Results should appear in categories

**Done! 🎉**

---

## 🔒 Secure Your API Keys

### Restrict API Keys in Google Cloud Console

1. Click on your API key
2. Click "Edit API key"
3. Under "Application restrictions":
   - Select "HTTP referrers"
   - Add: `yourdomain.com/*`
4. Under "API restrictions":
   - Select "Restrict key"
   - Choose: Geolocation API, Places API
5. Click "Save"

---

## 📋 Features Checklist

After setup, you should have:

- ✅ Silent location detection using Google API
- ✅ Search by distance (5-50 km)
- ✅ Filter by center type
- ✅ Results grouped by category:
  - Blood Banks
  - Donation Centers
  - Hospitals
  - Other Centers
- ✅ Interactive cards with:
  - Center name and type
  - Address and phone
  - Distance from user
  - Blood stock availability
  - **Get Directions** button → Opens Google Maps
  - **Call** button → Initiates phone call
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Smooth scrolling to results
- ✅ Loading states and error handling

---

## 🎯 API Endpoints Used

### Google Geolocation API
```
POST https://www.googleapis.com/geolocation/v1/geolocate?key=YOUR_KEY

Response:
{
  "location": {
    "lat": 28.7041,
    "lng": 77.1025
  },
  "accuracy": 20.0
}
```

### e-Rakt Kosh API
```
POST https://apigw.umangapp.in/umang/apisetu/dept/eraktkoshapi/ws1/stocknearby
Headers: { 'X-API-KEY': 'your-key' }

Body:
{
  "Lat": "28.7041",
  "Long": "77.1025",
  "dis": "10",
  "bloodgroup": "",
  "Component": ""
}
```

### Google Places API (Optional)
```
GET https://maps.googleapis.com/maps/api/place/nearbysearch/json?
    location=28.7041,77.1025
    &radius=5000
    &type=hospital
    &keyword=blood
    &key=YOUR_KEY
```

---

## 🐛 Common Issues & Fixes

### Issue: Location not detected
**Fix:**
- Ensure HTTPS (required for Geolocation API)
- Check API key is correct
- Allow location permission in browser
- Check browser console for errors

### Issue: "Authorization Failed (401/403)"
**Fix:**
- Verify API key is correctly pasted
- Check API is enabled in Google Cloud Console
- Ensure no extra spaces in API key
- Check API key restrictions

### Issue: No results showing
**Fix:**
- Open browser console (F12)
- Check Network tab for API response
- Verify distance is appropriate (try 20-30 km)
- Try "All" in center type filter

### Issue: Buttons not working
**Fix:**
- Check browser console for JavaScript errors
- Verify functions are defined globally
- Test on different browsers

---

## 📱 Testing on Mobile

1. Use HTTPS (required)
2. Test on actual device (not just DevTools)
3. Check location permission prompt
4. Test "Call" button functionality
5. Verify buttons stack vertically
6. Check touch target sizes

---

## 🎨 Customization

### Change Colors

In `css/find-center.css`:

```css
/* Primary color (red) */
--primary-color: #d32f2f;

/* Change to blue: */
--primary-color: #1976d2;

/* Update in these classes: */
.category-title { border-bottom: 3px solid #1976d2; }
.btn-directions { background: linear-gradient(135deg, #1976d2, #0d47a1); }
```

### Change Distance Options

In `html/find-center.html`:

```html
<select id="distance">
    <option value="5">5 km</option>
    <option value="10" selected>10 km</option>
    <option value="20">20 km</option>
    <!-- Add more options: -->
    <option value="100">100 km</option>
</select>
```

### Change Center Types

In `html/find-center.html`:

```html
<select id="centerType">
    <option value="">All Centers</option>
    <option value="Blood Bank">Blood Banks</option>
    <option value="Blood Donation Center">Donation Centers</option>
    <option value="Hospital">Hospitals</option>
    <!-- Add custom types: -->
    <option value="Mobile Van">Mobile Blood Vans</option>
</select>
```

---

## 📊 Analytics (Optional)

Track user interactions:

```javascript
// Add to find-center.js

// Track searches
form.addEventListener("submit", function (event) {
    // Your existing code...
    
    // Add analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'search', {
            'event_category': 'Blood Centers',
            'event_label': centerTypeFilter,
            'value': distance
        });
    }
});

// Track button clicks
function openDirections(lat, lng) {
    // Your existing code...
    
    // Add analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'get_directions', {
            'event_category': 'User Interaction'
        });
    }
}
```

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Replace all API key placeholders
- [ ] Restrict API keys to your domain
- [ ] Test on HTTPS
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify all buttons work
- [ ] Check error handling
- [ ] Optimize images (if any)
- [ ] Minify JavaScript and CSS
- [ ] Test with slow network (throttling)
- [ ] Add Google Analytics (optional)
- [ ] Set up monitoring/logging

---

## 📚 Additional Resources

- **Google Geolocation API**: https://developers.google.com/maps/documentation/geolocation
- **Google Places API**: https://developers.google.com/maps/documentation/places
- **e-Rakt Kosh API**: https://apisetu.gov.in/directory/api/eraktkosh
- **Google Cloud Console**: https://console.cloud.google.com/

---

## 💡 Pro Tips

1. **Test with Different Locations**: Change coordinates manually to test different areas
2. **Monitor API Usage**: Check Google Cloud Console for quota usage
3. **Cache Results**: Store recent searches to reduce API calls
4. **Error Logging**: Log errors to track issues in production
5. **Fallback Options**: Always have browser geolocation as fallback

---

## ⚡ Next Steps

1. **Immediate**: Configure API keys and test
2. **Short-term**: Add Google Places API integration
3. **Medium-term**: Add map view with markers
4. **Long-term**: Implement booking system

---

**Need Help?**
- Check `GOOGLE_API_INTEGRATION_GUIDE.md` for detailed docs
- Review `FIND_CENTER_UPDATE_SUMMARY.md` for all changes
- Check browser console for error messages

**Happy Coding! 🩸❤️**
