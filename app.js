/* ========================================
   SaaSIQ — Interactive Prototype JS
   ======================================== */

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
        // Update URL hash for direct navigation
        window.location.hash = pageId.replace('page-', '');
    }
}

// Hash-based routing — allows direct URL access like #dashboard, #landing, #login
function handleHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const pageId = 'page-' + hash;
        const target = document.getElementById(pageId);
        if (target) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            target.classList.add('active');
        }
    }
}
window.addEventListener('hashchange', handleHash);
document.addEventListener('DOMContentLoaded', handleHash);

// Dashboard Section Navigation
function showDashSection(sectionId) {
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Show the section
    document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('sec-' + sectionId);
    if (target) {
        target.classList.add('active');
        // Scroll main content to top
        document.querySelector('.main-content').scrollTo(0, 0);
    }
}

// Onboarding Steps
function nextOnboardStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
    // Show target step
    const target = document.getElementById('onboard-step-' + stepNum);
    if (target) target.classList.add('active');

    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNum) step.classList.add('completed');
        if (index + 1 === stepNum) step.classList.add('active');
    });
    document.querySelectorAll('.progress-line').forEach((line, index) => {
        line.classList.remove('active');
        if (index + 1 < stepNum) line.classList.add('active');
    });
}

// Smooth scroll for landing page
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Keyboard shortcut for search (Cmd+K / Ctrl+K)
document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) searchInput.focus();
    }
});

// Filter button toggle (for Discovery and Alerts pages)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
        const group = e.target.parentElement;
        if (group) {
            group.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        }
    }
});

// Settings sidebar navigation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('settings-nav-item') || e.target.closest('.settings-nav-item')) {
        const item = e.target.classList.contains('settings-nav-item') ? e.target : e.target.closest('.settings-nav-item');
        document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    }
});

// Suggestion chips in AI Copilot
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('suggestion-chip')) {
        const input = document.querySelector('.copilot-input input');
        if (input) {
            input.value = e.target.textContent;
            input.focus();
        }
    }
});

// Animated counters for KPI values (on section switch)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString('en-IN');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Sidebar toggle for mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar && backdrop) {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('open');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('sidebar-toggle');
    if (toggle) {
        toggle.addEventListener('click', toggleSidebar);
    }
    // Close sidebar when a nav item is clicked on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    });
});

// Integration card selection toggle (onboarding)
document.addEventListener('click', function(e) {
    const card = e.target.closest('.integration-card');
    if (card && !e.target.closest('button')) {
        // Only toggle if in onboarding
        if (card.closest('.onboarding-step')) {
            card.classList.toggle('selected');
        }
    }
});

// Notification button click
document.addEventListener('click', function(e) {
    const notifBtn = e.target.closest('.notification-btn');
    if (notifBtn) {
        showDashSectionDirect('alerts');
    }
});

// Direct section navigation (without event.currentTarget)
function showDashSectionDirect(sectionId) {
    document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('sec-' + sectionId);
    if (target) target.classList.add('active');

    // Update sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

// Add hover tooltips to app icons
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('app-icon')) {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.transition = 'transform 0.2s';
    }
});
document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('app-icon')) {
        e.target.style.transform = 'scale(1)';
    }
});

// ========== DEMO WALKTHROUGH ENGINE ==========
let demoState = { current: 1, total: 6, playing: true, timer: null, elapsed: 0, timerInterval: null };

function initDemo() {
    demoState.current = 1;
    demoState.elapsed = 0;
    buildDemoDots();
    updateDemoUI();
    startDemoTimer();
    if (demoState.playing) startDemoAutoPlay();
}

function buildDemoDots() {
    const container = document.getElementById('demo-dots');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= demoState.total; i++) {
        const dot = document.createElement('button');
        dot.className = 'demo-dot' + (i === 1 ? ' active' : '');
        dot.onclick = () => { demoState.current = i; updateDemoUI(); };
        container.appendChild(dot);
    }
}

function updateDemoUI() {
    // Steps
    for (let i = 1; i <= demoState.total; i++) {
        const step = document.getElementById('demo-step-' + i);
        if (step) step.classList.toggle('active', i === demoState.current);
    }
    // Dots
    const dots = document.querySelectorAll('.demo-dot');
    dots.forEach((d, idx) => d.classList.toggle('active', idx + 1 === demoState.current));
    // Progress bar
    const bar = document.getElementById('demo-progress-bar');
    if (bar) bar.style.width = ((demoState.current / demoState.total) * 100) + '%';
    // Step label
    const label = document.getElementById('demo-step-label');
    if (label) label.textContent = 'Step ' + demoState.current + ' of ' + demoState.total;
    // Prev/Next buttons
    const prev = document.getElementById('demo-prev');
    const next = document.getElementById('demo-next');
    if (prev) prev.disabled = demoState.current === 1;
    if (next) next.disabled = demoState.current === demoState.total;
}

function demoStep(dir) {
    const newStep = demoState.current + dir;
    if (newStep >= 1 && newStep <= demoState.total) {
        demoState.current = newStep;
        updateDemoUI();
    }
}

function toggleDemoPlay() {
    demoState.playing = !demoState.playing;
    const btn = document.getElementById('demo-play');
    if (btn) btn.innerHTML = demoState.playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    if (demoState.playing) {
        startDemoAutoPlay();
    } else {
        clearInterval(demoState.timer);
    }
}

function startDemoAutoPlay() {
    clearInterval(demoState.timer);
    demoState.timer = setInterval(() => {
        if (demoState.current < demoState.total) {
            demoState.current++;
            updateDemoUI();
        } else {
            demoState.current = 1;
            updateDemoUI();
        }
    }, 5000);
}

function startDemoTimer() {
    clearInterval(demoState.timerInterval);
    demoState.elapsed = 0;
    demoState.timerInterval = setInterval(() => {
        demoState.elapsed++;
        const mins = Math.floor(demoState.elapsed / 60);
        const secs = demoState.elapsed % 60;
        const el = document.getElementById('demo-timer');
        if (el) el.textContent = '⏱ ' + mins + ':' + (secs < 10 ? '0' : '') + secs;
    }, 1000);
}

function closeDemo() {
    clearInterval(demoState.timer);
    clearInterval(demoState.timerInterval);
    demoState.playing = true;
    showPage('page-landing');
}

// Hook into showPage to init demo when navigating to it
const _origShowPage = showPage;
showPage = function(pageId) {
    _origShowPage(pageId);
    if (pageId === 'page-demo') {
        initDemo();
    } else {
        clearInterval(demoState.timer);
        clearInterval(demoState.timerInterval);
    }
};

// Also handle hash routing for demo
const _origHandleHash = handleHash;
handleHash = function() {
    _origHandleHash();
    if (window.location.hash === '#demo') {
        initDemo();
    }
};

console.log('🚀 SaaSIQ Prototype loaded. Navigate through all screens using the sidebar or landing page CTAs.');
