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

console.log('🚀 SaaSIQ Prototype loaded. Navigate through all screens using the sidebar or landing page CTAs.');
