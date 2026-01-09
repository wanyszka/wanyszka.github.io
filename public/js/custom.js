// Array of profile images
const profileImages = [
    '/images/profile.jpeg',
    '/images/profile2.jpeg',
];

// Function to get random image
function getRandomProfileImage() {
    const randomIndex = Math.floor(Math.random() * profileImages.length);
    return profileImages[randomIndex];
}

// Change profile image on page load - try multiple selectors
document.addEventListener('DOMContentLoaded', function() {
    // Try multiple possible selectors for the profile image
    const selectors = [
        '.profile-mode img',
        '.home-info img',
        '.profile-img',
        'img[alt*="profile"]',
        'img[src*="profile"]',
        '.profile-mode .profile-img',
        'img[width="300"]'
    ];

    let profileImg = null;
    for (let selector of selectors) {
        profileImg = document.querySelector(selector);
        if (profileImg) {
            console.log('Found profile image with selector:', selector);
            break;
        }
    }

    if (profileImg) {
        profileImg.src = getRandomProfileImage();
        console.log('Profile image changed to:', profileImg.src);
    } else {
        console.log('Profile image not found');
    }
});

// Toggle content function
function toggleContent(id) {
    // Get the current publication section
    var currentSection = document.getElementById(id).closest('.publication-section') || document.getElementById(id).parentElement;

    // Find all expandable content in the same publication section
    var allContents = currentSection.querySelectorAll('.expandable-content');

    // Close all other expandable contents in this section
    allContents.forEach(function(content) {
        if (content.id !== id) {
            content.style.display = "none";
        }
    });

    // Toggle the clicked content
    var content = document.getElementById(id);
    if (content.style.display === "none") {
        content.style.display = "block";
    } else {
        content.style.display = "none";
    }
}

// Download file function
function downloadFile(url) {
    window.open(url, '_blank');
}
