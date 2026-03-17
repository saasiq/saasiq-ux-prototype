/* ========================================
  SaaSIQ Interactive Prototype JS
  ======================================== */

/* ========= FEATURE FLAGS ========= */
const SaaSIQFlags = {
  _flags: {
    partnerships: { enabled: true, label: 'Partnership & Barter Intelligence', description: 'Track service-exchange deals, barter ROI, and non-monetary SaaS procurement' },
    'employee-lifecycle': { enabled: true, label: 'Employee Lifecycle Orchestration', description: 'Automated employee onboarding/offboarding with HRIS integration, workflow templates, and audit trails' },
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

/* ========= APP STATE NAMESPACE ========= */
var SaaSIQ = window.SaaSIQ || {};
SaaSIQ.state = {
  intgContext: null,  // set in _readCardMeta()
  bulkImportType: 'people',
  bulkParsedData: [],
  helpWidgetOpen: false,
  helpChatType: '',
  helpSelectedSlot: null
};

// ========= ACCESSIBILITY ENHANCEMENTS =========
document.addEventListener('DOMContentLoaded', function() {
  // Add scope="col" to all table headers for screen readers
  document.querySelectorAll('thead th').forEach(function(th) {
    if (!th.getAttribute('scope')) th.setAttribute('scope', 'col');
  });
  // Add aria-label to icon-only buttons missing it
  document.querySelectorAll('button').forEach(function(btn) {
    if (!btn.getAttribute('aria-label') && !btn.textContent.trim() && btn.querySelector('i')) {
      var icon = btn.querySelector('i');
      var cls = icon.className || '';
      if (cls.indexOf('fa-times') > -1) btn.setAttribute('aria-label', 'Close');
      else if (cls.indexOf('fa-trash') > -1) btn.setAttribute('aria-label', 'Delete');
      else if (cls.indexOf('fa-edit') > -1) btn.setAttribute('aria-label', 'Edit');
      else if (cls.indexOf('fa-ellipsis') > -1) btn.setAttribute('aria-label', 'More options');
      else if (cls.indexOf('fa-cog') > -1) btn.setAttribute('aria-label', 'Settings');
      else if (cls.indexOf('fa-bell') > -1) btn.setAttribute('aria-label', 'Notifications');
      else if (cls.indexOf('fa-search') > -1) btn.setAttribute('aria-label', 'Search');
      else btn.setAttribute('aria-label', 'Action button');
    }
  });
  // Add aria-label to modal close buttons
  document.querySelectorAll('.close-btn').forEach(function(btn) {
    if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', 'Close dialog');
  });
});

// Auth state tracks whether user has "logged in" via the login/signup form
var _saasiqAuthenticated = false;

// Page Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
    window.location.hash = pageId.replace('page-', '');
  }
  // Mark authenticated when entering dashboard
  if (pageId === 'page-dashboard') _saasiqAuthenticated = true;
}

// Navigate to a dashboard section from a landing page card
// If the user hasn't logged in yet, shows a toast and redirects to login
function navigateToSection(el) {
  var sectionId = el.getAttribute('data-section');
  if (!sectionId) return;

  // Ripple animation
  el.classList.add('card-clicked');
  setTimeout(function() { el.classList.remove('card-clicked'); }, 600);

  if (!_saasiqAuthenticated) {
    // Show auth-gate notification
    showAuthGateToast(sectionId);
    return;
  }

  // Authenticated navigate to dashboard section
  showPage('page-dashboard');
  showDashSectionDirect(sectionId);
}

// Auth-gate toast with login/signup CTA
function showAuthGateToast(sectionId) {
  var container = document.getElementById('toast-container');
  if (!container) return;

  // Remove any existing auth-gate toast to avoid stacking
  var existing = container.querySelector('.toast-auth-gate');
  if (existing) existing.remove();

  var sectionLabels = {
    'discovery': 'SaaS Portfolio', 'spend': 'Financial Intelligence',
    'usage': 'SaaS Portfolio', 'compliance': 'Risk & Governance',
    'contracts': 'Contracts & Renewals', 'policies': 'Risk & Governance',
    'ai-insights': 'AI Insights', 'ai-copilot': 'AI Copilot',
    'employee-onboarding': 'Onboarding', 'offboarding': 'Offboarding',
    'lifecycle-analytics': 'Employee Lifecycle', 'approval-workflows': 'Approval Workflows',
    'renewals': 'Contracts & Renewals', 'benchmarks': 'Financial Intelligence',
    'alerts': 'Command Center', 'self-service-portal': 'Self-Service Portal',
    'dept-costs': 'Financial Intelligence', 'dashboard-home': 'Command Center',
    'settings': 'Settings & Integrations'
  };
  var label = sectionLabels[sectionId] || 'this feature';

  var toast = document.createElement('div');
  toast.className = 'toast warning toast-auth-gate';
  toast.innerHTML = '<div class="toast-auth-content">'
    + '<i class="fas fa-lock"></i>'
    + '<div class="toast-auth-text">'
    + '<strong>Sign in to access ' + label + '</strong>'
    + '<span>Create a free account or log in to explore the full dashboard.</span>'
    + '</div>'
    + '<div class="toast-auth-actions">'
    + '<button onclick="this.closest(\'.toast\').remove();showPage(\'page-login\')" class="toast-auth-btn toast-auth-login">Log In</button>'
    + '<button onclick="this.closest(\'.toast\').remove();showPage(\'page-signup\')" class="toast-auth-btn toast-auth-signup">Sign Up Free</button>'
    + '</div>'
    + '<button class="toast-dismiss" onclick="this.parentNode.parentNode.remove()" aria-label="Dismiss"><i class="fas fa-times"></i></button>'
    + '</div>';
  container.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 8000);
}

// Forgot Password modal
function openForgotPassword() {
  var emailVal = document.getElementById('login-email') ? document.getElementById('login-email').value : '';
  _openLifecycleModal(
    'Reset Your Password', '#3B82F6', 'fas fa-unlock-alt',
    '<div style="text-align:center;padding:8px 0 16px">'
    + '<p style="color:#6B7280;margin-bottom:20px">Enter your work email and we\'ll send you a secure reset link.</p>'
    + '<input id="reset-email-input" type="email" placeholder="you@company.com" value="' + emailVal + '" required '
    + 'style="width:100%;padding:12px 16px;border:1px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;transition:border .2s" '
    + 'onfocus="this.style.borderColor=\'#3B82F6\'" onblur="this.style.borderColor=\'#D1D5DB\'">'
    + '</div>',
    function() {
      var email = document.getElementById('reset-email-input').value.trim();
      if (!email || !email.includes('@')) { showToast('error', 'Please enter a valid email address'); return; }
      var btn = document.querySelector('.lifecycle-modal-confirm');
      if (btn) { btn.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Sending...'; btn.disabled = true; }
      setTimeout(function() {
        _closeLifecycleModal();
        showToast('success', 'Password reset link sent to ' + email + '. Check your inbox!');
      }, 1500);
    },
    '<i class="fas fa-paper-plane"></i> Send Reset Link',
    '#3B82F6'
  );
}

// Contact Sales modal
function openContactSales() {
  _openLifecycleModal(
    'Contact Our Sales Team', '#7C3AED', 'fas fa-headset',
    '<div style="padding:4px 0">'
    + '<div style="display:grid;gap:12px">'
    + ' <div><label style="font-size:12px;font-weight:600;color:#6B7280;margin-bottom:4px;display:block">Full Name</label>'
    + ' <input id="sales-name" type="text" placeholder="Your name" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:14px;outline:none" required></div>'
    + ' <div><label style="font-size:12px;font-weight:600;color:#6B7280;margin-bottom:4px;display:block">Work Email</label>'
    + ' <input id="sales-email" type="email" placeholder="you@company.com" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:14px;outline:none" required></div>'
    + ' <div><label style="font-size:12px;font-weight:600;color:#6B7280;margin-bottom:4px;display:block">Company Size</label>'
    + ' <select id="sales-size" style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:14px;color:#374151;outline:none">'
    + '  <option value="">Select size</option><option>1-50</option><option>51-200</option><option>201-1000</option><option>1001-5000</option><option>5000+</option>'
    + ' </select></div>'
    + ' <div><label style="font-size:12px;font-weight:600;color:#6B7280;margin-bottom:4px;display:block">Message (optional)</label>'
    + ' <textarea id="sales-message" rows="3" placeholder="Tell us about your SaaS management needs..." style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:14px;outline:none;resize:vertical;font-family:inherit"></textarea></div>'
    + '</div></div>',
    function() {
      var name = document.getElementById('sales-name').value.trim();
      var email = document.getElementById('sales-email').value.trim();
      if (!name || !email || !email.includes('@')) { showToast('error', 'Please fill in your name and work email'); return; }
      var btn = document.querySelector('.lifecycle-modal-confirm');
      if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; btn.disabled = true; }
      setTimeout(function() {
        _closeLifecycleModal();
        showToast('success', 'Thanks ' + name + '! Our sales team will reach out to ' + email + ' within 24 hours.');
      }, 1500);
    },
    '<i class="fas fa-paper-plane"></i> Send Request',
    '#7C3AED'
  );
}

// Hash-based routing allows direct URL access like #dashboard, #landing, #login
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

// ========= CONSOLIDATED DASHBOARD VIEWS =========
// Maps consolidated view IDs to their sub-sections and tab labels
var consolidatedViews = {
  'command-center': {
    label: 'Command Center',
    defaultSection: 'dashboard-home',
    tabs: [
      { id: 'dashboard-home', label: 'Dashboard', icon: 'fas fa-home' },
      { id: 'alerts', label: 'Alerts', icon: 'fas fa-bell', badge: '3', badgeColor: '#EF4444' },
      { id: 'ai-insights', label: 'AI Insights', icon: 'fas fa-robot', badge: '8', badgeColor: '#7C3AED' }
    ]
  },
  'portfolio': {
    label: 'SaaS Portfolio',
    defaultSection: 'discovery',
    tabs: [
      { id: 'discovery', label: 'Discovery & Shadow IT', icon: 'fas fa-search' },
      { id: 'usage', label: 'Usage Analytics', icon: 'fas fa-chart-bar' }
    ]
  },
  'financial': {
    label: 'Financial Intelligence',
    defaultSection: 'spend',
    tabs: [
      { id: 'spend', label: 'Spend Analysis', icon: 'fas fa-dollar-sign' },
      { id: 'dept-costs', label: 'Department Costs', icon: 'fas fa-building' },
      { id: 'benchmarks', label: 'Benchmarks', icon: 'fas fa-balance-scale' }
    ]
  },
  'governance': {
    label: 'Risk & Governance',
    defaultSection: 'compliance',
    tabs: [
      { id: 'compliance', label: 'Compliance & Risk', icon: 'fas fa-shield-alt' },
      { id: 'policies', label: 'Policy Engine', icon: 'fas fa-gavel' }
    ]
  },
  'contracts-renewals': {
    label: 'Contracts & Renewals',
    defaultSection: 'contracts',
    tabs: [
      { id: 'contracts', label: 'Contracts', icon: 'fas fa-file-contract' },
      { id: 'renewals', label: 'Smart Renewals', icon: 'fas fa-calendar-check', badge: '6', badgeColor: '#F59E0B' }
    ]
  }
};

// Reverse mapping: section ID → consolidated view ID
var sectionToView = {};
Object.keys(consolidatedViews).forEach(function(viewId) {
  consolidatedViews[viewId].tabs.forEach(function(tab) {
    sectionToView[tab.id] = viewId;
  });
});

// Current active consolidated view
var _activeConsolidatedView = 'command-center';

// Render the consolidated tab bar for a given view
function renderConsolidatedTabs(viewId, activeSectionId) {
  var tabBar = document.getElementById('consolidated-tabs');
  if (!tabBar) return;
  var view = consolidatedViews[viewId];
  if (!view) {
    tabBar.classList.remove('visible');
    tabBar.innerHTML = '';
    return;
  }
  var html = '';
  view.tabs.forEach(function(tab, idx) {
    var isActive = tab.id === activeSectionId;
    var badgeHtml = tab.badge ? '<span class="tab-badge">' + tab.badge + '</span>' : '';
    html += '<button class="consolidated-tab' + (isActive ? ' active' : '') + '" onclick="switchConsolidatedTab(\'' + viewId + '\', \'' + tab.id + '\')">';
    html += '<i class="' + tab.icon + '"></i> ' + tab.label + badgeHtml;
    html += '</button>';
    if (idx < view.tabs.length - 1) {
      html += '<div class="tab-separator"></div>';
    }
  });
  tabBar.innerHTML = html;
  tabBar.classList.add('visible');
}

// Switch tab within a consolidated view (called by tab clicks)
function switchConsolidatedTab(viewId, sectionId) {
  // Hide all sections, show target
  document.querySelectorAll('.dash-section').forEach(function(s) { s.classList.remove('active'); });
  var target = document.getElementById('sec-' + sectionId);
  if (target) {
    target.classList.add('active');
    var mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTo(0, 0);
  }
  // Re-render tabs to update active state
  renderConsolidatedTabs(viewId, sectionId);
  // Update document title
  var view = consolidatedViews[viewId];
  var tabLabel = '';
  if (view) {
    view.tabs.forEach(function(t) { if (t.id === sectionId) tabLabel = t.label; });
  }
  document.title = (tabLabel || 'Dashboard') + ' SaaSIQ';
}

// Show a consolidated view (called by sidebar clicks)
function showConsolidatedView(viewId, event) {
  var view = consolidatedViews[viewId];
  if (!view) return;
  _activeConsolidatedView = viewId;

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(function(item) { item.classList.remove('active'); });
  if (event && event.currentTarget) event.currentTarget.classList.add('active');

  // Show default section
  document.querySelectorAll('.dash-section').forEach(function(s) { s.classList.remove('active'); });
  var target = document.getElementById('sec-' + view.defaultSection);
  if (target) {
    target.classList.add('active');
    var mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTo(0, 0);
  }

  // Render tab bar
  renderConsolidatedTabs(viewId, view.defaultSection);

  // Update title
  document.title = view.label + ' SaaSIQ';
}

// Dashboard Section Navigation
function showDashSection(sectionId, event) {
  // Feature flag guard prevent accessing disabled sections
  var flaggedSections = {
    'employee-onboarding': 'employee-lifecycle',
    'hardware-assets': 'employee-lifecycle',
    'training-compliance': 'employee-lifecycle',
    'lifecycle-analytics': 'employee-lifecycle',
    'contractors': 'employee-lifecycle',
    'approval-workflows': 'employee-lifecycle',
    'self-service-portal': 'employee-lifecycle',
    'partnerships': 'partnerships'
  };
  if (flaggedSections[sectionId] && !SaaSIQFlags.isEnabled(flaggedSections[sectionId])) {
    showToast('warning', 'This feature is not enabled. Go to Settings → Feature Flags to activate it.');
    return;
  }

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (event && event.currentTarget) event.currentTarget.classList.add('active');

  // Auto-expand collapsible group if the clicked nav-item lives inside one
  if (event && event.currentTarget) {
    var group = event.currentTarget.closest('.nav-group');
    if (group && group.classList.contains('nav-group--collapsed')) {
      group.classList.remove('nav-group--collapsed');
      var toggle = group.previousElementSibling;
      if (toggle && toggle.classList.contains('nav-label--toggle')) toggle.classList.add('expanded');
    }
  }

  // Hide all sections, then show target
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('sec-' + sectionId);
  if (target) {
    target.classList.add('active');
    // Scroll main content to top
    var mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTo(0, 0);
  }

  // Update consolidated tab bar if this section belongs to a view
  var viewId = sectionToView[sectionId];
  if (viewId) {
    _activeConsolidatedView = viewId;
    renderConsolidatedTabs(viewId, sectionId);
  } else {
    // Hide tab bar for standalone sections
    var tabBar = document.getElementById('consolidated-tabs');
    if (tabBar) { tabBar.classList.remove('visible'); tabBar.innerHTML = ''; }
  }

  // Update document title for context
  var sectionNames = {
    'dashboard-home': 'Command Center', 'overview': 'Dashboard', 'apps': 'App Inventory',
    'discovery': 'SaaS Portfolio Discovery', 'usage': 'SaaS Portfolio Usage',
    'contracts': 'Contracts & Renewals', 'spend': 'Financial Intelligence Spend',
    'optimization': 'Optimization', 'compliance': 'Risk & Governance',
    'policies': 'Risk & Governance Policies', 'ai-insights': 'Command Center AI Insights',
    'ai-copilot': 'AI Copilot', 'employee-onboarding': 'Onboarding', 'offboarding': 'Offboarding',
    'hardware-assets': 'Hardware & Assets', 'training-compliance': 'Training & Docs',
    'lifecycle-analytics': 'Lifecycle Analytics', 'contractors': 'Contractors',
    'approval-workflows': 'Approvals', 'self-service-portal': 'Self-Service Portal',
    'renewals': 'Contracts & Renewals Smart Renewals', 'benchmarks': 'Financial Intelligence Benchmarks',
    'dept-costs': 'Financial Intelligence Dept Costs',
    'org-explorer': 'Org Explorer', 'partnerships': 'Partnerships',
    'alerts': 'Command Center Alerts', 'settings': 'Settings'
  };
  document.title = (sectionNames[sectionId] || 'Dashboard') + ' SaaSIQ';
}

// Toggle collapsible nav group (accordion)
function toggleNavGroup(labelEl) {
  var group = labelEl.nextElementSibling;
  if (!group) return;
  labelEl.classList.toggle('expanded');
  group.classList.toggle('nav-group--collapsed');
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

  // Update sidebar highlight the consolidated view's nav item if applicable
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  var viewId = sectionToView[sectionId];
  if (viewId) {
    // This section belongs to a consolidated view highlight the view's sidebar item
    _activeConsolidatedView = viewId;
    renderConsolidatedTabs(viewId, sectionId);
    // Find sidebar item that triggers this consolidated view
    document.querySelectorAll('.nav-item').forEach(item => {
      var onclick = item.getAttribute('onclick') || '';
      if (onclick.indexOf("'" + viewId + "'") > -1) {
        item.classList.add('active');
      }
    });
  } else {
    // Standalone section hide consolidated tabs, highlight matching nav item
    var tabBar = document.getElementById('consolidated-tabs');
    if (tabBar) { tabBar.classList.remove('visible'); tabBar.innerHTML = ''; }
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('onclick') && item.getAttribute('onclick').indexOf("'" + sectionId + "'") > -1) {
        item.classList.add('active');
      }
    });
  }
}

/**
 * Snooze an alert fades it out with a "snoozed" state
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
    + ' <h3 style="font-size:18px;font-weight:700;color:#111827;margin:0 0 6px"><i class="fas fa-clock" style="color:#7C3AED;margin-right:8px"></i>Snooze Alert</h3>'
    + ' <p style="font-size:13px;color:#6B7280;margin:0 0 20px">Choose how long to snooze this notification:</p>'
    + ' <div style="display:flex;flex-direction:column;gap:8px">'
    + '  <button class="snooze-opt" onclick="executeSnooze(this,\'1 hour\')" style="padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;text-align:left;transition:all 0.15s" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'#F5F3FF\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'"><i class="fas fa-clock" style="color:#7C3AED;margin-right:10px;width:16px"></i>1 hour</button>'
    + '  <button class="snooze-opt" onclick="executeSnooze(this,\'4 hours\')" style="padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;text-align:left;transition:all 0.15s" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'#F5F3FF\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'"><i class="fas fa-clock" style="color:#7C3AED;margin-right:10px;width:16px"></i>4 hours</button>'
    + '  <button class="snooze-opt" onclick="executeSnooze(this,\'1 day\')" style="padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;text-align:left;transition:all 0.15s" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'#F5F3FF\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'"><i class="fas fa-calendar-day" style="color:#7C3AED;margin-right:10px;width:16px"></i>1 day</button>'
    + '  <button class="snooze-opt" onclick="executeSnooze(this,\'1 week\')" style="padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;text-align:left;transition:all 0.15s" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'#F5F3FF\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'"><i class="fas fa-calendar-week" style="color:#7C3AED;margin-right:10px;width:16px"></i>1 week</button>'
    + ' </div>'
    + ' <button onclick="document.getElementById(\'snooze-picker\').remove()" style="margin-top:16px;width:100%;padding:10px;border-radius:10px;border:none;background:#F3F4F6;color:#6B7280;font-size:13px;font-weight:600;cursor:pointer">Cancel</button>'
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

// Close modals with Escape key closes topmost only
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
  { q: /renew|contract|expir/i, a: 'You have <strong>4 contracts renewing in the next 30 days</strong>:<br>• Salesforce Enterprise Mar 12 ($420K/yr, auto-renew ON)<br>• GitHub Enterprise Mar 28 ($185K/yr)<br>• Zoom Business Apr 1 ($96K/yr)<br>• Figma Org Apr 15 ($54K/yr)<br>AI recommends negotiating Salesforce down by 34%.' },
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
// APPEARANCE ENGINE Theme, Accent Color, Density
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

// ========== OFFBOARDING CONSOLE INTERACTIVE ACTIONS ==========

/**
 * Sync HR Data simulates HRMS sync with progress
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
    showToast('info', 'Fetching employee records 248 found');
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
    showToast('success', 'HR Sync complete 2 new departures detected, 1 updated');
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
 * Offboard Employee opens a mock wizard modal
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
    + ' <div style="padding:24px 28px;border-bottom:1px solid #E5E7EB">'
    + '  <div style="display:flex;justify-content:space-between;align-items:center">'
    + '   <h2 style="font-size:20px;font-weight:800;color:#111827;display:flex;align-items:center;gap:10px;margin:0"><span style="display:inline-flex;width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;align-items:center;justify-content:center;font-size:14px"><i class="fas fa-user-minus"></i></span> Offboard Employee</h2>'
    + '   <button onclick="document.getElementById(\'offboard-wizard-modal\').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#6B7280;padding:4px"><i class="fas fa-times"></i></button>'
    + '  </div>'
    + ' </div>'
    + ' <div style="padding:24px 28px">'
    + '  <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Search Employee</label>'
    + '  <input type="text" placeholder="Start typing name or email…" style="width:100%;padding:12px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;transition:border 0.2s" onfocus="this.style.borderColor=\'#7C3AED\'" onblur="this.style.borderColor=\'#D1D5DB\'">'
    + '  <div style="margin-top:20px">'
    + '   <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Departure Date</label>'
    + '   <input type="date" style="width:100%;padding:12px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box" value="2026-03-07">'
    + '  </div>'
    + '  <div style="margin-top:20px">'
    + '   <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Revocation Scope</label>'
    + '   <div style="display:flex;flex-direction:column;gap:10px">'
    + '    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:#374151"><input type="radio" name="revoke-scope" value="all" checked style="accent-color:#7C3AED"> Revoke all SaaS access immediately</label>'
    + '    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:#374151"><input type="radio" name="revoke-scope" value="selective" style="accent-color:#7C3AED"> Selective choose apps to revoke</label>'
    + '    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:#374151"><input type="radio" name="revoke-scope" value="scheduled" style="accent-color:#7C3AED"> Schedule revocation for departure date</label>'
    + '   </div>'
    + '  </div>'
    + '  <div style="margin-top:20px">'
    + '   <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:#374151"><input type="checkbox" checked style="accent-color:#7C3AED"> Notify IT admin when complete</label>'
    + '   <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:#374151;margin-top:8px"><input type="checkbox" checked style="accent-color:#7C3AED"> Transfer data to manager</label>'
    + '  </div>'
    + ' </div>'
    + ' <div style="padding:16px 28px;border-top:1px solid #E5E7EB;display:flex;justify-content:flex-end;gap:10px;background:#F9FAFB">'
    + '  <button onclick="document.getElementById(\'offboard-wizard-modal\').remove()" style="padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #D1D5DB;color:#374151">Cancel</button>'
    + '  <button onclick="executeOffboard()" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;border:none;box-shadow:0 2px 10px rgba(124,58,237,0.3)"><i class="fas fa-user-minus"></i> Offboard Now</button>'
    + ' </div>'
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
  showToast('success', 'Offboarding initiated all SaaS access will be revoked and data transferred.');
}

/**
 * Revoke All Pending bulk revoke with animated row removal
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
 * Revoke single employee row animates that row + updates count
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
// EMPLOYEE ONBOARDING ORCHESTRATION INTERACTIVE ACTIONS
// ========================================================================

/**
 * Sync HRIS simulates BambooHR / Workday sync
 */
function syncOnboardingHR(btn) {
  if (btn.disabled) return;
  var origHTML = btn.innerHTML;
  btn.disabled = true;
  btn.style.opacity = '0.7';
  btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Syncing…';
  showToast('info', 'Connecting to BambooHR…');

  setTimeout(function() { showToast('info', 'Fetching new hire records 248 employees scanned'); }, 1200);
  setTimeout(function() { showToast('info', 'Cross-referencing with existing SaaS accounts…'); }, 2400);
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Synced ✓';
    btn.style.opacity = '1';
    btn.style.background = '#ECFDF5';
    btn.style.color = '#059669';
    btn.style.borderColor = '#059669';
    showToast('success', 'HRIS sync complete 1 new hire detected for next week, workflows auto-assigned');
    setTimeout(function() {
      btn.innerHTML = origHTML;
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 3000);
  }, 3600);
}

/**
 * Open Onboard Employee wizard modal
 */
function openOnboardWizard() {
  var existing = document.getElementById('onboard-wizard-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'onboard-wizard-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';

  overlay.innerHTML = ''
    + '<div style="background:#fff;border-radius:16px;width:95%;max-width:560px;box-shadow:0 20px 60px rgba(0,0,0,0.2);overflow:hidden;max-height:90vh;overflow-y:auto">'
    + ' <div style="padding:24px 28px;border-bottom:1px solid #E5E7EB">'
    + '  <div style="display:flex;justify-content:space-between;align-items:center">'
    + '   <h2 style="font-size:20px;font-weight:800;color:#111827;display:flex;align-items:center;gap:10px;margin:0"><span style="display:inline-flex;width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#10B981,#059669);color:#fff;align-items:center;justify-content:center;font-size:14px"><i class="fas fa-user-plus"></i></span> Onboard New Employee</h2>'
    + '   <button onclick="document.getElementById(\'onboard-wizard-modal\').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#6B7280;padding:4px"><i class="fas fa-times"></i></button>'
    + '  </div>'
    + ' </div>'
    + ' <div style="padding:24px 28px">'
    + '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'
    + '   <div>'
    + '    <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Full Name *</label>'
    + '    <input type="text" placeholder="e.g., Rahul Sharma" style="width:100%;padding:10px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor=\'#10B981\'" onblur="this.style.borderColor=\'#D1D5DB\'">'
    + '   </div>'
    + '   <div>'
    + '    <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Email *</label>'
    + '    <input type="email" placeholder="rahul@company.com" style="width:100%;padding:10px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor=\'#10B981\'" onblur="this.style.borderColor=\'#D1D5DB\'">'
    + '   </div>'
    + '  </div>'
    + '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">'
    + '   <div>'
    + '    <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Department *</label>'
    + '    <select style="width:100%;padding:10px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box;background:#fff;cursor:pointer">'
    + '     <option value="">Select department</option>'
    + '     <option value="engineering">Engineering</option>'
    + '     <option value="sales">Sales & Marketing</option>'
    + '     <option value="design">Design & Product</option>'
    + '     <option value="finance">Finance & Ops</option>'
    + '     <option value="hr">HR & People</option>'
    + '    </select>'
    + '   </div>'
    + '   <div>'
    + '    <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Job Title *</label>'
    + '    <input type="text" placeholder="e.g., Sr. Frontend Engineer" style="width:100%;padding:10px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor=\'#10B981\'" onblur="this.style.borderColor=\'#D1D5DB\'">'
    + '   </div>'
    + '  </div>'
    + '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">'
    + '   <div>'
    + '    <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Start Date *</label>'
    + '    <input type="date" value="2026-03-20" style="width:100%;padding:10px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box">'
    + '   </div>'
    + '   <div>'
    + '    <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Reporting Manager</label>'
    + '    <input type="text" placeholder="Manager name" style="width:100%;padding:10px 14px;border:1.5px solid #D1D5DB;border-radius:10px;font-size:14px;outline:none;box-sizing:border-box" onfocus="this.style.borderColor=\'#10B981\'" onblur="this.style.borderColor=\'#D1D5DB\'">'
    + '   </div>'
    + '  </div>'
    + '  <div style="margin-top:20px">'
    + '   <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Workflow Template</label>'
    + '   <div style="display:flex;flex-direction:column;gap:10px">'
    + '    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:#374151;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;transition:all 0.2s" onmouseover="this.style.borderColor=\'#10B981\'" onmouseout="this.style.borderColor=\'#E5E7EB\'"><input type="radio" name="onb-template" value="auto" checked style="accent-color:#10B981"> <i class="fas fa-bolt" style="color:#10B981"></i> Auto-assign based on department (recommended)</label>'
    + '    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;color:#374151;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;transition:all 0.2s" onmouseover="this.style.borderColor=\'#10B981\'" onmouseout="this.style.borderColor=\'#E5E7EB\'"><input type="radio" name="onb-template" value="custom" style="accent-color:#10B981"> <i class="fas fa-sliders-h" style="color:#7C3AED"></i> Custom select apps & hardware manually</label>'
    + '   </div>'
    + '  </div>'
    + '  <div style="margin-top:16px">'
    + '   <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:#374151"><input type="checkbox" checked style="accent-color:#10B981"> Send welcome email on start date</label>'
    + '   <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:#374151;margin-top:8px"><input type="checkbox" checked style="accent-color:#10B981"> Notify manager when provisioning completes</label>'
    + '   <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;color:#374151;margin-top:8px"><input type="checkbox" style="accent-color:#10B981"> Require IT approval for hardware</label>'
    + '  </div>'
    + ' </div>'
    + ' <div style="padding:16px 28px;border-top:1px solid #E5E7EB;display:flex;justify-content:flex-end;gap:10px;background:#F9FAFB">'
    + '  <button onclick="document.getElementById(\'onboard-wizard-modal\').remove()" style="padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #D1D5DB;color:#374151">Cancel</button>'
    + '  <button onclick="executeOnboard()" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#10B981,#059669);color:#fff;border:none;box-shadow:0 2px 10px rgba(16,185,129,0.3)"><i class="fas fa-user-plus"></i> Start Onboarding</button>'
    + ' </div>'
    + '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

function executeOnboard() {
  var modal = document.getElementById('onboard-wizard-modal');
  if (modal) modal.remove();
  showToast('success', 'Onboarding initiated! SaaS apps will be provisioned automatically based on department template.');
}

/**
 * Start onboarding for a specific employee in the pipeline
 */
function startOnboarding(btn, name) {
  if (btn.disabled) return;
  btn.disabled = true;
  var origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.style.opacity = '0.7';

  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Started';
    btn.style.background = '#059669';
    btn.style.opacity = '1';
    showToast('success', 'Onboarding started for ' + name + ' provisioning 12 apps and assigning hardware');

    // Update status badge in the row
    var row = btn.closest('.onb-pipeline-row');
    if (row) {
      row.setAttribute('data-status', 'in-progress');
      var badges = row.querySelectorAll('span[style*="background:rgba(245,158,11"]');
      badges.forEach(function(b) {
        if (b.textContent.trim() === 'Pending') {
          b.textContent = 'In Progress';
          b.style.background = 'rgba(59,130,246,0.08)';
          b.style.color = '#3B82F6';
        }
      });
    }

    setTimeout(function() {
      btn.innerHTML = origHTML;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.opacity = '';
    }, 4000);
  }, 1200);
}

/**
 * Show onboard detail modal for an employee
 */
function showOnboardDetail(name) {
  var existing = document.getElementById('onboard-detail-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'onboard-detail-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';

  overlay.innerHTML = ''
    + '<div style="background:#fff;border-radius:16px;width:95%;max-width:600px;box-shadow:0 20px 60px rgba(0,0,0,0.2);overflow:hidden;max-height:85vh;overflow-y:auto">'
    + ' <div style="padding:24px 28px;border-bottom:1px solid #E5E7EB">'
    + '  <div style="display:flex;justify-content:space-between;align-items:center">'
    + '   <h2 style="font-size:18px;font-weight:800;color:#111827;margin:0">Onboarding Details ' + name + '</h2>'
    + '   <button onclick="document.getElementById(\'onboard-detail-modal\').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#6B7280;padding:4px"><i class="fas fa-times"></i></button>'
    + '  </div>'
    + ' </div>'
    + ' <div style="padding:24px 28px">'
    + '  <h4 style="font-size:14px;font-weight:700;color:#374151;margin:0 0 12px">SaaS App Provisioning</h4>'
    + '  <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fab fa-slack" style="color:#4A154B;width:18px;text-align:center"></i> Slack</span><span style="font-size:11px;font-weight:600;color:#10B981">✓ Provisioned</span></div>'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fab fa-google" style="color:#4285F4;width:18px;text-align:center"></i> Google Workspace</span><span style="font-size:11px;font-weight:600;color:#10B981">✓ Provisioned</span></div>'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fab fa-github" style="color:#333;width:18px;text-align:center"></i> GitHub</span><span style="font-size:11px;font-weight:600;color:#3B82F6"><i class="fas fa-spinner fa-spin" style="font-size:10px"></i> Provisioning…</span></div>'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fab fa-jira" style="color:#0052CC;width:18px;text-align:center"></i> Jira</span><span style="font-size:11px;font-weight:600;color:#9CA3AF"><i class="fas fa-clock" style="font-size:10px"></i> Queued</span></div>'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fas fa-video" style="color:#2D8CFF;width:18px;text-align:center"></i> Zoom</span><span style="font-size:11px;font-weight:600;color:#9CA3AF"><i class="fas fa-clock" style="font-size:10px"></i> Queued</span></div>'
    + '  </div>'
    + '  <h4 style="font-size:14px;font-weight:700;color:#374151;margin:0 0 12px">Hardware Assignment</h4>'
    + '  <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fas fa-laptop" style="color:#7C3AED;width:18px;text-align:center"></i> MacBook Pro 16"</span><span style="font-size:11px;font-weight:600;color:#F59E0B"><i class="fas fa-exclamation-triangle" style="font-size:10px"></i> IT Approval Needed</span></div>'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fas fa-desktop" style="color:#3B82F6;width:18px;text-align:center"></i> 27" Monitor</span><span style="font-size:11px;font-weight:600;color:#10B981">✓ Ready</span></div>'
    + '  </div>'
    + '  <h4 style="font-size:14px;font-weight:700;color:#374151;margin:0 0 12px">Required Training</h4>'
    + '  <div style="display:flex;flex-direction:column;gap:8px">'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fas fa-shield-alt" style="color:#EF4444;width:18px;text-align:center"></i> Security Awareness</span><span style="font-size:11px;font-weight:600;color:#9CA3AF">Not started</span></div>'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fas fa-book" style="color:#7C3AED;width:18px;text-align:center"></i> Company Handbook</span><span style="font-size:11px;font-weight:600;color:#9CA3AF">Not started</span></div>'
    + '   <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F9FAFB;border-radius:8px"><span style="display:flex;align-items:center;gap:8px;font-size:13px"><i class="fas fa-gavel" style="color:#F59E0B;width:18px;text-align:center"></i> SOC2 Compliance</span><span style="font-size:11px;font-weight:600;color:#9CA3AF">Not started</span></div>'
    + '  </div>'
    + ' </div>'
    + ' <div style="padding:16px 28px;border-top:1px solid #E5E7EB;display:flex;justify-content:flex-end;gap:10px;background:#F9FAFB">'
    + '  <button onclick="document.getElementById(\'onboard-detail-modal\').remove()" style="padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #D1D5DB;color:#374151">Close</button>'
    + ' </div>'
    + '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

/**
 * Filter onboarding pipeline by status
 */
function filterOnboardPipeline(status, chip) {
  // Update active chip scoped to the pipeline header only
  var parent = chip ? chip.parentElement : null;
  if (parent) parent.querySelectorAll('.onb-filter-chip').forEach(function(c) { c.classList.remove('active'); });
  if (chip) chip.classList.add('active');

  var rows = document.querySelectorAll('#onboard-pipeline-list .onb-pipeline-row');
  rows.forEach(function(row) {
    var rowStatus = row.getAttribute('data-status');
    if (status === 'all' || rowStatus === status) {
      row.style.display = 'flex';
    } else {
      row.style.display = 'none';
    }
  });
}

/**
 * Preview a workflow template
 */
function previewTemplate(templateName) {
  var templates = {
    engineering: { name: 'Engineering', apps: 'GitHub, Jira, Slack, AWS, VS Code, DataDog, PagerDuty, Notion, Linear, Zoom, Google Workspace, 1Password', hardware: 'MacBook Pro 16", 27" Monitor, Keyboard, Mouse', trainings: 'Security Awareness, SOC2 Compliance, Engineering Handbook' },
    sales: { name: 'Sales & Marketing', apps: 'Salesforce, HubSpot, Slack, Gong, Zoom, Google Workspace, Outreach, LinkedIn Sales Nav, Notion', hardware: 'MacBook Air, Headset', trainings: 'Sales Playbook, CRM Guide, Security Awareness, Product Overview, Competitive Intel' },
    design: { name: 'Design & Product', apps: 'Figma, Notion, Linear, Miro, Slack, Zoom, Google Workspace, Loom', hardware: 'MacBook Pro 16", 27" 4K Monitor, Drawing Tablet', trainings: 'Design System Guide, Security Awareness' }
  };
  var t = templates[templateName];
  if (!t) return;

  var existing = document.getElementById('template-preview-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'template-preview-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';

  var appsList = t.apps.split(', ').map(function(a) {
    return '<span style="display:inline-block;padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(124,58,237,0.06);color:#7C3AED;margin:2px">' + a + '</span>';
  }).join('');

  var hwList = t.hardware.split(', ').map(function(h) {
    return '<span style="display:inline-block;padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(59,130,246,0.06);color:#3B82F6;margin:2px">' + h + '</span>';
  }).join('');

  var trainList = t.trainings.split(', ').map(function(tr) {
    return '<span style="display:inline-block;padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(245,158,11,0.06);color:#D97706;margin:2px">' + tr + '</span>';
  }).join('');

  overlay.innerHTML = ''
    + '<div style="background:#fff;border-radius:16px;width:95%;max-width:520px;box-shadow:0 20px 60px rgba(0,0,0,0.2);overflow:hidden">'
    + ' <div style="padding:20px 28px;border-bottom:1px solid #E5E7EB">'
    + '  <div style="display:flex;justify-content:space-between;align-items:center">'
    + '   <h2 style="font-size:18px;font-weight:800;color:#111827;margin:0"><i class="fas fa-project-diagram" style="color:#7C3AED;margin-right:8px"></i>' + t.name + ' Template</h2>'
    + '   <button onclick="document.getElementById(\'template-preview-modal\').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#6B7280;padding:4px"><i class="fas fa-times"></i></button>'
    + '  </div>'
    + ' </div>'
    + ' <div style="padding:24px 28px">'
    + '  <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 8px"><i class="fas fa-box-open" style="color:#7C3AED;margin-right:6px"></i>SaaS Apps</h4>'
    + '  <div style="display:flex;flex-wrap:wrap;gap:0;margin-bottom:20px">' + appsList + '</div>'
    + '  <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 8px"><i class="fas fa-laptop" style="color:#3B82F6;margin-right:6px"></i>Hardware</h4>'
    + '  <div style="display:flex;flex-wrap:wrap;gap:0;margin-bottom:20px">' + hwList + '</div>'
    + '  <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 8px"><i class="fas fa-graduation-cap" style="color:#D97706;margin-right:6px"></i>Required Training</h4>'
    + '  <div style="display:flex;flex-wrap:wrap;gap:0">' + trainList + '</div>'
    + ' </div>'
    + ' <div style="padding:16px 28px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;gap:10px;background:#F9FAFB">'
    + '  <button onclick="editTemplate(\'' + templateName + '\')" style="padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #D1D5DB;color:#374151"><i class="fas fa-edit"></i> Edit Template</button>'
    + '  <button onclick="document.getElementById(\'template-preview-modal\').remove()" style="padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:rgba(124,58,237,0.08);border:none;color:#7C3AED">Close</button>'
    + ' </div>'
    + '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

function editTemplate(templateName) {
  var templates = {
    engineering: { name: 'Engineering', icon: 'fa-code', color: '#7C3AED',
      apps: ['GitHub','Jira','Slack','AWS','VS Code','DataDog','PagerDuty','Notion','Linear','Zoom','Google Workspace','1Password'],
      hardware: ['MacBook Pro 16"','27" Monitor','Keyboard','Mouse'],
      trainings: ['Security Awareness','SOC2 Compliance','Engineering Handbook'] },
    sales: { name: 'Sales & Marketing', icon: 'fa-chart-line', color: '#F59E0B',
      apps: ['Salesforce','HubSpot','Slack','Gong','Zoom','Google Workspace','Outreach','LinkedIn Sales Nav','Notion'],
      hardware: ['MacBook Air','Headset'],
      trainings: ['Sales Playbook','CRM Guide','Security Awareness','Product Overview','Competitive Intel'] },
    design: { name: 'Design & Product', icon: 'fa-palette', color: '#EC4899',
      apps: ['Figma','Notion','Linear','Miro','Slack','Zoom','Google Workspace','Loom'],
      hardware: ['MacBook Pro 16"','27" 4K Monitor','Drawing Tablet'],
      trainings: ['Design System Guide','Security Awareness'] }
  };
  var t = templates[templateName];
  if (!t) return;

  // Remove the preview modal
  var prev = document.getElementById('template-preview-modal');
  if (prev) prev.remove();

  var allApps = ['GitHub','Jira','Slack','AWS','VS Code','DataDog','PagerDuty','Notion','Linear','Zoom','Google Workspace','1Password','Salesforce','HubSpot','Gong','Outreach','LinkedIn Sales Nav','Figma','Miro','Loom','Confluence','Asana','Monday.com','Trello'];
  var allHW = ['MacBook Pro 16"','MacBook Pro 14"','MacBook Air','27" Monitor','27" 4K Monitor','24" Monitor','Drawing Tablet','Keyboard','Mouse','Headset','Webcam','Docking Station'];
  var allTrainings = ['Security Awareness','SOC2 Compliance','Engineering Handbook','Sales Playbook','CRM Guide','Product Overview','Competitive Intel','Design System Guide','GDPR Overview','Data Privacy','Code of Conduct','Anti-Harassment'];

  function buildChipGrid(allItems, selected, category) {
    return allItems.map(function(item) {
      var isSelected = selected.indexOf(item) !== -1;
      return '<label style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;margin:3px;transition:all 0.15s;'
        + (isSelected ? 'background:rgba(124,58,237,0.12);color:#7C3AED;border:1.5px solid #7C3AED' : 'background:#F3F4F6;color:#6B7280;border:1.5px solid transparent')
        + '" onclick="this.querySelector(\'input\').checked=!this.querySelector(\'input\').checked;this.style.background=this.querySelector(\'input\').checked?\'rgba(124,58,237,0.12)\':\'#F3F4F6\';this.style.color=this.querySelector(\'input\').checked?\'#7C3AED\':\'#6B7280\';this.style.borderColor=this.querySelector(\'input\').checked?\'#7C3AED\':\'transparent\'">'
        + '<input type="checkbox" name="tpl-' + category + '" value="' + item + '" ' + (isSelected ? 'checked' : '') + ' style="display:none">' + item + '</label>';
    }).join('');
  }

  var overlay = document.createElement('div');
  overlay.id = 'template-editor-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';

  overlay.innerHTML = ''
    + '<div style="background:#fff;border-radius:16px;width:95%;max-width:600px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.2);overflow:hidden">'
    + ' <div style="padding:20px 28px;border-bottom:1px solid #E5E7EB;flex-shrink:0">'
    + '  <div style="display:flex;justify-content:space-between;align-items:center">'
    + '   <h2 style="font-size:18px;font-weight:800;color:#111827;margin:0"><i class="fas fa-edit" style="color:' + t.color + ';margin-right:8px"></i>Edit ' + t.name + ' Template</h2>'
    + '   <button onclick="document.getElementById(\'template-editor-modal\').remove()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#6B7280;padding:4px"><i class="fas fa-times"></i></button>'
    + '  </div>'
    + '  <p style="margin:6px 0 0;font-size:13px;color:#6B7280">Toggle items to add or remove from this template</p>'
    + ' </div>'
    + ' <div style="padding:24px 28px;overflow-y:auto;flex:1">'
    + '  <div style="margin-bottom:20px">'
    + '   <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Template Name</label>'
    + '   <input id="tpl-edit-name" type="text" value="' + t.name + '" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;color:#111827;box-sizing:border-box">'
    + '  </div>'
    + '  <div style="margin-bottom:20px">'
    + '   <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 8px"><i class="fas fa-box-open" style="color:#7C3AED;margin-right:6px"></i>SaaS Apps <span style="font-weight:400;color:#9CA3AF">(' + t.apps.length + ' selected)</span></h4>'
    + '   <div style="display:flex;flex-wrap:wrap;gap:0" id="tpl-apps-grid">' + buildChipGrid(allApps, t.apps, 'apps') + '</div>'
    + '  </div>'
    + '  <div style="margin-bottom:20px">'
    + '   <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 8px"><i class="fas fa-laptop" style="color:#3B82F6;margin-right:6px"></i>Hardware <span style="font-weight:400;color:#9CA3AF">(' + t.hardware.length + ' selected)</span></h4>'
    + '   <div style="display:flex;flex-wrap:wrap;gap:0" id="tpl-hw-grid">' + buildChipGrid(allHW, t.hardware, 'hw') + '</div>'
    + '  </div>'
    + '  <div style="margin-bottom:12px">'
    + '   <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 8px"><i class="fas fa-graduation-cap" style="color:#D97706;margin-right:6px"></i>Required Training <span style="font-weight:400;color:#9CA3AF">(' + t.trainings.length + ' selected)</span></h4>'
    + '   <div style="display:flex;flex-wrap:wrap;gap:0" id="tpl-train-grid">' + buildChipGrid(allTrainings, t.trainings, 'train') + '</div>'
    + '  </div>'
    + ' </div>'
    + ' <div style="padding:16px 28px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;gap:10px;background:#F9FAFB;flex-shrink:0">'
    + '  <button onclick="document.getElementById(\'template-editor-modal\').remove()" style="padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #D1D5DB;color:#374151">Cancel</button>'
    + '  <button id="tpl-save-btn" onclick="saveTemplateEdit(\'' + templateName + '\')" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#7C3AED;border:none;color:#fff"><i class="fas fa-check"></i> Save Changes</button>'
    + ' </div>'
    + '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

function saveTemplateEdit(templateName) {
  var btn = document.getElementById('tpl-save-btn');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';

  var selectedApps = document.querySelectorAll('input[name="tpl-apps"]:checked').length;
  var selectedHW = document.querySelectorAll('input[name="tpl-hw"]:checked').length;
  var selectedTrain = document.querySelectorAll('input[name="tpl-train"]:checked').length;
  var newName = document.getElementById('tpl-edit-name') ? document.getElementById('tpl-edit-name').value : templateName;

  setTimeout(function() {
    var modal = document.getElementById('template-editor-modal');
    if (modal) modal.remove();
    showToast('success', 'Template "' + newName + '" updated ' + selectedApps + ' apps, ' + selectedHW + ' hardware, ' + selectedTrain + ' trainings');
  }, 1200);
}

// ========================================================================
// HARDWARE & ASSET MANAGEMENT
// ========================================================================
function openHardwareRequest() {
  _openLifecycleModal('New Hardware Request', '#3B82F6', 'fa-laptop', ''
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Employee</label>'
    + ' <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;color:#111827;background:#fff">'
    + '  <option>Rahul Sharma Engineering</option><option>Meera Krishnan Sales</option><option>Ananya Patel Design</option><option>Deepak Gupta Engineering</option>'
    + ' </select>'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Hardware Type</label>'
    + ' <div style="display:flex;gap:8px;flex-wrap:wrap">'
    + '  <label style="display:flex;align-items:center;gap:8px;padding:10px 16px;border:1.5px solid #E5E7EB;border-radius:10px;cursor:pointer;font-size:13px"><input type="radio" name="hw-type" checked> <i class="fas fa-laptop" style="color:#3B82F6"></i> Laptop</label>'
    + '  <label style="display:flex;align-items:center;gap:8px;padding:10px 16px;border:1.5px solid #E5E7EB;border-radius:10px;cursor:pointer;font-size:13px"><input type="radio" name="hw-type"> <i class="fas fa-desktop" style="color:#7C3AED"></i> Monitor</label>'
    + '  <label style="display:flex;align-items:center;gap:8px;padding:10px 16px;border:1.5px solid #E5E7EB;border-radius:10px;cursor:pointer;font-size:13px"><input type="radio" name="hw-type"> <i class="fas fa-keyboard" style="color:#10B981"></i> Peripherals</label>'
    + ' </div>'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Model / Specification</label>'
    + ' <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;color:#111827;background:#fff">'
    + '  <option>MacBook Pro 16" M4 Max 36GB (Standard for Engineering)</option><option>MacBook Air 15" M4 16GB (Standard for Sales)</option><option>MacBook Pro 16" M4 Pro 24GB (Standard for Design)</option><option>Custom specify below</option>'
    + ' </select>'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Shipping Address</label>'
    + ' <input type="text" placeholder="Employee home address or office location" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;box-sizing:border-box">'
    + '</div>'
    + '<div style="padding:12px 16px;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.12);border-radius:10px;font-size:12px;color:#3B82F6">'
    + ' <i class="fas fa-info-circle"></i> Approval chain: <strong>Manager</strong> → <strong>IT Admin</strong> → <strong>Security</strong>. Estimated delivery: 3-5 business days.'
    + '</div>',
    function() { showToast('success', 'Hardware request submitted sent to manager for approval'); });
}

function syncMDM() {
  var btn = event.currentTarget || event.target;
  var orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Synced!';
    btn.style.background = '#10B981';
    btn.style.color = '#fff';
    btn.style.borderColor = '#10B981';
    showToast('success', 'MDM sync complete 142 devices synced from Jamf Pro & Intune. 2 new devices enrolled.');
    setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = ''; }, 3000);
  }, 1800);
}

function generateReturnLabels() {
  var btn = event.currentTarget || event.target;
  var orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Labels Ready';
    showToast('success', '5 prepaid return labels generated via FedEx emails sent to offboarded employees');
    setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; }, 3000);
  }, 1500);
}

function sendReturnLabel(btn, name, email) {
  var orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent';
    btn.style.background = '#10B981';
    showToast('success', 'Prepaid return label sent to ' + email);
    setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; }, 3000);
  }, 1000);
}

function filterAssets(status, el) {
  var chips = el.parentElement.querySelectorAll('.onb-filter-chip');
  chips.forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
  var rows = document.querySelectorAll('#asset-inventory-table tbody tr');
  rows.forEach(function(row) {
    if (status === 'all') { row.style.display = 'table-row'; }
    else { row.style.display = row.getAttribute('data-asset-status') === status ? 'table-row' : 'none'; }
  });
}

// ========================================================================
// TRAINING & COMPLIANCE
// ========================================================================
function sendTrainingReminders() {
  var btn = event.currentTarget || event.target;
  var orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = '#10B981';
    btn.style.color = '#fff';
    btn.style.borderColor = '#10B981';
    showToast('success', 'Reminders sent to 4 employees with overdue trainings via email & Slack');
    setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = ''; }, 3000);
  }, 1200);
}

function addTrainingModule() {
  _openLifecycleModal('Add Training Module', '#D97706', 'fa-graduation-cap', ''
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Training Name</label>'
    + ' <input type="text" placeholder="e.g. Security Awareness, Product Overview" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;box-sizing:border-box">'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Assign To</label>'
    + ' <div style="display:flex;gap:8px;flex-wrap:wrap">'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox" checked> Engineering</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Sales</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Design</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> All Departments</label>'
    + ' </div>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">'
    + ' <div><label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">LMS Source</label>'
    + '  <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;background:#fff"><option>Lessonly</option><option>Google Classroom</option><option>Custom Upload</option></select></div>'
    + ' <div><label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Completion Deadline</label>'
    + '  <input type="text" value="7 days from onboard" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;box-sizing:border-box"></div>'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer"><input type="checkbox" checked> <span style="font-weight:600;color:#374151">Required for compliance</span> <span style="color:#6B7280">(blocks onboarding completion if not done)</span></label>'
    + '</div>',
    function() { showToast('success', 'Training module added will be auto-assigned to new hires in selected departments'); });
}

function remindUnsigned() {
  var btn = event.currentTarget || event.target;
  var orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Reminder Sent';
    showToast('success', 'DocuSign reminders sent for 2 unsigned documents (Meera IP Agreement, Ananya NDA)');
    setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; }, 3000);
  }, 1000);
}

// ========================================================================
// LIFECYCLE ANALYTICS & INTELLIGENCE
// ========================================================================
function exportComplianceReport() {
  var btn = event.currentTarget || event.target;
  var orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
    btn.style.background = '#10B981';
    btn.style.color = '#fff';
    btn.style.borderColor = '#10B981';
    showToast('success', 'SOC2/ISO 27001 compliance report exported includes all onboarding evidence, access logs, and audit trail');
    setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = ''; }, 3000);
  }, 2000);
}

function revokeAnomalyAccess(btn, name) {
  var parentDiv = btn.closest('div[style*="border"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Revoked';
    btn.style.background = '#10B981';
    if (parentDiv) {
      parentDiv.style.borderColor = 'rgba(16,185,129,0.2)';
      parentDiv.style.background = 'rgba(16,185,129,0.03)';
    }
    showToast('success', 'Emergency revocation complete for ' + name + ' GitHub & AWS access removed, audit logged');
  }, 1200);
}

function investigateAnomaly(btn, name) {
  _openLifecycleModal('Investigate: ' + name, '#F59E0B', 'fa-search', ''
    + '<div style="padding:14px 18px;background:rgba(245,158,11,0.04);border:1.5px solid rgba(245,158,11,0.15);border-radius:10px;margin-bottom:18px">'
    + ' <div style="font-size:14px;font-weight:700;color:#92400E;margin-bottom:6px"><i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>Suspicious Activity Summary</div>'
    + ' <div style="font-size:13px;color:#374151;line-height:1.6">'
    + '  <div><strong>Employee:</strong> ' + name + ' (notice period)</div>'
    + '  <div><strong>Pattern:</strong> Large file downloads from Figma & Google Drive at 2:00–3:30 AM IST</div>'
    + '  <div><strong>Duration:</strong> Last 3 consecutive days</div>'
    + '  <div><strong>Data volume:</strong> ~4.2 GB total across 847 files</div>'
    + '  <div><strong>Risk level:</strong> <span style="color:#EF4444;font-weight:700">HIGH potential data exfiltration</span></div>'
    + ' </div>'
    + '</div>'
    + '<div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px">Recommended Actions:</div>'
    + '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">'
    + ' <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#F9FAFB;border-radius:8px;cursor:pointer;font-size:13px"><input type="checkbox" checked> Restrict Figma to view-only immediately</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#F9FAFB;border-radius:8px;cursor:pointer;font-size:13px"><input type="checkbox" checked> Disable Google Drive downloads</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#F9FAFB;border-radius:8px;cursor:pointer;font-size:13px"><input type="checkbox"> Notify manager (Ritu Menon)</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:#F9FAFB;border-radius:8px;cursor:pointer;font-size:13px"><input type="checkbox"> Escalate to Security team</label>'
    + '</div>',
    function() { showToast('success', 'Investigation actions applied for ' + name + ' access restricted, security team notified'); });
}

function flagDeviation(btn) {
  var parentDiv = btn.closest('div[style*="border"]');
  btn.innerHTML = '<i class="fas fa-check"></i> Flagged';
  btn.style.background = '#7C3AED';
  btn.style.color = '#fff';
  btn.disabled = true;
  if (parentDiv) parentDiv.style.borderColor = 'rgba(124,58,237,0.25)';
  showToast('info', 'Provisioning deviation flagged template review task created for IT admin');
}

function applyLicenseOptimization(btn, appName, savings) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Applied';
    btn.style.background = '#059669';
    var row = btn.closest('tr');
    if (row) row.style.background = 'rgba(16,185,129,0.04)';
    showToast('success', appName + ' optimization applied ' + savings + ' saved per year');
  }, 1000);
}

function applyAllOptimizations(btn) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check-double"></i> All Applied!';
    btn.style.background = '#059669';
    document.querySelectorAll('#sec-lifecycle-analytics table:last-of-type tbody tr').forEach(function(row) {
      row.style.background = 'rgba(16,185,129,0.04)';
      var applyBtn = row.querySelector('button');
      if (applyBtn && !applyBtn.disabled) { applyBtn.innerHTML = '<i class="fas fa-check"></i> Applied'; applyBtn.disabled = true; applyBtn.style.background = '#059669'; }
    });
    showToast('success', 'All 3 license optimizations applied $13.2K/yr total savings! Changes take effect at next billing cycle.');
  }, 2000);
}

// ========================================================================
// CONTRACTOR MANAGEMENT
// ========================================================================
function addContractor() {
  _openLifecycleModal('Add Contractor', '#DB2777', 'fa-id-badge', ''
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">'
    + ' <div><label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Full Name</label>'
    + '  <input type="text" placeholder="e.g. John Smith" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;box-sizing:border-box"></div>'
    + ' <div><label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Company</label>'
    + '  <input type="text" placeholder="e.g. TechServe India" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;box-sizing:border-box"></div>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">'
    + ' <div><label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Department</label>'
    + '  <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;background:#fff"><option>Engineering</option><option>Design</option><option>Sales</option><option>Finance</option></select></div>'
    + ' <div><label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Contract End Date</label>'
    + '  <input type="date" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;box-sizing:border-box"></div>'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Tools to Provision (limited set)</label>'
    + ' <div style="display:flex;gap:8px;flex-wrap:wrap">'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox" checked> Slack</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox" checked> GitHub</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Jira</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Figma</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> AWS</label>'
    + ' </div>'
    + '</div>'
    + '<div style="padding:12px 16px;background:rgba(236,72,153,0.04);border:1px solid rgba(236,72,153,0.12);border-radius:10px;font-size:12px;color:#DB2777">'
    + ' <i class="fas fa-shield-alt"></i> Access will <strong>auto-expire</strong> on contract end date. No manual offboarding needed.'
    + '</div>',
    function() { showToast('success', 'Contractor onboarded time-bound access provisioned with auto-expiry'); });
}

function extendContract(btn, name) {
  _openLifecycleModal('Extend Contract: ' + name, '#DB2777', 'fa-redo', ''
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">New End Date</label>'
    + ' <input type="date" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;box-sizing:border-box">'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Reason for Extension</label>'
    + ' <textarea placeholder="Project deadline extended, additional scope…" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;min-height:80px;resize:vertical;box-sizing:border-box"></textarea>'
    + '</div>'
    + '<div style="padding:12px 16px;background:rgba(236,72,153,0.04);border:1px solid rgba(236,72,153,0.12);border-radius:10px;font-size:12px;color:#DB2777">'
    + ' <i class="fas fa-info-circle"></i> Extension requires manager approval. Auto-deprovision date will update automatically.'
    + '</div>',
    function() { showToast('success', 'Contract extension request submitted for ' + name + ' awaiting manager approval'); });
}

// ========================================================================
// APPROVAL WORKFLOWS
// ========================================================================
function approveRequest(btn, name, item) {
  var rowDiv = btn.closest('div[style*="display:flex"]');
  var buttons = rowDiv || btn.closest('div');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(function() {
    buttons.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#10B981"><i class="fas fa-check-circle"></i> Approved</span>';
    showToast('success', 'Approved ' + item + ' for ' + name + ' forwarded to next approver in chain');
  }, 800);
}

function rejectRequest(btn, name, item) {
  _openLifecycleModal('Reject: ' + item + ' for ' + name, '#EF4444', 'fa-times-circle', ''
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Rejection Reason (required)</label>'
    + ' <textarea id="reject-reason-input" placeholder="Budget exceeded, not approved for this role, alternative available…" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;min-height:80px;resize:vertical;box-sizing:border-box"></textarea>'
    + '</div>'
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer"><input type="checkbox"> Suggest alternative (e.g. lower tier)</label>'
    + '</div>',
    function() {
      var reason = document.getElementById('reject-reason-input');
      if (reason && !reason.value.trim()) { showToast('warning', 'Please enter a rejection reason'); return; }
      var rowDiv = btn.closest('div[style*="display:flex"]');
      var buttons = rowDiv || btn.closest('div');
      buttons.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#EF4444"><i class="fas fa-times-circle"></i> Rejected</span>';
      showToast('info', 'Rejected ' + item + ' for ' + name + ' employee notified with reason');
      _closeLifecycleModal();
    }, 'Reject Request', '#EF4444');
}

function editApprovalChains() {
  _openLifecycleModal('Edit Approval Chains', '#7C3AED', 'fa-project-diagram', ''
    + '<div style="display:flex;flex-direction:column;gap:14px">'
    + ' <div style="padding:14px 18px;background:#F9FAFB;border-radius:10px;border-left:3px solid #3B82F6">'
    + '  <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:8px">Hardware Request</div>'
    + '  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">'
    + '   <span style="padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(59,130,246,0.08);color:#3B82F6">Manager</span>'
    + '   <i class="fas fa-arrow-right" style="font-size:10px;color:#9CA3AF"></i>'
    + '   <span style="padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(245,158,11,0.08);color:#D97706">IT Admin</span>'
    + '   <i class="fas fa-arrow-right" style="font-size:10px;color:#9CA3AF"></i>'
    + '   <span style="padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(239,68,68,0.08);color:#EF4444">Security</span>'
    + '  </div>'
    + '  <div style="display:flex;gap:10px;font-size:12px"><span style="color:#6B7280">Escalation: <strong>24 hrs</strong></span><select style="padding:2px 8px;border:1px solid #E5E7EB;border-radius:6px;font-size:12px"><option>24 hrs</option><option>12 hrs</option><option>48 hrs</option></select></div>'
    + ' </div>'
    + ' <div style="padding:14px 18px;background:#F9FAFB;border-radius:10px;border-left:3px solid #F59E0B">'
    + '  <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:8px">SaaS Access</div>'
    + '  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">'
    + '   <span style="padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(59,130,246,0.08);color:#3B82F6">Manager</span>'
    + '   <i class="fas fa-arrow-right" style="font-size:10px;color:#9CA3AF"></i>'
    + '   <span style="padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(245,158,11,0.08);color:#D97706">IT Admin</span>'
    + '  </div>'
    + '  <div style="display:flex;gap:10px;font-size:12px"><span style="color:#6B7280">Escalation: <strong>12 hrs</strong></span><select style="padding:2px 8px;border:1px solid #E5E7EB;border-radius:6px;font-size:12px"><option>12 hrs</option><option>6 hrs</option><option>24 hrs</option></select></div>'
    + ' </div>'
    + ' <div style="padding:14px 18px;background:#F9FAFB;border-radius:10px;border-left:3px solid #EF4444">'
    + '  <div style="font-size:14px;font-weight:700;color:#111827;margin-bottom:8px">Emergency Override</div>'
    + '  <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">'
    + '   <span style="padding:4px 12px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(239,68,68,0.08);color:#EF4444">CTO / CISO Only</span>'
    + '  </div>'
    + '  <div style="font-size:12px;color:#6B7280">Full audit log required · <label style="cursor:pointer"><input type="checkbox" checked> Require justification</label></div>'
    + ' </div>'
    + '</div>',
    function() { showToast('success', 'Approval chains updated changes effective immediately'); });
}

// ========================================================================
// SELF-SERVICE PORTAL
// ========================================================================
function addAIRecommendation(btn, recommendation) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    btn.style.background = '#059669';
    showToast('success', recommendation + ' template updated');
  }, 800);
}

function scheduleAIEvent(btn, description) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Scheduled';
    btn.style.background = '#059669';
    showToast('success', description);
  }, 800);
}

function openPortalURL() {
  var portalUrl = 'https://portal.saasiq.io/techcorp-india/employee';
  _openLifecycleModal('Self-Service Portal URL', '#7C3AED', 'fa-link', ''
    + '<p style="font-size:13px;color:#6B7280;margin:0 0 16px">Share this URL with employees so they can access their self-service portal.</p>'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:18px">'
    + ' <input id="portal-url-field" type="text" value="' + portalUrl + '" readonly style="flex:1;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#F9FAFB;box-sizing:border-box;font-family:monospace">'
    + ' <button onclick="document.getElementById(\'portal-url-field\').select();document.execCommand(\'copy\');this.innerHTML=\'<i class=&quot;fas fa-check&quot;></i> Copied\';this.style.background=\'#059669\';this.style.color=\'#fff\'" style="padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:#7C3AED;color:#fff;border:none;white-space:nowrap"><i class="fas fa-copy"></i> Copy</button>'
    + '</div>'
    + '<div style="border:1px solid #E5E7EB;border-radius:10px;padding:14px;background:#F9FAFB">'
    + ' <h4 style="font-size:12px;font-weight:700;color:#374151;margin:0 0 10px">Embed Options</h4>'
    + ' <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;margin-bottom:8px;cursor:pointer"><input type="checkbox" checked> Allow tool requests</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;margin-bottom:8px;cursor:pointer"><input type="checkbox" checked> Show knowledge base</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;margin-bottom:8px;cursor:pointer"><input type="checkbox" checked> Show onboarding progress</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;cursor:pointer"><input type="checkbox"> Enable SSO-only access</label>'
    + '</div>',
  function() {
    showToast('success', 'Portal URL copied and settings saved');
  }, '<i class="fas fa-save"></i> Save Settings', '#7C3AED');
}

function configurePortal() {
  _openLifecycleModal('Configure Self-Service Portal', '#7C3AED', 'fa-cog', ''
    + '<div style="margin-bottom:20px">'
    + ' <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 10px"><i class="fas fa-palette" style="margin-right:6px;color:#7C3AED"></i>Portal Branding</h4>'
    + ' <div style="margin-bottom:10px"><label style="display:block;font-size:12px;font-weight:600;color:#6B7280;margin-bottom:4px">Company Name</label><input type="text" value="TechCorp India" style="width:100%;padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;box-sizing:border-box"></div>'
    + ' <div><label style="display:block;font-size:12px;font-weight:600;color:#6B7280;margin-bottom:4px">Welcome Message</label><input type="text" value="Welcome aboard! Here is everything you need to get started." style="width:100%;padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;box-sizing:border-box"></div>'
    + '</div>'
    + '<div style="margin-bottom:20px">'
    + ' <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 10px"><i class="fas fa-toggle-on" style="margin-right:6px;color:#10B981"></i>Portal Modules</h4>'
    + ' <label style="display:flex;align-items:center;justify-content:space-between;padding:10px;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;cursor:pointer"><span style="font-size:13px;color:#374151"><i class="fas fa-tasks" style="color:#3B82F6;margin-right:8px"></i>Onboarding Progress Tracker</span><input type="checkbox" checked></label>'
    + ' <label style="display:flex;align-items:center;justify-content:space-between;padding:10px;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;cursor:pointer"><span style="font-size:13px;color:#374151"><i class="fas fa-plus-circle" style="color:#7C3AED;margin-right:8px"></i>Tool Request Form</span><input type="checkbox" checked></label>'
    + ' <label style="display:flex;align-items:center;justify-content:space-between;padding:10px;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;cursor:pointer"><span style="font-size:13px;color:#374151"><i class="fas fa-bug" style="color:#EF4444;margin-right:8px"></i>Issue Reporting</span><input type="checkbox" checked></label>'
    + ' <label style="display:flex;align-items:center;justify-content:space-between;padding:10px;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;cursor:pointer"><span style="font-size:13px;color:#374151"><i class="fas fa-book" style="color:#3B82F6;margin-right:8px"></i>Knowledge Base</span><input type="checkbox" checked></label>'
    + ' <label style="display:flex;align-items:center;justify-content:space-between;padding:10px;border:1px solid #E5E7EB;border-radius:8px;cursor:pointer"><span style="font-size:13px;color:#374151"><i class="fas fa-robot" style="color:#7C3AED;margin-right:8px"></i>AI Recommendations</span><input type="checkbox" checked></label>'
    + '</div>'
    + '<div>'
    + ' <h4 style="font-size:13px;font-weight:700;color:#374151;margin:0 0 10px"><i class="fas fa-bell" style="margin-right:6px;color:#F59E0B"></i>Notifications</h4>'
    + ' <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;margin-bottom:6px;cursor:pointer"><input type="checkbox" checked> Email employee when portal is ready</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;cursor:pointer"><input type="checkbox"> Slack DM with portal link</label>'
    + '</div>',
  function() {
    showToast('success', 'Self-Service Portal configuration saved');
  }, '<i class="fas fa-check"></i> Save Config', '#7C3AED');
}

function reportIssue(issueType) {
  var types = {
    access: { title: "Can't Access a Tool", icon: 'fa-lock', color: '#EF4444', placeholder: 'Which tool can you not access? What error do you see?' },
    permissions: { title: 'Wrong Permissions', icon: 'fa-user-shield', color: '#F59E0B', placeholder: 'Which tool has wrong permissions? What access level do you need?' },
    other: { title: 'Other Issue', icon: 'fa-question-circle', color: '#6B7280', placeholder: 'Describe your issue in detail…' }
  };
  var t = types[issueType] || types.other;

  _openLifecycleModal(t.title, t.color, t.icon, ''
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Employee</label>'
    + ' <input type="text" value="Meera Krishnan Sales" readonly style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#6B7280;background:#F9FAFB;box-sizing:border-box">'
    + '</div>'
    + (issueType === 'access' || issueType === 'permissions' ? ''
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Affected Tool</label>'
    + ' <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;box-sizing:border-box">'
    + '  <option>Salesforce</option><option>HubSpot</option><option>Slack</option><option>Gong</option><option>Zoom</option><option>Google Workspace</option><option>Other…</option>'
    + ' </select>'
    + '</div>' : '')
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Description</label>'
    + ' <textarea placeholder="' + t.placeholder + '" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;min-height:80px;resize:vertical;box-sizing:border-box;font-family:inherit"></textarea>'
    + '</div>'
    + '<div style="margin-bottom:10px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Priority</label>'
    + ' <div style="display:flex;gap:8px">'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 16px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600"><input type="radio" name="issue-priority"> <span style="color:#6B7280">Low</span></label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 16px;border:1.5px solid #F59E0B;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:rgba(245,158,11,0.06)"><input type="radio" name="issue-priority" checked> <span style="color:#D97706">Medium</span></label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:8px 16px;border:1.5px solid #EF4444;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600"><input type="radio" name="issue-priority"> <span style="color:#EF4444">High</span></label>'
    + ' </div>'
    + '</div>',
  function() {
    showToast('success', 'Issue reported IT ticket #IT-' + (1042 + Math.floor(Math.random()*100)) + ' created, assigned to IT Helpdesk');
  }, '<i class="fas fa-paper-plane"></i> Submit Issue', t.color);
}

function openWebhookDetail(type) {
  var configs = {
    incoming: { title: 'Incoming Webhooks', icon: 'fa-arrow-right', color: '#10B981',
      items: [
        { name: 'BambooHR New Hire', url: '/webhooks/bamboo-newhire', status: 'Active', events: '142 received' },
        { name: 'Workday Termination', url: '/webhooks/workday-term', status: 'Active', events: '38 received' },
        { name: 'Slack User Created', url: '/webhooks/slack-user', status: 'Active', events: '89 received' }
      ]},
    outgoing: { title: 'Outgoing Webhooks', icon: 'fa-arrow-left', color: '#3B82F6',
      items: [
        { name: 'Slack #it-onboarding', url: 'https://hooks.slack.com/...', status: 'Active', events: 'On new hire' },
        { name: 'PagerDuty Security Alert', url: 'https://events.pagerduty.com/...', status: 'Active', events: 'On access anomaly' },
        { name: 'Jira Create Ticket', url: 'https://techcorp.atlassian.net/...', status: 'Active', events: 'On issue report' },
        { name: 'Email Manager Notify', url: 'SMTP relay', status: 'Active', events: 'On approval needed' },
        { name: 'Teams IT Channel', url: 'https://outlook.office.com/...', status: 'Paused', events: 'On hardware request' }
      ]},
    api: { title: 'Public REST API', icon: 'fa-key', color: '#F59E0B',
      items: [
        { name: 'API Key Production', url: 'sk-prod-****-7f3a', status: 'Active', events: '2,340 calls/day' },
        { name: 'API Key Staging', url: 'sk-stg-****-b1c2', status: 'Active', events: '156 calls/day' },
        { name: 'OAuth Client CI/CD', url: 'client_id: saasiq-cicd', status: 'Active', events: '12 automations' }
      ]},
    connectors: { title: 'Custom Connectors', icon: 'fa-puzzle-piece', color: '#EC4899',
      items: [
        { name: 'Internal HRIS Adapter', url: 'connector-hris-v2', status: 'Published', events: 'SDK v2.1' },
        { name: 'Finance ERP Bridge', url: 'connector-erp-v1', status: 'Draft', events: 'SDK v2.1' }
      ]}
  };
  var c = configs[type];
  if (!c) return;

  var rows = c.items.map(function(item) {
    var statusColor = item.status === 'Active' || item.status === 'Published' ? '#10B981' : '#F59E0B';
    return '<div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #E5E7EB;border-radius:10px;margin-bottom:8px">'
      + '<div style="flex:1"><strong style="font-size:13px;color:#111827">' + item.name + '</strong><div style="font-size:11px;color:#9CA3AF;margin-top:2px;font-family:monospace">' + item.url + '</div></div>'
      + '<span style="font-size:11px;font-weight:600;color:#6B7280">' + item.events + '</span>'
      + '<span style="font-size:11px;font-weight:600;color:' + statusColor + ';padding:3px 8px;border-radius:6px;background:' + statusColor + '14">' + item.status + '</span>'
      + '</div>';
  }).join('');

  _openLifecycleModal(c.title, c.color, c.icon, ''
    + '<p style="font-size:13px;color:#6B7280;margin:0 0 14px">' + c.items.length + ' configured</p>'
    + rows
    + '<div style="margin-top:14px;padding:12px;background:#F9FAFB;border-radius:10px;border:1px dashed #D1D5DB;text-align:center;cursor:pointer;color:#7C3AED;font-size:13px;font-weight:600" onclick="showToast(\'info\',\'Webhook creation wizard opening…\')"><i class="fas fa-plus"></i> Add New</div>',
  function() {
    _closeLifecycleModal();
  }, '<i class="fas fa-check"></i> Done', c.color);
}

function addAutoAssignmentRule() {
  _openLifecycleModal('Add Auto-Assignment Rule', '#3B82F6', 'fa-th-list', ''
    + '<p style="font-size:13px;color:#6B7280;margin:0 0 16px">Define which hardware gets auto-assigned when an employee joins a specific department.</p>'
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Department / Role</label>'
    + ' <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;box-sizing:border-box">'
    + '  <option>Select department…</option><option>Engineering</option><option>Sales & Marketing</option><option>Design & Product</option><option>Finance & Ops</option><option>Customer Support</option><option>HR & People</option><option>Legal</option>'
    + ' </select>'
    + '</div>'
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Laptop</label>'
    + ' <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;box-sizing:border-box">'
    + '  <option>MacBook Pro 16"</option><option>MacBook Pro 14"</option><option>MacBook Air 15"</option><option>MacBook Air 13"</option><option>ThinkPad X1 Carbon</option>'
    + ' </select>'
    + '</div>'
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Monitor</label>'
    + ' <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;box-sizing:border-box">'
    + '  <option>27" 4K</option><option>24" Standard</option><option>27" 4K + Drawing Tablet</option><option>Dual 24" Setup</option><option>None</option>'
    + ' </select>'
    + '</div>'
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Peripherals</label>'
    + ' <div style="display:flex;flex-wrap:wrap;gap:6px">'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox" checked> Keyboard</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox" checked> Mouse</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Headset</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Webcam</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Docking Station</label>'
    + ' </div>'
    + '</div>'
    + '<div>'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">MDM Profile</label>'
    + ' <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;box-sizing:border-box">'
    + '  <option>Jamf Engineering</option><option>Jamf Sales</option><option>Jamf Design</option><option>Intune Corporate</option><option>Custom…</option>'
    + ' </select>'
    + '</div>',
  function() {
    showToast('success', 'Auto-assignment rule created new hires in this department will get hardware auto-provisioned');
  }, '<i class="fas fa-plus"></i> Create Rule', '#3B82F6');
}

// ========================================================================
// ONBOARDING Template & Config Actions
// ========================================================================
function addNewTemplate() {
  _openLifecycleModal('Create Workflow Template', '#7C3AED', 'fa-project-diagram', ''
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Template Name</label>'
    + ' <input type="text" placeholder="e.g. Customer Support, HR, Finance…" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;box-sizing:border-box">'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Base On Existing Template</label>'
    + ' <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;background:#fff">'
    + '  <option>Start from scratch</option><option>Clone Engineering template</option><option>Clone Sales & Marketing template</option><option>Clone Design & Product template</option>'
    + ' </select>'
    + '</div>'
    + '<div style="margin-bottom:18px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">SaaS Apps to Include</label>'
    + ' <div style="display:flex;gap:6px;flex-wrap:wrap">'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox" checked> Slack</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox" checked> Google Workspace</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox" checked> Zoom</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Jira</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> GitHub</label>'
    + '  <label style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:12px"><input type="checkbox"> Notion</label>'
    + ' </div>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'
    + ' <div><label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Automation Level</label>'
    + '  <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;background:#fff"><option>Full Auto</option><option>Semi-Auto (require approval)</option><option>Manual</option></select></div>'
    + ' <div><label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Hardware Kit</label>'
    + '  <select style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;background:#fff"><option>MacBook Air + Standard</option><option>MacBook Pro + Extended</option><option>No hardware</option></select></div>'
    + '</div>',
    function() { showToast('success', 'Workflow template created available for assignment to new hires'); });
}

function configureOnboarding() {
  _openLifecycleModal('Onboarding Configuration', '#7C3AED', 'fa-cog', ''
    + '<div style="display:flex;flex-direction:column;gap:14px">'
    + ' <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#F9FAFB;border-radius:10px">'
    + '  <div><strong style="font-size:13px">Auto-provisioning</strong><div style="font-size:11px;color:#6B7280">Automatically provision apps when onboarding starts</div></div>'
    + '  <label class="setting-toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>'
    + ' </div>'
    + ' <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#F9FAFB;border-radius:10px">'
    + '  <div><strong style="font-size:13px">Slack Notifications</strong><div style="font-size:11px;color:#6B7280">Send updates to #it-ops and manager DM</div></div>'
    + '  <label class="setting-toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>'
    + ' </div>'
    + ' <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#F9FAFB;border-radius:10px">'
    + '  <div><strong style="font-size:13px">Hardware Auto-Order</strong><div style="font-size:11px;color:#6B7280">Auto-order hardware from role template on onboard start</div></div>'
    + '  <label class="setting-toggle"><input type="checkbox"><span class="toggle-slider"></span></label>'
    + ' </div>'
    + ' <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#F9FAFB;border-radius:10px">'
    + '  <div><strong style="font-size:13px">Welcome Email</strong><div style="font-size:11px;color:#6B7280">Send Day-1 instructions email to new hire</div></div>'
    + '  <label class="setting-toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>'
    + ' </div>'
    + ' <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#F9FAFB;border-radius:10px">'
    + '  <div><strong style="font-size:13px">Buddy Auto-Assignment</strong><div style="font-size:11px;color:#6B7280">Assign a same-team buddy and send intro DM</div></div>'
    + '  <label class="setting-toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>'
    + ' </div>'
    + ' <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#F9FAFB;border-radius:10px">'
    + '  <div><strong style="font-size:13px">SOC2 Compliance Check</strong><div style="font-size:11px;color:#6B7280">Block completion until all compliance trainings done</div></div>'
    + '  <label class="setting-toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>'
    + ' </div>'
    + '</div>',
    function() { showToast('success', 'Onboarding configuration saved changes take effect for next onboard'); });
}

// ========================================================================
// LIFECYCLE MODAL HELPER (shared modal for all lifecycle sections)
// ========================================================================
function _openLifecycleModal(title, color, icon, bodyHtml, onConfirm, confirmText, confirmColor) {
  _closeLifecycleModal();
  var overlay = document.createElement('div');
  overlay.id = 'lifecycle-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;padding:16px';
  overlay.innerHTML = ''
    + '<div style="background:#fff;border-radius:16px;width:95%;max-width:560px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.2);overflow:hidden">'
    + ' <div style="padding:20px 28px;border-bottom:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;flex-shrink:0">'
    + '  <h2 style="font-size:18px;font-weight:800;color:#111827;margin:0;display:flex;align-items:center;gap:10px"><i class="fas ' + icon + '" style="color:' + color + '"></i> ' + title + '</h2>'
    + '  <button onclick="_closeLifecycleModal()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#6B7280;padding:4px"><i class="fas fa-times"></i></button>'
    + ' </div>'
    + ' <div style="padding:24px 28px;overflow-y:auto;flex:1">' + bodyHtml + '</div>'
    + ' <div id="lifecycle-modal-footer" style="padding:16px 28px;border-top:1px solid #E5E7EB;display:flex;justify-content:flex-end;gap:10px;background:#F9FAFB;flex-shrink:0">'
    + '  <button onclick="_closeLifecycleModal()" style="padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;background:#fff;border:1.5px solid #D1D5DB;color:#374151">Cancel</button>'
    + '  <button id="lifecycle-modal-confirm" style="padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;background:' + (confirmColor || color) + ';color:#fff;border:none;box-shadow:0 2px 8px rgba(0,0,0,0.1)">' + (confirmText || '<i class="fas fa-check"></i> Confirm') + '</button>'
    + ' </div>'
    + '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) _closeLifecycleModal(); });
  document.getElementById('lifecycle-modal-confirm').addEventListener('click', function() {
    try {
      if (onConfirm) onConfirm();
    } catch(err) {
      showToast('danger', 'Something went wrong. Please try again.');
    }
    _closeLifecycleModal();
  });
}

function _closeLifecycleModal() {
  var m = document.getElementById('lifecycle-modal');
  if (m) m.remove();
}


// ========================================================================
// INTEGRATION MANAGEMENT Connect / Configure / Disconnect
// ========================================================================

var _intgContext = SaaSIQ.state.intgContext = { card: null, name: '', icon: '', iconBg: '', users: '', lastSync: '' };

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
  document.getElementById('config-last-sync').textContent = _intgContext.lastSync || 'Last sync: ';

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
    showToast('success', _intgContext.name + ' sync complete all data up to date.');
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
// DISCOVERED APPS Mark Managed / Flag Shadow IT / Filter
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
      headline: 'Downsize to 40 seats save $7.2K/year',
      confidence: 'Confidence: 92% · Based on 55 days of usage data',
      currentSeats: '50 seats', currentHours: '120 design hrs',
      recSeats: '40 seats', recHours: '96 design hrs',
      savings: '$7.2K/yr',
      insights: [
        { icon: 'fa-chart-line', color: 'var(--blue)', text: '12 seats have had zero logins in 45+ days consistent non-usage pattern' },
        { icon: 'fa-users', color: 'var(--orange)', text: '76% utilization is below the 85% efficiency threshold for barter deals' },
        { icon: 'fa-clock', color: 'var(--primary)', text: 'Renewal in 310 days renegotiate early for 10% better terms' },
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
      headline: 'Renegotiate to 50 seats save $27K/year',
      confidence: 'Confidence: 96% · Based on 100 days of usage data',
      currentSeats: '75 seats', currentHours: '200 consulting hrs',
      recSeats: '50 seats', recHours: '134 consulting hrs',
      savings: '$27K/yr',
      insights: [
        { icon: 'fa-exclamation-circle', color: 'var(--red)', text: '33 of 75 seats (44%) have zero logins in 60 days critical waste' },
        { icon: 'fa-dollar-sign', color: 'var(--red)', text: 'You\'re committing $54K in consulting for licenses worth $66K tight margin' },
        { icon: 'fa-building', color: 'var(--blue)', text: 'Industry benchmark: similar companies use 55-65 seats for this team size' },
        { icon: 'fa-lightbulb', color: 'var(--green)', text: 'Downsizing saves 66 consulting hours ($27K) reinvest in high-impact projects' }
      ],
      actions: [
        { num: 1, text: 'Audit 33 inactive users remove or reassign licenses immediately' },
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
      headline: 'Healthy deal recommend renewing at current terms',
      confidence: 'Confidence: 98% · Based on 38 days of usage data',
      currentSeats: '20 seats', currentHours: '160 content hrs',
      recSeats: '20 seats', recHours: '160 content hrs',
      savings: '$0 (already optimized)',
      insights: [
        { icon: 'fa-check-circle', color: 'var(--green)', text: '90% utilization well above the 85% efficiency threshold' },
        { icon: 'fa-thumbs-up', color: 'var(--green)', text: 'Positive ROI: $24K software value received for $18K in services' },
        { icon: 'fa-chart-line', color: 'var(--blue)', text: 'Usage trending upward 2 remaining seats likely to be filled within 60 days' },
        { icon: 'fa-star', color: 'var(--orange)', text: 'This is your most cost-effective partnership model for future deals' }
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
  
  // Initialize consolidated tab bar for default view (Command Center)
  renderConsolidatedTabs('command-center', 'dashboard-home');

  // Ensure page-dashboard is visible if hash is #dashboard
  var hash = window.location.hash.replace('#', '');
  if (hash === 'dashboard') {
    var pageDash = document.getElementById('page-dashboard');
    if (pageDash && !pageDash.classList.contains('active')) {
      document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
      pageDash.classList.add('active');
    }
  }
});


/* ==========================================================================
  NESTED DRILL-DOWN ENGINE Org → Department → Team → Members
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
        id: 'eng-platform', name: 'Platform Squad', icon: 'fas fa-cubes',
        iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
        users: 38, apps: 14, adoption: 91, activeUsers: 35, avgLogins: 28.4,
        spend: '$85.8K', waste: '$6.3K',
        topApps: ['AWS', 'GitHub', 'Datadog'],
        members: [
          { name: 'Arjun Mehta', role: 'Squad Lead', apps: 12, logins: 32, status: 'active', avatar: '#3B82F6' },
          { name: 'Priya Sharma', role: 'Sr. Engineer', apps: 10, logins: 28, status: 'active', avatar: '#8B5CF6' },
          { name: 'Rahul K.', role: 'Engineer', apps: 8, logins: 25, status: 'active', avatar: '#10B981' },
          { name: 'Sneha D.', role: 'Engineer', apps: 9, logins: 30, status: 'active', avatar: '#F59E0B' },
          { name: 'Vikram P.', role: 'Engineer', apps: 5, logins: 12, status: 'idle', avatar: '#EF4444' },
          { name: 'Kiran R.', role: 'Intern', apps: 3, logins: 4, status: 'inactive', avatar: '#6366F1' }
        ],
        aiInsight: 'Platform Squad has 91% adoption highest in Engineering. Vikram P. has used only 5 of 14 apps in 30 days. Consider reassigning 2 AWS seats from inactive interns.'
      },
      {
        id: 'eng-growth', name: 'Growth Pod', icon: 'fas fa-rocket',
        iconBg: 'rgba(168,85,247,0.1)', iconColor: '#A855F7',
        users: 32, apps: 11, adoption: 88, activeUsers: 28, avgLogins: 26.1,
        spend: '$54.6K', waste: '$5.4K',
        topApps: ['Figma', 'GitHub', 'Vercel'],
        members: [
          { name: 'Amit Joshi', role: 'Pod Lead', apps: 11, logins: 30, status: 'active', avatar: '#A855F7' },
          { name: 'Deepa M.', role: 'Sr. Engineer', apps: 9, logins: 27, status: 'active', avatar: '#EC4899' },
          { name: 'Rohan S.', role: 'Engineer', apps: 8, logins: 22, status: 'active', avatar: '#14B8A6' },
          { name: 'Neha K.', role: 'Designer', apps: 7, logins: 18, status: 'idle', avatar: '#F59E0B' }
        ],
        aiInsight: 'Growth Pod heavily uses Figma (100% adoption) but only 40% use Storybook. Consider consolidating or dropping Storybook license.'
      },
      {
        id: 'eng-infra', name: 'Infrastructure & SRE', icon: 'fas fa-cloud',
        iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
        users: 18, apps: 16, adoption: 92, activeUsers: 17, avgLogins: 31.2,
        spend: '$67.2K', waste: '$10.8K',
        topApps: ['AWS', 'Terraform', 'PagerDuty'],
        members: [
          { name: 'Suresh K.', role: 'SRE Lead', apps: 16, logins: 35, status: 'active', avatar: '#10B981' },
          { name: 'Ananya R.', role: 'SRE', apps: 14, logins: 32, status: 'active', avatar: '#3B82F6' },
          { name: 'Manoj V.', role: 'Infra Engineer', apps: 12, logins: 28, status: 'active', avatar: '#F97316' }
        ],
        aiInsight: 'Infra & SRE has the highest per-user spend ($3.7K/user). 3 monitoring tools overlap (Datadog + New Relic + PagerDuty) consolidating saves $10.8K/yr.'
      },
      {
        id: 'eng-data', name: 'Data & Analytics', icon: 'fas fa-database',
        iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
        users: 22, apps: 10, adoption: 77, activeUsers: 17, avgLogins: 20.3,
        spend: '$25.2K', waste: '$6.6K',
        topApps: ['Snowflake', 'dbt', 'Airflow'],
        members: [
          { name: 'Ravi T.', role: 'Data Lead', apps: 10, logins: 26, status: 'active', avatar: '#F59E0B' },
          { name: 'Kavya M.', role: 'Data Engineer', apps: 8, logins: 22, status: 'active', avatar: '#EC4899' },
          { name: 'Harish B.', role: 'Data Engineer', apps: 6, logins: 14, status: 'idle', avatar: '#6366F1' },
          { name: 'Pooja N.', role: 'Analyst', apps: 4, logins: 8, status: 'inactive', avatar: '#EF4444' }
        ],
        aiInsight: 'Data & Analytics has 5 unused Snowflake compute credits. Pooja N. hasn\'t logged into any tool in 21 days possible offboarding candidate.'
      },
      {
        id: 'eng-quality', name: 'Quality & Reliability', icon: 'fas fa-vial',
        iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444',
        users: 16, apps: 8, adoption: 75, activeUsers: 12, avgLogins: 18.6,
        spend: '$9.6K', waste: '$2.4K',
        topApps: ['Jira', 'BrowserStack', 'Postman'],
        members: [
          { name: 'Sanjay L.', role: 'QE Lead', apps: 8, logins: 24, status: 'active', avatar: '#EF4444' },
          { name: 'Meera G.', role: 'QE Specialist', apps: 6, logins: 20, status: 'active', avatar: '#8B5CF6' },
          { name: 'Anil D.', role: 'QE Specialist', apps: 5, logins: 10, status: 'idle', avatar: '#14B8A6' }
        ],
        aiInsight: 'Quality & Reliability has 4 unused BrowserStack licenses. Consider shared floating license model instead of individual seats.'
      },
      {
        id: 'eng-mobile', name: 'Mobile Experience', icon: 'fas fa-mobile-alt',
        iconBg: 'rgba(99,102,241,0.1)', iconColor: '#6366F1',
        users: 16, apps: 9, adoption: 81, activeUsers: 13, avgLogins: 22.8,
        spend: '$13.8K', waste: '$2.1K',
        topApps: ['Xcode Cloud', 'Firebase', 'Bitrise'],
        members: [
          { name: 'Tarun S.', role: 'Squad Lead', apps: 9, logins: 28, status: 'active', avatar: '#6366F1' },
          { name: 'Divya P.', role: 'Engineer', apps: 7, logins: 24, status: 'active', avatar: '#EC4899' },
          { name: 'Nikhil M.', role: 'Engineer', apps: 7, logins: 20, status: 'active', avatar: '#10B981' }
        ],
        aiInsight: 'Mobile Experience is well-optimized. Firebase plan could downgrade from Blaze to Spark saves $2.1K/yr based on actual usage.'
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
        id: 'sales-revenue', name: 'Revenue Team', icon: 'fas fa-handshake',
        iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
        users: 42, apps: 10, adoption: 78, activeUsers: 33, avgLogins: 20.6,
        spend: '$80.4K', waste: '$12.6K',
        topApps: ['Salesforce', 'Gong', 'LinkedIn Sales Nav'],
        members: [
          { name: 'Rajesh V.', role: 'VP Revenue', apps: 8, logins: 26, status: 'active', avatar: '#10B981' },
          { name: 'Anita S.', role: 'Account Executive', apps: 7, logins: 24, status: 'active', avatar: '#3B82F6' },
          { name: 'Mohit K.', role: 'Account Executive', apps: 6, logins: 18, status: 'active', avatar: '#F59E0B' },
          { name: 'Dinesh R.', role: 'Sales Manager', apps: 6, logins: 22, status: 'active', avatar: '#A855F7' },
          { name: 'Simran T.', role: 'SDR', apps: 4, logins: 12, status: 'idle', avatar: '#EF4444' },
          { name: 'Arun M.', role: 'SDR', apps: 3, logins: 8, status: 'idle', avatar: '#6366F1' }
        ],
        aiInsight: 'Revenue Team has 5 unused Gong licenses and 3 unused LinkedIn Sales Nav seats. Simran and Arun have low activity reassign or reclaim seats.'
      },
      {
        id: 'sales-growth', name: 'Growth & Demand Gen', icon: 'fas fa-bullhorn',
        iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444',
        users: 28, apps: 12, adoption: 64, activeUsers: 18, avgLogins: 14.2,
        spend: '$67.2K', waste: '$15.6K',
        topApps: ['HubSpot', 'Google Ads', 'Semrush'],
        members: [
          { name: 'Priyanka B.', role: 'Marketing Head', apps: 12, logins: 20, status: 'active', avatar: '#EF4444' },
          { name: 'Karthik N.', role: 'SEO Specialist', apps: 8, logins: 16, status: 'active', avatar: '#3B82F6' },
          { name: 'Rekha S.', role: 'Content Lead', apps: 4, logins: 10, status: 'idle', avatar: '#10B981' }
        ],
        aiInsight: 'Growth & Demand Gen has 10 unused HubSpot seats and overlapping SEO tools (Semrush + Ahrefs + Moz). Consolidating saves $15.6K/yr.'
      },
      {
        id: 'sales-ops', name: 'Revenue Operations', icon: 'fas fa-cog',
        iconBg: 'rgba(99,102,241,0.1)', iconColor: '#6366F1',
        users: 19, apps: 7, adoption: 68, activeUsers: 13, avgLogins: 19.8,
        spend: '$24.6K', waste: '$5.4K',
        topApps: ['Salesforce', 'Clari', 'Tableau'],
        members: [
          { name: 'Santosh J.', role: 'RevOps Manager', apps: 7, logins: 24, status: 'active', avatar: '#6366F1' },
          { name: 'Bhagyashree P.', role: 'Analyst', apps: 5, logins: 16, status: 'active', avatar: '#EC4899' }
        ],
        aiInsight: 'Revenue Operations has Clari + Tableau for forecasting. Consolidating to one tool saves $5.4K/yr.'
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
        id: 'design-experience', name: 'Experience Design', icon: 'fas fa-pen-nib',
        iconBg: 'rgba(236,72,153,0.1)', iconColor: '#EC4899',
        users: 20, apps: 10, adoption: 55, activeUsers: 11, avgLogins: 9.8,
        spend: '$40.2K', waste: '$7.2K',
        topApps: ['Figma', 'Adobe CC', 'Miro'],
        members: [
          { name: 'Ankita R.', role: 'Design Lead', apps: 8, logins: 16, status: 'active', avatar: '#EC4899' },
          { name: 'Shruti V.', role: 'UX Designer', apps: 6, logins: 14, status: 'active', avatar: '#A855F7' },
          { name: 'Varun D.', role: 'Visual Designer', apps: 6, logins: 12, status: 'active', avatar: '#3B82F6' },
          { name: 'Nitin P.', role: 'Researcher', apps: 3, logins: 6, status: 'idle', avatar: '#F97316' },
          { name: 'Pallavi J.', role: 'Designer', apps: 4, logins: 6, status: 'idle', avatar: '#10B981' }
        ],
        aiInsight: 'Experience Design pays for Figma + Sketch + Adobe XD. 100% of actual work happens in Figma. Dropping Sketch and XD saves $3.6K/yr. 4 inactive members across Maze and UserTesting.'
      },
      {
        id: 'design-product', name: 'Product Management', icon: 'fas fa-project-diagram',
        iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
        users: 14, apps: 7, adoption: 42, activeUsers: 6, avgLogins: 8.6,
        spend: '$15.6K', waste: '$2.4K',
        topApps: ['Notion', 'Jira', 'Productboard'],
        members: [
          { name: 'Gaurav M.', role: 'PM Lead', apps: 7, logins: 14, status: 'active', avatar: '#3B82F6' },
          { name: 'Shalini K.', role: 'Product Manager', apps: 5, logins: 10, status: 'active', avatar: '#F59E0B' },
          { name: 'Vishal T.', role: 'Assoc. PM', apps: 3, logins: 4, status: 'inactive', avatar: '#EF4444' }
        ],
        aiInsight: 'Product Management has lowest adoption (42%). Vishal T. hasn\'t logged in for 18 days. Productboard has 8 unused seats downgrade plan.'
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
        aiInsight: 'Accounts team is well-optimized. QuickBooks usage is declining consider migrating fully to Zoho Books to save $0.9K/yr.'
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
        aiInsight: 'Tax team is lean. Tally usage dropped 60% after ClearTax adoption consider full migration.'
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
        id: 'sup-cx', name: 'Customer Experience', icon: 'fas fa-comments',
        iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
        users: 36, apps: 6, adoption: 69, activeUsers: 25, avgLogins: 13.8,
        spend: '$36.0K', waste: '$7.8K',
        topApps: ['Zendesk', 'Intercom', 'Freshdesk', 'Jira', 'Confluence'],
        members: [
          { name: 'Geeta S.', role: 'CX Lead', apps: 5, logins: 20, status: 'active', avatar: '#3B82F6' },
          { name: 'Manoj T.', role: 'Senior Specialist', apps: 6, logins: 18, status: 'active', avatar: '#A855F7' },
          { name: 'Raman K.', role: 'Support Specialist', apps: 3, logins: 16, status: 'active', avatar: '#10B981' },
          { name: 'Isha R.', role: 'Support Specialist', apps: 5, logins: 14, status: 'active', avatar: '#EF4444' },
          { name: 'Sonal D.', role: 'Support Specialist', apps: 2, logins: 6, status: 'idle', avatar: '#F59E0B' }
        ],
        aiInsight: 'Customer Experience uses Zendesk + Intercom + Freshdesk 3 tools doing the same thing. Consolidating to Zendesk alone saves $4.2K/yr. 2 Jira seats unused reclaim and reassign.'
      },
      {
        id: 'sup-success', name: 'Customer Success', icon: 'fas fa-star',
        iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
        users: 16, apps: 5, adoption: 50, activeUsers: 8, avgLogins: 9.6,
        spend: '$19.2K', waste: '$3.6K',
        topApps: ['Gainsight', 'Salesforce', 'Slack'],
        members: [
          { name: 'Rashmi P.', role: 'CS Manager', apps: 5, logins: 14, status: 'active', avatar: '#10B981' },
          { name: 'Aditya V.', role: 'Success Specialist', apps: 4, logins: 10, status: 'active', avatar: '#F97316' },
          { name: 'Megha K.', role: 'Success Specialist', apps: 2, logins: 4, status: 'inactive', avatar: '#EF4444' }
        ],
        aiInsight: 'Customer Success has 50% adoption 8 users barely touch Gainsight. Megha hasn\'t logged in for 30 days. Downgrade Gainsight plan to save $3.6K/yr.'
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
        id: 'hr-talent', name: 'Talent & Growth', icon: 'fas fa-seedling',
        iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6',
        users: 10, apps: 6, adoption: 60, activeUsers: 6, avgLogins: 12.4,
        spend: '$12.6K', waste: '$1.8K',
        topApps: ['LinkedIn Recruiter', 'Greenhouse', 'Calendly'],
        members: [
          { name: 'Pragya M.', role: 'Talent Lead', apps: 6, logins: 18, status: 'active', avatar: '#3B82F6' },
          { name: 'Siddharth K.', role: 'People Partner', apps: 4, logins: 14, status: 'active', avatar: '#10B981' },
          { name: 'Tanvi R.', role: 'People Partner', apps: 3, logins: 6, status: 'idle', avatar: '#F59E0B' }
        ],
        aiInsight: 'Talent & Growth has 4 LinkedIn Recruiter seats but only 2 active members using them. Reclaim 2 seats to save $1.8K/yr.'
      },
      {
        id: 'hr-people', name: 'People & Culture', icon: 'fas fa-users-cog',
        iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981',
        users: 12, apps: 7, adoption: 58, activeUsers: 7, avgLogins: 10.2,
        spend: '$14.4K', waste: '$1.8K',
        topApps: ['BambooHR', 'Greythr', 'Darwinbox'],
        members: [
          { name: 'Swati J.', role: 'People Lead', apps: 7, logins: 16, status: 'active', avatar: '#10B981' },
          { name: 'Ajay P.', role: 'People Partner', apps: 5, logins: 12, status: 'active', avatar: '#6366F1' }
        ],
        aiInsight: 'People & Culture uses 3 HRMS tools (BambooHR + Greythr + Darwinbox). Standardizing on Darwinbox saves $1.8K/yr.'
      },
      {
        id: 'hr-workplace', name: 'Workplace & Operations', icon: 'fas fa-building',
        iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B',
        users: 13, apps: 5, adoption: 46, activeUsers: 6, avgLogins: 8.4,
        spend: '$10.2K', waste: '$1.2K',
        topApps: ['Notion', 'Google Workspace', 'Envoy'],
        members: [
          { name: 'Gayatri S.', role: 'Workplace Lead', apps: 5, logins: 12, status: 'active', avatar: '#F59E0B' },
          { name: 'Vijay N.', role: 'Operations Coordinator', apps: 3, logins: 8, status: 'idle', avatar: '#EF4444' }
        ],
        aiInsight: 'Workplace & Operations has lowest adoption at 46%. 7 members have zero app logins this month. Consider reducing seat count.'
      }
    ]
  }
};

// ── SaaS App Catalog central metadata for member-level app views ──
var saasAppCatalog = {
  'AWS':        { icon: 'fab fa-aws',       color: '#FF9900', cat: 'Infrastructure', cost: 42 },
  'GitHub':      { icon: 'fab fa-github',      color: '#24292E', cat: 'Dev Tools',    cost: 21 },
  'Datadog':      { icon: 'fas fa-dog',       color: '#632CA6', cat: 'Monitoring',   cost: 31 },
  'Jira':       { icon: 'fab fa-jira',       color: '#0052CC', cat: 'Project Mgmt',  cost: 14 },
  'Slack':       { icon: 'fab fa-slack',      color: '#4A154B', cat: 'Communication',  cost: 13 },
  'Confluence':    { icon: 'fab fa-confluence',    color: '#172B4D', cat: 'Documentation',  cost: 11 },
  'Docker':      { icon: 'fab fa-docker',      color: '#2496ED', cat: 'Dev Tools',    cost: 9 },
  'Notion':      { icon: 'fas fa-sticky-note',   color: '#000000', cat: 'Productivity',  cost: 10 },
  'Postman':      { icon: 'fas fa-paper-plane',   color: '#FF6C37', cat: 'Dev Tools',    cost: 15 },
  'PagerDuty':     { icon: 'fas fa-bell',       color: '#06AC38', cat: 'Monitoring',   cost: 25 },
  'Terraform':     { icon: 'fas fa-cubes',      color: '#7B42BC', cat: 'Infrastructure', cost: 35 },
  'Figma':       { icon: 'fab fa-figma',      color: '#F24E1E', cat: 'Design',     cost: 15 },
  'Vercel':      { icon: 'fas fa-bolt',       color: '#000000', cat: 'Infrastructure', cost: 20 },
  'Storybook':     { icon: 'fas fa-book-open',    color: '#FF4785', cat: 'Dev Tools',    cost: 0 },
  'New Relic':     { icon: 'fas fa-chart-area',    color: '#008C99', cat: 'Monitoring',   cost: 28 },
  'Jenkins':      { icon: 'fas fa-hard-hat',     color: '#D33833', cat: 'CI/CD',      cost: 0 },
  'CircleCI':     { icon: 'fas fa-circle-notch',   color: '#343434', cat: 'CI/CD',      cost: 18 },
  'Sentry':      { icon: 'fas fa-bug',       color: '#362D59', cat: 'Monitoring',   cost: 26 },
  'VS Code':      { icon: 'fas fa-code',       color: '#007ACC', cat: 'Dev Tools',    cost: 0 },
  '1Password':     { icon: 'fas fa-lock',       color: '#0572EC', cat: 'Security',    cost: 8 },
  'Snowflake':     { icon: 'fas fa-snowflake',    color: '#29B5E8', cat: 'Data',      cost: 48 },
  'dbt':        { icon: 'fas fa-database',     color: '#FF694B', cat: 'Data',      cost: 12 },
  'Airflow':      { icon: 'fas fa-wind',       color: '#017CEE', cat: 'Data',      cost: 0 },
  'Looker':      { icon: 'fas fa-eye',       color: '#4285F4', cat: 'Analytics',    cost: 30 },
  'BrowserStack':   { icon: 'fas fa-globe',      color: '#F5A623', cat: 'Testing',     cost: 19 },
  'Selenium':     { icon: 'fas fa-vial',       color: '#43B02A', cat: 'Testing',     cost: 0 },
  'TestRail':     { icon: 'fas fa-clipboard-check', color: '#65C179', cat: 'Testing',     cost: 16 },
  'Appium':      { icon: 'fas fa-mobile-alt',    color: '#662D91', cat: 'Testing',     cost: 0 },
  'Firebase':     { icon: 'fas fa-fire',       color: '#FFCA28', cat: 'Infrastructure', cost: 22 },
  'Xcode Cloud':    { icon: 'fab fa-apple',      color: '#333333', cat: 'CI/CD',      cost: 0 },
  'Salesforce':    { icon: 'fab fa-salesforce',    color: '#00A1E0', cat: 'CRM',       cost: 75 },
  'HubSpot':      { icon: 'fab fa-hubspot',     color: '#FF7A59', cat: 'CRM',       cost: 50 },
  'Outreach':     { icon: 'fas fa-bullhorn',     color: '#5951FF', cat: 'Sales',      cost: 40 },
  'ZoomInfo':     { icon: 'fas fa-search-dollar',  color: '#21B6FF', cat: 'Sales',      cost: 35 },
  'LinkedIn Sales Nav':{ icon: 'fab fa-linkedin',     color: '#0077B5', cat: 'Sales',      cost: 80 },
  'Gong':       { icon: 'fas fa-microphone',    color: '#7A5FEC', cat: 'Sales',      cost: 30 },
  'Google Analytics': { icon: 'fab fa-google',      color: '#E37400', cat: 'Analytics',    cost: 0 },
  'SEMrush':      { icon: 'fas fa-search',      color: '#FF622D', cat: 'Marketing',    cost: 20 },
  'Marketo':      { icon: 'fas fa-mail-bulk',    color: '#5C4C9F', cat: 'Marketing',    cost: 45 },
  'Intercom':     { icon: 'fas fa-comment-dots',   color: '#1F8DED', cat: 'Support',     cost: 32 },
  'Calendly':     { icon: 'fas fa-calendar-check',  color: '#006BFF', cat: 'Productivity',  cost: 10 },
  'Google Workspace': { icon: 'fab fa-google',      color: '#4285F4', cat: 'Productivity',  cost: 12 },
  'DocuSign':     { icon: 'fas fa-file-signature',  color: '#FFCD00', cat: 'Productivity',  cost: 25 },
  'Zoho Books':    { icon: 'fas fa-receipt',     color: '#E42527', cat: 'Finance',     cost: 18 },
  'Razorpay':     { icon: 'fas fa-money-bill-wave', color: '#2D69F6', cat: 'Finance',     cost: 0 },
  'QuickBooks':    { icon: 'fas fa-calculator',    color: '#2CA01C', cat: 'Finance',     cost: 22 },
  'Excel':       { icon: 'fas fa-file-excel',    color: '#217346', cat: 'Productivity',  cost: 0 },
  'Tableau':      { icon: 'fas fa-chart-bar',    color: '#E97627', cat: 'Analytics',    cost: 35 },
  'Adaptive Insights': { icon: 'fas fa-chart-line',    color: '#005EB8', cat: 'Finance',     cost: 40 },
  'ClearTax':     { icon: 'fas fa-file-invoice',   color: '#2D60FF', cat: 'Finance',     cost: 15 },
  'Zoho':       { icon: 'fas fa-th',        color: '#E42527', cat: 'Productivity',  cost: 10 },
  'Tally':       { icon: 'fas fa-balance-scale',  color: '#0077C0', cat: 'Finance',     cost: 8 },
  'Zendesk':      { icon: 'fas fa-headset',     color: '#03363D', cat: 'Support',     cost: 29 },
  'Freshdesk':     { icon: 'fas fa-life-ring',    color: '#2AB467', cat: 'Support',     cost: 18 },
  'Gainsight':     { icon: 'fas fa-trophy',      color: '#FF5C35', cat: 'Support',     cost: 50 },
  'LinkedIn Recruiter':{ icon: 'fab fa-linkedin',     color: '#0077B5', cat: 'HR',       cost: 90 },
  'Greenhouse':    { icon: 'fas fa-seedling',     color: '#3AB549', cat: 'HR',       cost: 35 },
  'BambooHR':     { icon: 'fas fa-leaf',       color: '#73C41D', cat: 'HR',       cost: 22 },
  'Greythr':      { icon: 'fas fa-user-clock',    color: '#4F4FD9', cat: 'HR',       cost: 12 },
  'Darwinbox':     { icon: 'fas fa-box-open',     color: '#2B52F5', cat: 'HR',       cost: 18 },
  'Envoy':       { icon: 'fas fa-door-open',    color: '#EA553D', cat: 'Workplace',    cost: 10 },
  'Adobe CC':     { icon: 'fab fa-adobe',      color: '#FF0000', cat: 'Design',     cost: 55 },
  'Miro':       { icon: 'fas fa-object-group',   color: '#FFD02F', cat: 'Design',     cost: 10 },
  'Maze':       { icon: 'fas fa-puzzle-piece',   color: '#6366F1', cat: 'Design',     cost: 16 },
  'UserTesting':    { icon: 'fas fa-user-check',    color: '#00B77A', cat: 'Design',     cost: 40 },
  'Sketch':      { icon: 'fab fa-sketch',      color: '#F7B500', cat: 'Design',     cost: 12 },
  'Adobe XD':     { icon: 'fab fa-adobe',      color: '#FF61F6', cat: 'Design',     cost: 11 },
  'Productboard':   { icon: 'fas fa-columns',     color: '#0071F2', cat: 'Product',     cost: 30 },
  'Stripe':      { icon: 'fab fa-stripe',      color: '#635BFF', cat: 'Finance',     cost: 0 }
};

// Common apps per department used to expand team topApps to a full allApps list
var deptCommonApps = {
  engineering: ['Slack', 'Jira', 'Confluence', 'Docker', 'Notion', '1Password', 'Postman', 'VS Code', 'Sentry', 'Jenkins', 'New Relic', 'CircleCI', 'Google Workspace'],
  sales:    ['Slack', 'Salesforce', 'Google Workspace', 'Calendly', 'DocuSign', 'Notion', '1Password', 'Zoom', 'Excel'],
  design:   ['Slack', 'Notion', 'Google Workspace', 'Jira', '1Password', 'Maze', 'UserTesting', 'Sketch', 'Adobe XD'],
  finance:   ['Slack', 'Google Workspace', 'Notion', '1Password', 'Excel', 'Stripe'],
  support:   ['Slack', 'Jira', 'Confluence', 'Google Workspace', 'Notion', '1Password', 'Calendly'],
  hr:     ['Slack', 'Google Workspace', 'Notion', '1Password', 'Excel', 'Calendly', 'DocuSign']
};

/**
 * Generate the full app list for a team, expanding topApps with common dept apps.
 */
function getTeamAllApps(team, deptKey) {
  var base = team.topApps.slice();
  var common = deptCommonApps[deptKey] || [];
  for (var i = 0; i < common.length; i++) {
    if (base.indexOf(common[i]) === -1) base.push(common[i]);
    if (base.length >= team.apps) break;
  }
  return base;
}

/**
 * Generate per-member app detail list.
 * Members "use" the first N apps from the team's full list (simulated).
 */
function getMemberAppDetails(team, member, deptKey) {
  var allApps = getTeamAllApps(team, deptKey);
  var details = [];
  var usedCount = member.apps;
  var now = Date.now();
  for (var i = 0; i < allApps.length; i++) {
    var appName = allApps[i];
    var catalog = saasAppCatalog[appName] || { icon: 'fas fa-cube', color: '#6B7280', cat: 'Other', cost: 10 };
    var isUsed = i < usedCount;
    var daysAgo, lastUsed, weeklyLogins;
    if (isUsed) {
      if (member.status === 'active') {
        daysAgo = Math.floor(Math.random() * 3);
        weeklyLogins = Math.max(1, Math.round(member.logins * (1 - i * 0.08)));
      } else if (member.status === 'idle') {
        daysAgo = 7 + Math.floor(Math.random() * 14);
        weeklyLogins = Math.max(1, Math.round(member.logins * 0.3 * (1 - i * 0.1)));
      } else {
        daysAgo = 21 + Math.floor(Math.random() * 30);
        weeklyLogins = 0;
      }
      lastUsed = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : daysAgo + 'd ago';
    } else {
      lastUsed = 'Never';
      weeklyLogins = 0;
    }
    details.push({
      name: appName,
      icon: catalog.icon,
      color: catalog.color,
      category: catalog.cat,
      monthlyCost: catalog.cost,
      status: isUsed ? (member.status === 'inactive' ? 'dormant' : (member.status === 'idle' && daysAgo > 14 ? 'rare' : 'active')) : 'unused',
      lastUsed: lastUsed,
      weeklyLogins: weeklyLogins
    });
  }
  return details;
}

// Current drill state tracking
var drillState = { dept: null, team: null, memberIdx: null };

function openDeptDrill(deptId) {
  var dept = drillData[deptId];
  if (!dept) return;
  drillState = { dept: deptId, team: null, memberIdx: null };
  renderDeptView(dept, deptId);
  var overlay = document.getElementById('drill-overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrill() {
  var overlay = document.getElementById('drill-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  drillState = { dept: null, team: null, memberIdx: null };
}

function renderDeptView(dept, deptId) {
  var panel = document.getElementById('drill-panel');
  if (!panel) return;

  var adoptionColor = dept.adoption >= 75 ? 'var(--green)' : dept.adoption >= 55 ? 'var(--orange)' : 'var(--red)';

  var html = ''
    + '<div class="drill-breadcrumb">'
    + ' <a onclick="closeDrill()">TechCorp India</a>'
    + ' <span class="sep"><i class="fas fa-chevron-right"></i></span>'
    + ' <span class="current">' + dept.name + '</span>'
    + '</div>'
    + '<div class="drill-header">'
    + ' <div class="drill-header-left">'
    + '  <div class="drill-header-icon" style="background:' + dept.iconBg + ';color:' + dept.iconColor + '"><i class="' + dept.icon + '"></i></div>'
    + '  <div>'
    + '   <h2>' + dept.name + '</h2>'
    + '   <div class="drill-subtitle">' + dept.teams.length + ' teams · ' + dept.users + ' members · ' + dept.apps + ' apps</div>'
    + '  </div>'
    + ' </div>'
    + ' <button class="drill-close" onclick="closeDrill()" title="Close"><i class="fas fa-times"></i></button>'
    + '</div>'
    + '<div class="drill-kpi-strip">'
    + ' <div class="drill-kpi"><span class="kpi-val" style="color:' + adoptionColor + '">' + dept.adoption + '%</span><span class="kpi-label">Adoption</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val">' + dept.activeUsers + '/' + dept.users + '</span><span class="kpi-label">Active Users</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val">' + dept.avgLogins + '</span><span class="kpi-label">Avg Logins/Wk</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val" style="color:var(--red)">' + (dept.waste || '') + '</span><span class="kpi-label">Waste</span></div>'
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
      + ' <div class="team-head">'
      + '  <div class="team-icon" style="background:' + team.iconBg + ';color:' + team.iconColor + '"><i class="' + team.icon + '"></i></div>'
      + '  <div>'
      + '   <div class="team-name">' + team.name + '</div>'
      + '   <div class="team-meta">' + team.users + ' members · ' + team.apps + ' apps</div>'
      + '  </div>'
      + ' </div>'
      + ' <div class="team-bar"><div class="team-bar-fill" style="width:' + team.adoption + '%;background:' + tColor + '"></div></div>'
      + ' <div class="team-stats">'
      + '  <div><span>Adoption</span> <strong style="color:' + tColor + '">' + team.adoption + '%</strong></div>'
      + '  <div><span>Active</span> <strong>' + team.activeUsers + '/' + team.users + '</strong></div>'
      + '  <div><span>Spend</span> <strong>' + team.spend + '</strong></div>'
      + ' </div>'
      + ' <i class="fas fa-chevron-right drill-arrow"></i>'
      + '</div>';
  });
  html += '</div>';

  // AI insight for the whole dept
  var topWasteTeam = dept.teams.reduce(function(a, b) { return parseFloat(a.waste.replace(/[^0-9.]/g,'')) > parseFloat(b.waste.replace(/[^0-9.]/g,'')) ? a : b; });
  html += '<div class="drill-ai-insight">'
    + ' <i class="fas fa-robot"></i>'
    + ' <span><strong>AI Insight:</strong> ' + dept.name + ' has ' + dept.teams.length + ' teams. <strong>' + topWasteTeam.name + '</strong> has the highest waste (' + topWasteTeam.waste + '). Click any team to see member-level details and optimization opportunities.</span>'
    + '</div>';

  panel.innerHTML = html;
}

function openTeamDrill(deptId, teamId) {
  var dept = drillData[deptId];
  if (!dept) return;
  var team = dept.teams.find(function(t) { return t.id === teamId; });
  if (!team) return;
  drillState = { dept: deptId, team: teamId, memberIdx: null };
  renderTeamView(dept, team, deptId);
}

function openMemberDrill(deptId, teamId, memberIdx) {
  var dept = drillData[deptId];
  if (!dept) return;
  var team = dept.teams.find(function(t) { return t.id === teamId; });
  if (!team || !team.members[memberIdx]) return;
  drillState = { dept: deptId, team: teamId, memberIdx: memberIdx };
  renderMemberView(dept, team, team.members[memberIdx], deptId, memberIdx);
}

function renderMemberView(dept, team, member, deptId, memberIdx) {
  var panel = document.getElementById('drill-panel');
  if (!panel) return;
  panel.scrollTop = 0;

  var appDetails = getMemberAppDetails(team, member, deptId);
  var usedApps = appDetails.filter(function(a) { return a.status !== 'unused'; });
  var unusedApps = appDetails.filter(function(a) { return a.status === 'unused'; });
  var totalSpend = appDetails.reduce(function(s, a) { return s + a.monthlyCost; }, 0);
  var wastedSpend = unusedApps.reduce(function(s, a) { return s + a.monthlyCost; }, 0);
  var initials = member.name.split(' ').map(function(n) { return n[0]; }).join('').substring(0,2);
  var statusLabel = member.status === 'active' ? 'Active' : member.status === 'idle' ? 'Idle' : 'Inactive';
  var statusColor = member.status === 'active' ? '#10B981' : member.status === 'idle' ? '#F59E0B' : '#EF4444';

  var html = ''
    + '<div class="drill-breadcrumb">'
    + ' <a onclick="closeDrill()">TechCorp India</a>'
    + ' <span class="sep"><i class="fas fa-chevron-right"></i></span>'
    + ' <a onclick="openDeptDrill(\'' + deptId + '\')">' + dept.name + '</a>'
    + ' <span class="sep"><i class="fas fa-chevron-right"></i></span>'
    + ' <a onclick="openTeamDrill(\'' + deptId + '\',\'' + team.id + '\')">' + team.name + '</a>'
    + ' <span class="sep"><i class="fas fa-chevron-right"></i></span>'
    + ' <span class="current">' + member.name + '</span>'
    + '</div>'
    + '<div class="drill-header">'
    + ' <div class="drill-header-left">'
    + '  <div class="drill-header-icon" style="background:' + member.avatar + ';color:#fff;font-weight:700;font-size:18px;display:flex;align-items:center;justify-content:center">' + initials + '</div>'
    + '  <div>'
    + '   <h2>' + member.name + '</h2>'
    + '   <div class="drill-subtitle">' + member.role + ' · ' + team.name + ' · ' + dept.name + '</div>'
    + '  </div>'
    + ' </div>'
    + ' <button class="drill-close" onclick="closeDrill()" title="Close"><i class="fas fa-times"></i></button>'
    + '</div>';

  // KPI strip
  html += '<div class="drill-kpi-strip">'
    + ' <div class="drill-kpi"><span class="kpi-val">' + member.apps + '/' + team.apps + '</span><span class="kpi-label">Apps Used</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val">' + member.logins + '</span><span class="kpi-label">Logins/Wk</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val" style="color:' + statusColor + '">' + statusLabel + '</span><span class="kpi-label">Status</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val">$' + totalSpend + '</span><span class="kpi-label">Total $/mo</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val" style="color:var(--red)">$' + wastedSpend + '</span><span class="kpi-label">Wasted $/mo</span></div>'
    + '</div>';

  // AI Insight for the member
  var insightText;
  if (unusedApps.length === 0) {
    insightText = member.name + ' is using all ' + appDetails.length + ' assigned apps. Model user for the team.';
  } else if (member.status === 'inactive') {
    insightText = member.name + ' hasn\'t been active for over 3 weeks. ' + appDetails.length + ' app licenses costing $' + totalSpend + '/mo can be reclaimed immediately.';
  } else {
    insightText = member.name + ' has ' + unusedApps.length + ' unused app' + (unusedApps.length > 1 ? 's' : '') + ' (' + unusedApps.map(function(a) { return a.name; }).join(', ') + ') costing $' + wastedSpend + '/mo. Consider revoking these licenses.';
  }
  html += '<div class="drill-ai-insight">'
    + ' <i class="fas fa-robot"></i>'
    + ' <span><strong>AI Insight:</strong> ' + insightText + '</span>'
    + '</div>';

  // ── Apps In Use ──
  html += '<div style="padding:0 24px 8px"><h4 style="font-size:14px;font-weight:700;color:var(--gray-800);margin:0 0 12px;display:flex;align-items:center;gap:8px">'
    + '<i class="fas fa-check-circle" style="color:#10B981"></i> Apps In Use (' + usedApps.length + ')</h4></div>';
  html += '<div class="member-app-grid">';
  usedApps.forEach(function(app) {
    var statusBadge = app.status === 'active' ? '<span class="app-usage-badge active">Active</span>'
      : app.status === 'rare' ? '<span class="app-usage-badge rare">Rare</span>'
      : '<span class="app-usage-badge dormant">Dormant</span>';
    html += '<div class="member-app-card used">'
      + ' <div class="member-app-icon" style="background:' + app.color + '"><i class="' + app.icon + '"></i></div>'
      + ' <div class="member-app-info">'
      + '  <div class="member-app-name">' + app.name + '</div>'
      + '  <div class="member-app-meta">' + app.category + ' · $' + app.monthlyCost + '/mo</div>'
      + ' </div>'
      + ' <div class="member-app-right">'
      + '  ' + statusBadge
      + '  <div class="member-app-last">Last: ' + app.lastUsed + '</div>'
      + '  <div class="member-app-logins">' + app.weeklyLogins + ' logins/wk</div>'
      + ' </div>'
      + '</div>';
  });
  html += '</div>';

  // ── Unused Apps ──
  if (unusedApps.length > 0) {
    html += '<div style="padding:16px 24px 8px"><h4 style="font-size:14px;font-weight:700;color:var(--gray-800);margin:0 0 12px;display:flex;align-items:center;gap:8px">'
      + '<i class="fas fa-times-circle" style="color:#EF4444"></i> Not Using (' + unusedApps.length + ') <span style="color:var(--red);font-size:13px">$' + wastedSpend + '/mo wasted</span></h4></div>';
    html += '<div class="member-app-grid">';
    unusedApps.forEach(function(app) {
      html += '<div class="member-app-card unused">'
        + ' <div class="member-app-icon unused" style="background:' + app.color + '"><i class="' + app.icon + '"></i></div>'
        + ' <div class="member-app-info">'
        + '  <div class="member-app-name">' + app.name + '</div>'
        + '  <div class="member-app-meta">' + app.category + ' · $' + app.monthlyCost + '/mo</div>'
        + ' </div>'
        + ' <div class="member-app-right">'
        + '  <span class="app-usage-badge unused">Unused</span>'
        + '  <div class="member-app-last">Never accessed</div>'
        + ' </div>'
        + '</div>';
    });
    html += '</div>';
  }

  // Back button
  html += '<div style="padding:16px 24px 24px">'
    + ' <button onclick="openTeamDrill(\'' + deptId + '\',\'' + team.id + '\')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:var(--gray-100);color:var(--gray-700);border:none;transition:all 0.2s" onmouseover="this.style.background=\'var(--primary-bg)\';this.style.color=\'var(--primary)\'" onmouseout="this.style.background=\'var(--gray-100)\';this.style.color=\'var(--gray-700)\'">'
    + '  <i class="fas fa-arrow-left"></i> Back to ' + team.name
    + ' </button>'
    + '</div>';

  panel.innerHTML = html;
}

function renderTeamView(dept, team, deptId) {
  var panel = document.getElementById('drill-panel');
  if (!panel) return;
  panel.scrollTop = 0;

  var adoptionColor = team.adoption >= 75 ? 'var(--green)' : team.adoption >= 55 ? 'var(--orange)' : 'var(--red)';

  var html = ''
    + '<div class="drill-breadcrumb">'
    + ' <a onclick="closeDrill()">TechCorp India</a>'
    + ' <span class="sep"><i class="fas fa-chevron-right"></i></span>'
    + ' <a onclick="openDeptDrill(\'' + deptId + '\')">' + dept.name + '</a>'
    + ' <span class="sep"><i class="fas fa-chevron-right"></i></span>'
    + ' <span class="current">' + team.name + '</span>'
    + '</div>'
    + '<div class="drill-header">'
    + ' <div class="drill-header-left">'
    + '  <div class="drill-header-icon" style="background:' + team.iconBg + ';color:' + team.iconColor + '"><i class="' + team.icon + '"></i></div>'
    + '  <div>'
    + '   <h2>' + team.name + '</h2>'
    + '   <div class="drill-subtitle">' + team.users + ' members · ' + team.apps + ' apps · Part of ' + dept.name + '</div>'
    + '  </div>'
    + ' </div>'
    + ' <button class="drill-close" onclick="closeDrill()" title="Close"><i class="fas fa-times"></i></button>'
    + '</div>'
    + '<div class="drill-kpi-strip">'
    + ' <div class="drill-kpi"><span class="kpi-val" style="color:' + adoptionColor + '">' + team.adoption + '%</span><span class="kpi-label">Adoption</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val">' + team.activeUsers + '/' + team.users + '</span><span class="kpi-label">Active</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val">' + team.avgLogins + '</span><span class="kpi-label">Logins/Wk</span></div>'
    + ' <div class="drill-kpi"><span class="kpi-val" style="color:var(--red)">' + team.waste + '</span><span class="kpi-label">Waste</span></div>'
    + '</div>';

  // AI insight
  html += '<div class="drill-ai-insight">'
    + ' <i class="fas fa-robot"></i>'
    + ' <span><strong>AI Insight:</strong> ' + team.aiInsight + '</span>'
    + '</div>';

  // Top apps used
  html += '<div style="padding:0 24px 12px"><h4 style="font-size:14px;font-weight:700;color:var(--gray-800);margin-bottom:12px;display:flex;align-items:center;gap:8px"><i class="fas fa-th-large" style="color:var(--primary)"></i> Top Apps</h4></div>';
  html += '<div class="drill-app-list">';
  team.topApps.forEach(function(app, i) {
    var colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    var c = colors[i % colors.length];
    html += '<div class="drill-app-row">'
      + ' <div class="app-icon" style="background:' + c + ';color:#fff;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;font-size:11px;font-weight:700">' + app.substring(0,2).toUpperCase() + '</div>'
      + ' <div class="app-details"><div class="app-name">' + app + '</div><div class="app-usage">Used by ' + Math.max(1, Math.round(team.activeUsers * (0.9 - i * 0.15))) + ' of ' + team.users + ' members</div></div>'
      + '</div>';
  });
  html += '</div>';

  // Members table
  html += '<div class="drill-member-section">'
    + ' <h4><i class="fas fa-user-friends" style="color:var(--primary)"></i> Team Members (' + team.members.length + ')</h4>'
    + ' <table class="drill-member-table">'
    + '  <thead><tr><th>Member</th><th>Role</th><th>Apps Used</th><th>Logins/Wk</th><th>Status</th><th></th></tr></thead>'
    + '  <tbody>';

  team.members.forEach(function(m, idx) {
    var initials = m.name.split(' ').map(function(n) { return n[0]; }).join('').substring(0,2);
    var statusClass = m.status;
    var statusLabel = m.status === 'active' ? 'Active' : m.status === 'idle' ? 'Idle' : 'Inactive';
    html += '<tr class="drill-member-row" onclick="openMemberDrill(\'' + deptId + '\',\'' + team.id + '\', ' + idx + ')" title="View ' + m.name + '\'s app usage">'
      + '<td><span class="member-avatar" style="background:' + m.avatar + '">' + initials + '</span>' + m.name + '</td>'
      + '<td>' + m.role + '</td>'
      + '<td>' + m.apps + ' / ' + team.apps + '</td>'
      + '<td>' + m.logins + '</td>'
      + '<td><span class="member-status ' + statusClass + '">' + statusLabel + '</span></td>'
      + '<td style="text-align:right;color:var(--gray-400)"><i class="fas fa-chevron-right"></i></td>'
      + '</tr>';
  });

  html += '  </tbody></table></div>';

  // Back button
  html += '<div style="padding:0 24px 24px">'
    + ' <button onclick="openDeptDrill(\'' + deptId + '\')" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;background:var(--gray-100);color:var(--gray-700);border:none;transition:all 0.2s" onmouseover="this.style.background=\'var(--primary-bg)\';this.style.color=\'var(--primary)\'" onmouseout="this.style.background=\'var(--gray-100)\';this.style.color=\'var(--gray-700)\'">'
    + '  <i class="fas fa-arrow-left"></i> Back to ' + dept.name + ' teams'
    + ' </button>'
    + '</div>';

  panel.innerHTML = html;
}

// Close drill on Escape key supports 3-level back navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var overlay = document.getElementById('drill-overlay');
    if (overlay && overlay.classList.contains('open')) {
      if (drillState.memberIdx !== null && drillState.memberIdx !== undefined) {
        openTeamDrill(drillState.dept, drillState.team);
      } else if (drillState.team) {
        openDeptDrill(drillState.dept);
      } else {
        closeDrill();
      }
      e.preventDefault();
    }
  }
});


/* ==========================================================================
  ORG EXPLORER Nested Hierarchy: Org → Teams → People
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
        aiTip: 'Zendesk + Freshdesk + Intercom for support 3 tools same job. Consolidate to Zendesk: save $16.8K/yr.',
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
        aiTip: 'Firebase Blaze plan overkill downgrade to Spark for 2 staging projects: save $2.4K/yr.',
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
        aiTip: 'Amplitude + Mixpanel + GA4 paying for 3 analytics tools. Consolidate to Amplitude: save $11.4K/yr.',
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
        aiTip: '3 HRMS tools (BambooHR + Greythr + Darwinbox). 100% use Darwinbox drop the other 2: save $6.6K/yr.',
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
        aiTip: 'QuickBooks usage dropped 80% after Zoho Books fully migrate: save $2.4K/yr. 2 unused Tally seats.',
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
        aiTip: 'Jira + Linear + Asana 3 project management tools. Team uses Linear 90%. Drop Jira + Asana: save $10.8K/yr.',
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
        aiTip: '10 unused HubSpot seats. Semrush + Ahrefs overlap pick one SEO tool: save $11.4K/yr.',
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
        aiTip: 'Productboard has 6 inactive seats. Hotjar + FullStory overlap sessions drop FullStory: save $5.4K/yr.',
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
        aiTip: 'Notion + Confluence both active. Team prefers Notion drop Confluence: save $1.8K/yr.',
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
        aiTip: 'Mailchimp free tier should be enough currently on Standard plan. Downgrade: save $1.2K/yr.',
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
        aiTip: 'Lean ops all licenses utilized. Consider annual billing for Slack and Zoom to save 20%.',
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
    + ' <button class="org-toggle" id="toggle-' + org.id + '"><i class="fas fa-chevron-right"></i></button>'
    + ' <div class="org-node-icon" style="background:' + org.iconBg + ';color:#fff"><i class="' + org.icon + '"></i></div>'
    + ' <div class="org-node-info">'
    + '  <div class="org-node-name">' + org.name + '</div>'
    + '  <div class="org-node-meta">' + org.plan + ' · ' + teamCount + ' teams · ' + totalPeople + ' people</div>'
    + ' </div>'
    + ' <div class="org-node-kpis">'
    + '  <div class="org-node-kpi expense"><span class="kv" style="color:#6D28D9">' + e.total + '</span><span class="kl">Total Spend</span></div>'
    + '  <div class="org-node-kpi waste"><span class="kv" style="color:#DC2626">' + e.waste + '</span><span class="kl">Waste</span></div>'
    + '  <div class="org-node-kpi"><span class="kv">' + e.apps + '</span><span class="kl">Apps</span></div>'
    + '  <div class="org-node-kpi"><span class="kv">' + e.licenses + '</span><span class="kl">Licenses</span></div>'
    + ' </div>'
    + '</div>'
    + '<div class="org-expense-bar">'
    + ' <span class="org-expense-pill spend"><i class="fas fa-dollar-sign"></i> Spend: ' + e.total + '</span>'
    + ' <span class="org-expense-pill waste"><i class="fas fa-exclamation-triangle"></i> Waste: ' + e.waste + '</span>'
    + (e.potentialSavings ? ' <span class="org-expense-pill savings"><i class="fas fa-piggy-bank"></i> Savings: ' + e.potentialSavings + '</span>' : '')
    + ' <span class="org-expense-pill apps"><i class="fas fa-cube"></i> ' + e.apps + ' Apps</span>'
    + ' <span class="org-expense-pill licenses"><i class="fas fa-id-badge"></i> ' + e.wastedLicenses + ' Unused Licenses</span>'
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
    + ' <button class="org-toggle" id="toggle-' + team.id + '"><i class="fas fa-chevron-right"></i></button>'
    + ' <div class="team-node-icon" style="background:' + team.iconBg + ';color:' + team.iconColor + '"><i class="' + team.icon + '"></i></div>'
    + ' <div class="team-node-info">'
    + '  <div class="team-node-name">' + team.name + '</div>'
    + '  <div class="team-node-meta">' + team.people.length + ' people · ' + e.apps + ' apps · ' + e.licenses + ' licenses</div>'
    + ' </div>'
    + ' <div class="team-node-kpis">'
    + '  <div class="team-node-kpi expense"><span class="kv" style="color:#6D28D9">' + e.total + '</span><span class="kl">Spend</span></div>'
    + '  <div class="team-node-kpi waste"><span class="kv" style="color:' + wasteColor + '">' + e.waste + '</span><span class="kl">Waste</span></div>'
    + '  <div class="team-node-kpi"><span class="kv">' + e.apps + '</span><span class="kl">Apps</span></div>'
    + ' </div>'
    + '</div>'
    + '<div class="team-expense-bar">'
    + ' <span class="team-expense-pill spend"><i class="fas fa-dollar-sign"></i> ' + e.total + '</span>'
    + ' <span class="team-expense-pill waste"><i class="fas fa-exclamation-triangle"></i> Waste: ' + e.waste + '</span>'
    + ' <span class="team-expense-pill apps"><i class="fas fa-cube"></i> ' + e.apps + ' Apps</span>'
    + '</div>'
    + '<div class="team-children" id="children-' + team.id + '">';

  // AI tip
  if (team.aiTip) {
    h += '<div class="team-ai-tip"><i class="fas fa-robot"></i><span><strong>AI Insight:</strong> ' + team.aiTip + '</span></div>';
  }

  // People with prominent expense column
  team.people.forEach(function(p) {
    var initials = p.name.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2);
    var statusLabel = p.status === 'active' ? 'Active' : p.status === 'idle' ? 'Idle' : 'Inactive';
    h += '<div class="person-row">'
      + ' <div class="person-avatar" style="background:' + p.avatar + '">' + initials + '</div>'
      + ' <div class="person-info">'
      + '  <div class="person-name">' + p.name + '</div>'
      + '  <div class="person-role">' + p.role + '</div>'
      + ' </div>'
      + ' <div class="person-stats">'
      + '  <div class="person-stat expense-stat"><span class="pv">' + p.expense + '</span><span class="pl">Expense</span></div>'
      + '  <div class="person-stat"><span class="pv">' + p.apps + '</span><span class="pl">Apps</span></div>'
      + '  <div class="person-stat"><span class="pv">' + p.logins + '</span><span class="pl">Logins/Wk</span></div>'
      + ' </div>'
      + ' <span class="person-status-dot ' + p.status + '">' + statusLabel + '</span>'
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

var _bulkImportType = SaaSIQ.state.bulkImportType; // 'people' | 'teams' | 'orgs'
var _bulkParsedData = SaaSIQ.state.bulkParsedData; // parsed rows ready to import

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
  if (!raw) { showToast('error', 'Nothing to parse paste some data first'); return; }

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
      var val = row[c.key] || '<span style="color:var(--gray-300)"></span>';
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
  HELP ARTICLE PREVIEW
  ============================================ */
var _helpArticles = {
  'connect-google': {
    title: 'How to connect your Google Workspace for SaaS discovery',
    icon: 'fab fa-google',
    color: '#4285F4',
    content: '<p>SaaSIQ integrates with Google Workspace to automatically discover every SaaS application used across your organization.</p>'
      + '<h4>Prerequisites</h4><ul><li>Google Workspace admin access (Super Admin recommended)</li><li>SaaSIQ Integrations permissions</li></ul>'
      + '<h4>Step 1: Navigate to Integrations</h4><p>Go to <strong>Dashboard → Integrations</strong> and locate the Google Workspace card.</p>'
      + '<h4>Step 2: Authorize Access</h4><p>Click <strong>Connect</strong> and sign in with your Google admin account. SaaSIQ requests read-only OAuth scopes for Directory, Drive activity, and Chrome extensions.</p>'
      + '<h4>Step 3: Initial Sync</h4><p>The first scan typically completes within 10–15 minutes. SaaSIQ indexes OAuth grants, browser extensions, and email-linked SaaS subscriptions.</p>'
      + '<h4>Step 4: Review Discoveries</h4><p>Head to <strong>SaaS Discovery</strong> to see newly found applications, categorized by risk level, department, and spend.</p>'
  },
  'ai-copilot': {
    title: 'Understanding the AI Copilot and SaaS insights',
    icon: 'fas fa-robot',
    color: '#7C3AED',
    content: '<p>The SaaSIQ AI Copilot analyzes your SaaS portfolio in real-time and surfaces actionable insights.</p>'
      + '<h4>How It Works</h4><p>The copilot monitors license utilization, spend trends, and contract terms to generate recommendations automatically.</p>'
      + '<h4>Types of Insights</h4><ul><li><strong>Cost Optimization</strong> Identifies unused licenses, duplicate apps, and downgrade opportunities</li>'
      + '<li><strong>Risk Alerts</strong> Flags shadow IT, expiring contracts, and compliance gaps</li>'
      + '<li><strong>Benchmark Comparisons</strong> Shows how your spend compares to industry peers</li></ul>'
      + '<h4>Acting on Recommendations</h4><p>Each insight card includes an <strong>Apply</strong> button that creates a task or triggers an automated workflow.</p>'
  },
  'renewal-alerts': {
    title: 'Setting up contract renewal alerts',
    icon: 'fas fa-bell',
    color: '#F59E0B',
    content: '<p>Never miss a renewal deadline. SaaSIQ sends automated alerts before contracts auto-renew.</p>'
      + '<h4>Configure Alert Timing</h4><p>Go to <strong>Renewals & Contracts</strong> → click any contract → set alert triggers at 90, 60, and 30 days before renewal.</p>'
      + '<h4>Notification Channels</h4><ul><li>In-app notifications (default)</li><li>Email digest daily or weekly</li><li>Slack / Teams integration</li></ul>'
      + '<h4>Bulk Alert Setup</h4><p>Use <strong>Scan Contracts</strong> to auto-detect renewal dates from uploaded PDFs, then apply alert rules in bulk.</p>'
  },
  'governance-policies': {
    title: 'Creating and enforcing SaaS governance policies',
    icon: 'fas fa-gavel',
    color: '#10B981',
    content: '<p>Governance policies let you control which SaaS tools are approved, who can procure new subscriptions, and how compliance is enforced.</p>'
      + '<h4>Creating a Policy</h4><p>Navigate to <strong>Compliance</strong> → <strong>Policies</strong> → <strong>Add Rule</strong>. Define conditions (e.g., "block unapproved apps over $500/mo") and assign approvers.</p>'
      + '<h4>Enforcement Modes</h4><ul><li><strong>Monitor</strong> Log violations without blocking</li>'
      + '<li><strong>Warn</strong> Notify users and managers</li>'
      + '<li><strong>Block</strong> Prevent access until approved</li></ul>'
      + '<h4>Policy Templates</h4><p>SaaSIQ includes pre-built templates for SOC 2, GDPR, DPDP Act, and HIPAA compliance frameworks.</p>'
  }
};

function openHelpArticle(articleId) {
  var article = _helpArticles[articleId];
  if (!article) { showToast('info', 'Article not found'); return; }
  closeModal('modal-help-center');
  _openLifecycleModal(
    article.title,
    article.color,
    article.icon,
    '<div style="font-size:14px;line-height:1.7;color:#374151;max-height:420px;overflow-y:auto;padding-right:8px">' + article.content + '</div>',
    function() { showToast('info', 'Article bookmarked find it in your Help Center favorites'); },
    '<i class="fas fa-bookmark"></i> Bookmark',
    article.color
  );
}


/* ============================================
  HELP & SUPPORT WIDGET
  ============================================ */

var _helpWidgetOpen = SaaSIQ.state.helpWidgetOpen;
var _helpChatType = SaaSIQ.state.helpChatType;
var _helpSelectedSlot = SaaSIQ.state.helpSelectedSlot;

// Agent personas for different chat types
var _helpAgents = {
  support: { name: 'Priya Sharma', role: 'Customer Success Lead', initial: 'P', gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)' },
  demo:  { name: 'Rahul Mehta', role: 'Solutions Engineer',  initial: 'R', gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
  sales:  { name: 'Aisha Khan',  role: 'Sales Director',    initial: 'A', gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
  issue:  { name: 'Priya Sharma', role: 'Customer Success Lead', initial: 'P', gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }
};

// Chat auto-responses per type
var _helpAutoResponses = {
  support: [
    "Thanks for reaching out! I'm here to help. Could you describe the issue you're facing?",
    "I understand. Let me look into that for you right away.",
    "I've checked our system here's what I found. Would you like me to walk you through the fix?",
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
    "Thank you for the details. I've logged this as a priority ticket our engineering team will investigate.",
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
          "Great question let me check on that for you.",
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

// ========================================================================
// SHADOW IT MARK MANAGED / FLAG SHADOW IT
// ========================================================================
function markManaged(btn, appName) {
  var card = btn.closest('.app-card');
  if (!card) { showToast('success', appName + ' marked as managed'); return; }
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(function() {
    var badge = card.querySelector('.status-badge');
    if (badge) {
      badge.textContent = 'Managed';
      badge.className = 'status-badge active';
    }
    card.classList.remove('shadow');
    card.classList.add('managed');
    var riskBadge = card.querySelector('.risk-badge');
    if (riskBadge) { riskBadge.textContent = 'Approved'; riskBadge.className = 'risk-badge low'; }
    var actions = btn.parentElement;
    if (actions) actions.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#10B981"><i class="fas fa-check-circle"></i> Managed</span>';
    showToast('success', appName + ' moved to managed inventory now tracked in SaaSIQ');
  }, 700);
}

function flagShadowIT(btn, appName) {
  var card = btn.closest('.app-card');
  _openLifecycleModal('Flag ' + appName + ' as Shadow IT', '#EF4444', 'fa-exclamation-triangle', ''
    + '<p style="font-size:13px;color:#6B7280;margin:0 0 16px">This will flag <strong>' + appName + '</strong> as unauthorized Shadow IT and notify the security team.</p>'
    + '<div style="margin-bottom:16px">'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Action to Take</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;padding:10px;border:1.5px solid #E5E7EB;border-radius:8px;margin-bottom:6px;cursor:pointer;font-size:13px"><input type="radio" name="shadow-action" checked> Monitor only (no blocking)</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;padding:10px;border:1.5px solid #E5E7EB;border-radius:8px;margin-bottom:6px;cursor:pointer;font-size:13px"><input type="radio" name="shadow-action"> Block access via SSO policy</label>'
    + ' <label style="display:flex;align-items:center;gap:8px;padding:10px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;font-size:13px"><input type="radio" name="shadow-action"> Notify users + request migration</label>'
    + '</div>'
    + '<div>'
    + ' <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Reason</label>'
    + ' <textarea placeholder="Why is this flagged? e.g., No SOC2 cert, data residency risk…" style="width:100%;padding:10px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;min-height:60px;resize:vertical;box-sizing:border-box;font-family:inherit"></textarea>'
    + '</div>',
  function() {
    if (card) {
      var badge = card.querySelector('.status-badge');
      if (badge) { badge.textContent = 'Flagged'; badge.className = 'status-badge danger'; }
      var riskBadge = card.querySelector('.risk-badge');
      if (riskBadge) { riskBadge.textContent = 'Shadow IT'; riskBadge.className = 'risk-badge high'; }
      var actions = btn.parentElement;
      if (actions) actions.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#EF4444"><i class="fas fa-flag"></i> Flagged</span>';
    }
    showToast('warning', appName + ' flagged as Shadow IT security team notified');
  }, '<i class="fas fa-flag"></i> Flag as Shadow IT', '#EF4444');
}

// ========================================================================
// SELF-SERVICE REQUEST TOOL ACCESS
// ========================================================================
function requestToolAccess(btn, toolName) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="color:#7C3AED"></i> Requesting…';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check-circle" style="color:#10B981"></i> Requested';
    btn.style.background = 'rgba(16,185,129,0.06)';
    btn.style.borderColor = '#10B981';
    btn.style.color = '#059669';
    btn.style.opacity = '1';
    showToast('success', 'Request for ' + toolName + ' sent awaiting manager approval (Pradeep Rao)');
  }, 900);
}

function browseAppCatalog() {
  _openLifecycleModal('App Catalog', '#7C3AED', 'fa-th', ''
    + '<p style="font-size:13px;color:#6B7280;margin:0 0 14px">Browse available apps and request access. Your manager will approve within 24 hours.</p>'
    + '<div style="margin-bottom:16px"><input type="text" placeholder="Search apps…" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;box-sizing:border-box"></div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">'
    + ['Notion','Loom','Asana','Monday.com','Trello','Miro','Confluence','Linear','ClickUp','Airtable','Coda','Webflow'].map(function(app) {
      return '<div style="padding:12px;border:1.5px solid #E5E7EB;border-radius:10px;text-align:center;cursor:pointer;transition:all 0.15s;font-size:12px;font-weight:600;color:#374151" onmouseover="this.style.borderColor=\'#7C3AED\';this.style.background=\'rgba(124,58,237,0.04)\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.background=\'#fff\'" onclick="this.innerHTML=\'<i class=&quot;fas fa-check&quot; style=&quot;color:#10B981&quot;></i> Requested\';this.style.borderColor=\'#10B981\';this.style.pointerEvents=\'none\'">' + app + '</div>';
    }).join('')
    + '</div>',
  function() {
    showToast('success', 'App requests submitted your manager will be notified');
  }, '<i class="fas fa-paper-plane"></i> Submit Requests', '#7C3AED');
}

// ========================================================================
// ONBOARDING AUDIT REPORT + COMPLIANCE EXPORT
// ========================================================================
function generateAuditReport(btn) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Report Ready';
    btn.style.background = '#059669';
    btn.style.color = '#fff';
    btn.style.borderColor = '#059669';
    showToast('success', 'Onboarding audit report generated 23 onboards, 97% SLA compliance, 0 violations this quarter');
  }, 1200);
}

function exportCompliancePDF(btn) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
    btn.style.background = '#059669';
    btn.style.color = '#fff';
    showToast('success', 'Compliance report exported as PDF saasiq-compliance-Q1-2026.pdf');
  }, 1000);
}

// ========================================================================
// RENEWALS SCAN CONTRACTS + EXPORT CALENDAR
// ========================================================================
function scanContracts(btn) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Scan Complete';
    btn.style.background = '#059669';
    btn.style.color = '#fff';
    btn.style.borderColor = '#059693';
    showToast('success', '47 contracts scanned 3 new renewals detected, 2 auto-renewal clauses flagged');
  }, 1500);
}

function exportCalendar(btn) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting…';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-calendar-check"></i> Exported';
    btn.style.background = '#059669';
    btn.style.color = '#fff';
    btn.style.borderColor = '#059693';
    showToast('success', 'Renewal calendar exported 12 events added to saasiq-renewals.ics');
  }, 1000);
}

// ========================================================================
// BENCHMARKS EXPORT PDF
// ========================================================================
function exportBenchmarkPDF(btn) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
    btn.style.background = '#059669';
    btn.style.color = '#fff';
    btn.style.borderColor = '#059693';
    showToast('success', 'CFO benchmark report generated saasiq-benchmark-report-Q1-2026.pdf');
  }, 1200);
}

// ========= SCROLL REVEAL ANIMATIONS =========
(function() {
  var style = document.createElement('style');
  style.textContent = [
    '.reveal-hidden { opacity: 0; transform: translateY(32px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }',
    '.reveal-visible { opacity: 1; transform: translateY(0); }'
  ].join('\n');
  document.head.appendChild(style);

  function initReveal() {
    var selectors = '.problem-card, .need-card, .feature-card, .pricing-card, .section-header, .hero-image, .trusted-by';
    var els = document.querySelectorAll(selectors);
    if (!els.length) return;
    els.forEach(function(el) { el.classList.add('reveal-hidden'); });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var delay = Array.prototype.indexOf.call(entry.target.parentElement.children, entry.target) * 60;
          delay = Math.min(delay, 400);
          setTimeout(function() {
            entry.target.classList.add('reveal-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function(el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();

/* ================================================================
   GROWW-INSPIRED LANDING PAGE INTERACTIONS
   ================================================================ */
(function() {
  function initGrowwLanding() {
    // --- Nav scroll shadow ---
    var nav = document.querySelector('.gw-nav');
    if (nav) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 10) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      });
    }

    // --- Draw mini chart (discovery) ---
    drawMiniChart('gw-discovery-chart', [5, 8, 12, 15, 18, 22, 28, 32, 35, 38, 40, 42, 44, 47], '#10B981');

    // --- Draw fund chart (savings) ---
    drawFundChart('gw-savings-chart');

    // --- Animate trust counter ---
    animateTrustCounter();

    // --- Scroll-reveal animations ---
    initScrollReveal();

    // --- Animated stat counters ---
    initCountUp();

    // --- Feature card mouse glow ---
    initCardGlow();
  }

  /* ===== Scroll Reveal ===== */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.gw-reveal, .gw-stagger-reveal');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function(el) { observer.observe(el); });
  }

  /* ===== Count-up on scroll ===== */
  function initCountUp() {
    var counters = document.querySelectorAll('.gw-count-up');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        var target = parseFloat(el.dataset.target);
        var prefix = el.dataset.prefix || '';
        var suffix = el.dataset.suffix || '';
        var format = el.dataset.format || '';
        var duration = 1200;
        var start = performance.now();

        function update(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(eased * target);
          if (format === 'short') {
            if (current >= 1000000) el.textContent = prefix + (current / 1000000).toFixed(1) + 'M';
            else if (current >= 1000) el.textContent = prefix + (current / 1000).toFixed(0) + 'K';
            else el.textContent = prefix + current;
          } else {
            el.textContent = prefix + current + suffix;
          }
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  /* ===== Card mouse-follow glow ===== */
  function initCardGlow() {
    var cards = document.querySelectorAll('.gw-feature-card');
    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  function drawMiniChart(containerId, data, color) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = container.offsetWidth * 2;
      canvas.height = container.offsetHeight * 2;
      canvas.style.width = container.offsetWidth + 'px';
      canvas.style.height = container.offsetHeight + 'px';
      draw();
    }

    function draw() {
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      var max = Math.max.apply(null, data);
      var min = Math.min.apply(null, data);
      var range = max - min || 1;
      var step = w / (data.length - 1);
      var padding = 8;

      // Draw gradient fill
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (var i = 0; i < data.length; i++) {
        var x = i * step;
        var y = padding + (1 - (data[i] - min) / range) * (h - padding * 2);
        if (i === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color + '40');
      grad.addColorStop(1, color + '05');
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      for (var i = 0; i < data.length; i++) {
        var x = i * step;
        var y = padding + (1 - (data[i] - min) / range) * (h - padding * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    resize();
    window.addEventListener('resize', resize);
  }

  function drawFundChart(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    // Mutual fund style data - generally upward with some volatility
    var data = [];
    var val = 100;
    for (var i = 0; i < 60; i++) {
      val += (Math.random() - 0.35) * 8;
      if (val < 80) val = 80 + Math.random() * 10;
      data.push(val);
    }
    drawMiniChart(containerId, data, '#10B981');
  }

  function animateTrustCounter() {
    var el = document.getElementById('gw-trust-count');
    if (!el) return;
    var target = 500;
    var seen = false;

    function doCount() {
      var current = 0;
      var step = Math.ceil(target / 60);
      var interval = setInterval(function() {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current.toLocaleString();
      }, 20);
    }

    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !seen) {
        seen = true;
        doCount();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrowwLanding);
  } else {
    initGrowwLanding();
  }
})();

/* ================================================================
   BOOK A DEMO — Calendar + Time Picker
   ================================================================ */
(function() {
  var currentMonth, currentYear, selectedDate = null, selectedTime = null;
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function init() {
    var now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
  }
  init();

  window.openBookDemo = function() {
    selectedDate = null;
    selectedTime = null;
    document.getElementById('demoStep1').style.display = 'grid';
    document.getElementById('demoStep2').style.display = 'none';
    document.getElementById('demoStep3').style.display = 'none';
    var now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    renderCalendar();
    renderTimeSlots();
    document.getElementById('selectedDateLabel').textContent = 'Select a date';
    document.getElementById('bookDemoModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookDemo = function() {
    document.getElementById('bookDemoModal').classList.remove('active');
    document.body.style.overflow = '';
  };

  window.changeMonth = function(dir) {
    currentMonth += dir;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  };

  function renderCalendar() {
    document.getElementById('calMonthYear').textContent = months[currentMonth] + ' ' + currentYear;
    var grid = document.getElementById('calGrid');
    grid.innerHTML = '';
    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var today = new Date();
    today.setHours(0,0,0,0);

    // Previous month blanks
    for (var i = 0; i < firstDay; i++) {
      var blank = document.createElement('button');
      blank.className = 'gw-cal-date other-month disabled';
      blank.textContent = '';
      blank.disabled = true;
      grid.appendChild(blank);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var btn = document.createElement('button');
      btn.className = 'gw-cal-date';
      btn.textContent = d;
      var dateObj = new Date(currentYear, currentMonth, d);
      dateObj.setHours(0,0,0,0);

      var dayOfWeek = dateObj.getDay();
      if (dateObj < today || dayOfWeek === 0 || dayOfWeek === 6) {
        btn.classList.add('disabled');
        btn.disabled = true;
      } else {
        btn.setAttribute('data-date', currentYear + '-' + (currentMonth+1) + '-' + d);
        btn.onclick = function() { selectDate(this); };
      }

      if (dateObj.getTime() === today.getTime()) {
        btn.classList.add('today');
      }
      if (selectedDate) {
        var selParts = selectedDate.split('-');
        if (parseInt(selParts[0]) === currentYear && parseInt(selParts[1]) === currentMonth+1 && parseInt(selParts[2]) === d) {
          btn.classList.add('selected');
        }
      }
      grid.appendChild(btn);
    }
  }

  function selectDate(el) {
    selectedDate = el.getAttribute('data-date');
    selectedTime = null;
    var all = document.querySelectorAll('.gw-cal-date');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
    el.classList.add('selected');
    var parts = selectedDate.split('-');
    var dateObj = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
    var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    document.getElementById('selectedDateLabel').textContent = dayNames[dateObj.getDay()] + ', ' + months[dateObj.getMonth()] + ' ' + parts[2];
    renderTimeSlots();
  }

  function renderTimeSlots() {
    var container = document.getElementById('timeSlots');
    container.innerHTML = '';
    if (!selectedDate) {
      container.innerHTML = '<p style="color:#9ca3af;font-size:13px;text-align:center;padding:16px">Pick a date to see available times</p>';
      return;
    }
    var times = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM'];
    for (var i = 0; i < times.length; i++) {
      var slot = document.createElement('button');
      slot.className = 'gw-time-slot';
      slot.textContent = times[i];
      slot.setAttribute('data-time', times[i]);
      slot.onclick = function() { selectTime(this); };
      container.appendChild(slot);
    }
  }

  function selectTime(el) {
    selectedTime = el.getAttribute('data-time');
    var all = document.querySelectorAll('.gw-time-slot');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
    el.classList.add('selected');
    // Proceed to step 2
    setTimeout(function() {
      document.getElementById('demoStep1').style.display = 'none';
      document.getElementById('demoStep2').style.display = 'block';
      var parts = selectedDate.split('-');
      var dateObj = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
      var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      document.getElementById('demoDateTimeSummary').textContent = dayNames[dateObj.getDay()] + ', ' + months[dateObj.getMonth()] + ' ' + parts[2] + ', ' + parts[0] + ' at ' + selectedTime;
    }, 300);
  }

  window.confirmDemo = function() {
    var name = document.getElementById('demoName').value.trim();
    var email = document.getElementById('demoEmail').value.trim();
    if (!name || !email) {
      if (typeof showToast === 'function') showToast('error', 'Please fill in your name and email');
      return;
    }
    document.getElementById('demoStep2').style.display = 'none';
    document.getElementById('demoStep3').style.display = 'block';
    document.getElementById('confirmedEmail').textContent = email;
    document.getElementById('confirmedDateTime').textContent = document.getElementById('demoDateTimeSummary').textContent;
    if (typeof showToast === 'function') showToast('success', 'Demo booked! Check your email for confirmation.');
  };

  // Close on overlay click
  var overlay = document.getElementById('bookDemoModal');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) window.closeBookDemo();
    });
  }
})();

/* ================================================================
   WATCH DEMO — Animated Video Walkthrough
   ================================================================ */
(function() {
  var videoTimer = null;
  var videoPlaying = false;
  var videoElapsed = 0;
  var videoDuration = 105; // 1:45 in seconds

  var scenes = [
    { at: 0, icon: 'fas fa-layer-group', title: 'Welcome to SaaSIQ', text: 'The AI-powered SaaS spend intelligence platform', stat: '' },
    { at: 12, icon: 'fas fa-plug', title: 'Connect in Seconds', text: 'One-click integrations with Google Workspace, Okta, Azure AD, Slack and 400+ apps', stat: '400+' },
    { at: 24, icon: 'fas fa-search', title: 'Discover Shadow IT', text: 'SaaSIQ automatically finds every app, license, and user across your entire organization', stat: '47 apps' },
    { at: 36, icon: 'fas fa-chart-line', title: 'AI Spend Intelligence', text: 'Machine learning analyzes spend patterns, detects anomalies, and surfaces hidden savings', stat: '$702K' },
    { at: 48, icon: 'fas fa-dollar-sign', title: 'Save Millions', text: 'One-click license reclamation, renewal alerts, and AI negotiation scripts', stat: '30%' },
    { at: 60, icon: 'fas fa-shield-alt', title: 'Enterprise Compliance', text: 'SOC2, GDPR, DPDP compliance scoring with real-time risk alerts', stat: '98.5%' },
    { at: 72, icon: 'fas fa-robot', title: 'AI Copilot', text: 'Ask in plain English — get instant answers, actions, and recommendations', stat: '' },
    { at: 84, icon: 'fas fa-user-plus', title: 'People Ops Automation', text: 'Onboard employees across all tools in 10 minutes, offboard in 1 click', stat: '92%' },
    { at: 96, icon: 'fas fa-rocket', title: 'Start Saving Today', text: 'Join 500+ companies that have reclaimed millions in wasted SaaS spend', stat: '$7.2M' }
  ];

  window.openWatchDemo = function() {
    videoElapsed = 0;
    videoPlaying = false;
    var modal = document.getElementById('watchDemoModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset to poster
    document.querySelector('.gw-video-poster').style.display = 'flex';
    document.getElementById('demoVideoScreen').style.display = 'none';
    if (document.getElementById('videoProgress')) document.getElementById('videoProgress').style.width = '0%';
  };

  window.closeWatchDemo = function() {
    stopVideo();
    document.getElementById('watchDemoModal').classList.remove('active');
    document.body.style.overflow = '';
  };

  window.playDemoVideo = function() {
    document.querySelector('.gw-video-poster').style.display = 'none';
    document.getElementById('demoVideoScreen').style.display = 'flex';
    videoPlaying = true;
    videoElapsed = 0;
    updateScene();
    videoTimer = setInterval(tick, 1000);
    var btn = document.getElementById('videoPlayPause');
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
  };

  window.toggleDemoVideo = function() {
    var btn = document.getElementById('videoPlayPause');
    if (videoPlaying) {
      clearInterval(videoTimer);
      videoPlaying = false;
      if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      videoPlaying = true;
      videoTimer = setInterval(tick, 1000);
      if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
    }
  };

  function stopVideo() {
    clearInterval(videoTimer);
    videoPlaying = false;
    videoElapsed = 0;
  }

  function tick() {
    videoElapsed++;
    if (videoElapsed >= videoDuration) {
      clearInterval(videoTimer);
      videoPlaying = false;
      var btn = document.getElementById('videoPlayPause');
      if (btn) btn.innerHTML = '<i class="fas fa-redo"></i>';
    }
    var pct = Math.min((videoElapsed / videoDuration) * 100, 100);
    document.getElementById('videoProgress').style.width = pct + '%';
    var mins = Math.floor(videoElapsed / 60);
    var secs = videoElapsed % 60;
    document.getElementById('videoTime').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs + ' / 1:45';
    updateScene();
  }

  function updateScene() {
    var currentScene = scenes[0];
    for (var i = scenes.length - 1; i >= 0; i--) {
      if (videoElapsed >= scenes[i].at) {
        currentScene = scenes[i];
        break;
      }
    }
    var container = document.querySelector('.gw-scene-content');
    if (!container) return;
    var html = '<div class="scene-icon"><i class="' + currentScene.icon + '"></i></div>';
    if (currentScene.stat) {
      html += '<span class="scene-stat">' + currentScene.stat + '</span>';
    }
    html += '<h2>' + currentScene.title + '</h2>';
    html += '<p>' + currentScene.text + '</p>';
    container.innerHTML = html;
  }

  // Close on overlay click
  var overlay = document.getElementById('watchDemoModal');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) window.closeWatchDemo();
    });
  }

  // Close modals on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (document.getElementById('bookDemoModal').classList.contains('active')) window.closeBookDemo();
      if (document.getElementById('watchDemoModal').classList.contains('active')) window.closeWatchDemo();
    }
  });
})();
