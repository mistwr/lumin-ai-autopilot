# Aplisay integration gate

The voice adapter currently uses synthetic Uint8Array chunks; **no microphone, playback, STT, TTS, SIP or live calls** are connected.

## Upstream
https://github.com/aplisay/llm-agent
Upstream README describes Node 22+, PostgreSQL, separate runtime workers and provider credentials. Claims of >1,000 concurrent calls are not independently verified.

## Integration sequence
1. Inspect upstream running guide, licensing, dependencies and security before vendoring or deployment.
2. Run isolated PostgreSQL and Aplisay API locally with test credentials, no production secrets.
3. Use browser WebRTC only with explicitly authorized test participants.
4. Implement a real adapter using the upstream documented runtime/API, not guessed endpoints.
5. Benchmark p50/p95 latency, PT-PT speech accuracy, interruptions, cross-session isolation, resource consumption and cost.
6. Require approval before external phone calls or paid provider use.

No Railway, no production changes.
