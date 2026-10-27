export type TaskState = 'draft' | 'awaiting_approval' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

export type AgentKind = 'planner' | 'leads' | 'voice' | 'followup' | 'reporting'

export interface TenantContext {
  userId: string
  companyId: string
  role: 'super_admin' | 'admin' | 'supervisor' | 'agent'
  active: boolean
}

export interface AgentTask {
  id: string
  companyId: string
  agent: AgentKind
  state: TaskState
  createdBy: string
  approvedBy?: string
  description: string
}

export function canReadTask(context: TenantContext, task: AgentTask): boolean {
  return Boolean(context.active && context.userId && context.companyId && task.companyId === context.companyId && (context.role !== 'agent' || task.createdBy === context.userId))
}

export function canExecuteTask(_context: TenantContext, _task: AgentTask): boolean {
  // Explicitly disabled until isolated testing, policy review and approvals.
  return false
}
