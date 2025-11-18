// Authentication Manager
const AUTH_API = 'http://localhost:5000/api/auth';

// Check if user is logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// Check authentication status
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        // No token, redirect to React login route
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
            window.location.href = '/login';
        }
        return false;
    }
    
    // Verify token with server
    try {
        const response = await fetch(`${AUTH_API}/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            // User is authenticated
            updateUIWithUser(data.user);
            return true;
        } else {
            // Token is invalid
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                window.location.href = '/login';
            }
            return false;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

// Login function
async function login(email, password) {
    try {
        const response = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);
            
            // Redirect to React donation route
            window.location.href = '/donate';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

// Signup function
async function signup(name, email, password) {
    try {
        const response = await fetch(`${AUTH_API}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userEmail', data.user.email);
            
            // Redirect to React donate route
            window.location.href = '/donate';
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
}

// Update UI with user info
function updateUIWithUser(user) {
    const userName = user?.name || localStorage.getItem('userName');
    
    if (userName) {
        // Update navbar with user name
        const loginBtn = document.querySelector('.login');
        const signupBtn = document.querySelector('.signup');
        
        if (loginBtn && signupBtn) {
            loginBtn.innerHTML = `<span>Welcome, ${userName}</span>`;
            signupBtn.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;
        }
    }
}

// Make functions available globally
window.checkAuth = checkAuth;
window.login = login;
window.signup = signup;
window.logout = logout;
