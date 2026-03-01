// User Authentication System - No direct login without account
class Auth {
    // Signup - Create new account (REQUIRED)
    static signup(fullname, username, email, phone, password, profilePic) {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        const usernameExists = users.some(u => 
            u.username.toLowerCase() === username.toLowerCase()
        );
        
        if (usernameExists) {
            alert('Username already exists! Please choose another one.');
            return false;
        }
        
        // Check if email already exists
        const emailExists = users.some(u => 
            u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (emailExists) {
            alert('Email already registered! Please use another email or login.');
            return false;
        }
        
        // Validate phone (Tanzania format)
        if (!phone.match(/^(\+255|0)[0-9]{9}$/)) {
            alert('Please enter a valid Tanzania phone number (e.g., +255XXXXXXXXX or 0XXXXXXXXX)');
            return false;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            fullname: fullname.trim(),
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            password: this.hashPassword(password),
            profilePic: profilePic || 'https://files.catbox.moe/el0qlh.jpeg',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after signup
        this.login(username, password);
        return true;
    }
    
    // Login - ONLY works if account exists
    static login(username, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const hashedPassword = this.hashPassword(password);
        
        // Find user by username OR email
        const user = users.find(u => 
            (u.username === username.toLowerCase() || 
             u.email === username.toLowerCase()) && 
            u.password === hashedPassword
        );
        
        if (user) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(users));
            
            // Set current session (remove password)
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            localStorage.setItem('isAuthenticated', 'true');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            return true;
        } else {
            alert('Login failed! Account does not exist or wrong password. Please sign up first.');
            return false;
        }
    }
    
    // Simple hash (for demo only - use bcrypt in production)
    static hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16) + password.length;
    }
    
    // Logout
    static logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    }
    
    // Get current logged in user
    static getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) return null;
        
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
    
    // Check if user is authenticated
    static isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true' && 
               this.getCurrentUser() !== null;
    }
    
    // Redirect to login if not authenticated
    static requireAuth() {
        if (!this.isAuthenticated()) {
            alert('Please login first to access this page!');
            window.location.href = '../login.html';
            return false;
        }
        return true;
    }
    
    // Update user profile
    static updateProfile(updates) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) return false;
        
        // Update user
        const updatedUser = { ...users[userIndex], ...updates };
        users[userIndex] = updatedUser;
        
        // Save
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current session
        const { password, ...userWithoutPassword } = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        return true;
    }
}

// Login form handler
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    Auth.login(username, password);
}

// Signup form handler
function handleSignup(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('signupFullname').value;
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const profilePic = document.getElementById('signupProfilePic')?.value;
    
    // Validation
    if (!fullname || !username || !email || !phone || !password) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    Auth.signup(fullname, username, email, phone, password, profilePic);
}

// Logout handler
function handleLogout() {
    Auth.logout();
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // For dashboard pages, check auth
    if (window.location.pathname.includes('dashboard') || 
        window.location.pathname.includes('/menus/')) {
        Auth.requireAuth();
    }
});