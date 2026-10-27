# Open-source sales agent research — 2026-10-27

Research references (evaluate code, licenses, maintenance, security and compatibility before reuse):

| Project | URL | Candidate use | Caution |
| --- | --- | --- | --- |
| AgentSDR | https://github.com/Kandid-ai/AgentSDR | Multi-channel SDR, reply classification, tenant-aware CRM | Review provider integrations, licenses and sending policies |
| OpenOutbound | https://github.com/xyluxx/openoutbound | Agent-driven outreach engine, approvals, budgets, suppression lists, audit | Early release; sandbox first |
| OpenCloser | https://github.com/issacops/opencloser | Voice calling and sales coaching patterns, Twilio | Desktop-first; not a drop-in SaaS backend |
| AI SDR CrewAI | https://github.com/avcap/ai-sdr | Multi-agent campaigns, FastAPI/Supabase architecture | Review implementation and security |
| LiveKit Agents | https://docs.livekit.io/agents/ | Voice agent orchestration and handoffs | Integrate with existing tested calling stack |

## Proposed architecture

- **Control plane**: private multi-tenant web dashboard, verified auth, company roles, quotas and billing.
- **Orchestrator**: durable queue, idempotent tasks, scheduled jobs, retries, approvals, audit and emergency stop.
- **Agent roles**: lead research, qualification, copywriting, publishing, voice, follow-up, sales proposals, CRM recorder, analytics and supervisor.
- **Adapters**: SD Dialer (initially verified read-only), LiveKit/Twilio (staging numbers only), WebCraft, social publishing (official supported APIs), email and calendar.
- **Storage**: isolated PostgreSQL/Supabase staging with tenant RLS, encrypted credentials, event logs, consent-evidence references, suppression lists and retention.
- **Policy**: 24/7 internal analysis, but customer contact only within permitted hours, valid consent/scope and platform terms. Human approval for initial live campaigns, price/contract changes, payments and other consequential actions.
- **Commercial state machine**: discovered -> eligible -> researched -> qualified -> contacted -> interested -> proposal_draft -> proposal_approved -> sent -> accepted -> fulfilled, with terminal opted_out/invalid/failed states.
- **Success criteria**: no cross-tenant access, no duplicate sends, no unapproved real-world action, reproducible audit log, measured conversion and costs.

## Immediate engineering order

1. Inspect upstream licenses, activity and selected implementation files.
2. Build synthetic multi-tenant fixtures and tests for permissions, state transitions, deduplication and opt-outs.
3. Implement read-only adapters and a visual control plane.
4. Test outbound voice against designated staging numbers.
5. Enable supervised pilot only after security review and explicit approval.

This document is research and architecture only. No production credentials, data, deployment or calls.
