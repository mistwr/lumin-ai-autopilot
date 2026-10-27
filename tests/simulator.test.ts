import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { simulateCampaign } from '../src/core/simulator'
import type { TenantContext } from '../src/core/types'

const context: TenantContext = { userId: 'owner-a', companyId: 'tenant-a', role: 'admin', active: true }

test('creates deterministic synthetic tasks, not outbound actions', () => {
  const result = simulateCampaign(context, 'campaign1', 3)
  assert.deepEqual(result.tasks.map(t => t.id), ['campaign1-lead-1', 'campaign1-lead-2', 'campaign1-lead-3'])
  assert.equal(result.metrics.awaitingApproval, 3)
  assert.equal(result.metrics.callsMade, 0)
  assert.equal(result.metrics.messagesSent, 0)
  assert.equal(result.metrics.salesClosed, 0)
  assert.ok(result.events.every(e => e.companyId === 'tenant-a'))
})

test('separates task tenant identities', () => {
  const other = simulateCampaign({ ...context, companyId: 'tenant-b' }, 'campaign1', 1)
  assert.equal(other.tasks[0].companyId, 'tenant-b')
})

test('rejects invalid and excessive campaigns', () => {
  assert.throws(() => simulateCampaign(context, 'campaign1', 501), /invalid_lead_count/)
  assert.throws(() => simulateCampaign(context, '../bad', 1), /invalid_campaign_id/)
  assert.throws(() => simulateCampaign(context, 'campaign1', 0), /invalid_lead_count/)
})

test('rejects inactive identities', () => {
  assert.throws(() => simulateCampaign({ ...context, active: false }, 'campaign1', 1), /unauthenticated/)
})
