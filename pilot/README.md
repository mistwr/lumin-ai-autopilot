# Commercial pilot — offline and synthetic
Requires Node.js 20+; no npm install or paid APIs.
Run: `node pilot/run.mjs`
Test: `node --test pilot/engine.test.mjs`
Uses only fictional leads. Qualification is a deterministic demonstration, not a real offer or sales prediction.
No Twilio, LiveKit, Supabase, SD Dialer, outbound contact, contracts, credentials, or production endpoints.
Status: qualified (human review), follow_up (consent-gated later), not_interested (close).
Before any real deployment: authenticated tenant context, persistent audit log, consent proof, suppression lists, legal review, verified integration adapters and human approval.
