/* ========================================
   SaaSIQ — Interactive Prototype JS
   ======================================== */

/* ========= FEATURE FLAGS ========= */
const SaaSIQFlags = {
    _flags: {
        partnerships: { enabled: false, label: 'Partnership & Barter Intelligence', description: 'Track service-exchange deals, barter ROI, and non-monetary SaaS procurement' },
    },
    init() {
        const saved = localStorage.getItem('saasiq_feature_flags');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.keys(parsed).forEach(k => { if (this._flags[k]) this._flags[k].enabled = parsed[k]; });
            } catch(e) {}
        }
        this.applyAll();
    },
    isEnabled(flag) { return this._flags[flag]?.enabled || false; },
    toggle(flag) {
        if (!this._flags[flag]) return;
        this._flags[flag].enabled = !this._flags[flag].enabled;
        this._save();
        this.applyAll();
    },
    setEnabled(flag, val) {
        if (!this._flags[flag]) return;
        this._flags[flag].enabled = !!val;
        this._save();
        this.applyAll();
    },
    _save() {
        const data = {};
        Object.keys(this._flags).forEach(k => { data[k] = this._flags[k].enabled; });
        localStorage.setItem('saasiq_feature_flags', JSON.stringify(data));
    },
    applyAll() {
        Object.keys(this._flags).forEach(flag => {
            const els = document.querySelectorAll(`[data-feature-flag="${flag}"]`);
            els.forEach(el => {
                el.style.display = this._flags[flag].enabled ? '' : 'none';
            });
            // Update toggle switches in settings
            const toggle = document.getElementById(`flag-toggle-${flag}`);
            if (toggle) toggle.checked = this._flags[flag].enabled;
        });
    },
    getAll() { return this._flags; }
};

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
function showDashSection(sectionId, event) {
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    // Hide all sections, then show target
    document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('sec-' + sectionId);
    if (target) {
        target.classList.add('active');
        // Scroll main content to top
        var mainContent = document.querySelector('.main-content');
        if (mainContent) mainContent.scrollTo(0, 0);
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

// Keyboard shortcuts for navigation (G+D, G+S, G+C) and actions (Cmd+N, Cmd+E, Cmd+B)
(function() {
    var _gPressed = false, _gTimer = null;
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, select')) return;
        // G+key combos
        if (e.key === 'g' || e.key === 'G') {
            if (!e.metaKey && !e.ctrlKey && !e.altKey) {
                _gPressed = true;
                clearTimeout(_gTimer);
                _gTimer = setTimeout(function() { _gPressed = false; }, 800);
                return;
            }
        }
        if (_gPressed) {
            _gPressed = false;
            clearTimeout(_gTimer);
            if (e.key === 'd' || e.key === 'D') { e.preventDefault(); showPage('page-dashboard'); showDashSectionDirect('dashboard-home'); }
            if (e.key === 's' || e.key === 'S') { e.preventDefault(); showPage('page-dashboard'); showDashSectionDirect('settings'); }
            if (e.key === 'c' || e.key === 'C') { e.preventDefault(); showPage('page-dashboard'); showDashSectionDirect('ai-copilot'); }
            return;
        }
        // Cmd/Ctrl combos
        if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); openModal('modal-add-app'); }
        if ((e.metaKey || e.ctrlKey) && e.key === 'e') { e.preventDefault(); showToast('info', 'Report export initiated. Check your downloads.'); }
        if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); toggleSidebar(); }
    });
})();

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
function showSettingsTab(tabId, event) {
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
    if (target) {
        target.classList.add('active');
    }

    // Update sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionId)) {
            item.classList.add('active');
        }
    });
}

/**
 * Snooze an alert — fades it out with a "snoozed" state
 */
function snoozeAlert(btn) {
    var alertItem = btn.closest('.alert-item');
    if (!alertItem) return;

    // Show snooze duration picker
    var existing = document.getElementById('snooze-picker');
    if (existing) existing.remove();

    var picker = document.createElement('div');
    picker.id = 'snooze-picker';
    picker.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';
    picker.innerHTML = ''
        + '<div style="background:#fff;border-radius:16px;padding:28px;width:90%;max-width:360px;box-shadow:0 20px 60px rgba(0,0,0,0.2)">'
        + '  <h3 style="font-size:18px;font-weight:700;color:#111827;margin:0 0 6px"><i class="fas fa-clock" style="color:#7C3AED;margin-right:8px"></i>Snooze Alert</h3>'
        + '  <p style="font-size:13px;color:#6B7280;margin:0 0 20px">Choose how long to snooze this notification:</p>'
        + '  <div style="display:flex;flex-direction:column;gap:8px">'
        + '    <button class="snooze-opt" onclick="executeSnooze(this,\'1 hour\')" style="padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;text-align:left;transition:all 0.15s" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'#F5F3FF\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'"><i class="fas fa-clock" style="color:#7C3AED;margin-right:10px;width:16px"></i>1 hour</button>'
        + '    <button class="snooze-opt" onclick="executeSnooze(this,\'4 hours\')" style="padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;text-align:left;transition:all 0.15s" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'#F5F3FF\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'"><i class="fas fa-clock" style="color:#7C3AED;margin-right:10px;width:16px"></i>4 hours</button>'
        + '    <button class="snooze-opt" onclick="executeSnooze(this,\'1 day\')" style="padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;text-align:left;transition:all 0.15s" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'#F5F3FF\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'"><i class="fas fa-calendar-day" style="color:#7C3AED;margin-right:10px;width:16px"></i>1 day</button>'
        + '    <button class="snooze-opt" onclick="executeSnooze(this,\'1 week\')" style="padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;text-align:left;transition:all 0.15s" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'#F5F3FF\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'"><i class="fas fa-calendar-week" style="color:#7C3AED;margin-right:10px;width:16px"></i>1 week</button>'
        + '  </div>'
        + '  <button onclick="document.getElementById(\'snooze-picker\').remove()" style="margin-top:16px;width:100%;padding:10px;border-radius:10px;border:none;background:#F3F4F6;color:#6B7280;font-size:13px;font-weight:600;cursor:pointer">Cancel</button>'
        + '</div>';

    // Store reference to the alert item
    picker.dataset.alertIndex = Array.from(document.querySelectorAll('.alert-item')).indexOf(alertItem);
    document.body.appendChild(picker);
    picker.addEventListener('click', function(e) { if (e.target === picker) picker.remove(); });
}

function executeSnooze(optBtn, duration) {
    var picker = document.getElementById('snooze-picker');
    var alertIdx = picker ? parseInt(picker.dataset.alertIndex) : -1;
    if (picker) picker.remove();

    var alertItems = document.querySelectorAll('.alert-item');
    var alertItem = alertIdx >= 0 ? alertItems[alertIdx] : null;

    if (alertItem) {
        alertItem.style.transition = 'all 0.4s ease';
        alertItem.style.opacity = '0.4';
        alertItem.classList.remove('unread');
        // Replace the actions with a snoozed badge
        var actions = alertItem.querySelector('.alert-actions-inline');
        if (actions) {
            actions.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;background:#F3F4F6;color:#6B7280"><i class="fas fa-clock"></i> Snoozed for ' + duration + '</span>';
        }
        // Update the time label
        var timeEl = alertItem.querySelector('.alert-time');
        if (timeEl) timeEl.textContent = 'Snoozed';
    }

    showToast('info', 'Alert snoozed for ' + duration);
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
});

// Keyboard shortcut: ? to open shortcuts modal
document.addEventListener('keydown', function(e) {
    if (e.key === '?' && !e.target.matches('input, textarea, select')) {
        e.preventDefault();
        const modal = document.getElementById('modal-shortcuts');
        if (modal && modal.classList.contains('open')) {
            closeModal('modal-shortcuts');
        } else {
            openModal('modal-shortcuts');
        }
    }
});

// ======= User Profile Dropdown =======
function toggleUserDropdown() {
    const dd = document.getElementById('user-dropdown');
    if (!dd) return;
    const isOpen = dd.classList.toggle('open');
    const btn = document.getElementById('user-menu-btn');
    if (btn) btn.setAttribute('aria-expanded', isOpen);
}

// Clicking the profile area (not the 3-dot btn) also opens dropdown
document.addEventListener('click', function(e) {
    const dd = document.getElementById('user-dropdown');
    const profile = e.target.closest('.user-profile');
    const btn = e.target.closest('.user-menu-btn');
    // If clicked inside profile but NOT on the 3-dot button, toggle dropdown
    if (profile && !btn) {
        toggleUserDropdown();
        return;
    }
    // Close dropdown on outside click
    if (dd && dd.classList.contains('open') && !profile) {
        dd.classList.remove('open');
        const menuBtn = document.getElementById('user-menu-btn');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', false);
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

// ========== MARK ALL ALERTS READ ==========
function markAllAlertsRead() {
    document.querySelectorAll('.alert-item.unread').forEach(item => {
        item.classList.remove('unread');
        item.style.transition = 'background 0.4s';
    });
    showToast('success', 'All alerts marked as read');
}

// ========== CONTRACT RENEWAL FILTER ==========
function filterRenewals(days, btn) {
    // Toggle active state
    btn.closest('.filter-group').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Filter timeline items
    const items = document.querySelectorAll('.timeline-item[data-renew-days]');
    let visibleCount = 0;
    items.forEach(item => {
        const d = parseInt(item.getAttribute('data-renew-days'), 10);
        item.style.display = d <= days ? '' : 'none';
        if (d <= days) visibleCount++;
    });
    // Update KPI
    const countEl = document.getElementById('renewal-count');
    const labelEl = document.getElementById('renewal-period-label');
    if (countEl) countEl.textContent = visibleCount;
    if (labelEl) labelEl.textContent = 'In next ' + days + ' days';
    // Show/hide month headers - hide if no visible items
    document.querySelectorAll('.timeline-month').forEach(month => {
        const visibles = month.querySelectorAll('.timeline-item[data-renew-days]');
        const anyVisible = Array.from(visibles).some(i => i.style.display !== 'none');
        month.style.display = anyVisible ? '' : 'none';
    });
    showToast('info', 'Showing renewals in next ' + days + ' days');
}

// ========== RE-SCAN NOW ==========
function rescanNow(btn) {
    openModal('modal-rescan');
    const circle = document.getElementById('rescan-progress-circle');
    const percent = document.getElementById('rescan-percent');
    const status = document.getElementById('rescan-status');
    const detail = document.getElementById('rescan-detail');
    const icon = document.getElementById('rescan-icon');
    let progress = 0;
    const totalDash = 264;
    const steps = [
        { at: 10, status: 'Connecting to SSO providers...', detail: 'Google Workspace, Okta, Azure AD' },
        { at: 25, status: 'Scanning email receipts...', detail: 'Checking Gmail & Outlook for SaaS invoices' },
        { at: 40, status: 'Analyzing browser extension data...', detail: 'Detecting web-based applications' },
        { at: 55, status: 'Querying financial integrations...', detail: 'Stripe, QuickBooks transaction scan' },
        { at: 70, status: 'Running AI classification...', detail: 'Categorizing and risk-scoring discovered apps' },
        { at: 85, status: 'Comparing with known inventory...', detail: 'Identifying new shadow IT applications' },
        { at: 95, status: 'Finalizing results...', detail: 'Generating discovery report' }
    ];
    const interval = setInterval(() => {
        progress += 1;
        if (progress > 100) progress = 100;
        const offset = totalDash - (totalDash * progress / 100);
        if (circle) circle.setAttribute('stroke-dashoffset', offset);
        if (percent) percent.textContent = progress + '%';
        for (const step of steps) {
            if (progress >= step.at && progress < step.at + 2) {
                if (status) status.textContent = step.status;
                if (detail) detail.textContent = step.detail;
            }
        }
        if (progress >= 100) {
            clearInterval(interval);
            if (status) status.textContent = 'Scan complete!';
            if (detail) detail.textContent = '3 new applications discovered, 2 shadow IT flagged';
            if (icon) { icon.classList.remove('fa-spin'); }
            setTimeout(() => {
                closeModal('modal-rescan');
                if (icon) icon.classList.add('fa-spin');
                showToast('success', 'Re-scan complete! 3 new apps discovered, 2 flagged as shadow IT.');
            }, 1500);
        }
    }, 50);
}

// ========== APPROVE APP ==========
let _approveContext = {};
function openApproveModal(btn, appName, category, users, cost) {
    _approveContext = { btn, appName };
    document.getElementById('approve-app-name').textContent = appName;
    document.getElementById('approve-app-category').textContent = category;
    document.getElementById('approve-app-users').textContent = users;
    document.getElementById('approve-app-cost').textContent = cost;
    document.getElementById('approve-app-icon').textContent = appName.substring(0, 2).toUpperCase();
    openModal('modal-approve-app');
}

function confirmApproveApp() {
    closeModal('modal-approve-app');
    const card = _approveContext.btn ? _approveContext.btn.closest('.app-card') : null;
    if (card) {
        card.classList.remove('shadow');
        card.classList.add('managed');
        const banner = card.querySelector('.shadow-banner');
        if (banner) banner.remove();
        const statusBadge = card.querySelector('.status-badge');
        if (statusBadge) { statusBadge.textContent = 'Managed'; statusBadge.className = 'status-badge managed'; }
        const actions = card.querySelector('.app-card-actions');
        if (actions) actions.innerHTML = '<span style="color:var(--green);font-size:12px;font-weight:600"><i class="fas fa-check-circle"></i> Approved</span>';
    }
    showToast('success', _approveContext.appName + ' has been approved and added to managed apps!');
}

// ========== BLOCK APP ==========
let _blockContext = {};
function openBlockModal(btn, appName, users) {
    _blockContext = { btn, appName };
    document.getElementById('block-app-name').textContent = appName;
    document.getElementById('block-app-users').textContent = users;
    openModal('modal-block-app');
}

function confirmBlockApp() {
    closeModal('modal-block-app');
    const card = _blockContext.btn ? _blockContext.btn.closest('.app-card, .risk-app-item, .alert-item') : null;
    if (card) {
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        card.style.opacity = '0.3';
        const actions = card.querySelector('.app-card-actions, .alert-actions-inline');
        if (actions) actions.innerHTML = '<span style="color:var(--red);font-size:12px;font-weight:600"><i class="fas fa-ban"></i> Blocked</span>';
    }
    showToast('danger', _blockContext.appName + ' has been blocked! ' + document.getElementById('block-app-users').textContent + ' users will be notified.');
}

// ========== APPLY OPTIMIZATION ==========
function openApplyOptimizationModal(appName, recommendation, currentCost, projectedCost, savings, confidence) {
    document.getElementById('opt-app-name').textContent = appName;
    document.getElementById('opt-recommendation').textContent = recommendation;
    document.getElementById('opt-current-cost').textContent = currentCost;
    document.getElementById('opt-projected-cost').textContent = projectedCost;
    document.getElementById('opt-savings').textContent = savings;
    document.getElementById('opt-confidence').textContent = 'AI Confidence: ' + confidence;
    openModal('modal-apply-optimization');
}

// ========== REVIEW OPTIMIZATION ==========
function openReviewOptimizationModal(appName, details, currentCost, projectedCost, savings) {
    document.getElementById('review-app-name').textContent = appName;
    document.getElementById('review-details').textContent = details;
    document.getElementById('review-current-cost').textContent = currentCost;
    document.getElementById('review-projected-cost').textContent = projectedCost;
    document.getElementById('review-savings').textContent = savings;
    openModal('modal-review-optimization');
}

// ========== CONSOLIDATION PLAN ==========
function openPlanModal(appName, recommendation, currentCost, projectedCost, savings) {
    document.getElementById('plan-app-name').textContent = appName;
    document.getElementById('plan-recommendation').textContent = recommendation;
    document.getElementById('plan-current-cost').textContent = currentCost;
    document.getElementById('plan-projected-cost').textContent = projectedCost;
    document.getElementById('plan-savings').textContent = savings;
    openModal('modal-plan');
}

// ========== NEGOTIATE ==========
function openNegotiateModal(appName, currentPrice, targetPrice, discount) {
    document.getElementById('negotiate-app-name').textContent = appName;
    document.getElementById('negotiate-current').textContent = currentPrice;
    document.getElementById('negotiate-target').textContent = targetPrice;
    document.getElementById('negotiate-discount').textContent = discount;
    openModal('modal-negotiate');
}

// ========== INVITE MEMBER ==========
function confirmInviteMember() {
    const email = document.getElementById('invite-email').value.trim();
    if (!email) {
        showToast('warning', 'Please enter an email address.');
        return;
    }
    closeModal('modal-invite-member');
    showToast('success', 'Invitation sent to ' + email + '!');
    document.getElementById('invite-email').value = '';
}

// ========== GENERATE API KEY ==========
function confirmGenerateKey() {
    const name = document.getElementById('api-key-name').value.trim();
    if (!name) {
        showToast('warning', 'Please enter a key name.');
        return;
    }
    closeModal('modal-generate-key');
    const env = document.getElementById('api-key-env').value;
    const prefix = env === 'production' ? 'sk_live_' : 'sk_test_';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = prefix;
    for (let i = 0; i < 32; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('new-api-key-value').textContent = key;
    openModal('modal-key-display');
    document.getElementById('api-key-name').value = '';
}

function copyApiKey() {
    const key = document.getElementById('new-api-key-value').textContent;
    navigator.clipboard.writeText(key).then(() => {
        showToast('success', 'API key copied to clipboard!');
    }).catch(() => {
        // Fallback
        const range = document.createRange();
        range.selectNode(document.getElementById('new-api-key-value'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        showToast('success', 'API key copied to clipboard!');
    });
}

// ========== ADD WEBHOOK ==========
function confirmAddWebhook() {
    const name = document.getElementById('webhook-name').value.trim();
    const url = document.getElementById('webhook-url').value.trim();
    if (!name || !url) {
        showToast('warning', 'Please enter webhook name and URL.');
        return;
    }
    closeModal('modal-add-webhook');
    showToast('success', 'Webhook "' + name + '" created successfully!');
    document.getElementById('webhook-name').value = '';
    document.getElementById('webhook-url').value = '';
}

// ========================================================
//  APPEARANCE ENGINE — Theme, Accent Color, Density
// ========================================================

var _appearance = {
    theme: localStorage.getItem('saasiq-theme') || 'light',
    accent: localStorage.getItem('saasiq-accent') || '#7C3AED',
    accentLight: localStorage.getItem('saasiq-accent-light') || '#F5F3FF',
    accentDark: localStorage.getItem('saasiq-accent-dark') || '#5B21B6',
    density: localStorage.getItem('saasiq-density') || 'default'
};
var _pendingAppearance = Object.assign({}, _appearance);

// Apply saved appearance on page load
(function initAppearance() {
    applyThemeToDOM(_appearance.theme);
    applyAccentToDOM(_appearance.accent, _appearance.accentLight, _appearance.accentDark);
    applyDensityToDOM(_appearance.density);
    // Sync landing theme toggle icon
    var effective = _appearance.theme;
    if (effective === 'system') {
        effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var landingIcon = document.getElementById('landing-theme-icon');
    if (landingIcon) {
        landingIcon.className = effective === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
})();

// ----- Landing Theme Toggle -----
function toggleLandingTheme() {
    var icon = document.getElementById('landing-theme-icon');
    var currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyThemeToDOM(newTheme);
    // Update icon
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    // Persist
    localStorage.setItem('saasiq-theme', newTheme);
    _appearance.theme = newTheme;
    _pendingAppearance.theme = newTheme;
    // Sync settings theme cards if visible
    document.querySelectorAll('.theme-card').forEach(function(c) {
        c.classList.remove('active');
        var check = c.querySelector('.theme-check');
        if (check) check.remove();
        if (c.getAttribute('data-theme') === newTheme) {
            c.classList.add('active');
            var checkIcon = document.createElement('i');
            checkIcon.className = 'fas fa-check-circle theme-check';
            c.appendChild(checkIcon);
        }
    });
}

// ----- Theme -----
function selectTheme(theme, el) {
    _pendingAppearance.theme = theme;
    // Toggle active class on cards
    document.querySelectorAll('.theme-card').forEach(function(c) {
        c.classList.remove('active');
        var check = c.querySelector('.theme-check');
        if (check) check.remove();
    });
    el.classList.add('active');
    var icon = document.createElement('i');
    icon.className = 'fas fa-check-circle theme-check';
    el.appendChild(icon);
    // Live preview
    applyThemeToDOM(theme);
    showPreviewBar();
}

function applyThemeToDOM(theme) {
    var root = document.documentElement;
    // Determine effective theme
    var effective = theme;
    if (theme === 'system') {
        effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', effective);
    // Also toggle class for easy CSS targeting
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add('theme-' + effective);
}

// ----- Accent Color -----
function selectAccent(el) {
    _pendingAppearance.accent = el.getAttribute('data-color');
    _pendingAppearance.accentLight = el.getAttribute('data-light');
    _pendingAppearance.accentDark = el.getAttribute('data-dark');
    // Toggle active
    document.querySelectorAll('.color-dot').forEach(function(d) { d.classList.remove('active'); });
    el.classList.add('active');
    // Live preview
    applyAccentToDOM(_pendingAppearance.accent, _pendingAppearance.accentLight, _pendingAppearance.accentDark);
    showPreviewBar();
}

function applyAccentToDOM(color, light, dark) {
    var root = document.documentElement.style;
    root.setProperty('--primary', color);
    root.setProperty('--primary-light', light || color + '80');
    root.setProperty('--primary-dark', dark || color);
    root.setProperty('--primary-bg', light || '#F5F3FF');
    // Update sidebar active items and other accent-colored elements
    document.querySelectorAll('.sidebar-link.active, .settings-nav-item.active').forEach(function(el) {
        el.style.color = color;
    });
}

// ----- Density -----
function selectDensity(density, el) {
    _pendingAppearance.density = density;
    // Toggle active
    document.querySelectorAll('.density-options .radio-option').forEach(function(r) { r.classList.remove('active'); });
    el.classList.add('active');
    // Live preview
    applyDensityToDOM(density);
    showPreviewBar();
}

function applyDensityToDOM(density) {
    var root = document.documentElement;
    root.classList.remove('density-comfortable', 'density-default', 'density-compact');
    root.classList.add('density-' + density);
}

// ----- Preview Bar -----
function showPreviewBar() {
    var bar = document.getElementById('appearance-preview');
    if (bar) {
        bar.style.display = 'block';
        var desc = document.getElementById('preview-desc');
        var changes = [];
        if (_pendingAppearance.theme !== _appearance.theme) changes.push('Theme: ' + _pendingAppearance.theme);
        if (_pendingAppearance.accent !== _appearance.accent) changes.push('Accent: ' + _pendingAppearance.accent);
        if (_pendingAppearance.density !== _appearance.density) changes.push('Density: ' + _pendingAppearance.density);
        if (desc) desc.textContent = changes.length ? 'Pending: ' + changes.join(' · ') : 'No unsaved changes';
    }
}

// ----- Apply & Save -----
function applyAppearance() {
    _appearance = Object.assign({}, _pendingAppearance);
    localStorage.setItem('saasiq-theme', _appearance.theme);
    localStorage.setItem('saasiq-accent', _appearance.accent);
    localStorage.setItem('saasiq-accent-light', _appearance.accentLight);
    localStorage.setItem('saasiq-accent-dark', _appearance.accentDark);
    localStorage.setItem('saasiq-density', _appearance.density);
    var bar = document.getElementById('appearance-preview');
    if (bar) bar.style.display = 'none';
    showToast('success', 'Appearance settings saved! Theme: ' + _appearance.theme + ', Accent: ' + getAccentName(_appearance.accent) + ', Density: ' + _appearance.density);
}

function resetAppearance() {
    // Reset to defaults
    _pendingAppearance = { theme: 'light', accent: '#7C3AED', accentLight: '#F5F3FF', accentDark: '#5B21B6', density: 'default' };
    _appearance = Object.assign({}, _pendingAppearance);
    localStorage.removeItem('saasiq-theme');
    localStorage.removeItem('saasiq-accent');
    localStorage.removeItem('saasiq-accent-light');
    localStorage.removeItem('saasiq-accent-dark');
    localStorage.removeItem('saasiq-density');
    // Apply to DOM
    applyThemeToDOM('light');
    applyAccentToDOM('#7C3AED', '#F5F3FF', '#5B21B6');
    applyDensityToDOM('default');
    // Reset UI selections
    document.querySelectorAll('.theme-card').forEach(function(c) {
        c.classList.remove('active');
        var check = c.querySelector('.theme-check');
        if (check) check.remove();
    });
    var lightCard = document.querySelector('.theme-card[data-theme="light"]');
    if (lightCard) {
        lightCard.classList.add('active');
        var icon = document.createElement('i');
        icon.className = 'fas fa-check-circle theme-check';
        lightCard.appendChild(icon);
    }
    document.querySelectorAll('.color-dot').forEach(function(d) { d.classList.remove('active'); });
    var purpleDot = document.querySelector('.color-dot[data-color="#7C3AED"]');
    if (purpleDot) purpleDot.classList.add('active');
    document.querySelectorAll('.density-options .radio-option').forEach(function(r) { r.classList.remove('active'); });
    var defaultRadio = document.querySelector('input[name="density"][value="default"]');
    if (defaultRadio) {
        defaultRadio.checked = true;
        defaultRadio.closest('.radio-option').classList.add('active');
    }
    var bar = document.getElementById('appearance-preview');
    if (bar) bar.style.display = 'none';
    showToast('info', 'Appearance reset to defaults.');
}

function getAccentName(hex) {
    var map = { '#7C3AED': 'Purple', '#3B82F6': 'Blue', '#10B981': 'Green', '#F59E0B': 'Amber', '#EF4444': 'Red', '#EC4899': 'Pink' };
    return map[hex] || hex;
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
    if (_appearance.theme === 'system') applyThemeToDOM('system');
});

// ========== OFFBOARDING CONSOLE — INTERACTIVE ACTIONS ==========

/**
 * Sync HR Data — simulates HRMS sync with progress
 */
function syncHRData(btn) {
    if (btn.disabled) return;
    var icon = btn.querySelector('i');
    var origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';
    icon.className = 'fas fa-sync-alt fa-spin';
    btn.querySelector('span') ? btn.querySelector('span').textContent = ' Syncing…' : null;
    // Replace text content
    btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Syncing…';

    showToast('info', 'Connecting to HRMS system…');

    setTimeout(function() {
        showToast('info', 'Fetching employee records — 248 found');
    }, 1200);

    setTimeout(function() {
        showToast('info', 'Cross-referencing SaaS access logs…');
    }, 2400);

    setTimeout(function() {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Synced ✓';
        btn.style.opacity = '1';
        btn.style.background = '#ECFDF5';
        btn.style.color = '#059669';
        btn.style.borderColor = '#059669';
        showToast('success', 'HR Sync complete — 2 new departures detected, 1 updated');
        // Revert after 3s
        setTimeout(function() {
            btn.innerHTML = origHTML;
            btn.disabled = false;
            btn.style.pointerEvents = '';
            btn.style.opacity = '';
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 3000);
    }, 3600);
}

/**
 * Offboard Employee — opens a mock wizard modal
 */
function openOffboardWizard() {
    // Check if modal already exists
    var existing = document.getElementById('offboard-wizard-modal');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'offboard-wizard-modal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';

    overlay.innerHTML = ''
        + '<div style="background:#fff;border-radius:16px;width:95%;max-width:520px;box-shadow:0 20px 60px rgba(0,0,0,0.2);overflow:hidden">'
        + '  <div style="padding:24px 28px;border-bottom:1px solid #E5E7EB">'
        + '    <div style="display:flex;justify-content:space-between;align-items:center">'
        + '      <h2 style="font-size:20px;font-weight:800;color:#111827;display:flex;align-items:center;gap:10px;margin:0"><span style="display:inline-flex;width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;align-items:center;justify-content:center;font-size:14px"><i class="fas fa-user-minus"></i></span> Offboard Employee</h2>'
        + '      <button onclick="document.getElementById(\'offboard-wizard-modal\').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#6B7280;padding:4px"><i class="fas fa-times"></i></button>'
        + '    </div>'
        + '  </div>'
        + '  <div style="padding:24px 28px">'
        + '    <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Search Employee</label>'
        + '    <input type="text" placeholder="Start typing name or email…" style="width:100%;padding:12px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;transition:border 0.2s" onfocus="this.style.borderColor=\'#7C3AED\'" onblur="this.style.borderColor=\'#D1D5DB\'">'
        + '    <div style="margin-top:20px">'
        + '      <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Departure Date</label>'
        + '      <input type="date" style="width:100%;padding:12px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box" value="2026-03-07">'
        + '    </div>'
        + '    <div style="margin-top:20px">'
        + '      <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Revocation Scope</label>'
        + '      <div style="display:flex;flex-direction:column;gap:10px">'
        + '        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:#374151"><input type="radio" name="revoke-scope" value="all" checked style="accent-color:#7C3AED"> Revoke all SaaS access immediately</label>'
        + '        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:#374151"><input type="radio" name="revoke-scope" value="selective" style="accent-color:#7C3AED"> Selective — choose apps to revoke</label>'
        + '        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:#374151"><input type="radio" name="revoke-scope" value="scheduled" style="accent-color:#7C3AED"> Schedule revocation for departure date</label>'
        + '      </div>'
        + '    </div>'
        + '    <div style="margin-top:20px">'
        + '      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:#374151"><input type="checkbox" checked style="accent-color:#7C3AED"> Notify IT admin when complete</label>'
        + '      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:#374151;margin-top:8px"><input type="checkbox" checked style="accent-color:#7C3AED"> Transfer data to manager</label>'
        + '    </div>'
        + '  </div>'
        + '  <div style="padding:16px 28px;border-top:1px solid #E5E7EB;display:flex;justify-content:flex-end;gap:10px;background:#F9FAFB">'
        + '    <button onclick="document.getElementById(\'offboard-wizard-modal\').remove()" style="padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #D1D5DB;color:#374151">Cancel</button>'
        + '    <button onclick="executeOffboard()" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;border:none;box-shadow:0 2px 10px rgba(124,58,237,0.3)"><i class="fas fa-user-minus"></i> Offboard Now</button>'
        + '  </div>'
        + '</div>';

    document.body.appendChild(overlay);

    // Close on background click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}

function executeOffboard() {
    var modal = document.getElementById('offboard-wizard-modal');
    if (modal) modal.remove();
    showToast('success', 'Offboarding initiated — all SaaS access will be revoked and data transferred.');
}

/**
 * Revoke All Pending — bulk revoke with animated row removal
 */
function revokeAllPending(btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    var origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Revoking…';
    btn.style.opacity = '0.8';

    // Find the pending offboards table
    var section = document.getElementById('sec-offboarding');
    if (!section) return;
    var rows = section.querySelectorAll('.data-table tbody tr');
    var delay = 0;

    rows.forEach(function(row) {
        // Only animate rows in the first table (pending offboards)
        var table = row.closest('.data-table');
        var tableContainer = table ? table.closest('div[style*="margin-bottom"]') : null;
        if (!tableContainer) return;
        // Check if this is the pending table (has "Pending Offboards" header)
        var header = tableContainer.querySelector('h3');
        if (!header || header.textContent.indexOf('Pending') === -1) return;

        delay += 400;
        setTimeout(function() {
            row.style.transition = 'all 0.4s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(40px)';
            row.style.background = 'rgba(16,185,129,0.08)';

            // Find the Revoke All button in this row and change it
            var revokeBtn = row.querySelector('button');
            if (revokeBtn) {
                revokeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Revoked';
                revokeBtn.style.background = '#059669';
                revokeBtn.disabled = true;
            }
        }, delay);
    });

    // After all rows animated, update stats
    setTimeout(function() {
        // Update KPI card "Pending Offboards" from 4 to 0
        var statCards = section.querySelectorAll('div[style*="border-left:4px"]');
        if (statCards[0]) {
            var valueEl = statCards[0].querySelector('div[style*="font-size:30px"]');
            if (valueEl) {
                valueEl.textContent = '0';
                valueEl.style.color = '#10B981';
            }
        }
        // Update "Completed This Quarter" from 23 to 27
        if (statCards[1]) {
            var valueEl2 = statCards[1].querySelector('div[style*="font-size:30px"]');
            if (valueEl2) valueEl2.textContent = '27';
        }
        // Update "Licenses Recovered" from ₹3.8L to ₹8.0L
        if (statCards[2]) {
            var valueEl3 = statCards[2].querySelector('div[style*="font-size:30px"]');
            if (valueEl3) valueEl3.textContent = '₹8.0L';
        }

        // Update the bulk banner
        var bannerDiv = section.querySelector('div[style*="rgba(239,68,68,0.05)"]');
        if (bannerDiv) {
            bannerDiv.style.transition = 'all 0.4s ease';
            bannerDiv.style.background = 'linear-gradient(135deg,rgba(16,185,129,0.05),rgba(16,185,129,0.02))';
            bannerDiv.style.borderColor = 'rgba(16,185,129,0.2)';
            var bannerIcon = bannerDiv.querySelector('div[style*="rgba(239,68,68,0.10)"]');
            if (bannerIcon) {
                bannerIcon.style.background = 'rgba(16,185,129,0.10)';
                bannerIcon.style.color = '#10B981';
                bannerIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            }
            var bannerInfo = bannerDiv.querySelector('div[style*="font-weight:700"]');
            if (bannerInfo) {
                bannerInfo.textContent = 'All employees offboarded successfully';
                bannerInfo.style.color = '#059669';
            }
            var bannerSub = bannerDiv.querySelector('div[style*="color:var(--gray-500)"]');
            if (bannerSub) {
                bannerSub.textContent = '50 apps revoked · ₹4.2L/yr recovered';
                bannerSub.style.color = '#059769';
            }
        }

        // Update badge count
        var badge = section.querySelector('span[style*="rgba(239,68,68,0.08)"]');
        if (badge) {
            badge.textContent = '0 employees';
            badge.style.background = 'rgba(16,185,129,0.08)';
            badge.style.color = '#10B981';
        }

        btn.innerHTML = '<i class="fas fa-check-circle"></i> All Revoked ✓';
        btn.style.background = '#059669';
        btn.style.opacity = '1';
        btn.style.boxShadow = '0 2px 10px rgba(5,150,105,0.25)';

        showToast('success', '✓ All 4 employees offboarded. 50 apps revoked. ₹4.2L/yr in licenses recovered.');

        // Revert after 5s
        setTimeout(function() {
            btn.innerHTML = origHTML;
            btn.disabled = false;
            btn.style.background = '';
            btn.style.opacity = '';
            btn.style.boxShadow = '';
            // Restore rows
            rows.forEach(function(row) {
                row.style.opacity = '';
                row.style.transform = '';
                row.style.background = '';
                var revokeBtn = row.querySelector('button');
                if (revokeBtn) {
                    revokeBtn.innerHTML = '<i class="fas fa-ban"></i> Revoke All';
                    revokeBtn.style.background = '';
                    revokeBtn.disabled = false;
                }
            });
            // Restore stats
            if (statCards[0]) {
                var v = statCards[0].querySelector('div[style*="font-size:30px"]');
                if (v) { v.textContent = '4'; v.style.color = ''; }
            }
            if (statCards[1]) {
                var v2 = statCards[1].querySelector('div[style*="font-size:30px"]');
                if (v2) v2.textContent = '23';
            }
            if (statCards[2]) {
                var v3 = statCards[2].querySelector('div[style*="font-size:30px"]');
                if (v3) v3.textContent = '₹3.8L';
            }
            // Restore banner
            if (bannerDiv) {
                bannerDiv.style.background = '';
                bannerDiv.style.borderColor = '';
                var bi = bannerDiv.querySelector('div[style*="rgba(16,185,129"]') || bannerDiv.querySelector('div[style*="background"]');
                // Full page reload is simpler for full revert in a prototype
            }
            if (badge) {
                badge.textContent = '4 employees';
                badge.style.background = '';
                badge.style.color = '';
            }
        }, 5000);
    }, delay + 600);
}

/**
 * Revoke single employee row — animates that row + updates count
 */
function revokeEmployee(btn, name, appCount) {
    if (btn.disabled) return;
    btn.disabled = true;
    var origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.style.opacity = '0.7';

    var row = btn.closest('tr');
    setTimeout(function() {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Revoked';
        btn.style.background = '#059669';
        btn.style.opacity = '1';
        if (row) {
            row.style.transition = 'opacity 0.3s ease';
            row.style.opacity = '0.5';
        }
        showToast('success', '✓ All ' + appCount + ' apps revoked for ' + name);

        // Update pending count
        var section = document.getElementById('sec-offboarding');
        if (section) {
            var statCards = section.querySelectorAll('div[style*="border-left:4px"]');
            if (statCards[0]) {
                var valueEl = statCards[0].querySelector('div[style*="font-size:30px"]');
                if (valueEl) {
                    var current = parseInt(valueEl.textContent) || 0;
                    if (current > 0) valueEl.textContent = (current - 1).toString();
                    if (current - 1 === 0) valueEl.style.color = '#10B981';
                }
            }
        }

        // Revert after 4s
        setTimeout(function() {
            btn.innerHTML = origHTML;
            btn.disabled = false;
            btn.style.background = '';
            btn.style.opacity = '';
            if (row) {
                row.style.opacity = '';
            }
            // Restore count
            if (section) {
                var sc = section.querySelectorAll('div[style*="border-left:4px"]');
                if (sc[0]) {
                    var v = sc[0].querySelector('div[style*="font-size:30px"]');
                    if (v) { v.textContent = '4'; v.style.color = ''; }
                }
            }
        }, 4000);
    }, 800);
}


// ========================================================================
//  INTEGRATION MANAGEMENT — Connect / Configure / Disconnect
// ========================================================================

var _intgContext = { card: null, name: '', icon: '', iconBg: '', users: '', lastSync: '' };

/**
 * Gather metadata from the clicked integration card
 */
function _readCardMeta(card) {
    var nameEl = card.querySelector('strong');
    var iconEl = card.querySelector('.intg-icon i');
    var iconWrap = card.querySelector('.intg-icon');
    var metaSpans = card.querySelectorAll('.intg-meta span');
    var descEl = card.querySelector('p');
    _intgContext.card = card;
    _intgContext.name = nameEl ? nameEl.textContent.trim() : 'Integration';
    _intgContext.icon = iconEl ? iconEl.className : 'fas fa-plug';
    _intgContext.iconBg = iconWrap ? iconWrap.style.background : 'var(--primary)';
    _intgContext.users = metaSpans[0] ? metaSpans[0].textContent.trim() : '';
    _intgContext.lastSync = metaSpans[1] ? metaSpans[1].textContent.trim() : '';
    _intgContext.desc = descEl ? descEl.textContent.trim() : '';
}

// ---------- CONNECT ----------
function openIntegrationConnect(btn) {
    var card = btn.closest('.integration-card-full');
    if (!card) return;
    _readCardMeta(card);

    // Reset modal to auth step
    document.getElementById('connect-step-auth').style.display = '';
    document.getElementById('connect-step-progress').style.display = 'none';
    document.getElementById('connect-step-success').style.display = 'none';
    document.getElementById('connect-footer-auth').style.display = '';
    document.getElementById('connect-footer-done').style.display = 'none';
    document.getElementById('connect-api-key').value = '';
    document.getElementById('connect-workspace-id').value = '';

    // Populate
    document.getElementById('connect-intg-name').textContent = _intgContext.name;
    document.getElementById('connect-intg-desc').textContent = 'Authorize SaaSIQ to sync data from ' + _intgContext.name + '.';
    var iconWrap = document.getElementById('connect-intg-icon-wrap');
    iconWrap.innerHTML = '<i class="' + _intgContext.icon + '"></i>';
    iconWrap.style.background = _intgContext.iconBg;

    openModal('modal-integration-connect');
}

function executeIntegrationConnect() {
    // Switch to progress view
    document.getElementById('connect-step-auth').style.display = 'none';
    document.getElementById('connect-step-progress').style.display = '';
    document.getElementById('connect-footer-auth').style.display = 'none';

    var circle = document.getElementById('connect-progress-circle');
    var percentEl = document.getElementById('connect-percent');
    var statusEl = document.getElementById('connect-status-text');
    var totalLen = 214;
    var progress = 0;

    var steps = [
        { at: 10, text: 'Authenticating credentials...' },
        { at: 30, text: 'Verifying API permissions...' },
        { at: 55, text: 'Establishing secure connection...' },
        { at: 75, text: 'Starting initial data sync...' },
        { at: 90, text: 'Finalizing setup...' },
        { at: 100, text: 'Complete!' }
    ];

    var intv = setInterval(function() {
        progress += 2;
        if (progress > 100) progress = 100;
        var offset = totalLen - (totalLen * progress / 100);
        circle.style.strokeDashoffset = offset;
        percentEl.textContent = progress + '%';

        for (var i = steps.length - 1; i >= 0; i--) {
            if (progress >= steps[i].at) { statusEl.textContent = steps[i].text; break; }
        }

        if (progress >= 100) {
            clearInterval(intv);
            setTimeout(function() {
                // Show success
                document.getElementById('connect-step-progress').style.display = 'none';
                document.getElementById('connect-step-success').style.display = '';
                document.getElementById('connect-footer-done').style.display = '';
                document.getElementById('connect-success-name').textContent = _intgContext.name;

                // Promote card from "Available" to "Connected"
                _promoteCardToConnected(_intgContext.card);
                showToast('success', _intgContext.name + ' connected successfully!');
            }, 400);
        }
    }, 40);
}

/**
 * Move an "Available" card to the "Connected" section in the UI
 */
function _promoteCardToConnected(card) {
    if (!card) return;
    var intgSection = card.closest('#stab-integrations');
    if (!intgSection) return;

    // Build user count
    var userCount = Math.floor(Math.random() * 200 + 50);

    // Add connected class and meta info
    card.classList.add('connected');
    var statusEl = card.querySelector('.intg-status');
    if (statusEl) {
        statusEl.className = 'intg-status connected';
        statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
    }

    // Add meta row
    var existingMeta = card.querySelector('.intg-meta');
    if (!existingMeta) {
        var actionsDiv = card.querySelector('.intg-actions');
        var metaDiv = document.createElement('div');
        metaDiv.className = 'intg-meta';
        metaDiv.innerHTML = '<span>' + userCount + ' users synced</span><span>Last sync: Just now</span>';
        card.insertBefore(metaDiv, actionsDiv);
    }

    // Replace Connect button with Configure + Disconnect
    var actionsDiv = card.querySelector('.intg-actions');
    if (actionsDiv) {
        actionsDiv.innerHTML = '<button class="btn btn-sm btn-outline" onclick="openIntegrationConfigure(this)">Configure</button>'
            + '<button class="btn btn-sm btn-outline btn-danger-outline" onclick="openIntegrationDisconnect(this)">Disconnect</button>';
    }

    // Move card to connected grid
    var sections = intgSection.querySelectorAll('.settings-section');
    var connectedGrid = sections[1] ? sections[1].querySelector('.integration-grid') : null;
    if (connectedGrid && card.parentNode !== connectedGrid) {
        card.parentNode.removeChild(card);
        connectedGrid.appendChild(card);
    }

    // Update badge counts
    _updateIntegrationCounts(intgSection);
}

/**
 * Move a card from "Connected" back to "Available"
 */
function _demoteCardToAvailable(card) {
    if (!card) return;
    var intgSection = card.closest('#stab-integrations');
    if (!intgSection) return;

    // Remove connected class
    card.classList.remove('connected');
    var statusEl = card.querySelector('.intg-status');
    if (statusEl) {
        statusEl.className = 'intg-status';
        statusEl.textContent = 'Not connected';
    }

    // Remove meta row
    var meta = card.querySelector('.intg-meta');
    if (meta) meta.remove();

    // Replace buttons with Connect
    var actionsDiv = card.querySelector('.intg-actions');
    if (actionsDiv) {
        actionsDiv.innerHTML = '<button class="btn btn-sm btn-primary" onclick="openIntegrationConnect(this)">Connect</button>';
    }

    // Move card to available grid
    var sections = intgSection.querySelectorAll('.settings-section');
    var availableGrid = sections[2] ? sections[2].querySelector('.integration-grid') : null;
    if (availableGrid && card.parentNode !== availableGrid) {
        card.parentNode.removeChild(card);
        availableGrid.appendChild(card);
    }

    _updateIntegrationCounts(intgSection);
}

function _updateIntegrationCounts(intgSection) {
    var sections = intgSection.querySelectorAll('.settings-section');
    if (sections[1]) {
        var connCount = sections[1].querySelectorAll('.integration-card-full').length;
        var badge = sections[1].querySelector('.badge-count');
        if (badge) badge.textContent = connCount;
    }
    if (sections[2]) {
        var availCount = sections[2].querySelectorAll('.integration-card-full').length;
        var badge = sections[2].querySelector('.badge-count');
        if (badge) badge.textContent = availCount;
    }
}

// ---------- CONFIGURE ----------
function openIntegrationConfigure(btn) {
    var card = btn.closest('.integration-card-full');
    if (!card) return;
    _readCardMeta(card);

    document.getElementById('config-intg-name').textContent = _intgContext.name;
    document.getElementById('config-intg-title').textContent = _intgContext.name;
    document.getElementById('config-last-sync').textContent = _intgContext.lastSync || 'Last sync: —';

    var iconWrap = document.getElementById('config-intg-icon-wrap');
    iconWrap.innerHTML = '<i class="' + _intgContext.icon + '"></i>';
    iconWrap.style.background = _intgContext.iconBg;

    openModal('modal-integration-configure');
}

function saveIntegrationConfig() {
    var freq = document.getElementById('config-sync-freq');
    var freqText = freq.options[freq.selectedIndex].text;
    closeModal('modal-integration-configure');
    showToast('success', _intgContext.name + ' configuration saved. Sync frequency: ' + freqText);
}

function triggerManualSync() {
    showToast('info', 'Syncing ' + _intgContext.name + '...');
    var syncEl = document.getElementById('config-last-sync');
    if (syncEl) syncEl.textContent = 'Syncing...';
    setTimeout(function() {
        if (syncEl) syncEl.textContent = 'Last sync: Just now';
        showToast('success', _intgContext.name + ' sync complete — all data up to date.');
        // Also update the card in the main grid
        if (_intgContext.card) {
            var metaSpans = _intgContext.card.querySelectorAll('.intg-meta span');
            if (metaSpans[1]) metaSpans[1].textContent = 'Last sync: Just now';
        }
    }, 2000);
}

// ---------- DISCONNECT ----------
function openIntegrationDisconnect(btn) {
    var card = btn.closest('.integration-card-full');
    if (!card) return;
    _readCardMeta(card);

    document.getElementById('disconnect-intg-name').textContent = _intgContext.name;
    document.getElementById('disconnect-warn-name').textContent = _intgContext.name;
    document.getElementById('disconnect-confirm-input').value = '';
    document.getElementById('disconnect-confirm-btn').disabled = true;

    // Parse user count from meta
    var userText = _intgContext.users || '0 users';
    document.getElementById('disconnect-user-count').textContent = userText.replace(' synced', '').replace(' tracked', '');

    openModal('modal-integration-disconnect');
}

function checkDisconnectConfirm() {
    var input = document.getElementById('disconnect-confirm-input');
    var btn = document.getElementById('disconnect-confirm-btn');
    btn.disabled = input.value.trim().toUpperCase() !== 'DISCONNECT';
}

function executeIntegrationDisconnect() {
    closeModal('modal-integration-disconnect');
    showToast('danger', _intgContext.name + ' has been disconnected.');
    _demoteCardToAvailable(_intgContext.card);
}


// ========================================================================
//  DISCOVERED APPS — Mark Managed / Flag Shadow IT / Filter
// ========================================================================

function markAsManaged(btn) {
    var card = btn.closest('.integration-card-full');
    if (!card) return;
    var nameEl = card.querySelector('strong');
    var appName = nameEl ? nameEl.textContent.trim() : 'App';

    // Toggle state
    if (card.classList.contains('managed')) {
        card.classList.remove('managed');
        // Restore original buttons
        var actionsDiv = card.querySelector('.intg-actions');
        if (actionsDiv) {
            actionsDiv.innerHTML = '<button class="btn btn-sm btn-outline" onclick="markAsManaged(this)"><i class="fas fa-check"></i> Mark Managed</button>'
                + '<button class="btn btn-sm btn-outline" onclick="flagAsShadowIT(this)"><i class="fas fa-flag"></i> Flag Shadow IT</button>';
        }
        // Remove managed badge
        var badge = card.querySelector('.discovered-managed-badge');
        if (badge) badge.remove();
        showToast('info', appName + ' removed from managed apps.');
        return;
    }

    // Remove flagged if present
    card.classList.remove('flagged');
    var flagBadge = card.querySelector('.discovered-flagged-badge');
    if (flagBadge) flagBadge.remove();

    card.classList.add('managed');

    // Add managed badge
    var sourceBadge = card.querySelector('.discovered-source-badge');
    var existingBadge = card.querySelector('.discovered-managed-badge');
    if (!existingBadge && sourceBadge) {
        var mgBadge = document.createElement('span');
        mgBadge.className = 'discovered-managed-badge';
        mgBadge.innerHTML = '<i class="fas fa-check-circle"></i> Managed';
        sourceBadge.parentNode.insertBefore(mgBadge, sourceBadge.nextSibling);
    }

    // Update buttons
    var actionsDiv = card.querySelector('.intg-actions');
    if (actionsDiv) {
        actionsDiv.innerHTML = '<button class="btn btn-sm btn-outline" style="color:#10B981;border-color:#10B981" onclick="markAsManaged(this)"><i class="fas fa-check-circle"></i> Managed</button>'
            + '<button class="btn btn-sm btn-outline" onclick="openDiscoveredDetails(this)"><i class="fas fa-external-link-alt"></i> View Details</button>';
    }

    showToast('success', appName + ' marked as managed. It will appear in your SaaS inventory.');
}

function flagAsShadowIT(btn) {
    var card = btn.closest('.integration-card-full');
    if (!card) return;
    var nameEl = card.querySelector('strong');
    var appName = nameEl ? nameEl.textContent.trim() : 'App';

    // Toggle state
    if (card.classList.contains('flagged')) {
        card.classList.remove('flagged');
        var actionsDiv = card.querySelector('.intg-actions');
        if (actionsDiv) {
            actionsDiv.innerHTML = '<button class="btn btn-sm btn-outline" onclick="markAsManaged(this)"><i class="fas fa-check"></i> Mark Managed</button>'
                + '<button class="btn btn-sm btn-outline" onclick="flagAsShadowIT(this)"><i class="fas fa-flag"></i> Flag Shadow IT</button>';
        }
        var badge = card.querySelector('.discovered-flagged-badge');
        if (badge) badge.remove();
        showToast('info', appName + ' unflagged.');
        return;
    }

    // Remove managed if present
    card.classList.remove('managed');
    var mgBadge = card.querySelector('.discovered-managed-badge');
    if (mgBadge) mgBadge.remove();

    card.classList.add('flagged');

    // Add flagged badge
    var sourceBadge = card.querySelector('.discovered-source-badge');
    var existingBadge = card.querySelector('.discovered-flagged-badge');
    if (!existingBadge && sourceBadge) {
        var flBadge = document.createElement('span');
        flBadge.className = 'discovered-flagged-badge';
        flBadge.innerHTML = '<i class="fas fa-exclamation-circle"></i> Shadow IT';
        sourceBadge.parentNode.insertBefore(flBadge, sourceBadge.nextSibling);
    }

    // Update buttons
    var actionsDiv = card.querySelector('.intg-actions');
    if (actionsDiv) {
        actionsDiv.innerHTML = '<button class="btn btn-sm btn-outline btn-danger-outline" onclick="flagAsShadowIT(this)"><i class="fas fa-flag"></i> Flagged as Shadow IT</button>'
            + '<button class="btn btn-sm btn-outline" onclick="markAsManaged(this)"><i class="fas fa-check"></i> Mark Managed Instead</button>';
    }

    showToast('warning', appName + ' flagged as Shadow IT. IT admin will be notified.');
}

function filterDiscoveredApps(source) {
    var grid = document.getElementById('discovered-apps-grid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.integration-card-full');
    var visibleCount = 0;

    cards.forEach(function(card) {
        if (source === 'all' || card.dataset.source === source) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update count badge
    var countBadge = document.querySelector('.discovered-count');
    if (countBadge) countBadge.textContent = visibleCount;
}

function openDiscoveredDetails(btn) {
    var card = btn.closest('.integration-card-full');
    if (!card) return;
    var nameEl = card.querySelector('strong');
    var appName = nameEl ? nameEl.textContent.trim() : 'App';
    showToast('info', 'Opening detailed view for ' + appName + '…');
    // Navigate to app detail in the main Apps dashboard
    showDashSectionDirect('apps');
}

/* ========= FEATURE FLAG TOGGLE HANDLER ========= */
function toggleFeatureFlag(flag) {
    SaaSIQFlags.toggle(flag);
    const enabled = SaaSIQFlags.isEnabled(flag);
    showToast(enabled ? 'success' : 'info', `${SaaSIQFlags.getAll()[flag]?.label || flag} ${enabled ? 'enabled' : 'disabled'}`);
}

/* ========= PARTNERSHIP DATA & HANDLERS ========= */
const partnerData = {
    slacktech: {
        name: 'SlackTech Solutions',
        icon: '<i class="fab fa-slack"></i>',
        iconBg: 'linear-gradient(135deg,#4A154B,#611f69)',
        subtitle: 'Slack Enterprise · Barter: Design Services',
        status: 'Active',
        statusClass: 'active',
        seats: 50, used: 38, utilization: 76,
        serviceType: 'UI/UX Design', serviceHours: 120, serviceValue: '₹12L',
        waste: '12 seats · ₹2.88L', wasteSeats: '12 seats', wasteValue: '₹2.88L',
        received: 'Slack Enterprise Grid', receivedDetail: '50 seats · ₹15L/yr market value',
        given: 'UI/UX Design Services', givenDetail: '120 hrs · ₹12L value',
        start: 'Jan 15, 2026', end: 'Jan 14, 2027', remaining: '310 days',
        ledger: [
            { date: 'Mar 5, 2026', service: 'UI/UX Design Sprint', hours: '40 hrs', value: '₹4L', status: 'Delivered' },
            { date: 'Feb 1, 2026', service: 'Dashboard Redesign', hours: '32 hrs', value: '₹3.2L', status: 'Delivered' },
            { date: 'Jan 20, 2026', service: 'Mobile App Wireframes', hours: '24 hrs', value: '₹2.4L', status: 'Delivered' }
        ],
        ai: {
            headline: 'Downsize to 40 seats — save ₹2.4L/year',
            confidence: 'Confidence: 92% · Based on 55 days of usage data',
            currentSeats: '50 seats', currentHours: '120 design hrs',
            recSeats: '40 seats', recHours: '96 design hrs',
            savings: '₹2.4L/yr',
            insights: [
                { icon: 'fa-chart-line', color: 'var(--blue)', text: '12 seats have had zero logins in 45+ days — consistent non-usage pattern' },
                { icon: 'fa-users', color: 'var(--orange)', text: '76% utilization is below the 85% efficiency threshold for barter deals' },
                { icon: 'fa-clock', color: 'var(--primary)', text: 'Renewal in 310 days — renegotiate early for 10% better terms' },
                { icon: 'fa-rupee-sign', color: 'var(--green)', text: 'Downsizing saves 24 design hours (₹2.4L) with zero productivity impact' }
            ],
            actions: [
                { num: 1, text: 'Reduce license count from 50 → 40 seats (remove inactive users)' },
                { num: 2, text: 'Renegotiate service commitment from 120 → 96 hours proportionally' },
                { num: 3, text: 'Set up quarterly utilization review checkpoints' }
            ]
        }
    },
    atlassian: {
        name: 'Atlassian Corp',
        icon: '<i class="fab fa-atlassian"></i>',
        iconBg: 'linear-gradient(135deg,#0052CC,#2684FF)',
        subtitle: 'Jira + Confluence · Barter: DevOps Consulting',
        status: 'Active',
        statusClass: 'active',
        seats: 75, used: 42, utilization: 56,
        serviceType: 'DevOps Consulting', serviceHours: 200, serviceValue: '₹18L',
        waste: '33 seats · ₹7.92L', wasteSeats: '33 seats', wasteValue: '₹7.92L',
        received: 'Jira + Confluence Premium', receivedDetail: '75 seats · ₹22L/yr market value',
        given: 'DevOps Consulting Services', givenDetail: '200 hrs · ₹18L value',
        start: 'Dec 1, 2025', end: 'Nov 30, 2026', remaining: '265 days',
        ledger: [
            { date: 'Feb 20, 2026', service: 'CI/CD Pipeline Setup', hours: '60 hrs', value: '₹5.4L', status: 'Delivered' },
            { date: 'Jan 15, 2026', service: 'Kubernetes Migration', hours: '80 hrs', value: '₹7.2L', status: 'In Progress' },
            { date: 'Dec 10, 2025', service: 'Infrastructure Audit', hours: '20 hrs', value: '₹1.8L', status: 'Delivered' }
        ],
        ai: {
            headline: 'Renegotiate to 50 seats — save ₹9L/year',
            confidence: 'Confidence: 96% · Based on 100 days of usage data',
            currentSeats: '75 seats', currentHours: '200 consulting hrs',
            recSeats: '50 seats', recHours: '134 consulting hrs',
            savings: '₹9L/yr',
            insights: [
                { icon: 'fa-exclamation-circle', color: 'var(--red)', text: '33 of 75 seats (44%) have zero logins in 60 days — critical waste' },
                { icon: 'fa-rupee-sign', color: 'var(--red)', text: 'You\'re committing ₹18L in consulting for licenses worth ₹22L — tight margin' },
                { icon: 'fa-building', color: 'var(--blue)', text: 'Industry benchmark: similar companies use 55-65 seats for this team size' },
                { icon: 'fa-lightbulb', color: 'var(--green)', text: 'Downsizing saves 66 consulting hours (₹9L) — reinvest in high-impact projects' }
            ],
            actions: [
                { num: 1, text: 'Audit 33 inactive users — remove or reassign licenses immediately' },
                { num: 2, text: 'Renegotiate deal from 75 → 50 seats with Atlassian' },
                { num: 3, text: 'Reduce service commitment proportionally from 200 → 134 hours' },
                { num: 4, text: 'Implement monthly seat utilization monitoring to prevent future waste' }
            ]
        }
    },
    hubspot: {
        name: 'HubSpot Partners',
        icon: '<i class="fab fa-hubspot"></i>',
        iconBg: 'linear-gradient(135deg,#FF6D00,#FF9100)',
        subtitle: 'HubSpot CRM Pro · Barter: Content Marketing',
        status: 'Under Review',
        statusClass: 'warning',
        seats: 20, used: 18, utilization: 90,
        serviceType: 'Content Marketing', serviceHours: 160, serviceValue: '₹6L',
        waste: '2 seats · ₹0.6L', wasteSeats: '2 seats', wasteValue: '₹0.6L',
        received: 'HubSpot CRM Pro', receivedDetail: '20 seats · ₹8L/yr market value',
        given: 'Content Marketing Services', givenDetail: '160 hrs · ₹6L value',
        start: 'Feb 1, 2026', end: 'Jan 31, 2027', remaining: '327 days',
        ledger: [
            { date: 'Feb 10, 2026', service: 'Blog Content (10 articles)', hours: '80 hrs', value: '₹3L', status: 'Delivered' },
            { date: 'Feb 25, 2026', service: 'Social Media Campaign', hours: '40 hrs', value: '₹1.5L', status: 'Delivered' },
            { date: 'Mar 3, 2026', service: 'SEO Optimization Sprint', hours: '24 hrs', value: '₹0.9L', status: 'In Progress' }
        ],
        ai: {
            headline: 'Healthy deal — recommend renewing at current terms',
            confidence: 'Confidence: 98% · Based on 38 days of usage data',
            currentSeats: '20 seats', currentHours: '160 content hrs',
            recSeats: '20 seats', recHours: '160 content hrs',
            savings: '₹0 (already optimized)',
            insights: [
                { icon: 'fa-check-circle', color: 'var(--green)', text: '90% utilization — well above the 85% efficiency threshold' },
                { icon: 'fa-thumbs-up', color: 'var(--green)', text: 'Positive ROI: ₹8L software value received for ₹6L in services' },
                { icon: 'fa-chart-line', color: 'var(--blue)', text: 'Usage trending upward — 2 remaining seats likely to be filled within 60 days' },
                { icon: 'fa-star', color: 'var(--orange)', text: 'This is your most cost-effective partnership — model for future deals' }
            ],
            actions: [
                { num: 1, text: 'Renew at current terms when deal comes up for review' },
                { num: 2, text: 'Consider expanding to 25 seats if marketing team grows' },
                { num: 3, text: 'Use this deal structure as a template for future barter partnerships' }
            ]
        }
    }
};

function openPartnerDetails(partnerId) {
    const d = partnerData[partnerId];
    if (!d) return;
    document.getElementById('partner-detail-name').textContent = d.name;
    document.getElementById('partner-detail-title').textContent = d.name;
    document.getElementById('partner-detail-subtitle').textContent = d.subtitle;
    const iconEl = document.getElementById('partner-detail-icon');
    iconEl.innerHTML = d.icon;
    iconEl.style.background = d.iconBg;
    const statusEl = document.getElementById('partner-detail-status');
    statusEl.textContent = d.status;
    statusEl.className = 'status-badge ' + d.statusClass;

    document.getElementById('partner-detail-licenses').textContent = d.used + ' / ' + d.seats;
    document.getElementById('partner-detail-utilization').textContent = d.utilization + '%';
    document.getElementById('partner-detail-utilization').style.color = d.utilization >= 80 ? 'var(--green)' : d.utilization >= 60 ? 'var(--orange)' : 'var(--red)';
    document.getElementById('partner-detail-value').textContent = d.serviceValue;

    document.getElementById('partner-detail-received').textContent = d.received;
    document.getElementById('partner-detail-received-detail').textContent = d.receivedDetail;
    document.getElementById('partner-detail-given').textContent = d.given;
    document.getElementById('partner-detail-given-detail').textContent = d.givenDetail;

    document.getElementById('partner-detail-start').textContent = d.start;
    document.getElementById('partner-detail-end').textContent = d.end;
    document.getElementById('partner-detail-remaining').textContent = d.remaining;

    document.getElementById('partner-detail-waste-seats').textContent = d.wasteSeats;
    document.getElementById('partner-detail-waste-value').textContent = d.wasteValue;
    document.getElementById('partner-detail-util-bar').style.width = d.utilization + '%';
    document.getElementById('partner-detail-util-bar').style.background = d.utilization >= 80
        ? 'linear-gradient(90deg,var(--green),#34D399)'
        : d.utilization >= 60 ? 'linear-gradient(90deg,var(--orange),#FBBF24)' : 'linear-gradient(90deg,var(--red),#F87171)';

    // Service ledger entries
    const ledgerEl = document.getElementById('partner-detail-ledger');
    ledgerEl.innerHTML = d.ledger.map(function(e) {
        var statusColor = e.status === 'Delivered' ? 'var(--green)' : 'var(--orange)';
        return '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:#F9FAFB;border-radius:8px">' +
            '<div style="width:36px;height:36px;border-radius:8px;background:rgba(124,58,237,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas fa-file-invoice" style="color:var(--primary);font-size:14px"></i></div>' +
            '<div style="flex:1"><strong style="font-size:13px;display:block;color:var(--gray-800)">' + e.service + '</strong><span style="font-size:11px;color:var(--gray-600)">' + e.date + ' · ' + e.hours + ' · ' + e.value + '</span></div>' +
            '<span style="font-size:11px;font-weight:600;color:' + statusColor + '">' + e.status + '</span></div>';
    }).join('');

    openModal('modal-partner-details');
}

function openPartnerAI(partnerId) {
    const d = partnerData[partnerId];
    if (!d || !d.ai) return;
    const ai = d.ai;

    document.getElementById('partner-ai-name').textContent = d.name;
    document.getElementById('partner-ai-headline').textContent = ai.headline;
    document.getElementById('partner-ai-confidence').textContent = ai.confidence;
    document.getElementById('partner-ai-current-seats').textContent = ai.currentSeats;
    document.getElementById('partner-ai-current-hours').textContent = ai.currentHours;
    document.getElementById('partner-ai-rec-seats').textContent = ai.recSeats;
    document.getElementById('partner-ai-rec-hours').textContent = ai.recHours;
    document.getElementById('partner-ai-savings').textContent = ai.savings;

    // Insights
    document.getElementById('partner-ai-insights').innerHTML = ai.insights.map(function(ins) {
        return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#F9FAFB;border-radius:8px">' +
            '<i class="fas ' + ins.icon + '" style="color:' + ins.color + ';margin-top:2px;width:16px;text-align:center;flex-shrink:0"></i>' +
            '<span style="font-size:13px;color:var(--gray-700)">' + ins.text + '</span></div>';
    }).join('');

    // Actions
    document.getElementById('partner-ai-actions').innerHTML = ai.actions.map(function(act) {
        return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:rgba(16,185,129,0.06);border-left:3px solid var(--green);border-radius:0 8px 8px 0">' +
            '<div style="width:22px;height:22px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;font-weight:700;color:#fff">' + act.num + '</div>' +
            '<span style="font-size:13px;color:var(--gray-700)">' + act.text + '</span></div>';
    }).join('');

    openModal('modal-partner-ai');
}

/* ========= INIT FEATURE FLAGS ON LOAD ========= */
document.addEventListener('DOMContentLoaded', function() {
    SaaSIQFlags.init();
    
    // Ensure dashboard-home section is visible on initial load
    var activeSections = document.querySelectorAll('.dash-section.active');
    if (activeSections.length === 0) {
        var homeSection = document.getElementById('sec-dashboard-home');
        if (homeSection) homeSection.classList.add('active');
    }
    
    // Ensure page-dashboard is visible if hash is #dashboard
    var hash = window.location.hash.replace('#', '');
    if (hash === 'dashboard' || hash === '') {
        var pageDash = document.getElementById('page-dashboard');
        if (pageDash && !pageDash.classList.contains('active')) {
            document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
            pageDash.classList.add('active');
        }
    }
});
