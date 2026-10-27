import { syntheticTask, transitionTask, type AuditEvent } from './orchestrator'
import type { AgentTask, TenantContext } from './types'

export type SimulatedOutcome = Readonly<{
  tasks: readonly AgentTask[]
  events: readonly AuditEvent[]
  metrics: Readonly<{ created: number; awaitingApproval: number; queued: number; callsMade: 0; messagesSent: 0; salesClosed: 0 }>
}>

/**
 * A deterministic, in-memory demo. No CRM data, network, calls or publications.
 * All tasks remain awaiting approval; simulation never executes external actions.
 */
export function simulateCampaign(
  context: TenantContext,
  campaignId: string,
  leadCount: number,
): SimulatedOutcome {
  if (!context.active || !context.userId || !context.companyId) throw new Error('unauthenticated')
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(campaignId)) throw new Error('invalid_campaign_id')
  if (!Number.isSafeInteger(leadCount) || leadCount < 1 || leadCount > 500) throw new Error('invalid_lead_count')

  const tasks: AgentTask[] = []
  const events: AuditEvent[] = []
  for (let i = 0; i < leadCount; i++) {
    const draft = syntheticTask(context.companyId, context.userId, campaignId + '-lead-' + (i + 1))
    const result = transitionTask(context, draft, 'awaiting_approval', 'synthetic lead qualification')
    tasks.push(result.task)
    events.push(result.event)
  }
  return {
    tasks,
    events,
    metrics: { created: leadCount, awaitingApproval: leadCount, queued: 0, callsMade: 0, messagesSent: 0, salesClosed: 0 },
  }
}
