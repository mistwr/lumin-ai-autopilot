# LUMIN Voice Engine — isolated lab

Status: design and integration checklist only; no calls, deployments or paid services.

## Verified upstream
- https://github.com/aplisay/llm-agent (MIT; Node 22+, PostgreSQL; LiveKit/Pipecat/Jambonz runtimes)
- Upstream claims >1,000 concurrent calls per agent, not independently benchmarked.
- Upstream quick start requires provider credentials and a runtime.

## First safe milestone
1. Run Aplisay locally with synthetic data and an isolated PostgreSQL database.
2. Configure browser WebRTC test first, no PSTN dialing.
3. Compare Portuguese (Portugal) voice latency, recognition accuracy, interruption and failure recovery.
4. Implement a mock SD Dialer adapter and log outcomes, never copy production leads.
5. Enforce tenant isolation, opt-in evidence, do-not-call checks, cost ceilings, concurrency ceilings, and human handoff before real calls.

## Acceptance criteria
- Five independent simulated conversations without crossed transcripts.
- Metrics: p50/p95 first-audio latency, task completion, cost/minute and error rate.
- No production modifications, no outbound calling, no charges.

## Later (requires separate approval)
Test calls to explicitly authorized numbers; production rollout only after privacy/security and legal review.
