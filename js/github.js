// Real GitHub API Fetch
async function fetchGitHubStats() {
    try {
        // Fetch from Fred1e account
        const fred1eRes = await fetch('https://api.github.com/users/Fred1e');
        const fred1e = await fred1eRes.json();
        
        // Fetch repos to calculate stars and forks
        const reposRes = await fetch('https://api.github.com/users/Fred1e/repos?per_page=100');
        const repos = await reposRes.json();
        
        // Calculate totals
        let totalStars = 0;
        let totalForks = 0;
        repos.forEach(repo => {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
        });
        
        // Update DOM
        document.querySelector('#followers h3').textContent = fred1e.followers || '0';
        document.querySelector('#repos h3').textContent = fred1e.public_repos || '0';
        document.querySelector('#stars h3').textContent = totalStars;
        document.querySelector('#forks h3').textContent = totalForks;
        
        // Display top 6 projects from Fred1e
        displayProjects(repos.slice(0, 6), 'fred1e-projects');
        
        // Fetch from FezChat account
        const fezchatRes = await fetch('https://api.github.com/users/FezChat/repos?per_page=6');
        const fezchatRepos = await fezchatRes.json();
        displayProjects(fezchatRepos, 'fezchat-projects');
        
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        // Fallback data in case API fails
        document.querySelector('#followers h3').textContent = '8';
        document.querySelector('#repos h3').textContent = '15';
        document.querySelector('#stars h3').textContent = '23';
        document.querySelector('#forks h3').textContent = '7';
        
        // Show fallback projects
        showFallbackProjects();
    }
}

function displayProjects(repos, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
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
}

function showFallbackProjects() {
    const fred1eContainer = document.getElementById('fred1e-projects');
    const fezchatContainer = document.getElementById('fezchat-projects');
    
    if (fred1eContainer) {
        fred1eContainer.innerHTML = `
            <div class="project-card">
                <h4><a href="https://github.com/Fred1e/Fee-xmd">Fee-xmd</a></h4>
                <p>WhatsApp Bot with many features</p>
                <div class="repo-stats"><span>⭐ 15</span> <span>⑂ 5</span></div>
            </div>
            <div class="project-card">
                <h4><a href="https://github.com/Fred1e/portfolio">portfolio</a></h4>
                <p>Personal portfolio website</p>
                <div class="repo-stats"><span>⭐ 3</span> <span>⑂ 1</span></div>
            </div>
        `;
    }
}

// Real-time message rotation
const messages = [
    "⭐ Rate this portfolio 5 stars!",
    "📱 Download my Android app",
    "🤖 WhatsApp Bot only $1",
    "🇹🇿 Developer from Tanzania",
    "💻 Web development services available",
    "📞 Contact: +255 752 593 977"
];

let messageIndex = 0;
setInterval(() => {
    const msgElement = document.querySelector('#rateMessage span');
    if (msgElement) {
        messageIndex = (messageIndex + 1) % messages.length;
        msgElement.textContent = messages[messageIndex];
    }
}, 5000);

// Search GitHub users
async function searchGitHubUser(username) {
    if (!username) return;
    
    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=6`);
        const repos = await res.json();
        
        // Display in a modal or new section
        alert(`Found ${repos.length} repositories for ${username}`);
        // You can expand this to show results
    } catch (error) {
        alert('User not found or API error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', fetchGitHubStats);