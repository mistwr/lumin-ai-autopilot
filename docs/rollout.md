# Rollout gates

1. **Architecture only**: source files, no deployment or external services.
2. **Local simulation**: synthetic leads, deterministic agents and automated tests.
3. **Isolated staging**: separate database, strict RLS, non-production API keys and test phone numbers.
4. **Read-only integration**: server-verified identity, tenant isolation, no side-effecting endpoints.
5. **Supervised pilot**: verified consent evidence, revocation and do-not-call checks, quotas, logs and human approval for calls and commercial actions.
6. **Production**: explicit authorization after review of tests, security, costs and compliance.

Never point preview deployments or automated CI at production secrets or databases.
