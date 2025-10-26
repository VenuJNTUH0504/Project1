/**
 * Signup form handler
 * This script handles the signup form submission and communicates with the server
 */
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user && user.id) {
                    // User is already logged in, show a message
                    showMessage(`You are already logged in as ${user.username || 'User'}. Please log out first to create a new account.`, 'info');
                    
                    // Disable the form
                    const inputs = signupForm.querySelectorAll('input, select, button');
                    inputs.forEach(input => {
                        input.disabled = true;
                    });
                    
                    // Add a logout button
                    const logoutBtn = document.createElement('button');
                    logoutBtn.textContent = 'Logout';
                    logoutBtn.className = 'signup-btn';
                    logoutBtn.style.marginTop = '20px';
                    logoutBtn.style.backgroundColor = '#ff5555';
                    
                    logoutBtn.addEventListener('click', function() {
                        localStorage.removeItem('user');
                        sessionStorage.removeItem('user');
                        location.reload();
                    });
                    
                    signupForm.parentNode.appendChild(logoutBtn);
                    
                    // Add a back to login button
                    const loginBtn = document.createElement('button');
                    loginBtn.textContent = 'Go to Login';
                    loginBtn.className = 'signup-btn';
                    loginBtn.style.marginTop = '10px';
                    loginBtn.style.backgroundColor = '#3498db';
                    
                    loginBtn.addEventListener('click', function() {
                        window.location.href = 'login.html';
                    });
                    
                    signupForm.parentNode.appendChild(loginBtn);
                    
                    return; // Stop further execution
                }
            } catch (e) {
                console.error('Error parsing stored user data:', e);
                // Clear invalid data
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
            }
        }
        
        // Add input validation
        const usernameInput = document.querySelector('input[name="username"]');
        if (usernameInput) {
            usernameInput.addEventListener('blur', function() {
                const username = this.value.trim();
                if (username) {
                    // Check if username is available
                    fetch(`/check-username?username=${encodeURIComponent(username)}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.exists) {
                                showInputError(this, 'Username already taken');
                            } else {
                                clearInputError(this);
                            }
                        })
                        .catch(error => {
                            console.error('Error checking username:', error);
                        });
                }
            });
        }
        
        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const email = this.value.trim();
                if (email) {
                    // Validate email format
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        showInputError(this, 'Please enter a valid email address');
                    } else {
                        // Check if email is available
                        fetch(`/check-email?email=${encodeURIComponent(email)}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.exists) {
                                    showInputError(this, 'Email already registered');
                                } else {
                                    clearInputError(this);
                                }
                            })
                            .catch(error => {
                                console.error('Error checking email:', error);
                            });
                    }
                }
            });
        }
        
        const passwordInput = document.querySelector('input[name="password"]');
        const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
        
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                
                // Check password strength
                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasNumbers = /\d/.test(password);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                const isLongEnough = password.length >= 8;
                
                let strength = 0;
                let message = '';
                
                if (hasUpperCase) strength++;
                if (hasLowerCase) strength++;
                if (hasNumbers) strength++;
                if (hasSpecialChar) strength++;
                if (isLongEnough) strength++;
                
                if (password.length === 0) {
                    message = '';
                } else if (strength < 3) {
                    message = 'Weak password';
                    this.style.borderColor = '#ff4444';
                } else if (strength < 5) {
                    message = 'Moderate password';
                    this.style.borderColor = '#ffbb33';
                } else {
                    message = 'Strong password';
                    this.style.borderColor = '#00C851';
                }
                
                // Update password strength indicator
                let strengthIndicator = document.getElementById('password-strength');
                if (!strengthIndicator && message) {
                    strengthIndicator = document.createElement('div');
                    strengthIndicator.id = 'password-strength';
                    strengthIndicator.style.fontSize = '0.8rem';
                    strengthIndicator.style.marginTop = '5px';
                    strengthIndicator.style.textAlign = 'right';
                    this.parentNode.appendChild(strengthIndicator);
                }
                
                if (strengthIndicator) {
                    strengthIndicator.textContent = message;
                    
                    if (message === 'Weak password') {
                        strengthIndicator.style.color = '#ff4444';
                    } else if (message === 'Moderate password') {
                        strengthIndicator.style.color = '#ffbb33';
                    } else if (message === 'Strong password') {
                        strengthIndicator.style.color = '#00C851';
                    }
                }
                
                // Check if passwords match when both fields have values
                if (confirmPasswordInput && confirmPasswordInput.value) {
                    checkPasswordsMatch();
                }
            });
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
        }
        
        function checkPasswordsMatch() {
            if (passwordInput.value !== confirmPasswordInput.value) {
                showInputError(confirmPasswordInput, 'Passwords do not match');
            } else {
                clearInputError(confirmPasswordInput);
            }
        }
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const fullname = document.querySelector('input[name="fullName"]').value.trim();
            const email = document.querySelector('input[name="email"]').value.trim();
            const username = document.querySelector('input[name="username"]').value.trim();
            const password = document.querySelector('input[name="password"]').value;
            const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;
            const learningPath = document.querySelector('select[name="learningPath"]').value;
            const termsChecked = document.querySelector('input[name="terms"]').checked;
            
            // Validate form data
            let isValid = true;
            
            if (!fullname) {
                showInputError(document.querySelector('input[name="fullName"]'), 'Full name is required');
                isValid = false;
            }
            
            if (!email) {
                showInputError(document.querySelector('input[name="email"]'), 'Email is required');
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showInputError(document.querySelector('input[name="email"]'), 'Please enter a valid email address');
                    isValid = false;
                }
            }
            
            if (!username) {
                showInputError(document.querySelector('input[name="username"]'), 'Username is required');
                isValid = false;
            }
            
            if (!password) {
                showInputError(document.querySelector('input[name="password"]'), 'Password is required');
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                showInputError(document.querySelector('input[name="confirmPassword"]'), 'Passwords do not match');
                isValid = false;
            }
            
            if (!learningPath) {
                showInputError(document.querySelector('select[name="learningPath"]'), 'Please select a learning path');
                isValid = false;
            }
            
            if (!termsChecked) {
                showMessage('You must agree to the Terms of Service and Privacy Policy', 'error');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';
            
            // Send signup request to server
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    username, 
                    password, 
                    email, 
                    fullname,
                    learningPath 
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Signup failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Signup successful
                showMessage('Account created successfully! Redirecting...', 'success');
                
                // Redirect to success page after a short delay
                setTimeout(() => {
                    window.location.href = 'signup-success.html';
                }, 1500);
            })
            .catch(error => {
                // Signup failed
                showMessage(error.message || 'Signup failed. Please try again.', 'error');
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }
    
    /**
     * Display a message to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of message ('success', 'error', or 'info')
     */
    function showMessage(message, type = 'info') {
        // Check if a message element already exists
        let messageElement = document.querySelector('.form-message');
        
        // If not, create one
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            messageElement.style.padding = '10px';
            messageElement.style.marginBottom = '15px';
            messageElement.style.borderRadius = '5px';
            messageElement.style.textAlign = 'center';
            messageElement.style.fontWeight = 'bold';
            messageElement.style.transition = 'opacity 0.5s ease';
            
            // Insert it before the form
            const header = document.querySelector('.signup-header');
            if (header) {
                header.parentNode.insertBefore(messageElement, header.nextSibling);
            } else {
                signupForm.parentNode.insertBefore(messageElement, signupForm);
            }
        }
        
        // Set message content and styling based on type
        messageElement.textContent = message;
        
        if (type === 'error') {
            messageElement.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            messageElement.style.color = '#ff0000';
        } else if (type === 'success') {
            messageElement.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
            messageElement.style.color = '#00aa00';
        } else {
            messageElement.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
            messageElement.style.color = '#0000ff';
        }
        
        // Make sure the element is visible
        messageElement.style.opacity = '1';
        
        // Automatically remove the message after 5 seconds for success/error messages
        if (type !== 'info') {
            setTimeout(() => {
                messageElement.style.opacity = '0';
                
                // Remove the element after fade out
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.parentNode.removeChild(messageElement);
                    }
                }, 500);
            }, 5000);
        }
    }
    
    /**
     * Show an error message for a specific input field
     * @param {HTMLElement} inputElement - The input element with the error
     * @param {string} message - The error message to display
     */
    function showInputError(inputElement, message) {
        // Clear any existing error
        clearInputError(inputElement);
        
        // Add error styling to the input
        inputElement.style.borderColor = '#ff4444';
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        errorElement.style.textAlign = 'right';
        
        // Add error message after the input
        inputElement.parentNode.appendChild(errorElement);
    }
    
    /**
     * Clear error styling and message for an input field
     * @param {HTMLElement} inputElement - The input element to clear errors for
     */
    function clearInputError(inputElement) {
        // Remove error styling
        inputElement.style.borderColor = '';
        
        // Remove error message if it exists
        const errorElement = inputElement.parentNode.querySelector('.input-error');
        if (errorElement) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }
});