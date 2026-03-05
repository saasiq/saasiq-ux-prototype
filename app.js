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

// Settings tab navigation
function showSettingsTab(tabId) {
    // Update sidebar active state
    document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    // Show the tab content
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    const target = document.getElementById('stab-' + tabId);
    if (target) target.classList.add('active');
}

// Theme card selection
document.addEventListener('click', function(e) {
    const themeCard = e.target.closest('.theme-card');
    if (themeCard) {
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
        themeCard.classList.add('active');
    }
    const colorDot = e.target.closest('.color-dot');
    if (colorDot) {
        document.querySelectorAll('.color-dot').forEach(c => c.classList.remove('active'));
        colorDot.classList.add('active');
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

// Sidebar toggle for mobile & desktop
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const mainContent = document.querySelector('.main-content');
    if (!sidebar) return;

    if (window.innerWidth <= 768) {
        // Mobile: slide in/out
        sidebar.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('open');
    } else {
        // Desktop: collapse/expand
        sidebar.classList.toggle('collapsed');
        if (mainContent) {
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '68px' : '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('sidebar-toggle');
    if (toggle) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }
    // Close sidebar when a nav item is clicked on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                const backdrop = document.getElementById('sidebar-backdrop');
                if (sidebar) sidebar.classList.remove('open');
                if (backdrop) backdrop.classList.remove('open');
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

// ========== MODAL SYSTEM ==========
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
            m.classList.remove('open');
            document.body.style.overflow = '';
        });
        // Also close org dropdown
        const dd = document.getElementById('org-dropdown');
        if (dd) dd.classList.remove('open');
    }
});

// ========== TOAST NOTIFICATIONS ==========
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<i class="fas ' + (icons[type] || 'fa-info-circle') + '"></i><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 4000);
}

// ========== ORG DROPDOWN ==========
function toggleOrgDropdown() {
    const dd = document.getElementById('org-dropdown');
    const chevron = document.querySelector('.org-chevron');
    if (dd) {
        dd.classList.toggle('open');
        if (chevron) chevron.style.transform = dd.classList.contains('open') ? 'rotate(180deg)' : '';
    }
}

// Close org dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dd = document.getElementById('org-dropdown');
    const orgSelector = e.target.closest('.sidebar-org');
    if (dd && dd.classList.contains('open') && !orgSelector) {
        dd.classList.remove('open');
        const chevron = document.querySelector('.org-chevron');
        if (chevron) chevron.style.transform = '';
    }
});

// Org dropdown item selection
document.addEventListener('click', function(e) {
    const item = e.target.closest('.org-dropdown-item:not(.add-org)');
    if (item) {
        // Update active state
        document.querySelectorAll('.org-dropdown-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        // Update org name in sidebar
        const nameEl = item.querySelector('strong');
        const planEl = item.querySelector('span');
        if (nameEl) {
            const sidebarName = document.querySelector('.org-selector > div > strong');
            const sidebarPlan = document.querySelector('.org-selector > div > span');
            if (sidebarName) sidebarName.textContent = nameEl.textContent;
            if (sidebarPlan && planEl) sidebarPlan.textContent = planEl.textContent.split('·')[0].trim();
        }
        // Close dropdown
        const dd = document.getElementById('org-dropdown');
        if (dd) dd.classList.remove('open');
        const chevron = document.querySelector('.org-chevron');
        if (chevron) chevron.style.transform = '';
        showToast('success', 'Switched to ' + (nameEl ? nameEl.textContent : 'organization'));
    }
    // Handle add-org items
    const addItem = e.target.closest('.org-dropdown-item.add-org');
    if (addItem) {
        const text = addItem.querySelector('span');
        showToast('info', text ? text.textContent : 'Organization action');
        const dd = document.getElementById('org-dropdown');
        if (dd) dd.classList.remove('open');
    }
});

// ======= User Profile Dropdown =======
function toggleUserDropdown() {
    const dd = document.getElementById('user-dropdown');
    if (dd) dd.classList.toggle('open');
}
// Close user dropdown on outside click
document.addEventListener('click', function(e) {
    const dd = document.getElementById('user-dropdown');
    const profile = e.target.closest('.user-profile');
    if (dd && dd.classList.contains('open') && !profile) {
        dd.classList.remove('open');
    }
});

// ========== AI COPILOT INTERACTIVE INPUT ==========
const copilotResponses = [
    { q: /spend|cost|budget/i, a: 'Your total monthly SaaS spend is <strong>₹7.04L</strong> across 47 apps. The top 3 cost drivers are Google Workspace (₹1.82L), Microsoft 365 (₹62K), and Slack (₹46K). I see <strong>₹1.2L/month in potential savings</strong> from unused licenses.' },
    { q: /shadow|unapproved|unsanctioned/i, a: 'I detected <strong>8 shadow IT applications</strong> being used without approval: CloudApp Pro, DataDog Lite, Notion, ChatGPT Plus, Grammarly, Canva Pro, Miro, and Loom. Total monthly cost: <strong>₹4,200</strong>. Shall I create a review policy?' },
    { q: /renew|contract|expir/i, a: 'You have <strong>4 contracts renewing in the next 30 days</strong>:<br>• Salesforce Enterprise — Mar 12 (₹24L/yr, auto-renew ON)<br>• GitHub Enterprise — Mar 28 (₹18.5L/yr)<br>• Zoom Business — Apr 1 (₹3.2L/yr)<br>• Figma Org — Apr 15 (₹8.4L/yr)<br>AI recommends negotiating Salesforce down by 34%.' },
    { q: /compliance|risk|soc|gdpr/i, a: 'Compliance Score: <strong>A+ (87/100)</strong>. 42 of 47 apps are SOC2 certified. <strong>2 apps need HIPAA review</strong>, and <strong>3 apps are missing DPA agreements</strong>. Shall I generate a compliance action plan?' },
    { q: /user|utilization|unused|license/i, a: 'License utilization across your stack is <strong>67%</strong>. Apps with lowest utilization:<br>• Monday.com: 22% (28 of 128 seats)<br>• Asana Business: 34% (45 of 132 seats)<br>• Figma: 26% (12 of 47 seats)<br>Consolidating could save <strong>₹12.8L/year</strong>.' },
];

function sendCopilotMsg() {
    const input = document.getElementById('copilot-input-field');
    if (!input || !input.value.trim()) return;
    const msg = input.value.trim();
    const chat = document.querySelector('.copilot-chat');
    if (!chat) return;

    // Add user message
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user';
    userDiv.innerHTML = '<div class="avatar-sm">RS</div><div class="message-content"><p>' + escapeHtml(msg) + '</p></div>';
    chat.appendChild(userDiv);
    input.value = '';

    // Find matching response
    let response = 'I analyzed your SaaS landscape for "' + escapeHtml(msg) + '". Based on current data across 47 apps and 380+ users, I\'d recommend reviewing the <strong>Spend Intelligence</strong> and <strong>AI Insights</strong> dashboards for detailed analytics. Want me to generate a specific report?';
    for (const r of copilotResponses) {
        if (r.q.test(msg)) { response = r.a; break; }
    }

    // Add typing indicator then response
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai';
    typingDiv.innerHTML = '<div class="avatar-sm ai-avatar"><i class="fas fa-robot"></i></div><div class="message-content"><p class="typing-indicator"><span></span><span></span><span></span></p></div>';
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
        typingDiv.remove();
        const aiDiv = document.createElement('div');
        aiDiv.className = 'chat-message ai';
        aiDiv.innerHTML = '<div class="avatar-sm ai-avatar"><i class="fas fa-robot"></i></div><div class="message-content"><p>' + response + '</p></div>';
        chat.appendChild(aiDiv);
        chat.scrollTop = chat.scrollHeight;
    }, 1200);
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
