document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        
        // Basic validation
        if (!username || !password) {
            alert('Username and password are required');
            return;
        }
        
        // Send login request to server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            // Login successful
            alert('Login successful!');
            // Store user info in localStorage (optional)
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirect to success page
            window.location.href = 'login-success.html';
        })
        .catch(error => {
            // Login failed
            alert(error.message);
        });
    });
});