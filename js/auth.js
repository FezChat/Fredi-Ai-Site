// User Authentication (Local Storage based - no API)
class Auth {
    static signup(fullname, username, email, phone, password, profilePic) {
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existing = users.find(u => u.username === username || u.email === email);
        
        if (existing) {
            alert('Username or email already exists!');
            return false;
        }
        
        // Create new user
        const user = {
            id: Date.now(),
            fullname,
            username,
            email,
            phone,
            password, // In real app, hash this!
            profilePic: profilePic || 'https://files.catbox.moe/el0qlh.jpeg',
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login
        this.login(username, password);
        return true;
    }
    
    static login(username, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
            return true;
        } else {
            alert('Invalid credentials! (Try any username/password for demo)');
            // Demo: allow any login
            const demoUser = {
                fullname: username || 'Fredi Ezra',
                username: username || 'fredi',
                email: 'frediezra360@gmail.com',
                phone: '+255752593977'
            };
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            window.location.href = 'dashboard.html';
            return false;
        }
    }
    
    static logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
    
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
    
    static updateUserProfile(updates) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        Object.assign(user, updates);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update in users list
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
        return true;
    }
}

// Login function
function loginUser() {
    const username = document.getElementById('username')?.value || 'demo';
    const password = document.getElementById('password')?.value || 'pass';
    Auth.login(username, password);
}

// Signup function
function signupUser() {
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const profilePic = document.getElementById('profilePic')?.value;
    
    if (!fullname || !username || !email || !phone || !password) {
        alert('Please fill all fields');
        return;
    }
    
    Auth.signup(fullname, username, email, phone, password, profilePic);
}

// Logout function
function logout() {
    Auth.logout();
}

// Check authentication on dashboard pages
function checkAuth() {
    const user = Auth.getCurrentUser();
    if (!user && window.location.pathname.includes('dashboard')) {
        window.location.href = 'login.html';
    }
    return user;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (user) {
        // Update UI with user info
        const nameEl = document.getElementById('displayName');
        const avatarEl = document.getElementById('userAvatar');
        
        if (nameEl) nameEl.textContent = user.fullname || user.username;
        if (avatarEl) avatarEl.textContent = (user.fullname || user.username).charAt(0).toUpperCase();
    }
});