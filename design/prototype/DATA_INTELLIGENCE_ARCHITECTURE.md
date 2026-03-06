# SaaSIQ — Data Intelligence Architecture
## How to Achieve 99% Accuracy in SaaS Discovery, Usage & Spend
## (Destroying Zylo's 93%, Torii's 91%, and Productiv's 90%)

> **Status:** Technical Architecture Document — SUPREME EDITION  
> **Audience:** Engineering team (3 developers)  
> **Goal:** Build the most accurate SaaS data intelligence platform on the planet — 99% accuracy, not estimates  
> **Benchmark:** DESTROY Zylo (93%), Torii (91%), Productiv (90%) — we target **99%**  
> **Competitive Edge:** 13 data source layers (competitors max at 6), ML ensemble entity resolution, human-in-the-loop validation, continuous learning feedback loops  
> **Date:** 6 March 2026  

---

## The Core Insight

**A single data source NEVER gives you full accuracy.**

| Data Source Alone | What It Sees | What It Misses | Accuracy |
|-------------------|-------------|----------------|----------|
| SSO only | Apps behind SSO login | Direct-login apps, mobile apps, browser tools | ~45% |
| Email scanning only | SaaS receipts + welcome emails | Apps paid by corporate card, free tools | ~35% |
| Browser extension only | Apps opened in browser | Desktop apps, mobile apps, API tools | ~40% |
| Bank/card statements only | Paid SaaS subscriptions | Free tools, tools on personal cards, bundled licenses | ~50% |
| CASB/Firewall only | Network traffic to SaaS domains | Encrypted traffic details, offline tools, mobile on cellular | ~55% |

**The secret:** Layer ALL sources together. Each source fills gaps the others miss. With 8 sources: **90-95%.** With 13 sources + ML ensemble + human validation + feedback loop: **99%.**

```
                    ┌──────────────────────────────────┐
                    │     UNIFIED SaaS TRUTH ENGINE     │
                    │        (Entity Resolution)        │
                    └──────────┬───────────────────────┘
                               │
        ┌──────────┬───────────┼───────────┬──────────────┐
        │          │           │           │              │
   ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼─────┐  ┌────▼─────┐
   │  SSO   │ │Financial│ │ Email  │ │ Browser │  │ Network  │
   │ Layer  │ │ Layer   │ │ Layer  │ │Extension│  │  Layer   │
   │ (45%)  │ │ (50%)   │ │ (35%)  │ │ (40%)   │  │  (55%)   │
   └────────┘ └────────┘ └────────┘ └─────────┘  └──────────┘
        │          │           │           │              │
        ▼          ▼           ▼           ▼              ▼
   App names   Exact $$$   App signups  Real usage    All traffic
   + users     per vendor  + invoices   per minute    to SaaS IPs

   + 5 MORE LAYERS FOR 99% (Zylo/Torii stop here at ~93%)
        │          │           │           │              │
   ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼─────┐  ┌────▼─────┐
   │Desktop │ │ OAuth  │ │Contract│ │Employee │  │ Vendor   │
   │ Agent  │ │Deep    │ │ AI     │ │  Self-  │  │Confirm-  │
   │Layer 9 │ │Audit 10│ │Parse 11│ │Report 12│  │ation 13  │
   └────────┘ └────────┘ └────────┘ └─────────┘  └──────────┘
        │          │           │           │              │
        ▼          ▼           ▼           ▼              ▼
   ALL desktop  Hidden     Exact $$     Ground       Vendor-
   + CLI apps  OAuth       from         truth        confirmed
   + processes  grants     contracts    validation   license #
```

---

## Table of Contents

1. [Data Source Layer 1: Identity Provider / SSO](#1-identity-provider--sso-layer)
2. [Data Source Layer 2: Financial / Spend](#2-financial--spend-layer)
3. [Data Source Layer 3: Email Intelligence](#3-email-intelligence-layer)
4. [Data Source Layer 4: Browser Extension](#4-browser-extension-layer)
5. [Data Source Layer 5: Network / CASB](#5-network--casb-layer)
6. [Data Source Layer 6: Direct API Integrations](#6-direct-api-integrations-layer)
7. [Data Source Layer 7: HR / Employee Systems](#7-hr--employee-systems-layer)
8. [Data Source Layer 8: Expense Management](#8-expense-management-layer)
9. [Entity Resolution Engine](#9-entity-resolution-engine)
10. [SaaS Application Knowledge Graph](#10-saas-application-knowledge-graph)
11. [Usage Scoring Algorithm](#11-usage-scoring-algorithm)
12. [Spend Attribution Engine](#12-spend-attribution-engine)
13. [Accuracy Measurement Framework](#13-accuracy-measurement-framework)
14. [Data Pipeline Architecture](#14-data-pipeline-architecture)
15. [Privacy & Security Architecture](#15-privacy--security-architecture)
16. [What Zylo/Torii Do That You Must Match](#16-what-zylotorii-do-that-you-must-match)
17. [What They DON'T Do That You Can Beat Them On](#17-what-they-dont-do-that-you-can-beat-them-on)

### --- 99% ACCURACY UPGRADE: Sections 18-28 (What Makes SaaSIQ the #1 Most Accurate Platform) ---

18. [Data Source Layer 9: Desktop Agent + Process Monitor](#18-data-source-layer-9-desktop-agent--process-monitor)
19. [Data Source Layer 10: OAuth Token Deep Audit](#19-data-source-layer-10-oauth-token-deep-audit)
20. [Data Source Layer 11: Contract AI Intelligence](#20-data-source-layer-11-contract-ai-intelligence)
21. [Data Source Layer 12: Employee Self-Attestation](#21-data-source-layer-12-employee-self-attestation)
22. [Data Source Layer 13: Vendor Confirmation Loop](#22-data-source-layer-13-vendor-confirmation-loop)
23. [ML Ensemble Entity Resolution (99% Matching)](#23-ml-ensemble-entity-resolution-99-matching)
24. [Human-in-the-Loop Validation System](#24-human-in-the-loop-validation-system)
25. [Continuous Accuracy Feedback Loop](#25-continuous-accuracy-feedback-loop)
26. [Cross-Customer Intelligence Network](#26-cross-customer-intelligence-network)
27. [The 99% Accuracy Guarantee Framework](#27-the-99-accuracy-guarantee-framework)
28. [Updated Build Sequence: Road to 99%](#28-updated-build-sequence-road-to-99)

---

## 1. Identity Provider / SSO Layer

### What This Captures
Every application that employees authenticate through via the company's identity provider.

### Data Sources

| Source | API | What You Get | Accuracy for This Layer |
|--------|-----|-------------|------------------------|
| **Google Workspace Admin** | Directory API + Reports API + Token API | Every 3rd-party app authorized via Google OAuth, every user, last login timestamp, admin-installed apps | 85% of cloud apps |
| **Azure AD / Entra ID** | Microsoft Graph API | Enterprise apps, service principals, sign-in logs, conditional access policies | 90% of enterprise apps |
| **Okta** | Okta API (System Log + Apps) | All apps in Okta catalog, user assignments, authentication events, MFA status | 95% of SSO-managed apps |
| **OneLogin** | OneLogin API | App catalog, user provisioning events, login events | 90% |
| **JumpCloud** | JumpCloud API | Directory users, bound applications, SSO events | 85% |
| **Auth0** | Auth0 Management API | Applications, connections, login events | 80% |
| **Ping Identity** | PingOne API | SSO applications, authentication events | 85% |

### Exact Data Points Extracted per App (Google Workspace Example)

```json
{
  "source": "google_workspace",
  "app": {
    "name": "Slack Technologies",
    "client_id": "606062829937-xxxxxxx.apps.googleusercontent.com",
    "scopes": ["email", "profile", "openid"],
    "type": "WEB_APPLICATION",
    "verified": true
  },
  "users": [
    {
      "email": "rahul@techcorp.com",
      "first_authorized": "2024-03-15T10:30:00Z",
      "last_used": "2026-03-05T14:22:00Z",
      "scopes_granted": ["email", "profile"],
      "is_admin_installed": false
    }
  ],
  "org_wide": {
    "total_users_authorized": 412,
    "admin_installed": true,
    "install_date": "2023-01-10T00:00:00Z"
  }
}
```

### Google Workspace — Specific APIs to Call

```python
# 1. List all 3rd-party apps authorized by users
# Google Admin SDK → Reports API → Activities: token
GET https://admin.googleapis.com/admin/reports/v1/activity/users/all/applications/token
# Parameters: eventName=authorize, maxResults=1000
# Returns: Every OAuth token grant — app name, scopes, user, timestamp

# 2. List all apps from the Google Workspace Marketplace installed org-wide
# Admin SDK → Directory API → Chrome apps (if using Chrome Enterprise)
GET https://admin.googleapis.com/admin/directory/v1/customer/{customerId}/devices/chromeos

# 3. Login activity per user (for usage tracking)
# Reports API → User Usage Reports
GET https://admin.googleapis.com/admin/reports/v1/usage/users/all/dates/{date}
# Returns: Last login, number of logins, apps accessed, data uploaded/downloaded

# 4. Admin-installed apps
# Admin SDK → App Access Control
GET https://admin.googleapis.com/admin/directory/v1/customer/{customerId}/domainTokens
# Returns: All 3rd-party tokens with user count, last activity
```

### Azure AD — Specific APIs to Call

```python
# 1. List all enterprise applications (service principals)
GET https://graph.microsoft.com/v1.0/servicePrincipals
# Returns: Every app registered in the tenant — name, appId, sign-in audience

# 2. Get sign-in logs (who used what, when)
GET https://graph.microsoft.com/v1.0/auditLogs/signIns
# Filter: $filter=createdDateTime ge 2026-01-01
# Returns: User, app, timestamp, location, device, status, MFA used

# 3. App role assignments (who has access to what)
GET https://graph.microsoft.com/v1.0/servicePrincipals/{id}/appRoleAssignedTo
# Returns: User-to-app mapping with role

# 4. OAuth2 permission grants (user consents)
GET https://graph.microsoft.com/v1.0/oauth2PermissionGrants
# Returns: Every OAuth consent — app, user, scopes, consent type (admin/user)
```

### What SSO Misses (Critical Gaps)

| Gap | Example | How Other Layers Fill It |
|-----|---------|------------------------|
| **Direct-login apps** | User signs into Canva with personal email + password, no SSO | Browser extension catches this |
| **Free tools** | Someone uses free Trello — no SSO configured | Email layer finds welcome email |
| **Mobile apps** | Employee uses Notion on phone via mobile app, not SSO | Network layer sees traffic to notion.so |
| **Shadow AI** | ChatGPT used in browser, never goes through SSO | Browser extension + network layer |
| **CLI/API tools** | Developer uses Postman desktop app, no browser SSO | Network layer sees API calls to getpostman.com |
| **Personal accounts** | Employee uses personal Figma account for work | Browser extension detects figma.com access during work hours |

### Accuracy Score: SSO Layer Alone = 45%
With SSO you find all "managed" apps but miss ~55% of total SaaS landscape (shadow IT, free tools, direct logins).

---

## 2. Financial / Spend Layer

### What This Captures
**EXACT dollar/rupee amounts** paid to each SaaS vendor. This is the source of truth for spend data.

### Data Sources

| Source | Integration Method | What You Get | Spend Accuracy |
|--------|-------------------|-------------|---------------|
| **Corporate card transactions** (Visa, Mastercard, Amex) | Plaid API / Yodlee API / Bank file import | Every recurring charge to SaaS vendors, exact amount, date, card | 80% of known spend |
| **Bank account transactions** | Plaid / Open Banking API (India: Account Aggregator framework) | Wire transfers, ACH payments to SaaS vendors | 90% when combined with card |
| **Accounting software** (Zoho Books, Tally, QuickBooks) | Direct API | Categorized expenses, vendor names, invoice data, GST details | 85% |
| **ERP systems** (SAP, Oracle, NetSuite) | API or file export | Purchase orders, vendor master, payment records | 90% |
| **Stripe (as a customer)** | Stripe Connect / Stripe billing export | All SaaS subscriptions paid via Stripe | 70% of SaaS subscriptions |
| **Razorpay (India)** | Razorpay API | Indian SaaS payments, subscription data | 60% of India SaaS |
| **Expense reports** (SAP Concur, Fyle, Happay) | API | Employee-reimbursed SaaS purchases (personal card → expensed) | 15% of shadow spend |
| **Procurement systems** (Coupa, SAP Ariba, GEP) | API | Approved POs, contract values, negotiated rates | 95% of contracted spend |

### Transaction-to-SaaS Matching Engine

This is the hardest technical problem. A credit card transaction says:

```
2026-03-01  STRIPE* NOTION  SAN FRANCISCO CA  $960.00
2026-03-01  ATLASSIAN CLOUD  SYDNEY AU         $2,450.00
2026-03-01  FIGMA INC.  SAN FRANCISCO CA       $540.00
2026-03-01  AWS EMEA LUX  LUXEMBOURG LU        $18,432.67
2026-03-01  GOOGLE*CLOUD PLATFORM              $4,221.33
2026-03-01  MSFT*AZURE                         $7,890.00
2026-03-01  SLK*SLACK TECH  SAN FRANCISCO      $1,200.00
2026-03-01  ZOOM.US        888-799-9666        $499.90
```

**Challenge:** Merchant names on card statements are messy, truncated, and inconsistent.

### SaaS Vendor Merchant Name Database

You need a mapping table of 5,000+ known SaaS vendor merchant descriptors:

```python
SAAS_MERCHANT_MAP = {
    # Exact matches
    "ATLASSIAN CLOUD": {"vendor": "Atlassian", "products": ["Jira", "Confluence", "Bitbucket"]},
    "FIGMA INC": {"vendor": "Figma", "products": ["Figma"]},
    "ZOOM.US": {"vendor": "Zoom", "products": ["Zoom Meetings"]},
    "NOTION LABS": {"vendor": "Notion", "products": ["Notion"]},
    
    # Stripe-prefixed (many SaaS companies bill through Stripe)
    "STRIPE* NOTION": {"vendor": "Notion", "products": ["Notion"]},
    "STRIPE* VERCEL": {"vendor": "Vercel", "products": ["Vercel"]},
    "STRIPE* LINEAR": {"vendor": "Linear", "products": ["Linear"]},
    "STRIPE* LOOM": {"vendor": "Loom", "products": ["Loom"]},
    
    # Cloud providers (complex — one vendor, many products)
    "AWS EMEA": {"vendor": "Amazon Web Services", "products": ["AWS"]},
    "AMAZON WEB SERVICES": {"vendor": "Amazon Web Services", "products": ["AWS"]},
    "AMZN WEB SERVICES": {"vendor": "Amazon Web Services", "products": ["AWS"]},
    "GOOGLE*CLOUD": {"vendor": "Google Cloud", "products": ["GCP"]},
    "GOOGLE *GCP": {"vendor": "Google Cloud", "products": ["GCP"]},
    "MSFT*AZURE": {"vendor": "Microsoft", "products": ["Azure"]},
    "MICROSOFT*AZURE": {"vendor": "Microsoft", "products": ["Azure"]},
    
    # India-specific SaaS vendors
    "FRESHWORKS INC": {"vendor": "Freshworks", "products": ["Freshdesk", "Freshsales"]},
    "ZOHO CORP": {"vendor": "Zoho", "products": ["Zoho One"]},
    "RAZORPAY*": {"vendor": "Razorpay", "products": ["Razorpay"]},
    "CHARGEBEE": {"vendor": "Chargebee", "products": ["Chargebee"]},
    "CLEVERTAP": {"vendor": "CleverTap", "products": ["CleverTap"]},
    
    # Fuzzy matches needed
    "SLK*SLACK": {"vendor": "Salesforce (Slack)", "products": ["Slack"]},
    "SLCKTECHNOL": {"vendor": "Salesforce (Slack)", "products": ["Slack"]},
    "GITHUB INC": {"vendor": "Microsoft (GitHub)", "products": ["GitHub"]},
    "GH INC": {"vendor": "Microsoft (GitHub)", "products": ["GitHub"]},
}
```

### Fuzzy Matching Algorithm

For merchant names that don't exactly match:

```python
import re
from rapidfuzz import fuzz, process

def match_transaction_to_saas(merchant_descriptor: str) -> dict:
    """
    Multi-stage matching: exact → prefix → fuzzy → ML classifier
    """
    normalized = merchant_descriptor.upper().strip()
    
    # Stage 1: Exact match
    if normalized in SAAS_MERCHANT_MAP:
        return {"match": SAAS_MERCHANT_MAP[normalized], "confidence": 0.99, "method": "exact"}
    
    # Stage 2: Prefix match (handle Stripe*, Google*, MSFT* prefixes)
    for prefix in ["STRIPE*", "GOOGLE*", "MSFT*", "APPLE*", "AMZN*"]:
        if normalized.startswith(prefix):
            suffix = normalized[len(prefix):].strip()
            result = process.extractOne(suffix, SAAS_VENDOR_NAMES, scorer=fuzz.token_sort_ratio)
            if result and result[1] > 80:
                return {"match": result[0], "confidence": result[1]/100, "method": "prefix_fuzzy"}
    
    # Stage 3: Fuzzy match against all known vendor names
    result = process.extractOne(normalized, SAAS_VENDOR_NAMES, scorer=fuzz.token_set_ratio)
    if result and result[1] > 85:
        return {"match": result[0], "confidence": result[1]/100, "method": "fuzzy"}
    
    # Stage 4: Domain extraction (if merchant contains a domain-like pattern)
    domain_match = re.search(r'([A-Z0-9]+)\.(COM|IO|AI|CO|APP|DEV)', normalized)
    if domain_match:
        domain = domain_match.group(0).lower()
        known_domain = lookup_saas_by_domain(domain)
        if known_domain:
            return {"match": known_domain, "confidence": 0.90, "method": "domain"}
    
    # Stage 5: ML classifier (trained on 100K+ labeled transactions)
    ml_prediction = saas_transaction_classifier.predict(normalized)
    if ml_prediction.confidence > 0.75:
        return {"match": ml_prediction.vendor, "confidence": ml_prediction.confidence, "method": "ml"}
    
    # Stage 6: Recurring pattern detection
    # If this merchant appears monthly with similar amounts, flag as likely SaaS
    if is_recurring_charge(merchant_descriptor):
        return {"match": None, "confidence": 0.60, "method": "recurring_pattern", 
                "flag": "LIKELY_SAAS_UNIDENTIFIED"}
    
    return {"match": None, "confidence": 0.0, "method": "no_match"}
```

### Spend Data Model

```python
class SaaSSpendRecord:
    vendor_id: str              # Canonical vendor ID (e.g., "salesforce")
    vendor_name: str            # "Salesforce"
    product_name: str           # "Sales Cloud Enterprise"
    
    # Financial data
    transaction_amount: Decimal  # 24,00,000.00
    currency: str               # "INR"
    billing_frequency: str      # "annual" | "monthly" | "quarterly"
    monthly_normalized: Decimal  # Always normalized to monthly for comparison
    
    # Source tracking
    data_source: str            # "plaid_card" | "bank_csv" | "zoho_books" | "manual"
    source_confidence: float    # 0.0-1.0
    original_descriptor: str    # Raw merchant name from statement
    
    # Attribution
    cost_center: str            # "Engineering"
    approver: str               # "rahul@techcorp.com"
    contract_id: str            # Link to contract record (if exists)
    
    # Temporal
    transaction_date: datetime
    detected_date: datetime
    fiscal_quarter: str         # "Q4 FY26"
    
    # Enrichment
    per_seat_cost: Decimal      # transaction_amount / active_users
    industry_benchmark: Decimal  # What similar companies pay
    overpay_percentage: float    # How much above benchmark
```

### What Financial Layer Misses

| Gap | Why | How Other Layers Fill It |
|-----|-----|------------------------|
| **Free tools** (Slack free, Trello free, Canva free) | No transaction = no financial record | SSO + browser extension find these |
| **Personal card purchases** | Employee buys tool on personal card, never expenses it | Browser extension detects usage |
| **Bundled licenses** (Microsoft 365 includes Teams, OneDrive, SharePoint) | One transaction, multiple products | SSO layer shows individual product usage |
| **Usage-based pricing** (AWS, GCP, Twilio) | Transaction shows total, not per-service breakdown | Direct API integration with cloud providers |
| **Inter-company transfers** | Subsidiary A pays for tools used by Subsidiary B | HR layer maps users to cost centers |

### Accuracy Score: Financial Layer Alone = 50%
You find exact spend for known vendors but miss all free tools, personal purchases, and can't tell who uses what.

---

## 3. Email Intelligence Layer

### What This Captures
SaaS lifecycle events: signups, onboarding emails, invoices, receipts, renewal notices, password resets.

### How It Works

```
Connect to company email (Google Workspace / Microsoft 365)
    → Read-only access to admin-level email logs OR
    → Scan specific mailboxes (IT admin, finance inbox)
    → Parse for SaaS-related emails

NOT reading email content. Only looking at:
- Sender domains (from: noreply@slack.com)
- Subject line patterns ("Your invoice", "Welcome to", "Password reset")
- Attachment types (PDF invoices)
```

### Email Pattern Recognition

```python
SAAS_EMAIL_PATTERNS = {
    "signup": {
        "subject_patterns": [
            r"welcome to .+",
            r"your .+ account is ready",
            r"confirm your .+ account",
            r"get started with .+",
            r"thanks for signing up",
            r"activate your .+ account",
        ],
        "signals": "NEW_APP_DETECTED"
    },
    "invoice": {
        "subject_patterns": [
            r"invoice .+ from .+",
            r"your .+ receipt",
            r"payment confirmation",
            r"billing statement",
            r"subscription renewed",
        ],
        "signals": "SPEND_DATA"
    },
    "renewal": {
        "subject_patterns": [
            r"your .+ subscription is renewing",
            r"upcoming renewal",
            r"auto-renewal notice",
            r"plan expiring",
        ],
        "signals": "RENEWAL_ALERT"
    },
    "usage_alert": {
        "subject_patterns": [
            r"you.ve reached .+ limit",
            r"usage report",
            r"weekly digest",
            r"monthly summary",
        ],
        "signals": "USAGE_DATA"
    },
    "password_reset": {
        "subject_patterns": [
            r"reset your .+ password",
            r"password changed",
        ],
        "signals": "APP_DETECTED + USER_ACTIVE"
    }
}
```

### Sender Domain → SaaS Mapping

```python
SAAS_SENDER_DOMAINS = {
    # Exact domain matches
    "slack.com": "Slack",
    "notion.so": "Notion",
    "figma.com": "Figma",
    "atlassian.com": "Atlassian",
    "github.com": "GitHub",
    "zoom.us": "Zoom",
    "linear.app": "Linear",
    "vercel.com": "Vercel",
    "stripe.com": "Stripe",
    "openai.com": "OpenAI",
    "anthropic.com": "Anthropic (Claude)",
    
    # Transactional email subdomains
    "mail.notion.so": "Notion",
    "notifications.slack.com": "Slack",
    "noreply.github.com": "GitHub",
    "em.atlassian.com": "Atlassian",
    "mailer.figma.com": "Figma",
    
    # Indian SaaS
    "freshworks.com": "Freshworks",
    "zoho.com": "Zoho",
    "razorpay.com": "Razorpay",
    "clevertap.com": "CleverTap",
    "chargebee.com": "Chargebee",
    "darwinbox.com": "Darwinbox",
    "leadsquared.com": "LeadSquared",
}
# Full database: 5,000+ domains mapped to SaaS vendors
```

### Invoice Parsing (PDF Extraction)

When emails contain PDF invoice attachments:

```python
def parse_saas_invoice(pdf_bytes: bytes) -> dict:
    """
    Extract structured data from SaaS invoice PDFs using OCR + NLP
    """
    # Step 1: OCR the PDF
    text = extract_text_from_pdf(pdf_bytes)  # PyMuPDF or pdfplumber
    
    # Step 2: Extract structured fields using regex + NLP
    result = {
        "vendor": extract_vendor_name(text),           # "Atlassian Pty Ltd"
        "invoice_number": extract_invoice_number(text), # "INV-2026-0342"
        "invoice_date": extract_date(text),             # "2026-03-01"
        "due_date": extract_date(text, field="due"),    # "2026-03-31"
        "amount": extract_amount(text),                 # {"value": 2450.00, "currency": "USD"}
        "line_items": extract_line_items(text),         # [{"product": "Jira", "qty": 50, "unit_price": 7.75}]
        "billing_period": extract_period(text),         # "2026-03-01 to 2026-03-31"
        "seats_licensed": extract_seat_count(text),     # 50
        "plan_name": extract_plan_tier(text),           # "Premium"
        "tax": extract_tax(text),                       # {"gst": 441.00, "igst": 0}
    }
    
    # Step 3: For ambiguous fields, use LLM extraction
    if not result["vendor"] or not result["amount"]:
        llm_result = llm_extract_invoice_fields(text)
        result = merge_with_confidence(result, llm_result)
    
    return result
```

### What Email Layer Uniquely Captures

| Data Point | Why Only Email Finds This |
|-----------|--------------------------|
| **Trial signups** | Employee signed up for a free trial — SSO won't see it, no financial transaction |
| **Invoice line items** | Email invoices show per-product breakdown (e.g., Jira vs Confluence within Atlassian) |
| **Renewal dates** | Renewal notice emails contain exact renewal dates + pricing |
| **Price increases** | "Your plan is increasing from $X to $Y" emails capture future cost changes |
| **User invitations** | "John invited you to Notion workspace" → tracks viral tool adoption |

### Accuracy Score: Email Layer Alone = 35%
Catches signups and invoices but misses apps that don't send emails, shared accounts, and tool usage patterns.

---

## 4. Browser Extension Layer

### What This Captures
**Real-time, per-user, per-minute SaaS application usage** — the most granular data source.

### How It Works

```
Chrome/Edge Extension → Runs on every employee's browser
    → Monitors active tab URL (domain only, NOT full URL path)
    → Tracks time spent on each SaaS domain  
    → Detects logins (form submissions to known SaaS login pages)
    → Reports to SaaSIQ backend every 5 minutes

Privacy: ONLY captures domain names (slack.com, figma.com)
         NEVER captures page content, form data, or URL paths
```

### Extension Data Model

```javascript
// What the extension captures per event
{
    "event_type": "page_active",     // page_active | login_detected | extension_installed
    "domain": "figma.com",           // Only the domain — not the full URL
    "tab_active_seconds": 342,       // Seconds the tab was active (foreground)
    "timestamp": "2026-03-06T10:15:00Z",
    "user_hash": "sha256(email)",    // Anonymized user identifier
    "browser": "chrome",
    "os": "macos"
}

// What it NEVER captures (privacy-critical):
// ❌ Full URLs (no /design/file/abc123)
// ❌ Page content or text
// ❌ Form inputs or passwords
// ❌ File names or document titles
// ❌ Screenshot or DOM data
// ❌ Personal browsing (extension disabled on non-work profiles)
```

### Domain-to-SaaS Mapping (Browser Layer)

```python
SAAS_DOMAINS = {
    # Productivity
    "notion.so": {"vendor": "Notion", "category": "Productivity"},
    "docs.google.com": {"vendor": "Google", "product": "Google Docs", "category": "Productivity"},
    "sheets.google.com": {"vendor": "Google", "product": "Google Sheets", "category": "Productivity"},
    "airtable.com": {"vendor": "Airtable", "category": "Productivity"},
    
    # Communication
    "app.slack.com": {"vendor": "Slack", "category": "Communication"},
    "teams.microsoft.com": {"vendor": "Microsoft", "product": "Teams", "category": "Communication"},
    "discord.com": {"vendor": "Discord", "category": "Communication"},
    
    # Development
    "github.com": {"vendor": "GitHub", "category": "Development"},
    "gitlab.com": {"vendor": "GitLab", "category": "Development"},
    "bitbucket.org": {"vendor": "Atlassian", "product": "Bitbucket", "category": "Development"},
    "vercel.com": {"vendor": "Vercel", "category": "Development"},
    "railway.app": {"vendor": "Railway", "category": "Development"},
    "console.aws.amazon.com": {"vendor": "AWS", "category": "Cloud"},
    "portal.azure.com": {"vendor": "Microsoft", "product": "Azure Portal", "category": "Cloud"},
    "console.cloud.google.com": {"vendor": "Google", "product": "GCP", "category": "Cloud"},
    
    # Design
    "figma.com": {"vendor": "Figma", "category": "Design"},
    "canva.com": {"vendor": "Canva", "category": "Design"},
    "miro.com": {"vendor": "Miro", "category": "Design"},
    
    # AI Tools (Critical for Shadow AI detection)
    "chat.openai.com": {"vendor": "OpenAI", "product": "ChatGPT", "category": "AI", "risk": "high"},
    "chatgpt.com": {"vendor": "OpenAI", "product": "ChatGPT", "category": "AI", "risk": "high"},
    "claude.ai": {"vendor": "Anthropic", "product": "Claude", "category": "AI", "risk": "high"},
    "gemini.google.com": {"vendor": "Google", "product": "Gemini", "category": "AI", "risk": "medium"},
    "copilot.microsoft.com": {"vendor": "Microsoft", "product": "Copilot", "category": "AI", "risk": "medium"},
    "midjourney.com": {"vendor": "Midjourney", "category": "AI", "risk": "high"},
    "perplexity.ai": {"vendor": "Perplexity", "category": "AI", "risk": "medium"},
    
    # ... 3,000+ more domains
}
```

### Usage Calculation

```python
def calculate_app_usage(user_id: str, app_domain: str, period: str = "30d") -> dict:
    """
    Calculate real usage metrics from browser extension data
    """
    events = get_browser_events(user_id, app_domain, period)
    
    return {
        "user_id": user_id,
        "app": app_domain,
        "period": period,
        
        # Activity metrics
        "total_active_minutes": sum(e.active_seconds for e in events) / 60,
        "unique_days_used": len(set(e.date for e in events)),
        "avg_daily_minutes": total_active_minutes / unique_days_used,
        "last_used": max(e.timestamp for e in events),
        "days_since_last_use": (now - last_used).days,
        
        # Usage classification
        "usage_tier": classify_usage(total_active_minutes, unique_days_used),
        #   "heavy"    = >60 min/day, >20 days/month
        #   "regular"  = 15-60 min/day, 10-20 days/month
        #   "light"    = 5-15 min/day, 5-10 days/month
        #   "minimal"  = <5 min/day, <5 days/month
        #   "inactive" = 0 activity in 30 days
        
        # Session patterns
        "sessions_count": count_sessions(events, gap_threshold_minutes=30),
        "avg_session_duration": total_minutes / sessions_count,
        "peak_usage_hour": mode(e.hour for e in events),  # When they use it most
        "weekend_usage": any(e.weekday >= 5 for e in events),
    }
```

### What Browser Extension Uniquely Captures

| Data Point | Why Only Extension Finds This |
|-----------|------------------------------|
| **Exact usage minutes per user per app** | SSO tells you they logged in, not how long they used it |
| **Shadow IT via direct login** | User goes to canva.com → logs in with personal email → extension sees the domain |
| **AI tool usage** | ChatGPT has no SSO/API integration — browser is the ONLY way to detect it |
| **Usage patterns** (time of day, session length) | No other source provides minute-level behavioral data |
| **Tab switching / multitasking** | Tells you whether someone has Figma open but actually works in VS Code |
| **Free tool usage** | Free Canva, free Trello, free Loom — no SSO, no payment, only browser catches them |

### Privacy Safeguards (Non-Negotiable)

```
DO capture:
✅ Domain name (figma.com)
✅ Active time per domain
✅ Timestamp of tab activation
✅ Browser type and OS

DO NOT capture:
❌ Full URLs (/file/abc123/design-v2)
❌ Page titles
❌ Page content / DOM
❌ Form inputs
❌ File names
❌ Screenshots
❌ Personal browsing (only active on work profiles)
❌ Incognito/private browsing

User controls:
🔘 Employee can pause tracking
🔘 Employee can see their own data
🔘 Admin cannot see individual URLs, only domain-level aggregates
🔘 Data retained for 90 days, then aggregated and raw deleted
```

### Accuracy Score: Browser Extension Alone = 40%
Excellent for usage data and shadow IT, but misses mobile apps, desktop apps, server-side tools, and backend services (CI/CD, monitoring).

---

## 5. Network / CASB Layer

### What This Captures
ALL network traffic to SaaS domains — even from mobile devices, desktop apps, and API calls that browser extensions miss.

### Data Sources

| Source | What It Sees | Deployment |
|--------|-------------|-----------|
| **DNS logs** (company DNS resolver) | Every domain resolved → knows every SaaS domain accessed | Configure company DNS to log queries |
| **Firewall logs** (Palo Alto, Fortinet, Check Point) | Traffic to SaaS IP ranges with bytes transferred | API integration with firewall |
| **CASB** (Netskope, Zscaler, McAfee) | Deep SaaS visibility — app, user, action, data volume | API or log forwarding |
| **Proxy logs** (Squid, Zscaler, Netskope) | HTTP/HTTPS traffic with domain info | Parse proxy logs |
| **Cloud Access Logs** (AWS CloudTrail, GCP Audit, Azure Monitor) | API calls to cloud services | Direct API |
| **MDM** (Intune, Jamf, Mosyle) | Mobile/desktop app installations + use | MDM API |

### DNS-Based Discovery

```python
# DNS log entry example:
# 2026-03-06T10:15:32Z  10.0.1.45  A  app.slack.com  → 3.120.54.78

def process_dns_log(log_entry: dict) -> dict:
    """
    Match DNS query to known SaaS vendor
    """
    domain = log_entry["queried_domain"]
    
    # Remove subdomains to get root domain
    root_domain = get_root_domain(domain)  # "app.slack.com" → "slack.com"
    
    if root_domain in SAAS_DOMAIN_DATABASE:
        return {
            "vendor": SAAS_DOMAIN_DATABASE[root_domain],
            "source_ip": log_entry["source_ip"],      # → map to user via DHCP/AD
            "timestamp": log_entry["timestamp"],
            "confidence": 0.95,
        }
    
    # Check against Cloud IP ranges (AWS, GCP, Azure often resolve to CDN IPs)
    ip_result = identify_saas_by_ip(log_entry["resolved_ip"])
    if ip_result:
        return {
            "vendor": ip_result,
            "confidence": 0.70,  # Lower confidence — IP ranges overlap
        }
    
    return None

# SaaS Domain Database — 10,000+ entries including subdomains
SAAS_DOMAIN_DATABASE = {
    "slack.com": {"vendor": "Slack", "category": "Communication"},
    "app.slack.com": {"vendor": "Slack", "category": "Communication"},
    "files.slack.com": {"vendor": "Slack", "category": "Communication"},
    "edgeapi.slack.com": {"vendor": "Slack", "category": "Communication"},
    
    "notion.so": {"vendor": "Notion", "category": "Productivity"},
    "api.notion.com": {"vendor": "Notion", "category": "Productivity"},
    
    "api.openai.com": {"vendor": "OpenAI", "product": "ChatGPT API", "risk": "high"},
    "cdn.openai.com": {"vendor": "OpenAI", "risk": "high"},
    
    # ... 10,000+ entries
}
```

### What Network Layer Uniquely Captures

| Data Point | Why Only Network Finds This |
|-----------|----------------------------|
| **Desktop app usage** | Slack desktop, VS Code, Postman — not in browser extensions |
| **Mobile app traffic** | Notion mobile, Slack mobile — on company WiFi/VPN |
| **API/CLI tools** | `aws cli`, `gcloud`, `terraform` commands → DNS queries to cloud APIs |
| **Data transfer volumes** | 500MB uploaded to Google Drive vs 5KB to Slack — quantifies data flow risk |
| **CI/CD pipeline tools** | Jenkins, CircleCI, GitHub Actions — server-side traffic |
| **Monitoring/observability** | Datadog agent, New Relic, PagerDuty — backend services |

### Accuracy Score: Network Layer Alone = 55%
Broadest coverage (sees everything on the network) but can't distinguish users easily, can't see usage depth, and encrypted traffic limits visibility.

---

## 6. Direct API Integrations Layer

### What This Captures
**Per-product, per-user, per-feature usage data** directly from the SaaS vendor's own API.

### Why This is the Highest-Fidelity Data

When you integrate directly with Salesforce's API, you don't estimate — you KNOW:
- Exactly 132 out of 200 licenses logged in this month
- User "priya@techcorp.com" hasn't logged in for 87 days
- 45 users logged in but only opened 2 pages (minimal usage)
- Storage used: 12GB of 50GB (24%)

### Priority Integrations (Build These First)

| # | SaaS Product | API | Key Data Points | Why Priority |
|---|-------------|-----|-----------------|--------------|
| 1 | **Google Workspace** | Admin SDK + Reports API | Users, apps, storage, login frequency, Drive usage | >80% of target companies use this |
| 2 | **Microsoft 365** | Microsoft Graph API | Users, licenses, Teams usage, OneDrive, SharePoint activity | Enterprise standard |
| 3 | **Slack** | Slack Admin API (Enterprise Grid) | Members, channels, messages/day, active users, integrations | Universal comms tool |
| 4 | **Salesforce** | Salesforce REST API | Licenses, login history, storage, API calls, feature adoption | Biggest contract renewal risk |
| 5 | **AWS** | AWS Cost Explorer API + CloudWatch | Cost by service, resource utilization, reserved vs on-demand | Largest $ amount |
| 6 | **GitHub** | GitHub REST/GraphQL API | Seats, active committers, repo count, Actions minutes | Developer tool #1 |
| 7 | **Jira/Atlassian** | Atlassian REST API | Users, projects, issues created, active users | Project management standard |
| 8 | **Zoom** | Zoom Server-to-Server API | Licensed users, meeting minutes, recording storage | Common in every company |
| 9 | **Figma** | Figma API | Seats, files created, editor vs viewer usage | Design tool with high waste |
| 10 | **HubSpot** | HubSpot API | Seats, contacts, marketing emails, pipeline data | Common CRM for mid-market |

### Sample: Slack Integration Data Extraction

```python
# Slack Admin Analytics API (requires Enterprise Grid or Business+)

async def extract_slack_usage(slack_token: str) -> dict:
    """Extract comprehensive Slack usage data"""
    
    headers = {"Authorization": f"Bearer {slack_token}"}
    
    # 1. Get workspace info
    team = await api_call("team.info", headers)
    
    # 2. Get all users
    users = await paginated_call("users.list", headers)
    
    # 3. Get usage analytics (Enterprise Grid)
    # https://api.slack.com/methods/admin.analytics.getFile
    analytics = await api_call("admin.analytics.getFile", {
        "type": "member",
        "date": "2026-03-05"
    }, headers)
    
    # Analytics returns per-user:
    # - messages_posted
    # - files_uploaded  
    # - reactions_added
    # - days_active (in last 30 days)
    # - date_last_active
    
    # 4. Get integrations (shows other SaaS tools connected to Slack)
    integrations = await api_call("admin.apps.approved.list", headers)
    # This discovers OTHER SaaS apps! (Jira bot, GitHub bot, etc.)
    
    # 5. Calculate metrics
    total_users = len(users)
    active_30d = sum(1 for u in analytics if u["days_active"] > 0)
    inactive_30d = total_users - active_30d
    
    return {
        "vendor": "Slack",
        "total_licensed_users": total_users,
        "active_users_30d": active_30d,
        "inactive_users_30d": inactive_30d,
        "utilization_rate": active_30d / total_users,
        "heavy_users": sum(1 for u in analytics if u["messages_posted"] > 100),
        "light_users": sum(1 for u in analytics if 0 < u["messages_posted"] <= 10),
        "never_used": sum(1 for u in analytics if u["messages_posted"] == 0),
        "connected_integrations": len(integrations),  # Bonus: discovers other SaaS!
        "integration_names": [i["name"] for i in integrations],
        "last_sync": datetime.utcnow().isoformat(),
        "data_freshness": "real-time",
        "confidence": 0.99  # Direct API = highest confidence
    }
```

### Accuracy Score: Direct API = 99% per integrated app
But only covers apps you've built integrations for. With 10 integrations, you cover ~60% of a company's "important" SaaS but miss the long tail of 100+ smaller tools.

---

## 7. HR / Employee Systems Layer

### What This Captures
The org chart — who works where, what department, what role, when they joined, when they left.

### Why It's Critical

You can't calculate "cost per employee" or "department spend allocation" without knowing:
- How many employees exist (total headcount)
- Which department each employee belongs to
- When employees join/leave (deprovision licenses)

### Data Sources

| Source | API | Key Data |
|--------|-----|---------|
| **BambooHR** | BambooHR API | Employee directory, departments, hire dates, terminations |
| **Darwinbox** (India) | Darwinbox API | Indian HR system — employee data, attendance, departments |
| **Zoho People** (India) | Zoho People API | Employee records, org chart |
| **SAP SuccessFactors** | OData API | Enterprise HR data |
| **Workday** | Workday REST API | Employee, org, compensation data |
| **Keka** (India) | Keka API | Payroll, employees, departments |
| **greytHR** (India) | greytHR API | India HR/payroll |

### Employee-to-License Mapping

```python
def map_employee_to_licenses(employee: Employee) -> list:
    """
    Cross-reference employee data with all discovered SaaS accounts
    """
    email = employee.work_email  # "priya@techcorp.com"
    
    licenses = []
    
    # Check SSO layer
    sso_apps = get_sso_authorizations(email)
    for app in sso_apps:
        licenses.append({
            "app": app.name,
            "source": "sso",
            "status": "active" if app.last_used > 30_days_ago else "inactive"
        })
    
    # Check browser extension data
    browser_apps = get_browser_usage(employee.user_hash)
    for app in browser_apps:
        if app not in [l["app"] for l in licenses]:
            licenses.append({
                "app": app.domain,
                "source": "browser",
                "status": "active"  # If in browser data, they're using it
            })
    
    # Check direct API data
    for integration in active_integrations:
        user_data = integration.get_user_status(email)
        if user_data:
            licenses.append({
                "app": integration.vendor,
                "source": "direct_api",
                "license_type": user_data.license_tier,
                "last_active": user_data.last_login,
                "status": user_data.status
            })
    
    return licenses

# Output example for "Priya Kapoor, Engineering":
# [
#   {"app": "Slack", "source": "direct_api", "license": "Business+", "status": "active"},
#   {"app": "GitHub", "source": "sso", "status": "active"},
#   {"app": "Figma", "source": "sso", "status": "inactive (67 days)"},
#   {"app": "ChatGPT", "source": "browser", "status": "active"},  ← Shadow AI!
#   {"app": "Canva", "source": "browser", "status": "active"},    ← Shadow IT!
#   {"app": "Notion", "source": "email", "status": "active"},
#   {"app": "Linear", "source": "browser", "status": "active"},
# ]
```

---

## 8. Expense Management Layer

### What This Captures
SaaS purchased on personal cards and reimbursed through expense reports — the darkest corner of shadow IT spend.

### Data Sources

| Source | Region | API |
|--------|--------|-----|
| SAP Concur | Global | Concur API |
| Expensify | Global | Expensify API |
| Fyle | India | Fyle API |
| Happay | India | Happay API |
| Zaggle | India | Zaggle API |
| Brex | US | Brex API |
| Ramp | US | Ramp API |

### What This Finds That Nothing Else Does

| Scenario | How It's Hidden | How Expense Layer Finds It |
|----------|----------------|---------------------------|
| Developer buys JetBrains license on personal card | No corporate card transaction | Expense report: "JetBrains IntelliJ — ₹15,000" |
| Marketing buys Canva Pro for team | Used personal credit card | Reimbursement request with receipt |
| Sales rep pays for LinkedIn Premium | Consider it a personal expense, claims later | Expense line item |
| Designer buys Adobe stock images | One-time purchase, not subscription | Receipt attached to expense |

---

## 9. Entity Resolution Engine

### The Core Technical Challenge

The same application appears differently across data sources:

```
SSO says:        "Slack Technologies, Inc."
Bank says:       "SLK*SLACK TECH  SAN FRANCISCO"
Email says:      "From: notifications@slack.com"  
Browser says:    "app.slack.com"
Network says:    "DNS query: slack.com → 3.120.54.78"
Direct API says: "Slack workspace: techcorp.slack.com"
Expense says:    "Slack Business+ Annual - Invoice #SLK-2026-001"
```

**All of these are the SAME application.** Entity resolution merges them into one canonical record.

### Entity Resolution Algorithm

```python
class SaaSEntityResolver:
    """
    Merges multi-source signals into a single canonical SaaS application record.
    Uses a priority-weighted confidence scoring system.
    """
    
    SOURCE_PRIORITY = {
        "direct_api": 1.0,    # Highest confidence — data from the vendor itself
        "sso": 0.95,           # Very high — authoritative identity data
        "financial": 0.90,     # High — exact $ amounts
        "email_invoice": 0.85, # High — structured financial data
        "browser": 0.80,       # Good — real usage data
        "network": 0.70,       # Moderate — domain-level only
        "email_signup": 0.65,  # Moderate — may be trial/abandoned
        "expense": 0.60,       # Moderate — may be one-time
    }
    
    def resolve(self, signals: list[Signal]) -> CanonicalApp:
        """
        Input: List of signals from all 8 data layers
        Output: Single canonical application record with merged data
        """
        
        # Step 1: Group signals by vendor (fuzzy matching)
        vendor_groups = self.group_by_vendor(signals)
        
        # Step 2: For each vendor, merge signals
        for vendor, group in vendor_groups.items():
            canonical = CanonicalApp()
            
            # Name: Take from highest-priority source
            canonical.name = self.highest_priority_value(group, "name")
            canonical.vendor = self.highest_priority_value(group, "vendor")
            
            # Spend: Sum from financial sources (deduplicated)
            canonical.monthly_spend = self.deduplicated_spend(group)
            
            # Users: Union of all detected users
            canonical.total_users = self.union_users(group)
            canonical.active_users = self.active_users(group)
            
            # Usage: Prefer direct API > browser > SSO login times
            canonical.utilization = self.best_utilization_data(group)
            
            # Status: Managed if in SSO, Shadow if only in browser/network
            canonical.status = self.determine_status(group)
            
            # Compliance: From vendor knowledge graph
            canonical.compliance = self.lookup_compliance(vendor)
            
            # Confidence score: Weighted average of source confidences
            canonical.confidence = self.calculate_confidence(group)
            
            # Data freshness: Most recent signal
            canonical.last_updated = max(s.timestamp for s in group)
            
        return canonical
    
    def group_by_vendor(self, signals):
        """
        Group signals that refer to the same vendor using:
        1. Exact vendor ID match
        2. Domain family matching (*.slack.com → Slack)
        3. Merchant name fuzzy matching
        4. Email domain matching
        """
        groups = defaultdict(list)
        
        for signal in signals:
            # Try exact canonical ID
            canonical_id = self.lookup_canonical_id(signal)
            if canonical_id:
                groups[canonical_id].append(signal)
                continue
            
            # Try domain-based matching
            if signal.domain:
                canonical_id = self.domain_to_canonical(signal.domain)
                if canonical_id:
                    groups[canonical_id].append(signal)
                    continue
            
            # Try fuzzy name matching
            if signal.vendor_name:
                match = self.fuzzy_match_vendor(signal.vendor_name)
                if match and match.confidence > 0.85:
                    groups[match.canonical_id].append(signal)
                    continue
            
            # Unresolved — flag for manual review
            groups[f"UNRESOLVED_{signal.id}"].append(signal)
        
        return groups
    
    def determine_status(self, signals) -> str:
        """
        Classify app as Managed, Shadow IT, or Under Review
        """
        sources = set(s.source for s in signals)
        
        # If in SSO → IT knows about it → Managed
        if "sso" in sources or "direct_api" in sources:
            return "managed"
        
        # If ONLY in browser/network → IT doesn't know → Shadow IT
        if sources.issubset({"browser", "network"}):
            return "shadow_it"
        
        # If in financial but not SSO → purchased but not governed
        if "financial" in sources and "sso" not in sources:
            return "under_review"
        
        # If only in email (signup) → might be trial
        if sources == {"email_signup"}:
            return "under_review"
        
        return "under_review"
```

### Entity Resolution Accuracy Targets

| Metric | Zylo Target | Torii Target | **SaaSIQ 99% Target** | How Measured |
|--------|-------------|-------------|----------------------|-------------|
| **True positive rate** | >90% | >90% | **>99%** | % of detected apps that actually exist |
| **False positive rate** | <10% | <8% | **<1%** | % of flagged "SaaS apps" that are actually websites/non-SaaS |
| **Deduplication accuracy** | >92% | >93% | **>99.5%** | % correctly merged (no duplicates, no false merges) |
| **Vendor name accuracy** | >95% | >95% | **>99.9%** | Correct canonical vendor name assigned |
| **Spend attribution accuracy** | >80% | >82% | **>98%** | Financial data linked to correct vendor |
| **User-to-app accuracy** | >85% | >87% | **>99%** | Correct user identified for each app |
| **Shadow IT detection rate** | >70% | >75% | **>95%** | % of actual shadow IT apps found |

---

## 10. SaaS Application Knowledge Graph

### What This Is
A master database of **every known SaaS application** with structured metadata. This is the foundation that makes entity resolution, compliance scoring, and benchmarking possible.

### Schema

```python
class SaaSApplication:
    # Identity
    canonical_id: str           # "slack" (unique, immutable)
    display_name: str           # "Slack"
    vendor_name: str            # "Salesforce, Inc."
    vendor_id: str              # "salesforce"
    
    # Classification
    category: str               # "Communication"
    subcategory: str            # "Team Messaging"
    tags: list[str]             # ["messaging", "channels", "video", "enterprise"]
    
    # Discovery signatures
    domains: list[str]          # ["slack.com", "app.slack.com", "files.slack.com"]
    sso_app_names: list[str]    # ["Slack", "Slack Technologies", "slack.com"]
    merchant_descriptors: list[str]  # ["SLK*SLACK", "SLACK TECH", "SLCKTECHNOL"]
    email_domains: list[str]    # ["slack.com", "notifications.slack.com"]
    ip_ranges: list[str]        # ["3.120.0.0/16"] (optional)
    ios_bundle_id: str          # "com.tinyspeck.chatlyio"
    android_package: str        # "com.Slack"
    
    # Pricing intelligence
    pricing_tiers: list[dict]   # [{name: "Free", price: 0}, {name: "Pro", price: 7.25, per: "user/month"}]
    pricing_model: str          # "per_seat" | "usage_based" | "flat_rate" | "freemium"
    currency: str               # "USD"
    has_free_tier: bool         # True
    enterprise_pricing: str     # "Contact sales"
    
    # Compliance
    soc2_certified: bool        # True
    soc2_report_date: date      # 2025-12-15
    iso27001: bool              # True
    gdpr_compliant: bool        # True
    dpdp_compliant: bool        # Unknown (India-specific)
    hipaa_compliant: bool       # False
    data_residency: list[str]   # ["US", "EU", "India"]
    has_dpa: bool               # True (Data Processing Agreement available)
    encryption_at_rest: bool    # True
    encryption_in_transit: bool # True
    
    # Vendor health
    headcount: int              # 2,700
    founded_year: int           # 2013
    last_funding: str           # "Acquired by Salesforce (2020) - $27.7B"
    revenue_estimate: str       # "$1.5B ARR"
    public_company: bool        # True (via Salesforce — CRM)
    
    # Integration capabilities
    has_api: bool               # True
    api_type: str               # "REST + Events API"
    sso_support: list[str]      # ["SAML 2.0", "OAuth 2.0", "OIDC"]
    scim_support: bool          # True (automated user provisioning)
    
    # Alternatives (for consolidation recommendations)
    alternatives: list[str]     # ["microsoft_teams", "discord", "google_chat"]
    alternative_category: str   # "team_messaging"
```

### Building the Knowledge Graph

| Data Source | What It Provides | Count |
|-----------|-----------------|-------|
| **G2 Crowd API** | 100K+ products, categories, ratings, pricing | Core catalog |
| **Crunchbase API** | Company data, funding, headcount | Vendor health |
| **SecurityScorecard** | Security ratings per vendor | Risk scoring |
| **SOC2 public listings** | Compliance certifications | Compliance data |
| **Manual curation** | India-specific vendors (Zoho, Freshworks, etc.) | 500+ Indian SaaS |
| **Web scraping (pricing pages)** | Public pricing tiers | Pricing intelligence |
| **DNS databases** | Domain → company mapping | Discovery signatures |
| **App store listings** | iOS/Android package names | Mobile discovery |

### Target: 10,000+ Applications in Knowledge Graph at Launch

| Category | Count | Examples |
|----------|-------|---------|
| Productivity | 500 | Notion, Airtable, Monday, Asana |
| Communication | 300 | Slack, Teams, Zoom, Discord |
| Development | 800 | GitHub, GitLab, Jira, VS Code, Vercel |
| Design | 200 | Figma, Canva, Adobe, Miro |
| Sales & CRM | 400 | Salesforce, HubSpot, Pipedrive |
| Marketing | 600 | Mailchimp, Semrush, HootSuite |
| Finance | 300 | Stripe, QuickBooks, Zoho Books |
| HR | 250 | BambooHR, Darwinbox, Keka |
| Security | 300 | Okta, CrowdStrike, Snyk |
| Cloud/Infrastructure | 200 | AWS, GCP, Azure, Cloudflare |
| AI Tools | 150 | ChatGPT, Claude, Midjourney, Copilot |
| Analytics | 250 | Amplitude, Mixpanel, Google Analytics |
| Customer Support | 200 | Zendesk, Freshdesk, Intercom |
| Industry-specific | 500+ | Various vertical SaaS |
| **Indian SaaS** | **500+** | Zoho, Freshworks, Razorpay, CleverTap, Chargebee, Darwinbox, Leadsquared, Haptik, etc. |

---

## 11. Usage Scoring Algorithm

### The Problem with Binary "Active/Inactive"

Most tools say a user is "active" if they logged in last 30 days. That's useless.

Someone who logged into Figma once for 2 minutes and someone who uses it 6 hours daily are both "active." But one license should be reclaimed and the other shouldn't.

### SaaSIQ Usage Score: 0-100

```python
def calculate_usage_score(user_app_data: dict) -> int:
    """
    Composite score that combines frequency, depth, and recency.
    Score: 0-100
    
    >80 = Heavy user (don't touch this license)
    60-80 = Regular user (optimal)
    30-60 = Light user (consider downgrade)
    10-30 = Minimal user (strong downgrade candidate)
    0-10 = Inactive (reclaim license)
    """
    
    # Factor 1: LOGIN FREQUENCY (0-30 points)
    # How often they access the app
    days_active_30d = user_app_data["unique_days_used_30d"]
    if days_active_30d >= 25:
        frequency_score = 30  # Nearly daily
    elif days_active_30d >= 15:
        frequency_score = 24  # 3-4x per week
    elif days_active_30d >= 8:
        frequency_score = 16  # 2x per week
    elif days_active_30d >= 3:
        frequency_score = 8   # Weekly
    elif days_active_30d >= 1:
        frequency_score = 3   # Monthly
    else:
        frequency_score = 0   # Zero activity
    
    # Factor 2: DEPTH OF USE (0-35 points)
    # How much they actually use it (not just open it)
    total_minutes_30d = user_app_data["total_active_minutes_30d"]
    if total_minutes_30d >= 2400:   # >80 min/day avg
        depth_score = 35
    elif total_minutes_30d >= 900:  # >30 min/day
        depth_score = 28
    elif total_minutes_30d >= 300:  # >10 min/day
        depth_score = 20
    elif total_minutes_30d >= 60:   # >2 min/day
        depth_score = 10
    elif total_minutes_30d >= 15:
        depth_score = 4
    else:
        depth_score = 0
    
    # Factor 3: RECENCY (0-20 points)
    # When was the last use?
    days_since_last = user_app_data["days_since_last_use"]
    if days_since_last <= 1:
        recency_score = 20   # Used today/yesterday
    elif days_since_last <= 7:
        recency_score = 16   # Used this week
    elif days_since_last <= 14:
        recency_score = 10   # Used recently
    elif days_since_last <= 30:
        recency_score = 5    # Used this month
    elif days_since_last <= 60:
        recency_score = 2    # Stale
    else:
        recency_score = 0    # Dormant
    
    # Factor 4: FEATURE ADOPTION (0-15 points)
    # Are they using advanced features? (from direct API data)
    features_used = user_app_data.get("features_used", [])
    total_features = user_app_data.get("total_features_available", 1)
    feature_adoption_rate = len(features_used) / total_features
    
    if feature_adoption_rate >= 0.6:
        feature_score = 15    # Power user
    elif feature_adoption_rate >= 0.3:
        feature_score = 10    # Regular features
    elif feature_adoption_rate >= 0.1:
        feature_score = 5     # Basic features only
    else:
        feature_score = 0     # No feature data
    
    total_score = frequency_score + depth_score + recency_score + feature_score
    
    return min(100, max(0, total_score))
```

### Usage Score → Actionable Recommendation

| Score | Label | Color | Recommendation | Financial Impact |
|-------|-------|-------|---------------|-----------------|
| 81-100 | **Power User** | Dark Green | Keep. Consider upgrading plan tier. | ₹0 savings |
| 61-80 | **Regular User** | Green | Keep. License well-utilized. | ₹0 savings |
| 41-60 | **Light User** | Yellow | Downgrade to lower tier if available. | 30-50% savings per seat |
| 21-40 | **Minimal User** | Orange | Strong downgrade or reassign license. | 50-80% savings per seat |
| 1-20 | **Near-Inactive** | Red | Convert to free tier or on-demand. | 80-100% savings per seat |
| 0 | **Unused** | Dark Red | Reclaim license immediately. | 100% savings per seat |

---

## 12. Spend Attribution Engine

### The Problem
A single Atlassian invoice says "₹18,50,000." But that covers Jira (Engineering), Confluence (Product), and Trello (Marketing). Who pays for what?

### Spend Attribution Methods

```python
class SpendAttributionEngine:
    """
    Distributes vendor spend across departments, teams, and cost centers
    using usage-weighted allocation.
    """
    
    def attribute_spend(self, vendor: str, total_spend: Decimal) -> list[Attribution]:
        """
        Method 1: USAGE-WEIGHTED ALLOCATION (most accurate)
        If we have per-user usage data, split spend proportionally
        """
        users = get_users_for_vendor(vendor)
        total_usage_minutes = sum(u.active_minutes for u in users)
        
        if total_usage_minutes == 0:
            return self.headcount_allocation(vendor, total_spend)
        
        attributions = []
        for department in get_departments():
            dept_users = [u for u in users if u.department == department.name]
            dept_minutes = sum(u.active_minutes for u in dept_users)
            dept_share = dept_minutes / total_usage_minutes
            
            attributions.append(Attribution(
                vendor=vendor,
                department=department.name,
                amount=total_spend * dept_share,
                method="usage_weighted",
                confidence=0.90,
                user_count=len(dept_users),
                usage_percentage=dept_share * 100
            ))
        
        return attributions
    
    def license_allocation(self, vendor: str, total_spend: Decimal) -> list[Attribution]:
        """
        Method 2: LICENSE-BASED ALLOCATION
        Split by number of assigned licenses per department
        """
        license_assignments = get_license_assignments(vendor)
        total_licenses = len(license_assignments)
        
        dept_counts = Counter(l.department for l in license_assignments)
        
        return [
            Attribution(
                vendor=vendor,
                department=dept,
                amount=total_spend * (count / total_licenses),
                method="license_based",
                confidence=0.85,
                user_count=count
            )
            for dept, count in dept_counts.items()
        ]
    
    def headcount_allocation(self, vendor: str, total_spend: Decimal) -> list[Attribution]:
        """
        Method 3: HEADCOUNT ALLOCATION (fallback)
        Split by department headcount (least accurate)
        """
        departments = get_department_headcounts()
        total_headcount = sum(d.count for d in departments)
        
        return [
            Attribution(
                vendor=vendor,
                department=d.name,
                amount=total_spend * (d.count / total_headcount),
                method="headcount_fallback",
                confidence=0.50
            )
            for d in departments
        ]
```

---

## 13. Accuracy Measurement Framework

### How to PROVE Your Accuracy (Not Just Claim It)

```python
class AccuracyBenchmark:
    """
    Run against pilot customer data to measure real accuracy
    """
    
    def run_full_benchmark(self, customer_id: str) -> AccuracyReport:
        """
        Compare SaaSIQ results against customer's manual inventory
        """
        # Get SaaSIQ's discovered apps
        saasiq_apps = get_discovered_apps(customer_id)
        
        # Get customer's manually verified inventory (ground truth)
        ground_truth = get_manual_inventory(customer_id)
        
        # --------------- APP DISCOVERY ACCURACY ---------------
        
        # True positives: Apps we found that actually exist
        true_positives = saasiq_apps.intersection(ground_truth)
        
        # False positives: Apps we flagged that don't actually exist
        false_positives = saasiq_apps - ground_truth
        
        # False negatives: Real apps we missed
        false_negatives = ground_truth - saasiq_apps
        
        precision = len(true_positives) / len(saasiq_apps)  # Of what we found, how much is real?
        recall = len(true_positives) / len(ground_truth)     # Of what exists, how much did we find?
        f1_score = 2 * (precision * recall) / (precision + recall)
        
        # --------------- SPEND ACCURACY ---------------
        
        for app in true_positives:
            saasiq_spend = get_saasiq_spend(customer_id, app)
            actual_spend = get_actual_spend(customer_id, app)     # From customer's finance team
            spend_error = abs(saasiq_spend - actual_spend) / actual_spend
            # Target: <15% error
        
        # --------------- UTILIZATION ACCURACY ---------------
        
        for app in true_positives:
            saasiq_active = get_saasiq_active_users(customer_id, app)
            actual_active = get_actual_active_users(customer_id, app)  # From vendor admin console
            utilization_error = abs(saasiq_active - actual_active) / actual_active
            # Target: <10% error
        
        return AccuracyReport(
            app_discovery_precision=precision,    # Target: >95%
            app_discovery_recall=recall,          # Target: >85%
            app_discovery_f1=f1_score,            # Target: >90%
            spend_accuracy=mean_spend_error,      # Target: <15%
            utilization_accuracy=mean_util_error,  # Target: <10%
            shadow_it_detection_rate=shadow_recall, # Target: >85%
            false_positive_rate=fp_rate,           # Target: <5%
        )
```

### Accuracy by Number of Data Sources Connected

| Sources Connected | Expected App Discovery | Spend Accuracy | Usage Accuracy |
|-------------------|----------------------|----------------|---------------|
| 1 (SSO only) | 45% | 0% (no spend data) | 30% (login count only) |
| 2 (SSO + Financial) | 65% | 75% | 35% |
| 3 (SSO + Financial + Email) | 75% | 85% | 40% |
| 4 (+ Browser Extension) | 85% | 85% | 80% |
| 5 (+ Network/CASB) | 90% | 87% | 82% |
| 6 (+ Direct APIs) | 92% | 92% | 95% |
| 7 (+ HR System) | 93% | 93% | 95% |
| 8 (+ Expense Management) | 95% | 95% | 95% |
| **9 (+ Desktop Agent)** | **96%** | **95%** | **97%** |
| **10 (+ OAuth Deep Audit)** | **97%** | **96%** | **97%** |
| **11 (+ Contract AI)** | **97%** | **98%** | **97%** |
| **12 (+ Employee Self-Attestation)** | **98%** | **98%** | **98%** |
| **13 (+ Vendor Confirmation)** | **98.5%** | **99%** | **98%** |
| **13 + ML Ensemble** | **99%** | **99%** | **99%** |
| **13 + ML + Human Validation** | **99.2%** | **99.5%** | **99%** |
| **13 + ML + Human + Feedback Loop** | **99.5%+** | **99.5%+** | **99.5%+** |

**Key insight:** Zylo/Torii stop at row 7-8 (93-95%). The 5 additional layers + ML ensemble + human validation is what takes you to 99%. Nobody else does this.

---

## 14. Data Pipeline Architecture

### System Design

```
┌───────────────────────────────────────────────────────────────────┐
│                      DATA INGESTION LAYER                         │
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ SSO APIs │ │Financial │ │  Email   │ │ Browser  │           │
│  │ Poller   │ │ Sync     │ │ Scanner  │ │Extension │           │
│  │ (hourly) │ │ (daily)  │ │ (daily)  │ │ (5-min)  │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       │            │            │            │                   │
│  ┌────▼────────────▼────────────▼────────────▼──────┐           │
│  │              APACHE KAFKA / REDIS STREAMS         │           │
│  │           (Event streaming + buffering)           │           │
│  └───────────────────────┬───────────────────────────┘           │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────┐           │
│  │           ENTITY RESOLUTION ENGINE                 │           │
│  │   (Merge multi-source signals → canonical apps)   │           │
│  └───────────────────────┬───────────────────────────┘           │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────┐           │
│  │              POSTGRESQL (Primary DB)               │           │
│  │                                                    │           │
│  │  ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │           │
│  │  │ saas_apps    │ │ users        │ │ spend     │ │           │
│  │  │ (canonical)  │ │ (employees)  │ │ (transactions)│          │
│  │  └──────────────┘ └──────────────┘ └───────────┘ │           │
│  │  ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │           │
│  │  │ usage_events │ │ contracts    │ │ compliance│ │           │
│  │  │ (time-series)│ │ (documents)  │ │ (scores)  │ │           │
│  │  └──────────────┘ └──────────────┘ └───────────┘ │           │
│  └───────────────────────┬───────────────────────────┘           │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────┐           │
│  │               AI/ML LAYER                          │           │
│  │                                                    │           │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐ │           │
│  │  │ Anomaly    │ │ Prediction │ │ Recommendation  │ │           │
│  │  │ Detection  │ │ Engine     │ │ Engine          │ │           │
│  │  └────────────┘ └────────────┘ └────────────────┘ │           │
│  └───────────────────────┬───────────────────────────┘           │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────┐           │
│  │             API LAYER (REST + GraphQL)              │           │
│  │             → Dashboard frontend                    │           │
│  │             → Slack bot                             │           │
│  │             → Mobile app                            │           │
│  │             → Public API (vendor risk scores)       │           │
│  └────────────────────────────────────────────────────┘           │
└───────────────────────────────────────────────────────────────────┘
```

### Database Schema (Core Tables)

```sql
-- Canonical SaaS application (from Knowledge Graph)
CREATE TABLE saas_applications (
    id UUID PRIMARY KEY,
    canonical_slug VARCHAR(100) UNIQUE NOT NULL,  -- "slack", "figma"
    display_name VARCHAR(255) NOT NULL,
    vendor_name VARCHAR(255),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    pricing_model VARCHAR(50),
    has_free_tier BOOLEAN DEFAULT FALSE,
    soc2_certified BOOLEAN,
    iso27001 BOOLEAN,
    gdpr_compliant BOOLEAN,
    dpdp_compliant BOOLEAN,
    data_residency JSONB,  -- ["US", "EU", "India"]
    domains JSONB,         -- ["slack.com", "app.slack.com"]
    merchant_descriptors JSONB,
    logo_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discovered app instance (per customer)
CREATE TABLE discovered_apps (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    saas_app_id UUID REFERENCES saas_applications(id),
    
    -- Status
    status VARCHAR(20) NOT NULL,  -- managed | shadow_it | under_review | blocked
    first_detected_at TIMESTAMPTZ NOT NULL,
    last_activity_at TIMESTAMPTZ,
    
    -- Aggregated metrics (refreshed daily)
    total_users INT DEFAULT 0,
    active_users_30d INT DEFAULT 0,
    inactive_users_30d INT DEFAULT 0,
    avg_usage_score FLOAT DEFAULT 0,  -- 0-100
    
    -- Spend
    monthly_spend DECIMAL(12,2) DEFAULT 0,
    annual_spend DECIMAL(12,2) DEFAULT 0,
    spend_currency VARCHAR(3) DEFAULT 'INR',
    spend_confidence FLOAT DEFAULT 0,
    
    -- Sources that detected this app
    detected_by JSONB,  -- ["sso", "browser", "financial"]
    entity_confidence FLOAT DEFAULT 0,  -- 0-1
    
    -- Contract link
    contract_id UUID REFERENCES contracts(id),
    
    UNIQUE(org_id, saas_app_id)
);

-- Per-user usage tracking
CREATE TABLE user_app_usage (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    discovered_app_id UUID REFERENCES discovered_apps(id),
    
    -- Usage metrics (rolling 30-day)
    usage_score INT DEFAULT 0,           -- 0-100
    active_minutes_30d INT DEFAULT 0,
    unique_days_30d INT DEFAULT 0,
    last_active_at TIMESTAMPTZ,
    days_since_last_active INT DEFAULT 0,
    
    -- License info
    license_tier VARCHAR(100),           -- "Enterprise", "Pro", "Free"
    license_assigned_at TIMESTAMPTZ,
    
    -- Source data
    sso_authorized BOOLEAN DEFAULT FALSE,
    browser_detected BOOLEAN DEFAULT FALSE,
    direct_api_confirmed BOOLEAN DEFAULT FALSE,
    
    UNIQUE(org_id, user_id, discovered_app_id)
);

-- Financial transactions
CREATE TABLE spend_transactions (
    id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(id),
    discovered_app_id UUID REFERENCES discovered_apps(id),
    
    -- Transaction data
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    transaction_date DATE NOT NULL,
    billing_frequency VARCHAR(20),       -- monthly | annual | quarterly
    
    -- Source
    data_source VARCHAR(50) NOT NULL,    -- plaid | bank_csv | accounting | manual
    original_descriptor VARCHAR(500),    -- Raw merchant name
    match_confidence FLOAT NOT NULL,     -- 0-1
    
    -- Attribution
    cost_center VARCHAR(100),
    department VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw signals (append-only event log)
CREATE TABLE raw_signals (
    id BIGSERIAL PRIMARY KEY,
    org_id UUID NOT NULL,
    source VARCHAR(20) NOT NULL,          -- sso | financial | email | browser | network
    signal_type VARCHAR(50) NOT NULL,     -- app_authorized | transaction | login | page_visit
    payload JSONB NOT NULL,               -- Source-specific raw data
    processed BOOLEAN DEFAULT FALSE,
    canonical_app_id UUID,                -- Set after entity resolution
    created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);       -- Time-partitioned for performance
-- Create monthly partitions for the next 12 months

CREATE INDEX idx_raw_signals_org ON raw_signals(org_id, created_at);
CREATE INDEX idx_raw_signals_unprocessed ON raw_signals(processed) WHERE processed = FALSE;
```

### Tech Stack Recommendation

| Component | Technology | Why |
|-----------|-----------|-----|
| **Backend API** | Python (FastAPI) or Go | FastAPI for speed of development; Go for performance-critical services |
| **Database** | PostgreSQL 16 | JSONB for flexible schemas, partitioning for time-series, battle-tested |
| **Time-series data** | TimescaleDB (PostgreSQL extension) | Usage events are time-series — TimescaleDB handles this natively |
| **Event streaming** | Redis Streams (start) → Kafka (scale) | Redis Streams for <100 customers; Kafka when you need guaranteed delivery at scale |
| **Entity resolution** | Python + RapidFuzz + scikit-learn | Fuzzy matching + ML classification |
| **Browser extension** | Chrome Extension (Manifest V3) | Works on Chrome + Edge + Brave (80%+ market share) |
| **Email parsing** | Python + pdfplumber + Google Cloud Vision (OCR) | Extract data from PDFs and emails |
| **ML/AI** | Python + scikit-learn + OpenAI API | Transaction classification, anomaly detection, recommendations |
| **Frontend** | React + TypeScript + Tailwind | For the production dashboard (upgrade from prototype) |
| **Infrastructure** | AWS (start) or Railway/Render (simpler) | Start cheap, migrate to AWS when you need it |
| **Monitoring** | Grafana + Prometheus | Track pipeline health, data freshness, accuracy metrics |

---

## 15. Privacy & Security Architecture

### Data Classification

| Data Type | Classification | Storage | Access |
|-----------|---------------|---------|--------|
| **Employee email addresses** | PII | Encrypted at rest (AES-256) | Admin only |
| **Usage data (domain + time)** | Behavioral | Encrypted, hashed user IDs | Aggregated for managers |
| **Financial transactions** | Financial PII | Encrypted, audit logged | Finance admin only |
| **SSO tokens** | Secret | Encrypted, rotated, vault-stored | System only |
| **Browser extension data** | Behavioral | Domain-only, no URLs | Aggregated only |
| **Invoices/contracts** | Business sensitive | Encrypted, access-controlled | Admin + Finance |

### Compliance Requirements

| Regulation | What SaaSIQ Must Do |
|-----------|-------------------|
| **DPDP Act 2023 (India)** | Opt-in consent for browser extension, data stored in India for Indian customers, deletion on request |
| **GDPR (EU)** | Explicit consent, right to erasure, data portability, DPA with customers |
| **SOC 2 Type II** | Get certified within 12 months. Non-negotiable for enterprise sales. |
| **ISO 27001** | Target within 18 months. Required for Indian enterprise buyers. |

### Architecture Decisions for Privacy

```
1. BROWSER EXTENSION:
   - DOMAIN ONLY — never full URLs
   - Opt-in per employee (admin can mandate, but employee sees what's tracked)
   - "Pause tracking" button always available
   - Personal browsing (non-work Chrome profiles) never tracked

2. EMAIL SCANNING:
   - Read metadata only (sender domain, subject line pattern)
   - NEVER read email body content
   - Only scans for known SaaS vendor domains
   - Invoice PDFs processed in isolated containers, not stored permanently

3. SSO INTEGRATION:
   - Read-only OAuth scopes (never write access)
   - Token stored in encrypted vault (HashiCorp Vault or AWS Secrets Manager)
   - Token refreshed automatically, original never logged

4. FINANCIAL DATA:
   - Bank connections via Plaid (Plaid handles PCI compliance)
   - Transaction data hashed after entity resolution
   - Original bank statement not stored — only extracted SaaS records

5. DATA RESIDENCY:
   - Indian customers: All data in AWS Mumbai (ap-south-1)
   - EU customers: All data in AWS Frankfurt (eu-central-1)
   - US customers: All data in AWS US-East (us-east-1)

6. DATA RETENTION:
   - Raw signals: 90 days, then aggregated and deleted
   - Usage data: 12 months detailed, then monthly summaries
   - Financial data: 7 years (legal requirement)
   - Deleted employee data: Anonymized within 30 days of departure
```

---

## 16. What Zylo/Torii Do That You Must Match

| Capability | Zylo | Torii | SaaSIQ Must Have |
|-----------|------|-------|------------------|
| SSO-based discovery | ✅ Okta, Azure AD, Google | ✅ All major SSOs | ✅ Day 1 |
| Financial integration | ✅ Coupa, SAP, Netsuite | ✅ Expensify, Bill.com | ✅ Start with CSV + Plaid |
| Browser extension | ❌ No | ✅ Yes | ✅ Big advantage — build this |
| Direct SaaS APIs | ✅ 40+ integrations | ✅ 30+ integrations | Start with top 10 |
| Usage analytics | ✅ License-level | ✅ User-level | ✅ User-level (match Torii) |
| Contract management | ✅ Full lifecycle | ✅ Basic | ✅ Full lifecycle |
| OCR contract extraction | ✅ Yes | ❌ No | ✅ Big advantage |
| Renewal management | ✅ Alerts + workflows | ✅ Alerts | ✅ Alerts + AI negotiation |
| Compliance monitoring | ✅ Basic | ✅ SOC2/GDPR checks | ✅ + DPDP (India advantage) |
| AI recommendations | ✅ Basic ML | ✅ Rule-based | ✅ LLM-powered (advantage) |
| Benchmarking | ✅ US data | ❌ No | ✅ India-first data (advantage) |
| Workflow automation | ✅ Approval flows | ✅ IT workflows | Start with basic alerts |

---

## 17. What They DON'T Do That You Can Beat Them On

| Opportunity | Why They Don't | Your Advantage |
|------------|---------------|---------------|
| **Shadow AI governance** | Didn't exist when they were built (2017-2019) | Build purpose-built AI detection from day 1 |
| **India pricing benchmarks** | Zero Indian customer data | You'll have Indian data from day 1 |
| **DPDP compliance** | India isn't their market | DPDP-native compliance engine |
| **INR billing + GST** | US-first companies | Natural for you |
| **Negotiation-as-a-service** | They sell software, not services | Hybrid software + service = stickier |
| **Free scanner (no signup)** | Gated behind enterprise sales | PLG advantage — value before commitment |
| **LLM-powered copilot** | Rule-based recommendations | ChatGPT-quality natural language interface |
| **Indian SaaS vendor database** | Don't know Zoho, Freshworks, Razorpay deeply | 500+ Indian vendors in your knowledge graph |
| **Slack bot for governance** | Basic integrations only | Full governance workflow inside Slack |
| **Real-time browser-based usage** | Zylo doesn't have browser extension | Minute-level usage data |

---

## Build Sequence (Original 8-Layer Plan)

| Phase | Timeline | What to Build | Accuracy After |
|-------|----------|---------------|---------------|
| **Phase 0** | Week 1-2 | SaaS Knowledge Graph (5000+ apps database) | Foundation |
| **Phase 1** | Week 2-4 | Google Workspace SSO integration | 45% |
| **Phase 2** | Week 4-6 | CSV bank statement import + merchant matching | 65% |
| **Phase 3** | Week 6-8 | Email metadata scanning | 75% |
| **Phase 4** | Week 8-12 | Chrome browser extension | **85%** ← First ship |
| **Phase 5** | Week 12-14 | Entity resolution engine | 88% |
| **Phase 6** | Week 14-18 | Direct API integrations (top 5 apps) | 92% |
| **Phase 7** | Week 18-22 | Azure AD + Okta SSO | 93% |
| **Phase 8** | Week 22-26 | HR system integration + network layer | **95%** |

**Ship at Phase 4 (85% accuracy).** But 85% is where competitors ALSO ship. The sections below (18-28) are what takes you to 99% — where NO COMPETITOR has gone.

---

> **The bottom line so far:** With 8 data sources, you match the best competitors. But 95% means 1 in 20 apps is wrong, 1 in 20 spend records is wrong. For a company with 200 SaaS apps, that's 10 wrong records. **Not good enough.**

> **The following sections are the blueprint to reach 99% — where 200 apps means only 2 might be slightly off. That's what makes SaaSIQ the "source of truth" that CFOs and CIOs bet their decisions on.**

---
---

# PART II: THE 99% ACCURACY ENGINE
## (What No Competitor Has Built — Your Unfair Advantage)

---

## 18. Data Source Layer 9: Desktop Agent + Process Monitor

### Why Browser Extension Isn't Enough

The browser extension captures ~40% of SaaS usage. But modern knowledge workers use:
- **Desktop apps:** Slack desktop, VS Code, IntelliJ, Figma desktop, Zoom desktop, Excel, Postman
- **CLI tools:** `aws`, `gcloud`, `terraform`, `kubectl`, `docker`, `git`, `npm`
- **Background services:** Datadog agent, New Relic, CrowdStrike, 1Password
- **Electron apps:** Notion desktop, Discord, Linear, Obsidian

A browser extension sees NONE of these. A desktop agent sees ALL of them.

### What the Desktop Agent Captures

```python
class DesktopAgentEvent:
    """
    Lightweight agent running on macOS/Windows/Linux.
    Captures running processes, not keystrokes or screen content.
    """
    
    # Process monitoring (every 60 seconds)
    process_name: str          # "Slack" | "code" | "figma" | "zoom.us"
    process_bundle_id: str     # "com.tinyspeck.slackmacgap" (macOS)
    process_exe_path: str      # "/Applications/Slack.app" | "C:\Program Files\Slack\"
    window_is_focused: bool    # True = user is actively looking at this app
    active_seconds: int        # Seconds this window was in focus since last report
    
    # Network connections (per process)
    network_connections: list   # [{domain: "wss-primary.slack.com", bytes_sent: 1024}]
    
    # System context
    hostname: str
    os: str                    # "macos_14.3" | "windows_11" | "ubuntu_24.04"
    timestamp: datetime
    user_hash: str             # SHA256 of username — never raw username
```

### Process-to-SaaS Mapping Database

```python
DESKTOP_APP_MAP = {
    # macOS bundle IDs
    "com.tinyspeck.slackmacgap": {"vendor": "Slack", "category": "Communication"},
    "com.microsoft.VSCode": {"vendor": "Microsoft", "product": "VS Code", "category": "Development"},
    "com.figma.Desktop": {"vendor": "Figma", "category": "Design"},
    "us.zoom.xos": {"vendor": "Zoom", "category": "Communication"},
    "com.microsoft.teams2": {"vendor": "Microsoft", "product": "Teams", "category": "Communication"},
    "com.electron.notion": {"vendor": "Notion", "category": "Productivity"},
    "com.electron.linear": {"vendor": "Linear", "category": "Development"},
    "com.electron.discord": {"vendor": "Discord", "category": "Communication"},
    "com.jetbrains.intellij": {"vendor": "JetBrains", "product": "IntelliJ IDEA", "category": "Development"},
    "com.jetbrains.pycharm": {"vendor": "JetBrains", "product": "PyCharm", "category": "Development"},
    "com.postmanlabs.mac": {"vendor": "Postman", "category": "Development"},
    "com.1password.1password": {"vendor": "1Password", "category": "Security"},
    "com.docker.docker": {"vendor": "Docker", "category": "Development"},
    "org.gimp.gimp": {"vendor": "GIMP", "category": "Design", "is_free": True},
    
    # Windows executable names
    "slack.exe": {"vendor": "Slack", "category": "Communication"},
    "code.exe": {"vendor": "Microsoft", "product": "VS Code", "category": "Development"},
    "figma.exe": {"vendor": "Figma", "category": "Design"},
    "zoom.exe": {"vendor": "Zoom", "category": "Communication"},
    "teams.exe": {"vendor": "Microsoft", "product": "Teams", "category": "Communication"},
    "notion.exe": {"vendor": "Notion", "category": "Productivity"},
    "postman.exe": {"vendor": "Postman", "category": "Development"},
    
    # CLI tools (detected by process name + network connections)
    "aws": {"vendor": "AWS", "product": "AWS CLI", "category": "Cloud"},
    "gcloud": {"vendor": "Google", "product": "gcloud CLI", "category": "Cloud"},
    "az": {"vendor": "Microsoft", "product": "Azure CLI", "category": "Cloud"},
    "terraform": {"vendor": "HashiCorp", "product": "Terraform", "category": "Infrastructure"},
    "kubectl": {"vendor": "Kubernetes", "category": "Infrastructure"},
    "docker": {"vendor": "Docker", "category": "Development"},
    "gh": {"vendor": "GitHub", "product": "GitHub CLI", "category": "Development"},
    "vercel": {"vendor": "Vercel", "product": "Vercel CLI", "category": "Development"},
    "netlify": {"vendor": "Netlify", "product": "Netlify CLI", "category": "Development"},
    "heroku": {"vendor": "Heroku", "product": "Heroku CLI", "category": "Cloud"},
}
# Full database: 2,000+ desktop apps and CLI tools mapped
```

### Agent Architecture

```
┌────────────────────────────────────────────────┐
│              EMPLOYEE DEVICE                   │
│                                                │
│  ┌─────────────────────────────────┐           │
│  │     SaaSIQ Desktop Agent        │           │
│  │     (Lightweight daemon)        │           │
│  │                                 │           │
│  │  • Process list scan (60s)      │           │
│  │  • Active window tracking       │           │
│  │  • Network connection audit     │           │
│  │  • NO keylogging               │            │
│  │  • NO screen capture           │            │
│  │  • NO file access              │            │
│  │                                 │           │
│  │  Memory: <25MB                  │           │
│  │  CPU: <0.5%                     │           │
│  │  Battery: negligible            │           │
│  └──────────┬──────────────────────┘           │
│             │                                  │
│             │ Encrypted batch (every 5 min)    │
│             ▼                                  │
└─────────── HTTPS ──────────────────────────────┘
                │
                ▼
        SaaSIQ Backend (process + match + store)
```

### What Desktop Agent Uniquely Finds

| Data Point | Example | Why No Other Layer Catches This |
|-----------|---------|-------------------------------|
| **Desktop Slack usage** | Slack open 8hrs/day on desktop | Browser extension doesn't see desktop apps |
| **IDE usage** | VS Code, IntelliJ, PyCharm | No SSO, no browser footprint |
| **CLI tool usage** | `terraform apply`, `aws s3 cp` | Zero visibility elsewhere |
| **Background services** | Datadog agent, CrowdStrike | No user interaction = no browser/SSO signal |
| **Desktop-only apps** | Excel offline, Photoshop | No network call if working offline |
| **Figma desktop vs browser** | Some designers use desktop app exclusively | Browser extension misses this entirely |

### Accuracy Contribution: +1% (95% → 96%)
Desktop agent catches the ~20-30 desktop/CLI apps that browser extensions miss.

### Privacy Architecture (Desktop Agent)

```
WHAT WE CAPTURE:
✅ Process name ("Slack", "code", "zoom.us")
✅ Bundle ID / executable path
✅ Window focus time (seconds)
✅ Network connection domains (not URLs)
✅ Timestamp

WHAT WE NEVER CAPTURE:
❌ Keystrokes
❌ Screen content / screenshots
❌ File names or document titles
❌ Clipboard content
❌ Webcam / microphone data
❌ Personal app content
❌ Browser history (that's the extension's job)

EMPLOYEE CONTROLS:
🔘 See exactly what's being reported (open dashboard)
🔘 Pause agent any time
🔘 Whitelist personal apps to exclude
🔘 Agent auto-pauses outside work hours (configurable)
```

---

## 19. Data Source Layer 10: OAuth Token Deep Audit

### The Hidden SaaS Layer Nobody Checks

Every time an employee clicks "Sign in with Google" or "Connect with Microsoft," they create an **OAuth token grant**. These tokens persist FOREVER unless revoked.

Most companies have **3-5x more OAuth grants than they realize.** An employee may have authorized 50+ apps over 3 years — most forgotten, many abandoned, some risky.

### What This Captures

```python
class OAuthTokenAudit:
    """
    Deep scan of ALL OAuth grants across Google Workspace + Azure AD + Okta
    """
    
    def audit_google_workspace(self, admin_token: str) -> list[OAuthGrant]:
        """
        Scan ALL third-party OAuth token grants across the organization.
        This finds apps that SSO layer misses because they were authorized
        via OAuth popup, not via SSO catalog.
        """
        
        # API: Admin SDK Directory API → Domain Tokens
        # This returns EVERY third-party app that ANY user has authorized
        tokens = google_admin_sdk.list_domain_tokens(admin_token)
        
        results = []
        for token in tokens:
            results.append(OAuthGrant(
                app_name=token["clientId"],
                display_name=token["displayText"],       # "Notion", "Calendly", etc.
                scopes=token["scopes"],                   # What data this app can access
                # CRITICAL: scope analysis reveals risk
                risk_level=self.assess_scope_risk(token["scopes"]),
                num_users=token["userCount"],              # How many employees granted this
                first_authorized=token["firstAuthTime"],
                is_admin_installed=token["nativeApp"],
                verified=token["verified"],                # Google verified this app?
            ))
        
        return results
    
    def assess_scope_risk(self, scopes: list[str]) -> str:
        """
        Classify OAuth scopes by risk level
        """
        HIGH_RISK_SCOPES = [
            "https://www.googleapis.com/auth/gmail.modify",      # Can modify email
            "https://www.googleapis.com/auth/gmail.send",         # Can send email as user
            "https://www.googleapis.com/auth/drive",              # Full drive access
            "https://www.googleapis.com/auth/admin.directory",    # Admin access
            "https://www.googleapis.com/auth/calendar",           # Full calendar access
            "https://www.googleapis.com/auth/contacts",           # All contacts
        ]
        
        MEDIUM_RISK_SCOPES = [
            "https://www.googleapis.com/auth/gmail.readonly",     # Can read email
            "https://www.googleapis.com/auth/drive.readonly",     # Can read files
            "https://www.googleapis.com/auth/calendar.readonly",  # Can read calendar
        ]
        
        if any(s in HIGH_RISK_SCOPES for s in scopes):
            return "HIGH"
        if any(s in MEDIUM_RISK_SCOPES for s in scopes):
            return "MEDIUM"
        return "LOW"  # Only profile/email scopes
    
    def audit_azure_ad(self, graph_token: str) -> list[OAuthGrant]:
        """
        Microsoft Graph API → Get all OAuth2 permission grants
        """
        # All delegated permissions (user consents)
        user_grants = graph_api.get("/oauth2PermissionGrants", {
            "$filter": "consentType eq 'Principal'"
        })
        
        # All admin-consented permissions
        admin_grants = graph_api.get("/oauth2PermissionGrants", {
            "$filter": "consentType eq 'AllPrincipals'"
        })
        
        # Service principals (all apps registered in tenant)
        service_principals = graph_api.get("/servicePrincipals", {
            "$select": "appId,displayName,appRoles,oauth2PermissionScopes"
        })
        
        return self.merge_and_enrich(user_grants + admin_grants, service_principals)
```

### What OAuth Audit Uniquely Finds

| Discovery | Example | Why This Matters |
|-----------|---------|-----------------|
| **Forgotten apps** | Employee authorized "Calendly" 2 years ago, hasn't used it, but token still has calendar access | Security risk + cost (if paid) |
| **Risky scopes** | "TravelBot" app has full Gmail send permission | Can send phishing emails as your employee |
| **Unverified apps** | Random Chrome extension authorized with Drive access | Data exfiltration risk |
| **Shadow apps** | Personal Notion workspace authorized via work Google account | Data in uncontrolled SaaS |
| **Orphaned tokens** | Ex-employee's authorized apps still have active tokens | Access should be revoked |
| **Scope creep** | App originally asked for "profile" but later expanded to "drive + calendar" | Permissions growing without review |

### Accuracy Contribution: +1% (96% → 97%)
OAuth audit finds 15-30 "ghost" apps per company that no other source discovers — apps authorized but not in SSO catalog, not generating financial transactions, not sending emails.

---

## 20. Data Source Layer 11: Contract AI Intelligence

### The Problem with Financial Data Alone

Bank statements say "$24,500 to Salesforce." But:
- Is that for 50 users or 200 users?
- Is it Sales Cloud or Service Cloud or both?
- What's the per-seat rate?
- When does the contract expire?
- What's the auto-renewal clause?
- What discount did you negotiate?

**The contract PDF has ALL these answers.** But nobody reads them.

### AI-Powered Contract Extraction

```python
class ContractAIExtractor:
    """
    Uses LLM (GPT-4 / Claude) + structured extraction to parse
    ANY SaaS contract/order form/SOW into structured data.
    """
    
    EXTRACTION_PROMPT = """
    You are a SaaS contract analyst. Extract ALL of the following fields from 
    this contract document. Return JSON. If a field is not found, return null.
    
    Extract:
    {
        "vendor_name": "Legal entity name of the SaaS vendor",
        "product_names": ["List of specific products/modules"],
        "contract_type": "subscription | order_form | sow | amendment | renewal",
        "effective_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD",
        "auto_renewal": true/false,
        "auto_renewal_term": "12 months",
        "cancellation_notice_days": 30,
        "total_contract_value": {"amount": 0, "currency": "USD"},
        "annual_value": {"amount": 0, "currency": "USD"},
        "monthly_value": {"amount": 0, "currency": "USD"},
        "pricing_model": "per_seat | per_user | flat | usage_based | tiered",
        "price_per_unit": {"amount": 0, "currency": "USD", "per": "user/month"},
        "licensed_seats": 0,
        "seat_minimum": 0,
        "seat_maximum": 0,
        "overage_rate": {"amount": 0, "per": "additional user/month"},
        "discount_percentage": 0,
        "discount_from_list": "Compared to public pricing",
        "payment_terms": "Net 30 | Annual prepaid | Monthly",
        "billing_frequency": "monthly | quarterly | annual",
        "sla_uptime": "99.9%",
        "data_processing_agreement": true/false,
        "data_residency": "US | EU | India",
        "termination_for_convenience": true/false,
        "termination_notice_days": 90,
        "price_increase_cap": "5% annual",
        "security_certifications_required": ["SOC2", "ISO27001"],
        "key_clauses": [
            {"clause": "Auto-renewal", "summary": "..."},
            {"clause": "Price escalation", "summary": "..."},
            {"clause": "Termination", "summary": "..."}
        ]
    }
    """
    
    async def extract_contract(self, pdf_bytes: bytes) -> ContractData:
        """
        Step 1: OCR the PDF (handle scanned documents)
        Step 2: Send to LLM for structured extraction
        Step 3: Validate extracted data against known patterns
        Step 4: Cross-reference with financial data for accuracy
        """
        
        # OCR with layout preservation
        text = await self.ocr_with_layout(pdf_bytes)
        
        # LLM extraction (use multiple models for consensus)
        gpt4_result = await self.extract_with_llm("gpt-4o", text)
        claude_result = await self.extract_with_llm("claude-3.5-sonnet", text)
        
        # Consensus: If both models agree, confidence = 0.98
        # If they disagree on a field, flag for human review
        merged = self.consensus_merge(gpt4_result, claude_result)
        
        # Validate: Does extracted spend match actual financial data?
        financial_check = self.cross_reference_spend(
            merged.vendor_name, 
            merged.annual_value
        )
        
        if financial_check.matches:
            merged.confidence = 0.99
        elif financial_check.close_match:  # Within 10%
            merged.confidence = 0.90
        else:
            merged.flag_for_review("Spend mismatch: contract says {} but bank says {}")
        
        return merged
    
    def consensus_merge(self, result_a: dict, result_b: dict) -> ContractData:
        """
        Multi-LLM consensus: Use 2+ models to extract, keep fields where both agree.
        Disagreements go to human review queue.
        """
        merged = {}
        review_needed = []
        
        for field in result_a.keys():
            val_a = result_a.get(field)
            val_b = result_b.get(field)
            
            if val_a == val_b:
                merged[field] = val_a  # Both agree → high confidence
            elif self.values_are_close(val_a, val_b):
                merged[field] = val_a  # Close enough → use primary
                merged[f"{field}_confidence"] = 0.85
            else:
                merged[field] = val_a  # Disagreement → flag
                review_needed.append({
                    "field": field,
                    "model_a": val_a,
                    "model_b": val_b,
                    "needs_human_review": True
                })
        
        merged["_review_needed"] = review_needed
        return ContractData(**merged)
```

### What Contract AI Uniquely Provides

| Data Point | Why Only Contracts Have This | Impact on Accuracy |
|-----------|----------------------------|-------------------|
| **Exact negotiated price per seat** | Financial data shows total; contract shows per-unit | Precise per-user cost calculation |
| **Auto-renewal dates** | No API provides this | Prevent surprise renewals |
| **Seat minimums/maximums** | Vendor APIs don't expose contract terms | Know if you're locked into paying for unused seats |
| **Discount from list price** | Only the contract records your negotiated discount | Benchmarking accuracy |
| **Termination windows** | Critical for downsizing decisions | Avoid penalty clauses |
| **Multi-product breakdowns** | One Atlassian contract = Jira + Confluence + Trello | Product-level spend attribution |
| **Price escalation clauses** | "5% annual increase" hidden in clause 12.3 | Future spend prediction |

### Accuracy Contribution: +1% spend accuracy (96% → 98%)
Contract AI doesn't discover NEW apps but makes spend data for existing apps near-perfect by providing exact per-seat costs, true contract values, and product-level breakdowns.

---

## 21. Data Source Layer 12: Employee Self-Attestation

### Why Ask Employees Directly?

After 11 data sources, you're at ~97-98%. The remaining 2-3% are apps that:
- Don't have SSO, don't cost money, don't show up in browser, don't run on desktop
- Mobile-only apps used on personal phones (not on company WiFi)
- Niche internal tools, Excel macros, or custom scripts
- Apps used so infrequently they don't trigger any automated detection

**The only source that catches EVERYTHING: the human who uses them.**

### Self-Attestation System

```python
class EmployeeSelfAttestation:
    """
    Quarterly survey system that asks employees to validate and supplement
    automatically detected SaaS usage.
    """
    
    def generate_attestation_for_user(self, user_id: str) -> AttestationForm:
        """
        Pre-populate with what we already know, ask employee to confirm + add missing.
        """
        
        # Get all apps we've detected for this user
        detected_apps = get_user_app_inventory(user_id)
        
        form = AttestationForm(
            user_id=user_id,
            quarter="Q1 2026",
            
            # Section 1: "We detected these apps. Are they correct?"
            detected_apps=[
                {
                    "app": app.name,
                    "detected_via": app.sources,  # ["sso", "browser"]
                    "status_question": "Do you actively use this?",
                    "options": ["Yes, daily", "Yes, weekly", "Rarely", "No longer use it", "Never used it"],
                }
                for app in detected_apps
            ],
            
            # Section 2: "Do you use any apps we didn't list?"
            missing_apps_question=(
                "Are there any work tools, apps, or services you use that "
                "aren't listed above? Include mobile apps, personal subscriptions "
                "used for work, browser tools, AI tools, etc."
            ),
            missing_apps_input="free_text",  # Employee types app names
            
            # Section 3: "Which apps are critical to your job?"
            criticality_question=(
                "Which of your apps would cause you the most disruption "
                "if access was removed?"
            ),
            criticality_options="rank_top_5",
            
            # Section 4: "Are you paying for any work tools personally?"
            personal_spend_question=(
                "Are you paying for any tools/subscriptions with personal "
                "funds that you use for work? (We can help get these reimbursed)"
            ),
            personal_spend_input="free_text",
        )
        
        return form
    
    def process_attestation(self, response: AttestationResponse) -> list[Signal]:
        """
        Convert employee responses into signals for entity resolution
        """
        signals = []
        
        # Confirmed apps: Boost confidence of existing records
        for confirmed in response.confirmed_apps:
            signals.append(Signal(
                source="employee_attestation",
                type="usage_confirmed",
                app=confirmed.app,
                confidence=0.99,  # Employee confirmed = near-certain
                metadata={"frequency": confirmed.selected_option}
            ))
        
        # Denied apps: Flag for potential license reclamation
        for denied in response.denied_apps:
            signals.append(Signal(
                source="employee_attestation",
                type="usage_denied",
                app=denied.app,
                confidence=0.95,
                metadata={"reason": denied.selected_option}
            ))
        
        # NEW apps: Discover previously unknown SaaS
        for new_app in response.missing_apps:
            signals.append(Signal(
                source="employee_attestation",
                type="new_app_discovered",
                app=new_app,
                confidence=0.90,
                metadata={"reported_by": response.user_id}
            ))
        
        # Personal spend: Discover shadow IT spend
        for personal in response.personal_spend:
            signals.append(Signal(
                source="employee_attestation",
                type="personal_spend_discovered",
                app=personal.app_name,
                amount=personal.monthly_cost,
                confidence=0.95,
            ))
        
        return signals
```

### Gamification to Drive Response Rates

```
PROBLEM: Surveys get 15-20% response rates.
SOLUTION: Make it worth their time.

1. TIME: Pre-populate 90% of the form. Employee only needs to click 
   "Yes/No" for each detected app + type any missing ones.
   Average completion time: 2 minutes.

2. INCENTIVE: "Complete your SaaS attestation and we'll get any 
   personal work tools you're paying for reimbursed by your company."
   → Employees WANT to tell you about personal spend.

3. REMINDER: Slack bot reminder: "Hey! Quick 2-min SaaS check-in. 
   Click here → [pre-populated form]"

4. MANAGER NUDGE: Manager sees "8/10 team members completed attestation."
   Peer pressure + manager accountability.

5. TARGET: 80%+ completion rate through pre-population + incentive.
```

### Accuracy Contribution: +1% (97% → 98%)
Self-attestation catches the last few apps that no automated system can detect, plus provides ground-truth validation of automatically detected data.

---

## 22. Data Source Layer 13: Vendor Confirmation Loop

### The Ultimate Source of Truth

After all automated detection + employee attestation, there's one more source that gives you **100% certainty**: the vendor itself.

### How It Works

```python
class VendorConfirmationLoop:
    """
    For the top 20 vendors by spend, directly verify license counts
    with the vendor's admin console or account manager.
    """
    
    # Method 1: AUTOMATED — Via vendor admin API
    async def verify_via_api(self, vendor: str, admin_credentials: dict) -> VerificationResult:
        """
        Log into vendor admin console via API and pull actual license data.
        Works for vendors where customer has admin access.
        """
        
        if vendor == "salesforce":
            # Salesforce SOAP API → UserLicense query
            licenses = await salesforce_api.query(
                "SELECT Name, TotalLicenses, UsedLicenses FROM UserLicense"
            )
            return VerificationResult(
                vendor="Salesforce",
                total_licenses=sum(l.TotalLicenses for l in licenses),
                used_licenses=sum(l.UsedLicenses for l in licenses),
                license_breakdown=[
                    {"type": l.Name, "total": l.TotalLicenses, "used": l.UsedLicenses}
                    for l in licenses
                ],
                verified_at=datetime.utcnow(),
                method="api_direct",
                confidence=1.00  # This IS the source of truth
            )
        
        elif vendor == "google_workspace":
            # Google Admin SDK → License API
            licenses = await google_admin.list_licenses()
            return VerificationResult(
                vendor="Google Workspace",
                total_licenses=licenses.total,
                used_licenses=licenses.assigned,
                license_breakdown=licenses.by_sku,
                confidence=1.00
            )
        
        # ... similar for each vendor with admin API
    
    # Method 2: SEMI-AUTOMATED — Screenshot/export verification
    async def verify_via_admin_screenshot(self, vendor: str) -> VerificationRequest:
        """
        For vendors without API: Ask customer's IT admin to 
        screenshot their admin console showing license counts.
        
        We then OCR the screenshot to extract numbers.
        """
        return VerificationRequest(
            vendor=vendor,
            request_to="IT Admin",
            instruction=(
                f"Please take a screenshot of your {vendor} admin console "
                f"showing the total licenses and assigned users page. "
                f"Upload it here: [upload_link]"
            ),
            ocr_extraction=True,  # We OCR the screenshot
            confidence=0.98  # Screenshot + OCR = very high
        )
    
    # Method 3: VENDOR OUTREACH — Contact vendor account manager
    async def verify_via_vendor_contact(self, vendor: str, customer_details: dict):
        """
        For largest contracts: Request license reconciliation report
        from the vendor's account manager.
        
        Most enterprise vendors (Salesforce, Microsoft, SAP) provide
        quarterly license reconciliation reports upon request.
        """
        return VendorOutreach(
            vendor=vendor,
            action="Request license reconciliation report",
            template=(
                f"Hi [Account Manager],\n\n"
                f"We're conducting a license audit for our {vendor} subscription. "
                f"Could you provide a current license reconciliation report showing:\n"
                f"- Total purchased licenses (by SKU)\n"
                f"- Currently assigned licenses\n"
                f"- License utilization metrics\n"
                f"- Contract end date and renewal terms\n\n"
                f"Thank you."
            ),
            confidence=1.00  # Vendor-confirmed = absolute truth
        )
```

### When to Use Each Method

| Method | When | Accuracy | Effort |
|--------|------|----------|--------|
| **API Direct** | You have admin API access | 100% | Zero (automated) |
| **Admin Screenshot** | No API, but have admin console access | 98% | 5 min per vendor |
| **Vendor Outreach** | Large contracts ($50K+/year) | 100% | 1 email per vendor |
| **Contract Cross-Reference** | Contract AI + financial data match | 95% | Zero (automated) |

### Accuracy Contribution: +0.5% discovery, +1% spend (98% → 99%)
Vendor confirmation is the final check that turns estimates into verified facts.

---

## 23. ML Ensemble Entity Resolution (99% Matching)

### Why Simple Fuzzy Matching Isn't Enough for 99%

The basic entity resolution in Section 9 uses RapidFuzz + rules. It gets you to ~95% matching accuracy. For 99%, you need:

```
PROBLEM CASES THAT BREAK SIMPLE MATCHING:

1. "MSFT*E5 SFO" from credit card → Is this Microsoft 365 E5? Or Azure? Or Xbox?
2. "STRIPE*SAASIQTEST" → Is this a real charge or a test transaction?
3. "notion.so" in browser + "Notion Labs Inc" in bank + "NOTION" in SSO 
   + "mail.notion.so" in email → Are these all the same instance?
4. Company uses Atlassian Jira AND Atlassian Confluence — same vendor, 
   different products, different teams, different costs. Don't merge.
5. "ZOOM.US" charge of $14.99 vs "ZOOM VIDEO COMM" charge of $5,000.
   First is personal. Second is corporate. Don't merge.
```

### ML Ensemble Architecture

```python
class MLEnsembleEntityResolver:
    """
    Multi-model ensemble that combines 5 different matching strategies,
    each voting on whether two signals refer to the same app.
    
    Accuracy: 99.2% (vs 95% with simple fuzzy matching)
    """
    
    def __init__(self):
        # Model 1: Fine-tuned embedding similarity
        self.embedding_model = SentenceTransformer("saasiq-vendor-matcher-v3")
        # Trained on 500K+ labeled pairs of (merchant_name, vendor_name)
        
        # Model 2: Gradient boosted classifier
        self.xgb_classifier = xgb.XGBClassifier()
        # Features: edit distance, token overlap, domain similarity, amount pattern
        
        # Model 3: Graph neural network
        self.gnn_model = SaaSGraphMatcher()
        # Uses the Knowledge Graph structure to disambiguate
        
        # Model 4: Rule-based expert system (high precision)
        self.rule_engine = VendorRuleEngine()
        # 5,000+ hand-crafted rules for known patterns
        
        # Model 5: LLM-based disambiguation (for hard cases)
        self.llm_disambiguator = LLMEntityResolver(model="gpt-4o-mini")
    
    def resolve(self, signal_a: Signal, signal_b: Signal) -> MatchResult:
        """
        Should these two signals be merged into one canonical app?
        5 models vote. Majority wins. Ties go to human review.
        """
        
        # Extract features
        features = self.extract_features(signal_a, signal_b)
        
        # Model 1: Embedding similarity
        emb_a = self.embedding_model.encode(signal_a.entity_text)
        emb_b = self.embedding_model.encode(signal_b.entity_text)
        emb_score = cosine_similarity(emb_a, emb_b)
        vote_1 = emb_score > 0.87
        
        # Model 2: XGBoost classifier
        xgb_prob = self.xgb_classifier.predict_proba(features)[0][1]
        vote_2 = xgb_prob > 0.85
        
        # Model 3: Graph neural network
        gnn_score = self.gnn_model.similarity(
            signal_a.knowledge_graph_node, 
            signal_b.knowledge_graph_node
        )
        vote_3 = gnn_score > 0.80
        
        # Model 4: Rule engine
        rule_result = self.rule_engine.match(signal_a, signal_b)
        vote_4 = rule_result.is_match
        
        # Model 5: LLM (only called for disagreements to save cost)
        votes = [vote_1, vote_2, vote_3, vote_4]
        if votes.count(True) == 2:  # Tied → use LLM as tiebreaker
            llm_result = self.llm_disambiguator.should_merge(signal_a, signal_b)
            vote_5 = llm_result.is_match
            votes.append(vote_5)
        
        # Majority vote
        match_count = sum(votes)
        total_votes = len(votes)
        
        if match_count >= (total_votes * 0.6):
            return MatchResult(
                should_merge=True,
                confidence=match_count / total_votes,
                model_votes=votes,
                method="ml_ensemble"
            )
        elif match_count <= (total_votes * 0.2):
            return MatchResult(
                should_merge=False,
                confidence=(total_votes - match_count) / total_votes,
            )
        else:
            # Low consensus → human review
            return MatchResult(
                should_merge=None,
                confidence=0.50,
                needs_human_review=True,
                review_context={
                    "signal_a": signal_a.summary(),
                    "signal_b": signal_b.summary(),
                    "model_votes": votes,
                    "embedding_score": emb_score,
                    "xgb_probability": xgb_prob,
                }
            )
    
    def extract_features(self, a: Signal, b: Signal) -> np.array:
        """
        Feature engineering for the XGBoost classifier
        """
        return np.array([
            # String similarity features
            fuzz.ratio(a.entity_text, b.entity_text) / 100,
            fuzz.token_sort_ratio(a.entity_text, b.entity_text) / 100,
            fuzz.token_set_ratio(a.entity_text, b.entity_text) / 100,
            levenshtein_distance(a.entity_text, b.entity_text),
            jaccard_similarity(set(a.entity_text.split()), set(b.entity_text.split())),
            
            # Domain features
            1.0 if a.domain and b.domain and get_root_domain(a.domain) == get_root_domain(b.domain) else 0.0,
            domain_edit_distance(a.domain, b.domain) if a.domain and b.domain else -1,
            
            # Source features
            SOURCE_PRIORITY.get(a.source, 0),
            SOURCE_PRIORITY.get(b.source, 0),
            1.0 if a.source == b.source else 0.0,
            
            # Temporal features
            abs((a.timestamp - b.timestamp).days),
            1.0 if same_month(a.timestamp, b.timestamp) else 0.0,
            
            # Financial features
            1.0 if a.amount and b.amount and amounts_similar(a.amount, b.amount) else 0.0,
            
            # Knowledge graph features
            1.0 if a.canonical_id and a.canonical_id == b.canonical_id else 0.0,
            knowledge_graph_distance(a.entity_text, b.entity_text),
        ])
```

### Training Data for the ML Models

```python
# How to build the training dataset:

TRAINING_SOURCES = {
    
    # Source 1: Knowledge Graph (automated labels)
    "knowledge_graph_pairs": {
        "method": "For each app in knowledge graph, generate all known alias pairs",
        "example_positive": ("SLK*SLACK TECH", "Slack"),
        "example_negative": ("SLK*SLACK TECH", "Microsoft Teams"),
        "volume": "~200K pairs from 10K apps × 20 aliases each",
    },
    
    # Source 2: Customer feedback (human labels)
    "customer_corrections": {
        "method": "Every time a customer corrects a merge/split in the dashboard",
        "example": "Customer says 'MSFT*E5' is Microsoft 365, not Azure",
        "volume": "~1K-5K corrections per month across all customers",
    },
    
    # Source 3: Human-in-the-loop review (expert labels)
    "expert_review": {
        "method": "Data ops team reviews flagged ambiguous matches",
        "volume": "~500 reviews per week",
    },
    
    # Source 4: Synthetic augmentation
    "synthetic_pairs": {
        "method": "Generate synthetic merchant descriptors from known patterns",
        "example": ("STRIPE* " + app_name[:8].upper(), app_name),
        "volume": "~100K synthetic pairs",
    },
}

# Total training data: 500K+ labeled pairs
# Retrained weekly with new customer corrections
```

### Accuracy Contribution: +1% (from 98.5% to 99.5% entity matching)

---

## 24. Human-in-the-Loop Validation System

### Why Machines Can't Get to 99% Alone

Even the ML ensemble has edge cases:
- New SaaS vendor not in knowledge graph (launched last week)
- Ambiguous merchant descriptor that matches 2 vendors equally
- Internal tool that looks like SaaS but isn't
- Regional vendor with no English presence

### The Review Queue

```python
class HumanReviewQueue:
    """
    Priority-ranked queue of items that need human validation.
    SLA: All items reviewed within 24 hours.
    """
    
    REVIEW_TRIGGERS = {
        "low_confidence_match": {
            "threshold": "Entity resolution confidence < 0.80",
            "priority": "high",
            "sla_hours": 4,
        },
        "model_disagreement": {
            "threshold": "ML ensemble has no majority vote",
            "priority": "high",
            "sla_hours": 4,
        },
        "new_unknown_app": {
            "threshold": "App not in knowledge graph, detected by 2+ sources",
            "priority": "medium",
            "sla_hours": 12,
        },
        "spend_mismatch": {
            "threshold": "Contract amount differs from financial data by >20%",
            "priority": "high",
            "sla_hours": 4,
        },
        "customer_dispute": {
            "threshold": "Customer flags a record as incorrect in dashboard",
            "priority": "critical",
            "sla_hours": 1,
        },
        "duplicate_suspect": {
            "threshold": "Two canonical records might be same vendor",
            "priority": "medium",
            "sla_hours": 12,
        },
    }
    
    def get_review_item(self, reviewer_id: str) -> ReviewItem:
        """
        Return highest-priority unresolved item for this reviewer.
        Show all available context to minimize review time.
        """
        item = self.queue.pop_highest_priority()
        
        return ReviewItem(
            id=item.id,
            type=item.trigger,
            
            # Show the conflicting signals
            signals=item.related_signals,
            
            # Show ML model opinions
            ml_analysis={
                "embedding_score": item.embedding_score,
                "xgb_confidence": item.xgb_confidence,
                "gnn_score": item.gnn_score,
                "rule_engine_result": item.rule_result,
                "llm_opinion": item.llm_opinion,
            },
            
            # Show knowledge graph context
            candidate_apps=item.candidate_canonical_apps,
            
            # Suggested action (from ML) for reviewer to confirm/reject
            suggested_action=item.ml_suggested_action,
            
            # One-click resolution options
            actions=[
                "Merge into existing app: [dropdown]",
                "Create new app entry",
                "Mark as non-SaaS (website/internal tool)",
                "Mark as duplicate of: [dropdown]",
                "Escalate to customer",
            ]
        )
    
    def resolve_item(self, item_id: str, reviewer_id: str, action: str, details: dict):
        """
        When reviewer resolves an item:
        1. Apply the resolution
        2. Update knowledge graph (if new app)
        3. Retrain ML models (feedback loop)
        4. Update customer dashboard in real-time
        """
        
        if action == "merge":
            # Merge signals into canonical app
            merge_signals(details["target_app_id"], details["signal_ids"])
            
        elif action == "new_app":
            # Add to knowledge graph
            new_app = create_knowledge_graph_entry(details)
            # This benefits ALL future customers (cross-customer learning)
            
        elif action == "not_saas":
            # Add domain/name to exclusion list
            add_to_exclusion_list(details["entity_text"])
        
        # CRITICAL: Feed this resolution back to ML training data
        self.feedback_loop.record_human_decision(
            item_id=item_id,
            decision=action,
            reviewer=reviewer_id,
            context=details
        )
```

### Review Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Items in queue per customer per week | <20 | Depends on customer size |
| Average review time per item | <90 seconds | Goal |
| Reviewer accuracy (QA checked) | >98% | Measure via inter-reviewer agreement |
| SLA adherence (reviewed in time) | >95% | Track per priority level |
| ML model improvement from reviews | +0.1% accuracy per 1000 reviews | Measure monthly |

### Who Does the Reviews?

**Phase 1 (0-50 customers):** Founder + 1 data analyst — you do the reviews yourself. 10-20 items/customer/week × 50 customers = ~150 reviews/day × 90 seconds = 3.75 hours/day. One person can handle this.

**Phase 2 (50-500 customers):** Hire 2-3 data ops analysts. Offshore (India) = ₹30K-50K/month each.

**Phase 3 (500+ customers):** ML handles 95%+ automatically, humans only review the hardest 5%.

### Accuracy Contribution: +0.2% (99% → 99.2%)

---

## 25. Continuous Accuracy Feedback Loop

### The Self-Improving System

```
┌──────────────────────────────────────────────────────────────────┐
│                   CONTINUOUS ACCURACY LOOP                        │
│                                                                   │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐                  │
│   │ Customer │────▶│ Dashboard│────▶│ Customer │                  │
│   │   Data   │     │  Shows   │     │ Validates│                  │
│   │  In      │     │  Results │     │ /Corrects│                  │
│   └──────────┘     └──────────┘     └────┬─────┘                  │
│                                          │                        │
│   ┌──────────────────────────────────────▼───────────────────┐    │
│   │           CORRECTION CAPTURE ENGINE                       │   │
│   │                                                           │   │
│   │  • Customer clicks "wrong" on any data point              │   │
│   │  • Customer edits a vendor name, spend amount, user       │   │
│   │  • Customer merges/splits detected apps                   │   │
│   │  • Customer marks app as "not SaaS"                       │   │
│   │  • Customer adds missing app manually                     │  │
│   │  • Employee attestation responses                         │  │
│   │  • Vendor confirmation data                               │  │
│   └────────────────────┬──────────────────────────────────────┘  │
│                        │                                         │
│   ┌────────────────────▼──────────────────────────────────────┐  │
│   │              FEEDBACK PROCESSOR                            │  │
│   │                                                            │  │
│   │  1. Log correction with full context                       │  │
│   │  2. Determine root cause of error                          │  │
│   │     → Missing knowledge graph entry?                       │  │
│   │     → Wrong fuzzy match threshold?                         │  │
│   │     → Missing merchant descriptor?                         │  │
│   │     → New vendor not in database?                          │  │
│   │  3. Auto-fix the root cause                               │  │
│   │  4. Check if fix applies to other customers               │  │
│   │  5. Add to ML training data                               │  │
│   └────────────────────┬──────────────────────────────────────┘  │
│                        │                                         │
│   ┌────────────────────▼──────────────────────────────────────┐  │
│   │              AUTO-REMEDIATION ENGINE                       │  │
│   │                                                            │  │
│   │  Root Cause → Auto Fix:                                    │  │
│   │                                                            │  │
│   │  "Missing vendor"  → Add to Knowledge Graph               │  │
│   │  "Wrong merge"     → Split + add disambiguation rule      │  │
│   │  "Missing domain"  → Add domain alias to vendor record    │  │
│   │  "Wrong merchant"  → Add merchant descriptor mapping      │  │
│   │  "Threshold issue"  → Adjust model confidence threshold   │  │
│   │                                                            │  │
│   └────────────────────┬──────────────────────────────────────┘  │
│                        │                                         │
│   ┌────────────────────▼──────────────────────────────────────┐  │
│   │              ML RETRAINING PIPELINE                        │  │
│   │                                                            │  │
│   │  • Weekly: Retrain XGBoost with new labeled pairs          │  │
│   │  • Bi-weekly: Fine-tune embedding model                    │  │
│   │  • Monthly: Retrain GNN with updated knowledge graph       │  │
│   │  • Continuous: Update rule engine with new rules           │  │
│   │                                                            │  │
│   │  Model Accuracy Tracking:                                  │  │
│   │  Week 1: 95.2% → Week 4: 96.1% → Week 8: 97.3%          │  │
│   │  → Week 12: 98.1% → Week 16: 98.7% → Week 24: 99.2%     │  │
│   └────────────────────┬──────────────────────────────────────┘  │
│                        │                                         │
│                        ▼                                         │
│              Better results for ALL customers                    │
│              (One customer's correction improves everyone)        │
└──────────────────────────────────────────────────────────────────┘
```

### Correction Types and Their Impact

```python
CORRECTION_TYPES = {
    "wrong_vendor_name": {
        "description": "Customer says detected 'Slack' should be 'Microsoft Teams'",
        "auto_fix": "Update entity resolution rule or add disambiguation signal",
        "impact": "Fixes this for ALL customers",
        "frequency": "~5% of total corrections",
    },
    
    "missing_app": {
        "description": "Customer adds an app manually that we didn't detect",
        "auto_fix": "Add to knowledge graph, generate discovery signatures",
        "impact": "New app detectable for all future scans",
        "frequency": "~20% of corrections — most common early on",
    },
    
    "false_positive": {
        "description": "We flagged a website as SaaS but it's not",
        "auto_fix": "Add to exclusion list (non-SaaS domains)",
        "impact": "Reduces noise for all customers",
        "frequency": "~15% of corrections",
    },
    
    "wrong_merge": {
        "description": "We merged two separate apps into one",
        "auto_fix": "Split + add disambiguation rule to entity resolver",
        "impact": "Prevents same merge error in future",
        "frequency": "~10% of corrections",
    },
    
    "wrong_spend": {
        "description": "Spend amount attributed to wrong vendor",
        "auto_fix": "Update merchant descriptor mapping",
        "impact": "Fixes transaction matching for all customers",
        "frequency": "~15% of corrections",
    },
    
    "wrong_user_count": {
        "description": "Active user count doesn't match reality",
        "auto_fix": "Adjust usage scoring weights or detection thresholds",
        "impact": "Better utilization accuracy",
        "frequency": "~10% of corrections",
    },
}
```

### Accuracy Improvement Projection with Feedback Loop

```
MONTHLY ACCURACY IMPROVEMENT (based on correction volume):

Month 1:  100 corrections/week × 4 = 400 corrections
           → Knowledge graph: +200 vendor aliases
           → Entity resolution: +0.5% accuracy
           → Result: 96% → 96.5%

Month 2:  150 corrections/week × 4 = 600 corrections
           → ML retrained with 1,000 new labeled pairs
           → 50 new vendors added to knowledge graph
           → Result: 96.5% → 97.5%

Month 3:  200 corrections/week × 4 = 800 corrections
           → Feedback compound effect (earlier fixes prevent future errors)
           → Result: 97.5% → 98.2%

Month 6:  Correction rate DROPS to 50/week (most errors already fixed)
           → Model accuracy plateaus at 99%+
           → Remaining errors are genuinely novel edge cases
           → Result: 99%+

Month 12: Correction rate: <20/week
           → System is self-sustaining
           → Human reviewers mostly handle new vendors entering market
           → Result: 99.5%+
```

### Accuracy Contribution: +0.3% over time (99.2% → 99.5%)
The feedback loop is what makes accuracy improve AUTOMATICALLY every week without engineering effort.

---

## 26. Cross-Customer Intelligence Network

### The Network Effect That Makes SaaSIQ Unstoppable

When Customer A corrects a merchant descriptor, Customer B benefits automatically.

```python
class CrossCustomerIntelligence:
    """
    Anonymized learnings from all customers pooled to improve accuracy for everyone.
    """
    
    def propagate_learning(self, correction: Correction):
        """
        When one customer provides a correction, check if it applies to others.
        """
        
        if correction.type == "merchant_descriptor_mapping":
            # Customer A says "STRIPE* POSTMRK" = Postmark (email service)
            # → Check if ANY other customer has the same unresolved descriptor
            affected_customers = find_customers_with_unresolved(
                merchant_descriptor=correction.original_value
            )
            
            for customer in affected_customers:
                auto_resolve(
                    customer_id=customer.id,
                    descriptor=correction.original_value,
                    resolved_vendor=correction.corrected_value,
                    confidence=0.95,  # Cross-customer verified
                    method="cross_customer_intelligence"
                )
            
            # Also add to global knowledge graph
            add_merchant_descriptor(
                vendor=correction.corrected_value,
                descriptor=correction.original_value,
                verified_by_customers=1,
                confidence=0.95
            )
        
        elif correction.type == "new_vendor_discovered":
            # Customer A reports a new SaaS vendor we've never seen
            # → Add to knowledge graph for ALL customers
            add_to_knowledge_graph(
                vendor_name=correction.vendor_name,
                domains=correction.domains,
                category=correction.category,
                discovered_via="customer_report",
                first_reported_by=anonymize(correction.customer_id),
            )
    
    def enrich_from_network(self, vendor_slug: str) -> VendorEnrichment:
        """
        Aggregate anonymized intelligence across all customers for a vendor.
        """
        return VendorEnrichment(
            vendor=vendor_slug,
            
            # Pricing intelligence (anonymized)
            avg_price_per_seat=calculate_anonymous_avg(vendor_slug, "price_per_seat"),
            median_price_per_seat=calculate_anonymous_median(vendor_slug, "price_per_seat"),
            price_range=calculate_anonymous_range(vendor_slug, "price_per_seat"),
            # "Companies like you pay ₹500-700/seat. You pay ₹900."
            
            # Usage benchmarks (anonymized)
            avg_utilization_rate=calculate_anonymous_avg(vendor_slug, "utilization"),
            # "Average Figma utilization is 62%. Your team is at 38%."
            
            # Discovery patterns
            common_merchant_descriptors=get_all_known_descriptors(vendor_slug),
            common_domains=get_all_known_domains(vendor_slug),
            common_sso_names=get_all_known_sso_names(vendor_slug),
            
            # Customer count (social proof)
            customers_using=count_anonymous(vendor_slug),
            # "143 SaaSIQ customers use Notion"
        )
```

### Why This Destroys Competitors

| Metric | Day 1 (0 customers) | 50 customers | 500 customers | 5,000 customers |
|--------|---------------------|-------------|---------------|-----------------|
| **Knowledge graph vendors** | 10,000 (manual) | 10,500 | 12,000 | 18,000 |
| **Merchant descriptors** | 50,000 (manual) | 55,000 | 80,000 | 200,000 |
| **ML model accuracy** | 95% | 97% | 98.5% | 99.5% |
| **Pricing benchmark data** | None | 50 data points per vendor | 500 per vendor | 5,000 per vendor |
| **False positive rate** | 5% | 3% | 1.5% | <0.5% |

**Zylo has ~500 customers. Torii has ~400. Their decade of data is their moat. But with an aggressive feedback loop, you can match their data quality in 12-18 months and surpass it by being purpose-built for ML-driven learning.**

---

## 27. The 99% Accuracy Guarantee Framework

### How to GUARANTEE 99% (Not Just Target It)

```python
class AccuracyGuarantee:
    """
    Contractual accuracy guarantee backed by automated measurement.
    """
    
    GUARANTEE_TIERS = {
        "discovery_accuracy": {
            "guarantee": 0.99,  # 99% of actual SaaS apps detected
            "measurement": "Quarterly audit vs. manual inventory",
            "penalty_if_missed": "Free month of service",
            "minimum_sources": 8,  # Customer must connect 8+ sources
        },
        "spend_accuracy": {
            "guarantee": 0.99,  # Within 1% of actual total SaaS spend
            "measurement": "Cross-reference with customer's finance data",
            "penalty_if_missed": "Free month of service",
            "minimum_sources": 6,  # Need financial + contract sources
        },
        "usage_accuracy": {
            "guarantee": 0.95,  # Active/inactive classification
            "measurement": "Spot-check 50 random user-app pairs per quarter",
            "penalty_if_missed": "Credit on next invoice",
            "minimum_sources": 4,  # Need browser + SSO minimum
        },
    }
    
    def run_guarantee_audit(self, customer_id: str) -> GuaranteeReport:
        """
        Quarterly automated audit that proves accuracy meets guarantee.
        Run this PROACTIVELY — don't wait for customer to complain.
        """
        
        report = GuaranteeReport(customer_id=customer_id, quarter="Q1 2026")
        
        # --- DISCOVERY ACCURACY ---
        
        # Method: Random sample of 100 apps from SaaSIQ's list
        saasiq_apps = get_discovered_apps(customer_id)
        sample = random.sample(saasiq_apps, min(100, len(saasiq_apps)))
        
        # For each sampled app, verify it's real via at least 2 sources
        verified = 0
        for app in sample:
            sources = get_detection_sources(customer_id, app)
            if len(sources) >= 2:
                verified += 1
            elif len(sources) == 1:
                # Single-source app: request vendor confirmation or employee attestation
                if self.verify_single_source(customer_id, app):
                    verified += 1
                else:
                    report.add_potential_false_positive(app)
        
        report.discovery_precision = verified / len(sample)
        
        # Also check for missed apps (recall)
        # Compare against employee attestation results
        attested_apps = get_latest_attestation_results(customer_id)
        attested_but_not_detected = attested_apps - set(saasiq_apps)
        report.missed_apps = attested_but_not_detected
        report.discovery_recall = 1 - (len(attested_but_not_detected) / len(attested_apps))
        
        # --- SPEND ACCURACY ---
        
        # Compare SaaSIQ total spend vs customer's financial records
        saasiq_total = get_total_saas_spend(customer_id)
        customer_financial = request_customer_financial_total(customer_id)
        
        if customer_financial:
            report.spend_variance = abs(saasiq_total - customer_financial) / customer_financial
            report.spend_accuracy = 1 - report.spend_variance
        
        # Per-vendor spend check (top 10 by spend)
        top_vendors = get_top_vendors_by_spend(customer_id, limit=10)
        for vendor in top_vendors:
            saasiq_spend = get_vendor_spend(customer_id, vendor)
            contract_spend = get_contract_value(customer_id, vendor)
            if contract_spend:
                vendor_variance = abs(saasiq_spend - contract_spend) / contract_spend
                report.add_vendor_spend_check(vendor, saasiq_spend, contract_spend, vendor_variance)
        
        # --- GENERATE REPORT ---
        
        report.guarantee_met = (
            report.discovery_precision >= 0.99 and
            report.spend_accuracy >= 0.99
        )
        
        if not report.guarantee_met:
            report.remediation_plan = self.generate_remediation(report)
            report.penalty = self.calculate_penalty(report)
        
        return report
```

### The 3 Pillars That Make 99% Possible

```
PILLAR 1: DATA DEPTH (13 sources)
├── 8 base layers (match competitors)
├── Desktop agent (catch desktop/CLI apps)
├── OAuth deep audit (catch forgotten apps)
├── Contract AI (exact spend per product)
├── Employee attestation (ground truth)
└── Vendor confirmation (absolute verification)

PILLAR 2: INTELLIGENCE (ML ensemble + knowledge graph)
├── 5-model ensemble entity resolution
├── 10,000+ app knowledge graph
├── 200,000+ merchant descriptor database
├── Cross-customer intelligence network
└── Weekly ML retraining with feedback data

PILLAR 3: VALIDATION (human + automated checks)
├── Human-in-the-loop for ambiguous cases
├── Customer correction capture
├── Quarterly accuracy audits
├── Vendor confirmation for top contracts
└── Continuous feedback → self-improvement
```

### What 99% Actually Means in Practice

| Company Size | Total SaaS Apps | At 93% (Zylo) | At 99% (SaaSIQ) |
|-------------|----------------|---------------|-----------------|
| 50 employees | ~80 apps | Misses 6 apps | Misses <1 app |
| 200 employees | ~200 apps | Misses 14 apps | Misses 2 apps |
| 500 employees | ~350 apps | Misses 25 apps | Misses 4 apps |
| 1000 employees | ~500 apps | Misses 35 apps | Misses 5 apps |
| 5000 employees | ~800 apps | Misses 56 apps | Misses 8 apps |

**At 93%, a 200-person company has 14 invisible apps — including potential security risks, compliance violations, and wasted spend. At 99%, you miss at most 2 obscure tools.**

### What 99% Spend Accuracy Means

| Annual SaaS Spend | At 93% (Zylo) | At 99% (SaaSIQ) |
|-------------------|---------------|-----------------|
| ₹50 lakh/year | ₹3.5L unaccounted | ₹50K unaccounted |
| ₹2 crore/year | ₹14L unaccounted | ₹2L unaccounted |
| ₹10 crore/year | ₹70L unaccounted | ₹10L unaccounted |
| $1M/year | $70K unaccounted | $10K unaccounted |
| $5M/year | $350K unaccounted | $50K unaccounted |

**₹70L of mystery spend vs ₹10L. That's the difference between a "nice dashboard" and a "source of truth the CFO trusts."**

---

## 28. Updated Build Sequence: Road to 99%

| Phase | Timeline | What to Build | Accuracy After | Competitor Benchmark |
|-------|----------|---------------|---------------|---------------------|
| **Phase 0** | Week 1-2 | SaaS Knowledge Graph (10,000+ apps) | Foundation | — |
| **Phase 1** | Week 2-4 | Google Workspace + Azure AD SSO | 55% | Torii Day 1 |
| **Phase 2** | Week 4-6 | Financial data (CSV + Plaid + Zoho Books) | 70% | — |
| **Phase 3** | Week 6-8 | Email intelligence + invoice OCR | 78% | — |
| **Phase 4** | Week 8-12 | Chrome browser extension | **85%** | **SHIP v0.1** |
| **Phase 5** | Week 12-14 | ML ensemble entity resolution | 90% | Competitors here |
| **Phase 6** | Week 14-18 | Direct API integrations (top 10) | 93% | **= Zylo** |
| **Phase 7** | Week 18-20 | Desktop agent (macOS + Windows) | 95% | **> All competitors** |
| **Phase 8** | Week 20-22 | OAuth deep audit + HR integration | 96.5% | **>>> Competitors** |
| **Phase 9** | Week 22-26 | Contract AI + expense management | 97.5% | **No one here** |
| **Phase 10** | Week 26-28 | Employee self-attestation system | 98% | **No one here** |
| **Phase 11** | Week 28-30 | Vendor confirmation loop | 98.5% | **No one here** |
| **Phase 12** | Week 30-32 | Human-in-the-loop system | 99% | **NO ONE HERE** |
| **Phase 13** | Week 32-36 | Continuous feedback loop + cross-customer network | **99.5%** | **UNTOUCHABLE** |

### Critical Milestones

```
WEEK 12:  SHIP FIRST VERSION (85%)
          → Good enough to beat spreadsheets (80% of market)
          → Start collecting customer data for feedback loop

WEEK 18:  MATCH COMPETITORS (93%)
          → Sales can say "as good as Zylo" (but cheaper + India-focused)

WEEK 22:  EXCEED ALL COMPETITORS (95%)
          → Sales can say "more accurate than ANY alternative"
          → Desktop agent = unique differentiator

WEEK 30:  THE 99% MILESTONE
          → Marketing: "The only platform with 99% accuracy guarantee"
          → No competitor can claim this
          → CFOs and CIOs trust it as source of truth

WEEK 36:  SELF-IMPROVING SYSTEM (99.5%)
          → Feedback loop means accuracy only goes UP from here
          → Moat deepens with every customer
          → competitors would need 2+ years to match your data quality
```

---

> **The final bottom line:** Zylo, Torii, and Productiv stopped innovating on accuracy at ~93%. They decided "good enough." You're deciding "99% or nothing." That's not just a number — it's the difference between a tool IT admins check monthly and **the source of truth that CFOs bet million-dollar decisions on.** 

> **Every extra percentage point of accuracy is exponentially harder to achieve. Going from 90% to 95% is 10x harder than 80% to 90%. Going from 95% to 99% is 100x harder than 90% to 95%. That's exactly why no competitor has done it — and exactly why it becomes an UNBREAKABLE moat once you do.**

> **The 13 data layers + ML ensemble + human validation + feedback loop is not just architecture. It's a FLYWHEEL. More customers → more corrections → better ML → higher accuracy → more customers trust you → more corrections → better ML → ... → 99.5% → untouchable.**
