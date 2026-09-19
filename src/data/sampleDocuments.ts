import { DocumentItem } from "../types";

export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: "sample-1",
    name: "ApexCloud_Enterprise_SLA_2025.md",
    type: "markdown",
    size: 6420,
    category: "Contract",
    createdAt: "2025-01-15T09:30:00Z",
    wordCount: 890,
    charCount: 6210,
    content: `# MASTER SERVICES AGREEMENT & ENTERPRISE SERVICE LEVEL AGREEMENT (SLA)

**Parties:** ApexCloud Technologies Inc. ("Provider") and Global Enterprise Logistics Corp. ("Client")  
**Effective Date:** January 1, 2025  
**Term:** Thirty-six (36) months with automatic annual renewal unless terminated with 90 days prior written notice.

---

### 1. Scope of Services & Cloud Availability Commitment
Provider agrees to deliver high-availability distributed cloud hosting and multi-region database replication services.
- **Service Availability Target:** Provider guarantees a Monthly Uptime Percentage of not less than **99.95%** (excluding Scheduled Maintenance Windows).
- **Scheduled Maintenance:** Notice of scheduled downtime shall be transmitted at least five (5) business days in advance and will only occur between 01:00 UTC and 04:00 UTC on Sunday mornings.

### 2. Service Credits for Outages
In the event Monthly Uptime drops below the guaranteed threshold, Client is entitled to Service Credits as follows:
- **99.0% to 99.94% Uptime:** 10% credit against monthly invoice.
- **95.0% to 98.99% Uptime:** 25% credit against monthly invoice.
- **Below 95.0% Uptime:** 50% credit against monthly invoice and immediate right of contract termination without penalty.
*Condition:* Client must file written claim within thirty (30) days of the month in which the SLA deficit occurred.

### 3. Data Protection, Security & Compliance
- **Encryption Standards:** All data in transit shall use TLS 1.3 encryption. Data at rest shall be protected using AES-256 with client-managed key option (KMS).
- **Security Incident Notification:** Provider must report any confirmed or suspected unauthorized access to Client Confidential Data within **twenty-four (24) hours** of identification.
- **Audit Rights:** Client reserves the right to conduct an independent third-party SOC 2 Type II audit inspection once per calendar year with thirty (30) days advance notice.

### 4. Fees, Billing & Payment Terms
- Annual baseline subscription fee is **$240,000 USD**, invoiced quarterly in advance ($60,000/quarter).
- Payment terms are Net-30 days from date of electronic invoice.
- Late payments accrue interest at 1.5% per month or the legal statutory maximum.

### 5. Limitation of Liability & Indemnification
- **Aggregate Liability Cap:** Except for breaches of Section 3 (Data Protection) and gross negligence, each party's maximum cumulative liability under this Agreement shall not exceed the total fees paid by Client in the preceding twelve (12) months.
- **Indemnification:** Provider indemnifies and holds harmless Client against any third-party intellectual property patent or copyright infringement claims arising from Provider's platform.

### 6. Dispute Resolution & Governing Law
This Agreement shall be governed in accordance with the laws of the State of Delaware, without regard to conflict of law principles. Any dispute arising under this Agreement shall be resolved through binding arbitration administered by JAMS in Wilmington, Delaware.
`,
    textContent: `# MASTER SERVICES AGREEMENT & ENTERPRISE SERVICE LEVEL AGREEMENT (SLA)

**Parties:** ApexCloud Technologies Inc. ("Provider") and Global Enterprise Logistics Corp. ("Client")  
**Effective Date:** January 1, 2025  
**Term:** Thirty-six (36) months with automatic annual renewal unless terminated with 90 days prior written notice.

### 1. Scope of Services & Cloud Availability Commitment
Provider agrees to deliver high-availability distributed cloud hosting and multi-region database replication services.
- Service Availability Target: Provider guarantees a Monthly Uptime Percentage of not less than 99.95% (excluding Scheduled Maintenance Windows).
- Scheduled Maintenance: Notice of scheduled downtime shall be transmitted at least five (5) business days in advance and will only occur between 01:00 UTC and 04:00 UTC on Sunday mornings.

### 2. Service Credits for Outages
- 99.0% to 99.94% Uptime: 10% credit against monthly invoice.
- 95.0% to 98.99% Uptime: 25% credit against monthly invoice.
- Below 95.0% Uptime: 50% credit against monthly invoice and immediate right of contract termination without penalty.
*Condition:* Client must file written claim within thirty (30) days of the month in which the SLA deficit occurred.

### 3. Data Protection, Security & Compliance
- Encryption Standards: All data in transit shall use TLS 1.3 encryption. Data at rest shall be protected using AES-256 with client-managed key option (KMS).
- Security Incident Notification: Provider must report any confirmed or suspected unauthorized access to Client Confidential Data within twenty-four (24) hours of identification.
- Audit Rights: Client reserves the right to conduct an independent third-party SOC 2 Type II audit inspection once per calendar year with thirty (30) days advance notice.

### 4. Fees, Billing & Payment Terms
- Annual baseline subscription fee is $240,000 USD, invoiced quarterly in advance ($60,000/quarter).
- Payment terms are Net-30 days from date of electronic invoice.

### 5. Limitation of Liability & Indemnification
- Aggregate Liability Cap: Preceding twelve (12) months fees.
`,
    suggestedQuestions: [
      "What is the required uptime SLA and what are the credit penalties?",
      "How quickly must security breaches or unauthorized access be reported?",
      "What is the limitation of liability cap and what exceptions apply?",
      "What are the renewal and termination conditions?"
    ]
  },
  {
    id: "sample-2",
    name: "NovaHealth_Circadian_Cognition_Study.txt",
    type: "text",
    size: 4980,
    category: "Research",
    createdAt: "2024-11-20T14:15:00Z",
    wordCount: 710,
    charCount: 4890,
    content: `CLINICAL STUDY REPORT: CIRCL-2024-B
Title: Circadian Rhythm Entrainment and Executive Function Recovery in Remote Knowledge Workers
Principal Investigator: Dr. Elena Vance, MD, PhD, Institute for Cognitive Neurobiology
Study Period: February 2024 - October 2024 | Cohort Size: n = 428 participants (Double-blind RCT)

ABSTRACT & BACKGROUND:
Prolonged screen exposure, irregular work shifts, and lack of natural blue-wavelength photic stimulation have been correlated with chronic circadian misalignment among knowledge workers. This randomized controlled trial investigated the impact of targeted 480nm morning optical entrainment paired with digital sunset protocol (spectral filtering after 20:00) on working memory, cortisol awakening response (CAR), and sustained attention.

METHODOLOGY:
- Group A (Active Protocol, n=214): 30-minute exposure to 10,000 lux (480nm enriched light) within 45 minutes of waking, coupled with blue-attenuating software filters (reducing emissions <500nm by 92% post 20:00).
- Group B (Control Protocol, n=214): Standard 300 lux ambient illumination with sham amber lens tinting.
- Primary Endpoints: N-back working memory latency (ms), salivary cortisol awakening response slope, and subjective sleep latency via actigraphy.

KEY RESULTS & STATISTICAL FINDINGS:
1. Working Memory Latency: Group A exhibited a 22.4% reduction in reaction time on 2-back tasks compared to baseline (p < 0.001, 95% CI [18.2, 26.6]), whereas Group B showed negligible variance (+1.2%, p = 0.42).
2. Sleep Latency & Sleep Efficiency: Sleep onset latency decreased from an average of 46.2 minutes to 17.8 minutes in Group A. Sleep efficiency measured via polysomnography increased from 78.4% to 89.2%.
3. Cortisol Awakening Response: Morning salivary cortisol surge peaked at 32 minutes post-awakening in the active group, representing a healthy neuroendocrine entrainment profile versus the blunted, delayed peak (65 min) in the control group.
4. Adverse Effects: Mild headache reported in 3.2% of active cohort during days 1-3, resolving spontaneously without intervention. No severe adverse events documented.

CONCLUSION & RECOMMENDATIONS:
Targeted morning optical entrainment combined with evening blue-light restriction yields clinically significant improvements in cognitive executive performance and sleep architecture. The protocol is cost-effective, non-pharmacological, and easily deployable in modern hybrid work environments.
`,
    textContent: `CLINICAL STUDY REPORT: CIRCL-2024-B
Title: Circadian Rhythm Entrainment and Executive Function Recovery in Remote Knowledge Workers
Principal Investigator: Dr. Elena Vance, MD, PhD, Institute for Cognitive Neurobiology
Study Period: February 2024 - October 2024 | Cohort Size: n = 428 participants (Double-blind RCT)

ABSTRACT & BACKGROUND:
Prolonged screen exposure, irregular work shifts, and lack of natural blue-wavelength photic stimulation have been correlated with chronic circadian misalignment among knowledge workers. This randomized controlled trial investigated the impact of targeted 480nm morning optical entrainment paired with digital sunset protocol (spectral filtering after 20:00) on working memory, cortisol awakening response (CAR), and sustained attention.

KEY FINDINGS:
1. Working Memory Latency: Group A exhibited a 22.4% reduction in reaction time on 2-back tasks compared to baseline.
2. Sleep Latency & Sleep Efficiency: Sleep onset latency decreased from 46.2 minutes to 17.8 minutes. Sleep efficiency increased to 89.2%.
3. Cortisol Awakening Response: Healthy morning salivary cortisol surge peaked at 32 minutes post-awakening.
`,
    suggestedQuestions: [
      "What were the primary endpoints and sample size of the study?",
      "How did Group A's working memory reaction time compare to the control group?",
      "What were the reported adverse side effects and their resolution?",
      "What specific light wavelengths and exposure times were tested?"
    ]
  },
  {
    id: "sample-3",
    name: "ApexCloud_Q3_2024_Financial_Report.md",
    type: "markdown",
    size: 5120,
    category: "Financial",
    createdAt: "2024-10-24T18:00:00Z",
    wordCount: 780,
    charCount: 5040,
    content: `# APEXCLOUD TECHNOLOGIES INC. — Q3 2024 FINANCIAL EARNINGS RELEASE

**Date:** October 24, 2024  
**Reporting Period:** Three Months Ended September 30, 2024  
**Ticker:** NASDAQ: APXC

---

## 1. Executive Highlights & Financial Summary
ApexCloud delivered exceptional operational execution in Q3 2024, driven by enterprise AI infrastructure adoption and robust expansion across international cloud regions.

| Financial Metric | Q3 2024 | Q3 2023 | YoY Change (%) |
| :--- | :--- | :--- | :--- |
| **Total Revenue** | **$184.6M** | $142.1M | **+29.9%** |
| **Gross Profit Margin** | **72.4%** | 68.1% | +430 bps |
| **Operating Income** | **$38.2M** | $21.5M | **+77.7%** |
| **Net Income (GAAP)** | **$31.4M** | $16.8M | **+86.9%** |
| **Diluted EPS** | **$0.48** | $0.27 | **+77.8%** |
| **Free Cash Flow (FCF)** | **$52.1M** | $34.0M | **+53.2%** |

## 2. Business Segment Breakdown
- **Enterprise Cloud Platform:** Revenue of $118.2M (+34% YoY), accounting for 64% of total revenue. Net retention rate (NRR) reached 124%.
- **AI Compute & Vector Inference Services:** Revenue of $42.8M (+58% YoY), propelled by enterprise LLM deployments in banking and healthcare.
- **Developer Tools & Managed Services:** Revenue of $23.6M (+6% YoY).

## 3. Balance Sheet & Capital Position
- Total Cash, Cash Equivalents, and Short-Term Treasury Investments totaled **$482.5M** as of September 30, 2024.
- Zero outstanding long-term debt; pristine revolving credit facility of $150M remains entirely undrawn.
- Share Buyback Program: Repurchased 1.2M shares for $28.0M during Q3 under the current authorization.

## 4. Operational Milestones
- Surpassed **1,850 Enterprise Customers** with Annual Recurring Revenue (ARR) exceeding $100,000, up from 1,410 in Q3 2023.
- Expanded sovereign cloud footprints into Frankfurt (Germany) and Tokyo (Japan) ensuring regional compliance with strict data localization laws.

## 5. Forward Guidance: Q4 & Full Year 2024
- **Q4 2024 Revenue:** Anticipated range of $196M to $201M.
- **FY 2024 Total Revenue:** Raised guidance to $715M – $720M (representing ~28% annual growth).
- **Capex:** Projected at $85M - $90M for FY 2024, focused on high-efficiency liquid-cooled GPU cluster buildouts.
`,
    textContent: `# APEXCLOUD TECHNOLOGIES INC. — Q3 2024 FINANCIAL EARNINGS RELEASE

Total Revenue: $184.6M (+29.9% YoY)
Gross Margin: 72.4%
Operating Income: $38.2M (+77.7% YoY)
Net Income: $31.4M
Diluted EPS: $0.48
Free Cash Flow: $52.1M

Segment Breakdown:
- Enterprise Cloud Platform: $118.2M (+34% YoY)
- AI Compute & Vector Services: $42.8M (+58% YoY)
- Cash & Short-Term Investments: $482.5M
`,
    suggestedQuestions: [
      "What was the total Q3 revenue and year-over-year growth percentage?",
      "Which business segment showed the highest growth rate and what drove it?",
      "What is the company's total cash position and debt status?",
      "What is the raised full-year 2024 revenue guidance?"
    ]
  },
  {
    id: "sample-4",
    name: "Corporate_Cybersecurity_Policy_v4.2.md",
    type: "markdown",
    size: 4200,
    category: "Policy",
    createdAt: "2024-12-01T11:00:00Z",
    wordCount: 620,
    charCount: 4120,
    content: `# GLOBAL INFORMATION SECURITY & REMOTE WORK ACCEPTABLE USE POLICY

**Document Control:** POL-SEC-2025-V4.2  
**Applies to:** All Full-Time Employees, Contractors, and Third-Party Consultants  
**Effective Date:** January 1, 2025 | Security Classification: Internal Confidential

---

### Section 1: Endpoint Security & Device Management
1. **Approved Hardware:** All corporate data, email, and internal repositories may only be accessed via company-provisioned devices enrolled in Central Mobile Device Management (MDM). Personal computers (BYOD) are strictly prohibited from storing customer data or source code.
2. **Full Disk Encryption:** FileVault (macOS) or BitLocker (Windows) must remain enabled at all times with recovery keys escrowed in corporate IT vault.
3. **Screen Lock:** Devices must be configured to automatically lock after three (3) minutes of inactivity.

### Section 2: Identity, Passwords & Multi-Factor Authentication (MFA)
1. **MFA Requirement:** Hardware security keys (FIDO2 WebAuthn / YubiKey) or approved authenticator push notifications are mandatory for all systems. SMS-based 2FA is explicitly forbidden due to SIM-swapping vulnerabilities.
2. **Password Managers:** All personnel must use the enterprise-licensed password vault. Master passwords must exceed sixteen (16) characters with mixed character sets.

### Section 3: AI Tooling & Large Language Model Usage
1. **Confidentiality Classification:** Employees are strictly prohibited from inputting non-public customer data, proprietary algorithms, financial balances, or personally identifiable information (PII) into public, unvetted AI tools or third-party web scrapers.
2. **Approved Enterprise AI:** Only AI tools deployed within corporate VPC tenant accounts that guarantee zero training on customer queries are permitted.

### Section 4: Incident Response & Whistleblower Protections
1. **Mandatory Reporting:** Any lost or stolen device, suspicious phishing attempt, or abnormal token usage must be reported to **security-soc@company.internal** within **two (2) hours**.
2. **No Retaliation:** Employees reporting potential breaches in good faith are protected from disciplinary retaliation under corporate policy.
`,
    textContent: `# GLOBAL INFORMATION SECURITY & REMOTE WORK ACCEPTABLE USE POLICY
Section 1: Endpoint Security & Device Management - MDM required, full disk encryption, 3-min screen lock.
Section 2: Identity & MFA - Hardware security keys mandatory, SMS 2FA forbidden.
Section 3: AI Tooling & LLM Usage - Zero customer data or PII in unvetted AI tools.
Section 4: Incident Response - Report suspicious events within 2 hours.
`,
    suggestedQuestions: [
      "What are the specific requirements for Multi-Factor Authentication (MFA)?",
      "What are the rules regarding the use of AI tools and customer data?",
      "How quickly must a lost device or security incident be reported?",
      "Are personal computers (BYOD) permitted for storing client data?"
    ]
  }
];
