// Main Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const currentTool = document.getElementById('current-tool');
    const navLinks = document.querySelectorAll('.nav-section a');
    const toolCards = document.querySelectorAll('.tool-card');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const saveAllBtn = document.getElementById('save-all');
    const welcomeScreen = document.getElementById('welcome-screen');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toolContainers = document.querySelectorAll('.tool-container');
    
    // Initialize dashboard
    initDashboard();
    
    function initDashboard() {
        // Set default theme
        const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';
        setTheme(savedTheme);
        
        // Update active theme button
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === savedTheme) {
                btn.classList.add('active');
            }
        });
        
        // Update memory usage
        updateMemoryUsage();
        setInterval(updateMemoryUsage, 5000);
        
        // Load last used tool or show welcome screen
        const lastTool = localStorage.getItem('last-tool');
        if (lastTool && lastTool !== 'welcome') {
            loadTool(lastTool);
        } else {
            showWelcomeScreen();
        }
        
        // Setup file upload
        setupFileUpload();
        
        // Setup video player
        setupVideoPlayer();
        
        // Setup modals
        setupModals();
    }
    
    // Toggle sidebar on mobile
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        menuToggle.innerHTML = sidebar.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tool = this.getAttribute('data-tool');
            loadTool(tool);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 1200) {
                sidebar.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Tool cards on welcome screen
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const tool = this.getAttribute('data-tool');
            loadTool(tool);
        });
    });
    
    // Theme switcher
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            
            // Update active state
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Save all button
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', function() {
            showToast('All changes saved successfully!', 'success');
        });
    }
    
    // Tool loading function
    function loadTool(toolName) {
        // Hide welcome screen
        welcomeScreen.classList.remove('active');
        
        // Hide all tool containers
        toolContainers.forEach(container => {
            container.classList.remove('active');
        });
        
        // Show selected tool
        const toolContainer = document.getElementById(toolName);
        if (toolContainer) {
            toolContainer.classList.add('active');
            
            // Update breadcrumb
            currentTool.textContent = getToolName(toolName);
            
            // Load tool content if empty
            if (toolContainer.innerHTML.trim() === '') {
                loadToolContent(toolName, toolContainer);
            }
            
            // Save last used tool
            localStorage.setItem('last-tool', toolName);
        }
    }
    
    function showWelcomeScreen() {
        // Hide all tool containers
        toolContainers.forEach(container => {
            container.classList.remove('active');
        });
        
        // Show welcome screen
        welcomeScreen.classList.add('active');
        
        // Update breadcrumb
        currentTool.textContent = 'Dashboard';
        
        // Save last used tool
        localStorage.setItem('last-tool', 'welcome');
    }
    
    function getToolName(toolId) {
        const toolNames = {
            'file-manager': 'File Manager',
            'code-editor': 'Code Editor',
            'media-player': 'Media Player',
            'html-viewer': 'HTML Viewer',
            'js-runner': 'JavaScript Runner',
            'python-runner': 'Python Runner',
            'js-obfuscator': 'JavaScript Obfuscator',
            'base64': 'Base64 Tools',
            'text-binary': 'Text ↔ Binary',
            'color-viewer': 'Color Viewer',
            'binary-text': 'Binary → Text',
            'website-extractor': 'Website Extractor'
        };
        
        return toolNames[toolId] || toolId.replace('-', ' ').toUpperCase();
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dashboard-theme', theme);
    }
    
    function updateMemoryUsage() {
        // Simulate memory usage for demo
        const memoryValue = Math.floor(Math.random() * 200) + 100;
        const memoryElement = document.getElementById('memory-value');
        if (memoryElement) {
            memoryElement.textContent = memoryValue;
        }
    }
    
    function showToast(message, type = 'success') {
        const toastIcon = toast.querySelector('i');
        toastMessage.textContent = message;
        
        // Set icon based on type
        if (type === 'error') {
            toastIcon.className = 'fas fa-exclamation-circle';
            toast.classList.add('error');
            toast.classList.remove('warning');
        } else if (type === 'warning') {
            toastIcon.className = 'fas fa-exclamation-triangle';
            toast.classList.add('warning');
            toast.classList.remove('error');
        } else {
            toastIcon.className = 'fas fa-check-circle';
            toast.classList.remove('error', 'warning');
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const browseBtn = document.getElementById('browse-btn');
        
        if (uploadArea && fileInput && browseBtn) {
            // Click browse button
            browseBtn.addEventListener('click', () => fileInput.click());
            
            // Handle file input change
            fileInput.addEventListener('change', handleFileUpload);
            
            // Drag and drop
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadArea.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                uploadArea.style.borderColor = 'var(--primary-color)';
                uploadArea.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
            }
            
            function unhighlight() {
                uploadArea.style.borderColor = '';
                uploadArea.style.backgroundColor = '';
            }
            
            uploadArea.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                handleFiles(files);
            }
        }
    }
    
    function handleFileUpload(e) {
        const files = e.target.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        const uploadProgress = document.getElementById('upload-progress');
        
        if (uploadProgress) {
            uploadProgress.innerHTML = '';
            
            [...files].forEach((file, index) => {
                const progressItem = document.createElement('div');
                progressItem.className = 'progress-item mb-1';
                progressItem.innerHTML = `
                    <div class="flex justify-between mb-1">
                        <span>${file.name}</span>
                        <span class="file-size">${formatFileSize(file.size)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                `;
                uploadProgress.appendChild(progressItem);
                
                // Simulate upload progress
                simulateUpload(progressItem, index, files.length);
            });
        }
    }
    
    function simulateUpload(progressItem, index, total) {
        let progress = 0;
        const progressFill = progressItem.querySelector('.progress-fill');
        
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Show success message for last file
                if (index === total - 1) {
                    setTimeout(() => {
                        showToast(`${total} file(s) uploaded successfully!`, 'success');
                    }, 500);
                }
            }
            
            progressFill.style.width = `${progress}%`;
        }, 200);
    }
    
    function setupVideoPlayer() {
        const videoModal = document.getElementById('video-modal');
        const videoPlayer = document.getElementById('video-player');
        const playPauseBtn = document.getElementById('play-pause');
        const volumeSlider = document.getElementById('volume-slider');
        const fullscreenBtn = document.getElementById('fullscreen');
        
        if (videoPlayer && playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (videoPlayer.paused) {
                    videoPlayer.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    videoPlayer.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
            
            videoPlayer.addEventListener('play', () => {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
            
            videoPlayer.addEventListener('pause', () => {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            if (volumeSlider) {
                volumeSlider.addEventListener('input', () => {
                    videoPlayer.volume = volumeSlider.value;
                });
            }
            
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    if (videoPlayer.requestFullscreen) {
                        videoPlayer.requestFullscreen();
                    } else if (videoPlayer.mozRequestFullScreen) {
                        videoPlayer.mozRequestFullScreen();
                    } else if (videoPlayer.webkitRequestFullscreen) {
                        videoPlayer.webkitRequestFullscreen();
                    } else if (videoPlayer.msRequestFullscreen) {
                        videoPlayer.msRequestFullscreen();
                    }
                });
            }
        }
    }
    
    function setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                modal.classList.remove('active');
            });
        });
        
        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Expose functions to global scope
    window.loadTool = loadTool;
    window.showToast = showToast;
    window.formatFileSize = formatFileSize;
});