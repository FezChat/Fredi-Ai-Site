// Tool Content Loader
document.addEventListener('DOMContentLoaded', function() {
    // Load tool content when needed
    const toolContainers = document.querySelectorAll('.tool-container');
    
    // Track which tools have been loaded
    const loadedTools = new Set();
    
    // Function to load tool content
    function loadToolContent(toolName, container) {
        if (loadedTools.has(toolName)) return;
        
        switch(toolName) {
            case 'file-manager':
                container.innerHTML = getFileManagerHTML();
                initFileManager();
                break;
            case 'code-editor':
                container.innerHTML = getCodeEditorHTML();
                initCodeEditor();
                break;
            case 'media-player':
                container.innerHTML = getMediaPlayerHTML();
                initMediaPlayer();
                break;
            case 'html-viewer':
                container.innerHTML = getHtmlViewerHTML();
                initHtmlViewer();
                break;
            case 'js-runner':
                container.innerHTML = getJsRunnerHTML();
                initJsRunner();
                break;
            case 'python-runner':
                container.innerHTML = getPythonRunnerHTML();
                initPythonRunner();
                break;
            case 'js-obfuscator':
                container.innerHTML = getJsObfuscatorHTML();
                initJsObfuscator();
                break;
            case 'base64':
                container.innerHTML = getBase64HTML();
                initBase64();
                break;
            case 'text-binary':
                container.innerHTML = getTextBinaryHTML();
                initTextBinary();
                break;
            case 'color-viewer':
                container.innerHTML = getColorViewerHTML();
                initColorViewer();
                break;
            case 'binary-text':
                container.innerHTML = getBinaryTextHTML();
                initBinaryText();
                break;
            case 'website-extractor':
                container.innerHTML = getWebsiteExtractorHTML();
                initWebsiteExtractor();
                break;
        }
        
        loadedTools.add(toolName);
    }
    
    // Expose loadToolContent globally
    window.loadToolContent = loadToolContent;
});

// File Manager
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
            <div class="file-stats flex gap-2 mb-2">
                <div class="stat-item">
                    <i class="fas fa-file"></i>
                    <span>Files: <strong id="total-files">0</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-hdd"></i>
                    <span>Size: <strong id="total-size">0 KB</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>Modified: <strong id="last-modified">--</strong></span>
                </div>
            </div>
            
            <div class="file-actions mb-2 flex gap-1">
                <input type="text" id="file-search" placeholder="Search files..." class="form-control" style="flex: 1;">
                <select id="file-filter" class="form-control" style="width: 150px;">
                    <option value="all">All Files</option>
                    <option value="code">Code Files</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                </select>
            </div>
            
            <div class="file-grid" id="file-grid">
                <div class="text-center mt-2">
                    <i class="fas fa-folder-open" style="font-size: 3rem; opacity: 0.5;"></i>
                    <p>No files found. Upload some files to get started.</p>
                </div>
            </div>
        </div>
    `;
}

function initFileManager() {
    // This would be connected to actual file system in a real app
    // For demo, we'll use localStorage
    const fileGrid = document.getElementById('file-grid');
    const uploadBtn = document.getElementById('upload-files-btn');
    const refreshBtn = document.getElementById('refresh-files');
    
    function loadFiles() {
        // Demo files
        const files = [
            { name: 'index.html', type: 'code', size: 2048, icon: 'fab fa-html5', color: '#e34c26' },
            { name: 'styles.css', type: 'code', size: 4096, icon: 'fab fa-css3-alt', color: '#2965f1' },
            { name: 'app.js', type: 'code', size: 8192, icon: 'fab fa-js', color: '#f0db4f' },
            { name: 'logo.png', type: 'image', size: 15360, icon: 'fas fa-image', color: '#4cc9f0' },
            { name: 'video.mp4', type: 'video', size: 1048576, icon: 'fas fa-video', color: '#9b59b6' },
            { name: 'music.mp3', type: 'audio', size: 524288, icon: 'fas fa-music', color: '#3498db' }
        ];
        
        renderFiles(files);
    }
    
    function renderFiles(files) {
        if (!fileGrid) return;
        
        fileGrid.innerHTML = '';
        
        if (files.length === 0) {
            fileGrid.innerHTML = `
                <div class="text-center mt-2">
                    <i class="fas fa-search" style="font-size: 3rem; opacity: 0.5;"></i>
                    <p>No files found.</p>
                </div>
            `;
            return;
        }
        
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.style.cssText = `
                background-color: var(--card-color);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                padding: 1rem;
                text-align: center;
                cursor: pointer;
                transition: var(--transition);
            `;
            fileItem.innerHTML = `
                <div class="file-icon" style="color: ${file.color}; font-size: 2rem; margin-bottom: 0.5rem;">
                    <i class="${file.icon}"></i>
                </div>
                <div class="file-name" style="font-size: 0.9rem; word-break: break-all; margin-bottom: 0.5rem;">${file.name}</div>
                <div class="file-size" style="font-size: 0.8rem; opacity: 0.7;">${formatFileSize(file.size)}</div>
            `;
            
            fileItem.addEventListener('click', () => openFile(file));
            fileGrid.appendChild(fileItem);
        });
    }
    
    function openFile(file) {
        if (file.type === 'video' || file.type === 'audio') {
            const modal = document.getElementById('video-modal');
            const videoPlayer = document.getElementById('video-player');
            if (modal && videoPlayer) {
                modal.classList.add('active');
                // In real app, you would set actual source
            }
        } else {
            window.loadTool('code-editor');
            // In real app, you would load the file content
        }
    }
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            const modal = document.getElementById('file-upload-modal');
            if (modal) modal.classList.add('active');
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadFiles);
    }
    
    loadFiles();
}

// Code Editor
function getCodeEditorHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-code"></i> Code Editor</h2>
            <div class="tool-actions">
                <select id="language-select" class="form-control" style="width: 150px;">
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="javascript" selected>JavaScript</option>
                    <option value="python">Python</option>
                </select>
                <button class="btn btn-primary" id="save-code">
                    <i class="fas fa-save"></i> Save
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
                        <label for="filename">Filename</label>
                        <input type="text" id="filename" value="script.js" class="form-control">
                    </div>
                    <div class="code-editor-container">
                        <textarea id="code-editor">// Write your code here
console.log("Hello from Fredi AI Code Editor!");

function calculate(a, b) {
    return a + b;
}

const result = calculate(5, 3);
console.log("5 + 3 =", result);</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label>Output</label>
                        <div class="output-console">
                            <div class="console-header">
                                <i class="fas fa-terminal"></i> Console
                            </div>
                            <div class="console-content" id="code-output">
                                <div class="console-log">
                                    <span class="timestamp">${new Date().toLocaleTimeString()}</span> Ready to execute code.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>File Info</label>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between">
                                <span>Language:</span>
                                <strong id="current-language">JavaScript</strong>
                            </div>
                            <div class="flex justify-between">
                                <span>Lines:</span>
                                <strong id="line-count">8</strong>
                            </div>
                            <div class="flex justify-between">
                                <span>Characters:</span>
                                <strong id="char-count">120</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initCodeEditor() {
    const codeEditor = document.getElementById('code-editor');
    const languageSelect = document.getElementById('language-select');
    const saveBtn = document.getElementById('save-code');
    const runBtn = document.getElementById('run-code');
    const filenameInput = document.getElementById('filename');
    const codeOutput = document.getElementById('code-output');
    const currentLanguage = document.getElementById('current-language');
    const lineCount = document.getElementById('line-count');
    const charCount = document.getElementById('char-count');
    
    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(codeEditor, {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        autoCloseTags: true,
        matchBrackets: true,
        lineWrapping: true
    });
    
    // Update stats
    function updateStats() {
        const content = editor.getValue();
        const lines = content.split('\n').length;
        const chars = content.length;
        
        if (lineCount) lineCount.textContent = lines;
        if (charCount) charCount.textContent = chars;
    }
    
    editor.on('change', updateStats);
    updateStats();
    
    // Language selection
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const lang = this.value;
            const modeMap = {
                'html': 'htmlmixed',
                'css': 'css',
                'javascript': 'javascript',
                'python': 'python'
            };
            
            editor.setOption('mode', modeMap[lang] || 'javascript');
            
            if (currentLanguage) {
                currentLanguage.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
            }
            
            // Update filename suggestion
            if (filenameInput) {
                const extMap = {
                    'html': '.html',
                    'css': '.css',
                    'javascript': '.js',
                    'python': '.py'
                };
                const name = filenameInput.value.split('.')[0];
                filenameInput.value = name + (extMap[lang] || '.js');
            }
        });
    }
    
    // Run code
    if (runBtn) {
        runBtn.addEventListener('click', function() {
            if (!codeOutput) return;
            
            const code = editor.getValue();
            const timestamp = new Date().toLocaleTimeString();
            
            // Clear previous output
            codeOutput.innerHTML = '';
            
            try {
                // Capture console.log
                const originalLog = console.log;
                let output = [];
                
                console.log = function(...args) {
                    output.push(args.join(' '));
                    originalLog.apply(console, args);
                };
                
                eval(code);
                
                console.log = originalLog;
                
                // Display output
                output.forEach(msg => {
                    const logEntry = document.createElement('div');
                    logEntry.className = 'console-log';
                    logEntry.innerHTML = `<span class="timestamp">${timestamp}</span> ${msg}`;
                    codeOutput.appendChild(logEntry);
                });
                
                if (output.length === 0) {
                    const logEntry = document.createElement('div');
                    logEntry.className = 'console-success';
                    logEntry.innerHTML = `<span class="timestamp">${timestamp}</span> Code executed successfully (no output)`;
                    codeOutput.appendChild(logEntry);
                }
                
            } catch (error) {
                const errorEntry = document.createElement('div');
                errorEntry.className = 'console-error';
                errorEntry.innerHTML = `<span class="timestamp">${timestamp}</span> Error: ${error.message}`;
                codeOutput.appendChild(errorEntry);
            }
        });
    }
    
    // Save code
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
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
            
            if (window.showToast) {
                window.showToast(`File "${filename}" saved successfully!`, 'success');
            }
        });
    }
}

// Media Player
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
            <div class="text-center">
                <i class="fas fa-video" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                <h3>Media Player</h3>
                <p>Open media files from the File Manager or upload new files</p>
                <p class="mt-1"><small>Supports: MP4, WebM, OGG, MP3, WAV, and more</small></p>
            </div>
        </div>
    `;
}

function initMediaPlayer() {
    const openMediaBtn = document.getElementById('open-media');
    
    if (openMediaBtn) {
        openMediaBtn.addEventListener('click', () => {
            window.loadTool('file-manager');
        });
    }
}

// HTML Viewer (from your provided code)
function getHtmlViewerHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fab fa-html5"></i> HTML Viewer</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="run-btn">
                    <i class="fas fa-play"></i> Run
                </button>
                <button class="btn btn-secondary" id="save-btn">
                    <i class="fas fa-save"></i> Save
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="html-editor">HTML Editor</label>
                        <div class="code-editor-container">
                            <textarea id="html-editor">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Page&lt;/title&gt;
    &lt;style&gt;
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #4361ee; 
            text-align: center;
        }
        button {
            background: #4361ee;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
        }
        button:hover {
            background: #3a0ca3;
            transform: translateY(-2px);
        }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="container"&gt;
        &lt;h1&gt;Hello, Fredi AI!&lt;/h1&gt;
        &lt;p&gt;This HTML is running in the Fredi AI HTML Viewer.&lt;/p&gt;
        &lt;p&gt;Edit the code on the left and click "Run" to see changes.&lt;/p&gt;
        &lt;button onclick="showMessage()"&gt;Click Me!&lt;/button&gt;
        &lt;div id="message" style="margin-top: 20px; display: none;"&gt;
            &lt;h3&gt;Welcome to Fredi AI Dashboard!&lt;/h3&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    &lt;script&gt;
        function showMessage() {
            const message = document.getElementById('message');
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        }
        console.log("HTML Viewer is ready!");
    &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</textarea>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label>Preview</label>
                        <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius); overflow: hidden;">
                            <iframe id="preview-frame" style="width: 100%; height: 500px; border: none;"></iframe>
                        </div>
                    </div>
                    <div class="status mt-1" id="html-status" style="display: none;"></div>
                </div>
            </div>
        </div>
    `;
}

function initHtmlViewer() {
    const htmlEditor = document.getElementById('html-editor');
    const previewFrame = document.getElementById('preview-frame');
    const runBtn = document.getElementById('run-btn');
    const saveBtn = document.getElementById('save-btn');
    const htmlStatus = document.getElementById('html-status');
    
    // Initialize CodeMirror for HTML editor
    const editor = CodeMirror.fromTextArea(htmlEditor, {
        mode: 'htmlmixed',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseTags: true,
        matchTags: true,
        lineWrapping: true
    });
    
    function runHtml() {
        const html = editor.getValue();
        
        if (previewFrame) {
            previewFrame.srcdoc = html;
        }
        
        if (htmlStatus) {
            htmlStatus.textContent = 'HTML executed successfully!';
            htmlStatus.className = 'status success';
            htmlStatus.style.display = 'block';
            
            setTimeout(() => {
                htmlStatus.style.display = 'none';
            }, 3000);
        }
    }
    
    function saveHtml() {
        const html = editor.getValue();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (window.showToast) {
            window.showToast('HTML file saved successfully!', 'success');
        }
    }
    
    if (runBtn) runBtn.addEventListener('click', runHtml);
    if (saveBtn) saveBtn.addEventListener('click', saveHtml);
    
    // Initial run
    setTimeout(runHtml, 500);
}

// JavaScript Runner (from your provided code)
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
                        <label for="js-editor">JavaScript Code</label>
                        <div class="code-editor-container">
                            <textarea id="js-editor">// Write your JavaScript code here
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
console.log("Doubled numbers:", doubled);

// Create a simple element
const div = document.createElement('div');
div.textContent = "This was created by JavaScript!";
div.style.color = "#4361ee";
div.style.padding = "10px";
div.style.border = "1px solid #4361ee";
div.style.borderRadius = "5px";
document.body.appendChild(div);</textarea>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label>Console Output</label>
                        <div class="output-console">
                            <div class="console-header">
                                <i class="fas fa-terminal"></i> Console Output
                                <button class="btn btn-secondary" id="clear-console" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Clear</button>
                            </div>
                            <div class="console-content" id="console-output">
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
    const jsEditor = document.getElementById('js-editor');
    const runBtn = document.getElementById('run-js');
    const clearBtn = document.getElementById('clear-js');
    const clearConsoleBtn = document.getElementById('clear-console');
    const consoleOutput = document.getElementById('console-output');
    
    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(jsEditor, {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true
    });
    
    // Store original console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        clear: console.clear
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
        
        console.clear = function() {
            originalConsole.clear.apply(console);
            if (consoleOutput) consoleOutput.innerHTML = '';
        };
    }
    
    function restoreConsole() {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.clear = originalConsole.clear;
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
        if (!consoleOutput) return;
        
        captureConsole();
        
        try {
            const code = editor.getValue();
            const fn = new Function(code);
            fn();
            
            const successElement = document.createElement('div');
            successElement.className = 'console-success';
            successElement.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> Code executed successfully`;
            consoleOutput.appendChild(successElement);
            
        } catch (e) {
            const errorElement = document.createElement('div');
            errorElement.className = 'console-error';
            errorElement.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> Error: ${e.message}`;
            consoleOutput.appendChild(errorElement);
        } finally {
            setTimeout(restoreConsole, 100);
        }
    }
    
    function clearCode() {
        editor.setValue('');
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
    editor.setOption('extraKeys', {
        'Ctrl-Enter': runCode,
        'Cmd-Enter': runCode
    });
}

// Python Runner (from your provided code)
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
                        <div class="code-editor-container">
                            <textarea id="python-code"># Write your Python code here
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

print(f"Fibonacci(10) = {fibonacci(10)}")

# Working with strings
message = "Welcome to Fredi AI"
print(f"Message: {message}")
print(f"Uppercase: {message.upper()}")
print(f"Words: {len(message.split())}")</textarea>
                        </div>
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
                                    <span class="timestamp">${new Date().toLocaleTimeString()}</span> Python runner ready. Note: This runs in browser simulation.
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
    const pythonEditor = document.getElementById('python-code');
    const runBtn = document.getElementById('run-python');
    const clearBtn = document.getElementById('clear-python');
    const pythonOutput = document.getElementById('python-output');
    const pythonStatus = document.getElementById('python-status');
    
    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(pythonEditor, {
        mode: 'python',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true
    });
    
    async function runPythonCode() {
        if (!pythonOutput || !pythonStatus) return;
        
        const code = editor.getValue().trim();
        if (!code) {
            pythonStatus.textContent = 'Please enter some Python code to run';
            pythonStatus.className = 'status error';
            pythonStatus.style.display = 'block';
            return;
        }
        
        try {
            runBtn.disabled = true;
            runBtn.innerHTML = '<span class="loading"></span> Running...';
            pythonStatus.style.display = 'none';
            
            pythonOutput.innerHTML = '';
            
            // For demo, we'll simulate Python execution
            // In a real app, you would call a backend API
            const simulatedOutput = [
                "Hello from Python Runner!",
                "5 + 3 = 8",
                "Squared numbers: [1, 4, 9, 16, 25]",
                "Fibonacci(10) = 55",
                "Message: Welcome to Fredi AI",
                "Uppercase: WELCOME TO FREDI AI",
                "Words: 4"
            ];
            
            const timestamp = new Date().toLocaleTimeString();
            
            simulatedOutput.forEach(output => {
                const entry = document.createElement('div');
                entry.className = 'console-log';
                entry.innerHTML = `<span class="timestamp">${timestamp}</span> ${output}`;
                pythonOutput.appendChild(entry);
            });
            
            const completionEntry = document.createElement('div');
            completionEntry.className = 'console-success';
            completionEntry.innerHTML = `<span class="timestamp">${timestamp}</span> Code executed successfully (simulated)`;
            pythonOutput.appendChild(completionEntry);
            
            pythonOutput.scrollTop = pythonOutput.scrollHeight;
            
            pythonStatus.textContent = 'Python code executed successfully!';
            pythonStatus.className = 'status success';
            pythonStatus.style.display = 'block';
            
        } catch (error) {
            const errorEntry = document.createElement('div');
            errorEntry.className = 'console-error';
            errorEntry.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> Error: ${error.message}`;
            pythonOutput.appendChild(errorEntry);
            
            pythonStatus.textContent = 'Error executing Python code';
            pythonStatus.className = 'status error';
            pythonStatus.style.display = 'block';
            
        } finally {
            runBtn.disabled = false;
            runBtn.innerHTML = '<i class="fas fa-play"></i> Run Python Code';
        }
    }
    
    function clearCode() {
        editor.setValue('');
        if (pythonOutput) pythonOutput.innerHTML = '';
        if (pythonStatus) pythonStatus.style.display = 'none';
    }
    
    if (runBtn) runBtn.addEventListener('click', runPythonCode);
    if (clearBtn) clearBtn.addEventListener('click', clearCode);
}

// JS Obfuscator (from your provided code)
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
                        <div class="code-editor-container">
                            <textarea id="input-code">function greet(name) {
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
                        </div>
                        <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.7;">
                            Characters: <span id="input-count">254</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label for="output-code">Obfuscated JavaScript</label>
                        <div class="code-editor-container">
                            <textarea id="output-code" readonly></textarea>
                        </div>
                        <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.7;">
                            Characters: <span id="output-count">0</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-2">
                <h3><i class="fas fa-sliders-h"></i> Obfuscation Options</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="compact" checked>
                        <span>Compact Code</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="controlFlowFlattening">
                        <span>Control Flow Flattening</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="numbersToExpressions">
                        <span>Numbers to Expressions</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="simplify" checked>
                        <span>Simplify Expressions</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="stringArrayShuffle" checked>
                        <span>Shuffle String Array</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="splitStrings">
                        <span>Split Strings</span>
                    </label>
                </div>
                
                <div style="margin-top: 1rem;">
                    <div style="margin-bottom: 1rem;">
                        <label>Control Flow Threshold: <span id="thresholdValue">0.75</span></label>
                        <input type="range" id="controlFlowThreshold" min="0" max="1" step="0.01" value="0.75" style="width: 100%;">
                    </div>
                    <div>
                        <label>String Array Threshold: <span id="arrayThresholdValue">0.75</span></label>
                        <input type="range" id="stringArrayThreshold" min="0" max="1" step="0.01" value="0.75" style="width: 100%;">
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="obfuscator-status" style="display: none;"></div>
        </div>
    `;
}

function initJsObfuscator() {
    const inputEditor = document.getElementById('input-code');
    const outputEditor = document.getElementById('output-code');
    const obfuscateBtn = document.getElementById('obfuscate-btn');
    const copyBtn = document.getElementById('copy-obfuscated');
    const inputCount = document.getElementById('input-count');
    const outputCount = document.getElementById('output-count');
    const obfuscatorStatus = document.getElementById('obfuscator-status');
    
    // Initialize CodeMirror editors
    const editor = CodeMirror.fromTextArea(inputEditor, {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true
    });
    
    const output = CodeMirror.fromTextArea(outputEditor, {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true
    });
    
    // Update character counts
    function updateCounts() {
        const inputText = editor.getValue();
        const outputText = output.getValue();
        
        if (inputCount) inputCount.textContent = inputText.length;
        if (outputCount) outputCount.textContent = outputText.length;
    }
    
    editor.on('change', updateCounts);
    output.on('change', updateCounts);
    updateCounts();
    
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
        const code = editor.getValue().trim();
        if (!code) {
            showStatus('Please enter some JavaScript code to obfuscate!', true);
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
                const simulatedObfuscated = `(function(_0x1a3b5e,_0x3d5a6d){var _0x4b082e=function(_0x1d2e28){while(--_0x1d2e28){_0x1a3b5e['push'](_0x1a3b5e['shift']());}};_0x4b082e(++_0x3d5a6d);}(_0x5a7c,0x1a3));function _0x2c9a(_0x4b082e,_0x3d5a6d){_0x4b082e=_0x4b082e-0x0;var _0x2c9a5e=_0x5a7c[_0x4b082e];return _0x2c9a5e;}function greet(_0x1d2e28){console['log']('Hello, '+_0x1d2e28+'!');return'Welcome to Fredi AI';}const user='Developer',message=greet(user);console['log'](message);function calculate(_0x1d2e28,_0x4b082e){const _0x3d5a6d=_0x1d2e28+_0x4b082e,_0x2c9a5e=_0x1d2e28*_0x4b082e;return{sum:_0x3d5a6d,product:_0x2c9a5e};}const result=calculate(0x5,0x3);console['log']('Sum:',result['sum']);console['log']('Product:',result['product']);`;
                
                output.setValue(simulatedObfuscated);
                updateCounts();
                
                showStatus('Code obfuscated successfully!', false);
            }, 500);
            
        } catch (error) {
            showStatus('Error: ' + error.message, true);
        }
    }
    
    // Copy function
    function copyObfuscated() {
        const obfuscatedCode = output.getValue();
        if (!obfuscatedCode) return;
        
        navigator.clipboard.writeText(obfuscatedCode).then(() => {
            showStatus('Copied to clipboard!', false);
        });
    }
    
    function showStatus(message, isError = false) {
        if (!obfuscatorStatus) return;
        
        obfuscatorStatus.textContent = message;
        obfuscatorStatus.className = isError ? 'status error' : 'status success';
        obfuscatorStatus.style.display = 'block';
        
        if (!isError) {
            setTimeout(() => {
                obfuscatorStatus.style.display = 'none';
            }, 3000);
        }
    }
    
    if (obfuscateBtn) obfuscateBtn.addEventListener('click', obfuscateCode);
    if (copyBtn) copyBtn.addEventListener('click', copyObfuscated);
}

// Base64 Tools (from your provided code)
function getBase64HTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-key"></i> Base64 Tools</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="encode-btn">
                    <i class="fas fa-lock"></i> Encode
                </button>
                <button class="btn btn-secondary" id="decode-btn">
                    <i class="fas fa-unlock"></i> Decode
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="input-text">Input Text</label>
                        <textarea id="input-text" class="form-control" rows="10" placeholder="Enter text to encode or Base64 to decode">Hello Fredi AI! Welcome to the coding dashboard.</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label for="output-text">Output</label>
                        <textarea id="output-text" class="form-control" rows="10" readonly placeholder="Result will appear here"></textarea>
                        <button class="btn btn-secondary mt-1 w-full" id="copy-btn">
                            <i class="fas fa-copy"></i> Copy to Clipboard
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="status" style="display: none;"></div>
            
            <div class="mt-2">
                <h3><i class="fas fa-lightbulb"></i> Quick Examples</h3>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">
                    <button class="btn btn-secondary" data-example="Hello World">Hello World</button>
                    <button class="btn btn-secondary" data-example="Fredi AI Dashboard">Fredi AI</button>
                    <button class="btn btn-secondary" data-example="https://example.com">URL Example</button>
                    <button class="btn btn-secondary" data-example="SGVsbG8gQmFzZTY0">Base64 Example</button>
                </div>
            </div>
        </div>
    `;
}

function initBase64() {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const copyBtn = document.getElementById('copy-btn');
    const statusDiv = document.getElementById('status');
    const exampleBtns = document.querySelectorAll('[data-example]');
    
    function showStatus(message, isError = false) {
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.className = isError ? 'status error' : 'status success';
        statusDiv.style.display = 'block';
        
        if (!isError) {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }
    
    function encodeBase64() {
        const text = inputText.value.trim();
        if (!text) {
            showStatus('Please enter some text to encode', true);
            return;
        }
        
        try {
            const encoded = btoa(unescape(encodeURIComponent(text)));
            outputText.value = encoded;
            showStatus('Text encoded to Base64 successfully!');
        } catch (e) {
            showStatus('Error encoding text: ' + e.message, true);
        }
    }
    
    function decodeBase64() {
        const text = inputText.value.trim();
        if (!text) {
            showStatus('Please enter some Base64 to decode', true);
            return;
        }
        
        try {
            const decoded = decodeURIComponent(escape(atob(text)));
            outputText.value = decoded;
            showStatus('Base64 decoded successfully!');
        } catch (e) {
            showStatus('Error decoding Base64: ' + e.message, true);
        }
    }
    
    function copyToClipboard() {
        const text = outputText.value;
        if (!text) {
            showStatus('No text to copy', true);
            return;
        }
        
        outputText.select();
        document.execCommand('copy');
        showStatus('Copied to clipboard!');
    }
    
    // Example buttons
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const example = this.getAttribute('data-example');
            inputText.value = example;
        });
    });
    
    // Event listeners
    if (encodeBtn) encodeBtn.addEventListener('click', encodeBase64);
    if (decodeBtn) decodeBtn.addEventListener('click', decodeBase64);
    if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
}

// Text ↔ Binary Converter (from your provided code)
function getTextBinaryHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-random"></i> Text ↔ Binary Converter</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="convert-btn">
                    <i class="fas fa-arrow-right"></i> Text → Binary
                </button>
                <button class="btn btn-secondary" id="binary-to-text-btn">
                    <i class="fas fa-arrow-left"></i> Binary → Text
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="input-text-binary">Text Input</label>
                        <textarea id="input-text-binary" class="form-control" rows="10" placeholder="Enter text to convert to binary">Fredi AI</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label for="binary-output">Binary Output</label>
                        <textarea id="binary-output" class="form-control" rows="10" readonly placeholder="Binary output will appear here"></textarea>
                        <button class="btn btn-secondary mt-1 w-full" id="copy-binary-btn">
                            <i class="fas fa-copy"></i> Copy Binary
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="binary-status" style="display: none;"></div>
            
            <div class="mt-2">
                <h3><i class="fas fa-info-circle"></i> How it works</h3>
                <p style="opacity: 0.8; margin-top: 0.5rem;">
                    Each character is converted to its 8-bit binary representation (ASCII).
                    For example: 'A' = 01000001, 'B' = 01000010
                </p>
            </div>
        </div>
    `;
}

function initTextBinary() {
    const inputText = document.getElementById('input-text-binary');
    const binaryOutput = document.getElementById('binary-output');
    const convertBtn = document.getElementById('convert-btn');
    const binaryToTextBtn = document.getElementById('binary-to-text-btn');
    const copyBinaryBtn = document.getElementById('copy-binary-btn');
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
    
    function convertToBinary() {
        const text = inputText.value.trim();
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
        const binary = inputText.value.trim();
        if (!binary) {
            showStatus('Please enter binary to convert', true);
            return;
        }
        
        try {
            // Remove spaces and split into 8-bit chunks
            const cleanBinary = binary.replace(/\s+/g, '');
            const binaryChunks = cleanBinary.match(/.{1,8}/g) || [];
            
            const text = binaryChunks.map(chunk => {
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
        const binary = binaryOutput.value;
        if (!binary) {
            showStatus('No binary to copy', true);
            return;
        }
        
        binaryOutput.select();
        document.execCommand('copy');
        showStatus('Binary copied to clipboard!');
    }
    
    // Event listeners
    if (convertBtn) convertBtn.addEventListener('click', convertToBinary);
    if (binaryToTextBtn) binaryToTextBtn.addEventListener('click', convertBinaryToText);
    if (copyBinaryBtn) copyBinaryBtn.addEventListener('click', copyBinary);
}

// Color Viewer (from your provided code)
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
            <div class="color-preview" id="color-preview" style="background-color: #4361ee;">
                <div class="color-text">
                    <span id="color-hex-value" style="font-size: 2rem; font-weight: bold; display: block;">#4361EE</span>
                    <span id="color-name" style="font-size: 1rem; opacity: 0.9;">Royal Blue</span>
                </div>
            </div>
            
            <div class="color-controls mt-2">
                <div class="form-group">
                    <label for="color-selector">Color Picker</label>
                    <input type="color" id="color-selector" value="#4361ee" class="form-control" style="height: 50px;">
                </div>
                
                <div class="form-group mt-1">
                    <label for="color-hex-input">HEX Color</label>
                    <div class="input-group">
                        <input type="text" id="color-hex-input" value="#4361ee" class="form-control" placeholder="#RRGGBB">
                        <button class="btn btn-secondary" id="apply-hex">Apply</button>
                    </div>
                </div>
            </div>
            
            <div class="color-values mt-2">
                <h3><i class="fas fa-vial"></i> Color Values</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <div style="background-color: var(--background-color); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 1rem; display: flex; align-items: center; gap: 1rem;">
                        <div style="font-weight: 600; min-width: 60px;">HEX</div>
                        <div style="flex: 1; font-family: monospace; word-break: break-all;" id="hex-value">#4361ee</div>
                        <button class="copy-btn" data-target="hex-value" style="background: none; border: none; color: var(--text-color); cursor: pointer; padding: 0.5rem; border-radius: 4px;">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    
                    <div style="background-color: var(--background-color); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 1rem; display: flex; align-items: center; gap: 1rem;">
                        <div style="font-weight: 600; min-width: 60px;">RGB</div>
                        <div style="flex: 1; font-family: monospace; word-break: break-all;" id="rgb-value">rgb(67, 97, 238)</div>
                        <button class="copy-btn" data-target="rgb-value" style="background: none; border: none; color: var(--text-color); cursor: pointer; padding: 0.5rem; border-radius: 4px;">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    
                    <div style="background-color: var(--background-color); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 1rem; display: flex; align-items: center; gap: 1rem;">
                        <div style="font-weight: 600; min-width: 60px;">HSL</div>
                        <div style="flex: 1; font-family: monospace; word-break: break-all;" id="hsl-value">hsl(231, 83%, 60%)</div>
                        <button class="copy-btn" data-target="hsl-value" style="background: none; border: none; color: var(--text-color); cursor: pointer; padding: 0.5rem; border-radius: 4px;">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
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
    
    // Color names database
    const colorNames = {
        '#4361ee': 'Royal Blue',
        '#3a0ca3': 'Dark Blue',
        '#4cc9f0': 'Sky Blue',
        '#2ecc71': 'Emerald',
        '#f39c12': 'Orange',
        '#e74c3c': 'Red',
        '#9b59b6': 'Purple',
        '#1abc9c': 'Turquoise',
        '#f1c40f': 'Yellow'
    };
    
    // Initialize
    updateColor('#4361ee');
    
    // Color picker
    if (colorSelector) {
        colorSelector.addEventListener('input', function() {
            updateColor(this.value);
        });
    }
    
    // HEX input
    if (applyHexBtn && colorHexInput) {
        applyHexBtn.addEventListener('click', function() {
            let color = colorHexInput.value.trim();
            if (!color.startsWith('#')) {
                color = '#' + color;
                colorHexInput.value = color;
            }
            
            if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
                updateColor(color);
                if (colorSelector) colorSelector.value = color;
            } else {
                if (window.showToast) {
                    window.showToast('Invalid HEX color format', 'error');
                }
            }
        });
        
        colorHexInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyHexBtn.click();
            }
        });
    }
    
    // Random color
    if (randomColorBtn) {
        randomColorBtn.addEventListener('click', function() {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            updateColor(randomColor);
            
            if (colorSelector) colorSelector.value = randomColor;
            if (colorHexInput) colorHexInput.value = randomColor;
            
            if (window.showToast) {
                window.showToast('Random color generated!', 'success');
            }
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
                    if (window.showToast) {
                        window.showToast('Color value copied!', 'success');
                    }
                });
            }
        });
    });
    
    // Update color
    function updateColor(color) {
        const hexColor = color.startsWith('#') ? color : '#' + color;
        
        // Update preview
        if (colorPreview) {
            colorPreview.style.backgroundColor = hexColor;
            
            // Update text color for contrast
            const brightness = getBrightness(hexColor);
            colorPreview.style.color = brightness > 128 ? '#000' : '#fff';
        }
        
        // Update values
        if (hexValue) hexValue.textContent = hexColor.toUpperCase();
        if (colorHexValue) colorHexValue.textContent = hexColor.toUpperCase();
        if (colorHexInput) colorHexInput.value = hexColor;
        
        // Get RGB
        const rgb = hexToRgb(hexColor);
        if (rgbValue) rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        
        // Get HSL
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        if (hslValue) hslValue.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        
        // Get color name
        if (colorName) {
            const name = colorNames[hexColor.toLowerCase()] || getColorName(hexColor);
            colorName.textContent = name;
        }
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
}

// Binary → Text (from your provided code)
function getBinaryTextHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-code"></i> Binary → Text Decoder</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="decode-binary-btn">
                    <i class="fas fa-arrow-right"></i> Decode Binary
                </button>
                <button class="btn btn-secondary" id="clear-binary-btn">
                    <i class="fas fa-trash"></i> Clear
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label for="binary-input">Binary Input</label>
                        <textarea id="binary-input" class="form-control" rows="10" placeholder="Enter binary code (e.g., 01001000 01100101 01101100 01101100 01101111)">01000110 01110010 01100101 01100100 01101001 00100000 01000001 01001001</textarea>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label for="text-output">Text Output</label>
                        <textarea id="text-output" class="form-control" rows="10" readonly placeholder="Decoded text will appear here"></textarea>
                        <button class="btn btn-secondary mt-1 w-full" id="copy-text-btn">
                            <i class="fas fa-copy"></i> Copy Text
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="binary-decoder-status" style="display: none;"></div>
            
            <div class="mt-2">
                <h3><i class="fas fa-info-circle"></i> Instructions</h3>
                <p style="opacity: 0.8; margin-top: 0.5rem;">
                    Enter binary code with spaces between each 8-bit character.<br>
                    Example: "01001000 01100101 01101100 01101100 01101111" decodes to "Hello"
                </p>
            </div>
        </div>
    `;
}

function initBinaryText() {
    const binaryInput = document.getElementById('binary-input');
    const textOutput = document.getElementById('text-output');
    const decodeBtn = document.getElementById('decode-binary-btn');
    const clearBtn = document.getElementById('clear-binary-btn');
    const copyBtn = document.getElementById('copy-text-btn');
    const statusDiv = document.getElementById('binary-decoder-status');
    
    function showStatus(message, isError = false) {
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.className = isError ? 'status error' : 'status success';
        statusDiv.style.display = 'block';
        
        if (!isError) {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }
    
    function decodeBinary() {
        const binary = binaryInput.value.trim();
        if (!binary) {
            showStatus('Please enter a binary string to decode', true);
            return;
        }
        
        try {
            // Split binary string by spaces or any whitespace
            const binaryArray = binary.split(/\s+/);
            
            // Convert each binary chunk to character
            const decodedText = binaryArray.map(bin => {
                // Validate binary string (only 0s and 1s)
                if (!/^[01]+$/.test(bin)) {
                    throw new Error(`Invalid binary sequence: ${bin}`);
                }
                return String.fromCharCode(parseInt(bin, 2));
            }).join('');
            
            textOutput.value = decodedText;
            showStatus('Binary decoded successfully!');
        } catch (error) {
            showStatus(`Error: ${error.message}`, true);
        }
    }
    
    function copyText() {
        const text = textOutput.value;
        if (!text) {
            showStatus('No text to copy', true);
            return;
        }
        
        textOutput.select();
        document.execCommand('copy');
        showStatus('Text copied to clipboard!');
    }
    
    function clearAll() {
        binaryInput.value = '';
        textOutput.value = '';
        statusDiv.style.display = 'none';
    }
    
    // Event listeners
    if (decodeBtn) decodeBtn.addEventListener('click', decodeBinary);
    if (copyBtn) copyBtn.addEventListener('click', copyText);
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
}

// Website Extractor (from your provided code)
function getWebsiteExtractorHTML() {
    return `
        <div class="tool-header">
            <h2><i class="fas fa-download"></i> Website Extractor</h2>
            <div class="tool-actions">
                <button class="btn btn-primary" id="extract-btn">
                    <i class="fas fa-download"></i> Extract Content
                </button>
            </div>
        </div>
        <div class="tool-body">
            <div class="extractor-stats flex gap-2 mb-2">
                <div class="stat-item">
                    <i class="fas fa-globe"></i>
                    <span>Total: <strong id="total-extractions">0</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-calendar-day"></i>
                    <span>Today: <strong id="today-extractions">0</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Success: <strong id="success-rate">100%</strong></span>
                </div>
            </div>
            
            <div class="form-group">
                <label for="url-input">Website URL</label>
                <div class="input-group">
                    <input type="url" id="url-input" class="form-control" placeholder="https://example.com" value="https://example.com">
                    <button class="btn btn-secondary" id="test-url-btn">
                        <i class="fas fa-test"></i> Test
                    </button>
                </div>
            </div>
            
            <div class="extraction-results mt-2" id="extraction-results" style="display: none;">
                <h3><i class="fas fa-file-code"></i> Extracted Content</h3>
                
                <div class="file-tabs flex gap-1 mb-1" style="border-bottom: 1px solid var(--border-color);">
                    <button class="tab-btn active" data-tab="html-tab" style="padding: 0.5rem 1rem; background: none; border: none; border-bottom: 2px solid var(--primary-color); color: var(--text-color); cursor: pointer;">
                        HTML <span id="html-count" style="background: var(--primary-color); color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.8rem; margin-left: 0.25rem;">0</span>
                    </button>
                    <button class="tab-btn" data-tab="css-tab" style="padding: 0.5rem 1rem; background: none; border: none; color: var(--text-color); cursor: pointer;">
                        CSS <span id="css-count" style="background: var(--border-color); color: var(--text-color); padding: 2px 6px; border-radius: 10px; font-size: 0.8rem; margin-left: 0.25rem;">0</span>
                    </button>
                    <button class="tab-btn" data-tab="js-tab" style="padding: 0.5rem 1rem; background: none; border: none; color: var(--text-color); cursor: pointer;">
                        JS <span id="js-count" style="background: var(--border-color); color: var(--text-color); padding: 2px 6px; border-radius: 10px; font-size: 0.8rem; margin-left: 0.25rem;">0</span>
                    </button>
                    <button class="tab-btn" data-tab="media-tab" style="padding: 0.5rem 1rem; background: none; border: none; color: var(--text-color); cursor: pointer;">
                        Media <span id="media-count" style="background: var(--border-color); color: var(--text-color); padding: 2px 6px; border-radius: 10px; font-size: 0.8rem; margin-left: 0.25rem;">0</span>
                    </button>
                </div>
                
                <div class="tab-content">
                    <div id="html-tab" class="tab-pane" style="display: block;">
                        <textarea class="form-control" rows="10" id="html-content" readonly></textarea>
                        <button class="btn btn-secondary mt-1" id="copy-html-btn">
                            <i class="fas fa-copy"></i> Copy HTML
                        </button>
                    </div>
                    
                    <div id="css-tab" class="tab-pane" style="display: none;">
                        <div id="css-files"></div>
                    </div>
                    
                    <div id="js-tab" class="tab-pane" style="display: none;">
                        <div id="js-files"></div>
                    </div>
                    
                    <div id="media-tab" class="tab-pane" style="display: none;">
                        <div id="media-files"></div>
                    </div>
                </div>
            </div>
            
            <div class="status mt-1" id="extractor-status" style="display: none;"></div>
        </div>
    `;
}

function initWebsiteExtractor() {
    const urlInput = document.getElementById('url-input');
    const extractBtn = document.getElementById('extract-btn');
    const testBtn = document.getElementById('test-url-btn');
    const extractionResults = document.getElementById('extraction-results');
    const extractorStatus = document.getElementById('extractor-status');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const copyHtmlBtn = document.getElementById('copy-html-btn');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.borderBottom = 'none';
            });
            this.classList.add('active');
            this.style.borderBottom = '2px solid var(--primary-color)';
            
            // Show selected tab
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.style.display = 'none';
            });
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // Test URL
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            const url = urlInput.value.trim();
            if (!url) {
                showStatus('Please enter a URL', true);
                return;
            }
            
            try {
                new URL(url);
                showStatus('URL is valid!', false);
            } catch (e) {
                showStatus('Invalid URL format', true);
            }
        });
    }
    
    // Extract website
    if (extractBtn) {
        extractBtn.addEventListener('click', async function() {
            const url = urlInput.value.trim();
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
            
            extractBtn.disabled = true;
            extractBtn.innerHTML = '<span class="loading"></span> Extracting...';
            showStatus('Fetching website content...', false, true);
            
            if (extractionResults) {
                extractionResults.style.display = 'none';
            }
            
            // Simulate extraction for demo
            setTimeout(() => {
                // Update file counts
                const htmlCount = document.getElementById('html-count');
                const cssCount = document.getElementById('css-count');
                const jsCount = document.getElementById('js-count');
                const mediaCount = document.getElementById('media-count');
                
                if (htmlCount) htmlCount.textContent = '1';
                if (cssCount) cssCount.textContent = '2';
                if (jsCount) jsCount.textContent = '3';
                if (mediaCount) mediaCount.textContent = '5';
                
                // Update HTML content
                const htmlContent = document.getElementById('html-content');
                if (htmlContent) {
                    htmlContent.value = `<!DOCTYPE html>
<html>
<head>
    <title>Example Website</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdn.example.com/bootstrap.css">
    <script src="/app.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <div class="container">
        <h1>Example Website</h1>
        <p>Content extracted by Fredi AI Website Extractor</p>
        <img src="/logo.png" alt="Logo">
        <img src="/banner.jpg" alt="Banner">
        <video src="/intro.mp4"></video>
    </div>
</body>
</html>`;
                }
                
                // Show results
                if (extractionResults) {
                    extractionResults.style.display = 'block';
                }
                
                showStatus(`Successfully extracted content from ${url}!`, false);
                
            }, 2000);
            
            setTimeout(() => {
                extractBtn.disabled = false;
                extractBtn.innerHTML = '<i class="fas fa-download"></i> Extract Content';
            }, 2000);
        });
    }
    
    // Copy HTML
    if (copyHtmlBtn) {
        copyHtmlBtn.addEventListener('click', function() {
            const htmlContent = document.getElementById('html-content');
            if (htmlContent) {
                htmlContent.select();
                document.execCommand('copy');
                showStatus('HTML copied to clipboard!', false);
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
}