document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("centerSearchForm");
    const resultsContainer = document.getElementById("resultsContainer");
    const resultsSection = document.getElementById("resultsSection");
    const searchButton = document.getElementById("searchButton");
    
    // Hidden inputs for coordinates
    const latInput = document.getElementById("latitude");
    const longInput = document.getElementById("longitude");

    let userLatitude = null;
    let userLongitude = null;
    
    // --- API Configuration ---
    // Google APIs Configuration (Replace with your actual API keys)
    const GOOGLE_PLACES_API_KEY = 'AIzaSyDUaCSzEogPhRKeHDEqmx6UMS2iHzXnvrY';
    const GOOGLE_GEOLOCATION_API_KEY = 'AIzaSyDGEtoOalY4YZZ-vs6C6Vh0aOWz0HWFHuU';
    
    // e-Rakt Kosh API Configuration
    const API_BASE_URL = "https://apigw.umangapp.in"; 
    const API_ENDPOINT_PATH = "/umang/apisetu/dept/eraktkoshapi/ws1/stocknearby";
    const API_KEY = 'YOUR_X_API_KEY_HERE'; // Replace with your e-Rakt Kosh API key
    // -------------------------


    /**
     * Step 1: Get User Location using Google Geolocation API
     * Documentation: https://developers.google.com/maps/documentation/geolocation/overview
     * 
     * TODO: Replace navigator.geolocation with Google Geolocation API
     * Example implementation below:
     */
    function getLocationWithGoogle() {
        console.log('Attempting to get location with Google Geolocation API...');
        
        // Google Geolocation API Implementation
        fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_GEOLOCATION_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                considerIp: true
            })
        })
        .then(response => {
            console.log('Google Geolocation Response Status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Google Geolocation Response:', data);
            
            if (data.location) {
                userLatitude = data.location.lat;
                userLongitude = data.location.lng;
                
                // Store coordinates in hidden fields
                latInput.value = userLatitude.toString();
                longInput.value = userLongitude.toString();
                
                console.log('✅ Location obtained:', userLatitude, userLongitude);
            } else if (data.error) {
                console.error('Google Geolocation Error:', data.error);
                throw new Error(data.error.message || 'Failed to get location');
            }
        })
        .catch(error => {
            console.error('Google Geolocation API error:', error);
            console.log('Falling back to browser geolocation...');
            // Fallback to browser geolocation if Google API fails
            getBrowserLocation();
        });
    }
    
    /**
     * Fallback: Browser Geolocation API
     */
    function getBrowserLocation() {
        console.log('Attempting browser geolocation...');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLatitude = position.coords.latitude;
                    userLongitude = position.coords.longitude;
                    latInput.value = userLatitude.toString();
                    longInput.value = userLongitude.toString();
                    console.log('✅ Browser location obtained:', userLatitude, userLongitude);
                },
                (error) => {
                    console.error('❌ Geolocation error:', error.message, error);
                    alert('Unable to get your location. Please enable location services and refresh the page.');
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
            );
        } else {
            console.error('❌ Browser geolocation not supported');
            alert('Your browser does not support geolocation.');
        }
    }
    
    // Start location tracking when the page loads
    // OPTION 1: Use Google Geolocation API (recommended)
    getLocationWithGoogle();
    
    // OPTION 2: Use Browser Geolocation API (fallback)
    // getBrowserLocation();


    /**
     * Step 2: Handle Form Submission and Fetch Blood Centers
     * 
     * Two data sources available:
     * 1. e-Rakt Kosh API - Government blood bank data
     * 2. Google Places API - Additional hospitals and donation centers
     */
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        console.log('🔍 Search form submitted');
        console.log('Current location:', userLatitude, userLongitude);
        
        if (!userLatitude || !userLongitude) {
            alert("Location data is not yet available. Please enable location access or wait a moment.");
            console.log('⚠️ No location available, retrying...');
            getLocationWithGoogle();
            return;
        }

        // Get filter values
        const distance = document.getElementById("distance").value;
        const centerTypeFilter = document.getElementById("centerType").value;
        
        console.log('Search parameters:', { distance, centerTypeFilter });
        
        // Show results section and loading state
        resultsSection.style.display = "block";
        searchButton.disabled = true;
        searchButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Searching...</span>';
        resultsContainer.innerHTML = '<div class="loading-message"><i class="fa-solid fa-spinner fa-spin"></i><p>Finding blood centers near you...</p></div>';

        // Scroll to results section smoothly
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // FOR TESTING: Use mock data if API key is not configured
        if (API_KEY === 'YOUR_X_API_KEY_HERE') {
            console.warn('⚠️ Using mock data - e-Rakt Kosh API key not configured');
            useMockData(centerTypeFilter);
            return;
        }

        // Fetch data from e-Rakt Kosh API
        fetchERaktKoshData(distance, centerTypeFilter);
        
        // TODO: Optionally fetch additional data from Google Places API
        // fetchGooglePlacesData(distance, centerTypeFilter);
    });

    /**
     * Fetch data from e-Rakt Kosh API
     */
    function fetchERaktKoshData(distance, centerTypeFilter) {
        const UserData = {
            "Lat": latInput.value,
            "Long": longInput.value,
            "dis": distance,
            "bloodgroup": "", // Empty for all blood groups
            "Component": "" // Search for all blood components
        };

        console.log('Fetching e-Rakt Kosh data with:', UserData);

        fetch(API_BASE_URL + API_ENDPOINT_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY, 
            },
            body: JSON.stringify(UserData)
        })
        .then(response => {
            console.log('API Response Status:', response.status);
            if (response.status === 401 || response.status === 403) {
                throw new Error("Authorization Failed (401/403). Please check your e-Rakt Kosh API key.");
            }
            if (!response.ok) {
                throw new Error(`API Error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response Data:', data);
            renderResults(data, centerTypeFilter);
        })
        .catch(error => {
            console.error('e-Rakt Kosh API Error:', error);
            showError(error.message);
        })
        .finally(() => {
            searchButton.disabled = false;
            searchButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i><span>Search Centers</span>';
        });
    }

    /**
     * Optional: Fetch additional data from Google Places API
     * Documentation: https://developers.google.com/maps/documentation/places/web-service/search-nearby
     * 
     * TODO: Implement Google Places API integration
     */
    function fetchGooglePlacesData(distance, centerTypeFilter) {
        // Convert distance from km to meters
        const radius = distance * 1000;
        
        // Map center type to Google Places types
        let placeType = 'hospital'; // default
        if (centerTypeFilter === 'Blood Bank') {
            placeType = 'hospital'; // Google doesn't have specific blood bank type
        } else if (centerTypeFilter === 'Blood Donation Center') {
            placeType = 'health'; // or 'hospital'
        }
        
        // Google Places Nearby Search API
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLatitude},${userLongitude}&radius=${radius}&type=${placeType}&keyword=blood&key=${GOOGLE_PLACES_API_KEY}`;
        
        // Note: Direct API calls from browser will have CORS issues
        // You need to use Places API via JavaScript SDK or a backend proxy
        
        /* Example using Places Service (requires Google Maps JavaScript API):
        
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        const request = {
            location: new google.maps.LatLng(userLatitude, userLongitude),
            radius: radius,
            type: placeType,
            keyword: 'blood donation'
        };
        
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Merge with e-Rakt Kosh results
                appendGooglePlacesResults(results, centerTypeFilter);
            }
        });
        */
    }


    /**
     * Step 3: Render Results as Cards (Separated by Type)
     * Shows results in organized sections: Blood Banks, Donation Centers, Hospitals
     */
    function renderResults(data, centerTypeFilter = '') {
        console.log('📊 Rendering results...', data);
        resultsContainer.innerHTML = ""; 

        if (data && data.payload && Array.isArray(data.payload) && data.payload.length > 1) {
            console.log('✅ Valid data received, payload length:', data.payload.length);
            
            // The first item is usually metadata, so we take the rest
            let centerList = data.payload.slice(1);
            console.log('Total centers before filtering:', centerList.length);
            
            // Apply Center Type Filter
            if (centerTypeFilter) {
                centerList = centerList.filter(center => {
                    const centerType = (center.type || '').toLowerCase();
                    const filterType = centerTypeFilter.toLowerCase();
                    return centerType.includes(filterType);
                });
                console.log(`Centers after filtering by "${centerTypeFilter}":`, centerList.length);
            }
            
            if (centerList.length === 0) {
                console.log('⚠️ No centers match the filter');
                showNoResults();
                return;
            }
            
            // Group centers by type
            const bloodBanks = centerList.filter(c => (c.type || '').toLowerCase().includes('blood bank'));
            const donationCenters = centerList.filter(c => (c.type || '').toLowerCase().includes('donation center'));
            const hospitals = centerList.filter(c => (c.type || '').toLowerCase().includes('hospital'));
            const others = centerList.filter(c => {
                const type = (c.type || '').toLowerCase();
                return !type.includes('blood bank') && !type.includes('donation center') && !type.includes('hospital');
            });
            
            console.log('Grouped centers:', {
                bloodBanks: bloodBanks.length,
                donationCenters: donationCenters.length,
                hospitals: hospitals.length,
                others: others.length
            });
            
            // Update main results title
            updateResultsTitle(centerList.length, centerTypeFilter);
            
            // Render each category if it has results
            if (bloodBanks.length > 0) {
                renderCategorySection('Blood Banks', bloodBanks, 'fa-building');
            }
            
            if (donationCenters.length > 0) {
                renderCategorySection('Donation Centers', donationCenters, 'fa-hand-holding-heart');
            }
            
            if (hospitals.length > 0) {
                renderCategorySection('Hospitals', hospitals, 'fa-hospital');
            }
            
            if (others.length > 0) {
                renderCategorySection('Other Centers', others, 'fa-location-dot');
            }
            
            console.log('✅ Rendering complete');
            
        } else {
            console.error('❌ Invalid data structure:', data);
            showError('Invalid API response or no data available');
        }
    }
    
    /**
     * Render a category section with its centers
     */
    function renderCategorySection(categoryName, centers, iconClass) {
        const categoryHtml = `
            <div class="category-section">
                <h2 class="category-title">
                    <i class="fa-solid ${iconClass}"></i>
                    ${categoryName} <span class="count">(${centers.length})</span>
                </h2>
                <div class="category-cards" id="${categoryName.replace(/\s+/g, '-').toLowerCase()}-cards">
                </div>
            </div>
        `;
        resultsContainer.insertAdjacentHTML('beforeend', categoryHtml);
        
        const categoryCardsContainer = document.getElementById(`${categoryName.replace(/\s+/g, '-').toLowerCase()}-cards`);
        
        centers.forEach(center => {
            const cardHtml = createCenterCard(center);
            categoryCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    }
    
    /**
     * Create HTML for a single center card
     */
    function createCenterCard(center) {
        // Check if any blood group is available
        const hasStock = center.available_WithQty && center.available_WithQty.trim().length > 0 && center.available_WithQty !== " : 0";

        let stockStatusHtml = "";
        let cardClass = "";

        if (hasStock) {
            stockStatusHtml = `<p class="availability-stock available">
                                    <i class="fa-solid fa-droplet"></i> 
                                    <span><strong>Available:</strong> ${center.available_WithQty.replace(/,\s*/g, ' | ')}</span>
                                </p>`;
            cardClass = 'has-stock';
        } else {
            stockStatusHtml = `<p class="availability-stock not-reported">
                                    <i class="fa-solid fa-triangle-exclamation"></i> 
                                    <span>Stock Not Reported</span>
                                </p>`;
            cardClass = 'no-stock';
        }

        return `
            <div class="center-card ${cardClass}">
                <div class="card-header">
                    <h3>${center.name || 'Blood Center'}</h3>
                    <p class="type"><i class="fa-solid fa-building-circle-check"></i> ${center.type || 'Blood Bank'}</p>
                </div>
                <div class="card-info">
                    <p><i class="fa-solid fa-map-marker-alt"></i> ${center.add || 'Address not available'}</p>
                    <p><i class="fa-solid fa-phone"></i> ${center.ph || 'Contact not available'}</p>
                    <p class="distance"><i class="fa-solid fa-route"></i> <strong>${center.dis} km</strong> away</p>
                    ${stockStatusHtml}
                </div>
                <div class="card-actions">
                    <button class="btn-directions" onclick="openDirections(${center.lat || userLatitude}, ${center.long || userLongitude})">
                        <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                    </button>
                    <button class="btn-call" onclick="window.location.href='tel:${center.ph}'">
                        <i class="fa-solid fa-phone"></i> Call
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Update the main results title
     */
    function updateResultsTitle(count, centerTypeFilter) {
        let titleText = '';
        if (centerTypeFilter === 'Blood Bank') {
            titleText = `Available Blood Banks`;
        } else if (centerTypeFilter === 'Blood Donation Center') {
            titleText = `Available Donation Centers`;
        } else if (centerTypeFilter === 'Hospital') {
            titleText = `Available Hospitals`;
        } else {
            titleText = `Available Blood Centers`;
        }
        
        titleText = `${count} ${titleText} Found`;
        document.getElementById("resultsTitle").textContent = titleText;
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="placeholder-message" style="border-color: #ef5350;">
                <i class="fa-solid fa-circle-exclamation" style="color: #d32f2f;"></i>
                <p style="color: #d32f2f; font-weight: 600;">Error: ${message}</p>
                <p style="color: #666; font-size: 14px; margin-top: 0.5rem;">Please check your configuration and try again</p>
            </div>
        `;
    }
    
    /**
     * Show no results message
     */
    function showNoResults() {
        resultsContainer.innerHTML = `
            <div class="placeholder-message">
                <i class="fa-solid fa-heart-crack"></i>
                <p>No donation centers found matching your criteria</p>
                <p style="color: #999; font-size: 14px; margin-top: 0.5rem;">Try adjusting your search distance or filters</p>
            </div>
        `;
    }
    
    /**
     * Use mock data for testing (when API key is not available)
     */
    function useMockData(centerTypeFilter) {
        console.log('🧪 Using mock data for testing');
        
        setTimeout(() => {
            const mockData = {
                payload: [
                    { meta: 'data' }, // First item is metadata
                    {
                        name: "City Blood Bank",
                        type: "Blood Bank",
                        add: "Block A, Medical Complex, Sector 12, New Delhi - 110001",
                        ph: "011-12345678",
                        dis: "2.5",
                        available_WithQty: "A+ : 25, B+ : 15, O+ : 30, AB+ : 10, A- : 5, B- : 3, O- : 8, AB- : 2",
                        lat: 28.7041,
                        long: 77.1025
                    },
                    {
                        name: "Central Hospital Blood Bank",
                        type: "Blood Bank",
                        add: "15, Hospital Road, Central District, Delhi - 110002",
                        ph: "011-23456789",
                        dis: "4.8",
                        available_WithQty: "A+ : 18, B+ : 12, O+ : 22, AB+ : 6",
                        lat: 28.7141,
                        long: 77.1125
                    },
                    {
                        name: "RedCross Blood Donation Center",
                        type: "Blood Donation Center",
                        add: "Red Cross Building, Gandhi Nagar, New Delhi - 110003",
                        ph: "011-34567890",
                        dis: "6.2",
                        available_WithQty: "A+ : 10, O+ : 15, AB+ : 5, B- : 4",
                        lat: 28.6941,
                        long: 77.0925
                    },
                    {
                        name: "Community Blood Center",
                        type: "Blood Donation Center",
                        add: "Community Hall, Park Street, Delhi - 110004",
                        ph: "011-45678901",
                        dis: "8.5",
                        available_WithQty: " : 0",
                        lat: 28.7241,
                        long: 77.1325
                    },
                    {
                        name: "Apollo Hospital Blood Bank",
                        type: "Hospital",
                        add: "Apollo Complex, Medical Avenue, Delhi - 110005",
                        ph: "011-56789012",
                        dis: "3.2",
                        available_WithQty: "A+ : 20, B+ : 18, O+ : 25, AB+ : 8, A- : 6, B- : 4, O- : 10, AB- : 3",
                        lat: 28.7341,
                        long: 77.1225
                    },
                    {
                        name: "Max Healthcare Blood Center",
                        type: "Hospital",
                        add: "Max Hospital Campus, Health City, Delhi - 110006",
                        ph: "011-67890123",
                        dis: "5.7",
                        available_WithQty: "A+ : 15, B+ : 10, O+ : 18, AB+ : 7",
                        lat: 28.6841,
                        long: 77.0825
                    },
                    {
                        name: "Fortis Hospital Blood Bank",
                        type: "Hospital",
                        add: "Fortis Complex, Care Boulevard, Delhi - 110007",
                        ph: "011-78901234",
                        dis: "7.3",
                        available_WithQty: " : 0",
                        lat: 28.7441,
                        long: 77.1425
                    },
                    {
                        name: "Rotary Blood Bank",
                        type: "Blood Bank",
                        add: "Rotary Club Building, Service Lane, Delhi - 110008",
                        ph: "011-89012345",
                        dis: "9.1",
                        available_WithQty: "A+ : 12, B+ : 8, O+ : 14, AB+ : 4, O- : 5",
                        lat: 28.6741,
                        long: 77.0725
                    },
                    {
                        name: "Lions Blood Donation Center",
                        type: "Blood Donation Center",
                        add: "Lions Club Complex, Charity Road, Delhi - 110009",
                        ph: "011-90123456",
                        dis: "10.5",
                        available_WithQty: "A+ : 8, B+ : 6, O+ : 10, AB+ : 3",
                        lat: 28.7541,
                        long: 77.1525
                    },
                    {
                        name: "AIIMS Blood Bank",
                        type: "Hospital",
                        add: "AIIMS Campus, Medical Institute Zone, Delhi - 110010",
                        ph: "011-26588500",
                        dis: "4.5",
                        available_WithQty: "A+ : 30, B+ : 25, O+ : 35, AB+ : 15, A- : 10, B- : 8, O- : 12, AB- : 5",
                        lat: 28.7141,
                        long: 77.0925
                    }
                ]
            };
            
            renderResults(mockData, centerTypeFilter);
            searchButton.disabled = false;
            searchButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i><span>Search Centers</span>';
        }, 1000); // Simulate network delay
    }
});

/**
 * Global function to open directions in Google Maps
 */
function openDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}