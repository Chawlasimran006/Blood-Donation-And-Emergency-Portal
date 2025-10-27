document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("centerSearchForm");
    const resultsContainer = document.getElementById("resultsContainer");
    const statusMessage = document.getElementById("statusMessage");
    const searchButton = document.getElementById("searchButton");
    
    // Hidden inputs for coordinates
    const latInput = document.getElementById("latitude");
    const longInput = document.getElementById("longitude");

    let userLatitude = null;
    let userLongitude = null;
    
    // --- API Configuration ---
    // The correct production base URL confirmed from API Setu documentation
    const API_BASE_URL = "https://apigw.umangapp.in"; 
    const API_ENDPOINT_PATH = "/umang/apisetu/dept/eraktkoshapi/ws1/stocknearby";
    
    // !!! IMPORTANT: Replace 'YOUR_X_API_KEY_HERE' with your actual key from API Setu. 
    // Without this, the API will fail with a 401 or 403 error.
    const API_KEY = 'YOUR_X_API_KEY_HERE'; 
    // -------------------------


    /**
     * Step 1: Get User Location using Geolocation API
     */
    function getBloodStockNearby() {
        if (navigator.geolocation) {
            statusMessage.innerHTML = '<i class="fa-solid fa-location-crosshairs fa-spin"></i> Getting your precise location...';
            statusMessage.className = "geolocation-status loading";
            
            navigator.geolocation.getCurrentPosition(
                successCallback, 
                errorCallback,
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
            );
        } else {
            statusMessage.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Geolocation not supported. Cannot search nearby.';
            statusMessage.className = "geolocation-status error";
            searchButton.disabled = true;
        }
    }

    function successCallback(position) {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;

        // Store coordinates in hidden fields and enable button
        latInput.value = userLatitude.toString();
        longInput.value = userLongitude.toString();
        searchButton.disabled = false;
        
        statusMessage.innerHTML = '<i class="fa-solid fa-circle-check"></i> Location Found! You can now search.';
        statusMessage.className = "geolocation-status success";
    }

    function errorCallback(error) {
        let errorMessage;
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "Location access denied. Please allow location to use 'Search Centers'.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable (check GPS).";
                break;
            case error.TIMEOUT:
                errorMessage = "Timed out fetching location. Try clicking 'Search' again.";
                break;
            default:
                errorMessage = "Error getting location. Please try again.";
        }
        statusMessage.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${errorMessage}`;
        statusMessage.className = "geolocation-status error";
        searchButton.disabled = true;
    }
    
    // Start location tracking when the page loads
    getBloodStockNearby();


    /**
     * Step 2: Handle Form Submission and API Call
     */
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        if (!userLatitude || !userLongitude) {
            alert("Location data is not yet available. Please wait or ensure location is enabled.");
            getBloodStockNearby();
            return;
        }

        // 1. Prepare UserData Payload
        const UserData = {
            "Lat": latInput.value,
            "Long": longInput.value,
            "dis": document.getElementById("distance").value,
            "bloodgroup": document.getElementById("bloodGroup").value,
            "Component": "" // Search for all blood components
        };
        
        // Show loading state
        searchButton.disabled = true;
        searchButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';
        resultsContainer.innerHTML = '<p class="initial-message"><i class="fa-solid fa-spinner fa-spin"></i> Loading data from e-Rakt Kosh...</p>';


        // 2. Perform the POST API call with mandatory API Key
        fetch(API_BASE_URL + API_ENDPOINT_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // MANDATORY API KEY: MUST BE REPLACED
                'X-API-KEY': API_KEY, 
            },
            body: JSON.stringify(UserData)
        })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                 // Handle Authentication Failure
                throw new Error("Authorization Failed (401/403). Did you set your X-API-KEY correctly?");
            }
            if (!response.ok) {
                // Handle other HTTP errors
                throw new Error(`API Error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 3. Process and display results
            renderResults(data);
        })
        .catch(error => {
            console.error('API Call Error:', error);
            resultsContainer.innerHTML = `<p class="initial-message error" style="color: #d32f2f; font-weight: bold;"><i class="fa-solid fa-circle-exmark"></i> Error: ${error.message}</p>`;
        })
        .finally(() => {
            // Re-enable button after call completes
            searchButton.disabled = false;
            searchButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Search Centers';
        });
    });


    /**
     * Step 3: Render Results (Donation Center Cards)
     */
    function renderResults(data) {
        resultsContainer.innerHTML = ""; 

        if (data && data.payload && Array.isArray(data.payload) && data.payload.length > 1) {
            // The first item is usually the metadata, so we take the rest.
            const centerList = data.payload.slice(1);
            
            if (centerList.length === 0) {
                 resultsContainer.innerHTML = '<p class="initial-message"><i class="fa-solid fa-heart-crack"></i> No donation centers found in the specified radius.</p>';
                 return;
            }
            
            document.getElementById("resultsTitle").textContent = `${centerList.length} Blood Banks Found Nearby`;

            centerList.forEach(center => {
                
                // Check if any blood group is explicitly listed as available
                const hasStock = center.available_WithQty && center.available_WithQty.trim().length > 0 && center.available_WithQty !== " : 0";

                let stockStatusHtml = "";
                let cardClass = "";

                if (hasStock) {
                    stockStatusHtml = `<p class="availability-stock available">
                                            <i class="fa-solid fa-droplet"></i> **Available Stock:** ${center.available_WithQty.replace(/,\s*/g, ' | ')}
                                        </p>`;
                    cardClass = 'has-stock';
                } else {
                    stockStatusHtml = `<p class="availability-stock not-reported">
                                            <i class="fa-solid fa-triangle-exclamation"></i> Stock Not Reported or Fully Depleted
                                        </p>`;
                    cardClass = 'no-stock';
                }

                const cardHtml = `
                    <div class="center-card ${cardClass}">
                        <div class="card-header">
                            <h3>${center.name || 'Blood Center Name N/A'}</h3>
                            <p class="type">${center.type || 'Institution Type N/A'}</p>
                        </div>
                        <div class="card-info">
                            <p><i class="fa-solid fa-map-marker-alt"></i> ${center.add || 'Address N/A'}</p>
                            <p><i class="fa-solid fa-phone"></i> ${center.ph || 'Contact N/A'}</p>
                            
                            <p class="distance"><i class="fa-solid fa-route"></i> **${center.dis} km** away</p>
                            ${stockStatusHtml}
                        </div>
                    </div>
                `;
                resultsContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
        } else {
             resultsContainer.innerHTML = '<p class="initial-message"><i class="fa-solid fa-exclamation-circle"></i> No centers found or invalid API response.</p>';
        }
    }
});