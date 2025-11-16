# Google API Integration Guide for Find Center Feature

## Overview
This guide explains how to integrate Google Places API and Google Geolocation API into the blood donation center finder.

## Updated Architecture

### Current Implementation
The `find-center.js` file has been updated to support:
1. **Google Geolocation API** - For accurate user location
2. **Google Places API** - For additional blood centers (optional)
3. **e-Rakt Kosh API** - Government blood bank data (existing)
4. **Categorized Results** - Results grouped by type (Blood Banks, Donation Centers, Hospitals)
5. **Interactive Cards** - Action buttons for directions and calling

## API Configuration

### 1. Google Geolocation API Setup

**Documentation**: https://developers.google.com/maps/documentation/geolocation/overview

**Steps to Enable:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Geolocation API"
4. Create API credentials (API Key)
5. Add API key to `find-center.js`:
   ```javascript
   const GOOGLE_GEOLOCATION_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

**Current Implementation:**
```javascript
function getLocationWithGoogle() {
    fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_GEOLOCATION_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            considerIp: true
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.location) {
            userLatitude = data.location.lat;
            userLongitude = data.location.lng;
            // Store coordinates
        }
    })
    .catch(error => {
        console.error('Google Geolocation API error:', error);
        // Fallback to browser geolocation
        getBrowserLocation();
    });
}
```

### 2. Google Places API Setup

**Documentation**: https://developers.google.com/maps/documentation/places/web-service/overview

**Steps to Enable:**
1. In Google Cloud Console, enable "Places API"
2. Create API credentials
3. Add API key to `find-center.js`:
   ```javascript
   const GOOGLE_PLACES_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

**Implementation Notes:**
- Google Places API has CORS restrictions
- You need to use JavaScript SDK or backend proxy
- Example implementation is included in `find-center.js` (commented)

## New Features

### 1. Categorized Results Display

Results are now organized into sections:
- **Blood Banks** - Dedicated blood storage facilities
- **Donation Centers** - Blood collection centers
- **Hospitals** - Hospitals with blood services
- **Other Centers** - Any other facilities

Each category shows:
- Category icon
- Category name
- Count of centers in parentheses

### 2. Enhanced Center Cards

Each card now includes:
- **Header**: Name and type badge
- **Info**: Address, phone, distance
- **Stock Status**: Available blood or "Stock Not Reported"
- **Action Buttons**:
  - **Get Directions**: Opens Google Maps with directions
  - **Call**: Makes phone call directly

### 3. Interactive Features

**Get Directions Button:**
```javascript
function openDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}
```

**Call Button:**
- Direct `tel:` link for instant calling
- Works on mobile and desktop

## File Structure

### JavaScript (`js/find-center.js`)

**Key Functions:**

1. **getLocationWithGoogle()** - Uses Google Geolocation API
2. **getBrowserLocation()** - Fallback to navigator.geolocation
3. **fetchERaktKoshData()** - Fetches government blood bank data
4. **fetchGooglePlacesData()** - (Optional) Fetches Google Places data
5. **renderResults()** - Groups and displays categorized results
6. **renderCategorySection()** - Renders each category section
7. **createCenterCard()** - Creates individual center card HTML
8. **openDirections()** - Opens Google Maps directions

### CSS (`css/find-center.css`)

**New Styles Added:**

1. **Category Sections:**
   ```css
   .category-section
   .category-title
   .category-cards
   ```

2. **Action Buttons:**
   ```css
   .card-actions
   .btn-directions
   .btn-call
   ```

3. **Responsive Layouts:**
   - Desktop: Multi-column grid
   - Tablet: 2-column grid
   - Mobile: Single column with stacked buttons

## Usage Flow

### User Journey

1. **Page Load**
   - Google Geolocation API gets user location (silent)
   - Coordinates stored in hidden inputs

2. **User Input**
   - Select distance radius (5-50 km)
   - Select center type (Blood Bank/Donation Center/Hospital/All)
   - Click "Search Centers"

3. **Search Process**
   - Results section appears
   - Loading spinner shows
   - API calls made (e-Rakt Kosh + optional Google Places)
   - Smooth scroll to results

4. **Results Display**
   - Title shows: "X Available Blood Banks Found"
   - Results grouped by category
   - Each category has:
     - Header with icon and count
     - Grid of center cards

5. **User Actions**
   - Click "Get Directions" → Opens Google Maps
   - Click "Call" → Initiates phone call
   - Hover over cards → Visual feedback

## API Keys Configuration

**Required:**
```javascript
// In find-center.js, replace these placeholders:

const GOOGLE_GEOLOCATION_API_KEY = 'YOUR_GOOGLE_GEOLOCATION_API_KEY';
const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';
const API_KEY = 'YOUR_X_API_KEY_HERE'; // e-Rakt Kosh API
```

**Security Best Practices:**
1. **API Key Restrictions:**
   - Restrict keys to specific domains
   - Limit to specific APIs
   - Set usage quotas

2. **Environment Variables:**
   - For production, use environment variables
   - Never commit API keys to GitHub
   - Use `.env` files (backend required)

3. **Backend Proxy (Recommended):**
   - Create backend API endpoints
   - Backend calls Google APIs
   - Frontend calls your backend
   - Keeps API keys secure

## Google Places API Integration (Optional)

### Why Use Google Places?
- Find additional hospitals not in e-Rakt Kosh
- Get real-time data (hours, ratings, photos)
- Richer location information

### Implementation Options

**Option 1: JavaScript SDK (Recommended)**
```html
<!-- Add to find-center.html -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

```javascript
// In find-center.js
const service = new google.maps.places.PlacesService(document.createElement('div'));
const request = {
    location: new google.maps.LatLng(userLatitude, userLongitude),
    radius: distance * 1000,
    type: 'hospital',
    keyword: 'blood donation'
};

service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Process results
        appendGooglePlacesResults(results);
    }
});
```

**Option 2: Backend Proxy**
```javascript
// Create backend endpoint (Node.js example)
app.post('/api/places', async (req, res) => {
    const { lat, lng, radius } = req.body;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&keyword=blood&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
});
```

## Responsive Design

### Breakpoints

**Desktop (>768px):**
- Multi-column grid (auto-fill)
- Side-by-side action buttons
- Category titles with large icons

**Tablet (480px - 768px):**
- 2-column grid minimum
- Category titles adjusted
- Responsive buttons

**Mobile (<480px):**
- Single column layout
- Stacked action buttons (full width)
- Smaller typography
- Optimized spacing

## Testing

### Checklist

- [ ] Google Geolocation API key configured
- [ ] Location permission granted
- [ ] Search with different distances works
- [ ] Filter by center type works
- [ ] Results appear in categories
- [ ] "Get Directions" opens Google Maps
- [ ] "Call" button works on mobile
- [ ] Responsive on all devices
- [ ] Loading states work correctly
- [ ] Error handling displays properly

### Test Scenarios

1. **Location Blocked:**
   - Should show alert
   - Should retry with button click

2. **No Results:**
   - Should show "No centers found" message
   - Should suggest adjusting filters

3. **API Error:**
   - Should show error message
   - Should enable retry

4. **Mobile:**
   - Touch targets >44px
   - Phone call initiates correctly
   - Buttons stack vertically

## Performance Optimization

### Best Practices

1. **Debounce API Calls:**
   - Don't call APIs on every keystroke
   - Wait for user to finish input

2. **Cache Results:**
   - Store recent searches in localStorage
   - Reduce unnecessary API calls

3. **Lazy Load:**
   - Load cards as user scrolls
   - Improve initial render time

4. **Optimize Images:**
   - If adding photos, use WebP format
   - Lazy load images

## Future Enhancements

### Potential Features

1. **Map View:**
   - Show centers on Google Maps
   - Cluster markers
   - Click marker to see details

2. **Favorites:**
   - Save favorite centers
   - Quick access from sidebar

3. **Reviews:**
   - User ratings and reviews
   - Verified donations

4. **Real-time Updates:**
   - Live blood stock updates
   - Push notifications for urgent needs

5. **Booking:**
   - Schedule donation appointments
   - Calendar integration

## Troubleshooting

### Common Issues

**1. Location Not Working:**
- Check HTTPS (Geolocation requires secure context)
- Verify API key is correct
- Check browser permissions

**2. API Errors:**
- Verify API keys are enabled
- Check quotas in Google Cloud Console
- Look for CORS errors (use backend proxy)

**3. No Results Showing:**
- Check network tab for API responses
- Verify data structure matches expected format
- Check console for errors

**4. Buttons Not Working:**
- Verify `openDirections()` function is global
- Check phone number format
- Test on different devices

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API keys are correctly configured
3. Test with sample data
4. Review this documentation

## License

This implementation is part of the Blood Donation and Emergency Portal project.
