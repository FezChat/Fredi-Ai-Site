// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Load GitHub projects
    loadDashboardProjects('Fred1e');
    
    // Start rotating messages
    startMessageRotation();
});

// Load logged in user data
function loadUserData() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    // Update UI with user info
    document.getElementById('welcomeName').textContent = user.fullname || user.username;
    document.getElementById('sidebarName').textContent = user.fullname || user.username;
    document.getElementById('sidebarEmail').textContent = user.email;
    document.getElementById('sidebarPhone').textContent = user.phone;
    
    // Handle avatar
    const avatarInitials = document.getElementById('avatarInitials');
    const profileImage = document.getElementById('profileImage');
    const profileThumb = document.getElementById('profileThumb');
    
    if (user.profilePic && user.profilePic !== 'https://files.catbox.moe/el0qlh.jpeg') {
        profileImage.src = user.profilePic;
        profileImage.style.display = 'block';
        avatarInitials.style.display = 'none';
        profileThumb.src = user.profilePic;
    } else {
        avatarInitials.textContent = (user.fullname || user.username).charAt(0).toUpperCase();
        profileThumb.src = 'https://files.catbox.moe/el0qlh.jpeg';
    }
}

// Rotating messages
const messages = [
    "⭐ How would you rate FEE-ONLINE?",
    "📱 Download our Android app!",
    "🤖 WhatsApp Bot only $1!",
    "💻 Need a website? Contact me!",
    "🔗 Join WhatsApp channel for updates",
    "🇹🇿 Developer from Tanzania"
];

function startMessageRotation() {
    let index = 0;
    const msgElement = document.getElementById('rotatingMessage');
    
    setInterval(() => {
        if (msgElement) {
            index = (index + 1) % messages.length;
            msgElement.textContent = messages[index];
        }
    }, 5000);
}

// Load GitHub projects
async function loadDashboardProjects(username) {
    const container = document.getElementById('dashboardProjects');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading projects...</div>';
    
    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`);
        if (!res.ok) throw new Error('Failed to fetch');
        
        const repos = await res.json();
        
        container.innerHTML = '';
        
        if (repos.length === 0) {
            container.innerHTML = '<p>No repositories found</p>';
            return;
        }
        
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                <p>${repo.description || 'No description available'}</p>
                <div class="repo-stats">
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-fork"></i> ${repo.forks_count}</span>
                    <span><i class="fas fa-code"></i> ${repo.language || 'Unknown'}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<p>Error loading projects. Please try again later.</p>';
        console.error('GitHub API error:', error);
    }
}

// Search GitHub user
async function searchGithubUser() {
    const username = document.getElementById('githubUserSearch').value.trim();
    if (!username) {
        alert('Please enter a GitHub username');
        return;
    }
    
    await loadDashboardProjects(username);
}

// Profile menu toggle
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('show');
}

// Close profile menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('profileMenu');
    const profileBtn = document.querySelector('.profile-dropdown');
    
    if (menu && profileBtn && !profileBtn.contains(event.target)) {
        menu.classList.remove('show');
    }
});

// Profile functions
function viewProfile() {
    const user = Auth.getCurrentUser();
    alert(`Profile Information:\n\nName: ${user.fullname}\nUsername: ${user.username}\nEmail: ${user.email}\nPhone: ${user.phone}`);
}

function editProfile() {
    const user = Auth.getCurrentUser();
    
    const newName = prompt('Enter new full name:', user.fullname);
    if (newName && newName !== user.fullname) {
        Auth.updateProfile({ fullname: newName });
        loadUserData();
        alert('Profile updated successfully!');
    }
}

function changePassword() {
    const oldPass = prompt('Enter current password:');
    if (!oldPass) return;
    
    const newPass = prompt('Enter new password (min. 6 characters):');
    if (!newPass || newPass.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const confirmPass = prompt('Confirm new password:');
    if (newPass !== confirmPass) {
        alert('Passwords do not match!');
        return;
    }
    
    if (Auth.changePassword(oldPass, newPass)) {
        alert('Password changed successfully!');
    }
}

// Dismiss banner
function dismissBanner() {
    document.getElementById('rateBanner').style.display = 'none';
}

// Request service
function requestVia(method) {
    const email = 'frediezra360@gmail.com';
    const phone = '255752593977';
    
    switch(method) {
        case 'email':
            window.location.href = `mailto:${email}?subject=Service Request from FEE-ONLINE&body=Hello Fredi, I would like to request a service.`;
            break;
        case 'whatsapp':
            window.open(`https://wa.me/${phone}?text=Hello%20Fredi%2C%20I%20would%20like%20to%20request%20a%20service`, '_blank');
            break;
        case 'call':
            window.location.href = `tel:+${phone}`;
            break;
    }
}