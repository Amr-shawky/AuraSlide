// ===== DATA STRUCTURE =====
let slides = [
    {
        id: 1,
        title: "Entity-Relationship Diagrams (ERD)",
        content: `<p>Understanding the foundation of database design</p>
<ul>
  <li>Modern design approach</li>
  <li>Complete control tools</li>
  <li>Professional presentation</li>
</ul>`,
        notes: "Introduction slide - explain the purpose of ERDs"
    }
];
let currentSlideIndex = 0;

// ===== INITIALIZATION =====
window.onload = function() {
    renderSlidesList();
    loadSlideToEditor();
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
            <div class="slide-num">#${index + 1}</div>
            <div class="slide-title">${slide.title || 'Untitled Slide'}</div>
            <div class="slide-preview">${getPreviewText(slide.content)}</div>
            <div class="thumb-actions">
                <i class="fas fa-copy icon-btn duplicate" title="Duplicate"></i>
                <i class="fas fa-trash icon-btn delete" title="Delete"></i>
            </div>
        `;
        
        const duplicateBtn = el.querySelector('.duplicate');
        const deleteBtn = el.querySelector('.delete');

        duplicateBtn.addEventListener('click', function(event) {
            duplicateSlide(index, event);
        });

        deleteBtn.addEventListener('click', function(event) {
            deleteSlide(index, event);
        });

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
    return textOnly.substring(0, 50) + (textOnly.length > 50 ? '...' : '');
}

function loadSlideToEditor() {
    const slide = slides[currentSlideIndex];
    document.getElementById('inpTitle').value = slide.title;
    document.getElementById('inpContent').value = slide.content;
    document.getElementById('inpNotes').value = slide.notes || '';
    
    updatePreview();
}

function updateSlideData() {
    const slide = slides[currentSlideIndex];
    slide.title = document.getElementById('inpTitle').value;
    slide.content = document.getElementById('inpContent').value;
    slide.notes = document.getElementById('inpNotes').value;
    
    renderSlidesList();
    updatePreview();
}

function updatePreview() {
    const slide = slides[currentSlideIndex];
    const preview = document.getElementById('previewCard');
    
    preview.innerHTML = `
        <h1>${slide.title || 'Untitled Slide'}</h1>
        <div class="slide-body">
            ${slide.content || '<p style="color: #999;">No content yet. Use the editor to add content.</p>'}
        </div>
    `;
}

// ===== SLIDE ACTIONS =====
function addNewSlide() {
    slides.push({
        id: Date.now(),
        title: "New Slide",
        content: "<p>Add your content here...</p>",
        notes: ""
    });
    currentSlideIndex = slides.length - 1;
    renderSlidesList();
    loadSlideToEditor();
    showToast("New slide added successfully!");
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
    showToast("Slide duplicated successfully!");
}

function deleteSlide(index, event) {
    event.stopPropagation();
    if (slides.length <= 1) {
        showToast("Cannot delete the last slide!");
        return;
    }
    if(confirm("Are you sure you want to delete this slide?")) {
        slides.splice(index, 1);
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = slides.length - 1;
        }
        renderSlidesList();
        loadSlideToEditor();
        showToast("Slide deleted successfully!");
    }
}

// ===== TOOLBAR HELPERS =====
function insertTag(type) {
    const textarea = document.getElementById('inpContent');
    let tag = "";
    
    switch(type) {
        case 'h2': tag = "<h2>Subheading Title</h2>\n"; break;
        case 'p': tag = "<p>Write your paragraph text here.</p>\n"; break;
        case 'ul': tag = "<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n"; break;
        case 'code': tag = "<div class='code-block'>// Code here\nconsole.log('Hello');</div>\n"; break;
        case 'img': tag = "<img src='https://via.placeholder.com/800x400/2a5298/ffffff?text=Image' alt='Desc'>\n"; break;
        case 'hr': tag = "<hr>\n"; break;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    textarea.value = before + tag + after;
    textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    updateSlideData();
    textarea.focus();
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== THE GENERATOR (Creates the File with Advanced Tools) =====
function generateAndExport() {
    const slidesJson = JSON.stringify(slides);
    
    // Using a template string for the entire output file
    const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route Presentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            user-select: none; /* Prevent text selection while drawing */
        }

        /* --- CANVAS FOR DRAWING --- */
        #drawingCanvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 50; /* Above slides, below controls */
            pointer-events: none; /* Let clicks pass through unless drawing is active */
            cursor: crosshair;
        }
        
        body.drawing-mode #drawingCanvas {
            pointer-events: auto;
        }

        /* LASER POINTER EFFECT */
        body.laser-active {
            cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="red" opacity="0.8" stroke="white" stroke-width="2"/></svg>') 10 10, auto;
        }

        .presentation-container { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; z-index: 10; }
        
        .slide {
            width: 90%; max-width: 1200px; height: 85vh; background: white; border-radius: 20px;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4); padding: 60px; display: none;
            animation: slideIn 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            position: relative; overflow-y: auto; flex-direction: column;
            z-index: 20;
        }
        .slide.active { display: flex; }

        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        /* Slide Content Styles */
        h1 { color: #1e3c72; margin-bottom: 30px; border-bottom: 3px solid #e8e8e8; padding-bottom: 20px; font-size: 2.8rem; }
        h2 { color: #2a5298; margin-top: 25px; margin-bottom: 15px; font-size: 1.8rem; }
        p { font-size: 1.2rem; line-height: 1.7; color: #444; margin-bottom: 18px; }
        ul { padding-left: 35px; margin-bottom: 22px; }
        li { margin-bottom: 12px; font-size: 1.15rem; color: #333; }
        .code-block { background: #f8f8f8; border-left: 5px solid #2a5298; padding: 22px; font-family: 'Consolas', monospace; margin: 22px 0; color: #d63384; font-size: 1rem; white-space: pre-wrap; }
        img { max-width: 100%; border-radius: 12px; margin: 20px 0; }
        hr { border: none; border-top: 2px solid #e8e8e8; margin: 30px 0; }

        /* FLOATING SIDE BUTTONS */
        .side-buttons {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 100;
        }

        .float-btn {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            border: none;
            background: white;
            color: #1e3c72;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .float-btn.pill {
            width: auto;
            padding: 0 20px;
            font-weight: 600;
            font-size: 14px;
            gap: 8px;
        }

        .float-btn:hover { transform: scale(1.05); background: #f0f0f0; }
        
        .float-btn.active {
            background: #1e3c72;
            color: white;
            box-shadow: inset 0 3px 5px rgba(0,0,0,0.2);
        }

        /* Tool specific styling */
        .tool-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: rgba(255,255,255,0.2);
            padding: 10px;
            border-radius: 30px;
            backdrop-filter: blur(5px);
            margin-bottom: 10px;
        }

        /* NAVIGATION MENU OVERLAY */
        .nav-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 150;
            opacity: 0; visibility: hidden; transition: 0.3s;
        }
        .nav-overlay.open { opacity: 1; visibility: visible; }

        .nav-sidebar {
            position: fixed; top: 0; right: -320px; width: 320px; height: 100%;
            background: white; z-index: 151; transition: 0.3s;
            display: flex; flex-direction: column;
            box-shadow: -5px 0 20px rgba(0,0,0,0.2);
        }
        .nav-sidebar.open { right: 0; }

        .nav-header { padding: 20px; background: #1e3c72; color: white; display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
        .nav-list { flex: 1; overflow-y: auto; padding: 10px; }
        .nav-item { padding: 12px 15px; border-bottom: 1px solid #eee; cursor: pointer; font-size: 14px; color: #333; transition: 0.2s; display: flex; align-items: center; gap: 10px; }
        .nav-item:hover { background: #f5f5f5; color: #1e3c72; }
        .nav-item.current { background: #e8f0fe; color: #1e3c72; font-weight: 600; }
        
        /* BOTTOM CONTROLS */
        .bottom-controls {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: rgba(255,255,255,0.9); padding: 10px 30px; border-radius: 50px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2); display: flex; gap: 20px; align-items: center; z-index: 100;
        }
        .page-num { font-weight: bold; color: #333; }
        .nav-arrow { background: none; border: none; font-size: 18px; cursor: pointer; color: #1e3c72; }
    </style>
</head>
<body>

    <canvas id="drawingCanvas"></canvas>

    <div id="container" class="presentation-container"></div>

    <div class="side-buttons">
        <button class="float-btn pill" onclick="toggleMenu()" title="Slide List">
            <i class="fas fa-bars"></i> Menu
        </button>
        <button class="float-btn pill" id="btnLaser" onclick="toggleLaser()" title="Laser Pointer">
            <i class="fas fa-dot-circle" style="color: red;"></i> Laser
        </button>

        <div class="tool-group">
            <button class="float-btn" id="btnPen" onclick="activateTool('pen')" title="Pen (Red)">
                <i class="fas fa-pen"></i>
            </button>
            <button class="float-btn" id="btnMarker" onclick="activateTool('marker')" title="Highlighter (Yellow)">
                <i class="fas fa-highlighter"></i>
            </button>
            <button class="float-btn" id="btnEraser" onclick="activateTool('eraser')" title="Eraser">
                <i class="fas fa-eraser"></i>
            </button>
            <button class="float-btn" onclick="clearCanvas()" title="Clear Drawing">
                <i class="fas fa-trash-alt" style="color: #ff4d4d;"></i>
            </button>
        </div>
        
        <button class="float-btn" onclick="toggleFullscreen()" title="Full Screen">
            <i class="fas fa-expand"></i>
        </button>
    </div>

    <div class="nav-overlay" onclick="toggleMenu()"></div>
    <div class="nav-sidebar" id="navSidebar">
        <div class="nav-header">
            <span>Slide Navigation</span>
            <i class="fas fa-times" style="cursor:pointer" onclick="toggleMenu()"></i>
        </div>
        <div class="nav-list" id="navList"></div>
    </div>

    <div class="bottom-controls">
        <button class="nav-arrow" onclick="changeSlide(-1)"><i class="fas fa-chevron-left"></i></button>
        <span class="page-num" id="pageNum">1 / 1</span>
        <button class="nav-arrow" onclick="changeSlide(1)"><i class="fas fa-chevron-right"></i></button>
    </div>

    <script>
        const slidesData = ${slidesJson};
        const container = document.getElementById('container');
        const pageNumLabel = document.getElementById('pageNum');
        let currentIndex = 0;

        // Canvas Setup
        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentTool = null; // 'pen', 'marker', 'eraser', null
        let lastX = 0;
        let lastY = 0;

        function init() {
            container.innerHTML = '';
            slidesData.forEach((slide, index) => {
                const div = document.createElement('div');
                div.className = 'slide' + (index === 0 ? ' active' : '');
                div.innerHTML = \`<h1>\${slide.title}</h1><div class="content">\${slide.content}</div>\`;
                container.appendChild(div);
            });
            updateCounter();
            buildNavList();
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            setupCanvasEvents();
        }

        // --- CANVAS LOGIC ---
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function activateTool(tool) {
            // Disable laser if active
            document.body.classList.remove('laser-active');
            document.getElementById('btnLaser').classList.remove('active');

            // Reset other buttons
            ['btnPen', 'btnMarker', 'btnEraser'].forEach(id => document.getElementById(id).classList.remove('active'));

            if (currentTool === tool) {
                // Clicking active tool again turns it off
                currentTool = null;
                document.body.classList.remove('drawing-mode');
            } else {
                // Activate new tool
                currentTool = tool;
                document.getElementById('btn' + tool.charAt(0).toUpperCase() + tool.slice(1)).classList.add('active');
                document.body.classList.add('drawing-mode');
                
                // Set styles based on tool
                if (tool === 'pen') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.globalAlpha = 1;
                } else if (tool === 'marker') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = '#ffff00';
                    ctx.lineWidth = 20;
                    ctx.lineCap = 'square';
                    ctx.globalAlpha = 0.5;
                } else if (tool === 'eraser') {
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = 30;
                    ctx.lineCap = 'round';
                    ctx.globalAlpha = 1;
                }
            }
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function setupCanvasEvents() {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);
            
            // Touch support
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            }, {passive: false});

            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            }, {passive: false});

            canvas.addEventListener('touchend', () => {
                const mouseEvent = new MouseEvent('mouseup', {});
                canvas.dispatchEvent(mouseEvent);
            });
        }

        function startDrawing(e) {
            if (!currentTool) return;
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function draw(e) {
            if (!isDrawing || !currentTool) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function stopDrawing() {
            isDrawing = false;
        }

        // --- NAVIGATION ---
        function changeSlide(direction) {
            const slides = document.querySelectorAll('.slide');
            slides[currentIndex].classList.remove('active');
            currentIndex += direction;
            if (currentIndex >= slides.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            slides[currentIndex].classList.add('active');
            updateCounter();
            updateNavListHighlight();
            clearCanvas(); // Option: clear drawing when changing slides
        }

        function jumpToSlide(index) {
            const slides = document.querySelectorAll('.slide');
            slides[currentIndex].classList.remove('active');
            currentIndex = index;
            slides[currentIndex].classList.add('active');
            updateCounter();
            updateNavListHighlight();
            toggleMenu();
            clearCanvas();
        }

        function updateCounter() {
            pageNumLabel.innerText = (currentIndex + 1) + ' / ' + slidesData.length;
        }

        // --- CONTROLS ---
        function toggleMenu() {
            document.querySelector('.nav-overlay').classList.toggle('open');
            document.getElementById('navSidebar').classList.toggle('open');
        }

        function buildNavList() {
            const list = document.getElementById('navList');
            list.innerHTML = '';
            slidesData.forEach((slide, index) => {
                const item = document.createElement('div');
                item.className = 'nav-item' + (index === 0 ? ' current' : '');
                item.innerHTML = \`<span>\${index + 1}.</span> <span>\${slide.title || 'Untitled'}</span>\`;
                item.onclick = () => jumpToSlide(index);
                list.appendChild(item);
            });
        }

        function updateNavListHighlight() {
            const items = document.querySelectorAll('.nav-item');
            items.forEach((item, index) => {
                if (index === currentIndex) item.classList.add('current');
                else item.classList.remove('current');
            });
        }

        function toggleLaser() {
            // Turn off drawing tools if active
            if (currentTool) activateTool(currentTool); // This toggles it off
            
            document.body.classList.toggle('laser-active');
            document.getElementById('btnLaser').classList.toggle('active');
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') changeSlide(1);
            if (e.key === 'ArrowLeft') changeSlide(-1);
            if (e.key === 'Escape') {
                document.querySelector('.nav-overlay').classList.remove('open');
                document.getElementById('navSidebar').classList.remove('open');
            }
        });

        init();
    <\/script>
</body>
</html>`;

    const blob = new Blob([finalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Presentation_Advanced.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast("Presentation with drawing tools exported!");
}

// ===== EXPORT TO PDF FUNCTION =====
function exportToPDF() {
    showToast("Feature: Use Print > Save as PDF in the exported file.");
}



// ===== DATA STRUCTURE =====
// let slides = [
//     {
//         id: 1,
//         title: "AuraSlide Studio",
//         content: `<p>Welcome to the future of presentations.</p>
// <ul>
//   <li>Glassmorphism aesthetics</li>
//   <li>Advanced drawing tools</li>
//   <li>Laser pointer integration</li>
// </ul>`,
//         notes: "Intro slide"
//     }
// ];
// let currentSlideIndex = 0;

// ===== INITIALIZATION =====
window.onload = function() {
    renderSlidesList();
    loadSlideToEditor();
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
            <div class="slide-num">#${index + 1}</div>
            <div class="slide-title">${slide.title || 'Untitled'}</div>
            <div class="slide-preview">${getPreviewText(slide.content)}</div>
            <div class="thumb-actions">
                <i class="fas fa-copy icon-btn duplicate"></i>
                <i class="fas fa-trash icon-btn delete"></i>
            </div>
        `;
        
        el.querySelector('.duplicate').onclick = (e) => duplicateSlide(index, e);
        el.querySelector('.delete').onclick = (e) => deleteSlide(index, e);
        el.onclick = (e) => {
            if(!e.target.classList.contains('icon-btn')){
                currentSlideIndex = index; renderSlidesList(); loadSlideToEditor();
            }
        };
        container.appendChild(el);
    });
}

function getPreviewText(html) {
    return html ? html.replace(/<[^>]*>/g, ' ').substring(0, 40) + '...' : 'No content';
}

function loadSlideToEditor() {
    const s = slides[currentSlideIndex];
    document.getElementById('inpTitle').value = s.title;
    document.getElementById('inpContent').value = s.content;
    document.getElementById('inpNotes').value = s.notes || '';
    updatePreview();
}

function updateSlideData() {
    const s = slides[currentSlideIndex];
    s.title = document.getElementById('inpTitle').value;
    s.content = document.getElementById('inpContent').value;
    s.notes = document.getElementById('inpNotes').value;
    renderSlidesList();
    updatePreview();
}

function updatePreview() {
    const s = slides[currentSlideIndex];
    document.getElementById('previewCard').innerHTML = `
        <h1>${s.title || 'Untitled'}</h1>
        <div class="slide-body">${s.content || ''}</div>
    `;
}

// ===== ACTIONS =====
function addNewSlide() {
    slides.push({ id: Date.now(), title: "New Slide", content: "<p>Content...</p>", notes: "" });
    currentSlideIndex = slides.length - 1; renderSlidesList(); loadSlideToEditor();
}
function duplicateSlide(i, e) {
    e.stopPropagation();
    const copy = JSON.parse(JSON.stringify(slides[i])); copy.id = Date.now(); copy.title += " (Copy)";
    slides.splice(i+1, 0, copy); renderSlidesList();
}
function deleteSlide(i, e) {
    e.stopPropagation();
    if(slides.length <= 1) return alert("Keep one slide!");
    slides.splice(i, 1);
    if(currentSlideIndex >= slides.length) currentSlideIndex = slides.length - 1;
    renderSlidesList(); loadSlideToEditor();
}

// ===== EDITOR TOOLS =====
function insertTag(type) {
    const el = document.getElementById('inpContent');
    let tag = '';
    if(type==='h2') tag = '<h2>Subtitle</h2>\n';
    if(type==='p') tag = '<p>Paragraph text.</p>\n';
    if(type==='ul') tag = '<ul>\n  <li>Item 1</li>\n</ul>\n';
    if(type==='code') tag = '<div class="code-block">console.log("Hello");</div>\n';
    if(type==='img') tag = '<img src="https://via.placeholder.com/600x300" alt="img">\n';
    if(type==='hr') tag = '<hr>\n';
    
    const [start, end] = [el.selectionStart, el.selectionEnd];
    el.value = el.value.substring(0, start) + tag + el.value.substring(end);
    updateSlideData();
}

// ===== GENERATE PRESENTATION =====
function generateAndExport() {
    const slidesJson = JSON.stringify(slides);
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AuraSlide Presentation</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;800&display=swap');
    body { font-family: 'Inter', sans-serif; background: #0f172a; margin: 0; overflow: hidden; height: 100vh; color: white; user-select: none; }
    
    /* BACKGROUND */
    .bg-layer { position: absolute; top:0; left:0; width:100%; height:100%; z-index:0; 
        background: radial-gradient(circle at 10% 20%, #1e1b4b, #0f172a); }
    
    /* CANVAS */
    #drawingCanvas { position: absolute; top:0; left:0; width:100%; height:100%; z-index:50; pointer-events: none; }
    body.drawing-mode #drawingCanvas { pointer-events: auto; cursor: crosshair; }
    body.laser-active { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="6" fill="red" opacity="0.8" stroke="white"/></svg>') 10 10, auto; }

    /* SLIDES */
    .container { position: relative; z-index: 10; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
    .slide { 
        width: 90%; max-width: 1200px; aspect-ratio: 16/9; background: white; color: #1e293b;
        border-radius: 20px; padding: 60px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        display: none; flex-direction: column; animation: fadeUp 0.5s ease; position: relative;
    }
    .slide.active { display: flex; }
    @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }

    h1 { font-size: 3rem; font-weight: 800; background: -webkit-linear-gradient(0deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }
    h2 { color: #64748b; margin: 20px 0; }
    p, li { font-size: 1.2rem; line-height: 1.6; color: #475569; }
    .code-block { background: #1e293b; color: #a5b4fc; padding: 20px; border-radius: 10px; font-family: monospace; margin: 20px 0; }
    img { max-width: 100%; border-radius: 10px; margin: 20px 0; }

    /* CONTROLS UI */
    .ui-layer { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 100; display: flex; flex-direction: column; gap: 10px; }
    .btn { width: 50px; height: 50px; border-radius: 50%; border: none; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: white; cursor: pointer; font-size: 18px; transition: 0.2s; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; }
    .btn:hover { background: #6366f1; transform: scale(1.1); }
    .btn.active { background: #6366f1; box-shadow: 0 0 15px #6366f1; }
    .tool-group { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 30px; display: flex; flex-direction: column; gap: 10px; border: 1px solid rgba(255,255,255,0.05); }

    /* NAVIGATION */
    .nav-bar { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 100; display: flex; gap: 20px; align-items: center; background: rgba(0,0,0,0.5); padding: 10px 30px; border-radius: 50px; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1); }
    .nav-btn { background: transparent; border: none; color: white; cursor: pointer; font-size: 20px; }
    .page-ind { font-weight: bold; font-family: monospace; }
</style>
</head>
<body>
    <div class="bg-layer"></div>
    <canvas id="drawingCanvas"></canvas>
    
    <div class="container" id="cont"></div>

    <div class="ui-layer">
        <button class="btn" onclick="toggleFull()" title="Fullscreen"><i class="fas fa-expand"></i></button>
        <button class="btn" id="btnLaser" onclick="setTool('laser')" title="Laser"><i class="fas fa-dot-circle" style="color:#ef4444"></i></button>
        <div class="tool-group">
            <button class="btn" id="btnPen" onclick="setTool('pen')" title="Pen"><i class="fas fa-pen"></i></button>
            <button class="btn" id="btnMark" onclick="setTool('marker')" title="Marker"><i class="fas fa-highlighter" style="color:#facc15"></i></button>
            <button class="btn" id="btnErase" onclick="setTool('eraser')" title="Eraser"><i class="fas fa-eraser"></i></button>
            <button class="btn" onclick="clearDraw()" title="Clear"><i class="fas fa-trash"></i></button>
        </div>
    </div>

    <div class="nav-bar">
        <button class="nav-btn" onclick="move(-1)"><i class="fas fa-chevron-left"></i></button>
        <span class="page-ind" id="ind">1/1</span>
        <button class="nav-btn" onclick="move(1)"><i class="fas fa-chevron-right"></i></button>
    </div>

    <script>
        const data = ${slidesJson};
        let idx = 0;
        let tool = null;
        
        // Setup
        const cont = document.getElementById('cont');
        data.forEach((s, i) => {
            const d = document.createElement('div');
            d.className = 'slide' + (i===0?' active':'');
            d.innerHTML = '<h1>'+s.title+'</h1>' + s.content;
            cont.appendChild(d);
        });
        
        function move(dir) {
            document.querySelectorAll('.slide')[idx].classList.remove('active');
            idx += dir;
            if(idx >= data.length) idx=0; if(idx<0) idx=data.length-1;
            document.querySelectorAll('.slide')[idx].classList.add('active');
            document.getElementById('ind').innerText = (idx+1)+'/'+data.length;
            clearDraw(); // Optional: clear drawing on slide change
        }

        // Canvas & Tools
        const cvs = document.getElementById('drawingCanvas');
        const ctx = cvs.getContext('2d');
        let drawing = false;

        function resize() { cvs.width = window.innerWidth; cvs.height = window.innerHeight; }
        window.onresize = resize; resize();

        function setTool(t) {
            tool = (tool === t) ? null : t; // Toggle
            document.body.classList.remove('laser-active', 'drawing-mode');
            ['btnLaser','btnPen','btnMark','btnErase'].forEach(b=>document.getElementById(b).classList.remove('active'));
            
            if(tool) {
                document.getElementById(tool === 'marker' ? 'btnMark' : tool === 'eraser' ? 'btnErase' : tool === 'laser' ? 'btnLaser' : 'btnPen').classList.add('active');
                if(tool === 'laser') document.body.classList.add('laser-active');
                else document.body.classList.add('drawing-mode');
                
                ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
                ctx.lineWidth = tool === 'marker' ? 20 : (tool === 'eraser' ? 40 : 3);
                ctx.strokeStyle = tool === 'marker' ? 'rgba(250, 204, 21, 0.5)' : '#ef4444';
                ctx.lineCap = tool === 'marker' ? 'square' : 'round';
            }
        }

        function clearDraw() { ctx.clearRect(0,0,cvs.width,cvs.height); }

        cvs.addEventListener('mousedown', e => { if(!tool || tool==='laser') return; drawing=true; ctx.beginPath(); ctx.moveTo(e.clientX, e.clientY); });
        cvs.addEventListener('mousemove', e => { if(!drawing) return; ctx.lineTo(e.clientX, e.clientY); ctx.stroke(); });
        cvs.addEventListener('mouseup', () => drawing=false);

        function toggleFull() { !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen(); }
        document.onkeydown = e => { if(e.key==='ArrowRight') move(1); if(e.key==='ArrowLeft') move(-1); }
    <\/script>
</body>
</html>`;

    const blob = new Blob([html], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'AuraSlide_Presentation.html';
    a.click();
}