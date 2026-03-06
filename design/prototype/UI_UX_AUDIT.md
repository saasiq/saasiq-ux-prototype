# SaaSIQ Prototype — Production Readiness UI/UX Audit

**Scope:** `index.html` (3624 lines), `styles.css` (2041 lines), `app.js` (920 lines)
**Date:** 2025-01-XX
**Severity Scale:** 🔴 Critical → 🟠 Major → 🟡 Moderate → 🔵 Minor → ⚪ Cosmetic

---

## 🔴 CRITICAL FINDINGS

---

### C-01 · JavaScript · `showDashSection()` uses implicit `event` — breaks in strict mode / modern browsers

**File:** `app.js` · Line 36
**What's wrong:** The function relies on the implicit global `event` object instead of accepting it as a parameter. This is a non-standard IE-ism that fails in Firefox, strict-mode, and when called programmatically.

```js
// CURRENT (broken)
function showDashSection(sectionId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');  // ← implicit 'event'
```

**Fix — app.js line 33:**

oldString:
```js
function showDashSection(sectionId) {
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
```

newString:
```js
function showDashSection(sectionId, event) {
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
```

**Also update every HTML call site** (11 occurrences at lines 709, 715, 719, 722, 728, 732, 736, 742, 746, 752, 756):

oldString (example, line 709):
```html
<a class="nav-item active" onclick="showDashSection('dashboard-home')">
```
newString:
```html
<a class="nav-item active" onclick="showDashSection('dashboard-home', event)">
```

---

### C-02 · JavaScript · `showSettingsTab()` uses implicit `event` — same as C-01

**File:** `app.js` · Line 100
**What's wrong:** Same pattern. Will fail in Firefox and strict mode.

```js
if (event && event.currentTarget) event.currentTarget.classList.add('active');
```

The function already has a guard (`if (event && event.currentTarget)`) but `event` is never declared as a parameter.

**Fix — app.js line 97:**

oldString:
```js
function showSettingsTab(tabId) {
    // Update sidebar active state
    document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
```

newString:
```js
function showSettingsTab(tabId, event) {
    // Update sidebar active state
    document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
```

**Also update all 8 HTML call sites** (lines 2355-2362):

oldString (example, line 2355):
```html
<a class="settings-nav-item active" onclick="showSettingsTab('organization')">
```
newString:
```html
<a class="settings-nav-item active" onclick="showSettingsTab('organization', event)">
```

---

### C-03 · Icons · `fa-browser` is NOT a valid Font Awesome 6 Free icon

**File:** `index.html` · Line 556
**What's wrong:** `fa-browser` does not exist in Font Awesome 6 Free. Renders as an empty/invisible icon in the onboarding integrations step.

oldString:
```html
<div class="integration-icon"><i class="fas fa-browser" style="color: #FF6D00"></i></div>
```

newString:
```html
<div class="integration-icon"><i class="fas fa-window-maximize" style="color: #FF6D00"></i></div>
```

---

### C-04 · Icons · `fa-calendar-exclamation` is NOT a valid Font Awesome 6 Free icon

**File:** `index.html` · Line 1909
**What's wrong:** `fa-calendar-exclamation` doesn't exist in FA6 Free. The "Renewing in 30 Days" KPI shows no icon.

oldString:
```html
<div class="kpi-icon red"><i class="fas fa-calendar-exclamation"></i></div>
```

newString:
```html
<div class="kpi-icon red"><i class="fas fa-calendar-xmark"></i></div>
```

---

### C-05 · Dark Mode · `.btn-social` class name mismatch — dark mode never applies to social auth buttons

**File:** `styles.css` · Lines 1648, 1868
**What's wrong:** HTML uses class `btn-social` (line 356-406 of index.html), but dark mode CSS targets `.social-btn` — a class that doesn't exist. Social buttons stay white `#fff` in dark mode.

oldString (styles.css line 1648):
```css
body.theme-dark .social-btn,
```

newString:
```css
body.theme-dark .btn-social,
```

oldString (styles.css line 1868):
```css
body.theme-dark .social-btn { background: #1A1D2E; color: #D1D5DB; border-color: #2D3148; }
```

newString:
```css
body.theme-dark .btn-social { background: #1A1D2E; color: #D1D5DB; border-color: #2D3148; }
```

---

## 🟠 MAJOR FINDINGS

---

### M-01 · Accessibility · Zero `aria-label` attributes on icon-only buttons

**File:** `index.html` · Lines 789, 796, 797, 1048, 1058, 1068, 1078, 1088, 2506, 2513, 2520, 2527, 2534, 2823, and all modal close-btn elements
**What's wrong:** Every `btn-icon` and every `close-btn` is an icon-only button with zero accessible label. Screen readers announce "button" with no context.

**Fix (representative examples):**

oldString (line 789):
```html
<button class="btn-icon" id="sidebar-toggle"><i class="fas fa-bars"></i></button>
```
newString:
```html
<button class="btn-icon" id="sidebar-toggle" aria-label="Toggle sidebar"><i class="fas fa-bars" aria-hidden="true"></i></button>
```

oldString (line 796):
```html
<button class="btn-icon" onclick="openModal('modal-help-center')"><i class="fas fa-question-circle"></i></button>
```
newString:
```html
<button class="btn-icon" onclick="openModal('modal-help-center')" aria-label="Help center"><i class="fas fa-question-circle" aria-hidden="true"></i></button>
```

oldString (line 797-799):
```html
<button class="btn-icon notification-btn">
    <i class="fas fa-bell"></i>
    <span class="notification-dot"></span>
</button>
```
newString:
```html
<button class="btn-icon notification-btn" aria-label="Notifications">
    <i class="fas fa-bell" aria-hidden="true"></i>
    <span class="notification-dot" aria-hidden="true"></span>
</button>
```

All table action buttons (lines 1048, 1058, 1068, 1078, 1088):
```html
<!-- CURRENT -->
<button class="btn-icon"><i class="fas fa-ellipsis-h"></i></button>
<!-- FIX -->
<button class="btn-icon" aria-label="More actions"><i class="fas fa-ellipsis-h" aria-hidden="true"></i></button>
```

All modal close buttons:
```html
<!-- CURRENT -->
<button class="close-btn" onclick="closeModal(...)"><i class="fas fa-times"></i></button>
<!-- FIX -->
<button class="close-btn" onclick="closeModal(...)" aria-label="Close dialog"><i class="fas fa-times" aria-hidden="true"></i></button>
```

---

### M-02 · Accessibility · No `<label for="">` associations anywhere — all form inputs are orphaned

**File:** `index.html` · Every `<label>` + `<input>`/`<select>` pair (100+ occurrences)
**What's wrong:** Not a single `<label>` in the entire prototype uses a `for` attribute, and not a single `<input>` has an `id`. Screen readers cannot associate labels with their fields.

**Fix pattern** (example from login form, ~line 360):

oldString:
```html
<div class="form-group"><label>Work Email</label><input type="email" placeholder="you@company.com"></div>
```
newString:
```html
<div class="form-group"><label for="login-email">Work Email</label><input id="login-email" type="email" placeholder="you@company.com"></div>
```

> **Note:** This must be applied systematically to every form group across all pages and modals. Too many occurrences to list individually — requires a pass through every `<div class="form-group">`.

---

### M-03 · Accessibility · Sidebar nav items are `<a>` without `href` — not keyboard navigable

**File:** `index.html` · Lines 709-756 (sidebar nav-items) and 2355-2362 (settings tabs)
**What's wrong:** `<a>` elements used as buttons have no `href`, no `role="button"`, and no `tabindex`. Users can't Tab to them or activate them with Enter/Space.

**Fix — sidebar nav items:**

oldString (line 709):
```html
<a class="nav-item active" onclick="showDashSection('dashboard-home')">
```
newString:
```html
<a class="nav-item active" href="#" role="button" onclick="showDashSection('dashboard-home', event); return false;">
```

**Fix — settings tabs (line 2355):**

oldString:
```html
<a class="settings-nav-item active" onclick="showSettingsTab('organization')">
```
newString:
```html
<a class="settings-nav-item active" href="#" role="button" onclick="showSettingsTab('organization', event); return false;">
```

Apply the same pattern to all 11 sidebar links and 8 settings tab links.

---

### M-04 · Accessibility · Page navigator links also `<a>` without `href`

**File:** `index.html` · Lines 106-111
**What's wrong:** Same as M-03 but for the floating page navigator.

oldString (line 106):
```html
<a onclick="showPage('page-landing')" class="nav-panel-link"><i class="fas fa-home"></i> Landing Page</a>
```
newString:
```html
<a href="#" onclick="showPage('page-landing'); return false;" class="nav-panel-link"><i class="fas fa-home" aria-hidden="true"></i> Landing Page</a>
```

Apply to all 6 nav-panel-link elements (lines 106-111).

---

### M-05 · Dark Mode · `.pricing-card` NOT covered by dark mode overrides — stays white `#fff`

**File:** `styles.css` · Line 239 (definition) vs. Lines 1639-1682 (mega override)
**What's wrong:** `.pricing-card` has `background: #fff` but is absent from the dark mode mega override block. Pricing section is a white box on dark background.

**Fix — add to the mega override block (after line 1680 in styles.css):**

After the closing `}` of the mega override (line 1682), add:

```css
body.theme-dark .pricing-card {
    background: #1A1D2E;
    border-color: #2D3148;
    color: #D1D5DB;
}
body.theme-dark .pricing-card h3 { color: #F3F4F6; }
body.theme-dark .price { color: #F3F4F6; }
body.theme-dark .price span { color: #9CA3AF; }
```

---

### M-06 · Dark Mode · `.landing-nav` stays white in dark mode

**File:** `styles.css` · Line 120
**What's wrong:** `background: rgba(255,255,255,0.9)` is hardcoded. Dark mode has an override for `#page-landing` (line 1872) but NOT for `.landing-nav`. The navigation bar is a bright white strip on an otherwise dark page.

**Fix — add after line 1872 in styles.css:**

```css
body.theme-dark .landing-nav {
    background: rgba(15, 17, 23, 0.9);
    border-bottom-color: #2D3148;
}
body.theme-dark .landing-nav a { color: #D1D5DB; }
body.theme-dark .landing-nav .logo-text { color: #F3F4F6; }
```

---

### M-07 · Dark Mode · `.notification-dot` border stays `#fff` hardcoded

**File:** `styles.css` · Line 482
**What's wrong:** `.notification-dot` has `border: 2px solid #fff`. In dark mode the topbar background is `#1A1D2E`, so the white border clashes.

oldString (styles.css ~line 480-483):
```css
.notification-dot {
    position: absolute; top: 6px; right: 6px; width: 8px; height: 8px;
    background: var(--red); border-radius: 50%; border: 2px solid #fff;
}
```

newString:
```css
.notification-dot {
    position: absolute; top: 6px; right: 6px; width: 8px; height: 8px;
    background: var(--red); border-radius: 50%; border: 2px solid var(--gray-50, #fff);
}
```

And add dark mode override:
```css
body.theme-dark .notification-dot { border-color: #1A1D2E; }
```

---

### M-08 · Dark Mode · `.topbar` has hardcoded `rgba(255,255,255,0.95)` in base CSS

**File:** `styles.css` · Line 466
**What's wrong:** While there IS a dark mode override at line 1760-1762, the base value is a hardcoded RGBA white. If the dark override is improperly specificity-overridden, the topbar is white. Changed to use a CSS variable for safety.

This is COVERED by the dark override — confirming as **addressed** but flagging the pattern as fragile.

---

### M-09 · Text/Copy · Zoom app uses wrong icon class `app-icon jira`

**File:** `index.html` · Line 1538
**What's wrong:** The Zoom row in usage analytics uses the CSS class `jira` (which would give it Jira's color scheme) but displays "ZM" text. Should have its own class (e.g., `zoom`) or a neutral one.

oldString:
```html
<div class="usage-app"><div class="app-icon jira">ZM</div> Zoom</div>
```

newString:
```html
<div class="usage-app"><div class="app-icon zoom">ZM</div> Zoom</div>
```

Also add to styles.css after the existing app-icon color definitions:
```css
.app-icon.zoom { background: #2D8CFF; color: #fff; }
```

---

## 🟡 MODERATE FINDINGS

---

### Mo-01 · UX Pattern · `showPage` is monkey-patched twice — fragile override chain

**File:** `app.js` · Lines 1-15, ~173, ~200
**What's wrong:** `showPage` is defined normally, then overridden once (to add demo init), then overridden again (for hash routing). Each override wraps the previous via closure. If initialization order changes, the chain breaks. Refactor into a single function with explicit hooks.

**Recommended:** Replace the monkey-patching pattern with a single canonical function that includes all side effects:

```js
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    
    // Hook: initialize demo if entering demo page
    if (pageId === 'page-demo') initDemo();
    
    // Hook: update URL hash
    window.location.hash = pageId;
}
```

---

### Mo-02 · Layout · Duplicate CSS definitions between inline `<style>` and styles.css

**File:** `index.html` lines 11-99 (inline `<style>`) vs. `styles.css`
**What's wrong:** `.dept-card`, `.dept-usage-grid`, `.days-circle`, `.renewal-filter-bar` and their variants are defined in both an inline `<style>` block AND in styles.css (or should be in styles.css). The inline block includes its own dark mode overrides with `!important`. This creates maintenance burden and specificity conflicts.

**Fix:** Move all rules from the inline `<style>` block into styles.css and remove the `<style>` block from the HTML. The `!important` overrides should be unnecessary once all rules are in the same file with proper ordering.

---

### Mo-03 · Accessibility · Modal dialogs lack `role="dialog"` and `aria-modal`

**File:** `index.html` · Every `<div class="modal-overlay">` (approximately 16 modals + demo overlay)
**What's wrong:** None of the modal overlays have `role="dialog"`, `aria-modal="true"`, or `aria-labelledby` pointing to the modal title. Screen readers don't announce these as dialogs.

**Fix pattern:**

oldString (e.g., line 3024):
```html
<div class="modal-overlay" id="modal-add-app" onclick="if(event.target===this)closeModal(this.id)">
    <div class="modal-dialog">
        <div class="modal-header"><h2><i class="fas fa-plus-circle" style="color:var(--primary)"></i> Add Application</h2>
```

newString:
```html
<div class="modal-overlay" id="modal-add-app" onclick="if(event.target===this)closeModal(this.id)" role="dialog" aria-modal="true" aria-labelledby="modal-add-app-title">
    <div class="modal-dialog">
        <div class="modal-header"><h2 id="modal-add-app-title"><i class="fas fa-plus-circle" style="color:var(--primary)" aria-hidden="true"></i> Add Application</h2>
```

Apply to all 16+ modals.

---

### Mo-04 · Accessibility · No focus trap in modals

**File:** `app.js` · `openModal` / `closeModal` functions (~lines 230-265)
**What's wrong:** When a modal opens, focus is not moved into the modal, and Tab can move focus behind the overlay to interactive elements underneath. When the modal closes, focus is not returned to the trigger element.

**Fix:** Add focus management to `openModal` and `closeModal`:

```js
let _lastFocusedEl = null;

function openModal(id) {
    _lastFocusedEl = document.activeElement;
    const overlay = document.getElementById(id);
    if (overlay) {
        overlay.classList.add('active');
        // Move focus to first focusable element
        const focusable = overlay.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) setTimeout(() => focusable.focus(), 50);
    }
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
    if (_lastFocusedEl) _lastFocusedEl.focus();
}
```

---

### Mo-05 · Accessibility · `<html>` tag missing `lang` attribute

**File:** `index.html` · Line 2  
**Status:** ✅ Actually present — `<html lang="en">` is correct. No fix needed.

---

### Mo-06 · UX Pattern · Toast notifications have no dismiss button

**File:** `app.js` · `showToast` function (~line 270); `styles.css` · toast styles
**What's wrong:** Toasts auto-dismiss after 4 seconds but have no close button. Users who need more time to read (cognitive accessibility, screen magnification) can't dismiss early or keep them visible.

**Fix — augment `showToast` in app.js:**

```js
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<i class="fas ' + getToastIcon(type) + '"></i><span>' + message + '</span>' +
        '<button class="toast-dismiss" onclick="this.parentElement.remove()" aria-label="Dismiss notification"><i class="fas fa-times"></i></button>';
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}
```

Add CSS:
```css
.toast-dismiss {
    background: none; border: none; color: inherit; cursor: pointer;
    padding: 4px; margin-left: 12px; opacity: 0.7; font-size: 12px;
}
.toast-dismiss:hover { opacity: 1; }
```

---

### Mo-07 · Dark Mode · Inline styles in `<style>` block use hardcoded light colors

**File:** `index.html` · Lines 18-50
**What's wrong:** Many colors in the inline `<style>` block are hardcoded light-theme values:
- `.dept-card { background: #fff }` (line 22)
- `.dept-info span { color: #6B7280 }` (line 36)  
- `.dept-util-bar { background: #F3F4F6 }` (line 38)
- `.leader-bar { background: #F3F4F6 }` (line 66)
- `.leader-info span { color: #6B7280 }` (line 65)

While there are `!important` dark overrides for `.dept-card`, the non-`!important` sub-elements may bleed through in dark mode contexts.

**Fix:** Use CSS custom properties instead of hardcoded colors:

```css
.dept-card { background: var(--gray-50, #fff); }
.dept-info span { color: var(--gray-500, #6B7280); }
.dept-util-bar { background: var(--gray-100, #F3F4F6); }
```

Or better yet, move these to `styles.css` per Mo-02.

---

## 🔵 MINOR FINDINGS

---

### Mi-01 · Accessibility · Decorative `<i>` icon elements lack `aria-hidden="true"`

**File:** `index.html` · 400+ `<i class="fas ...">` elements throughout
**What's wrong:** None of the Font Awesome icon elements have `aria-hidden="true"`. Screen readers attempt to announce them (reading either nothing useful or "icon"). When paired with text, they should be hidden from AT.

**Fix:** Add `aria-hidden="true"` to all decorative `<i>` elements. Example:

```html
<!-- CURRENT -->
<i class="fas fa-chart-line"></i>
<!-- FIX -->
<i class="fas fa-chart-line" aria-hidden="true"></i>
```

> This is a bulk operation across the entire HTML. Prioritize icon-only buttons (which should get `aria-label` per M-01 instead), then add `aria-hidden` to all remaining decorative icons.

---

### Mi-02 · UX Pattern · Avatar "RS" div used as click target but is not a button

**File:** `index.html` · Line 801
**What's wrong:** The topbar avatar is a `<div>` with `onclick` and `style="cursor:pointer"`. It's not keyboard-accessible and semantically incorrect.

oldString:
```html
<div class="avatar-sm topbar-avatar" onclick="openModal('modal-profile')" style="cursor:pointer">RS</div>
```

newString:
```html
<button class="avatar-sm topbar-avatar" onclick="openModal('modal-profile')" aria-label="Open profile" style="border:none;cursor:pointer">RS</button>
```

---

### Mi-03 · Text/Copy · Profile modal hardcodes dark-only colors in inline styles

**File:** `index.html` · Lines 3100-3130 (profile modal)
**What's wrong:** The profile modal uses inline styles like `color:#E2E8F0` (light gray), `color:#A0AEC0`, `background:rgba(124,58,237,0.08)` which are designed for dark backgrounds. On a light theme, these colors would be nearly invisible or low contrast.

**Fix:** Replace inline `style="color:#E2E8F0"` etc. with CSS classes that respond to the theme, or ensure the modal always has a dark background.

---

### Mi-04 · Text/Copy · Help Center, Shortcuts, and Manage Orgs modals all hardcode dark-only inline colors

**File:** `index.html` · Lines 3141-3320 (multiple modals)
**What's wrong:** Same as Mi-03 — extensive inline `style="color:#E2E8F0"`, `background:rgba(255,255,255,0.04)`, `border:1px solid #2D2D44` etc. These only look correct on dark mode and will appear broken on the light theme.

**Fix:** Extract these into CSS classes with appropriate light/dark variants rather than hardcoding dark colors inline.

---

### Mi-05 · JavaScript · `escapeHtml` function only escapes `<`, `>`, `&`

**File:** `app.js` · `escapeHtml` function (~line 310)
**What's wrong:** The function doesn't escape `"` or `'`, which could lead to attribute injection if user input ever flows into an attribute context.

**Fix:**
```js
function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
```

---

### Mi-06 · Layout · Mobile responsiveness: only one `@media` breakpoint

**File:** `styles.css` · Lines 1015-1028
**What's wrong:** There's only one responsive section targeting `max-width: 900px`. The sidebar collapses, but the dashboard content (KPI grids with `grid-template-columns: repeat(4, 1fr)`, pricing grids with 3 columns, forms with `.form-row` flex layouts) doesn't reflow for small screens. On phones, content overflows horizontally.

**Fix:** Add additional breakpoints:

```css
@media (max-width: 600px) {
    .kpi-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .form-row { flex-direction: column; }
    .auth-container { flex-direction: column; }
    .auth-left { display: none; }
}
```

---

### Mi-07 · UX Pattern · Keyboard shortcuts advertised but not implemented

**File:** `index.html` · Lines 3222-3264 (Shortcuts Modal); `app.js` (no global key listeners)
**What's wrong:** The shortcuts modal advertises ⌘K (Search), G+D (Dashboard), G+S (Settings), G+C (Copilot), ⌘N (Add App), ⌘E (Export), ⌘B (Toggle Sidebar), and ? (Shortcuts panel). None of these are implemented — there's no `keydown` event listener in app.js.

**Fix:** Either implement the shortcuts or remove the shortcuts modal. For a prototype, at minimum implement a few:

```js
document.addEventListener('keydown', function(e) {
    // ⌘K or Ctrl+K — focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-bar input')?.focus();
    }
    // ? — toggle shortcuts
    if (e.key === '?' && !e.target.matches('input, textarea, select')) {
        openModal('modal-shortcuts');
    }
});
```

---

## ⚪ COSMETIC FINDINGS

---

### Co-01 · Text/Copy · Inconsistent currency formatting

**File:** `index.html` · Various locations
**What's wrong:** The prototype mixes currency formats:
- `₹7.04L/mo` (line ~3283) — uses "L" for Lakh
- `₹24,00,000/yr` (modal line ~3052) — uses Indian comma format
- `₹62L at risk` — abbreviated
- `₹49/user/mo` — no Lakh notation
- `$49/user/month` vs `₹149/user/mo` — inconsistent "month" vs "mo"

**Fix:** Pick one format convention and apply consistently. Recommendation: Use `₹X.XL` for large numbers and always abbreviate "mo" (not "month").

---

### Co-02 · Layout · Inline `<style>` block clutters `<head>`

**File:** `index.html` · Lines 11-99
**What's wrong:** ~88 lines of CSS live in the `<head>` as inline styles. This defeats the purpose of having a separate `styles.css` file and adds page weight/complexity.

**Fix:** Move all styles to `styles.css` and remove the `<style>` block.

---

### Co-03 · Text/Copy · Demo walkthrough step 6 says "500+ companies" — should match landing

**File:** `index.html` · Line 3004
**What's wrong:** Demo says "Join 500+ companies saving millions" but the landing page (if different) may use other numbers. Ensure consistency. Minor but can erode trust.

---

### Co-04 · Icons · Modal close buttons use `fa-times` — consider `fa-xmark` (FA6 canonical)

**File:** `index.html` · All `close-btn` instances (~16 modals)
**What's wrong:** `fa-times` is the Font Awesome 5 name. While FA6 supports it as an alias, the canonical FA6 name is `fa-xmark`. Using the canonical name is forward-compatible.

**Fix:** Replace all `fa-times` in close buttons with `fa-xmark`. Low priority since the alias works.

---

## SUMMARY TABLE

| # | Category | Severity | File | Line(s) |
|---|----------|----------|------|---------|
| C-01 | JavaScript | 🔴 Critical | app.js | 33-36 |
| C-02 | JavaScript | 🔴 Critical | app.js | 97-100 |
| C-03 | Icons | 🔴 Critical | index.html | 556 |
| C-04 | Icons | 🔴 Critical | index.html | 1909 |
| C-05 | Dark Mode | 🔴 Critical | styles.css | 1648, 1868 |
| M-01 | Accessibility | 🟠 Major | index.html | 789, 796+ |
| M-02 | Accessibility | 🟠 Major | index.html | All forms |
| M-03 | Accessibility | 🟠 Major | index.html | 709-756, 2355-2362 |
| M-04 | Accessibility | 🟠 Major | index.html | 106-111 |
| M-05 | Dark Mode | 🟠 Major | styles.css | 239 |
| M-06 | Dark Mode | 🟠 Major | styles.css | 120 |
| M-07 | Dark Mode | 🟠 Major | styles.css | 482 |
| M-08 | Dark Mode | 🟠 Major | styles.css | 466 |
| M-09 | Text/Copy | 🟠 Major | index.html | 1538 |
| Mo-01 | UX Pattern | 🟡 Moderate | app.js | 1-15, 173, 200 |
| Mo-02 | Layout | 🟡 Moderate | index.html | 11-99 |
| Mo-03 | Accessibility | 🟡 Moderate | index.html | All modals |
| Mo-04 | Accessibility | 🟡 Moderate | app.js | 230-265 |
| Mo-06 | UX Pattern | 🟡 Moderate | app.js | ~270 |
| Mo-07 | Dark Mode | 🟡 Moderate | index.html | 18-50 |
| Mi-01 | Accessibility | 🔵 Minor | index.html | All `<i>` tags |
| Mi-02 | Accessibility | 🔵 Minor | index.html | 801 |
| Mi-03 | Dark Mode | 🔵 Minor | index.html | 3100-3130 |
| Mi-04 | Dark Mode | 🔵 Minor | index.html | 3141-3320 |
| Mi-05 | JavaScript | 🔵 Minor | app.js | ~310 |
| Mi-06 | Layout | 🔵 Minor | styles.css | 1015-1028 |
| Mi-07 | UX Pattern | 🔵 Minor | app.js / index.html | 3222-3264 |
| Co-01 | Text/Copy | ⚪ Cosmetic | index.html | Various |
| Co-02 | Layout | ⚪ Cosmetic | index.html | 11-99 |
| Co-03 | Text/Copy | ⚪ Cosmetic | index.html | 3004 |
| Co-04 | Icons | ⚪ Cosmetic | index.html | All close-btn |

**Total: 30 findings** — 5 Critical, 9 Major, 6 Moderate, 7 Minor, 4 Cosmetic
