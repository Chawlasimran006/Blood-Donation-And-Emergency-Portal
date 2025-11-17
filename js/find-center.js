const GOOGLE_PLACES_API_KEY = 'AIzaSyDUaCSzEogPhRKeHDEqmx6UMS2iHzXnvrY';

// DOM Load
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("centerSearchForm");
    const resultsContainer = document.getElementById("resultsContainer");
    const resultsSection = document.getElementById("resultsSection");
    const latInput = document.getElementById("latitude");
    const longInput = document.getElementById("longitude");
    const searchButton = document.getElementById("searchButton");
    const locationStatus = document.getElementById("locationStatus");

    let userLatitude = null;
    let userLongitude = null;

    // 🔥 Use only Browser GPS
    function getBrowserLocation() {
        updateLocationStatus("loading", "Getting your precise location...");

        if (!navigator.geolocation) {
            updateLocationStatus("error", "Browser does not support location");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;

                latInput.value = userLatitude;
                longInput.value = userLongitude;

                updateLocationStatus("success", "Location detected successfully");
            },
            (error) => {
                updateLocationStatus("error", "Please allow location permission and reload");
                console.error("GPS Error", error);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    // Start initial location fetch
    getBrowserLocation();

    // Retry button
    window.retryLocation = getBrowserLocation;

    // Handle search
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const radiusKm = parseFloat(document.getElementById("distance").value);
        const centerType = document.getElementById("centerType").value;

        searchBloodCenters(radiusKm, centerType);
    });

    // 🔥 WORKING GOOGLE PLACES SEARCH
    function searchBloodCenters(radiusKm, centerType) {

        if (!userLatitude || !userLongitude) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <p>Location not detected. Please allow permission.</p>
                </div>`;
            return;
        }

        searchButton.disabled = true;
        searchButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Searching...</span>';

        resultsSection.style.display = "block";
        resultsContainer.innerHTML = '<div class="loading-message"><i class="fa-solid fa-spinner fa-spin"></i><p>Finding centers...</p></div>';

        if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
            resultsContainer.innerHTML = '<div class="error-message"><p>Google Maps API failed to load</p></div>';
            return;
        }

        // Create invisible map for Places API
        const map = new google.maps.Map(document.createElement("div"));
        const service = new google.maps.places.PlacesService(map);

        const radiusMeters = Math.min(radiusKm * 1000, 50000);

        // Keywords (optimized)
        let keyword = "blood bank";
        if (centerType === "Blood Donation Center") keyword = "blood donation center";
        else if (centerType === "Hospital") keyword = "hospital blood bank";

        // Remove INVALID type
        const request = {
            location: new google.maps.LatLng(userLatitude, userLongitude),
            radius: radiusMeters,
            keyword: keyword
        };

        service.nearbySearch(request, (results, status) => {

            searchButton.disabled = false;
            searchButton.innerHTML = '<i class="fa-solid fa-search"></i><span>Search Centers</span>';

            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                resultsContainer.innerHTML = `
                    <div class="error-message">
                        <p>No results found: ${status}</p>
                    </div>`;
                return;
            }

            displayResults(results, radiusKm);
        });
    }

    // Display results
    function displayResults(places, maxDistanceKm) {
        resultsContainer.innerHTML = "";

        let filteredPlaces = places.map(place => {
            const distance = calculateDistance(
                userLatitude,
                userLongitude,
                place.geometry.location.lat(),
                place.geometry.location.lng()
            );

            return { place, distance };
        })
        .filter(item => item.distance <= maxDistanceKm)
        .sort((a, b) => a.distance - b.distance);

        if (filteredPlaces.length === 0) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>No centers found within ${maxDistanceKm} km</p>
                </div>`;
            return;
        }

        resultsContainer.innerHTML = `<h3>Found ${filteredPlaces.length} centers within ${maxDistanceKm} km</h3>`;

        filteredPlaces.forEach(({ place, distance }) => {

            const card = document.createElement("div");
            card.className = "center-card";

            const isOpen = place.opening_hours ? place.opening_hours.open_now : null;

            card.innerHTML = `
                <div class="card-header">
                    <h3 class="center-name">${place.name || "Unknown Center"}</h3>
                    <span class="distance-badge">${distance.toFixed(2)} km</span>
                </div>
                <div class="card-body">
                    <p class="center-address"><i class="fa-solid fa-location-dot"></i> ${place.vicinity || "Address not available"}</p>
                    ${place.rating ? `<p class="center-rating"><i class="fa-solid fa-star"></i> ${place.rating}/5</p>` : ""}
                    ${isOpen !== null ? `<p class="center-status ${isOpen ? "open" : "closed"}"><i class="fa-solid fa-clock"></i> ${isOpen ? "Open Now" : "Closed"}</p>` : ""}
                </div>
                <div class="card-actions">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank" class="btn-directions">
                        <i class="fa-solid fa-route"></i> Directions
                    </a>
                </div>
            `;

            resultsContainer.appendChild(card);
        });
    }

    // Distance calculation
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Update location status
    function updateLocationStatus(status, message) {
        if (!locationStatus) return;

        locationStatus.className = "location-status " + status;

        let icon =
            status === "loading"
                ? '<i class="fa-solid fa-spinner fa-spin"></i>'
                : status === "success"
                ? '<i class="fa-solid fa-check-circle"></i>'
                : '<i class="fa-solid fa-exclamation-circle"></i>';

        locationStatus.innerHTML = `${icon}<span>${message}</span>`;
    }

});
