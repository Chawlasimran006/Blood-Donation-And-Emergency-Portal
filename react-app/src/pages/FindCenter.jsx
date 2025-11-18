import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/FindCenter.css'
import '../styles/Pages.css'

const GOOGLE_PLACES_API_KEY = 'AIzaSyDUaCSzEogPhRKeHDEqmx6UMS2iHzXnvrY'

function FindCenter() {
  const navigate = useNavigate()
  const [distance, setDistance] = useState(10)
  const [centerType, setCenterType] = useState('')
  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [locationStatus, setLocationStatus] = useState({
    className: 'location-status loading',
    message: 'Getting your location...'
  })
  const [results, setResults] = useState([])
  const [resultsVisible, setResultsVisible] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    getBrowserLocation()

    // Mobile menu toggle
    const toggleBtn = document.getElementById('toggle-bnt')
    const menu = document.querySelector('.menu')
    
    const handleToggle = () => {
      menu?.classList.toggle('active')
    }

    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', handleToggle)
      return () => toggleBtn.removeEventListener('click', handleToggle)
    }
  }, [])

  const getBrowserLocation = () => {
    updateLocationStatus('loading', 'Getting your precise location...')

    if (!navigator.geolocation) {
      updateLocationStatus('error', 'Browser does not support location')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLatitude(position.coords.latitude)
        setUserLongitude(position.coords.longitude)
        updateLocationStatus('success', 'Location detected successfully')
      },
      (error) => {
        updateLocationStatus('error', 'Please allow location permission and reload')
        console.error('GPS Error', error)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const updateLocationStatus = (status, message) => {
    let icon =
      status === 'loading'
        ? <i className="fa-solid fa-spinner fa-spin"></i>
        : status === 'success'
        ? <i className="fa-solid fa-check-circle"></i>
        : <i className="fa-solid fa-exclamation-circle"></i>

    setLocationStatus({
      className: `location-status ${status}`,
      message,
      icon
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const radiusKm = parseFloat(distance)
    searchBloodCenters(radiusKm, centerType)
  }

  const searchBloodCenters = (radiusKm, centerType) => {
    if (!userLatitude || !userLongitude) {
      setResultsVisible(true)
      setResults([{
        error: true,
        message: 'Location not detected. Please allow permission.'
      }])
      return
    }

    setSearching(true)
    setResultsVisible(true)
    setResults([{ loading: true }])

    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      setResults([{ error: true, message: 'Google Maps API failed to load' }])
      setSearching(false)
      return
    }

    // Create invisible map for Places API
    const map = new google.maps.Map(document.createElement('div'))
    const service = new google.maps.places.PlacesService(map)

    const radiusMeters = Math.min(radiusKm * 1000, 50000)

    // Keywords (optimized)
    let keyword = 'blood bank'
    if (centerType === 'Blood Donation Center') keyword = 'blood donation center'
    else if (centerType === 'Hospital') keyword = 'hospital blood bank'

    const request = {
      location: new google.maps.LatLng(userLatitude, userLongitude),
      radius: radiusMeters,
      keyword: keyword
    }

    service.nearbySearch(request, (results, status) => {
      setSearching(false)

      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        setResults([{
          error: true,
          message: `No results found: ${status}`
        }])
        return
      }

      displayResults(results, radiusKm)
    })
  }

  const displayResults = (places, maxDistanceKm) => {
    let filteredPlaces = places
      .map((place) => {
        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          place.geometry.location.lat(),
          place.geometry.location.lng()
        )
        return { place, distance }
      })
      .filter((item) => item.distance <= maxDistanceKm)
      .sort((a, b) => a.distance - b.distance)

    if (filteredPlaces.length === 0) {
      setResults([{
        error: true,
        message: `No centers found within ${maxDistanceKm} km`
      }])
      return
    }

    setResults(filteredPlaces)
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const retryLocation = () => {
    getBrowserLocation()
  }

  return (
    <>
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

      <main className="center-search">
      {/* Hero Section */}
      <div className="search-hero find-center">
        <div className="hero-content">
          <div className="hero-icon">
            <i className="fa-solid fa-hospital"></i>
          </div>
          <h1>Find Blood Donation Centers</h1>
          <p>Locate nearby blood banks with real-time stock availability</p>
        </div>
      </div>

      {/* Search Card */}
      <div className="search-card">
        <form id="centerSearchForm" className="search-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="distance">
                <i className="fa-solid fa-route"></i>
                <span>Search Radius</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  min="1"
                  max="100"
                  required
                />
                <span className="unit">km</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="centerType">
                <i className="fa-solid fa-hospital"></i>
                <span>Center Type</span>
              </label>
              <select
                id="centerType"
                value={centerType}
                onChange={(e) => setCenterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Blood Bank">Blood Bank</option>
                <option value="Blood Donation Center">Blood Donation Center</option>
                <option value="Hospital">Hospital</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ opacity: 0, visibility: 'hidden' }}>Search</label>
              <button type="submit" className="submit-btn" id="searchButton" disabled={searching}>
                {searching ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Search Centers</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <input type="hidden" id="latitude" name="Lat" value={userLatitude || ''} />
          <input type="hidden" id="longitude" name="Long" value={userLongitude || ''} />
        </form>

        {/* Location Status Indicator */}
        <div id="locationStatus" className={locationStatus.className}>
          {locationStatus.icon}
          <span>{locationStatus.message}</span>
        </div>

        {/* Manual Location Test */}
        <div
          className="location-test"
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div>
              <strong>📍 Current Location:</strong>
              <span id="currentLocation" style={{ color: '#d32f2f', fontWeight: 600, marginLeft: '0.5rem' }}>
                {userLatitude && userLongitude
                  ? `${userLatitude.toFixed(6)}, ${userLongitude.toFixed(6)}`
                  : 'Detecting...'}
              </span>
            </div>
            <button
              type="button"
              onClick={retryLocation}
              style={{
                padding: '0.5rem 1rem',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <i className="fa-solid fa-rotate"></i> Retry Location
            </button>
          </div>
        </div>
      </div>

      {/* Results Section - Hidden by default */}
      {resultsVisible && (
        <section className="results-section" id="resultsSection">
          <div className="results-header">
            <h2 id="resultsTitle">Available Blood Banks</h2>
            <p className="results-subtitle">Real-time blood stock information from e-Rakt Kosh</p>
          </div>
          <div id="resultsContainer" className="results-container">
            {results[0]?.loading && (
              <div className="loading-message">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <p>Finding centers...</p>
              </div>
            )}

            {results[0]?.error && (
              <div className="error-message">
                <i className="fa-solid fa-exclamation-triangle"></i>
                <p>{results[0].message}</p>
              </div>
            )}

            {!results[0]?.loading && !results[0]?.error && results.length > 0 && (
              <>
                <h3>Found {results.length} centers within {distance} km</h3>
                {results.map(({ place, distance: dist }, index) => {
                  const isOpen = place.opening_hours ? place.opening_hours.open_now : null
                  return (
                    <div key={index} className="center-card">
                      <div className="card-header">
                        <h3 className="center-name">{place.name || 'Unknown Center'}</h3>
                        <span className="distance-badge">{dist.toFixed(2)} km</span>
                      </div>
                      <div className="card-body">
                        <p className="center-address">
                          <i className="fa-solid fa-location-dot"></i> {place.vicinity || 'Address not available'}
                        </p>
                        {place.rating && (
                          <p className="center-rating">
                            <i className="fa-solid fa-star"></i> {place.rating}/5
                          </p>
                        )}
                        {isOpen !== null && (
                          <p className={`center-status ${isOpen ? 'open' : 'closed'}`}>
                            <i className="fa-solid fa-clock"></i> {isOpen ? 'Open Now' : 'Closed'}
                          </p>
                        )}
                      </div>
                      <div className="card-actions">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-directions"
                        >
                          <i className="fa-solid fa-route"></i> Directions
                        </a>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </section>
      )}
    </main>
    </>
  )
}

export default FindCenter
