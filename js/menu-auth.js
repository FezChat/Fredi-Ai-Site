// Authentication check for all menu pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!Auth.isAuthenticated()) {
        alert('Please login first to access this page!');
        window.location.href = '../login.html';
        return;
    }
    
    // Load user info in sidebar
    loadUserInfo();
});

function loadUserInfo() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    // Update sidebar user info if elements exist
    const sidebarName = document.getElementById('sidebarName');
    const sidebarEmail = document.getElementById('sidebarEmail');
    const avatarInitials = document.getElementById('avatarInitials');
    
    if (sidebarName) sidebarName.textContent = user.fullname || user.username;
    if (sidebarEmail) sidebarEmail.textContent = user.email;
    
    if (avatarInitials) {
        avatarInitials.textContent = (user.fullname || user.username).charAt(0).toUpperCase();
    }
}

// Logout function for menu pages
function handleLogout() {
    Auth.logout();
}