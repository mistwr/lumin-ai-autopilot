# Local simulation guide

This branch is intentionally **not deployed** and has no production integrations.

## Files
- `src/core/types.ts`: tenant and task types
- `src/core/orchestrator.ts`: pure task transitions with audit events
- `src/core/simulator.ts`: deterministic synthetic campaign creation
- `tests/*.test.ts`: Node test suites written in TypeScript

## Test setup
The repository currently has no `package.json`, lockfile or CI workflow. The TypeScript tests are **not yet executed**. Before marking them green, add a pinned toolchain and run tests in a clean isolated checkout.

## Acceptance criteria
- 3 synthetic leads create 3 pending-approval tasks and 3 audit events.
- No call, message, publication, payment or sale is executed.
- Tenant data remains scoped by company.
- Invalid campaign IDs, inactive identities and requests above 500 leads are rejected.
- Only explicit future staging integrations may enable external actions.

## Next engineering step
Add a pinned TypeScript build/test toolchain and a browser dashboard consuming only synthetic fixtures. Run CI before merging.
