# Architecture

```text
Superadmin / Company dashboard
            |
Authenticated API + tenant-scoped authorization
            |
Orchestrator (task state machine + audit log)
            |
  +---------+----------+----------+
  |         |          |          |
Lead agent  Voice agent  Follow-up agent
  |         |          |          |
Read-only SD Dialer adapter / isolated test doubles
            |
Isolated database (future; RLS by company_id)
```

### Isolation
Every request carries a server-verified identity and company context. Every resource must match the tenant. No global service-role query is exposed to the browser or AI tools. A platform superadmin uses explicitly audited cross-tenant workflows rather than bypassing isolation implicitly.

### Execution controls
`draft -> awaiting_approval -> queued -> running -> completed | failed | cancelled`.
No external action is enabled in this scaffold. Outbound calling, customer updates, offers and contract sending require separate permission gates and policy checks.

### Integrations
Reuse existing SD Dialer/LiveKit/Twilio APIs through explicit adapters; never copy production secrets or assume GET requests are side-effect-free. Verify endpoint behavior before any read-only integration.
