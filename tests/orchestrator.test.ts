import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { syntheticTask, transitionTask } from '../src/core/orchestrator'
import type { TenantContext } from '../src/core/types'

const admin: TenantContext = { userId: 'admin-1', companyId: 'company-a', role: 'admin', active: true }

test('creates a task in draft without external effects', () => {
  assert.equal(syntheticTask('company-a', 'admin-1', 't1').state, 'draft')
})

test('allows same-tenant draft to approval queue and emits audit event', () => {
  const task = syntheticTask('company-a', 'admin-1', 't1')
  const result = transitionTask(admin, task, 'awaiting_approval', 'review')
  assert.equal(result.task.state, 'awaiting_approval')
  assert.equal(result.event.companyId, 'company-a')
  assert.equal(task.state, 'draft')
})

test('rejects cross-tenant access', () => {
  const task = syntheticTask('company-b', 'admin-1', 't1')
  assert.throws(() => transitionTask(admin, task, 'cancelled', 'stop'), /tenant_mismatch/)
})

test('rejects invalid transitions', () => {
  const task = syntheticTask('company-a', 'admin-1', 't1')
  assert.throws(() => transitionTask(admin, task, 'completed', 'skip'), /invalid_transition/)
})

test('rejects running even from queued', () => {
  const task = { ...syntheticTask('company-a', 'admin-1', 't1'), state: 'queued' as const }
  assert.throws(() => transitionTask(admin, task, 'running', 'execute'), /external_execution_disabled/)
})

test('requires approval to queue', () => {
  const task = { ...syntheticTask('company-a', 'admin-1', 't1'), state: 'awaiting_approval' as const }
  assert.throws(() => transitionTask(admin, task, 'queued', 'queue'), /approval_missing/)
})

test('allows approved task to queue with admin role', () => {
  const task = { ...syntheticTask('company-a', 'admin-1', 't1'), state: 'awaiting_approval' as const, approvedBy: 'admin-1' }
  assert.equal(transitionTask(admin, task, 'queued', 'queue').task.state, 'queued')
})

test('rejects inactive identity', () => {
  const task = syntheticTask('company-a', 'admin-1', 't1')
  assert.throws(() => transitionTask({ ...admin, active: false }, task, 'cancelled', 'stop'), /unauthenticated/)
})
