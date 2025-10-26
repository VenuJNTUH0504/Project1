// This file contains the main functionality of the application, including navigation and general scripts.

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetPage = this.getAttribute('href');
            if (targetPage) {
                event.preventDefault();
                window.location.href = targetPage;
            }
        });
    });

    // Check if user is logged in and update UI accordingly
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navbarAuthButtons = document.getElementById('navbar-auth-buttons');

    if (isLoggedIn) {
        if (navbarAuthButtons) {
            navbarAuthButtons.style.display = 'none';
        }
    } else {
        if (navbarAuthButtons) {
            navbarAuthButtons.style.display = 'flex';
        }
    }
});