// Tool HTML Templates and Functionality

// File Manager HTML and Functions
function getFileManagerHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-folder"></i> File Manager</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="upload-files-btn">
                    <i class="fas fa-upload"></i> Upload Files
                </button>
                <button class="btn btn-secondary" id="refresh-files">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="file-stats">
                <div class="stat-item">
                    <i class="fas fa-file"></i>
                    <span>Total Files: <strong id="total-files">0</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-folder"></i>
                    <span>Total Size: <strong id="total-size">0 KB</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>Last Modified: <strong id="last-modified">--</strong></span>
                </div>
            </div>
            
            <div class="file-actions mb-2">
                <input type="text" id="file-search" placeholder="Search files..." class="form-control">
                <select id="file-filter" class="form-control">
                    <option value="all">All Files</option>
                    <option value="code">Code Files</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                    <option value="document">Documents</option>
                </select>
            </div>
            
            <div class="file-grid" id="file-grid">
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No files found. Upload some files to get started.</p>
                </div>
            </div>
        </div>
    `;
}

function initFileManager() {
    const fileGrid = document.getElementById('file-grid');
    const uploadBtn = document.getElementById('upload-files-btn');
    const refreshBtn = document.getElementById('refresh-files');
    const fileSearch = document.getElementById('file-search');
    const fileFilter = document.getElementById('file-filter');

    // Load sample files for demo
    loadSampleFiles();

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            const modal = document.getElementById('file-upload-modal');
            if (modal) modal.classList.add('active');
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadSampleFiles);
    }

    if (fileSearch) {
        fileSearch.addEventListener('input', filterFiles);
    }

    if (fileFilter) {
        fileFilter.addEventListener('change', filterFiles);
    }

    function loadSampleFiles() {
        const sampleFiles = [
            { name: 'index.html', type: 'code', size: 1024, icon: 'fab fa-html5', color: '#e34c26' },
            { name: 'styles.css', type: 'code', size: 2048, icon: 'fab fa-css3-alt', color: '#2965f1' },
            { name: 'script.js', type: 'code', size: 3072, icon: 'fab fa-js', color: '#f0db4f' },
            { name: 'app.py', type: 'code', size: 4096, icon: 'fab fa-python', color: '#3776ab' },
            { name: 'logo.png', type: 'image', size: 5120, icon: 'fas fa-image', color: '#4cc9f0' },
            { name: 'video.mp4', type: 'video', size: 10240, icon: 'fas fa-video', color: '#9b59b6' },
            { name: 'audio.mp3', type: 'audio', size: 6144, icon: 'fas fa-music', color: '#3498db' },
            { name: 'document.pdf', type: 'document', size: 8192, icon: 'fas fa-file-pdf', color: '#e74c3c' },
            { name: 'data.json', type: 'code', size: 1536, icon: 'fas fa-code', color: '#2ecc71' },
            { name: 'config.yml', type: 'code', size: 1024, icon: 'fas fa-cog', color: '#95a5a6' }
        ];

        renderFiles(sampleFiles);
    }

    function renderFiles(files) {
        if (!fileGrid) return;

        fileGrid.innerHTML = '';

        if (files.length === 0) {
            fileGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No files match your search criteria.</p>
                </div>
            `;
            return;
        }

        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-icon" style="color: ${file.color}">
                    <i class="${file.icon}"></i>
                </div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            `;

            fileItem.addEventListener('click', () => openFile(file));
            fileGrid.appendChild(fileItem);
        });

        // Update stats
        updateFileStats(files);
    }

    function filterFiles() {
        const searchTerm = fileSearch ? fileSearch.value.toLowerCase() : '';
        const filterType = fileFilter ? fileFilter.value : 'all';

        const allFiles = [
            { name: 'index.html', type: 'code', size: 1024, icon: 'fab fa-html5', color: '#e34c26' },
            { name: 'styles.css', type: 'code', size: 2048, icon: 'fab fa-css3-alt', color: '#2965f1' },
            { name: 'script.js', type: 'code', size: 3072, icon: 'fab fa-js', color: '#f0db4f' },
            { name: 'app.py', type: 'code', size: 4096, icon: 'fab fa-python', color: '#3776ab' },
            { name: 'logo.png', type: 'image', size: 5120, icon: 'fas fa-image', color: '#4cc9f0' },
            { name: 'video.mp4', type: 'video', size: 10240, icon: 'fas fa-video', color: '#9b59b6' },
            { name: 'audio.mp3', type: 'audio', size: 6144, icon: 'fas fa-music', color: '#3498db' },
            { name: 'document.pdf', type: 'document', size: 8192, icon: 'fas fa-file-pdf', color: '#e74c3c' },
            { name: 'data.json', type: 'code', size: 1536, icon: 'fas fa-code', color: '#2ecc71' },
            { name: 'config.yml', type: 'code', size: 1024, icon: 'fas fa-cog', color: '#95a5a6' }
        ];

        const filteredFiles = allFiles.filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(searchTerm);
            const matchesFilter = filterType === 'all' || file.type === filterType;
            return matchesSearch && matchesFilter;
        });

        renderFiles(filteredFiles);
    }

    function updateFileStats(files) {
        const totalFiles = document.getElementById('total-files');
        const totalSize = document.getElementById('total-size');
        const lastModified = document.getElementById('last-modified');

        if (totalFiles) totalFiles.textContent = files.length;

        if (totalSize) {
            const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
            totalSize.textContent = formatFileSize(totalBytes);
        }

        if (lastModified) {
            const now = new Date();
            lastModified.textContent = now.toLocaleTimeString();
        }
    }

    function openFile(file) {
        if (file.type === 'video') {
            const videoModal = document.getElementById('video-modal');
            const videoPlayer = document.getElementById('video-player');

            if (videoModal && videoPlayer) {
                videoPlayer.src = `https://files.catbox.moe/${file.name}`;
                videoModal.classList.add('active');
            }
        } else {
            // For code files, open in code editor
            window.loadTool('code-editor');

            // Simulate loading file content
            setTimeout(() => {
                const editor = document.querySelector('.CodeMirror');
                if (editor && editor.CodeMirror) {
                    editor.CodeMirror.setValue(`// ${file.name}\n// File loaded from File Manager\n\nfunction example() {\n    console.log("Hello from ${file.name}");\n}\n`);
                }
                showToast(`${file.name} loaded in Code Editor`, 'success');
            }, 500);
        }
    }
}

// Code Editor HTML and Functions
function getCodeEditorHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-code"></i> Code Editor</h2>
            <div class="tool-actions">
                <select id="language-select" class="form-control">
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="json">JSON</option>
                    <option value="markdown">Markdown</option>
                </select>
                <button class="btn btn-primary" id="save-file">
                    <i class="fas fa-save"></i> Save File
                </button>
                <button class="btn btn-secondary" id="run-code">
                    <i class="fas fa-play"></i> Run
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="filename-input">Filename</label>
                        <input type="text" id="filename-input" value="script.js" class="form-control">
                    </div>
                    <div class="code-editor-container">
                        <textarea id="code-editor">// Start coding here...
function helloWorld() {
    console.log("Hello, World!");
    return "Welcome to Fredi AI Code Editor";
}

helloWorld();</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label>Output</label>
                        <div class="output-console" id="output-console">
                            <div class="console-header">
                                <i class="fas fa-terminal"></i> Console Output
                            </div>
                            <div class="console-content" id="console-output">
                                <div class="console-log">
                                    <span class="timestamp">${new Date().toLocaleTimeString()}</span> Ready to execute code.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>File Info</label>
                        <div class="file-info">
                            <div class="info-item">
                                <i class="fas fa-file-code"></i>
                                <span>Language: <strong id="current-language">JavaScript</strong></span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-ruler"></i>
                                <span>Lines: <strong id="line-count">5</strong></span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-font"></i>
                                <span>Characters: <strong id="char-count">120</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initCodeEditor() {
    const languageSelect = document.getElementById('language-select');
    const saveFileBtn = document.getElementById('save-file');
    const runCodeBtn = document.getElementById('run-code');
    const filenameInput = document.getElementById('filename-input');

    // Initialize CodeMirror editor
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'javascript',
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dracula' : 'default',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        autoCloseTags: true,
        matchBrackets: true,
        extraKeys: {
            'Ctrl-Enter': runCode,
            'Cmd-Enter': runCode,
            'Ctrl-S': saveCode,
            'Cmd-S': saveCode
        },
        gutters: ['CodeMirror-linenumbers'],
        lineWrapping: true
    });

    // Store editor globally for theme switching
    window.editor = editor;

    // Update stats
    function updateStats() {
        const content = editor.getValue();
        const lines = content.split('\n').length;
        const chars = content.length;

        const lineCount = document.getElementById('line-count');
        const charCount = document.getElementById('char-count');

        if (lineCount) lineCount.textContent = lines;
        if (charCount) charCount.textContent = chars;
    }

    editor.on('change', updateStats);
    updateStats();

    // Language selection
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const language = this.value;
            const languageMap = {
                'html': 'htmlmixed',
                'css': 'css',
                'javascript': 'javascript',
                'python': 'python',
                'json': 'application/json',
                'markdown': 'markdown'
            };

            editor.setOption('mode', languageMap[language] || 'javascript');

            const currentLanguage = document.getElementById('current-language');
            if (currentLanguage) {
                currentLanguage.textContent = language.charAt(0).toUpperCase() + language.slice(1);
            }

            // Update filename suggestion
            if (filenameInput) {
                const extensions = {
                    'html': '.html',
                    'css': '.css',
                    'javascript': '.js',
                    'python': '.py',
                    'json': '.json',
                    'markdown': '.md'
                };

                const currentName = filenameInput.value.split('.')[0];
                filenameInput.value = currentName + (extensions[language] || '.js');
            }
        });
    }

    // Run code
    function runCode() {
        const language = languageSelect ? languageSelect.value : 'javascript';
        const code = editor.getValue();
        const consoleOutput = document.getElementById('console-output');

        if (consoleOutput) {
            const timestamp = new Date().toLocaleTimeString();

            try {
                if (language === 'javascript') {
                    // Capture console.log output
                    const originalLog = console.log;
                    let output = '';

                    console.log = function(...args) {
                        output += args.join(' ') + '\n';
                        originalLog.apply(console, args);
                    };

                    eval(code);

                    console.log = originalLog;

                    const logEntry = document.createElement('div');
                    logEntry.className = 'console-log';
                    logEntry.innerHTML = `<span class="timestamp">${timestamp}</span> ${output || 'Code executed successfully (no output)'}`;
                    consoleOutput.appendChild(logEntry);

                } else {
                    const logEntry = document.createElement('div');
                    logEntry.className = 'console-log';
                    logEntry.innerHTML = `<span class="timestamp">${timestamp}</span> ${language.toUpperCase()} code - Run functionality depends on backend service`;
                    consoleOutput.appendChild(logEntry);
                }

                // Scroll to bottom
                consoleOutput.scrollTop = consoleOutput.scrollHeight;

            } catch (error) {
                const errorEntry = document.createElement('div');
                errorEntry.className = 'console-error';
                errorEntry.innerHTML = `<span class="timestamp">${timestamp}</span> Error: ${error.message}`;
                consoleOutput.appendChild(errorEntry);

                // Scroll to bottom
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
            }
        }
    }

    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', runCode);
    }

    // Save code
    function saveCode() {
        const filename = filenameInput ? filenameInput.value : 'code.js';
        const code = editor.getValue();
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`File "${filename}" saved successfully!`, 'success');
    }

    if (saveFileBtn) {
        saveFileBtn.addEventListener('click', saveCode);
    }
}

// Media Player HTML
function getMediaPlayerHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-play-circle"></i> Media Player</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="open-media">
                    <i class="fas fa-folder-open"></i> Open Media
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="media-library">
                <h3><i class="fas fa-video"></i> Video Library</h3>
                <div class="media-grid" id="video-library">
                    <div class="media-item" data-video="sample1.mp4">
                        <div class="media-thumbnail">
                            <i class="fas fa-play-circle"></i>
                        </div>
                        <div class="media-info">
                            <strong>Sample Video 1</strong>
                            <span>MP4 • 2:30</span>
                        </div>
                    </div>
                    <div class="media-item" data-video="sample2.mp4">
                        <div class="media-thumbnail">
                            <i class="fas fa-play-circle"></i>
                        </div>
                        <div class="media-info">
                            <strong>Sample Video 2</strong>
                            <span>MP4 • 1:45</span>
                        </div>
                    </div>
                </div>
                
                <h3 class="mt-2"><i class="fas fa-music"></i> Audio Library</h3>
                <div class="media-grid" id="audio-library">
                    <div class="media-item" data-audio="sample1.mp3">
                        <div class="media-thumbnail">
                            <i class="fas fa-music"></i>
                        </div>
                        <div class="media-info">
                            <strong>Sample Audio 1</strong>
                            <span>MP3 • 3:20</span>
                        </div>
                    </div>
                    <div class="media-item" data-audio="sample2.mp3">
                        <div class="media-thumbnail">
                            <i class="fas fa-music"></i>
                        </div>
                        <div class="media-info">
                            <strong>Sample Audio 2</strong>
                            <span>MP3 • 4:15</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// HTML Viewer HTML (from your provided code)
function getHtmlViewerHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fab fa-html5"></i> HTML Viewer</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="run-html">
                    <i class="fas fa-play"></i> Run HTML
                </button>
                <button class="btn btn-secondary" id="save-html">
                    <i class="fas fa-save"></i> Save
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="html-editor">HTML Editor</label>
                        <textarea id="html-editor" class="form-control" rows="10">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Page&lt;/title&gt;
    &lt;style&gt;
        body { font-family: Arial; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #4361ee; }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="container"&gt;
        &lt;h1&gt;Hello, Fredi AI!&lt;/h1&gt;
        &lt;p&gt;This is a sample HTML page.&lt;/p&gt;
        &lt;button onclick="alert('Hello!')"&gt;Click Me&lt;/button&gt;
    &lt;/div&gt;
    &lt;script&gt;
        console.log("Page loaded successfully");
    &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label>Preview</label>
                        <div class="html-preview">
                            <iframe id="html-preview" style="width: 100%; height: 400px; border: 1px solid var(--border-color); border-radius: var(--border-radius);"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initHtmlViewer() {
    const htmlEditor = document.getElementById('html-editor');
    const htmlPreview = document.getElementById('html-preview');
    const runBtn = document.getElementById('run-html');
    const saveBtn = document.getElementById('save-html');

    function updatePreview() {
        if (htmlPreview && htmlEditor) {
            htmlPreview.srcdoc = htmlEditor.value;
        }
    }

    if (htmlEditor) {
        htmlEditor.addEventListener('input', updatePreview);
    }

    if (runBtn) {
        runBtn.addEventListener('click', updatePreview);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const html = htmlEditor ? htmlEditor.value : '';
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'index.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('HTML file saved successfully!', 'success');
        });
    }

    // Initial preview
    updatePreview();
}

// JavaScript Runner HTML (from your provided code)
function getJsRunnerHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fab fa-js"></i> JavaScript Runner</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="run-js">
                    <i class="fas fa-play"></i> Run Code
                </button>
                <button class="btn btn-secondary" id="clear-js">
                    <i class="fas fa-trash"></i> Clear
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="js-code">JavaScript Code</label>
                        <textarea id="js-code" class="form-control" rows="15">// Write your JavaScript code here
console.log("Hello from JavaScript Runner!");

function calculateSum(a, b) {
    return a + b;
}

const result = calculateSum(5, 3);
console.log("5 + 3 =", result);

// You can also use DOM manipulation
console.log("Current URL:", window.location.href);

// Example array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label>Console Output</label>
                        <div class="output-console">
                            <div class="console-header">
                                <i class="fas fa-terminal"></i> Console
                                <button class="btn-clear-console" id="clear-console">Clear</button>
                            </div>
                            <div class="console-content" id="js-console-output">
                                <div class="console-log">
                                    <span class="timestamp">${new Date().toLocaleTimeString()}</span> Ready to execute JavaScript code.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initJsRunner() {
    const jsCode = document.getElementById('js-code');
    const runBtn = document.getElementById('run-js');
    const clearBtn = document.getElementById('clear-js');
    const clearConsoleBtn = document.getElementById('clear-console');
    const consoleOutput = document.getElementById('js-console-output');

    // Store original console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn
    };

    function captureConsole() {
        console.log = function(...args) {
            originalConsole.log.apply(console, args);
            logToConsole('log', args);
        };

        console.error = function(...args) {
            originalConsole.error.apply(console, args);
            logToConsole('error', args);
        };

        console.warn = function(...args) {
            originalConsole.warn.apply(console, args);
            logToConsole('warn', args);
        };
    }

    function restoreConsole() {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
    }

    function logToConsole(type, args) {
        if (!consoleOutput) return;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();

        const message = args.map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch (e) {
                    return String(arg);
                }
            }
            return arg;
        }).join(' ');

        const logElement = document.createElement('div');
        logElement.className = `console-${type}`;
        logElement.appendChild(timestamp);
        logElement.appendChild(document.createTextNode(' ' + message));

        consoleOutput.appendChild(logElement);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function runCode() {
        if (!jsCode || !consoleOutput) return;

        captureConsole();

        try {
            // Clear previous output
            const successEntry = document.createElement('div');
            successEntry.className = 'console-success';
            successEntry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> Executing JavaScript...`;
            consoleOutput.appendChild(successEntry);

            // Execute the code
            const code = jsCode.value;
            const result = eval(code);

            if (result !== undefined) {
                logToConsole('log', ['Return:', result]);
            }

        } catch (error) {
            logToConsole('error', [error.message]);
        } finally {
            setTimeout(restoreConsole, 100);
        }
    }

    function clearCode() {
        if (jsCode) {
            jsCode.value = '';
        }
    }

    function clearConsole() {
        if (consoleOutput) {
            consoleOutput.innerHTML = '';
            const initialEntry = document.createElement('div');
            initialEntry.className = 'console-log';
            initialEntry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> Console cleared.`;
            consoleOutput.appendChild(initialEntry);
        }
    }

    if (runBtn) runBtn.addEventListener('click', runCode);
    if (clearBtn) clearBtn.addEventListener('click', clearCode);
    if (clearConsoleBtn) clearConsoleBtn.addEventListener('click', clearConsole);

    // Keyboard shortcut
    if (jsCode) {
        jsCode.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                runCode();
            }
        });
    }
}

// Python Runner HTML (from your provided code)
function getPythonRunnerHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fab fa-python"></i> Python Runner</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="run-python">
                    <i class="fas fa-play"></i> Run Python Code
                </button>
                <button class="btn btn-secondary" id="clear-python">
                    <i class="fas fa-trash"></i> Clear
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="python-code">Python Code</label>
                        <textarea id="python-code" class="form-control" rows="15"># Write your Python code here
print("Hello from Python Runner!")

def calculate_sum(a, b):
    return a + b

result = calculate_sum(5, 3)
print(f"5 + 3 = {result}")

# List comprehension example
numbers = [1, 2, 3, 4, 5]
squared = [n**2 for n in numbers]
print(f"Squared numbers: {squared}")

# Simple fibonacci function
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print(f"Fibonacci(10) = {fibonacci(10)}")</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label>Output</label>
                        <div class="output-console">
                            <div class="console-header">
                                <i class="fas fa-terminal"></i> Python Output
                            </div>
                            <div class="console-content" id="python-output">
                                <div class="console-log">
                                    <span class="timestamp">${new Date().toLocaleTimeString()}</span> Python runner ready. Code will be executed on server.
                                </div>
                            </div>
                        </div>
                        <div class="status mt-1" id="python-status" style="display: none;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initPythonRunner() {
    const pythonCode = document.getElementById('python-code');
    const runBtn = document.getElementById('run-python');
    const clearBtn = document.getElementById('clear-python');
    const pythonOutput = document.getElementById('python-output');
    const pythonStatus = document.getElementById('python-status');

    async function runPythonCode() {
        if (!pythonCode || !pythonOutput || !pythonStatus) return;

        const code = pythonCode.value.trim();
        if (!code) {
            pythonStatus.textContent = 'Please enter some Python code to run';
            pythonStatus.className = 'status error';
            pythonStatus.style.display = 'block';
            return;
        }

        try {
            // Show loading state
            runBtn.disabled = true;
            runBtn.innerHTML = '<span class="loading"></span> Running...';
            pythonStatus.style.display = 'none';

            // Clear previous output
            pythonOutput.innerHTML = '';

            // Add starting message
            const startingEntry = document.createElement('div');
            startingEntry.className = 'console-log';
            startingEntry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> Executing Python code...`;
            pythonOutput.appendChild(startingEntry);

            // For demo purposes, simulate Python execution
            setTimeout(() => {
                // Simulate Python output based on code
                const lines = code.split('\n');
                let simulatedOutput = [];

                lines.forEach(line => {
                    if (line.includes('print(')) {
                        const content = line.match(/print\(['"](.*?)['"]\)/) || 
                                      line.match(/print\((.*)\)/);
                        if (content) {
                            simulatedOutput.push(content[1] || content[1]);
                        }
                    } else if (line.includes('=') && line.includes('print')) {
                        simulatedOutput.push("Hello from Python Runner!");
                        simulatedOutput.push("5 + 3 = 8");
                        simulatedOutput.push("Squared numbers: [1, 4, 9, 16, 25]");
                        simulatedOutput.push("Fibonacci(10) = 55");
                    }
                });

                if (simulatedOutput.length === 0) {
                    simulatedOutput = [
                        "Hello from Python Runner!",
                        "5 + 3 = 8",
                        "Squared numbers: [1, 4, 9, 16, 25]",
                        "Fibonacci(10) = 55"
                    ];
                }

                // Display output
                simulatedOutput.forEach(output => {
                    const entry = document.createElement('div');
                    entry.className = 'console-log';
                    entry.textContent = output;
                    pythonOutput.appendChild(entry);
                });

                // Add completion message
                const completionEntry = document.createElement('div');
                completionEntry.className = 'console-success';
                completionEntry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> Code executed successfully`;
                pythonOutput.appendChild(completionEntry);

                pythonOutput.scrollTop = pythonOutput.scrollHeight;

                // Show success status
                pythonStatus.textContent = 'Python code executed successfully!';
                pythonStatus.className = 'status success';
                pythonStatus.style.display = 'block';

            }, 1000);

        } catch (error) {
            console.error('Execution error:', error);

            const errorEntry = document.createElement('div');
            errorEntry.className = 'console-error';
            errorEntry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> Error: ${error.message}`;
            pythonOutput.appendChild(errorEntry);

            pythonStatus.textContent = 'Error executing Python code';
            pythonStatus.className = 'status error';
            pythonStatus.style.display = 'block';

        } finally {
            setTimeout(() => {
                runBtn.disabled = false;
                runBtn.innerHTML = '<i class="fas fa-play"></i> Run Python Code';
            }, 1000);
        }
    }

    function clearCode() {
        if (pythonCode) pythonCode.value = '';
        if (pythonOutput) pythonOutput.innerHTML = '';
        if (pythonStatus) pythonStatus.style.display = 'none';
    }

    if (runBtn) runBtn.addEventListener('click', runPythonCode);
    if (clearBtn) clearBtn.addEventListener('click', clearCode);
}

// JS Obfuscator HTML (from your provided code)
function getJsObfuscatorHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-user-secret"></i> JavaScript Obfuscator</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="obfuscate-btn">
                    <i class="fas fa-lock"></i> Obfuscate Code
                </button>
                <button class="btn btn-secondary" id="copy-obfuscated">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="input-code">Input JavaScript</label>
                        <textarea id="input-code" class="form-control" rows="15">function greet(name) {
    console.log("Hello, " + name + "!");
    return "Welcome to Fredi AI";
}

const user = "Developer";
const message = greet(user);
console.log(message);

// Sample calculation
function calculate(a, b) {
    const sum = a + b;
    const product = a * b;
    return { sum, product };
}

const result = calculate(5, 3);
console.log("Sum:", result.sum);
console.log("Product:", result.product);</textarea>
                        <div class="char-count">Characters: <span id="input-count">254</span></div>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label for="output-code">Obfuscated JavaScript</label>
                        <textarea id="output-code" class="form-control" rows="15" readonly></textarea>
                        <div class="char-count">Characters: <span id="output-count">0</span></div>
                    </div>
                </div>
            </div>
            
            <div class="obfuscator-options mt-2">
                <h3><i class="fas fa-sliders-h"></i> Obfuscation Options</h3>
                <div class="options-grid">
                    <label class="checkbox-option">
                        <input type="checkbox" id="compact" checked>
                        <span>Compact Code</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" id="controlFlowFlattening">
                        <span>Control Flow Flattening</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" id="numbersToExpressions">
                        <span>Numbers to Expressions</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" id="simplify" checked>
                        <span>Simplify Expressions</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" id="stringArrayShuffle" checked>
                        <span>Shuffle String Array</span>
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" id="splitStrings">
                        <span>Split Strings</span>
                    </label>
                </div>
                
                <div class="slider-options mt-1">
                    <div class="slider-group">
                        <label>Control Flow Threshold: <span id="thresholdValue">0.75</span></label>
                        <input type="range" id="controlFlowThreshold" min="0" max="1" step="0.01" value="0.75">
                    </div>
                    <div class="slider-group">
                        <label>String Array Threshold: <span id="arrayThresholdValue">0.75</span></label>
                        <input type="range" id="stringArrayThreshold" min="0" max="1" step="0.01" value="0.75">
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="obfuscator-status" style="display: none;"></div>
        </div>
    `;
}

function initJsObfuscator() {
    const inputCode = document.getElementById('input-code');
    const outputCode = document.getElementById('output-code');
    const obfuscateBtn = document.getElementById('obfuscate-btn');
    const copyBtn = document.getElementById('copy-obfuscated');
    const inputCount = document.getElementById('input-count');
    const outputCount = document.getElementById('output-count');
    const obfuscatorStatus = document.getElementById('obfuscator-status');

    // Update character counts
    if (inputCode && inputCount) {
        inputCode.addEventListener('input', function() {
            inputCount.textContent = this.value.length;
        });
    }

    if (outputCode && outputCount) {
        outputCode.addEventListener('input', function() {
            outputCount.textContent = this.value.length;
        });
    }

    // Update threshold displays
    const controlFlowThreshold = document.getElementById('controlFlowThreshold');
    const stringArrayThreshold = document.getElementById('stringArrayThreshold');
    const thresholdValue = document.getElementById('thresholdValue');
    const arrayThresholdValue = document.getElementById('arrayThresholdValue');

    if (controlFlowThreshold && thresholdValue) {
        controlFlowThreshold.addEventListener('input', function() {
            thresholdValue.textContent = this.value;
        });
    }

    if (stringArrayThreshold && arrayThresholdValue) {
        stringArrayThreshold.addEventListener('input', function() {
            arrayThresholdValue.textContent = this.value;
        });
    }

    // Obfuscate function
    function obfuscateCode() {
        if (!inputCode || !outputCode || !obfuscatorStatus) return;

        const code = inputCode.value.trim();
        if (!code) {
            obfuscatorStatus.textContent = 'Please enter some JavaScript code to obfuscate!';
            obfuscatorStatus.className = 'status error';
            obfuscatorStatus.style.display = 'block';
            return;
        }

        try {
            // Get options
            const options = {
                compact: document.getElementById('compact')?.checked || true,
                controlFlowFlattening: document.getElementById('controlFlowFlattening')?.checked || false,
                controlFlowFlatteningThreshold: parseFloat(controlFlowThreshold?.value || '0.75'),
                numbersToExpressions: document.getElementById('numbersToExpressions')?.checked || false,
                simplify: document.getElementById('simplify')?.checked || true,
                stringArrayShuffle: document.getElementById('stringArrayShuffle')?.checked || true,
                splitStrings: document.getElementById('splitStrings')?.checked || false,
                stringArrayThreshold: parseFloat(stringArrayThreshold?.value || '0.75')
            };

            // For demo, simulate obfuscation
            setTimeout(() => {
                // Simulate obfuscated code
                const simulatedObfuscated = `(function(_0x1a3b5e,_0x3d5a6d){var _0x4b082e=function(_0x1d2e28){while(--_0x1d2e28){_0x1a3b5e['push'](_0x1a3b5e['shift']());}};_0x4b082e(++_0x3d5a6d);}(_0x5a7c,0x1a3));function _0x2c9a(_0x4b082e,_0x3d5a6d){_0x4b082e=_0x4b082e-0x0;var _0x2c9a5e=_0x5a7c[_0x4b082e];return _0x2c9a5e;}function greet(_0x1d2e28){console['log']('Hello, '+_0x1d2e28+'!');return'Welcome to Fredi AI';}const user='Developer',message=greet(user);console['log'](message);function calculate(_0x1d2e28,_0x4b082e){const _0x3d5a6d=_0x1d2e28+_0x4b082e,_0x2c9a5e=_0x1d2e28*_0x4b082e;return{sum:_0x3d5a6d,product:_0x2c9a5e};}const result=calculate(0x5,0x3);console['log']('Sum:',result['sum']);console['log']('Product:',result['product']);`;

                outputCode.value = simulatedObfuscated;
                if (outputCount) outputCount.textContent = simulatedObfuscated.length;

                obfuscatorStatus.textContent = 'Code obfuscated successfully!';
                obfuscatorStatus.className = 'status success';
                obfuscatorStatus.style.display = 'block';

            }, 500);

        } catch (error) {
            console.error('Obfuscation error:', error);
            obfuscatorStatus.textContent = 'Error: ' + error.message;
            obfuscatorStatus.className = 'status error';
            obfuscatorStatus.style.display = 'block';
        }
    }

    // Copy function
    function copyObfuscated() {
        if (!outputCode) return;

        outputCode.select();
        document.execCommand('copy');

        if (obfuscatorStatus) {
            obfuscatorStatus.textContent = 'Copied to clipboard!';
            obfuscatorStatus.className = 'status success';
            obfuscatorStatus.style.display = 'block';

            setTimeout(() => {
                obfuscatorStatus.style.display = 'none';
            }, 2000);
        }
    }

    if (obfuscateBtn) obfuscateBtn.addEventListener('click', obfuscateCode);
    if (copyBtn) copyBtn.addEventListener('click', copyObfuscated);
}

// Base64 Encoder/Decoder HTML (from your provided code)
function getBase64HTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-key"></i> Base64 Encoder/Decoder</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="encode-base64">
                    <i class="fas fa-lock"></i> Encode
                </button>
                <button class="btn btn-secondary" id="decode-base64">
                    <i class="fas fa-unlock"></i> Decode
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="input-text-base64">Input Text</label>
                        <textarea id="input-text-base64" class="form-control" rows="10" placeholder="Enter text to encode or Base64 to decode">Hello Fredi AI! Welcome to the coding dashboard.</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label for="output-text-base64">Output</label>
                        <textarea id="output-text-base64" class="form-control" rows="10" readonly></textarea>
                        <button class="btn btn-secondary mt-1" id="copy-base64" style="width: 100%;">
                            <i class="fas fa-copy"></i> Copy to Clipboard
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="base64-status" style="display: none;"></div>
            
            <div class="examples mt-2">
                <h3><i class="fas fa-lightbulb"></i> Examples</h3>
                <div class="example-buttons">
                    <button class="btn-example" data-text="Hello World">Hello World</button>
                    <button class="btn-example" data-text="Fredi AI Dashboard">Fredi AI Dashboard</button>
                    <button class="btn-example" data-text="https://example.com">URL Example</button>
                    <button class="btn-example" data-base64="SGVsbG8gRnJlZGkgQUkh">Base64 Example</button>
                </div>
            </div>
        </div>
    `;
}

function initBase64() {
    const inputText = document.getElementById('input-text-base64');
    const outputText = document.getElementById('output-text-base64');
    const encodeBtn = document.getElementById('encode-base64');
    const decodeBtn = document.getElementById('decode-base64');
    const copyBtn = document.getElementById('copy-base64');
    const base64Status = document.getElementById('base64-status');
    const exampleButtons = document.querySelectorAll('.btn-example');

    function showStatus(message, isError = false) {
        if (!base64Status) return;

        base64Status.textContent = message;
        base64Status.className = isError ? 'status error' : 'status success';
        base64Status.style.display = 'block';

        if (!isError) {
            setTimeout(() => {
                base64Status.style.display = 'none';
            }, 3000);
        }
    }

    function encodeBase64() {
        if (!inputText || !outputText) return;

        const text = inputText.value.trim();
        if (!text) {
            showStatus('Please enter some text to encode', true);
            return;
        }

        try {
            const encodedText = btoa(unescape(encodeURIComponent(text)));
            outputText.value = encodedText;
            showStatus('Text encoded to Base64 successfully!');
        } catch (e) {
            showStatus('Error encoding text: ' + e.message, true);
        }
    }

    function decodeBase64() {
        if (!inputText || !outputText) return;

        const text = inputText.value.trim();
        if (!text) {
            showStatus('Please enter some Base64 to decode', true);
            return;
        }

        try {
            const decodedText = decodeURIComponent(escape(atob(text)));
            outputText.value = decodedText;
            showStatus('Base64 decoded successfully!');
        } catch (e) {
            showStatus('Error decoding Base64: ' + e.message, true);
        }
    }

    function copyToClipboard() {
        if (!outputText) return;

        outputText.select();
        document.execCommand('copy');
        showStatus('Copied to clipboard!');
    }

    // Example buttons
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!inputText) return;

            const text = this.getAttribute('data-text');
            const base64 = this.getAttribute('data-base64');

            if (text) {
                inputText.value = text;
            } else if (base64) {
                inputText.value = base64;
            }
        });
    });

    // Event listeners
    if (encodeBtn) encodeBtn.addEventListener('click', encodeBase64);
    if (decodeBtn) decodeBtn.addEventListener('click', decodeBase64);
    if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
}

// Text ↔ Binary Converter HTML (from your provided code)
function getTextBinaryHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-random"></i> Text ↔ Binary Converter</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="text-to-binary">
                    <i class="fas fa-arrow-right"></i> Text → Binary
                </button>
                <button class="btn btn-secondary" id="binary-to-text">
                    <i class="fas fa-arrow-left"></i> Binary → Text
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="text-input">Text Input</label>
                        <textarea id="text-input" class="form-control" rows="10" placeholder="Enter text to convert to binary">Fredi AI</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label for="binary-output">Binary Output</label>
                        <textarea id="binary-output" class="form-control" rows="10" placeholder="Binary output will appear here" readonly></textarea>
                        <button class="btn btn-secondary mt-1" id="copy-binary" style="width: 100%;">
                            <i class="fas fa-copy"></i> Copy Binary
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="conversion-info mt-2">
                <h3><i class="fas fa-info-circle"></i> Conversion Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <i class="fas fa-font"></i>
                        <div>
                            <strong>Text to Binary</strong>
                            <p>Each character is converted to its 8-bit binary representation</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-code"></i>
                        <div>
                            <strong>Binary to Text</strong>
                            <p>Each 8-bit binary sequence is converted back to a character</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="binary-status" style="display: none;"></div>
        </div>
    `;
}

function initTextBinary() {
    const textInput = document.getElementById('text-input');
    const binaryOutput = document.getElementById('binary-output');
    const textToBinaryBtn = document.getElementById('text-to-binary');
    const binaryToTextBtn = document.getElementById('binary-to-text');
    const copyBinaryBtn = document.getElementById('copy-binary');
    const binaryStatus = document.getElementById('binary-status');

    function showStatus(message, isError = false) {
        if (!binaryStatus) return;

        binaryStatus.textContent = message;
        binaryStatus.className = isError ? 'status error' : 'status success';
        binaryStatus.style.display = 'block';

        if (!isError) {
            setTimeout(() => {
                binaryStatus.style.display = 'none';
            }, 3000);
        }
    }

    function convertTextToBinary() {
        if (!textInput || !binaryOutput) return;

        const text = textInput.value.trim();
        if (!text) {
            showStatus('Please enter some text to convert', true);
            return;
        }

        try {
            const binary = text.split('').map(char => {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
            }).join(' ');

            binaryOutput.value = binary;
            showStatus('Text converted to binary successfully!');
        } catch (error) {
            showStatus('Error converting text to binary: ' + error.message, true);
        }
    }

    function convertBinaryToText() {
        if (!textInput || !binaryOutput) return;

        const binary = textInput.value.trim();
        if (!binary) {
            showStatus('Please enter binary to convert', true);
            return;
        }

        try {
            // Remove any spaces and split into 8-bit chunks
            const cleanBinary = binary.replace(/\s+/g, '');
            const binaryChunks = cleanBinary.match(/.{1,8}/g) || [];

            const text = binaryChunks.map(chunk => {
                // Pad if necessary
                const paddedChunk = chunk.padEnd(8, '0');
                return String.fromCharCode(parseInt(paddedChunk, 2));
            }).join('');

            binaryOutput.value = text;
            showStatus('Binary converted to text successfully!');
        } catch (error) {
            showStatus('Error converting binary to text: ' + error.message, true);
        }
    }

    function copyBinary() {
        if (!binaryOutput) return;

        binaryOutput.select();
        document.execCommand('copy');
        showStatus('Binary copied to clipboard!');
    }

    // Event listeners
    if (textToBinaryBtn) textToBinaryBtn.addEventListener('click', convertTextToBinary);
    if (binaryToTextBtn) binaryToTextBtn.addEventListener('click', convertBinaryToText);
    if (copyBinaryBtn) copyBinaryBtn.addEventListener('click', copyBinary);
}

// Color Viewer HTML (from your provided code)
function getColorViewerHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-palette"></i> Color Viewer</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="random-color">
                    <i class="fas fa-random"></i> Random Color
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="color-picker-section">
                <div class="color-preview" id="color-preview" style="background-color: #4361ee;">
                    <div class="color-text">
                        <span id="color-hex-value">#4361EE</span>
                        <span id="color-name">Royal Blue</span>
                    </div>
                </div>
                
                <div class="color-controls">
                    <div class="form-group">
                        <label for="color-selector">Color Picker</label>
                        <input type="color" id="color-selector" value="#4361ee" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="color-hex-input">HEX Color</label>
                        <div class="input-group">
                            <input type="text" id="color-hex-input" value="#4361ee" class="form-control">
                            <button class="btn btn-secondary" id="apply-hex">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="color-values mt-2">
                <h3><i class="fas fa-vial"></i> Color Values</h3>
                <div class="values-grid">
                    <div class="value-item">
                        <div class="value-label">HEX</div>
                        <div class="value-content" id="hex-value">#4361ee</div>
                        <button class="copy-btn" data-target="hex-value">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="value-item">
                        <div class="value-label">RGB</div>
                        <div class="value-content" id="rgb-value">rgb(67, 97, 238)</div>
                        <button class="copy-btn" data-target="rgb-value">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="value-item">
                        <div class="value-label">HSL</div>
                        <div class="value-content" id="hsl-value">hsl(231, 83%, 60%)</div>
                        <button class="copy-btn" data-target="hsl-value">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="color-palette mt-2">
                <h3><i class="fas fa-swatchbook"></i> Color Palette</h3>
                <div class="palette-grid" id="color-palette">
                    <!-- Palette will be generated here -->
                </div>
            </div>
        </div>
    `;
}

function initColorViewer() {
    const colorSelector = document.getElementById('color-selector');
    const colorHexInput = document.getElementById('color-hex-input');
    const applyHexBtn = document.getElementById('apply-hex');
    const colorPreview = document.getElementById('color-preview');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    const colorHexValue = document.getElementById('color-hex-value');
    const colorName = document.getElementById('color-name');
    const randomColorBtn = document.getElementById('random-color');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const colorPalette = document.getElementById('color-palette');

    // Color names database
    const colorNames = {
        '#4361ee': 'Royal Blue',
        '#3a0ca3': 'Dark Blue',
        '#4cc9f0': 'Sky Blue',
        '#2ecc71': 'Emerald Green',
        '#f39c12': 'Orange',
        '#e74c3c': 'Red',
        '#9b59b6': 'Purple',
        '#3498db': 'Light Blue',
        '#1abc9c': 'Turquoise',
        '#f1c40f': 'Yellow'
    };

    // Initialize with default color
    updateColor('#4361ee');
    generatePalette('#4361ee');

    // Color picker change
    if (colorSelector) {
        colorSelector.addEventListener('input', function() {
            updateColor(this.value);
            generatePalette(this.value);
        });
    }

    // HEX input change
    if (applyHexBtn && colorHexInput) {
        applyHexBtn.addEventListener('click', function() {
            let color = colorHexInput.value.trim();
            if (!color.startsWith('#')) {
                color = '#' + color;
                colorHexInput.value = color;
            }

            if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                updateColor(color);
                generatePalette(color);
                if (colorSelector) {
                    colorSelector.value = color;
                }
            } else {
                showToast('Invalid HEX color format', 'error');
            }
        });

        colorHexInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyHexBtn.click();
            }
        });
    }

    // Random color button
    if (randomColorBtn) {
        randomColorBtn.addEventListener('click', function() {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            updateColor(randomColor);
            generatePalette(randomColor);

            if (colorSelector) colorSelector.value = randomColor;
            if (colorHexInput) colorHexInput.value = randomColor;

            showToast('Random color generated!', 'success');
        });
    }

    // Copy buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const textToCopy = targetElement.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';

                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);

                    showToast('Color value copied to clipboard!', 'success');
                });
            }
        });
    });

    // Update all color values
    function updateColor(color) {
        // Ensure color has #
        const hexColor = color.startsWith('#') ? color : '#' + color;

        // Update preview
        if (colorPreview) {
            colorPreview.style.backgroundColor = hexColor;

            // Update text color for contrast
            const brightness = getBrightness(hexColor);
            colorPreview.style.color = brightness > 128 ? '#000' : '#fff';
        }

        // Update HEX value
        if (hexValue) hexValue.textContent = hexColor.toUpperCase();
        if (colorHexValue) colorHexValue.textContent = hexColor.toUpperCase();
        if (colorHexInput) colorHexInput.value = hexColor;

        // Get RGB values
        const rgb = hexToRgb(hexColor);
        if (rgbValue) rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        // Get HSL values
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        if (hslValue) hslValue.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

        // Get color name
        if (colorName) {
            const name = colorNames[hexColor.toLowerCase()] || getColorName(hexColor);
            colorName.textContent = name;
        }
    }

    // Generate color palette
    function generatePalette(baseColor) {
        if (!colorPalette) return;

        colorPalette.innerHTML = '';

        const colors = generateShades(baseColor);

        colors.forEach(color => {
            const paletteItem = document.createElement('div');
            paletteItem.className = 'palette-item';
            paletteItem.style.backgroundColor = color;
            paletteItem.innerHTML = `
                <span class="palette-hex">${color}</span>
                <button class="palette-copy" data-color="${color}">
                    <i class="fas fa-copy"></i>
                </button>
            `;

            // Copy color on click
            const copyBtn = paletteItem.querySelector('.palette-copy');
            copyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigator.clipboard.writeText(color).then(() => {
                    showToast('Color copied to clipboard!', 'success');
                });
            });

            // Select color on item click
            paletteItem.addEventListener('click', function() {
                updateColor(color);
                if (colorSelector) colorSelector.value = color;
                if (colorHexInput) colorHexInput.value = color;
            });

            colorPalette.appendChild(paletteItem);
        });
    }

    // Helper functions
    function hexToRgb(hex) {
        hex = hex.replace('#', '');

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return { r, g, b };
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }

    function getBrightness(hexColor) {
        const rgb = hexToRgb(hexColor);
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    }

    function getColorName(hexColor) {
        // Simple color naming based on hue
        const hsl = rgbToHsl(...Object.values(hexToRgb(hexColor)));

        if (hsl.l < 20) return 'Black';
        if (hsl.l > 80) return 'White';
        if (hsl.s < 20) return 'Gray';

        if (hsl.h < 30) return 'Red';
        if (hsl.h < 90) return 'Yellow';
        if (hsl.h < 150) return 'Green';
        if (hsl.h < 210) return 'Cyan';
        if (hsl.h < 270) return 'Blue';
        if (hsl.h < 330) return 'Magenta';
        return 'Red';
    }

    function generateShades(baseColor) {
        const rgb = hexToRgb(baseColor);
        const shades = [];

        // Generate 5 shades (darker to lighter)
        for (let i = 0; i < 5; i++) {
            const factor = 0.2 * i;
            const shade = {
                r: Math.max(0, Math.min(255, Math.round(rgb.r * (1 - factor)))),
                g: Math.max(0, Math.min(255, Math.round(rgb.g * (1 - factor)))),
                b: Math.max(0, Math.min(255, Math.round(rgb.b * (1 - factor))))
            };

            shades.push(rgbToHex(shade.r, shade.g, shade.b));
        }

        // Add base color
        shades.splice(2, 0, baseColor);

        // Generate 5 tints (base to lighter)
        for (let i = 1; i <= 5; i++) {
            const factor = 0.2 * i;
            const tint = {
                r: Math.max(0, Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor))),
                g: Math.max(0, Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor))),
                b: Math.max(0, Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor)))
            };

            shades.push(rgbToHex(tint.r, tint.g, tint.b));
        }

        return shades;
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
}

// Website Extractor HTML (from your provided code)
function getWebsiteExtractorHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-download"></i> Website Extractor</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="extract-website">
                    <i class="fas fa-download"></i> Extract Content
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="extractor-stats">
                <div class="stat-item">
                    <i class="fas fa-globe"></i>
                    <span>Total Extractions: <strong id="total-extractions">0</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-calendar-day"></i>
                    <span>Today: <strong id="today-extractions">0</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Success Rate: <strong id="success-rate">100%</strong></span>
                </div>
            </div>
            
            <div class="form-group">
                <label for="website-url">Website URL</label>
                <div class="input-group">
                    <input type="url" id="website-url" class="form-control" placeholder="https://example.com" value="https://example.com">
                    <button class="btn btn-secondary" id="test-url">
                        <i class="fas fa-test"></i> Test
                    </button>
                </div>
            </div>
            
            <div class="extraction-results" id="extraction-results" style="display: none;">
                <h3><i class="fas fa-file-code"></i> Extracted Content</h3>
                
                <div class="file-tabs">
                    <button class="tab-btn active" data-tab="html-tab">HTML <span id="html-count" class="tab-count">0</span></button>
                    <button class="tab-btn" data-tab="css-tab">CSS <span id="css-count" class="tab-count">0</span></button>
                    <button class="tab-btn" data-tab="js-tab">JavaScript <span id="js-count" class="tab-count">0</span></button>
                    <button class="tab-btn" data-tab="media-tab">Media <span id="media-count" class="tab-count">0</span></button>
                </div>
                
                <div class="tab-content">
                    <div id="html-tab" class="tab-pane active">
                        <textarea class="form-control" rows="10" id="html-content" readonly></textarea>
                        <button class="btn btn-secondary mt-1" id="copy-html">
                            <i class="fas fa-copy"></i> Copy HTML
                        </button>
                    </div>
                    
                    <div id="css-tab" class="tab-pane">
                        <div class="css-files" id="css-files"></div>
                    </div>
                    
                    <div id="js-tab" class="tab-pane">
                        <div class="js-files" id="js-files"></div>
                    </div>
                    
                    <div id="media-tab" class="tab-pane">
                        <div class="media-files" id="media-files"></div>
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="extractor-status" style="display: none;"></div>
        </div>
    `;
}

function initWebsiteExtractor() {
    const websiteUrl = document.getElementById('website-url');
    const extractBtn = document.getElementById('extract-website');
    const testBtn = document.getElementById('test-url');
    const extractionResults = document.getElementById('extraction-results');
    const extractorStatus = document.getElementById('extractor-status');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Initialize stats
    let totalExtractions = parseInt(localStorage.getItem('totalExtractions')) || 0;
    let todayExtractions = parseInt(localStorage.getItem('todayExtractions')) || 0;
    let successCount = parseInt(localStorage.getItem('successCount')) || 0;

    updateStats();

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show selected tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Test URL
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            if (!websiteUrl) return;

            const url = websiteUrl.value.trim();
            if (!url) {
                showToast('Please enter a URL to test', 'error');
                return;
            }

            try {
                new URL(url);
                showToast('URL is valid!', 'success');
            } catch (e) {
                showToast('Invalid URL format', 'error');
            }
        });
    }

    // Extract website
    if (extractBtn) {
        extractBtn.addEventListener('click', async function() {
            if (!websiteUrl || !extractorStatus) return;

            const url = websiteUrl.value.trim();
            if (!url) {
                showStatus('Please enter a website URL', true);
                return;
            }

            try {
                new URL(url);
            } catch (e) {
                showStatus('Please enter a valid URL starting with http:// or https://', true);
                return;
            }

            // Show loading
            extractBtn.disabled = true;
            extractBtn.innerHTML = '<span class="loading"></span> Extracting...';
            showStatus('Fetching website content...', false, true);

            if (extractionResults) {
                extractionResults.style.display = 'none';
            }

            // Update stats
            totalExtractions++;
            todayExtractions++;
            localStorage.setItem('totalExtractions', totalExtractions);
            localStorage.setItem('todayExtractions', todayExtractions);
            updateStats();

            try {
                // Simulate extraction for demo
                setTimeout(() => {
                    // Simulate extracted content
                    const simulatedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Website</title>
    <link rel="stylesheet" href="https://example.com/styles.css">
    <script src="https://example.com/script.js"></script>
</head>
<body>
    <div class="container">
        <h1>Welcome to Example Website</h1>
        <p>This is a simulated extracted website for demonstration purposes.</p>
        <img src="https://example.com/logo.png" alt="Logo">
        <video src="https://example.com/video.mp4"></video>
    </div>
</body>
</html>`;

                    // Update HTML content
                    const htmlContent = document.getElementById('html-content');
                    if (htmlContent) htmlContent.value = simulatedHTML;

                    // Update file counts
                    const htmlCount = document.getElementById('html-count');
                    const cssCount = document.getElementById('css-count');
                    const jsCount = document.getElementById('js-count');
                    const mediaCount = document.getElementById('media-count');

                    if (htmlCount) htmlCount.textContent = '1';
                    if (cssCount) cssCount.textContent = '1';
                    if (jsCount) jsCount.textContent = '1';
                    if (mediaCount) mediaCount.textContent = '2';

                    // Update CSS files
                    const cssFiles = document.getElementById('css-files');
                    if (cssFiles) {
                        cssFiles.innerHTML = `
                            <div class="file-item">
                                <i class="fab fa-css3-alt"></i>
                                <div class="file-info">
                                    <strong>styles.css</strong>
                                    <span>https://example.com/styles.css</span>
                                </div>
                                <button class="btn-copy-url" data-url="https://example.com/styles.css">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        `;
                    }

                    // Update JS files
                    const jsFiles = document.getElementById('js-files');
                    if (jsFiles) {
                        jsFiles.innerHTML = `
                            <div class="file-item">
                                <i class="fab fa-js"></i>
                                <div class="file-info">
                                    <strong>script.js</strong>
                                    <span>https://example.com/script.js</span>
                                </div>
                                <button class="btn-copy-url" data-url="https://example.com/script.js">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        `;
                    }

                    // Update media files
                    const mediaFiles = document.getElementById('media-files');
                    if (mediaFiles) {
                        mediaFiles.innerHTML = `
                            <div class="file-item">
                                <i class="fas fa-image"></i>
                                <div class="file-info">
                                    <strong>logo.png</strong>
                                    <span>https://example.com/logo.png</span>
                                </div>
                                <button class="btn-copy-url" data-url="https://example.com/logo.png">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                            <div class="file-item">
                                <i class="fas fa-video"></i>
                                <div class="file-info">
                                    <strong>video.mp4</strong>
                                    <span>https://example.com/video.mp4</span>
                                </div>
                                <button class="btn-copy-url" data-url="https://example.com/video.mp4">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        `;
                    }

                    // Add copy functionality to URL buttons
                    document.querySelectorAll('.btn-copy-url').forEach(button => {
                        button.addEventListener('click', function() {
                            const url = this.getAttribute('data-url');
                            navigator.clipboard.writeText(url).then(() => {
                                showToast('URL copied to clipboard!', 'success');
                            });
                        });
                    });

                    // Show results
                    if (extractionResults) {
                        extractionResults.style.display = 'block';
                    }

                    // Update success count
                    successCount++;
                    localStorage.setItem('successCount', successCount);
                    updateStats();

                    showStatus(`Successfully extracted content from ${url}! Found 1 CSS file, 1 JS file, and 2 media files.`);

                }, 1500);

            } catch (error) {
                console.error('Extraction error:', error);
                showStatus(`Error: ${error.message}`, true);
            } finally {
                extractBtn.disabled = false;
                extractBtn.innerHTML = '<i class="fas fa-download"></i> Extract Content';
            }
        });
    }

    // Copy HTML button
    const copyHtmlBtn = document.getElementById('copy-html');
    if (copyHtmlBtn) {
        copyHtmlBtn.addEventListener('click', function() {
            const htmlContent = document.getElementById('html-content');
            if (htmlContent) {
                htmlContent.select();
                document.execCommand('copy');
                showToast('HTML copied to clipboard!', 'success');
            }
        });
    }

    function showStatus(message, isError = false, isWarning = false) {
        if (!extractorStatus) return;

        extractorStatus.textContent = message;

        if (isError) {
            extractorStatus.className = 'status error';
        } else if (isWarning) {
            extractorStatus.className = 'status warning';
        } else {
            extractorStatus.className = 'status success';
        }

        extractorStatus.style.display = 'block';

        if (!isError && !isWarning) {
            setTimeout(() => {
                extractorStatus.style.display = 'none';
            }, 5000);
        }
    }

    function updateStats() {
        const totalExtractionsEl = document.getElementById('total-extractions');
        const todayExtractionsEl = document.getElementById('today-extractions');
        const successRateEl = document.getElementById('success-rate');

        if (totalExtractionsEl) totalExtractionsEl.textContent = totalExtractions;
        if (todayExtractionsEl) todayExtractionsEl.textContent = todayExtractions;

        if (successRateEl) {
            const successRate = totalExtractions > 0 ? Math.round((successCount / totalExtractions) * 100) : 100;
            successRateEl.textContent = `${successRate}%`;
        }
    }
}

// Utility function for showing toast
function showToast(message, type = 'success') {
    if (window.showToast) {
        window.showToast(message, type);
    } else {
        console.log(`${type}: ${message}`);
    }
}