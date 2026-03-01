// Dashboard specific functions
document.addEventListener('DOMContentLoaded', function() {
    // Load user info
    const user = Auth.getCurrentUser();
    if (user) {
        document.getElementById('welcomeName').textContent = user.fullname || user.username;
        document.getElementById('sidebarName').textContent = user.fullname || user.username;
        document.getElementById('sidebarEmail').textContent = user.email || 'frediezra360@gmail.com';
        
        const avatar = document.getElementById('sidebarAvatar');
        if (avatar) {
            avatar.textContent = (user.fullname || user.username).charAt(0).toUpperCase();
        }
    }
    
    // Load GitHub projects
    loadDashboardProjects('Fred1e');
    
    // Start rotating messages
    rotateMessages();
});

// Rotating messages for rate banner
const rateMessages = [
    "⭐ How would you rate FEE-ONLINE?",
    "📱 Download our Android app!",
    "🤖 WhatsApp Bot only $1!",
    "💻 Need a website? Contact me!",
    "🔗 Join WhatsApp channel for updates",
    "🇹🇿 Developer from Tanzania"
];

function rotateMessages() {
    let index = 0;
    const msgElement = document.getElementById('rotatingMessage');
    
    setInterval(() => {
        if (msgElement) {
            index = (index + 1) % rateMessages.length;
            msgElement.textContent = rateMessages[index];
        }
    }, 5000);
}

// Load projects for dashboard
async function loadDashboardProjects(username) {
    const container = document.getElementById('dashboardProjects');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading projects...</div>';
    
    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`);
        const repos = await res.json();
        
        container.innerHTML = '';
        
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                <p>${repo.description || 'No description'}</p>
                <div class="repo-stats">
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-fork"></i> ${repo.forks_count}</span>
                    <span><i class="fas fa-code"></i> ${repo.language || 'Unknown'}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<p>Error loading projects. Please try again.</p>';
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

// Dismiss banner
function dismissBanner() {
    document.getElementById('rateBanner').style.display = 'none';
}

// Request service
function requestService(type) {
    const phone = '255752593977';
    let message = '';
    
    switch(type) {
        case 'bot':
            message = 'Hello Fredi, I want to purchase the WhatsApp Bot (Fee-XMD)';
            break;
        case 'pair':
            message = 'Hello Fredi, I need pair code for WhatsApp bot';
            break;
        case 'web':
            message = 'Hello Fredi, I need web development services';
            break;
    }
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Request via email/whatsapp/call
function requestVia(method) {
    const email = 'frediezra360@gmail.com';
    const phone = '255752593977';
    
    switch(method) {
        case 'email':
            window.location.href = `mailto:${email}?subject=Service Request from FEE-ONLINE`;
            break;
        case 'whatsapp':
            window.open(`https://wa.me/${phone}?text=Hello Fredi, I need your services`, '_blank');
            break;
        case 'call':
            window.location.href = `tel:+${phone}`;
            break;
    }
}