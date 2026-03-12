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
        // Hide help widget behind modals
        var hw = document.getElementById('help-widget');
        if (hw) hw.style.zIndex = '1';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        // Restore help widget z-index if no modals left
        if (document.querySelectorAll('.modal-overlay.open').length === 0) {
            var hw = document.getElementById('help-widget');
            if (hw) hw.style.zIndex = '';
        }
    }
}

// Close modals with Escape key — closes topmost only
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close help widget first if open
        if (_helpWidgetOpen) { toggleHelpWidget(); return; }
        // Close topmost modal only
        var openModals = document.querySelectorAll('.modal-overlay.open');
        if (openModals.length > 0) {
            var topModal = openModals[openModals.length - 1];
            topModal.classList.remove('open');
            if (document.querySelectorAll('.modal-overlay.open').length === 0) {
                document.body.style.overflow = '';
            }
            return;
        }
        // Also close org dropdown
        const dd = document.getElementById('org-dropdown');
        if (dd) dd.classList.remove('open');
    }
});

// Click backdrop to close modal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('open')) {
        e.target.classList.remove('open');
        if (document.querySelectorAll('.modal-overlay.open').length === 0) {
            document.body.style.overflow = '';
            var hw = document.getElementById('help-widget');
            if (hw) hw.style.zIndex = '';
        }
    }
});

// ========== TOAST NOTIFICATIONS ==========
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<i class="fas ' + (icons[type] || 'fa-info-circle') + '"></i><span>' + message + '</span><button class="toast-dismiss" onclick="this.parentNode.remove()" aria-label="Dismiss"><i class="fas fa-times"></i></button>';
    container.appendChild(toast);
    var duration = (type === 'danger' || type === 'warning') ? 6000 : 5000;
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, duration);
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
    { q: /spend|cost|budget/i, a: 'Your total monthly SaaS spend is <strong>$704K</strong> across 47 apps. The top 3 cost drivers are Google Workspace ($36K), Microsoft 365 ($28.8K), and Slack ($18.5K). I see <strong>$120K/month in potential savings</strong> from unused licenses.' },
    { q: /shadow|unapproved|unsanctioned/i, a: 'I detected <strong>8 shadow IT applications</strong> being used without approval: CloudApp Pro, DataDog Lite, Notion, ChatGPT Plus, Grammarly, Canva Pro, Miro, and Loom. Total monthly cost: <strong>$4,200</strong>. Shall I create a review policy?' },
    { q: /renew|contract|expir/i, a: 'You have <strong>4 contracts renewing in the next 30 days</strong>:<br>• Salesforce Enterprise — Mar 12 ($420K/yr, auto-renew ON)<br>• GitHub Enterprise — Mar 28 ($185K/yr)<br>• Zoom Business — Apr 1 ($96K/yr)<br>• Figma Org — Apr 15 ($54K/yr)<br>AI recommends negotiating Salesforce down by 34%.' },
    { q: /compliance|risk|soc|gdpr/i, a: 'Compliance Score: <strong>A+ (87/100)</strong>. 42 of 47 apps are SOC2 certified. <strong>2 apps need HIPAA review</strong>, and <strong>3 apps are missing DPA agreements</strong>. Shall I generate a compliance action plan?' },
    { q: /user|utilization|unused|license/i, a: 'License utilization across your stack is <strong>67%</strong>. Apps with lowest utilization:<br>• Monday.com: 22% (28 of 128 seats)<br>• Asana Business: 34% (45 of 132 seats)<br>• Figma: 26% (12 of 47 seats)<br>Consolidating could save <strong>$384K/year</strong>.' },
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
        // Update "Licenses Recovered" from $11.4K to $24K
        if (statCards[2]) {
            var valueEl3 = statCards[2].querySelector('div[style*="font-size:30px"]');
            if (valueEl3) valueEl3.textContent = '$42K';
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
                bannerSub.textContent = '50 apps revoked · $42K/yr recovered';
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

        showToast('success', '✓ All 4 employees offboarded. 50 apps revoked. $42K/yr in licenses recovered.');

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
                if (v3) v3.textContent = '$11.4K';
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
        serviceType: 'UI/UX Design', serviceHours: 120, serviceValue: '$36K',
        waste: '12 seats · $8.6K', wasteSeats: '12 seats', wasteValue: '$8.6K',
        received: 'Slack Enterprise Grid', receivedDetail: '50 seats · $45K/yr market value',
        given: 'UI/UX Design Services', givenDetail: '120 hrs · $36K value',
        start: 'Jan 15, 2026', end: 'Jan 14, 2027', remaining: '310 days',
        ledger: [
            { date: 'Mar 5, 2026', service: 'UI/UX Design Sprint', hours: '40 hrs', value: '$12K', status: 'Delivered' },
            { date: 'Feb 1, 2026', service: 'Dashboard Redesign', hours: '32 hrs', value: '$9.6K', status: 'Delivered' },
            { date: 'Jan 20, 2026', service: 'Mobile App Wireframes', hours: '24 hrs', value: '$7.2K', status: 'Delivered' }
        ],
        ai: {
            headline: 'Downsize to 40 seats — save $7.2K/year',
            confidence: 'Confidence: 92% · Based on 55 days of usage data',
            currentSeats: '50 seats', currentHours: '120 design hrs',
            recSeats: '40 seats', recHours: '96 design hrs',
            savings: '$7.2K/yr',
            insights: [
                { icon: 'fa-chart-line', color: 'var(--blue)', text: '12 seats have had zero logins in 45+ days — consistent non-usage pattern' },
                { icon: 'fa-users', color: 'var(--orange)', text: '76% utilization is below the 85% efficiency threshold for barter deals' },
                { icon: 'fa-clock', color: 'var(--primary)', text: 'Renewal in 310 days — renegotiate early for 10% better terms' },
                { icon: 'fa-dollar-sign', color: 'var(--green)', text: 'Downsizing saves 24 design hours ($7.2K) with zero productivity impact' }
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
        serviceType: 'DevOps Consulting', serviceHours: 200, serviceValue: '$54K',
        waste: '33 seats · $23.8K', wasteSeats: '33 seats', wasteValue: '$23.8K',
        received: 'Jira + Confluence Premium', receivedDetail: '75 seats · $66K/yr market value',
        given: 'DevOps Consulting Services', givenDetail: '200 hrs · $54K value',
        start: 'Dec 1, 2025', end: 'Nov 30, 2026', remaining: '265 days',
        ledger: [
            { date: 'Feb 20, 2026', service: 'CI/CD Pipeline Setup', hours: '60 hrs', value: '$16.2K', status: 'Delivered' },
            { date: 'Jan 15, 2026', service: 'Kubernetes Migration', hours: '80 hrs', value: '$21.6K', status: 'In Progress' },
            { date: 'Dec 10, 2025', service: 'Infrastructure Audit', hours: '20 hrs', value: '$5.4K', status: 'Delivered' }
        ],
        ai: {
            headline: 'Renegotiate to 50 seats — save $27K/year',
            confidence: 'Confidence: 96% · Based on 100 days of usage data',
            currentSeats: '75 seats', currentHours: '200 consulting hrs',
            recSeats: '50 seats', recHours: '134 consulting hrs',
            savings: '$27K/yr',
            insights: [
                { icon: 'fa-exclamation-circle', color: 'var(--red)', text: '33 of 75 seats (44%) have zero logins in 60 days — critical waste' },
                { icon: 'fa-dollar-sign', color: 'var(--red)', text: 'You\'re committing $54K in consulting for licenses worth $66K — tight margin' },
                { icon: 'fa-building', color: 'var(--blue)', text: 'Industry benchmark: similar companies use 55-65 seats for this team size' },
                { icon: 'fa-lightbulb', color: 'var(--green)', text: 'Downsizing saves 66 consulting hours ($27K) — reinvest in high-impact projects' }
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
        serviceType: 'Content Marketing', serviceHours: 160, serviceValue: '$18K',
        waste: '2 seats · $1.8K', wasteSeats: '2 seats', wasteValue: '$1.8K',
        received: 'HubSpot CRM Pro', receivedDetail: '20 seats · $24K/yr market value',
        given: 'Content Marketing Services', givenDetail: '160 hrs · $18K value',
        start: 'Feb 1, 2026', end: 'Jan 31, 2027', remaining: '327 days',
        ledger: [
            { date: 'Feb 10, 2026', service: 'Blog Content (10 articles)', hours: '80 hrs', value: '$9K', status: 'Delivered' },
            { date: 'Feb 25, 2026', service: 'Social Media Campaign', hours: '40 hrs', value: '$4.5K', status: 'Delivered' },
            { date: 'Mar 3, 2026', service: 'SEO Optimization Sprint', hours: '24 hrs', value: '$2.7K', status: 'In Progress' }
        ],
        ai: {
            headline: 'Healthy deal — recommend renewing at current terms',
            confidence: 'Confidence: 98% · Based on 38 days of usage data',
            currentSeats: '20 seats', currentHours: '160 content hrs',
            recSeats: '20 seats', recHours: '160 content hrs',
            savings: '$0 (already optimized)',
            insights: [
                { icon: 'fa-check-circle', color: 'var(--green)', text: '90% utilization — well above the 85% efficiency threshold' },
                { icon: 'fa-thumbs-up', color: 'var(--green)', text: 'Positive ROI: $24K software value received for $18K in services' },
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


/* ==========================================================================
   NESTED DRILL-DOWN ENGINE — Org → Department → Team → Members
   ========================================================================== */

var drillData = {
    engineering: {
        name: 'Engineering',
        icon: 'fas fa-code',
        iconBg: 'rgba(124,58,237,0.1)',
        iconColor: 'var(--primary)',
        users: 142, apps: 28, adoption: 84, activeUsers: 119, avgLogins: 24.6,
        spend: '$247.2K', waste: '$33.6K',
        teams: [
            {
                id: 'eng-backend', name: 'Backend Team', icon: 'fas fa-server',
                iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
                users: 38, apps: 14, adoption: 91, activeUsers: 35, avgLogins: 28.4,
                spend: '$85.8K', waste: '$6.3K',
                topApps: ['AWS', 'GitHub', 'Datadog'],
                members: [
                    { name: 'Arjun Mehta', role: 'Lead', apps: 12, logins: 32, status: 'active', avatar: '#3B82F6' },
                    { name: 'Priya Sharma', role: 'Sr. Engineer', apps: 10, logins: 28, status: 'active', avatar: '#8B5CF6' },
                    { name: 'Rahul K.', role: 'Engineer', apps: 8, logins: 25, status: 'active', avatar: '#10B981' },
                    { name: 'Sneha D.', role: 'Engineer', apps: 9, logins: 30, status: 'active', avatar: '#F59E0B' },
                    { name: 'Vikram P.', role: 'Jr. Engineer', apps: 5, logins: 12, status: 'idle', avatar: '#EF4444' },
                    { name: 'Kiran R.', role: 'Intern', apps: 3, logins: 4, status: 'inactive', avatar: '#6366F1' }
                ],
                aiInsight: 'Backend team has 91% adoption — highest in Engineering. Vikram P. has used only 5 of 14 apps in 30 days. Consider reassigning 2 AWS seats from inactive interns.'
            },
            {
                id: 'eng-frontend', name: 'Frontend Team', icon: 'fas fa-laptop-code',
                iconBg: 'rgba(168,85,247,0.1)', iconColor: '#A855F7',
                users: 32, apps: 11, adoption: 88, activeUsers: 28, avgLogins: 26.1,
                spend: '$54.6K', waste: '$5.4K',
                topApps: ['Figma', 'GitHub', 'Vercel'],
                members: [
                    { name: 'Amit Joshi', role: 'Lead', apps: 11, logins: 30, status: 'active', avatar: '#A855F7' },
                    { name: 'Deepa M.', role: 'Sr. Engineer', apps: 9, logins: 27, status: 'active', avatar: '#EC4899' },
                    { name: 'Rohan S.', role: 'Engineer', apps: 8, logins: 22, status: 'active', avatar: '#14B8A6' },
                    { name: 'Neha K.', role: 'Engineer', apps: 7, logins: 18, status: 'idle', avatar: '#F59E0B' }
                ],
                aiInsight: 'Frontend team heavily uses Figma (100% adoption) but only 40% use Storybook. Consider consolidating or dropping Storybook license.'
            },
            {
                id: 'eng-devops', name: 'DevOps & Infra', icon: 'fas fa-cloud',
                iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
                users: 18, apps: 16, adoption: 92, activeUsers: 17, avgLogins: 31.2,
                spend: '$67.2K', waste: '$10.8K',
                topApps: ['AWS', 'Terraform', 'PagerDuty'],
                members: [
                    { name: 'Suresh K.', role: 'Lead', apps: 16, logins: 35, status: 'active', avatar: '#10B981' },
                    { name: 'Ananya R.', role: 'SRE', apps: 14, logins: 32, status: 'active', avatar: '#3B82F6' },
                    { name: 'Manoj V.', role: 'DevOps Eng.', apps: 12, logins: 28, status: 'active', avatar: '#F97316' }
                ],
                aiInsight: 'DevOps has the highest per-user spend ($3.7K/user). 3 monitoring tools overlap (Datadog + New Relic + PagerDuty) — consolidating saves $10.8K/yr.'
            },
            {
                id: 'eng-data', name: 'Data Engineering', icon: 'fas fa-database',
                iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
                users: 22, apps: 10, adoption: 77, activeUsers: 17, avgLogins: 20.3,
                spend: '$25.2K', waste: '$6.6K',
                topApps: ['Snowflake', 'dbt', 'Airflow'],
                members: [
                    { name: 'Ravi T.', role: 'Lead', apps: 10, logins: 26, status: 'active', avatar: '#F59E0B' },
                    { name: 'Kavya M.', role: 'Data Eng.', apps: 8, logins: 22, status: 'active', avatar: '#EC4899' },
                    { name: 'Harish B.', role: 'Data Eng.', apps: 6, logins: 14, status: 'idle', avatar: '#6366F1' },
                    { name: 'Pooja N.', role: 'Analyst', apps: 4, logins: 8, status: 'inactive', avatar: '#EF4444' }
                ],
                aiInsight: 'Data team has 5 unused Snowflake compute credits. Pooja N. hasn\'t logged into any tool in 21 days — possible offboarding candidate.'
            },
            {
                id: 'eng-qa', name: 'QA & Testing', icon: 'fas fa-vial',
                iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444',
                users: 16, apps: 8, adoption: 75, activeUsers: 12, avgLogins: 18.6,
                spend: '$9.6K', waste: '$2.4K',
                topApps: ['Jira', 'BrowserStack', 'Postman'],
                members: [
                    { name: 'Sanjay L.', role: 'QA Lead', apps: 8, logins: 24, status: 'active', avatar: '#EF4444' },
                    { name: 'Meera G.', role: 'QA Eng.', apps: 6, logins: 20, status: 'active', avatar: '#8B5CF6' },
                    { name: 'Anil D.', role: 'QA Eng.', apps: 5, logins: 10, status: 'idle', avatar: '#14B8A6' }
                ],
                aiInsight: 'QA has 4 unused BrowserStack licenses. Consider sharing BrowserStack seats with Frontend team on a floating license model.'
            },
            {
                id: 'eng-mobile', name: 'Mobile Team', icon: 'fas fa-mobile-alt',
                iconBg: 'rgba(99,102,241,0.1)', iconColor: '#6366F1',
                users: 16, apps: 9, adoption: 81, activeUsers: 13, avgLogins: 22.8,
                spend: '$13.8K', waste: '$2.1K',
                topApps: ['Xcode Cloud', 'Firebase', 'Bitrise'],
                members: [
                    { name: 'Tarun S.', role: 'Lead', apps: 9, logins: 28, status: 'active', avatar: '#6366F1' },
                    { name: 'Divya P.', role: 'iOS Dev', apps: 7, logins: 24, status: 'active', avatar: '#EC4899' },
                    { name: 'Nikhil M.', role: 'Android Dev', apps: 7, logins: 20, status: 'active', avatar: '#10B981' }
                ],
                aiInsight: 'Mobile team is well-optimized. Firebase plan could downgrade from Blaze to Spark — saves $2.1K/yr based on actual usage.'
            }
        ]
    },
    sales: {
        name: 'Sales & Marketing',
        icon: 'fas fa-chart-bar',
        iconBg: 'rgba(59,130,246,0.1)',
        iconColor: 'var(--blue)',
        users: 89, apps: 18, adoption: 71, activeUsers: 63, avgLogins: 18.3,
        spend: '$172.2K', waste: '$33.6K',
        teams: [
            {
                id: 'sales-enterprise', name: 'Enterprise Sales', icon: 'fas fa-handshake',
                iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
                users: 24, apps: 8, adoption: 83, activeUsers: 20, avgLogins: 22.4,
                spend: '$55.8K', waste: '$7.2K',
                topApps: ['Salesforce', 'Gong', 'LinkedIn Sales Nav'],
                members: [
                    { name: 'Rajesh V.', role: 'VP Sales', apps: 8, logins: 26, status: 'active', avatar: '#10B981' },
                    { name: 'Anita S.', role: 'AE', apps: 7, logins: 24, status: 'active', avatar: '#3B82F6' },
                    { name: 'Mohit K.', role: 'AE', apps: 6, logins: 18, status: 'active', avatar: '#F59E0B' },
                    { name: 'Simran T.', role: 'SDR', apps: 4, logins: 12, status: 'idle', avatar: '#EF4444' }
                ],
                aiInsight: 'Enterprise Sales team has 3 unused Gong licenses. Simran hasn\'t used LinkedIn Sales Nav in 28 days.'
            },
            {
                id: 'sales-smb', name: 'SMB Sales', icon: 'fas fa-store',
                iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
                users: 18, apps: 6, adoption: 72, activeUsers: 13, avgLogins: 16.8,
                spend: '$24.6K', waste: '$5.4K',
                topApps: ['Salesforce', 'Freshdesk', 'Calendly'],
                members: [
                    { name: 'Dinesh R.', role: 'Manager', apps: 6, logins: 22, status: 'active', avatar: '#F59E0B' },
                    { name: 'Lavanya K.', role: 'AE', apps: 5, logins: 18, status: 'active', avatar: '#A855F7' },
                    { name: 'Arun M.', role: 'SDR', apps: 3, logins: 8, status: 'idle', avatar: '#EF4444' }
                ],
                aiInsight: 'SMB team uses only basic Salesforce features. Downgrading from Enterprise to Professional tier saves $5.4K/yr.'
            },
            {
                id: 'sales-marketing', name: 'Digital Marketing', icon: 'fas fa-bullhorn',
                iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444',
                users: 28, apps: 12, adoption: 64, activeUsers: 18, avgLogins: 14.2,
                spend: '$67.2K', waste: '$15.6K',
                topApps: ['HubSpot', 'Google Ads', 'Semrush'],
                members: [
                    { name: 'Priyanka B.', role: 'Marketing Head', apps: 12, logins: 20, status: 'active', avatar: '#EF4444' },
                    { name: 'Karthik N.', role: 'SEO Specialist', apps: 8, logins: 16, status: 'active', avatar: '#3B82F6' },
                    { name: 'Rekha S.', role: 'Content Writer', apps: 4, logins: 10, status: 'idle', avatar: '#10B981' }
                ],
                aiInsight: 'Marketing has 10 unused HubSpot seats and overlapping SEO tools (Semrush + Ahrefs + Moz). Consolidating saves $15.6K/yr.'
            },
            {
                id: 'sales-ops', name: 'Sales Ops', icon: 'fas fa-cog',
                iconBg: 'rgba(99,102,241,0.1)', iconColor: '#6366F1',
                users: 19, apps: 7, adoption: 68, activeUsers: 13, avgLogins: 19.8,
                spend: '$24.6K', waste: '$5.4K',
                topApps: ['Salesforce', 'Clari', 'Tableau'],
                members: [
                    { name: 'Santosh J.', role: 'Ops Manager', apps: 7, logins: 24, status: 'active', avatar: '#6366F1' },
                    { name: 'Bhagyashree P.', role: 'Analyst', apps: 5, logins: 16, status: 'active', avatar: '#EC4899' }
                ],
                aiInsight: 'Sales Ops has Clari + Tableau for forecasting. Consolidating to one tool saves $5.4K/yr.'
            }
        ]
    },
    design: {
        name: 'Design & Product',
        icon: 'fas fa-palette',
        iconBg: 'rgba(245,158,11,0.1)',
        iconColor: 'var(--orange)',
        users: 34, apps: 12, adoption: 48, activeUsers: 16, avgLogins: 9.1,
        spend: '$55.8K', waste: '$9.6K',
        teams: [
            {
                id: 'design-ux', name: 'UX Research', icon: 'fas fa-search',
                iconBg: 'rgba(168,85,247,0.1)', iconColor: '#A855F7',
                users: 8, apps: 6, adoption: 50, activeUsers: 4, avgLogins: 8.2,
                spend: '$11.4K', waste: '$3.6K',
                topApps: ['Figma', 'Maze', 'UserTesting'],
                members: [
                    { name: 'Shruti V.', role: 'UX Lead', apps: 6, logins: 14, status: 'active', avatar: '#A855F7' },
                    { name: 'Nitin P.', role: 'Researcher', apps: 3, logins: 6, status: 'idle', avatar: '#F97316' }
                ],
                aiInsight: 'UX Research has 4 inactive members across Maze and UserTesting. Consider shared team licenses instead of individual seats.'
            },
            {
                id: 'design-ui', name: 'UI Design', icon: 'fas fa-pen-nib',
                iconBg: 'rgba(236,72,153,0.1)', iconColor: '#EC4899',
                users: 12, apps: 8, adoption: 58, activeUsers: 7, avgLogins: 10.4,
                spend: '$28.8K', waste: '$3.6K',
                topApps: ['Figma', 'Adobe CC', 'Miro'],
                members: [
                    { name: 'Ankita R.', role: 'Design Lead', apps: 8, logins: 16, status: 'active', avatar: '#EC4899' },
                    { name: 'Varun D.', role: 'Designer', apps: 6, logins: 12, status: 'active', avatar: '#3B82F6' },
                    { name: 'Pallavi J.', role: 'Designer', apps: 4, logins: 6, status: 'idle', avatar: '#10B981' }
                ],
                aiInsight: 'UI team pays for Figma + Sketch + Adobe XD. 100% of actual work happens in Figma. Dropping Sketch and XD saves $3.6K/yr.'
            },
            {
                id: 'design-product', name: 'Product Management', icon: 'fas fa-project-diagram',
                iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
                users: 14, apps: 7, adoption: 42, activeUsers: 6, avgLogins: 8.6,
                spend: '$15.6K', waste: '$2.4K',
                topApps: ['Notion', 'Jira', 'Productboard'],
                members: [
                    { name: 'Gaurav M.', role: 'PM Lead', apps: 7, logins: 14, status: 'active', avatar: '#3B82F6' },
                    { name: 'Shalini K.', role: 'PM', apps: 5, logins: 10, status: 'active', avatar: '#F59E0B' },
                    { name: 'Vishal T.', role: 'APM', apps: 3, logins: 4, status: 'inactive', avatar: '#EF4444' }
                ],
                aiInsight: 'Product team has lowest adoption (42%). Vishal T. hasn\'t logged in for 18 days. Productboard has 8 unused seats — downgrade plan.'
            }
        ]
    },
    finance: {
        name: 'Finance',
        icon: 'fas fa-dollar-sign',
        iconBg: 'rgba(16,185,129,0.1)',
        iconColor: 'var(--green)',
        users: 28, apps: 9, adoption: 76, activeUsers: 21, avgLogins: 15.7,
        spend: '$25.8K', waste: '$2.4K',
        teams: [
            {
                id: 'fin-accounts', name: 'Accounts & Payables', icon: 'fas fa-file-invoice-dollar',
                iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
                users: 12, apps: 6, adoption: 83, activeUsers: 10, avgLogins: 18.2,
                spend: '$12.6K', waste: '$0.9K',
                topApps: ['Zoho Books', 'Razorpay', 'QuickBooks'],
                members: [
                    { name: 'Sunita R.', role: 'Finance Lead', apps: 6, logins: 22, status: 'active', avatar: '#10B981' },
                    { name: 'Ramesh K.', role: 'Accountant', apps: 5, logins: 18, status: 'active', avatar: '#3B82F6' }
                ],
                aiInsight: 'Accounts team is well-optimized. QuickBooks usage is declining — consider migrating fully to Zoho Books to save $0.9K/yr.'
            },
            {
                id: 'fin-fp', name: 'FP&A', icon: 'fas fa-chart-pie',
                iconBg: 'rgba(99,102,241,0.1)', iconColor: '#6366F1',
                users: 8, apps: 5, adoption: 75, activeUsers: 6, avgLogins: 14.6,
                spend: '$8.4K', waste: '$0.9K',
                topApps: ['Excel', 'Tableau', 'Adaptive Insights'],
                members: [
                    { name: 'Alok M.', role: 'FP&A Lead', apps: 5, logins: 18, status: 'active', avatar: '#6366F1' },
                    { name: 'Nandini S.', role: 'Analyst', apps: 4, logins: 12, status: 'active', avatar: '#EC4899' }
                ],
                aiInsight: 'FP&A uses 2 BI tools (Tableau + Adaptive Insights). Standardizing on one saves $0.9K/yr.'
            },
            {
                id: 'fin-compliance', name: 'Tax & Compliance', icon: 'fas fa-gavel',
                iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
                users: 8, apps: 4, adoption: 62, activeUsers: 5, avgLogins: 12.4,
                spend: '$4.8K', waste: '$0.6K',
                topApps: ['ClearTax', 'Zoho', 'Tally'],
                members: [
                    { name: 'Paresh D.', role: 'Tax Head', apps: 4, logins: 16, status: 'active', avatar: '#F59E0B' },
                    { name: 'Jyoti K.', role: 'Compliance Exec.', apps: 3, logins: 10, status: 'active', avatar: '#A855F7' }
                ],
                aiInsight: 'Tax team is lean. Tally usage dropped 60% after ClearTax adoption — consider full migration.'
            }
        ]
    },
    support: {
        name: 'Customer Support',
        icon: 'fas fa-headset',
        iconBg: 'rgba(239,68,68,0.1)',
        iconColor: 'var(--red)',
        users: 52, apps: 8, adoption: 62, activeUsers: 32, avgLogins: 12.4,
        spend: '$55.2K', waste: '$11.4K',
        teams: [
            {
                id: 'sup-tier1', name: 'Tier 1 — Frontline', icon: 'fas fa-phone',
                iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
                users: 22, apps: 4, adoption: 68, activeUsers: 15, avgLogins: 14.2,
                spend: '$18.6K', waste: '$4.2K',
                topApps: ['Zendesk', 'Intercom', 'Freshdesk'],
                members: [
                    { name: 'Geeta S.', role: 'Team Lead', apps: 4, logins: 20, status: 'active', avatar: '#3B82F6' },
                    { name: 'Raman K.', role: 'Support Agent', apps: 3, logins: 16, status: 'active', avatar: '#10B981' },
                    { name: 'Sonal D.', role: 'Support Agent', apps: 2, logins: 6, status: 'idle', avatar: '#F59E0B' }
                ],
                aiInsight: 'Tier 1 uses Zendesk + Intercom + Freshdesk — 3 tools doing the same thing. Consolidating to Zendesk alone saves $4.2K/yr.'
            },
            {
                id: 'sup-tier2', name: 'Tier 2 — Technical', icon: 'fas fa-tools',
                iconBg: 'rgba(168,85,247,0.1)', iconColor: '#A855F7',
                users: 14, apps: 6, adoption: 71, activeUsers: 10, avgLogins: 12.8,
                spend: '$17.4K', waste: '$3.6K',
                topApps: ['Zendesk', 'Jira', 'Confluence'],
                members: [
                    { name: 'Manoj T.', role: 'Tech Lead', apps: 6, logins: 18, status: 'active', avatar: '#A855F7' },
                    { name: 'Isha R.', role: 'Tech Support', apps: 5, logins: 14, status: 'active', avatar: '#EF4444' }
                ],
                aiInsight: 'Tier 2 team has good utilization. 2 Jira seats unused — can be reclaimed and reassigned to Tier 1.'
            },
            {
                id: 'sup-success', name: 'Customer Success', icon: 'fas fa-star',
                iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
                users: 16, apps: 5, adoption: 50, activeUsers: 8, avgLogins: 9.6,
                spend: '$19.2K', waste: '$3.6K',
                topApps: ['Gainsight', 'Salesforce', 'Slack'],
                members: [
                    { name: 'Rashmi P.', role: 'CS Manager', apps: 5, logins: 14, status: 'active', avatar: '#10B981' },
                    { name: 'Aditya V.', role: 'CSM', apps: 4, logins: 10, status: 'active', avatar: '#F97316' },
                    { name: 'Megha K.', role: 'CSM', apps: 2, logins: 4, status: 'inactive', avatar: '#EF4444' }
                ],
                aiInsight: 'Customer Success has 50% adoption — 8 users barely touch Gainsight. Megha hasn\'t logged in for 30 days. Downgrade Gainsight plan to save $3.6K/yr.'
            }
        ]
    },
    hr: {
        name: 'HR & Operations',
        icon: 'fas fa-user-tie',
        iconBg: 'rgba(20,184,166,0.1)',
        iconColor: 'var(--teal)',
        users: 35, apps: 11, adoption: 55, activeUsers: 19, avgLogins: 10.8,
        spend: '$37.2K', waste: '$4.8K',
        teams: [
            {
                id: 'hr-talent', name: 'Talent Acquisition', icon: 'fas fa-user-plus',
                iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
                users: 10, apps: 6, adoption: 60, activeUsers: 6, avgLogins: 12.4,
                spend: '$12.6K', waste: '$1.8K',
                topApps: ['LinkedIn Recruiter', 'Greenhouse', 'Calendly'],
                members: [
                    { name: 'Pragya M.', role: 'TA Lead', apps: 6, logins: 18, status: 'active', avatar: '#3B82F6' },
                    { name: 'Siddharth K.', role: 'Recruiter', apps: 4, logins: 14, status: 'active', avatar: '#10B981' },
                    { name: 'Tanvi R.', role: 'Recruiter', apps: 3, logins: 6, status: 'idle', avatar: '#F59E0B' }
                ],
                aiInsight: 'Talent Acquisition has 4 LinkedIn Recruiter seats but only 2 active recruiters using them. Reclaim 2 seats to save $1.8K/yr.'
            },
            {
                id: 'hr-people', name: 'People Operations', icon: 'fas fa-users-cog',
                iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
                users: 12, apps: 7, adoption: 58, activeUsers: 7, avgLogins: 10.2,
                spend: '$14.4K', waste: '$1.8K',
                topApps: ['BambooHR', 'Greythr', 'Darwinbox'],
                members: [
                    { name: 'Swati J.', role: 'HR Head', apps: 7, logins: 16, status: 'active', avatar: '#10B981' },
                    { name: 'Ajay P.', role: 'HR Executive', apps: 5, logins: 12, status: 'active', avatar: '#6366F1' }
                ],
                aiInsight: 'People Ops uses 3 HRMS tools (BambooHR + Greythr + Darwinbox). Standardizing on Darwinbox saves $1.8K/yr.'
            },
            {
                id: 'hr-admin', name: 'Admin & Facilities', icon: 'fas fa-building',
                iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
                users: 13, apps: 5, adoption: 46, activeUsers: 6, avgLogins: 8.4,
                spend: '$10.2K', waste: '$1.2K',
                topApps: ['Notion', 'Google Workspace', 'Envoy'],
                members: [
                    { name: 'Gayatri S.', role: 'Facilities Lead', apps: 5, logins: 12, status: 'active', avatar: '#F59E0B' },
                    { name: 'Vijay N.', role: 'Admin', apps: 3, logins: 8, status: 'idle', avatar: '#EF4444' }
                ],
                aiInsight: 'Admin team has lowest adoption at 46%. 7 members have zero app logins this month. Consider reducing seat count.'
            }
        ]
    }
};

// Current drill state tracking
var drillState = { dept: null, team: null };

function openDeptDrill(deptId) {
    var dept = drillData[deptId];
    if (!dept) return;
    drillState = { dept: deptId, team: null };
    renderDeptView(dept, deptId);
    var overlay = document.getElementById('drill-overlay');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrill() {
    var overlay = document.getElementById('drill-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    drillState = { dept: null, team: null };
}

function renderDeptView(dept, deptId) {
    var panel = document.getElementById('drill-panel');
    if (!panel) return;

    var adoptionColor = dept.adoption >= 75 ? 'var(--green)' : dept.adoption >= 55 ? 'var(--orange)' : 'var(--red)';

    var html = ''
        + '<div class="drill-breadcrumb">'
        + '  <a onclick="closeDrill()">TechCorp India</a>'
        + '  <span class="sep"><i class="fas fa-chevron-right"></i></span>'
        + '  <span class="current">' + dept.name + '</span>'
        + '</div>'
        + '<div class="drill-header">'
        + '  <div class="drill-header-left">'
        + '    <div class="drill-header-icon" style="background:' + dept.iconBg + ';color:' + dept.iconColor + '"><i class="' + dept.icon + '"></i></div>'
        + '    <div>'
        + '      <h2>' + dept.name + '</h2>'
        + '      <div class="drill-subtitle">' + dept.teams.length + ' teams · ' + dept.users + ' members · ' + dept.apps + ' apps</div>'
        + '    </div>'
        + '  </div>'
        + '  <button class="drill-close" onclick="closeDrill()" title="Close"><i class="fas fa-times"></i></button>'
        + '</div>'
        + '<div class="drill-kpi-strip">'
        + '  <div class="drill-kpi"><span class="kpi-val" style="color:' + adoptionColor + '">' + dept.adoption + '%</span><span class="kpi-label">Adoption</span></div>'
        + '  <div class="drill-kpi"><span class="kpi-val">' + dept.activeUsers + '/' + dept.users + '</span><span class="kpi-label">Active Users</span></div>'
        + '  <div class="drill-kpi"><span class="kpi-val">' + dept.avgLogins + '</span><span class="kpi-label">Avg Logins/Wk</span></div>'
        + '  <div class="drill-kpi"><span class="kpi-val" style="color:var(--red)">' + (dept.waste || '—') + '</span><span class="kpi-label">Waste</span></div>'
        + '</div>';

    // Section title
    html += '<div style="padding:20px 24px 8px;display:flex;align-items:center;justify-content:space-between">'
        + '<h3 style="font-size:16px;font-weight:700;color:var(--gray-800);margin:0;display:flex;align-items:center;gap:8px"><i class="fas fa-users" style="color:var(--primary)"></i> Teams in ' + dept.name + '</h3>'
        + '<span style="font-size:12px;color:var(--gray-400)">' + dept.teams.length + ' teams</span>'
        + '</div>';

    // Team cards
    html += '<div class="drill-team-grid">';
    dept.teams.forEach(function(team) {
        var tColor = team.adoption >= 75 ? 'var(--green)' : team.adoption >= 55 ? 'var(--orange)' : 'var(--red)';
        html += '<div class="drill-team-card" onclick="openTeamDrill(\'' + deptId + '\',\'' + team.id + '\')">'
            + '  <div class="team-head">'
            + '    <div class="team-icon" style="background:' + team.iconBg + ';color:' + team.iconColor + '"><i class="' + team.icon + '"></i></div>'
            + '    <div>'
            + '      <div class="team-name">' + team.name + '</div>'
            + '      <div class="team-meta">' + team.users + ' members · ' + team.apps + ' apps</div>'
            + '    </div>'
            + '  </div>'
            + '  <div class="team-bar"><div class="team-bar-fill" style="width:' + team.adoption + '%;background:' + tColor + '"></div></div>'
            + '  <div class="team-stats">'
            + '    <div><span>Adoption</span> <strong style="color:' + tColor + '">' + team.adoption + '%</strong></div>'
            + '    <div><span>Active</span> <strong>' + team.activeUsers + '/' + team.users + '</strong></div>'
            + '    <div><span>Spend</span> <strong>' + team.spend + '</strong></div>'
            + '  </div>'
            + '  <i class="fas fa-chevron-right drill-arrow"></i>'
            + '</div>';
    });
    html += '</div>';

    // AI insight for the whole dept
    var topWasteTeam = dept.teams.reduce(function(a, b) { return parseFloat(a.waste.replace(/[^0-9.]/g,'')) > parseFloat(b.waste.replace(/[^0-9.]/g,'')) ? a : b; });
    html += '<div class="drill-ai-insight">'
        + '  <i class="fas fa-robot"></i>'
        + '  <span><strong>AI Insight:</strong> ' + dept.name + ' has ' + dept.teams.length + ' teams. <strong>' + topWasteTeam.name + '</strong> has the highest waste (' + topWasteTeam.waste + '). Click any team to see member-level details and optimization opportunities.</span>'
        + '</div>';

    panel.innerHTML = html;
}

function openTeamDrill(deptId, teamId) {
    var dept = drillData[deptId];
    if (!dept) return;
    var team = dept.teams.find(function(t) { return t.id === teamId; });
    if (!team) return;
    drillState = { dept: deptId, team: teamId };
    renderTeamView(dept, team, deptId);
}

function renderTeamView(dept, team, deptId) {
    var panel = document.getElementById('drill-panel');
    if (!panel) return;
    panel.scrollTop = 0;

    var adoptionColor = team.adoption >= 75 ? 'var(--green)' : team.adoption >= 55 ? 'var(--orange)' : 'var(--red)';

    var html = ''
        + '<div class="drill-breadcrumb">'
        + '  <a onclick="closeDrill()">TechCorp India</a>'
        + '  <span class="sep"><i class="fas fa-chevron-right"></i></span>'
        + '  <a onclick="openDeptDrill(\'' + deptId + '\')">' + dept.name + '</a>'
        + '  <span class="sep"><i class="fas fa-chevron-right"></i></span>'
        + '  <span class="current">' + team.name + '</span>'
        + '</div>'
        + '<div class="drill-header">'
        + '  <div class="drill-header-left">'
        + '    <div class="drill-header-icon" style="background:' + team.iconBg + ';color:' + team.iconColor + '"><i class="' + team.icon + '"></i></div>'
        + '    <div>'
        + '      <h2>' + team.name + '</h2>'
        + '      <div class="drill-subtitle">' + team.users + ' members · ' + team.apps + ' apps · Part of ' + dept.name + '</div>'
        + '    </div>'
        + '  </div>'
        + '  <button class="drill-close" onclick="closeDrill()" title="Close"><i class="fas fa-times"></i></button>'
        + '</div>'
        + '<div class="drill-kpi-strip">'
        + '  <div class="drill-kpi"><span class="kpi-val" style="color:' + adoptionColor + '">' + team.adoption + '%</span><span class="kpi-label">Adoption</span></div>'
        + '  <div class="drill-kpi"><span class="kpi-val">' + team.activeUsers + '/' + team.users + '</span><span class="kpi-label">Active</span></div>'
        + '  <div class="drill-kpi"><span class="kpi-val">' + team.avgLogins + '</span><span class="kpi-label">Logins/Wk</span></div>'
        + '  <div class="drill-kpi"><span class="kpi-val" style="color:var(--red)">' + team.waste + '</span><span class="kpi-label">Waste</span></div>'
        + '</div>';

    // AI insight
    html += '<div class="drill-ai-insight">'
        + '  <i class="fas fa-robot"></i>'
        + '  <span><strong>AI Insight:</strong> ' + team.aiInsight + '</span>'
        + '</div>';

    // Top apps used
    html += '<div style="padding:0 24px 12px"><h4 style="font-size:14px;font-weight:700;color:var(--gray-800);margin-bottom:12px;display:flex;align-items:center;gap:8px"><i class="fas fa-th-large" style="color:var(--primary)"></i> Top Apps</h4></div>';
    html += '<div class="drill-app-list">';
    team.topApps.forEach(function(app, i) {
        var colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        var c = colors[i % colors.length];
        html += '<div class="drill-app-row">'
            + '  <div class="app-icon" style="background:' + c + ';color:#fff;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;font-size:11px;font-weight:700">' + app.substring(0,2).toUpperCase() + '</div>'
            + '  <div class="app-details"><div class="app-name">' + app + '</div><div class="app-usage">Used by ' + Math.max(1, Math.round(team.activeUsers * (0.9 - i * 0.15))) + ' of ' + team.users + ' members</div></div>'
            + '</div>';
    });
    html += '</div>';

    // Members table
    html += '<div class="drill-member-section">'
        + '  <h4><i class="fas fa-user-friends" style="color:var(--primary)"></i> Team Members (' + team.members.length + ')</h4>'
        + '  <table class="drill-member-table">'
        + '    <thead><tr><th>Member</th><th>Role</th><th>Apps Used</th><th>Logins/Wk</th><th>Status</th></tr></thead>'
        + '    <tbody>';

    team.members.forEach(function(m) {
        var initials = m.name.split(' ').map(function(n) { return n[0]; }).join('').substring(0,2);
        var statusClass = m.status;
        var statusLabel = m.status === 'active' ? 'Active' : m.status === 'idle' ? 'Idle' : 'Inactive';
        html += '<tr>'
            + '<td><span class="member-avatar" style="background:' + m.avatar + '">' + initials + '</span>' + m.name + '</td>'
            + '<td>' + m.role + '</td>'
            + '<td>' + m.apps + ' / ' + team.apps + '</td>'
            + '<td>' + m.logins + '</td>'
            + '<td><span class="member-status ' + statusClass + '">' + statusLabel + '</span></td>'
            + '</tr>';
    });

    html += '    </tbody></table></div>';

    // Back button
    html += '<div style="padding:0 24px 24px">'
        + '  <button onclick="openDeptDrill(\'' + deptId + '\')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:var(--gray-100);color:var(--gray-700);border:none;transition:all 0.2s" onmouseover="this.style.background=\'var(--primary-bg)\';this.style.color=\'var(--primary)\'" onmouseout="this.style.background=\'var(--gray-100)\';this.style.color=\'var(--gray-700)\'">'
        + '    <i class="fas fa-arrow-left"></i> Back to ' + dept.name + ' teams'
        + '  </button>'
        + '</div>';

    panel.innerHTML = html;
}

// Close drill on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var overlay = document.getElementById('drill-overlay');
        if (overlay && overlay.classList.contains('open')) {
            if (drillState.team) {
                // Go back to dept view
                openDeptDrill(drillState.dept);
            } else {
                closeDrill();
            }
            e.preventDefault();
        }
    }
});


/* ==========================================================================
   ORG EXPLORER — Nested Hierarchy: Org → Teams → People
   Expenses visible at EVERY level. No department grouping.
   ========================================================================== */

var orgTreeData = [
    {
        id: 'zenith-digital',
        name: 'Zenith Digital Solutions',
        plan: 'Enterprise Plan',
        icon: 'fas fa-building',
        iconBg: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
        expense: { total: '$8.58M/yr', waste: '$115.2K/yr', potentialSavings: '$73.8K/yr', apps: 94, licenses: 820, wastedLicenses: 142 },
        teams: [
            {
                id: 'z-growth-pod', name: 'Growth Pod', icon: 'fas fa-rocket',
                color: '#7C3AED', iconBg: 'rgba(124,58,237,0.1)', iconColor: '#7C3AED',
                expense: { total: '$128.4K/yr', waste: '$18.6K/yr', apps: 18, licenses: 128, wastedLicenses: 22 },
                aiTip: 'HubSpot + Marketo overlap on email automation. Dropping Marketo saves $7.2K/yr. 8 unused Intercom seats.',
                people: [
                    { name: 'Arjun Mehta', role: 'Pod Lead', expense: '$14.4K/yr', apps: 14, logins: 32, status: 'active', avatar: '#7C3AED' },
                    { name: 'Meera Kapoor', role: 'Growth Engineer', expense: '$10.8K/yr', apps: 11, logins: 28, status: 'active', avatar: '#3B82F6' },
                    { name: 'Rohit Jain', role: 'Product Marketer', expense: '$9.6K/yr', apps: 10, logins: 24, status: 'active', avatar: '#10B981' },
                    { name: 'Sneha Deshmukh', role: 'Data Analyst', expense: '$8.4K/yr', apps: 8, logins: 20, status: 'active', avatar: '#F59E0B' },
                    { name: 'Vikram Patil', role: 'Campaign Specialist', expense: '$4.2K/yr', apps: 5, logins: 8, status: 'idle', avatar: '#EF4444' },
                    { name: 'Kiran Rao', role: 'Content Writer', expense: '$2.4K/yr', apps: 3, logins: 4, status: 'inactive', avatar: '#6366F1' }
                ]
            },
            {
                id: 'z-platform-core', name: 'Platform Core', icon: 'fas fa-layer-group',
                color: '#3B82F6', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
                expense: { total: '$175.8K/yr', waste: '$22.2K/yr', apps: 22, licenses: 156, wastedLicenses: 28 },
                aiTip: '3 CI/CD tools running (Jenkins + GitHub Actions + CircleCI). Standardize on GitHub Actions: save $14.4K/yr.',
                people: [
                    { name: 'Suresh Kumar', role: 'Staff Engineer', expense: '$18.6K/yr', apps: 20, logins: 36, status: 'active', avatar: '#3B82F6' },
                    { name: 'Priya Sharma', role: 'Sr. Engineer', expense: '$14.4K/yr', apps: 16, logins: 30, status: 'active', avatar: '#EC4899' },
                    { name: 'Rahul Krishnan', role: 'Engineer', expense: '$10.2K/yr', apps: 12, logins: 26, status: 'active', avatar: '#10B981' },
                    { name: 'Deepa Murthy', role: 'Engineer', expense: '$9.6K/yr', apps: 11, logins: 24, status: 'active', avatar: '#F59E0B' },
                    { name: 'Ananya Reddy', role: 'SRE', expense: '$12.6K/yr', apps: 18, logins: 32, status: 'active', avatar: '#A855F7' },
                    { name: 'Manoj Verma', role: 'DevOps', expense: '$10.8K/yr', apps: 14, logins: 28, status: 'active', avatar: '#F97316' },
                    { name: 'Pooja Nair', role: 'Jr. Engineer', expense: '$3.6K/yr', apps: 4, logins: 6, status: 'inactive', avatar: '#EF4444' }
                ]
            },
            {
                id: 'z-customer360', name: 'Customer360', icon: 'fas fa-users',
                color: '#10B981', iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
                expense: { total: '$97.2K/yr', waste: '$16.8K/yr', apps: 14, licenses: 98, wastedLicenses: 18 },
                aiTip: 'Zendesk + Freshdesk + Intercom for support — 3 tools same job. Consolidate to Zendesk: save $16.8K/yr.',
                people: [
                    { name: 'Geeta Saxena', role: 'CS Lead', expense: '$11.4K/yr', apps: 12, logins: 24, status: 'active', avatar: '#10B981' },
                    { name: 'Rashmi Pandit', role: 'Success Manager', expense: '$9.6K/yr', apps: 10, logins: 22, status: 'active', avatar: '#3B82F6' },
                    { name: 'Aditya Vyas', role: 'Support Engineer', expense: '$7.2K/yr', apps: 8, logins: 18, status: 'active', avatar: '#F59E0B' },
                    { name: 'Raman Kaur', role: 'Support Agent', expense: '$4.8K/yr', apps: 6, logins: 16, status: 'active', avatar: '#A855F7' },
                    { name: 'Sonal Dube', role: 'Support Agent', expense: '$3.6K/yr', apps: 4, logins: 6, status: 'idle', avatar: '#EC4899' },
                    { name: 'Megha Kapoor', role: 'Onboarding Specialist', expense: '$1.8K/yr', apps: 2, logins: 3, status: 'inactive', avatar: '#EF4444' }
                ]
            },
            {
                id: 'z-revenue-engine', name: 'Revenue Engine', icon: 'fas fa-chart-line',
                color: '#F59E0B', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
                expense: { total: '$114.6K/yr', waste: '$14.4K/yr', apps: 12, licenses: 86, wastedLicenses: 14 },
                aiTip: 'Salesforce Enterprise tier used by 60% of team. Downgrading 5 seats to Professional saves $8.4K/yr. Gong has 4 unused licenses.',
                people: [
                    { name: 'Rajesh Verma', role: 'Revenue Lead', expense: '$15.6K/yr', apps: 12, logins: 28, status: 'active', avatar: '#F59E0B' },
                    { name: 'Anita Sen', role: 'Account Executive', expense: '$13.8K/yr', apps: 10, logins: 26, status: 'active', avatar: '#3B82F6' },
                    { name: 'Mohit Khanna', role: 'Account Executive', expense: '$11.4K/yr', apps: 9, logins: 22, status: 'active', avatar: '#10B981' },
                    { name: 'Dinesh Rajan', role: 'BDR', expense: '$7.2K/yr', apps: 6, logins: 14, status: 'active', avatar: '#A855F7' },
                    { name: 'Simran Thakur', role: 'BDR', expense: '$5.4K/yr', apps: 5, logins: 8, status: 'idle', avatar: '#EF4444' }
                ]
            },
            {
                id: 'z-ai-labs', name: 'AI & ML Labs', icon: 'fas fa-brain',
                color: '#A855F7', iconBg: 'rgba(168,85,247,0.1)', iconColor: '#A855F7',
                expense: { total: '$144.6K/yr', waste: '$25.8K/yr', apps: 16, licenses: 72, wastedLicenses: 18 },
                aiTip: 'GPU cluster idle 40% weekends. Move to spot instances: save $18.6K/yr. 4 unused Weights & Biases seats.',
                people: [
                    { name: 'Dr. Anand Roy', role: 'ML Lead', expense: '$23.4K/yr', apps: 16, logins: 30, status: 'active', avatar: '#A855F7' },
                    { name: 'Wei Zhang', role: 'ML Engineer', expense: '$19.2K/yr', apps: 14, logins: 28, status: 'active', avatar: '#3B82F6' },
                    { name: 'Prerna Gupta', role: 'Data Scientist', expense: '$15.6K/yr', apps: 12, logins: 24, status: 'active', avatar: '#EC4899' },
                    { name: 'Kavya Menon', role: 'Data Engineer', expense: '$13.8K/yr', apps: 10, logins: 22, status: 'active', avatar: '#10B981' },
                    { name: 'Harish Bhatt', role: 'Research Intern', expense: '$3.6K/yr', apps: 4, logins: 6, status: 'idle', avatar: '#F59E0B' }
                ]
            },
            {
                id: 'z-devinfra', name: 'DevInfra', icon: 'fas fa-server',
                color: '#EF4444', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444',
                expense: { total: '$110.4K/yr', waste: '$9.6K/yr', apps: 20, licenses: 108, wastedLicenses: 12 },
                aiTip: 'Datadog + New Relic + PagerDuty monitoring overlap. Consolidating saves $9.6K/yr.',
                people: [
                    { name: 'Tarun Singh', role: 'Infra Lead', expense: '$16.2K/yr', apps: 18, logins: 34, status: 'active', avatar: '#EF4444' },
                    { name: 'Nikhil Mathur', role: 'Platform Eng.', expense: '$12.6K/yr', apps: 15, logins: 28, status: 'active', avatar: '#3B82F6' },
                    { name: 'Divya Pillai', role: 'SRE', expense: '$11.4K/yr', apps: 14, logins: 26, status: 'active', avatar: '#A855F7' },
                    { name: 'Ajay Patil', role: 'DevOps', expense: '$9.6K/yr', apps: 12, logins: 22, status: 'active', avatar: '#10B981' }
                ]
            },
            {
                id: 'z-mobile-xp', name: 'Mobile Experience', icon: 'fas fa-mobile-alt',
                color: '#6366F1', iconBg: 'rgba(99,102,241,0.1)', iconColor: '#6366F1',
                expense: { total: '$55.8K/yr', waste: '$4.2K/yr', apps: 10, licenses: 64, wastedLicenses: 8 },
                aiTip: 'Firebase Blaze plan overkill — downgrade to Spark for 2 staging projects: save $2.4K/yr.',
                people: [
                    { name: 'Amit Joshi', role: 'Mobile Lead', expense: '$12.6K/yr', apps: 10, logins: 28, status: 'active', avatar: '#6366F1' },
                    { name: 'Rohan Shetty', role: 'iOS Engineer', expense: '$10.2K/yr', apps: 8, logins: 24, status: 'active', avatar: '#EC4899' },
                    { name: 'Neha Kulkarni', role: 'Android Engineer', expense: '$9K/yr', apps: 7, logins: 20, status: 'active', avatar: '#F59E0B' },
                    { name: 'Sanjay Lal', role: 'QA', expense: '$5.4K/yr', apps: 5, logins: 14, status: 'idle', avatar: '#10B981' }
                ]
            },
            {
                id: 'z-analytics-hub', name: 'Analytics Hub', icon: 'fas fa-chart-pie',
                color: '#EC4899', iconBg: 'rgba(236,72,153,0.1)', iconColor: '#EC4899',
                expense: { total: '$67.2K/yr', waste: '$11.4K/yr', apps: 12, licenses: 54, wastedLicenses: 16 },
                aiTip: 'Amplitude + Mixpanel + GA4 — paying for 3 analytics tools. Consolidate to Amplitude: save $11.4K/yr.',
                people: [
                    { name: 'Ravi Tiwari', role: 'Analytics Lead', expense: '$13.8K/yr', apps: 12, logins: 26, status: 'active', avatar: '#EC4899' },
                    { name: 'Nandini Shah', role: 'BI Analyst', expense: '$9.6K/yr', apps: 8, logins: 20, status: 'active', avatar: '#3B82F6' },
                    { name: 'Alok Mehta', role: 'Data Analyst', expense: '$8.4K/yr', apps: 7, logins: 18, status: 'active', avatar: '#10B981' },
                    { name: 'Lavanya Kaul', role: 'Analyst', expense: '$4.8K/yr', apps: 4, logins: 8, status: 'idle', avatar: '#F59E0B' }
                ]
            },
            {
                id: 'z-people-ops', name: 'People & Culture', icon: 'fas fa-heart',
                color: '#14B8A6', iconBg: 'rgba(20,184,166,0.1)', iconColor: '#14B8A6',
                expense: { total: '$44.4K/yr', waste: '$6.6K/yr', apps: 8, licenses: 68, wastedLicenses: 12 },
                aiTip: '3 HRMS tools (BambooHR + Greythr + Darwinbox). 100% use Darwinbox — drop the other 2: save $6.6K/yr.',
                people: [
                    { name: 'Swati Joshi', role: 'People Lead', expense: '$9.6K/yr', apps: 8, logins: 20, status: 'active', avatar: '#14B8A6' },
                    { name: 'Pragya Mishra', role: 'Talent Acquisition', expense: '$7.8K/yr', apps: 6, logins: 18, status: 'active', avatar: '#3B82F6' },
                    { name: 'Siddharth Kale', role: 'Recruiter', expense: '$5.4K/yr', apps: 5, logins: 14, status: 'active', avatar: '#A855F7' },
                    { name: 'Tanvi Rane', role: 'HR Coordinator', expense: '$3.6K/yr', apps: 3, logins: 6, status: 'idle', avatar: '#F59E0B' }
                ]
            },
            {
                id: 'z-finance-ops', name: 'Finance & Compliance', icon: 'fas fa-calculator',
                color: '#F97316', iconBg: 'rgba(249,115,22,0.1)', iconColor: '#F97316',
                expense: { total: '$37.8K/yr', waste: '$4.2K/yr', apps: 9, licenses: 48, wastedLicenses: 6 },
                aiTip: 'QuickBooks usage dropped 80% after Zoho Books — fully migrate: save $2.4K/yr. 2 unused Tally seats.',
                people: [
                    { name: 'Sunita Rao', role: 'Finance Lead', expense: '$10.2K/yr', apps: 9, logins: 22, status: 'active', avatar: '#F97316' },
                    { name: 'Ramesh Kapoor', role: 'Accountant', expense: '$7.2K/yr', apps: 7, logins: 18, status: 'active', avatar: '#3B82F6' },
                    { name: 'Paresh Dalal', role: 'Tax Specialist', expense: '$6K/yr', apps: 6, logins: 16, status: 'active', avatar: '#10B981' },
                    { name: 'Jyoti Kulkarni', role: 'Compliance Exec', expense: '$4.8K/yr', apps: 4, logins: 10, status: 'active', avatar: '#A855F7' }
                ]
            }
        ]
    },
    {
        id: 'novabyte-tech',
        name: 'NovaByte Technologies',
        plan: 'Business Plan',
        icon: 'fas fa-bolt',
        iconBg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)',
        expense: { total: '$3.72M/yr', waste: '$55.8K/yr', potentialSavings: '$38.4K/yr', apps: 52, licenses: 410, wastedLicenses: 68 },
        teams: [
            {
                id: 'n-product-velocity', name: 'Product Velocity', icon: 'fas fa-shipping-fast',
                color: '#3B82F6', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
                expense: { total: '$102.6K/yr', waste: '$14.4K/yr', apps: 16, licenses: 94, wastedLicenses: 16 },
                aiTip: 'Jira + Linear + Asana — 3 project management tools. Team uses Linear 90%. Drop Jira + Asana: save $10.8K/yr.',
                people: [
                    { name: 'James Chen', role: 'Engineering Lead', expense: '$20.4K/yr', apps: 16, logins: 34, status: 'active', avatar: '#3B82F6' },
                    { name: 'Sarah Williams', role: 'Staff Engineer', expense: '$16.2K/yr', apps: 14, logins: 30, status: 'active', avatar: '#EC4899' },
                    { name: 'Alex Kumar', role: 'Sr. Engineer', expense: '$12.6K/yr', apps: 12, logins: 26, status: 'active', avatar: '#10B981' },
                    { name: 'Maya Patel', role: 'Engineer', expense: '$9.6K/yr', apps: 10, logins: 22, status: 'active', avatar: '#F59E0B' },
                    { name: 'Daniel Kim', role: 'Engineer', expense: '$8.4K/yr', apps: 8, logins: 18, status: 'active', avatar: '#A855F7' },
                    { name: 'Chris Baker', role: 'Jr. Engineer', expense: '$3.6K/yr', apps: 4, logins: 6, status: 'idle', avatar: '#EF4444' }
                ]
            },
            {
                id: 'n-cloud-native', name: 'Cloud Native', icon: 'fas fa-cloud',
                color: '#10B981', iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
                expense: { total: '$85.8K/yr', waste: '$9.6K/yr', apps: 14, licenses: 78, wastedLicenses: 12 },
                aiTip: 'Reserved AWS instances unused 35% off-hours. Switch 4 to spot: save $7.2K/yr.',
                people: [
                    { name: 'David Park', role: 'Cloud Architect', expense: '$17.4K/yr', apps: 14, logins: 32, status: 'active', avatar: '#10B981' },
                    { name: 'Lisa Tang', role: 'DevOps Engineer', expense: '$12.6K/yr', apps: 12, logins: 28, status: 'active', avatar: '#3B82F6' },
                    { name: 'Raul Fernandez', role: 'SRE', expense: '$10.8K/yr', apps: 10, logins: 24, status: 'active', avatar: '#F97316' },
                    { name: 'Priyanka Das', role: 'Infra Engineer', expense: '$9K/yr', apps: 8, logins: 20, status: 'active', avatar: '#A855F7' }
                ]
            },
            {
                id: 'n-data-pipeline', name: 'Data Pipeline', icon: 'fas fa-database',
                color: '#F59E0B', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
                expense: { total: '$67.2K/yr', waste: '$12.6K/yr', apps: 10, licenses: 56, wastedLicenses: 14 },
                aiTip: 'Snowflake warehouse runs idle 50% of time. Schedule auto-suspend: save $10.2K/yr.',
                people: [
                    { name: 'Ritika Mehta', role: 'Data Lead', expense: '$15.6K/yr', apps: 10, logins: 26, status: 'active', avatar: '#F59E0B' },
                    { name: 'Tom Anderson', role: 'Data Engineer', expense: '$12K/yr', apps: 8, logins: 22, status: 'active', avatar: '#3B82F6' },
                    { name: 'Nisha Iyer', role: 'Data Analyst', expense: '$7.8K/yr', apps: 6, logins: 14, status: 'idle', avatar: '#EC4899' },
                    { name: 'Arjun Basu', role: 'ETL Developer', expense: '$6.6K/yr', apps: 5, logins: 12, status: 'active', avatar: '#10B981' }
                ]
            },
            {
                id: 'n-growth-mktg', name: 'Growth Marketing', icon: 'fas fa-bullhorn',
                color: '#EC4899', iconBg: 'rgba(236,72,153,0.1)', iconColor: '#EC4899',
                expense: { total: '$55.8K/yr', waste: '$11.4K/yr', apps: 10, licenses: 62, wastedLicenses: 16 },
                aiTip: '10 unused HubSpot seats. Semrush + Ahrefs overlap — pick one SEO tool: save $11.4K/yr.',
                people: [
                    { name: 'Priyanka Bajaj', role: 'Marketing Lead', expense: '$12.6K/yr', apps: 10, logins: 22, status: 'active', avatar: '#EC4899' },
                    { name: 'Karthik Narayan', role: 'SEO Specialist', expense: '$10.2K/yr', apps: 8, logins: 18, status: 'active', avatar: '#3B82F6' },
                    { name: 'Rekha Sundaram', role: 'Content Lead', expense: '$7.8K/yr', apps: 6, logins: 14, status: 'active', avatar: '#10B981' },
                    { name: 'Aditi Sharma', role: 'Campaign Mgr', expense: '$6K/yr', apps: 5, logins: 10, status: 'idle', avatar: '#F59E0B' }
                ]
            },
            {
                id: 'n-product-intel', name: 'Product Intelligence', icon: 'fas fa-search-dollar',
                color: '#A855F7', iconBg: 'rgba(168,85,247,0.1)', iconColor: '#A855F7',
                expense: { total: '$50.4K/yr', waste: '$7.8K/yr', apps: 8, licenses: 42, wastedLicenses: 10 },
                aiTip: 'Productboard has 6 inactive seats. Hotjar + FullStory overlap sessions — drop FullStory: save $5.4K/yr.',
                people: [
                    { name: 'Gaurav Malhotra', role: 'PM Lead', expense: '$13.8K/yr', apps: 8, logins: 24, status: 'active', avatar: '#A855F7' },
                    { name: 'Shalini Kapoor', role: 'Product Manager', expense: '$11.4K/yr', apps: 7, logins: 20, status: 'active', avatar: '#3B82F6' },
                    { name: 'Vishal Trivedi', role: 'UX Researcher', expense: '$7.2K/yr', apps: 5, logins: 12, status: 'active', avatar: '#10B981' },
                    { name: 'Ankita Roy', role: 'Designer', expense: '$6K/yr', apps: 4, logins: 8, status: 'idle', avatar: '#EC4899' }
                ]
            },
            {
                id: 'n-support-cmd', name: 'Support Command', icon: 'fas fa-headset',
                color: '#EF4444', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444',
                expense: { total: '$42.6K/yr', waste: '$7.2K/yr', apps: 6, licenses: 48, wastedLicenses: 8 },
                aiTip: 'Intercom chat widget + Drift bot running simultaneously. Disable Drift: save $4.8K/yr.',
                people: [
                    { name: 'Manoj Tripathi', role: 'Support Lead', expense: '$10.8K/yr', apps: 6, logins: 22, status: 'active', avatar: '#EF4444' },
                    { name: 'Isha Rawat', role: 'Tech Support', expense: '$8.4K/yr', apps: 5, logins: 18, status: 'active', avatar: '#3B82F6' },
                    { name: 'Nirav Shah', role: 'Support Agent', expense: '$5.4K/yr', apps: 4, logins: 16, status: 'active', avatar: '#10B981' },
                    { name: 'Fatima Khan', role: 'Support Agent', expense: '$4.2K/yr', apps: 3, logins: 8, status: 'idle', avatar: '#F59E0B' }
                ]
            },
            {
                id: 'n-design-studio', name: 'Design Studio', icon: 'fas fa-pen-nib',
                color: '#F97316', iconBg: 'rgba(249,115,22,0.1)', iconColor: '#F97316',
                expense: { total: '$37.2K/yr', waste: '$5.4K/yr', apps: 8, licenses: 36, wastedLicenses: 6 },
                aiTip: 'Paying for Figma + Sketch + Adobe XD. 100% work in Figma. Drop Sketch + XD: save $5.4K/yr.',
                people: [
                    { name: 'Varun Deshpande', role: 'Design Lead', expense: '$11.4K/yr', apps: 8, logins: 22, status: 'active', avatar: '#F97316' },
                    { name: 'Pallavi Jha', role: 'UI Designer', expense: '$8.4K/yr', apps: 6, logins: 18, status: 'active', avatar: '#EC4899' },
                    { name: 'Shruti Venkat', role: 'Design Systems', expense: '$7.2K/yr', apps: 5, logins: 14, status: 'active', avatar: '#A855F7' }
                ]
            }
        ]
    },
    {
        id: 'cloudspark-labs',
        name: 'CloudSpark Labs',
        plan: 'Starter Plan',
        icon: 'fas fa-flask',
        iconBg: 'linear-gradient(135deg,#F59E0B,#D97706)',
        expense: { total: '$25.2K/yr', waste: '$3.6K/yr', potentialSavings: '$2.4K/yr', apps: 14, licenses: 48, wastedLicenses: 8 },
        teams: [
            {
                id: 'cs-innovation', name: 'Innovation Lab', icon: 'fas fa-lightbulb',
                color: '#F59E0B', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
                expense: { total: '$15.6K/yr', waste: '$2.4K/yr', apps: 10, licenses: 32, wastedLicenses: 6 },
                aiTip: 'Notion + Confluence both active. Team prefers Notion — drop Confluence: save $1.8K/yr.',
                people: [
                    { name: 'Rohit Sharma', role: 'Founder & CTO', expense: '$5.4K/yr', apps: 10, logins: 32, status: 'active', avatar: '#F59E0B' },
                    { name: 'Dev Kapoor', role: 'Full-Stack Engineer', expense: '$4.2K/yr', apps: 8, logins: 26, status: 'active', avatar: '#3B82F6' },
                    { name: 'Aisha Syed', role: 'Designer', expense: '$3K/yr', apps: 6, logins: 18, status: 'active', avatar: '#EC4899' },
                    { name: 'Nitin Patel', role: 'ML Engineer', expense: '$1.8K/yr', apps: 4, logins: 12, status: 'active', avatar: '#10B981' }
                ]
            },
            {
                id: 'cs-go-to-market', name: 'Go-to-Market', icon: 'fas fa-flag',
                color: '#10B981', iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
                expense: { total: '$6.6K/yr', waste: '$1.2K/yr', apps: 6, licenses: 12, wastedLicenses: 2 },
                aiTip: 'Mailchimp free tier should be enough — currently on Standard plan. Downgrade: save $1.2K/yr.',
                people: [
                    { name: 'Gayatri Sharma', role: 'BD Lead', expense: '$2.4K/yr', apps: 6, logins: 20, status: 'active', avatar: '#10B981' },
                    { name: 'Vijay Nambiar', role: 'Content Marketer', expense: '$1.8K/yr', apps: 4, logins: 14, status: 'active', avatar: '#A855F7' },
                    { name: 'Santosh Jain', role: 'Growth Hacker', expense: '$1.2K/yr', apps: 3, logins: 8, status: 'idle', avatar: '#F97316' }
                ]
            },
            {
                id: 'cs-ops', name: 'Ops & Admin', icon: 'fas fa-cog',
                color: '#6366F1', iconBg: 'rgba(99,102,241,0.1)', iconColor: '#6366F1',
                expense: { total: '$3K/yr', waste: '$0', apps: 4, licenses: 4, wastedLicenses: 0 },
                aiTip: 'Lean ops — all licenses utilized. Consider annual billing for Slack and Zoom to save 20%.',
                people: [
                    { name: 'Rina Kapoor', role: 'Operations Head', expense: '$1.5K/yr', apps: 4, logins: 22, status: 'active', avatar: '#6366F1' },
                    { name: 'Bhagyashree P.', role: 'Admin & Finance', expense: '$0.9K/yr', apps: 3, logins: 16, status: 'active', avatar: '#EC4899' }
                ]
            }
        ]
    }
];


/* ---------- Render the full org tree ---------- */
function renderOrgTree() {
    var root = document.getElementById('org-tree-root');
    if (!root) return;
    var html = '<div class="org-tree">';
    orgTreeData.forEach(function(org) {
        html += renderOrgNode(org);
    });
    html += '</div>';
    root.innerHTML = html;
}

function renderOrgNode(org) {
    var e = org.expense;
    var teamCount = org.teams.length;
    var totalPeople = 0;
    org.teams.forEach(function(t) { totalPeople += t.people.length; });

    var h = '<div class="org-node" id="node-' + org.id + '">'
        + '<div class="org-node-header" onclick="toggleOrgNode(\'' + org.id + '\')">'
        + '  <button class="org-toggle" id="toggle-' + org.id + '"><i class="fas fa-chevron-right"></i></button>'
        + '  <div class="org-node-icon" style="background:' + org.iconBg + ';color:#fff"><i class="' + org.icon + '"></i></div>'
        + '  <div class="org-node-info">'
        + '    <div class="org-node-name">' + org.name + '</div>'
        + '    <div class="org-node-meta">' + org.plan + ' · ' + teamCount + ' teams · ' + totalPeople + ' people</div>'
        + '  </div>'
        + '  <div class="org-node-kpis">'
        + '    <div class="org-node-kpi expense"><span class="kv" style="color:#6D28D9">' + e.total + '</span><span class="kl">Total Spend</span></div>'
        + '    <div class="org-node-kpi waste"><span class="kv" style="color:#DC2626">' + e.waste + '</span><span class="kl">Waste</span></div>'
        + '    <div class="org-node-kpi"><span class="kv">' + e.apps + '</span><span class="kl">Apps</span></div>'
        + '    <div class="org-node-kpi"><span class="kv">' + e.licenses + '</span><span class="kl">Licenses</span></div>'
        + '  </div>'
        + '</div>'
        + '<div class="org-expense-bar">'
        + '  <span class="org-expense-pill spend"><i class="fas fa-dollar-sign"></i> Spend: ' + e.total + '</span>'
        + '  <span class="org-expense-pill waste"><i class="fas fa-exclamation-triangle"></i> Waste: ' + e.waste + '</span>'
        + (e.potentialSavings ? '  <span class="org-expense-pill savings"><i class="fas fa-piggy-bank"></i> Savings: ' + e.potentialSavings + '</span>' : '')
        + '  <span class="org-expense-pill apps"><i class="fas fa-cube"></i> ' + e.apps + ' Apps</span>'
        + '  <span class="org-expense-pill licenses"><i class="fas fa-id-badge"></i> ' + e.wastedLicenses + ' Unused Licenses</span>'
        + '</div>'
        + '<div class="org-children" id="children-' + org.id + '">';

    org.teams.forEach(function(team) {
        team.orgId = org.id;
        h += renderTeamNodeTree(team);
    });

    // Add Team button inside org
    h += '<div style="padding:12px 18px"><button onclick="openAddTeamModal(\'' + org.id + '\')" style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:rgba(124,58,237,0.06);color:var(--primary);border:1.5px dashed rgba(124,58,237,0.3);transition:all 0.2s;width:100%"><i class="fas fa-plus-circle"></i> Add Team to ' + org.name.split(' ')[0] + '</button></div>';

    h += '</div></div>';
    return h;
}

function renderTeamNodeTree(team) {
    var e = team.expense;
    var wasteColor = (parseFloat(e.waste) > 3) ? '#DC2626' : (parseFloat(e.waste) > 1) ? '#B45309' : '#047857';

    var h = '<div class="team-node" style="border-left-color:' + team.color + '" id="node-' + team.id + '">'
        + '<div class="team-node-header" onclick="toggleOrgNode(\'' + team.id + '\')">'
        + '  <button class="org-toggle" id="toggle-' + team.id + '"><i class="fas fa-chevron-right"></i></button>'
        + '  <div class="team-node-icon" style="background:' + team.iconBg + ';color:' + team.iconColor + '"><i class="' + team.icon + '"></i></div>'
        + '  <div class="team-node-info">'
        + '    <div class="team-node-name">' + team.name + '</div>'
        + '    <div class="team-node-meta">' + team.people.length + ' people · ' + e.apps + ' apps · ' + e.licenses + ' licenses</div>'
        + '  </div>'
        + '  <div class="team-node-kpis">'
        + '    <div class="team-node-kpi expense"><span class="kv" style="color:#6D28D9">' + e.total + '</span><span class="kl">Spend</span></div>'
        + '    <div class="team-node-kpi waste"><span class="kv" style="color:' + wasteColor + '">' + e.waste + '</span><span class="kl">Waste</span></div>'
        + '    <div class="team-node-kpi"><span class="kv">' + e.apps + '</span><span class="kl">Apps</span></div>'
        + '  </div>'
        + '</div>'
        + '<div class="team-expense-bar">'
        + '  <span class="team-expense-pill spend"><i class="fas fa-dollar-sign"></i> ' + e.total + '</span>'
        + '  <span class="team-expense-pill waste"><i class="fas fa-exclamation-triangle"></i> Waste: ' + e.waste + '</span>'
        + '  <span class="team-expense-pill apps"><i class="fas fa-cube"></i> ' + e.apps + ' Apps</span>'
        + '</div>'
        + '<div class="team-children" id="children-' + team.id + '">';

    // AI tip
    if (team.aiTip) {
        h += '<div class="team-ai-tip"><i class="fas fa-robot"></i><span><strong>AI Insight:</strong> ' + team.aiTip + '</span></div>';
    }

    // People — with prominent expense column
    team.people.forEach(function(p) {
        var initials = p.name.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2);
        var statusLabel = p.status === 'active' ? 'Active' : p.status === 'idle' ? 'Idle' : 'Inactive';
        h += '<div class="person-row">'
            + '  <div class="person-avatar" style="background:' + p.avatar + '">' + initials + '</div>'
            + '  <div class="person-info">'
            + '    <div class="person-name">' + p.name + '</div>'
            + '    <div class="person-role">' + p.role + '</div>'
            + '  </div>'
            + '  <div class="person-stats">'
            + '    <div class="person-stat expense-stat"><span class="pv">' + p.expense + '</span><span class="pl">Expense</span></div>'
            + '    <div class="person-stat"><span class="pv">' + p.apps + '</span><span class="pl">Apps</span></div>'
            + '    <div class="person-stat"><span class="pv">' + p.logins + '</span><span class="pl">Logins/Wk</span></div>'
            + '  </div>'
            + '  <span class="person-status-dot ' + p.status + '">' + statusLabel + '</span>'
            + '</div>';
    });

    // Add Person button inside team
    h += '<div style="padding:10px 14px"><button onclick="openAddPersonModal(\'' + team.orgId + '\',\'' + team.id + '\')" style="display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:rgba(16,185,129,0.06);color:#10B981;border:1.5px dashed rgba(16,185,129,0.3);transition:all 0.2s;width:100%"><i class="fas fa-user-plus"></i> Add Person</button></div>';

    h += '</div></div>';
    return h;
}

/* ---------- Toggle expand/collapse ---------- */
function toggleOrgNode(nodeId) {
    var children = document.getElementById('children-' + nodeId);
    var toggle = document.getElementById('toggle-' + nodeId);
    if (!children || !toggle) return;
    var isOpen = children.classList.contains('open');
    if (isOpen) {
        children.classList.remove('open');
        toggle.classList.remove('open');
    } else {
        children.classList.add('open');
        toggle.classList.add('open');
    }
}

function expandAllOrgNodes() {
    document.querySelectorAll('.org-children, .team-children').forEach(function(el) {
        el.classList.add('open');
    });
    document.querySelectorAll('.org-toggle').forEach(function(el) {
        el.classList.add('open');
    });
}

function collapseAllOrgNodes() {
    document.querySelectorAll('.org-children, .team-children').forEach(function(el) {
        el.classList.remove('open');
    });
    document.querySelectorAll('.org-toggle').forEach(function(el) {
        el.classList.remove('open');
    });
}

/* ---------- Initialize tree when Org Explorer section is shown ---------- */
var _orgTreeRendered = false;

document.addEventListener('click', function() {
    var sec = document.getElementById('sec-org-explorer');
    if (sec && sec.classList.contains('active') && !_orgTreeRendered) {
        _orgTreeRendered = true;
        renderOrgTree();
    }
});

(function() {
    var sec = document.getElementById('sec-org-explorer');
    if (!sec) return;
    var obs = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            if (m.attributeName === 'class' && sec.classList.contains('active') && !_orgTreeRendered) {
                _orgTreeRendered = true;
                renderOrgTree();
            }
        });
    });
    obs.observe(sec, { attributes: true, attributeFilter: ['class'] });
})();

/* ==========================================================
   ONBOARDING: Create Org / Add Team / Add Person
   ========================================================== */

// --- Populate org dropdowns ---
function populateOrgDropdown(selectId) {
    var sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">Select Organization...</option>';
    orgTreeData.forEach(function(org) {
        sel.innerHTML += '<option value="' + org.id + '">' + org.name + '</option>';
    });
}

function populateTeamDropdown(orgSelectId, teamSelectId) {
    var orgSel = document.getElementById(orgSelectId);
    var teamSel = document.getElementById(teamSelectId);
    if (!orgSel || !teamSel) return;
    var orgId = orgSel.value;
    teamSel.innerHTML = '<option value="">Select Team...</option>';
    var org = orgTreeData.find(function(o) { return o.id === orgId; });
    if (!org) return;
    org.teams.forEach(function(t) {
        teamSel.innerHTML += '<option value="' + t.id + '">' + t.name + '</option>';
    });
}

// --- Open Add Org (from Explorer header) ---
function openAddOrgToExplorer() {
    openModal('modal-create-org');
}

// --- Handle Create Org ---
function handleCreateOrg() {
    var nameEl = document.querySelector('#modal-create-org input[type="text"]');
    var name = nameEl ? nameEl.value.trim() : '';
    if (!name) { showToast('error', 'Organization name is required'); return; }

    var allSelects = document.querySelectorAll('#modal-create-org select');
    var planSel = allSelects.length >= 4 ? allSelects[3] : null;
    var plan = planSel ? planSel.options[planSel.selectedIndex].text : 'Business';

    var newOrg = {
        id: 'org-' + Date.now(),
        name: name,
        plan: plan,
        expense: { total: '$0', waste: '$0', potentialSavings: '$0', apps: 0, licenses: 0, wastedLicenses: 0 },
        teams: []
    };
    orgTreeData.push(newOrg);
    _orgTreeRendered = false;
    var sec = document.getElementById('sec-org-explorer');
    if (sec && sec.classList.contains('active')) {
        _orgTreeRendered = true;
        renderOrgTree();
    }
    closeModal('modal-create-org');
    if (nameEl) nameEl.value = '';
    showToast('success', '"' + name + '" organization created! You can now add teams to it.');
}

// --- Open Add Team Modal ---
function openAddTeamModal(preselectedOrgId) {
    populateOrgDropdown('add-team-org');
    if (preselectedOrgId) {
        document.getElementById('add-team-org').value = preselectedOrgId;
    }
    document.getElementById('add-team-name').value = '';
    document.getElementById('add-team-budget').value = '';
    document.getElementById('add-team-apps').value = '';
    document.getElementById('add-team-desc').value = '';
    openModal('modal-add-team');
}

// --- Handle Add Team ---
function handleAddTeam() {
    var orgId = document.getElementById('add-team-org').value;
    var name = document.getElementById('add-team-name').value.trim();
    if (!orgId) { showToast('error', 'Please select an organization'); return; }
    if (!name) { showToast('error', 'Team name is required'); return; }

    var iconSel = document.getElementById('add-team-icon');
    var colorSel = document.getElementById('add-team-color');
    var icon = iconSel.value;
    var color = colorSel.value;
    var budget = document.getElementById('add-team-budget').value.trim() || '$0';
    var apps = parseInt(document.getElementById('add-team-apps').value) || 0;

    var org = orgTreeData.find(function(o) { return o.id === orgId; });
    if (!org) { showToast('error', 'Organization not found'); return; }

    var newTeam = {
        id: 'team-' + Date.now(),
        orgId: orgId,
        name: name,
        icon: icon,
        iconBg: color + '18',
        iconColor: color,
        color: color,
        expense: { total: budget, waste: '$0', apps: apps, licenses: 0, wastedLicenses: 0 },
        aiTip: '',
        people: []
    };
    org.teams.push(newTeam);
    _orgTreeRendered = false;
    var sec = document.getElementById('sec-org-explorer');
    if (sec && sec.classList.contains('active')) {
        _orgTreeRendered = true;
        renderOrgTree();
    }
    closeModal('modal-add-team');
    showToast('success', '"' + name + '" team added to ' + org.name + '!');
}

// --- Open Add Person Modal ---
function openAddPersonModal(preselectedOrgId, preselectedTeamId) {
    populateOrgDropdown('add-person-org');
    if (preselectedOrgId) {
        document.getElementById('add-person-org').value = preselectedOrgId;
        populateTeamDropdown('add-person-org', 'add-person-team');
        if (preselectedTeamId) {
            document.getElementById('add-person-team').value = preselectedTeamId;
        }
    }
    document.getElementById('add-person-name').value = '';
    document.getElementById('add-person-role').value = '';
    document.getElementById('add-person-expense').value = '';
    document.getElementById('add-person-apps').value = '';
    document.getElementById('add-person-email').value = '';
    document.getElementById('add-person-status').value = 'active';
    openModal('modal-add-person');
}

// --- Handle Add Person ---
function handleAddPerson() {
    var orgId = document.getElementById('add-person-org').value;
    var teamId = document.getElementById('add-person-team').value;
    var name = document.getElementById('add-person-name').value.trim();
    var role = document.getElementById('add-person-role').value.trim();
    if (!orgId) { showToast('error', 'Please select an organization'); return; }
    if (!teamId) { showToast('error', 'Please select a team'); return; }
    if (!name) { showToast('error', 'Person name is required'); return; }
    if (!role) { showToast('error', 'Role is required'); return; }

    var expense = document.getElementById('add-person-expense').value.trim() || '$0';
    var apps = parseInt(document.getElementById('add-person-apps').value) || 0;
    var status = document.getElementById('add-person-status').value;

    var org = orgTreeData.find(function(o) { return o.id === orgId; });
    if (!org) { showToast('error', 'Organization not found'); return; }
    var team = org.teams.find(function(t) { return t.id === teamId; });
    if (!team) { showToast('error', 'Team not found'); return; }

    var avatarColors = ['#7C3AED','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899','#6366F1','#14B8A6'];
    var randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    var newPerson = {
        name: name,
        role: role,
        expense: expense,
        apps: apps,
        logins: Math.floor(Math.random() * 20) + 5,
        status: status,
        avatar: randomColor
    };
    team.people.push(newPerson);
    _orgTreeRendered = false;
    var sec = document.getElementById('sec-org-explorer');
    if (sec && sec.classList.contains('active')) {
        _orgTreeRendered = true;
        renderOrgTree();
    }
    closeModal('modal-add-person');
    showToast('success', '"' + name + '" added to ' + team.name + '!');
}

/* ==========================================================
   BULK IMPORT ENGINE
   ========================================================== */

var _bulkImportType = 'people'; // 'people' | 'teams' | 'orgs'
var _bulkParsedData = [];       // parsed rows ready to import

// --- Column definitions per type ---
var BULK_COLUMNS = {
    people: [
        { key: 'name', label: 'Full Name', placeholder: 'Arjun Mehta', type: 'text' },
        { key: 'role', label: 'Role', placeholder: 'Sr. Engineer', type: 'text' },
        { key: 'expense', label: 'Expense', placeholder: '$9,600/yr', type: 'text' },
        { key: 'apps', label: 'Apps', placeholder: '8', type: 'number' },
        { key: 'email', label: 'Email', placeholder: 'arjun@co.com', type: 'email' },
        { key: 'status', label: 'Status', placeholder: 'active', type: 'select', options: ['active','idle','inactive'] }
    ],
    teams: [
        { key: 'name', label: 'Team Name', placeholder: 'Growth Pod', type: 'text' },
        { key: 'icon', label: 'Icon', placeholder: 'fas fa-rocket', type: 'select', options: ['fas fa-rocket','fas fa-layer-group','fas fa-users','fas fa-chart-line','fas fa-brain','fas fa-server','fas fa-mobile-alt','fas fa-headset','fas fa-bullhorn','fas fa-pen-nib','fas fa-database','fas fa-cloud','fas fa-calculator','fas fa-heart','fas fa-flag','fas fa-cog','fas fa-search-dollar','fas fa-lightbulb','fas fa-shield-alt','fas fa-shipping-fast'] },
        { key: 'color', label: 'Color', placeholder: '#7C3AED', type: 'select', options: ['#7C3AED','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899','#A855F7','#6366F1','#F97316','#14B8A6'] },
        { key: 'budget', label: 'Budget', placeholder: '$15,000/yr', type: 'text' },
        { key: 'apps', label: 'Apps', placeholder: '8', type: 'number' }
    ],
    orgs: [
        { key: 'name', label: 'Org Name', placeholder: 'Acme Corp', type: 'text' },
        { key: 'plan', label: 'Plan', placeholder: 'Business', type: 'select', options: ['Starter','Business','Enterprise'] }
    ]
};

var ICON_LABELS = {
    'fas fa-rocket': '🚀 Rocket', 'fas fa-layer-group': '📦 Layers', 'fas fa-users': '👥 People',
    'fas fa-chart-line': '📈 Growth', 'fas fa-brain': '🧠 AI/ML', 'fas fa-server': '🖥 Infra',
    'fas fa-mobile-alt': '📱 Mobile', 'fas fa-headset': '🎧 Support', 'fas fa-bullhorn': '📢 Marketing',
    'fas fa-pen-nib': '✏️ Design', 'fas fa-database': '💾 Data', 'fas fa-cloud': '☁️ Cloud',
    'fas fa-calculator': '🧮 Finance', 'fas fa-heart': '💜 People Ops', 'fas fa-flag': '🏁 GTM',
    'fas fa-cog': '⚙️ Ops', 'fas fa-search-dollar': '🔍 Intel', 'fas fa-lightbulb': '💡 Innovation',
    'fas fa-shield-alt': '🛡 Security', 'fas fa-shipping-fast': '⚡ Velocity'
};

var COLOR_LABELS = {
    '#7C3AED': '💜 Purple', '#3B82F6': '💙 Blue', '#10B981': '💚 Green', '#F59E0B': '🧡 Amber',
    '#EF4444': '❤️ Red', '#EC4899': '💗 Pink', '#A855F7': '🔮 Violet', '#6366F1': '💎 Indigo',
    '#F97316': '🟠 Orange', '#14B8A6': '🩵 Teal'
};

// --- Open the Bulk Import modal ---
function openBulkImportModal() {
    _bulkParsedData = [];
    _bulkImportType = 'people';
    populateOrgDropdown('bulk-target-org');
    document.getElementById('bulk-target-team').innerHTML = '<option value="">Select org first...</option>';
    switchBulkType('people');
    switchBulkTab('csv');
    clearBulkPreview();
    document.getElementById('bulk-paste-area').value = '';
    document.getElementById('bulk-file-input').value = '';
    document.getElementById('bulk-import-btn').disabled = true;
    document.getElementById('bulk-status-text').textContent = '';
    openModal('modal-bulk-import');
}

// --- Switch import type (people/teams/orgs) ---
function switchBulkType(type) {
    _bulkImportType = type;
    _bulkParsedData = [];
    clearBulkPreview();

    document.querySelectorAll('.bulk-type-btn').forEach(function(el) { el.classList.remove('active'); });
    var btn = document.getElementById('bulk-type-' + type);
    if (btn) btn.classList.add('active');

    // Show/hide target selectors
    var targetWrap = document.getElementById('bulk-target-selectors');
    var teamWrap = document.getElementById('bulk-team-selector-wrap');
    if (type === 'people') {
        targetWrap.style.display = 'flex';
        teamWrap.style.display = 'block';
    } else if (type === 'teams') {
        targetWrap.style.display = 'flex';
        teamWrap.style.display = 'none';
    } else {
        targetWrap.style.display = 'none';
    }

    // Rebuild dynamic table headers
    buildDynamicTableHeaders();
    // Reset dynamic rows
    document.getElementById('bulk-dynamic-tbody').innerHTML = '';
    addBulkDynamicRow();
    addBulkDynamicRow();
    addBulkDynamicRow();

    // Update paste placeholder
    var pa = document.getElementById('bulk-paste-area');
    if (type === 'people') {
        pa.placeholder = 'Paste rows here from Google Sheets / Excel...\nEach row = one person, columns separated by Tab or Comma.\n\nExample:\nArjun Mehta, Sr. Engineer, $9,600/yr, 8, arjun@company.com, active\nPriya Sharma, Product Lead, $12,300/yr, 12, priya@company.com, active\nVikram Patel, Designer, $8,400/yr, 6, vikram@company.com, idle';
    } else if (type === 'teams') {
        pa.placeholder = 'Paste rows here...\nEach row = one team.\n\nExample:\nGrowth Pod, fas fa-rocket, #7C3AED, $15K/yr, 8\nPlatform Core, fas fa-server, #3B82F6, $24.6K/yr, 14\nDesign Studio, fas fa-pen-nib, #EC4899, $9K/yr, 5';
    } else {
        pa.placeholder = 'Paste rows here...\nEach row = one organization.\n\nExample:\nAcme Corp, Enterprise\nStartup Labs, Starter\nGlobal Inc, Business';
    }
    pa.value = '';
    document.getElementById('bulk-import-btn').disabled = true;
}

// --- Switch tab (csv/paste/manual) ---
function switchBulkTab(tab) {
    document.querySelectorAll('.bulk-import-tab').forEach(function(el) { el.classList.remove('active'); });
    document.querySelectorAll('.bulk-import-panel').forEach(function(el) { el.classList.remove('active'); });
    var tabEl = document.getElementById('bulk-tab-' + tab);
    var panelEl = document.getElementById('bulk-panel-' + tab);
    if (tabEl) tabEl.classList.add('active');
    if (panelEl) panelEl.classList.add('active');
}

// --- Build dynamic table headers ---
function buildDynamicTableHeaders() {
    var cols = BULK_COLUMNS[_bulkImportType];
    var h = '<tr>';
    cols.forEach(function(c) { h += '<th>' + c.label + '</th>'; });
    h += '<th style="width:36px"></th></tr>';
    document.getElementById('bulk-dynamic-thead').innerHTML = h;
}

// --- Add a row to dynamic table ---
function addBulkDynamicRow() {
    var cols = BULK_COLUMNS[_bulkImportType];
    var tbody = document.getElementById('bulk-dynamic-tbody');
    var rowIdx = tbody.children.length;
    var tr = document.createElement('tr');
    tr.setAttribute('data-row', rowIdx);

    cols.forEach(function(c) {
        var td = document.createElement('td');
        if (c.type === 'select') {
            var sel = document.createElement('select');
            sel.setAttribute('data-key', c.key);
            var opts = c.options;
            opts.forEach(function(o) {
                var opt = document.createElement('option');
                opt.value = o;
                if (c.key === 'icon') opt.textContent = ICON_LABELS[o] || o;
                else if (c.key === 'color') opt.textContent = COLOR_LABELS[o] || o;
                else opt.textContent = o;
                sel.appendChild(opt);
            });
            td.appendChild(sel);
        } else {
            var inp = document.createElement('input');
            inp.type = c.type === 'number' ? 'number' : 'text';
            inp.placeholder = c.placeholder;
            inp.setAttribute('data-key', c.key);
            td.appendChild(inp);
        }
        tr.appendChild(td);
    });

    // Remove button
    var tdRm = document.createElement('td');
    var rmBtn = document.createElement('button');
    rmBtn.className = 'bulk-row-remove';
    rmBtn.innerHTML = '<i class="fas fa-times"></i>';
    rmBtn.onclick = function() { tr.remove(); updateDynamicPreview(); };
    tdRm.appendChild(rmBtn);
    tr.appendChild(tdRm);

    // Auto-update preview on input
    tr.addEventListener('input', function() { updateDynamicPreview(); });
    tr.addEventListener('change', function() { updateDynamicPreview(); });

    tbody.appendChild(tr);
}

// --- Update preview from dynamic form ---
function updateDynamicPreview() {
    var cols = BULK_COLUMNS[_bulkImportType];
    var rows = document.querySelectorAll('#bulk-dynamic-tbody tr');
    var data = [];
    rows.forEach(function(tr) {
        var obj = {};
        var hasValue = false;
        cols.forEach(function(c) {
            var el = tr.querySelector('[data-key="' + c.key + '"]');
            var val = el ? el.value.trim() : '';
            obj[c.key] = val;
            if (val && c.key === 'name') hasValue = true;
        });
        if (hasValue) data.push(obj);
    });
    _bulkParsedData = data;
    renderBulkPreview();
}

// --- Parse pasted text ---
function parseBulkPaste() {
    var raw = document.getElementById('bulk-paste-area').value.trim();
    if (!raw) { showToast('error', 'Nothing to parse — paste some data first'); return; }

    var lines = raw.split(/\n/).filter(function(l) { return l.trim().length > 0; });
    var cols = BULK_COLUMNS[_bulkImportType];
    var data = [];

    lines.forEach(function(line) {
        // Detect separator: tab first, then comma
        var parts = line.indexOf('\t') >= 0 ? line.split('\t') : line.split(',');
        parts = parts.map(function(p) { return p.trim(); });

        var obj = {};
        cols.forEach(function(c, i) {
            obj[c.key] = parts[i] || '';
        });
        if (obj.name) data.push(obj);
    });

    _bulkParsedData = data;
    renderBulkPreview();
    if (data.length > 0) {
        showToast('success', 'Parsed ' + data.length + ' ' + _bulkImportType + ' from clipboard');
    } else {
        showToast('error', 'No valid entries found. Check your format.');
    }
}

// --- Handle CSV file upload ---
function handleBulkFileUpload(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        var text = e.target.result;
        // Simple CSV parse (handles comma and tab)
        var lines = text.split(/\r?\n/).filter(function(l) { return l.trim().length > 0; });

        // Skip header row if it looks like a header
        var firstLine = lines[0].toLowerCase();
        if (firstLine.indexOf('name') >= 0 || firstLine.indexOf('role') >= 0 || firstLine.indexOf('team') >= 0 || firstLine.indexOf('org') >= 0) {
            lines.shift();
        }

        var cols = BULK_COLUMNS[_bulkImportType];
        var data = [];
        lines.forEach(function(line) {
            var parts = line.indexOf('\t') >= 0 ? line.split('\t') : line.split(',');
            parts = parts.map(function(p) { return p.trim().replace(/^["']|["']$/g, ''); });
            var obj = {};
            cols.forEach(function(c, i) { obj[c.key] = parts[i] || ''; });
            if (obj.name) data.push(obj);
        });

        _bulkParsedData = data;
        renderBulkPreview();
        showToast('success', 'Loaded ' + data.length + ' ' + _bulkImportType + ' from ' + file.name);
    };
    reader.readAsText(file);
}

// --- Render preview table ---
function renderBulkPreview() {
    var preview = document.getElementById('bulk-preview');
    var countEl = document.getElementById('bulk-preview-count');
    var thead = document.getElementById('bulk-preview-thead');
    var tbody = document.getElementById('bulk-preview-tbody');
    var importBtn = document.getElementById('bulk-import-btn');
    var statusText = document.getElementById('bulk-status-text');

    if (_bulkParsedData.length === 0) {
        preview.style.display = 'none';
        importBtn.disabled = true;
        statusText.textContent = '';
        return;
    }

    preview.style.display = 'block';
    countEl.textContent = _bulkParsedData.length + ' ' + _bulkImportType + ' ready to import';
    importBtn.disabled = false;
    statusText.textContent = _bulkParsedData.length + ' entries parsed';

    var cols = BULK_COLUMNS[_bulkImportType];
    var h = '<tr>';
    h += '<th>#</th>';
    cols.forEach(function(c) { h += '<th>' + c.label + '</th>'; });
    h += '</tr>';
    thead.innerHTML = h;

    var b = '';
    _bulkParsedData.forEach(function(row, i) {
        b += '<tr><td style="color:var(--gray-400);font-size:11px">' + (i + 1) + '</td>';
        cols.forEach(function(c) {
            var val = row[c.key] || '<span style="color:var(--gray-300)">—</span>';
            if (c.key === 'icon' && ICON_LABELS[val]) val = ICON_LABELS[val];
            if (c.key === 'color' && COLOR_LABELS[val]) val = COLOR_LABELS[val];
            if (c.key === 'status') {
                var sColor = val === 'active' ? '#10B981' : val === 'idle' ? '#F59E0B' : '#EF4444';
                val = '<span style="color:' + sColor + ';font-weight:600">' + val + '</span>';
            }
            b += '<td>' + val + '</td>';
        });
        b += '</tr>';
    });
    tbody.innerHTML = b;
}

function clearBulkPreview() {
    _bulkParsedData = [];
    document.getElementById('bulk-preview').style.display = 'none';
    document.getElementById('bulk-import-btn').disabled = true;
    document.getElementById('bulk-status-text').textContent = '';
    document.getElementById('bulk-preview-thead').innerHTML = '';
    document.getElementById('bulk-preview-tbody').innerHTML = '';
}

// --- Drag & Drop for CSV zone ---
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var zone = document.getElementById('bulk-drop-zone');
        if (!zone) return;
        zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', function() { zone.classList.remove('drag-over'); });
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            zone.classList.remove('drag-over');
            var file = e.dataTransfer.files[0];
            if (file) {
                var input = document.getElementById('bulk-file-input');
                var dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
                handleBulkFileUpload({ target: input });
            }
        });
    });
})();

// --- Execute the bulk import ---
function executeBulkImport() {
    if (_bulkParsedData.length === 0) {
        showToast('error', 'No data to import');
        return;
    }

    var type = _bulkImportType;
    var count = _bulkParsedData.length;
    var avatarColors = ['#7C3AED','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899','#6366F1','#14B8A6'];

    if (type === 'orgs') {
        _bulkParsedData.forEach(function(row) {
            if (!row.name) return;
            var newOrg = {
                id: 'org-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                name: row.name,
                plan: row.plan || 'Business',
                expense: { total: '$0', waste: '$0', potentialSavings: '$0', apps: 0, licenses: 0, wastedLicenses: 0 },
                teams: []
            };
            orgTreeData.push(newOrg);
        });
        refreshOrgTree();
        closeModal('modal-bulk-import');
        showToast('success', count + ' organizations imported! 🎉');
        return;
    }

    if (type === 'teams') {
        var orgId = document.getElementById('bulk-target-org').value;
        if (!orgId) { showToast('error', 'Select a target organization first'); return; }
        var org = orgTreeData.find(function(o) { return o.id === orgId; });
        if (!org) { showToast('error', 'Organization not found'); return; }

        _bulkParsedData.forEach(function(row) {
            if (!row.name) return;
            var color = row.color || '#7C3AED';
            var newTeam = {
                id: 'team-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                orgId: orgId,
                name: row.name,
                icon: row.icon || 'fas fa-users',
                iconBg: color + '18',
                iconColor: color,
                color: color,
                expense: { total: row.budget || '$0', waste: '$0', apps: parseInt(row.apps) || 0, licenses: 0, wastedLicenses: 0 },
                aiTip: '',
                people: []
            };
            org.teams.push(newTeam);
        });
        refreshOrgTree();
        closeModal('modal-bulk-import');
        showToast('success', count + ' teams imported into ' + org.name + '! 🎉');
        return;
    }

    if (type === 'people') {
        var orgId = document.getElementById('bulk-target-org').value;
        var teamId = document.getElementById('bulk-target-team').value;
        if (!orgId) { showToast('error', 'Select a target organization first'); return; }
        if (!teamId) { showToast('error', 'Select a target team first'); return; }
        var org = orgTreeData.find(function(o) { return o.id === orgId; });
        if (!org) { showToast('error', 'Organization not found'); return; }
        var team = org.teams.find(function(t) { return t.id === teamId; });
        if (!team) { showToast('error', 'Team not found'); return; }

        _bulkParsedData.forEach(function(row) {
            if (!row.name) return;
            var newPerson = {
                name: row.name,
                role: row.role || 'Member',
                expense: row.expense || '$0',
                apps: parseInt(row.apps) || 0,
                logins: Math.floor(Math.random() * 20) + 5,
                status: row.status || 'active',
                avatar: avatarColors[Math.floor(Math.random() * avatarColors.length)]
            };
            team.people.push(newPerson);
        });
        refreshOrgTree();
        closeModal('modal-bulk-import');
        showToast('success', count + ' people imported into ' + team.name + '! 🎉');
        return;
    }
}

function refreshOrgTree() {
    _orgTreeRendered = false;
    var sec = document.getElementById('sec-org-explorer');
    if (sec && sec.classList.contains('active')) {
        _orgTreeRendered = true;
        renderOrgTree();
    }
}


/* ============================================
   HELP & SUPPORT WIDGET
   ============================================ */

var _helpWidgetOpen = false;
var _helpChatType = '';
var _helpSelectedSlot = null;

// Agent personas for different chat types
var _helpAgents = {
    support: { name: 'Priya Sharma', role: 'Customer Success Lead', initial: 'P', gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)' },
    demo:    { name: 'Rahul Mehta',  role: 'Solutions Engineer',    initial: 'R', gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
    sales:   { name: 'Aisha Khan',   role: 'Sales Director',        initial: 'A', gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
    issue:   { name: 'Priya Sharma', role: 'Customer Success Lead', initial: 'P', gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }
};

// Chat auto-responses per type
var _helpAutoResponses = {
    support: [
        "Thanks for reaching out! I'm here to help. Could you describe the issue you're facing?",
        "I understand. Let me look into that for you right away.",
        "I've checked our system — here's what I found. Would you like me to walk you through the fix?",
        "Great! Is there anything else I can help you with today?"
    ],
    demo: [
        "Hi! I'd love to show you what SaaSIQ can do. Would you prefer a live walkthrough or should I schedule a dedicated session?",
        "Perfect! Our demos typically run 20-30 minutes. I'll cover spend analytics, org management, and our AI-powered insights.",
        "Let me set that up for you. You'll receive a calendar invite with a Zoom link shortly.",
        "Looking forward to showing you around! Feel free to ask any questions in the meantime."
    ],
    sales: [
        "Hello! Thanks for your interest in SaaSIQ. I'd be happy to discuss how we can help your organization.",
        "We offer flexible plans starting from $499/mo. What's the size of your SaaS portfolio?",
        "Based on what you've shared, our Business plan at $1,999/mo would be ideal. It includes unlimited orgs and priority support.",
        "I can set up a custom proposal for you. Would you like me to send it to your email?"
    ],
    issue: [
        "Sorry to hear you're experiencing an issue! Please describe what happened and I'll escalate this immediately.",
        "Thank you for the details. I've logged this as a priority ticket — our engineering team will investigate.",
        "Your ticket ID is #SIQ-" + (Math.floor(Math.random() * 9000) + 1000) + ". You'll receive updates via email.",
        "Is there anything else I can help with while our team works on the fix?"
    ]
};

function toggleHelpWidget() {
    _helpWidgetOpen = !_helpWidgetOpen;
    var panel = document.getElementById('help-widget-panel');
    var iconEl = document.getElementById('help-trigger-icon');
    var closeEl = document.getElementById('help-trigger-close');
    var badge = document.getElementById('help-trigger-badge');

    if (_helpWidgetOpen) {
        panel.classList.add('open');
        iconEl.style.display = 'none';
        closeEl.style.display = 'flex';
        badge.style.display = 'none';
        var label = document.getElementById('help-trigger-label');
        if (label) label.style.display = 'none';
        // Hide ping rings
        document.querySelectorAll('.help-ping-ring').forEach(function(r) { r.style.display = 'none'; });
    } else {
        panel.classList.remove('open');
        iconEl.style.display = 'flex';
        closeEl.style.display = 'none';
    }
}

function showHelpHome() {
    document.querySelectorAll('.help-view').forEach(function(v) { v.classList.remove('active'); });
    document.getElementById('help-view-home').classList.add('active');
    _helpChatType = '';
    _helpSelectedSlot = null;
}

function openHelpChat(type) {
    _helpChatType = type;
    var agent = _helpAgents[type];

    if (type === 'demo') {
        // Show schedule/booking view
        document.querySelectorAll('.help-view').forEach(function(v) { v.classList.remove('active'); });
        document.getElementById('help-view-schedule').classList.add('active');
        initHelpTimeSlots();
        return;
    }

    // Show chat view
    document.querySelectorAll('.help-view').forEach(function(v) { v.classList.remove('active'); });
    document.getElementById('help-view-chat').classList.add('active');

    // Set agent info
    var avatar = document.getElementById('help-chat-avatar');
    avatar.style.background = agent.gradient;
    avatar.textContent = agent.initial;
    document.getElementById('help-chat-name').textContent = agent.name;
    document.getElementById('help-chat-role').textContent = agent.role;
    document.getElementById('help-typing-name').textContent = agent.name.split(' ')[0];

    // Clear and start conversation
    var msgs = document.getElementById('help-chat-messages');
    msgs.innerHTML = '';
    document.getElementById('help-chat-input').value = '';

    // Send initial greeting after short delay
    setTimeout(function() {
        showHelpTyping();
        setTimeout(function() {
            hideHelpTyping();
            addHelpMessage('agent', _helpAutoResponses[type][0]);
        }, 1200);
    }, 500);
}

var _helpResponseIndex = {};

function addHelpMessage(sender, text) {
    var msgs = document.getElementById('help-chat-messages');
    var now = new Date();
    var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    var div = document.createElement('div');
    div.className = 'help-msg ' + sender;
    div.innerHTML = text + '<div class="help-msg-time">' + timeStr + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function showHelpTyping() {
    document.getElementById('help-chat-typing').style.display = 'flex';
    var msgs = document.getElementById('help-chat-messages');
    msgs.scrollTop = msgs.scrollHeight;
}

function hideHelpTyping() {
    document.getElementById('help-chat-typing').style.display = 'none';
}

function sendHelpMessage() {
    var input = document.getElementById('help-chat-input');
    var text = input.value.trim();
    if (!text) return;

    addHelpMessage('user', text);
    input.value = '';

    if (!_helpResponseIndex[_helpChatType]) _helpResponseIndex[_helpChatType] = 1;
    var responses = _helpAutoResponses[_helpChatType];
    var idx = _helpResponseIndex[_helpChatType];

    if (idx < responses.length) {
        setTimeout(function() {
            showHelpTyping();
            var delay = 1000 + Math.random() * 1500;
            setTimeout(function() {
                hideHelpTyping();
                addHelpMessage('agent', responses[idx]);
                _helpResponseIndex[_helpChatType] = idx + 1;
            }, delay);
        }, 400);
    } else {
        // Loop back with a generic friendly response
        setTimeout(function() {
            showHelpTyping();
            setTimeout(function() {
                hideHelpTyping();
                var agent = _helpAgents[_helpChatType];
                var generics = [
                    "Of course! Let me help you with that.",
                    "Great question — let me check on that for you.",
                    "Sure thing! Give me just a moment.",
                    "I appreciate you sharing that. Let me look into it.",
                    "Absolutely, I'll have an update for you shortly."
                ];
                addHelpMessage('agent', generics[Math.floor(Math.random() * generics.length)]);
            }, 1200);
        }, 400);
    }
}

// ===== Schedule / Book Demo Functions =====

function initHelpTimeSlots() {
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    document.getElementById('help-slot-today-date').textContent = months[today.getMonth()] + ' ' + today.getDate();
    document.getElementById('help-slot-tomorrow-date').textContent = months[tomorrow.getMonth()] + ' ' + tomorrow.getDate();

    // Generate time slots
    var currentHour = today.getHours();
    var todaySlots = generateTimeSlots(currentHour + 1);
    var tomorrowSlots = generateTimeSlots(9);

    renderTimeSlots('help-slot-times-today', todaySlots, months[today.getMonth()] + ' ' + today.getDate());
    renderTimeSlots('help-slot-times-tomorrow', tomorrowSlots, months[tomorrow.getMonth()] + ' ' + tomorrow.getDate());

    // Reset form
    document.getElementById('help-schedule-form').style.display = 'none';
    document.getElementById('help-schedule-success').style.display = 'none';
    _helpSelectedSlot = null;
}

function generateTimeSlots(startHour) {
    var slots = [];
    for (var h = Math.max(startHour, 9); h <= 19; h++) {
        if (slots.length >= 6) break;
        var period = h >= 12 ? 'PM' : 'AM';
        var displayHour = h > 12 ? h - 12 : h;
        slots.push({ time: displayHour + ':00 ' + period, hour: h, available: Math.random() > 0.2 });
        if (slots.length < 6 && h < 19) {
            slots.push({ time: displayHour + ':30 ' + period, hour: h + 0.5, available: Math.random() > 0.3 });
        }
    }
    return slots;
}

function renderTimeSlots(containerId, slots, dateLabel) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';
    if (slots.length === 0) {
        container.innerHTML = '<span style="font-size:12px; color:var(--gray-400);">No slots available today</span>';
        return;
    }
    slots.forEach(function(slot) {
        var btn = document.createElement('button');
        btn.className = 'help-time-btn' + (slot.available ? '' : ' unavailable');
        btn.textContent = slot.time;
        if (slot.available) {
            btn.onclick = function() { selectHelpTimeSlot(btn, slot.time, dateLabel); };
        }
        container.appendChild(btn);
    });
}

function selectHelpTimeSlot(btn, time, dateLabel) {
    // Deselect previous
    document.querySelectorAll('.help-time-btn.selected').forEach(function(b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    _helpSelectedSlot = { time: time, date: dateLabel };

    // Show form
    document.getElementById('help-schedule-selected-time').textContent = time;
    document.getElementById('help-schedule-selected-date').textContent = dateLabel;
    document.getElementById('help-schedule-form').style.display = 'block';
    document.getElementById('help-schedule-success').style.display = 'none';

    // Scroll to form
    var body = document.querySelector('.help-schedule-body');
    setTimeout(function() { body.scrollTop = body.scrollHeight; }, 100);
}

function confirmDemoBooking() {
    var name = document.getElementById('help-schedule-name').value.trim();
    var email = document.getElementById('help-schedule-email').value.trim();

    if (!name || !email) {
        showToast('Please fill in your name and email', 'warning');
        return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address', 'warning');
        return;
    }

    // Show success
    document.getElementById('help-schedule-form').style.display = 'none';
    document.getElementById('help-schedule-success').style.display = 'block';
    document.getElementById('help-success-detail').textContent =
        _helpSelectedSlot.time + ' on ' + _helpSelectedSlot.date + ' · Calendar invite sent to ' + email;

    // Clear form for next time
    document.getElementById('help-schedule-name').value = '';
    document.getElementById('help-schedule-email').value = '';
    document.getElementById('help-schedule-company').value = '';

    showToast('Demo booked successfully! 🎉', 'success');
}

// Auto-show hint after 1 second on landing page
setTimeout(function() {
    var trigger = document.getElementById('help-widget-trigger');
    if (trigger && !_helpWidgetOpen) {
        trigger.setAttribute('data-tooltip', 'Need help? We\'re online!');
    }
}, 2000);
