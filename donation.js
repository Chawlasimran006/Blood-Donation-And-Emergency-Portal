let btn = document.querySelector('#toggle-bnt');
let menu = document.querySelector('.menu');
let count = 1;
btn.addEventListener('click',()=>{
    if(count == 1){
       menu.style.left = "0";
       count = 1-count;
     }
     else if(count == 0){
       menu.style.left = "-100%";
       count = 1-count;
     }
});



// Add this code block into your donation.js file

document.addEventListener("DOMContentLoaded", function () {
    // ... (your existing donateForm submit logic) ...

    const findCenterDiv = document.getElementById("center");
    
    // Check if the element exists before adding the listener
    if (findCenterDiv) {
        findCenterDiv.style.cursor = 'pointer'; // Optional: change cursor to show it's clickable

        findCenterDiv.addEventListener("click", function () {
            // Redirect the user to the new page
            window.location.href = "find-center.html";
        });
    }
});
