---
name: Regulatory Scanner
description: Map applicable regulations and compliance gaps for a product or industry.
---

# Regulatory Scanner

Produce a clear map of which regulations apply to a product or business and where the
gaps are. This is research and triage — not legal advice.

## 1. Scope the subject
Capture: what the product does, the industry, the data it handles, who the customers are,
and every jurisdiction where it operates or sells. Jurisdiction drives everything.

## 2. Identify applicable regulatory domains
Work through the common domains and mark which apply:
- **Data & privacy**: GDPR, CCPA/CPRA, and sector privacy rules.
- **Sector-specific**: HIPAA (health), GLBA/PCI-DSS (finance/payments), FDA (medical
  devices/food), FCC (telecom), FTC (consumer protection).
- **Product safety & labeling**, **accessibility** (ADA, WCAG, EN 301 549),
  **employment & labor**, **environmental**, **export controls**.
- **Emerging**: AI regulation (EU AI Act), platform/content rules.

## 3. Translate each regulation into requirements
For each applicable regulation, list the concrete obligations it imposes — e.g., consent
mechanisms, breach notification timelines, record-keeping, audits, disclosures. Cite the
specific article/section so the requirement is traceable.

## 4. Assess current state and find gaps
For each requirement, mark status: Met / Partial / Not met / Unknown. A gap is any
requirement not fully met. Prioritize gaps by:
- **Penalty exposure** (fines, injunctions, criminal liability).
- **Likelihood of enforcement** and audit risk.
- **Effort to remediate**.

## 5. Output the compliance map
Deliver a table: Regulation | Jurisdiction | Key requirements | Current status | Gap |
Priority | Citation. Add a short narrative summary of the top 3 risks.

## 6. Recommend next steps
Suggest remediation actions for high-priority gaps and flag any area that needs
qualified legal counsel before action.

## Guardrails
- This is a research scan, NOT legal advice — always recommend qualified counsel for
  binding interpretation and filings.
- Regulations change; note the date checked and that requirements may have updated.
- Do not assume US-only; check every operating jurisdiction explicitly.
- Distinguish hard law (statutes/regulations) from soft guidance (best practices).
