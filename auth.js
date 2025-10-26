// File: /project/project/src/js/auth.js

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(signupForm);
            const userData = {
                username: formData.get('username'),
                password: formData.get('password'),
                fullname: formData.get('fullname'),
                email: formData.get('email')
            };

            // Save user data to localStorage (for demo purposes)
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to the main page or dashboard
            window.location.href = 'index.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');

            // Simulate user authentication (for demo purposes)
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.username === username && storedUser.password === password) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }
});