# SaaSIQ — UX Prototype

> Interactive UI/UX prototype for **SaaSIQ** — an AI-Powered SaaS Spend Intelligence & Shadow IT Governance Platform.

![Status](https://img.shields.io/badge/status-prototype-7C3AED)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-blue)

---

## 📋 Overview

This repository contains the full end-to-end interactive prototype for SaaSIQ, covering **15+ screens** including:

- **Landing Page** — Hero, features, pricing, and footer
- **Authentication** — Login & Signup flows
- **Onboarding** — 4-step guided setup wizard
- **Dashboard** — Full app shell with sidebar navigation
  - SaaS Discovery
  - Spend Intelligence
  - Usage Analytics
  - Compliance & Risk
  - Contracts & Policies
  - AI Insights & AI Copilot
  - Alerts & Settings
- **Watch Demo** — Product demo modal

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x **OR** Node.js (for local server) **OR** any static file server

### Option 1 — Python HTTP Server (Recommended)

```bash
# Clone the repository
git clone https://github.com/saasiq/saasiq-ux-prototype.git
cd saasiq-ux-prototype

# Start a local server
python3 -m http.server 8765

# Open in browser
open http://localhost:8765
```

### Option 2 — Node.js (npx)

```bash
# Clone the repository
git clone https://github.com/saasiq/saasiq-ux-prototype.git
cd saasiq-ux-prototype

# Start a local server using npx
npx serve -l 8765

# Open in browser
open http://localhost:8765
```

### Option 3 — VS Code Live Server

1. Open this folder in VS Code
2. Install the **Live Server** extension (`ritwickdey.LiveServer`)
3. Right-click `index.html` → **Open with Live Server**

### Option 4 — Direct File Open

```bash
# Simply open the HTML file in your browser
open index.html
```

> **Note:** Some features like hash routing work best when served via a local HTTP server (Options 1–3).

---

## 🧭 Navigating the Prototype

- Use the **floating compass button** (bottom-right corner) to jump between screens
- Use the top navigation links on the landing page
- Keyboard shortcut: **⌘ + K** (Mac) / **Ctrl + K** (Windows) to open AI Copilot search

---

## 📁 Project Structure

```
saasiq-ux-prototype/
├── index.html    # All screens (SPA architecture)
├── styles.css    # Design system & responsive styles
├── app.js        # Navigation, routing & interactions
└── README.md     # This file
```

---

## 🎨 Design System

| Token             | Value       |
|-------------------|-------------|
| Primary Color     | `#7C3AED`   |
| Background        | `#0F0F1A`   |
| Surface           | `#1A1A2E`   |
| Text Primary      | `#FFFFFF`   |
| Text Secondary    | `#A0AEC0`   |
| Font Family       | Inter        |
| Sidebar Width     | 260px        |

---

## 🏗️ Related Repositories

| Repo | Description |
|------|-------------|
| `saasiq-web` | Angular/TypeScript frontend (coming soon) |
| `saasiq-api-gateway` | Django API Gateway service |
| `saasiq-ai-engine` | AI/ML Engine microservice |
| `saasiq-infra` | Docker, Kafka, Nginx, Prometheus configs |

---

## 📄 License

MIT © SaaSIQ Platform

---

<p align="center">
  <b>SaaSIQ</b> — See Every SaaS. Control Every Dollar.
</p>
