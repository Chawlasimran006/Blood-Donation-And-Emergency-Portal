document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("donateForm");
    const thankYouMessage = document.getElementById("thankYouMessage");

    // FUNCTION: Display donors
    // -------------------------
    function displayDonors() {
        const donorListDiv = document.getElementById("donorList");
        const allDonors = JSON.parse(localStorage.getItem("donors")) || [];
        const donors = allDonors.slice(-5).reverse(); // show last 5 donors

        if (donors.length === 0) {
            donorListDiv.innerHTML = "<p>No donors registered yet.</p>";
            return;
        }

        donorListDiv.innerHTML = donors.map(donor => `
            <div class="donor-card">
                <p><strong>${donor.name}</strong> (${donor.bloodGroup})</p>
                <p>${donor.location} | ${donor.contact}</p>
            </div>
        `).join("");
    }


    // Display donors on page load
    displayDonors();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // JS Validation
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const age = parseInt(document.getElementById("age").value);
        const contact = document.getElementById("contact_number").value.trim();
        const bloodGroup = document.getElementById("blood_group").value;

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            alert("Name should contain only letters.");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert("Enter a valid email address.");
            return;
        }
        if (isNaN(age) || age < 18 || age > 65) {
            alert("Age must be between 18 and 60.");
            return;
        }
        if (!/^[0-9]{10}$/.test(contact)) {
            alert("Contact number must be 10 digits.");
            return;
        }
        if (bloodGroup === "") {
            alert("Please select a blood group.");
            return;
        }
        // Get form values
        const donorData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            bloodGroup: document.getElementById("blood_group").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            location: document.getElementById("location").value,
            contact: document.getElementById("contact_number").value
        };

        // Get existing donors from localStorage or create empty array
        let donors = JSON.parse(localStorage.getItem("donors")) || [];

        // Add new donor to the array
        donors.push(donorData);

        // Save updated donors list back to localStorage
        localStorage.setItem("donors", JSON.stringify(donors));

        // Show thank-you message
        thankYouMessage.style.display = "block";

        displayDonors();

        // Reset the form
        form.reset();
    });
});
