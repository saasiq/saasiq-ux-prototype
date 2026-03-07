# SaaSIQ — Dashboard E2E Deep Dive

> A theoretical end-to-end breakdown of every dashboard in SaaSIQ: **why it exists**, **what problem it solves**, and **how it solves it**.

---

## Table of Contents

1. [Dashboard Home](#1-dashboard-home)
2. [SaaS Discovery & Shadow IT](#2-saas-discovery--shadow-it)
3. [Spend Intelligence](#3-spend-intelligence)
4. [Usage Analytics](#4-usage-analytics)
5. [Compliance & Risk](#5-compliance--risk)
6. [Contract Management](#6-contract-management)
7. [Policy Engine](#7-policy-engine)
8. [AI Insights](#8-ai-insights)
9. [AI Copilot](#9-ai-copilot)
10. [Alerts & Notifications](#10-alerts--notifications)
11. [Offboarding Console](#11-offboarding-console)
12. [Smart Renewal Engine](#12-smart-renewal-engine)
13. [Industry Benchmarks](#13-industry-benchmarks)
14. [Department Cost Allocation](#14-department-cost-allocation)
15. [Settings](#15-settings)

---

## 1. Dashboard Home

### Why It's Needed
Every SaaS management platform needs a single pane of glass — a command centre that gives decision-makers an instant pulse on their entire SaaS portfolio without drilling into individual modules. Without this, IT leaders spend 20–30 minutes each morning piecing together data from 5+ screens just to understand "are we in good shape today?"

### The Problem It Solves
- **Information fragmentation**: Spend, usage, risk, and renewal data are scattered across different tools (finance sheets, HR systems, vendor portals). No one has a unified view.
- **Delayed decision-making**: By the time a CIO discovers a spend anomaly or a compliance gap, the damage (financial or security) has already occurred.
- **Metric overload**: Teams drown in data but lack actionable context — they see numbers but don't know what to prioritize.

### How It Solves It
- **KPI Cards (4 hero metrics)**: Total SaaS Spend, Active Apps, Active Users, and Potential Savings are displayed front-and-centre with month-over-month trend arrows. These four numbers answer: "How much are we spending? On how many apps? Are people using them? How much can we save?"
- **Spend Trend Chart**: A visual timeline showing monthly spend trajectory — instantly reveals if costs are rising, stable, or dropping. Clickable periods let you zoom into anomalies.
- **Top Apps by Spend**: A ranked list of the most expensive tools, so leadership immediately knows where the budget is concentrated.
- **Renewal Timeline**: Upcoming renewals in the next 30/60/90 days are surfaced — no more surprise auto-renewals that lock you into unfavourable contracts.
- **Quick Action Buttons**: One-click access to run a SaaS scan, export reports, or jump to AI recommendations.

**End-to-End Flow**: User lands on Dashboard → scans KPIs for anomalies → notices spend is up 12% → clicks into Spend Trend → identifies AWS cost spike → navigates to Spend Intelligence for deeper analysis → takes action.

---

## 2. SaaS Discovery & Shadow IT

### Why It's Needed
The average mid-size company uses 200–400 SaaS apps, but IT typically knows about only 30–40% of them. The remaining 60–70% are "shadow IT" — apps adopted by employees without IT's knowledge or approval. These apps create uncontrolled spend, security vulnerabilities, and compliance blind spots.

### The Problem It Solves
- **Invisible SaaS sprawl**: Employees sign up for tools using company emails, personal cards, or free tiers. IT has zero visibility into these apps. You can't manage what you can't see.
- **Security & data leakage**: Unapproved apps (like AI tools, file-sharing services) may not meet enterprise security standards — no SOC 2, no DPA, no SSO. Sensitive company data flows into unknown systems.
- **Duplicate tools**: Different teams independently adopt overlapping apps (e.g., Jira + Asana + Monday.com for project management), tripling costs for the same functionality.
- **Compliance violations**: Unvetted apps may violate GDPR, HIPAA, or internal data governance policies without anyone realising it.

### How It Solves It
- **Automated Network Scanning**: SaaSIQ monitors SSO logs, browser extensions, email receipts, OAuth tokens, and API integrations to discover every SaaS app in use — including free tiers and personal signups.
- **Shadow IT Classification**: Every discovered app is auto-classified as Managed (IT-approved), Shadow IT (unapproved), or Under Review. A red warning badge immediately flags unknown apps.
- **Risk Scoring**: Each app gets a risk score based on: security posture (SOC 2, ISO 27001), data residency, user count, and data sensitivity. High-risk shadow apps surface at the top.
- **One-Click Actions**: For each discovered app, IT can Approve (add to managed stack), Block (restrict access + notify users), or Investigate (drill into usage details).
- **Duplicate Detection**: AI identifies functional overlaps (e.g., "You have 3 project management tools — consolidating to one saves ₹8.4L/yr").

**End-to-End Flow**: SaaSIQ runs weekly automated scans → discovers ChatGPT used by 56 employees → classifies it as Shadow IT with High risk (no DPA, data leakage risk) → alerts IT admin → admin clicks "Block App" → 56 users notified → app blocked at SSO level → data leakage prevented.

---

## 3. Spend Intelligence

### Why It's Needed
SaaS spend is the second-largest IT budget line (after headcount) in most companies, yet 30–40% of it is wasted on unused licenses, redundant tools, or unoptimised plans. Finance and IT teams need more than just a spreadsheet of invoices — they need intelligent analysis that turns raw spend data into savings opportunities.

### The Problem It Solves
- **No spend visibility**: Invoices are scattered across vendor portals, email receipts, credit card statements, and procurement systems. No single view of total SaaS expenditure.
- **Undetected waste**: Companies pay for licenses that no one uses, premium tiers when basic would suffice, or annual contracts for tools that teams abandoned months ago.
- **Budget unpredictability**: Without trend analysis and forecasting, CFOs can't plan SaaS budgets accurately. Surprise cost spikes (from auto-renewals, usage-based pricing overages) blow through budget guardrails.
- **No cost accountability**: When spend isn't attributed to departments, teams have no incentive to optimise. Engineering keeps 68 apps because "it's not coming from our budget."

### How It Solves It
- **Total Spend Dashboard**: One number — your total SaaS spend — with monthly trend, year-over-year comparison, and budget vs. actual variance.
- **App-Level Cost Breakdown**: Every app ranked by cost, showing: annual/monthly cost, cost per user, license utilisation %, and waste amount.
- **AI-Powered Savings Recommendations**: SaaSIQ analyses usage patterns and suggests: "Downgrade 35 Figma Pro licenses to Free (only Viewer access used) — saves ₹7.6L/yr", "Consolidate Jira + Asana into one tool — saves ₹4.2L/yr."
- **Spend Categories & Tags**: Costs auto-categorised by type (Collaboration, Dev Tools, Security, Marketing, etc.) so you see which categories are growing fastest.
- **Anomaly Detection**: AI flags unusual spend jumps (e.g., AWS bill spiked 47% month-over-month) and proactively surfaces them before they become budget crises.

**End-to-End Flow**: CFO asks "Why is our SaaS spend up 12% this quarter?" → opens Spend Intelligence → sees AWS (+47%), Salesforce (+15%) are the drivers → drills into AWS → finds unused EC2 instances from a terminated project → terminates instances → ₹85K/month saved automatically.

---

## 4. Usage Analytics

### Why It's Needed
Paying for SaaS is one thing; knowing whether people actually use it is another. Industry data shows that 40–60% of SaaS licenses go unused or underused. Usage Analytics answers the fundamental question: "Are our people getting value from the tools we're paying for?"

### The Problem It Solves
- **License waste**: Companies pay for 100 Figma seats but only 47 people logged in this month. That's 53 wasted licenses.
- **Adoption failure**: A team rolls out a new tool (e.g., Monday.com) but adoption flatlines at 30% after the first month. Without usage data, no one notices until renewal time.
- **No department accountability**: IT doesn't know which teams are heavy users vs. which teams have hundreds of dormant accounts.
- **Renewal risk**: Without usage data, you can't negotiate renewals — vendors say "you need 200 seats" when only 120 are active.

### How It Solves It
- **App Usage Heatmap**: A visual grid showing login frequency across all apps — hot (daily use) to cold (unused in 90+ days). Instantly spot dormant apps.
- **License Utilisation Table**: For each app: total licenses, active users, last login date, feature usage depth. A "Used" vs. "Paid" ratio highlights waste.
- **Department Adoption Cards**: Each department card shows: Adoption % (what fraction of assigned users are active), Active Users count (e.g., 119/142), and Avg Logins/Week — pure behavioural metrics with no cost data (cost data lives in Department Cost Allocation).
- **Department Leaderboard**: Ranks departments by adoption rate — Engineering at 84% vs. Design at 48%. Creates healthy competition and accountability.
- **Trend Over Time**: Monthly adoption trends per team — is Engineering's usage climbing or declining? Did the onboarding push for Sales actually work?
- **Inactive User Alerts**: Automatically flags users who haven't logged into assigned apps in 30/60/90 days — candidates for license reclamation.

**End-to-End Flow**: IT admin opens Usage Analytics → sees Design & Product at 48% adoption → drills in → 18 of 34 users haven't touched Figma in 60 days → reclaims 18 licenses before renewal → saves ₹5.4L/yr → sends adoption nudge to remaining underusers.

---

## 5. Compliance & Risk

### Why It's Needed
Every SaaS app your company uses handles some form of corporate or customer data. If those apps don't meet security and regulatory standards, your company is exposed to data breaches, regulatory fines (GDPR fines can reach €20M or 4% of global revenue), and contractual liability. Yet most IT teams have zero visibility into the compliance posture of their SaaS portfolio.

### The Problem It Solves
- **Unknown security posture**: Does your CRM vendor have SOC 2 Type II? Is your file-sharing app GDPR-compliant? Most IT teams can't answer these questions for more than half their app stack.
- **Compliance gaps**: Regulatory requirements (GDPR, HIPAA, PCI-DSS, ISO 27001) demand that all data processors meet specific standards. Shadow IT and unapproved apps create hidden compliance violations.
- **Third-party risk**: A vendor data breach can expose your data. Without continuous monitoring, you won't know until it's in the news.
- **Audit readiness**: When auditors ask "show me the compliance status of every tool handling customer data," teams scramble for weeks to compile the information.

### How It Solves It
- **Compliance Score**: A single aggregate score (e.g., 78/100) that quantifies your portfolio's compliance health. Colour-coded (green/amber/red) for instant interpretation.
- **Per-App Compliance Matrix**: For each app: SOC 2 (✓/✗), GDPR (✓/✗), HIPAA (✓/✗), ISO 27001 (✓/✗), Data Residency (country), DPA Status (signed/pending/missing), SSO Enabled (✓/✗).
- **Risk Heatmap**: A visual risk matrix plotting apps by data sensitivity (x-axis) vs. security posture (y-axis). High-sensitivity + low-security apps = immediate action required.
- **Critical Alerts**: Proactive alerts when: a vendor's SOC 2 certification expires, a data breach is reported for a vendor in your stack, or an app's privacy policy changes.
- **Audit Export**: One-click export of your complete compliance matrix in PDF/CSV format — audit-ready in seconds instead of weeks.

**End-to-End Flow**: Compliance officer runs quarterly audit → Compliance Dashboard shows score dropped from 82 to 78 → clicks "Non-Compliant Apps" filter → sees 4 apps missing SOC 2 → 2 are Shadow IT (added by employees) → blocks one, initiates vendor review for the other → score returns to 84 → exports PDF for auditor.

---

## 6. Contract Management

### Why It's Needed
SaaS contracts are not "sign and forget" documents. They contain renewal dates, auto-renewal clauses, pricing terms, termination notice periods, and usage caps. Missing a 30-day cancellation window on a ₹24L/yr contract means you're locked in for another year — even if you're not using the tool. Companies lose an estimated 5–15% of their SaaS budget to poor contract management.

### The Problem It Solves
- **Auto-renewal traps**: 70% of SaaS contracts auto-renew. If you miss the cancellation window (typically 30–90 days before renewal), you're locked in.
- **Contract sprawl**: Contracts are buried in email inboxes, shared drives, and individual vendor portals. No centralised repository.
- **Unfavourable terms**: Without visibility into contract details, you can't identify renegotiation opportunities (e.g., you're paying per-seat but usage-based pricing would be 40% cheaper).
- **No renewal strategy**: Teams negotiate renewals reactively (vendor sends invoice → panic → pay full price) instead of proactively (start negotiations 90 days before with usage data and benchmarks).

### How It Solves It
- **Centralised Contract Repository**: Every SaaS contract stored in one place with metadata: vendor, start date, end date, auto-renewal (yes/no), notice period, contract value, payment terms, owner.
- **Renewal Calendar**: A visual timeline of all upcoming renewals in the next 30/60/90/180 days. Colour-coded by urgency and value.
- **Auto-Renewal Alerts**: Automatic reminders sent at 90, 60, and 30 days before renewal. Flags contracts with auto-renew enabled for review.
- **Contract Analytics**: Price per user trends, year-over-year cost changes, contract-to-usage alignment (are you contracted for 200 seats but only using 120?).
- **Negotiation Prep**: Before each renewal, SaaSIQ generates a briefing: current usage vs. contracted capacity, benchmark pricing from similar companies, recommended negotiation strategy.

**End-to-End Flow**: Renewal Engine flags "Salesforce renewal in 7 days, auto-renew enabled, ₹24L/yr" → IT clicks "Review Contract" → sees only 66% of licenses are active → opens Benchmarks → sees they're paying 22% above industry average → contacts Salesforce rep with data → negotiates 15% discount + right-sized seats → saves ₹6.8L/yr.

---

## 7. Policy Engine

### Why It's Needed
Reactive SaaS management (discover problem → fix it) doesn't scale. Companies need proactive governance — automated rules that enforce standards before problems occur. The Policy Engine is SaaSIQ's "autopilot for SaaS governance." Without it, IT teams are playing whack-a-mole with an ever-growing app stack.

### The Problem It Solves
- **Manual governance doesn't scale**: With 200+ apps and 500+ users, IT can't manually review every new app signup, every license assignment, or every compliance gap.
- **Inconsistent enforcement**: Different IT admins apply different standards. One approves an app without SSO; another would have blocked it. No consistency.
- **Delayed response**: By the time a human spots a policy violation (e.g., an app without a DPA handling customer data), the violation has been active for weeks.
- **Knowledge dependency**: Governance rules live in people's heads — when an admin leaves, institutional knowledge walks out the door.

### How It Solves It
- **Pre-Built Policy Templates**: Ready-made policies for common scenarios: "Block any app without SOC 2", "Alert when any user hasn't logged into an app in 60 days", "Require manager approval for any app over ₹1L/yr."
- **Custom Policy Builder**: Drag-and-drop rule builder: IF [condition] THEN [action]. Conditions: app category, cost, compliance status, user department, usage level. Actions: block, alert, require approval, auto-deprovision.
- **Automated Enforcement**: Policies run continuously. When a condition is met, the action triggers automatically — no human intervention needed.
- **Policy Audit Trail**: Every policy action is logged: what was triggered, when, by which policy, and what action was taken. Full traceability for auditors.
- **Exception Management**: When a policy blocks something, the affected user can request an exception. Exception goes through approval workflow with business justification.

**End-to-End Flow**: IT sets policy: "Any new SaaS app discovered without SOC 2 → auto-block + notify IT" → SaaSIQ discovers employee signed up for a new AI transcription tool → checks compliance → no SOC 2 → auto-blocks → notifies IT admin → admin reviews → either approves exception (with conditions) or confirms block → zero human effort for detection + response.

---

## 8. AI Insights

### Why It's Needed
Data without interpretation is just noise. IT teams have terabytes of SaaS telemetry — logins, spend, contracts, compliance — but extracting actionable insights from this data requires analytics expertise that most IT teams don't have. AI Insights transforms raw data into prioritised, actionable recommendations with estimated financial impact.

### The Problem It Solves
- **Data overload**: SaaSIQ collects thousands of data points daily. No human can process all of it to find the 5 things that matter most.
- **Missed optimisation opportunities**: Patterns that indicate waste (like seasonal usage dips, feature adoption gaps, or duplicate tool usage) are invisible without AI analysis.
- **Lack of prioritisation**: Even when issues are identified, teams don't know which to tackle first. Is it more impactful to renegotiate Salesforce or consolidate project management tools?
- **Reactive vs. proactive**: Teams fix problems after they become expensive. AI should predict issues before they hit the bottom line.

### How It Solves It
- **Prioritised Recommendation Cards**: AI generates a ranked list of recommendations, each with: description, estimated savings (₹), confidence level (%), effort required (Low/Med/High), and one-click action button.
- **Savings Waterfall**: A visual chart showing cumulative savings if all recommendations are implemented — e.g., "₹42.6L/yr total savings available."
- **Category Breakdown**: Recommendations grouped by type: License Optimisation, Plan Downgrade, Tool Consolidation, Contract Renegotiation, Shadow IT Resolution.
- **Trend Predictions**: AI forecasts future spend based on current growth rates: "At current trajectory, SaaS spend will reach ₹2.3Cr by Q4 — 18% over budget."
- **Impact Tracking**: Once a recommendation is acted on, AI tracks the actual savings achieved vs. predicted — building trust in the system over time.

**End-to-End Flow**: AI analyses 90 days of data → generates top 10 recommendations → #1: "Downgrade 35 Figma Pro to Free — saves ₹7.6L/yr (High confidence, Low effort)" → IT clicks "Apply" → Figma licenses auto-adjusted → ₹7.6L/yr saved → AI tracks actual savings over next quarter → confirms ₹7.2L actually saved (95% accuracy) → builds credibility for future recommendations.

---

## 9. AI Copilot

### Why It's Needed
Not everyone in the organisation is a data analyst. Sales directors, HR managers, and CFOs all need SaaS intelligence but shouldn't have to learn a complex dashboard tool. The AI Copilot provides a natural language interface — ask a question in plain English (or Hindi) and get an instant, contextual answer drawn from your actual SaaS data.

### The Problem It Solves
- **Dashboard complexity**: 15 dashboards with dozens of metrics each. Non-technical stakeholders get lost.
- **Slow information retrieval**: "What's our Salesforce cost per user?" — to answer this, you'd need to navigate to Spend Intelligence → find Salesforce → divide total cost by user count. That's 4 clicks and mental math.
- **Cross-module questions**: "Which departments are overspending on underutilised tools?" requires simultaneously checking Usage Analytics AND Spend Intelligence AND Department Costs. No single dashboard answers this.
- **Friction reduces adoption**: If getting an answer is hard, people stop asking questions — and uninformed decisions follow.

### How It Solves It
- **Conversational Interface**: A chat-style UI where users type questions in natural language: "What's our most wasted SaaS app?", "Show me all contracts expiring this month", "Which team has the lowest adoption rate?"
- **Context-Aware Responses**: The copilot understands your SaaS data context. It doesn't give generic answers — it queries your actual spend, usage, and contract data.
- **Cross-Module Synthesis**: It can pull data from multiple dashboards in a single response: "Engineering spends ₹82.4L/quarter across 68 apps, with 84% adoption. Top waste: ₹11.2L in unused licenses, primarily AWS (₹5.4L) and Datadog (₹3.1L)."
- **Suggested Questions**: Pre-built prompts for common queries — users can click instead of type.
- **Action Triggers**: The copilot can not only answer questions but also initiate actions: "Reclaim all unused Figma licenses" → confirms → executes.

**End-to-End Flow**: CFO types "Why is our SaaS spend up this quarter?" → Copilot responds: "Total SaaS spend increased 12% (₹1.66Cr → ₹1.86Cr). Primary drivers: AWS (+47%, ₹85K new monthly), Salesforce renewal (+15%). Recommendation: Terminate unused AWS instances (₹5.4L/yr saving) and renegotiate Salesforce before Mar 12 renewal." → CFO forwards to IT → action taken in 2 minutes instead of 2 meetings.

---

## 10. Alerts & Notifications

### Why It's Needed
Dashboards require you to proactively look at them. Alerts bring the dashboards to you — they push critical information to stakeholders in real time, ensuring nothing falls through the cracks. In a fast-moving SaaS environment where contracts auto-renew, shadow apps appear daily, and spend anomalies happen overnight, passive monitoring isn't enough.

### The Problem It Solves
- **Missed critical events**: A contract auto-renews because no one checked the renewal calendar. A shadow app goes undetected for months. A spend anomaly goes unnoticed until the quarterly budget review.
- **Alert fatigue (in other tools)**: Generic alerting systems send too many notifications with no prioritisation. Everything feels urgent → nothing feels urgent.
- **No contextual actions**: Traditional alerts say "something happened" but don't tell you what to do about it. Users get a notification, then have to figure out the next step themselves.
- **Siloed notifications**: Spend alerts go to finance, security alerts go to IT, compliance alerts go to legal — no unified view.

### How It Solves It
- **Unified Alert Feed**: All alerts — spend, security, compliance, renewals, usage — in a single, filterable feed.
- **Severity Classification**: Alerts are auto-classified as Critical (immediate action needed), Warning (review soon), or Info (awareness only). Visual colour coding (red/amber/blue) for instant triage.
- **Inline Actions**: Every alert comes with contextual action buttons. "Salesforce renewal in 7 days" → [Review Contract] [Snooze]. "Shadow IT detected: ChatGPT on 56 accounts" → [Block App] [Investigate]. No need to navigate elsewhere.
- **Smart Snooze**: Snooze an alert for 1 hour, 4 hours, 1 day, or 1 week. Snoozed alerts come back automatically — they don't disappear.
- **Read/Unread State**: Unread alerts show a blue dot. Bulk "Mark All as Read" for inbox-zero experience.
- **Filter by Type**: Toggle between All, Critical, Warning, and Info tabs to focus on what matters right now.

**End-to-End Flow**: SaaSIQ detects Salesforce renewal in 7 days with auto-renew enabled and 34% unused licenses → generates Critical alert → IT admin sees red alert with "Review Contract" button → clicks it → navigates to Renewal Engine → reviews usage data → contacts vendor → cancels auto-renew → renegotiates → ₹6.8L saved → alert auto-resolves.

---

## 11. Offboarding Console

### Why It's Needed
When an employee leaves a company, their SaaS access should be revoked immediately. In reality, studies show that 50% of ex-employees retain access to at least one corporate SaaS app after departure. This creates a dual problem: security risk (ex-employees can access sensitive data) and financial waste (you're paying for licenses no one is using).

### The Problem It Solves
- **Lingering access**: HR marks an employee as "departed" in the HRMS, but IT doesn't get notified — or gets notified but manually deprovisioning 20+ apps takes days.
- **Security exposure**: A disgruntled ex-employee with active Salesforce access could export your entire customer database. An ex-engineer with GitHub access could access proprietary source code.
- **License cost leakage**: Every departed employee represents 10–30 SaaS licenses that continue to be billed monthly. For a company with 500 employees and 10% annual attrition, that's 50 people × 15 average apps × ₹500/app/month = ₹4.5L/month wasted.
- **No centralized view**: IT has no single place to see: "Who has left? When? What apps do they still have? What's the security risk?"

### How It Solves It
- **HRMS Sync**: One-click "Sync HR Data" pulls the latest employee status from your HRMS (Darwinbox, BambooHR, etc.). Automatically detects departures.
- **Pending Offboards Dashboard**: A clear table of all departed employees who still have active SaaS access, showing: employee name, departure date, days since departure, number of active apps, and risk level (Critical/High/Medium/Low based on days elapsed + data sensitivity).
- **One-Click Revoke**: Per-employee "Revoke All" button that disables all SaaS access in a single click — across all connected apps via API/SSO.
- **Bulk Revoke**: "Revoke All Pending" button for mass offboarding — processes all departed employees simultaneously.
- **Offboard Wizard**: A guided flow for planned departures: search employee → set departure date → choose scope (immediate/selective/scheduled) → enable data transfer to manager → confirm.
- **KPI Cards**: 4 metrics at a glance: Pending Offboards (how many need action), Completed This Quarter (throughput), Licenses Recovered (₹ saved), Security Incidents (from ex-employees — should be zero).
- **Audit Trail**: Every offboarding action is logged: who was offboarded, when, by whom, which apps were revoked — complete compliance trail.

**End-to-End Flow**: HR terminates Vikram Kumar on Jun 15 → SaaSIQ syncs with HRMS → detects departure → shows Vikram in Pending Offboards with 23 active apps, Risk: Critical (265 days!) → IT clicks "Revoke All" → all 23 apps deprovisioned in <60 seconds → Vikram moves to "Completed" → license cost saved: ₹1.8L/yr → zero security exposure.

---

## 12. Smart Renewal Engine

### Why It's Needed
SaaS renewals are one of the highest-impact financial events in a company's IT lifecycle. A single poorly handled renewal (auto-renewed at full price, wrong seat count, unfavourable terms) can waste lakhs of rupees. Yet most companies manage renewals reactively — the invoice arrives, and they pay it. The Smart Renewal Engine turns renewals from a cost centre into a savings opportunity.

### The Problem It Solves
- **Auto-renewal blindness**: You don't know which contracts are about to auto-renew until the charge hits your credit card.
- **No negotiation leverage**: Without usage data, benchmark pricing, and alternative vendor comparisons, you negotiate blind — and vendors love it.
- **Misaligned seat counts**: You're paying for 200 Salesforce seats but only 132 are active. Without data, you renew at 200 and keep overpaying.
- **Decentralised renewals**: Different departments handle their own renewals — no coordination, no leverage, no bulk discounts.
- **Time pressure**: Discovering a renewal 7 days before deadline leaves no time for negotiation. Vendors exploit the urgency.

### How It Solves It
- **Renewal Calendar**: All upcoming renewals displayed on a timeline with: vendor, contract value, renewal date, days remaining, auto-renew status.
- **KPI Cards**: Total Upcoming Renewals (count + value), Potential Savings (based on usage analysis), At-Risk Renewals (auto-renew enabled + underutilised).
- **Per-Renewal Intelligence**: For each renewal: current usage vs. contract capacity, benchmark pricing (are you above/below market?), AI-recommended action (renew/downgrade/cancel/renegotiate), estimated savings.
- **Renewal Preparation Workflow**: 90 days out → gather usage data → 60 days out → run benchmarks → 30 days out → initiate vendor negotiation → 7 days out → final decision and action.
- **Auto-Renew Toggle**: Disable auto-renewal directly from SaaSIQ (where API-supported) to prevent accidental lock-ins.

**End-to-End Flow**: 90 days before Salesforce renewal → SaaSIQ flags it → shows: 200 contracted seats, 132 active, ₹24L/yr cost, benchmark says similar companies pay ₹18L for 140 seats → IT starts vendor negotiation with this data → negotiates down to 140 seats at ₹19.2L → saves ₹4.8L/yr → disables auto-renew → renewal marked "Optimised."

---

## 13. Industry Benchmarks

### Why It's Needed
"Is our SaaS spend normal?" is a question every CIO and CFO asks but can rarely answer. Without external reference points, you're optimising in a vacuum. Industry Benchmarks provide comparative intelligence — how your SaaS portfolio stacks up against peers of similar size, industry, and stage.

### The Problem It Solves
- **No external reference point**: You know you spend ₹1.86Cr/quarter on SaaS, but is that high or low for a 500-person tech company? No way to know without benchmarks.
- **Vendor pricing opacity**: SaaS vendors use opaque, negotiated pricing. You might be paying 30% more than a similar-sized company for the same tool because you didn't benchmark.
- **Misallocated budgets**: Without category-level benchmarks, you might over-invest in collaboration tools (because everyone asks for them) while under-investing in security tools (which industry standards recommend).
- **Board-level reporting**: CIOs need to present SaaS governance metrics to the board with context. "We spend ₹1.86Cr" means nothing. "We spend 15% below industry median with 84% utilisation" tells a story.

### How It Solves It
- **Spend Per Employee Benchmark**: Your spend/employee vs. industry median. Visual indicator showing if you're above, at, or below market.
- **Category Benchmarks**: Spend by category (Dev Tools, Collaboration, Marketing, Security) compared to industry averages. Identifies over/under-investment.
- **App-Level Pricing Benchmarks**: For each app, what similar companies pay. "You pay ₹1,200/user/month for Salesforce. Industry median: ₹980/user/month. You're 22% above."
- **Utilisation Benchmarks**: Your 78% overall utilisation vs. industry average of 65% — you're doing well. Or Design at 48% vs. industry 72% — you need to improve.
- **Peer Comparison**: Anonymous aggregated data from companies of similar size (employee count), industry vertical, and geography.

**End-to-End Flow**: Before Salesforce renewal → IT opens Benchmarks → sees they're paying 22% above industry median for Salesforce → generates benchmark report → shares with procurement → procurement uses it as negotiation evidence → vendor agrees to 15% discount → benchmark dashboard updates to show you're now only 4% above median.

---

## 14. Department Cost Allocation

### Why It's Needed
SaaS spending without department-level attribution is like a company credit card with no per-team limits — everyone spends, no one is accountable. Department Cost Allocation breaks down the total SaaS bill by team, turning IT from a cost centre into a transparent, accountable operating model. This is the CFO's favourite dashboard.

### The Problem It Solves
- **No cost ownership**: When SaaS costs are a single IT line item, department heads have no incentive to optimise. "It's IT's budget, not mine."
- **Hidden cross-subsidisation**: Engineering might use 60% of the SaaS budget but only know about 3 of their 68 apps. Design might have the highest per-capita waste but never hear about it.
- **Budget planning gaps**: Finance can't allocate SaaS budgets by department because there's no historical spend data per team.
- **Waste without accountability**: When waste is found, there's no owner to act. "₹11.2L of unused Engineering licenses" — who on the Engineering leadership team is responsible?

### How It Solves It
- **Total Spend Hero Card**: One big number — total SaaS spend this quarter (₹1.86Cr) — with quarter-over-quarter trend.
- **Department Cards**: Each department gets a card showing: quarterly spend, progress bar (% of total), top 3 apps by cost with individual amounts, and waste detected (with ₹ amount).
- **Waste by Department Chart**: A bar chart ranking departments by waste amount — instantly shows where the biggest savings opportunities are.
- **Time Period Selector**: Toggle between This Quarter, Last Quarter, and This Year for trend analysis.
- **Export PDF**: One-click CFO report generation — department-level cost allocation with waste analysis, ready for board presentations.
- **Drill-Down**: Click any department card to see the full list of apps, per-app cost, per-user cost, and usage vs. spend alignment.

**End-to-End Flow**: CFO opens Department Cost Allocation → sees Engineering at ₹82.4L/quarter with ₹11.2L waste → clicks Engineering → sees AWS (₹30L), GitHub (₹12.6L), Datadog (₹8.4L) → waste is primarily from 45 unused Datadog licenses and 12 dormant AWS instances → sends report to Engineering VP → VP initiates cleanup → ₹8.2L/quarter recovered → next quarter: Engineering waste drops to ₹3.0L.

---

## 15. Settings

### Why It's Needed
Every organisation has different preferences, roles, integrations, and governance requirements. Settings provides the configuration layer that makes SaaSIQ adaptable to any company's specific needs — from visual preferences to security configurations to API integrations.

### The Problem It Solves
- **One-size-fits-all limitations**: Different users need different views. An IT admin needs full access; a department head needs only their team's data; an auditor needs read-only compliance reports.
- **Integration gaps**: SaaSIQ's value increases with every system it connects to (HRMS, SSO, finance tools). Without easy integration management, these connections remain unlinked.
- **Branding and personalisation**: Teams work better with tools that feel like their own — theme preferences, accent colours, information density.
- **Security and access control**: API keys, webhooks, and user permissions must be managed carefully to prevent unauthorised access.

### How It Solves It
- **Profile Management**: Update name, email, role, avatar. Manage personal preferences.
- **Appearance Customisation**: Light/Dark/System theme, accent colour choices (Purple, Blue, Green, Amber, Red, Pink), display density (Comfortable, Default, Compact).
- **Team Management**: Invite team members, assign roles (Admin, Viewer, Department Lead), manage permissions.
- **Integrations Hub**: Connect SaaSIQ to: HRMS (Darwinbox, BambooHR), SSO (Okta, Azure AD), Finance (Zoho Books, QuickBooks), Communication (Slack, Teams), and custom webhooks.
- **API Key Management**: Generate, name, and manage API keys for programmatic access. Copy-to-clipboard functionality.
- **Webhook Configuration**: Set up webhooks to push SaaSIQ events to external systems (e.g., send critical alerts to Slack, push spend data to your BI tool).
- **Alert Preferences**: Configure which alert types you want to receive, through which channels (in-app, email, Slack), and at what severity threshold.
- **Notification Management**: Per-category toggles for: Spend Alerts, Security Alerts, Renewal Reminders, Usage Reports, AI Recommendations.

**End-to-End Flow**: New SaaSIQ deployment → Admin opens Settings → connects Okta SSO (discovers all apps) → connects Darwinbox HRMS (syncs employee data) → invites 5 IT team members as Admins → invites 12 department heads as Viewers (limited to their dept data) → sets up Slack webhook (critical alerts go to #it-alerts channel) → configures dark mode with blue accent → system is fully operational and personalised within 30 minutes.

---

## Summary: How the 15 Dashboards Work Together

```
┌─────────────────────────────────────────────────────────────────┐
│                     DASHBOARD HOME                              │
│              (Command Centre — single pane of glass)            │
├──────────┬──────────┬──────────┬──────────┬────────────────────┤
│          │          │          │          │                      │
│  SaaS    │  Spend   │  Usage   │ Compliance│  Contract           │
│ Discovery│ Intel.   │ Analytics│  & Risk   │  Management         │
│          │          │          │          │                      │
│ "What    │ "How     │ "Are     │ "Are we  │ "What are our       │
│  apps    │  much    │  people  │  secure  │  contract terms     │
│  exist?" │  are we  │  using   │  and     │  and deadlines?"    │
│          │  paying?"│  them?"  │  legal?" │                      │
├──────────┴──────────┴──────────┴──────────┴────────────────────┤
│                                                                  │
│  Policy Engine          AI Insights         AI Copilot           │
│  "Automate the rules"   "What should       "Ask anything in      │
│                          we do next?"        plain English"       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Offboarding    Renewal     Benchmarks    Dept Cost              │
│  Console        Engine                    Allocation             │
│  "Revoke        "Optimise   "How do we    "Who's spending        │
│   ex-employee    renewals    compare?"     what?"                 │
│   access"        & save"                                         │
├──────────────────────────────────────────────────────────────────┤
│  Alerts & Notifications (pushes critical events from ALL above)  │
├──────────────────────────────────────────────────────────────────┤
│  Settings (configures everything — integrations, users, prefs)   │
└──────────────────────────────────────────────────────────────────┘
```

### The E2E Data Flow

1. **Discovery** finds all your apps (including shadow IT)
2. **Spend Intelligence** tells you how much each costs
3. **Usage Analytics** tells you if people actually use them
4. **Compliance & Risk** tells you if they're safe and legal
5. **Contract Management** tells you when you're locked in
6. **Policy Engine** automates governance rules across all of the above
7. **AI Insights** analyses all data and recommends actions
8. **AI Copilot** lets anyone query the data in natural language
9. **Offboarding Console** handles the employee-exit lifecycle
10. **Renewal Engine** optimises the renewal-negotiation lifecycle
11. **Benchmarks** provides external reference points for decisions
12. **Department Costs** allocates spend to accountable teams
13. **Alerts** pushes urgent items from every module to stakeholders
14. **Dashboard Home** ties it all together in one view
15. **Settings** configures the entire system to your org's needs

> Together, these 15 dashboards cover the complete SaaS lifecycle: **Discover → Measure → Govern → Optimise → Secure → Report**

---

## What Customers Actually Want — Design Principles

Before building any of the above, these are the non-negotiable UX principles derived from real customer conversations:

- Setup must take **< 30 minutes** (not days)
- The dashboard must show **what to do**, not just data
- Actions must be **one-click** (not navigate to vendor → find user → remove)
- Alerts must come to **Slack** (where they already are), not just the dashboard
- Reports must be **auto-generated and emailed**, not manually created

---

## The Real Feature Priority Based on What Customers Actually Want

| Priority | Feature | Why Customers Want It | Will They Pay For It? |
|----------|---------|----------------------|----------------------|
| **#1** | Complete app inventory (99% discovery) | "I need to see EVERYTHING" | **Table stakes** — they won't buy without it |
| **#2** | Waste/savings identification with proof | "Show me where I'm losing money" | **Core value** — this is why they pay |
| **#3** | Renewal alerts + negotiation data | "Stop me from auto-renewing blind" | **High** — saves ₹10-50L per renewal |
| **#4** | Automated offboarding | "Kill access when someone leaves" | **High** — security & compliance must-have |
| **#5** | License reclamation (auto) | "Don't just show waste, fix it" | **High** — this is the ROI proof |
| **#6** | Department cost allocation | "Who's spending what?" | **Medium-High** — CFOs love this |
| **#7** | App ownership tracking | "Who owns this tool?" | **Medium** — governance need |
| **#8** | Request/approval workflow | "Control who buys what" | **Medium** — prevents future waste |
| **#9** | Benchmarking vs peers | "Am I overpaying?" | **High** — negotiation power |
| **#10** | Compliance dashboard | "Prove it to the auditor" | **Medium-High** — growing with DPDP Act |
| **#11** | Integrations (Okta/GWS/Slack) | "Works with what I already have" | **Dealbreaker** — no integration = no sale |
| **#12** | Simplicity (< 30 min setup) | "I don't have time for complex tools" | **Dealbreaker** — complexity = churn |

### MVP Build Order

> **Build #1, #2, #3, #4, #5, #11, #12 first.** That's your MVP that customers will pay for. The rest comes in the next 6 months.
