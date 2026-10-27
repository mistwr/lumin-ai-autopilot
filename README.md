# Lumin AI Autopilot

Independent, private multi-tenant AI sales orchestration platform.

## Status
Architecture scaffold only. **No production integration, no outbound calls, no database access and no deployment.**

## Principles
- Existing SD Dialer, Lumin AI and WebCraft production systems remain unchanged.
- Tenant isolation enforced at API, database RLS and orchestration layers.
- Existing signed contact/transcription consent is linked and checked for scope, revocation and evidence before live calling.
- No copying of production customer data, secrets or credentials into development.
- Default-deny permissions, audit trails, cost limits, rate limits and human approval for sensitive actions.
- Start with synthetic data and supervised pilot before autonomous campaigns.

## Planned modules
- `src/core`: identity, tenants, authorization and task state machine.
- `src/agents`: planning, voice, lead qualification, follow-up and reporting.
- `src/adapters`: read-only SD Dialer and Lumin AI connectors first.
- `docs`: architecture, security review and rollout.

## Roadmap
1. Implement pure orchestration state machine and tests.
2. Add isolated multi-tenant database with RLS and verified server auth.
3. Build superadmin/company dashboards and read-only adapters.
4. Test Twilio/LiveKit with synthetic leads and explicit test numbers.
5. Introduce supervised live actions after security and consent verification.

**Production is intentionally not connected.**
