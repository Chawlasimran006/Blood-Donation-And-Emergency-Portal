document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("donateForm");
    const thankYouMessage = document.getElementById("thankYouMessage");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

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

        // Reset the form
        form.reset();
    });
});
