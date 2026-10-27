import type { AgentTask, TaskState, TenantContext } from './types'

export type AuditEvent = Readonly<{
  taskId: string
  companyId: string
  from: TaskState
  to: TaskState
  actorId: string
  reason: string
}>

export type TransitionResult = Readonly<{
  task: AgentTask
  event: AuditEvent
}>

const allowed: Record<TaskState, readonly TaskState[]> = {
  draft: ['awaiting_approval', 'cancelled'],
  awaiting_approval: ['queued', 'cancelled'],
  queued: ['running', 'cancelled'],
  running: ['completed', 'failed', 'cancelled'],
  completed: [],
  failed: [],
  cancelled: [],
}

/**
 * Pure simulation only. No persistence, calls, sending or external actions.
 * Production execution must use a durable transactional queue and server-verified identity.
 */
export function transitionTask(
  context: TenantContext,
  task: AgentTask,
  to: TaskState,
  reason: string,
): TransitionResult {
  if (!context.active || !context.userId || !context.companyId) throw new Error('unauthenticated')
  if (context.companyId !== task.companyId) throw new Error('tenant_mismatch')
  if (!allowed[task.state].includes(to)) throw new Error('invalid_transition')
  if (to === 'queued' && !task.approvedBy) throw new Error('approval_missing')
  if (to === 'queued' && context.role !== 'admin' && context.role !== 'super_admin') throw new Error('approval_role_required')
  if (to === 'running') throw new Error('external_execution_disabled')
  if (context.role === 'agent' && task.createdBy !== context.userId) throw new Error('not_task_owner')
  const next: AgentTask = { ...task, state: to }
  return {
    task: next,
    event: {
      taskId: task.id,
      companyId: task.companyId,
      from: task.state,
      to,
      actorId: context.userId,
      reason: reason.slice(0, 500),
    },
  }
}

export function syntheticTask(companyId: string, createdBy: string, id: string): AgentTask {
  return { id, companyId, createdBy, agent: 'leads', description: 'Simulated lead qualification', state: 'draft' }
}
