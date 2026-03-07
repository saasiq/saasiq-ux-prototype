# SaaSIQ — Customer Acquisition Strategy & Revolutionary Features Roadmap

> **Goal:** Go from 0 customers → first 100 paying customers  
> **Timeline:** Q1–Q4 2026  
> **Status:** Action plan — ready to execute  

---

## Table of Contents

1. [Why You're Not Getting Customers (Honest Diagnosis)](#1-why-youre-not-getting-customers)
2. [The #1 Thing to Build Tomorrow](#2-the-1-thing-to-build-tomorrow)
3. [12 Revolutionary Features to Build](#3-12-revolutionary-features-to-build)
4. [30-Day Quick Wins (No Code Needed)](#4-30-day-quick-wins-no-code-needed)
5. [Go-To-Market Playbook for India](#5-go-to-market-playbook-for-india)
6. [Pricing Strategy Overhaul](#6-pricing-strategy-overhaul)
7. [Content & SEO Strategy](#7-content--seo-strategy)
8. [Partnership & Channel Strategy](#8-partnership--channel-strategy)
9. [Metrics to Track](#9-metrics-to-track)
10. [90-Day Execution Calendar](#10-90-day-execution-calendar)

---

## 1. Why You're Not Getting Customers

Before building new features, understand why the current product isn't converting:

### Problem 1: No Free Value Before Signup

| What's Wrong | Why It Kills Conversion |
|-------------|------------------------|
| Users must sign up → connect SSO → wait for scan BEFORE seeing any value | That's 15+ minutes of effort with zero payoff. 95% of visitors bounce. |
| Competitors (Zylo, Torii, Zluri) have the same problem | **This is your opportunity** — be the first to give value BEFORE asking for anything |

**Fix:** Build a free, no-signup SaaS Spend Scanner (see Feature #1 below).

### Problem 2: Feature Parity with Competitors

| Your Feature | Who Already Has It |
|-------------|-------------------|
| SaaS Discovery | Zylo, Torii, Zluri, Productiv, CloudEagle |
| Spend Analytics | All of them |
| License Optimization | All of them |
| Compliance Monitoring | Zylo, Torii |
| Contract Management | Zylo, Vendr, CloudEagle |

**Fix:** Build features NO ONE else has (see Features #2, #3, #4 below).

### Problem 3: No India-Specific Differentiation

| What You Claim | Reality |
|---------------|---------|
| "Indian enterprise focus" | Your pricing is in USD ($3, $7/employee), not INR |
| "DPDP compliance" | Just a checkbox — no deep DPDP workflow |
| "Indian company logos" | Social proof without real customers is meaningless |

**Fix:** Go deep on India — INR-first pricing, DPDP-native workflows, GST invoice tracking, Indian SaaS vendor database.

### Problem 4: No Viral Loop

| Current State | What's Missing |
|--------------|---------------|
| User signs up → uses dashboard alone | Nothing makes them invite colleagues, share results, or talk about SaaSIQ |

**Fix:** Build shareable reports, team collaboration features, and a freemium tool that spreads organically.

### Problem 5: No Proof of ROI Before Purchase

| What You Say | What Buyers Think |
|-------------|------------------|
| "Save 30% on SaaS spend" | "Prove it. Show me MY savings before I pay." |
| "$2.4M avg savings" | "That's someone else's number. What about MY company?" |

**Fix:** Show personalized savings estimate BEFORE signup (Feature #1).

---

## 2. The #1 Thing to Build Tomorrow

### Free SaaS Spend Scanner (No Signup Required)

**This single feature will generate more leads than everything else combined.**

#### What It Is
A public web tool at `saasiq.com/scanner` where anyone can:
1. Upload a CSV bank/card statement OR
2. Connect Google Workspace (read-only, one-click) OR
3. Manually list their SaaS tools + approximate costs

→ Instantly get a **personalized SaaS spend report** showing:
- Total monthly/annual SaaS spend
- Estimated waste (based on industry benchmarks)
- Top 5 optimization opportunities
- Comparison vs. companies their size
- A "Your SaaSIQ Savings Score" (A/B/C/D/F)

#### Why This Works

| Principle | How It Applies |
|-----------|---------------|
| **Value before commitment** | User gets useful data without creating an account |
| **Personalized proof** | "YOUR company wastes ₹18L/year" hits harder than "companies waste 30%" |
| **Natural upsell** | Report says "Want to find ALL waste? Connect SaaSIQ for full scan" |
| **Shareable** | Users share their Savings Score with their CFO → CFO becomes the buyer |
| **SEO magnet** | "Free SaaS spend calculator" ranks for high-intent searches |

#### How to Build It

```
Phase 1 (Week 1-2): CSV Upload Scanner
- Parse bank statement CSV for known SaaS vendor names
- Match against database of 500+ SaaS companies
- Calculate total spend, categorize by department
- Generate shareable PDF report

Phase 2 (Week 3-4): Google Workspace Quick Scan  
- One-click Google OAuth (read-only)
- Scan Google Workspace admin for connected apps
- Count users per app
- Estimate cost based on public pricing

Phase 3 (Week 5-6): Manual Entry Mode
- User selects tools from a searchable list
- Enters approximate cost + number of users
- AI estimates waste based on benchmarks
```

#### Expected Impact

| Metric | Before Scanner | After Scanner (3 months) |
|--------|---------------|-------------------------|
| Website visitors/month | ~500 | ~5,000 (10x from SEO + sharing) |
| Leads generated/month | ~10 | ~500 (10% of visitors use scanner) |
| Free → Paid conversion | 2% | 8% (scanner pre-qualifies leads) |
| Sales cycle | 45 days | 14 days (buyer already sees their waste) |

---

## 3. 12 Revolutionary Features to Build

### Feature #1: SaaS Spend Scanner (Free Tool)
**Priority: BUILD NOW | Effort: 2 weeks | Impact: 10x leads**

Already detailed above. This is your customer acquisition engine.

---

### Feature #2: AI Negotiation-as-a-Service
**Priority: BUILD NOW | Effort: 4 weeks | Impact: Revenue model innovation**

#### What It Is
SaaSIQ negotiates SaaS renewals ON BEHALF of customers.

#### How It Works
```
User clicks "Negotiate for Me" on a contract
    → SaaSIQ AI generates a negotiation brief:
        - Current price vs. industry benchmark
        - Competitor alternatives with pricing
        - Usage data proving over-provisioning
        - Recommended target price
        - Email templates for procurement
    → Option 1: User negotiates themselves (free)
    → Option 2: SaaSIQ team negotiates for them (20% of savings fee)
```

#### Why No One Else Does This
- Zylo/Torii stop at "here's what you could save" — they never EXECUTE
- Vendr does negotiation but charges flat fees and only covers US vendors
- You'd be the first to do this for Indian enterprises with Indian SaaS vendors

#### Revenue Model
```
Customer saves ₹24L/year on Salesforce renewal
SaaSIQ takes 20% = ₹4.8L
Customer still saves ₹19.2L = happy customer

Average company has 15-20 renewals/year
Average savings per negotiation: ₹5-15L
SaaSIQ revenue per customer: ₹15-60L/year (on TOP of subscription)
```

#### Why This Gets Customers
- **Zero risk for buyer:** "Only pay if we save you money"
- **Tangible ROI:** Not a dashboard — actual money saved
- **Word of mouth:** "SaaSIQ saved us ₹45L last quarter" → referrals

---

### Feature #3: India SaaS Price Benchmark Database
**Priority: HIGH | Effort: 6 weeks | Impact: Network effect + content marketing**

#### What It Is
The first **India-specific SaaS pricing benchmark database** — crowdsourced from SaaSIQ customers (anonymized).

#### What Users See
```
"You pay ₹24L/year for Salesforce Enterprise (200 seats)"
"Indian companies your size (201-500 employees) pay:"
  → Average: ₹16.2L/year
  → Median: ₹15.8L/year  
  → Best price: ₹12.4L/year
  → You're paying 48% MORE than average"
```

#### Why This Is Revolutionary
- **This data doesn't exist** for Indian companies. Everyone uses US benchmarks.
- **Network effect:** More customers = better benchmarks = more customers join
- Creates a **data moat** competitors can't replicate without Indian customers
- Free quarterly "India SaaS Spend Report" → media coverage → brand awareness

#### Content Marketing Goldmine
```
Publish freely:
- "2026 India SaaS Spend Report" (annual)
- "What Indian Companies Pay for Salesforce" (per-vendor reports)
- "SaaS Spending by Industry: IT Services vs. Fintech vs. D2C"
- "Average SaaS Cost per Employee in India: ₹12,000-18,000/month"
```

Every CTO/CFO in India will Google these → find SaaSIQ → become a lead.

---

### Feature #4: Shadow AI Governance Module
**Priority: HIGH | Effort: 3 weeks | Impact: Ride the AI panic wave**

#### What It Is
A dedicated module for discovering, monitoring, and controlling AI tool usage across the organization.

#### Why NOW
```
Every CISO in India right now:
- "How many employees are pasting code into ChatGPT?"
- "Is anyone using Claude/Gemini with company data?"
- "Are we compliant with DPDP when employees use US AI tools?"
- "How much are we spending on AI subscriptions?"

NOBODY has a good answer. SaaSIQ can be that answer.
```

#### What It Tracks

| AI Tool | Risk Tracked | Action |
|---------|-------------|--------|
| ChatGPT / OpenAI | Data sent to US servers, no DPA, PII exposure | Block / Upgrade to Enterprise |
| GitHub Copilot | Source code exposure, IP risk | Audit / Approve |
| Claude / Anthropic | Data retention policy, compliance status | Review |
| Midjourney | Copyright risk, brand asset exposure | Monitor |
| Gemini (Google) | Data used for training, DPDP compliance | Approve / Restrict |
| Notion AI | Document data processing, SOC2 status | Review |
| Jasper AI | Marketing content, brand voice risk | Monitor |

#### Unique Features No One Has
1. **AI Data Flow Map** — Visual showing what data flows into which AI tools
2. **Prompt Monitoring** (opt-in) — Detect when sensitive data (code, PII, financials) is pasted into AI tools
3. **AI Spend Tracker** — Total cost of all AI subscriptions across the org
4. **DPDP AI Compliance Score** — Specific to India's data protection requirements
5. **AI Tool Comparison** — "Your team uses 4 AI writing tools. Consolidate to 1 and save ₹3.2L/year"

#### Why This Gets Customers
- **Urgency:** AI governance is a board-level concern RIGHT NOW
- **No competition:** Zylo/Torii don't have a dedicated AI module
- **Premium pricing:** Companies will pay extra for AI governance
- **Media attention:** "India's first AI governance platform" → press coverage

---

### Feature #5: Employee SaaS Request Portal (App Store)
**Priority: MEDIUM | Effort: 4 weeks | Impact: Reduces shadow IT at source**

#### What It Is
Instead of blocking Shadow IT, give employees a **self-service portal** to:
- Browse approved tools by category
- Request new tools with business justification
- See alternatives ("You want Notion? We already have Confluence")
- Track approval status in real-time

#### Why This Gets Customers
- IT admins HATE being the "tool police" — this automates approvals
- Employees HATE being blocked — this gives them a path forward
- Creates a procurement workflow that finance teams love

---

### Feature #6: Slack/Teams Bot
**Priority: MEDIUM | Effort: 3 weeks | Impact: Daily engagement + virality**

#### What It Is
A bot that lives inside Slack/Teams and:
```
@saasiq how much do we spend on design tools?
→ "₹4.2L/month across Figma, Canva, Adobe. Figma is 60% of that with 26% utilization."

@saasiq approve Notion for marketing team
→ Creates approval request, notifies IT admin, tracks status

#saasiq-alerts (auto-posted):
→ "🚨 New Shadow IT: 3 employees signed up for Loom this week"
→ "📅 Reminder: GitHub Enterprise renews in 14 days (₹18.5L/yr)"
→ "💰 Weekly digest: ₹2.3L in new savings opportunities found"
```

#### Why This Gets Customers
- Users see value DAILY without logging into a dashboard
- Every Slack message is visible to the whole team → organic awareness
- IT admins become heroes when they share cost savings in team channels

---

### Feature #7: Contract Auto-Extraction (OCR + NLP)
**Priority: MEDIUM | Effort: 6 weeks | Impact: Premium enterprise feature**

Upload any SaaS contract PDF → AI extracts:
- Pricing and payment terms
- Renewal date and auto-renewal clause
- Termination notice period
- Data residency requirements
- SLA guarantees
- Price escalation caps
- **Flags unfavorable terms** with recommendations

---

### Feature #8: Vendor Risk Score API (B2B Data Product)
**Priority: MEDIUM | Effort: 4 weeks | Impact: New revenue stream**

Expose vendor risk scoring as a public API:
```
GET /api/v1/vendor-risk?vendor=chatgpt
→ {
    "vendor": "OpenAI ChatGPT",
    "risk_score": 92,
    "soc2": false,
    "gdpr": "partial",
    "dpdp": false,
    "data_residency": "US only",
    "recommendation": "High risk for Indian enterprises"
  }
```

Sell as: API access ($0.01/query) + embeddable widget for procurement portals.

---

### Feature #9: CFO Board-Ready Reports
**Priority: MEDIUM | Effort: 2 weeks | Impact: Enterprise deal closer**

One-click export of beautiful PDF/PPTX reports:
- Executive summary with YoY trends
- Department-wise spend waterfall charts
- Savings achieved vs. potential
- Compliance scorecard
- Benchmark comparison vs. industry peers

**Why:** CFOs present to boards. Give them slides, not dashboards.

---

### Feature #10: SaaS Stack Recommendations Engine
**Priority: LOW | Effort: 6 weeks | Impact: Becomes a buying advisor**

"Companies like yours (IT services, 500 employees) that switched from Jira to Linear saved 34% and improved team velocity by 22%."

AI recommends the OPTIMAL tool stack — not just what's being used, but what SHOULD be used.

---

### Feature #11: Predictive Churn Detection
**Priority: LOW | Effort: 4 weeks | Impact: Catches unauthorized migrations**

AI detects when teams abandon a tool (declining logins, API calls) and predicts which replacement they're switching to. Alerts procurement before they're paying for two tools.

---

### Feature #12: Multi-Entity / Subsidiary Management
**Priority: LOW | Effort: 8 weeks | Impact: Indian conglomerate deal closer**

Manage SaaS across 50+ subsidiaries from one console. Tata group, Reliance, Mahindra — each has dozens of entities buying SaaS independently. Solving this wins massive enterprise deals.

---

## 4. 30-Day Quick Wins (No Code Needed)

Things you can do THIS WEEK to start getting customers:

### Week 1: Create Demand

| Action | How | Expected Result |
|--------|-----|----------------|
| **Write "India SaaS Waste Report" blog post** | Use public data + your product knowledge. Publish on LinkedIn, Medium, your blog | 2,000–5,000 views. Positions SaaSIQ as thought leader |
| **Post daily on LinkedIn** | Share SaaS waste stats, tips, industry news. Tag Indian CIOs/CFOs | Build personal brand → leads in 30 days |
| **Create a free SaaS audit checklist (PDF)** | "10-Point SaaS Governance Checklist for Indian Enterprises" — gate behind email | 50–100 email leads in first month |
| **Join 5 Indian CIO/CTO WhatsApp/Slack groups** | Share insights (not product pitches). Be helpful first | Direct conversations with potential buyers |

### Week 2: Direct Outreach

| Action | How | Expected Result |
|--------|-----|----------------|
| **Cold email 50 IT managers at Indian mid-market companies** | Template: "We analyzed public data and estimate [Company] spends ₹X on SaaS with ~30% waste. Want a free audit?" | 5–10 responses (10-20% reply rate) |
| **Offer 5 free SaaS audits** | Manual audit using LinkedIn + public data. Deliver a PDF report showing estimated waste | 2–3 convert to paid pilots |
| **Connect with procurement consultants** | They advise companies on vendor management — become their recommended tool | Referral channel |

### Week 3: Build Credibility

| Action | How | Expected Result |
|--------|-----|----------------|
| **Get 3 beta customers (free)** | Offer 3-month free access in exchange for: case study, testimonial, logo rights | Real social proof for website |
| **Create a comparison page** | "SaaSIQ vs Zylo vs Zluri vs Torii" — honest comparison highlighting India-specific features | SEO traffic for comparison searches |
| **Publish pricing in INR** | ₹250/employee/month, not $3. Show GST-inclusive pricing | Removes friction for Indian buyers |

### Week 4: Automate Lead Generation

| Action | How | Expected Result |
|--------|-----|----------------|
| **Launch the free Spend Scanner** (even a basic version) | Even a simple form → PDF report is better than nothing | Automated lead generation |
| **Set up LinkedIn ads** | Target: "IT Manager" + "India" + company size 200-5000 | 500 clicks/week at ₹50/click |
| **Create a webinar** | "How Indian Companies Waste ₹2Cr+ on SaaS (and How to Fix It)" | 50-100 registrations → 10 qualified leads |

---

## 5. Go-To-Market Playbook for India

### Target Segments (In Order of Priority)

#### Segment 1: Indian IT Services (TCS, Infosys, Wipro, HCL, Tech Mahindra, and 500+ mid-tier firms)

| Why Target Them | How to Reach Them |
|----------------|------------------|
| 50,000-500,000 employees each | NASSCOM events, CIO forums |
| Massive SaaS sprawl (1000+ tools) | Case study: "How an IT services firm saved ₹3Cr in 6 months" |
| Compliance pressure (ISO 27001, SOC2, client audits) | Lead with compliance angle |
| Centralized IT decision-making | Target CIO/CISO directly |

#### Segment 2: Indian Startups (Series B+ with 200-2000 employees)

| Why Target Them | How to Reach Them |
|----------------|------------------|
| Fastest SaaS adoption rate | YC India, Accel, Sequoia portfolio companies |
| No governance yet — Shadow IT is rampant | LinkedIn outreach to CTOs |
| Cost-conscious after 2023-2025 funding winter | Lead with savings angle |
| Quick decision-making (1-2 week sales cycle) | Product-led growth works here |

#### Segment 3: Indian Banks & Financial Services

| Why Target Them | How to Reach Them |
|----------------|------------------|
| Heaviest compliance requirements (RBI guidelines) | Lead with DPDP + compliance |
| 10,000-100,000 employees per bank | Banking technology conferences |
| Already spend ₹100Cr+ on SaaS | ROI is massive |
| Long sales cycle but HUGE deal sizes | Need enterprise sales team |

### Positioning for India

**DON'T say:** "SaaS Management Platform"  
**DO say:** "India's AI-Powered SaaS Cost Intelligence — Save 30% on Your SaaS Budget in 90 Days"

**DON'T say:** "Shadow IT Discovery"  
**DO say:** "Find every unapproved tool your employees are using — before DPDP auditors do"

**DON'T say:** "Contract Management"  
**DO say:** "Never overpay on a SaaS renewal again — our AI negotiates for you"

---

## 6. Pricing Strategy Overhaul

### Current Problem
Your pricing ($3/$7/custom) looks like a Western SaaS product. Indian buyers think differently.

### New Pricing (India-First)

| Plan | Price | Target | Key Hook |
|------|-------|--------|----------|
| **Free Scanner** | ₹0 forever | Anyone | Upload CSV → get spend report. No signup. |
| **Starter** | ₹199/employee/month | SMBs (50-200 employees) | Discovery + basic spend analytics |
| **Growth** | ₹499/employee/month | Mid-market (200-1000) | Full platform + AI insights + 2 free negotiations/quarter |
| **Enterprise** | Custom (₹3L-10L/month flat) | 1000+ employees | Everything + unlimited negotiations + dedicated CSM + on-prem option |
| **Negotiation-as-a-Service** | 20% of savings | Any size | Pay only when we save you money |

### Why This Works for India

| Change | Reasoning |
|--------|-----------|
| **INR pricing** | Removes mental currency conversion. ₹199 feels cheap. $3 feels foreign. |
| **Free tier** | Indian buyers want to "try before buy" more than US buyers |
| **Flat enterprise pricing** | Indian enterprises hate per-employee pricing — headcount changes monthly |
| **Success-fee model** | "Only pay if we save you money" removes ALL purchasing risk |
| **GST-inclusive** | Show final price. Don't surprise buyers with +18% GST at checkout |

---

## 7. Content & SEO Strategy

### High-Intent Keywords to Target

| Keyword | Monthly Searches (India) | Difficulty | Content to Create |
|---------|------------------------|------------|------------------|
| "SaaS management tool India" | 500 | Low | Landing page + comparison |
| "shadow IT discovery" | 1,200 | Medium | Blog: "How to Find Shadow IT in Your Organization" |
| "SaaS spend optimization" | 800 | Medium | Guide: "Complete Guide to Reducing SaaS Costs" |
| "DPDP compliance SaaS" | 300 | Low | Page: "DPDP Act 2023: SaaS Compliance Checklist" |
| "software license management India" | 1,500 | Medium | Blog: "Why Indian Companies Waste ₹2Cr on Unused Licenses" |
| "Zylo alternative India" | 200 | Low | Comparison page |
| "SaaS audit template" | 600 | Low | Free downloadable template (lead magnet) |
| "ChatGPT enterprise security risk" | 2,000 | Low | Blog → leads straight into Shadow AI module |

### Content Calendar (Monthly)

| Week | Content Type | Topic | Distribution |
|------|-------------|-------|-------------|
| Week 1 | Blog post | SaaS waste statistics for Indian market | LinkedIn, Medium, SEO |
| Week 2 | Free tool/template | SaaS audit checklist PDF | Gated download → email capture |
| Week 3 | Case study | "How [Company] saved ₹X with SaaSIQ" | LinkedIn, email nurture |
| Week 4 | Webinar | Industry-specific topic | LinkedIn events, email list |

### LinkedIn Strategy (Founder-Led Growth)

Post 5x/week. Content types:
1. **Data posts:** "We analyzed 50 Indian companies. Average SaaS waste: 34%."
2. **Hot takes:** "Your IT team doesn't have a Shadow IT problem. They have an approval process problem."
3. **Behind-the-scenes:** "We just built [feature]. Here's why."
4. **Customer stories:** "Company X found 47 shadow apps in their first scan."
5. **Industry news:** Comment on DPDP updates, AI regulations, SaaS market trends.

---

## 8. Partnership & Channel Strategy

### Strategic Partnerships

| Partner Type | Example Companies | Value Exchange |
|-------------|------------------|---------------|
| **IT Consulting Firms** | Deloitte India, KPMG, EY, PwC | They recommend SaaSIQ to clients during IT audits. You pay 15-20% referral fee |
| **Cloud Partners** | AWS Partner Network, Google Cloud Partner | Co-sell with cloud providers. They want customers to optimize non-cloud SaaS spend |
| **Procurement Platforms** | SAP Ariba, Coupa (India) | Integration partnership. Their users need SaaS-specific visibility |
| **CIO Communities** | NASSCOM, iSPIRT, CIO Club India | Sponsor events, speak at conferences, contribute to reports |
| **Accounting Firms** | Small/mid-tier CA firms | They audit SaaS expenses. Recommend SaaSIQ as a tool |

### Integration Partnerships (Build Connections With)

| Tool | Why | Integration |
|------|-----|------------|
| **Zoho** | 80M+ users, massive in India | "SaaSIQ for Zoho" marketplace app |
| **Razorpay** | Can detect SaaS payments from transaction data | Data source integration |
| **Freshworks** | Indian SaaS leader, shared customer base | Co-marketing, integration |
| **Tally** | India's #1 accounting software | Import SaaS expenses directly from Tally |
| **Slack/Teams** | Where decisions happen | Bot integration (Feature #6) |

---

## 9. Metrics to Track

### North Star Metric
**Monthly Recurring Revenue (MRR)** — but track the leading indicators below:

### Weekly Dashboard

| Metric | Target (Month 1) | Target (Month 3) | Target (Month 6) |
|--------|-----------------|-----------------|-----------------|
| Website visitors | 2,000 | 10,000 | 30,000 |
| Free Scanner uses | 100 | 1,000 | 5,000 |
| Email leads captured | 50 | 500 | 2,000 |
| Demo requests | 5 | 30 | 100 |
| Free trial signups | 10 | 50 | 200 |
| Paid conversions | 1 | 10 | 40 |
| MRR | ₹50K | ₹5L | ₹25L |
| NPS score | — | 40+ | 50+ |

### Funnel Conversion Targets

```
Visitor → Scanner Use:     10%
Scanner → Email Capture:    40%
Email → Demo Request:       10%
Demo → Trial:               50%
Trial → Paid:               25%

Overall: Visitor → Paid = 0.5%
Need 20,000 visitors/month for 100 customers
```

---

## 10. 90-Day Execution Calendar

### Days 1-7: Foundation

- [ ] Switch all pricing to INR on landing page
- [ ] Add "Free SaaS Audit" CTA above the fold
- [ ] Write first 3 LinkedIn posts (publish Mon/Wed/Fri)
- [ ] Create SaaS audit checklist PDF (lead magnet)
- [ ] Set up email capture (Mailchimp/Brevo for India)
- [ ] Join 5 CIO/CTO communities (LinkedIn groups, WhatsApp)

### Days 8-14: Free Scanner MVP

- [ ] Build CSV upload parser (recognize 200+ SaaS vendor names)
- [ ] Build basic spend categorization engine
- [ ] Create PDF report template
- [ ] Launch at `saasiq.com/scanner`
- [ ] Share on LinkedIn, Twitter, Product Hunt

### Days 15-21: Content Machine

- [ ] Publish "India SaaS Waste Report 2026" blog post
- [ ] Create "SaaSIQ vs Competitors" comparison page
- [ ] Cold email 50 IT managers with personalized spend estimates
- [ ] Host first webinar: "How to Cut SaaS Spend by 30%"

### Days 22-30: First Customers

- [ ] Offer 5 free 90-day pilots to mid-market companies
- [ ] Start building Shadow AI Governance module
- [ ] Set up basic LinkedIn ads (₹25K/month budget)
- [ ] Get first 3 testimonials from pilot customers

### Days 31-60: Scale What Works

- [ ] Launch Shadow AI Governance module
- [ ] Add Google Workspace quick-scan to free scanner
- [ ] Ship Slack bot MVP
- [ ] Publish 4 more blog posts (weekly cadence)
- [ ] Present at 1 industry event/meetup
- [ ] Grow to 10 pilot customers
- [ ] First 2-3 paid conversions

### Days 61-90: Revenue Engine

- [ ] Launch AI Negotiation-as-a-Service (beta)
- [ ] Publish first benchmark data from pilot customers
- [ ] Build referral program (₹10K credit per referral)
- [ ] Ship CFO board-ready reports
- [ ] Target: 10 paying customers, ₹5L MRR

---

## Summary: The Minimum Viable Growth Stack

If you can only do 5 things, do these:

| # | Action | Timeline | Why |
|---|--------|----------|-----|
| 1 | **Build Free SaaS Spend Scanner** | 2 weeks | Generates leads on autopilot |
| 2 | **Build Shadow AI Governance module** | 3 weeks | Timely, no competition, premium pricing |
| 3 | **Post on LinkedIn 5x/week** | Start today | Free, builds authority, generates inbound |
| 4 | **Switch to INR pricing + success-fee model** | 1 day | Removes all purchase friction for Indian buyers |
| 5 | **Offer 5 free pilots → get testimonials** | 2 weeks | Real social proof beats fake logos |

---

> **Bottom line:** You don't have a product problem — you have a **distribution problem**. The dashboard is solid. Now you need to get it in front of the right people with the right hook. The Free Scanner + LinkedIn content + India-first pricing will get you your first 100 customers.
