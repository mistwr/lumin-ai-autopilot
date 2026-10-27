# LUMIN Commerce CEO — Research-only pilot

This is an isolated, zero-spend design for the LUMIN AI Autopilot repository.

## Guardrails
- No production modifications or connectors.
- No ad spend, purchases, supplier orders, checkout, or publication.
- No secrets or personal customer data.
- Every external action must pass a policy gate; default deny.
- Research uses publicly available data, source URL, capture date, and evidence quality.
- Claims about sales volume or margin are estimates until independently verified.

## Agents
1. CEO: schedules and prioritizes tasks, never bypasses guardrails.
2. Scout: collects product demand signals and source provenance.
3. Competitor: checks competing offers and public advertising.
4. Sourcing: researches suppliers, shipping and EU compliance.
5. Finance: calculates unit economics and sensitivity.
6. Creative: drafts product pages and creative concepts offline.
7. Analyst: ranks candidates, records uncertainty and prepares decisions.
8. Guard: enforces spend=0, publication=false, production=false.

## First cycle
- Collect 30 candidate product ideas from documented public sources.
- Deduplicate and shortlist 10 based on evidence and constraints.
- For each shortlisted product find up to 3 supplier candidates.
- Assess delivered price to Portugal, shipping time, returns, product compliance, market competition, and ad angles.
- Shortlist 3 with a transparent score and documented unknowns.
- Deliver a decision report for human review; do not launch.

## Scoring (0–100)
Demand evidence 25; gross margin potential 25; shipping reliability 15; competitive differentiation 15; compliance and returns risk 10; creative potential 10.
Missing evidence is scored as unknown, not zero, and flagged.

## Proposed records
ProductCandidate(id, title, category, evidence[], status)
Evidence(url, observed_at, claim, confidence)
SupplierCandidate(product_id, url, unit_price, shipping_cost, eta, returns, compliance_status)
UnitEconomics(product_id, price, cogs, shipping, fees, returns_reserve, target_cac)
Decision(product_id, score, uncertainties[], rationale, approved_by)

## Next technical steps
Read all repository files and tests before implementation. Add a deterministic policy engine, mock adapters, fixtures, tests, then optional real read-only research connectors. Never reuse production credentials.
