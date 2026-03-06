# SaaSIQ — Complete UI/UX Documentation

> **Product:** SaaSIQ — AI-Powered SaaS Spend Intelligence & Shadow IT Governance Platform  
> **Version:** Prototype v1.0  
> **Last Updated:** 5 March 2026  
> **Tech Stack:** Pure HTML, CSS, JavaScript (no frameworks) — Single Page Application  

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Application Architecture](#2-application-architecture)
3. [Page Navigator (Floating Widget)](#3-page-navigator-floating-widget)
4. [Page 1 — Landing Page](#4-page-1--landing-page)
5. [Page 2 — Login Page](#5-page-2--login-page)
6. [Page 3 — Signup Page](#6-page-3--signup-page)
7. [Page 4 — Onboarding Flow](#7-page-4--onboarding-flow)
8. [Page 5 — Main Dashboard (App Shell)](#8-page-5--main-dashboard-app-shell)
   - [Sidebar Navigation](#81-sidebar-navigation)
   - [Top Bar](#82-top-bar)
   - [Dashboard Home](#83-dashboard-home)
   - [SaaS Discovery & Shadow IT](#84-saas-discovery--shadow-it)
   - [Spend Intelligence](#85-spend-intelligence)
   - [Usage Analytics](#86-usage-analytics)
   - [Compliance & Risk](#87-compliance--risk)
   - [Contract Management](#88-contract-management)
   - [Policy Engine](#89-policy-engine)
   - [AI Insights](#810-ai-insights)
   - [AI Copilot](#811-ai-copilot)
   - [Alerts & Notifications](#812-alerts--notifications)
   - [Settings (8 Tabs)](#813-settings-8-tabs)
9. [Page 6 — Interactive Demo Walkthrough](#9-page-6--interactive-demo-walkthrough)
10. [Global UI Components](#10-global-ui-components)
    - [Modals](#101-modals)
    - [Toast Notifications](#102-toast-notifications)
    - [Dropdowns](#103-dropdowns)
11. [Design System Reference](#11-design-system-reference)
12. [Interactive Behaviors Summary](#12-interactive-behaviors-summary)

---

## 1. Product Overview

### What is SaaSIQ?

SaaSIQ is an **AI-powered SaaS Spend Intelligence platform** designed for IT teams, CFOs, and procurement leaders. It solves a critical enterprise problem: **companies waste 30-40% of their SaaS budget** on unused licenses, duplicate tools, shadow IT, and missed renewal negotiations.

### Core Problems It Solves

| Problem | Impact | How SaaSIQ Solves It |
|---------|--------|---------------------|
| **Shadow IT** | Employees use unapproved tools without IT's knowledge, creating security and compliance risks | Auto-discovers every SaaS app via SSO, email, browser extension |
| **Wasted Licenses** | Companies pay for licenses nobody uses (avg. 39% waste) | Real-time usage tracking per seat, auto-identifies unused licenses |
| **Missed Renewals** | Contracts auto-renew at full price without negotiation | AI-powered renewal alerts with benchmarking data |
| **Compliance Gaps** | Unapproved tools may violate GDPR, SOC2, DPDP regulations | Auto risk-scoring, compliance monitoring, audit-ready reports |
| **No Spend Visibility** | Finance teams lack granular SaaS cost data by department | AI-powered spend analytics, anomaly detection, predictions |

### Target Users

- **IT Managers / CIOs** — Need SaaS inventory visibility and shadow IT control
- **CFOs / Finance Teams** — Need spend analytics and cost optimization
- **Procurement** — Need contract intelligence and vendor negotiation data
- **Compliance Officers** — Need audit-ready compliance reports
- **CTO / Engineering Leads** — Need tool consolidation recommendations

---

## 2. Application Architecture

### Page-Based SPA Routing

The prototype is a **single HTML file** with multiple "pages" (div containers). Only one page is visible at a time.

```
showPage('page-id')  →  Hides all pages, shows the target page
```

**Pages in the app:**

| Page ID | Screen | Entry Points |
|---------|--------|-------------|
| `page-landing` | Marketing landing page | Default on load, logo click |
| `page-login` | Authentication — Sign in | "Login" nav link, "Sign In" CTA |
| `page-signup` | Authentication — Create account | "Start Free Trial" CTA |
| `page-onboarding` | 4-step guided setup | After signup form submit |
| `page-dashboard` | Main app with sidebar + sections | After login, after onboarding |
| `page-demo` | Interactive product walkthrough | "Watch Demo" CTA |

### Dashboard Section Routing

Inside `page-dashboard`, there are **12 sections** (only one visible at a time), toggled via sidebar clicks:

```
showDashSection('section-name')  →  Hides all .dash-section, shows #sec-{section-name}
```

| Section ID | Dashboard Screen |
|-----------|-----------------|
| `sec-dashboard-home` | Main overview dashboard |
| `sec-discovery` | SaaS Discovery & Shadow IT |
| `sec-spend` | Spend Intelligence |
| `sec-usage` | Usage Analytics |
| `sec-compliance` | Compliance & Risk |
| `sec-contracts` | Contract Management |
| `sec-policies` | Policy Engine |
| `sec-ai-insights` | AI Insights |
| `sec-ai-copilot` | AI Copilot Chat |
| `sec-alerts` | Alerts & Notifications |
| `sec-settings` | Settings (with 8 inner tabs) |

---

## 3. Page Navigator (Floating Widget)

### What It Is
A **fixed-position compass button** at the bottom-right corner of the screen that expands into a quick-jump navigation panel.

### Why It's Needed
Since this is a **prototype for stakeholder review**, reviewers need to quickly jump between any screen without navigating the full user flow (landing → login → onboarding → dashboard). In a production app, this would not exist.

### How It Works
- **Collapsed state:** Small purple compass icon (🧭) at bottom-right
- **Click:** Toggles the panel open/closed
- **Panel shows:** Direct links to all 6 major pages

### UI Elements

| Element | Purpose |
|---------|---------|
| Compass icon button (`.nav-toggle`) | Opens/closes the navigation panel |
| "Landing Page" link | Jump to marketing page |
| "Login" link | Jump to sign-in screen |
| "Signup" link | Jump to account creation |
| "Onboarding" link | Jump to setup wizard |
| "Dashboard (Sidebar)" link (highlighted) | Jump to main app — this is the primary review screen |
| "Watch Demo" link | Jump to interactive walkthrough |

---

## 4. Page 1 — Landing Page

### Purpose
The **public-facing marketing page** that converts visitors into trial users. This is what potential customers see before they sign up.

### Why It's Needed
Every SaaS product needs a compelling landing page that communicates the value proposition, builds trust, and drives signup conversions. The landing page answers three questions: *What is this?*, *Why should I care?*, and *How do I start?*

### Sections & Elements

#### 4.1 Navigation Bar (`.landing-nav`)

| Element | What It Does | Why It's Needed |
|---------|-------------|----------------|
| **SaaSIQ Logo** | Brand identity at top-left. Clickable — returns to landing page from anywhere | Brand recognition; consistent anchor across all pages |
| **Features link** | Smooth-scrolls to features section | Lets visitors learn about capabilities without leaving the page |
| **Pricing link** | Smooth-scrolls to pricing section | Pricing is the #1 most-visited section on SaaS landing pages |
| **Enterprise link** | Smooth-scrolls to enterprise section | Enterprise buyers have different needs — they want to see custom options |
| **Login link** | Navigates to `page-login` | Returning users need quick access to their accounts |
| **"Start Free Trial" button** | Navigates to `page-signup` | Primary conversion CTA — stands out as a filled purple button |

#### 4.2 Hero Section (`.hero`)

| Element | What It Does | Why It's Needed |
|---------|-------------|----------------|
| **Trust badge** ("🚀 Trusted by 500+ companies") | Social proof banner above headline | Immediately builds credibility — visitors trust what others already trust |
| **Headline** ("Stop Wasting 30% of Your SaaS Budget") | Core value proposition in one line | The first thing visitors read — must hook them in under 3 seconds |
| **Gradient text** | The "30% of Your SaaS Budget" part is styled with a purple gradient | Visual emphasis on the key statistic — makes the pain point memorable |
| **Subheadline** | Expands on the headline: "AI-powered SaaS spend intelligence..." | Adds context for those who want more detail before scrolling |
| **Primary CTA** ("Start Free 14-Day Trial") | Large purple button with rocket icon | The main conversion action — positioned above the fold for maximum visibility |
| **Secondary CTA** ("Watch Demo") | Outline button with play icon | For visitors not ready to sign up but interested in learning more |
| **Hero Stats** (3 metrics) | "$2.4M avg savings", "12 min setup", "400+ integrations" | Quantifiable proof points — concrete numbers build trust more than vague claims |
| **Mock Dashboard Preview** | Mini preview of the actual dashboard with mock data | "Show, don't tell" — gives visitors a taste of what they'll get, reduces uncertainty |

**Mock Dashboard Preview Details:**
- Browser chrome (dots + URL bar showing `app.saasiq.io/dashboard`)
- Mini sidebar with nav items
- 4 KPI cards (Total Spend, Savings Found, Shadow Apps, Renewals Soon)
- Bar chart visualization

#### 4.3 Trusted By Section (`.trusted-by`)

| Element | What It Does | Why It's Needed |
|---------|-------------|----------------|
| **Company logos** (TCS, Infosys, Wipro, Razorpay, Freshworks, Zoho, Swiggy, PhonePe) | Shows Indian enterprise customer logos | Social proof specifically for Indian market — SaaSIQ targets Indian enterprises |

**Why these specific companies?** They represent a mix of large IT services (TCS, Infosys, Wipro), successful Indian startups (Razorpay, Freshworks, Swiggy, PhonePe), and an established SaaS player (Zoho). This signals SaaSIQ is trusted across company types.

#### 4.4 Features Section (#features)

| Feature Card | Icon | What It Communicates | Why It's Needed |
|-------------|------|---------------------|----------------|
| **Shadow IT Discovery** | 🔍 Purple | "We find every SaaS tool, even ones IT doesn't know about" | Shadow IT is the #1 pain point — 40% of SaaS purchases happen outside IT |
| **Spend Intelligence** | 📈 Green | "AI finds savings you didn't know existed" | CFOs want quantifiable ROI; this promises AI-driven cost savings |
| **License Optimization** | 👥 Blue | "Track real usage, save 30-40% on licenses" | License waste is the biggest SaaS cost leak |
| **Compliance & Risk** | 🛡 Orange | "GDPR, DPDP, SOC2 compliance at a glance" | Regulatory compliance is non-negotiable for enterprises |
| **Contract Intelligence** | 📄 Red | "NLP-powered contract analysis, never miss a renewal" | Renewal management is a pain — missed renewals cost millions |
| **AI Copilot** | 🤖 Teal | "Ask in plain English, get instant answers" | Natural language interface makes the product accessible to non-technical users |

#### 4.5 Pricing Section (#pricing)

| Plan | Price | Target Audience | Why This Tier Exists |
|------|-------|----------------|---------------------|
| **Starter** | $3/employee/mo | Small teams (≤100 employees) | Low barrier to entry — gets small teams hooked on basic discovery |
| **Business** (featured) | $7/employee/mo | Growing companies (≤1000) | The "sweet spot" plan with AI features — highlighted as "Most Popular" to anchor buyers |
| **Enterprise** | Custom pricing | Large organizations (unlimited) | Custom deal for enterprise sales — includes AI Copilot, on-prem, dedicated support |

**Pricing Psychology:**
- Business plan is visually elevated (larger card, "Most Popular" badge)
- Starter plan uses outline button (lower emphasis), Business uses filled button (high emphasis)
- Enterprise shows "Contact Sales" — standard for high-value enterprise deals

#### 4.6 Footer (`.landing-footer`)

| Element | Purpose |
|---------|---------|
| **Brand section** | Logo + tagline — reinforces brand identity |
| **Product links** | Features, Pricing, Integrations, API |
| **Company links** | About, Blog, Careers, Contact |
| **Legal links** | Privacy, Terms, GDPR, DPDP — required for compliance |
| **Copyright** | "© 2026 SaaSIQ. All rights reserved." |

---

## 5. Page 2 — Login Page

### Purpose
Authenticates returning users and grants access to the dashboard.

### Why It's Needed
Users need a secure, familiar way to access their SaaSIQ workspace. The split-screen layout maximizes both brand messaging and form usability.

### Layout
**Split-screen design** — left panel (brand/social proof), right panel (login form).

### UI Elements

#### Left Panel (`.auth-left`)

| Element | Purpose | Why It's Needed |
|---------|---------|----------------|
| **SaaSIQ Logo** | Clickable — returns to landing page | Consistent branding; escape hatch back to marketing site |
| **"Welcome back" heading** | Warmth + recognition | Makes returning users feel valued |
| **Tagline** | "Control your SaaS spend. Eliminate waste. Stay compliant." | Reinforces value prop on every login |
| **Testimonial quote** | Rajesh Kumar, CTO of Razorpay | Social proof at the point of action — reduces login friction |

#### Right Panel — Login Form (`.auth-right`)

| Element | Purpose | Why It's Needed |
|---------|---------|----------------|
| **"Sign in to your account" heading** | Clear page intent | Users should immediately know what this page is for |
| **"Don't have an account?"** link | Link to signup page | Catches users who landed on login but need to register |
| **Google OAuth button** | One-click Google sign-in | 80%+ of SaaS users prefer social login — reduces friction |
| **Microsoft OAuth button** | One-click Microsoft sign-in | Enterprise users often use Azure AD / Microsoft accounts |
| **"or continue with email" divider** | Separates social from email auth | Visual hierarchy — social first (faster), email fallback |
| **Work Email field** | Pre-filled with `admin@techcorp.com` | Prototype convenience — demo users can just click "Sign In" |
| **Password field** | Pre-filled with `password123` | Same — reduces prototype testing friction |
| **"Forgot password?" link** | Password recovery flow | Required for any login form — users forget passwords |
| **"Sign In" button** | Submits form → navigates to `page-dashboard` | Primary action — triggers mock authentication |

---

## 6. Page 3 — Signup Page

### Purpose
Creates a new user account and starts the free trial. Captures essential company information.

### Why It's Needed
The signup flow is the most critical conversion point. Every field is there for a reason — the data enables SaaSIQ to personalize the onboarding experience.

### Layout
Same **split-screen design** as login — left panel (benefits), right panel (form).

### UI Elements

#### Left Panel — Benefits

| Element | Purpose |
|---------|---------|
| **"Start saving in minutes"** | Urgency + simplicity promise |
| **"No credit card required"** | Removes financial commitment anxiety |
| **4 benefit checkmarks:** | |
| ✓ Discover all SaaS tools in 12 minutes | Speed promise |
| ✓ Find savings within first hour | Quick ROI |
| ✓ No IT team changes required | Low friction |
| ✓ SOC2 Type II certified | Security assurance |

#### Right Panel — Signup Form

| Field | Data Captured | Why It's Needed |
|-------|--------------|----------------|
| **First Name + Last Name** | User identity | Personalization throughout the app ("Hi Rahul") |
| **Work Email** | Authentication + company domain | Email domain identifies the company; prevents personal email signups |
| **Company Name** | Organization name | Displayed throughout the dashboard, reports |
| **Company Size** (dropdown) | Employee count brackets | Determines plan recommendation and feature limits |
| **Password** | Account security | Required for email-based authentication |
| **Google/Microsoft signup** | Social account linking | Faster registration via existing identity providers |
| **"Create Account" button** | Form submit → `page-onboarding` | Kicks off the 4-step setup wizard |
| **Terms consent** | Legal agreement | Required by law — links to Terms and Privacy Policy |

---

## 7. Page 4 — Onboarding Flow

### Purpose
A **4-step guided wizard** that connects the user's existing tools so SaaSIQ can begin discovering SaaS apps.

### Why It's Needed
SaaSIQ's value depends entirely on data. Without integrations, it can't discover apps, track spend, or monitor compliance. The onboarding flow ensures users connect at least one data source before reaching the dashboard — otherwise the dashboard would be empty and the user would churn.

### Progress Indicator
A horizontal **step progress bar** at the top showing 4 numbered circles connected by lines:
1. Connect SSO → 2. Integrations → 3. Team Invite → 4. Preferences

Active step is highlighted; completed steps show a checkmark.

### Step 1: Connect Your Identity Provider

| Element | Purpose | Why It's Needed |
|---------|---------|----------------|
| **Heading** | "Connect Your Identity Provider" | Clear instruction |
| **Explanation text** | "We only read app names and user emails — never passwords" | Privacy reassurance — users are nervous about giving SSO access |
| **Google Workspace card** (connected) | Primary SSO provider | Most common in Indian businesses; shown as already connected for demo |
| **Azure AD / Entra card** | Microsoft SSO option | Required for Microsoft-heavy enterprises |
| **Okta card** | Enterprise SSO provider | Large enterprises use Okta for identity management |
| **Auth0 card** | Developer-friendly auth | Popular among tech companies |
| **"Skip for now" button** | Goes directly to dashboard | Not forcing integrations — user can explore first (but with empty data) |
| **"Continue" button** | Proceeds to Step 2 | Natural flow progression |

**Why SSO First?** SSO provides the richest data source — it reveals every SaaS app employees authenticate through. One SSO connection can discover 80%+ of apps.

### Step 2: Connect Additional Data Sources

| Integration | Data It Provides | Why It's Needed |
|-------------|-----------------|----------------|
| **Slack** | Bot installations, app mentions | Discovers tools adopted through Slack integrations |
| **Stripe / Billing** (connected) | Transaction data | Reveals exact SaaS payments — the "source of truth" for spend |
| **QuickBooks / Zoho** | Expense categorization | Catches SaaS purchases on corporate cards |
| **Email (Gmail/Outlook)** | Receipts & invoices | Discovers tools users signed up for via email |
| **Browser Extension** | Real-time app detection | Catches tools that don't go through SSO (direct logins) |
| **AWS / GCP / Azure** | Cloud infrastructure spend | Cloud costs are often the #1 SaaS expense |

### Step 3: Invite Your Team

| Element | Purpose | Why It's Needed |
|---------|---------|----------------|
| **Email input + role dropdown + "Add" button** | Invite team members with specific roles | SaaSIQ is a collaborative tool — finance, IT, and procurement all need access |
| **Role options** (Admin, Finance Manager, IT Manager, Viewer) | Role-based access control | Different stakeholders need different permissions |
| **Invited member list** (Priya Kapoor, Amit Mehta) | Shows who's been invited | Visual confirmation; sets multi-user expectation |
| **Invite status** | "Invited" with paper-plane icon | Shows the invite is sent but not yet accepted |

### Step 4: Set Your Preferences

| Preference | Options | Why It's Needed |
|-----------|---------|----------------|
| **Primary Currency** | INR (₹), USD ($), EUR (€), GBP (£) | SaaSIQ targets Indian enterprises — INR is default; spend data must display in the user's currency |
| **Fiscal Year Start** | April (India default), January, July, October | Indian fiscal year starts in April — financial reports must align with company's fiscal year |
| **Alert Preferences** | Email digest, Renewal reminders, Shadow IT alerts, Slack notifications | Users control how often they're notified — prevents alert fatigue |
| **Compliance Frameworks** | DPDP Act 2023, SOC2, GDPR, ISO 27001, HIPAA | Determines which compliance checks are active — DPDP is India-specific and pre-selected |
| **"Launch Dashboard" button** | Goes to `page-dashboard` | Final step — user feels accomplishment |

---

## 8. Page 5 — Main Dashboard (App Shell)

### Purpose
The **core application** where users spend 90% of their time. Contains a sidebar, top bar, and 12 swappable content sections.

### Layout Architecture

```
┌──────────────────────────────────────────────┐
│ [Sidebar (260px)]  │  [Top Bar]               │
│                    │──────────────────────────│
│  Logo              │  [Active Section Content] │
│  Org Selector      │                          │
│  Nav Items         │                          │
│  User Profile      │                          │
└──────────────────────────────────────────────┘
```

---

### 8.1 Sidebar Navigation

#### Why a Sidebar?
SaaS dashboards use sidebar navigation (not top nav) because:
1. It accommodates many navigation items without horizontal cramping
2. Items are always visible — users don't lose context
3. Standard pattern (Slack, Notion, Linear) — users already understand it

#### Sidebar Elements

| Element | What It Is | Why It's Needed |
|---------|-----------|----------------|
| **SaaSIQ Logo** (top) | Brand icon + "SaaSIQ" text. Clickable → landing page | Persistent branding; escape route to marketing site |
| **Organization Selector** | Shows "TechCorp India" (active org) with avatar "TC" | Users may manage multiple organizations — this allows switching between them |
| **Org Chevron** (▼) | Indicates the selector is a dropdown | Discoverability — users know they can click to see more options |
| **Org Dropdown** (on click) | Shows 3 orgs + "Create New" + "Manage Organizations" | Enterprise users manage multiple workspaces (e.g., India, Global, Sandbox) |

**Navigation Sections & Items:**

| Section | Nav Item | Icon | Badge | What It Navigates To |
|---------|---------|------|-------|---------------------|
| **Overview** | Dashboard | 🏠 home | — | Main KPI overview |
| **Intelligence** | SaaS Discovery | 🔍 search | 47 (red) | App discovery & shadow IT |
| | Spend Intelligence | 📈 chart-line | — | Cost analytics & AI recommendations |
| | Usage Analytics | 👥 users-cog | — | License utilization tracking |
| **Governance** | Compliance & Risk | 🛡 shield-alt | 5 (orange) | Risk scoring & compliance monitoring |
| | Contracts | 📄 file-contract | 12 (yellow) | Contract management & renewals |
| | Policies | ⚖ gavel | — | Governance policy engine |
| **AI & Insights** | AI Insights | 🤖 robot | 8 (purple) | ML-powered recommendations |
| | AI Copilot | 💬 comments | — | Natural language chat interface |
| **System** | Alerts | 🔔 bell | 3 (red) | Notifications & alerts |
| | Settings | ⚙ cog | — | Configuration (8 sub-tabs) |

**Badge Meaning:**
- **Red badges (47, 3):** Requires urgent attention (shadow apps, critical alerts)
- **Orange badge (5):** Warning level (compliance issues)
- **Yellow badge (12):** Informational but important (contracts needing review)
- **Purple badge (8):** AI-generated insights available

#### User Profile (Sidebar Footer)

| Element | Purpose |
|---------|---------|
| **"RS" avatar** | Initials of logged-in user (Rahul Sharma) |
| **Name + Role** | "Rahul Sharma" / "Admin" |
| **Ellipsis icon** (⋮) | Indicates more options available |
| **User Dropdown** (on click) | My Profile, Settings, Help Center, Keyboard Shortcuts, Sign Out |

#### Sidebar Collapse (Hamburger)

| State | Width | Behavior |
|-------|-------|----------|
| **Expanded** (default) | 260px | Full labels, badges, org name visible |
| **Collapsed** (after hamburger click) | 68px | Icons only — text hidden, badges hidden, clean icon strip |
| **Mobile** (≤768px) | Off-screen | Slides in as overlay with backdrop |

**Why collapse?** On smaller screens or when users want more content space, collapsing the sidebar to icon-only mode gives significantly more horizontal room for data tables and charts.

---

### 8.2 Top Bar

| Element | What It Is | Why It's Needed |
|---------|-----------|----------------|
| **Hamburger button** (☰) | Toggles sidebar collapse/expand on desktop; opens sidebar on mobile | Essential for responsive design and user preference |
| **Search bar** | "Search apps, contracts, insights... (⌘K)" | Global search across all data — keyboard shortcut (Cmd+K) for power users |
| **Help button** (?) | Quick access to help center | Users need contextual help without leaving the current screen |
| **Notification bell** | Shows alerts; has a red dot for unread | Quick check for new alerts without navigating to Alerts section |
| **Notification red dot** | Appears on bell when unread alerts exist | Visual indicator that demands attention |
| **User avatar** ("RS") | Quick identifier of logged-in user | Persistent identity awareness |

---

### 8.3 Dashboard Home

**Section ID:** `sec-dashboard-home`

#### Purpose
The **landing screen** when users enter the dashboard. Provides a high-level executive summary of the entire SaaS landscape in one glance.

#### Why It's Needed
Decision-makers (CTOs, CFOs) want to "check the pulse" of their SaaS landscape in 10 seconds. This dashboard surfaces the most critical data — total spend, savings opportunities, application count, and license health — without requiring them to dig into individual sections.

#### Elements

##### KPI Cards (Top Row)

| KPI Card | Value | Change Indicator | Why This Metric |
|----------|-------|-----------------|----------------|
| **Total SaaS Spend** | ₹7,04,32,000 | ↑ 12.3% vs last quarter (negative/red) | The #1 question executives ask: "How much are we spending?" |
| **Savings Identified** | ₹1,94,50,000 | ↑ 27.6% of total spend (positive/green) | Immediate ROI proof — "SaaSIQ found this much waste" |
| **Total Applications** | 187 | 47 Shadow IT (red tag) | Complete SaaS inventory count; shadow IT count creates urgency |
| **License Utilization** | 61% | ↓ 39% licenses wasted (negative/red) + progress bar | The "health score" of license efficiency; progress bar is instantly readable |

**Why these 4 KPIs?** They answer the 4 most important questions:
1. "How much are we spending?" → Total Spend
2. "Can we save money?" → Savings Identified
3. "What tools do we have?" → Total Applications
4. "Are we using what we pay for?" → License Utilization

##### Charts Row

| Chart | Type | What It Shows | Why It's Needed |
|-------|------|-------------|----------------|
| **Monthly SaaS Spend Trend** (wide) | Line chart (SVG) | 12-month spend trajectory with 3 lines: Actual (purple solid), AI Predicted (purple dashed), Optimized (green dashed) | Shows spend direction over time; AI prediction creates urgency to optimize before costs grow |
| **Spend by Category** | Donut chart (SVG) | Percentage breakdown: DevOps 25%, Collaboration 20%, Sales 15%, Design 10%, Others 30% | Identifies which departments are the biggest spenders |

**Chart Insights:**
- The **gap between Actual and Optimized** lines represents the savings opportunity
- The **AI Predicted dashed line** extending beyond current data shows future projections
- The **donut chart center** shows total (₹7.04Cr) for context

##### Action Items Card

| Action Item | Priority | What It Says | Why It's Urgent |
|------------|----------|-------------|----------------|
| "Salesforce renewal in 7 days" | **CRITICAL** (red) | ₹24L/year — 34% licenses unused | Auto-renew locks in full price for another year |
| "23 new shadow apps found this week" | **HIGH** (orange) | 5 flagged as high-risk (no SOC2) | Potential security/compliance breach |
| "Duplicate tools: 3 project management apps" | **MEDIUM** (yellow) | Jira + Asana + Monday.com — save ₹8.5L | Cost waste from tool overlap |
| "AI suggests downgrading Figma plan" | **INFO** (blue) | 47 seats → 12 active users. Save ₹3.2L/year | Low-risk optimization opportunity |

Each has a **Review/Investigate/Optimize/View button** to take action directly.

##### Upcoming Renewals Card

| Renewal | Date | Cost | Urgency Badge |
|---------|------|------|--------------|
| Salesforce Enterprise | Mar 12, 2026 | ₹24,00,000/yr | **7 days** (red) |
| GitHub Enterprise | Mar 28, 2026 | ₹18,50,000/yr | **23 days** (orange) |
| Slack Business+ | Apr 15, 2026 | ₹12,00,000/yr | **41 days** (green) |
| Jira Premium | May 01, 2026 | ₹8,40,000/yr | **57 days** (green) |

**Why a renewal timeline?** Missed renewals are the #1 source of unnecessary SaaS cost. Auto-renewals lock in prices. By surfacing upcoming renewals with urgency color-coding, users take action before it's too late.

##### Top Applications Table

| Column | What It Shows | Why It's Needed |
|--------|-------------|----------------|
| **Application** | App name + icon | Quick identification |
| **Category** | CRM, Cloud, DevOps, Design, Video | Understand the app's function |
| **Monthly Spend** | Cost in ₹ | Financial impact |
| **Licenses** | Used / Total (e.g., 150 / 200) | Utilization visibility |
| **Utilization** | Visual progress bar + percentage | Instantly see under-utilized apps |
| **Risk Score** | Low / Medium / High badges | Security health at a glance |
| **Status** | Managed / Shadow IT | Governance classification |
| **Actions** (⋮) | More options menu | Access detailed app view |

**Shadow IT highlight:** The Loom row has a special ghost (👻) icon + "Shadow" tag, and the entire row is styled differently to draw attention.

---

### 8.4 SaaS Discovery & Shadow IT

**Section ID:** `sec-discovery`

#### Purpose
The **complete SaaS application inventory** — every tool discovered across the organization, classified by status, risk, and source.

#### Why It's Needed
IT teams need to answer: "What SaaS tools are people using?" This page provides the full answer. Without it, organizations have no visibility into their tool landscape, and shadow IT proliferates unchecked.

#### Elements

##### Discovery Stats Bar

| Stat | Value | Color | What It Means |
|------|-------|-------|-------------|
| Total Apps | **187** | Blue | Complete inventory count |
| Managed | **124** | Green | Approved apps under IT control |
| Shadow IT | **47** | Red | Unapproved apps employees are using without IT knowledge |
| Under Review | **16** | Yellow | Apps found via scan, pending approval decision |
| New This Week | **12** | Purple | Freshly discovered apps — need attention |

##### Filter Bar

| Filter | Options | Why It's Needed |
|--------|---------|----------------|
| **Search** | Free text search across app names | Find specific apps quickly in a list of 187 |
| **Category** | All, DevOps, Collaboration, Design, Sales | Filter by function |
| **Status** | All, Managed, Shadow IT, Under Review | Focus on specific governance status |
| **Risk Level** | All, High, Medium, Low | Prioritize by risk |
| **Source** | All, SSO, Email, Browser, Manual | Understand how each app was discovered |

##### App Cards Grid

**Managed App Card** (e.g., Slack):
| Element | What It Shows |
|---------|-------------|
| Icon + Name + Category | "Slack" / "Collaboration" |
| Status badge | "Managed" (green) |
| Users metric | 412 |
| Monthly cost | ₹1,00,000 |
| Utilization | 89% |
| Risk badge | "Low Risk" |
| Discovery source | "SSO" (key icon) |

**Shadow IT App Card** (e.g., ChatGPT Plus):
| Element | What It Shows | Why It's Different |
|---------|-------------|-------------------|
| **Shadow banner** | "👻 Shadow IT Detected" in red | Immediately draws attention to unapproved tools |
| Risk badge | "High Risk" (red) | These tools often lack security certifications |
| Discovery source | "Browser" (globe icon) | Shows it was caught by browser extension, not SSO |
| **Action buttons** | "Approve" + "Block" | IT admin can act immediately — approve the tool or block it |

**Why Approve and Block?** Shadow IT isn't always bad. Sometimes employees find great tools that should be adopted company-wide. The approve/block pattern lets IT make informed decisions rather than blanket-blocking everything.

##### "Add Application" Button

Opens a modal form to manually add an application (for tools not auto-discovered). See [Modals section](#101-modals).

---

### 8.5 Spend Intelligence

**Section ID:** `sec-spend`

#### Purpose
**AI-powered cost analysis** — where every rupee goes, what's wasted, and where to save.

#### Why It's Needed
CFOs and finance teams need granular visibility into SaaS spending patterns. This section goes beyond "how much" to "why", "where", and "how to fix it" — using AI to detect anomalies and recommend optimizations.

#### Elements

##### KPI Cards

| KPI | Value | Insight |
|-----|-------|---------|
| **Annual SaaS Spend** (highlighted card) | ₹8.45 Cr | The total annual number — highlighted because it's the primary metric |
| **Cost per Employee** | ₹16,250/mo (520 employees) | Benchmarking metric — "Are we spending more per employee than industry average?" |
| **Wasted Spend** | ₹2.85 Cr (33.7% of total) | The pain point — nearly a third of spend is wasted |
| **AI Savings Found** | ₹1.94 Cr (42 opportunities) | Actionable savings — motivates users to explore recommendations |

##### Department Spend Breakdown

Horizontal bar chart showing spend by department:

| Department | Spend | % | Why It's Shown |
|-----------|-------|---|---------------|
| Engineering | ₹2.96 Cr | 35% | Usually the biggest SaaS consumer |
| Sales & Marketing | ₹2.11 Cr | 25% | CRM, marketing automation tools |
| Operations | ₹1.52 Cr | 18% | Internal tools, communication |
| Design & Product | ₹1.01 Cr | 12% | Figma, prototyping, PM tools |
| HR & Admin | ₹0.85 Cr | 10% | HRIS, payroll, recruitment tools |

**Why this chart?** Finance teams need to allocate SaaS costs to department budgets. This enables departmental accountability.

##### AI Anomaly Alerts

| Anomaly | Type | What AI Detected |
|---------|------|-----------------|
| "AWS Spend Spike: +47%" | 📈 Spike (red arrow) | Unusual cost increase — possible unused resources |
| "Duplicate Tool Detected" | 📋 Duplicate (clone icon) | Jira + Asana + Monday.com — consolidation opportunity |
| "Zoom Enterprise Downgrade" | ♻ Waste (recycle icon) | 92% of meetings under 40 min — free plan sufficient |

**Why anomalies?** AI can spot patterns humans miss. A 47% AWS spike might go unnoticed in monthly reports but could indicate a misconfigured service costing thousands.

##### Optimization Opportunities Table

| Column | Purpose |
|--------|---------|
| Application | Which tool to optimize |
| Recommendation | Specific action to take |
| Current Cost | What you pay now |
| Projected Cost | What you'd pay after optimization |
| Est. Savings | Annual savings amount |
| Confidence | AI's certainty (96%, 92%, 78%) |
| Action button | "Apply", "Review", or "Plan" |

**Why confidence scores?** AI recommendations have varying certainty. A 96% confidence "remove unused Figma licenses" is a no-brainer, while a 78% "consolidate project tools" needs more analysis.

---

### 8.6 Usage Analytics

**Section ID:** `sec-usage`

#### Purpose
Tracks **how much of each SaaS license is actually being used** — the gap between "licenses purchased" and "licenses actively used."

#### Why It's Needed
Companies buy 100 seats but only 60 are used. This section exposes that waste per-application with visual utilization bars, enabling data-driven right-sizing decisions.

#### Elements

##### KPI Cards

| KPI | Value | Significance |
|-----|-------|-------------|
| **Total Licenses** | 2,847 | Complete count across all SaaS tools |
| **Active Users** | 1,734 (61% utilization) | Only 61% of paid seats are being used |
| **Inactive Licenses** | 1,113 (₹47L/yr wasted) | 1,113 seats paid for but not used — massive waste |
| **Avg. Last Login** | 14 days | On average, how recently users logged into their tools |

##### License Utilization Bars

Visual bars for each application:

| App | Utilization | Seats | Action | Color |
|-----|------------|-------|--------|-------|
| Slack | 89% (412/462) | Near-full | **Optimal** (green) | Green |
| AWS | 88% | Well-used | **Optimal** (green) | Green |
| Salesforce | 66% (132/200) | Under-used | **Downsize** (warning) | Yellow |
| GitHub | 68% (340/500) | Under-used | **Downsize** (warning) | Yellow |
| Figma | 26% (12/47) | Critically under-used | **Critical** (danger) | Red |
| Zoom | 31% (156/500) | Critically under-used | **Critical** (danger) | Red |

**Why visual bars?** A number like "26%" is abstract. A thin red bar next to a full green bar creates immediate contrast — the visual impact motivates action.

---

### 8.7 Compliance & Risk

**Section ID:** `sec-compliance`

#### Purpose
Monitors **vendor risk scores and regulatory compliance** across all SaaS applications.

#### Why It's Needed
Enterprises must comply with DPDP (India), GDPR (EU), SOC2, ISO 27001, and HIPAA. Using a non-compliant tool can result in legal penalties, data breaches, and audit failures. This section ensures every tool meets the organization's compliance requirements.

#### Elements

##### KPI Cards

| KPI | Value | Meaning |
|-----|-------|---------|
| **Overall Risk Score** | B+ (Good) | Aggregate score — 3 issues to resolve to reach A |
| **Compliant Apps** | 142 / 187 (76%) | 45 apps are missing some compliance certifications |
| **High Risk Apps** | 5 | Apps that pose immediate security/compliance threats |
| **Data Residency Issues** | 8 | Apps storing data outside India — DPDP violation |

##### Compliance Framework Coverage

| Framework | Coverage | Gap | Why Tracked |
|-----------|----------|-----|-------------|
| **DPDP Act 2023** | 78% | 12 apps non-compliant | India's data protection law — mandatory for Indian businesses |
| **SOC 2 Type II** | 85% | 8 apps uncertified | Industry standard security certification |
| **ISO 27001** | 72% | 18 apps uncertified | International information security standard |
| **GDPR** | 91% | 4 apps non-compliant | EU data protection — applies to any EU customer data |

##### High Risk Applications

| App | Risk Score | Issues | Action |
|-----|----------|--------|--------|
| **ChatGPT (Shadow)** | 92/100 (critical) | No SOC2, Data sent to US, No DPA, 56 users | "Block" button |
| **Loom (Shadow)** | 78/100 (high) | No ISO 27001, Video data unencrypted, 28 users | "Review" button |
| **Airtable (Shadow)** | 74/100 (high) | Data residency US only, No DPDP, 15 users | "Review" button |

**Why risk scores?** Not all non-compliant apps are equally dangerous. A risk score (0-100) helps IT prioritize — fix the 92-score ChatGPT issue before the 74-score Airtable one.

---

### 8.8 Contract Management

**Section ID:** `sec-contracts`

#### Purpose
Tracks **all SaaS contracts, renewal dates, pricing, and negotiation opportunities** with AI-powered benchmarking.

#### Why It's Needed
Missed renewals auto-lock companies into expensive contracts. This section prevents that by providing a timeline view of all renewals with AI-generated negotiation recommendations.

#### Elements

##### KPI Cards

| KPI | Value | Actionability |
|-----|-------|-------------|
| **Active Contracts** | 64 | Total contracts tracked |
| **Renewing in 30 Days** | 4 (₹62L at risk) | Immediate attention needed — these renew soon |
| **Total Contract Value** | ₹8.45 Cr | Annual contract obligations |
| **AI Negotiation Savings** | ₹1.2 Cr potential | How much AI estimates can be saved through negotiation |

##### Contract Timeline

Visual timeline organized by month:

**March 2026:**
| Contract | Date | Value | AI Recommendation | Urgency |
|----------|------|-------|-------------------|---------|
| Salesforce Enterprise | Mar 12 | ₹24L/yr, Auto-renew ON | "Negotiate down to ₹15.8L. Similar companies pay 18% less." | **Urgent** (red) |
| GitHub Enterprise | Mar 28 | ₹18.5L/yr, Auto-renew ON | "160 unused seats. Reduce from 500 to 350. Save ₹5.5L/yr." | **Warning** (yellow) |

**April 2026:**
| Contract | Date | Value |
|----------|------|-------|
| Slack Business+ | Apr 15 | ₹12L/yr, Auto-renew ON |

**Why AI tips in the timeline?** Raw renewal dates aren't actionable. But "Negotiate down to ₹15.8L — similar companies pay 18% less" gives procurement teams a concrete starting point for negotiation.

##### Buttons
- **"Upload Contract"** — Upload existing contract PDFs for AI analysis
- **"Add Contract"** — Opens modal to manually add a new contract

---

### 8.9 Policy Engine

**Section ID:** `sec-policies`

#### Purpose
Define and enforce **automated governance rules** that control how SaaS tools are approved, used, and monitored.

#### Why It's Needed
Without policies, SaaS governance is reactive — IT discovers problems after they happen. Policies make governance proactive — rules automatically block non-compliant tools, require approvals for expensive purchases, and enforce data residency.

#### Elements

##### Policy Cards

| Policy | Type | Violations | What It Enforces |
|--------|------|-----------|-----------------|
| **SOC2 Certification Required** | Security | 5 violations | All new SaaS tools must be SOC2 certified before approval |
| **Spend Approval Threshold** | Financial | 0 violations | SaaS purchases >₹50K/month need CTO + CFO approval |
| **Data Residency — India** | Compliance | 8 violations | Apps handling PII must store data within India (DPDP compliance) |

Each card shows:
- **Active/Inactive status** indicator
- **Policy description** in plain language
- **Category** tag (Security, Financial, Compliance)
- **Violation count** — how many apps currently violate this policy
- **Creation date**

##### "Create Policy" Button
Opens a modal with a full policy builder including IF/THEN conditions, enforcement levels, and notification settings. See [Modals section](#101-modals).

---

### 8.10 AI Insights

**Section ID:** `sec-ai-insights`

#### Purpose
**Machine learning-powered recommendations** — proactive suggestions generated by AI analyzing the entire SaaS landscape.

#### Why It's Needed
Users don't know what they don't know. AI surfaces hidden patterns: unused licenses, security risks, cost predictions, and negotiation opportunities that humans would miss in spreadsheets.

#### Insight Cards

Each insight card has: **type label + confidence score + title + description + impact metrics + action buttons.**

| Insight | Type | Confidence | Key Recommendation | Action Buttons |
|---------|------|-----------|-------------------|---------------|
| **Remove 35 unused Figma licenses** | 💰 Cost Savings | 96% | 12 of 47 used in 60 days. Save ₹7.6L/year | "Apply Recommendation" → toast success, "Dismiss" → fade out |
| **Block unsanctioned AI tools** | 🛡 Security Alert | 94% | 56 employees using ChatGPT with company email. Data exposure risk | "Block Immediately" → toast danger, "Upgrade to Enterprise" → toast success |
| **Q2 spend projected to increase 22%** | 📈 Prediction | 87% | SaaS spend will reach ₹8.6L/month by June 2026 | "Set Budget Alert" → toast success, "View Details" → toast info |
| **Salesforce renewal: negotiate 34% discount** | 🤝 Negotiation | 91% | Industry benchmarks show 18-25% lower pricing | "Generate Brief" → toast success, "View Benchmark" → toast info |

##### Impact Metrics per Card

Each card contains 3 quantified metrics:

| Card | Metric 1 | Metric 2 | Metric 3 |
|------|----------|----------|----------|
| Figma | Annual Savings: ₹7,60,800 | Affected Users: 35 | Risk Level: Very Low |
| AI Tools | Risk Score: 92/100 | Affected Users: 56 | Data Types: Code, Docs |
| Q2 Prediction | Current Monthly: ₹7.04L | Projected June: ₹8.59L | Increase: +₹1.55L/mo |
| Salesforce | Current Price: ₹24L/yr | Target Price: ₹15.8L/yr | Benchmark: ₹16.2L avg |

**Why confidence scores?** They let users prioritize high-confidence actions first and investigate lower-confidence ones before acting.

---

### 8.11 AI Copilot

**Section ID:** `sec-ai-copilot`

#### Purpose
A **natural language chat interface** where users ask questions about their SaaS landscape in plain English and get data-driven answers.

#### Why It's Needed
Not everyone can navigate dashboards effectively. The AI Copilot democratizes data access — a CFO can type "How much do we spend on project management?" and get an answer with tables, not just a number.

#### Elements

| Element | What It Does | Why It's Needed |
|---------|-------------|----------------|
| **Suggestion chips** (4 pre-written questions) | Clickable chips that populate the input field | Reduces blank-screen anxiety; shows users what they can ask |
| **Chat conversation** (pre-populated) | Sample Q&A showing the Copilot's capabilities | Demonstrates the value immediately — users see it can answer complex questions |
| **User messages** | Styled with "RS" avatar on left | Identify who's asking |
| **AI responses** | Robot avatar + styled data cards with tables | Rich, formatted answers with actual data |
| **Data card (table)** | Mini table showing Jira/Asana/Monday.com comparison | AI doesn't just say numbers — it presents structured data |
| **Migration plan** | 6-week breakdown in steps | Shows AI can generate actionable plans, not just analytics |
| **Input field** | Text input with Enter key support | Where users type their questions |
| **Send button** | Paper-plane icon | Submit the message |
| **Typing indicator** | Three bouncing dots | Simulates AI "thinking" — creates realistic feel |

##### Pre-Built AI Responses (5 Categories)

| Trigger Keywords | Response Topic |
|-----------------|---------------|
| "spend", "cost", "budget" | Monthly spend breakdown, top cost drivers, savings |
| "shadow", "unapproved", "unsanctioned" | 8 shadow IT apps detected with costs |
| "renew", "contract", "expir" | 4 upcoming renewals with AI negotiation tips |
| "compliance", "risk", "soc", "gdpr" | Compliance score, SOC2 coverage, action items |
| "user", "utilization", "unused", "license" | License utilization stats, consolidation savings |
| (any other text) | Default: directs to Spend Intelligence & AI Insights |

---

### 8.12 Alerts & Notifications

**Section ID:** `sec-alerts`

#### Purpose
A **centralized alert feed** showing real-time notifications from across the SaaS landscape.

#### Why It's Needed
Problems surface asynchronously — a shadow IT detection at 3 AM, a renewal approaching on a weekend. Alerts ensure nothing falls through the cracks by aggregating all events in one timeline.

#### Elements

##### Filter Buttons

| Filter | Count | What It Shows |
|--------|-------|-------------|
| All | — | Every alert |
| Critical | 2 | Red-level alerts requiring immediate action |
| Warning | 5 | Yellow-level issues that need attention soon |
| Info | 12 | Blue-level informational notifications |

##### Alert Cards

| Alert | Severity | Time | Details | Actions |
|-------|----------|------|---------|---------|
| **Salesforce renewal in 7 days** | 🔴 Critical | 2 hours ago | Contract ₹24L/year auto-renews. 34% licenses unused | "Review Contract" + "Snooze" |
| **ChatGPT on 56 accounts** | 🔴 Critical | 5 hours ago | Company emails on ChatGPT. No SOC2, no DPA | "Block App" + "Investigate" |
| **AWS spend anomaly +47%** | 🟡 Warning | 1 day ago | Monthly cost jumped ₹1.8L → ₹2.65L | — |
| **AI: Downgrade Figma plan** | 🔵 Info | 2 days ago | Only 12/47 licenses active. Save ₹7.6L/year | — |
| **Weekly scan: 3 new apps** | 🔵 Info | 3 days ago | Miro, Calendly, Grammarly discovered. Classified as Shadow IT | — |

**Unread indicator:** Critical alerts have an "unread" style (left border highlight) to visually distinguish new from seen.

---

### 8.13 Settings (8 Tabs)

**Section ID:** `sec-settings`

#### Purpose
The **configuration hub** for the entire SaaSIQ workspace — everything from org details to billing.

#### Why It's Needed
Every SaaS product needs a settings page. SaaSIQ has 8 distinct configuration areas because it touches org management, integrations, team access, notifications, security, appearance, API access, and billing — each is a separate concern.

#### Tab Navigation
Vertical sidebar within Settings with 8 tabs. Click a tab → the right panel shows that tab's content.

---

#### Tab 1: Organization

**Purpose:** Configure basic company details that appear across the platform.

| Setting | Default Value | Why It's Needed |
|---------|-------------|----------------|
| **Organization Name** | TechCorp India Pvt. Ltd. | Displayed in reports, dashboards, exports |
| **Primary Domain** | techcorp.com | Used for employee email matching |
| **Industry** | Information Technology | Enables industry-specific benchmarks |
| **Company Size** | 201-1000 employees | Determines plan limits and recommendations |
| **Primary Currency** | INR (₹) | All spend data displayed in this currency |
| **Connected Integrations summary** | Google (active), Slack (active), Azure AD (not connected) | Quick status overview |

---

#### Tab 2: Integrations

**Purpose:** Manage all connected and available data sources.

**Connected integrations (3):**
| Integration | Data Synced | Last Sync |
|------------|-----------|-----------|
| Google Workspace | 342 users | 2h ago |
| Slack | 289 users | 1h ago |
| AWS | 28 services | 30m ago |

Each has "Configure" and "Disconnect" buttons.

**Available integrations (5):** Azure AD, Jira, Figma, GitHub, Stripe — each with a "Connect" button.

---

#### Tab 3: Team Members

**Purpose:** Manage who has access to SaaSIQ and their permissions.

| Member | Role | Status | Actions |
|--------|------|--------|---------|
| Rahul Sharma | Admin | Active | Edit only (can't remove self) |
| Ananya Patel | Editor | Active | Edit, Remove |
| Vikram Kumar | Editor | Active | Edit, Remove |
| Priya Mehta | Viewer | Active | Edit, Remove |
| Deepak Gupta | Viewer | Pending (invited 5 days ago) | Resend, Revoke |

**Role definitions:**
- **Admin:** Full access — can manage settings, billing, integrations
- **Editor:** Can manage apps, contracts, policies — cannot change settings
- **Viewer:** Read-only access to dashboards and reports

---

#### Tab 4: Notifications

**Purpose:** Control alert channels and frequency.

**Alert Channels:**
| Channel | Default | What It Does |
|---------|---------|-------------|
| Email Notifications | ✅ ON | Alerts to rahul@techcorp.com |
| Slack Alerts | ✅ ON | Posts to #saasiq-alerts |
| SMS Notifications | ❌ OFF | Critical alerts via text message |
| In-App Push | ✅ ON | Browser push notifications |

**Alert Types (all ON by default):**
- Shadow IT Detected
- Contract Renewals (within 30 days)
- Budget Threshold (spend exceeds 80%)
- Compliance Issues (policy violations)
- Weekly Digest (summary every Monday 9 AM)

Each uses a **toggle switch** for easy on/off.

---

#### Tab 5: Security

**Purpose:** Authentication controls and access policies.

**Authentication:**
| Setting | Status | Description |
|---------|--------|-------------|
| Two-Factor Auth | Enabled | Extra security layer |
| Single Sign-On | Active (Google SAML 2.0) | Enterprise SSO |
| Session Timeout | 1 hour (dropdown) | Auto-logout after inactivity |

**Access Controls:**
| Setting | Status | Description |
|---------|--------|-------------|
| IP Allowlist | Not configured | Restrict to specific IPs |
| Role-Based Access | 3 roles active | Admin/Editor/Viewer permissions |

**Audit Log:** Timeline of recent security-relevant actions:
- "Rahul Sharma changed notification settings" (Today, 2:34 PM)
- "Ananya Patel connected Slack integration" (Today, 11:15 AM)
- "System: Auto-discovered 3 new SaaS apps" (Yesterday)

---

#### Tab 6: Appearance

**Purpose:** Customize the visual look of the dashboard.

| Setting | Options | Current |
|---------|---------|---------|
| **Theme** | Dark Mode, Light Mode, System Default | Dark Mode (active) |
| **Accent Color** | Purple, Blue, Green, Amber, Red, Pink | Purple (active) |
| **Dashboard Density** | Comfortable, Default, Compact | Default (active) |

Theme cards show mini-previews of the sidebar + content layout. Accent color shows clickable color dots.

---

#### Tab 7: API & Webhooks

**Purpose:** Programmatic integration with external tools.

**API Keys:**
| Key | Masked Value | Actions |
|-----|-------------|---------|
| Production Key (created Jan 15) | `sk_live_••••3a7f` | Copy, Delete |
| Development Key (created Feb 20) | `sk_test_••••9b2e` | Copy, Delete |

**Webhooks:**
| Webhook | Endpoint | Status | Actions |
|---------|---------|--------|---------|
| Slack Notifier | `hooks.slack.com/services/...` | Active | Edit, Delete |
| Jira Ticket Creator | `techcorp.atlassian.net/rest/...` | Paused | Edit, Delete |

**API Documentation link** → View Docs button for SaaSIQ REST API v2.

**Why API access?** Enterprise customers integrate SaaSIQ into their existing workflows — e.g., auto-create Jira tickets for shadow IT, post spend alerts to Slack.

---

#### Tab 8: Billing

**Purpose:** Manage subscription plan, payment method, and invoices.

| Setting | Value |
|---------|-------|
| **Current Plan** | Business Plan — $49/user/month |
| **Seats** | 25 users, billed annually |
| **Renewal Date** | April 1, 2026 |
| **Payment Method** | Visa ending 4242, exp 08/2027 |

**Recent Invoices:**
| Date | Description | Amount | Status |
|------|------------|--------|--------|
| Mar 1, 2026 | Business Plan – 25 users | $1,225.00 | Paid ✅ |
| Feb 1, 2026 | Business Plan – 25 users | $1,225.00 | Paid ✅ |
| Jan 1, 2026 | Business Plan – 22 users | $1,078.00 | Paid ✅ |

Each invoice has a "PDF" download button.

**Usage meter:** 21 of 25 seats used (84%) — visual bar.

---

## 9. Page 6 — Interactive Demo Walkthrough

### Purpose
A **6-step animated walkthrough** that shows the product's core value in ~2 minutes. Replaces a traditional demo video.

### Why It's Needed
Potential customers on the landing page want to see the product in action before signing up. A static video is passive; an interactive walkthrough engages users and lets them proceed at their own pace.

### Structure
- **Modal overlay** covering the full screen
- **Progress bar** at the top (fills as steps advance)
- **Step indicator** ("Step 1 of 6" + timer)
- **Auto-play** with 5-second intervals per step
- **Manual controls:** Previous/Next buttons, play/pause, clickable dot indicators

### 6 Demo Steps

| Step | Title | Screen Content | Caption |
|------|-------|---------------|---------|
| **1. Connect** | "Connect Your Stack" | Grid of 6 app tiles (Google ✅, Slack ✅, AWS ⏳, Salesforce, GitHub, Figma) | "One-Click Integrations — SaaSIQ auto-discovers every app in under 60 seconds" |
| **2. Discovery** | "SaaS Discovery — 47 Apps Found" | List of 5 apps — Google & Slack (✅ Approved), CloudApp & DataDog (🔴 Shadow IT), Microsoft 365 (✅ Approved) | "Shadow IT Detection — Found 8 unapproved tools costing $4,200/mo" |
| **3. Spend** | "Spend Intelligence Dashboard" | 3 KPIs ($2.4M spend, $312K savings, 67% utilization) + bar chart by app | "Spend Breakdown — where budget is being wasted on unused licenses" |
| **4. AI Copilot** | "AI Copilot — Smart Recommendations" | Chat-style AI messages with 3 recommendation cards (Slack ↓, Zoom consolidation, Shadow IT removal) | "AI-Powered Savings — AI continuously recommends cost-saving actions" |
| **5. Compliance** | "Compliance & Risk Overview" | SVG gauge showing A+ score + 5 compliance items (3 pass ✅, 1 warn ⚠, 1 fail ❌) | "Always Audit-Ready — continuous monitoring for SOC2, GDPR, ISO 27001" |
| **6. ROI** | "Your ROI with SaaSIQ" | Giant "$312K" projected savings + 4 stats (5 min setup, 14 day trial, 30%+ savings, 500+ companies) + pulsing CTA button | "Ready to Save? — No credit card required. 14 days full access" |

### Controls

| Control | What It Does |
|---------|-------------|
| **Previous button** | Goes to previous step (disabled on step 1) |
| **Play/Pause toggle** | Auto-advances every 5 seconds when playing |
| **Dot indicators** | One dot per step — clickable to jump directly |
| **Next button** | Advances to next step |
| **Close (✕)** | Closes the demo overlay |
| **CTA on Step 6** | "Start Your Free Trial Now" → navigates to signup |

---

## 10. Global UI Components

### 10.1 Modals

Three modal dialogs that open over the current page:

#### Add Application Modal (`modal-add-app`)

**Triggered by:** "Add Application" button on SaaS Discovery page

**Purpose:** Manually add a SaaS application that wasn't auto-discovered.

**Why It's Needed:** Not all tools are detectable via SSO or browser extension. Some (e.g., niche internal tools) must be manually catalogued to maintain a complete inventory.

| Form Field | Input Type | Options/Placeholder |
|-----------|-----------|-------------------|
| Application Name | Text input | "e.g., Notion, Datadog, Postman" |
| Category | Dropdown | Productivity, Development, Communication, Design, Analytics, Security, Finance, HR, Marketing |
| Status | Dropdown | Approved, Under Review, Shadow IT |
| Monthly Cost | Text input | "e.g., ₹25,000" |
| Number of Users | Number input | "e.g., 50" |
| Vendor URL | URL input | "https://www.example.com" |
| Owner / Department | Dropdown | Engineering, Product, Design, Marketing, Sales, HR, Finance, IT |
| Notes | Textarea | Free text notes |

**Submit action:** Closes modal + shows success toast: "Application added successfully! AI scan will begin shortly."

---

#### Add Contract Modal (`modal-add-contract`)

**Triggered by:** "Add Contract" button on Contract Management page

**Purpose:** Register a new SaaS contract for tracking renewals and spend.

| Form Field | Input Type | Options |
|-----------|-----------|---------|
| Vendor / Application | Text input | "e.g., Salesforce, AWS, Slack" |
| Contract Type | Dropdown | Annual, Monthly, Multi-Year, Pay-As-You-Go, Enterprise License |
| Contract Value | Text input | "e.g., ₹24,00,000/yr" |
| Start Date | Date picker | Default: today |
| End Date | Date picker | Default: 1 year from today |
| Licensed Seats | Number input | "e.g., 500" |
| Auto-Renew | Dropdown | Yes / No |
| Renewal Reminder | Dropdown | 30 / 60 / 90 days before |
| Upload Contract PDF | File upload area | Drag & drop or browse (PDF, DOC up to 10MB) |
| Notes | Textarea | Key terms, negotiation notes |

**Submit action:** Closes modal + shows success toast: "Contract added! AI will analyze terms and flag renewal opportunities."

---

#### Create Policy Modal (`modal-create-policy`)

**Triggered by:** "Create Policy" button on Policy Engine page

**Purpose:** Create a new governance rule with automated enforcement.

| Form Field | Input Type | Options |
|-----------|-----------|---------|
| Policy Name | Text input | "e.g., No unapproved AI tools" |
| Description | Textarea | What this policy enforces |
| Category | Dropdown | Security, Financial, Compliance, Usage, Data Privacy |
| Enforcement Level | Dropdown | Block (Hard Enforce), Warn (Soft Enforce), Audit Only |
| Applies To | Multi-select | All Departments, Engineering, Product, Marketing, Sales, HR, Finance |
| Status | Dropdown | Active, Draft, Paused |
| Condition (IF) | Dropdown | New SaaS app detected, Spend exceeds threshold, Compliance cert missing, User count exceeds limit |
| Action (THEN) | Dropdown | Block access, Notify admin, Require approval, Auto-quarantine |
| Notification options | Checkboxes | Email admin, Post to Slack #compliance, Create Jira ticket |

**Submit action:** Closes modal + shows success toast: "Policy created and now active! SaaSIQ will monitor for violations."

---

### Modal Behaviors

| Behavior | Implementation |
|---------|---------------|
| **Open** | `openModal('modal-id')` — adds `.open` class with fade-in animation |
| **Close** | Click ✕ button, click backdrop (outside modal), press Escape key |
| **Overlay** | Semi-transparent dark backdrop (z-index: 2000) |

---

### 10.2 Toast Notifications

**Purpose:** Brief, auto-dismissing feedback messages for user actions.

**Why They're Needed:** When a user clicks "Apply Recommendation" or "Block Immediately", they need immediate visual confirmation that the action was processed, without navigating away.

| Type | Color | Icon | Example |
|------|-------|------|---------|
| **Success** | Green | ✓ check-circle | "Application added successfully!" |
| **Danger** | Red | ✕ times-circle | "Blocked! 8 unsanctioned AI tools restricted." |
| **Info** | Blue | ℹ info-circle | "Opening detailed spend projection..." |
| **Warning** | Amber | ⚠ exclamation-triangle | "Budget threshold approaching" |

**Behavior:**
- Appears at top-right of screen
- Auto-dismisses after 4 seconds
- z-index: 3000 (above everything)

---

### 10.3 Dropdowns

#### Organization Dropdown

**Triggered by:** Clicking the org selector in the sidebar

| Item | Purpose |
|------|---------|
| **TechCorp India** (active, checkmark) | Current workspace |
| **TechCorp Global** | Enterprise-level workspace (120 users) |
| **TechCorp Sandbox** | Test environment (5 users) |
| **Create New Organization** | Add a new workspace |
| **Manage Organizations** | Org settings |

**On org select:** Updates sidebar org name + shows toast "Switched to [Organization]"

#### User Profile Dropdown

**Triggered by:** Clicking the user profile area in sidebar footer

| Item | Action |
|------|--------|
| My Profile | Toast: "Opening your profile..." |
| Settings | Navigates to Settings section |
| Help Center | Toast: "Opening help center..." |
| Keyboard Shortcuts | Toast: "Opening keyboard shortcuts..." |
| **Sign Out** (red/danger) | Navigates to Login page |

---

## 11. Design System Reference

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | #7C3AED | Brand purple — buttons, active states, accents |
| `--primary-dark` | #6D28D9 | Hover state for primary color |
| `--bg` | #0F0F1A | App background (dark theme) |
| `--gray-900` | #111827 | Sidebar background |
| `--green` / `--red` / `--yellow` / `--orange` / `--blue` | Standard alert colors | KPI changes, badges, status indicators |

### Typography

| Element | Size | Weight |
|---------|------|--------|
| Page headings (h1) | 24px | 700 (bold) |
| KPI values | 28px | 800 (extra bold) |
| Card titles (h3) | 16px | 600 (semi-bold) |
| Body text | 14px | 400 (regular) |
| Labels / captions | 12px | 500 (medium) |
| Font family | Inter | Google Fonts |

### Spacing & Layout

| Aspect | Value |
|--------|-------|
| Sidebar width | 260px (expanded) / 68px (collapsed) |
| Max content width | 1400px |
| Card border radius | 12px |
| Card padding | 24px |
| Grid gap | 20px |

### Badge System

| Badge Type | Colors | Usage |
|-----------|--------|-------|
| Status badges | Green (Managed/Active), Red (Shadow IT/Critical), Yellow (Under Review/Warning) | Classification |
| Risk badges | Green (Low), Yellow (Medium), Red (High) | Risk level |
| Priority badges | Red (Critical), Orange (High), Yellow (Medium), Blue (Info) | Urgency |
| Role badges | Purple (Admin), Blue (Editor), Gray (Viewer) | Permissions |

---

## 12. Interactive Behaviors Summary

| Action | What Happens |
|--------|-------------|
| Click **hamburger (☰)** | Desktop: collapses sidebar to 68px (icons only). Mobile: opens sidebar overlay |
| Click **sidebar nav item** | Shows corresponding dashboard section, highlights active item |
| Click **org selector** | Opens organization dropdown; click org to switch |
| Click **user profile** | Opens user dropdown (Profile, Settings, Help, Shortcuts, Sign Out) |
| Click **"Add Application"** | Opens Add Application modal with form |
| Click **"Add Contract"** | Opens Add Contract modal with form |
| Click **"Create Policy"** | Opens Create Policy modal with form |
| Click **AI Insight buttons** | Shows toast notification with action confirmation |
| Type in **AI Copilot** + Enter | Sends message, shows typing indicator, AI responds |
| Click **suggestion chip** | Populates copilot input with the suggestion text |
| Click **settings tab** | Shows corresponding settings panel, highlights active tab |
| Click **theme card** | Highlights selected theme card |
| Click **color dot** | Highlights selected accent color |
| Click **filter button** | Filters content in Discovery, Alerts sections |
| Press **Cmd+K / Ctrl+K** | Focuses the global search bar |
| Press **Escape** | Closes any open modal, dropdown |
| Click **demo Play/Pause** | Toggles auto-advance (5s per step) |
| Click **demo dots** | Jumps to specific demo step |

---

> **Created for:** SaaSIQ UX Prototype v1.0  
> **Document Purpose:** Complete reference for designers, developers, stakeholders, and QA  
> **Maintained by:** SaaSIQ Product Team
