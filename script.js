// ===== DATA STRUCTURE =====
let slides = [
    {
        id: 1,
        title: "SYSTEM INITIALIZATION",
        content: `<p>Welcome, Player.</p>
<ul>
  <li>Daily Quest: Presentation Design</li>
  <li>Reward: Professional Output</li>
  <li>Penalty: None</li>
</ul>`,
        notes: "Intro slide"
    }
];
let currentSlideIndex = 0;

// ===== SYSTEM CONFIGURATION (NEW) =====
let config = {
    accent: '#7b2cbf',
    bgOuter: '#0b0c15',
    bgInner: '#121420',
    width: 1920,
    height: 1080
};

// ===== INITIALIZATION =====
window.onload = function() {
    renderSlidesList();
    loadSlideToEditor();
    updateSystemSettings(); // Apply initial defaults
};

// ===== CORE FUNCTIONS =====
function renderSlidesList() {
    const container = document.getElementById('slidesList');
    container.innerHTML = '';
    document.getElementById('slide-count-badge').innerText = slides.length;

    slides.forEach((slide, index) => {
        const isActive = index === currentSlideIndex ? 'active' : '';
        
        const el = document.createElement('div');
        el.className = `slide-thumb ${isActive}`;
        el.innerHTML = `
            <div class="slide-num">LEVEL ${index + 1}</div>
            <div class="slide-title">${slide.title || 'Untitled'}</div>
            <div class="slide-preview">${getPreviewText(slide.content)}</div>
            <div class="thumb-actions">
                <i class="fas fa-copy icon-btn duplicate" title="Duplicate"></i>
                <i class="fas fa-trash icon-btn delete" title="Delete"></i>
            </div>
        `;
        
        // Button Listeners
        const duplicateBtn = el.querySelector('.duplicate');
        const deleteBtn = el.querySelector('.delete');

        duplicateBtn.addEventListener('click', (e) => duplicateSlide(index, e));
        deleteBtn.addEventListener('click', (e) => deleteSlide(index, e));

        // Selection
        el.onclick = (e) => {
            if (!e.target.classList.contains('icon-btn')) {
                currentSlideIndex = index;
                renderSlidesList();
                loadSlideToEditor();
            }
        };
        
        container.appendChild(el);
    });
}

function getPreviewText(content) {
    const rawContent = content || '';
    const textOnly = rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return textOnly.substring(0, 40) + (textOnly.length > 40 ? '...' : '');
}

function loadSlideToEditor() {
    const slide = slides[currentSlideIndex];
    document.getElementById('inpTitle').value = slide.title;
    document.getElementById('inpContent').value = slide.content;
    updatePreview();
}

function updateSlideData() {
    const slide = slides[currentSlideIndex];
    slide.title = document.getElementById('inpTitle').value;
    slide.content = document.getElementById('inpContent').value;
    
    // Update List Title for active thumb
    const activeThumb = document.querySelector('.slide-thumb.active .slide-title');
    if(activeThumb) activeThumb.innerText = slide.title;
    
    updatePreview();
}

// ===== SYSTEM SETTINGS UPDATE =====
function updateSystemSettings() {
    // 1. Get Values from inputs
    config.accent = document.getElementById('cfgAccent').value;
    config.bgOuter = document.getElementById('cfgBg').value;
    config.bgInner = document.getElementById('cfgCardBg').value;
    
    // 2. Parse Resolution
    let w = parseInt(document.getElementById('cfgW').value) || 1920;
    let h = parseInt(document.getElementById('cfgH').value) || 1080;
    config.width = w;
    config.height = h;

    // 3. Apply to CSS Variables for Preview
    const r = document.documentElement.style;
    r.setProperty('--preview-accent', config.accent);
    r.setProperty('--preview-bg-outer', config.bgOuter);
    r.setProperty('--preview-bg-inner', config.bgInner);
    r.setProperty('--accent-primary', config.accent); // Also update UI accent
    r.setProperty('--accent-glow', config.accent);

    // 4. Apply Aspect Ratio to Preview Wrapper
    // We calculate ratio using simple math for CSS
    document.getElementById('previewWrapper').style.aspectRatio = `${w} / ${h}`;
    
    // 5. Update Borders
    const els = document.querySelectorAll('.slide-thumb.active, .route-card');
    els.forEach(el => el.style.borderColor = config.accent);
}

function updatePreview() {
    const slide = slides[currentSlideIndex];
    const preview = document.getElementById('previewCard');
    
    preview.innerHTML = `
        <h1>${slide.title || 'Untitled'}</h1>
        <div class="slide-body">
            ${slide.content || '<p style="color: #666; font-style: italic;">[Empty Slot]</p>'}
        </div>
    `;
}

// ===== SLIDE ACTIONS =====
function addNewSlide() {
    slides.push({
        id: Date.now(),
        title: "NEW QUEST",
        content: "<p>Enter mission details...</p>",
        notes: ""
    });
    currentSlideIndex = slides.length - 1;
    renderSlidesList();
    loadSlideToEditor();
    showToast("New Level Added");
}

function duplicateSlide(index, event) {
    event.stopPropagation();
    const originalSlide = slides[index];
    const newSlide = {
        id: Date.now(),
        title: originalSlide.title + " (Copy)",
        content: originalSlide.content,
        notes: originalSlide.notes
    };
    slides.splice(index + 1, 0, newSlide);
    currentSlideIndex = index + 1;
    renderSlidesList();
    loadSlideToEditor();
    showToast("Level Duplicated");
}

function deleteSlide(index, event) {
    event.stopPropagation();
    if (slides.length <= 1) {
        showToast("Cannot destroy the last level!");
        return;
    }
    if(confirm("Destroy this level?")) {
        slides.splice(index, 1);
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = slides.length - 1;
        }
        renderSlidesList();
        loadSlideToEditor();
        showToast("Level Destroyed");
    }
}

// ===== TOOLBAR HELPERS =====
function insertTag(type) {
    const textarea = document.getElementById('inpContent');
    let tag = "";
    
    switch(type) {
        case 'h2': tag = "<h2>Subheading</h2>\n"; break;
        case 'p': tag = "<p>Text content goes here.</p>\n"; break;
        case 'ul': tag = "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n"; break;
        case 'code': tag = "<div class='code-block'>System.out.println('Hello');</div>\n"; break;
        case 'img': tag = "<img src='https://via.placeholder.com/800x400/2a0050/ffffff?text=IMAGE' alt='Desc'>\n"; break;
        case 'hr': tag = "<hr>\n"; break;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + tag + text.substring(end);
    updateSlideData();
    textarea.focus();
}

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== THE EXPORTER =====
function generateAndExport() {
    const slidesJson = JSON.stringify(slides);
    
    const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Presentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');
        
        :root {
            --accent: ${config.accent};
            --bg-outer: ${config.bgOuter};
            --bg-inner: ${config.bgInner};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Rajdhani', 'Segoe UI', sans-serif;
            background-color: var(--bg-outer);
            background-image: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, var(--bg-outer) 100%);
            height: 100vh;
            color: #e0e0e0;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* --- CANVAS --- */
        #drawingCanvas {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 50; pointer-events: none;
        }
        body.drawing-mode #drawingCanvas { pointer-events: auto; }
        
        body.mode-pen #drawingCanvas { cursor: crosshair; }
        body.mode-marker #drawingCanvas { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="yellow" opacity="0.5"/></svg>') 10 10, auto; }
        body.laser-active { cursor: none; }

        /* --- SLIDE CARD --- */
        .slide {
            width: 90vw; 
            max-width: ${config.width}px;
            /* DYNAMIC ASPECT RATIO */
            aspect-ratio: ${config.width} / ${config.height};
            
            background: var(--bg-inner);
            border: 1px solid var(--accent);
            box-shadow: 0 0 50px rgba(0,0,0,0.8), 0 0 20px var(--accent);
            border-radius: 5px;
            padding: 50px;
            display: none;
            position: relative;
            flex-direction: column;
            animation: fadeIn 0.6s ease;
            backdrop-filter: blur(10px);
            z-index: 20;
        }
        .slide.active { display: flex; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        /* TYPOGRAPHY */
        h1 { color: var(--accent); font-size: 3.5rem; text-transform: uppercase; border-bottom: 2px solid var(--accent); padding-bottom: 20px; margin-bottom: 30px; text-shadow: 0 0 10px var(--accent); letter-spacing: 2px; }
        h2 { color: #00b4d8; font-size: 2rem; margin-top: 30px; margin-bottom: 15px; }
        p { font-size: 1.4rem; line-height: 1.6; color: #d0d0d0; margin-bottom: 20px; }
        li { font-size: 1.3rem; margin-bottom: 10px; color: #ccc; }
        .code-block { background: #000; border: 1px solid #333; border-left: 4px solid #00b4d8; padding: 20px; font-family: monospace; color: #0f0; margin: 20px 0; font-size: 1.1rem; }
        img { max-width: 100%; border: 1px solid var(--accent); box-shadow: 0 0 15px rgba(0,0,0,0.5); }

        /* --- CONTROLS --- */
        .controls-overlay {
            position: fixed; bottom: 30px; width: 100%;
            display: flex; justify-content: center; align-items: center; gap: 30px;
            z-index: 100; pointer-events: none;
        }
        .control-panel {
            background: rgba(0,0,0,0.8); border: 1px solid #333;
            padding: 10px 20px; border-radius: 50px;
            pointer-events: auto; display: flex; gap: 15px;
            box-shadow: 0 0 15px var(--accent);
        }
        .btn {
            background: transparent; border: none; color: #888;
            font-size: 18px; cursor: pointer; transition: 0.2s;
            width: 40px; height: 40px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
        }
        .btn:hover { color: #fff; background: rgba(255,255,255,0.1); text-shadow: 0 0 5px #fff; }
        
        .btn.active-tool { color: var(--accent); text-shadow: 0 0 8px var(--accent); background: rgba(255, 255, 255, 0.1); }
        .btn.active-pen { color: #ff0055; text-shadow: 0 0 8px #ff0055; background: rgba(255, 0, 85, 0.1); }
        .btn.active-marker { color: #FFFF00; text-shadow: 0 0 8px #FFFF00; background: rgba(255, 255, 0, 0.1); }

        .page-counter { color: var(--accent); font-weight: bold; font-size: 18px; font-family: monospace; }
        
        /* LASER DOT */
        .laser-dot {
            width: 12px; height: 12px; background: #ff0055;
            border-radius: 50%; position: absolute; pointer-events: none;
            box-shadow: 0 0 10px #ff0055, 0 0 20px #ff0055;
            display: none; z-index: 9999;
        }

        /* --- RIGHT SIDE MENU (NEW FEATURE) --- */
        .menu-toggle {
            position: fixed; top: 30px; right: 30px; z-index: 1001;
            background: rgba(0,0,0,0.8); border: 1px solid var(--accent);
            color: var(--accent); padding: 10px; cursor: pointer;
            border-radius: 5px; font-weight: bold; transition: 0.3s;
        }
        .menu-toggle:hover { background: var(--accent); color: white; }

        .system-menu {
            position: fixed; top: 0; right: -300px; width: 300px; height: 100%;
            background: rgba(10,10,15, 0.95); border-left: 1px solid var(--accent);
            z-index: 1000; transition: right 0.3s ease; padding: 80px 20px 20px 20px;
            backdrop-filter: blur(5px); display: flex; flex-direction: column; gap: 10px;
        }
        .system-menu.open { right: 0; }
        
        .menu-item {
            padding: 15px; border: 1px solid #333; background: rgba(0,0,0,0.5);
            color: #aaa; cursor: pointer; transition: 0.2s; font-size: 14px;
        }
        .menu-item:hover { border-color: var(--accent); color: white; transform: translateX(-5px); }
        .menu-item.active { background: var(--accent); color: white; border-color: var(--accent); }

    </style>
</head>
<body>
    <div id="laser" class="laser-dot"></div>
    <canvas id="drawingCanvas"></canvas>
    
    <button class="menu-toggle" onclick="toggleMenu()">
        <i class="fas fa-bars"></i> MENU
    </button>
    
    <div class="system-menu" id="sideMenu">
        <h3 style="color:var(--accent); margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">QUEST LOG</h3>
        <div id="menuList"></div>
    </div>

    <div id="slideContainer"></div>

    <div class="controls-overlay">
        <div class="control-panel">
            <button class="btn" onclick="prevSlide()"><i class="fas fa-chevron-left"></i></button>
            <span class="page-counter" id="pgNum">1/1</span>
            <button class="btn" onclick="nextSlide()"><i class="fas fa-chevron-right"></i></button>
        </div>
        
        <div class="control-panel">
            <button class="btn" id="btnLaser" onclick="toggleTool('laser')"><i class="fas fa-crosshairs"></i></button>
            <button class="btn" id="btnPen" onclick="toggleTool('pen')"><i class="fas fa-pen"></i></button>
            <button class="btn" id="btnMarker" onclick="toggleTool('marker')"><i class="fas fa-highlighter"></i></button>
            <button class="btn" onclick="clearCanvas()"><i class="fas fa-eraser"></i></button>
            <button class="btn" onclick="toggleFull()"><i class="fas fa-expand"></i></button>
        </div>
    </div>

    <script>
        const slides = ${slidesJson};
        let curr = 0;
        
        // Setup Slides
        const container = document.getElementById('slideContainer');
        slides.forEach((s, i) => {
            const div = document.createElement('div');
            div.className = 'slide' + (i===0?' active':'');
            div.innerHTML = \`<h1>\${s.title}</h1>\${s.content}\`;
            container.appendChild(div);
        });
        
        // Setup Menu
        const menuList = document.getElementById('menuList');
        function buildMenu() {
            menuList.innerHTML = '';
            slides.forEach((s, i) => {
                const item = document.createElement('div');
                item.className = 'menu-item' + (i === curr ? ' active' : '');
                item.innerText = (i+1) + '. ' + (s.title || 'Untitled');
                item.onclick = () => { curr = i; updateUI(); clearCanvas(); toggleMenu(); };
                menuList.appendChild(item);
            });
        }
        buildMenu();

        function toggleMenu() {
            document.getElementById('sideMenu').classList.toggle('open');
        }

        function updateUI() {
            document.getElementById('pgNum').innerText = (curr+1) + '/' + slides.length;
            document.querySelectorAll('.slide').forEach((s,i) => {
                s.className = 'slide' + (i===curr?' active':'');
            });
            buildMenu(); // refresh active state in menu
        }

        function nextSlide() { if(curr < slides.length-1) { curr++; updateUI(); clearCanvas(); } }
        function prevSlide() { if(curr > 0) { curr--; updateUI(); clearCanvas(); } }
        function toggleFull() { if(!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }

        // --- TOOLS LOGIC ---
        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;
        let activeTool = null;
        
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.onresize = resize; resize();

        function toggleTool(tool) {
            if (activeTool === tool) {
                activeTool = null;
                document.body.className = '';
            } else {
                activeTool = tool;
                document.body.className = ''; 
                if (tool === 'pen') document.body.classList.add('drawing-mode', 'mode-pen');
                if (tool === 'marker') document.body.classList.add('drawing-mode', 'mode-marker');
                if (tool === 'laser') document.body.classList.add('laser-active');
            }
            updateButtonStates();
        }

        function updateButtonStates() {
            document.querySelectorAll('.btn').forEach(b => b.className = 'btn');
            if (activeTool === 'laser') document.getElementById('btnLaser').classList.add('active-tool');
            if (activeTool === 'pen') document.getElementById('btnPen').classList.add('active-pen');
            if (activeTool === 'marker') document.getElementById('btnMarker').classList.add('active-marker');
            document.getElementById('laser').style.display = (activeTool === 'laser') ? 'block' : 'none';
        }

        function clearCanvas() { ctx.clearRect(0,0,canvas.width, canvas.height); }

        canvas.addEventListener('mousedown', e => { 
            if(activeTool === 'pen' || activeTool === 'marker') { 
                drawing=true; 
                ctx.beginPath(); 
                ctx.moveTo(e.clientX, e.clientY); 
                
                if (activeTool === 'pen') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = '#ff0055'; 
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1;
                } else if (activeTool === 'marker') {
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.strokeStyle = '#FFFF00'; 
                    ctx.lineWidth = 20; 
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 0.5;
                }
            } 
        });

        window.addEventListener('mouseup', () => drawing=false);
        
        canvas.addEventListener('mousemove', e => {
            if(drawing && (activeTool === 'pen' || activeTool === 'marker')) {
                ctx.lineTo(e.clientX, e.clientY); 
                ctx.stroke();
            }
        });

        window.addEventListener('mousemove', e => {
            if(activeTool === 'laser') {
                const laser = document.getElementById('laser');
                laser.style.left = (e.clientX - 6) + 'px';
                laser.style.top = (e.clientY - 6) + 'px';
            }
        });

        document.addEventListener('keydown', e => {
            if(e.key === 'ArrowRight') nextSlide();
            if(e.key === 'ArrowLeft') prevSlide();
        });
    <\/script>
</body>
</html>`;

    const blob = new Blob([finalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'System_Presentation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("System Initialization Complete");
}