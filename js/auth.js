// User Authentication System - Real-time with localStorage persistence
class Auth {
    // Signup - Create new account
    static signup(fullname, username, email, phone, password, profilePic) {
        try {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Validation
            if (!fullname || !username || !email || !phone || !password) {
                throw new Error('All fields are required');
            }

            // Check if username exists
            if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                throw new Error('Username already exists! Please choose another one.');
            }

            // Check if email exists
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                throw new Error('Email already registered! Please use another email or login.');
            }

            // Validate phone (Tanzania format)
            const phoneRegex = /^(?:\+255|0)[0-9]{9}$/;
            if (!phoneRegex.test(phone)) {
                throw new Error('Please enter a valid Tanzania phone number (e.g., +255XXXXXXXXX or 0XXXXXXXXX)');
            }

            // Validate password strength
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Create new user with unique ID
            const newUser = {
                id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                fullname: fullname.trim(),
                username: username.toLowerCase().trim(),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                password: this.hashPassword(password),
                profilePic: profilePic || 'https://files.catbox.moe/el0qlh.jpeg',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true,
                preferences: {
                    theme: 'dark',
                    notifications: true
                }
            };

            // Save user
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto login after signup
            this.login(username, password);
            return { success: true, message: 'Account created successfully!' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Login - Only works if account exists
    static login(username, password) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const hashedPassword = this.hashPassword(password);

            // Find user by username OR email
            const user = users.find(u => 
                (u.username === username.toLowerCase() || 
                 u.email === username.toLowerCase()) && 
                u.password === hashedPassword
            );

            if (!user) {
                throw new Error('Login failed! Account does not exist or wrong password. Please sign up first.');
            }

            // Update last login
            user.lastLogin = new Date().toISOString();
            user.lastActive = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(users));

            // Set current session (remove password)
            const { password: pwd, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('lastActivity', Date.now().toString());

            // Trigger storage event for other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'isAuthenticated',
                newValue: 'true'
            }));

            return { success: true, message: 'Login successful!', user: userWithoutPassword };
        } catch (error) {
            return { success: false, message: error.message };
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
        return hash.toString(16) + '_' + password.length + '_' + (hash * 999).toString(16);
    }

    // Logout
    static logout() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            // Update last active
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].lastActive = new Date().toISOString();
                localStorage.setItem('users', JSON.stringify(users));
            }
        }

        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('lastActivity');
        
        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'isAuthenticated',
            newValue: null
        }));
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
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        const user = this.getCurrentUser();
        
        if (!isAuth || !user) {
            return false;
        }

        // Check session timeout (30 minutes)
        const lastActivity = localStorage.getItem('lastActivity');
        if (lastActivity && (Date.now() - parseInt(lastActivity)) > 30 * 60 * 1000) {
            this.logout();
            return false;
        }

        return true;
    }

    // Update last activity
    static updateActivity() {
        localStorage.setItem('lastActivity', Date.now().toString());
    }

    // Redirect to login if not authenticated
    static requireAuth() {
        if (!this.isAuthenticated()) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Update user profile
    static updateProfile(updates) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) throw new Error('Not authenticated');

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);

            if (userIndex === -1) throw new Error('User not found');

            // Update user (but don't overwrite password)
            const updatedUser = { 
                ...users[userIndex], 
                ...updates,
                password: users[userIndex].password // Keep original password
            };
            users[userIndex] = updatedUser;

            // Save
            localStorage.setItem('users', JSON.stringify(users));

            // Update current session
            const { password, ...userWithoutPassword } = updatedUser;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

            return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Change password
    static changePassword(oldPassword, newPassword) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) throw new Error('Not authenticated');

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);

            if (userIndex === -1) throw new Error('User not found');

            // Verify old password
            if (users[userIndex].password !== this.hashPassword(oldPassword)) {
                throw new Error('Current password is incorrect');
            }

            // Validate new password
            if (newPassword.length < 6) {
                throw new Error('New password must be at least 6 characters');
            }

            // Update password
            users[userIndex].password = this.hashPassword(newPassword);
            localStorage.setItem('users', JSON.stringify(users));

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Get all users (admin only)
    static getAllUsers() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.map(({ password, ...user }) => user); // Remove passwords
    }

    // Delete user (admin only)
    static deleteUser(userId) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const filteredUsers = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            return { success: true, message: 'User deleted successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

// Login form handler
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const result = Auth.login(username, password);
    
    if (result.success) {
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showNotification(result.message, 'error');
    }
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
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    const result = Auth.signup(fullname, username, email, phone, password, profilePic);
    
    if (result.success) {
        showNotification('Account created! Redirecting to dashboard...', 'success');
    } else {
        showNotification(result.message, 'error');
    }
}

// Logout handler
function handleLogout() {
    Auth.logout();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotif = document.querySelector('.auth-notification');
    if (existingNotif) existingNotif.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#3fb68b' : type === 'error' ? '#ff4444' : '#b085f5'};
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // For dashboard pages, check auth
    if (window.location.pathname.includes('dashboard') || 
        window.location.pathname.includes('/menus/')) {
        Auth.requireAuth();
    }
    
    // Update activity on any user interaction
    if (Auth.isAuthenticated()) {
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, () => Auth.updateActivity());
        });
    }
});